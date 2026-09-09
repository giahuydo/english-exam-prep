# Workflows

## Practice flow

1. Web registers/logs in through `POST /auth/register` or `POST /auth/login`.
2. API returns `{ accessToken, user }`; the current web stores the token in `localStorage` and sends `Authorization: Bearer` on guarded calls.
3. Web starts a session with `POST /practice/sessions` (or the mock endpoint).
4. API selects from the shared question bank and stores `QuizSessionQuestion` rows.
5. Web reads the session, optionally reveals read-only hints, and submits answers to `POST /practice/sessions/:id/answers`.
6. API creates `QuestionAttempt`, updates learning rollups as applicable, and returns stored deterministic explanations.
7. Completion records the final session state; dashboard, mistakes, attempts, and stats read the persisted user data.

## Mock assembly

Keep format rules in seed data: `ExamBlueprint -> BlueprintSection -> BlueprintPart -> BlueprintSlot`. Slots define question type, optional topic/level/difficulty, count, grouping, shared stimulus, and selection policy. Instantiated exam data uses sections, parts, groups, and questions. The engine should consume this hierarchy rather than branch on mock number.

## Database / Prisma

From the repository root:

```bash
pnpm db:generate       # generate the client from schema.prisma
pnpm db:push           # apply the current schema for MVP/dev databases
pnpm db:seed           # run core, assemblies, and datasets
pnpm db:reset          # destructive local reset only; never run against shared production data
pnpm --filter @app/database db:studio
```

The schema reads `DATABASE_URL` and optionally `DIRECT_URL`. For a new Supabase database, use `db:push` for the current MVP path unless a reviewed migration workflow has been introduced. Generate after schema changes and before API builds.

## Idempotent core + dataset seeding

`packages/database/prisma/seed.ts` calls `seedAll`: core catalog/admin data, reusable assemblies, then datasets. Core records use stable codes/upserts. Assemblies use stable external keys and nested upserts. Dataset exams/questions use dataset keys and stable IDs/keys so rerunning seed updates rather than duplicating records. Keep dataset keys stable when editing an existing mock.

To scale from 5 to 50 mocks without engine changes:

1. Add a typed dataset module under `packages/database/prisma/seed/datasets/`.
2. Give it a unique stable `key`, correct `examTypeCode`, blueprint key, sections, and questions.
3. Use the existing dataset question shape and correct `sectionCode`/`partCode`, QuestionType, Topics, level, options, and explanations.
4. Register it in the dataset list in `seed/index.ts`.
5. Re-run seed and verify counts/keys. Do not copy selector or controller logic for each mock.

Use the shared assembly definition when a format’s structure is reused. Add a new assembly only for a genuinely different blueprint, not for each dataset variant.

## Validation and handoff

Before a commit or handoff, inspect `git status --short` and recent history. Run the relevant focused checks, then as applicable:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
DATABASE_URL=postgresql://user:password@host:5432/db?schema=public pnpm --filter @app/database exec prisma validate
DATABASE_URL=postgresql://user:password@host:5432/db?schema=public pnpm --filter @app/database exec prisma generate
```

Also smoke-test register/login, dashboard reads, practice start/read/answer/complete, and mock reads/writes against a real database when deployment is involved. Report pre-existing failures separately; do not “fix” unrelated active work silently.

## Git safety

Preserve other agents' changes. Never reset, clean, force-push, checkout away work, or rewrite unrelated files. Make narrow edits, inspect the diff, and do not commit/push unless requested. If source and docs disagree, follow live source and call out the discrepancy.
