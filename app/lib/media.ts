/**
 * Client-safe asset URL resolver.
 * Converts S3 keys or local upload paths to accessible URLs without requiring Node.js or AWS SDK imports.
 */
export function resolveAssetUrl(keyOrUrl: string | null | undefined): string {
  if (!keyOrUrl) return "";
  
  // Already a full external URL (http:// or https://)
  if (keyOrUrl.startsWith("http://") || keyOrUrl.startsWith("https://")) {
    return keyOrUrl;
  }

  // Pre-existing static asset from /public (e.g. /milind.png, /preview.png, /partners/...)
  // But NOT /uploads/ which are dynamic uploaded keys
  if (keyOrUrl.startsWith("/") && !keyOrUrl.startsWith("/uploads/")) {
    return keyOrUrl;
  }

  const cleanKey = keyOrUrl.replace(/^\/?uploads\//, "").replace(/^\/+/, "");

  // 1. If a custom CloudFront CDN domain is configured
  const customDomain =
    process.env.NEXT_PUBLIC_S3_CUSTOM_DOMAIN ||
    process.env.S3_CUSTOM_DOMAIN;
  if (customDomain) {
    return `https://${customDomain}/${cleanKey}`;
  }

  // 2. If direct S3 URLs are explicitly enabled for public buckets
  const directS3 =
    process.env.NEXT_PUBLIC_S3_DIRECT === "true" ||
    process.env.S3_DIRECT === "true";

  const bucketName =
    process.env.NEXT_PUBLIC_S3_BUCKET || process.env.S3_BUCKET;
  const region =
    process.env.NEXT_PUBLIC_S3_REGION ||
    process.env.S3_REGION ||
    "us-east-1";
  
  if (directS3 && bucketName) {
    return `https://${bucketName}.s3.${region}.amazonaws.com/${cleanKey}`;
  }
  
  // 3. Default: Universal Media Route (/api/media/[...key])
  // This streams the file through Next.js using server-side IAM credentials
  // (arn:aws:iam::860849023058:user/privitty-s3-uploader).
  // Works with private S3 buckets, requires zero client-side S3 env vars,
  // avoids CORS issues, and works seamlessly in local development too.
  return `/api/media/${cleanKey}`;

}
