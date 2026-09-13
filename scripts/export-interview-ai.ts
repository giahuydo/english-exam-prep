import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  contexts,
  getRelatedQuestions,
  heroStories,
  phraseClusters,
  triggers,
} from '../apps/web/src/app/interview/connections';
import { interviewQuestions } from '../apps/web/src/app/interview/data';

const root = process.cwd();
const outputDir = path.join(root, 'exports');
const audioRoot = path.join(root, 'apps/web/public/audio/interview');

type AlignmentSummary = {
  questionId: string;
  speechText: string;
  wordCount: number;
  durationMs: number;
};

async function readAlignment(questionId: number): Promise<AlignmentSummary | null> {
  const file = path.join(audioRoot, `q${String(questionId).padStart(2, '0')}`, 'alignment.json');
  try {
    const alignment = JSON.parse(await readFile(file, 'utf8')) as {
      questionId: string;
      speechText: string;
      words: { endMs: number }[];
    };
    return {
      questionId: alignment.questionId,
      speechText: alignment.speechText,
      wordCount: alignment.words.length,
      durationMs: alignment.words.at(-1)?.endMs ?? 0,
    };
  } catch {
    return null;
  }
}

function relatedQuestions(questionId: number) {
  return getRelatedQuestions(questionId).map((id) => {
    const question = interviewQuestions.find((item) => item.id === id)!;
    return { id: question.id, question: question.question };
  });
}

async function buildDataset() {
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: {
      questions: 'apps/web/src/app/interview/data.ts',
      connections: 'apps/web/src/app/interview/connections.ts',
      audio: 'apps/web/public/audio/interview',
    },
    intro: interviewQuestions.length,
    taxonomies: { contexts, phraseClusters, heroStories, triggers },
    questions: await Promise.all(interviewQuestions.map(async (question) => {
      const alignment = await readAlignment(question.id);
      return {
        id: question.id,
        question: question.question,
        answer: question.answer.sections,
        connections: {
          contexts: contexts.filter((item) => question.contextIds.includes(item.id)),
          clusters: phraseClusters.filter((item) => question.clusterIds.includes(item.id)),
          stories: heroStories.filter((item) => question.storyIds?.includes(item.id)),
        },
        contextIds: question.contextIds,
        clusterIds: question.clusterIds,
        storyIds: question.storyIds ?? [],
        memoryPath: question.memory.nodes,
        followUps: question.followUps ?? [],
        relatedQuestions: relatedQuestions(question.id),
        audio: {
          full: question.audio?.full ?? null,
          alignment: question.audio?.alignment ?? null,
          alignmentSummary: alignment,
        },
      };
    })),
  };
}

function markdown(dataset: Awaited<ReturnType<typeof buildDataset>>) {
  const lines = [
    '# Interview AI Dataset',
    '',
    `Generated: ${dataset.generatedAt}`,
    `Questions: ${dataset.questions.length}`,
    '',
    'This export contains the bilingual interview questions, answer sections, connection taxonomy, memory paths, follow-ups, related questions, and audio alignment summaries.',
    '',
    '## Connection index',
    '',
  ];
  for (const context of contexts) {
    const ids = dataset.questions.filter((question) => question.contextIds.includes(context.id)).map((question) => `Q${question.id}`);
    lines.push(`### ${context.id} — ${context.title}`, '', `Path: ${context.path.join(' → ')}`, `Questions: ${ids.join(', ') || 'None'}`, '');
  }
  lines.push('## Questions', '');
  for (const question of dataset.questions) {
    lines.push(`## Q${question.id} — ${question.question.en}`, '', `Vietnamese: ${question.question.vi || '(not provided)'}`, '', `Contexts: ${question.connections.contexts.map((item) => `${item.id} — ${item.title}`).join('; ') || 'None'}`, `Clusters: ${question.connections.clusters.map((item) => item.title).join('; ') || 'None'}`, `Stories: ${question.connections.stories.map((item) => item.title).join('; ') || 'None'}`, '', '### Memory path', '', question.memoryPath.map((node) => `- **${node.label}**: ${node.triggers.join('; ')}`).join('\n') || '- None', '', '### Answer', '');
    for (const section of question.answer) lines.push(`#### ${section.id}`, '', `EN: ${section.en}`, `VI: ${section.vi || '(not provided)'}`, '');
    if (question.followUps.length) lines.push('### Follow-ups', '', ...question.followUps.map((followUp) => `- ${followUp.question.en}${followUp.question.vi ? ` — ${followUp.question.vi}` : ''}`), '');
    lines.push(`### Related questions`, '', question.relatedQuestions.map((related) => `- Q${related.id}: ${related.question.en}`).join('\n') || '- None', '', `Audio: ${question.audio.full ?? 'None'}`, `Alignment: ${question.audio.alignmentSummary ? `${question.audio.alignmentSummary.wordCount} words, ${question.audio.alignmentSummary.durationMs}ms` : 'Not generated'}`, '', '---', '');
  }
  return `${lines.join('\n')}\n`;
}

function jsonl(dataset: Awaited<ReturnType<typeof buildDataset>>) {
  return `${dataset.questions.map((question) => JSON.stringify({ id: `q${question.id}`, type: 'question', question: question.question, answer: question.answer, contextIds: question.contextIds, clusterIds: question.clusterIds, storyIds: question.storyIds, memoryPath: question.memoryPath, relatedQuestionIds: question.relatedQuestions.map((related) => related.id) })).join('\n')}\n`;
}

async function main() {
  const dataset = await buildDataset();
  await mkdir(outputDir, { recursive: true });
  await Promise.all([
    writeFile(path.join(outputDir, 'interview-ai.json'), `${JSON.stringify(dataset, null, 2)}\n`),
    writeFile(path.join(outputDir, 'interview-ai.md'), markdown(dataset)),
    writeFile(path.join(outputDir, 'interview-ai.jsonl'), jsonl(dataset)),
  ]);
  const audioCount = dataset.questions.filter((question) => question.audio.alignmentSummary).length;
  console.log(`Exported ${dataset.questions.length} questions to ${path.relative(root, outputDir)}`);
  console.log(`Audio alignments: ${audioCount}/${dataset.questions.length}`);
  console.log(`Files: interview-ai.json, interview-ai.md, interview-ai.jsonl`);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
