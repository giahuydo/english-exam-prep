-- Complete forward migration from origin/main to the integrated exam-prep schema.
-- The user-learning-isolation migration owns user_topic_stats additions and the
-- question_attempts session/question unique index; those statements are
-- intentionally not repeated here.

-- CreateEnum
CREATE TYPE "BlueprintProvenance" AS ENUM ('REAL_EXAM', 'OFFICIAL_SAMPLE', 'RECONSTRUCTED', 'SYNTHETIC_MOCK');

-- CreateEnum
CREATE TYPE "MockExamStatus" AS ENUM ('NOT_STARTED', 'RUNNING', 'PAUSED', 'SUBMITTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "LearningScopeProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'PASSED', 'NEEDS_REVIEW');

-- AlterEnum
ALTER TYPE "QuizSessionStatus" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "exams"
  ADD COLUMN "dataset_key" TEXT,
  ADD COLUMN "external_key" TEXT;

ALTER TABLE "questions"
  ADD COLUMN "common_mistake" TEXT,
  ADD COLUMN "dataset_key" TEXT,
  ADD COLUMN "example" TEXT,
  ADD COLUMN "rule_structure" TEXT;

ALTER TABLE "exam_blueprints"
  ADD COLUMN "duration_minutes" INTEGER,
  ADD COLUMN "external_key" TEXT,
  ADD COLUMN "provenance" "BlueprintProvenance" NOT NULL DEFAULT 'RECONSTRUCTED',
  ADD COLUMN "source" TEXT,
  ADD COLUMN "total_score" DOUBLE PRECISION;

ALTER TABLE "quiz_sessions"
  ADD COLUMN "checkpoint_size" INTEGER,
  ADD COLUMN "current_question_index" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "duration_seconds" INTEGER,
  ADD COLUMN "learning_scope_id" TEXT,
  ADD COLUMN "mockStatus" "MockExamStatus",
  ADD COLUMN "pass_score" INTEGER,
  ADD COLUMN "paused_at" TIMESTAMP(3),
  ADD COLUMN "submitted_at" TIMESTAMP(3),
  ADD COLUMN "total_paused_seconds" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "blueprint_sections" (
  "id" TEXT NOT NULL,
  "blueprint_id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "position" INTEGER NOT NULL,
  "instructions" TEXT,
  "duration_minutes" INTEGER,
  "score" DOUBLE PRECISION,

  CONSTRAINT "blueprint_sections_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "blueprint_parts" (
  "id" TEXT NOT NULL,
  "external_key" TEXT,
  "section_id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "position" INTEGER NOT NULL,
  "instructions" TEXT,
  "duration_minutes" INTEGER,
  "score" DOUBLE PRECISION,
  "question_count" INTEGER NOT NULL,
  "group_count" INTEGER,
  "questions_per_group" INTEGER,
  "grouping_semantics" TEXT,

  CONSTRAINT "blueprint_parts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "blueprint_slots" (
  "id" TEXT NOT NULL,
  "external_key" TEXT,
  "part_id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "position" INTEGER NOT NULL,
  "question_type_id" TEXT NOT NULL,
  "topicId" TEXT,
  "count" INTEGER NOT NULL,
  "level" "ExamLevel",
  "difficulty" "QuestionDifficulty",
  "group_count" INTEGER,
  "questions_per_group" INTEGER,
  "group_size" INTEGER,
  "grouping_semantics" TEXT,
  "shared_stimulus" TEXT,
  "selection_policy" JSONB,

  CONSTRAINT "blueprint_slots_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "learning_scopes" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "topicId" TEXT NOT NULL,
  "parentId" TEXT,
  "lesson" JSONB,
  "position" INTEGER NOT NULL DEFAULT 0,
  "is_active" BOOLEAN NOT NULL DEFAULT true,

  CONSTRAINT "learning_scopes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_learning_scopes" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "scope_id" TEXT NOT NULL,
  "status" "LearningScopeProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
  "last_score" INTEGER,
  "attempt_count" INTEGER NOT NULL DEFAULT 0,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "user_learning_scopes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "hint_reveals" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "quiz_session_id" TEXT NOT NULL,
  "question_id" TEXT NOT NULL,
  "max_level" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "hint_reveals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blueprint_sections_blueprint_id_code_key" ON "blueprint_sections"("blueprint_id", "code");
CREATE UNIQUE INDEX "blueprint_parts_external_key_key" ON "blueprint_parts"("external_key");
CREATE UNIQUE INDEX "blueprint_parts_section_id_code_key" ON "blueprint_parts"("section_id", "code");
CREATE UNIQUE INDEX "blueprint_slots_external_key_key" ON "blueprint_slots"("external_key");
CREATE UNIQUE INDEX "blueprint_slots_part_id_code_key" ON "blueprint_slots"("part_id", "code");
CREATE UNIQUE INDEX "learning_scopes_code_key" ON "learning_scopes"("code");
CREATE INDEX "learning_scopes_topicId_idx" ON "learning_scopes"("topicId");
CREATE INDEX "learning_scopes_parentId_idx" ON "learning_scopes"("parentId");
CREATE INDEX "user_learning_scopes_user_id_idx" ON "user_learning_scopes"("user_id");
CREATE UNIQUE INDEX "user_learning_scopes_user_id_scope_id_key" ON "user_learning_scopes"("user_id", "scope_id");
CREATE UNIQUE INDEX "exams_external_key_key" ON "exams"("external_key");
CREATE UNIQUE INDEX "exams_dataset_key_key" ON "exams"("dataset_key");
CREATE UNIQUE INDEX "questions_dataset_key_key" ON "questions"("dataset_key");
CREATE UNIQUE INDEX "exam_blueprints_external_key_key" ON "exam_blueprints"("external_key");

-- AddForeignKey
ALTER TABLE "blueprint_sections" ADD CONSTRAINT "blueprint_sections_blueprint_id_fkey" FOREIGN KEY ("blueprint_id") REFERENCES "exam_blueprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "blueprint_parts" ADD CONSTRAINT "blueprint_parts_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "blueprint_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "blueprint_slots" ADD CONSTRAINT "blueprint_slots_part_id_fkey" FOREIGN KEY ("part_id") REFERENCES "blueprint_parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "blueprint_slots" ADD CONSTRAINT "blueprint_slots_question_type_id_fkey" FOREIGN KEY ("question_type_id") REFERENCES "question_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "blueprint_slots" ADD CONSTRAINT "blueprint_slots_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "quiz_sessions" ADD CONSTRAINT "quiz_sessions_learning_scope_id_fkey" FOREIGN KEY ("learning_scope_id") REFERENCES "learning_scopes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "learning_scopes" ADD CONSTRAINT "learning_scopes_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "learning_scopes" ADD CONSTRAINT "learning_scopes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "learning_scopes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "user_learning_scopes" ADD CONSTRAINT "user_learning_scopes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_learning_scopes" ADD CONSTRAINT "user_learning_scopes_scope_id_fkey" FOREIGN KEY ("scope_id") REFERENCES "learning_scopes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "hint_reveals" ADD CONSTRAINT "hint_reveals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "hint_reveals" ADD CONSTRAINT "hint_reveals_quiz_session_id_fkey" FOREIGN KEY ("quiz_session_id") REFERENCES "quiz_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "hint_reveals" ADD CONSTRAINT "hint_reveals_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
