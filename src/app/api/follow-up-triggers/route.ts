import { NextRequest, NextResponse } from "next/server";
import { createTrigger, listTriggers } from "@/core/messaging";
import { handleApiError } from "@/app/api/_http";
import { readJsonBody, requireAuthenticatedUser } from "@/app/api/_request";
import { requirePositiveInteger, requireString } from "@/core/shared";

export async function GET(request: NextRequest) {
  try {
    await requireAuthenticatedUser(request);
    const data = await listTriggers(new URL(request.url).searchParams);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuthenticatedUser(request);
    const body = await readJsonBody<{
      name: string;
      templateId: string;
      delayMinutes: number;
      active?: boolean;
    }>(request);
    const trigger = await createTrigger({
      name: requireString(body.name, "name"),
      templateId: requireString(body.templateId, "templateId"),
      delayMinutes: requirePositiveInteger(body.delayMinutes, "delayMinutes"),
      active: body.active,
    });

    return NextResponse.json({ trigger }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
