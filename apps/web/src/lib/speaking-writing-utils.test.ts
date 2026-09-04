import { countWords, formatClock, nextWritingStep, recordingSupport } from './speaking-writing-utils';

test('counts whitespace-separated words', () => expect(countWords('  one\n two   three ')).toBe(3));
test('formats bounded clock values', () => expect(formatClock(125)).toBe('02:05'));
test('advances writing workflow', () => expect(nextWritingStep('outline')).toBe('draft'));
test('reports recording capabilities', () => { expect(recordingSupport(false, false)).toBe('unavailable'); expect(recordingSupport(true, false)).toBe('permission-denied'); expect(recordingSupport(true, true)).toBe('ready'); });
