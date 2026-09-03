# Architecture

## Monorepo

```
english-exam-prep/
  apps/
    api/        NestJS 11, Prisma, JWT
    web/        Next.js 15 app router, Tailwind
  packages/
    shared/     Zod schemas, TS enums (pure TS, no framework deps)
    database/   Prisma schema + client + seed
```

- **pnpm workspaces** for cross-package imports (`@app/shared`, `@app/database`).
- **Turborepo** for `dev`/`build`/`lint`/`typecheck`/`test` orchestration.
- **PostgreSQL 16** via `docker-compose.yml` on port `5433` (avoids conflicts with common local Postgres on `5432`).

## Auth flow

1. `POST /auth/register` or `/auth/login` returns `{ accessToken, user }`.
2. Web stores token in `localStorage` (TODO: httpOnly cookie).
3. Every guarded request sends `Authorization: Bearer <token>`.
4. `JwtStrategy` (Passport) validates and re-hydrates the user from DB.
5. `RolesGuard` + `@Roles('ADMIN')` protects admin routes.

## Domain layers

- `apps/api/src/modules/*` — feature modules, each with `service` (Prisma) + `controller`.
- `apps/api/src/prisma/prisma.service.ts` — one singleton Prisma client injected via `PrismaModule` (global).
- `apps/api/src/ai/` — placeholder AI interfaces (`PdfExtractor`, `ExamAnalyzer`, `QuestionClassifier`, `QuestionGenerator`) plus `Noop*` implementations. Provider-agnostic — no OpenAI/Gemini/Anthropic SDK anywhere.
- `apps/api/src/modules/storage/` — `StorageService` interface + `NoopStorageService`. Real GCS impl will replace it later.

## Business rules

- **AI-generated questions are always DRAFT.** `QuestionsService.create` forces `status = DRAFT` when `origin === 'AI_GENERATED'`, even if the caller sends `PUBLISHED`. Covered by `questions.service.spec.ts`.
- **Exam pattern lives in data, not code.** HCMUS distribution is seeded into `exam_blueprints` + `exam_blueprint_items`. Adding a new exam type never requires code changes.
- **Topic classification is a join table with metadata.** `question_topics.confidence` + `source` (AI/ADMIN/SYSTEM) lets the UI show provenance and lets an admin override the AI.

## Planned AI extension points

Every AI touchpoint is a symbol-based DI token today:

| Token                | Role                                                                 |
|----------------------|----------------------------------------------------------------------|
| `PDF_EXTRACTOR`      | PDF -> text                                                          |
| `EXAM_ANALYZER`      | text -> `AnalyzedExam` (title, level, sections)                      |
| `QUESTION_CLASSIFIER`| question -> `{ topicIds, questionTypeId, confidence }`               |
| `QUESTION_GENERATOR` | blueprint item -> `GeneratedQuestion` (always saved as DRAFT)        |

Replace `NoopXxx` classes in `apps/api/src/ai/` with real implementations behind whichever provider you pick.

## Deferred integrations

- Google Cloud Storage (bucket + path columns already nullable in schema).
- PDF text extraction.
- Any LLM SDK (OpenAI/Gemini/Anthropic/etc).
- Prisma migrations (using `db:push` for initial dev — migrations added when the schema stabilizes).
- CI/CD.
- Real cookie-based session (currently `localStorage` JWT).
