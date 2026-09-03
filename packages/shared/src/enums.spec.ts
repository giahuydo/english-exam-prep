import { QuestionOrigin, QuestionStatus, ExamLevel } from './enums';
import { CreateQuestionDto } from './schemas';

describe('shared enums + schemas', () => {
  it('exports QuestionOrigin values', () => {
    expect(QuestionOrigin.AI_GENERATED).toBe('AI_GENERATED');
    expect(QuestionOrigin.ORIGINAL).toBe('ORIGINAL');
    expect(QuestionOrigin.MANUAL).toBe('MANUAL');
  });

  it('exports QuestionStatus values', () => {
    expect(QuestionStatus.DRAFT).toBe('DRAFT');
    expect(QuestionStatus.PUBLISHED).toBe('PUBLISHED');
  });

  it('CreateQuestionDto accepts minimal valid input', () => {
    const parsed = CreateQuestionDto.parse({
      questionTypeId: '00000000-0000-0000-0000-000000000001',
      content: 'What is __ capital of France?',
      level: ExamLevel.B1,
    });
    expect(parsed.difficulty).toBe('MEDIUM');
    expect(parsed.origin).toBe('MANUAL');
    expect(parsed.options).toEqual([]);
  });

  it('CreateQuestionDto rejects invalid uuid for questionTypeId', () => {
    const r = CreateQuestionDto.safeParse({
      questionTypeId: 'not-a-uuid',
      content: 'x',
      level: 'B1',
    });
    expect(r.success).toBe(false);
  });
});
