import { ContentRole, ExamLevel, QuestionOrigin, QuestionStatus } from './enums';
import { CreateQuestionDto } from './schemas';

describe('shared enums + schemas', () => {
  it('keeps creation origin separate from material role', () => {
    expect(QuestionOrigin.AI_GENERATED).toBe('AI_GENERATED');
    expect(ContentRole.EXAMPLE).toBe('EXAMPLE');
    expect(ContentRole.MOCK_EXAM).toBe('MOCK_EXAM');
  });

  it('exports QuestionStatus values', () => {
    expect(QuestionStatus.DRAFT).toBe('DRAFT');
    expect(QuestionStatus.PUBLISHED).toBe('PUBLISHED');
  });

  it('CreateQuestionDto defaults material role to practice', () => {
    const parsed = CreateQuestionDto.parse({
      questionTypeId: '00000000-0000-0000-0000-000000000001',
      content: 'What is __ capital of France?',
      level: ExamLevel.B1,
    });
    expect(parsed.difficulty).toBe('MEDIUM');
    expect(parsed.origin).toBe('MANUAL');
    expect(parsed.contentRole).toBe('PRACTICE');
    expect(parsed.options).toEqual([]);
  });

  it('CreateQuestionDto accepts explicit source/material role', () => {
    const r = CreateQuestionDto.safeParse({
      questionTypeId: '00000000-0000-0000-0000-000000000001',
      content: 'Example',
      level: 'B1',
      contentRole: 'REAL_EXAM',
    });
    expect(r.success).toBe(true);
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
