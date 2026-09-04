import { scheduleMemory } from './learning-memory.service';

describe('scheduleMemory', () => {
  const now = new Date('2026-01-01T00:00:00.000Z');
  it('makes wrong and guessed work due today', () => expect(scheduleMemory({ now, correct: false, confidence: 'GUESS' }).nextReviewAt).toEqual(now));
  it('makes correct guess due today', () => expect(scheduleMemory({ now, correct: true, confidence: 'GUESS' }).nextReviewAt).toEqual(now));
  it('schedules correct unsure for one day', () => expect(scheduleMemory({ now, correct: true, confidence: 'UNSURE' }).nextReviewAt).toEqual(new Date('2026-01-02T00:00:00.000Z')));
  it('schedules correct know for one day when new', () => expect(scheduleMemory({ now, correct: true, confidence: 'KNOW' }).nextReviewAt).toEqual(new Date('2026-01-02T00:00:00.000Z')));
  it('again resets streak and is due now', () => expect(scheduleMemory({ now, correct: true, confidence: 'KNOW', action: 'AGAIN', streak: 3 }).streak).toBe(0));
  it('advances a strong streak transparently', () => expect(scheduleMemory({ now, correct: true, confidence: 'KNOW', reviewCount: 3, streak: 2, ease: 2.5 }).nextReviewAt).toEqual(new Date('2026-01-09T00:00:00.000Z')));
});
