import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminSession, recordAuditLog } from "@/app/lib/auth";
import { TestimonialSchema } from "@/app/lib/validation";
import prisma from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession();

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { authorName: { contains: search, mode: "insensitive" } },
        { companyName: { contains: search, mode: "insensitive" } },
        { quote: { contains: search, mode: "insensitive" } },
        { jobTitle: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status === "published") {
      where.isPublished = true;
    } else if (status === "draft") {
      where.isPublished = false;
    }

    const [total, testimonials] = await Promise.all([
      prisma.testimonial.count({ where }),
      prisma.testimonial.findMany({
        where,
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      testimonials,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Fetch testimonials error:", err);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminSession();

    const body = await req.json().catch(() => null);
    const parsed = TestimonialSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: parsed.data,
    });

    await recordAuditLog({
      adminEmail: admin.email,
      adminUserId: admin.id,
      action: "CREATE_TESTIMONIAL",
      targetType: "TESTIMONIAL",
      targetId: testimonial.id,
      details: {
        authorName: testimonial.authorName,
        companyName: testimonial.companyName,
        isPublished: testimonial.isPublished,
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

    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create testimonial error:", err);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
