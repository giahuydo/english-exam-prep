import { makeMockDataset } from './_factory';
export default makeMockDataset({
  key: 'HCMUS_MOCK_01', examTypeCode: 'HCMUS_MASTER_ENTRANCE', title: 'HCMUS Master Mock Exam 01', source: 'Synthetic MVP mock; not an official exam paper', detectedLevel: 'B1_B2', blueprintKey: 'HCMUS_MASTER',
  sections: [
    { code: 'VOCABULARY_READING', name: 'Vocabulary & Reading', position: 1, questionCount: 2 },
    { code: 'GRAMMAR_USE_OF_ENGLISH', name: 'Grammar & Use of English', position: 2, questionCount: 2 },
    { code: 'LISTENING', name: 'Listening', position: 3, questionCount: 2 },
    { code: 'SPEAKING', name: 'Speaking', position: 4, questionCount: 1 },
  ],
  questions: [
    { key: 'Q01', sectionCode: 'GRAMMAR_USE_OF_ENGLISH', questionTypeCode: 'MCQ_SINGLE_BLANK', topicCodes: ['TENSES'], content: 'By the time the lecture began, the students ___ their notes.', answer: 'had prepared', distractors: ['prepare', 'are preparing', 'will prepare'], explanation: 'The past perfect marks an action completed before another past action.', level: 'B2' },
    { key: 'Q02', sectionCode: 'GRAMMAR_USE_OF_ENGLISH', questionTypeCode: 'MCQ_SINGLE_BLANK', topicCodes: ['CONDITIONALS'], content: 'If she studied more consistently, she ___ higher scores.', answer: 'would achieve', distractors: ['achieves', 'will achieve', 'has achieved'], level: 'B2' },
    { key: 'Q03', sectionCode: 'VOCABULARY_READING', questionTypeCode: 'VOCABULARY_MCQ', topicCodes: ['COLLOCATION'], content: 'The researcher reached a ___ conclusion after reviewing the evidence.', answer: 'tentative', distractors: ['heavy', 'noisy', 'ancient'], level: 'B1_B2' },
    { key: 'Q04', sectionCode: 'VOCABULARY_READING', questionTypeCode: 'READING_COMPREHENSION', topicCodes: ['MAIN_IDEA'], content: 'A short article explains how spaced practice improves long-term vocabulary retention. What is its main idea?', answer: 'Spaced practice supports durable learning.', distractors: ['Vocabulary is unnecessary.', 'Only intensive cramming works.', 'Reading should be avoided.'], level: 'B1_B2' },
    { key: 'Q05', sectionCode: 'LISTENING', questionTypeCode: 'LISTENING_MCQ', topicCodes: ['LISTENING_DETAIL'], content: 'A speaker says the seminar starts at nine and moves to Room 204. Where is the seminar?', answer: 'Room 204', distractors: ['Room 104', 'The library', 'The cafeteria'], level: 'B1_B2' },
    { key: 'Q06', sectionCode: 'LISTENING', questionTypeCode: 'LISTENING_MCQ', topicCodes: ['LISTENING_INFERENCE'], content: 'The speaker repeatedly recommends checking sources before sharing a post. What is the speaker emphasizing?', answer: 'Responsible information use', distractors: ['Fast typing', 'Travel planning', 'Sports training'], level: 'B2' },
    { key: 'Q07', sectionCode: 'SPEAKING', questionTypeCode: 'TOPIC_DEVELOPMENT', topicCodes: ['TOPIC_DEVELOPMENT'], content: 'Which opening best introduces a short talk about study habits?', answer: 'Today I would like to discuss three practical study habits.', distractors: ['Close the window immediately.', 'I have no topic.', 'The answer is yesterday.'], level: 'B1_B2' },
  ],
});
