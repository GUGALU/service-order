import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/core/orders";
import { handleApiError } from "@/app/api/_http";
import { requireAuthenticatedUser } from "@/app/api/_request";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuthenticatedUser(request);
    const { id } = await params;
    const order = await getOrder(id);
    return NextResponse.json({ order });
  } catch (error) {
    return handleApiError(error);
  }
}
