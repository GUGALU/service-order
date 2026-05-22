import { NextRequest, NextResponse } from "next/server";
import { deleteTemplate, updateTemplate } from "@/core/messaging";
import { handleApiError } from "@/app/api/_http";
import { readJsonBody, requireAuthenticatedUser } from "@/app/api/_request";
import { requireString } from "@/core/shared";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuthenticatedUser(request);
    const { id } = await params;
    const body = await readJsonBody<{ name?: string; content?: string }>(
      request,
    );
    const template = await updateTemplate(id, {
      name: body.name ? requireString(body.name, "name") : undefined,
      content: body.content
        ? requireString(body.content, "content")
        : undefined,
    });

    return NextResponse.json({ template });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuthenticatedUser(request);
    const { id } = await params;
    await deleteTemplate(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
