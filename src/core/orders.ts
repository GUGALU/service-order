import { OrderStatus, ScheduleStatus } from "@prisma/client";
import { extendedPrisma } from "@/infra/database/prisma/client";
import { badRequest, conflict, notFound } from "./errors";
import { parsePagination } from "./shared";
import { serializeOrder } from "./serializers";

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["IN_PROGRESS", "CANCELED"],
  IN_PROGRESS: ["COMPLETED", "CANCELED"],
  COMPLETED: [],
  CANCELED: [],
};

export async function listOrders(query: URLSearchParams) {
  const { skip, take, page, pageSize } = parsePagination(query);
  const status = query.get("status") as OrderStatus | null;

  const where = status ? { status } : undefined;
  const [items, total] = await Promise.all([
    extendedPrisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        client: true,
        items: { include: { service: true } },
        history: { orderBy: { createdAt: "asc" } },
        schedules: {
          include: { template: true, trigger: true },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    extendedPrisma.order.count({ where }),
  ]);

  return {
    items: items.map(serializeOrder),
    page,
    pageSize,
    total,
  };
}

export async function createOrder(input: {
  clientId: string;
  serviceIds: string[];
  changedByUserId?: string;
}) {
  if (!input.serviceIds.length) {
    throw badRequest("At least one service is required.");
  }

  const [client, services] = await Promise.all([
    extendedPrisma.client.findUnique({ where: { id: input.clientId } }),
    extendedPrisma.service.findMany({
      where: { id: { in: input.serviceIds } },
    }),
  ]);

  if (!client) {
    throw notFound("Client not found.");
  }

  if (services.length !== input.serviceIds.length) {
    throw notFound("One or more services were not found.");
  }

  const totalAmount = services.reduce(
    (sum, service) => sum + Number(service.basePrice),
    0,
  );

  const createdOrder = await extendedPrisma.$transaction(
    async (transaction) => {
      const order = await transaction.order.create({
        data: {
          clientId: client.id,
          totalAmount: totalAmount.toFixed(2),
          items: {
            create: services.map((service) => ({
              serviceId: service.id,
              price: service.basePrice.toString(),
            })),
          },
          history: {
            create: {
              toStatus: "PENDING",
              changedByUserId: input.changedByUserId,
            },
          },
        },
      });

      return transaction.order.findUnique({
        where: { id: order.id },
        include: {
          client: true,
          items: { include: { service: true } },
          history: { orderBy: { createdAt: "asc" } },
          schedules: {
            include: { template: true, trigger: true },
            orderBy: { createdAt: "asc" },
          },
        },
      });
    },
  );

  if (!createdOrder) {
    throw conflict("Unable to create order.");
  }

  return serializeOrder(createdOrder);
}

export async function getOrder(id: string) {
  const order = await extendedPrisma.order.findUnique({
    where: { id },
    include: {
      client: true,
      items: { include: { service: true } },
      history: { orderBy: { createdAt: "asc" } },
      schedules: {
        include: { template: true, trigger: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!order) {
    throw notFound("Order not found.");
  }

  return serializeOrder(order);
}

export async function changeOrderStatus(input: {
  orderId: string;
  status: OrderStatus;
  reason?: string;
  changedByUserId?: string;
}) {
  const order = await extendedPrisma.order.findUnique({
    where: { id: input.orderId },
  });
  if (!order) {
    throw notFound("Order not found.");
  }

  const allowedStatuses = ALLOWED_TRANSITIONS[order.status];
  if (!allowedStatuses.includes(input.status)) {
    throw badRequest(
      `Invalid status transition from ${order.status} to ${input.status}.`,
    );
  }

  if (input.status === "CANCELED" && !input.reason) {
    throw badRequest("A cancellation reason is required.");
  }

  const updatedOrder = await extendedPrisma.$transaction(
    async (transaction) => {
      const nextOrder = await transaction.order.update({
        where: { id: input.orderId },
        data: {
          status: input.status,
          cancellationReason: input.status === "CANCELED" ? input.reason : null,
        },
      });

      await transaction.orderStatusHistory.create({
        data: {
          orderId: nextOrder.id,
          fromStatus: order.status,
          toStatus: input.status,
          reason: input.reason,
          changedByUserId: input.changedByUserId,
        },
      });

      if (input.status === "COMPLETED") {
        const triggers = await transaction.followUpTrigger.findMany({
          where: { active: true },
          include: { template: true },
        });

        if (triggers.length) {
          await transaction.schedule.createMany({
            data: triggers.map((trigger) => ({
              orderId: nextOrder.id,
              templateId: trigger.templateId,
              triggerId: trigger.id,
              scheduledTo: new Date(Date.now() + trigger.delayMinutes * 60_000),
              status: "PENDING",
            })),
          });
        }
      }

      if (input.status === "COMPLETED" || input.status === "CANCELED") {
        await transaction.schedule.updateMany({
          where: { orderId: nextOrder.id, status: ScheduleStatus.PENDING },
          data: { status: ScheduleStatus.CANCELED },
        });
      }

      return transaction.order.findUnique({
        where: { id: nextOrder.id },
        include: {
          client: true,
          items: { include: { service: true } },
          history: { orderBy: { createdAt: "asc" } },
          schedules: {
            include: { template: true, trigger: true },
            orderBy: { createdAt: "asc" },
          },
        },
      });
    },
  );

  if (!updatedOrder) {
    throw conflict("Unable to update order.");
  }

  return serializeOrder(updatedOrder);
}
