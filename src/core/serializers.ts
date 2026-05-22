import type {
  Client,
  FollowUpTrigger,
  MessageTemplate,
  Order,
  OrderItem,
  OrderStatusHistory,
  Schedule,
  Service,
  User,
} from "@prisma/client";

function decimalToString(value: unknown) {
  if (value && typeof value === "object" && "toString" in value) {
    return value.toString();
  }

  return value;
}

export function serializeUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function serializeClient(client: Client) {
  return {
    id: client.id,
    name: client.name,
    phone: client.phone,
    email: client.email,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  };
}

export function serializeService(service: Service) {
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    basePrice: decimalToString(service.basePrice),
    estimatedTime: service.estimatedTime,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
}

export function serializeOrderItem(
  item: OrderItem & { service?: Service | null },
) {
  return {
    id: item.id,
    orderId: item.orderId,
    serviceId: item.serviceId,
    price: decimalToString(item.price),
    service: item.service ? serializeService(item.service) : undefined,
  };
}

export function serializeOrderStatusHistory(history: OrderStatusHistory) {
  return {
    id: history.id,
    orderId: history.orderId,
    fromStatus: history.fromStatus,
    toStatus: history.toStatus,
    reason: history.reason,
    changedByUserId: history.changedByUserId,
    createdAt: history.createdAt,
  };
}

export function serializeSchedule(
  schedule: Schedule & {
    template?: MessageTemplate | null;
    trigger?: FollowUpTrigger | null;
  },
) {
  return {
    id: schedule.id,
    orderId: schedule.orderId,
    templateId: schedule.templateId,
    triggerId: schedule.triggerId,
    scheduledTo: schedule.scheduledTo,
    status: schedule.status,
    errorLog: schedule.errorLog,
    processedAt: schedule.processedAt,
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
    template: schedule.template
      ? serializeTemplate(schedule.template)
      : undefined,
    trigger: schedule.trigger ? serializeTrigger(schedule.trigger) : undefined,
  };
}

export function serializeTemplate(template: MessageTemplate) {
  return {
    id: template.id,
    name: template.name,
    content: template.content,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
  };
}

export function serializeTrigger(
  trigger: FollowUpTrigger & { template?: MessageTemplate | null },
) {
  return {
    id: trigger.id,
    name: trigger.name,
    templateId: trigger.templateId,
    delayMinutes: trigger.delayMinutes,
    active: trigger.active,
    createdAt: trigger.createdAt,
    updatedAt: trigger.updatedAt,
    template: trigger.template
      ? serializeTemplate(trigger.template)
      : undefined,
  };
}

export function serializeOrder(
  order: Order & {
    client?: Client | null;
    items?: (OrderItem & { service?: Service | null })[];
    history?: OrderStatusHistory[];
    schedules?: (Schedule & {
      template?: MessageTemplate | null;
      trigger?: FollowUpTrigger | null;
    })[];
  },
) {
  return {
    id: order.id,
    clientId: order.clientId,
    status: order.status,
    totalAmount: decimalToString(order.totalAmount),
    cancellationReason: order.cancellationReason,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    client: order.client ? serializeClient(order.client) : undefined,
    items: order.items ? order.items.map(serializeOrderItem) : undefined,
    history: order.history
      ? order.history.map(serializeOrderStatusHistory)
      : undefined,
    schedules: order.schedules
      ? order.schedules.map(serializeSchedule)
      : undefined,
  };
}
