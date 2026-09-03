import { makeMockDataset } from './_factory';
export default makeMockDataset({
  key: 'VSTEP_MOCK_02', examTypeCode: 'VSTEP', title: 'VSTEP 3-5 Mock Exam 02', source: 'Synthetic MVP mock aligned to VSTEP 3-5 format; not an official exam paper', detectedLevel: 'B1_C1', blueprintKey: 'VSTEP_3_5',
  sections: [
    { code: 'LISTENING', name: 'Listening', position: 1, questionCount: 4, partCount: 3, durationMinutes: 40 },
    { code: 'READING', name: 'Reading', position: 2, questionCount: 3, passageCount: 4, durationMinutes: 60 },
    { code: 'WRITING', name: 'Writing', position: 3, questionCount: 2, durationMinutes: 60 },
    { code: 'SPEAKING', name: 'Speaking', position: 4, questionCount: 1, partCount: 3, durationMinutes: 12 },
  ],
  questions: [
    { key: 'Q01', sectionCode: 'LISTENING', questionTypeCode: 'ANNOUNCEMENT_INSTRUCTION', topicCodes: ['LISTENING_DETAIL'], content: 'The announcement instructs visitors to keep their tickets until the end of the event. What should visitors keep?', answer: 'Their tickets', distractors: ['Their passports', 'Their textbooks', 'Their umbrellas'], level: 'B1' },
    { key: 'Q02', sectionCode: 'LISTENING', questionTypeCode: 'CONVERSATION', topicCodes: ['LISTENING_INFERENCE'], content: 'A colleague says the new software takes some time to learn but is worth it. What is the attitude?', answer: 'Generally positive', distractors: ['Completely negative', 'Uncertain about its existence', 'Angry about the weather'], level: 'B2' },
    { key: 'Q03', sectionCode: 'LISTENING', questionTypeCode: 'TALK_LECTURE', topicCodes: ['LISTENING_MAIN_IDEA'], content: 'A talk compares public and private transport in reducing city congestion. What is the talk mainly about?', answer: 'Transport choices and congestion', distractors: ['Cooking methods', 'Exam registration fees', 'Mountain climbing'], level: 'B2' },
    { key: 'Q04', sectionCode: 'LISTENING', questionTypeCode: 'CONVERSATION', topicCodes: ['LISTENING_DETAIL'], content: 'The customer chooses the blue jacket in a medium size. What does the customer choose?', answer: 'A medium blue jacket', distractors: ['A large red shirt', 'A small green coat', 'A medium black hat'], level: 'B1' },
    { key: 'Q05', sectionCode: 'READING', questionTypeCode: 'READING_COMPREHENSION', topicCodes: ['INFERENCE'], content: 'A passage says remote work is effective when teams agree on communication routines. What can be inferred?', answer: 'Clear routines support remote teamwork.', distractors: ['Remote work needs no communication.', 'Teams cannot work remotely.', 'Routines always reduce productivity.'], level: 'B2' },
    { key: 'Q06', sectionCode: 'READING', questionTypeCode: 'READING_COMPREHENSION', topicCodes: ['VOCAB_IN_CONTEXT'], content: 'In the passage, the word sustainable most nearly means able to continue without exhausting resources. What does it mean?', answer: 'Able to continue responsibly', distractors: ['Extremely temporary', 'Impossible to measure', 'Unrelated to resources'], level: 'B2' },
    { key: 'Q07', sectionCode: 'WRITING', questionTypeCode: 'ESSAY', topicCodes: ['AGREE_DISAGREE'], content: 'Choose the strongest thesis for an essay about online learning.', answer: 'Online learning is valuable when courses provide interaction and clear support.', distractors: ['Online learning is a color.', 'All learning should stop.', 'There are no reasons to discuss.'], level: 'B2' },
    { key: 'Q08', sectionCode: 'SPEAKING', questionTypeCode: 'TOPIC_DEVELOPMENT', topicCodes: ['HOLIDAYS'], content: 'Which response develops an answer about a memorable holiday?', answer: 'I visited Hue with my family, explored historic sites, and learned more about local culture.', distractors: ['No.', 'A holiday is a number.', 'I will not mention any details.'], level: 'B1_B2' },
  ],
});
