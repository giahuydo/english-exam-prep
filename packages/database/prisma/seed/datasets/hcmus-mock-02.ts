import { makeMockDataset } from './_factory';
export default makeMockDataset({
  key: 'HCMUS_MOCK_02', examTypeCode: 'HCMUS_MASTER_ENTRANCE', title: 'HCMUS Master Mock Exam 02', source: 'Synthetic MVP mock; not an official exam paper', detectedLevel: 'B1_B2', blueprintKey: 'HCMUS_MASTER',
  sections: [
    { code: 'VOCABULARY_READING', name: 'Vocabulary & Reading', position: 1, questionCount: 2 },
    { code: 'GRAMMAR_USE_OF_ENGLISH', name: 'Grammar & Use of English', position: 2, questionCount: 2 },
    { code: 'LISTENING', name: 'Listening', position: 3, questionCount: 2 },
    { code: 'SPEAKING', name: 'Speaking', position: 4, questionCount: 1 },
  ],
  questions: [
    { key: 'Q01', sectionCode: 'GRAMMAR_USE_OF_ENGLISH', questionTypeCode: 'MCQ_SINGLE_BLANK', topicCodes: ['PASSIVE_VOICE'], content: 'The final report ___ by the review panel last Friday.', answer: 'was approved', distractors: ['approves', 'has approving', 'is approve'], level: 'B2' },
    { key: 'Q02', sectionCode: 'GRAMMAR_USE_OF_ENGLISH', questionTypeCode: 'CLOZE_TEST', topicCodes: ['RELATIVE_CLAUSES'], content: 'The course, ___ was designed for graduates, includes academic writing.', answer: 'which', distractors: ['where', 'who', 'what'], level: 'B2' },
    { key: 'Q03', sectionCode: 'VOCABULARY_READING', questionTypeCode: 'VOCABULARY_MCQ', topicCodes: ['WORD_FORM'], content: 'The university values intellectual ___.', answer: 'curiosity', distractors: ['curious', 'curiously', 'curiousnesses'], level: 'B1_B2' },
    { key: 'Q04', sectionCode: 'VOCABULARY_READING', questionTypeCode: 'READING_COMPREHENSION', topicCodes: ['DETAIL'], content: 'A notice says applicants must upload a transcript before Monday. What must applicants upload?', answer: 'A transcript', distractors: ['A passport photo only', 'A travel ticket', 'A library card'], level: 'B1_B2' },
    { key: 'Q05', sectionCode: 'LISTENING', questionTypeCode: 'LISTENING_MCQ', topicCodes: ['LISTENING_MAIN_IDEA'], content: 'A talk describes how peer feedback helps writers revise drafts. What is the main point?', answer: 'Feedback improves revision.', distractors: ['Drafts are never useful.', 'Writing needs no planning.', 'Only grammar matters.'], level: 'B2' },
    { key: 'Q06', sectionCode: 'LISTENING', questionTypeCode: 'LISTENING_MCQ', topicCodes: ['LISTENING_DETAIL'], content: 'The announcement says the computer lab closes at six. When does it close?', answer: 'At six', distractors: ['At four', 'At eight', 'At midnight'], level: 'B1_B2' },
    { key: 'Q07', sectionCode: 'SPEAKING', questionTypeCode: 'TOPIC_DEVELOPMENT', topicCodes: ['TOPIC_DEVELOPMENT'], content: 'Which sentence gives a clear reason for using online libraries?', answer: 'They provide quick access to a wide range of academic sources.', distractors: ['The chair is wooden.', 'I forgot the question.', 'Tomorrow was bright.'], level: 'B1_B2' },
  ],
});
