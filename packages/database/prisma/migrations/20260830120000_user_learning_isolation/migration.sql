-- Read-only-safe additive changes for per-user learning state.
ALTER TABLE "user_topic_stats"
  ADD COLUMN "recent_mistake_count" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "next_review_at" TIMESTAMP(3);

-- One answer per learner's session/question makes retries idempotent and
-- prevents duplicate attempts from inflating mastery or mistake state.
CREATE UNIQUE INDEX "question_attempts_quiz_session_id_question_id_key"
  ON "question_attempts"("quiz_session_id", "question_id");
