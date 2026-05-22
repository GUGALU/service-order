import { extendedPrisma } from "@/infra/database/prisma/client";
import { SESSION_MAX_AGE_SECONDS } from "@/infra/auth/session";
import {
  createSessionToken,
  hashPassword,
  hashToken,
  verifyPassword,
} from "@/infra/auth/crypto";
import { conflict, unauthorized } from "./errors";
import { serializeUser } from "./serializers";

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await extendedPrisma.user.findUnique({
    where: { email: input.email },
  });
  if (existingUser) {
    throw conflict("A user with this email already exists.");
  }

  const createdUser = await extendedPrisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashPassword(input.password),
    },
  });

  return serializeUser(createdUser);
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await extendedPrisma.user.findUnique({
    where: { email: input.email },
  });
  if (!user || !verifyPassword(input.password, user.password)) {
    throw unauthorized("Invalid email or password.");
  }

  const sessionToken = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await extendedPrisma.session.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(sessionToken),
      expiresAt,
    },
  });

  return {
    token: sessionToken,
    expiresAt,
    user: serializeUser(user),
  };
}

export async function resolveSessionFromToken(
  token: string | undefined | null,
) {
  if (!token) {
    return null;
  }

  const session = await extendedPrisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await extendedPrisma.session
      .delete({ where: { id: session.id } })
      .catch(() => undefined);
    return null;
  }

  return {
    session,
    user: serializeUser(session.user),
  };
}

export async function logoutSession(token: string | undefined | null) {
  if (!token) {
    return;
  }

  await extendedPrisma.session.deleteMany({
    where: { tokenHash: hashToken(token) },
  });
}

export async function requireSession(token: string | undefined | null) {
  const session = await resolveSessionFromToken(token);
  if (!session) {
    throw unauthorized();
  }

  return session;
}
