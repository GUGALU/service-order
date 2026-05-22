import { NextRequest, NextResponse } from "next/server";
import { createService, listServices } from "@/core/master-data";
import { handleApiError } from "@/app/api/_http";
import { readJsonBody, requireAuthenticatedUser } from "@/app/api/_request";
import {
  requireOptionalString,
  requirePositiveInteger,
  requireString,
} from "@/core/shared";

export async function GET(request: NextRequest) {
  try {
    await requireAuthenticatedUser(request);
    const data = await listServices(new URL(request.url).searchParams);
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
      description?: string | null;
      basePrice: string;
      estimatedTime: number;
    }>(request);

    const service = await createService({
      name: requireString(body.name, "name"),
      description: requireOptionalString(body.description, "description"),
      basePrice: requireString(body.basePrice, "basePrice"),
      estimatedTime: requirePositiveInteger(
        body.estimatedTime,
        "estimatedTime",
      ),
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
