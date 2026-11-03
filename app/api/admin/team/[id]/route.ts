import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession, recordAuditLog } from "@/app/lib/auth";
import { TeamMemberSchema } from "@/app/lib/validation";
import { safeDeleteStorageObject } from "@/app/lib/s3-cleanup";
import prisma from "@/app/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
    const { id } = await params;

    const member = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch team member" }, { status: 500 });
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
    const parsed = TeamMemberSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    // Fetch the existing record to detect photo changes
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    const oldPhotoUrl = existing.photoUrl;
    const newPhotoUrl = parsed.data.photoUrl ?? null;


    const updated = await prisma.teamMember.update({
      where: { id },
      data: parsed.data,
    });

    // If the photo was replaced or removed, clean up the old file from S3
    if (oldPhotoUrl && oldPhotoUrl !== newPhotoUrl) {
      const result = await safeDeleteStorageObject(oldPhotoUrl, {
        model: "TeamMember",
        id,
      });
      if (result.deleted) {
        console.log(`Cleaned up old team member photo: ${oldPhotoUrl}`);
      }
    }


    await recordAuditLog({
      adminEmail: admin.email,
      adminUserId: admin.id,
      action: "UPDATE_TEAM_MEMBER",
      targetType: "TEAM_MEMBER",
      targetId: id,
      details: {
        name: updated.name,
        isPublished: updated.isPublished,
        displayOrder: updated.displayOrder,
        photoChanged: oldPhotoUrl !== newPhotoUrl,
      },
    });

    revalidatePath("/about");

    return NextResponse.json({ success: true, member: updated });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update team member error:", err);
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminSession();
    const { id } = await params;

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    // Delete the database record first
    await prisma.teamMember.delete({ where: { id } });

    // Then clean up the photo from S3 (if it exists and isn't shared)
    if (existing.photoUrl) {
      const result = await safeDeleteStorageObject(existing.photoUrl);
      if (result.deleted) {
        console.log(`Deleted team member photo from storage: ${existing.photoUrl}`);
      } else {
        console.log(`Skipped deleting photo ${existing.photoUrl}: ${result.reason}`);
      }
    }

    await recordAuditLog({
      adminEmail: admin.email,
      adminUserId: admin.id,
      action: "DELETE_TEAM_MEMBER",
      targetType: "TEAM_MEMBER",
      targetId: id,
      details: {
        name: existing.name,
        photoDeleted: !!existing.photoUrl,
      },
    });

    revalidatePath("/about");

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete team member error:", err);
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}
