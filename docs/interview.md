# Interview Practice Tab

## Scope

The public `/interview` route is a frontend-only learning tool for the Everfit Applied AI Backend Engineer interview script.

- Route: `apps/web/src/app/interview/page.tsx`
- No login required.
- Audio is optional static frontend content; there is no runtime AI generation or ElevenLabs API call.
- Progress is stored in browser `localStorage`.
- Canonical source content is hard-coded in `apps/web/src/app/interview/data.ts`.

## File map

```text
apps/web/src/app/interview/
├── page.tsx         UI, modes, active-question flow
├── data.ts          canonical questions, answers, Part 2 strategy content
├── types.ts         question and connection types
├── connections.ts   global contexts/clusters/stories/triggers + selectors
├── storage.ts       localStorage progress and review scheduling
├── utils.ts         inline formatting, keyword extraction, cloze helpers
└── rich-text.tsx    renders `**bold**` and `*italic*` source markers
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

Global display definitions live in `connections.ts`:

- `contexts`
- `phraseClusters`
- `heroStories`
- `triggers`

Reverse relationships are derived. Do not add a second manually maintained `questions` list to contexts, clusters, or stories.

Available selectors in `connections.ts`:

```ts
getQuestionRelations(questionId)
getContextsForQuestion(questionId)
getClustersForQuestion(questionId)
getStoriesForQuestion(questionId)
getQuestionsForContext(contextId)
getQuestionsForCluster(clusterId)
getQuestionsForStory(storyId)
getContextsForTrigger(triggerId)
getRelatedQuestions(questionId)
getMemoryNodes(questionId)
```

`page.tsx` consumes these selectors for Connections, context labels, question lists, stories, triggers, and memory paths.

## One-time ElevenLabs audio generation

The local generator uses the canonical English answers and ElevenLabs' timestamp endpoint to create optional static assets. It never runs in the website. The generated sample voice/audio is the authoritative playback source for the interview route when its static files are present.

```bash
# Preview all questions without an API call
pnpm generate:interview-audio -- all --dry-run

# Generate one or selected questions
export ELEVENLABS_API_KEY="..."
export ELEVENLABS_VOICE_ID="..."
pnpm generate:interview-audio -- 1
pnpm generate:interview-audio -- 1 3 10

# Regenerate existing assets explicitly
pnpm generate:interview-audio -- 1 --force
```

`ELEVENLABS_MODEL_ID` is optional and defaults to `eleven_multilingual_v2`. Outputs are written to `apps/web/public/audio/interview/qNN/full.mp3` and `alignment.json`. Existing complete pairs are skipped unless `--force` is supplied. The UI uses static full-answer audio and timestamp karaoke when both files exist. Section, phrase, and current-idea playback use the same full MP3 plus alignment JSON and seek to the matching canonical character range; they do not fall back to browser SpeechSynthesis when the static audio source is available. Browser SpeechSynthesis remains available only for requests that do not provide a static `src`. Keep API keys in the shell only; do not add them to source or `.env` files.

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
