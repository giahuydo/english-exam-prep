import { interviewQuestions } from './data';
import type { ClusterId, ContextId, HeroStory, PhraseCluster, QuestionId, StoryId, Trigger, TriggerId, Context, MemoryNode } from './types';
export type { Context, MemoryNode } from './types';

export const contexts: Context[] = [
  { id: 'A', title: 'Backend → Applied AI → Production', path: ['Backend foundation', 'Applied AI', 'Production reliability'] },
  { id: 'B', title: 'RAG / Hybrid Retrieval', path: ['Lexical search + semantic search', 'RRF', 'Fallback + access scope'] },
  { id: 'C', title: 'AI Reliability', path: ['Root cause', 'Error strategy', 'Observability'] },
  { id: 'D', title: 'OCR CPU → GPU', path: ['Memory problem', 'Trace bottleneck', 'Stabilize CPU', 'GPU-backed service'] },
  { id: 'E', title: 'Agent Architecture', path: ['Intent', 'Context', 'Tool decision', 'Backend control', 'Validation → result'] },
  { id: 'F', title: 'Workflow / Temporal', path: ['Long-running job', 'State + checkpoint', 'Retry + idempotency', 'Recovery'] },
  { id: 'G', title: 'Evals / Quality', path: ['Retrieval quality', 'Groundedness', 'Correctness', 'Eval + regression'] },
  { id: 'H', title: 'Tool Security', path: ['Least privilege', 'Validate + permission check', 'Execute + audit'] },
  { id: 'I', title: 'Learning / Adaptation', path: ['Honest gap', 'Transferable foundation', 'Learn the abstraction'] },
  { id: 'J', title: 'Ownership / Disagreement', path: ['Understand', 'Evidence + trade-offs', 'Align + verify'] },
];

export const phraseClusters: PhraseCluster[] = [
  { id: 'error-handling', title: 'Error handling', path: ['Network error · timeout', 'Bounded retry', 'Fallback · fail fast'] },
  { id: 'observability', title: 'Observability', path: ['Request/job ID', 'Model · latency · retry count', 'Error type · token usage'] },
  { id: 'rag', title: 'RAG / retrieval', path: ['Lexical + semantic search', 'RRF', 'Fallback · access scope'] },
  { id: 'workflow', title: 'Long-running workflow', path: ['Job state', 'Checkpoint · retry', 'Idempotency · recovery'] },
  { id: 'tool-calling', title: 'Tool calling', path: ['Tool schema', 'Validate arguments', 'Permission → execute → result'] },
  { id: 'tool-safety', title: 'Tool safety', path: ['Least privilege', 'Permission + validation', 'Audit · idempotency'] },
  { id: 'quality', title: 'LLM quality', path: ['Retrieval quality', 'Groundedness · correctness', 'Eval dataset · regression'] },
  { id: 'production-ai', title: 'Production AI', path: ['Latency · cost', 'Reliability', 'Observability'] },
  { id: 'ocr', title: 'OCR incident', path: ['Memory pressure', 'Trace bottleneck', 'Smaller batches → recovery', 'GPU-backed service'] },
  { id: 'gap', title: 'Gap answer', path: ["Haven't used X directly", 'Solved similar problems', 'Learn the specific abstraction'] },
];

export const heroStories: HeroStory[] = [
  { id: 'hybrid-rag', title: 'Hybrid RAG', path: ['Lexical + semantic search', 'RRF', 'Lexical fallback', 'Access scope'] },
  { id: 'llm-reliability', title: 'LLM reliability', path: ['Inspect whole flow', 'Classify failure', 'Retry / fallback / fail-fast', 'Observability'] },
  { id: 'ocr-cpu-gpu', title: 'OCR CPU → GPU', path: ['Memory problem', 'Trace bottleneck', 'Stabilize CPU', 'Checkpoint / recovery', 'Remote GPU service'] },
];

export const triggers: Trigger[] = [
  { id: 'reliability', phrases: 'timeout · retry · latency · cost', contextIds: ['C'] },
  { id: 'agent-tools', phrases: 'agent · tool calling · function calling', contextIds: ['E'] },
  { id: 'workflow', phrases: 'Temporal · long-running · recover', contextIds: ['F'] },
  { id: 'quality', phrases: 'groundedness · regression · eval', contextIds: ['G', 'C'] },
  { id: 'security', phrases: 'permission · audit · least privilege', contextIds: ['H'] },
  { id: 'retrieval', phrases: 'RAG · vector · ranking · retrieval', contextIds: ['B', 'G'] },
];

export function getQuestionRelations(questionId: QuestionId) { return interviewQuestions.find((item) => item.id === questionId); }
export function getContextsForQuestion(questionId: QuestionId) { const ids = getQuestionRelations(questionId)?.contextIds ?? []; return contexts.filter((item) => ids.includes(item.id)); }
export function getClustersForQuestion(questionId: QuestionId) { const ids = getQuestionRelations(questionId)?.clusterIds ?? []; return phraseClusters.filter((item) => ids.includes(item.id)); }
export function getStoriesForQuestion(questionId: QuestionId) { const ids = getQuestionRelations(questionId)?.storyIds ?? []; return heroStories.filter((item) => ids.includes(item.id)); }
export function getQuestionsForContext(contextId: ContextId) { return interviewQuestions.filter((item) => item.contextIds.includes(contextId)).map((item) => item.id); }
export function getQuestionsForCluster(clusterId: ClusterId) { return interviewQuestions.filter((item) => item.clusterIds.includes(clusterId)).map((item) => item.id); }
export function getQuestionsForStory(storyId: StoryId) { return interviewQuestions.filter((item) => item.storyIds?.includes(storyId)).map((item) => item.id); }
export function getContextsForTrigger(triggerId: TriggerId) { const item = triggers.find((trigger) => trigger.id === triggerId); return contexts.filter((context) => item?.contextIds.includes(context.id)); }
export function getRelatedQuestions(questionId: QuestionId) {
  const question = getQuestionRelations(questionId);
  if (!question) return [];
  return interviewQuestions.filter((item) => item.id !== questionId && (
    item.contextIds.some((id) => question.contextIds.includes(id)) ||
    item.clusterIds.some((id) => question.clusterIds.includes(id)) ||
    item.storyIds?.some((id) => question.storyIds?.includes(id))
  )).map((item) => item.id);
}
export function getMemoryNodes(questionId: QuestionId): MemoryNode[] {
  const question = getQuestionRelations(questionId);
  return question?.memory.nodes ?? [];
}
export function questionLabel(id: QuestionId) { return interviewQuestions.find((q) => q.id === id)?.question.en ?? `Question ${id}`; }

export function searchQuestions(query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return interviewQuestions.map((question) => ({ question, score: 0 }));
  return interviewQuestions.map((question) => {
    const questionContexts = contexts.filter((context) => question.contextIds.includes(context.id));
    const questionClusters = phraseClusters.filter((cluster) => question.clusterIds.includes(cluster.id));
    const questionStories = heroStories.filter((story) => question.storyIds?.includes(story.id));
    const searchable = [
      question.question.en,
      question.question.vi,
      ...question.answer.sections.flatMap((section) => [section.en, section.vi]),
      ...questionContexts.flatMap((context) => [context.title, ...context.path]),
      ...questionClusters.flatMap((cluster) => [cluster.title, ...cluster.path]),
      ...questionStories.flatMap((story) => [story.title, ...story.path]),
      ...question.memory.nodes.flatMap((node) => [node.label, ...node.triggers]),
    ].join(' ').toLowerCase();
    const score = terms.reduce((total, term) => total + (searchable.includes(term) ? 1 : 0), 0);
    return { question, score };
  }).filter((result) => result.score > 0).sort((a, b) => b.score - a.score || a.question.id - b.question.id);
}
