import type { InterviewFollowUp, InterviewQuestion } from './types';

export type { Bilingual, InterviewQuestion } from './types';

export const interviewIntro = {
  company: 'Everfit',
  role: 'Applied AI Backend Engineer',
  subtitle: '20 Interview Questions — Speaking & Reaction Format',
  note: 'Natural B1–B2 speaking version. " / " là chỗ ngắt hơi khi nói. **In đậm** = từ khóa cần nhớ. *In nghiêng* = câu mở đầu chuyển ý.',
};

const rawInterviewQuestions = [
  {
    id: 1,
    question: {
      en: "Can you tell me about your experience with AI-powered backend systems?",
      vi: 'Bạn có thể kể về kinh nghiệm với hệ thống backend tích hợp AI không?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*For me,* / my main background is **backend development**. / I have worked with **Node.js, NestJS, PostgreSQL, REST APIs, background workers, message queues**, / and third-party integrations.",
        vi: "Nền tảng chính của mình là **backend**. Mình đã làm với Node.js, NestJS, PostgreSQL, REST API, background worker, message queue và tích hợp bên thứ ba.",
      },
      {
        id: 'reason',
        en: "*The main reason is that* / in production, an AI feature is not only about calling a model. / The backend still needs to be **reliable, fast, observable**, / and able to recover when something fails.",
        vi: "Lý do là trong production, một tính năng AI không chỉ là gọi model. Backend vẫn phải đáng tin cậy, nhanh, quan sát được và có khả năng phục hồi khi lỗi.",
      },
      {
        id: 'example',
        en: "*For example,* / in my recent project, I have worked more with **OCR, document processing, embeddings, hybrid search, and LLM integration**. / We process documents, create structured content and embeddings, / and use them later for semantic and hybrid retrieval.",
        vi: "Ví dụ, ở dự án gần nhất mình làm nhiều với OCR, xử lý tài liệu, embeddings, hybrid search và tích hợp LLM. Nhóm xử lý tài liệu, tạo nội dung có cấu trúc và embedding rồi dùng cho tìm kiếm ngữ nghĩa/hybrid.",
      },
      {
        id: 'result',
        en: "*Because of that,* / I have experience with both the **AI part** / and the **backend workflow around it**, / including timeout, retry, fallback, data access, latency, and cost.",
        vi: "Vì vậy mình có kinh nghiệm cả phần AI lẫn workflow backend xung quanh: timeout, retry, fallback, truy cập dữ liệu, latency và chi phí.",
      },
      {
        id: 'close',
        en: "*So overall,* / I would describe my strength as combining **strong backend engineering** / with **applied AI in a real production system**.",
        vi: "Tóm lại, thế mạnh của mình là kết hợp backend engineering vững với AI ứng dụng trong hệ thống production thực tế.",
      },
    ] },
    contextIds: ['A'],
    clusterIds: ['observability', 'production-ai'],
    memory: { nodes: [
      { id: 'backend-foundation', label: 'BACKEND FOUNDATION', triggers: ['Node.js / NestJS', 'PostgreSQL', 'workers / queues'], answerSectionId: 'point' },
      { id: 'applied-ai', label: 'APPLIED AI', triggers: ['OCR', 'embeddings', 'hybrid retrieval', 'LLM integration'], answerSectionId: 'example' },
      { id: 'production-reliability', label: 'PRODUCTION RELIABILITY', triggers: ['timeout / retry', 'fallback', 'observability', 'latency / cost'], answerSectionId: 'result' },
    ] }
  },
  {
    id: 2,
    question: {
      en: "Can you describe a RAG or retrieval system you have worked on?",
      vi: 'Bạn có thể mô tả một hệ thống RAG / retrieval mà bạn đã làm không?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*For me,* / I prefer not to rely on only one type of search. / In our system, we combine **lexical search** and **semantic search**.",
        vi: "Mình không thích chỉ dựa vào một loại tìm kiếm. Hệ thống của tụi mình kết hợp lexical search và semantic search.",
      },
      {
        id: 'reason',
        en: "*The main reason is that* / lexical search is good for **exact keywords**, / while semantic search is better for **meaning and similar context**.",
        vi: "Lý do là lexical mạnh với từ khóa chính xác, còn semantic mạnh về nghĩa và ngữ cảnh tương tự.",
      },
      {
        id: 'example',
        en: "*For example,* / the lexical side uses **PostgreSQL full-text search**, / and the semantic side uses **embeddings with pgvector cosine similarity**.",
        vi: "Ví dụ, phía lexical dùng PostgreSQL full-text search, phía semantic dùng embeddings với pgvector cosine similarity.",
      },
      {
        id: 'result',
        en: "*Because of that,* / we combine the two rankings with **Reciprocal Rank Fusion, or RRF**, / so a result that performs well across both searches can move higher in the final ranking.",
        vi: "Vì vậy tụi mình gộp hai bảng xếp hạng bằng Reciprocal Rank Fusion (RRF), kết quả nào tốt ở cả hai sẽ được đẩy lên cao hơn.",
      },
      {
        id: 'close',
        en: "*At the same time,* / we also think about **failure and security**. / If the embedding service is unavailable, / we can fall back to lexical results, / and every search is still limited by the user's access.",
        vi: "Đồng thời phải nghĩ tới lỗi và bảo mật. Nếu embedding service hỏng thì fallback về lexical, và mọi truy vấn vẫn giới hạn theo quyền của user.",
      },
      {
        id: 'extra',
        en: "*So overall,* / the goal is to make retrieval more **balanced, reliable, and safe** / instead of depending on vector search alone.",
        vi: "Tóm lại, mục tiêu là retrieval cân bằng, đáng tin cậy và an toàn hơn — thay vì chỉ dựa vào vector.",
      },
    ] },
    contextIds: ['B'],
    clusterIds: ['rag'],
    storyIds: ['hybrid-rag'],
    memory: { nodes: [{'id': 'retrieval', 'label': 'RETRIEVAL', 'triggers': ['lexical search', 'semantic search'], 'answerSectionId': 'point'}, {'id': 'ranking', 'label': 'RANKING', 'triggers': ['RRF', 'cosine similarity'], 'answerSectionId': 'reason'}, {'id': 'safety', 'label': 'FALLBACK + ACCESS', 'triggers': ['lexical fallback', 'user access'], 'answerSectionId': 'result'}] }
  },
  {
    id: 3,
    question: {
      en: "How do you handle errors in an LLM workflow?",
      vi: 'Bạn xử lý lỗi trong workflow LLM như thế nào?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*For me,* / I do not just blame the **LLM** when something goes wrong. / I check the **whole workflow** to find the real root cause.",
        vi: "Mình không đổ lỗi ngay cho LLM khi có sự cố. Mình soi toàn bộ workflow để tìm nguyên nhân gốc.",
      },
      {
        id: 'reason',
        en: "*The main reason is that* / a bad result can come from **bad input, wrong retrieval, backend logic, prompt construction, the AI provider**, / or the model itself.",
        vi: "Vì kết quả xấu có thể do input sai, retrieval sai, logic backend, cách dựng prompt, provider AI hoặc chính model.",
      },
      {
        id: 'example',
        en: "*For example,* / for **temporary failures** like network errors, timeouts, or some 5xx errors, / I can use a bounded **retry**. / If one model is unavailable, / I may use a **fallback model**. / But for invalid credentials or malformed requests, / I prefer to **fail fast**.",
        vi: "Ví dụ, với lỗi tạm thời (network, timeout, một số 5xx) mình dùng retry có giới hạn. Nếu một model không khả dụng thì fallback sang model khác. Nhưng credential sai hoặc request hỏng thì fail fast luôn.",
      },
      {
        id: 'result',
        en: "*Because of that,* / I first separate **temporary errors from permanent errors** / before deciding whether to retry, fail, or fall back.",
        vi: "Vì vậy mình luôn phân loại lỗi tạm thời vs vĩnh viễn trước khi quyết định retry, fail hay fallback.",
      },
      {
        id: 'close',
        en: "*At the same time,* / I normally track the **request or job ID, model used, latency, retry count, error type, token usage**, / and which workflow step failed.",
        vi: "Đồng thời mình luôn log request/job ID, model, latency, số lần retry, loại lỗi, token và bước nào của workflow đã fail.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I focus on finding the **real root cause**, / using the **right strategy for each error**, / and making the workflow easy to monitor and debug.",
        vi: "Tóm lại, mình tập trung vào nguyên nhân gốc, chọn chiến lược phù hợp cho từng loại lỗi và giữ workflow dễ monitor/debug.",
      },
    ] },
    contextIds: ['C'],
    clusterIds: ['error-handling', 'observability', 'production-ai'],
    storyIds: ['llm-reliability'],
    memory: { nodes: [{'id': 'root-cause', 'label': 'ROOT CAUSE', 'triggers': ['bad input', 'wrong retrieval', 'backend logic', 'provider / model'], 'answerSectionId': 'point'}, {'id': 'error-strategy', 'label': 'ERROR STRATEGY', 'triggers': ['temporary vs permanent', 'retry', 'fallback', 'fail fast'], 'answerSectionId': 'example'}, {'id': 'observability', 'label': 'OBSERVABILITY', 'triggers': ['request / job ID', 'latency', 'token usage', 'error type'], 'answerSectionId': 'result'}] }
  },
  {
    id: 4,
    question: {
      en: "Tell me about a difficult AI-related production problem you solved.",
      vi: 'Kể về một vấn đề production liên quan AI khó mà bạn đã giải quyết.',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*One example was* / a document **OCR workflow** that processed large PDF files in background workers. / With bigger documents, / the **memory usage** became very high / and the worker sometimes crashed.",
        vi: "Ví dụ là workflow OCR xử lý PDF lớn trong background worker. Với tài liệu lớn, memory tăng cao và worker đôi khi crash.",
      },
      {
        id: 'reason',
        en: "*The main reason is that* / reducing the batch size helped for a while, / but it did not explain the real bottleneck. / The heavy **OCR inference was still running on CPU inside the worker**.",
        vi: "Giảm batch size giúp một thời gian nhưng không giải thích được bottleneck thực sự. Vì OCR inference nặng vẫn chạy CPU ngay trong worker.",
      },
      {
        id: 'example',
        en: "*For example,* / I traced the **processing flow** step by step, / added targeted logging, / checked memory before and after expensive OCR stages, / and compared different **batch sizes**.",
        vi: "Mình trace luồng xử lý từng bước, log có mục tiêu, đo memory trước/sau các bước OCR nặng, so sánh nhiều batch size khác nhau.",
      },
      {
        id: 'result',
        en: "*Because of that,* / I confirmed that the main bottleneck was the **OCR CPU inference**. / I first made the CPU path safer with **smaller batches, checkpoints, and recovery logic**.",
        vi: "Nhờ đó xác nhận bottleneck chính là OCR CPU inference. Mình làm cho CPU path an toàn hơn trước bằng batch nhỏ hơn, checkpoint và recovery logic.",
      },
      {
        id: 'close',
        en: "*At the same time,* / I worked with **DevOps** to move the heavy OCR inference / to a separate **GPU-backed service**, / while the worker focused more on orchestration.",
        vi: "Đồng thời mình làm việc với DevOps để tách OCR nặng ra một service chạy GPU riêng, worker chỉ tập trung điều phối.",
      },
      {
        id: 'extra',
        en: "*So overall,* / we reduced **memory pressure**, / made failures easier to recover from, / and created a better architecture for scaling the OCR workload.",
        vi: "Tóm lại, tụi mình giảm áp lực memory, dễ phục hồi khi lỗi và có kiến trúc tốt hơn để scale OCR.",
      },
    ] },
    contextIds: ['D'],
    clusterIds: ['workflow', 'ocr'],
    storyIds: ['ocr-cpu-gpu'],
    memory: { nodes: [{'id': 'incident', 'label': 'INCIDENT', 'triggers': ['large PDF', 'memory pressure', 'worker crash'], 'answerSectionId': 'point'}, {'id': 'bottleneck', 'label': 'BOTTLENECK', 'triggers': ['processing flow', 'CPU OCR inference', 'batch sizes'], 'answerSectionId': 'reason'}, {'id': 'architecture', 'label': 'RECOVERY → GPU', 'triggers': ['smaller batches', 'checkpoints', 'recovery logic', 'GPU-backed service'], 'answerSectionId': 'result'}] }
  },
  {
    id: 5,
    question: {
      en: "How would you design a reliable AI agent workflow?",
      vi: 'Bạn sẽ thiết kế một workflow AI agent đáng tin cậy như thế nào?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*For me,* / I would not put everything into one large **LLM call**. / I would break the workflow into **clear steps**.",
        vi: "Mình sẽ không nhồi tất cả vào một lần gọi LLM lớn. Mình chia workflow thành các bước rõ ràng.",
      },
      {
        id: 'reason',
        en: "*The main reason is that* / clear step boundaries make the system easier to **debug, retry, monitor, and recover** when something fails.",
        vi: "Vì ranh giới bước rõ giúp hệ thống dễ debug, retry, monitor và phục hồi khi có lỗi.",
      },
      {
        id: 'example',
        en: "*For example,* / the flow can be: **understand intent -> retrieve context -> decide whether a tool is needed -> call the tool -> validate the result -> generate the final response**.",
        vi: "Ví dụ luồng có thể là: hiểu ý định → lấy ngữ cảnh → quyết định có cần tool → gọi tool → kiểm tra kết quả → tạo phản hồi cuối.",
      },
      {
        id: 'result',
        en: "*Because of that,* / the **backend** should control tool execution. / It defines the tool contract, validates arguments, checks permissions, / executes the action, / and returns a structured result.",
        vi: "Vì vậy backend nên kiểm soát việc thực thi tool: định nghĩa contract, validate tham số, check permission, thực thi và trả kết quả có cấu trúc.",
      },
      {
        id: 'close',
        en: "*At the same time,* / for longer workflows, I would persist important **state**, / use timeout and bounded retry, / keep external actions **idempotent**, / and track latency, tool errors, token usage, cost, and output quality.",
        vi: "Đồng thời với workflow dài, mình lưu state quan trọng, đặt timeout + retry giới hạn, giữ hành động ngoài idempotent, và theo dõi latency, lỗi tool, token, chi phí, chất lượng output.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I use the **LLM for flexible reasoning**, / but keep important backend actions **deterministic and controlled**.",
        vi: "Tóm lại, dùng LLM để suy luận linh hoạt nhưng giữ các hành động backend quan trọng ở trạng thái xác định và có kiểm soát.",
      },
    ] },
    contextIds: ['E'],
    clusterIds: ['error-handling', 'observability', 'workflow', 'tool-calling', 'production-ai'],
    storyIds: ['llm-reliability'],
    memory: { nodes: [
      { id: 'agent-context', label: 'INTENT → CONTEXT', triggers: ['user goal', 'authorized context', 'relevant data'], answerSectionId: 'point' },
      { id: 'tool-control', label: 'TOOL CONTROL', triggers: ['tool contract', 'validate arguments', 'permission check', 'execute'], answerSectionId: 'result' },
      { id: 'reliability', label: 'RELIABILITY', triggers: ['run IDs', 'timeout / retry', 'eval / regression'], answerSectionId: 'close' },
    ] }
  },
  {
    id: 6,
    question: {
      en: "Have you worked with Temporal before?",
      vi: 'Bạn đã từng làm việc với Temporal chưa?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*No,* / I have not used **Temporal in production**. / But at my company, / we built two systems that solve the same problems. / So I understand the **ideas** well.",
        vi: "Chưa, mình chưa dùng Temporal trong production. Nhưng ở công ty, tụi mình đã xây hai hệ thống giải quyết những vấn đề tương tự. Vì vậy mình hiểu khá rõ các ý tưởng phía sau.",
      },
      {
        id: 'pipeline',
        en: "*The first one is* a **document pipeline**. / It has three steps: / **build, publish, and ingest**. / We save the **job state** in Postgres. / Each job has a status, / like pending, processing, ready, or failed. / The worker sends a **heartbeat** every few seconds. / If a job is stuck, / a cron job marks it as failed. / If it fails for a small reason, / we can **retry** it. / We also use an **outbox pattern**. / This means we save the event in the database first, / then send it later. / So we never lose an event, / even when the worker crashes. / We also have an admin page. / The admin can see all jobs, / filter by step, / and retry any failed job.",
        vi: "Hệ thống đầu tiên là document pipeline. Nó có ba bước: build, publish và ingest. Tụi mình lưu trạng thái job trong Postgres. Mỗi job có trạng thái như pending, processing, ready hoặc failed. Worker gửi heartbeat vài giây một lần. Nếu job bị kẹt, cron job đánh dấu nó là failed. Nếu lỗi nhỏ, tụi mình có thể retry. Tụi mình cũng dùng outbox pattern: lưu event vào database trước rồi gửi sau. Vì vậy event không bị mất kể cả khi worker crash. Tụi mình còn có trang admin để xem tất cả job, lọc theo step và retry job failed.",
      },
      {
        id: 'agent-engine',
        en: "*The second one is* an **AI agent engine**. / This one is more like Temporal. / We write the **workflow in JSON**. / Each run is one process. / We set limits — / max steps, max tool calls, max cost. / So a run cannot loop forever. / We have two **timeouts**: / a soft one, / and a hard one that kills the process. / We support outside events, / like a webhook or a human approval. / We support **sub-jobs** — / one workflow can start another. / Every step is saved as an event. / We have a UI to **replay** / and check what happened.",
        vi: "Hệ thống thứ hai là AI agent engine. Hệ thống này giống Temporal hơn. Tụi mình viết workflow bằng JSON. Mỗi lần chạy là một process. Tụi mình đặt giới hạn về số step, số lần gọi tool và chi phí tối đa, nên process không thể loop vô hạn. Tụi mình có hai timeout: một timeout mềm và một timeout cứng để kill process. Tụi mình hỗ trợ event bên ngoài như webhook hoặc người dùng phê duyệt. Tụi mình hỗ trợ sub-job, nghĩa là một workflow có thể khởi chạy workflow khác. Mỗi step được lưu thành event. Tụi mình có UI để replay và kiểm tra chuyện gì đã xảy ra.",
      },
      {
        id: 'concepts',
        en: "*So I know the main ideas:* / how to **save state**, / how to **retry safely**, / how to handle **timeouts**, / how to add **heartbeats**, / how to receive signals from outside, / and how to run **sub-workflows**.",
        vi: "Vì vậy mình hiểu các ý tưởng chính: lưu state, retry an toàn, xử lý timeout, thêm heartbeat, nhận signal từ bên ngoài và chạy sub-workflow.",
      },
      {
        id: 'gap',
        en: "*What I need to learn* / is the **Temporal library itself**. / The specific API, / the rules to write a workflow, / and how the **replay** works. / I think one or two weeks is enough. / Because I already know why Temporal is designed this way.",
        vi: "Điều mình cần học là chính thư viện Temporal: API cụ thể, các quy tắc để viết workflow và cách replay hoạt động. Mình nghĩ một hoặc hai tuần là đủ, vì mình đã hiểu tại sao Temporal được thiết kế như vậy.",
      },
    ] },
    contextIds: ['F'],
    clusterIds: ['error-handling', 'workflow', 'gap'],
    memory: { nodes: [{ id: 'tool-gap', label: 'TOOL GAP', triggers: ['not used in production', 'Temporal library', 'specific API'], answerSectionId: 'point' }, { id: 'document-pipeline', label: 'DOCUMENT PIPELINE', triggers: ['build / publish / ingest', 'job state', 'heartbeat', 'outbox pattern'], answerSectionId: 'pipeline' }, { id: 'agent-engine', label: 'AI AGENT ENGINE', triggers: ['workflow in JSON', 'limits / timeouts', 'outside events', 'sub-jobs'], answerSectionId: 'agent-engine' }, { id: 'CORE IDEAS', label: 'CORE IDEAS', triggers: ['save state', 'safe retry', 'heartbeats', 'sub-workflows'], answerSectionId: 'concepts' }, { id: 'LEARNING GAP', label: 'LEARNING GAP', triggers: ['Temporal API', 'workflow rules', 'replay'], answerSectionId: 'gap' }] }
  },
  {
    id: 7,
    question: {
      en: "How much experience do you have with AI agents?",
      vi: 'Bạn có bao nhiêu kinh nghiệm với AI agent?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*For me,* / I have not spent several years building fully **autonomous AI agents**. / My recent experience is more focused on **AI-powered backend workflows, retrieval, LLM integration**, / and production reliability.",
        vi: "Mình chưa có nhiều năm xây agent hoàn toàn tự động. Kinh nghiệm gần đây tập trung vào workflow backend có AI, retrieval, tích hợp LLM và độ tin cậy production.",
      },
      {
        id: 'reason',
        en: "*The main reason is that* / many important agent building blocks are already familiar to me.",
        vi: "Nhưng nhiều khối xây dựng quan trọng của agent mình đã quen.",
      },
      {
        id: 'example',
        en: "*For example,* / I have worked with **retrieval, structured LLM input and output, workflow state, tool contracts, retries, logging**, / and failure handling.",
        vi: "Ví dụ, mình đã làm với retrieval, input/output có cấu trúc cho LLM, state workflow, tool contract, retry, log và xử lý lỗi.",
      },
      {
        id: 'result',
        en: "*Because of that,* / I think of an agent as a **controlled workflow**: understand the intent, get the right context, decide whether a tool is needed, / execute it through backend controls, / validate the result, / and then generate the response.",
        vi: "Vì vậy mình xem agent như một workflow có kiểm soát: hiểu ý định → lấy ngữ cảnh đúng → quyết định có cần tool → chạy qua backend có kiểm soát → validate → tạo phản hồi.",
      },
      {
        id: 'close',
        en: "*At the same time,* / my direct agent experience is still growing, / but the **production engineering foundation** behind agent systems is already very familiar to me.",
        vi: "Kinh nghiệm agent trực tiếp còn đang phát triển, nhưng nền tảng production engineering đằng sau agent mình đã rất quen.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I am honest about the gap, / but I am confident I can build on the backend and AI workflow experience I already have.",
        vi: "Tóm lại, mình thẳng thắn về gap nhưng tự tin có thể phát triển tiếp trên nền backend và AI workflow đã có.",
      },
    ] },
    contextIds: ['E'],
    clusterIds: ['tool-calling', 'gap'],
    memory: { nodes: [{ id: 'agent-gap', label: 'HONEST GAP', triggers: ['not fully autonomous agents', 'AI backend workflows'], answerSectionId: 'point' }, { id: 'building-blocks', label: 'BUILDING BLOCKS', triggers: ['retrieval', 'tool contracts', 'workflow state'], answerSectionId: 'example' }, { id: 'controlled-workflow', label: 'CONTROLLED WORKFLOW', triggers: ['intent / context', 'backend controls', 'validate'], answerSectionId: 'result' }, { id: 'foundation', label: 'PRODUCTION FOUNDATION', triggers: ['direct experience growing', 'production engineering'], answerSectionId: 'close' }] }
  },
  {
    id: 8,
    question: {
      en: "Do you have experience with LLM evals?",
      vi: 'Bạn có kinh nghiệm với LLM evals không?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*For me,* / yes, I have **hands-on experience with AI evaluation and quality regression**, / although I did not build the whole **LLM eval platform** from scratch.",
        vi: "**Với tôi,** / có, tôi có **kinh nghiệm thực tế với việc đánh giá AI và kiểm tra chất lượng hồi quy**, / mặc dù tôi không xây toàn bộ **nền tảng LLM eval** từ đầu.",
      },
      {
        id: 'reason',
        en: "*The main reason is that* / in production AI, / I want to know whether a change actually makes the system **better or worse**, / not just whether the code still runs.",
        vi: "**Lý do chính là** / trong hệ thống AI chạy thật, / tôi muốn biết một thay đổi có thực sự làm hệ thống **tốt hơn hay tệ đi**, / chứ không chỉ kiểm tra xem code còn chạy hay không.",
      },
      {
        id: 'example',
        en: "*For example,* / in our document AI work, / we used **offline benchmarks** to compare OCR and document-processing approaches / using quality and performance signals. / The benchmark helped us find problems such as **PHI leakage** / and improve the pipeline.",
        vi: "**Ví dụ,** / trong phần document AI, / chúng tôi dùng **offline benchmark** để so sánh các hướng OCR và document-processing khác nhau / dựa trên các tín hiệu về chất lượng và hiệu năng. / Benchmark giúp phát hiện các vấn đề như **rò rỉ PHI** / và từ đó cải thiện pipeline.",
      },
      {
        id: 'result',
        en: "*At the same time,* / my direct work was more on **retrieval and grounding quality**. / I worked on hybrid retrieval using **BM25, vector search, and RRF**, / with regression tests for **ranking, fallback behavior, and permission isolation**.",
        vi: "**Đồng thời,** / phần tôi trực tiếp làm nhiều hơn là **chất lượng retrieval và grounding**. / Tôi làm hybrid retrieval bằng **BM25, vector search và RRF**, / cùng với các regression test cho **ranking, fallback behavior và permission isolation**.",
      },
      {
        id: 'close',
        en: "*I also worked on* **citation and provenance correctness**, / including the document, page, text span, and bounding-box information, / so the answer can be traced back to the real source.",
        vi: "**Tôi cũng làm về** **độ chính xác của citation và provenance**, / bao gồm document, page, text span và bounding-box information, / để câu trả lời có thể truy ngược về đúng nguồn thật.",
      },
      {
        id: 'extra',
        en: "*The wider StrangeLoop platform also has* a formal **Test Bench**, / where agent test cases can be evaluated using **expected outputs or an LLM judge with a rubric**. / I understand how that system works from the source, / although I did not build the Test Bench itself.",
        vi: "**Ngoài ra, StrangeLoop cũng có** một **Test Bench** chính thức, / nơi các agent test case có thể được đánh giá bằng **expected output hoặc LLM judge với rubric**. / Tôi hiểu cách hệ thống này hoạt động ở mức source code, / nhưng tôi không phải người xây Test Bench từ đầu.",
      },
      {
        id: 'final',
        en: "*So overall,* / I would say I have practical experience with **AI evaluation and regression**, / especially around **retrieval, grounding, and document AI**, / and I am also familiar with formal **LLM and agent eval systems**.",
        vi: "**Tóm lại,** / tôi có kinh nghiệm thực tế với **AI evaluation và regression**, / đặc biệt ở **retrieval, grounding và document AI**, / và tôi cũng quen với các hệ thống **LLM/agent eval** chính thức.",
      },
    ] },
    contextIds: ['G'],
    clusterIds: ['observability', 'quality', 'production-ai', 'gap'],
    memory: { nodes: [
      { id: 'hands-on-eval', label: 'AI EVAL HANDS-ON', triggers: ['hands-on experience', 'quality regression', 'not platform owner'], answerSectionId: 'point' },
      { id: 'benchmark-phi', label: 'BENCHMARK + PHI', triggers: ['offline benchmark', 'OCR / document AI', 'PHI leakage'], answerSectionId: 'example' },
      { id: 'retrieval-grounding', label: 'RETRIEVAL + GROUNDING', triggers: ['BM25 / vector / RRF', 'ranking / fallback', 'citation / provenance'], answerSectionId: 'result' },
      { id: 'test-bench', label: 'TEST BENCH', triggers: ['expected outputs', 'LLM judge', 'rubric', 'not built from scratch'], answerSectionId: 'extra' },
      { id: 'eval-summary', label: 'HONEST SUMMARY', triggers: ['AI evaluation', 'retrieval / grounding', 'formal LLM and agent eval'], answerSectionId: 'final' },
    ] }
  },
  {
    id: 9,
    question: {
      en: "You have more backend experience than AI experience. Why should we hire you for a 70% AI role?",
      vi: 'Bạn có nhiều kinh nghiệm backend hơn AI. Tại sao nên tuyển bạn cho vị trí 70% AI?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*For me,* / that is true. / My strongest foundation is **backend engineering**.",
        vi: "Điều đó đúng. Nền tảng mạnh nhất của mình là backend engineering.",
      },
      {
        id: 'reason',
        en: "*The main reason is that* / in production, an AI feature is not only the model. / It still needs **data pipelines, retrieval, APIs, queues, state management, retries, monitoring, security**, / and infrastructure.",
        vi: "Nhưng trong production, tính năng AI không chỉ là model. Nó cần pipeline dữ liệu, retrieval, API, queue, state, retry, monitoring, bảo mật và hạ tầng.",
      },
      {
        id: 'example',
        en: "*For example,* / those are areas where I already have strong hands-on experience / from building and operating production backend systems.",
        vi: "Đó là những mảng mình đã có kinh nghiệm thực chiến từ việc xây và vận hành backend production.",
      },
      {
        id: 'result',
        en: "*Because of that,* / I can focus on growing deeper in AI / without starting again from zero on the production engineering side.",
        vi: "Vì vậy mình có thể tập trung phát triển sâu về AI mà không phải bắt đầu lại từ đầu ở mảng engineering production.",
      },
      {
        id: 'close',
        en: "*At the same time,* / recently I have been working more with **OCR, embeddings, hybrid retrieval, LLM integration, model reliability**, / and **GPU inference**.",
        vi: "Gần đây mình đã làm nhiều hơn với OCR, embeddings, hybrid retrieval, tích hợp LLM, độ tin cậy model và GPU inference.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I see myself as building stronger **AI capability** / on top of a solid **production backend foundation**.",
        vi: "Tóm lại, mình đang xây dựng năng lực AI mạnh hơn trên nền backend production vững chắc.",
      },
    ] },
    contextIds: ['A'],
    clusterIds: [],
    memory: { nodes: [{ id: 'backend-foundation', label: 'BACKEND FOUNDATION', triggers: ['backend engineering', 'production systems'], answerSectionId: 'point' }, { id: 'production-ai', label: 'PRODUCTION AI', triggers: ['data pipelines', 'retrieval / APIs', 'security'], answerSectionId: 'reason' }, { id: 'ai-growth', label: 'AI GROWTH', triggers: ['OCR', 'embeddings', 'LLM integration', 'GPU inference'], answerSectionId: 'close' }, { id: 'stronger-ai', label: 'STRONGER AI', triggers: ['AI capability', 'backend foundation'], answerSectionId: 'extra' }] }
  },
  {
    id: 10,
    question: {
      en: "Do you have strong experience with tool calling?",
      vi: 'Bạn có kinh nghiệm sâu về tool calling không?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*For me,* / yes, I have **hands-on experience with tool calling**, / especially on the **backend control side**.",
        vi: "**Với tôi,** / có, tôi có **kinh nghiệm thực tế với tool calling**, / đặc biệt ở phần **backend control**.",
      },
      {
        id: 'reason',
        en: "*For example,* / in Clincove, / the model can use read-only tools like **search and document read**.",
        vi: "**Ví dụ,** / trong Clincove, / model có thể dùng các tool read-only như **search và document read**.",
      },
      {
        id: 'example',
        en: "*The key point is that* / the model can choose the tool, / but the **backend checks permission and scope** / before executing anything.",
        vi: "**Điểm quan trọng là** / model có thể chọn tool, / nhưng **backend sẽ kiểm tra permission và scope** / trước khi thực thi bất kỳ thứ gì.",
      },
      {
        id: 'result',
        en: "*Another important point is that* / we design the tool interface in a **familiar way for the LLM**, / like a **file system with search and read**, / because this usually helps the model perform better.",
        vi: "**Một điểm quan trọng khác là** / chúng tôi thiết kế tool interface theo cách **quen thuộc với LLM**, / giống như **file system có search và read**, / vì cách này thường giúp model hoạt động tốt hơn.",
      },
      {
        id: 'close',
        en: "*At the same time,* / I also worked on **tool safety and tracking**, / such as **audit logs, tracing, citations**, / and final-response validation.",
        vi: "**Đồng thời,** / tôi cũng làm về **tool safety và tracking**, / như **audit logs, tracing, citations**, / và kiểm tra final response.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I directly worked on the **Clincove tool-calling flow**, / and I also understand and can modify parts of the **StrangeLoop engine** when needed.",
        vi: "**Tóm lại,** / tôi trực tiếp làm trên **Clincove tool-calling flow**, / và tôi cũng hiểu, có thể sửa một số phần của **StrangeLoop engine** khi cần.",
      },
    ] },
    contextIds: ['E', 'H'],
    clusterIds: ['tool-calling', 'tool-safety'],
    memory: { nodes: [
      { id: 'hands-on', label: 'HANDS-ON TOOLING', triggers: ['tool calling', 'backend control'], answerSectionId: 'point' },
        { id: 'search-read', label: 'SEARCH + READ', triggers: ['Clincove', 'read-only tools', 'search / document read'], answerSectionId: 'reason' },
        { id: 'BACKEND-CONTROL', label: 'BACKEND CONTROL', triggers: ['choose tool', 'permission and scope', 'before execution'], answerSectionId: 'example' },
        { id: 'FAMILIAR-INTERFACE', label: 'FAMILIAR INTERFACE', triggers: ['LLM-friendly', 'file system', 'search and read'], answerSectionId: 'result' },
        { id: 'SAFETY-TRACKING', label: 'SAFETY + TRACKING', triggers: ['audit logs', 'tracing', 'citations', 'final validation'], answerSectionId: 'close' },
        { id: 'ENGINE', label: 'UNDERSTAND ENGINE', triggers: ['Clincove flow', 'StrangeLoop engine', 'modify when needed'], answerSectionId: 'extra' },
    ] }
  },
  {
    id: 11,
    question: {
      en: "You haven't used our exact AI stack. How quickly can you adapt?",
      vi: 'Bạn chưa dùng đúng stack AI của tụi mình. Bạn thích nghi nhanh cỡ nào?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*For me,* / I normally learn a new technology by connecting it to **engineering problems I already understand**.",
        vi: "Mình học công nghệ mới bằng cách kết nối nó với các vấn đề engineering mình đã hiểu.",
      },
      {
        id: 'reason',
        en: "*The main reason is that* / the framework may change, / but many of the underlying problems stay the same.",
        vi: "Vì framework có thể thay đổi nhưng nhiều vấn đề nền tảng bên dưới thì không đổi.",
      },
      {
        id: 'example',
        en: "*For example,* / when I study **Temporal**, I connect it to retries, checkpoints, durable state, / and long-running workflows that I have already worked with.",
        vi: "Ví dụ khi học Temporal, mình liên hệ với retry, checkpoint, state bền vững và workflow chạy lâu mà mình đã làm.",
      },
      {
        id: 'result',
        en: "*Because of that,* / this is also how I moved from traditional backend work into **OCR, embeddings, retrieval, LLM integration**, / and GPU-based inference.",
        vi: "Đây cũng là cách mình chuyển từ backend truyền thống sang OCR, embeddings, retrieval, tích hợp LLM và GPU inference.",
      },
      {
        id: 'close',
        en: "*At the same time,* / I know every new stack still has its own **abstractions, APIs, and best practices** / that I need to learn.",
        vi: "Đồng thời mỗi stack mới vẫn có abstraction, API và best practice riêng mình cần học.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I usually do not need to relearn the engineering fundamentals. / I mainly need to learn the new tool, / so I am confident I can adapt relatively quickly.",
        vi: "Tóm lại, mình không phải học lại kiến thức engineering nền tảng, chỉ cần học tool mới, nên tự tin thích nghi khá nhanh.",
      },
    ] },
    contextIds: ['A', 'I'],
    clusterIds: ['workflow', 'gap'],
    memory: { nodes: [{ id: 'learn-by-problems', label: 'LEARN BY PROBLEMS', triggers: ['engineering problems', 'underlying problems'], answerSectionId: 'point' }, { id: 'temporal-bridge', label: 'TEMPORAL BRIDGE', triggers: ['retries', 'checkpoints', 'durable state'], answerSectionId: 'example' }, { id: 'ai-transition', label: 'AI TRANSITION', triggers: ['OCR', 'retrieval', 'LLM integration'], answerSectionId: 'result' }, { id: 'adapt', label: 'ADAPT QUICKLY', triggers: ['new abstractions', 'learn the tool'], answerSectionId: 'extra' }] }
  },
  {
    id: 12,
    question: {
      en: "How would you design an AI agent system for Everfit?",
      vi: 'Bạn sẽ thiết kế hệ thống AI agent cho Everfit ra sao?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "For me, / I would start with the user goal / and keep the agent inside a clear workflow.",
        vi: "Mình bắt đầu từ mục tiêu user và định nghĩa rõ agent được phép làm gì, truy cập data nào.",
      },
      {
        id: 'reason',
        en: "The main reason is that / I would not send the whole database to the model. / I would only retrieve the relevant and authorized context for that user.",
        vi: "Vì mình không muốn nhét cả database vào prompt. Chỉ lấy context liên quan và được phép cho từng user.",
      },
      {
        id: 'example',
        en: "For example, / if a user asks about training progress, / the agent may need the user profile, recent workouts, goals, and progress metrics.",
        vi: "Ví dụ nếu user hỏi tiến độ tập hay kế hoạch cá nhân hoá, agent có thể lấy profile, lịch sử tập, mục tiêu và context được phép.",
      },
      {
        id: 'result',
        en: "Because of that, / I would expose a small set of backend tools. / The model can decide which tool it needs, / but the backend still defines the tool contract, validates the arguments, checks permission, executes the action, / and returns a structured result.",
        vi: "Vì vậy mình sẽ expose các backend tool rõ ràng để lấy lịch sử tập, đọc metric, tạo draft plan… Backend vẫn validate tham số và permission trước khi thực thi.",
      },
      {
        id: 'close',
        en: "This is similar to what I worked with in Clincove, / where the agent could search and read documents through controlled backend tools, / while the backend kept control of the access scope and permissions.",
        vi: "Đồng thời lưu state workflow quan trọng, trace tool call, dùng timeout + retry cho service ngoài và có eval cho use case phổ biến/edge case.",
      },
      {
        id: 'extra',
        en: "At the same time, / I would track run IDs, tool calls, latency, and errors, / and use retry and recovery where needed. / I would also add regression and eval cases for important workflows.",
        vi: "Tóm lại, mình thiết kế như một workflow AI có kiểm soát: đúng context, chạy tool an toàn, đủ độ tin cậy và đánh giá xung quanh.",
      },
      {
        id: 'section-7',
        en: "So overall, / the model can make decisions, / but the backend stays in control of data, permissions, execution, and reliability.",
        vi: "",
      },
    ] },
    contextIds: ['E'],
    clusterIds: ['tool-calling'],
    memory: { nodes: [{ id: 'goal-context', label: 'GOAL → CONTEXT', triggers: ['user goal', 'authorized context'], answerSectionId: 'point' }, { id: 'backend-tools', label: 'BACKEND TOOLS', triggers: ['tool contract', 'permission', 'structured result'], answerSectionId: 'result' }, { id: 'reliability', label: 'RELIABILITY', triggers: ['run IDs', 'retry / recovery', 'regression'], answerSectionId: 'extra' }, { id: 'backend-control', label: 'BACKEND CONTROL', triggers: ['data', 'permissions', 'execution'], answerSectionId: 'section-7' }] }
  },
  {
    id: 13,
    question: {
      en: "How do you control latency and cost in an LLM system?",
      vi: 'Bạn kiểm soát latency và chi phí trong hệ thống LLM thế nào?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "For me, / I try to control latency and cost in several layers.",
        vi: "Đầu tiên mình cố giảm công việc LLM không cần thiết.",
      },
      {
        id: 'reason',
        en: "The main reason is that / every extra model call, extra token, or unnecessary retry / can make the system slower and more expensive.",
        vi: "Vì mỗi lần gọi model và mỗi token thừa đều làm tăng cả latency lẫn chi phí.",
      },
      {
        id: 'example',
        en: "For example, / I use normal backend logic, filtering, and retrieval / instead of asking the model to do everything. / In Clincove, / I also worked with prompt caching / so we could reuse stable context / instead of processing the same context again.",
        vi: "Ví dụ, một số quyết định có thể dùng logic backend, caching hoặc data đã tính sẵn thay vì gọi model. Mình cũng kiểm soát kích thước context.",
      },
      {
        id: 'result',
        en: "Because of that, / I also try to keep the context small / and retrieve only the relevant and authorized data / instead of sending everything to the model.",
        vi: "Vì vậy mình chọn model theo task chứ không luôn dùng cái đắt nhất. Các call độc lập chạy song song khi an toàn, có timeout và retry giới hạn.",
      },
      {
        id: 'close',
        en: "At the same time, / I use timeouts and bounded retries. / I only retry temporary errors like timeouts, rate limits, or provider overload, / and I avoid retrying permanent errors.",
        vi: "Đồng thời theo dõi latency, token, số retry, model dùng và error rate theo từng workflow/operation.",
      },
      {
        id: 'extra',
        en: "For longer workflows, / I also use checkpoint and recovery, / so if one part fails, / we can continue from the completed part / instead of running the whole job again.",
        vi: "Tóm lại, mình tối ưu dựa trên dữ liệu production thật thay vì đoán phần nào chậm/tốn.",
      },
      {
        id: 'section-7',
        en: "So overall, / I track the model used, token usage, retry attempts, latency, and estimated cost, / and use that real data / to decide what to optimize next.",
        vi: "",
      },
      {
        id: 'section-8',
        en: "Flow nhớ nhanh:",
        vi: "",
      },
      {
        id: 'section-9',
        en: "reduce AI work → cache → smaller context → timeout/retry → checkpoint → measure",
        vi: "",
      },
      {
        id: 'section-10',
        en: "Điểm mạnh nhất của bản này là gần như mọi ý chính đều có hands-on evidence thật của anh, chứ không chỉ là best practice chung.",
        vi: "",
      },
    ] },
    contextIds: ['C'],
    clusterIds: ['error-handling', 'observability', 'production-ai'],
    storyIds: ['llm-reliability'],
    memory: { nodes: [
      { id: 'reduce-work', label: 'REDUCE AI WORK', triggers: ['backend logic', 'filtering', 'retrieval'], answerSectionId: 'point' },
      { id: 'cache-context', label: 'CACHE + CONTEXT', triggers: ['prompt cache', 'smaller context', 'authorized data'], answerSectionId: 'example' },
      { id: 'measure-recover', label: 'RECOVER + MEASURE', triggers: ['timeout / retry', 'checkpoint', 'latency / cost'], answerSectionId: 'close' },
    ] }
  },
  {
    id: 14,
    question: {
      en: "How do you prevent hallucination?",
      vi: 'Bạn phòng ngừa hallucination bằng cách nào?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*For me,* / the first step is to give the model the **right and limited context**.",
        vi: "Bước đầu tiên là đưa cho model context đúng và giới hạn.",
      },
      {
        id: 'reason',
        en: "*The main reason is that* / if the context is wrong, / even a strong model can give a very confident **wrong answer**.",
        vi: "Vì nếu context sai, model mạnh vẫn có thể trả lời sai với vẻ rất tự tin.",
      },
      {
        id: 'example',
        en: "*For example,* / for knowledge-based questions, I prefer good **retrieval** and relevant evidence / instead of asking the model to depend only on general memory.",
        vi: "Ví dụ với câu hỏi kiến thức, mình dùng retrieval tốt và evidence liên quan thay vì để model dựa vào trí nhớ chung.",
      },
      {
        id: 'result',
        en: "*Because of that,* / for machine-consumed output, I prefer **structured formats and backend validation**. / If the model suggests an action that affects data, / the backend should still enforce the business rules.",
        vi: "Với output cho máy đọc, mình dùng format có cấu trúc và validate ở backend. Nếu model đề xuất hành động ảnh hưởng data, backend vẫn phải enforce business rule.",
      },
      {
        id: 'close',
        en: "*At the same time,* / I would use **eval cases** for common and risky scenarios. / For high-risk actions, I would rather ask for clarification, require confirmation, / or use a deterministic fallback / than let the model guess.",
        vi: "Đồng thời có eval cho các case phổ biến và rủi ro cao. Với hành động rủi ro cao mình thà hỏi lại, yêu cầu xác nhận hoặc dùng fallback xác định còn hơn để model đoán.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I do not think hallucination can be completely removed, / but we can **reduce and control the risk** with better context, validation, evals, and safe fallback.",
        vi: "Tóm lại, không thể loại bỏ hoàn toàn hallucination, nhưng có thể giảm và kiểm soát bằng context tốt hơn, validation, eval và fallback an toàn.",
      },
    ] },
    contextIds: ['C', 'G'],
    clusterIds: ['observability', 'quality', 'production-ai'],
    storyIds: ['llm-reliability'],
    memory: { nodes: [
      { id: 'retrieval-quality', label: 'RETRIEVAL QUALITY', triggers: ['relevant document', 'ranking', 'test set'], answerSectionId: 'example' },
      { id: 'answer-quality', label: 'ANSWER QUALITY', triggers: ['correctness', 'groundedness', 'unsupported claims'], answerSectionId: 'result' },
      { id: 'production-metrics', label: 'PRODUCTION METRICS', triggers: ['latency', 'token cost', 'fallback rate', 'regression'], answerSectionId: 'close' },
    ] }
  },
  {
    id: 15,
    question: {
      en: "How do you evaluate whether a RAG system is good?",
      vi: 'Bạn đánh giá một hệ thống RAG tốt hay không như thế nào?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*For me,* / I separate **retrieval behavior**, **answer grounding**, / and **runtime behavior**.",
        vi: "**Với tôi,** / tôi tách việc đánh giá thành **retrieval behavior**, **answer grounding**, / và **runtime behavior**.",
      },
      {
        id: 'reason',
        en: "*The main reason is that* / a good final answer depends on getting the **right evidence** first.",
        vi: "**Lý do chính là** / một câu trả lời tốt phụ thuộc trước hết vào việc lấy được **đúng evidence**.",
      },
      {
        id: 'example',
        en: "*For example,* / in Clincove, I implemented and tested **hybrid retrieval** with PostgreSQL full-text search, **pgvector**, and **RRF**. / I tested things like **ranking, scope isolation, fallback behavior**, / and whether the nearest vector result was returned correctly.",
        vi: "**Ví dụ,** / trong Clincove, tôi trực tiếp implement và test **hybrid retrieval** với PostgreSQL full-text search, **pgvector**, và **RRF**. / Tôi test các phần như **ranking, scope isolation, fallback behavior**, / và kiểm tra liệu kết quả vector gần nhất có được trả về đúng hay không.",
      },
      {
        id: 'result',
        en: "*After that,* / I also check the **provenance and citations**. / The citation should point to a real **document, page, text span, or bounding box**, / and unresolved citations should not be invented.",
        vi: "**Sau đó,** / tôi cũng kiểm tra **provenance và citation**. / Citation phải trỏ về đúng **document, page, text span hoặc bounding box**, / và nếu citation không resolve được thì hệ thống không được tự bịa ra.",
      },
      {
        id: 'close',
        en: "*At the same time,* / I also look at runtime signals such as **search latency, empty results, embedding failures**, / and whether the system falls back to lexical search when needed.",
        vi: "**Đồng thời,** / tôi cũng xem các tín hiệu runtime như **search latency, empty results, embedding failures**, / và liệu hệ thống có fallback sang lexical search khi cần hay không.",
      },
      {
        id: 'extra',
        en: "*So overall,* / my direct experience is mainly with **retrieval regression, grounding, and runtime behavior**. / For a more formal RAG evaluation, / I would add a **stable labeled dataset** and metrics like **Recall@K or MRR**.",
        vi: "**Tóm lại,** / kinh nghiệm trực tiếp của tôi mạnh nhất ở **retrieval regression, grounding và runtime behavior**. / Nếu làm formal RAG evaluation đầy đủ hơn, / tôi sẽ thêm một **stable labeled dataset** và các metric như **Recall@K hoặc MRR**.",
      },
    ] },
    contextIds: ['B', 'G'],
    clusterIds: ['rag', 'quality', 'production-ai'],
    storyIds: ['hybrid-rag'],
    memory: { nodes: [
      { id: 'rag-layers', label: 'RAG LAYERS', triggers: ['retrieval behavior', 'answer grounding', 'runtime behavior'], answerSectionId: 'point' },
      { id: 'RIGHT-EVIDENCE', label: 'RIGHT EVIDENCE', triggers: ['good final answer', 'correct evidence first'], answerSectionId: 'reason' },
      { id: 'RETRIEVAL-REGRESSION', label: 'RETRIEVAL REGRESSION', triggers: ['Clincove', 'BM25 / pgvector / RRF', 'ranking / scope / fallback'], answerSectionId: 'example' },
      { id: 'CITATION', label: 'CITATION + PROVENANCE', triggers: ['document / page', 'text span / bounding box', 'no invented citations'], answerSectionId: 'result' },
      { id: 'RUNTIME', label: 'RUNTIME SIGNALS', triggers: ['search latency', 'empty results', 'embedding failures', 'lexical fallback'], answerSectionId: 'close' },
      { id: 'FORMAL-EVAL', label: 'FORMAL EVAL', triggers: ['stable labeled dataset', 'Recall@K', 'MRR'], answerSectionId: 'extra' },
    ] }
  },
  {
    id: 16,
    question: {
      en: "How do you secure an AI agent that can call tools?",
      vi: 'Bạn bảo mật một AI agent có thể gọi tool ra sao?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*For me,* / I would start with **least privilege** / and only expose the tools the agent actually needs.",
        vi: "Mình bắt đầu bằng least privilege — chỉ expose các tool agent thực sự cần.",
      },
      {
        id: 'reason',
        en: "*The main reason is that* / the model should never have unlimited access to **internal services or databases**.",
        vi: "Vì model không nên có quyền truy cập không giới hạn vào service nội bộ hay database.",
      },
      {
        id: 'example',
        en: "*For example,* / each tool should have a clear **schema and limited responsibility**. / Before execution, the backend validates the arguments / and checks the user's **permission** through the normal authorization layer.",
        vi: "Ví dụ, mỗi tool có schema rõ và trách nhiệm giới hạn. Trước khi chạy, backend validate tham số và check permission của user qua lớp authorization thông thường.",
      },
      {
        id: 'result',
        en: "*Because of that,* / sensitive data should be minimized, / and important or destructive actions may need **explicit user confirmation**.",
        vi: "Vì vậy phải giảm thiểu dữ liệu nhạy cảm, và các hành động quan trọng/phá huỷ có thể cần user xác nhận rõ ràng.",
      },
      {
        id: 'close',
        en: "*At the same time,* / I would log tool calls and results with **correlation IDs** while avoiding sensitive data in logs. / For write operations, I would use **idempotency** / so retries cannot accidentally duplicate an action.",
        vi: "Đồng thời log tool call và kết quả kèm correlation ID nhưng tránh log dữ liệu nhạy cảm. Với operation ghi, dùng idempotency để retry không vô tình lặp hành động.",
      },
      {
        id: 'extra',
        en: "*So overall,* / the model can suggest an action, / but the **backend controls access, validation, execution, and audit**.",
        vi: "Tóm lại, model có thể đề xuất hành động nhưng backend kiểm soát truy cập, validate, thực thi và audit.",
      },
    ] },
    contextIds: ['H'],
    clusterIds: ['tool-calling', 'tool-safety'],
    memory: { nodes: [{ id: 'least-privilege', label: 'LEAST PRIVILEGE', triggers: ['only needed tools', 'limited access'], answerSectionId: 'point' }, { id: 'validate-authorize', label: 'VALIDATE + AUTHORIZE', triggers: ['schema', 'arguments', 'permission'], answerSectionId: 'example' }, { id: 'confirm-sensitive', label: 'CONFIRM SENSITIVE', triggers: ['sensitive data', 'destructive actions', 'confirmation'], answerSectionId: 'result' }, { id: 'audit-idempotency', label: 'AUDIT + IDEMPOTENCY', triggers: ['correlation IDs', 'avoid sensitive logs', 'idempotency'], answerSectionId: 'close' }, { id: 'backend-controls', label: 'BACKEND CONTROLS', triggers: ['access', 'validation', 'execution', 'audit'], answerSectionId: 'extra' }] }
  },
  {
    id: 17,
    question: {
      en: "Tell me about a production incident you owned end-to-end.",
      vi: 'Kể về một sự cố production mà bạn đã own từ đầu đến cuối.',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*One example was* / a production issue with **large PDF processing jobs**. / During **OCR**, / the **memory usage** kept increasing, / and eventually the worker crashed.",
        vi: "Một ví dụ là sự cố production với job xử lý PDF lớn. Trong lúc OCR, memory tăng liên tục và cuối cùng worker crash.",
      },
      {
        id: 'reason',
        en: "*The main reason is that* / I did not want to assume the **worker itself** was the real problem. / I wanted to find the **root cause** first.",
        vi: "Mình không muốn giả định worker là nguyên nhân. Mình muốn tìm root cause trước.",
      },
      {
        id: 'example',
        en: "*For example,* / I traced the **processing flow**, / added **targeted logging**, / checked the memory usage at important steps, / and tested different **batch sizes**. / From that, / I found that the main bottleneck was the **OCR CPU inference**.",
        vi: "Mình trace luồng xử lý, thêm log có mục tiêu, đo memory tại các bước quan trọng và thử nhiều batch size. Từ đó xác định bottleneck chính là OCR CPU inference.",
      },
      {
        id: 'result',
        en: "*Because of that,* / I first made the current flow more stable / by using **smaller batches** and adding **checkpoint and recovery logic**, / so if one step failed, / we did not need to restart the whole job.",
        vi: "Vì vậy mình làm cho luồng hiện tại ổn định hơn trước bằng batch nhỏ hơn, checkpoint và recovery logic — bước nào lỗi cũng không phải chạy lại toàn bộ job.",
      },
      {
        id: 'close',
        en: "*At the same time,* / I handled the **backend and workflow side** / and worked with **DevOps** to move the heavy OCR inference / to a **remote GPU service**.",
        vi: "Đồng thời mình xử lý phần backend/workflow và phối hợp DevOps để đưa OCR nặng sang một GPU service tách riêng.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I did not only focus on stopping the crash. / I also checked **worker stability, memory usage, job completion, and processing time** / to make sure the new solution was **stable, observable, and safe to roll out**.",
        vi: "Tóm lại, mình không chỉ dừng crash — còn kiểm ổn định worker, memory, tỉ lệ job hoàn tất và thời gian xử lý để đảm bảo giải pháp mới ổn định, quan sát được và an toàn khi roll out.",
      },
    ] },
    contextIds: ['D'],
    clusterIds: ['ocr'],
    memory: { nodes: [{ id: 'incident', label: 'OCR INCIDENT', triggers: ['large PDFs', 'memory growth', 'worker crash'], answerSectionId: 'point' }, { id: 'root-cause', label: 'ROOT CAUSE', triggers: ['trace flow', 'targeted logging', 'batch sizes'], answerSectionId: 'example' }, { id: 'stabilize', label: 'STABILIZE', triggers: ['smaller batches', 'checkpoint', 'recovery'], answerSectionId: 'result' }, { id: 'gpu-service', label: 'GPU SERVICE', triggers: ['DevOps', 'remote GPU', 'backend workflow'], answerSectionId: 'close' }, { id: 'safe-rollout', label: 'SAFE ROLLOUT', triggers: ['worker stability', 'job completion', 'processing time'], answerSectionId: 'extra' }] }
  },
  {
    id: 18,
    question: {
      en: "How do you design an async workflow that may run for several minutes?",
      vi: 'Bạn thiết kế async workflow có thể chạy vài phút ra sao?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*For me,* / I would not keep an **HTTP request open** / for a job that may run for several minutes.",
        vi: "Mình không giữ HTTP request mở cho một job chạy nhiều phút.",
      },
      {
        id: 'reason',
        en: "*The main reason is that* / long-running work can take time or fail, / so I prefer to create a **job**, / save its **state**, / put the work into a **queue**, / and return a **job ID** to the client.",
        vi: "Vì việc chạy lâu có thể tốn thời gian hoặc fail, nên mình tạo job, lưu state, đẩy vào queue và trả về job ID cho client.",
      },
      {
        id: 'example',
        en: "*For example,* / a **worker** can process the job in the background. / For a multi-step workflow, / I save the **result of each important step** / and use **checkpoints**, / so if one step fails, / I do not need to restart the whole workflow.",
        vi: "Ví dụ, worker xử lý job trong background. Với workflow nhiều bước, mình lưu kết quả của từng bước quan trọng và dùng checkpoint — nếu bước nào lỗi cũng không phải chạy lại toàn bộ.",
      },
      {
        id: 'result',
        en: "*Because of that,* / I can clearly separate **temporary errors from permanent errors**, / add **retries** for temporary failures, / and keep external actions **idempotent**.",
        vi: "Vì vậy mình tách rõ lỗi tạm thời vs vĩnh viễn, retry lỗi tạm thời và giữ hành động ngoài idempotent.",
      },
      {
        id: 'close',
        en: "*At the same time,* / I also keep the **job status** clear, / for example **queued, running, completed, or failed**, / so it is easier to monitor and debug.",
        vi: "Đồng thời trạng thái job phải rõ (queued, running, completed, failed) để dễ monitor/debug.",
      },
      {
        id: 'extra',
        en: "*So overall,* / for a more complex workflow, / I may use something like **Temporal** / because it helps manage **workflow state, retries, timers, and recovery**.",
        vi: "Tóm lại, với workflow phức tạp hơn, mình có thể dùng Temporal vì nó giúp quản lý state, retry, timer và recovery.",
      },
    ] },
    contextIds: ['F'],
    clusterIds: ['error-handling', 'workflow', 'observability'],
    memory: { nodes: [{'id': 'async-job', 'label': 'ASYNC JOB', 'triggers': ['job ID', 'queue', 'worker'], 'answerSectionId': 'point'}, {'id': 'durable-state', 'label': 'STATE + CHECKPOINT', 'triggers': ['job state', 'result of each step', 'checkpoint'], 'answerSectionId': 'example'}, {'id': 'recovery', 'label': 'RECOVERY', 'triggers': ['retry', 'idempotent', 'Temporal'], 'answerSectionId': 'result'}] }
  },
  {
    id: 19,
    question: {
      en: "Tell me about a technical decision you disagreed with.",
      vi: 'Kể về một quyết định kỹ thuật mà bạn không đồng tình.',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*For me,* / when I disagree with a **technical decision**, / I first try to understand **why the team chose it**.",
        vi: "Khi mình không đồng tình một quyết định kỹ thuật, mình luôn tìm hiểu vì sao team chọn nó trước.",
      },
      {
        id: 'reason',
        en: "*The main reason is that* / sometimes the decision is not only about technology. / It can also be about **delivery time, risk, existing architecture, or business priority**.",
        vi: "Vì đôi khi quyết định không chỉ về công nghệ — còn về deadline, rủi ro, kiến trúc hiện có hoặc ưu tiên business.",
      },
      {
        id: 'example',
        en: "*For example,* / if I think another approach is better, / I do not just say the current one is wrong. / I bring **evidence** like logs, performance data, code behavior, failure cases, / or maintenance cost.",
        vi: "Ví dụ nếu mình nghĩ cách khác tốt hơn, mình không chỉ nói cách hiện tại sai. Mình mang evidence: log, số liệu performance, hành vi code, failure case hoặc chi phí bảo trì.",
      },
      {
        id: 'result',
        en: "*Because of that,* / I can explain the **trade-offs** more clearly / and usually give the team **more than one option** to consider.",
        vi: "Vì vậy mình giải thích trade-off rõ hơn và thường đưa nhiều hơn một phương án để team cân nhắc.",
      },
      {
        id: 'close',
        en: "*At the same time,* / once the team makes a decision, / I support it and help **execute it**. / If we are still not sure, / I prefer a **small test or controlled rollout** / to collect more evidence.",
        vi: "Đồng thời khi team đã chốt, mình ủng hộ và giúp thực thi. Nếu vẫn chưa chắc, mình đề xuất test nhỏ hoặc rollout có kiểm soát để thu thêm evidence.",
      },
      {
        id: 'extra',
        en: "*So overall,* / for me, a good technical disagreement is not about **winning an argument**. / It is about making a **clearer decision** / and getting a **better result for the system**.",
        vi: "Tóm lại, tranh luận kỹ thuật tốt không phải để thắng — mà để ra quyết định rõ hơn và kết quả tốt hơn cho hệ thống.",
      },
    ] },
    contextIds: ['J'],
    clusterIds: [],
    memory: { nodes: [{ id: 'understand-first', label: 'UNDERSTAND FIRST', triggers: ['technical decision', 'why the team chose it'], answerSectionId: 'point' }, { id: 'tradeoffs', label: 'TRADE-OFFS', triggers: ['delivery time', 'risk', 'architecture', 'business priority'], answerSectionId: 'reason' }, { id: 'evidence', label: 'BRING EVIDENCE', triggers: ['logs', 'performance data', 'failure cases'], answerSectionId: 'example' }, { id: 'options', label: 'OPTIONS', triggers: ['trade-offs', 'more than one option'], answerSectionId: 'result' }, { id: 'execute', label: 'EXECUTE', triggers: ['support decision', 'small test', 'controlled rollout'], answerSectionId: 'close' }, { id: 'better-result', label: 'BETTER RESULT', triggers: ['clearer decision', 'better system result'], answerSectionId: 'extra' }] }
  },
  {
    id: 20,
    question: {
      en: 'Can you briefly introduce yourself?',
      vi: '',
    },
    answer: { sections: [
      {
        id: 'point',
        en: '*Sure.* / My name is Huy, / and I’m a **backend engineer with around eight years of experience** in software development.',
        vi: '',
      },
      {
        id: 'foundation',
        en: '*My main background is* **backend systems**, / especially APIs, databases, background jobs, integrations, / and production reliability.',
        vi: '',
      },
      {
        id: 'recent',
        en: '*Recently,* / I’ve been working more with **AI-related features** / such as OCR, document processing, retrieval, LLM integration, / and AI workflows.',
        vi: '',
      },
      {
        id: 'ownership',
        en: '*In my current project,* / I mainly work on the **backend side**, / but I also take ownership of some important **AI features** / and work closely with DevOps and frontend engineers when needed.',
        vi: '',
      },
      {
        id: 'direction',
        speakingCue: 'I want to keep growing in',
        en: '*For my next step,* / I want to keep growing in backend engineering, / but also work more deeply with **data and AI in real products**.',
        vi: '',
      },
      {
        id: 'close',
        en: '*So overall,* / I think this position at Everfit is a good match / for both my **experience** and my **career direction**.',
        vi: '',
      },
    ] },
    contextIds: ['A'],
    clusterIds: ['production-ai'],
    memory: { nodes: [
      { id: 'experience', label: '8 YEARS', triggers: ['backend engineer', 'software development'], answerSectionId: 'point' },
      { id: 'foundation', label: 'BACKEND', triggers: ['APIs', 'databases', 'background jobs', 'integrations'], answerSectionId: 'foundation' },
      { id: 'recent-ai', label: 'AI RECENTLY', triggers: ['OCR', 'document processing', 'retrieval', 'LLM integration'], answerSectionId: 'recent' },
      { id: 'ownership', label: 'CURRENT OWNERSHIP', triggers: ['backend side', 'AI features', 'DevOps + frontend'], answerSectionId: 'ownership' },
      { id: 'direction', label: 'CAREER DIRECTION', triggers: ['backend engineering', 'data and AI in real products'], answerSectionId: 'direction' },
      { id: 'match', label: 'EVERFIT MATCH', triggers: ['experience', 'career direction'], answerSectionId: 'close' },
    ] },
  },
  {
    id: 21,
    question: {
      en: 'Why do you want to join Everfit?',
      vi: '',
    },
    answer: { sections: [
      {
        id: 'direction',
        en: '*For me,* / I want to keep growing in **backend development**, / but I also want to work more with **data and AI**.',
        vi: '',
      },
      {
        id: 'reason',
        en: '*The main reason is that* / this position combines **backend work with AI**, / so it matches what I want to do next.',
        vi: '',
      },
      {
        id: 'recent',
        en: '*For example,* / recently I’ve had some chances to work on **AI-related features in real products**, / and I found that I really enjoy this direction.',
        vi: '',
      },
      {
        id: 'everfit',
        en: '*I also like Everfit because* / it is a **global product** in the **health and fitness** area, / and it has **real users and real impact**.',
        vi: '',
      },
      {
        id: 'challenge',
        en: '*Because of that,* / I feel this is a good place for me to **learn more**, / take on a **new challenge**, / and **step out of my comfort zone**.',
        vi: '',
      },
      {
        id: 'contribution',
        speakingCue: 'I believe my backend experience can help me',
        en: '*At the same time,* / I believe my **backend experience** can help me **contribute from the beginning**.',
        vi: '',
      },
      {
        id: 'close',
        en: '*So overall,* / I think this position is a **good match** / for both my **experience** and my **career direction**.',
        vi: '',
      },
    ] },
    contextIds: ['A'],
    clusterIds: ['production-ai'],
    memory: { nodes: [
      { id: 'career-direction', label: 'CAREER DIRECTION', triggers: ['backend development', 'data and AI'], answerSectionId: 'direction' },
      { id: 'position-fit', label: 'POSITION FIT', triggers: ['backend work with AI', 'what I want to do next'], answerSectionId: 'reason' },
      { id: 'ai-recently', label: 'AI RECENTLY', triggers: ['AI-related features', 'real products', 'enjoy this direction'], answerSectionId: 'recent' },
      { id: 'everfit-reason', label: 'WHY EVERFIT', triggers: ['global product', 'health and fitness', 'real users', 'real impact'], answerSectionId: 'everfit' },
      { id: 'new-challenge', label: 'NEW CHALLENGE', triggers: ['learn more', 'step out of my comfort zone'], answerSectionId: 'challenge' },
      { id: 'contribution', label: 'CONTRIBUTE EARLY', triggers: ['backend experience', 'from the beginning'], answerSectionId: 'contribution' },
      { id: 'match', label: 'GOOD MATCH', triggers: ['experience', 'career direction'], answerSectionId: 'close' },
    ] },
  },
];

export type StrategyRow = {
  code: string;
  context: string;
  triggers: string;
  questions: string;
};

export const strategyRows: StrategyRow[] = [
  { code: 'A', context: 'Backend → Applied AI → Production', triggers: 'AI experience, fit, backend-heavy background', questions: '1, 9, 11, 20, 21' },
  { code: 'B', context: 'RAG / Hybrid Retrieval', triggers: 'RAG, retrieval, search, vector, ranking', questions: '2, 15' },
  { code: 'C', context: 'AI Reliability', triggers: 'error, retry, timeout, latency, cost, hallucination', questions: '3, 13, 14' },
  { code: 'D', context: 'OCR CPU → GPU', triggers: 'challenge, incident, OOM, performance, ownership', questions: '4, 17' },
  { code: 'E', context: 'Agent Architecture', triggers: 'agent, tool calling, function calling, design', questions: '5, 7, 10, 12' },
  { code: 'F', context: 'Workflow / Temporal', triggers: 'Temporal, async, durable workflow, checkpoint, retry', questions: '6, 18' },
  { code: 'G', context: 'Evals / Quality', triggers: 'eval, quality, regression, groundedness', questions: '8, 14, 15' },
  { code: 'H', context: 'Tool Security', triggers: 'permissions, tool safety, write actions, audit', questions: '10, 16' },
  { code: 'I', context: 'Learning / Adaptation', triggers: 'new stack, technology not used, learning speed', questions: '11' },
  { code: 'J', context: 'Ownership / Disagreement', triggers: 'conflict, decision, ownership, trade-off', questions: '19' },
];

export const selectionFlow: string[] = [
  'Identify the layer: model/retrieval, backend workflow, production incident, or behavior/ownership.',
  'Pick one context A–J. Do not combine many stories unless the question really needs it.',
  'Answer high level first: give the conclusion in one or two sentences.',
  'Use the speaking flow: Point → Reason → Example → Result → Value → Close.',
  'Add one real example when relevant: Hybrid RAG, LLM reliability, or OCR CPU → GPU.',
  'Stop after the main point and let the interviewer choose the follow-up depth.',
];

export const reusableStories: { title: string; body: string }[] = [
  { title: 'Hybrid RAG', body: 'PostgreSQL lexical search + embeddings/pgvector → RRF → lexical fallback + access scope.' },
  { title: 'LLM reliability', body: 'Check the whole flow → classify errors → retry/fallback/fail-fast → observability.' },
  { title: 'OCR CPU → GPU', body: 'Memory issue → trace bottleneck → stabilize CPU path → checkpoint/recovery → remote GPU service.' },
];

export const gapFormula =
  "I haven't used X directly in production yet → I have solved similar problems → I understand why X exists → my gap is mainly the specific tool/programming model.";

export const finalMindset: { label: string; body: string }[] = [
  { label: 'Positioning', body: 'Senior backend engineer who knows how to make AI features reliable in production.' },
  { label: 'Technical questions', body: 'Architecture first → one concrete example → trade-off or reliability concern.' },
  { label: 'Gaps', body: 'Be honest immediately → prove transferability from the same underlying engineering problem.' },
  { label: 'Follow-ups', body: 'Slow down and go deeper. Seniority comes from root-cause thinking, trade-offs, failure handling, and verification — not difficult vocabulary.' },
];


const followUpPrompts: Record<number, InterviewFollowUp[]> = {
  1: [{ id: 'production-example', question: { en: 'What was the most difficult production issue in that system?', vi: 'Vấn đề production khó nhất trong hệ thống đó là gì?' } }],
  2: [{ id: 'ranking-tradeoff', question: { en: 'What trade-off did you make between retrieval quality and latency?', vi: 'Bạn đã cân bằng chất lượng retrieval và latency như thế nào?' } }],
  3: [{ id: 'retry-boundary', question: { en: 'How do you decide when to retry and when to fail fast?', vi: 'Bạn quyết định retry hay fail fast dựa trên điều gì?' } }],
  4: [{ id: 'incident-result', question: { en: 'How did you verify that the production fix actually worked?', vi: 'Bạn xác minh bản fix production thực sự hiệu quả như thế nào?' } }],
  5: [{ id: 'agent-safety', question: { en: 'What happens if an agent chooses the wrong tool?', vi: 'Điều gì xảy ra nếu agent chọn sai tool?' } }],
  6: [
    {
      id: 'why-not-temporal',
      question: { en: 'Why did you not use Temporal from the start?', vi: 'Tại sao ngay từ đầu bạn không dùng Temporal?' },
      answer: { sections: [{ id: 'reason', en: "*For our pipeline,* / we needed to use **Postgres transactions** for safety. / It was easier to build our own. / For the AI engine, / we use **Elixir**. / Elixir has these features built in.", vi: 'Với pipeline, tụi mình cần dùng transaction của Postgres để đảm bảo an toàn nên tự xây sẽ dễ hơn. Với AI engine, tụi mình dùng Elixir vì Elixir có sẵn các tính năng này.' }] },
    },
    {
      id: 'outbox-pattern',
      question: { en: 'Can you explain the outbox pattern?', vi: 'Bạn có thể giải thích outbox pattern không?' },
      answer: { sections: [{ id: 'explain', en: "*Sure.* / When the job finishes, / we save the event in the same **database transaction** as the job status. / Then a separate worker reads the event table and sends the event. / So even if we crash, / the event is safe in the database.", vi: 'Khi job hoàn thành, tụi mình lưu event trong cùng transaction database với trạng thái job. Sau đó worker riêng đọc bảng event và gửi event. Vì vậy kể cả khi hệ thống crash, event vẫn an toàn trong database.' }] },
    },
    {
      id: 'replay',
      question: { en: 'How does the replay work in your system?', vi: 'Replay hoạt động thế nào trong hệ thống của bạn?' },
      answer: { sections: [{ id: 'explain', en: "*We save every step as an event in the database.* / In the UI, / we can open any past run / and see all the events in order. / But it is **not the same as Temporal** — / we do not re-run the code, / we just show the history.", vi: 'Tụi mình lưu mỗi step thành một event trong database. Trên UI, có thể mở bất kỳ lần chạy nào trong quá khứ và xem các event theo thứ tự. Nhưng nó không giống Temporal: tụi mình không chạy lại code, chỉ hiển thị lịch sử.' }] },
    },
  ],
  7: [{ id: 'agent-boundary', question: { en: 'Which parts should an agent decide, and which parts must stay deterministic?', vi: 'Phần nào để agent quyết định, phần nào phải deterministic?' } }],
  8: [{ id: 'eval-signal', question: { en: 'Which evaluation signal would you trust most and why?', vi: 'Bạn tin evaluation signal nào nhất và vì sao?' } }],
  9: [{ id: 'backend-transfer', question: { en: 'Which backend skill transfers most directly to an AI role?', vi: 'Kỹ năng backend nào chuyển sang vai trò AI trực tiếp nhất?' } }],
  10: [{ id: 'tool-permission', question: { en: 'How would you prevent an unsafe tool call?', vi: 'Bạn ngăn một tool call không an toàn như thế nào?' } }],
  11: [{ id: 'learning-plan', question: { en: 'How would you learn an unfamiliar AI stack quickly?', vi: 'Bạn sẽ học một AI stack chưa quen thật nhanh như thế nào?' } }],
  12: [{ id: 'everfit-tradeoff', question: { en: 'What would you build first for this system and why?', vi: 'Bạn sẽ xây phần nào trước cho hệ thống này và vì sao?' } }],
  13: [{ id: 'cost-latency', question: { en: 'If latency and cost conflict, how would you choose?', vi: 'Nếu latency và chi phí mâu thuẫn, bạn sẽ chọn thế nào?' } }],
  14: [{ id: 'hallucination-fallback', question: { en: 'What would you do when retrieval is incomplete?', vi: 'Bạn sẽ làm gì khi retrieval không đầy đủ?' } }],
  15: [{ id: 'rag-metric', question: { en: 'Which metric would you check first when RAG quality drops?', vi: 'Bạn kiểm tra metric nào đầu tiên khi chất lượng RAG giảm?' } }],
  16: [{ id: 'security-boundary', question: { en: 'Where would you enforce the permission check?', vi: 'Bạn sẽ enforce permission check ở đâu?' } }],
  17: [{ id: 'ocr-bottleneck', question: { en: 'How would you confirm the real OCR bottleneck?', vi: 'Bạn xác nhận bottleneck thật sự của OCR như thế nào?' } }],
  18: [{ id: 'background-jobs', question: { en: 'How would you make the background job safe to retry?', vi: 'Bạn làm background job an toàn khi retry như thế nào?' } }],
  19: [{ id: 'disagreement-evidence', question: { en: 'How do you handle disagreement when the team has different priorities?', vi: 'Bạn xử lý bất đồng khi team có ưu tiên khác nhau thế nào?' } }],
  20: [{ id: 'gap-example', question: { en: 'Can you give a concrete example of a similar problem you have solved?', vi: 'Bạn có thể đưa ví dụ cụ thể về vấn đề tương tự đã giải quyết không?' } }],
  21: [{ id: 'follow-up-example', question: { en: 'What was the main trade-off in that example?', vi: 'Trade-off chính trong ví dụ đó là gì?' } }],
};

const speakingCueOverrides: Record<number, Record<string, string>> = {
  1: { point: 'My main background is', reason: 'In production, an AI feature is not only about', example: 'In my recent project, I have worked more with', result: 'I have experience with both', close: 'I would describe my strength as' },
  2: { point: 'I prefer not to rely on only one type of search', reason: 'Lexical search is good for', example: 'The lexical side uses', result: 'We combine the two rankings with', close: 'We also think about failure and security', extra: 'The goal is to make retrieval more' },
  3: { point: 'I check the whole workflow to find', reason: 'A bad result can come from', example: 'For temporary failures like', result: 'I first separate temporary errors from', close: 'I normally track the' },
  4: { point: 'One example was a document OCR workflow', reason: 'Reducing the batch size helped for a while', example: 'I traced the processing flow', result: 'I confirmed that the main bottleneck was', close: 'I worked with DevOps to move' },
  5: { point: 'I would not put everything into one large LLM call', reason: 'Clear step boundaries make the system easier to', example: 'The flow can be', result: 'The backend should control tool execution', close: 'For longer workflows, I would persist' },
  6: { point: 'I have not used Temporal in production', pipeline: 'The first one is a document pipeline', 'agent-engine': 'The second one is an AI agent engine', concepts: 'So I know the main ideas', gap: 'What I need to learn is the Temporal library itself' },
  7: { point: 'I have not spent several years building fully autonomous AI agents', reason: 'Many important agent building blocks are already familiar', example: 'I have worked with', result: 'I think of an agent as a controlled workflow', close: 'My direct agent experience is still growing' },
  8: { point: 'I have hands-on experience with AI evaluation', reason: 'In production AI, I want to know whether', example: 'In our document AI work, we used', result: 'My direct work was more on', close: 'I also worked on citation and provenance', extra: 'The wider StrangeLoop platform also has' },
  9: { point: 'My strongest foundation is backend engineering', reason: 'In production, an AI feature is not only the model', example: 'Those are areas where I already have', result: 'I can focus on growing deeper in AI', close: 'Recently I have been working more with' },
  10: { point: 'I have hands-on experience with tool calling', reason: 'In Clincove, the model can use', example: 'The backend checks permission and scope', result: 'We design the tool interface in a familiar way', close: 'I also worked on tool safety and tracking' },
  11: { point: 'I normally learn a new technology by connecting it to', reason: 'Many of the underlying problems stay the same', example: 'When I study Temporal, I connect it to', result: 'This is also how I moved from traditional backend work into', close: 'Every new stack still has its own' },
  12: { point: 'I would start with the user goal', reason: 'I would not send the whole database to the model', example: 'If a user asks about training progress', result: 'I would expose a small set of backend tools', close: 'This is similar to what I worked with in Clincove', extra: 'I would track run IDs, tool calls, latency, and errors' },
  13: { point: 'I try to control latency and cost in several layers', reason: 'Every extra model call or extra token can', example: 'I use normal backend logic, filtering, and retrieval', result: 'I try to keep the context small', close: 'I use timeouts and bounded retries', extra: 'I also use checkpoint and recovery' },
  14: { point: 'The first step is to give the model', reason: 'If the context is wrong', example: 'For knowledge-based questions, I prefer', result: 'For machine-consumed output, I prefer', close: 'I would use eval cases for', extra: 'We can reduce and control the risk' },
  15: { point: 'I separate retrieval behavior, answer grounding, and runtime behavior', reason: 'A good final answer depends on getting', example: 'In Clincove, I implemented and tested', result: 'I also check the provenance and citations', close: 'I also look at runtime signals such as', extra: 'For a more formal RAG evaluation, I would add' },
  16: { point: 'I would start with least privilege', reason: 'The model should never have unlimited access to', example: 'Each tool should have a clear schema', result: 'Sensitive data should be minimized', close: 'I would log tool calls and results with' },
  17: { point: 'One example was a production issue with', reason: 'I did not want to assume the worker itself was', example: 'I traced the processing flow', result: 'I first made the current flow more stable', close: 'I handled the backend and workflow side' },
  18: { point: 'I would not keep an HTTP request open', reason: 'Long-running work can take time or fail', example: 'A worker can process the job in the background', result: 'I can clearly separate temporary errors from', close: 'I also keep the job status clear' },
  19: { point: 'When I disagree with a technical decision', reason: 'Sometimes the decision is not only about technology', example: 'I bring evidence like', result: 'I can explain the trade-offs more clearly', close: 'Once the team makes a decision', extra: 'A good technical disagreement is not about' },
  20: { point: 'My name is Huy', foundation: 'My main background is', recent: 'Recently, I’ve been working more with', ownership: 'In my current project, I mainly work on', direction: 'I want to keep growing in', close: 'I think this position at Everfit is' },
  21: { direction: 'I want to keep growing in', reason: 'This position combines backend work with AI', recent: 'Recently I’ve had some chances to work on', everfit: 'I also like Everfit because', challenge: 'I feel this is a good place for me to', contribution: 'I believe my backend experience can help me', close: 'I think this position is a good match' },
};

export const interviewQuestions: InterviewQuestion[] = (rawInterviewQuestions as InterviewQuestion[]).map((question) => ({
  ...question,
  answer: { sections: question.answer.sections.map((section) => ({ ...section, speakingCue: section.speakingCue ?? speakingCueOverrides[question.id]?.[section.id] })) },
  followUps: followUpPrompts[question.id],
  audio: {
    full: `/audio/interview/q${String(question.id).padStart(2, '0')}/full.mp3`,
    alignment: `/audio/interview/q${String(question.id).padStart(2, '0')}/alignment.json`,
  },
}));
