import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession, recordAuditLog } from "@/app/lib/auth";
import { deleteOrphanFiles } from "@/app/lib/s3-cleanup";

/**
 * POST /api/admin/storage/cleanup
 * Deletes explicitly confirmed orphan files from S3 storage.
 * Requires admin session and explicit list of file keys to delete.
 * Double-checks each key is still unreferenced before deletion.
 */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminSession();

    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.keys) || body.keys.length === 0) {
      return NextResponse.json(
        { error: "Request body must include a non-empty 'keys' array of S3 object keys to delete." },
        { status: 400 }
      );
    }

    const keys: string[] = body.keys;

    // Safety limit: max 100 files per batch
    if (keys.length > 100) {
      return NextResponse.json(
        { error: "Maximum 100 files can be deleted per batch for safety." },
        { status: 400 }
      );
    }

    const result = await deleteOrphanFiles(keys);

    await recordAuditLog({
      adminEmail: admin.email,
      adminUserId: admin.id,
      action: "DELETE_ORPHAN_FILES",
      targetType: "STORAGE",
      details: {
        requestedCount: keys.length,
        deletedCount: result.deleted.length,
        failedCount: result.failed.length,
        deletedKeys: result.deleted,
        failedKeys: result.failed,
      },
    });

    return NextResponse.json({
      success: true,
      deleted: result.deleted,
      failed: result.failed,
      summary: {
        requested: keys.length,
        deleted: result.deleted.length,
        failed: result.failed.length,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Orphan cleanup error:", err);
    return NextResponse.json(
      { error: "Failed to clean up orphan files" },
      { status: 500 }
    );
  }
}
