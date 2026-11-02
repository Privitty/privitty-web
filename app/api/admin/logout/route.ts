import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  getAdminSession,
  clearAdminSession,
  recordAuditLog,
} from "@/app/lib/auth";

export async function POST() {
  const admin = await getAdminSession();
  if (admin) {
    await recordAuditLog({
      adminEmail: admin.email,
      adminUserId: admin.id,
      action: "LOGOUT",
      targetType: "AUTH",
    });
  }
  await clearAdminSession();
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
