# Lane D integration checklist

Target baseline inspected: `origin/main` at `f47ce3f` (fresh branch; no upcoming lanes merged).

## Contract checklist

- [ ] **Learning Scope:** map `CONTINUE_NEXT_SCOPE` to the scope endpoint/action once its contract lands. Do not duplicate scope computation in Results.
- [ ] **Mock Lifecycle:** call results after the lifecycle marks a session complete; preserve `QuizSession.id`, `type=MOCK_EXAM`, and user ownership. Confirm whether lifecycle adds a completion/result route; prefer one canonical route.
- [ ] **Practice Hint:** keep hint usage on `QuestionAttempt.hintLevelUsed`; results should aggregate persisted attempts and never mutate them.
- [ ] **UI:** consume ordered `actions`; render missing section/topic classifications as absent/empty rather than inventing accuracy. Use `weakTopics` to link to weak-topic practice.
- [ ] **API client/shared schemas:** decide whether the result response and action literals move into `packages/shared` when the UI lane establishes its API types.
- [ ] **Auth:** retain authenticated `user.id` as the only learner scope; never accept a user ID in result or weak-topic route params.

## Model/API overlap and likely conflicts

- **Likely conflict files:** `apps/api/src/app.module.ts` (module registration), `apps/api/src/modules/practice/practice.controller.ts` (new practice entrypoint), and `apps/api/src/modules/learning/learning.module.ts` (weak-topic provider).
- **Mock lifecycle overlap:** `apps/api/src/modules/mock-exams/mock-exams.service.ts` and controller if completion/result endpoints are added there. Keep aggregation in ResultsService or delegate to one shared service rather than creating two payloads.
- **Practice overlap:** `practice.service.ts` owns session writes and should remain the entrypoint for weak-topic sessions. Avoid changing attempt semantics in the hint lane.
- **Schema overlap:** none in this lane. Existing `QuizSession`, `QuestionAttempt`, `UserTopicStat`, `QuestionTopic`, `ExamSection`, and `StudyPlan` support the contract. If another lane changes these models, regenerate Prisma and resolve generated-client changes before API typecheck.
- **Study plans:** results do not create or update plans. A later Learning Scope lane may use `weakTopics` or `StudyPlanTopic`; agree whether a plan action is added rather than silently coupling it here.

## Recommended merge order

1. Merge/resolve shared schema and Learning Scope contracts first.
2. Merge Lane D, resolving module/controller overlaps and retaining its user-scoped queries.
3. Merge Mock Lifecycle and Practice Hint, then run result integration tests against their final completion/attempt behavior.
4. Merge UI last, after the response shape and action routing are stable.

Validation after each merge: Prisma generate if schema changed, API typecheck/lint/tests, `git diff --check`, and a two-user result/weak-topic isolation smoke test.
