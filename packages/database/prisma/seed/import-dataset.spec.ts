import assert from 'node:assert/strict';
import test from 'node:test';
import { assertValidDataset } from './types';

const base = {
  key: 'valid-dataset', examTypeCode: 'B1' as const, title: 'Valid dataset', source: 'Internal', sourceType: 'SYNTHETIC_MOCK' as const,
  provenanceNotes: 'Synthetic practice content; not an official exam.', detectedLevel: 'B1' as const,
  sections: [{ code: 'GRAMMAR', name: 'Grammar', position: 1 }],
  questions: [{ key: 'q1', sectionCode: 'GRAMMAR', questionTypeCode: 'MCQ_SINGLE_BLANK', topicCodes: ['GRAMMAR'], content: 'Choose.', level: 'B1' as const, hint1: 'Check the tense.', explanation: 'The tense matches.', options: [{ key: 'A', content: 'yes', isCorrect: true }, { key: 'B', content: 'no', isCorrect: false }] }],
};

test('accepts a valid dataset', () => assert.doesNotThrow(() => assertValidDataset(base)));
test('rejects duplicate question keys and malformed answers', () => assert.throws(() => assertValidDataset({ ...base, questions: [...base.questions, { ...base.questions[0], key: 'q1', options: [{ key: 'A', content: 'x', isCorrect: false }] }] }), /duplicate question key/));
test('rejects unsupported synthetic real-exam claims', () => assert.throws(() => assertValidDataset({ ...base, source: 'Official real exam paper' }), /cannot claim/));
