# Results and review

## Semantics

`GET /me/results/:sessionId` returns the completed (or currently readable) outcome of a practice, checkpoint, or mock `QuizSession`. The score is correct submitted answers divided by the session question count (falling back to question/attempt count when a legacy session has no count). Unanswered questions count in the denominator and are not correct. Section and topic accuracy are included only when the session questions have those classifications.

The response also includes the user's weak topics, five most recent mistakes, and deterministic next actions:

1. `REVIEW_MISTAKES` when the user has any incorrect attempt.
2. `PRACTICE_WEAK_TOPICS` when the user has a weak topic.
3. `CONTINUE_NEXT_SCOPE` always (the UI/later Learning Scope lane supplies the next scope).

Actions are ordered as above; clients should not infer an LLM-generated explanation from them.

## Weak-topic rule

The intentionally simple configuration is exported as `WEAK_TOPIC_CONFIG` in `apps/api/src/modules/learning/weak-topic.service.ts`:

- at least 2 attempts (`minimumAttempts`)
- accuracy below 70% (`maximumAccuracy`)
- default weak-topic practice size: 10 questions

Selection is deterministic: lowest accuracy first, then highest attempt count, then topic ID. This is a review heuristic, not a claim about durable mastery. No new mastery model or schema is introduced.

`GET /practice/sessions/weak-topics` lists the current user's weak topics. `POST /practice/sessions/weak-topics/:topicId` starts a topic-practice session for that topic. The existing selector and global question bank are reused.

## User isolation

Every result lookup scopes the session by both `id` and authenticated `userId`. Attempts and weak-topic stats are likewise queried with the authenticated user ID. A user cannot read another user's result or use another user's stats to choose a topic. `Question` remains global; learner-specific state remains in `QuizSession`, `QuestionAttempt`, and `UserTopicStat`.

## Integration shape

Result payload fields are `sessionId`, `type`, `status`, `score`, `correctCount`, `totalQuestions`, `sections[]`, `topics[]`, `weakTopics[]`, `recentMistakes[]`, and `actions[]`. Section/topic rows contain `id`, `name`/`topic`, `correct`, `total`, and `accuracy`. Mistake rows contain `attemptId`, `questionId`, and `createdAt`.

No schema migration is required. This lane adds API/service code and tests only.
