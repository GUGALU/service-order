import { NextRequest, NextResponse } from "next/server";
import { deleteService, updateService } from "@/core/master-data";
import { handleApiError } from "@/app/api/_http";
import { readJsonBody, requireAuthenticatedUser } from "@/app/api/_request";
import {
  requireOptionalString,
  requirePositiveInteger,
  requireString,
} from "@/core/shared";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuthenticatedUser(request);
    const { id } = await params;
    const body = await readJsonBody<{
      name?: string;
      description?: string | null;
      basePrice?: string;
      estimatedTime?: number;
    }>(request);

    const service = await updateService(id, {
      name: body.name ? requireString(body.name, "name") : undefined,
      description:
        body.description === undefined
          ? undefined
          : requireOptionalString(body.description, "description"),
      basePrice: body.basePrice
        ? requireString(body.basePrice, "basePrice")
        : undefined,
      estimatedTime: body.estimatedTime
        ? requirePositiveInteger(body.estimatedTime, "estimatedTime")
        : undefined,
    });

    return NextResponse.json({ service });
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
    await deleteService(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
