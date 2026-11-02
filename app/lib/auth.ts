import { cookies, headers } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const SESSION_COOKIE_NAME = "privitty_admin_session";
const SESSION_DURATION_DAYS = 7;

// In-memory rate limiter for login attempts: max 5 failed attempts per IP per 15 minutes
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const loginRateLimits = new Map<string, RateLimitRecord>();

export function checkLoginRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = loginRateLimits.get(ip);

  if (!record) return { allowed: true };

  if (now > record.resetAt) {
    loginRateLimits.delete(ip);
    return { allowed: true };
  }

  if (record.count >= 5) {
    const waitSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string) {
  const now = Date.now();
  const record = loginRateLimits.get(ip);
  if (!record || now > record.resetAt) {
    loginRateLimits.set(ip, {
      count: 1,
      resetAt: now + 15 * 60 * 1000, // 15 minutes window
    });
  } else {
    record.count += 1;
  }
}

export function resetLoginRateLimit(ip: string) {
  loginRateLimits.delete(ip);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface AdminSessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = headerList.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

export async function createAdminSession(
  adminUserId: string
): Promise<{ token: string; expiresAt: Date }> {
  const sessionToken = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.adminSession.create({
    data: {
      sessionToken,
      adminUserId,
      expiresAt,
    },
  });

  return { token: sessionToken, expiresAt };
}

export async function getAdminSession(): Promise<AdminSessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return null;

    const session = await prisma.adminSession.findUnique({
      where: { sessionToken: token },
      include: {
        adminUser: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    if (!session) return null;

    if (new Date() > session.expiresAt) {
      await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    if (!session.adminUser || !session.adminUser.isActive) {
      return null;
    }

    return session.adminUser;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "digest" in error && error.digest === "HANGING_PROMISE_REJECTION") {
      return null;
    }
    console.error("Error retrieving admin session:", error);
    return null;
  }
}

export async function requireAdminSession(): Promise<AdminSessionUser> {
  const user = await getAdminSession();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function clearAdminSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      await prisma.adminSession.deleteMany({
        where: { sessionToken: token },
      });
    }
  } catch (err) {
    console.error("Error clearing admin session:", err);
  }
}

export async function recordAuditLog(params: {
  adminEmail: string;
  adminUserId?: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: Record<string, unknown> | string;
}) {
  try {
    const ip = await getClientIp();
    const headerList = await headers();
    const userAgent = headerList.get("user-agent") || undefined;

    const detailsString =
      typeof params.details === "object"
        ? JSON.stringify(params.details)
        : params.details;

    await prisma.auditLog.create({
      data: {
        adminEmail: params.adminEmail,
        adminUserId: params.adminUserId,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        details: detailsString,
        ipAddress: ip,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to record audit log:", error);
  }
}
