import prisma from "@/app/lib/prisma";
import { cacheTag } from "next/cache";

const STATIC_TESTIMONIAL_PORTRAITS: Record<string, string> = {
  "Industrial Automation Consortium": "/industrial-partner.jpg",
  "Leading OEM": "/testimonials/leading-oem.png",
  "Leading OEMs": "/testimonials/leading-oem.png",
  "Pankaj Garg": "/testimonials/pankaj-garg.png",
  "Dr. Santosh Honnagunti": "/testimonials/santosh-honnagunti.png",
};

export interface PublicTestimonial {
  id: string;
  authorName: string;
  jobTitle: string;
  companyName: string;
  quote: string;
  rating: number;
  authorPortrait: string | null;
  companyLogo: string | null;
  displayOrder: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

export interface PublicTeamMember {
  id: string;
  name: string;
  jobTitle: string;
  bio: string | null;
  photoUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  otherUrl: string | null;
  displayOrder: number;
  isPublished: boolean;
  createdAt: Date;
}

export interface PublicWhitepaper {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string | null;
  coverImageUrl: string | null;
  fileKey: string;
  fileName: string;
  fileSize: number;
  category: string | null;
  author: string | null;
  publishedAt: Date | null;
  displayOrder: number;
  downloadCount: number;
}
export interface PublicPartner {
  id: string;
  companyName: string;
  logoUrl: string;
  websiteUrl: string | null;
  displayOrder: number;
  isPublished: boolean;
  createdAt: Date;
}

export class DatabaseQueryError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "DatabaseQueryError";
  }
}

/**
 * Fetch all published testimonials from PostgreSQL ordered by displayOrder.
 * Unpublished testimonials are strictly excluded.
 */
export async function getPublishedTestimonials(): Promise<PublicTestimonial[]> {
  "use cache";
  try {
    cacheTag("testimonials", "homepage-testimonials");
  } catch {
    // Graceful fallback if invoked outside Next.js cacheComponents runtime
  }
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        authorName: true,
        jobTitle: true,
        companyName: true,
        quote: true,
        rating: true,
        authorPortrait: true,
        companyLogo: true,
        displayOrder: true,
        isPublished: true,
        isFeatured: true,
        createdAt: true,
      },
    });

    return testimonials.map((t) => ({
      ...t,
      authorPortrait:
        t.authorPortrait && t.authorPortrait.trim() !== ""
          ? t.authorPortrait.trim()
          : STATIC_TESTIMONIAL_PORTRAITS[t.authorName] || null,
    }));
  } catch (error) {
    console.error("[getPublishedTestimonials] Database query failed:", error);
    throw new DatabaseQueryError("Failed to fetch published testimonials from database", error);
  }
}

/**
 * Fetch all published team members from PostgreSQL ordered by displayOrder.
 * Unpublished team members are strictly excluded.
 */
export async function getPublishedTeamMembers(): Promise<PublicTeamMember[]> {
  "use cache";
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: { isPublished: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        jobTitle: true,
        bio: true,
        photoUrl: true,
        linkedinUrl: true,
        twitterUrl: true,
        otherUrl: true,
        displayOrder: true,
        isPublished: true,
        createdAt: true,
      },
    });

    return teamMembers;
  } catch (error) {
    console.error("[getPublishedTeamMembers] Database query failed:", error);
    throw new DatabaseQueryError("Failed to fetch published team members from database", error);
  }
}

/**
 * Fetch published whitepapers from PostgreSQL ordered by displayOrder.
 * Unpublished whitepapers are strictly excluded.
 */
export async function getPublishedWhitepapers(options?: {
  take?: number;
}): Promise<PublicWhitepaper[]> {
  "use cache";
  try {
    const whitepapers = await prisma.whitepaper.findMany({
      where: { isPublished: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      ...(options?.take ? { take: options.take } : {}),
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        longDescription: true,
        coverImageUrl: true,
        fileKey: true,
        fileName: true,
        fileSize: true,
        category: true,
        author: true,
        publishedAt: true,
        displayOrder: true,
        downloadCount: true,
      },
    });

    return whitepapers;
  } catch (error) {
    console.error("[getPublishedWhitepapers] Database query failed:", error);
    throw new DatabaseQueryError("Failed to fetch published whitepapers from database", error);
  }
}

/**
 * Fetch single published whitepaper by its unique slug.
 */
export async function getPublishedWhitepaperBySlug(
  slug: string
): Promise<PublicWhitepaper | null> {
  "use cache";
  try {
    const whitepaper = await prisma.whitepaper.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        longDescription: true,
        coverImageUrl: true,
        fileKey: true,
        fileName: true,
        fileSize: true,
        category: true,
        author: true,
        publishedAt: true,
        displayOrder: true,
        downloadCount: true,
      },
    });

    return whitepaper;
  } catch (error) {
    console.error(`[getPublishedWhitepaperBySlug] Database query failed for slug "${slug}":`, error);
    throw new DatabaseQueryError(`Failed to fetch published whitepaper for slug "${slug}"`, error);
  }
}

/**
 * Fetch all published partners from PostgreSQL ordered by displayOrder.
 * Unpublished partners are strictly excluded.
 */
export async function getPublishedPartners(): Promise<PublicPartner[]> {
  "use cache";
  try {
    const partners = await prisma.partner.findMany({
      where: { isPublished: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        companyName: true,
        logoUrl: true,
        websiteUrl: true,
        displayOrder: true,
        isPublished: true,
        createdAt: true,
      },
    });

    return partners;
  } catch (error) {
    console.error("[getPublishedPartners] Database query failed:", error);
    throw new DatabaseQueryError("Failed to fetch published partners from database", error);
  }
}

