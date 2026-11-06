/**
 * Client-safe asset URL resolver.
 * Converts S3 keys, local upload paths, or static public assets to accessible URLs
 * without requiring Node.js or AWS SDK imports.
 */
export function resolveAssetUrl(keyOrUrl: string | null | undefined): string {
  if (!keyOrUrl) return "";
  
  const trimmed = keyOrUrl.trim();
  if (!trimmed) return "";

  // 1. Already a full external URL (http:// or https://)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // 2. Pre-existing static asset from /public (e.g. /industrial-partner.jpg, /testimonials/pankaj-garg.png)
  // But NOT /uploads/ which are dynamic uploaded keys
  if (trimmed.startsWith("/") && !trimmed.startsWith("/uploads/")) {
    return trimmed;
  }

  // 3. Static assets stored without leading slash (e.g. "testimonials/leading-oem.png", "industrial-partner.jpg")
  // Dynamic S3 uploads have keys like "testimonials/1793861285563-72ae3a40b1eb388b-oem.png"
  const isDynamicUploadKey = /^[a-z0-9_-]+\/\d{10,}-[a-f0-9]{8,}-/i.test(trimmed);
  if (!isDynamicUploadKey && (trimmed.startsWith("testimonials/") || trimmed.startsWith("partners/") || trimmed.startsWith("team/") || trimmed.endsWith(".png") || trimmed.endsWith(".jpg") || trimmed.endsWith(".svg") || trimmed.endsWith(".webp"))) {
    // If not matching the timestamped upload pattern, treat as public static asset
    if (!trimmed.startsWith("uploads/")) {
      return `/${trimmed.replace(/^\/+/, "")}`;
    }
  }

  const cleanKey = trimmed.replace(/^\/?uploads\//, "").replace(/^\/+/, "");

  // 4. If a custom CloudFront CDN domain is configured (Amplify or standalone CloudFront)
  const customDomain =
    process.env.NEXT_PUBLIC_S3_CUSTOM_DOMAIN ||
    process.env.S3_CUSTOM_DOMAIN ||
    process.env.NEXT_PUBLIC_AWS_S3_CUSTOM_DOMAIN ||
    process.env.AWS_S3_CUSTOM_DOMAIN;
  if (customDomain) {
    return `https://${customDomain.replace(/\/+$/, "")}/${cleanKey}`;
  }

  // 5. If direct S3 URLs are explicitly enabled for public buckets
  const directS3 =
    process.env.NEXT_PUBLIC_S3_DIRECT === "true" ||
    process.env.S3_DIRECT === "true";

  const bucketName =
    process.env.NEXT_PUBLIC_S3_BUCKET ||
    process.env.S3_BUCKET ||
    process.env.NEXT_PUBLIC_AWS_S3_BUCKET ||
    process.env.AWS_S3_BUCKET;
  const region =
    process.env.NEXT_PUBLIC_S3_REGION ||
    process.env.S3_REGION ||
    process.env.NEXT_PUBLIC_AWS_REGION ||
    process.env.AWS_REGION ||
    "us-east-1";
  
  if (directS3 && bucketName) {
    return `https://${bucketName}.s3.${region}.amazonaws.com/${cleanKey}`;
  }
  
  // 6. Default: Universal Media Route (/api/media/[...key])
  // This streams the file through Next.js using server-side IAM credentials
  // (arn:aws:iam::860849023058:user/privitty-s3-uploader).
  // Works with private S3 buckets, requires zero client-side S3 env vars,
  // avoids CORS issues, and works seamlessly in local development too.
  return `/api/media/${cleanKey}`;
}
