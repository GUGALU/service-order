import { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/infra/auth/session";
import { requireSession } from "@/core/auth";
import { unauthorized } from "@/core/errors";

export async function requireAuthenticatedUser(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    throw unauthorized();
  }

  const session = await requireSession(sessionToken);
  return session.user;
}

export async function readJsonBody<T>(request: NextRequest): Promise<T> {
  return (await request.json()) as T;
}
