import { interviewQuestions } from './data';
import type { AnswerRoute, AnswerRouteId, ClusterId, ContextId, HeroStory, PhraseCluster, QuestionId, StoryId, Trigger, TriggerId, Context, MemoryNode, MacroTopic } from './types';
export type { AnswerRoute, AnswerRouteId, Context, MacroTopic, MemoryNode } from './types';

export const contexts: Context[] = [
  { id: 'K', title: 'AI Agent Workflow', path: ['Agent platform', 'Orchestration', 'Application / domain-tool boundary'] },
  { id: 'A', title: 'Backend → Applied AI → Production', path: ['Backend foundation', 'Applied AI', 'Production reliability'] },
  { id: 'B', title: 'Retrieval / Hybrid Search', path: ['Lexical search + semantic search', 'RRF', 'Fallback + access scope'] },
  { id: 'C', title: 'AI Reliability', path: ['Root cause', 'Error strategy', 'Observability'] },
  { id: 'D', title: 'OCR CPU → GPU', path: ['Memory problem', 'Trace bottleneck', 'Stabilize CPU', 'GPU-backed service'] },
  { id: 'E', title: 'Agent Architecture', path: ['Intent', 'Context', 'Tool decision', 'Backend control', 'Validation → result'] },
  { id: 'F', title: 'Workflow / Temporal', path: ['Long-running job', 'State + checkpoint', 'Retry + idempotency', 'Recovery'] },
  { id: 'G', title: 'Evals / Quality', path: ['Retrieval quality', 'Groundedness', 'Correctness', 'Eval + regression'] },
  { id: 'H', title: 'Tool Security', path: ['Least privilege', 'Validate + permission check', 'Execute + audit'] },
  { id: 'I', title: 'Learning / Adaptation', path: ['Honest gap', 'Transferable foundation', 'Learn the abstraction'] },
  { id: 'J', title: 'Ownership / Disagreement', path: ['Understand', 'Evidence + trade-offs', 'Align + verify'] },
];

export const macroTopics: MacroTopic[] = [
  { id: 'ai-quality', title: 'AI / Retrieval / Quality', sourceContextIds: ['B', 'G'], summary: 'Retrieval → ranking → groundedness → evals', keywords: ['retrieval', 'vector', 'ranking', 'hallucination', 'groundedness', 'eval'] },
  { id: 'reliability-production', title: 'Reliability / Production / OCR', sourceContextIds: ['C', 'D'], summary: 'Root cause → stabilize → observe → scale', keywords: ['error', 'retry', 'timeout', 'latency', 'cost', 'incident', 'OOM', 'performance'] },
  { id: 'agent-security', title: 'Agent / Tool Calling / Security', sourceContextIds: ['E', 'H'], summary: 'Intent → tools → permission → audit', keywords: ['agent', 'tool calling', 'function calling', 'permission', 'audit', 'tool safety'] },
  { id: 'ai-agent-workflow', title: 'AI Agent Workflow', sourceContextIds: ['K'], summary: 'Agent platform → orchestration → application boundary', keywords: ['StrangeLoop', 'LangChain', 'LangGraph', 'agent workflow', 'orchestration', 'workflow engine'] },
  { id: 'backend-workflow', title: 'Backend / Workflow / Temporal', sourceContextIds: ['A', 'F'], summary: 'Backend foundation → async workflow → recovery', keywords: ['backend experience', 'production AI', 'async', 'workflow', 'Temporal', 'checkpoint', 'idempotency'] },
  { id: 'behavior-ownership', title: 'Behavior / Gap / Ownership', sourceContextIds: ['I', 'J'], summary: 'Learn honestly → weigh trade-offs → own the result', keywords: ["haven't used", 'new stack', 'learning', 'disagreement', 'ownership', 'trade-off'] },
];

export const phraseClusters: PhraseCluster[] = [
  { id: 'error-handling', title: 'Error handling', path: ['Network error · timeout', 'Bounded retry', 'Fallback · fail fast'] },
  { id: 'observability', title: 'Observability', path: ['Request/job ID', 'Model · latency · retry count', 'Error type · token usage'] },
  { id: 'rag', title: 'Retrieval / hybrid search', path: ['Lexical + semantic search', 'RRF', 'Fallback · access scope'] },
  { id: 'workflow', title: 'Long-running workflow', path: ['Job state', 'Checkpoint · retry', 'Idempotency · recovery'] },
  { id: 'tool-calling', title: 'Tool calling', path: ['Tool schema', 'Validate arguments', 'Permission → execute → result'] },
  { id: 'tool-safety', title: 'Tool safety', path: ['Least privilege', 'Permission + validation', 'Audit · idempotency'] },
  { id: 'quality', title: 'LLM quality', path: ['Retrieval quality', 'Groundedness · correctness', 'Eval dataset · regression'] },
  { id: 'production-ai', title: 'Production AI', path: ['Latency · cost', 'Reliability', 'Observability'] },
  { id: 'ocr', title: 'OCR incident', path: ['Memory pressure', 'Trace bottleneck', 'Smaller batches → recovery', 'GPU-backed service'] },
  { id: 'gap', title: 'Gap answer', path: ["Haven't used X directly", 'Solved similar problems', 'Learn the specific abstraction'] },
];

export const heroStories: HeroStory[] = [
  { id: 'hybrid-rag', title: 'Hybrid retrieval', path: ['Lexical + semantic search', 'RRF', 'Lexical fallback', 'Access scope'] },
  { id: 'llm-reliability', title: 'LLM reliability', path: ['Inspect whole flow', 'Classify failure', 'Retry / fallback / fail-fast', 'Observability'] },
  { id: 'ocr-cpu-gpu', title: 'OCR CPU → GPU', path: ['Memory problem', 'Trace bottleneck', 'Stabilize CPU', 'Checkpoint / recovery', 'Remote GPU service'] },
];

/**
 * Shared answer routes: similar interviewer phrasings → one speaking skeleton.
 * Open the primary question for the deep answer; use related questions for angle shifts.
 */
export const answerRoutes: AnswerRoute[] = [
  {
    id: 'strangeloop-agent',
    title: 'StrangeLoop / agent platform',
    job: 'Any question about agent platforms, agent experience, or StrangeLoop vs LangChain/LangGraph.',
    sharedPath: ['StrangeLoop Studio + Engine', 'LLM / tools / decisions', 'Approval + data scope', 'Clear app vs platform boundary'],
    similarPhrases: [
      'agent platform / workflow engine project',
      'how much AI agent experience',
      'StrangeLoop vs LangChain / LangGraph',
      'design an AI agent workflow',
      'recent agent system you built',
    ],
    primaryQuestionId: 4,
    relatedQuestionIds: [7, 5, 12, 23, 10],
  },
  {
    id: 'hybrid-retrieval',
    title: 'Hybrid retrieval / RAG',
    job: 'Any question about retrieval, ranking, groundedness, or RAG quality.',
    sharedPath: ['Lexical + semantic', 'RRF ranking', 'Fallback + access', 'Grounding / citations / eval'],
    similarPhrases: [
      'describe a retrieval system',
      'is your RAG system good',
      'how do you prevent hallucination',
      'LLM evals / grounding quality',
    ],
    primaryQuestionId: 2,
    relatedQuestionIds: [15, 14, 8],
  },
  {
    id: 'llm-reliability',
    title: 'LLM reliability',
    job: 'Errors, retries, latency/cost, or whole-workflow failure handling.',
    sharedPath: ['Inspect whole workflow', 'Temporary vs permanent', 'Retry / fallback / fail fast', 'Observe + measure'],
    similarPhrases: [
      'handle errors in an LLM workflow',
      'control latency and cost',
      'what if the model / provider fails',
    ],
    primaryQuestionId: 3,
    relatedQuestionIds: [13, 18],
  },
  {
    id: 'gap-transfer',
    title: 'Honest gap + transfer',
    job: 'Questions about missing stack experience, Temporal, hire objections, or backend-vs-AI concerns.',
    sharedPath: ['Honest gap', 'Proof already shipped', 'Core ideas transfer', 'Learn the specific API fast'],
    similarPhrases: [
      'have you used Temporal',
      'how much agent experience / honest gap',
      'more backend than AI — why hire you for 70% AI',
      "haven't used our exact AI stack",
    ],
    primaryQuestionId: 9,
    relatedQuestionIds: [6, 7, 11],
  },
  {
    id: 'tool-control',
    title: 'Tool calling + safety',
    job: 'Tool calling, permissions, and agent tool security.',
    sharedPath: ['Small tool set', 'Backend contract / validate / permission', 'Execute + structured result', 'Audit / confirmation'],
    similarPhrases: [
      'experience with tool calling',
      'secure an agent that can call tools',
      'prevent unsafe tool calls',
    ],
    primaryQuestionId: 10,
    relatedQuestionIds: [16, 5, 12],
  },
  {
    id: 'ocr-incident',
    title: 'OCR CPU → GPU incident',
    job: 'Production incidents, OCR performance, or recent project storytelling.',
    sharedPath: ['Memory / crash symptom', 'Trace bottleneck', 'Stabilize CPU', 'Move heavy OCR to GPU'],
    similarPhrases: [
      'production incident you owned',
      'describe your recent project',
      'OCR performance / GPU',
    ],
    primaryQuestionId: 17,
    relatedQuestionIds: [22, 1],
  },
];

export const triggers: Trigger[] = [
  { id: 'reliability', phrases: 'timeout · retry · latency · cost', contextIds: ['C'] },
  { id: 'agent-tools', phrases: 'agent · tool calling · function calling', contextIds: ['E'] },
  { id: 'ai-agent-workflow', phrases: 'StrangeLoop · LangChain · LangGraph · orchestration', contextIds: ['K'] },
  { id: 'workflow', phrases: 'Temporal · long-running · recover', contextIds: ['F'] },
  { id: 'quality', phrases: 'groundedness · regression · eval', contextIds: ['G', 'C'] },
  { id: 'security', phrases: 'permission · audit · least privilege', contextIds: ['H'] },
  { id: 'retrieval', phrases: 'retrieval · vector · ranking · search', contextIds: ['B', 'G'] },
];

export function getQuestionRelations(questionId: QuestionId) { return interviewQuestions.find((item) => item.id === questionId); }
export function getContextsForQuestion(questionId: QuestionId) { const ids = getQuestionRelations(questionId)?.contextIds ?? []; return contexts.filter((item) => ids.includes(item.id)); }
export function getClustersForQuestion(questionId: QuestionId) { const ids = getQuestionRelations(questionId)?.clusterIds ?? []; return phraseClusters.filter((item) => ids.includes(item.id)); }
export function getStoriesForQuestion(questionId: QuestionId) { const ids = getQuestionRelations(questionId)?.storyIds ?? []; return heroStories.filter((item) => ids.includes(item.id)); }
export function getRoutesForQuestion(questionId: QuestionId) {
  const ids = getQuestionRelations(questionId)?.routeIds ?? [];
  if (ids.length) return answerRoutes.filter((route) => ids.includes(route.id));
  return answerRoutes.filter((route) => route.primaryQuestionId === questionId || route.relatedQuestionIds.includes(questionId));
}
export function getAnswerRoute(routeId: AnswerRouteId) { return answerRoutes.find((route) => route.id === routeId); }
export function getQuestionsForContext(contextId: ContextId) { return interviewQuestions.filter((item) => item.contextIds.includes(contextId)).map((item) => item.id); }
export function getQuestionsForMacroTopic(topicId: MacroTopic['id']) {
  const topic = macroTopics.find((item) => item.id === topicId);
  if (!topic) return [];
  return Array.from(new Set(interviewQuestions.filter((item) => item.contextIds.some((id) => topic.sourceContextIds.includes(id))).map((item) => item.id)));
}
export function getMacroTopicsForQuestion(questionId: QuestionId) {
  const ids = getQuestionRelations(questionId)?.contextIds ?? [];
  return macroTopics.filter((topic) => topic.sourceContextIds.some((id) => ids.includes(id)));
}
export function getQuestionsForCluster(clusterId: ClusterId) { return interviewQuestions.filter((item) => item.clusterIds.includes(clusterId)).map((item) => item.id); }
export function getQuestionsForStory(storyId: StoryId) { return interviewQuestions.filter((item) => item.storyIds?.includes(storyId)).map((item) => item.id); }
export function getContextsForTrigger(triggerId: TriggerId) { const item = triggers.find((trigger) => trigger.id === triggerId); return contexts.filter((context) => item?.contextIds.includes(context.id)); }
export function getMacroTopicsForTrigger(triggerId: TriggerId) {
  const contextIds = getContextsForTrigger(triggerId).map((context) => context.id);
  return macroTopics.filter((topic) => topic.sourceContextIds.some((id) => contextIds.includes(id)));
}
export function getRelatedQuestions(questionId: QuestionId) {
  const question = getQuestionRelations(questionId);
  if (!question) return [];
  const routeRelated = getRoutesForQuestion(questionId).flatMap((route) => [route.primaryQuestionId, ...route.relatedQuestionIds]);
  return interviewQuestions.filter((item) => item.id !== questionId && (
    routeRelated.includes(item.id) ||
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
    const questionRoutes = getRoutesForQuestion(question.id);
    const searchable = [
      question.question.en,
      question.question.vi,
      ...question.answer.sections.flatMap((section) => [section.en, section.vi]),
      ...questionContexts.flatMap((context) => [context.title, ...context.path]),
      ...macroTopics.filter((topic) => topic.sourceContextIds.some((id) => question.contextIds.includes(id))).flatMap((topic) => [topic.title, topic.summary, ...topic.keywords]),
      ...questionClusters.flatMap((cluster) => [cluster.title, ...cluster.path]),
      ...questionStories.flatMap((story) => [story.title, ...story.path]),
      ...questionRoutes.flatMap((route) => [route.title, route.job, ...route.sharedPath, ...route.similarPhrases]),
      ...question.memory.nodes.flatMap((node) => [node.label, ...node.triggers]),
    ].join(' ').toLowerCase();
    const score = terms.reduce((total, term) => total + (searchable.includes(term) ? 1 : 0), 0);
    return { question, score };
  }).filter((result) => result.score > 0).sort((a, b) => b.score - a.score || a.question.id - b.question.id);
}
