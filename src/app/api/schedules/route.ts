import { NextRequest, NextResponse } from "next/server";
import { createSchedule, listSchedules } from "@/core/messaging";
import { handleApiError } from "@/app/api/_http";
import { readJsonBody, requireAuthenticatedUser } from "@/app/api/_request";
import { parseDate, requireOptionalString, requireString } from "@/core/shared";

export async function GET(request: NextRequest) {
  try {
    await requireAuthenticatedUser(request);
    const data = await listSchedules(new URL(request.url).searchParams);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuthenticatedUser(request);
    const body = await readJsonBody<{
      orderId: string;
      templateId: string;
      scheduledTo: string;
      triggerId?: string | null;
    }>(request);

    const schedule = await createSchedule({
      orderId: requireString(body.orderId, "orderId"),
      templateId: requireString(body.templateId, "templateId"),
      scheduledTo: parseDate(body.scheduledTo, "scheduledTo"),
      triggerId: requireOptionalString(body.triggerId, "triggerId"),
    });

    return NextResponse.json({ schedule }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
