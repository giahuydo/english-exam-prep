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
        en: "*I also track* / the **request or job ID**, / the **model**, / **latency**, / **retry count**, / **error type**, / **token usage**, / and which workflow step failed.",
        vi: "Mình cũng log request/job ID, model, latency, số lần retry, loại lỗi, token, và bước nào của workflow đã fail.",
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
    memory: { nodes: [{'id': 'root-cause', 'label': 'ROOT CAUSE', 'triggers': ['bad input', 'wrong retrieval', 'backend logic', 'provider / model'], 'answerSectionId': 'point'}, {'id': 'error-strategy', 'label': 'ERROR STRATEGY', 'triggers': ['temporary vs permanent', 'retry', 'fallback', 'fail fast'], 'answerSectionId': 'result'}, {'id': 'observability', 'label': 'OBSERVABILITY', 'triggers': ['request / job ID', 'latency', 'token usage', 'error type'], 'answerSectionId': 'close'}] }
  },
  {
    id: 4,
    question: {
      en: "Can you explain a recent project involving an agent platform or workflow engine?",
      vi: 'Bạn có thể giải thích một dự án gần đây có liên quan đến nền tảng agent hoặc workflow engine không?',
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
        en: "*For tracking,* / every step is recorded. / So we can see what went wrong / and improve the **workflow, prompts, or tools** over time.",
        vi: "Về tracking: mọi bước đều được ghi lại. Nhờ đó thấy chỗ sai và cải thiện workflow, prompt hoặc tool theo thời gian.",
      },
      {
        id: 'close',
        en: "*So overall,* / a good agent system needs **clear boundaries**. / The platform controls the **rules and orchestration**. / The application controls its own **data and business actions**.",
        vi: "Tóm lại, agent system tốt cần ranh giới rõ. Platform giữ rules và orchestration. Application giữ data và business actions của mình.",
      },
    ] },
    contextIds: ['K'],
    clusterIds: ['tool-calling', 'workflow'],
    memory: { nodes: [{'id': 'strangeloop-platform', 'label': 'AGENT PLATFORM', 'triggers': ['Studio control plane', 'Engine runtime', 'AI agents'], 'answerSectionId': 'point'}, {'id': 'unified-flow', 'label': 'UNIFIED FLOW', 'triggers': ['LLM calls', 'tool calls', 'decisions', 'debuggable steps'], 'answerSectionId': 'reason'}, {'id': 'approval-gate', 'label': 'APPROVAL GATE', 'triggers': ['tool approval', 'pause and wait', 'user confirmation'], 'answerSectionId': 'approval'}, {'id': 'DATA SCOPE', 'label': 'DATA SCOPE', 'triggers': ['needed data only', 'scope check', 'no data returned'], 'answerSectionId': 'scope'}, {'id': 'observability', 'label': 'TRACEABLE RUN', 'triggers': ['every step recorded', 'workflow / prompts / tools', 'find what went wrong'], 'answerSectionId': 'tracking'}, {'id': 'boundary', 'label': 'SYSTEM BOUNDARY', 'triggers': ['platform rules', 'application data', 'backend actions'], 'answerSectionId': 'close'}] }
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
        en: "*For reliability,* / I would save important **state**, / use **timeout** and bounded **retry**, / keep external actions **idempotent**, / and track **latency**, **tool errors**, **token usage**, **cost**, / and **output quality**.",
        vi: "Về độ tin cậy: mình lưu state quan trọng, dùng timeout + retry có giới hạn, giữ action ngoài idempotent, và theo dõi latency, lỗi tool, token, chi phí, chất lượng output.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I use the **LLM for flexible reasoning**, / but keep important backend actions **controlled and predictable**.",
        vi: "Tóm lại, dùng LLM để suy luận linh hoạt, nhưng giữ các action backend quan trọng ở mức kiểm soát và dự đoán được.",
      },
    ] },
    contextIds: ['E', 'H'],
    clusterIds: ['error-handling', 'observability', 'workflow', 'tool-calling', 'tool-safety', 'production-ai'],
    memory: { nodes: [
      { id: 'agent-context', label: 'CLEAR STEPS', triggers: ['not one LLM call', 'clear steps', 'debug / retry / recover'], answerSectionId: 'point' },
      { id: 'tool-control', label: 'TOOL CONTROL', triggers: ['tool contract', 'validate arguments', 'permission check', 'structured result'], answerSectionId: 'result' },
      { id: 'reliability', label: 'RELIABILITY', triggers: ['state', 'timeout / retry', 'idempotent', 'latency / cost'], answerSectionId: 'close' },
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
        en: "*The real gap* / is not the core ideas. / It is more about **breadth and time** on fully autonomous agent products. / The **production engineering foundation** is already familiar.",
        vi: "Gap thật không phải ý tưởng cốt lõi. Nó nghiêng về bề rộng và thời gian trên các sản phẩm agent tự động hoàn toàn. Nền production engineering thì mình đã quen.",
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
    memory: { nodes: [
      { id: 'agent-gap', label: 'NARROW GAP', triggers: ['not years of autonomous agents', 'recent agent workflows'], answerSectionId: 'point' },
      { id: 'building-blocks', label: 'STRANGELOOP + RAG', triggers: ['StrangeLoop', 'tools / approval', 'hybrid retrieval'], answerSectionId: 'example' },
      { id: 'controlled-workflow', label: 'CONTROLLED WORKFLOW', triggers: ['intent / context', 'backend controls', 'validate'], answerSectionId: 'result' },
      { id: 'foundation', label: 'PRODUCTION FOUNDATION', triggers: ['breadth / time gap', 'core ideas familiar'], answerSectionId: 'close' },
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
        en: "*My direct work* / was more on **retrieval and grounding quality**. / I worked on hybrid retrieval with **BM25**, **vector search**, / and **RRF**, / plus regression tests for **ranking**, **fallback**, / and **permission isolation**.",
        vi: "Phần mình làm trực tiếp nhiều hơn là chất lượng retrieval và grounding. Mình làm hybrid retrieval với BM25, vector search và RRF, kèm regression test cho ranking, fallback và permission isolation.",
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
    memory: { nodes: [
      { id: 'hands-on-eval', label: 'AI EVAL HANDS-ON', triggers: ['hands-on eval', 'quality regression', 'not platform owner'], answerSectionId: 'point' },
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
        en: "*Yes,* / that is true. / My strongest foundation is **backend engineering**.",
        vi: "Đúng vậy. Nền tảng mạnh nhất của mình là backend engineering.",
      },
      {
        id: 'reason',
        en: "*That's because* / in production, an AI feature is not only the model. / It still needs **data pipelines**, **retrieval**, **APIs**, **queues**, **state**, **retries**, **monitoring**, **security**, / and **infrastructure**.",
        vi: "Vì trong production, tính năng AI không chỉ là model. Nó vẫn cần data pipeline, retrieval, API, queue, state, retry, monitoring, security và infrastructure.",
      },
      {
        id: 'example',
        en: "*Those are areas* / where I already have strong hands-on experience / from building and running production backend systems.",
        vi: "Đó là những mảng mình đã có kinh nghiệm thực chiến từ việc xây và vận hành backend production.",
      },
      {
        id: 'result',
        en: "*So* / I can grow deeper in AI / without starting from zero on the production engineering side.",
        vi: "Vậy mình có thể đi sâu hơn về AI mà không phải bắt đầu lại từ zero ở phía production engineering.",
      },
      {
        id: 'close',
        en: "*Recently,* / I have also worked with **OCR**, **embeddings**, **hybrid retrieval**, **LLM integration**, **model reliability**, / and **GPU inference**. / That includes systems like **StrangeLoop** / and **RAG**.",
        vi: "Gần đây mình cũng làm với OCR, embeddings, hybrid retrieval, tích hợp LLM, độ tin cậy model và GPU inference. Trong đó có StrangeLoop và RAG.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I am building stronger **AI capability** / on top of a solid **production backend foundation**.",
        vi: "Tóm lại, mình đang xây AI capability mạnh hơn trên nền production backend vững.",
      },
    ] },
    contextIds: ['A', 'B', 'D'],
    clusterIds: ['rag', 'ocr', 'production-ai'],
    storyIds: ['hybrid-rag'],
    memory: { nodes: [
      { id: 'backend-foundation', label: 'BACKEND FOUNDATION', triggers: ['backend engineering', 'production systems'], answerSectionId: 'point' },
      { id: 'production-ai', label: 'PRODUCTION AI', triggers: ['data pipelines', 'retrieval / APIs', 'security'], answerSectionId: 'reason' },
      { id: 'ai-growth', label: 'AI GROWTH', triggers: ['OCR', 'embeddings', 'StrangeLoop / RAG', 'GPU inference'], answerSectionId: 'close' },
      { id: 'stronger-ai', label: 'STRONGER AI', triggers: ['AI capability', 'backend foundation'], answerSectionId: 'extra' },
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
        en: "*Then* / I would expose a small set of **backend tools**. / The model can decide which tool it needs. / But the backend still defines the **tool contract**, / validates the **arguments**, / checks **permission**, / executes the action, / and returns a **structured result**.",
        vi: "*Sau đó* / mình expose một tập nhỏ **backend tool**. / Model quyết định tool nào cần. / Nhưng backend vẫn định nghĩa **tool contract**, / validate **arguments**, / check **permission**, / thực thi action, / và trả **structured result**.",
      },
      {
        id: 'result',
        en: "*For the interface,* / we design the **tool interface** / in a familiar way for the LLM, / like a **file system** / with **search and read**, / because this usually helps the model perform better.",
        vi: "*Về interface,* / tụi mình thiết kế **tool interface** theo cách quen với LLM, / giống **file system** / có **search và read**, / vì cách này thường giúp model chạy tốt hơn.",
      },
      {
        id: 'close',
        en: "*For tracking,* / I also worked on **tool safety**, / such as **audit logs**, **tracing**, **citations**, / and **final-response validation**.",
        vi: "*Về tracking,* / mình cũng làm **tool safety**, / như **audit logs**, **tracing**, **citations**, / và **final-response validation**.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I directly worked on the **Clincove tool-calling flow**, / and I also understand and can modify parts of the **StrangeLoop engine** when needed.",
        vi: "*Tóm lại,* / mình trực tiếp làm trên **Clincove tool-calling flow**, / và cũng hiểu, có thể sửa một số phần của **StrangeLoop engine** khi cần.",
      },
    ] },
    contextIds: ['E', 'H'],
    clusterIds: ['tool-calling', 'tool-safety'],
    memory: { nodes: [
      { id: 'hands-on', label: 'HANDS-ON TOOLING', triggers: ['tool calling', 'backend control'], answerSectionId: 'point' },
      { id: 'search-read', label: 'SEARCH + READ', triggers: ['Clincove', 'read-only tools', 'search / document read'], answerSectionId: 'reason' },
      { id: 'BACKEND-CONTROL', label: 'BACKEND CONTROL', triggers: ['choose tool', 'tool contract', 'permission', 'structured result'], answerSectionId: 'example' },
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
        en: "*For me,* / I normally learn a **new technology** / by connecting it to **engineering problems** / I already understand.",
        vi: "*Với mình,* / mình học **công nghệ mới** / bằng cách nối nó với **vấn đề engineering** / mình đã hiểu.",
      },
      {
        id: 'reason',
        en: "*That's because* / the **framework may change**, / but many of the **underlying problems stay the same**.",
        vi: "*Vì* / **framework có thể đổi**, / nhưng nhiều **vấn đề nền tảng bên dưới vẫn giống**.",
      },
      {
        id: 'example',
        en: "*For example,* / when I study **Temporal**, / I connect it to **retries**, **checkpoints**, **durable state**, / and **long-running workflows** that I have already worked with.",
        vi: "*Ví dụ,* / khi học **Temporal**, / mình liên hệ với **retry**, **checkpoint**, **state bền vững**, / và **workflow chạy lâu** mà mình đã làm.",
      },
      {
        id: 'result',
        en: "*So* / this is also how I moved from traditional backend work / into **OCR**, **embeddings**, **retrieval**, **LLM integration**, / and **GPU-based inference**.",
        vi: "*Vậy* / đây cũng là cách mình chuyển từ backend truyền thống / sang **OCR**, **embeddings**, **retrieval**, **tích hợp LLM**, / và **GPU inference**.",
      },
      {
        id: 'close',
        en: "*Still,* / every new stack has its own **abstractions**, **APIs**, / and **best practices** / that I need to learn.",
        vi: "*Dù vậy,* / mỗi stack mới vẫn có **abstraction**, **API**, / và **best practice** riêng / mình cần học.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I usually do not need to relearn the **engineering fundamentals**. / I mainly need to learn the **new tool**, / so I am confident I can adapt relatively quickly.",
        vi: "*Tóm lại,* / mình thường không phải học lại **kiến thức engineering nền**. / Chủ yếu cần học **tool mới**, / nên mình tự tin thích nghi khá nhanh.",
      },
    ] },
    contextIds: ['A', 'F', 'I'],
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
        en: "*Then* / I would expose a small set of **backend tools**. / The model can decide which tool it needs. / But the backend still defines the **tool contract**, / validates the **arguments**, / checks **permission**, / executes the action, / and returns a **structured result**.",
        vi: "*Sau đó* / mình expose một tập nhỏ **backend tool**. / Model quyết định tool nào cần. / Nhưng backend vẫn định nghĩa **tool contract**, / validate **arguments**, / check **permission**, / thực thi action, / và trả **structured result**.",
      },
      {
        id: 'close',
        en: "*This is similar to* what I worked with in **Clincove**, / where the agent could **search and read documents** / through **controlled backend tools**. / The backend kept control of the **access scope** and **permissions**.",
        vi: "*Cách này giống* những gì mình làm ở **Clincove**, / nơi agent có thể **search và đọc document** / qua **backend tool có kiểm soát**. / Backend giữ quyền kiểm soát **access scope** và **permission**.",
      },
      {
        id: 'extra',
        en: "*For tracking,* / I would track **run IDs**, **tool calls**, **latency**, / and **errors**, / and use **retry and recovery** where needed. / I would also add **regression and eval cases** / for important workflows.",
        vi: "*Về tracking,* / mình theo dõi **run ID**, **tool call**, **latency**, / và **lỗi**, / rồi dùng **retry và recovery** khi cần. / Mình cũng thêm **regression và eval case** / cho các workflow quan trọng.",
      },
      {
        id: 'section-7',
        en: "*So overall,* / the model can make **decisions**, / but the backend stays in control of **data**, **permissions**, **execution**, / and **reliability**.",
        vi: "*Tóm lại,* / model có thể **quyết định**, / nhưng backend vẫn kiểm soát **data**, **permission**, **thực thi**, / và **độ tin cậy**.",
      },
    ] },
    contextIds: ['C', 'E', 'F', 'G', 'H'],
    clusterIds: ['error-handling', 'observability', 'workflow', 'tool-calling', 'tool-safety', 'quality'],
    memory: { nodes: [{ id: 'goal-context', label: 'GOAL → CONTEXT', triggers: ['user goal', 'authorized context', 'clear workflow'], answerSectionId: 'point' }, { id: 'backend-tools', label: 'BACKEND TOOLS', triggers: ['tool contract', 'permission', 'structured result'], answerSectionId: 'result' }, { id: 'reliability', label: 'RELIABILITY', triggers: ['run IDs', 'retry / recovery', 'regression'], answerSectionId: 'extra' }, { id: 'backend-control', label: 'BACKEND CONTROL', triggers: ['data', 'permissions', 'execution', 'reliability'], answerSectionId: 'section-7' }] }
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
        en: "*So overall,* / I track the **model used**, **token usage**, **retry attempts**, **latency**, / and **estimated cost**, / and use that real data / to decide what to optimize next.",
        vi: "*Tóm lại,* / mình theo dõi **model**, **token**, **số lần retry**, **latency**, / và **chi phí ước tính**, / rồi dùng dữ liệu thật / để quyết định tối ưu phần nào tiếp theo.",
      },
    ] },
    contextIds: ['C', 'F'],
    clusterIds: ['error-handling', 'observability', 'production-ai', 'workflow'],
    storyIds: ['llm-reliability'],
    memory: { nodes: [
      { id: 'reduce-work', label: 'REDUCE AI WORK', triggers: ['backend logic', 'filtering', 'retrieval', 'prompt cache'], answerSectionId: 'example' },
      { id: 'cache-context', label: 'CACHE + CONTEXT', triggers: ['smaller context', 'authorized data', 'reuse stable context'], answerSectionId: 'result' },
      { id: 'measure-recover', label: 'RECOVER + MEASURE', triggers: ['timeout / retry', 'rate limits', 'temporary errors'], answerSectionId: 'close' },
      { id: 'measure', label: 'MEASURE', triggers: ['model used', 'token usage', 'retry attempts', 'estimated cost'], answerSectionId: 'section-7' },
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
        en: "*For example,* / for knowledge-based questions, / I use good **retrieval** / and **relevant evidence** / instead of depending only on the model's own knowledge.",
        vi: "*Ví dụ,* / với câu hỏi dựa trên kiến thức, / mình dùng **retrieval tốt** / và **evidence liên quan** / thay vì chỉ dựa kiến thức sẵn của model.",
      },
      {
        id: 'result',
        en: "*Then* / I use **structured output** / and **backend validation** / when the result is used by the system. / If the model suggests an action, / the backend still checks the **business rules** / and **permissions**.",
        vi: "*Sau đó* / mình dùng **structured output** / và **backend validation** / khi hệ thống dùng kết quả. / Nếu model đề xuất action, / backend vẫn check **business rules** / và **permission**.",
      },
      {
        id: 'settings',
        en: "*I also adjust the model settings* / based on the task. / For factual tasks, / I usually prefer a **lower temperature** / to make the output more consistent / and less random.",
        vi: "*Mình cũng chỉnh model setting* / theo từng task. / Với task cần factual, / mình thường chọn **temperature thấp hơn** / để output ổn định hơn / và ít random hơn.",
      },
      {
        id: 'close',
        en: "*For important cases,* / I use **eval cases**. / If the model is not sure, / I prefer to **ask for clarification**, / **require confirmation**, / or use a **safe fallback** / instead of letting it guess.",
        vi: "*Với case quan trọng,* / mình dùng **eval cases**. / Nếu model không chắc, / mình ưu tiên **hỏi lại**, / **yêu cầu confirmation**, / hoặc dùng **safe fallback** / thay vì để model đoán.",
      },
      {
        id: 'extra',
        en: "*So overall,* / hallucination cannot be completely removed, / but we can **reduce the risk** / with better context, / retrieval, / validation, / proper model settings, / evals, / and **safe fallback**.",
        vi: "*Tóm lại,* / hallucination không thể bỏ hết, / nhưng tụi mình có thể **giảm rủi ro** / bằng context tốt hơn, / retrieval, / validation, / model setting phù hợp, / eval, / và **safe fallback**.",
      },
    ] },
    contextIds: ['B', 'C', 'G', 'H'],
    clusterIds: ['rag', 'quality', 'tool-safety'],
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
        en: "*For runtime,* / I check **latency**, **failures**, / and **fallback behavior** / to make sure the system is stable.",
        vi: "*Về runtime,* / mình kiểm **latency**, **failures**, / và **fallback behavior** / để chắc hệ thống ổn định.",
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
    memory: { nodes: [
      { id: 'three-levels', label: 'THREE LEVELS', triggers: ['retrieval', 'answer quality', 'runtime'], answerSectionId: 'point' },
      { id: 'right-information', label: 'RIGHT INFORMATION', triggers: ['right information', 'retrieval wrong', 'final answer wrong'], answerSectionId: 'reason' },
      { id: 'hybrid-retrieval', label: 'HYBRID RETRIEVAL', triggers: ['Clincove', 'PostgreSQL / pgvector / RRF', 'ranking / fallback'], answerSectionId: 'example' },
      { id: 'grounded-answer', label: 'GROUNDED ANSWER', triggers: ['real source', 'citations', 'provenance'], answerSectionId: 'result' },
      { id: 'runtime-stability', label: 'RUNTIME STABILITY', triggers: ['latency', 'failures', 'fallback behavior'], answerSectionId: 'close' },
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
        en: "*Then* / I would expose a small set of **backend tools**. / The model can decide which tool it needs. / But the backend still defines the **tool contract**, / validates the **arguments**, / checks **permission**, / executes the action, / and returns a **structured result**.",
        vi: "*Sau đó* / mình expose một tập nhỏ **backend tool**. / Model quyết định tool nào cần. / Nhưng backend vẫn định nghĩa **tool contract**, / validate **arguments**, / check **permission**, / thực thi action, / và trả **structured result**.",
      },
      {
        id: 'result',
        en: "*For sensitive actions,* / I would also require **user confirmation** / when needed.",
        vi: "*Với action nhạy cảm,* / mình cũng yêu cầu **user confirmation** / khi cần.",
      },
      {
        id: 'close',
        en: "*For tracking,* / I keep **safe logs** with **IDs** / and avoid **sensitive data**. / For write actions, / I use **idempotency** / so retries do not create **duplicates**.",
        vi: "*Về tracking,* / mình giữ **log an toàn** với các **ID**, / và tránh **data nhạy cảm**. / Với thao tác ghi, / mình dùng **idempotency** / để retry không tạo **bản trùng**.",
      },
      {
        id: 'extra',
        en: "*So overall,* / the **LLM can suggest**, / but the **backend controls** **access**, **execution**, / and **safety**.",
        vi: "*Tóm lại,* / **LLM có thể đề xuất**, / nhưng **backend kiểm soát** **quyền truy cập**, **thực thi**, / và **độ an toàn**.",
      },
    ] },
    contextIds: ['H'],
    clusterIds: ['tool-calling', 'tool-safety'],
    memory: { nodes: [{ id: 'least-privilege', label: 'LEAST PRIVILEGE', triggers: ['only needed tools', 'limited access'], answerSectionId: 'point' }, { id: 'backend-check', label: 'BACKEND CHECK', triggers: ['arguments', 'permission', 'access scope', 'final decision'], answerSectionId: 'example' }, { id: 'confirm-sensitive', label: 'USER CONFIRMATION', triggers: ['sensitive actions', 'user confirmation'], answerSectionId: 'result' }, { id: 'safe-logs', label: 'SAFE LOGS', triggers: ['safe logs', 'IDs', 'avoid sensitive data'], answerSectionId: 'close' }, { id: 'idempotency', label: 'IDEMPOTENCY', triggers: ['write actions', 'safe retry', 'no duplicates'], answerSectionId: 'close' }, { id: 'backend-controls', label: 'LLM SUGGESTS', triggers: ['LLM can suggest', 'backend controls', 'access / execution / safety'], answerSectionId: 'extra' }] }
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
        vi: "*Một ví dụ là* / sự cố production với **job xử lý PDF lớn**. / Trong lúc **OCR**, / **memory** tăng liên tục, / và cuối cùng worker crash.",
      },
      {
        id: 'reason',
        en: "*That's because* / I did not want to assume the **worker itself** was the real problem. / I wanted to find the **root cause** first.",
        vi: "*Vì* / mình không muốn giả định **worker** là nguyên nhân. / Mình muốn tìm **root cause** trước.",
      },
      {
        id: 'example',
        en: "*For example,* / I traced the **processing flow**, / added **targeted logging**, / checked the memory usage at important steps, / and tested different **batch sizes**. / From that, / I found that the main bottleneck was the **OCR CPU inference**.",
        vi: "*Ví dụ,* / mình trace **luồng xử lý**, / thêm **log có mục tiêu**, / đo memory ở các bước quan trọng, / và thử nhiều **batch size**. / Từ đó, / bottleneck chính là **OCR CPU inference**.",
      },
      {
        id: 'result',
        en: "*So first,* / I made the current flow more stable / with **smaller batches** / and **checkpoint and recovery logic**, / so if one step failed, / we did not need to restart the whole job.",
        vi: "*Vậy trước hết,* / mình làm luồng hiện tại ổn định hơn / bằng **batch nhỏ hơn** / và **checkpoint cùng recovery**, / nên nếu một bước lỗi / thì không phải chạy lại cả job.",
      },
      {
        id: 'close',
        en: "*Then* / I handled the **backend and workflow side** / and worked with **DevOps** / to move the heavy OCR inference / to a **remote GPU service**.",
        vi: "*Sau đó* / mình xử lý phần **backend và workflow** / và phối hợp **DevOps** / để đưa OCR nặng / sang một **GPU service** tách riêng.",
      },
      {
        id: 'extra',
        en: "*So overall,* / I did not only focus on stopping the crash. / I also checked **worker stability**, **memory usage**, **job completion**, / and **processing time** / to make sure the new solution was **stable**, **observable**, / and **safe to roll out**.",
        vi: "*Tóm lại,* / mình không chỉ dừng crash. / Mình còn kiểm **ổn định worker**, **memory**, **tỉ lệ job hoàn tất**, / và **thời gian xử lý** / để chắc giải pháp mới **ổn định**, **quan sát được**, / và **an toàn khi roll out**.",
      },
    ] },
    contextIds: ['D'],
    clusterIds: ['ocr', 'workflow', 'observability'],
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
        en: "*For tracking,* / I also keep the **job status** clear, / for example **queued**, **running**, **completed**, / or **failed**, / so it is easier to monitor and debug.",
        vi: "*Về tracking,* / mình cũng giữ **trạng thái job** rõ, / ví dụ **queued**, **running**, **completed**, / hoặc **failed**, / để dễ monitor và debug.",
      },
      {
        id: 'extra',
        en: "*So overall,* / for a more complex workflow, / I may use something like **Temporal** / because it helps manage **workflow state**, **retries**, **timers**, / and **recovery**.",
        vi: "*Tóm lại,* / với workflow phức tạp hơn, / mình có thể dùng **Temporal** / vì nó giúp quản lý **workflow state**, **retry**, **timer**, / và **recovery**.",
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
  22: [{ id: 'project-tradeoff', question: { en: 'What was the main trade-off when you moved OCR to a GPU service?', vi: 'Trade-off chính khi bạn chuyển OCR sang GPU service là gì?' } }],
  23: [],
};

const speakingCueOverrides: Record<number, Record<string, string>> = {
  1: { point: 'My main background is', reason: 'In production, an AI feature is not only about', example: 'In my recent project, I have worked more with', result: 'I have experience with both', close: 'I would describe my strength as' },
  2: { point: 'I prefer not to rely on only one type of search', reason: 'Lexical search is good for', example: 'The lexical side uses', result: 'We combine the two rankings with', close: 'We also think about failure and security', extra: 'The goal is to make retrieval more' },
  3: { point: 'I check the whole workflow to find', reason: 'A bad result can come from', example: 'For temporary failures like', result: 'I first separate temporary errors from', close: 'I normally track the' },
  4: { point: 'Recently, I worked with', reason: 'Basically, the Engine runs the workflow step by step', approval: 'Another important point is approval', scope: 'Also, each run only gets access to the data it needs', tracking: 'Also, every step is recorded and easy to track', close: 'So overall, through this project' },
  5: { point: 'I would not put everything into one large LLM call', reason: 'Clear step boundaries make the system easier to', example: 'The flow can be', result: 'The backend should control tool execution', close: 'For longer workflows, I would persist' },
  6: { point: 'I have not used Temporal in production', pipeline: 'The first one is a document pipeline', 'agent-engine': 'The second one is an AI agent engine', concepts: 'So I know the main ideas', gap: 'What I need to learn is the Temporal library itself' },
  7: { point: 'I have not spent several years building fully autonomous AI agents', reason: 'Many important agent building blocks are already familiar', example: 'I have worked with', result: 'I think of an agent as a controlled workflow', close: 'My direct agent experience is still growing' },
  8: { point: 'I have hands-on experience with AI evaluation', reason: 'In production AI, I want to know whether', example: 'In our document AI work, we used', result: 'My direct work was more on', close: 'I also worked on citation and provenance', extra: 'The wider StrangeLoop platform also has' },
  9: { point: 'My strongest foundation is backend engineering', reason: 'In production, an AI feature is not only the model', example: 'Those are areas where I already have', result: 'I can focus on growing deeper in AI', close: 'Recently I have been working more with' },
  10: { point: 'I have hands-on experience with tool calling', reason: 'In Clincove, the model can use', example: 'I would expose a small set of backend tools', result: 'We design the tool interface in a familiar way', close: 'I also worked on tool safety', extra: 'I directly worked on the Clincove tool-calling flow' },
  11: { point: 'I normally learn a new technology by connecting it to', reason: 'The framework may change', example: 'When I study Temporal, I connect it to', result: 'This is also how I moved from traditional backend work into', close: 'Every new stack has its own', extra: 'I usually do not need to relearn the engineering fundamentals' },
  12: { point: 'I would start with the user goal', reason: 'I would not send the whole database to the model', example: 'If a user asks about training progress', result: 'I would expose a small set of backend tools', close: 'This is similar to what I worked with in Clincove', extra: 'I would track run IDs, tool calls, latency, and errors', 'section-7': 'The model can make decisions' },
  13: { point: 'I try to control latency and cost in several layers', reason: 'Every extra model call or extra token can', example: 'I use normal backend logic, filtering, and retrieval', result: 'I try to keep the context small', close: 'I use timeouts and bounded retries', extra: 'I also use checkpoint and recovery', 'section-7': 'I track the model used, token usage, retry attempts' },
  14: { point: 'The first step is to give the model', reason: 'A good answer depends on getting the right information', example: 'For knowledge-based questions, I use good retrieval', result: 'I use structured output and backend validation', settings: 'I also adjust the model settings based on the task', close: 'I use eval cases for important cases', extra: 'Hallucination cannot be completely removed' },
  15: { point: 'I check a RAG system at three levels', reason: 'A good answer depends on getting the right information', example: 'In Clincove, I worked on hybrid retrieval', result: 'For the final answer, I check whether it is grounded', close: 'For runtime, I check latency, failures, and fallback behavior', extra: 'For a more formal evaluation, I would also use' },
  16: { point: 'I start with least privilege', reason: 'The model should not have direct access to', example: 'I would expose a small set of backend tools', result: 'For sensitive actions, I would also require', close: 'I keep safe logs with IDs', extra: 'The LLM can suggest, but the backend controls' },
  17: { point: 'One example was a production issue with', reason: 'I did not want to assume the worker itself was', example: 'I traced the processing flow', result: 'I first made the current flow more stable', close: 'I handled the backend and workflow side', extra: 'I did not only focus on stopping the crash' },
  18: { point: 'I would not keep an HTTP request open', reason: 'Long-running work can take time or fail', example: 'A worker can process the job in the background', result: 'I can clearly separate temporary errors from', close: 'I also keep the job status clear', extra: 'For a more complex workflow, I may use something like Temporal' },
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
