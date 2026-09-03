# Learning scopes and lesson checkpoints

## UX flow

Learners choose an exam-focused scope (for example **Tenses → Present Perfect**), read a short lesson, then start a five-question checkpoint. They submit answers through the existing practice answer endpoint, finish the checkpoint, and either continue to the next scope or review mistakes and retry.

This is intentionally two-step learning, not a generic LMS: short rule, one or two examples, common mistakes, linked practice/checkpoint.

## Data model

- `LearningScope` is shared curriculum data. It has a topic, optional parent, ordering, and JSON lesson (`rule`, `examples`, `commonMistakes`).
- `UserLearningScope` is the only per-user curriculum state and uses `NOT_STARTED`, `IN_PROGRESS`, `PASSED`, or `NEEDS_REVIEW`.
- Checkpoints are `QuizSession` rows with `type=TOPIC_PRACTICE`, linked to the scope, and five `QuizSessionQuestion` rows from the global question bank.
- Answers remain `QuestionAttempt` rows scoped by `userId` and session. Question content is never copied.

Examples include `TENSES → Present Perfect / Past Perfect` and `CONDITIONALS → Type 1 / 2 / 3 / Mixed`.

## API contract

- `GET /learning/scopes` — active scopes plus the authenticated user's progress.
- `GET /learning/scopes/:id/lesson` — lesson and that user's progress.
- `POST /learning/scopes/:id/checkpoint` — starts a five-question checkpoint.
- `POST /practice/sessions/:id/answers` — submits each answer using the existing practice mechanism.
- `POST /learning/scopes/:scopeId/checkpoint/:sessionId/finish` — scores and transitions progress.
- `GET /learning/scopes/:scopeId/checkpoint/:sessionId/review` — returns only that user's incorrect answers and question details.

Every endpoint derives the user from JWT; client-supplied user IDs are not accepted.

## State transitions and scoring

`NOT_STARTED → IN_PROGRESS` occurs when a checkpoint starts. Finish counts correct attempts and passes at `>= 4 / 5` (constants are centralized in the learning-scope service). A pass becomes `PASSED` and returns `NEXT_SCOPE`; otherwise it becomes `NEEDS_REVIEW` and returns `REVIEW_MISTAKES`. Finishing an already completed checkpoint is idempotent.

## Isolation rules

Scopes, lessons, and questions are shared. Progress, sessions, attempts, scores, and review results are user-owned. User A cannot read User B's session, answers, progress, or mistakes, even when both use the same scope and question IDs.
