/**
 * Offline interview audio generator using free Microsoft Edge TTS.
 * Produces the same full.mp3 + alignment.json shape as the ElevenLabs script.
 *
 * Docs: docs/interview.md → "Static interview audio generation"
 *
 * Usage:
 *   pnpm generate:interview-audio:edge -- 2 --force
 *   pnpm generate:interview-audio:edge -- all --dry-run
 *
 * Defaults target a calm male senior-interview style:
 *   EDGE_TTS_VOICE=en-US-ChristopherNeural
 *   EDGE_TTS_RATE=+0%
 *   EDGE_TTS_PITCH=-2Hz
 */
import { mkdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { EdgeTTS } from 'edge-tts-universal';
import { interviewQuestions } from '../apps/web/src/app/interview/data';
import { buildSpeechMapping } from '../apps/web/src/app/interview/audio-mapping';

type WordBoundary = { offset: number; duration: number; text: string };
type WordCue = {
  text: string;
  canonicalStart: number;
  canonicalEnd: number;
  startMs: number;
  endMs: number;
};
type AlignmentFile = {
  version: 1;
  questionId: string;
  speechText: string;
  words: WordCue[];
};

const root = process.cwd();
const outputRoot = path.join(root, 'apps/web/public/audio/interview');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
const selectors = args.filter((arg) => !arg.startsWith('--'));
const voice = process.env.EDGE_TTS_VOICE || 'en-US-ChristopherNeural';
/** Speaking rate relative to the voice default. Use "+0%" for natural pace. */
const rate = process.env.EDGE_TTS_RATE || '+0%';
const pitch = process.env.EDGE_TTS_PITCH || '-2Hz';

function usage(message?: string): never {
  if (message) console.error(`Error: ${message}`);
  console.error('Usage: pnpm generate:interview-audio:edge -- 1 3 10 [--force] [--dry-run]');
  console.error('       pnpm generate:interview-audio:edge -- all [--force] [--dry-run]');
  console.error('Voice: EDGE_TTS_VOICE (default en-US-ChristopherNeural)');
  console.error('Rate:  EDGE_TTS_RATE  (default +0%)');
  console.error('Pitch: EDGE_TTS_PITCH (default -2Hz)');
  process.exit(1);
}

function selectedQuestions() {
  if (selectors.length === 0 || (selectors.length === 1 && selectors[0] === 'all')) return interviewQuestions;
  const ids = selectors.map((value) => Number(value));
  if (ids.some((id) => !Number.isInteger(id))) usage('Question selectors must be integers or all.');
  const questions = interviewQuestions.filter((question) => ids.includes(question.id));
  const missing = ids.filter((id) => !questions.some((question) => question.id === id));
  if (missing.length) usage(`Unknown question ID(s): ${missing.join(', ')}.`);
  return questions;
}

function speechForQuestion(question: (typeof interviewQuestions)[number]) {
  return buildSpeechMapping(question.answer.sections.map((section) => section.en).join(' '));
}

function pathsFor(id: number) {
  const folder = path.join(outputRoot, `q${String(id).padStart(2, '0')}`);
  return { folder, mp3: path.join(folder, 'full.mp3'), alignment: path.join(folder, 'alignment.json') };
}

async function exists(file: string) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

/** Edge TTS offsets are in 100-nanosecond units. */
function ticksToMs(ticks: number) {
  return Math.round(ticks / 10_000);
}

function normalizeToken(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}']+/gu, '');
}

/**
 * Align Edge WordBoundary cues onto speechText tokens.
 * Handles both directions of mismatch:
 * - Edge splits dotted tokens ("Node" + "js" for "Node.js")
 * - Edge merges number+unit ("46seconds" for "46" + "seconds")
 */
function makeWords(speechText: string, mapping: number[], boundaries: WordBoundary[]): WordCue[] {
  const words: WordCue[] = [];
  const speechTokens = [...speechText.matchAll(/\S+/g)];
  let boundaryIndex = 0;
  let edgeRemainder = '';
  let remainderStartMs: number | null = null;
  let remainderEndMs: number | null = null;

  const pullEdgePiece = () => {
    while (boundaryIndex < boundaries.length) {
      const boundary = boundaries[boundaryIndex];
      boundaryIndex += 1;
      const piece = normalizeToken(boundary.text ?? '');
      if (!piece) continue;
      return {
        piece,
        startMs: ticksToMs(boundary.offset),
        endMs: ticksToMs(boundary.offset + boundary.duration),
      };
    }
    return null;
  };

  for (const match of speechTokens) {
    const token = match[0];
    const foundAt = match.index ?? 0;
    const foundEnd = foundAt + token.length;
    const target = normalizeToken(token);
    if (!target) continue;

    let acc = '';
    let startMs: number | null = null;
    let endMs: number | null = null;

    while (acc !== target) {
      if (!edgeRemainder) {
        const next = pullEdgePiece();
        if (!next) {
          throw new Error(`Could not align speech token "${token}" — Edge words exhausted.`);
        }
        edgeRemainder = next.piece;
        remainderStartMs = next.startMs;
        remainderEndMs = next.endMs;
      }

      startMs ??= remainderStartMs;
      endMs = remainderEndMs;
      const need = target.slice(acc.length);

      if (edgeRemainder.startsWith(need)) {
        edgeRemainder = edgeRemainder.slice(need.length);
        acc = target;
        if (!edgeRemainder) {
          remainderStartMs = null;
          remainderEndMs = null;
        }
        break;
      }

      if (need.startsWith(edgeRemainder)) {
        acc += edgeRemainder;
        edgeRemainder = '';
        remainderStartMs = null;
        remainderEndMs = null;
        continue;
      }

      throw new Error(
        `Could not align Edge words into "${token}" near speech offset ${foundAt} (need "${need}", got "${edgeRemainder}").`,
      );
    }

    if (startMs === null || endMs === null) {
      throw new Error(`Missing timing for speech token "${token}".`);
    }

    const canonicalStart = mapping[foundAt];
    const canonicalLast = mapping[foundEnd - 1];
    if (canonicalStart === undefined || canonicalLast === undefined) {
      throw new Error(`Missing canonical mapping for speech token "${token}".`);
    }

    words.push({
      text: token,
      canonicalStart,
      canonicalEnd: canonicalLast + 1,
      startMs,
      endMs,
    });
  }

  return words;
}

function makeAlignment(
  question: (typeof interviewQuestions)[number],
  speechText: string,
  mapping: number[],
  boundaries: WordBoundary[],
): AlignmentFile {
  const words = makeWords(speechText, mapping, boundaries);
  if (!words.length) throw new Error('Edge TTS did not produce any word cues.');
  return {
    version: 1,
    questionId: `q${String(question.id).padStart(2, '0')}`,
    speechText,
    words,
  };
}

async function synthesize(text: string) {
  const tts = new EdgeTTS(text, voice, { rate, pitch });
  const result = await tts.synthesize();
  const audio = Buffer.from(await result.audio.arrayBuffer());
  const boundaries = result.subtitle as WordBoundary[];
  if (!audio.length) throw new Error('Edge TTS returned empty audio.');
  if (!boundaries?.length) throw new Error('Edge TTS returned no word boundaries.');
  return { audio, boundaries };
}

async function main() {
  const questions = selectedQuestions();
  const plans = await Promise.all(
    questions.map(async (question) => {
      const mapping = speechForQuestion(question);
      const paths = pathsFor(question.id);
      const complete = (await exists(paths.mp3)) && (await exists(paths.alignment));
      return { question, mapping, paths, complete };
    }),
  );
  const toGenerate = plans.filter((plan) => force || !plan.complete);
  const skipped = plans.length - toGenerate.length;
  const characters = plans.reduce((sum, plan) => sum + plan.mapping.text.length, 0);
  const pendingCharacters = toGenerate.reduce((sum, plan) => sum + plan.mapping.text.length, 0);

  console.log(`Provider: Edge TTS`);
  console.log(`Voice: ${voice}`);
  console.log(`Rate: ${rate}`);
  console.log(`Pitch: ${pitch}`);
  console.log(`Questions: ${plans.length}`);
  console.log(`Characters: ${characters.toLocaleString()}`);
  console.log(`Existing skipped: ${skipped}`);
  console.log(`To generate: ${toGenerate.length}`);
  for (const plan of plans) {
    console.log(
      `Q${plan.question.id}: ${plan.mapping.text.length} chars${plan.complete && !force ? ' (skipped)' : ''} → ${path.relative(root, plan.paths.mp3)}`,
    );
  }
  if (dryRun) return;
  if (!toGenerate.length) return;

  console.log(`Generating ${toGenerate.length} question(s), ${pendingCharacters.toLocaleString()} characters, sequentially.`);
  for (const plan of toGenerate) {
    console.log(`Generating Q${plan.question.id}...`);
    const { audio, boundaries } = await synthesize(plan.mapping.text);
    const alignment = makeAlignment(plan.question, plan.mapping.text, plan.mapping.speechToCanonical, boundaries);
    await mkdir(plan.paths.folder, { recursive: true });
    const mp3Temp = `${plan.paths.mp3}.tmp-${process.pid}`;
    const alignmentTemp = `${plan.paths.alignment}.tmp-${process.pid}`;
    try {
      await writeFile(mp3Temp, audio);
      await writeFile(alignmentTemp, `${JSON.stringify(alignment, null, 2)}\n`);
      await rename(mp3Temp, plan.paths.mp3);
      await rename(alignmentTemp, plan.paths.alignment);
    } finally {
      await Promise.all([unlink(mp3Temp).catch(() => undefined), unlink(alignmentTemp).catch(() => undefined)]);
    }
    console.log(`Q${plan.question.id}: wrote MP3 and ${alignment.words.length} word cues.`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Generation failed.');
  process.exitCode = 1;
});
