/** Offline Edge TTS for the 39 Backend Interview English answers; never used at runtime. */
import { mkdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { EdgeTTS } from 'edge-tts-universal';
import { sourceQuestions } from '../apps/web/src/app/interview/backend/source-questions';
import { buildSpeechMapping } from '../apps/web/src/app/interview/audio-mapping';

type Boundary = { offset: number; duration: number; text: string };
type Cue = { text: string; canonicalStart: number; canonicalEnd: number; startMs: number; endMs: number };
const root = process.cwd();
const output = path.join(root, 'apps/web/public/audio/interview/backend');
const args = process.argv.slice(2);
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');
const selectors = args.filter((arg) => !arg.startsWith('--'));
const voice = process.env.EDGE_TTS_VOICE || 'en-US-ChristopherNeural';
const rate = process.env.EDGE_TTS_RATE || '-20%';
const pitch = process.env.EDGE_TTS_PITCH || '-2Hz';
const questions = Object.entries(sourceQuestions).flatMap(([topicId, items]) =>
  (items ?? []).map((item, index) => ({ topicId: Number(topicId), questionId: index + 1, answer: item.answer })),
);

function label(topicId: number, questionId: number) {
  return `t${String(topicId).padStart(2, '0')}-q${String(questionId).padStart(2, '0')}`;
}

function selected() {
  if (selectors.length === 0 || (selectors.length === 1 && selectors[0] === 'all')) return questions;
  if (selectors.includes('all')) throw new Error('Use all alone or select tXX-qYY, e.g. t01-q02.');
  const keys = selectors.map((s) => s.toLowerCase());
  const unknown = keys.filter((s) => !questions.some((q) => label(q.topicId, q.questionId) === s));
  if (unknown.length) throw new Error(`Unknown selector(s): ${unknown.join(', ')}. Use tXX-qYY or all.`);
  return questions.filter((q) => keys.includes(label(q.topicId, q.questionId)));
}

async function exists(file: string) {
  try { await stat(file); return true; } catch { return false; }
}

function normalize(value: string) { return value.toLowerCase().replace(/[^\p{L}\p{N}']+/gu, ''); }
function milliseconds(ticks: number) { return Math.round(ticks / 10_000); }

/** Match Edge WordBoundary tokens to the unchanged canonical answer (including split/merged words). */
function align(text: string, mapping: number[], boundaries: Boundary[]): Cue[] {
  const words: Cue[] = [];
  let index = 0;
  let remainder = '';
  let remainderStart = 0;
  let remainderEnd = 0;
  for (const match of text.matchAll(/\S+/g)) {
    const token = match[0];
    const target = normalize(token);
    if (!target) continue;
    let matched = '';
    let start: number | null = null;
    let end = 0;
    while (matched !== target) {
      if (!remainder) {
        let next: Boundary | undefined;
        do { next = boundaries[index++]; } while (next && !normalize(next.text ?? ''));
        if (!next) throw new Error(`Word boundaries exhausted at "${token}".`);
        remainder = normalize(next.text);
        remainderStart = milliseconds(next.offset);
        remainderEnd = milliseconds(next.offset + next.duration);
      }
      start ??= remainderStart;
      end = remainderEnd;
      const need = target.slice(matched.length);
      if (remainder.startsWith(need)) {
        remainder = remainder.slice(need.length);
        matched = target;
      } else if (need.startsWith(remainder)) {
        matched += remainder;
        remainder = '';
      } else {
        throw new Error(`Cannot align "${token}" near speech offset ${match.index}: need "${need}", got "${remainder}".`);
      }
    }
    const offset = match.index;
    const canonicalStart = mapping[offset];
    const last = mapping[offset + token.length - 1];
    if (canonicalStart === undefined || last === undefined || start === null) throw new Error(`Missing mapping for "${token}".`);
    words.push({ text: token, canonicalStart, canonicalEnd: last + 1, startMs: start, endMs: end });
  }
  if (!words.length || words.some((word, i) => word.endMs < word.startMs || (i > 0 && word.startMs < words[i - 1].startMs))) {
    throw new Error('Invalid or empty word cues.');
  }
  return words;
}

async function main() {
  const plans = await Promise.all(selected().map(async (question) => {
    const id = label(question.topicId, question.questionId);
    const folder = path.join(output, id);
    const mp3 = path.join(folder, 'full.mp3');
    const alignment = path.join(folder, 'alignment.json');
    const mapping = buildSpeechMapping(question.answer);
    return { id, folder, mp3, alignment, mapping, complete: await exists(mp3) && await exists(alignment) };
  }));
  console.log(`Edge TTS voice=${voice}, rate=${rate}, pitch=${pitch}; selected=${plans.length}; pending=${plans.filter((p) => force || !p.complete).length}`);
  if (dryRun) { for (const plan of plans) console.log(`${plan.id}: ${plan.mapping.text.length} chars${plan.complete && !force ? ' (skipped)' : ''}`); return; }
  for (const plan of plans) {
    if (plan.complete && !force) { console.log(`${plan.id}: skipped`); continue; }
    console.log(`${plan.id}: synthesizing...`);
    const tts = new EdgeTTS(plan.mapping.text, voice, { rate, pitch });
    const result = await tts.synthesize();
    const audio = Buffer.from(await result.audio.arrayBuffer());
    const boundaries = result.subtitle as Boundary[];
    if (!audio.length || !boundaries?.length) throw new Error(`${plan.id}: Edge returned empty audio or word boundaries.`);
    const words = align(plan.mapping.text, plan.mapping.speechToCanonical, boundaries);
    await mkdir(plan.folder, { recursive: true });
    const tempAudio = `${plan.mp3}.tmp-${process.pid}`;
    const tempAlignment = `${plan.alignment}.tmp-${process.pid}`;
    try {
      await writeFile(tempAudio, audio);
      await writeFile(tempAlignment, `${JSON.stringify({ version: 1, questionId: plan.id, speechText: plan.mapping.text, words }, null, 2)}\n`);
      await rename(tempAudio, plan.mp3);
      await rename(tempAlignment, plan.alignment);
    } finally {
      await Promise.all([unlink(tempAudio).catch(() => undefined), unlink(tempAlignment).catch(() => undefined)]);
    }
    console.log(`${plan.id}: wrote ${audio.length} bytes and ${words.length} cues`);
  }
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
