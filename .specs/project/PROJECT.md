# Order Management System

**Vision:** A clean, Next.js-based order management platform for client, service, order, and scheduled messaging operations.
**For:** Operators who manage appointments, service orders, and customer follow-up.
**Solves:** Manual order tracking, inconsistent service pricing, and unreliable message scheduling.

## Goals

- Deliver a traceable order lifecycle from client selection through completion or cancellation.
- Support scheduled messaging without blocking HTTP requests.
- Keep business rules isolated from the Next.js layer.

## Tech Stack

**Core:**

- Framework: Next.js 16.2.6 (App Router)
- Language: TypeScript 5
- Database: PostgreSQL

**Key dependencies:** Prisma 6.19.3, Zod 4.4.3, React 19.2.4, Tailwind CSS 4, ESLint 9

## Scope

**v1 includes:**

- Client and service CRUD with hard delete behavior where allowed by order links
- Order creation, status changes, totals, and history
- Message templates and future-dated schedules
- Background message dispatch abstraction
- Authentication for protected routes

**Explicitly out of scope:**

- Payments and billing
- Inventory management
- Multi-tenant administration
- Native mobile apps
- Provider-specific WhatsApp or email implementation details

## Constraints

- Timeline: not defined
- Technical: business logic must stay framework-agnostic
- Resources: existing repository is a scaffold and needs foundational domain implementation
