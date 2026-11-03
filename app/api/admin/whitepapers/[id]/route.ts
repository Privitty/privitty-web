import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession, recordAuditLog } from "@/app/lib/auth";
import { WhitepaperSchema, sanitizeSlug } from "@/app/lib/validation";
import { safeDeleteStorageObject } from "@/app/lib/s3-cleanup";
import prisma from "@/app/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
    const { id } = await params;

    const whitepaper = await prisma.whitepaper.findUnique({
      where: { id },
    });

    if (!whitepaper) {
      return NextResponse.json({ error: "Whitepaper not found" }, { status: 404 });
    }

    return NextResponse.json({ whitepaper });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch whitepaper" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminSession();
    const { id } = await params;

    const body = await req.json().catch(() => null);
    if (body?.slug) {
      body.slug = sanitizeSlug(body.slug);
    }

    const parsed = WhitepaperSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const existingSlug = await prisma.whitepaper.findFirst({
      where: {
        slug: parsed.data.slug,
        NOT: { id },
      },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: `The slug "${parsed.data.slug}" is already in use by another whitepaper.` },
        { status: 400 }
      );
    }

     // Fetch existing record to detect file changes
    const existing = await prisma.whitepaper.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Whitepaper not found" }, { status: 404 });
    }

    const oldFileKey = existing.fileKey;
    const newFileKey = parsed.data.fileKey;
    const oldCoverImageUrl = existing.coverImageUrl;
    const newCoverImageUrl = parsed.data.coverImageUrl ?? null;

    const updated = await prisma.whitepaper.update({
      where: { id },
      data: {
        ...parsed.data,
        publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : undefined,
      },
    });

    // Clean up old PDF file if it was replaced
    if (oldFileKey && oldFileKey !== newFileKey) {
      const result = await safeDeleteStorageObject(oldFileKey, {
        model: "Whitepaper",
        id,
      });
      if (result.deleted) {
        console.log(`Cleaned up old whitepaper PDF: ${oldFileKey}`);
      }
    }

    // Clean up old cover image if it was replaced or removed
    if (oldCoverImageUrl && oldCoverImageUrl !== newCoverImageUrl) {
      const result = await safeDeleteStorageObject(oldCoverImageUrl, {
        model: "Whitepaper",
        id,
      });
      if (result.deleted) {
        console.log(`Cleaned up old whitepaper cover image: ${oldCoverImageUrl}`);
      }
    }

    await recordAuditLog({
      adminEmail: admin.email,
      adminUserId: admin.id,
      action: "UPDATE_WHITEPAPER",
      targetType: "WHITEPAPER",
      targetId: id,
      details: {
        title: updated.title,
        isPublished: updated.isPublished,
        pdfChanged: oldFileKey !== newFileKey,
        coverChanged: oldCoverImageUrl !== newCoverImageUrl,
      },
    });

    revalidatePath("/whitepapers");
    revalidatePath(`/whitepapers/${updated.slug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true, whitepaper: updated });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update whitepaper error:", err);
    return NextResponse.json({ error: "Failed to update whitepaper" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminSession();
    const { id } = await params;

    const existing = await prisma.whitepaper.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Whitepaper not found" }, { status: 404 });
    }

    // Delete the database record first
    await prisma.whitepaper.delete({ where: { id } });

    // Then clean up associated files from S3
    const cleanupResults: Record<string, unknown> = {};

    if (existing.fileKey) {
      const pdfResult = await safeDeleteStorageObject(existing.fileKey);
      cleanupResults.pdf = pdfResult;
      if (pdfResult.deleted) {
        console.log(`Deleted whitepaper PDF from storage: ${existing.fileKey}`);
      }
    }

    if (existing.coverImageUrl) {
      const coverResult = await safeDeleteStorageObject(existing.coverImageUrl);
      cleanupResults.cover = coverResult;
      if (coverResult.deleted) {
        console.log(`Deleted whitepaper cover from storage: ${existing.coverImageUrl}`);
      }
    }

    await recordAuditLog({
      adminEmail: admin.email,
      adminUserId: admin.id,
      action: "DELETE_WHITEPAPER",
      targetType: "WHITEPAPER",
      targetId: id,
      details: {
        title: existing.title,
        slug: existing.slug,
        filesCleanup: cleanupResults,
      },
    });

    revalidatePath("/whitepapers");
    revalidatePath(`/whitepapers/${existing.slug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete whitepaper error:", err);
    return NextResponse.json({ error: "Failed to delete whitepaper" }, { status: 500 });
  }
}
