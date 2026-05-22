import { NextRequest, NextResponse } from "next/server";
import { createOrder, listOrders } from "@/core/orders";
import { handleApiError } from "@/app/api/_http";
import { readJsonBody, requireAuthenticatedUser } from "@/app/api/_request";
import { parseStringArray, requireString } from "@/core/shared";

export async function GET(request: NextRequest) {
  try {
    await requireAuthenticatedUser(request);
    const data = await listOrders(new URL(request.url).searchParams);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = await readJsonBody<{ clientId: string; serviceIds: string[] }>(
      request,
    );
    const order = await createOrder({
      clientId: requireString(body.clientId, "clientId"),
      serviceIds: parseStringArray(body.serviceIds, "serviceIds"),
      changedByUserId: user.id,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
