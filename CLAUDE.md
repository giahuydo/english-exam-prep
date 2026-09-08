# English Exam Prep — Agent Guide

## Scope and hard rules

This is a pnpm/Turborepo English exam-preparation MVP: Next.js web, NestJS API with existing JWT/bcrypt auth, and Prisma/PostgreSQL. It supports users/admins, study targets, practice with hints and deterministic explanations, attempts/mistakes, progress, study plans, and blueprint-driven mocks.

Keep the MVP narrow. Do not introduce GCS, OCR/Document AI, production LLM providers, Redis/BullMQ, workers, external/Supabase Auth, billing, multi-tenancy, or scaling infrastructure unless explicitly requested. Preserve provider-neutral no-op AI/storage extension points.

- Inspect `git status`, recent history, and live source before editing.
- Preserve unrelated agent work. Never reset, clean, checkout, rebase, force-push, or destructively rewrite.
- Keep controllers thin, use workspace packages, and keep Prisma access in API services.
- `Question` is a global bank; user data belongs in sessions, attempts, mastery stats, and plans.
- Synthetic mocks must use `contentRole: MOCK_EXAM`, never `REAL_EXAM`.
- Keep secrets out of git/docs. Do not commit or push unless asked.

## Quick commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm db:generate
pnpm db:push
pnpm db:seed
```

`pnpm db:reset` is destructive and local-only. Run package-specific checks when narrowing a change.

## Deeper handbook

- [Project structure, paths, ownership, deployment](docs/agents/PROJECT_STRUCTURE.md)
- [Domain model and exam invariants](docs/agents/DOMAIN_MODEL.md)
- [Practice, assembly, Prisma, seed, validation, Git workflows](docs/agents/WORKFLOWS.md)
- [Vercel → Render → Supabase deployment](docs/agents/DEPLOYMENT.md)
- [Render MCP/Codex and project knowledge tools](docs/agents/MCP_GUIDE.md)
- [Architecture](docs/architecture.md) · [Database reference](docs/database.md) · [Interview tab](docs/interview.md)

## Handoff checks

Run relevant lint/typecheck/tests/builds, Prisma validate/generate with non-secret placeholders, `git diff --check`, and database-backed smoke tests when applicable. Report exact files, commands, failures, manual provider steps, and pre-existing unrelated changes.
