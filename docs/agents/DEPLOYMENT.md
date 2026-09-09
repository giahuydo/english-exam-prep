# Deployment Runbook

## Architecture

```text
Vercel (apps/web) -> Render (apps/api) -> Supabase PostgreSQL
```

The API remains the NestJS JWT implementation. Supabase is PostgreSQL only; do not add Supabase Auth for this MVP.

## Exact environment variable names

Names only; set values in the provider dashboards or local untracked env files.

**API / Render**

- `NODE_ENV`
- `NODE_VERSION`
- `PORT` (Render supplies this; the API also supports local `API_PORT`)
- `API_PORT` (local fallback only)
- `DATABASE_URL`
- `DIRECT_URL` (optional for Prisma direct connections; current schema declares it)
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

**Web / Vercel**

- `NEXT_PUBLIC_API_BASE_URL`

Do not add credentials, connection strings, tokens, or passwords to tracked docs, `.env.example`, logs, or chat transcripts.

## Render API

The checked-in `render.yaml` defines a Node web service. Its build command installs dependencies, generates Prisma, and builds the API; its start command runs the compiled Nest app. The effective package commands are:

```bash
pnpm install --frozen-lockfile
pnpm --filter @app/database db:generate
pnpm --filter @app/api build
pnpm --filter @app/api start
```

The API binds `0.0.0.0` and prefers Render's `PORT`, then local `API_PORT`, then its development fallback. `GET /health` is the Render health check and must remain unauthenticated. `CORS_ORIGIN` accepts a comma-separated configured origin list; the current bootstrap also permits the expected HTTPS Vercel hostname pattern and local development origin.

## Supabase and Prisma order

1. Create the Supabase project and PostgreSQL database.
2. Put the Supabase pooled/runtime connection in Render `DATABASE_URL`; set `DIRECT_URL` if using the direct connection for Prisma operations.
3. Generate Prisma and apply the current MVP schema (`pnpm db:push`), then run the idempotent seed (`pnpm db:seed`) from a controlled environment with the seed admin variables set.
4. Deploy the NestJS API to Render and verify `/health`, register/login, and database reads.
5. Set Vercel `NEXT_PUBLIC_API_BASE_URL` to the deployed Render API base URL (no trailing-path assumptions beyond the API routes).
6. Deploy `apps/web` to Vercel and verify browser calls reach Render.
7. Smoke-test register/login, dashboard, practice database reads/writes, answer submission/completion, and mock exam reads/writes.

Configure the Vercel project root as `apps/web` (or use the monorepo-aware build settings), and the Render service from the repository blueprint. Never run `db:reset` against Supabase.

## Troubleshooting order

1. Check provider build logs and Node/pnpm versions.
2. Check Render `/health` and service logs.
3. Check `DATABASE_URL` format/availability and run Prisma generate/validate from the repo.
4. Check schema application and seed completion; inspect Supabase tables.
5. Check exact Vercel `NEXT_PUBLIC_API_BASE_URL` and browser Network errors.
6. Check Render `CORS_ORIGIN`, including the exact Vercel origin and HTTPS.
7. Check JWT variables and bearer-token behavior only after connectivity/database/CORS are healthy.

Do not introduce new infrastructure to work around a configuration error.

## Known pitfalls

- **`enableCors({ origin })` must invoke the callback.** The `cors` package calls the function as `(requestOrigin, callback)` and waits for `callback(err, allow)`. If the function returns a boolean instead of invoking `callback`, every request — including Render's port-scan probes — hangs, and Render reports `No open HTTP ports detected` even though the log shows the app listening on `0.0.0.0:$PORT`. Always call `callback(null, true|false)`; never type the second argument as `Request`.
