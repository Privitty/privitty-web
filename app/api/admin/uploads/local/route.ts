import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/app/lib/auth";
import path from "path";
import fs from "fs/promises";
import prisma from "@/app/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdminSession();

    const searchParams = req.nextUrl.searchParams;
    const fileKey = searchParams.get("key");

    if (!fileKey) {
      return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
    }

    // In serverless hosting (e.g. AWS Amplify Lambda, Vercel), local filesystem is read-only
    const isServerless = Boolean(
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.VERCEL ||
      (process.env.NODE_ENV === "production" && !process.env.ENABLE_LOCAL_STORAGE_FALLBACK)
    );

    if (isServerless) {
      return NextResponse.json(
        {
          error:
            "Local file upload is not supported in production serverless environments (AWS Amplify filesystem is read-only). Please configure S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY in AWS Amplify Console (App settings → Environment variables).",
        },
        { status: 500 }
      );
    }

    // Clean key preventing directory traversal
    const safeKey = fileKey.replace(/\.\./g, "").replace(/^\/+/, "");
    const localFilePath = path.join(process.cwd(), "public", "uploads", safeKey);

    try {
      await fs.mkdir(path.dirname(localFilePath), { recursive: true });
    } catch (mkdirErr: unknown) {
      if (
        mkdirErr &&
        typeof mkdirErr === "object" &&
        "code" in mkdirErr &&
        mkdirErr.code === "EROFS"
      ) {
        return NextResponse.json(
          {
            error:
              "Read-only filesystem: AWS Amplify Lambda functions cannot store files locally. Configure S3_BUCKET and AWS credentials in Amplify Console to enable S3 storage.",
          },
          { status: 500 }
        );
      }
      throw mkdirErr;
    }

    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(localFilePath, buffer);

    const contentType = req.headers.get("content-type") || "application/octet-stream";
    const filename = path.basename(safeKey);

    // Register asset in MediaAsset table
    await prisma.mediaAsset.upsert({
      where: { key: safeKey },
      update: {
        size: buffer.length,
        mimeType: contentType,
        url: `/uploads/${safeKey}`,
      },
      create: {
        filename,
        key: safeKey,
        mimeType: contentType,
        size: buffer.length,
        url: `/uploads/${safeKey}`,
        category: safeKey.endsWith(".pdf") ? "PDF" : "IMAGE",
        uploadedBy: admin.email,
      },
    });

    return NextResponse.json({
      success: true,
      fileKey: safeKey,
      url: `/uploads/${safeKey}`,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      err.code === "EROFS"
    ) {
      return NextResponse.json(
        {
          error:
            "Read-only filesystem: AWS Amplify Lambda functions cannot store files locally. Configure S3_BUCKET and AWS credentials in Amplify Console to enable S3 storage.",
        },
        { status: 500 }
      );
    }

    console.error("Local upload error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to save upload to local storage",
      },
      { status: 500 }
    );
  }
}
