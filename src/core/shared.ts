import { badRequest } from "./errors";

export const DEFAULT_PAGE_SIZE = 20;

export function parsePagination(searchParams: URLSearchParams) {
  const pageValue = Number(searchParams.get("page") ?? "1");
  const pageSizeValue = Number(
    searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE),
  );

  const page =
    Number.isFinite(pageValue) && pageValue > 0 ? Math.trunc(pageValue) : 1;
  const pageSize =
    Number.isFinite(pageSizeValue) && pageSizeValue > 0
      ? Math.min(Math.trunc(pageSizeValue), 100)
      : DEFAULT_PAGE_SIZE;

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

export function requireString(value: unknown, fieldName: string) {
  if (typeof value !== "string") {
    throw badRequest(`Field \"${fieldName}\" must be a string.`);
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    throw badRequest(`Field \"${fieldName}\" is required.`);
  }

  return trimmedValue;
}

export function requireOptionalString(value: unknown, fieldName: string) {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw badRequest(`Field \"${fieldName}\" must be a string.`);
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

export function requireNumber(value: unknown, fieldName: string) {
  const parsedValue = typeof value === "string" ? Number(value) : value;
  if (typeof parsedValue !== "number" || !Number.isFinite(parsedValue)) {
    throw badRequest(`Field \"${fieldName}\" must be a number.`);
  }

  return parsedValue;
}

export function requirePositiveInteger(value: unknown, fieldName: string) {
  const parsedValue = requireNumber(value, fieldName);
  const integerValue = Math.trunc(parsedValue);
  if (integerValue <= 0) {
    throw badRequest(`Field \"${fieldName}\" must be greater than zero.`);
  }

  return integerValue;
}

export function parseDecimal(value: unknown, fieldName: string) {
  const parsedValue = typeof value === "string" ? Number(value) : value;
  if (typeof parsedValue !== "number" || Number.isNaN(parsedValue)) {
    throw badRequest(`Field \"${fieldName}\" must be a valid number.`);
  }

  return parsedValue.toFixed(2);
}

export function parseDate(value: unknown, fieldName: string) {
  const dateValue =
    typeof value === "string" || value instanceof Date
      ? new Date(value)
      : new Date(NaN);
  if (Number.isNaN(dateValue.getTime())) {
    throw badRequest(`Field \"${fieldName}\" must be a valid date.`);
  }

  return dateValue;
}

export function parseStringArray(value: unknown, fieldName: string) {
  if (!Array.isArray(value)) {
    throw badRequest(`Field \"${fieldName}\" must be an array.`);
  }

  return value.map((item) => requireString(item, fieldName));
}
