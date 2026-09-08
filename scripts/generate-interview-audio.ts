import { mkdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { interviewQuestions } from '../apps/web/src/app/interview/data';
import { buildSpeechMapping } from '../apps/web/src/app/interview/audio-mapping';

type AlignmentPayload = {
  audio_base64?: string;
  alignment?: CharacterAlignment;
  normalized_alignment?: CharacterAlignment;
};
type CharacterAlignment = {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
};
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
const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
const voiceId = process.env.ELEVENLABS_VOICE_ID;
const apiKey = process.env.ELEVENLABS_API_KEY;

function usage(message?: string): never {
  if (message) console.error(`Error: ${message}`);
  console.error('Usage: pnpm generate:interview-audio -- 1 3 10 [--force] [--dry-run]');
  console.error('       pnpm generate:interview-audio -- all [--force] [--dry-run]');
  process.exit(1);
}

function selectedQuestions() {
  if (selectors.length === 0 || selectors.length === 1 && selectors[0] === 'all') return interviewQuestions;
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
  try { await stat(file); return true; } catch { return false; }
}

function makeWords(speechText: string, mapping: number[], alignment: CharacterAlignment): WordCue[] {
  const words: WordCue[] = [];
  for (const match of speechText.matchAll(/\S+/g)) {
    const text = match[0];
    const start = match.index ?? 0;
    const end = start + text.length;
    const canonicalStart = mapping[start];
    const canonicalLast = mapping[end - 1];
    if (canonicalStart === undefined || canonicalLast === undefined) continue;
    const startSeconds = alignment.character_start_times_seconds[start];
    const endSeconds = alignment.character_end_times_seconds[end - 1];
    if (startSeconds === undefined || endSeconds === undefined) continue;
    words.push({
      text,
      canonicalStart,
      canonicalEnd: canonicalLast + 1,
      startMs: Math.round(startSeconds * 1000),
      endMs: Math.round(endSeconds * 1000),
    });
  }
  return words;
}

function makeAlignment(question: (typeof interviewQuestions)[number], speechText: string, mapping: number[], payload: AlignmentPayload): AlignmentFile {
  const alignment = payload.normalized_alignment ?? payload.alignment;
  if (!alignment) throw new Error('ElevenLabs response did not include alignment data.');
  const words = makeWords(speechText, mapping, alignment);
  if (!words.length) throw new Error('ElevenLabs alignment did not produce any word cues.');
  return { version: 1, questionId: `q${String(question.id).padStart(2, '0')}`, speechText, words };
}

async function requestSpeech(text: string) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId!)}/with-timestamps`;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey! },
        body: JSON.stringify({ text, model_id: modelId }),
      });
    } catch (error) {
      if (attempt === 2) throw new Error(`Network error after 3 attempts: ${error instanceof Error ? error.message : 'unknown error'}`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      continue;
    }
    if (response.ok) return response.json() as Promise<AlignmentPayload>;
    if (response.status === 401 || response.status === 403 || response.status === 400) throw new Error(`ElevenLabs request failed with HTTP ${response.status}.`);
    if (![408, 429, 500, 502, 503, 504].includes(response.status) || attempt === 2) throw new Error(`ElevenLabs request failed with HTTP ${response.status}.`);
    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
  }
  throw new Error('ElevenLabs request failed.');
}

async function main() {
  const questions = selectedQuestions();
  const plans = await Promise.all(questions.map(async (question) => {
    const mapping = speechForQuestion(question);
    const paths = pathsFor(question.id);
    const complete = await exists(paths.mp3) && await exists(paths.alignment);
    return { question, mapping, paths, complete };
  }));
  const toGenerate = plans.filter((plan) => force || !plan.complete);
  const skipped = plans.length - toGenerate.length;
  const characters = plans.reduce((sum, plan) => sum + plan.mapping.text.length, 0);
  const pendingCharacters = toGenerate.reduce((sum, plan) => sum + plan.mapping.text.length, 0);
  console.log(`Questions: ${plans.length}`);
  console.log(`Characters: ${characters.toLocaleString()}`);
  console.log(`Existing skipped: ${skipped}`);
  console.log(`To generate: ${toGenerate.length}`);
  for (const plan of plans) console.log(`Q${plan.question.id}: ${plan.mapping.text.length} chars${plan.complete && !force ? ' (skipped)' : ''} → ${path.relative(root, plan.paths.mp3)}`);
  if (dryRun) return;
  if (!apiKey) usage('ELEVENLABS_API_KEY is required unless using --dry-run.');
  if (!voiceId) usage('ELEVENLABS_VOICE_ID is required unless using --dry-run.');
  if (!toGenerate.length) return;
  console.log(`Generating ${toGenerate.length} question(s), ${pendingCharacters.toLocaleString()} characters, sequentially.`);
  for (const plan of toGenerate) {
    console.log(`Generating Q${plan.question.id}...`);
    const payload = await requestSpeech(plan.mapping.text);
    if (!payload.audio_base64) throw new Error(`Q${plan.question.id}: response did not include audio_base64.`);
    const alignment = makeAlignment(plan.question, plan.mapping.text, plan.mapping.speechToCanonical, payload);
    await mkdir(plan.paths.folder, { recursive: true });
    const mp3Temp = `${plan.paths.mp3}.tmp-${process.pid}`;
    const alignmentTemp = `${plan.paths.alignment}.tmp-${process.pid}`;
    try {
      await writeFile(mp3Temp, Buffer.from(payload.audio_base64, 'base64'));
      await writeFile(alignmentTemp, `${JSON.stringify(alignment, null, 2)}\n`);
      await rename(mp3Temp, plan.paths.mp3);
      await rename(alignmentTemp, plan.paths.alignment);
    } finally {
      await Promise.all([unlink(mp3Temp).catch(() => undefined), unlink(alignmentTemp).catch(() => undefined)]);
    }
    console.log(`Q${plan.question.id}: wrote MP3 and ${alignment.words.length} word cues.`);
  }
}

main().catch((error) => { console.error(error instanceof Error ? error.message : 'Generation failed.'); process.exitCode = 1; });
