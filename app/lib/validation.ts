import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Please provide a valid email address").max(100),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const TestimonialSchema = z.object({
  authorName: z.string().min(2, "Author name is required").max(100),
  jobTitle: z.string().min(2, "Job title is required").max(100),
  companyName: z.string().min(2, "Company name is required").max(100),
  quote: z.string().min(10, "Quote must be at least 10 characters").max(2000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  authorPortrait: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  companyLogo: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  displayOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const TeamMemberSchema = z.object({
  name: z.string().min(2, "Full name is required").max(100),
  jobTitle: z.string().min(2, "Job title is required").max(100),
  bio: z.string().max(1000).nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  linkedinUrl: z
    .string()
    .url("Must be a valid URL")
    .regex(/^https:\/\/(www\.)?linkedin\.com\/.+/i, "Must be a valid LinkedIn profile URL")
    .nullable()
    .optional()
    .or(z.literal("")),
  twitterUrl: z
    .string()
    .url("Must be a valid URL")
    .nullable()
    .optional()
    .or(z.literal("")),
  otherUrl: z
    .string()
    .url("Must be a valid URL")
    .nullable()
    .optional()
    .or(z.literal("")),
  displayOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const WhitepaperSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  shortDescription: z.string().min(10, "Short description is required").max(500),
  longDescription: z.string().max(5000).nullable().optional(),
  coverImageUrl: z.string().nullable().optional(),
  fileKey: z.string().min(3, "PDF file reference is required"),
  fileName: z.string().min(1, "File name is required"),
  fileSize: z.coerce.number().int().positive("File size must be positive"),
  category: z.string().max(100).nullable().optional(),
  author: z.string().max(100).nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  displayOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});
export const PartnerSchema = z.object({
  companyName: z.string().min(2, "Company name is required").max(100),
  logoUrl: z.string().min(1, "Partner logo is required"),
  websiteUrl: z
    .string()
    .url("Must be a valid URL")
    .nullable()
    .optional()
    .or(z.literal("")),
  displayOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(10, "New password must be at least 10 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
