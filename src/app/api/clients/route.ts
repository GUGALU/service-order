import { NextRequest, NextResponse } from "next/server";
import { createClient, listClients } from "@/core/master-data";
import { handleApiError } from "@/app/api/_http";
import { readJsonBody, requireAuthenticatedUser } from "@/app/api/_request";
import { requireOptionalString, requireString } from "@/core/shared";

export async function GET(request: NextRequest) {
  try {
    await requireAuthenticatedUser(request);
    const data = await listClients(new URL(request.url).searchParams);
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
      phone: string;
      email?: string | null;
    }>(request);
    const createdClient = await createClient({
      name: requireString(body.name, "name"),
      phone: requireString(body.phone, "phone"),
      email: requireOptionalString(body.email, "email"),
    });

    return NextResponse.json({ client: createdClient }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
