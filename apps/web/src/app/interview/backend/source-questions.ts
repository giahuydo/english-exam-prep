import type { BackendTranslation } from './translations';

export type EnglishBackendQuestion = { question: string; answer: string; keyIdea: string };
export type BackendQuestion = EnglishBackendQuestion & BackendTranslation;

/** Transcribed verbatim from the 12 user-provided B1–B2 source chunks. */
export const sourceQuestions: Partial<Record<number, EnglishBackendQuestion[]>> = {
  1: [
    {
      question: 'What is the Node.js event loop, and why is it important?',
      answer: 'Node.js uses a single main thread to run JavaScript. The event loop helps Node.js handle many requests without waiting for every I/O task to finish. When Node.js starts an I/O task, such as reading a file or calling a database, it can continue handling other work. When the I/O task finishes, its callback is added back to the event loop. This is why Node.js works well for I/O-heavy applications, but we should avoid heavy CPU work on the main thread.',
      keyIdea: 'One JavaScript main thread → start I/O without waiting → handle other work → resume callbacks when I/O finishes → keep CPU-heavy work off the main thread.',
    },
    {
      question: 'What is the difference between I/O-heavy and CPU-heavy tasks?',
      answer: 'I/O-heavy tasks spend most of their time waiting, for example database queries, network requests, or file operations. Node.js handles these tasks well because it does not need to block the main thread while waiting. CPU-heavy tasks use a lot of CPU time, for example image processing or complex calculations. They can block the event loop, so I would move them to worker threads, a queue, or another service.',
      keyIdea: 'I/O-heavy work waits → Node.js can handle other requests → CPU-heavy work blocks the event loop → move it to workers, a queue, or another service.',
    },
    {
      question: 'What is the difference between async/await and synchronous code?',
      answer: 'Synchronous code waits for one task to finish before moving to the next task. With async/await, Node.js can start an asynchronous operation and continue other work while it is waiting. Async/await also makes asynchronous code easier to read and maintain. However, using await does not automatically make CPU-heavy work non-blocking.',
      keyIdea: 'Synchronous code waits → async/await starts an asynchronous operation → other work can continue → await does not make CPU-heavy work non-blocking.',
    },
    {
      question: 'What happens if one request performs a heavy CPU calculation?',
      answer: 'If the calculation runs on the main thread, it can block the event loop. Other requests have to wait, so the API becomes slow. I would avoid doing heavy CPU work directly in the request handler. Depending on the use case, I can use worker threads, a background queue, or a separate service.',
      keyIdea: 'Heavy CPU work on the main thread → event loop blocked → other requests slow down → use worker threads, a queue, or a separate service.',
    },
  ],
  2: [
    {
      question: 'How do you design a reliable REST API?',
      answer: 'I start with clear resources and endpoints. I validate input data, return consistent HTTP status codes, and use a standard error response. For list APIs, I normally support pagination and filtering. For important write operations, I also think about authentication, authorization, idempotency, logging, and rate limiting.',
      keyIdea: 'Define clear resources and endpoints → validate input → return consistent status codes and errors → add pagination and filtering → protect important writes.',
    },
    {
      question: 'What is idempotency, and when do you need it?',
      answer: 'Idempotency means sending the same request multiple times should not create the same action multiple times. For example, for a payment or job creation API, I can use an idempotency key. I store the key with the result and use a unique constraint in the database. If the same request comes again, I return the previous result instead of creating another record.',
      keyIdea: 'Repeated request → use an idempotency key for important actions → store key and result with a unique constraint → return the previous result instead of duplicating work.',
    },
    {
      question: 'How do you handle API errors?',
      answer: 'I separate expected errors from unexpected errors. For example, invalid input can return 400, unauthorized access can return 401 or 403, and missing data can return 404. For unexpected errors, I return a safe message to the client and keep the technical details in the server logs. I also use a request ID so we can trace the error.',
      keyIdea: 'Classify expected and unexpected errors → return suitable HTTP codes → keep unexpected details in server logs → use a request ID to trace them.',
    },
  ],
  3: [
    {
      question: 'An API is slow. How do you investigate the database?',
      answer: 'First, I check whether the database is really the bottleneck. I look at API timing, slow query logs, and database metrics. Then I check the query plan, indexes, the amount of data being returned, and possible N+1 queries. I also check the connection pool and locks. I try to fix the root cause before adding more database resources.',
      keyIdea: 'Slow API → confirm the database is the bottleneck → inspect timing, query plan, indexes, pool, and locks → fix the cause before adding resources.',
    },
    {
      question: 'What is a database index, and what is the trade-off?',
      answer: 'An index helps the database find data faster without scanning the whole table. It is useful for columns that are often used in WHERE, JOIN, or ORDER BY conditions. However, indexes use extra storage and make insert and update operations more expensive, so I do not add indexes everywhere.',
      keyIdea: 'Index → find rows faster without a full scan → use for common WHERE, JOIN, or ORDER BY columns → weigh storage and slower writes.',
    },
    {
      question: 'What happens when the database connection pool is full?',
      answer: 'New requests may need to wait for a free database connection. Because they are waiting for I/O, Node.js CPU can still be low while API response time becomes very high. I would check active connections, long-running queries, pool size, timeouts, and whether connections are released correctly.',
      keyIdea: 'Full connection pool → requests wait while CPU stays low → API latency rises → check active connections, long queries, timeouts, and connection release.',
    },
    {
      question: 'How do you prevent race conditions when two requests update the same data?',
      answer: 'The solution depends on the business case. I can use a database transaction, a unique constraint, optimistic locking, or pessimistic locking. I prefer database constraints when possible because they protect the data even if two application requests run at the same time.',
      keyIdea: 'Two requests update the same data → choose a transaction, constraint, or lock for the business case → prefer database constraints when possible → protect concurrent updates.',
    },
  ],
  4: [
    {
      question: 'Why would you use RabbitMQ instead of processing everything inside the API request?',
      answer: 'A queue lets the API move slow or background work outside the request. The API can respond faster, and workers can process jobs separately. It also gives us retry, better reliability, and easier scaling. The trade-off is more system complexity and sometimes higher processing latency.',
      keyIdea: 'Slow work in an API request → move it to a queue → respond faster while workers process jobs → gain retries and scaling at the cost of complexity and latency.',
    },
    {
      question: 'What are ACK and NACK in RabbitMQ?',
      answer: 'ACK tells RabbitMQ that the consumer processed the message successfully, so the message can be removed. NACK means processing failed. Depending on our configuration, the message can be retried, requeued, or sent to a dead-letter queue.',
      keyIdea: 'Message succeeds → ACK removes it → processing fails → NACK → retry, requeue, or dead-letter according to configuration.',
    },
    {
      question: 'How do you handle duplicate messages?',
      answer: 'I assume that a message can be delivered more than once. The consumer should be idempotent. For example, I can use a job ID or business ID and store it in the database with a unique constraint. Before performing the action, I check whether it has already been processed.',
      keyIdea: 'Message may arrive twice → make the consumer idempotent → store a unique job or business ID → check before acting again.',
    },
    {
      question: 'The database transaction succeeds, but publishing to RabbitMQ fails. What would you do?',
      answer: 'This can create inconsistent state because the data is saved but the event is missing. A common solution is the Outbox Pattern. I save the business data and an outbox record in the same database transaction. A separate worker reads the outbox table and publishes the message. If publishing fails, it can retry safely.',
      keyIdea: 'Database saved but publish failed → event missing → save business data and an outbox record together → worker publishes and retries safely.',
    },
  ],
  5: [
    {
      question: 'When would you use Redis caching?',
      answer: 'I use caching for data that is read often and does not need to be calculated or loaded from the database every time. A common approach is cache-aside. The application checks Redis first. If the data is missing, it loads the data from the database and stores it in Redis with a TTL.',
      keyIdea: 'Frequently read data → check Redis first → on a miss load from the database → cache the result with a TTL.',
    },
    {
      question: 'What is the difficult part of caching?',
      answer: 'The difficult part is keeping cached data correct. When the database changes, old cached data may still exist. I normally use a clear invalidation strategy and a reasonable TTL. For important data, I prefer correctness over keeping data cached for too long.',
      keyIdea: 'Database changes → cached data may become stale → invalidate clearly and set a reasonable TTL → prioritize correctness for important data.',
    },
    {
      question: 'What happens if Redis goes down?',
      answer: 'For normal caching, I try to let the application fall back to the database instead of failing completely. I also use timeouts and monitoring so Redis problems do not make every request wait for a long time. However, if Redis is used for critical state, the design needs a stronger recovery plan.',
      keyIdea: 'Redis unavailable → normal cache falls back to the database → use timeouts and monitoring → plan stronger recovery if Redis holds critical state.',
    },
  ],
  6: [
    {
      question: 'Traffic increases 10 times. Response time is slow, but CPU usage is low. What could be wrong?',
      answer: 'If the response time is slow but CPU usage is still low, I would first think about an I/O problem, not a CPU problem. The system may be waiting for a database query, an external API, Redis, or a database connection. First, I check logs and metrics to find which API is slow. Then I check the database, connection pool, external services, event-loop lag, memory, and pending requests. If traffic is too high, we can scale more instances, but I would find the bottleneck first because adding servers may not solve the real problem.',
      keyIdea: 'Slow API + low CPU → suspect I/O first → check logs, database, pool, and external services → find the bottleneck → scale only if needed.',
    },
    {
      question: 'What is horizontal scaling?',
      answer: 'Horizontal scaling means adding more application instances instead of making one server bigger. A load balancer can distribute requests across the instances. The application should avoid keeping important session state only in local memory because the next request may go to another instance.',
      keyIdea: 'Need more capacity → add application instances → load balancer distributes requests → avoid keeping important sessions only in local memory.',
    },
    {
      question: 'How do you find a performance bottleneck?',
      answer: 'I start with measurements instead of guessing. I check request latency, throughput, error rate, CPU, memory, database timing, external API timing, and queue metrics. Then I trace a slow request through the system to see where most of the time is spent. I optimize the slowest important part first and measure again after the change.',
      keyIdea: 'Measure latency, errors, and system timing → trace a slow request → find where time is spent → optimize the key bottleneck → measure again.',
    },
  ],
  7: [
    {
      question: 'How do you design retry logic?',
      answer: 'I retry only temporary failures, such as a network timeout or temporary service error. I do not retry invalid input or authentication errors. I use a retry limit and exponential backoff, and sometimes jitter. The operation should also be idempotent because a retry may execute the same action again.',
      keyIdea: 'Temporary failure → retry with a limit and backoff → avoid retrying invalid input or auth errors → keep the operation idempotent.',
    },
    {
      question: 'What is a circuit breaker?',
      answer: 'A circuit breaker stops calling a service for a short time when that service keeps failing. This helps protect our application from waiting for repeated timeouts and gives the failing service time to recover. After some time, we can allow a small number of requests to test whether it is healthy again.',
      keyIdea: 'Service fails repeatedly → stop calls briefly → avoid repeated timeouts and allow recovery → send a few test requests later.',
    },
    {
      question: 'A production API suddenly has many errors. What do you do first?',
      answer: 'First, I check the impact and recent changes. I look at logs, metrics, error rate, latency, and affected endpoints. If a recent deployment caused the problem, rollback can be the fastest safe action. After the system is stable, I investigate the root cause, fix it, and add monitoring or tests to prevent the same issue.',
      keyIdea: 'Production errors spike → check impact, logs, and recent changes → roll back if the deploy caused it → stabilize → fix the cause and improve monitoring or tests.',
    },
  ],
  8: [
    {
      question: 'What is optimistic locking?',
      answer: 'Optimistic locking assumes conflicts are not very common. A record normally has a version number. When I update it, I also check the version. If another request already changed the record, the update fails and I can retry or return a conflict to the client.',
      keyIdea: 'Conflicts are rare → track a record version → check it during update → if changed, retry or return a conflict.',
    },
    {
      question: 'When would you use pessimistic locking?',
      answer: 'I use pessimistic locking when a conflict would be expensive and I need to stop other transactions from changing the same data while my transaction is running. It gives stronger control, but it can reduce concurrency and may cause lock waits or deadlocks, so I use it carefully.',
      keyIdea: 'Expensive conflict → lock the data during the transaction → stop competing changes → weigh lower concurrency and possible lock waits or deadlocks.',
    },
    {
      question: 'How do you keep data consistent across multiple services?',
      answer: 'There is no single database transaction across independent services in many systems. I normally design each local operation to be reliable and use events for communication. Patterns such as Outbox, idempotent consumers, retries, and compensating actions help us reach eventual consistency safely.',
      keyIdea: 'Independent services lack one shared transaction → make local operations reliable → communicate with events → use Outbox, idempotency, retries, and compensation for eventual consistency.',
    },
  ],
  9: [
    {
      question: 'What is the difference between authentication and authorization?',
      answer: 'Authentication checks who the user is. Authorization checks what that user is allowed to do. For example, a JWT can help authenticate a user, but the backend still needs to check roles or permissions before performing an action.',
      keyIdea: 'Authentication checks identity → authorization checks permissions → JWT can identify a user → backend still checks roles or permissions before acting.',
    },
    {
      question: 'How do you secure a backend API?',
      answer: 'I validate all input, use authentication and authorization, protect secrets, use HTTPS, and avoid exposing sensitive information in errors or logs. I also use parameterized database queries, rate limiting where needed, dependency updates, and proper permission checks on every protected action.',
      keyIdea: 'Validate input and check identity and permissions → protect secrets and use HTTPS → avoid sensitive errors or logs → add safe queries and rate limits where needed.',
    },
    {
      question: 'Why should the backend check permissions even if the frontend hides a button?',
      answer: 'Frontend checks improve the user experience, but they are not a security boundary. A user can call the API directly. The backend must check permissions before performing the action because the backend controls the real data and business operations.',
      keyIdea: 'Hidden frontend button is not security → users can call the API directly → backend checks permissions before changing real data.',
    },
  ],
  10: [
    {
      question: 'How would you design a large file processing system?',
      answer: 'I would not process a large file completely inside the API request. The API uploads the file to object storage and creates a job. A queue sends the job to a worker. The worker processes the file in smaller steps and updates the job status, for example queued, running, completed, or failed. For large jobs, I also use checkpoints so the worker can continue from the last successful step after a failure.',
      keyIdea: 'Large file → upload to object storage and create a job → queue work for a worker → update status in steps → checkpoint for recovery.',
    },
    {
      question: 'How would you design a notification system?',
      answer: 'I would separate creating the notification from sending it. The main service creates a notification event or job and sends it to a queue. Workers can send email, push, or other notification types. I would include retry, idempotency, status tracking, and a dead-letter process for failed jobs.',
      keyIdea: 'Create notification separately from delivery → queue a job → workers send email or push → track status, retry safely, and handle failed jobs.',
    },
    {
      question: 'How would you design an API that must handle high traffic?',
      answer: 'I start with stateless API instances behind a load balancer. I use database indexes and connection pooling, and cache frequently read data when it is safe. Slow background work can go to a queue. I also add rate limiting, timeouts, monitoring, and horizontal scaling. The exact design depends on where the real bottleneck is.',
      keyIdea: 'High traffic → stateless APIs behind a load balancer → tune database and safe caching → queue slow work → monitor and scale around the real bottleneck.',
    },
  ],
  11: [
    {
      question: 'Why do you use Docker?',
      answer: 'Docker gives the application a consistent runtime environment. The same image can run in development, testing, and production. It also makes deployment easier because the application and its dependencies are packaged together.',
      keyIdea: 'Package app and dependencies in a Docker image → run the same environment in development, testing, and production → simplify deployment.',
    },
    {
      question: 'What is the role of Nginx in front of a Node.js application?',
      answer: 'Nginx can work as a reverse proxy. It receives client requests and forwards them to Node.js instances. It can also handle TLS, load balancing, request limits, and some static content. This keeps some infrastructure work outside the Node.js application.',
      keyIdea: 'Nginx receives client requests → forwards them to Node.js instances → can handle TLS, balancing, and limits → keeps infrastructure work outside the app.',
    },
    {
      question: 'What are readiness and liveness checks?',
      answer: 'A liveness check tells the platform whether the application process is alive. If it is unhealthy, the platform can restart it. A readiness check tells whether the application is ready to receive traffic. For example, an instance may be alive but still starting, so it should not receive requests yet.',
      keyIdea: 'Liveness asks whether the process is alive → restart if unhealthy → readiness asks whether it can receive traffic → wait until startup finishes.',
    },
  ],
  12: [
    {
      question: 'What is the difference between unit, integration, and end-to-end tests?',
      answer: 'A unit test checks a small piece of logic in isolation. An integration test checks how multiple parts work together, for example the service and database. An end-to-end test checks a complete flow from the API request to the final result. I use different test levels because they catch different types of problems.',
      keyIdea: 'Unit tests check isolated logic → integration tests check parts together → end-to-end tests check the full flow → each catches different problems.',
    },
    {
      question: 'What do you look for in a code review?',
      answer: 'I check correctness first: business logic, edge cases, error handling, security, and possible data problems. Then I check readability, maintainability, test coverage, performance when relevant, and whether the change follows the existing architecture. I try to keep comments specific and explain why a change is important.',
      keyIdea: 'Review correctness and edge cases first → check security and data risks → assess readability, tests, and architecture → explain specific feedback.',
    },
    {
      question: 'How do you prevent regression bugs?',
      answer: 'I first reproduce the bug and understand the root cause. Then I fix it and add a test that fails before the fix and passes after it. For important flows, I also keep integration or end-to-end tests. Monitoring in production helps us catch problems that tests may miss.',
      keyIdea: 'Reproduce the bug → find its root cause → fix it and add a before/after test → keep important flow tests and monitor production.',
    },
  ],
};
