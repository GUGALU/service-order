# State

## Decisions

- Use English for code, schema names, and route names.
- Keep business rules in core use cases, not in API routes.
- Treat the current repository as a scaffold that will be grown into a layered architecture.

## Open Items

- Final background job choice: BullMQ/Redis versus a serverless queue/webhook pattern.
- Authentication implementation details.
- Which status history and schedule audit entities should be persisted first.

## Current Baseline

- The repo currently contains a starter Next.js app, a Prisma client singleton, and an initial Prisma schema.
