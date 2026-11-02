import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession();

    const [
      totalTestimonials,
      publishedTestimonials,
      totalTeamMembers,
      publishedTeamMembers,
      totalWhitepapers,
      publishedWhitepapers,
      whitepapersWithDownloads,
      totalPartners,
      publishedPartners,
      totalMediaAssets,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.testimonial.count(),
      prisma.testimonial.count({ where: { isPublished: true } }),
      prisma.teamMember.count(),
      prisma.teamMember.count({ where: { isPublished: true } }),
      prisma.whitepaper.count(),
      prisma.whitepaper.count({ where: { isPublished: true } }),
      prisma.whitepaper.aggregate({ _sum: { downloadCount: true } }),
      prisma.partner.count(),
      prisma.partner.count({ where: { isPublished: true } }),
      prisma.mediaAsset.count(),
      prisma.auditLog.findMany({
        take: 12,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const draftTestimonials = totalTestimonials - publishedTestimonials;
    const draftTeamMembers = totalTeamMembers - publishedTeamMembers;
    const draftWhitepapers = totalWhitepapers - publishedWhitepapers;
    const draftPartners = totalPartners - publishedPartners;
    const totalDrafts = draftTestimonials + draftTeamMembers + draftWhitepapers + draftPartners;

    const s3Bucket = process.env.S3_BUCKET || "";
    const isLocalStorage =
      process.env.ENABLE_LOCAL_STORAGE_FALLBACK === "true" || !s3Bucket;

    return NextResponse.json({
      metrics: {
        testimonials: {
          total: totalTestimonials,
          published: publishedTestimonials,
          drafts: draftTestimonials,
        },
        teamMembers: {
          total: totalTeamMembers,
          published: publishedTeamMembers,
          drafts: draftTeamMembers,
        },
        whitepapers: {
          total: totalWhitepapers,
          published: publishedWhitepapers,
          drafts: draftWhitepapers,
          totalDownloads: whitepapersWithDownloads._sum.downloadCount || 0,
        },
        partners: {
          total: totalPartners,
          published: publishedPartners,
          drafts: draftPartners,
        },
        media: {
          total: totalMediaAssets,
        },
        totalDrafts,
      },
      system: {
        database: "PostgreSQL Connected",
        storageMode: isLocalStorage ? "Local Fallback" : "Amazon S3",
        s3Bucket: s3Bucket || "Not configured",
        awsRegion: process.env.S3_REGION || "us-east-1",
      },
      recentActivity: recentAuditLogs,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Dashboard stats error:", err);
    return NextResponse.json({ error: "Failed to load dashboard metrics" }, { status: 500 });
  }
}
