import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/core/auth";
import { handleApiError } from "@/app/api/_http";
import { readJsonBody } from "@/app/api/_request";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/infra/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody<{ email: string; password: string }>(
      request,
    );
    const result = await loginUser({
      email: body.email,
      password: body.password,
    });

    const response = NextResponse.json({ user: result.user });
    response.cookies.set(SESSION_COOKIE_NAME, result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
