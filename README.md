# English B1/B2 Master Entrance Exam Prep

A monorepo for an English exam preparation platform focused on the HCMUS Master's entrance exam and VSTEP 3-5 patterns. Admins upload real exam PDFs, the system learns their blueprint, then AI generates practice questions that match the pattern. Users practice with hints, submit answers, and get explanations.

This scaffold intentionally defers Google Cloud Storage, PDF extraction, and any LLM provider integration. Placeholder interfaces are in place so those pieces slot in later without ripping up domain code.

## Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **API**: NestJS 11 + Prisma + PostgreSQL + JWT auth (bcrypt)
- **Web**: Next.js 15 (app router) + Tailwind CSS
- **Shared**: `@app/shared` (Zod schemas, enums) + `@app/database` (Prisma client)
- **Test**: Jest

## Prerequisites

- Node.js `>= 22`
- pnpm `>= 10`
- Docker (for PostgreSQL)

## First-time setup

```bash
# 1. install deps
pnpm install

# 2. copy env
cp .env.example .env

# 3. start postgres (port 5433 to avoid dev-box conflicts)
docker compose up -d postgres

# 4. generate prisma client
pnpm db:generate

# 5. push schema to db (migrations to be added later)
pnpm db:push

# 6. seed baseline data (topics, question types, HCMUS exam pattern, admin user)
pnpm db:seed
```

Default admin (override via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`):
- email: `admin@example.com`
- password: `admin123!`

## Common commands

```bash
pnpm dev            # run all apps in dev (turbo)
pnpm build          # build everything
pnpm lint           # lint all packages
pnpm typecheck      # typecheck all packages
pnpm test           # run all tests
pnpm db:reset       # drop + re-push + re-seed
pnpm db:studio      # prisma studio (from packages/database)
```

## Structure

```
english-exam-prep/
  apps/
    api/            # NestJS API
    web/            # Next.js frontend
  packages/
    database/       # Prisma schema, migrations, seed
    shared/         # zod schemas, enums
  docs/
    architecture.md
    database.md
```

See `docs/architecture.md` and `docs/database.md` for domain concepts.
