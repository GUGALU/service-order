# Testing Infrastructure

## Test Frameworks

**Unit/Integration:** none configured
**E2E:** none configured
**Coverage:** none configured

## Test Organization

**Location:** no test directory exists yet
**Naming:** no test naming pattern is established
**Structure:** tests have not been added to the repository

## Testing Patterns

### Unit Tests

**Approach:** not present yet
**Location:** none

### Integration Tests

**Approach:** not present yet
**Location:** none

### E2E Tests

**Approach:** not present yet
**Location:** none

## Test Execution

**Commands:** `npm run lint`, `npm run build`
**Configuration:** linting is handled by ESLint; build uses Next.js

## Coverage Targets

**Current:** no automated tests
**Goals:** add domain and route coverage as business logic lands
**Enforcement:** none

## Test Coverage Matrix

| Code Layer | Required Test Type | Location Pattern | Run Command |
| ---------- | ------------------ | ---------------- | ----------- |
| App Router UI | none yet | `src/app/**/*.tsx` | `npm run build` |
| Database client | none yet | `src/infra/**/*.ts` | `npm run build` |
| Domain/use cases | none yet | `src/core/**/*.ts` | not implemented |

## Parallelism Assessment

| Test Type | Parallel-Safe? | Isolation Model | Evidence |
| --------- | -------------- | --------------- | -------- |
| lint | Yes | file-based static analysis | no shared runtime state |
| build | No | single project build output | Next.js build uses shared output state |

## Gate Check Commands

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | After small UI or utility changes | `npm run lint` |
| Full | After feature work | `npm run lint && npm run build` |
| Build | Before handoff | `npm run build` |
