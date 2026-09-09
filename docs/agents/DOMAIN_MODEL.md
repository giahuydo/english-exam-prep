# Domain Model

## Distinct concepts

- **ExamType** is the target format/catalog (`HCMUS_MASTER_ENTRANCE`, `B1`, `B2`, `VSTEP`, `CUSTOM`). It groups exams, blueprints, sessions, and a user's current target. It is not a question difficulty.
- **QuestionType** describes the response/form (`MCQ_SINGLE_BLANK`, `READING_COMPREHENSION`, `CONVERSATION`, `ESSAY`, etc.). It is not the subject or skill being tested.
- **Topic** is the reusable content/skill taxonomy (`TENSES`, `MAIN_IDEA`, `HOLIDAYS`, and so on), with categories and optional hierarchy. Questions can have multiple topic links; one may be primary. Topic and QuestionType are independent axes.
- **Question.level** is the CEFR-style level stored on an individual question (`B1`, `B2`, `C1`, `B1_B2`, `B1_C1`). It is not the user's ExamType and must not be inferred as one.

## Question bank and user data

`questions` is one shared global question bank. It is deliberately not partitioned by user, exam type, or level. Selectors combine question status, level, QuestionType, Topic, and blueprint context.

User-specific learning data is separate:

- `QuizSession` records a user's practice/mock run.
- `QuestionAttempt` is created on answer submission and records correctness, selected answer, hints used, and timing.
- `UserTopicStat` stores per-user topic mastery/accuracy rollups.
- `StudyPlan` and `StudyPlanTopic` store per-user remediation plans.

Hint reveal is read-only; the client submits the visible hint level with the answer. Answer explanations are deterministic from stored question and option explanation fields.

## Blueprint and exam assembly

Blueprints are data, not hard-coded engine branches. The intended hierarchy is:

```text
ExamBlueprint
  -> BlueprintSection (Section)
    -> BlueprintPart (Part)
      -> BlueprintSlot (Block/Slot)
        -> QuestionType + optional Topic/level/difficulty + count/policy
```

A slot can describe grouping (`groupCount`, `questionsPerGroup`, `groupingSemantics`) and shared-stimulus behavior (`sharedStimulus`, `groupSize`, `selectionPolicy`). An instantiated `Exam` mirrors the structure with `ExamSection`, `ExamPart`, and `QuestionGroup`; questions can point to their exam/section/part/group. `QuestionGroup.stimulus` is the shared passage, talk, conversation, or other context for a group of questions.

Do not flatten away section/part/slot semantics when adding datasets. Do not put a format distinction into QuestionType when it belongs to Topic, or vice versa.

## Provenance and publication

- `Question.origin` describes creation provenance (`ORIGINAL`, `MANUAL`, `AI_GENERATED`).
- `Question.contentRole` describes instructional/material role (`EXAMPLE`, `PRACTICE`, `MOCK_EXAM`, `REAL_EXAM`, `AI_GENERATED`).
- Synthetic seed mocks are not official papers: their source explicitly says they are synthetic/aligned and their content role is `MOCK_EXAM`; never label them `REAL_EXAM`.
- AI-generated questions are forced to `DRAFT` by the question service, regardless of a requested published status.
- Topic links carry `source` (`AI`, `ADMIN`, `SYSTEM`) and optional confidence; preserve this provenance.

## Implemented canonical formats

### HCMUS Master Entrance

The current seed defines `HCMUS_MASTER_ENTRANCE` as a B1-B2 target. The reusable assembly has four sections: Vocabulary & Reading (40 questions), Grammar & Use of English (30), Listening (30), and Speaking (2), with seeded duration/score metadata. Current seeded HCMUS datasets are synthetic MVP mocks, not official exam papers.

### VSTEP 3-5

`VSTEP` is seeded as the VSTEP 3-5 format with B1-C1 range metadata. Its canonical assembly models:

- Listening: 35 questions, 3 parts, 40 minutes — 8 announcements/instructions, 12 questions across 3 conversations (4 each), and 15 questions across 3 talks/lectures (5 each).
- Reading: 40 questions, 4 passages, 60 minutes — 10 questions per passage.
- Writing: 2 tasks, 60 minutes.
- Speaking: 3 parts, approximately 12 minutes.

Writing prompt categories and speaking subjects are Topics, not QuestionTypes. Writing rubric topics are classification data only; automated writing scoring is not implemented.

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for ownership and [WORKFLOWS.md](WORKFLOWS.md) for assembly/seed operations.
