import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/api/_http";
import { requireAuthenticatedUser } from "@/app/api/_request";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request);
    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
