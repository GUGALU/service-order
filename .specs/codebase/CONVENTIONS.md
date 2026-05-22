# Code Conventions

## Naming Conventions

**Files:** lower-case, framework-aligned names such as `page.tsx`, `layout.tsx`, and `client.ts`.
Examples: `src/app/page.tsx`, `src/infra/database/prisma/client.ts`

**Functions/Methods:** PascalCase for React components; camelCase for helpers.
Examples: `Home`, `RootLayout`, `prismaClientSingleton`

**Variables:** camelCase.
Examples: `geistSans`, `geistMono`, `extendedPrisma`

**Constants:** camelCase is used for module-level values in the current scaffold.
Examples: `nextConfig`, `eslintConfig`

## Code Organization

**Import/Dependency Declaration:** external imports first, then local imports.
Example: `src/app/layout.tsx`

**File Structure:** imports, constants, exported types, then the component or module export.
Example: `src/app/layout.tsx`

## Type Safety/Documentation

**Approach:** TypeScript strict mode is enabled, but the current Prisma extension file still uses `any` for query hooks.

## Error Handling

**Pattern:** no explicit error-handling conventions are established yet.

## Comments/Documentation

**Style:** comments are sparse; existing comments are mostly configuration notes.
