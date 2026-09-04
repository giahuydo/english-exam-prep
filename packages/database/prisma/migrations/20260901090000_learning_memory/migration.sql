-- Additive learning-memory persistence. Not applied by this change.
CREATE TYPE "LearningMemoryConfidence" AS ENUM ('KNOW', 'UNSURE', 'GUESS');
CREATE TYPE "LearningMemoryState" AS ENUM ('NEW', 'LEARNING', 'STRONG');
CREATE TYPE "LearningMemoryAction" AS ENUM ('ANSWERED', 'AGAIN', 'ADVANCE');

CREATE TABLE "learning_memories" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "question_id" TEXT,
  "vocabulary_key" TEXT,
  "confidence" "LearningMemoryConfidence" NOT NULL DEFAULT 'UNSURE',
  "state" "LearningMemoryState" NOT NULL DEFAULT 'NEW',
  "last_reviewed_at" TIMESTAMP(3),
  "next_review_at" TIMESTAMP(3),
  "review_count" INTEGER NOT NULL DEFAULT 0,
  "streak" INTEGER NOT NULL DEFAULT 0,
  "ease" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
  "error_tag" TEXT,
  "source" TEXT NOT NULL DEFAULT 'PRACTICE',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "learning_memories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "learning_memories_user_id_question_id_key" ON "learning_memories"("user_id", "question_id");
CREATE UNIQUE INDEX "learning_memories_user_id_vocabulary_key_key" ON "learning_memories"("user_id", "vocabulary_key");
CREATE INDEX "learning_memories_user_id_next_review_at_idx" ON "learning_memories"("user_id", "next_review_at");
CREATE INDEX "learning_memories_question_id_idx" ON "learning_memories"("question_id");

ALTER TABLE "learning_memories" ADD CONSTRAINT "learning_memories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "learning_memories" ADD CONSTRAINT "learning_memories_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
