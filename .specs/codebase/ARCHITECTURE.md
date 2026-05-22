# Architecture

**Pattern:** Starter monolith with a planned layered/clean architecture split.

## High-Level Structure

The repository is currently a minimal Next.js App Router scaffold. Presentation code lives in `src/app`, database access is isolated in `src/infra/database/prisma`, and the intended domain layer has not been implemented yet.

## Identified Patterns

### Prisma Singleton

**Location:** `src/infra/database/prisma/client.ts`
**Purpose:** Reuse a single Prisma client instance in development.
**Implementation:** A `globalThis` singleton is created and extended with soft-delete query overrides for `client` and `service`.
**Example:** `extendedPrisma`

### Starter App Router Page

**Location:** `src/app/page.tsx`
**Purpose:** Default landing page from `create-next-app`.
**Implementation:** Static marketing-style layout with links to Next.js resources.
**Example:** `Home`

## Data Flow

### Current Baseline

There is no implemented request-to-domain flow yet. The current code only renders the default homepage and exposes a Prisma client for future repositories and use cases.

## Code Organization

**Approach:** Layered structure is planned, but only the infrastructure and app shell exist now.

**Structure:**

- `src/app`: Next.js UI shell
- `src/infra`: Database access and future providers/jobs
- `prisma`: schema and migration configuration

**Module boundaries:**

- UI code is separated from database code
- Domain and use-case modules are not present yet
