import { makeMockDataset } from './_factory';
export default makeMockDataset({
  key: 'HCMUS_MOCK_03', examTypeCode: 'HCMUS_MASTER_ENTRANCE', title: 'HCMUS Master Mock Exam 03', source: 'Synthetic MVP mock; not an official exam paper', detectedLevel: 'B1_B2', blueprintKey: 'HCMUS_MASTER',
  sections: [
    { code: 'VOCABULARY_READING', name: 'Vocabulary & Reading', position: 1, questionCount: 2 },
    { code: 'GRAMMAR_USE_OF_ENGLISH', name: 'Grammar & Use of English', position: 2, questionCount: 2 },
    { code: 'LISTENING', name: 'Listening', position: 3, questionCount: 2 },
    { code: 'SPEAKING', name: 'Speaking', position: 4, questionCount: 1 },
  ],
  questions: [
    { key: 'Q01', sectionCode: 'GRAMMAR_USE_OF_ENGLISH', questionTypeCode: 'MCQ_SINGLE_BLANK', topicCodes: ['PRESENT_PERFECT'], content: 'Researchers ___ several improvements since the new policy began.', answer: 'have reported', distractors: ['reporting', 'reported had', 'will reporting'], level: 'B2' },
    { key: 'Q02', sectionCode: 'GRAMMAR_USE_OF_ENGLISH', questionTypeCode: 'MCQ_SINGLE_BLANK', topicCodes: ['PREPOSITIONS'], content: 'Applicants should focus ___ clarity and evidence.', answer: 'on', distractors: ['at', 'by', 'from'], level: 'B1_B2' },
    { key: 'Q03', sectionCode: 'VOCABULARY_READING', questionTypeCode: 'VOCABULARY_MCQ', topicCodes: ['PREPOSITIONS'], content: 'The lecturer gave an example ___ academic integrity.', answer: 'of', distractors: ['to', 'with', 'under'], level: 'B1_B2' },
    { key: 'Q04', sectionCode: 'VOCABULARY_READING', questionTypeCode: 'READING_COMPREHENSION', topicCodes: ['INFERENCE'], content: 'A passage notes that students who plan weekly tasks feel less rushed. What can be inferred?', answer: 'Planning may reduce perceived pressure.', distractors: ['Planning always causes stress.', 'Students should avoid schedules.', 'Tasks are never completed.'], level: 'B2' },
    { key: 'Q05', sectionCode: 'LISTENING', questionTypeCode: 'LISTENING_MCQ', topicCodes: ['LISTENING_INFERENCE'], content: 'A student says the workshop was useful but wishes it had included more examples. What does the student imply?', answer: 'The workshop could be more practical.', distractors: ['It should be cancelled.', 'It was unrelated.', 'It was too short to attend.'], level: 'B2' },
    { key: 'Q06', sectionCode: 'LISTENING', questionTypeCode: 'LISTENING_MCQ', topicCodes: ['LISTENING_DETAIL'], content: 'The guide says the registration desk is beside the main entrance. Where is it?', answer: 'Beside the main entrance', distractors: ['Behind the stage', 'On the top floor', 'Near the parking exit'], level: 'B1_B2' },
    { key: 'Q07', sectionCode: 'SPEAKING', questionTypeCode: 'TOPIC_DEVELOPMENT', topicCodes: ['TOPIC_DEVELOPMENT'], content: 'Which sentence best supports an argument for group study?', answer: 'Group study allows learners to compare approaches and explain ideas.', distractors: ['The room has four walls.', 'I will not give a reason.', 'The dictionary is blue.'], level: 'B2' },
  ],
});
