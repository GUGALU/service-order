# Concerns

## 1. No domain layer yet

**Evidence:** the repository only has `src/app/page.tsx`, `src/app/layout.tsx`, and `src/infra/database/prisma/client.ts`.
**Risk:** the target Clean Architecture split is not implemented, so business rules can easily leak into the UI layer.
**Fix approach:** add `src/core` use cases and repositories before building feature routes.

## 2. Prisma soft-delete logic is incomplete

**Evidence:** `src/infra/database/prisma/client.ts` hard-codes soft-delete overrides only for `client` and `service`.
**Risk:** other models will not share the same deletion behavior, which can create inconsistent data access rules.
**Fix approach:** move soft-delete behavior into repositories or a reusable Prisma extension strategy.

## 3. Query extension typing uses `any`

**Evidence:** `client.ts` uses `findMany(params: any)`, `findFirst(params: any)`, and similar hooks.
**Risk:** type safety is reduced in the data layer despite strict TypeScript settings.
**Fix approach:** replace `any` with Prisma extension types or isolate the custom query helpers behind typed repository methods.

## 4. Missing audit/history tables for required features

**Evidence:** `prisma/schema.prisma` has `Order`, `Schedule`, and `MessageTemplate`, but no order status history or schedule event log model.
**Risk:** RF06 and RF11 cannot be satisfied cleanly without additional persistence.
**Fix approach:** add dedicated history entities when implementing order details and messaging logs.

## 5. No automated tests or fixtures

**Evidence:** `package.json` only exposes `dev`, `build`, `start`, and `lint`.
**Risk:** future business-rule work will be harder to verify and safer changes will be slower.
**Fix approach:** add domain and route tests alongside the first use cases.
