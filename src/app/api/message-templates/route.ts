import { NextRequest, NextResponse } from "next/server";
import { createTemplate, listTemplates } from "@/core/messaging";
import { handleApiError } from "@/app/api/_http";
import { readJsonBody, requireAuthenticatedUser } from "@/app/api/_request";
import { requireString } from "@/core/shared";

export async function GET(request: NextRequest) {
  try {
    await requireAuthenticatedUser(request);
    const data = await listTemplates(new URL(request.url).searchParams);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuthenticatedUser(request);
    const body = await readJsonBody<{ name: string; content: string }>(request);
    const template = await createTemplate({
      name: requireString(body.name, "name"),
      content: requireString(body.content, "content"),
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
