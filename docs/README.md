# Project Documentation

Use this index to find the right project context before changing code.

## Start here

1. `../CLAUDE.md` — agent rules, scope limits, commands, and handoff checks.
2. `../README.md` — product summary, stack, setup, and common commands.
3. `architecture.md` — runtime architecture, ownership boundaries, auth, and extension points.
4. `database.md` — Prisma domain model, invariants, blueprint hierarchy, and ER diagram.
5. `agents/PROJECT_STRUCTURE.md` — file ownership and deployment architecture.
6. `agents/WORKFLOWS.md` — practice, mock assembly, Prisma/seed, validation, and Git workflow.
7. `agents/DEPLOYMENT.md` — Vercel, Render, Supabase/Postgres deployment and smoke tests.

## Feature and product documents

- `interview.md` — Interview Practice UI, canonical answer rules, static sample audio, karaoke, Memory path, and dated implementation trace.
- `product/INTEGRATED_EXAM_PREP.md` — product direction and integrated exam-prep model.
- `product/UI_UX_STUDY_FLOW.md` — learner study flow and UI/UX decisions.
- `product/LEARNING_SCOPES.md` — learning scope definitions.
- `product/MOCK_EXAM_LIFECYCLE.md` — mock exam lifecycle.
- `product/RESULTS_AND_REVIEW.md` — results, attempts, and review behavior.
- `product/INTEGRATION_CHECKLIST.md` — integration and delivery checklist.
- `agents/DOMAIN_MODEL.md` — domain concepts and exam invariants.
- `agents/MCP_GUIDE.md` — MCP/project knowledge tool guidance.

## Trace rule

When a feature changes, update the closest feature document and add a dated implementation note when the change affects behavior, data flow, deployment, or an important invariant. Keep canonical content and secrets out of documentation changes unless the source already makes them public and necessary.

For a code question, verify the current source after reading the docs. Documentation is a navigation and handoff aid, not a substitute for live code.
