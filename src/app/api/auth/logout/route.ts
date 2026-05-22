import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/api/_http";
import { SESSION_COOKIE_NAME } from "@/infra/auth/session";
import { logoutSession } from "@/core/auth";

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    await logoutSession(sessionToken);

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
