import { NextRequest, NextResponse } from "next/server";
import { processSchedule } from "@/core/messaging";
import { handleApiError } from "@/app/api/_http";
import { readJsonBody, requireAuthenticatedUser } from "@/app/api/_request";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuthenticatedUser(request);
    const { id } = await params;
    const body = await readJsonBody<{ simulateFailure?: boolean }>(request);
    const schedule = await processSchedule({
      scheduleId: id,
      simulateFailure: body.simulateFailure,
    });
    return NextResponse.json({ schedule });
  } catch (error) {
    return handleApiError(error);
  }
}
