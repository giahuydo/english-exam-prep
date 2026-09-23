export type QuestionId = number;
export type ContextId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K';
export type MacroTopic = {
  id: 'ai-quality' | 'reliability-production' | 'agent-security' | 'ai-agent-workflow' | 'backend-workflow' | 'behavior-ownership';
  title: string;
  sourceContextIds: ContextId[];
  questionIds?: QuestionId[];
  summary: string;
  keywords: string[];
};
export type ClusterId = 'error-handling' | 'observability' | 'rag' | 'workflow' | 'tool-calling' | 'tool-safety' | 'quality' | 'production-ai' | 'ocr' | 'gap';
export type StoryId = 'hybrid-rag' | 'llm-reliability' | 'ocr-cpu-gpu';
export type TriggerId = 'reliability' | 'agent-tools' | 'ai-agent-workflow' | 'workflow' | 'quality' | 'security' | 'retrieval';
/** Shared speaking route for similar interview phrasings that can reuse one answer path. */
export type AnswerRouteId =
  | 'strangeloop-agent'
  | 'hybrid-retrieval'
  | 'llm-reliability'
  | 'gap-transfer'
  | 'tool-control'
  | 'ocr-incident';

export type Bilingual = { en: string; vi: string };
export type AnswerSection = Bilingual & { id: string; speakingCue?: string };
export type InterviewAudio = { full?: string; alignment?: string; sections?: Partial<Record<string, string>> };
export type Context = { id: ContextId; title: string; path: string[] };
export type PhraseCluster = { id: ClusterId; title: string; path: string[] };
export type HeroStory = { id: StoryId; title: string; path: string[] };
export type Trigger = { id: TriggerId; phrases: string; contextIds: ContextId[] };
export type AnswerRoute = {
  id: AnswerRouteId;
  title: string;
  /** What job this route is for when the interviewer rephrases the question. */
  job: string;
  /** Shared recall path — speak from this skeleton, then deepen on the primary question. */
  sharedPath: string[];
  /** Similar question phrasings that should map to this route. */
  similarPhrases: string[];
  /** Canonical deep-dive question to open for the full answer. */
  primaryQuestionId: QuestionId;
  relatedQuestionIds: QuestionId[];
};
export type MemoryNode = { id: string; label: string; triggers: string[]; phrase?: string; answerSectionId?: string };
export type InterviewFollowUp = {
  id: string;
  question: Bilingual;
  answer?: { sections: AnswerSection[] };
  memory?: { nodes: MemoryNode[] };
};
export type InterviewQuestion = {
  id: QuestionId;
  question: Bilingual;
  answer: { sections: AnswerSection[] };
  audio?: InterviewAudio;
  contextIds: ContextId[];
  clusterIds: ClusterId[];
  storyIds?: StoryId[];
  /** Shared answer routes for similar phrasings that can reuse one speaking path. */
  routeIds?: AnswerRouteId[];
  memory: { nodes: MemoryNode[] };
  followUps?: InterviewFollowUp[];
};
