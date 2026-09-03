# Integrated exam-prep architecture

## Scope

This branch integrates exam blueprints, grounded question-bank content, safe practice hints, per-user learning isolation, learning scopes/checkpoints, resumable mock exams, learner study UX, results/review, and demo learner seed data. The learner-facing modes remain distinct: **Practice/Learn** for small scope or part study, and **Mock exam** for timed blueprint instances.

## Flows and routes

- Practice: `/practice`, `/practice/:sessionId`; answer submission and progressive hints use `POST /practice/sessions/:id/answers` and `POST /practice/sessions/:id/questions/:questionId/hint`.
- Learning scopes: `GET /learning/scopes`, `GET /learning/scopes/:id/lesson`, `POST /learning/scopes/:id/checkpoint`, existing practice answer submission, finish, and mistake review routes. Checkpoints are five questions and pass at 4/5.
- Mock: `GET/POST /mock-exams`, `GET /mock-exams/:id`, answer autosave, pause/resume, and submit. The server owns lifecycle and remaining-time calculation.
- Results/review: result endpoints expose deterministic score, weak topics, and review actions.

## Data model

`ExamType -> ExamBlueprint -> BlueprintSection -> BlueprintPart -> BlueprintSlot -> Question` represents exam composition. `Question` is one global shared bank. `QuizSessionQuestion` snapshots a selected question into a learner session without copying content. `QuestionAttempt`, `HintReveal`, `UserTopicStat`, and `UserLearningScope` are user-scoped.

Blueprints carry source/provenance and timing metadata. Mock sessions carry status, duration, pause data, submitted time, current question, and autosaved answers. Learning scopes carry nested parents and short lesson JSON; progress is per user.

## Provenance and content

Authored starter and mock content is `SYNTHETIC_MOCK`; reading expansion is source-grounded as documented by its dataset metadata and is not presented as a real exam paper. Blueprint provenance distinguishes reconstructed/reference formats from synthetic mocks. HCMUS structure is a project reference, not an official paper.

## Integration decisions

- Used the original blueprint commit `d4c2b12`, excluding the later timer-mixed follow-up because Lane B owns mock lifecycle.
- Kept Lane B's explicit `MockExamStatus` lifecycle and autosave implementation, adding its fields to the single integrated Prisma schema.
- Kept Lane A learning scope tables/routes and merged them with the practice hint schema.
- Retained `HintReveal.maxLevel` as the durable progressive-hint representation; duplicate per-level reveal rows were not added.
- Kept question sanitization for mock delivery and practice pre-submit leakage protection.
- Resolved schema overlap by using one `QuizSessionStatus` plus the mock-specific lifecycle enum, one `HintReveal` model, and one shared `Question` model.
- Preserved the UI study-flow commits while retaining separate Practice and Mock routes and responsive study components.

## Schema/migration

The integrated schema requires a forward Prisma migration for blueprint hierarchy, provenance, question teaching fields, hint reveals, learning scopes/progress, mock lifecycle/autosave fields, and content-pipeline columns. No database mutation, reset, migration execution, or deployment is performed by this integration branch.
