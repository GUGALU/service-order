import { NextResponse } from "next/server";
import { AppError } from "@/core/errors";

export function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return jsonResponse({ error: error.message }, error.statusCode);
  }

  console.error(error);
  return jsonResponse({ error: "Internal server error" }, 500);
}
