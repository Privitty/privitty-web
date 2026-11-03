import { NextRequest, NextResponse } from "next/server";
import { getS3Client, getStorageConfig } from "@/app/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import fs from "fs";

/**
 * Universal Media Proxy Route
 * GET /api/media/[...key]
 *
 * Securely streams media objects stored in S3 using server-side IAM credentials
 * (arn:aws:iam::860849023058:user/privitty-s3-uploader).
 *
 * Benefits:
 * 1. Works with 100% private S3 buckets without needing public bucket access.
 * 2. Works without exposing S3 bucket names or IAM secrets to client bundles.
 * 3. Never fails CORS or Next.js remotePatterns restrictions because it is same-origin.
 * 4. Includes long-lived immutable cache headers for peak performance.
 * 5. Falls back to local disk storage automatically in local development.
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

    // 1. Local fallback storage check
    if (config.isLocalStorageFallback) {
      const localFilePath = path.join(process.cwd(), "public", "uploads", safeKey);
      if (fs.existsSync(localFilePath)) {
        const ext = path.extname(safeKey).toLowerCase();
        const mimeMap: Record<string, string> = {
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".webp": "image/webp",
          ".svg": "image/svg+xml",
          ".pdf": "application/pdf",
        };
        const contentType = mimeMap[ext] || "application/octet-stream";
        const fileStream = fs.createReadStream(localFilePath);
        const headers = new Headers();
        headers.set("Content-Type", contentType);
        headers.set("Cache-Control", "public, max-age=31536000, immutable");

        // @ts-expect-error - ReadableStream type compatibility with Next.js Response
        return new NextResponse(fileStream, { headers });
      }
    }

    // 2. S3 Storage
    if (!config.bucketName) {
      return new NextResponse(
        "S3_BUCKET is not configured in server environment variables.",
        { status: 500 }
      );
    }

    const client = getS3Client();
    const command = new GetObjectCommand({
      Bucket: config.bucketName,
      Key: safeKey,
    });

    const s3Response = await client.send(command);

    if (!s3Response.Body) {
      return new NextResponse("Empty response body from S3", { status: 500 });
    }

    const headers = new Headers();
    const contentType = s3Response.ContentType || "application/octet-stream";
    headers.set("Content-Type", contentType);

    if (s3Response.ContentLength !== undefined) {
      headers.set("Content-Length", s3Response.ContentLength.toString());
    }
    if (s3Response.ETag) {
      headers.set("ETag", s3Response.ETag);
    }
    // High performance caching: 1 year immutable cache (object keys contain timestamps + random hashes)
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    // Convert SdkStream to standard Web ReadableStream
    const stream = s3Response.Body.transformToWebStream();

    return new Response(stream, {
      status: 200,
      headers,
    });
  } catch (err: unknown) {
    if (err && typeof err === "object") {
      // Check for S3 specific errors
      const name = "name" in err ? (err.name as string) : "";
      if (name === "NoSuchKey" || name === "NotFound") {
        return new NextResponse("Media asset not found in storage", { status: 404 });
      }
      if (name === "AccessDenied" || ("$metadata" in err && (err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 403)) {
        return new NextResponse(
          "Access denied by S3. Ensure IAM user (arn:aws:iam::user:user/privitty-s3-uploader) has 's3:GetObject' permission on this bucket.",
          { status: 403 }
        );
      }
    }

    console.error("Media preview error:", err);
    return new NextResponse("Failed to load media asset", { status: 500 });
  }
}