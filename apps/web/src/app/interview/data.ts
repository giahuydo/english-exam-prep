import type { InterviewFollowUp, InterviewQuestion } from './types';

export type { Bilingual, InterviewQuestion } from './types';

export const interviewIntro = {
  company: 'Everfit',
  role: 'Applied AI Backend Engineer',
  subtitle: '22 Interview Questions — Speaking & Reaction Format',
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
        en: "*For me,* / my main background is **backend development**. / I have worked with **Node.js**, **NestJS**, **PostgreSQL**, **REST APIs**, **background workers**, **message queues**, / and third-party integrations.",
        vi: "*Với mình,* / nền tảng chính là **backend**. / Mình đã làm với **Node.js**, **NestJS**, **PostgreSQL**, **REST API**, **background worker**, **message queue**, / và tích hợp bên thứ ba.",
      },
      {
        id: 'reason',
        en: "*That's because* / in production, an AI feature is not only about calling a model. / The backend still needs to be **reliable**, **fast**, **observable**, / and able to recover when something fails.",
        vi: "*Vì* / trong production, một tính năng AI không chỉ là gọi model. / Backend vẫn phải **đáng tin cậy**, **nhanh**, **quan sát được**, / và phục hồi được khi lỗi.",
      },
      {
        id: 'example',
        en: "*For example,* / in my recent project, I have worked more with **OCR**, **document processing**, **embeddings**, **hybrid search**, / and **LLM integration**. / We process documents, / create structured content and embeddings, / and use them later for **semantic and hybrid retrieval**.",
        vi: "*Ví dụ,* / ở dự án gần nhất mình làm nhiều với **OCR**, **xử lý tài liệu**, **embeddings**, **hybrid search**, / và **tích hợp LLM**. / Tụi mình xử lý tài liệu, / tạo nội dung có cấu trúc và embedding, / rồi dùng cho **tìm kiếm ngữ nghĩa và hybrid**.",
      },
      {
        id: 'result',
        en: "*So* / I have experience with both the **AI part** / and the **backend workflow around it**, / including **timeout**, **retry**, **fallback**, **data access**, **latency**, / and **cost**.",
        vi: "*Vậy* / mình có kinh nghiệm cả phần **AI** / lẫn **workflow backend xung quanh**, / gồm **timeout**, **retry**, **fallback**, **truy cập dữ liệu**, **latency**, / và **chi phí**.",
      },
      {
        id: 'close',
        en: "*So overall,* / I would describe my strength as combining **strong backend engineering** / with **applied AI in a real production system**.",
        vi: "*Tóm lại,* / thế mạnh của mình là kết hợp **backend engineering vững** / với **AI ứng dụng trong hệ thống production thực tế**.",
      },
    ] },
    contextIds: ['A'],
    clusterIds: ['observability', 'production-ai'],
    routeIds: ['ocr-incident'],
    memory: { nodes: [
      { id: 'backend-foundation', label: 'BACKEND FOUNDATION', triggers: ['Node.js / NestJS', 'PostgreSQL', 'workers / queues'], answerSectionId: 'point' },
      { id: 'applied-ai', label: 'APPLIED AI', triggers: ['OCR', 'embeddings', 'hybrid retrieval', 'LLM integration'], answerSectionId: 'example' },
      { id: 'production-reliability', label: 'PRODUCTION RELIABILITY', triggers: ['timeout / retry', 'fallback', 'observability', 'latency / cost'], answerSectionId: 'result' },
    ] }
  },
  {
    id: 2,
    question: {
      en: "Can you describe a retrieval system you have worked on?",
      vi: 'Bạn có thể mô tả một hệ thống retrieval mà bạn đã làm không?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*In our system,* / we don't use only one type of search. / We combine **lexical search** / and **semantic search**.",
        vi: "Trong hệ thống của tụi mình, mình không dùng chỉ một loại tìm kiếm. Tụi mình kết hợp lexical search và semantic search.",
      },
      {
        id: 'reason',
        en: "*That's because* / lexical search is good for **exact keywords**, / and semantic search is better for **meaning and similar context**.",
        vi: "Vì lexical mạnh với từ khóa chính xác, còn semantic mạnh về nghĩa và ngữ cảnh tương tự.",
      },
      {
        id: 'example',
        en: "*In practice,* / the lexical side uses **PostgreSQL full-text search**, / and the semantic side uses **embeddings with pgvector cosine similarity**.",
        vi: "Thực tế, phía lexical dùng PostgreSQL full-text search, phía semantic dùng embeddings với pgvector cosine similarity.",
      },
      {
        id: 'result',
        en: "*Then* we combine the two rankings / with **Reciprocal Rank Fusion**, or **RRF**, / so a result that is strong in both searches / can move higher in the final ranking.",
        vi: "Sau đó tụi mình gộp hai bảng xếp hạng bằng Reciprocal Rank Fusion, hoặc RRF, nên kết quả mạnh ở cả hai sẽ lên cao hơn trong ranking cuối.",
      },
      {
        id: 'close',
        en: "*We also* / think about **failure and security**. / If the embedding service is unavailable, / we can fall back to lexical results, / and every search is still limited by the user's access.",
        vi: "Tụi mình cũng nghĩ tới lỗi và bảo mật. Nếu embedding service hỏng thì fallback về lexical, và mọi truy vấn vẫn giới hạn theo quyền của user.",
      },
      {
        id: 'extra',
        en: "*So* / the goal is to make retrieval more **balanced**, **reliable**, and **safe** / instead of depending on vector search alone.",
        vi: "Vậy mục tiêu là retrieval cân bằng, đáng tin cậy và an toàn hơn — thay vì chỉ dựa vào vector.",
      },
    ] },
    contextIds: ['B'],
    clusterIds: ['rag'],
    storyIds: ['hybrid-rag'],
    routeIds: ['hybrid-retrieval'],
    memory: { nodes: [{'id': 'retrieval', 'label': 'RETRIEVAL', 'triggers': ['lexical search', 'semantic search'], 'answerSectionId': 'point'}, {'id': 'ranking', 'label': 'RANKING', 'triggers': ['RRF', 'cosine similarity'], 'answerSectionId': 'result'}, {'id': 'safety', 'label': 'FALLBACK + ACCESS', 'triggers': ['lexical fallback', 'user access'], 'answerSectionId': 'close'}] }
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
        en: "*For me,* / I do not just blame the **LLM** / when something goes wrong. / I check the **whole workflow** / to find the real root cause.",
        vi: "Mình không đổ lỗi ngay cho LLM khi có sự cố. Mình soi toàn bộ workflow để tìm nguyên nhân gốc.",
      },
      {
        id: 'reason',
        en: "*That's because* / a bad result can come from **bad input**, / **wrong retrieval**, / **backend logic**, / **prompt construction**, / the **AI provider**, / or the **model itself**.",
        vi: "Vì kết quả xấu có thể do input sai, retrieval sai, logic backend, cách dựng prompt, provider AI, hoặc chính model.",
      },
      {
        id: 'example',
        en: "*For example,* / for **temporary failures** like **network errors**, **timeouts**, / or some **5xx errors**, / I use a bounded **retry**. / If one model is down, / I may use a **fallback model**. / But for bad credentials or bad requests, / I **fail fast**.",
        vi: "Ví dụ, với lỗi tạm thời như network, timeout, hoặc một số 5xx, mình dùng retry có giới hạn. Nếu một model down thì có thể fallback sang model khác. Nhưng credential sai hoặc request hỏng thì fail fast.",
      },
      {
        id: 'result',
        en: "*So first,* / I separate **temporary errors** / from **permanent errors**. / Then I decide: **retry**, **fail**, / or **fall back**.",
        vi: "Vậy trước hết mình tách lỗi tạm thời và lỗi vĩnh viễn. Sau đó mới quyết định: retry, fail, hoặc fallback.",
      },
      {
        id: 'close',
        en: "*For tracking,* / I keep clear **logs** / with the important **IDs**, **status**, **errors**, / and **performance metrics**, / such as **latency**, **processing time**, / and **memory usage**. / This helps me **monitor the system**, / find what went wrong, / and **debug problems more easily**.",
        vi: "Về tracking, mình giữ log rõ ràng với ID, trạng thái, lỗi và các chỉ số hiệu năng như latency, thời gian xử lý và memory usage. Điều này giúp mình theo dõi hệ thống, tìm lỗi và debug dễ hơn.",
      },
      {
        id: 'details',
        en: "*For LLM workflows,* / I also record the **model**, **retry count**, **token usage**, / and the workflow step that failed.",
        vi: "Với workflow LLM, mình cũng ghi lại model, số lần retry, token usage và bước workflow bị lỗi.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I look for the **real root cause**, / choose the **right strategy** for each error, / and keep the workflow easy to **monitor and debug**.",
        vi: "Tóm lại, mình tìm nguyên nhân gốc, chọn chiến lược đúng cho từng lỗi, và giữ workflow dễ monitor/debug.",
      },
    ] },
    contextIds: ['C'],
    clusterIds: ['error-handling', 'observability', 'production-ai'],
    storyIds: ['llm-reliability'],
    routeIds: ['llm-reliability'],
    memory: { nodes: [{'id': 'root-cause', 'label': 'ROOT CAUSE', 'triggers': ['bad input', 'wrong retrieval', 'backend logic', 'provider / model'], 'answerSectionId': 'point'}, {'id': 'error-strategy', 'label': 'ERROR STRATEGY', 'triggers': ['temporary vs permanent', 'retry', 'fallback', 'fail fast'], 'answerSectionId': 'result'}, {'id': 'observability', 'label': 'OBSERVABILITY', 'triggers': ['clear logs', 'IDs / status / errors', 'latency / processing time / memory'], 'answerSectionId': 'close'}, {'id': 'llm-details', 'label': 'LLM DETAILS', 'triggers': ['model', 'retry count', 'token usage', 'failed workflow step'], 'answerSectionId': 'details'}] }
  },
  {
    id: 4,
    question: {
      en: "Walk me through a recent agent-platform or workflow-engine project you owned — architecture, control points, and what you learned.",
      vi: 'Hãy kể một dự án agent platform / workflow engine gần đây bạn sở hữu — kiến trúc, điểm kiểm soát, và bài học chính.',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*Recently,* / I worked on an **AI agent workflow system** called **StrangeLoop**. / It has a **Studio** for configuration / and an **Engine** for execution.",
        vi: "Gần đây mình làm với hệ thống AI agent workflow tên StrangeLoop. Nó có Studio để cấu hình và Engine để chạy.",
      },
      {
        id: 'reason',
        en: "*The Engine* / runs the workflow step by step. / It can call the **LLM**, / use different **tools**, / and make decisions along the way. / The app still controls its own **data and backend actions**. / So it is easier to **control and debug**.",
        vi: "Engine chạy workflow từng bước. Nó có thể gọi LLM, dùng các tool khác nhau, và quyết định trong lúc chạy. App vẫn giữ control data và backend actions của mình. Vì vậy dễ control và debug hơn.",
      },
      {
        id: 'approval',
        en: "*For approval,* / if a tool needs it, / the Engine stops and waits for the user / before calling the backend.",
        vi: "Về approval: nếu tool cần duyệt, Engine dừng và chờ user trước khi gọi backend.",
      },
      {
        id: 'scope',
        en: "*For data,* / each run only gets the data it needs. / If the scope is wrong, / the system returns nothing.",
        vi: "Về data: mỗi run chỉ lấy đúng data cần dùng. Scope sai thì hệ thống không trả data.",
      },
      {
        id: 'tracking',
        en: "*For tracking,* / I keep clear **logs** / with the important **IDs**, **status**, **errors**, / and **performance metrics**, / such as **latency**, **processing time**, / and **memory usage**. / This helps me **monitor the system**, / find what went wrong, / and **debug problems more easily**.",
        vi: "Về tracking, mình giữ log rõ ràng với ID, trạng thái, lỗi và các chỉ số hiệu năng như latency, thời gian xử lý và memory usage. Điều này giúp mình theo dõi hệ thống, tìm lỗi và debug dễ hơn.",
      },
      {
        id: 'improve',
        en: "*Then,* / we use those insights / to improve the **workflow, prompts, or tools** over time.",
        vi: "Sau đó, tụi mình dùng các insight đó để cải thiện workflow, prompt hoặc tool theo thời gian.",
      },
      {
        id: 'close',
        en: "*So overall,* / a good agent system needs **clear boundaries**. / The platform controls the **rules and orchestration**. / The application controls its own **data and business actions**.",
        vi: "Tóm lại, agent system tốt cần ranh giới rõ. Platform giữ rules và orchestration. Application giữ data và business actions của mình.",
      },
    ] },
    contextIds: ['K'],
    clusterIds: ['tool-calling', 'workflow'],
    routeIds: ['strangeloop-agent'],
    memory: { nodes: [{'id': 'strangeloop-platform', 'label': 'AGENT PLATFORM', 'triggers': ['Studio control plane', 'Engine runtime', 'AI agents'], 'answerSectionId': 'point'}, {'id': 'unified-flow', 'label': 'UNIFIED FLOW', 'triggers': ['LLM calls', 'tool calls', 'decisions', 'debuggable steps'], 'answerSectionId': 'reason'}, {'id': 'approval-gate', 'label': 'APPROVAL GATE', 'triggers': ['tool approval', 'pause and wait', 'user confirmation'], 'answerSectionId': 'approval'}, {'id': 'DATA SCOPE', 'label': 'DATA SCOPE', 'triggers': ['needed data only', 'scope check', 'no data returned'], 'answerSectionId': 'scope'}, {'id': 'observability', 'label': 'TRACEABLE RUN', 'triggers': ['clear logs', 'IDs / status / errors', 'latency / processing time / memory'], 'answerSectionId': 'tracking'}, {'id': 'improve', 'label': 'IMPROVE', 'triggers': ['workflow', 'prompts', 'tools'], 'answerSectionId': 'improve'}, {'id': 'boundary', 'label': 'SYSTEM BOUNDARY', 'triggers': ['platform rules', 'application data', 'backend actions'], 'answerSectionId': 'close'}] }
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
        en: "*That's because* / clear steps make the system easier to **debug**, **retry**, **monitor**, / and **recover** when something fails.",
        vi: "Vì bước rõ giúp hệ thống dễ debug, retry, monitor và phục hồi khi có lỗi.",
      },
      {
        id: 'example',
        en: "*For example,* / the flow can be: / **understand intent**, / **retrieve context**, / **decide if a tool is needed**, / **call the tool**, / **validate the result**, / then **generate the final response**.",
        vi: "Ví dụ luồng có thể là: hiểu ý định → lấy ngữ cảnh → quyết định có cần tool → gọi tool → kiểm tra kết quả → tạo phản hồi cuối.",
      },
      {
        id: 'result',
        en: "*Then* / the **backend** should control **tool execution**. / It defines the **tool contract**, / validates **arguments**, / checks **permissions**, / runs the action, / and returns a **structured result**.",
        vi: "Sau đó backend nên kiểm soát việc chạy tool: định nghĩa contract, validate tham số, check permission, chạy action, và trả kết quả có cấu trúc.",
      },
      {
        id: 'close',
        en: "*For reliability,* / I would save important **state**, / use **timeout** and bounded **retry**, / and keep external actions **idempotent**.",
        vi: "Về độ tin cậy: mình lưu state quan trọng, dùng timeout + retry có giới hạn, và giữ action ngoài idempotent.",
      },
      {
        id: 'tracking',
        en: "*For tracking,* / I keep clear **logs** / with the important **IDs**, **status**, **errors**, / and **performance metrics**, / such as **latency**, **processing time**, / and **memory usage**. / This helps me **monitor the system**, / find what went wrong, / and **debug problems more easily**.",
        vi: "Về tracking: mình giữ log rõ ràng với các ID, trạng thái, lỗi, và chỉ số hiệu năng như độ trễ, thời gian xử lý, và mức dùng bộ nhớ. Điều này giúp mình theo dõi hệ thống, tìm chỗ sai, và debug dễ hơn.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I use the **LLM for flexible reasoning**, / but keep important backend actions **controlled and predictable**.",
        vi: "Tóm lại, dùng LLM để suy luận linh hoạt, nhưng giữ các action backend quan trọng ở mức kiểm soát và dự đoán được.",
      },
    ] },
    contextIds: ['E', 'H'],
    clusterIds: ['error-handling', 'observability', 'workflow', 'tool-calling', 'tool-safety', 'production-ai'],
    routeIds: ['strangeloop-agent', 'tool-control'],
    memory: { nodes: [
      { id: 'agent-context', label: 'CLEAR STEPS', triggers: ['not one LLM call', 'clear steps', 'debug / retry / recover'], answerSectionId: 'point' },
      { id: 'tool-control', label: 'TOOL CONTROL', triggers: ['tool contract', 'validate arguments', 'permission check', 'structured result'], answerSectionId: 'result' },
      { id: 'reliability', label: 'RELIABILITY', triggers: ['state', 'timeout / retry', 'idempotent'], answerSectionId: 'close' },
      { id: 'tracking', label: 'TRACKING', triggers: ['clear logs', 'IDs / status / errors', 'latency / processing time / memory'], answerSectionId: 'tracking' },
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
        en: "*No,* / I have not used **Temporal in production**. / But at my company, / we built two systems that solve the same problems. / So I already understand the **core ideas**.",
        vi: "Chưa, mình chưa dùng Temporal trong production. Nhưng ở công ty tụi mình đã xây hai hệ thống giải quyết cùng loại vấn đề. Vì vậy mình đã hiểu các ý tưởng cốt lõi.",
      },
      {
        id: 'pipeline',
        en: "*The first one is* a **document pipeline**. / It has three steps: **build**, **publish**, and **ingest**. / We save the **job state** in Postgres. / Each job has a status, / like pending, processing, ready, or failed. / The worker sends a **heartbeat** every few seconds. / If a job is stuck, / a cron marks it as failed. / If it fails for a small reason, / we can **retry** it. / We also use an **outbox pattern**. / We save the event in the database first, / then send it later. / So we never lose an event, / even when the worker crashes. / We also have an admin page. / Admins can see all jobs, / filter by step, / and retry any failed job.",
        vi: "Hệ thống đầu là document pipeline với ba bước: build, publish, ingest. Tụi mình lưu job state trong Postgres. Mỗi job có status như pending, processing, ready hoặc failed. Worker gửi heartbeat vài giây một lần. Job kẹt thì cron đánh failed. Lỗi nhỏ thì retry được. Tụi mình cũng dùng outbox: lưu event vào DB trước rồi gửi sau, nên không mất event khi worker crash. Có trang admin để xem job, lọc theo step và retry job failed.",
      },
      {
        id: 'agent-engine',
        en: "*The second one is* an **AI agent engine**. / This one is closer to Temporal. / We write the **workflow in JSON**. / Each run is one process. / We set limits — / max steps, max tool calls, max cost — / so a run cannot loop forever. / We have two **timeouts**: / a soft one, / and a hard one that kills the process. / We support outside events, / like a webhook or human approval. / We support **sub-jobs** — / one workflow can start another. / Every step is saved as an event. / We have a UI to **replay** / and check what happened.",
        vi: "Hệ thống hai là AI agent engine, gần Temporal hơn. Workflow viết bằng JSON. Mỗi run là một process. Có limit: max steps, max tool calls, max cost — nên không loop vô hạn. Có hai timeout: soft và hard để kill process. Hỗ trợ event ngoài như webhook hoặc human approval. Hỗ trợ sub-job: một workflow có thể start workflow khác. Mỗi step lưu thành event. Có UI để replay và xem chuyện gì đã xảy ra.",
      },
      {
        id: 'concepts',
        en: "*So I know the main ideas:* / how to **save state**, / how to **retry safely**, / how to handle **timeouts**, / how to add **heartbeats**, / how to receive signals from outside, / and how to run **sub-workflows**.",
        vi: "Vậy mình nắm các ý chính: lưu state, retry an toàn, xử lý timeout, thêm heartbeat, nhận signal từ ngoài, và chạy sub-workflow.",
      },
      {
        id: 'gap',
        en: "*What I still need* / is the **Temporal library itself**. / The specific API, / the workflow writing rules, / and how **replay** works. / I think one or two weeks is enough, / because I already know why Temporal is designed this way.",
        vi: "Phần mình còn cần là chính thư viện Temporal: API cụ thể, quy tắc viết workflow, và cách replay chạy. Mình nghĩ một đến hai tuần là đủ, vì đã hiểu vì sao Temporal được thiết kế như vậy.",
      },
    ] },
    contextIds: ['F', 'I'],
    clusterIds: ['error-handling', 'observability', 'workflow', 'gap'],
    routeIds: ['gap-transfer'],
    memory: { nodes: [
      { id: 'tool-gap', label: 'HONEST GAP', triggers: ['not in production', 'two similar systems', 'core ideas'], answerSectionId: 'point' },
      { id: 'document-pipeline', label: 'DOCUMENT PIPELINE', triggers: ['build / publish / ingest', 'job state', 'heartbeat', 'outbox'], answerSectionId: 'pipeline' },
      { id: 'agent-engine', label: 'AI AGENT ENGINE', triggers: ['workflow in JSON', 'limits / timeouts', 'outside events', 'sub-jobs'], answerSectionId: 'agent-engine' },
      { id: 'CORE IDEAS', label: 'CORE IDEAS', triggers: ['save state', 'safe retry', 'heartbeats', 'sub-workflows'], answerSectionId: 'concepts' },
      { id: 'LEARNING GAP', label: 'LEARNING GAP', triggers: ['Temporal API', 'workflow rules', 'replay', '1-2 weeks'], answerSectionId: 'gap' },
    ] }
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
        en: "*For me,* / I have not spent several years on fully **autonomous AI agents**. / But recently I have built **AI agent workflows** / and the core building blocks behind them.",
        vi: "Mình chưa dành nhiều năm cho agent hoàn toàn tự động. Nhưng gần đây mình đã xây AI agent workflow và các building block cốt lõi phía sau.",
      },
      {
        id: 'example',
        en: "*For example,* / I worked on **StrangeLoop**, / an **AI agent workflow system** with a Studio and an Engine. / It can call the **LLM**, use **tools**, / wait for **approval**, / and keep clear **data scope**. / I also built **hybrid retrieval**, / so the agent can get the right context before it acts.",
        vi: "Ví dụ, mình làm StrangeLoop — hệ thống AI agent workflow có Studio và Engine. Nó gọi được LLM, dùng tool, chờ approval, và giữ data scope rõ. Mình cũng làm hybrid retrieval để agent lấy đúng context trước khi hành động.",
      },
      {
        id: 'reason',
        en: "*Because of that,* / many agent pieces are already familiar: / **retrieval**, **structured LLM I/O**, **workflow state**, **tool contracts**, **retries**, **logging**, / and **failure handling**.",
        vi: "Vì vậy nhiều mảnh của agent mình đã quen: retrieval, LLM I/O có cấu trúc, workflow state, tool contract, retry, logging và xử lý lỗi.",
      },
      {
        id: 'result',
        en: "*So I think of an agent as* a **controlled workflow**: / **understand the intent**, / **get the right context**, / **decide if a tool is needed**, / **run it through backend controls**, / **validate the result**, / then **generate the response**.",
        vi: "Vậy mình xem agent như controlled workflow: hiểu ý định → lấy đúng context → quyết định có cần tool → chạy qua backend có kiểm soát → validate → tạo response.",
      },
      {
        id: 'close',
        en: "*The real gap* / is not the core ideas. / It is more about **having more experience with fully autonomous agent products**. / The **production engineering foundation** is already familiar to me.",
        vi: "Gap thật không phải ý tưởng cốt lõi. Nó nghiêng về việc cần thêm kinh nghiệm với các sản phẩm agent tự động hoàn toàn. Nền production engineering thì mình đã quen.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I am honest about the gap, / but confident I can grow fast / from the **StrangeLoop**, **RAG**, / and backend AI workflow experience I already have.",
        vi: "Tóm lại, mình thẳng về gap, nhưng tự tin phát triển nhanh từ kinh nghiệm StrangeLoop, RAG và backend AI workflow đã có.",
      },
    ] },
    contextIds: ['E', 'I'],
    clusterIds: ['error-handling', 'observability', 'workflow', 'tool-calling', 'rag', 'production-ai', 'gap'],
    storyIds: ['hybrid-rag'],
    routeIds: ['strangeloop-agent', 'gap-transfer'],
    memory: { nodes: [
      { id: 'agent-gap', label: 'NARROW GAP', triggers: ['not years of autonomous agents', 'recent agent workflows'], answerSectionId: 'point' },
      { id: 'building-blocks', label: 'STRANGELOOP + RAG', triggers: ['StrangeLoop', 'tools / approval', 'hybrid retrieval'], answerSectionId: 'example' },
      { id: 'controlled-workflow', label: 'CONTROLLED WORKFLOW', triggers: ['intent / context', 'backend controls', 'validate'], answerSectionId: 'result' },
      { id: 'foundation', label: 'PRODUCTION FOUNDATION', triggers: ['more experience with autonomous agents', 'core ideas familiar'], answerSectionId: 'close' },
    ] }
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
        en: "*Yes,* / I have **hands-on experience with AI evaluation and quality regression**. / I did not build the whole **LLM eval platform** from scratch.",
        vi: "Có, mình có kinh nghiệm thực tế với AI evaluation và quality regression. Mình không xây cả LLM eval platform từ đầu.",
      },
      {
        id: 'reason',
        en: "*That's because* / in production AI, / I want to know if a change makes the system **better or worse**, / not only whether the code still runs.",
        vi: "Vì trong production AI, mình muốn biết một thay đổi làm hệ thống tốt hơn hay tệ đi, chứ không chỉ xem code còn chạy hay không.",
      },
      {
        id: 'example',
        en: "*For example,* / in our document AI work, / we used **offline benchmarks** / to compare **OCR** and document-processing approaches / by **quality** and **performance**. / The benchmark helped us find issues like **PHI leakage** / and improve the pipeline.",
        vi: "Ví dụ, trong document AI, tụi mình dùng offline benchmark để so OCR và các hướng xử lý document theo chất lượng và hiệu năng. Benchmark giúp phát hiện vấn đề như PHI leakage và cải thiện pipeline.",
      },
      {
        id: 'result',
        en: "*For retrieval,* / I worked on **hybrid retrieval** with **BM25**, **vector search**, and **RRF**. / I also added **regression tests** for **ranking**, **fallback**, / and **permission isolation**.",
        vi: "Về retrieval, mình làm hybrid retrieval với BM25, vector search và RRF. Mình cũng thêm regression test cho ranking, fallback và permission isolation.",
      },
      {
        id: 'close',
        en: "*I also worked on* **citation and provenance**. / That includes the **document**, **page**, **text span**, / and **bounding box**, / so the answer can be traced to the real source.",
        vi: "Mình cũng làm citation và provenance: document, page, text span và bounding box, để câu trả lời truy được về đúng nguồn.",
      },
      {
        id: 'extra',
        en: "*StrangeLoop also has* a formal **Test Bench**. / Agent tests can use **expected outputs** / or an **LLM judge with a rubric**. / I understand how it works from the source, / but I did not build the Test Bench myself.",
        vi: "StrangeLoop cũng có Test Bench chính thức. Agent test có thể dùng expected output hoặc LLM judge với rubric. Mình hiểu cách nó chạy từ source, nhưng không phải người xây Test Bench.",
      },
      {
        id: 'final',
        en: "*So overall,* / I have practical experience with **AI evaluation and regression**, / especially **retrieval**, **grounding**, and **document AI**, / and I am familiar with formal **LLM** and **agent eval** systems.",
        vi: "Tóm lại, mình có kinh nghiệm thực tế với AI evaluation và regression, đặc biệt retrieval, grounding và document AI, và cũng quen với hệ thống LLM/agent eval chính thức.",
      },
    ] },
    contextIds: ['B', 'G'],
    clusterIds: ['rag', 'quality', 'gap'],
    storyIds: ['hybrid-rag'],
    routeIds: ['hybrid-retrieval'],
    memory: { nodes: [
      { id: 'hands-on-eval', label: 'AI EVAL HANDS-ON', triggers: ['hands-on eval', 'quality regression', 'not platform owner'], answerSectionId: 'point' },
      { id: 'benchmark-phi', label: 'BENCHMARK + PHI', triggers: ['offline benchmark', 'OCR / document AI', 'PHI leakage'], answerSectionId: 'example' },
      { id: 'retrieval-grounding', label: 'HYBRID RETRIEVAL', triggers: ['BM25 / vector / RRF', 'regression tests', 'ranking / fallback / permission'], answerSectionId: 'result' },
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
        en: "*Yes,* / my years are stronger on **backend**. / But for this role, / I would not sell years of an AI title. / I would sell **applied AI I have already shipped**.",
        vi: "Đúng, số năm mình mạnh hơn ở backend. Nhưng với role này, mình không bán năm tháng mang title AI. Mình bán applied AI mình đã ship được.",
      },
      {
        id: 'reason',
        en: "*Because* a **70% AI role** still needs someone who can make AI work in production: / **retrieval**, **tool control**, **reliability**, **evals**, / and **cost / latency**. / That is where my proof is.",
        vi: "Vì role 70% AI vẫn cần người làm AI chạy được trong production: retrieval, tool control, reliability, eval, và cost / latency. Đó là chỗ mình có bằng chứng.",
      },
      {
        id: 'example',
        en: "*For proof,* / I shipped **hybrid retrieval** with ranking, fallback, and permission checks. / I built **StrangeLoop** agent workflows with LLM, tools, approval, and data scope. / I also owned an **OCR production issue** / and moved heavy inference to **GPU**.",
        vi: "Bằng chứng: mình ship hybrid retrieval với ranking, fallback và permission. Mình xây StrangeLoop agent workflow với LLM, tool, approval và data scope. Mình cũng sở hữu sự cố OCR production và chuyển inference nặng sang GPU.",
      },
      {
        id: 'close',
        en: "*So* / the gap is not “no AI.” / The gap is fewer years under an AI-only title. / The **production AI work is already real**, / so I can grow the deeper AI side quickly on that foundation.",
        vi: "Vậy gap không phải “không có AI.” Gap là ít năm dưới title AI-only. Việc production AI đã thật, nên mình có thể đào sâu phần AI nhanh trên nền đó.",
      },
    ] },
    contextIds: ['A', 'B', 'D', 'I'],
    clusterIds: ['rag', 'ocr', 'production-ai', 'gap'],
    storyIds: ['hybrid-rag', 'ocr-cpu-gpu'],
    routeIds: ['gap-transfer', 'hybrid-retrieval', 'strangeloop-agent', 'ocr-incident'],
    memory: { nodes: [
      { id: 'hire-frame', label: 'SELL SHIPPED AI', triggers: ['backend years', 'not AI title years', 'applied AI shipped'], answerSectionId: 'point' },
      { id: 'role-needs', label: '70% AI = PRODUCTION', triggers: ['retrieval', 'tool control', 'reliability / evals'], answerSectionId: 'reason' },
      { id: 'proof-trio', label: 'PROOF TRIO', triggers: ['hybrid retrieval', 'StrangeLoop', 'OCR → GPU'], answerSectionId: 'example' },
      { id: 'gap-reframe', label: 'GAP REFRAME', triggers: ['not no AI', 'fewer AI-title years', 'grow on foundation'], answerSectionId: 'close' },
    ] }
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
        en: "*Yes,* / I have **hands-on experience with tool calling**, / especially on the **backend control side**.",
        vi: "*Có,* / mình có **kinh nghiệm thực tế với tool calling**, / đặc biệt ở phần **backend control**.",
      },
      {
        id: 'reason',
        en: "*For example,* / in **Clincove**, / the model can use read-only tools like **search** / and **document read**.",
        vi: "*Ví dụ,* / trong **Clincove**, / model có thể dùng tool read-only như **search** / và **document read**.",
      },
      {
        id: 'example',
        en: "*Then* / I would expose a small set of **backend tools**. / The model can decide which tool it needs. / But the backend still defines the **tool contract**, / validates the **arguments**, / and checks **permission** before doing it.",
        vi: "*Sau đó* / mình expose một tập nhỏ **backend tool**. / Model có thể quyết định tool nào cần. / Nhưng backend vẫn định nghĩa **tool contract**, / validate **arguments**, / và check **permission** trước khi thực hiện.",
      },
      {
        id: 'result',
        en: "*For the interface,* / we design the **tool interface** / in a familiar way for the LLM, / like a **file system** / with **search and read**, / because this usually helps the model perform better.",
        vi: "*Về interface,* / tụi mình thiết kế **tool interface** theo cách quen với LLM, / giống **file system** / có **search và read**, / vì cách này thường giúp model chạy tốt hơn.",
      },
      {
        id: 'close',
        en: "*For tracking,* / I keep clear **logs** / with the important **IDs**, **status**, **errors**, / and **performance metrics**, / such as **latency**, **processing time**, / and **memory usage**. / This helps me **monitor the system**, / find what went wrong, / and **debug problems more easily**.",
        vi: "Về tracking, mình giữ log rõ ràng với ID, trạng thái, lỗi và các chỉ số hiệu năng như latency, thời gian xử lý và memory usage. Điều này giúp mình theo dõi hệ thống, tìm lỗi và debug dễ hơn.",
      },
      {
        id: 'tool-safety',
        en: "*For tool safety,* / I also worked on **audit logs**, **tracing**, **citations**, / and **final-response validation**.",
        vi: "Về tool safety, mình cũng làm audit log, tracing, citation, và final-response validation.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I directly worked on the **Clincove tool-calling flow**, / and I also understand and can modify parts of the **StrangeLoop engine** when needed.",
        vi: "*Tóm lại,* / mình trực tiếp làm trên **Clincove tool-calling flow**, / và cũng hiểu, có thể sửa một số phần của **StrangeLoop engine** khi cần.",
      },
    ] },
    contextIds: ['E', 'H'],
    clusterIds: ['tool-calling', 'tool-safety'],
    routeIds: ['tool-control', 'strangeloop-agent'],
    memory: { nodes: [
      { id: 'hands-on', label: 'HANDS-ON TOOLING', triggers: ['tool calling', 'backend control'], answerSectionId: 'point' },
      { id: 'search-read', label: 'SEARCH + READ', triggers: ['Clincove', 'read-only tools', 'search / document read'], answerSectionId: 'reason' },
      { id: 'BACKEND-CONTROL', label: 'BACKEND CONTROL', triggers: ['choose tool', 'tool contract', 'permission', 'structured result'], answerSectionId: 'example' },
      { id: 'FAMILIAR-INTERFACE', label: 'FAMILIAR INTERFACE', triggers: ['LLM-friendly', 'file system', 'search and read'], answerSectionId: 'result' },
      { id: 'tracking', label: 'TRACKING', triggers: ['clear logs', 'IDs / status / errors', 'latency / processing time / memory'], answerSectionId: 'close' },
      { id: 'tool-safety', label: 'TOOL SAFETY', triggers: ['audit logs', 'tracing', 'citations', 'final validation'], answerSectionId: 'tool-safety' },
      { id: 'ENGINE', label: 'UNDERSTAND ENGINE', triggers: ['Clincove flow', 'StrangeLoop engine', 'modify when needed'], answerSectionId: 'extra' },
    ] }
  },
  {
    id: 11,
    question: {
      en: "You haven't used our exact AI stack. How do you learn a new language or stack quickly?",
      vi: 'Bạn chưa dùng đúng stack AI của tụi mình. Bạn học ngôn ngữ hoặc stack mới nhanh như thế nào?',
    },
    answer: { sections: [
      {
        id: 'point',
        en: "*For me,* / I learn a **new language or stack** / by connecting it to **problems I already know**.",
        vi: "Với mình, học ngôn ngữ hoặc stack mới là nối nó với các vấn đề mình đã hiểu.",
      },
      {
        id: 'reason',
        en: "*That's because* / the **tool may change**, / but many **core problems stay the same**.",
        vi: "Vì tool có thể đổi, nhưng nhiều vấn đề cốt lõi vẫn giống.",
      },
      {
        id: 'example',
        en: "*For example,* / when I learn **Temporal**, / I map it to **retries**, **checkpoints**, **state**, / and **long-running workflows**.",
        vi: "Ví dụ, khi học Temporal, mình map sang retry, checkpoint, state, và workflow chạy lâu.",
      },
      {
        id: 'result',
        en: "*The same way,* / I moved from backend work / into **OCR**, **retrieval**, **LLM**, / and **GPU inference**.",
        vi: "Cùng cách đó, mình chuyển từ backend sang OCR, retrieval, LLM và GPU inference.",
      },
      {
        id: 'close',
        en: "*So* / I still need to learn the **new APIs**. / But I do not relearn the **fundamentals**, / so I can adapt fairly quickly.",
        vi: "Vậy mình vẫn phải học API mới. Nhưng không phải học lại nền tảng, nên thích nghi khá nhanh.",
      },
    ] },
    contextIds: ['A', 'F', 'I'],
    clusterIds: ['workflow', 'gap'],
    routeIds: ['gap-transfer'],
    memory: { nodes: [
      { id: 'learn-by-problems', label: 'LEARN BY PROBLEMS', triggers: ['new language / stack', 'problems I know'], answerSectionId: 'point' },
      { id: 'core-same', label: 'CORE STAYS', triggers: ['tool may change', 'core problems same'], answerSectionId: 'reason' },
      { id: 'temporal-bridge', label: 'TEMPORAL BRIDGE', triggers: ['retries', 'checkpoints', 'state / workflows'], answerSectionId: 'example' },
      { id: 'ai-transition', label: 'SAME PATH', triggers: ['OCR', 'retrieval', 'LLM / GPU'], answerSectionId: 'result' },
      { id: 'adapt', label: 'ADAPT FAST', triggers: ['new APIs', 'fundamentals transfer'], answerSectionId: 'close' },
    ] }
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
        en: "*For me,* / I would start with the **user goal** / and keep the agent inside a **clear workflow**. / It should only work with **authorized context**.",
        vi: "*Với mình,* / mình bắt đầu từ **mục tiêu user** / và giữ agent trong một **workflow rõ ràng**. / Chỉ dùng **context được phép**.",
      },
      {
        id: 'reason',
        en: "*That's because* / I would not send the **whole database** to the model. / I would only retrieve the **relevant and authorized context** / for that user.",
        vi: "*Vì* / mình không gửi **cả database** cho model. / Chỉ lấy **context liên quan và được phép** / cho đúng user đó.",
      },
      {
        id: 'example',
        en: "*For example,* / if a user asks about **training progress**, / the agent may need the **user profile**, **recent workouts**, **goals**, / and **progress metrics**.",
        vi: "*Ví dụ,* / nếu user hỏi về **tiến độ tập**, / agent có thể cần **profile**, **lịch sử tập gần đây**, **mục tiêu**, / và **chỉ số tiến độ**.",
      },
      {
        id: 'result',
        en: "*Then* / I would expose a small set of **backend tools**. / The model can decide which tool it needs. / But the backend still defines the **tool contract**, / validates the **arguments**, / and checks **permission** before doing it.",
        vi: "*Sau đó* / mình expose một tập nhỏ **backend tool**. / Model có thể quyết định tool nào cần. / Nhưng backend vẫn định nghĩa **tool contract**, / validate **arguments**, / và check **permission** trước khi thực hiện.",
      },
      {
        id: 'close',
        en: "*This is similar to* what I worked with in **Clincove**, / where the agent could **search and read documents** / through **controlled backend tools**. / The backend kept control of the **access scope** and **permissions**.",
        vi: "*Cách này giống* những gì mình làm ở **Clincove**, / nơi agent có thể **search và đọc document** / qua **backend tool có kiểm soát**. / Backend giữ quyền kiểm soát **access scope** và **permission**.",
      },
      {
        id: 'extra',
        en: "*For tracking,* / I keep clear **logs** / with the important **IDs**, **status**, **errors**, / and **performance metrics**, / such as **latency**, **processing time**, / and **memory usage**. / This helps me **monitor the system**, / find what went wrong, / and **debug problems more easily**.",
        vi: "Về tracking, mình giữ log rõ ràng với ID, trạng thái, lỗi và các chỉ số hiệu năng như latency, thời gian xử lý và memory usage. Điều này giúp mình theo dõi hệ thống, tìm lỗi và debug dễ hơn.",
      },
      {
        id: 'reliability-evals',
        en: "*I would also* / use **retry and recovery** where needed / and add **regression and eval cases** / for important workflows.",
        vi: "Mình cũng dùng retry và recovery khi cần, rồi thêm regression và eval case cho các workflow quan trọng.",
      },
      {
        id: 'section-7',
        en: "*So overall,* / the model can decide which tool it needs. / But the backend still defines the **tool contract**, / validates the **arguments**, / and checks **permission** before doing it.",
        vi: "*Tóm lại,* / model có thể quyết định tool nào cần. / Nhưng backend vẫn định nghĩa **tool contract**, / validate **arguments**, / và check **permission** trước khi thực hiện.",
      },
    ] },
    contextIds: ['C', 'E', 'F', 'G', 'H'],
    clusterIds: ['error-handling', 'observability', 'workflow', 'tool-calling', 'tool-safety', 'quality'],
    routeIds: ['strangeloop-agent', 'tool-control'],
    memory: { nodes: [{ id: 'goal-context', label: 'GOAL → CONTEXT', triggers: ['user goal', 'authorized context', 'clear workflow'], answerSectionId: 'point' }, { id: 'backend-tools', label: 'BACKEND TOOLS', triggers: ['tool contract', 'permission', 'structured result'], answerSectionId: 'result' }, { id: 'tracking', label: 'TRACKING', triggers: ['clear logs', 'IDs / status / errors', 'latency / processing time / memory'], answerSectionId: 'extra' }, { id: 'reliability-evals', label: 'RETRY + EVALS', triggers: ['retry / recovery', 'regression', 'eval cases'], answerSectionId: 'reliability-evals' }, { id: 'backend-control', label: 'BACKEND CONTROL', triggers: ['data', 'permissions', 'execution', 'reliability'], answerSectionId: 'section-7' }] }
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
        en: "*For me,* / I try to control **latency** and **cost** / in several layers.",
        vi: "*Với mình,* / mình kiểm soát **latency** và **chi phí** / ở nhiều lớp.",
      },
      {
        id: 'reason',
        en: "*That's because* / every extra **model call**, extra **token**, / or unnecessary **retry** / can make the system slower and more expensive.",
        vi: "*Vì* / mỗi lần gọi **model** thừa, mỗi **token** thừa, / hoặc **retry** không cần / đều làm hệ thống chậm hơn và đắt hơn.",
      },
      {
        id: 'example',
        en: "*For example,* / I use normal **backend logic**, **filtering**, and **retrieval** / instead of asking the model to do everything. / In **Clincove**, / I also worked with **prompt caching** / so we could reuse stable context / instead of processing the same context again.",
        vi: "*Ví dụ,* / mình dùng **logic backend**, **filtering**, và **retrieval** thông thường / thay vì bắt model làm hết. / Ở **Clincove**, / mình cũng làm **prompt caching** / để tái sử dụng context ổn định / thay vì xử lý lại cùng một context.",
      },
      {
        id: 'result',
        en: "*So* / I also try to keep the **context small** / and retrieve only the **relevant and authorized data** / instead of sending everything to the model.",
        vi: "*Vậy* / mình cũng giữ **context nhỏ** / và chỉ lấy **data liên quan, được phép** / thay vì gửi hết cho model.",
      },
      {
        id: 'close',
        en: "*For reliability,* / I use **timeouts** and bounded **retries**. / I only retry temporary errors like **timeouts**, **rate limits**, / or **provider overload**, / and I avoid retrying permanent errors.",
        vi: "*Về độ tin cậy,* / mình dùng **timeout** và **retry** có giới hạn. / Chỉ retry lỗi tạm thời như **timeout**, **rate limit**, / hoặc **provider quá tải**, / và tránh retry lỗi vĩnh viễn.",
      },
      {
        id: 'extra',
        en: "*For longer workflows,* / I also use **checkpoint** and **recovery**, / so if one part fails, / we can continue from the completed part / instead of running the whole job again.",
        vi: "*Với workflow dài hơn,* / mình cũng dùng **checkpoint** và **recovery**, / nên nếu một phần lỗi, / tụi mình tiếp tục từ phần đã xong / thay vì chạy lại cả job.",
      },
      {
        id: 'section-7',
        en: "*For tracking,* / I keep clear **logs** / with the important **IDs**, **status**, **errors**, / and **performance metrics**, / such as **latency**, **processing time**, / and **memory usage**. / This helps me **monitor the system**, / find what went wrong, / and **debug problems more easily**.",
        vi: "Về tracking, mình giữ log rõ ràng với ID, trạng thái, lỗi và các chỉ số hiệu năng như latency, thời gian xử lý và memory usage. Điều này giúp mình theo dõi hệ thống, tìm lỗi và debug dễ hơn.",
      },
      {
        id: 'optimization',
        en: "*For optimization,* / I also compare the **model used**, **token usage**, **retry attempts**, / and **estimated cost** / to decide what to optimize next.",
        vi: "Về tối ưu, mình cũng so sánh model, token usage, số lần retry và chi phí ước tính để quyết định tối ưu phần nào tiếp theo.",
      },
    ] },
    contextIds: ['C', 'F'],
    clusterIds: ['error-handling', 'observability', 'production-ai', 'workflow'],
    storyIds: ['llm-reliability'],
    routeIds: ['llm-reliability'],
    memory: { nodes: [
      { id: 'reduce-work', label: 'REDUCE AI WORK', triggers: ['backend logic', 'filtering', 'retrieval', 'prompt cache'], answerSectionId: 'example' },
      { id: 'cache-context', label: 'CACHE + CONTEXT', triggers: ['smaller context', 'authorized data', 'reuse stable context'], answerSectionId: 'result' },
      { id: 'measure-recover', label: 'RECOVER + MEASURE', triggers: ['timeout / retry', 'rate limits', 'temporary errors'], answerSectionId: 'close' },
      { id: 'tracking', label: 'TRACKING', triggers: ['clear logs', 'IDs / status / errors', 'latency / processing time / memory'], answerSectionId: 'section-7' },
      { id: 'measure', label: 'OPTIMIZE', triggers: ['model used', 'token usage', 'retry attempts', 'estimated cost'], answerSectionId: 'optimization' },
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
        vi: "*Với mình,* / bước đầu là đưa model **context đúng và vừa đủ**.",
      },
      {
        id: 'reason',
        en: "*That's because* / a good answer depends on getting the **right information** first. / If retrieval is wrong, / the final answer may also be wrong.",
        vi: "*Vì* / câu trả lời tốt trước hết phải lấy được **đúng thông tin**. / Nếu retrieval sai, / câu trả lời cuối cũng dễ sai.",
      },
      {
        id: 'example',
        en: "*For example,* / for knowledge-based questions, / I use **retrieval** / to get the **right evidence** / instead of only using the model's own knowledge.",
        vi: "*Ví dụ,* / với câu hỏi dựa trên kiến thức, / mình dùng **retrieval tốt** / và **evidence liên quan** / thay vì chỉ dựa kiến thức sẵn của model.",
      },
      {
        id: 'result',
        en: "*Then* / I use **structured output** and **backend checks** / when the system uses the result. / The model can decide which tool it needs. / But the backend still defines the **tool contract**, / validates the **arguments**, / and checks **permission** before doing it.",
        vi: "*Sau đó* / mình dùng **structured output** / và **backend validation** / khi hệ thống dùng kết quả. / Model có thể quyết định tool nào cần. / Nhưng backend vẫn định nghĩa **tool contract**, / validate **arguments**, / và check **permission** trước khi thực hiện.",
      },
      {
        id: 'settings',
        en: "*For model settings,* / I adjust them based on the task. / *For example,* / for factual tasks, / I use a **lower temperature** / so the answer is more consistent / and less random.",
        vi: "*Về model settings,* / mình điều chỉnh theo từng task. / *Ví dụ,* / với các task factual, / mình dùng **temperature thấp hơn** / để câu trả lời ổn định hơn / và ít random hơn.",
      },
      {
        id: 'close',
        en: "*For important cases,* / I use **eval cases**. / If the model is uncertain, / I **ask the user**. / For important or risky actions, / I require the user to **confirm**. / Otherwise, / I use a **safe fallback** / instead of guessing.",
        vi: "*Với case quan trọng,* / mình dùng **eval cases**. / Nếu model không chắc, / mình **hỏi người dùng**. / Với action quan trọng hoặc có rủi ro, / mình yêu cầu người dùng **xác nhận**. / Nếu không, / mình dùng **safe fallback** / thay vì để model đoán.",
      },
      {
        id: 'extra',
        en: "*So overall,* / we cannot completely remove **hallucination**, / but we can reduce it / with good **context**, **backend checks**, **model settings**, / and **safe fallback**.",
        vi: "*Tóm lại,* / hallucination không thể bỏ hết, / nhưng tụi mình có thể **giảm rủi ro** / bằng context tốt hơn, / retrieval, / validation, / model setting phù hợp, / eval, / và **safe fallback**.",
      },
    ] },
    contextIds: ['B', 'C', 'G', 'H'],
    clusterIds: ['rag', 'quality', 'tool-safety'],
    routeIds: ['hybrid-retrieval'],
    memory: { nodes: [
      { id: 'right-context', label: 'RIGHT CONTEXT', triggers: ['right and limited context'], answerSectionId: 'point' },
      { id: 'retrieval-evidence', label: 'RETRIEVAL + EVIDENCE', triggers: ['knowledge-based questions', 'good retrieval', 'relevant evidence'], answerSectionId: 'example' },
      { id: 'backend-validation', label: 'BACKEND VALIDATION', triggers: ['structured output', 'business rules', 'permissions'], answerSectionId: 'result' },
      { id: 'model-settings', label: 'MODEL SETTINGS', triggers: ['factual tasks', 'lower temperature', 'less random'], answerSectionId: 'settings' },
      { id: 'safe-uncertainty', label: 'SAFE UNCERTAINTY', triggers: ['eval cases', 'clarification', 'confirmation', 'safe fallback'], answerSectionId: 'close' },
      { id: 'risk-control', label: 'RISK CONTROL', triggers: ['reduce the risk', 'validation', 'proper model settings'], answerSectionId: 'extra' },
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
        en: "*For me,* / I check a RAG system at **three levels**: / **retrieval**, **answer quality**, / and **runtime**.",
        vi: "*Với mình,* / mình đánh giá RAG ở **ba mức**: / **retrieval**, **chất lượng câu trả lời**, / và **runtime**.",
      },
      {
        id: 'reason',
        en: "*That's because* / a good answer depends on getting the **right information** first. / If retrieval is wrong, / the final answer may also be wrong.",
        vi: "*Vì* / câu trả lời tốt trước hết phải lấy được **đúng thông tin**. / Nếu retrieval sai, / câu trả lời cuối cũng dễ sai.",
      },
      {
        id: 'example',
        en: "*For example,* / in Clincove, I worked on **hybrid retrieval** / using **PostgreSQL search**, **pgvector**, / and **RRF**. / I tested the **ranking** / and **fallback behavior** / to make sure the system could find the right information.",
        vi: "*Ví dụ,* / trong Clincove, mình làm **hybrid retrieval** / với **PostgreSQL search**, **pgvector**, / và **RRF**. / Mình kiểm **ranking** / và **fallback behavior** / để chắc hệ thống tìm đúng thông tin.",
      },
      {
        id: 'result',
        en: "*For the final answer,* / I check whether it is **grounded in the real source**, / with correct **citations** / and **provenance**.",
        vi: "*Với câu trả lời cuối,* / mình kiểm xem nó có **dựa trên nguồn thật** không, / với **citation** / và **provenance** đúng.",
      },
      {
        id: 'close',
        en: "*For tracking,* / I keep clear **logs** / with the important **IDs**, **status**, **errors**, / and **performance metrics**, / such as **latency**, **processing time**, / and **memory usage**. / This helps me **monitor the system**, / find what went wrong, / and **debug problems more easily**.",
        vi: "Về tracking, mình giữ log rõ ràng với ID, trạng thái, lỗi và các chỉ số hiệu năng như latency, thời gian xử lý và memory usage. Điều này giúp mình theo dõi hệ thống, tìm lỗi và debug dễ hơn.",
      },
      {
        id: 'runtime-stability',
        en: "*For runtime stability,* / I also check **failures** / and **fallback behavior**.",
        vi: "Về độ ổn định runtime, mình cũng kiểm failures và fallback behavior.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I look at **retrieval**, **answer quality**, / and **runtime**. / For a more formal evaluation, / I would also use a **labeled dataset** / and metrics like **Recall@K** / or **MRR**.",
        vi: "*Tóm lại,* / mình nhìn **retrieval**, **answer quality**, / và **runtime**. / Nếu đánh giá formal hơn, / mình dùng thêm **labeled dataset** / và metric như **Recall@K** / hoặc **MRR**.",
      },
    ] },
    contextIds: ['B', 'C', 'G'],
    clusterIds: ['rag', 'quality', 'observability', 'production-ai'],
    storyIds: ['hybrid-rag'],
    routeIds: ['hybrid-retrieval'],
    memory: { nodes: [
      { id: 'three-levels', label: 'THREE LEVELS', triggers: ['retrieval', 'answer quality', 'runtime'], answerSectionId: 'point' },
      { id: 'right-information', label: 'RIGHT INFORMATION', triggers: ['right information', 'retrieval wrong', 'final answer wrong'], answerSectionId: 'reason' },
      { id: 'hybrid-retrieval', label: 'HYBRID RETRIEVAL', triggers: ['Clincove', 'PostgreSQL / pgvector / RRF', 'ranking / fallback'], answerSectionId: 'example' },
      { id: 'grounded-answer', label: 'GROUNDED ANSWER', triggers: ['real source', 'citations', 'provenance'], answerSectionId: 'result' },
      { id: 'tracking', label: 'TRACKING', triggers: ['clear logs', 'IDs / status / errors', 'latency / processing time / memory'], answerSectionId: 'close' },
      { id: 'runtime-stability', label: 'RUNTIME STABILITY', triggers: ['failures', 'fallback behavior'], answerSectionId: 'runtime-stability' },
      { id: 'formal-evaluation', label: 'FORMAL EVALUATION', triggers: ['labeled dataset', 'Recall@K', 'MRR'], answerSectionId: 'extra' },
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
        en: "*For me,* / I start with **least privilege**. / The agent should only have the **tools it really needs**.",
        vi: "*Với mình,* / mình bắt đầu với **least privilege**. / Agent chỉ nên có **tool mà nó thực sự cần**.",
      },
      {
        id: 'reason',
        en: "*That's because* / the model should not have direct access to **internal services** / or **databases**.",
        vi: "*Vì* / model không nên truy cập trực tiếp vào **internal service** / hoặc **database**.",
      },
      {
        id: 'example',
        en: "*Then* / I would expose a small set of **backend tools**. / The model can decide which tool it needs. / But the backend still defines the **tool contract**, / validates the **arguments**, / and checks **permission** before doing it.",
        vi: "*Sau đó* / mình expose một tập nhỏ **backend tool**. / Model có thể quyết định tool nào cần. / Nhưng backend vẫn định nghĩa **tool contract**, / validate **arguments**, / và check **permission** trước khi thực hiện.",
      },
      {
        id: 'result',
        en: "*For sensitive actions,* / I would also require **user confirmation** / when needed.",
        vi: "*Với action nhạy cảm,* / mình cũng yêu cầu **user confirmation** / khi cần.",
      },
      {
        id: 'close',
        en: "*For tracking,* / I keep clear **logs** / with the important **IDs**, **status**, **errors**, / and **performance metrics**, / such as **latency**, **processing time**, / and **memory usage**. / This helps me **monitor the system**, / find what went wrong, / and **debug problems more easily**.",
        vi: "Về tracking, mình giữ log rõ ràng với ID, trạng thái, lỗi và các chỉ số hiệu năng như latency, thời gian xử lý và memory usage. Điều này giúp mình theo dõi hệ thống, tìm lỗi và debug dễ hơn.",
      },
      {
        id: 'safe-writes',
        en: "*For safe logging,* / I avoid **sensitive data**. / For write actions, / I use **idempotency** / so retries do not create **duplicates**.",
        vi: "Với log an toàn, mình tránh data nhạy cảm. Với thao tác ghi, mình dùng idempotency để retry không tạo bản trùng.",
      },
      {
        id: 'extra',
        en: "*So overall,* / the model can decide which tool it needs. / But the backend still defines the **tool contract**, / validates the **arguments**, / and checks **permission** before doing it.",
        vi: "*Tóm lại,* / model có thể quyết định tool nào cần. / Nhưng backend vẫn định nghĩa **tool contract**, / validate **arguments**, / và check **permission** trước khi thực hiện.",
      },
    ] },
    contextIds: ['H'],
    clusterIds: ['tool-calling', 'tool-safety'],
    routeIds: ['tool-control'],
    memory: { nodes: [{ id: 'least-privilege', label: 'LEAST PRIVILEGE', triggers: ['only needed tools', 'limited access'], answerSectionId: 'point' }, { id: 'backend-check', label: 'BACKEND CHECK', triggers: ['arguments', 'permission', 'access scope', 'final decision'], answerSectionId: 'example' }, { id: 'confirm-sensitive', label: 'USER CONFIRMATION', triggers: ['sensitive actions', 'user confirmation'], answerSectionId: 'result' }, { id: 'tracking', label: 'TRACKING', triggers: ['clear logs', 'IDs / status / errors', 'latency / processing time / memory'], answerSectionId: 'close' }, { id: 'safe-writes', label: 'SAFE WRITES', triggers: ['avoid sensitive data', 'idempotency', 'no duplicates'], answerSectionId: 'safe-writes' }, { id: 'backend-controls', label: 'LLM SUGGESTS', triggers: ['LLM can suggest', 'backend controls', 'access / execution / safety'], answerSectionId: 'extra' }] }
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
        en: 'In one case, / we had a problem / with **large PDF processing jobs**. / During **OCR**, / the **memory usage** kept increasing, / and eventually the worker crashed.',
        vi: "*Một ví dụ là* / sự cố production với **job xử lý PDF lớn**. / Trong lúc **OCR**, / **memory** tăng liên tục, / và cuối cùng worker crash.",
      },
      {
        id: 'reason',
        en: 'The first thing I wanted to do / was to find the **root cause**. / I did not want to assume / that the worker itself was the real problem.',
        vi: "*Vì* / mình không muốn giả định **worker** là nguyên nhân. / Mình muốn tìm **root cause** trước.",
      },
      {
        id: 'example',
        en: "*For tracking,* / I keep clear **logs** / with the important **IDs**, **status**, **errors**, / and **performance metrics**, / such as **latency**, **processing time**, / and **memory usage**. / This helps me **monitor the system**, / find what went wrong, / and **debug problems more easily**.",
        vi: "Về tracking, mình giữ log rõ ràng với ID, trạng thái, lỗi và các chỉ số hiệu năng như latency, thời gian xử lý và memory usage. Điều này giúp mình theo dõi hệ thống, tìm lỗi và debug dễ hơn.",
      },
      {
        id: 'investigation',
        en: 'Then, / I traced the whole **processing flow**. / This helped me see / which **batch** or **page** was slow, / and when the **memory usage became too high**. / From that, / I found that the main bottleneck / was the **OCR CPU inference**.',
        vi: "Sau đó, mình trace luồng xử lý. Điều này giúp mình thấy batch hoặc page nào chậm, khi memory quá cao, và bottleneck chính là OCR CPU inference.",
      },
      {
        id: 'result',
        en: 'Based on that, / I reduced the **batch size** / and **adjusted the settings** / for the **CPU path**. / I also used separate settings / for the **CPU path** and the **GPU path**, / so the system could still run reliably on CPU / before the GPU service was deployed.',
        vi: "*Vậy trước hết,* / mình làm luồng hiện tại ổn định hơn / bằng **batch nhỏ hơn** / và **checkpoint cùng recovery**, / nên nếu một bước lỗi / thì không phải chạy lại cả job.",
      },
      {
        id: 'close',
        en: 'For recovery, / I added **checkpoint and recovery logic**. / So if one step failed, / we could continue from the last checkpoint / instead of restarting the whole job.',
        vi: "*Sau đó* / mình xử lý phần **backend và workflow** / và phối hợp **DevOps** / để đưa OCR nặng / sang một **GPU service** tách riêng.",
      },
      {
        id: 'extra',
        en: 'Then, / I also worked on the **infrastructure side** / together with **DevOps** / to move the heavy OCR inference / to a **remote GPU service**.',
        vi: "*Tóm lại,* / mình không chỉ dừng crash. / Mình còn kiểm **ổn định worker**, **memory**, **tỉ lệ job hoàn tất**, / và **thời gian xử lý** / để chắc giải pháp mới **ổn định**, **quan sát được**, / và **an toàn khi roll out**.",
      },
      {
        id: 'rollout',
        en: 'So overall, / I did not only focus on stopping the crash. / I also checked **worker stability**, **memory usage**, **job completion**, / and **processing time** / to make sure the new solution was **stable** / and safe to roll out.',
        vi: '',
      },
    ] },
    contextIds: ['D'],
    clusterIds: ['ocr', 'workflow', 'observability'],
    routeIds: ['ocr-incident'],
    memory: { nodes: [{ id: 'incident', label: 'OCR INCIDENT', triggers: ['large PDF processing jobs', 'memory usage', 'worker crashed'], answerSectionId: 'point' }, { id: 'root-cause', label: 'ROOT CAUSE', triggers: ['do not assume', 'worker itself', 'root cause'], answerSectionId: 'reason' }, { id: 'tracking', label: 'TRACKING', triggers: ['clear logs', 'IDs / status / errors', 'latency / processing time / memory'], answerSectionId: 'example' }, { id: 'investigation', label: 'PROCESSING FLOW', triggers: ['batch or page', 'memory too high', 'OCR CPU inference'], answerSectionId: 'investigation' }, { id: 'stabilize', label: 'CPU PATH', triggers: ['batch size', 'adjusted settings', 'CPU and GPU paths'], answerSectionId: 'result' }, { id: 'recovery', label: 'CHECKPOINT + RECOVERY', triggers: ['last checkpoint', 'restart the whole job'], answerSectionId: 'close' }, { id: 'gpu-service', label: 'GPU SERVICE', triggers: ['infrastructure side', 'DevOps', 'remote GPU service'], answerSectionId: 'extra' }, { id: 'safe-rollout', label: 'SAFE ROLLOUT', triggers: ['worker stability', 'memory usage', 'job completion', 'processing time'], answerSectionId: 'rollout' }] }
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
        vi: "*Với mình,* / mình không giữ **HTTP request mở** / cho một job có thể chạy vài phút.",
      },
      {
        id: 'reason',
        en: "*That's because* / long-running work can take time or fail, / so I prefer to create a **job**, / save its **state**, / put the work into a **queue**, / and return a **job ID** to the client.",
        vi: "*Vì* / việc chạy lâu có thể tốn thời gian hoặc fail, / nên mình tạo **job**, / lưu **state**, / đẩy vào **queue**, / và trả **job ID** cho client.",
      },
      {
        id: 'example',
        en: "*For example,* / a **worker** can process the job in the background. / For a multi-step workflow, / I save the **result of each important step** / and use **checkpoints**, / so if one step fails, / I do not need to restart the whole workflow.",
        vi: "*Ví dụ,* / một **worker** xử lý job trong background. / Với workflow nhiều bước, / mình lưu **kết quả từng bước quan trọng** / và dùng **checkpoint**, / nên nếu một bước lỗi / thì không phải chạy lại cả workflow.",
      },
      {
        id: 'result',
        en: "*So* / I can clearly separate **temporary errors from permanent errors**, / add **retries** for temporary failures, / and keep external actions **idempotent**.",
        vi: "*Vậy* / mình tách rõ **lỗi tạm thời và lỗi vĩnh viễn**, / **retry** lỗi tạm thời, / và giữ action ngoài **idempotent**.",
      },
      {
        id: 'close',
        en: "*For tracking,* / I keep clear **logs** / with the important **IDs**, **status**, **errors**, / and **performance metrics**, / such as **latency**, **processing time**, / and **memory usage**. / This helps me **monitor the system**, / find what went wrong, / and **debug problems more easily**.",
        vi: "Về tracking, mình giữ log rõ ràng với ID, trạng thái, lỗi và các chỉ số hiệu năng như latency, thời gian xử lý và memory usage. Điều này giúp mình theo dõi hệ thống, tìm lỗi và debug dễ hơn.",
      },
      {
        id: 'job-status',
        en: "*For the job itself,* / I keep the **job status** clear, / for example **queued**, **running**, **completed**, / or **failed**.",
        vi: "Với chính job đó, mình giữ trạng thái rõ ràng, ví dụ queued, running, completed hoặc failed.",
      },
      {
        id: 'extra',
        en: "*So overall,* / for a more complex workflow, / I may use something like **Temporal** / because it helps manage **workflow state**, **retries**, **timers**, / and **recovery**.",
        vi: "*Tóm lại,* / với workflow phức tạp hơn, / mình có thể dùng **Temporal** / vì nó giúp quản lý **workflow state**, **retry**, **timer**, / và **recovery**.",
      },
    ] },
    contextIds: ['F'],
    clusterIds: ['error-handling', 'workflow', 'observability'],
    routeIds: ['llm-reliability'],
    memory: { nodes: [{'id': 'async-job', 'label': 'ASYNC JOB', 'triggers': ['job ID', 'queue', 'worker'], 'answerSectionId': 'point'}, {'id': 'durable-state', 'label': 'STATE + CHECKPOINT', 'triggers': ['job state', 'result of each step', 'checkpoint'], 'answerSectionId': 'example'}, {'id': 'recovery', 'label': 'RECOVERY', 'triggers': ['retry', 'idempotent', 'Temporal'], 'answerSectionId': 'result'}, {'id': 'tracking', 'label': 'TRACKING', 'triggers': ['clear logs', 'IDs / status / errors', 'latency / processing time / memory'], 'answerSectionId': 'close'}, {'id': 'job-status', 'label': 'JOB STATUS', 'triggers': ['queued / running', 'completed / failed'], 'answerSectionId': 'job-status'}] }
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
        vi: "*Với mình,* / khi không đồng tình một **quyết định kỹ thuật**, / mình tìm hiểu trước **vì sao team chọn nó**.",
      },
      {
        id: 'reason',
        en: "*That's because* / sometimes the decision is not only about technology. / It can also be about **delivery time**, **risk**, **existing architecture**, / or **business priority**.",
        vi: "*Vì* / đôi khi quyết định không chỉ về công nghệ. / Nó còn về **deadline**, **rủi ro**, **kiến trúc hiện có**, / hoặc **ưu tiên business**.",
      },
      {
        id: 'example',
        en: "*For example,* / if I think another approach is better, / I do not just say the current one is wrong. / I bring **evidence** like logs, performance data, code behavior, failure cases, / or maintenance cost.",
        vi: "*Ví dụ,* / nếu mình nghĩ cách khác tốt hơn, / mình không chỉ nói cách hiện tại sai. / Mình mang **evidence** như log, số liệu performance, hành vi code, failure case, / hoặc chi phí bảo trì.",
      },
      {
        id: 'result',
        en: "*So* / I can explain the **trade-offs** more clearly / and usually give the team **more than one option** to consider.",
        vi: "*Vậy* / mình giải thích **trade-off** rõ hơn / và thường đưa team **nhiều hơn một phương án** để cân nhắc.",
      },
      {
        id: 'close',
        en: "*Then,* / once the team makes a decision, / I support it and help **execute it**. / If we are still not sure, / I prefer a **small test or controlled rollout** / to collect more evidence.",
        vi: "*Sau đó,* / khi team đã chốt, / mình ủng hộ và giúp **thực thi**. / Nếu vẫn chưa chắc, / mình ưu tiên **test nhỏ hoặc rollout có kiểm soát** / để thu thêm evidence.",
      },
      {
        id: 'extra',
        en: "*So overall,* / a good technical disagreement is not about **winning an argument**. / It is about making a **clearer decision** / and getting a **better result for the system**.",
        vi: "*Tóm lại,* / tranh luận kỹ thuật tốt không phải để **thắng**. / Nó là để ra **quyết định rõ hơn** / và có **kết quả tốt hơn cho hệ thống**.",
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
        en: '*My main background is* **backend systems**, / especially **APIs**, **databases**, **background jobs**, **integrations**, / and **production reliability**.',
        vi: '',
      },
      {
        id: 'recent',
        en: '*Recently,* / I’ve been working more with **AI-related features** / such as **OCR**, **document processing**, **retrieval**, **LLM integration**, / and **AI workflows**.',
        vi: '',
      },
      {
        id: 'ownership',
        en: '*In my current project,* / I mainly work on the **backend side**, / but I also take ownership of some important **AI features** / and work closely with **DevOps** and **frontend** engineers when needed.',
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
    clusterIds: [],
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
        en: "*That's because* / this position combines **backend work with AI**, / so it matches what I want to do next.",
        vi: '',
      },
      {
        id: 'recent',
        en: '*For example,* / recently I’ve had some chances to work on **AI-related features in real products**, / and I found that I really enjoy this direction.',
        vi: '',
      },
      {
        id: 'everfit',
        en: '*I also like Everfit because* / it is a **global product** in the **health and fitness** area, / and it has **real users** and **real impact**.',
        vi: '',
      },
      {
        id: 'challenge',
        en: '*So* / I feel this is a good place for me to **learn more**, / take on a **new challenge**, / and **step out of my comfort zone**.',
        vi: '',
      },
      {
        id: 'contribution',
        speakingCue: 'I believe my backend experience can help me',
        en: '*Also,* / I believe my **backend experience** can help me **contribute from the beginning**.',
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
  {
    id: 22,
    question: {
      en: 'Can you describe your recent project?',
      vi: 'Bạn có thể mô tả dự án gần đây của mình không?',
    },
    answer: { sections: [
      { id: 'point', en: 'Recently, / I have been working on a **clinical trial management system** / for a US-based company.', vi: '*Gần đây,* / mình đang làm một **hệ thống quản lý thử nghiệm lâm sàng** / cho một công ty tại Mỹ.' },
      { id: 'reason', en: 'My main role is **backend development**. / I work mainly with **NestJS** and **PostgreSQL**. / Recently, I also worked a lot with **AI features**.', vi: '' },
      { id: 'example', en: 'On the AI side, / I mainly worked on two areas: / our **document processing system**, / and an **AI agent workflow system** called **StrangeLoop**.', vi: '' },
      { id: 'document-processing', en: 'For document processing, / we use **OCR**, **chunking**, and **embeddings** / to prepare clinical documents / for different AI use cases.', vi: '' },
      { id: 'protocol-ai', en: 'The first use case is **Protocol AI**. / It helps users search and ask questions / about clinical protocols and medical documents. / We use **keyword search** and **vector search** / to find the right information for the **LLM**.', vi: '' },
      { id: 'smr-edc', en: 'The second use case is **SMR to EDC**. / SMR means source medical records, / such as patient documents from a clinical site. / EDC is where clinical trial data is stored and managed.', vi: '' },
      { id: 'suggest-edc', en: 'In this flow, / we get information from source medical records / and suggest values for different EDC fields. / We also keep the evidence and citation, / so users can review the values / before saving them to EDC.', vi: '' },
      { id: 'gpu', en: 'For OCR, / I also worked with DevOps / to move the processing / to a separate **GPU service**. / This helped us improve the performance a lot.', vi: '' },
      { id: 'strangeloop', en: 'For StrangeLoop, / we use it to build AI workflows. / The agent can make decisions, / use different tools, / and connect with backend services / to complete a task.', vi: '' },
      { id: 'control', en: 'The model can decide which tool it needs, / but the backend still defines the **tool contract**, / checks the arguments, / and checks permission before doing it.', vi: '' },
      { id: 'overall', en: 'So overall, / this project gives me experience / in backend development, RAG, AI document processing, / GPU, and AI agent workflows.', vi: '' },
    ] },
    contextIds: ['A', 'D', 'E'],
    clusterIds: ['production-ai', 'ocr', 'workflow', 'tool-calling'],
    storyIds: ['ocr-cpu-gpu'],
    routeIds: ['ocr-incident'],
    memory: { nodes: [
      { id: 'clinical-system', label: 'CLINICAL SYSTEM', triggers: ['clinical trial management', 'US-based company'], answerSectionId: 'point' },
      { id: 'backend-role', label: 'BACKEND ROLE', triggers: ['NestJS', 'PostgreSQL', 'AI features'], answerSectionId: 'reason' },
      { id: 'document-processing', label: 'DOCUMENT PROCESSING', triggers: ['OCR', 'chunking', 'embeddings'], answerSectionId: 'document-processing' },
      { id: 'protocol-ai', label: 'PROTOCOL AI', triggers: ['keyword search', 'vector search', 'LLM'], answerSectionId: 'protocol-ai' },
      { id: 'smr-edc', label: 'SMR TO EDC', triggers: ['source medical records', 'EDC fields', 'evidence and citation'], answerSectionId: 'smr-edc' },
      { id: 'gpu-solution', label: 'GPU SERVICE', triggers: ['DevOps', 'OCR processing', 'GPU service'], answerSectionId: 'gpu' },
      { id: 'strangeloop', label: 'STRANGELOOP', triggers: ['AI workflows', 'tools', 'backend services'], answerSectionId: 'strangeloop' },
      { id: 'backend-control', label: 'BACKEND CONTROL', triggers: ['tool contract', 'arguments', 'permission'], answerSectionId: 'control' },
      { id: 'production-experience', label: 'PROJECT EXPERIENCE', triggers: ['backend development', 'RAG', 'AI agent workflows'], answerSectionId: 'overall' },
    ] },
  },
  {
    id: 23,
    question: {
      en: 'How is StrangeLoop different from LangChain or LangGraph?',
      vi: 'StrangeLoop khác LangChain hoặc LangGraph như thế nào?',
    },
    answer: { sections: [
      { id: 'point', en: '*At a high level,* / **LangChain** gives higher-level building blocks / for models, prompts, tools, / and middleware.', vi: '*Ở mức khái quát,* / **LangChain** cung cấp các building block cấp cao hơn / cho model, prompt, tool, / và middleware.' },
      { id: 'reason', en: '*LangGraph is more about* / lower-level, stateful orchestration / for long-running workflows, / with durable execution / and human-in-the-loop support.', vi: '*LangGraph tập trung hơn vào* / orchestration cấp thấp, có state / cho workflow dài, / với durable execution / và human-in-the-loop.' },
      { id: 'example', en: '*StrangeLoop is broader.* / It includes **Studio** for configuration and control, / an **Engine** for execution, / and a clear boundary between the app and its domain tools.', vi: '*StrangeLoop rộng hơn.* / Nó gồm **Studio** để cấu hình và control, / một **Engine** để thực thi, / và ranh giới rõ giữa app với domain tool.' },
      { id: 'close', en: '*So my simple summary is:* / **LangGraph is more an orchestration framework**. / **StrangeLoop is closer to a production agent platform**.', vi: '*Tóm lại đơn giản là:* / **LangGraph giống một orchestration framework hơn**. / **StrangeLoop gần với một production agent platform hơn**.' },
    ] },
    contextIds: ['K'],
    clusterIds: ['workflow'],
    routeIds: ['strangeloop-agent'],
    memory: { nodes: [
      { id: 'langchain', label: 'LANGCHAIN', triggers: ['models', 'prompts', 'tools', 'middleware'], answerSectionId: 'point' },
      { id: 'langgraph', label: 'LANGGRAPH', triggers: ['stateful orchestration', 'durable execution', 'human-in-the-loop'], answerSectionId: 'reason' },
      { id: 'strangeloop-scope', label: 'STRANGELOOP SCOPE', triggers: ['Studio control plane', 'Engine execution', 'app / domain-tool boundary'], answerSectionId: 'example' },
      { id: 'simple-close', label: 'SIMPLE CLOSE', triggers: ['orchestration framework', 'production agent platform'], answerSectionId: 'close' },
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
  { code: 'A', context: 'Backend → Applied AI → Production', triggers: 'AI experience, fit, backend-heavy background', questions: '1, 9, 11, 20, 21, 22' },
  { code: 'B', context: 'Retrieval / Hybrid Search', triggers: 'retrieval, search, vector, ranking', questions: '2, 8, 9, 14, 15' },
  { code: 'C', context: 'AI Reliability', triggers: 'error, retry, timeout, latency, cost, hallucination', questions: '3, 12, 13, 14, 15' },
  { code: 'D', context: 'OCR CPU → GPU', triggers: 'challenge, incident, OOM, performance, ownership', questions: '9, 17, 22' },
  { code: 'E', context: 'Agent Architecture', triggers: 'agent, tool calling, function calling, design', questions: '5, 7, 10, 12, 22' },
  { code: 'K', context: 'AI Agent Workflow', triggers: 'StrangeLoop, LangChain, LangGraph, agent workflow, orchestration, workflow engine', questions: '4, 23' },
  { code: 'F', context: 'Workflow / Temporal', triggers: 'Temporal, async, durable workflow, checkpoint, retry', questions: '6, 11, 12, 13, 18' },
  { code: 'G', context: 'Evals / Quality', triggers: 'eval, quality, regression, groundedness', questions: '8, 12, 14, 15' },
  { code: 'H', context: 'Tool Security', triggers: 'permissions, tool safety, write actions, audit', questions: '5, 10, 12, 14, 16' },
  { code: 'I', context: 'Learning / Adaptation', triggers: 'new stack, technology not used, learning speed', questions: '6, 7, 11' },
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
  9: [{ id: 'ai-proof', question: { en: 'What is your strongest proof that you can already ship applied AI?', vi: 'Bằng chứng mạnh nhất cho thấy bạn đã ship được applied AI là gì?' } }],
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
  22: [{ id: 'project-tradeoff', question: { en: 'What was the main trade-off when you moved OCR to a GPU service?', vi: 'Trade-off chính khi bạn chuyển OCR sang GPU service là gì?' } }],
  23: [],
};

const speakingCueOverrides: Record<number, Record<string, string>> = {
  1: { point: 'My main background is', reason: 'In production, an AI feature is not only about', example: 'In my recent project, I have worked more with', result: 'I have experience with both', close: 'I would describe my strength as' },
  2: { point: 'I prefer not to rely on only one type of search', reason: 'Lexical search is good for', example: 'The lexical side uses', result: 'We combine the two rankings with', close: 'We also think about failure and security', extra: 'The goal is to make retrieval more' },
  3: { point: 'I check the whole workflow to find', reason: 'A bad result can come from', example: 'For temporary failures like', result: 'I first separate temporary errors from', close: 'For tracking, I keep clear logs', details: 'For LLM workflows, I also record' },
  4: { point: 'Recently, I worked on', reason: 'The Engine runs the workflow step by step', approval: 'For approval,', scope: 'For data,', tracking: 'For tracking, I keep clear logs', improve: 'Then, we use those insights', close: 'So overall, a good agent system needs' },
  5: { point: 'I would not put everything into one large LLM call', reason: 'Clear step boundaries make the system easier to', example: 'The flow can be', result: 'The backend should control tool execution', close: 'For reliability, I would save important state', tracking: 'For tracking, I keep clear logs' },
  6: { point: 'I have not used Temporal in production', pipeline: 'The first one is a document pipeline', 'agent-engine': 'The second one is an AI agent engine', concepts: 'So I know the main ideas', gap: 'What I need to learn is the Temporal library itself' },
  7: { point: 'I have not spent several years building fully autonomous AI agents', reason: 'Many important agent building blocks are already familiar', example: 'I have worked with', result: 'I think of an agent as a controlled workflow', close: 'The real gap is not the core ideas' },
  8: { point: 'I have hands-on experience with AI evaluation', reason: 'In production AI, I want to know whether', example: 'In our document AI work, we used', result: 'For retrieval, I worked on hybrid retrieval', close: 'I also worked on citation and provenance', extra: 'The wider StrangeLoop platform also has' },
  9: { point: 'Yes, my years are stronger on backend', reason: 'Because a 70% AI role still needs', example: 'For proof, I shipped hybrid retrieval', close: 'So the gap is not no AI' },
  10: { point: 'I have hands-on experience with tool calling', reason: 'In Clincove, the model can use', example: 'I would expose a small set of backend tools', result: 'We design the tool interface in a familiar way', close: 'For tracking, I keep clear logs', 'tool-safety': 'For tool safety, I also worked on', extra: 'I directly worked on the Clincove tool-calling flow' },
  11: { point: 'For me, I learn a new language or stack', reason: 'That is because the tool may change', example: 'For example, when I learn Temporal', result: 'The same way, I moved from backend work', close: 'So I still need to learn the new APIs' },
  12: { point: 'I would start with the user goal', reason: 'I would not send the whole database to the model', example: 'If a user asks about training progress', result: 'I would expose a small set of backend tools', close: 'This is similar to what I worked with in Clincove', extra: 'For tracking, I keep clear logs', 'reliability-evals': 'I would also use retry and recovery', 'section-7': 'The model can decide which tool it needs' },
  13: { point: 'I try to control latency and cost in several layers', reason: 'Every extra model call or extra token can', example: 'I use normal backend logic, filtering, and retrieval', result: 'I try to keep the context small', close: 'I use timeouts and bounded retries', extra: 'I also use checkpoint and recovery', 'section-7': 'For tracking, I keep clear logs', optimization: 'For optimization, I also compare the model used' },
  14: { point: 'The first step is to give the model', reason: 'A good answer depends on getting the right information', example: 'For knowledge-based questions, I use good retrieval', result: 'I use structured output and backend validation', settings: 'I also adjust the model settings based on the task', close: 'I use eval cases for important cases', extra: 'Hallucination cannot be completely removed' },
  15: { point: 'I check a RAG system at three levels', reason: 'A good answer depends on getting the right information', example: 'In Clincove, I worked on hybrid retrieval', result: 'For the final answer, I check whether it is grounded', close: 'For tracking, I keep clear logs', 'runtime-stability': 'For runtime stability, I also check failures', extra: 'For a more formal evaluation, I would also use' },
  16: { point: 'I start with least privilege', reason: 'The model should not have direct access to', example: 'I would expose a small set of backend tools', result: 'For sensitive actions, I would also require', close: 'For tracking, I keep clear logs', 'safe-writes': 'For safe logging, I avoid sensitive data', extra: 'The LLM can suggest, but the backend controls' },
  17: { point: 'In one case, we had a problem', reason: 'The first thing I wanted to do was to find the root cause', example: 'For tracking, I keep clear logs', investigation: 'Then, I traced the whole processing flow', result: 'Based on that, I reduced the batch size', close: 'For recovery, I added checkpoint and recovery logic', extra: 'Then, I also worked on the infrastructure side', rollout: 'So overall, I did not only focus on stopping the crash' },
  18: { point: 'I would not keep an HTTP request open', reason: 'Long-running work can take time or fail', example: 'A worker can process the job in the background', result: 'I can clearly separate temporary errors from', close: 'For tracking, I keep clear logs', 'job-status': 'For the job itself, I keep the job status clear', extra: 'For a more complex workflow, I may use something like Temporal' },
  19: { point: 'When I disagree with a technical decision', reason: 'Sometimes the decision is not only about technology', example: 'I bring evidence like', result: 'I can explain the trade-offs more clearly', close: 'Once the team makes a decision', extra: 'A good technical disagreement is not about' },
  20: { point: 'My name is Huy', foundation: 'My main background is', recent: 'Recently, I’ve been working more with', ownership: 'In my current project, I mainly work on', direction: 'I want to keep growing in', close: 'I think this position at Everfit is' },
  21: { direction: 'I want to keep growing in', reason: 'This position combines backend work with AI', recent: 'Recently I’ve had some chances to work on', everfit: 'I also like Everfit because', challenge: 'I feel this is a good place for me to', contribution: 'I believe my backend experience can help me', close: 'I think this position is a good match' },
  22: { point: 'Recently, I have been working on a clinical trial management system', reason: 'My main role is backend development', example: 'On the AI side, I mainly worked on two areas', 'document-processing': 'For document processing, we use OCR, chunking, and embeddings', 'protocol-ai': 'The first use case is Protocol AI', 'smr-edc': 'The second use case is SMR to EDC', 'suggest-edc': 'In this flow, we get information from source medical records', gpu: 'For OCR, I also worked with DevOps', strangeloop: 'For StrangeLoop, we use it to build AI workflows', control: 'The model can decide which tool it needs', overall: 'So overall, this project gives me experience' },
  23: { point: 'LangChain gives higher-level building blocks', reason: 'LangGraph is more about lower-level, stateful orchestration', example: 'StrangeLoop is broader', close: 'LangGraph is more an orchestration framework' },
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
