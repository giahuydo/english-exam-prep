# Interview Practice Tab

## Scope

The public `/interview` route is a frontend-only learning tool for the Everfit Applied AI Backend Engineer interview script. A top-level category switch links it to `/interview/backend`, a separate frontend-only backend topic study guide; the AI script and its modes remain unchanged.

- Route: `apps/web/src/app/interview/page.tsx`
- No login required.
- Audio is optional static frontend content; there is no runtime TTS call (neither Edge TTS nor ElevenLabs) from the website.
- Progress is stored in browser `localStorage`.
- Canonical source content is hard-coded in `apps/web/src/app/interview/data.ts`.

## File map

```text
apps/web/src/app/interview/
├── page.tsx           AI Interview UI, modes, active-question flow
├── backend/
│   ├── page.tsx       Backend Interview topic/question selector, answer and key idea
│   ├── topics.ts      fixed topic labels and recommended path
│   ├── speaking-chunks.ts display-only English answer segmentation
│   ├── source-questions.ts  verbatim English B1–B2 questions and answers; derived key-idea paths
│   └── translations.ts     Vietnamese study translations paired by topic/question order
├── data.ts            canonical questions, answers, Part 2 strategy content
├── types.ts           question and connection types
├── connections.ts     global contexts/clusters/stories/triggers + selectors
├── storage.ts         localStorage progress and review scheduling
├── audio.ts           playback, karaoke, static MP3 + alignment seeking
├── audio-mapping.ts   canonical → speech text + offset mapping
├── utils.ts           inline formatting, keyword extraction, cloze helpers
└── rich-text.tsx      renders `**bold**` and `*italic*` source markers

scripts/
├── generate-interview-audio.ts       ElevenLabs offline generator (paid / key required)
└── generate-interview-audio-edge.ts  Edge TTS offline generator (free, preferred default)

apps/web/public/audio/interview/qNN/
├── full.mp3         static sample audio for question N
└── alignment.json   word cues for karaoke / segment seek
```

`Everfit_19_Questions_Speaking_Format.docx` at the repository root is the local reference document used to update the canonical script. Do not edit canonical wording from memory or invent replacement content.

## Canonical content model

`data.ts` exports `interviewQuestions`, a self-contained array of `InterviewQuestion` objects. The UI derives the displayed question count from `interviewQuestions.length`, so documentation should avoid hard-coding the count.

```ts
{
  id: 3,
  question: { en: '...', vi: '...' },
  answer: {
    sections: [
      { id: 'point', en: '...', vi: '...' },
      { id: 'reason', en: '...', vi: '...' },
      { id: 'example', en: '...', vi: '...' },
    ],
  },
  contextIds: ['C'],
  clusterIds: ['error-handling', 'observability'],
  storyIds: ['llm-reliability'],
  memory: {
    nodes: [
      {
        id: 'root-cause',
        label: 'ROOT CAUSE',
        triggers: ['bad input', 'wrong retrieval'],
        answerSectionId: 'point',
      },
    ],
  },
}
```

### Stable IDs

- Question IDs identify questions and local progress records.
- Answer section IDs must be stable strings, not array indexes.
- Memory nodes use `answerSectionId` to highlight the matching canonical section.
- Context, cluster, story, and trigger IDs are typed stable IDs.

When adding an answer paragraph, give it a new section ID. Existing memory mappings will not shift.

## Relationship source of truth

Per-question relationships live in each question object in `data.ts`:

- `contextIds`
- `clusterIds`
- `storyIds`
- `routeIds` — optional shared answer routes for similar interviewer phrasings

Global display definitions live in `connections.ts`:

- `contexts`
- `phraseClusters`
- `heroStories`
- `triggers`
- `answerRoutes` — similar question phrasings that share one speaking skeleton

Reverse relationships are derived. Do not add a second manually maintained `questions` list to contexts, clusters, or stories.

Available selectors in `connections.ts`:

```ts
getQuestionRelations(questionId)
getContextsForQuestion(questionId)
getClustersForQuestion(questionId)
getStoriesForQuestion(questionId)
getRoutesForQuestion(questionId)
getAnswerRoute(routeId)
getQuestionsForContext(contextId)
getQuestionsForCluster(clusterId)
getQuestionsForStory(storyId)
getContextsForTrigger(triggerId)
getRelatedQuestions(questionId)
getMemoryNodes(questionId)
```

`page.tsx` consumes these selectors for Connections, context labels, question lists, stories, triggers, memory paths, and the **Shared answer route** panel under each question title.

### Answer routes (similar phrasings → one path)

Use `answerRoutes` when interviewers rephrase the same job:

| Route | Primary deep answer | Related angles |
| --- | --- | --- |
| `strangeloop-agent` | Q4 project deep-dive | Q7 experience gap, Q5/Q12/Q23/Q10 |
| `hybrid-retrieval` | Q2 | Q15 / Q14 / Q8 |
| `llm-reliability` | Q3 | Q13 / Q18 |
| `gap-transfer` | Q9 hire / proof | Q6 / Q7 / Q11 |
| `tool-control` | Q10 | Q16 / Q5 / Q12 |
| `ocr-incident` | Q17 | Q22 / Q1 |

**Q4 vs Q7:** keep both. Q4 is the StrangeLoop architecture deep-dive. Q7 calibrates agent experience + honest gap (full answer kept); both share the `strangeloop-agent` route.

## Static interview audio generation

Audio is generated **offline only**. The website never calls Edge TTS or ElevenLabs at runtime. Both generators read canonical English from `apps/web/src/app/interview/data.ts`, strip formatting via `buildSpeechMapping`, and write the same asset pair:

```text
apps/web/public/audio/interview/qNN/full.mp3
apps/web/public/audio/interview/qNN/alignment.json
```

`alignment.json` shape:

```ts
{
  version: 1,
  questionId: 'q02',
  speechText: string, // spoken text without *, **, /
  words: Array<{
    text: string;
    canonicalStart: number; // offset into canonical Markdown source
    canonicalEnd: number;
    startMs: number;
    endMs: number;
  }>;
}
```

### When to regenerate

After changing **English answer wording** in `data.ts` for a question, regenerate that question’s MP3 + alignment. Karaoke and segment seek depend on `speechText` matching the current canonical answer. Do **not** regenerate merely for UI/highlight/karaoke styling changes.

### Preferred generator: Edge TTS (free)

Script: `scripts/generate-interview-audio-edge.ts`  
Command: `pnpm generate:interview-audio:edge`  
Dependency: workspace root `devDependency` `edge-tts-universal` (no API key).

Uses Microsoft Edge online neural voices via an unofficial client. Suitable for **local offline generation only** — never wire this into the Next.js runtime. The endpoint can change or throttle; if generation fails, retry later or fall back to ElevenLabs.

Defaults (calm male “senior interview” style):

| Env | Default | Purpose |
|---|---|---|
| `EDGE_TTS_VOICE` | `en-US-ChristopherNeural` | Male US neural voice |
| `EDGE_TTS_RATE` | `+0%` | Natural voice pace (override with e.g. `-15%` to slow down) |
| `EDGE_TTS_PITCH` | `-2Hz` | Slightly lower, calmer tone |

```bash
# Preview without network synthesis
pnpm generate:interview-audio:edge -- 2 --dry-run
pnpm generate:interview-audio:edge -- all --dry-run

# Generate / replace one question (required after English answer edits)
pnpm generate:interview-audio:edge -- 2 --force

# Several questions
pnpm generate:interview-audio:edge -- 1 2 3 --force

# All questions (skips complete pairs unless --force)
pnpm generate:interview-audio:edge -- all
pnpm generate:interview-audio:edge -- all --force

# Different calm male voices
EDGE_TTS_VOICE=en-US-EricNeural EDGE_TTS_RATE=-20% pnpm generate:interview-audio:edge -- 2 --force
EDGE_TTS_VOICE=en-US-RogerNeural pnpm generate:interview-audio:edge -- 2 --force
EDGE_TTS_VOICE=en-GB-RyanNeural pnpm generate:interview-audio:edge -- 2 --force
```

Useful male English voices for interview practice:

| Voice | Notes |
|---|---|
| `en-US-ChristopherNeural` | Default — calm, clear, professional |
| `en-US-EricNeural` | Slightly deeper |
| `en-US-RogerNeural` | Mature / steady |
| `en-GB-RyanNeural` | British, more formal |
| `en-US-AndrewNeural` | Modern, easy to hear |
| `en-US-GuyNeural` | Neutral default-style US male |

List more voices at generation time with a small Node snippet importing `VoicesManager` from `edge-tts-universal` and filtering `Gender: 'Male', Language: 'en'`.

### Alternate generator: ElevenLabs (paid key)

Script: `scripts/generate-interview-audio.ts`  
Command: `pnpm generate:interview-audio`  

Uses ElevenLabs’ timestamp endpoint. Keep keys in the shell only; never commit API keys or put them in `.env` / docs.

```bash
pnpm generate:interview-audio -- all --dry-run

export ELEVENLABS_API_KEY="..."
export ELEVENLABS_VOICE_ID="..."
# optional: ELEVENLABS_MODEL_ID (default eleven_multilingual_v2)
pnpm generate:interview-audio -- 1
pnpm generate:interview-audio -- 1 3 10
pnpm generate:interview-audio -- 1 --force
```

### Playback behavior after generation

- Existing complete `full.mp3` + `alignment.json` pairs are skipped unless `--force`.
- UI uses static full-answer audio and timestamp karaoke when both files exist.
- Section, phrase, and current-idea playback use the same full MP3 + alignment and seek by canonical character range.
- Browser SpeechSynthesis remains available only for requests without a static `src`.
- After regenerating, hard-refresh `/interview`, open the question, and press Listen to confirm voice + karaoke track the new wording.

### Agent checklist (audio regen)

1. Edit English in `apps/web/src/app/interview/data.ts` only when the task is content (not UI).
2. Run `pnpm generate:interview-audio:edge -- <id> --force` (or ElevenLabs equivalent).
3. Confirm `alignment.json` `speechText` starts with the new spoken opening.
4. Confirm word cue count looks sane and `startMs`/`endMs` increase through the answer.
5. Smoke-test Listen on `/interview` for that question.
6. Do not commit secrets. Commit regenerated `qNN/full.mp3` + `alignment.json` only when the user asks to commit audio assets.

## Adding or editing a question

To add another question, edit only `data.ts` for the question itself if all referenced IDs already exist:

```ts
{
  id: 21,
  question: { en: '...', vi: '...' },
  answer: {
    sections: [
      { id: 'point', en: '...', vi: '...' },
      { id: 'reason', en: '...', vi: '...' },
    ],
  },
  contextIds: ['E'],
  clusterIds: ['tool-calling'],
  storyIds: [],
  memory: {
    nodes: [
      {
        id: 'architecture',
        label: 'ARCHITECTURE',
        triggers: ['...'],
        answerSectionId: 'point',
      },
    ],
  },
}
```

The UI automatically picks it up in the navigator, Recall, Learn, Quick Practice, Connections reverse lookup, Memory Path, hints, and local progress because it iterates over `interviewQuestions`.

If a new context/cluster/story/trigger ID is needed, define that global entity in `connections.ts` first, then reference its ID from the question.

## Memory path and hints

A question's `memory.nodes` is the compact recall skeleton, not a replacement answer. Each node may contain:

- `label`: visible path node.
- `triggers`: small hint list shown only when the node is opened.
- `answerSectionId`: stable link to a canonical answer section.
- `phrase`: optional short metadata field for future presentation.

Recall opens one node at a time. The full canonical answer remains in `answer.sections` and is revealed separately.

Questions without custom memory nodes currently return an empty memory path through `getMemoryNodes`; add nodes in that question's `memory.nodes` when creating or improving its recall scaffold.

## UI modes

`page.tsx` provides four modes:

- **Recall**: default active-recall surface; question, memory path, on-demand node hints, progressive answer reveal.
- **Learn**: canonical answer visible, with optional supporting controls.
- **Quick practice**: randomized one-question interview flow.
- **Connections**: secondary memory-network view; contexts, clusters, stories, and trigger drill.

Do not add question-specific JSX. New question behavior should come from the question config and existing generic rendering.

## Interview audio

Audio is optional and frontend-only. Add externally generated MP3 files under `apps/web/public/audio/interview/qXX/`, then configure their paths in the question's `audio` field in `data.ts`:

```ts
audio: {
  full: '/audio/interview/q01/full.mp3',
  sections: { point: '/audio/interview/q01/point.mp3' },
}
```

Full answers, sections, phrases, and current ideas use the static full MP3 with timestamp alignment when available. The player seeks by canonical character range for a section or phrase, stops at that range's final aligned word, and drives highlight state from the sample audio clock. Browser Web Speech is only a fallback for requests with no static source. No placeholder MP3 files are required. Playback speed is stored in `localStorage` under `ee.interview.audio-speed.v1`.

## 2026-09-08 implementation log

This section records the interview-practice work completed today so a later agent can trace the behavior without reconstructing the history from commits.

### User-visible behavior delivered

- Canonical answer Markdown is rendered safely: `**bold**` becomes `<strong>`, `*italic*` becomes `<em>`, and markers are not displayed.
- Three text representations are kept conceptually separate:
  - `sourceText`: canonical Markdown in `data.ts`.
  - `displayText`: React nodes produced by the existing inline parser.
  - `speechText`: normalized plain text with Markdown markers and `/` pause markers removed for speech.
- Full answer playback, section playback, phrase playback, and current-idea playback use the generated sample audio rather than unexpectedly switching to the browser voice.
- Next idea and Previous idea work as a timeline-like controller. Changing idea selects the matching memory node and smoothly scrolls the corresponding answer section into view.
- Clicking a phrase or a section Listen button updates the Memory path to the node mapped by `answerSectionId`.
- Karaoke highlights one complete speaking phrase/beat at a time, not individual words. A phrase remains highlighted from its first aligned word through its last aligned word.
- During karaoke, the entire phrase receives one strong background. Normal text is white on the active blue background; bold technical keywords become amber so they remain visible; italic text becomes a lighter blue.

### Source files and responsibilities

- `apps/web/src/app/interview/page.tsx`
  - Owns Recall/Learn/Quick UI state, `ideaIndex`, `openNode`, and answer rendering.
  - `jumpToIdea`, `nextIdea`, and `previousIdea` control progressive answer reveal.
  - A section ref map scrolls the active answer section into view.
  - `MemoryPath` receives `activeSectionId` and visually selects the matching node.
  - Phrase and section playback call `onActivate` before starting audio, synchronizing Memory path and audio.
  - `AnswerContent` calculates the current idea's canonical offset and passes a bounded `AudioSegment` to the player.
  - `renderTrackedText` applies formatting to the whole phrase and wraps the whole phrase in one highlight container when the active range intersects it.
- `apps/web/src/app/interview/audio.ts`
  - Owns HTMLAudioElement playback, pause/resume/restart, speed, alignment loading, range seeking, and karaoke state.
  - `AudioSegment` is a canonical character interval `{ canonicalStart, canonicalEnd }`.
  - Segment playback filters alignment words by canonical overlap, seeks to the first matching word, and stops after the last matching word.
  - `buildSpeakingBeats` groups alignment words into stable beats using audio pauses, punctuation, duration, and a maximum word-count guard.
  - The animation-frame clock uses `speakingBeatAtTime` to return the active beat range; it does not use word-boundary events, preventing rapid word-by-word flashing.
  - Static-audio errors end playback instead of silently switching to a browser voice. Browser SpeechSynthesis is retained only for requests with no `src`.
- `apps/web/src/app/interview/audio-mapping.ts`
  - Converts canonical Markdown/pause-marker source into clean speech text and maps speech character offsets back to canonical source offsets.
  - This preserves karaoke alignment even though `*`, `**`, and `/` are not spoken.
- `apps/web/src/app/interview/utils.ts`
  - `parseInlineRanges` parses minimal safe inline Markdown and retains source ranges.
  - `stripFormatting` removes bold/italic markers, converts `/` to spaces, collapses whitespace, and trims speech text.
- `apps/web/src/app/interview/rich-text.tsx`
  - Reuses the same safe inline parser for non-karaoke rich text such as cloze content.
- `apps/web/src/app/interview/data.ts`
  - Remains the canonical answer source. Do not rewrite wording while changing playback or presentation.
- `apps/web/public/audio/interview/qNN/full.mp3`
  - Static generated sample audio for a question.
- `apps/web/public/audio/interview/qNN/alignment.json`
  - Timestamp alignment with `speechText` and word cues containing `canonicalStart`, `canonicalEnd`, `startMs`, and `endMs`.

### Trace the main flows

Current idea playback:

```text
Next idea
  → ideaIndex changes
  → activeIdea resolves to answer.sections[ideaIndex - 1]
  → MemoryPath selects node by node.answerSectionId
  → answer section scrolls into view
  → Listen idea builds canonical AudioSegment
  → audio.ts seeks sample MP3 to overlapping alignment words
  → speakingBeatAtTime returns one phrase range
  → page.tsx highlights only the active idea section
```

Phrase playback:

```text
Click phrase
  → onActivate() selects its answer section's memory node
  → phrase source is normalized for speech
  → full question MP3 + alignment JSON are requested
  → canonical phrase range is converted to AudioSegment
  → audio.ts seeks/stops at that range
  → only the matching phrase container is highlighted
```

Full answer playback:

```text
Listen answer
  → full canonical source is mapped to clean speech text
  → full MP3 and alignment JSON play from the beginning
  → section offsets map alignment ranges back to rendered sections
  → speaking beat highlight moves across the answer
```

### Important invariants

1. Never change canonical English answer wording while fixing UI/audio behavior.
2. `/` is a speaking pause marker in source content. It is displayed as phrase separation and becomes whitespace in speech.
3. `*` and `**` are formatting markers only. They must never be sent to TTS or shown to the user.
4. `answerSectionId` is the link between a Memory path node and one answer section. Do not use array indexes for this relationship.
5. Canonical offsets include source Markdown markers and `/` characters. Alignment mappings must continue to refer to those source offsets.
6. For current-idea playback, highlight must be bounded to the active idea section. Do not pass the current idea's range to every previously revealed paragraph.
7. The speaking beat is a UI highlight range, not a new audio segmentation format. Do not regenerate MP3/alignment assets merely to change highlight styling or beat grouping.
8. Static sample audio is authoritative for interview playback. Do not reintroduce silent browser-voice fallback for a request that has a valid `src`.
9. Do not use `dangerouslySetInnerHTML` for answer rendering.
10. Preserve the existing `Listen`, pause, resume, restart, and speed controls when changing karaoke logic.

### Known debugging traps

- If idea B highlights idea A, inspect `AnswerContent`'s `trackedRange` predicate and `rangeOffset` before changing beat grouping. The active idea key must be accepted only for the matching paragraph.
- If a phrase starts at the wrong time, inspect `sectionOffset`, `chunkStart`, and `AudioSegment.canonicalStart`; all three must use canonical source coordinates.
- If the spoken text contains Markdown or sounds like it says pause markers, inspect `stripFormatting` and `buildSpeechMapping` rather than changing the canonical data.
- If playback uses the browser voice, inspect whether the request contains `src` and `alignment`, then inspect `audio.ts` error handling. Do not hide missing static audio by adding a silent fallback.
- If karaoke flashes too quickly, inspect `speakingBeatAtTime` and `buildSpeakingBeats`; do not restore word-by-word highlighting.
- If karaoke text looks washed out (e.g. purple/green on blue), inspect `renderTrackedText`: active beats must use `karaokeActiveShell` / `karaokeActiveText` and must not keep phrase `chunkColors`.
- If Memory path does not move when a phrase is clicked, inspect `onActivate` in `AnswerSectionView` and the `answerSectionId` mapping in `data.ts`.

### Verification commands used today

```bash
pnpm --filter @app/web typecheck
pnpm --filter @app/web lint
pnpm --filter @app/web build
git diff --check
```

The production deployment was smoke-tested with an HTTP 200 request to `/interview`. The current production Vercel project is `english-exam-prep`; the API is the Render service defined in `render.yaml`. The relevant commits for today's trace are:

- `e8867c1` — current idea playback.
- `6ca6b0d` — sample audio for ideas, sections, and phrases.
- `70f8e0e` — stable speaking-beat karaoke.
- `6b7876e` — constrain karaoke to the active idea section.
- `06f0be4` — amber bold keywords during karaoke.
- `2760f20` — Memory path synchronization on phrase playback.

When changing this feature later, update this log or add a new dated entry instead of replacing the historical behavior description.

### 2026-09-14 — Full speaking polish Q1 + Q10–Q23 + Edge audio

- Polished remaining questions for speakable connectors/`/` pauses (Q2–Q9 already done earlier).
- Fixed Q12 EN/VI mismatch; removed Q13 coaching meta sections from spoken answer.
- Regenerated Edge TTS for Q1 and Q10–Q23 with `en-US-ChristopherNeural` / `+0%` / `-2Hz`.
- Hardened `generate-interview-audio-edge.ts` alignment for Edge splits/merges (`Node.js`, `46 seconds`).
- All `q01`–`q23` now have `full.mp3` + `alignment.json`.

### 2026-09-14 — Karaoke contrast vs phrase colors

- Phrase chunk palette no longer uses violet (`text-violet-700` → `text-teal-700` / `text-sky-800`) to reduce clash with blue UI chrome.
- Active karaoke now forces `bg-slate-900` + white/amber/cyan text and drops chunk `colorClass`, so any idle phrase color stays readable while speaking.
- Change only `karaokeActiveShell` / `karaokeActiveText` / `chunkColors` in `page.tsx` for future palette tweaks; do not reintroduce chunk colors onto active beats.

### 2026-09-14 — Edge TTS free offline generator + Q2 regen

- Added `scripts/generate-interview-audio-edge.ts` and root script `pnpm generate:interview-audio:edge`.
- Uses `edge-tts-universal` (workspace `devDependency`) to write the same `full.mp3` + `alignment.json` pair as ElevenLabs, with WordBoundary → canonical offset mapping.
- Default voice profile for calm senior-style listening: `en-US-ChristopherNeural`, rate `+0%` (natural pace), pitch `-2Hz` (override via `EDGE_TTS_VOICE` / `EDGE_TTS_RATE` / `EDGE_TTS_PITCH`).
- Regenerated Q2 assets after speaking-script connector edits in `data.ts`. Prefer Edge for free local regen; keep ElevenLabs as the paid alternate.
- Still offline-only: do not call Edge TTS from the Next.js app at runtime.

## Local progress

`storage.ts` uses localStorage key:

```text
ee.interview.progress.v2
```

It stores:

- Practiced question IDs.
- Difficult question IDs.
- Learning level per question.
- Review records: `lastPracticedAt`, `nextReviewAt`, `reviewCount`, and difficulty.

Review schedule:

- Again: today.
- Hard: +1 day.
- Good: +3 days.
- Easy: +7 days.

Do not move this state to the API/database without an explicit product decision.

## Content safety rules

- Do not rewrite canonical English answers.
- Do not remove or change `/` speaking pauses.
- Preserve `**bold**` technical keywords and `*italic*` speaking starters.
- Do not invent experience, claims, or alternate answers.
- Derived labels and memory hints must remain faithful to the canonical guide.
- UI transformations such as reveal, cloze, grouping, and highlighting are allowed; they must not mutate source text.

## 2026-09-14 — Backend Interview category

`/interview/backend` displays **Senior Backend Node.js Interview** / **B1–B2 Speaking Pack** using the existing interview visual language with a topic → questions → Answer (B1–B2) → Key idea flow. It lists 12 fixed topics and renders questions and answers from `source-questions.ts` without rewriting their wording; key ideas are answer-grounded recall paths. All 12 supplied topic chunks (39 questions) are present; the empty state remains for any future topic without supplied questions. A compact, collapsible Quick Interview Framework displays the supplied five steps and speaking connectors. The recommended route is 1 → 3 → 4 → 6 → 7 → 8 → 10; all other topics remain directly selectable. It does not use the AI Interview progress store, audio assets, or backend APIs. The `/interview` question content, modes, and audio remain unchanged.

### Vietnamese study translations

The Backend Interview page has one **Show Vietnamese / Hide Vietnamese** control, matching the AI Interview's optional translation pattern. When enabled, it shows the translated question below the English prompt and the Vietnamese answer and key idea under their English counterparts; hiding an English answer or key idea also hides its translation. `backend/translations.ts` pairs translations by topic number and question order with the unchanged English source in `backend/source-questions.ts`. All 39 entries have `questionVi`, `answerVi`, and `keyIdeaVi`; no audio or API calls are involved.

### Speaking chunk display

The Backend Interview answer view splits English answers at natural punctuation boundaries into short, subtly color-accented beats, with visual pause separators. `backend/speaking-chunks.ts` slices the display text without changing the source: concatenating the chunks reproduces each English answer exactly. Pause marks are decorative, not spoken/source text. Vietnamese remains plain beneath the answer; the existing answer/key-idea visibility and Vietnamese toggle still apply. This display-only change does not regenerate audio.

### 2026-09-23 — Backend key-idea recall paths

The 39 Backend Interview `keyIdea` / `keyIdeaVi` lines now give compact, question-specific speaking paths with `→` stages instead of repeating the answer opening. Each Vietnamese path mirrors its English stages. This is a study cue only: the English/Vietnamese questions and B1–B2 answers, topic order, visibility controls, and static audio remain unchanged. No audio regeneration is needed.

## Validation

From the repository root:

```bash
pnpm --filter @app/web typecheck
pnpm --filter @app/web lint
pnpm --filter @app/web build
git diff --check
```

For content edits, also verify:

```text
- all question IDs are unique
- every answer section has a stable ID
- every memory answerSectionId exists in that question's answer.sections
- every contextIds/clusterIds/storyIds value exists in connections.ts
- /interview renders without login
- localStorage progress still loads
```

Do not commit or push unless explicitly requested.
