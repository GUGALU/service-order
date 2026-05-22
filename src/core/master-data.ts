import { Prisma } from "@prisma/client";
import { extendedPrisma } from "@/infra/database/prisma/client";
import { conflict, notFound } from "./errors";
import { parsePagination } from "./shared";
import { serializeClient, serializeService } from "./serializers";

export async function listClients(query: URLSearchParams) {
  const { skip, take, page, pageSize } = parsePagination(query);
  const search = query.get("search")?.trim() ?? "";

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [items, total] = await Promise.all([
    extendedPrisma.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    extendedPrisma.client.count({ where }),
  ]);

  return {
    items: items.map(serializeClient),
    page,
    pageSize,
    total,
  };
}

export async function createClient(input: {
  name: string;
  phone: string;
  email?: string;
}) {
  const existingClient = await extendedPrisma.client.findUnique({
    where: { phone: input.phone },
  });
  if (existingClient) {
    throw conflict("A client with this phone number already exists.");
  }

  const createdClient = await extendedPrisma.client.create({
    data: {
      name: input.name,
      phone: input.phone,
      email: input.email,
    },
  });

  return serializeClient(createdClient);
}

export async function updateClient(
  id: string,
  input: { name?: string; phone?: string; email?: string },
) {
  const client = await extendedPrisma.client.findUnique({ where: { id } });
  if (!client) {
    throw notFound("Client not found.");
  }

  if (input.phone && input.phone !== client.phone) {
    const existingPhone = await extendedPrisma.client.findUnique({
      where: { phone: input.phone },
    });
    if (existingPhone) {
      throw conflict("A client with this phone number already exists.");
    }
  }

  const updatedClient = await extendedPrisma.client.update({
    where: { id },
    data: {
      name: input.name ?? client.name,
      phone: input.phone ?? client.phone,
      email: input.email ?? client.email,
    },
  });

  return serializeClient(updatedClient);
}

export async function deleteClient(id: string) {
  try {
    await extendedPrisma.client.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw conflict(
        "This client cannot be deleted because it is linked to orders.",
      );
    }

    throw error;
  }
}

export async function listServices(query: URLSearchParams) {
  const { skip, take, page, pageSize } = parsePagination(query);
  const search = query.get("search")?.trim() ?? "";

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [items, total] = await Promise.all([
    extendedPrisma.service.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    extendedPrisma.service.count({ where }),
  ]);

  return {
    items: items.map(serializeService),
    page,
    pageSize,
    total,
  };
}

export async function createService(input: {
  name: string;
  description?: string;
  basePrice: string;
  estimatedTime: number;
}) {
  const createdService = await extendedPrisma.service.create({
    data: {
      name: input.name,
      description: input.description,
      basePrice: input.basePrice,
      estimatedTime: input.estimatedTime,
    },
  });

  return serializeService(createdService);
}

export async function updateService(
  id: string,
  input: {
    name?: string;
    description?: string;
    basePrice?: string;
    estimatedTime?: number;
  },
) {
  const service = await extendedPrisma.service.findUnique({ where: { id } });
  if (!service) {
    throw notFound("Service not found.");
  }

  const updatedService = await extendedPrisma.service.update({
    where: { id },
    data: {
      name: input.name ?? service.name,
      description: input.description ?? service.description,
      basePrice: input.basePrice ?? service.basePrice,
      estimatedTime: input.estimatedTime ?? service.estimatedTime,
    },
  });

  return serializeService(updatedService);
}

export async function deleteService(id: string) {
  try {
    await extendedPrisma.service.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw conflict(
        "This service cannot be deleted because it is linked to orders.",
      );
    }

    throw error;
  }
}
