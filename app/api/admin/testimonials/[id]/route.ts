import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminSession, recordAuditLog } from "@/app/lib/auth";
import { TestimonialSchema } from "@/app/lib/validation";
import prisma from "@/app/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
    const { id } = await params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ testimonial });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch testimonial" }, { status: 500 });
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
    const parsed = TestimonialSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: parsed.data,
    });

    await recordAuditLog({
      adminEmail: admin.email,
      adminUserId: admin.id,
      action: "UPDATE_TESTIMONIAL",
      targetType: "TESTIMONIAL",
      targetId: id,
      details: {
        authorName: updated.authorName,
        isPublished: updated.isPublished,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    try {
      revalidateTag("testimonials", { expire: 0 });
      revalidateTag("homepage-testimonials", { expire: 0 });
    } catch {
      // Ignore if cacheTag not supported in environment
    }

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update testimonial error:", err);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminSession();
    const { id } = await params;

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    await prisma.testimonial.delete({ where: { id } });

    await recordAuditLog({
      adminEmail: admin.email,
      adminUserId: admin.id,
      action: "DELETE_TESTIMONIAL",
      targetType: "TESTIMONIAL",
      targetId: id,
      details: {
        authorName: existing.authorName,
        companyName: existing.companyName,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    try {
      revalidateTag("testimonials", { expire: 0 });
      revalidateTag("homepage-testimonials", { expire: 0 });
    } catch {
      // Ignore if cacheTag not supported in environment
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete testimonial error:", err);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
