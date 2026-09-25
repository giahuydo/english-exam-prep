import type { BackendTranslation } from './translations';

export type EnglishBackendQuestion = { question: string; alternativeQuestion?: string; answer: string; keyIdea: string };
export type BackendQuestion = EnglishBackendQuestion & BackendTranslation;

/** Transcribed verbatim from the 12 user-provided B1–B2 source chunks. */
export const sourceQuestions: Partial<Record<number, EnglishBackendQuestion[]>> = {
  1: [
    {
      question: 'Can you briefly introduce yourself and tell me about your current role and experience?',
      answer: 'I have around eight years of experience building web applications across different business domains. Currently, I’m working on a clinical trial management platform for the US and Canada. In this project, I’ve had to follow strict security and compliance requirements and work with healthcare-specific workflows. More recently, I’ve been working closely with the client’s CTO and have become more involved in applied AI. I work quite independently in this area. I discuss ideas directly with the CTO, understand the business problem, identify where AI can be useful, break the idea down into technical tasks, and then build the feature end to end. One of the main areas I’ve worked on is document processing. We built a Python-based pipeline that handles OCR, data extraction, sensitive-data redaction, and converts documents into structured JSON and Markdown files. The processed output is organized and stored in GCP. After that, we have workers that process the structured content into smaller chunks, generate embeddings, and store the data in PostgreSQL. On top of that, I build APIs that work as tools for AI agents, so the agents can search, read, and retrieve the right information from the documents with supporting evidence. We use this foundation for several real product features. One example is Protocol AI, which is similar to a RAG system that allows users to ask questions about clinical documents and get grounded answers. Another example is SMR-to-EDC, where AI helps suggest values for EDC form fields based on information extracted from medical records. My main strength is backend development, but I can also work on frontend when needed. So for some AI features, I can take the work from the initial discussion, through backend and AI integration, to the frontend and deliver a complete working flow. Overall, this project has given me a lot of practical experience in building and deploying AI-integrated applications in a real production environment.',
      keyIdea: 'Eight years building web apps → clinical trial platform in US/Canada → security and healthcare workflows → direct CTO collaboration and end-to-end applied AI → Python OCR/redaction pipeline → GCP → workers, embeddings and PostgreSQL → agent tool APIs with evidence → Protocol AI and SMR-to-EDC → backend strength plus frontend delivery → production AI experience',
    },
    {
      question: 'Can you tell me about an AI feature you owned end to end?',
      alternativeQuestion: 'Can you describe a project where you applied AI to solve a real business problem?',
      answer: 'One good example is Protocol AI. We wanted users to upload clinical documents and later ask questions, but the answers needed to be grounded in the original documents instead of relying only on the LLM. I took ownership of the processing and retrieval flow behind this feature. One important part was OCR Gym. I used it to try different document-processing approaches on the same ground-truth documents and compare their quality, grounding, latency, and cost. From that work, I selected the core processing flow and brought it into production. We use Gemini to generate structured Markdown, another OCR model to extract words and positions, then verify the outputs and package everything into a structured DocCard. After that, the processed data is stored in GCP and ingested into our Virtual File System, where it is organized into searchable nodes and chunks. The AI agent can then use simple tools like search and read to find only the relevant information. The key thing I learned is that a strong model alone is not enough. The model also needs the right context and a good way to access the data. As a result, this became the foundation for Protocol AI, where users can ask questions about clinical documents and get answers with supporting evidence.',
      keyIdea: 'Protocol AI → grounded answers from clinical documents → own processing and retrieval → OCR Gym compares quality, grounding, latency, cost → Gemini Markdown + OCR positions → verify and package DocCard → GCP + Virtual File System nodes/chunks → agent search/read tools → evidence-backed answers',
    },
  ],
  2: [
    {
      question: 'What is idempotency, and when do you need it?',
      answer: 'Idempotency means the same request or message can be processed more than once without creating the same business action twice. A common way is to use a request ID, job ID, or unique key.',
      keyIdea: 'Same request or message arrives again → check request ID, job ID, or unique key → avoid repeating the business action.',
    },
  ],
  3: [
    {
      question: 'How do you investigate a slow API when CPU usage is low?',
      answer: 'Basically, if the API is slow but CPU usage is low, it often means the requests are waiting instead of doing heavy computation. First, I trace a slow request and check where the time is spent, for example database queries, the connection pool, or an external API. If the database is slow, I check slow query logs, the query plan, indexes, the amount of data being returned, and possible N+1 queries. If the connection pool is full, new requests have to wait for a free connection. Then I check active connections, long-running queries, pool size, timeouts, and whether connections are released correctly. I try to fix the root cause before adding more API instances, because more instances can create even more database connections. Then I measure the latency again.',
      keyIdea: 'Slow API + low CPU → requests are waiting → trace where time is spent → check DB queries + pool + external calls → fix root cause before scaling → measure again',
    },
    {
      question: 'What is a database index, and what is the trade-off?',
      answer: 'An index helps the database find data faster without scanning the whole table. It is useful for columns that are often used in WHERE, JOIN, or ORDER BY conditions. However, indexes use extra storage and make insert and update operations more expensive, so I do not add indexes everywhere.',
      keyIdea: 'Index → find rows faster without a full scan → use for common WHERE, JOIN, or ORDER BY columns → weigh storage and slower writes.',
    },
    {
      question: 'How do you prevent race conditions when two requests update the same data?',
      answer: 'Basically, it depends on the type of data and how important the update is. In my current project, for some important form updates, we use a database transaction with a write lock. If one request is updating the row, another request has to wait until the first one finishes. This is pessimistic locking. Another option is optimistic locking. A common way is to use a version number. The backend checks whether the version is still the same before updating. If another request already changed the data, the version is different, so we return a conflict instead of overwriting the newer data. For some background jobs, we use another simple check. We update the job only if its current status is still what we expect. If another process already changed it, the second update does nothing. So overall, I choose the strategy based on the use case: a write lock for important short updates, a version check for user editing, and a status check for background jobs.',
      keyIdea: 'Two requests update same data → choose by use case → pessimistic: write lock, second request waits → optimistic: version changed, return conflict → background job: update only if current status is still correct',
    },
  ],
  4: [
    {
      question: 'Why would you use RabbitMQ instead of processing everything inside the API request?',
      answer: 'I use a queue when the work can take a long time or does not need to finish inside the API request. It keeps the API responsive, and the worker can process the job separately.',
      keyIdea: 'Long work outside the API request → queue a job → worker processes it separately → API stays responsive.',
    },
    {
      question: 'What are ACK and NACK in RabbitMQ?',
      answer: 'I ACK after the message is processed successfully. If processing fails, I can NACK and retry or send it to a dead-letter queue, depending on the error.',
      keyIdea: 'Success → ACK → failure → NACK → retry or dead-letter depending on the error.',
    },
    {
      question: 'How do you handle duplicate messages?',
      answer: 'I make the consumer idempotent. Before changing data, I check whether the job or business action was already processed. This helps me avoid doing the same work twice.',
      keyIdea: 'Duplicate message → check whether job or business action was processed → avoid doing the work twice.',
    },
    {
      question: 'The database transaction succeeds, but publishing to RabbitMQ fails. What would you do?',
      answer: 'One common solution is the Outbox Pattern. I save the business change and the event in the same database transaction, then publish the event later.',
      keyIdea: 'DB change saved but publish fails → Outbox → save change and event together → publish later.',
    },
    {
      question: 'How do you make an asynchronous job reliable when processing can fail or the same message can be delivered more than once?',
      answer: 'Basically, for long-running work, I prefer to process it in the background. The API creates a job, and a worker processes it from the queue. If there is a temporary failure, I retry only a few times. But the same message can be delivered more than once, so I also make the consumer idempotent. For example, before I process the job, I can check the job ID and its current status to avoid doing the same work twice. I only ACK the message after the work is completed successfully. Another risk is when the database update succeeds but publishing the next message fails. One common solution is the Outbox Pattern. We save the business change and the event in the same database transaction, then publish the event later. So overall, the important points are background processing, limited retry, idempotency, and clear job status.',
      keyIdea: 'Long-running work → queue → temporary failure: retry a few times → duplicate message: idempotency → success: ACK → DB success but publish fails: Outbox',
    },
  ],
  5: [
    {
      question: 'How do you use Redis caching safely, and what do you do when the cache is stale or unavailable?',
      answer: 'Basically, I use Redis for data that is read often and does not need to come from the database every time. A common approach is cache-aside. First, the application checks Redis. If the data is not there, it loads the data from the database and stores it in Redis with a TTL. The difficult part is keeping the cache fresh after the database changes. After a successful update, I usually delete the related cache key, so the next request loads fresh data from the database. For data that must always be fresh, I may read directly from the database instead of using the cache. If Redis goes down and it is only used as a cache, I use a short timeout and fall back to the database. But I also monitor the database load because too much fallback traffic can overload it. So overall, I use Redis to reduce database load, but I also think about cache invalidation, TTL, and fallback.',
      keyIdea: 'Read often → Redis cache-aside → cache miss: DB → save with TTL → DB update: invalidate cache → Redis down: short timeout + DB fallback → watch DB load',
    },
  ],
  6: [
    {
      question: 'What is horizontal scaling?',
      answer: 'Horizontal scaling means adding more application instances instead of making one server bigger. A load balancer can distribute requests across the instances. The application should avoid keeping important session state only in local memory because the next request may go to another instance.',
      keyIdea: 'Need more capacity → add application instances → load balancer distributes requests → avoid keeping important sessions only in local memory.',
    },
  ],
  7: [
    {
      question: 'How do you use retries and a circuit breaker when a service fails?',
      answer: 'Basically, I retry only temporary failures, such as a timeout or a short network problem. I set a retry limit and use exponential backoff, so each attempt waits longer. For invalid input, permission errors, or bad configuration, I fail fast instead of retrying. If a retry could repeat a business action, I make that action idempotent. When an external service keeps failing, I also use a circuit breaker to stop calling it for a short time. This keeps our API from waiting for repeated timeouts and gives the other service time to recover. Later, the circuit breaker lets a small number of requests through to check whether the service is healthy again. So retries handle short failures, while the circuit breaker protects us from a longer outage.',
      keyIdea: 'Temporary error → limited retries + exponential backoff → permanent error: fail fast → repeated action: idempotency → repeated service failures: open circuit → pause calls → test recovery → protect API',
    },
    {
      question: 'How do you design a backend system for reliability and failure handling?',
      answer: 'For me, backend reliability means the system should still behave correctly when something fails. I normally start by identifying the failure points, such as database errors, external API failures, message delivery problems, or long-running jobs. For temporary failures, I use retries with exponential backoff, but I always set a retry limit because not every error should be retried. For asynchronous processing, I usually use a queue so the work can be retried and scaled independently. I also make the consumer idempotent, so if the same message is delivered more than once, it does not create duplicate data. For critical flows, I also think about consistency between the database and the message queue. For example, if the database transaction succeeds but publishing the message fails, I can use the Outbox Pattern so the event is stored first and published later by a worker. I also use timeouts, proper error handling, logging, request or job IDs, and monitoring, so when something fails, we can trace it quickly. So overall, I focus on retry, idempotency, safe message handling, data consistency, and observability.',
      keyIdea: 'Identify failure points → retry temporary errors with limits and backoff → queue asynchronous work → idempotent consumer prevents duplicates → Outbox keeps DB and messages consistent → timeouts, IDs, logs and monitoring → observability',
    },
  ],
  8: [
    {
      question: 'How do you keep data consistent across multiple services?',
      answer: 'For example, an order service may save an order before a payment service confirms payment. I save the order and an outbox event in one transaction, then publish the event for the payment service. The payment consumer handles duplicates and reports success or failure; on failure, I mark the order canceled or start a refund if needed. The services become consistent over time, so the order status must show that payment is still pending.',
      keyIdea: 'Order saved before payment → commit order and outbox event together → payment consumer handles duplicates → confirm or compensate → show pending status until consistent.',
    },
  ],
  9: [
    {
      question: 'How do you design a secure and reliable backend API?',
      answer: 'Basically, I do not trust the client. First, I validate the input before processing the request. Then I check authentication to know who the user is. After that, I check authorization to make sure the user has permission to perform the action. In Clincove, access control is quite strict because we work with clinical trial data. For example, the backend also checks which study and site the user can access. In some flows, the study and site must match the user\'s access scope. If they don\'t match, the backend does not return the resource. So even if the frontend hides a button, the backend still checks the permission and resource scope. I also return clear errors, for example validation error, unauthorized, forbidden, or server error. For important operations, I keep logs or audit information with the request context, so the issue is easier to trace. So overall, my flow is validate the input, verify the user, check permission and resource scope, process the request, and return a clear response.',
      keyIdea: 'Client request → validate input → authenticate user → check permission → check study/site scope → process → clear error → audit/trace',
    },
  ],
  10: [
    {
      question: 'How do you handle large-file processing and troubleshoot performance or production issues?',
      answer: 'Basically, for large files, I don\'t process everything inside one API request. I create a background job and process the document step by step. For large documents, I use smaller batches and save the progress, so the job can continue if something fails. In one production issue, a large document caused high memory usage and the OCR job failed. First, I checked the job logs, memory usage, processing time, and which step failed. We found that OCR was both memory-heavy and slow. So we reduced the batch size and concurrency, and added checkpoint and resume. After that, we also moved the heavy OCR inference to a remote GPU service. The OCR time improved from around 46 seconds per page to around 2 seconds per page. So overall, I first make the job recoverable, then measure the bottleneck, and finally optimize the slowest part.',
      keyIdea: 'Large file → background job → smaller batches → checkpoint/resume → check logs + memory + failed step → find OCR bottleneck → move heavy OCR to GPU → measure improvement',
    },
    {
      question: 'How would you design a notification system?',
      answer: 'When an order is confirmed, I save a notification job with the order change and queue it through an outbox for an email worker. The worker stores a delivery ID, retries temporary provider errors with a limit, and marks permanent failures for review. It checks the job ID before sending again, though an external provider may still send twice unless it supports idempotency. The user can see a pending or failed status instead of assuming the email arrived.',
      keyIdea: 'Order confirmed → save and queue notification via outbox → worker tracks delivery and limits retries → guard duplicates, including provider behavior → expose pending or failed status.',
    },
    {
      question: 'How would you design an API that must handle high traffic?',
      answer: 'I start by measuring which endpoint slows down under load, not by adding servers first. If database reads are the bottleneck, I check the query plan, add a useful index, and cache safe read-only data with a TTL. Stateless API instances behind a load balancer can then scale, but each instance also uses database connections, so I cap the pool. I use timeouts and rate limits to protect the system, then load-test again.',
      keyIdea: 'Measure the slow endpoint → fix query and safe read cache → scale stateless APIs while limiting DB connections → protect with timeouts and rate limits → retest.',
    },
    {
      question: 'Can you give me an example of a technical decision where you had to consider trade-offs?',
      alternativeQuestion: 'Can you tell me about a time you had to choose between performance, cost, and system complexity?',
      answer: 'One example was our OCR processing. At first, the OCR model was running on CPU inside the application. The main advantage was that the setup was simple and we didn’t depend on another service, but the processing was quite slow and it also used a lot of CPU resources. We considered moving the OCR workload to GPU. The trade-off was that GPU processing was much faster, but it added infrastructure cost, network dependency, and more operational complexity because the OCR became a remote service. I tested both approaches and compared the processing time and stability. The GPU version was significantly faster, so we decided to move OCR to a remote GPU service. At the same time, I didn’t want the whole document-processing flow to fail when the GPU service was unavailable or when an environment didn’t have GPU support. So we added configuration guards and kept the flow safe for those environments. As a result, we improved OCR performance a lot while still keeping the system reliable and easier to operate across different environments.',
      keyIdea: 'OCR on CPU: simple but slow and resource-heavy → GPU: faster but higher cost, network dependency and complexity → test time and stability → choose remote GPU → configuration guards protect unsupported/unavailable environments → faster OCR with reliable operations',
    },
  ],
  11: [
    {
      question: 'How do you run a Node.js application reliably in production?',
      answer: 'Basically, I use Docker to package the application and its dependencies, so the same image can run in development, testing, and production. In production, Nginx can sit in front of the Node.js application as a reverse proxy. It receives client requests and forwards them to the Node.js instances. It can also handle TLS, load balancing, and request limits. When we run multiple instances, health checks are also important. A liveness check tells the platform whether the application process is alive, so it can restart an unhealthy instance. A readiness check tells whether the instance is ready to receive traffic. For example, an instance can be alive but still starting, so it should not receive requests yet. So overall, Docker gives me a consistent runtime, Nginx handles traffic in front of the application, and health checks help make sure traffic goes only to ready instances.',
      keyIdea: 'Docker packages runtime → Nginx receives and routes traffic → TLS/load balancing/limits → liveness: process alive? → readiness: ready for traffic? → send traffic only to ready instances',
    },
  ],
  12: [
    {
      question: 'How do you test backend changes and prevent regression bugs?',
      answer: 'Basically, I use different test levels for different risks. A unit test checks a small piece of logic in isolation. An integration test checks how multiple parts work together, for example the service and database. An end-to-end test checks a complete flow from the API request to the final result. When I fix a bug, I first reproduce it and understand the root cause. Then I add a test that fails before the fix and passes after it. For important flows, I also keep integration or end-to-end tests. Production monitoring helps us catch problems that tests may miss. So overall, I use the right test level for the change and add a regression test when I fix a bug.',
      keyIdea: 'Change or bug → choose test level → unit: small logic → integration: parts together → E2E: full flow → reproduce bug → add regression test → monitor production',
    },
    {
      question: 'What do you look for in a code review?',
      answer: 'I check correctness first: business logic, edge cases, error handling, security, and possible data problems. Then I check readability, maintainability, test coverage, performance when relevant, and whether the change follows the existing architecture. I try to keep comments specific and explain why a change is important.',
      keyIdea: 'Review correctness and edge cases first → check security and data risks → assess readability, tests, and architecture → explain specific feedback.',
    },
  ],
};
