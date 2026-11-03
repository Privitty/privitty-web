import { NextResponse } from "next/server";
import { requireAdminSession, recordAuditLog } from "@/app/lib/auth";
import { findOrphanFiles } from "@/app/lib/s3-cleanup";

/**
 * GET /api/admin/storage/orphans
 * Scans CMS-managed S3 prefixes and returns files not referenced in any database table.
 * Admin-only. Read-only dry-run — nothing is deleted.
 */
export async function GET() {
  try {
    const admin = await requireAdminSession();

    const result = await findOrphanFiles();

    await recordAuditLog({
      adminEmail: admin.email,
      adminUserId: admin.id,
      action: "SCAN_ORPHAN_FILES",
      targetType: "STORAGE",
      details: {
        totalFilesScanned: result.totalFilesScanned,
        orphansFound: result.orphans.length,
        recoverableBytes: result.totalOrphanBytes,
      },
    });

    return NextResponse.json({
      orphans: result.orphans.map((f) => ({
        key: f.key,
        size: f.size,
        folder: f.folder,
        lastModified: f.lastModified?.toISOString() ?? null,
      })),
      summary: {
        totalFilesScanned: result.totalFilesScanned,
        referencedFiles: result.totalReferencedFiles,
        orphanCount: result.orphans.length,
        totalOrphanBytes: result.totalOrphanBytes,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Orphan scan error:", err);
    return NextResponse.json(
      { error: "Failed to scan for orphan files" },
      { status: 500 }
    );
  }
}
