import type { BackendTranslation } from './translations';

export type EnglishBackendQuestion = { question: string; answer: string; keyIdea: string };
export type BackendQuestion = EnglishBackendQuestion & BackendTranslation;

/** Transcribed verbatim from the 12 user-provided B1–B2 source chunks. */
export const sourceQuestions: Partial<Record<number, EnglishBackendQuestion[]>> = {
  1: [
    {
      question: 'What is the Node.js event loop, and why is it important?',
      answer: 'Node.js runs JavaScript callbacks on the event loop. For a database request, it can wait for the network without blocking that loop, then run the callback when the result is ready. File work and some DNS calls may use the libuv worker pool instead. I watch event-loop lag because heavy JavaScript on the main thread still delays other requests.',
      keyIdea: 'JavaScript callbacks run on the event loop → network I/O can wait without blocking it; some file and DNS work uses the worker pool → watch event-loop lag from heavy JavaScript.',
    },
    {
      question: 'What is the difference between I/O-heavy and CPU-heavy tasks?',
      answer: 'I/O-heavy tasks spend most of their time waiting, for example database queries, network requests, or file operations. Node.js handles these tasks well because it does not need to block the main thread while waiting. CPU-heavy tasks use a lot of CPU time, for example image processing or complex calculations. They can block the event loop, so I would move them to worker threads, a queue, or another service.',
      keyIdea: 'I/O-heavy work waits → Node.js can handle other requests → CPU-heavy work blocks the event loop → move it to workers, a queue, or another service.',
    },
    {
      question: 'What is the difference between async/await and synchronous code?',
      answer: 'Synchronous code blocks the JavaScript thread until it finishes. With await on a database call, the current async function pauses, but the event loop can handle other callbacks while the I/O is pending. When the result is ready, the function continues. Await does not move a CPU-heavy calculation off the main thread; I would use a worker thread for that.',
      keyIdea: 'Synchronous code blocks the thread → await pauses only the current async function during I/O → other callbacks run → CPU-heavy JavaScript still needs a worker thread.',
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
      answer: 'I start with one clear resource, such as orders, and define what each endpoint returns. For a create request, I validate input, check the user’s permission, and return a consistent error if it fails. If a client retries creation, an idempotency key helps prevent duplicate orders. I paginate list results and log a request ID so we can trace failures.',
      keyIdea: 'Define an orders endpoint → validate and authorize writes → use an idempotency key for retries → paginate reads and trace errors with a request ID.',
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
      answer: 'If two requests change the same balance, a read followed by a separate write can lose one update. I would use an atomic database update inside a transaction, with a condition that the balance stays valid. For editing a profile, I would check a version number and return a conflict if it changed. A unique constraint protects rules such as one order per external ID, but it does not prevent every kind of race.',
      keyIdea: 'Concurrent balance changes can lose updates → use a conditional atomic update in a transaction → use a version check for edits → unique constraints protect specific uniqueness rules.',
    },
  ],
  4: [
    {
      question: 'Why would you use RabbitMQ instead of processing everything inside the API request?',
      answer: 'If sending an email is slow, I would save a job with the business change, then publish it through an outbox and let the API return before delivery. A RabbitMQ consumer processes the job and acknowledges it only after success. I set retry limits and handle duplicate deliveries, because a queue alone does not guarantee the work happens exactly once. This makes the request faster but adds a broker and delay before delivery.',
      keyIdea: 'Slow email → save a job with the business change and publish via outbox → consumer ACKs after success → limit retries and handle duplicates → trade simpler requests for broker complexity and delivery delay.',
    },
    {
      question: 'What are ACK and NACK in RabbitMQ?',
      answer: 'After successful processing, a consumer sends ACK so RabbitMQ removes the message. If it cannot process the message, it can NACK with requeue true to put it back, or requeue false to dead-letter it if a dead-letter exchange is configured; otherwise it is discarded. I avoid requeueing a permanent error forever and use a limited retry path instead.',
      keyIdea: 'Success → ACK removes the message → failure → NACK with requeue true returns it; false dead-letters if configured or discards → limit retries for permanent errors.',
    },
    {
      question: 'How do you handle duplicate messages?',
      answer: 'A worker can finish a job but lose its ACK, so RabbitMQ may deliver it again. I save the job ID with a unique constraint in the same database transaction as the business change. If that ID already exists, I skip the change and ACK the duplicate. For an external payment call, I also pass a stable idempotency key to the provider.',
      keyIdea: 'Lost ACK → duplicate delivery → record job ID and business change atomically → skip and ACK duplicates → use a provider idempotency key for external calls.',
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
      answer: 'The hard part is stale data after a database write. With cache-aside, I read Redis first, load the database on a miss, and cache the result with a TTL. After a successful update, I delete the related cache key so the next read reloads it. There is still a short race between a read and a write, so I would read the database directly when fresh data is required.',
      keyIdea: 'Cache-aside reads Redis then DB on a miss → store with TTL → invalidate after a successful write → use the DB directly when stale reads are unacceptable.',
    },
    {
      question: 'What happens if Redis goes down?',
      answer: 'If Redis is only a cache, I use a short timeout and read from the database when it is unavailable. I monitor database load and limit traffic if the fallback overloads it. I would not treat cache-only data as durable state. If Redis stores critical state, I first define persistence, failover, and how to recover lost writes.',
      keyIdea: 'Optional cache fails → short timeout and DB fallback → watch DB load → critical state needs explicit persistence, failover, and lost-write recovery.',
    },
  ],
  6: [
    {
      question: 'Traffic increases 10 times. Response time is slow, but CPU usage is low. What could be wrong?',
      answer: 'Slow responses with low CPU often mean requests are waiting, not computing. I would trace a slow request and check database time, connection-pool waits, and external API timeouts first. If the pool is full, I would fix long queries or connection leaks before adding API instances, which could put even more pressure on the database. Then I would measure latency again.',
      keyIdea: 'Low CPU + high latency → trace where requests wait → check DB queries, pool, and external timeouts → fix the bottleneck before scaling → measure again.',
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
      answer: 'For example, an order service may save an order before a payment service confirms payment. I save the order and an outbox event in one transaction, then publish the event for the payment service. The payment consumer handles duplicates and reports success or failure; on failure, I mark the order canceled or start a refund if needed. The services become consistent over time, so the order status must show that payment is still pending.',
      keyIdea: 'Order saved before payment → commit order and outbox event together → payment consumer handles duplicates → confirm or compensate → show pending status until consistent.',
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
      answer: 'For a protected order API, I first verify the user and check that this order belongs to them, not just that they have a valid token. I validate input and use parameterized queries to prevent unsafe database access. I use HTTPS, keep secrets out of logs, and rate-limit sensitive endpoints such as login. I also review dependencies and log safe request IDs for incident tracing.',
      keyIdea: 'Protected order → verify identity and ownership → validate input and parameterize queries → use HTTPS and safe logs → rate-limit sensitive endpoints.',
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
      answer: 'I would upload the file to object storage, then create a job that points to its location instead of processing it in the API request. A worker reads the file in chunks, saves progress, and updates a status the client can check. If the worker stops, it can resume from a checkpoint without repeating completed chunks. I set file size limits and make each step safe to retry so a bad file does not block the queue.',
      keyIdea: 'Upload large file to object storage → queue a job with its location → process chunks and expose status → checkpoint and retry safely → limit bad files.',
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
