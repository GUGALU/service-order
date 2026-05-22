import { NextRequest, NextResponse } from "next/server";
import { deleteClient, updateClient } from "@/core/master-data";
import { handleApiError } from "@/app/api/_http";
import { readJsonBody, requireAuthenticatedUser } from "@/app/api/_request";
import { requireOptionalString, requireString } from "@/core/shared";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuthenticatedUser(request);
    const { id } = await params;
    const body = await readJsonBody<{
      name?: string;
      phone?: string;
      email?: string | null;
    }>(request);
    const client = await updateClient(id, {
      name: body.name ? requireString(body.name, "name") : undefined,
      phone: body.phone ? requireString(body.phone, "phone") : undefined,
      email:
        body.email === undefined
          ? undefined
          : requireOptionalString(body.email, "email"),
    });

    return NextResponse.json({ client });
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
    await deleteClient(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
