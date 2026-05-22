# Project Structure

**Root:** `C:\Users\Unifatecie\Documents\Code\sistema-comandas`

## Directory Tree

```text
.
├── prisma/
│   ├── schema.prisma
│   └── prisma.config.ts
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── infra/
│       └── database/
│           └── prisma/
│               └── client.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Module Organization

### App Shell

**Purpose:** UI routes and global styling.
**Location:** `src/app`
**Key files:** `layout.tsx`, `page.tsx`, `globals.css`

### Infrastructure

**Purpose:** Database and future external integrations.
**Location:** `src/infra`
**Key files:** `src/infra/database/prisma/client.ts`

### Database Layer

**Purpose:** Prisma schema and migration setup.
**Location:** `prisma`
**Key files:** `schema.prisma`, `prisma.config.ts`

## Where Things Live

**UI:**

- Interface: `src/app`
- Business Logic: not implemented yet
- Data Access: not implemented yet
- Configuration: `next.config.ts`

**Database:**

- Schema: `prisma/schema.prisma`
- Client: `src/infra/database/prisma/client.ts`

## Special Directories

**`src/infra/database/prisma`:**
**Purpose:** Prisma client bootstrapping and future repository implementations.
**Examples:** `client.ts`
