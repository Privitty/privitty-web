import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getS3Client, deleteStorageObject, getStorageConfig } from "./s3";
import prisma from "./prisma";
import fs from "fs/promises";
import path from "path";

/**
 * CMS-managed S3 prefixes. Only files under these folders are eligible for cleanup.
 * This prevents any accidental deletion of unrelated S3 objects.
 */
const CMS_MANAGED_PREFIXES = [
  "testimonials/",
  "team/",
  "whitepapers/",
  "media/",
  "partners/",
] as const;

/**
 * Checks if a storage key is referenced by any database record.
 * Returns a list of references (empty if orphaned).
 */
export async function findFileReferences(
  fileKey: string
): Promise<{ model: string; id: string; field: string; label: string }[]> {
  if (!fileKey) return [];

  const references: { model: string; id: string; field: string; label: string }[] = [];

  const [testimonials, teamMembers, whitepapers, partners, mediaAssets] =
    await Promise.all([
      prisma.testimonial.findMany({
        where: {
          OR: [
            { authorPortrait: fileKey },
            { companyLogo: fileKey },
          ],
        },
        select: { id: true, authorName: true, authorPortrait: true, companyLogo: true },
      }),
      prisma.teamMember.findMany({
        where: { photoUrl: fileKey },
        select: { id: true, name: true },
      }),
      prisma.whitepaper.findMany({
        where: {
          OR: [
            { fileKey: fileKey },
            { coverImageUrl: fileKey },
          ],
        },
        select: { id: true, title: true, fileKey: true, coverImageUrl: true },
      }),
      prisma.partner.findMany({
        where: { logoUrl: fileKey },
        select: { id: true, companyName: true },
      }),
      prisma.mediaAsset.findMany({
        where: { key: fileKey },
        select: { id: true, filename: true },
      }),
    ]);

  for (const t of testimonials) {
    if (t.authorPortrait === fileKey) {
      references.push({
        model: "Testimonial",
        id: t.id,
        field: "authorPortrait",
        label: t.authorName,
      });
    }
    if (t.companyLogo === fileKey) {
      references.push({
        model: "Testimonial",
        id: t.id,
        field: "companyLogo",
        label: t.authorName,
      });
    }
  }

  for (const m of teamMembers) {
    references.push({
      model: "TeamMember",
      id: m.id,
      field: "photoUrl",
      label: m.name,
    });
  }

  for (const w of whitepapers) {
    if (w.fileKey === fileKey) {
      references.push({
        model: "Whitepaper",
        id: w.id,
        field: "fileKey",
        label: w.title,
      });
    }
    if (w.coverImageUrl === fileKey) {
      references.push({
        model: "Whitepaper",
        id: w.id,
        field: "coverImageUrl",
        label: w.title,
      });
    }
  }

  for (const p of partners) {
    references.push({
      model: "Partner",
      id: p.id,
      field: "logoUrl",
      label: p.companyName,
    });
  }

  for (const a of mediaAssets) {
    references.push({
      model: "MediaAsset",
      id: a.id,
      field: "key",
      label: a.filename,
    });
  }

  return references;
}

/**
 * Safely deletes a storage object only if it has no remaining database references.
 * Returns whether the file was deleted.
 */
export async function safeDeleteStorageObject(
  fileKey: string,
  excludeRecord?: { model: string; id: string }
): Promise<{ deleted: boolean; reason?: string }> {
  if (!fileKey) {
    return { deleted: false, reason: "No file key provided" };
  }

  // Don't delete files that look like local public assets (e.g. /milind.png)
  if (fileKey.startsWith("/") && !fileKey.startsWith("/uploads/")) {
    return { deleted: false, reason: "Local public asset, not an uploaded file" };
  }

  // Verify the key is within CMS-managed prefixes
  const isCmsManaged = CMS_MANAGED_PREFIXES.some((prefix) =>
    fileKey.startsWith(prefix)
  );
  if (!isCmsManaged && !fileKey.startsWith("/uploads/")) {
    return {
      deleted: false,
      reason: `File key "${fileKey}" is not within CMS-managed prefixes`,
    };
  }

  const references = await findFileReferences(fileKey);

  // Filter out the record being deleted/updated (so we don't count the record itself)
  const activeReferences = excludeRecord
    ? references.filter(
        (ref) =>
          !(ref.model === excludeRecord.model && ref.id === excludeRecord.id)
      )
    : references;

  if (activeReferences.length > 0) {
    return {
      deleted: false,
      reason: `File is referenced by: ${activeReferences
        .map((r) => `${r.model}:${r.label}`)
        .join(", ")}`,
    };
  }

  try {
    await deleteStorageObject(fileKey);
    return { deleted: true };
  } catch (err) {
    console.error(`Failed to delete storage object ${fileKey}:`, err);
    return {
      deleted: false,
      reason: `S3 deletion failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}

/**
 * Retrieves all file keys referenced in the database across all CMS content models.
 */
export async function getAllReferencedKeys(): Promise<Set<string>> {
  const [testimonials, teamMembers, whitepapers, partners, mediaAssets] =
    await Promise.all([
      prisma.testimonial.findMany({
        select: { authorPortrait: true, companyLogo: true },
      }),
      prisma.teamMember.findMany({
        select: { photoUrl: true },
      }),
      prisma.whitepaper.findMany({
        select: { fileKey: true, coverImageUrl: true },
      }),
      prisma.partner.findMany({
        select: { logoUrl: true },
      }),
      prisma.mediaAsset.findMany({
        select: { key: true },
      }),
    ]);

  const keys = new Set<string>();

  for (const t of testimonials) {
    if (t.authorPortrait) keys.add(t.authorPortrait);
    if (t.companyLogo) keys.add(t.companyLogo);
  }
  for (const m of teamMembers) {
    if (m.photoUrl) keys.add(m.photoUrl);
  }
  for (const w of whitepapers) {
    if (w.fileKey) keys.add(w.fileKey);
    if (w.coverImageUrl) keys.add(w.coverImageUrl);
  }
  for (const p of partners) {
    if (p.logoUrl) keys.add(p.logoUrl);
  }
  for (const a of mediaAssets) {
    if (a.key) keys.add(a.key);
  }

  return keys;
}

export interface StorageFileInfo {
  key: string;
  size: number;
  lastModified: Date | null;
}

/**
 * Lists all files in CMS-managed S3 prefixes (or local uploads directory).
 */
export async function listCmsManagedFiles(): Promise<StorageFileInfo[]> {
  const files: StorageFileInfo[] = [];
  const config = getStorageConfig();

  if (config.isLocalStorageFallback) {
    // Scan local uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    for (const prefix of CMS_MANAGED_PREFIXES) {
      const folderPath = path.join(uploadsDir, prefix.replace(/\/$/, ""));
      try {
        const entries = await fs.readdir(folderPath, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isFile()) {
            const filePath = path.join(folderPath, entry.name);
            const stat = await fs.stat(filePath);
            files.push({
              key: `${prefix}${entry.name}`,
              size: stat.size,
              lastModified: stat.mtime,
            });
          }
        }
      } catch {
        // Directory may not exist yet
      }
    }
  } else {
    // List from S3
    const client: S3Client = getS3Client();
    const bucketName = config.bucketName;
    if (!bucketName) return [];

    for (const prefix of CMS_MANAGED_PREFIXES) {
      let continuationToken: string | undefined;
      do {
        const response = await client.send(
          new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: prefix,
            ContinuationToken: continuationToken,
            MaxKeys: 1000,
          })
        );

        if (response.Contents) {
          for (const obj of response.Contents) {
            if (obj.Key && obj.Size !== undefined) {
              files.push({
                key: obj.Key,
                size: obj.Size,
                lastModified: obj.LastModified ?? null,
              });
            }
          }
        }

        continuationToken = response.IsTruncated
          ? response.NextContinuationToken
          : undefined;
      } while (continuationToken);
    }
  }

  return files;
}

export interface OrphanFileInfo extends StorageFileInfo {
  folder: string;
}

/**
 * Identifies orphan files: files in CMS-managed storage that have no database references.
 */
export async function findOrphanFiles(): Promise<{
  orphans: OrphanFileInfo[];
  totalOrphanBytes: number;
  totalFilesScanned: number;
  totalReferencedFiles: number;
}> {
  const [allFiles, referencedKeys] = await Promise.all([
    listCmsManagedFiles(),
    getAllReferencedKeys(),
  ]);

  const orphans: OrphanFileInfo[] = [];
  let totalOrphanBytes = 0;

  for (const file of allFiles) {
    if (!referencedKeys.has(file.key)) {
      const folder = file.key.split("/")[0] || "unknown";
      orphans.push({ ...file, folder });
      totalOrphanBytes += file.size;
    }
  }

  return {
    orphans,
    totalOrphanBytes,
    totalFilesScanned: allFiles.length,
    totalReferencedFiles: allFiles.length - orphans.length,
  };
}

/**
 * Deletes a list of orphan files with error tracking for retries.
 * Returns results for each file.
 */
export async function deleteOrphanFiles(
  keys: string[]
): Promise<{
  deleted: string[];
  failed: { key: string; error: string }[];
}> {
  const deleted: string[] = [];
  const failed: { key: string; error: string }[] = [];

  for (const key of keys) {
    // Safety: verify file is within CMS-managed prefixes
    const isCmsManaged = CMS_MANAGED_PREFIXES.some((prefix) =>
      key.startsWith(prefix)
    );
    if (!isCmsManaged) {
      failed.push({
        key,
        error: "File is not within CMS-managed prefixes — refusing to delete",
      });
      continue;
    }

    // Double-check it's still unreferenced
    const refs = await findFileReferences(key);
    if (refs.length > 0) {
      failed.push({
        key,
        error: `File is now referenced by ${refs.map((r) => `${r.model}:${r.label}`).join(", ")}`,
      });
      continue;
    }

    try {
      await deleteStorageObject(key);
      deleted.push(key);
    } catch (err) {
      failed.push({
        key,
        error: err instanceof Error ? err.message : "Unknown deletion error",
      });
    }
  }

  return { deleted, failed };
}
