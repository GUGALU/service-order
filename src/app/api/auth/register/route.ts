import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/core/auth";
import { handleApiError } from "@/app/api/_http";
import { readJsonBody } from "@/app/api/_request";

export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody<{
      name: string;
      email: string;
      password: string;
    }>(request);
    const user = await registerUser({
      name: body.name,
      email: body.email,
      password: body.password,
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
