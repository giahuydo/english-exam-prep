# Study flow UI/UX

## Product principle

The student experience is focused on one next action. Shared question content is displayed by the API; this frontend does not invent learner progress, evidence, section scores, or recommendation data.

## Screens

### Today (`/dashboard`)

The landing screen prioritizes Continue learning, Needs review/Practice mistakes, mock exam start or resume, and a small recent result. Empty states explain what action creates data. It consumes `/me/dashboard`; an in-progress session is resumable when the API returns one.

### Learning scope (`/learn`)

Topics are shown as a simple responsive card list. Status is derived only from `/topics` and `/me/stats`: `NOT_STARTED` (no attempts), `NEEDS_REVIEW` (accuracy below 70%), `PASSED` (at least five attempts and 80% accuracy), otherwise `IN_PROGRESS`. Each topic links to Learn/Review/Continue.

### Topic lesson/checkpoint (`/learn/[topic]`)

The lesson presents a short structure explanation and a clear `Check 5 questions` CTA. The checkpoint uses the existing practice-session API with `totalQuestions: 5`, so the result is the normal session result screen rather than fake local scoring.

### Practice (`/practice/[sessionId]`)

Practice is instructional: one question at a time, large keyboard-focusable answer buttons, progressive hints, explicit Submit answer, then feedback. Correctness and explanations are rendered only after submission. Feedback sections are based on available API explanation/distractor data; generic labels are used only as teaching prompts, never as fabricated question facts.

### Mock exam (`/mock-exams` and `/mock-exams/[sessionId]`)

Mock mode uses a dark visual treatment, persistent countdown, answered count, navigator, Previous/Next, and final submission. No hints, explanations, or correctness are shown before submission. `Pause & exit` returns to the mock list; when the API exposes an in-progress session through dashboard data, Today offers resume.

2026-09-28: Interview mock now has its own `/interview-mock` page, linked from the landing page and student navigation. Its user-provided frontend interview questions and long-form sample answers are centrally managed in `apps/web/src/app/interview-mock/questions.json`. All question tiles appear together in one panel without internal grid scrolling, showing only recall labels (not the full question); tapping a tile opens a dialog with the full question and answer. The OCR cards are adjacent in a Problem → Infrastructure → Model/deployment recall flow: OCR Incident (`OOM · Recovery`), Technical Trade-off (`CPU vs GPU · Reliability`), then OCR Model Selection (`Model Choice · Data Residency`). The English answer is displayed as short speaking chunks on subtle chips inside a pale-yellow panel; each JSON record also has a `translate` field and the popup's small `VI`/`EN` button switches that answer content without changing the question. The dialog can scroll if the answer exceeds the device viewport. The OCR Model Selection tile covers model/deployment/data-residency trade-offs and keeps GPU benchmarking as a future step, separate from the OCR Incident tile. The Python-scope tiles are grouped at the end: Python vs Node, Python choose sort (comparing algorithms for different constraints), a dedicated Timsort explanation (runs → insertion/merge → stable O(n log n)), Python List vs Set (order/duplicates/index versus uniqueness/lookup), Python List vs Tuple (mutable versus immutable), Python List internals (dynamic array, index/search/append complexity), and Python hash table (hash → position → average O(1) Set lookup). This sample flow does not create a session, call the API, or persist answers; `/mock-exams` retains the existing blueprint-backed flow.

2026-09-29: Added Python List vs Tuple to the `/interview-mock` Python question group with English and Vietnamese answers, usage examples, memory and hashability notes, and a concise recap. Python code fences in mock answers now render as code blocks instead of speaking chips; other answer paragraphs keep their existing chunk display.

2026-09-30: Added a Node.js JavaScript Thread question before the Python group. Its bilingual answer explains non-blocking I/O, the Event Loop, concurrent requests, and the CPU-heavy work caveat; the tile has short I/O and Event Loop recall keywords. Added a separate Node.js Event Loop question immediately after it, covering how completed I/O leads to callbacks and Promise continuations on the main thread. Both answers include short recall lines. Added a Node.js Async/Await question next, with paired English/Vietnamese explanation of function suspension, non-blocking I/O, Promise resolution, and the microtask queue, plus a short recall line. Added a Microtasks and Macrotasks question after Async/Await with a spoken A, D, C, B ordering example (no code block), bilingual answers, and a short sync → microtask → macrotask recall cue. Added a CPU-heavy on Main Thread question after that: a spoken three-second API example, Worker Threads versus queue/separate worker choice, paired Vietnamese answer, and a short recall line. Added Worker Threads vs RabbitMQ immediately after it, with a bilingual CPU-parallelism versus durable background jobs comparison, ten-thousand-document example, and two-line recall cue. Added a Node.js Memory Leak question next, with B1 bilingual steps for monitoring `heapUsed`/`RSS`, comparing heap snapshots in DevTools after load, checking retained references such as a growing cache, and verifying memory after the fix. Added Node.js Garbage Collection immediately after the memory-leak question, explaining V8 reachability, the `null` user-object example, retained references, and a short recall cue in English and Vietnamese. Added Node.js Stack vs Heap next, with paired bilingual function-call/object-reference explanations, a spoken global-cache example, and two short recall lines. Added CommonJS vs ES Modules after the Node.js memory questions, with paired bilingual module syntax examples, static-analysis distinction, and two-line recall cue. Added a JavaScript Closure question before the Python group with bilingual counter-by-words example, outer-scope/private-state explanation, and one-line recall cue.

2026-09-30: Added Promise.all vs allSettled to `/interview-mock` after JavaScript Closure, with bilingual failure-handling comparison, three-service and hundred-email examples, and two short recall lines. Added Sequential Await vs Promise.all immediately after it, contrasting dependent and independent tasks with paired one-second API-call and user/orders examples.

2026-09-30: Added a bilingual `process.nextTick()` vs `setImmediate()` vs `setTimeout()` speaking question after Microtasks and Macrotasks, with spoken ordering/timer/I/O examples and three short recall cues. The examples avoid claiming a fixed order between timers and `setImmediate()` outside the I/O example.

2026-09-30: Added Node.js Streams before the Python group in `/interview-mock`, with bilingual chunk-by-chunk memory explanation, two-gigabyte file and CSV examples, four stream types, and a short recall line.

2026-09-30: Added Node.js Stream Backpressure immediately after Streams in `/interview-mock`, with bilingual fast-file/slow-network explanation and the `write()` false → `drain` flow. Wording describes a buffer threshold rather than claiming the buffer is literally full.

2026-09-30: Added Algorithms: Binary Search after Timsort in `/interview-mock`, with bilingual sorted-list prerequisite, spoken search for eleven, O(log n) explanation, and a short recall line. Added Algorithms: Array vs Linked List immediately after it, with bilingual index-access and insertion/deletion trade-offs, spoken examples, and the reminder that O(1) link changes require a known position. Added Algorithms: Recursion next, with a bilingual factorial example, base/recursive cases, stack-overflow caveat, and a short recall line.

2026-09-30: Added Hash Collision after Python hash table in `/interview-mock`, with paired English/Vietnamese explanations of same-slot mapping, open addressing versus buckets, average lookup cost, a locker analogy, and a short recall cue.

2026-09-30: Added Python Iterator vs Generator before Python hash table in `/interview-mock`, with bilingual `iter()`/`next()` versus `yield` explanation, a million-record lazy-processing example, and three short recall lines.

2026-09-30: Added Node.js Sync vs Async before the JavaScript Thread question in `/interview-mock`, with a bilingual STAR document-processing example (OCR/extraction → API enqueues job → worker processes it → responsive API) and short synchronous/asynchronous recall cues. The pasted chat content-reference marker is not part of the answer.

2026-09-30: Added Document Chunking after AI Ownership in `/interview-mock`, with bilingual explanation of embedding per chunk, fifty-page clinical protocol/dosage retrieval example, chunk-size trade-off, and a short recall line. Omitted the pasted chat content-reference marker.

2026-09-30: Added Chunk Size / Overlap after Document Chunking, with bilingual small-versus-large trade-off, a Drug A dosage sentence split at a chunk boundary, overlap for boundary context, and a test-and-adjust approach using Recall and Precision. This is an interview explanation, not a claim about a deployed chunking configuration.

2026-09-30: Added Embeddings immediately after Document Chunking, with bilingual semantic-similarity example, document-chunk and question embeddings stored/searched via PostgreSQL, and a short retrieval recall line. Omitted the pasted chat content-reference marker.

2026-09-30: Added Vector Search immediately after Embeddings in `/interview-mock`, with bilingual question/chunk vector comparison, dosage retrieval example, cosine similarity mention, and a short recall line.

2026-09-30: Added Vector Storage immediately after Vector Search, with bilingual PostgreSQL metadata/embedding proximity, study/document filtering example, operations/scale trade-off, and a short recall path. The answer intentionally does not claim use of pgvector or a specific vector index; pasted chat content-reference markers were omitted.

2026-09-30: Added Qdrant immediately after Vector Storage, with bilingual explanation of a dedicated vector database, metadata filtering, a hypothetical RAG chunk-search example, independent scaling, and a short recall line. This study answer does not claim the current project uses Qdrant.

2026-09-30: Added Hybrid Search after Qdrant in `/interview-mock`, with bilingual semantic versus exact-term comparison, heart attack/myocardial infarction and Drug X/ABC-123 examples, and three short recall cues. The study answer explains the method without claiming it is deployed in the current project.

2026-09-30: Added Reranking immediately after Hybrid Search, with bilingual retrieval-candidates versus reordered-results explanation, Drug X dosage example, latency/cost trade-off, and two short recall cues. This is a conceptual interview answer, not a deployment claim.

2026-09-30: Added Retrieval Evaluation immediately after Reranking, with bilingual ground-truth/top-K example (dosage answer in chunk 25), Recall@K, latency and cost, and a short recall path. The content presents an evaluation approach rather than claiming the project's retrieval system already uses these metrics.

2026-09-30: Added a concise bilingual Recall@K vs Precision@K comparison after Retrieval Evaluation, with “don’t miss” and “don’t return noise” recall cues.

### Result/review (`/review`)

The result screen shows score, correct/total, review count, and answer review. It links to mistake review or learning without inventing section/topic weakness values. Detailed evidence is intentionally not shown because the current API has no evidence contract.

## Practice vs Mock

| Concern | Practice | Mock exam |
|---|---|---|
| Purpose | Learn and correct immediately | Simulate exam conditions |
| Feedback | After each submit | After final submit via review |
| Hints | Progressive API hints | Not available |
| Navigation | One question and Next | Navigator plus Previous/Next |
| Visual language | Light blue/white instructional cards | Dark exam header and high-contrast shell |
| Timing | No forced timer | Persistent countdown |

## Responsive behavior and accessibility

Cards use fluid widths, readable text, and touch-sized controls. Desktop mock exams use a question panel plus navigator; narrow screens naturally stack them. Semantic buttons include focus rings and pressed/disabled states. Status badges include text, not color alone. Progress headers expose an accessible label and timers use `aria-live`.

Reading passages can be supplied through the existing question `context` field and remain above the question in the same card. A future reading adapter may provide a desktop two-column passage/questions layout and a mobile Passage/Questions toggle; no fake passage/evidence fields are introduced here.

## Loading, error, and empty states

Every data screen has a loading message, an API error alert, and an empty state where the API can validly return no topics, blueprints, questions, attempts, or mistakes. Retry behavior is limited to safe reload/navigation actions.

## API contracts and integration points

- `GET /me/dashboard`: profile, recent sessions, weak topics, mistake count.
- `GET /topics`: shared topic list.
- `GET /me/stats`: per-user mastery/accuracy records.
- `POST /practice/sessions`: starts a session; topic checkpoint sends `mode: TOPIC_PRACTICE`, topic ID, `totalQuestions: 5`.
- `GET /practice/sessions/:id`: session and session questions.
- `POST /practice/sessions/:id/answers`: submit answer and receive correctness, correct option, explanation, and distractor explanations.
- `POST /practice/sessions/:id/questions/:questionId/hint`: progressive hint contract.
- `POST /practice/sessions/:id/complete`: completes a session.
- `GET /mock-exams/blueprints`, `POST /mock-exams`, `GET /mock-exams/:id`: mock templates and learner session.
- `GET /me/attempts?sessionId=...`: result/review attempts.
- `GET /me/mistakes`: mistake review data.

Lane A/B dependency: this UI expects the existing authenticated, user-scoped session/attempt/mastery endpoints and the typed response fields above. Persistent pause/resume state, section weakness aggregates, passage evidence, and a dedicated checkpoint pass-state endpoint are not currently available on `origin/main`; the UI uses typed local adapters and existing fields rather than hardcoded production data.
