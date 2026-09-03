/**
 * Seed baseline domain data:
 *  - exam types (HCMUS, VSTEP, CUSTOM)
 *  - topic taxonomy (Grammar / Vocabulary / Reading + hierarchies)
 *  - question types
 *  - HCMUS canonical exam pattern + sections + draft blueprint
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
];

const questionTypeSeeds = [
  { code: 'MCQ_SINGLE_BLANK', name: 'MCQ Single Blank', category: 'GRAMMAR' },
  { code: 'SENTENCE_COMPLETION', name: 'Sentence Completion', category: 'GRAMMAR' },
  { code: 'CLOZE_TEST', name: 'Cloze Test', category: 'GRAMMAR' },
  { code: 'SENTENCE_TRANSFORMATION', name: 'Sentence Transformation', category: 'GRAMMAR' },
  { code: 'VOCABULARY_MCQ', name: 'Vocabulary MCQ', category: 'VOCABULARY' },
  { code: 'READING_COMPREHENSION', name: 'Reading Comprehension', category: 'READING' },
  { code: 'READING_MAIN_IDEA', name: 'Reading - Main Idea', category: 'READING' },
  { code: 'READING_DETAIL', name: 'Reading - Detail', category: 'READING' },
  { code: 'READING_INFERENCE', name: 'Reading - Inference', category: 'READING' },
  { code: 'LISTENING_MCQ', name: 'Listening MCQ', category: 'LISTENING' },
  { code: 'ESSAY', name: 'Essay', category: 'WRITING' },
  { code: 'SPEAKING', name: 'Speaking', category: 'SPEAKING' },
];

async function seedExamTypes() {
  const types = [
    {
      code: 'HCMUS_MASTER_ENTRANCE',
      name: 'HCMUS Master Entrance',
      description: 'HCMUS graduate school English entrance exam',
      levelFrom: 'B1' as const,
      levelTo: 'B2' as const,
    },
    {
      code: 'VSTEP_3_5',
      name: 'VSTEP 3-5',
      description: 'Vietnamese Standardized Test of English Proficiency, levels B1-C1',
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
      title: 'HCMUS Master Entrance - Canonical Pattern',
      status: 'REVIEWED',
    },
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      examTypeId: examType.id,
      title: 'HCMUS Master Entrance - Canonical Pattern',
      source: 'Official pattern',
      detectedLevel: 'B1_B2',
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

  // Draft blueprint reflecting HCMUS grammar distribution
  const blueprint = await prisma.examBlueprint.upsert({
    where: { id: '00000000-0000-0000-0000-000000000010' },
    update: {
      name: 'HCMUS Master Entrance v1',
      version: '1.0.0',
      status: 'DRAFT',
      sourceExamCount: 0,
    },
    create: {
      id: '00000000-0000-0000-0000-000000000010',
      examTypeId: examType.id,
      name: 'HCMUS Master Entrance v1',
      version: '1.0.0',
      status: 'DRAFT',
      sourceExamCount: 0,
    },
  });

  // Blueprint items — grammar distribution
  // Clear existing items for a clean idempotent reseed
  await prisma.examBlueprintItem.deleteMany({ where: { blueprintId: blueprint.id } });

  const codeToTopic = new Map<string, { id: string }>();
  for (const t of await prisma.topic.findMany({
    where: {
      code: {
        in: [
          'TENSES',
          'WORD_FORM',
          'PREPOSITIONS',
          'CONDITIONALS',
          'RELATIVE_CLAUSES',
          'WISH',
          'PASSIVE_VOICE',
        ],
      },
    },
    select: { id: true, code: true },
  })) {
    codeToTopic.set(t.code, { id: t.id });
  }

  const distribution: Array<{ topicCode: string; weight: number }> = [
    { topicCode: 'TENSES', weight: 0.2 },
    { topicCode: 'WORD_FORM', weight: 0.17 },
    { topicCode: 'PREPOSITIONS', weight: 0.15 },
    { topicCode: 'CONDITIONALS', weight: 0.14 },
    { topicCode: 'RELATIVE_CLAUSES', weight: 0.11 },
    { topicCode: 'WISH', weight: 0.09 },
    { topicCode: 'PASSIVE_VOICE', weight: 0.07 },
  ];

  for (const d of distribution) {
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

  // "OTHER" catch-all item, no topic link
  await prisma.examBlueprintItem.create({
    data: {
      blueprintId: blueprint.id,
      sectionCode: 'GRAMMAR_USE_OF_ENGLISH',
      weight: 0.07,
      level: 'B1_B2',
    },
  });

  // Reference admin so lint doesn't warn about unused; also proves link works
  void adminId;
}

async function main() {
  console.log('Seeding...');
  await seedExamTypes();
  await seedTopics();
  await seedQuestionTypes();
  const admin = await seedAdmin();
  await seedHcmusPattern(admin.id);
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
