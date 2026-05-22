import { NextRequest, NextResponse } from "next/server";
import { deleteTrigger, updateTrigger } from "@/core/messaging";
import { handleApiError } from "@/app/api/_http";
import { readJsonBody, requireAuthenticatedUser } from "@/app/api/_request";
import { requirePositiveInteger, requireString } from "@/core/shared";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuthenticatedUser(request);
    const { id } = await params;
    const body = await readJsonBody<{
      name?: string;
      templateId?: string;
      delayMinutes?: number;
      active?: boolean;
    }>(request);
    const trigger = await updateTrigger(id, {
      name: body.name ? requireString(body.name, "name") : undefined,
      templateId: body.templateId
        ? requireString(body.templateId, "templateId")
        : undefined,
      delayMinutes: body.delayMinutes
        ? requirePositiveInteger(body.delayMinutes, "delayMinutes")
        : undefined,
      active: body.active,
    });

    return NextResponse.json({ trigger });
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
    await deleteTrigger(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
