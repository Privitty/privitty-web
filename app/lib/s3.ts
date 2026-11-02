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

// S3 configuration.
// Names avoid the AWS_ prefix, which Amplify rejects as reserved.
// Omit the access keys when the runtime uses an IAM role (Amplify SSR compute role, EC2 instance profile).
const region = process.env.S3_REGION || "us-east-1";
const bucketName = process.env.S3_BUCKET || "";
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const isLocalStorageFallback =
  process.env.ENABLE_LOCAL_STORAGE_FALLBACK === "true" || !bucketName;

// S3 Client initialization:
// When accessKeyId & secretAccessKey are provided, use them.
// When omitted, the SDK resolves credentials from the default provider chain (IAM role / instance profile).
let s3ClientInstance: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    if (accessKeyId && secretAccessKey) {
      s3ClientInstance = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    } else {
      // IAM role (Amplify compute role, EC2 instance profile, or other default chain)
      s3ClientInstance = new S3Client({ region });
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
  const fileKey = generateUniqueStorageKey(params.folder, params.filename);

  if (isLocalStorageFallback) {
    // Local development upload endpoint
    return {
      uploadUrl: `/api/admin/uploads/local?key=${encodeURIComponent(fileKey)}`,
      fileKey,
      isLocalStorage: true,
    };
  }

  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucketName,
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
  const fileKey = generateUniqueStorageKey(folder, originalFilename);

  if (isLocalStorageFallback) {
    const localDir = path.join(process.cwd(), "public", "uploads", folder);
    await fs.mkdir(localDir, { recursive: true });
    const localFilePath = path.join(process.cwd(), "public", "uploads", fileKey);
    await fs.mkdir(path.dirname(localFilePath), { recursive: true });
    await fs.writeFile(localFilePath, buffer);

    const publicUrl = `/uploads/${fileKey}`;
    return { fileKey, publicUrl };
  }

  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const customDomain = process.env.S3_CUSTOM_DOMAIN;
  const publicUrl = customDomain
    ? `https://${customDomain}/${fileKey}`
    : `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;

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
  // If stored in local uploads directory
  if (isLocalStorageFallback || fileKey.startsWith("/uploads/") || fileKey.startsWith("/")) {
    return fileKey.startsWith("/") ? fileKey : `/${fileKey}`;
  }

  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: bucketName,
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

  if (isLocalStorageFallback || fileKey.startsWith("/uploads/")) {
    try {
      const cleanKey = fileKey.replace(/^\/?uploads\//, "");
      const localFilePath = path.join(process.cwd(), "public", "uploads", cleanKey);
      await fs.unlink(localFilePath).catch(() => {});
    } catch {
      // Ignore if file does not exist
    }
    return;
  }

  try {
    const client = getS3Client();
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      })
    );
  } catch (err) {
    console.error(`Failed to delete S3 object ${fileKey}:`, err);
  }
}

export { resolveAssetUrl } from "./media";

