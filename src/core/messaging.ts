import { ScheduleStatus } from "@prisma/client";
import { extendedPrisma } from "@/infra/database/prisma/client";
import { badRequest, conflict, notFound } from "./errors";
import { parsePagination } from "./shared";
import {
  serializeSchedule,
  serializeTemplate,
  serializeTrigger,
} from "./serializers";

export async function listTemplates(query: URLSearchParams) {
  const { skip, take, page, pageSize } = parsePagination(query);
  const search = query.get("search")?.trim() ?? "";

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { content: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [items, total] = await Promise.all([
    extendedPrisma.messageTemplate.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    extendedPrisma.messageTemplate.count({ where }),
  ]);

  return {
    items: items.map(serializeTemplate),
    page,
    pageSize,
    total,
  };
}

export async function createTemplate(input: { name: string; content: string }) {
  const createdTemplate = await extendedPrisma.messageTemplate.create({
    data: input,
  });

  return serializeTemplate(createdTemplate);
}

export async function updateTemplate(
  id: string,
  input: { name?: string; content?: string },
) {
  const template = await extendedPrisma.messageTemplate.findUnique({
    where: { id },
  });
  if (!template) {
    throw notFound("Template not found.");
  }

  const updatedTemplate = await extendedPrisma.messageTemplate.update({
    where: { id },
    data: {
      name: input.name ?? template.name,
      content: input.content ?? template.content,
    },
  });

  return serializeTemplate(updatedTemplate);
}

export async function deleteTemplate(id: string) {
  await extendedPrisma.messageTemplate.delete({ where: { id } });
}

export async function listSchedules(query: URLSearchParams) {
  const { skip, take, page, pageSize } = parsePagination(query);
  const orderId = query.get("orderId")?.trim();
  const status = query.get("status") as ScheduleStatus | null;

  const where = {
    ...(orderId ? { orderId } : {}),
    ...(status ? { status } : {}),
  };

  const [items, total] = await Promise.all([
    extendedPrisma.schedule.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: { template: true, trigger: true },
    }),
    extendedPrisma.schedule.count({ where }),
  ]);

  return {
    items: items.map(serializeSchedule),
    page,
    pageSize,
    total,
  };
}

export async function createSchedule(input: {
  orderId: string;
  templateId: string;
  scheduledTo: Date;
  triggerId?: string;
}) {
  if (input.scheduledTo.getTime() <= Date.now()) {
    throw badRequest("Schedules must be created for a future date.");
  }

  const [order, template, trigger] = await Promise.all([
    extendedPrisma.order.findUnique({ where: { id: input.orderId } }),
    extendedPrisma.messageTemplate.findUnique({
      where: { id: input.templateId },
    }),
    input.triggerId
      ? extendedPrisma.followUpTrigger.findUnique({
          where: { id: input.triggerId },
        })
      : Promise.resolve(null),
  ]);

  if (!order) {
    throw notFound("Order not found.");
  }

  if (!template) {
    throw notFound("Template not found.");
  }

  if (input.triggerId && !trigger) {
    throw notFound("Trigger not found.");
  }

  const createdSchedule = await extendedPrisma.schedule.create({
    data: {
      orderId: order.id,
      templateId: template.id,
      triggerId: input.triggerId,
      scheduledTo: input.scheduledTo,
      status: ScheduleStatus.PENDING,
    },
    include: { template: true, trigger: true },
  });

  return serializeSchedule(createdSchedule);
}

export async function processSchedule(input: {
  scheduleId: string;
  simulateFailure?: boolean;
}) {
  const schedule = await extendedPrisma.schedule.findUnique({
    where: { id: input.scheduleId },
    include: { template: true, trigger: true },
  });

  if (!schedule) {
    throw notFound("Schedule not found.");
  }

  if (schedule.status !== ScheduleStatus.PENDING) {
    throw conflict("Only pending schedules can be processed.");
  }

  const processedAt = new Date();

  const updatedSchedule = await extendedPrisma.schedule.update({
    where: { id: schedule.id },
    data: input.simulateFailure
      ? {
          status: ScheduleStatus.FAILED,
          errorLog: "Simulated dispatch failure.",
          processedAt,
        }
      : {
          status: ScheduleStatus.SENT,
          errorLog: null,
          processedAt,
        },
    include: { template: true, trigger: true },
  });

  return serializeSchedule(updatedSchedule);
}

export async function listTriggers(query: URLSearchParams) {
  const { skip, take, page, pageSize } = parsePagination(query);
  const search = query.get("search")?.trim() ?? "";

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          {
            template: {
              name: { contains: search, mode: "insensitive" as const },
            },
          },
        ],
      }
    : undefined;

  const [items, total] = await Promise.all([
    extendedPrisma.followUpTrigger.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: { template: true },
    }),
    extendedPrisma.followUpTrigger.count({ where }),
  ]);

  return {
    items: items.map(serializeTrigger),
    page,
    pageSize,
    total,
  };
}

export async function createTrigger(input: {
  name: string;
  templateId: string;
  delayMinutes: number;
  active?: boolean;
}) {
  const template = await extendedPrisma.messageTemplate.findUnique({
    where: { id: input.templateId },
  });
  if (!template) {
    throw notFound("Template not found.");
  }

  const createdTrigger = await extendedPrisma.followUpTrigger.create({
    data: {
      name: input.name,
      templateId: template.id,
      delayMinutes: input.delayMinutes,
      active: input.active ?? true,
    },
    include: { template: true },
  });

  return serializeTrigger(createdTrigger);
}

export async function updateTrigger(
  id: string,
  input: {
    name?: string;
    templateId?: string;
    delayMinutes?: number;
    active?: boolean;
  },
) {
  const trigger = await extendedPrisma.followUpTrigger.findUnique({
    where: { id },
  });
  if (!trigger) {
    throw notFound("Trigger not found.");
  }

  if (input.templateId) {
    const template = await extendedPrisma.messageTemplate.findUnique({
      where: { id: input.templateId },
    });
    if (!template) {
      throw notFound("Template not found.");
    }
  }

  const updatedTrigger = await extendedPrisma.followUpTrigger.update({
    where: { id },
    data: {
      name: input.name ?? trigger.name,
      templateId: input.templateId ?? trigger.templateId,
      delayMinutes: input.delayMinutes ?? trigger.delayMinutes,
      active: input.active ?? trigger.active,
    },
    include: { template: true },
  });

  return serializeTrigger(updatedTrigger);
}

export async function deleteTrigger(id: string) {
  await extendedPrisma.followUpTrigger.delete({ where: { id } });
}
