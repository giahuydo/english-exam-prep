export type QuestionId = number;
export type ContextId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
export type ClusterId = 'error-handling' | 'observability' | 'rag' | 'workflow' | 'tool-calling' | 'tool-safety' | 'quality' | 'production-ai' | 'ocr' | 'gap';
export type StoryId = 'hybrid-rag' | 'llm-reliability' | 'ocr-cpu-gpu';
export type TriggerId = 'reliability' | 'agent-tools' | 'workflow' | 'quality' | 'security' | 'retrieval';

export type Bilingual = { en: string; vi: string };
export type AnswerSection = Bilingual & { id: string };
export type Context = { id: ContextId; title: string; path: string[] };
export type PhraseCluster = { id: ClusterId; title: string; path: string[] };
export type HeroStory = { id: StoryId; title: string; path: string[] };
export type Trigger = { id: TriggerId; phrases: string; contextIds: ContextId[] };
export type MemoryNode = { id: string; label: string; triggers: string[]; phrase?: string; answerSectionId?: string };
export type InterviewQuestion = {
  id: QuestionId;
  question: Bilingual;
  answer: { sections: AnswerSection[] };
  contextIds: ContextId[];
  clusterIds: ClusterId[];
  storyIds?: StoryId[];
  memory: { nodes: MemoryNode[] };
};
