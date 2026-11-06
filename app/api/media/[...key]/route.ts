import { NextRequest, NextResponse } from "next/server";
import { getS3Client, getStorageConfig } from "@/app/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import fs from "fs";

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeMap: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
  };
  return mimeMap[ext] || "application/octet-stream";
}

function serveLocalFile(filePath: string): NextResponse {
  const contentType = getMimeType(filePath);
  const fileStream = fs.createReadStream(filePath);
  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("Access-Control-Allow-Origin", "*");

  // @ts-expect-error - ReadableStream type compatibility with Next.js Response
  return new NextResponse(fileStream, { headers });
}

/**
 * Universal Media Proxy Route
 * GET /api/media/[...key]
 *
 * Securely streams media objects stored in S3 or local disk storage.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await params;
    if (!key || key.length === 0) {
      return new NextResponse("File key is required", { status: 400 });
    }

    // Clean key preventing directory traversal
    const fileKey = key.join("/");
    const safeKey = fileKey.replace(/\.\./g, "").replace(/^\/+/, "");

    const config = getStorageConfig();

    // 1. Check local uploads or public directory first if local storage fallback is enabled
    const localUploadPath = path.join(process.cwd(), "public", "uploads", safeKey);
    const localPublicPath = path.join(process.cwd(), "public", safeKey);

    if (config.isLocalStorageFallback) {
      if (fs.existsSync(localUploadPath)) {
        return serveLocalFile(localUploadPath);
      }
      if (fs.existsSync(localPublicPath)) {
        return serveLocalFile(localPublicPath);
      }
    }

    // 2. S3 Storage
    if (config.bucketName) {
      try {
        const client = getS3Client();
        const command = new GetObjectCommand({
          Bucket: config.bucketName,
          Key: safeKey,
        });

        const s3Response = await client.send(command);

        if (s3Response.Body) {
          const headers = new Headers();
          const contentType = s3Response.ContentType || getMimeType(safeKey);
          headers.set("Content-Type", contentType);

          if (s3Response.ContentLength !== undefined) {
            headers.set("Content-Length", s3Response.ContentLength.toString());
          }
          if (s3Response.ETag) {
            headers.set("ETag", s3Response.ETag);
          }
          headers.set("Cache-Control", "public, max-age=31536000, immutable");
          headers.set("Access-Control-Allow-Origin", "*");

          // Convert SdkStream to standard Web ReadableStream
          const stream = s3Response.Body.transformToWebStream();

          return new Response(stream, {
            status: 200,
            headers,
          });
        }
      } catch (s3Err: unknown) {
        // If S3 fails or file is not found, check if local disk has a matching file as fallback
        if (fs.existsSync(localUploadPath)) {
          return serveLocalFile(localUploadPath);
        }
        if (fs.existsSync(localPublicPath)) {
          return serveLocalFile(localPublicPath);
        }

        if (s3Err && typeof s3Err === "object") {
          const name = "name" in s3Err ? (s3Err.name as string) : "";
          if (name === "NoSuchKey" || name === "NotFound") {
            return new NextResponse("Media asset not found in storage", { status: 404 });
          }
          if (
            name === "AccessDenied" ||
            ("$metadata" in s3Err &&
              (s3Err as { $metadata?: { httpStatusCode?: number } }).$metadata
                ?.httpStatusCode === 403)
          ) {
            return new NextResponse(
              "Access denied by S3. Ensure IAM credentials have 's3:GetObject' permission.",
              { status: 403 }
            );
          }
        }

        console.error(`S3 get error for key ${safeKey}:`, s3Err);
        return new NextResponse("Failed to load media asset from S3", { status: 502 });
      }
    }

    // 3. If no bucket configured, check if local file exists before failing
    if (fs.existsSync(localUploadPath)) {
      return serveLocalFile(localUploadPath);
    }
    if (fs.existsSync(localPublicPath)) {
      return serveLocalFile(localPublicPath);
    }

    return new NextResponse(
      "Media asset not found and storage bucket is not configured.",
      { status: 404 }
    );
  } catch (err: unknown) {
    console.error("Media preview error:", err);
    return new NextResponse("Failed to load media asset", { status: 500 });
  }
}
