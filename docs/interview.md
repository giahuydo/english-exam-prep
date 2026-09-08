# Interview Practice Tab

## Scope

The public `/interview` route is a frontend-only learning tool for the Everfit Applied AI Backend Engineer interview script.

- Route: `apps/web/src/app/interview/page.tsx`
- No login required.
- No API, database, audio, video, recording, or runtime AI generation.
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

`data.ts` exports `interviewQuestions`, an array of 20 `InterviewQuestion` objects. Each question is self-contained:

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

## Adding or editing a question

To add Q21, edit only `data.ts` for the question itself if all referenced IDs already exist:

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

Full answers and sections prefer configured static MP3 files; when no path is configured, the browser Web Speech API is used. Phrase chunks are derived at runtime from `/` pause markers and always use browser speech. No placeholder MP3 files are required. Playback speed is stored in `localStorage` under `ee.interview.audio-speed.v1`.

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
