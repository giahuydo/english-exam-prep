import { interviewQuestions } from './data';

export type QuestionId = number;
export type ContextId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
export type ClusterId =
  | 'error-handling'
  | 'observability'
  | 'rag'
  | 'workflow'
  | 'tool-calling'
  | 'tool-safety'
  | 'quality'
  | 'production-ai'
  | 'ocr'
  | 'gap';
export type StoryId = 'hybrid-rag' | 'llm-reliability' | 'ocr-cpu-gpu';
export type TriggerId = 'reliability' | 'agent-tools' | 'workflow' | 'quality' | 'security' | 'retrieval';

export type Context = { id: ContextId; title: string; path: string[] };
export type PhraseCluster = { id: ClusterId; title: string; path: string[] };
export type HeroStory = { id: StoryId; title: string; path: string[] };
export type Trigger = { id: TriggerId; phrases: string; contextIds: ContextId[] };

type QuestionRelations = {
  questionId: QuestionId;
  contextIds: ContextId[];
  clusterIds: ClusterId[];
  storyIds?: StoryId[];
};

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

// This is the one editable relationship table. Labels and learning paths above are display metadata.
export const questionRelations: QuestionRelations[] = [
  { questionId: 1, contextIds: ['A'], clusterIds: ['observability', 'production-ai'] },
  { questionId: 2, contextIds: ['B'], clusterIds: ['rag'], storyIds: ['hybrid-rag'] },
  { questionId: 3, contextIds: ['C'], clusterIds: ['error-handling', 'observability', 'production-ai'], storyIds: ['llm-reliability'] },
  { questionId: 4, contextIds: ['D'], clusterIds: ['workflow', 'ocr'], storyIds: ['ocr-cpu-gpu'] },
  { questionId: 5, contextIds: ['E'], clusterIds: ['error-handling', 'observability', 'workflow', 'tool-calling', 'production-ai'], storyIds: ['llm-reliability'] },
  { questionId: 6, contextIds: ['F'], clusterIds: ['error-handling', 'workflow', 'gap'] },
  { questionId: 7, contextIds: ['E'], clusterIds: ['tool-calling', 'gap'] },
  { questionId: 8, contextIds: ['G'], clusterIds: ['observability', 'quality', 'production-ai', 'gap'] },
  { questionId: 9, contextIds: ['A'], clusterIds: [] },
  { questionId: 10, contextIds: ['E', 'H'], clusterIds: ['tool-calling', 'tool-safety'] },
  { questionId: 11, contextIds: ['A', 'I'], clusterIds: ['workflow', 'gap'] },
  { questionId: 12, contextIds: ['E'], clusterIds: ['tool-calling'] },
  { questionId: 13, contextIds: ['C'], clusterIds: ['error-handling', 'observability', 'production-ai'], storyIds: ['llm-reliability'] },
  { questionId: 14, contextIds: ['C', 'G'], clusterIds: ['observability', 'quality', 'production-ai'], storyIds: ['llm-reliability'] },
  { questionId: 15, contextIds: ['B', 'G'], clusterIds: ['rag', 'quality', 'production-ai'], storyIds: ['hybrid-rag'] },
  { questionId: 16, contextIds: ['H'], clusterIds: ['tool-calling', 'tool-safety'] },
  { questionId: 17, contextIds: ['D'], clusterIds: ['ocr'] },
  { questionId: 18, contextIds: ['F'], clusterIds: ['error-handling', 'workflow', 'observability'] },
  { questionId: 19, contextIds: ['J'], clusterIds: [] },
];

export function getQuestionRelations(questionId: QuestionId) { return questionRelations.find((item) => item.questionId === questionId); }
export function getContextsForQuestion(questionId: QuestionId) { const ids = getQuestionRelations(questionId)?.contextIds ?? []; return contexts.filter((item) => ids.includes(item.id)); }
export function getClustersForQuestion(questionId: QuestionId) { const ids = getQuestionRelations(questionId)?.clusterIds ?? []; return phraseClusters.filter((item) => ids.includes(item.id)); }
export function getStoriesForQuestion(questionId: QuestionId) { const ids = getQuestionRelations(questionId)?.storyIds ?? []; return heroStories.filter((item) => ids.includes(item.id)); }
export function getQuestionsForContext(contextId: ContextId) { return questionRelations.filter((item) => item.contextIds.includes(contextId)).map((item) => item.questionId); }
export function getQuestionsForCluster(clusterId: ClusterId) { return questionRelations.filter((item) => item.clusterIds.includes(clusterId)).map((item) => item.questionId); }
export function getQuestionsForStory(storyId: StoryId) { return questionRelations.filter((item) => item.storyIds?.includes(storyId)).map((item) => item.questionId); }
export function getContextsForTrigger(triggerId: TriggerId) { const item = triggers.find((trigger) => trigger.id === triggerId); return contexts.filter((context) => item?.contextIds.includes(context.id)); }
export function getRelatedQuestions(questionId: QuestionId) {
  const relation = getQuestionRelations(questionId);
  if (!relation) return [];
  const ids = new Set(questionRelations.filter((item) => item.questionId !== questionId && [...relation.contextIds, ...relation.clusterIds, ...(relation.storyIds ?? [])].some((id) => item.contextIds.includes(id as ContextId) || item.clusterIds.includes(id as ClusterId) || item.storyIds?.includes(id as StoryId))).map((item) => item.questionId));
  return [...ids];
}
export function questionLabel(id: QuestionId) { return interviewQuestions.find((q) => q.id === id)?.question.en ?? `Question ${id}`; }
