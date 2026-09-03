import { makeMockDataset } from './_factory';
export default makeMockDataset({
  key: 'VSTEP_MOCK_01', examTypeCode: 'VSTEP', title: 'VSTEP 3-5 Mock Exam 01', source: 'Synthetic MVP mock aligned to VSTEP 3-5 format; not an official exam paper', detectedLevel: 'B1_C1', blueprintKey: 'VSTEP_3_5',
  sections: [
    { code: 'LISTENING', name: 'Listening', position: 1, questionCount: 4, partCount: 3, durationMinutes: 40 },
    { code: 'READING', name: 'Reading', position: 2, questionCount: 3, passageCount: 4, durationMinutes: 60 },
    { code: 'WRITING', name: 'Writing', position: 3, questionCount: 2, durationMinutes: 60 },
    { code: 'SPEAKING', name: 'Speaking', position: 4, questionCount: 1, partCount: 3, durationMinutes: 12 },
  ],
  questions: [
    { key: 'Q01', sectionCode: 'LISTENING', questionTypeCode: 'ANNOUNCEMENT_INSTRUCTION', topicCodes: ['LISTENING_DETAIL'], content: 'The announcement says candidates should wait outside Room 12. Where should they wait?', answer: 'Outside Room 12', distractors: ['In Room 21', 'At the bus stop', 'In the library'], level: 'B1' },
    { key: 'Q02', sectionCode: 'LISTENING', questionTypeCode: 'CONVERSATION', topicCodes: ['LISTENING_INFERENCE'], content: 'A student says the revised timetable is easier to follow. What does the student think?', answer: 'The timetable is clearer.', distractors: ['It is too expensive.', 'It is missing all classes.', 'It is difficult to print.'], level: 'B1_B2' },
    { key: 'Q03', sectionCode: 'LISTENING', questionTypeCode: 'TALK_LECTURE', topicCodes: ['LISTENING_MAIN_IDEA'], content: 'A short lecture explains why regular exercise can support concentration. What is the main idea?', answer: 'Exercise may help concentration.', distractors: ['Exercise replaces sleep.', 'Concentration is impossible.', 'Lectures should be shorter.'], level: 'B2' },
    { key: 'Q04', sectionCode: 'LISTENING', questionTypeCode: 'CONVERSATION', topicCodes: ['LISTENING_DETAIL'], content: 'The caller confirms an appointment for Thursday afternoon. When is it?', answer: 'Thursday afternoon', distractors: ['Tuesday morning', 'Friday evening', 'Saturday noon'], level: 'B1' },
    { key: 'Q05', sectionCode: 'READING', questionTypeCode: 'READING_COMPREHENSION', topicCodes: ['MAIN_IDEA'], content: 'A passage describes community gardens and their role in bringing neighbors together. What is the main idea?', answer: 'Community gardens can strengthen local connections.', distractors: ['Gardens are only commercial.', 'Neighbors should not cooperate.', 'Plants grow without care.'], level: 'B1_B2' },
    { key: 'Q06', sectionCode: 'READING', questionTypeCode: 'READING_COMPREHENSION', topicCodes: ['DETAIL'], content: 'The passage states that volunteers meet every Saturday morning. When do they meet?', answer: 'Every Saturday morning', distractors: ['Every Monday night', 'Once a year', 'On weekday afternoons'], level: 'B1' },
    { key: 'Q07', sectionCode: 'WRITING', questionTypeCode: 'LETTER_EMAIL', topicCodes: ['LETTER_EMAIL'], content: 'Choose the best opening for an email requesting information about a course.', answer: 'Dear Admissions Team, I am writing to ask about the course schedule.', distractors: ['Hey you, give me details now.', 'The course is a mountain.', 'I refuse to explain my request.'], level: 'B1' },
    { key: 'Q08', sectionCode: 'SPEAKING', questionTypeCode: 'TOPIC_DEVELOPMENT', topicCodes: ['HOMETOWN'], content: 'Which response best develops a short talk about your hometown?', answer: 'It is a coastal city, and I especially enjoy its friendly community and local food.', distractors: ['Yes.', 'I have no hometown.', 'The answer is yesterday.'], level: 'B1_B2' },
  ],
});
