/**
 * Client-safe asset URL resolver.
 * Converts S3 keys or local upload paths to accessible URLs without requiring Node.js or AWS SDK imports.
 */
export function resolveAssetUrl(keyOrUrl: string | null | undefined): string {
  if (!keyOrUrl) return "";
  if (
    keyOrUrl.startsWith("http://") ||
    keyOrUrl.startsWith("https://") ||
    keyOrUrl.startsWith("/")
  ) {
    return keyOrUrl;
  }
  const customDomain =
    process.env.NEXT_PUBLIC_S3_CUSTOM_DOMAIN ||
    process.env.S3_CUSTOM_DOMAIN;
  if (customDomain) {
    return `https://${customDomain}/${keyOrUrl}`;
  }
  const bucketName =
    process.env.NEXT_PUBLIC_S3_BUCKET || process.env.S3_BUCKET;
  const region =
    process.env.NEXT_PUBLIC_S3_REGION ||
    process.env.S3_REGION ||
    "us-east-1";
  if (bucketName) {
    return `https://${bucketName}.s3.${region}.amazonaws.com/${keyOrUrl}`;
  }
  return `/uploads/${keyOrUrl}`;
}
