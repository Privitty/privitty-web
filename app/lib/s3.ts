import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";

// S3 Client singleton
let s3ClientInstance: S3Client | null = null;

/**
 * Returns dynamic storage configuration evaluated on each call.
 * This guarantees runtime environment variables injected by AWS Amplify (or any hosting provider)
 * are never frozen at build time or module load time.
 */
export function getStorageConfig() {
  const region = process.env.S3_REGION || process.env.AWS_REGION || "us-east-1";
  const bucketName = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET || "";
  const accessKeyId = process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
  const customDomain = process.env.S3_CUSTOM_DOMAIN || process.env.AWS_S3_CUSTOM_DOMAIN;

  const isServerlessOrProd = Boolean(
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.VERCEL ||
    process.env.NODE_ENV === "production"
  );

  const isExplicitLocal = process.env.ENABLE_LOCAL_STORAGE_FALLBACK === "true";

  // In production/serverless, local storage is only used if explicitly forced.
  // Otherwise, if bucket is missing in production, we flag it so we can give a clear error instead of a silent EROFS crash.
  const isLocalStorageFallback = isExplicitLocal || (!bucketName && !isServerlessOrProd);

  return {
    region,
    bucketName,
    accessKeyId,
    secretAccessKey,
    customDomain,
    isServerlessOrProd,
    isExplicitLocal,
    isLocalStorageFallback,
  };
}

/**
 * Initializes and returns the S3Client singleton.
 */

export function getS3Client(): S3Client {
  const config = getStorageConfig();

  if (!s3ClientInstance) {
     if (config.accessKeyId && config.secretAccessKey) {
      s3ClientInstance = new S3Client({
        region: config.region,
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
      });
    } else {
      // EC2 Instance Profile / IAM Role / Lambda IAM Role
      s3ClientInstance = new S3Client({ region: config.region });
    }
  }
  return s3ClientInstance;
}

export interface PresignedUploadResult {
  uploadUrl: string;
  fileKey: string;
  isLocalStorage: boolean;
}

/**
 * Validates file MIME type, extension, and size bounds.
 */
export function validateUploadedFile(
  filename: string,
  mimeType: string,
  sizeBytes: number,
  category: "image" | "pdf" | "any" = "any"
): { valid: boolean; error?: string } {
  // Size bounds
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
  const MAX_PDF_SIZE = 25 * 1024 * 1024; // 25 MB

  const ext = path.extname(filename).toLowerCase().replace(".", "");

  if (category === "image") {
    const allowedImageMimes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    const allowedImageExts = ["jpg", "jpeg", "png", "webp", "svg"];

    if (!allowedImageMimes.includes(mimeType) || !allowedImageExts.includes(ext)) {
      return {
        valid: false,
        error: "Invalid image format. Allowed formats: PNG, JPG, WebP, SVG.",
      };
    }
    if (sizeBytes > MAX_IMAGE_SIZE) {
      return {
        valid: false,
        error: `Image size exceeds the maximum limit of 5MB (Received: ${(sizeBytes / 1024 / 1024).toFixed(1)}MB).`,
      };
    }
  } else if (category === "pdf") {
    if (mimeType !== "application/pdf" || ext !== "pdf") {
      return {
        valid: false,
        error: "Invalid document format. Only PDF files (.pdf) are permitted.",
      };
    }
    if (sizeBytes > MAX_PDF_SIZE) {
      return {
        valid: false,
        error: `PDF size exceeds the maximum limit of 25MB (Received: ${(sizeBytes / 1024 / 1024).toFixed(1)}MB).`,
      };
    }
  }

  return { valid: true };
}

/**
 * Generates a clean, unique S3 object key preventing collisions and directory traversal.
 */
export function generateUniqueStorageKey(
  folder: "testimonials" | "team" | "whitepapers" | "media" | "partners",
  originalFilename: string
): string {
  const sanitized = path
    .basename(originalFilename)
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .toLowerCase();
  const uniqueId = crypto.randomBytes(8).toString("hex");
  const timestamp = Date.now();
  return `${folder}/${timestamp}-${uniqueId}-${sanitized}`;
}

/**
 * Generates an authorized presigned URL for direct secure PUT upload to S3,
 * or handles local storage fallback.
 */
export async function getPresignedUploadUrl(params: {
  folder: "testimonials" | "team" | "whitepapers" | "media" | "partners";
  filename: string;
  contentType: string;
}): Promise<PresignedUploadResult> {
  const config = getStorageConfig();
  const fileKey = generateUniqueStorageKey(params.folder, params.filename);

  // If S3 bucket is missing in a production/serverless environment, fail fast with a clear explanation
  if (!config.bucketName) {
    if (config.isServerlessOrProd && !config.isExplicitLocal) {
      throw new Error(
        "AWS S3 is not configured: missing S3_BUCKET environment variable in AWS Amplify. Local disk uploads are disabled in serverless production. Please configure S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY in Amplify Console (App settings → Environment variables)."
      );
    }
  }

  if (config.isLocalStorageFallback) {
    // Local development upload endpoint
    return {
      uploadUrl: `/api/admin/uploads/local?key=${encodeURIComponent(fileKey)}`,
      fileKey,
      isLocalStorage: true,
    };
  }

  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: fileKey,
    ContentType: params.contentType,
  });

  // Short-lived upload authorization URL: 15 minutes
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 900 });

  return {
    uploadUrl,
    fileKey,
    isLocalStorage: false,
  };
}

/**
 * Saves a file buffer to storage (S3 or local fallback).
 */
export async function uploadBufferToStorage(
  buffer: Buffer,
  folder: "testimonials" | "team" | "whitepapers" | "media" | "partners",
  originalFilename: string,
  contentType: string
): Promise<{ fileKey: string; publicUrl: string }> {
  const config = getStorageConfig();
  const fileKey = generateUniqueStorageKey(folder, originalFilename);

  if (config.isLocalStorageFallback) {
    const localDir = path.join(process.cwd(), "public", "uploads", folder);
    await fs.mkdir(localDir, { recursive: true });
    const localFilePath = path.join(process.cwd(), "public", "uploads", fileKey);
    await fs.mkdir(path.dirname(localFilePath), { recursive: true });
    await fs.writeFile(localFilePath, buffer);

    const publicUrl = `/uploads/${fileKey}`;
    return { fileKey, publicUrl };
  }

  if (!config.bucketName) {
    throw new Error(
      "Cannot upload to S3: S3_BUCKET is not set in environment variables."
    );
  }


  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: fileKey,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const publicUrl = config.customDomain
    ? `https://${config.customDomain}/${fileKey}`
    : `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${fileKey}`;
    
  return { fileKey, publicUrl };
}

/**
 * Generates a short-lived presigned download URL for private files (e.g. whitepapers),
 * preventing exposure of credentials and maintaining access control.
 */
export async function getSecureDownloadUrl(
  fileKey: string,
  downloadFilename?: string,
  expiresInSeconds: number = 900
): Promise<string> {
  const config = getStorageConfig();

  // If stored in local uploads directory or root asset
  if (config.isLocalStorageFallback || fileKey.startsWith("/uploads/") || fileKey.startsWith("/")) {
    return fileKey.startsWith("/") ? fileKey : `/${fileKey}`;
  }

  if (!config.bucketName) {
    return fileKey.startsWith("/") ? fileKey : `/${fileKey}`;
  }

  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: config.bucketName,
    Key: fileKey,
    ResponseContentDisposition: downloadFilename
      ? `attachment; filename="${downloadFilename.replace(/"/g, "")}"`
      : undefined,
  });

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

/**
 * Deletes an object from S3 or local storage.
 */
export async function deleteStorageObject(fileKey: string): Promise<void> {
  if (!fileKey) return;

  const config = getStorageConfig();

  if (config.isLocalStorageFallback || fileKey.startsWith("/uploads/")) {
    try {
      const cleanKey = fileKey.replace(/^\/?uploads\//, "");
      const localFilePath = path.join(process.cwd(), "public", "uploads", cleanKey);
      await fs.unlink(localFilePath).catch(() => {});
    } catch {
      // Ignore if file does not exist
    }
    return;
  }

  if (!config.bucketName) return;

  try {
    const client = getS3Client();
    await client.send(
      new DeleteObjectCommand({
        Bucket: config.bucketName,
        Key: fileKey,
      })
    );
  } catch (err) {
    console.error(`Failed to delete S3 object ${fileKey}:`, err);
  }
}

export { resolveAssetUrl } from "./media";

