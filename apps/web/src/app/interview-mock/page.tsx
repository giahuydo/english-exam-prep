'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, SectionTitle } from '@/components/ui';
import { StudentShell } from '@/components/shells';
import { learnerCopy, useLanguage } from '@/lib/language';
import { speakingChunks } from '@/app/interview/backend/speaking-chunks';

const quickQuestions = [
  {
    label: 'Introduction',
    prompt:
      'Can you briefly introduce yourself and tell me about your current role and experience?',
    answer: `I have around eight years of experience building web applications across different business domains.

Currently, I’m working on a clinical trial management platform for the US and Canada. In this project, I’ve had to follow strict security and compliance requirements and work with healthcare-specific workflows.

More recently, I’ve been working closely with the client’s CTO and have become more involved in applied AI. I work quite independently in this area. I discuss ideas directly with the CTO, understand the business problem, identify where AI can be useful, break the idea down into technical tasks, and then build the feature end to end.

One of the main areas I’ve worked on is document processing. We built a Python-based pipeline that handles OCR, data extraction, sensitive-data redaction, and converts documents into structured JSON and Markdown files. The processed output is organized and stored in GCP.

After that, we have workers that process the structured content into smaller chunks, generate embeddings, and store the data in PostgreSQL. On top of that, I build APIs that work as tools for AI agents, so the agents can search, read, and retrieve the right information from the documents with supporting evidence.

We use this foundation for several real product features. One example is Protocol AI, which is similar to a RAG system that allows users to ask questions about clinical documents and get grounded answers. Another example is SMR-to-EDC, where AI helps suggest values for EDC form fields based on information extracted from medical records.

My main strength is backend development, but I can also work on frontend when needed. So for some AI features, I can take the work from the initial discussion, through backend and AI integration, to the frontend and deliver a complete working flow.

Overall, this project has given me a lot of practical experience in building and deploying AI-integrated applications in a real production environment.`,
  },
  {
    label: 'Backend Reliability',
    prompt: 'How do you design a backend system for reliability and failure handling?',
    answer: `For me, backend reliability means the system should still behave correctly when something fails.

I normally start by identifying the failure points, such as database errors, external API failures, message delivery problems, or long-running jobs.

For temporary failures, I use retries with exponential backoff, but I always set a retry limit because not every error should be retried.

For asynchronous processing, I usually use a queue so the work can be retried and scaled independently. I also make the consumer idempotent, so if the same message is delivered more than once, it does not create duplicate data.

For critical flows, I also think about consistency between the database and the message queue. For example, if the database transaction succeeds but publishing the message fails, I can use the Outbox Pattern so the event is stored first and published later by a worker.

I also use timeouts, proper error handling, logging, request or job IDs, and monitoring, so when something fails, we can trace it quickly.

So overall, I focus on retry, idempotency, safe message handling, data consistency, and observability.`,
  },
  {
    label: 'AI Ownership',
    prompt: 'Can you tell me about an AI feature you owned end to end?',
    alternative:
      'Can you describe a project where you applied AI to solve a real business problem?',
    answer: `One good example is Protocol AI.

We wanted users to upload clinical documents and later ask questions, but the answers needed to be grounded in the original documents instead of relying only on the LLM.

I took ownership of the processing and retrieval flow behind this feature.

One important part was OCR Gym. I used it to try different document-processing approaches on the same ground-truth documents and compare their quality, grounding, latency, and cost.

From that work, I selected the core processing flow and brought it into production. We use Gemini to generate structured Markdown, another OCR model to extract words and positions, then verify the outputs and package everything into a structured DocCard.

After that, the processed data is stored in GCP and ingested into our Virtual File System, where it is organized into searchable nodes and chunks. The AI agent can then use simple tools like search and read to find only the relevant information.

The key thing I learned is that a strong model alone is not enough. The model also needs the right context and a good way to access the data.

As a result, this became the foundation for Protocol AI, where users can ask questions about clinical documents and get answers with supporting evidence.`,
  },
  {
    label: 'Technical Trade-off',
    prompt:
      'Can you give me an example of a technical decision where you had to consider trade-offs?',
    answer: `One example was our OCR processing.

At first, the OCR model was running on CPU inside the application. The main advantage was that the setup was simple and we didn’t depend on another service, but the processing was quite slow and it also used a lot of CPU resources.

We considered moving the OCR workload to GPU. The trade-off was that GPU processing was much faster, but it added infrastructure cost, network dependency, and more operational complexity because the OCR became a remote service.

I tested both approaches and compared the processing time and stability. The GPU version was significantly faster, so we decided to move OCR to a remote GPU service.

At the same time, I didn’t want the whole document-processing flow to fail when the GPU service was unavailable or when an environment didn’t have GPU support. So we added configuration guards and kept the flow safe for those environments.

As a result, we improved OCR performance a lot while still keeping the system reliable and easier to operate across different environments.`,
  },
  {
    label: 'OCR Incident',
    prompt: 'How did you make OCR processing stable for large documents?',
    answer: `Situation: In one of our document-processing workflows, we had a problem with large documents. Some documents had more than 50 pages, and some pages had complex structures. During processing, OCR was one of the heaviest parts of the process. It sometimes caused an out-of-memory error, which made the whole job fail.

Task: My task was to make the processing more stable on our current system, while also finding a better way to handle the heavy OCR workload.

Action: For the longer-term solution, we moved OCR processing to a GPU service because it was a better place to handle this kind of heavy workload. At the same time, to keep the current system stable, I reduced the number of pages processed in each batch and lowered the processing concurrency. This helped reduce peak memory usage. I also added checkpoints and retry logic. After each successful batch, we saved the progress. So if a later batch failed, the next run could continue from the failed batch instead of processing the whole document again from the beginning.

Result: As a result, we improved OCR performance a lot while still keeping the system reliable and easier to operate across different environments.`,
  },
  {
    label: 'DB Performance',
    prompt: 'How do you approach database design and performance problems?',
    answer: `In one reporting flow, we had an N+1 query problem. The API loaded the main records first, and then queried related data one by one, so the number of database calls increased quickly as the data grew.

My task was to improve the performance without changing the business behavior.

I changed the flow by collecting all the required IDs first and loading the related data in a few batched queries. Then I grouped the results in memory by record ID and built the final response from that data. I also made sure we only loaded the fields and relationships that the report actually needed.

As a result, we reduced unnecessary database round trips and made the API faster and more stable when handling larger data sets.`,
  },
  {
    label: 'Python vs Node',
    prompt: 'How strong are you in Python compared with Node.js?',
    answer: `My strongest stack is Node.js and TypeScript, especially NestJS with PostgreSQL and MongoDB. I’ve used them in production systems for several years.

For Python, I mainly use it in AI and document-processing workflows. So Node.js is still stronger for me, but I’m comfortable working with Python services and learning deeper when needed.`,
  },
  {
    label: 'Why Elfie',
    prompt: 'Why are you interested in this role and why do you want to join Elfie?',
    answer: `I’m interested in Elfie because it is a fast-growing health-tech startup with a product that has real impact on people’s lives.

I also really like that this role combines backend engineering with AI. That is very close to what I’m doing now and also the direction I’m most interested in.

At the same time, I want to challenge myself and step outside my comfort zone. I want to work with a new team, a different product, and grow further in Python, backend architecture, and AI.

So I think Elfie is a very good next step for me.`,
  },
  {
    label: 'Async Architecture',
    prompt:
      'Can you tell me about your experience with microservices and event-driven architecture?',
    answer: `In my current project, we use asynchronous workers for long-running tasks instead of processing everything inside the API request.

The API saves the important state first, sends a message to RabbitMQ or LavinMQ, and a worker processes the job independently.

I also make sure the consumer is idempotent and that retry and failure handling are controlled.

This keeps the API responsive and allows the worker to scale independently, although it adds more complexity around messaging and consistency.`,
  },
  {
    label: 'Service Communication',
    prompt: 'You have multiple microservices. How do they communicate with each other?',
    answer: `In our system, different services communicate in two main ways: synchronous APIs and asynchronous messaging.

For operations that need an immediate response, one service can call another service through an HTTP or REST API. For example, the backend may call another service to get some data or trigger a small operation and wait for the response.

For long-running or heavy tasks, we prefer asynchronous communication. The backend publishes a job or event to RabbitMQ or LavinMQ, and another worker or service consumes that message and processes it independently.

For example, in our document-processing flow, the backend creates the processing state, sends the job to the queue, and the document-processing service handles OCR, extraction, or redaction. After that, it updates the job status or returns the result for the next step in the workflow.

We also pass IDs such as a job ID or document ID between services so we can track the same workflow across multiple services. For asynchronous processing, I also care about retries and idempotency because the same message may be delivered more than once.

So in general, I use APIs when I need an immediate response, and a message queue when the work is asynchronous, long-running, or needs independent scaling.`,
  },
  {
    label: 'Observability',
    prompt: 'How do you monitor and debug issues across multiple microservices?',
    answer: `In a microservice system, I think observability is very important because one request or job may go through several services.

Normally, I use a request ID or job ID and pass it through the whole workflow. Each service includes that ID in its logs, so when something fails, I can trace the same request across different services.

I also check things like the service name, processing step, retry count, error type, latency, and sometimes the model or external service being used.

For asynchronous jobs, I also check the message status and whether the consumer acknowledged the message successfully. If the job failed, I want to know whether it is a temporary failure that can be retried or a permanent failure that needs investigation.

So my usual debugging flow is: find the request or job ID, follow the logs across services, identify which step failed, and then check the input, error, retry history, and latency around that step.`,
  },
  {
    label: 'Security & Compliance',
    prompt:
      'You mentioned that your current project has strict security and compliance requirements. How does that affect your backend design?',
    answer: `In my current project, security and compliance affect the backend design from the beginning, not only at the end.

We have strict authorization rules because users should only access data for the correct organization, study, or site. We also keep audit information for important actions and handle sensitive data carefully.

So when I build a backend feature, I normally think about permission checks, input validation, auditability, and data traceability as part of the normal flow.

For me, the main point is that security is built into the design, not added later. So that’s usually part of my thinking from the start whenever I build a backend feature.`,
  },
];

export default function InterviewMockPage() {
  const { language } = useLanguage();
  const copy = learnerCopy[language];
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (activeQuestion === null) dialog.close();
    else dialog.showModal();
  }, [activeQuestion]);

  return (
    <StudentShell>
      <SectionTitle
        eyebrow={copy.assessmentMode}
        title={copy.interviewMock}
        description={
          language === 'vi'
            ? 'Chọn một câu để xem toàn bộ câu trả lời mẫu. Chỉ dùng dữ liệu trên giao diện.'
            : 'Select a question to read the full sample answer. Frontend-only data.'
        }
      />
      <Card className="max-w-4xl p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-950">
            {language === 'vi' ? 'Câu hỏi phỏng vấn' : 'Interview questions'}
          </h2>
          <span className="text-sm font-semibold text-slate-500">
            {copy.questions(quickQuestions.length)}
          </span>
        </div>
        <div
          className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3"
          aria-label={language === 'vi' ? 'Lưới câu hỏi' : 'Question grid'}
        >
          {quickQuestions.map((item, questionIndex) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveQuestion(questionIndex)}
              className="flex min-h-28 flex-col rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className="text-xs font-bold text-blue-700">
                {copy.questionNumber(questionIndex + 1)}
              </span>
              <span className="mt-2 text-lg font-bold leading-6 text-slate-900">{item.label}</span>
            </button>
          ))}
        </div>
      </Card>
      <dialog
        ref={dialogRef}
        onClose={() => setActiveQuestion(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActiveQuestion(null);
        }}
        aria-label={activeQuestion === null ? undefined : copy.questionNumber(activeQuestion + 1)}
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-1.5rem)] max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-950/60"
      >
        {activeQuestion !== null && (
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700">
                {copy.questionNumber(activeQuestion + 1)} / {quickQuestions.length}
              </span>
              <button
                type="button"
                onClick={() => setActiveQuestion(null)}
                aria-label={language === 'vi' ? 'Đóng' : 'Close'}
                className="rounded-lg px-2 text-xl text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ×
              </button>
            </div>
            <h2 className="mt-3 text-lg font-bold leading-7 text-slate-950 sm:text-xl">
              {quickQuestions[activeQuestion].prompt}
            </h2>
            {'alternative' in quickQuestions[activeQuestion] && (
              <p className="mt-2 text-sm italic text-slate-500">
                {quickQuestions[activeQuestion].alternative}
              </p>
            )}
            <div className="mt-5 rounded-md border-l-[5px] border-[#f59f00] bg-[#fff3bf] px-4 py-3 text-[#111827]">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#374151]">
                {language === 'vi' ? 'Câu trả lời mẫu' : 'Sample answer'}
              </p>
              <div className="space-y-3 text-[18px] font-bold leading-[1.55]">
                {quickQuestions[activeQuestion].answer
                  .split('\n\n')
                  .map((paragraph, paragraphIndex) => (
                    <div key={paragraphIndex} className="flex flex-wrap gap-2">
                      {speakingChunks(paragraph)
                        .flatMap((sentence) =>
                          sentence.split(
                            /(?=\s(?:because|with|but|so|while|where|which|when|instead of)\b)/i,
                          ),
                        )
                        .filter((chunk) => chunk.trim())
                        .map((chunk, chunkIndex) => (
                          <span
                            key={chunkIndex}
                            className="rounded-md border border-amber-200 bg-white/70 px-2.5 py-1 text-[#111827]"
                          >
                            {chunk.trim()}
                          </span>
                        ))}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </StudentShell>
  );
}
