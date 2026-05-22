# External Integrations

## Database

**Service:** PostgreSQL
**Purpose:** Persistent storage for clients, services, orders, templates, and schedules.
**Implementation:** Prisma schema in `prisma/schema.prisma` and client singleton in `src/infra/database/prisma/client.ts`.
**Configuration:** `DATABASE_URL` via `prisma.config.ts`
**Authentication:** database credentials are expected through the connection string

## ORM Tooling

**Service:** Prisma
**Purpose:** Schema management and typed database access.
**Implementation:** Prisma client and config files in the repository root and `src/infra`.
**Configuration:** `prisma.config.ts`
**Authentication:** not applicable

## Webhooks

**Service:** none yet
**Purpose:** no webhook handlers are implemented

## Background Jobs

**Queue system:** none yet
**Location:** none
**Jobs:** none
