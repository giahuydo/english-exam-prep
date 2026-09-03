/**
 * Seed baseline domain data:
 *  - exam types (HCMUS, B1, B2, CUSTOM)
 *  - topic taxonomy (Grammar / Vocabulary / Reading / Listening / Speaking)
 *  - question types
 *  - HCMUS canonical exam pattern + sections + draft blueprint (with items
 *    across all four sections, not just Grammar)
 *  - one admin user
 */
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

type TopicSeed = {
  code: string;
  name: string;
  category:
    | 'GRAMMAR'
    | 'VOCABULARY'
    | 'READING'
    | 'LISTENING'
    | 'WRITING'
    | 'SPEAKING';
  parentCode?: string;
  sortOrder?: number;
};

const topicSeeds: TopicSeed[] = [
  // ---- Grammar (hierarchical for TENSES / CONDITIONALS / WISH) ----
  { code: 'TENSES', name: 'Tenses', category: 'GRAMMAR', sortOrder: 1 },
  { code: 'PRESENT_SIMPLE', name: 'Present Simple', category: 'GRAMMAR', parentCode: 'TENSES', sortOrder: 1 },
  { code: 'PRESENT_CONTINUOUS', name: 'Present Continuous', category: 'GRAMMAR', parentCode: 'TENSES', sortOrder: 2 },
  { code: 'PRESENT_PERFECT', name: 'Present Perfect', category: 'GRAMMAR', parentCode: 'TENSES', sortOrder: 3 },
  { code: 'PAST_SIMPLE', name: 'Past Simple', category: 'GRAMMAR', parentCode: 'TENSES', sortOrder: 4 },
  { code: 'PAST_CONTINUOUS', name: 'Past Continuous', category: 'GRAMMAR', parentCode: 'TENSES', sortOrder: 5 },
  { code: 'PAST_PERFECT', name: 'Past Perfect', category: 'GRAMMAR', parentCode: 'TENSES', sortOrder: 6 },
  { code: 'FUTURE_FORMS', name: 'Future Forms', category: 'GRAMMAR', parentCode: 'TENSES', sortOrder: 7 },

  { code: 'CONDITIONALS', name: 'Conditionals', category: 'GRAMMAR', sortOrder: 2 },
  { code: 'CONDITIONAL_T1', name: 'Conditional Type 1', category: 'GRAMMAR', parentCode: 'CONDITIONALS', sortOrder: 1 },
  { code: 'CONDITIONAL_T2', name: 'Conditional Type 2', category: 'GRAMMAR', parentCode: 'CONDITIONALS', sortOrder: 2 },
  { code: 'CONDITIONAL_T3', name: 'Conditional Type 3', category: 'GRAMMAR', parentCode: 'CONDITIONALS', sortOrder: 3 },
  { code: 'CONDITIONAL_MIXED', name: 'Mixed Conditional', category: 'GRAMMAR', parentCode: 'CONDITIONALS', sortOrder: 4 },

  { code: 'WISH', name: 'Wish / If only', category: 'GRAMMAR', sortOrder: 3 },
  { code: 'WISH_PRESENT', name: 'Wish (Present)', category: 'GRAMMAR', parentCode: 'WISH', sortOrder: 1 },
  { code: 'WISH_PAST', name: 'Wish (Past)', category: 'GRAMMAR', parentCode: 'WISH', sortOrder: 2 },
  { code: 'WISH_FUTURE', name: 'Wish (Future)', category: 'GRAMMAR', parentCode: 'WISH', sortOrder: 3 },

  // flat grammar
  { code: 'PASSIVE_VOICE', name: 'Passive Voice', category: 'GRAMMAR', sortOrder: 4 },
  { code: 'RELATIVE_CLAUSES', name: 'Relative Clauses', category: 'GRAMMAR', sortOrder: 5 },
  { code: 'REPORTED_SPEECH', name: 'Reported Speech', category: 'GRAMMAR', sortOrder: 6 },
  { code: 'MODAL_VERBS', name: 'Modal Verbs', category: 'GRAMMAR', sortOrder: 7 },
  { code: 'GERUND_INFINITIVE', name: 'Gerund / Infinitive', category: 'GRAMMAR', sortOrder: 8 },
  { code: 'COMPARISON', name: 'Comparison', category: 'GRAMMAR', sortOrder: 9 },
  { code: 'ARTICLES', name: 'Articles', category: 'GRAMMAR', sortOrder: 10 },
  { code: 'SUBJECT_VERB_AGREEMENT', name: 'Subject-Verb Agreement', category: 'GRAMMAR', sortOrder: 11 },
  { code: 'CONJUNCTIONS', name: 'Conjunctions', category: 'GRAMMAR', sortOrder: 12 },

  // Vocabulary
  { code: 'WORD_FORM', name: 'Word Form', category: 'VOCABULARY', sortOrder: 1 },
  { code: 'COLLOCATION', name: 'Collocation', category: 'VOCABULARY', sortOrder: 2 },
  { code: 'PHRASAL_VERBS', name: 'Phrasal Verbs', category: 'VOCABULARY', sortOrder: 3 },
  { code: 'PREPOSITIONS', name: 'Prepositions', category: 'VOCABULARY', sortOrder: 4 },
  { code: 'SYNONYM', name: 'Synonym', category: 'VOCABULARY', sortOrder: 5 },
  { code: 'ANTONYM', name: 'Antonym', category: 'VOCABULARY', sortOrder: 6 },
  { code: 'VOCAB_IN_CONTEXT_VOCAB', name: 'Vocabulary in Context (Vocab)', category: 'VOCABULARY', sortOrder: 7 },
  { code: 'IDIOMS', name: 'Idioms', category: 'VOCABULARY', sortOrder: 8 },

  // Reading
  { code: 'MAIN_IDEA', name: 'Main Idea', category: 'READING', sortOrder: 1 },
  { code: 'DETAIL', name: 'Detail', category: 'READING', sortOrder: 2 },
  { code: 'INFERENCE', name: 'Inference', category: 'READING', sortOrder: 3 },
  { code: 'REFERENCE', name: 'Reference', category: 'READING', sortOrder: 4 },
  { code: 'VOCAB_IN_CONTEXT_READING', name: 'Vocabulary in Context (Reading)', category: 'READING', sortOrder: 5 },
  { code: 'PURPOSE', name: 'Purpose', category: 'READING', sortOrder: 6 },

  // VSTEP listening forms and skills
  { code: 'VSTEP_LISTENING_FORMS', name: 'VSTEP Listening Parts', category: 'LISTENING', sortOrder: 10 },
  { code: 'ANNOUNCEMENT_INSTRUCTION', name: 'Announcement / Instruction', category: 'LISTENING', parentCode: 'VSTEP_LISTENING_FORMS', sortOrder: 1 },
  { code: 'CONVERSATION', name: 'Conversation', category: 'LISTENING', parentCode: 'VSTEP_LISTENING_FORMS', sortOrder: 2 },
  { code: 'TALK_LECTURE', name: 'Talk / Lecture', category: 'LISTENING', parentCode: 'VSTEP_LISTENING_FORMS', sortOrder: 3 },
  { code: 'LISTENING_MAIN_IDEA', name: 'Main Idea (Listening)', category: 'LISTENING', sortOrder: 11 },
  { code: 'DETAIL_INFORMATION', name: 'Detail Information', category: 'LISTENING', sortOrder: 12 },
  { code: 'SPEAKER_INTENT_OR_PURPOSE', name: 'Speaker Intent or Purpose', category: 'LISTENING', sortOrder: 13 },
  { code: 'ATTITUDE_OR_OPINION', name: 'Attitude or Opinion', category: 'LISTENING', sortOrder: 14 },
  { code: 'LISTENING_INFERENCE', name: 'Inference (Listening)', category: 'LISTENING', sortOrder: 15 },

  // VSTEP reading skills
  { code: 'DETAIL_INFORMATION_READING', name: 'Detail Information (Reading)', category: 'READING', sortOrder: 7 },
  { code: 'VOCABULARY_IN_CONTEXT', name: 'Vocabulary in Context', category: 'READING', sortOrder: 8 },
  { code: 'READING_MAIN_IDEA', name: 'Main Idea (Reading)', category: 'READING', sortOrder: 9 },
  { code: 'SENTENCE_INSERTION', name: 'Sentence Insertion', category: 'READING', sortOrder: 9 },
  { code: 'SENTENCE_MEANING', name: 'Sentence Meaning', category: 'READING', sortOrder: 10 },
  { code: 'AUTHOR_PURPOSE', name: 'Author Purpose', category: 'READING', sortOrder: 11 },

  // VSTEP writing/speaking dimensions and topics
  { code: 'LETTER_EMAIL', name: 'Letter / Email', category: 'WRITING', sortOrder: 1 },
  { code: 'AGREE_DISAGREE', name: 'Agree / Disagree', category: 'WRITING', sortOrder: 2 },
  { code: 'DISCUSS_BOTH_SIDES', name: 'Discuss Both Sides', category: 'WRITING', sortOrder: 3 },
  { code: 'PROBLEM_SOLUTION', name: 'Problem / Solution', category: 'WRITING', sortOrder: 4 },
  { code: 'SOCIAL_INTERACTION', name: 'Social Interaction', category: 'SPEAKING', sortOrder: 3 },
  { code: 'SOLUTION_DISCUSSION', name: 'Solution Discussion', category: 'SPEAKING', sortOrder: 4 },
  { code: 'TOPIC_DEVELOPMENT', name: 'Topic Development', category: 'SPEAKING', sortOrder: 5 },
  { code: 'HOMETOWN', name: 'Hometown', category: 'SPEAKING', sortOrder: 6 },
  { code: 'HOLIDAYS', name: 'Holidays', category: 'SPEAKING', sortOrder: 7 },
  { code: 'JOB', name: 'Job', category: 'SPEAKING', sortOrder: 8 },
  { code: 'TRANSPORT', name: 'Transport', category: 'SPEAKING', sortOrder: 9 },
  { code: 'NEWS_NEWSPAPERS', name: 'News / Newspapers', category: 'SPEAKING', sortOrder: 10 },
  { code: 'SOUND_NOISE', name: 'Sound / Noise', category: 'SPEAKING', sortOrder: 11 },

  // Existing HCMUS-specific forms
  // Listening
  { code: 'LISTEN_SHORT_CONVERSATION', name: 'Short Conversation', category: 'LISTENING', sortOrder: 1 },
  { code: 'LISTEN_LONG_CONVERSATION', name: 'Long Conversation', category: 'LISTENING', sortOrder: 2 },
  { code: 'LISTEN_TALK', name: 'Talk / Monologue', category: 'LISTENING', sortOrder: 3 },

  // Speaking
  { code: 'SPEAK_SELF_INTRODUCTION', name: 'Self Introduction', category: 'SPEAKING', sortOrder: 1 },
  { code: 'SPEAK_GUIDED_CONVERSATION', name: 'Guided Conversation', category: 'SPEAKING', sortOrder: 2 },
];

const questionTypeSeeds = [
  // Grammar
  { code: 'MCQ_SINGLE_BLANK', name: 'MCQ Single Blank', category: 'GRAMMAR' },
  { code: 'SENTENCE_COMPLETION', name: 'Sentence Completion', category: 'GRAMMAR' },
  { code: 'CLOZE_TEST', name: 'Cloze Test', category: 'GRAMMAR' },
  { code: 'SENTENCE_TRANSFORMATION', name: 'Sentence Transformation', category: 'GRAMMAR' },
  // Vocabulary
  { code: 'VOCABULARY_MCQ', name: 'Vocabulary MCQ', category: 'VOCABULARY' },
  { code: 'VOCABULARY', name: 'Vocabulary (general)', category: 'VOCABULARY' },
  // Reading
  { code: 'READING_COMPREHENSION', name: 'Reading Comprehension', category: 'READING' },
  { code: 'READING_MAIN_IDEA', name: 'Reading - Main Idea', category: 'READING' },
  { code: 'READING_DETAIL', name: 'Reading - Detail', category: 'READING' },
  { code: 'READING_INFERENCE', name: 'Reading - Inference', category: 'READING' },
  // Listening
  { code: 'LISTENING_MCQ', name: 'Listening MCQ (generic)', category: 'LISTENING' },
  { code: 'ANNOUNCEMENT_INSTRUCTION', name: 'Announcement / Instruction', category: 'LISTENING' },
  { code: 'CONVERSATION', name: 'Conversation', category: 'LISTENING' },
  { code: 'TALK_LECTURE', name: 'Talk / Lecture', category: 'LISTENING' },
  { code: 'SHORT_CONVERSATION', name: 'Listening - Short Conversation', category: 'LISTENING' },
  { code: 'LONG_CONVERSATION', name: 'Listening - Long Conversation', category: 'LISTENING' },
  { code: 'TALK', name: 'Listening - Talk / Monologue', category: 'LISTENING' },
  // Speaking
  { code: 'SELF_INTRODUCTION', name: 'Speaking - Self Introduction', category: 'SPEAKING' },
  { code: 'GUIDED_CONVERSATION', name: 'Speaking - Guided Conversation', category: 'SPEAKING' },
  { code: 'SPEAKING', name: 'Speaking (general)', category: 'SPEAKING' },
  // Writing
  { code: 'LETTER_EMAIL', name: 'Letter / Email', category: 'WRITING' },
  { code: 'ESSAY', name: 'Essay', category: 'WRITING' },
  // VSTEP speaking parts
  { code: 'SOCIAL_INTERACTION', name: 'Social Interaction', category: 'SPEAKING' },
  { code: 'SOLUTION_DISCUSSION', name: 'Solution Discussion', category: 'SPEAKING' },
  { code: 'TOPIC_DEVELOPMENT', name: 'Topic Development', category: 'SPEAKING' },
];

async function seedExamTypes() {
  const types = [
    {
      code: 'HCMUS_MASTER_ENTRANCE',
      name: 'HCMUS Master Entrance',
      description: 'HCMUS graduate school English entrance exam (B1-B2 band)',
      levelFrom: 'B1' as const,
      levelTo: 'B2' as const,
    },
    {
      code: 'B1',
      name: 'B1 (CEFR)',
      description: 'CEFR B1 general English target',
      levelFrom: 'B1' as const,
      levelTo: 'B1' as const,
    },
    {
      code: 'B2',
      name: 'B2 (CEFR)',
      description: 'CEFR B2 general English target',
      levelFrom: 'B2' as const,
      levelTo: 'B2' as const,
    },
    {
      code: 'VSTEP',
      name: 'VSTEP 3-5',
      description: 'Vietnamese Standardized Test of English Proficiency format',
      levelFrom: 'B1' as const,
      levelTo: 'B2' as const,
    },
    {
      code: 'CUSTOM',
      name: 'Custom',
      description: 'Custom exam pattern',
      levelFrom: null,
      levelTo: null,
    },
  ];

  // Remove obsolete VSTEP seed if it exists from an older seed run.
  await prisma.examType.deleteMany({ where: { code: 'VSTEP_3_5' } });

  for (const t of types) {
    await prisma.examType.upsert({
      where: { code: t.code },
      update: {
        name: t.name,
        description: t.description,
        levelFrom: t.levelFrom,
        levelTo: t.levelTo,
      },
      create: t,
    });
  }
}

async function seedTopics() {
  // pass 1: parentless
  for (const t of topicSeeds.filter((x) => !x.parentCode)) {
    await prisma.topic.upsert({
      where: { code: t.code },
      update: { name: t.name, category: t.category, sortOrder: t.sortOrder ?? 0 },
      create: {
        code: t.code,
        name: t.name,
        category: t.category,
        sortOrder: t.sortOrder ?? 0,
      },
    });
  }
  // pass 2: children
  for (const t of topicSeeds.filter((x) => x.parentCode)) {
    const parent = await prisma.topic.findUnique({ where: { code: t.parentCode! } });
    if (!parent) throw new Error(`Parent topic missing: ${t.parentCode}`);
    await prisma.topic.upsert({
      where: { code: t.code },
      update: {
        name: t.name,
        category: t.category,
        sortOrder: t.sortOrder ?? 0,
        parentId: parent.id,
      },
      create: {
        code: t.code,
        name: t.name,
        category: t.category,
        parentId: parent.id,
        sortOrder: t.sortOrder ?? 0,
      },
    });
  }
}

async function seedQuestionTypes() {
  for (const qt of questionTypeSeeds) {
    await prisma.questionType.upsert({
      where: { code: qt.code },
      update: { name: qt.name, category: qt.category },
      create: qt,
    });
  }
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'admin123!';
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN', status: 'ACTIVE' },
    create: {
      email,
      passwordHash,
      name: 'Admin',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  return admin;
}

async function seedHcmusPattern(adminId: string) {
  const examType = await prisma.examType.findUnique({
    where: { code: 'HCMUS_MASTER_ENTRANCE' },
  });
  if (!examType) throw new Error('HCMUS exam type missing');

  // Canonical exam pattern (no PDF, no file)
  const exam = await prisma.exam.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {
      title: 'HCMUS Master Entrance - Structure Reference (2026)',
      durationMinutes: 120,
      totalScore: 100,
      status: 'REVIEWED',
    },
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      examTypeId: examType.id,
      title: 'HCMUS Master Entrance - Canonical Pattern',
      source: 'Project-authoritative 2026 structure reference; not an official paper',
      detectedLevel: 'B1_B2',
      durationMinutes: 120,
      totalScore: 100,
      status: 'REVIEWED',
    },
  });

  const sections = [
    { code: 'VOCABULARY_READING', name: 'Vocabulary & Reading', position: 1 },
    { code: 'GRAMMAR_USE_OF_ENGLISH', name: 'Grammar & Use of English', position: 2 },
    { code: 'LISTENING', name: 'Listening', position: 3 },
    { code: 'SPEAKING', name: 'Speaking', position: 4 },
  ];
  for (const s of sections) {
    await prisma.examSection.upsert({
      where: { examId_code: { examId: exam.id, code: s.code } },
      update: { name: s.name, position: s.position },
      create: { ...s, examId: exam.id },
    });
  }

  // Reconstructed structure reference; no official paper is bundled.
  const blueprint = await prisma.examBlueprint.upsert({
    where: { id: '00000000-0000-0000-0000-000000000010' },
    update: {
      name: 'HCMUS Master Entrance 2026 Structure Reference',
      version: '2026.1.0',
      source: 'Project-authoritative structure reference; verify against the current university notice',
      provenance: 'RECONSTRUCTED',
      durationMinutes: 120,
      totalScore: 100,
      status: 'DRAFT',
      sourceExamCount: 0,
    },
    create: {
      id: '00000000-0000-0000-0000-000000000010',
      examTypeId: examType.id,
      name: 'HCMUS Master Entrance 2026 Structure Reference',
      version: '2026.1.0',
      source: 'Project-authoritative structure reference; verify against the current university notice',
      provenance: 'RECONSTRUCTED',
      durationMinutes: 120,
      totalScore: 100,
      status: 'DRAFT',
      sourceExamCount: 0,
    }
  });

  // Blueprint items — grammar distribution (kept + level upgraded)
  // Clear existing items for a clean idempotent reseed
  await prisma.examBlueprintItem.deleteMany({ where: { blueprintId: blueprint.id } });

  const wantedTopics = [
    'TENSES',
    'WORD_FORM',
    'PREPOSITIONS',
    'CONDITIONALS',
    'RELATIVE_CLAUSES',
    'WISH',
    'PASSIVE_VOICE',
    'READ_MAIN_IDEA_TOPIC',
    'MAIN_IDEA',
    'DETAIL',
    'INFERENCE',
  ];
  const topicRows = await prisma.topic.findMany({
    where: { code: { in: wantedTopics } },
    select: { id: true, code: true },
  });
  const codeToTopic = new Map(topicRows.map((r) => [r.code, { id: r.id }]));

  const wantedQts = [
    'VOCABULARY',
    'READING_COMPREHENSION',
    'SHORT_CONVERSATION',
    'LONG_CONVERSATION',
    'TALK',
    'SELF_INTRODUCTION',
    'GUIDED_CONVERSATION',
  ];
  const qtRows = await prisma.questionType.findMany({
    where: { code: { in: wantedQts } },
    select: { id: true, code: true },
  });
  const codeToQt = new Map(qtRows.map((r) => [r.code, { id: r.id }]));

  // GRAMMAR & USE OF ENGLISH — same 7 grammar/vocab weights as before
  const grammarDistribution: Array<{ topicCode: string; weight: number }> = [
    { topicCode: 'TENSES', weight: 0.2 },
    { topicCode: 'WORD_FORM', weight: 0.17 },
    { topicCode: 'PREPOSITIONS', weight: 0.15 },
    { topicCode: 'CONDITIONALS', weight: 0.14 },
    { topicCode: 'RELATIVE_CLAUSES', weight: 0.11 },
    { topicCode: 'WISH', weight: 0.09 },
    { topicCode: 'PASSIVE_VOICE', weight: 0.07 },
  ];

  for (const d of grammarDistribution) {
    const topic = codeToTopic.get(d.topicCode);
    if (!topic) continue;
    await prisma.examBlueprintItem.create({
      data: {
        blueprintId: blueprint.id,
        sectionCode: 'GRAMMAR_USE_OF_ENGLISH',
        topicId: topic.id,
        weight: d.weight,
        level: 'B1_B2',
      },
    });
  }
  // Grammar "OTHER" catch-all
  await prisma.examBlueprintItem.create({
    data: {
      blueprintId: blueprint.id,
      sectionCode: 'GRAMMAR_USE_OF_ENGLISH',
      weight: 0.07,
      level: 'B1_B2',
    },
  });

  // VOCABULARY & READING — split 40% vocabulary MCQ, 60% reading comprehension
  const vocabQt = codeToQt.get('VOCABULARY');
  const readingQt = codeToQt.get('READING_COMPREHENSION');
  if (vocabQt) {
    await prisma.examBlueprintItem.create({
      data: {
        blueprintId: blueprint.id,
        sectionCode: 'VOCABULARY_READING',
        questionTypeId: vocabQt.id,
        weight: 0.4,
        level: 'B1_B2',
      },
    });
  }
  if (readingQt) {
    await prisma.examBlueprintItem.create({
      data: {
        blueprintId: blueprint.id,
        sectionCode: 'VOCABULARY_READING',
        questionTypeId: readingQt.id,
        weight: 0.6,
        level: 'B1_B2',
      },
    });
  }

  // LISTENING — 3 sub-parts weighted evenly-ish
  const listeningItems: Array<{ qtCode: string; weight: number }> = [
    { qtCode: 'SHORT_CONVERSATION', weight: 0.35 },
    { qtCode: 'LONG_CONVERSATION', weight: 0.35 },
    { qtCode: 'TALK', weight: 0.3 },
  ];
  for (const it of listeningItems) {
    const qt = codeToQt.get(it.qtCode);
    if (!qt) continue;
    await prisma.examBlueprintItem.create({
      data: {
        blueprintId: blueprint.id,
        sectionCode: 'LISTENING',
        questionTypeId: qt.id,
        weight: it.weight,
        level: 'B1_B2',
      },
    });
  }

  // SPEAKING — 2 tasks
  const speakingItems: Array<{ qtCode: string; weight: number }> = [
    { qtCode: 'SELF_INTRODUCTION', weight: 0.3 },
    { qtCode: 'GUIDED_CONVERSATION', weight: 0.7 },
  ];
  for (const it of speakingItems) {
    const qt = codeToQt.get(it.qtCode);
    if (!qt) continue;
    await prisma.examBlueprintItem.create({
      data: {
        blueprintId: blueprint.id,
        sectionCode: 'SPEAKING',
        questionTypeId: qt.id,
        weight: it.weight,
        level: 'B1_B2',
      },
    });
  }

  // Reference admin so lint doesn't warn about unused; also proves link works
  void adminId;
}

async function seedVstepPattern() {
  const examType = await prisma.examType.findUnique({ where: { code: 'VSTEP' } });
  if (!examType) throw new Error('VSTEP exam type missing');
  const exam = await prisma.exam.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: { title: 'VSTEP 3-5 Canonical Format', status: 'REVIEWED' },
    create: { id: '00000000-0000-0000-0000-000000000002', examTypeId: examType.id, title: 'VSTEP 3-5 Canonical Format', source: 'Source-derived VSTEP format', detectedLevel: 'B1_B2', durationMinutes: 172, totalScore: 100, status: 'REVIEWED' },
  });
  const sections = [
    { code: 'LISTENING', name: 'Listening', position: 1, questionCount: 35, partCount: 3, durationMinutes: 40 },
    { code: 'READING', name: 'Reading', position: 2, questionCount: 40, passageCount: 4, durationMinutes: 60 },
    { code: 'WRITING', name: 'Writing', position: 3, taskCount: 2, durationMinutes: 60 },
    { code: 'SPEAKING', name: 'Speaking', position: 4, partCount: 3, durationMinutes: 12 },
  ];
  for (const section of sections) {
    await prisma.examSection.upsert({ where: { examId_code: { examId: exam.id, code: section.code } }, update: section, create: { ...section, examId: exam.id } });
  }
  const blueprint = await prisma.examBlueprint.upsert({
    where: { id: '00000000-0000-0000-0000-000000000020' },
    update: { name: 'VSTEP 3-5 v1', status: 'ACTIVE', source: 'Source-derived format; not an official paper', provenance: 'RECONSTRUCTED', durationMinutes: 172, totalScore: 100, sourceExamCount: 1 },
    create: { id: '00000000-0000-0000-0000-000000000020', examTypeId: examType.id, name: 'VSTEP 3-5 v1', version: '1.0.0', source: 'Source-derived format; not an official paper', provenance: 'RECONSTRUCTED', durationMinutes: 172, totalScore: 100, status: 'ACTIVE', sourceExamCount: 1 },
  });
  await prisma.examBlueprintItem.deleteMany({ where: { blueprintId: blueprint.id } });
  const types = await prisma.questionType.findMany({ where: { code: { in: ['ANNOUNCEMENT_INSTRUCTION', 'CONVERSATION', 'TALK_LECTURE', 'READING_COMPREHENSION', 'LETTER_EMAIL', 'ESSAY', 'SOCIAL_INTERACTION', 'SOLUTION_DISCUSSION', 'TOPIC_DEVELOPMENT'] } } });
  const byCode = new Map(types.map((type) => [type.code, type.id]));
  const items = [
    ['LISTENING', 'ANNOUNCEMENT_INSTRUCTION', 8], ['LISTENING', 'CONVERSATION', 12], ['LISTENING', 'TALK_LECTURE', 15],
    ['READING', 'READING_COMPREHENSION', 40], ['WRITING', 'LETTER_EMAIL', 1], ['WRITING', 'ESSAY', 1],
    ['SPEAKING', 'SOCIAL_INTERACTION', 1], ['SPEAKING', 'SOLUTION_DISCUSSION', 1], ['SPEAKING', 'TOPIC_DEVELOPMENT', 1],
  ] as const;
  for (const [sectionCode, typeCode, questionCount] of items) {
    const questionTypeId = byCode.get(typeCode);
    if (questionTypeId) await prisma.examBlueprintItem.create({ data: { blueprintId: blueprint.id, sectionCode, questionTypeId, questionCount, level: 'B1_B2' } });
  }
}

async function main() {
  console.log('Seeding...');
  await seedExamTypes();
  await seedTopics();
  await seedQuestionTypes();
  const admin = await seedAdmin();
  await seedHcmusPattern(admin.id);
  await seedVstepPattern();
  console.log('Seed complete.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
