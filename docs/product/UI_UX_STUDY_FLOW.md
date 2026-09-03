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
