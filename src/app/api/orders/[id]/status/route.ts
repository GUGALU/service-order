import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { changeOrderStatus } from "@/core/orders";
import { handleApiError } from "@/app/api/_http";
import { readJsonBody, requireAuthenticatedUser } from "@/app/api/_request";
import { badRequest, requireString } from "@/core/errors";

const ALLOWED_STATUSES: OrderStatus[] = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELED",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuthenticatedUser(request);
    const { id } = await params;
    const body = await readJsonBody<{
      status: OrderStatus;
      reason?: string | null;
    }>(request);

    if (!ALLOWED_STATUSES.includes(body.status)) {
      throw badRequest("Invalid order status.");
    }

    const order = await changeOrderStatus({
      orderId: id,
      status: body.status,
      reason: body.reason ? requireString(body.reason, "reason") : undefined,
      changedByUserId: user.id,
    });

    return NextResponse.json({ order });
  } catch (error) {
    return handleApiError(error);
  }
}
