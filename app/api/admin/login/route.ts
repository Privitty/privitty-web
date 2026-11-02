import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import {
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginRateLimit,
  verifyPassword,
  createAdminSession,
  recordAuditLog,
  getClientIp,
  SESSION_COOKIE_NAME,
} from "@/app/lib/auth";
import { LoginSchema } from "@/app/lib/validation";
import prisma from "@/app/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = await getClientIp();
    const rateCheck = checkLoginRateLimit(ip);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please wait ${rateCheck.waitSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parseResult = LoginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Invalid credentials format" },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    const admin = await prisma.adminUser.findFirst({
      where: {
        email: { equals: email.trim().toLowerCase(), mode: "insensitive" },
      },
    });

    if (!admin || !admin.isActive) {
      recordFailedLogin(ip);
      await recordAuditLog({
        adminEmail: email.toLowerCase(),
        action: "LOGIN_FAILED",
        targetType: "AUTH",
        details: { reason: "User not found or inactive", ip },
      });
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const passwordValid = await verifyPassword(password, admin.passwordHash);
    if (!passwordValid) {
      recordFailedLogin(ip);
      await recordAuditLog({
        adminEmail: admin.email,
        adminUserId: admin.id,
        action: "LOGIN_FAILED",
        targetType: "AUTH",
        details: { reason: "Incorrect password", ip },
      });
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Success: reset rate limit & issue session
    resetLoginRateLimit(ip);
    const session = await createAdminSession(admin.id);

    await recordAuditLog({
      adminEmail: admin.email,
      adminUserId: admin.id,
      action: "LOGIN_SUCCESS",
      targetType: "AUTH",
      details: { ip },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: session.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: session.expiresAt,
    });
    return response;
  } catch (err: unknown) {
    console.error("Login route error:", err);
    return NextResponse.json({ error: loginFailureMessage(err) }, { status: 500 });
  }
}

function loginFailureMessage(err: unknown): string {
  const message = err instanceof Error ? err.message : "";

  if (
    err instanceof Prisma.PrismaClientInitializationError ||
    message.includes("Query Engine") ||
    message.includes("libquery_engine")
  ) {
    return "The admin service could not start its database client. Redeploy so the Amplify build includes the Prisma query engine.";
  }

  if (!process.env.DATABASE_URL) {
    return "DATABASE_URL is missing on the server. Add it in Amplify environment variables and redeploy.";
  }

  if (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    message.includes("Can't reach database server") ||
    message.includes("Environment variable not found: DATABASE_URL")
  ) {
    return "The server could not reach the database. Check that DATABASE_URL is the pooled Supabase URL and that the Amplify app can open that connection.";
  }

  return "Internal authentication error";
}
