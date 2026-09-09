# Project Structure

## Monorepo

```text
apps/
  api/                  NestJS 11 HTTP API, JWT/Passport auth, Prisma services
  web/                  Next.js 15 App Router, Tailwind UI, browser API client
packages/
  database/             Prisma schema/client and seed pipeline
  shared/               Shared TypeScript enums and Zod schemas
docs/                   Architecture, database, and agent handbook
render.yaml             Render blueprint for the API
```

The repository uses pnpm workspaces (`apps/*`, `packages/*`) and Turborepo for orchestration. Workspace package names are `@app/api`, `@app/web`, `@app/database`, and `@app/shared`.

## Important paths

- `apps/api/src/main.ts`: Nest bootstrap, validation, CORS, `PORT` binding, and `0.0.0.0` listener.
- `apps/api/src/app.module.ts`: global config plus feature modules.
- `apps/api/src/auth/`: existing JWT register/login and Passport strategy. Do not replace with Supabase Auth.
- `apps/api/src/prisma/`: injected Prisma client lifecycle.
- `apps/api/src/modules/practice/`: user practice sessions, answer submission, hints, completion.
- `apps/api/src/modules/mock-exams/`: blueprint-driven mock session assembly.
- `packages/database/prisma/schema.prisma`: database source of truth.
- `packages/database/prisma/seed/core.ts`: idempotent catalog/admin core seed.
- `packages/database/prisma/seed/datasets/`: dataset mocks.
- `packages/database/prisma/seed/assemblies.ts`: modular reusable blueprint assemblies; its seed input calls slots `blocks`, persisted as `BlueprintSlot` rows.
- `packages/database/prisma/seed/import-dataset.ts`: idempotent dataset import; `packages/database/prisma/seed/index.ts` registers the current five datasets.
- `apps/web/src/lib/api-client.ts`: browser API base URL and bearer-token client.

## Ownership boundaries

- Web owns presentation, routing, local token storage, and API calls; it must not query Prisma directly.
- API owns HTTP contracts, authorization, domain orchestration, and persistence calls; controllers stay thin and services contain behavior.
- Database owns schema relations/enums and seed data; shared owns framework-free validation/types.
- `ai/` and `storage/` are provider-neutral no-op extension points. Do not introduce external providers as part of routine MVP work.

## Deployment architecture

- `apps/web` deploys as a Next.js project on Vercel.
- `apps/api` deploys as a Node web service on Render using `render.yaml`.
- PostgreSQL is Supabase. Prisma receives `DATABASE_URL`; the current schema also declares `DIRECT_URL` for direct database operations, so provide it when Prisma requires a direct connection.
- The web calls the API using `NEXT_PUBLIC_API_BASE_URL`; the API allows configured origins through `CORS_ORIGIN` and accepts Render's `PORT`.
- There are no required workers, queues, Redis, object storage, OCR, or production AI services in this MVP. Render's current blueprint builds from the repository root, runs Prisma generation, then builds/starts the filtered API package; keep that runtime packaging assumption visible when changing deployment settings.

For behavior and data semantics, see [DOMAIN_MODEL.md](DOMAIN_MODEL.md). For operational procedures, see [WORKFLOWS.md](WORKFLOWS.md) and [DEPLOYMENT.md](DEPLOYMENT.md).
