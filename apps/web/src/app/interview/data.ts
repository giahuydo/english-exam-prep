export type Bilingual = { en: string; vi: string };

export type InterviewQuestion = {
  id: number;
  question: Bilingual;
  paragraphs: Bilingual[];
  context: string;
};

export const interviewIntro = {
  company: 'Everfit',
  role: 'Applied AI Backend Engineer',
  subtitle: '19 Interview Questions — Speaking & Reaction Format',
  note: 'Natural B1–B2 speaking version. " / " là chỗ ngắt hơi khi nói. **In đậm** = từ khóa cần nhớ. *In nghiêng* = câu mở đầu chuyển ý.',
};

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 1,
    question: {
      en: 'Can you tell me about your experience with AI-powered backend systems?',
      vi: 'Bạn có thể kể về kinh nghiệm với hệ thống backend tích hợp AI không?',
    },
    paragraphs: [
      {
        en: '*For me,* / my main background is **backend development**. / I have worked with **Node.js, NestJS, PostgreSQL, REST APIs, background workers, message queues**, / and third-party integrations.',
        vi: 'Nền tảng chính của mình là **backend**. Mình đã làm với Node.js, NestJS, PostgreSQL, REST API, background worker, message queue và tích hợp bên thứ ba.',
      },
      {
        en: '*The main reason is that* / in production, an AI feature is not only about calling a model. / The backend still needs to be **reliable, fast, observable**, / and able to recover when something fails.',
        vi: 'Lý do là trong production, một tính năng AI không chỉ là gọi model. Backend vẫn phải đáng tin cậy, nhanh, quan sát được và có khả năng phục hồi khi lỗi.',
      },
      {
        en: '*For example,* / in my recent project, I have worked more with **OCR, document processing, embeddings, hybrid search, and LLM integration**. / We process documents, create structured content and embeddings, / and use them later for semantic and hybrid retrieval.',
        vi: 'Ví dụ, ở dự án gần nhất mình làm nhiều với OCR, xử lý tài liệu, embeddings, hybrid search và tích hợp LLM. Nhóm xử lý tài liệu, tạo nội dung có cấu trúc và embedding rồi dùng cho tìm kiếm ngữ nghĩa/hybrid.',
      },
      {
        en: '*Because of that,* / I have experience with both the **AI part** / and the **backend workflow around it**, / including timeout, retry, fallback, data access, latency, and cost.',
        vi: 'Vì vậy mình có kinh nghiệm cả phần AI lẫn workflow backend xung quanh: timeout, retry, fallback, truy cập dữ liệu, latency và chi phí.',
      },
      {
        en: '*So overall,* / I would describe my strength as combining **strong backend engineering** / with **applied AI in a real production system**.',
        vi: 'Tóm lại, thế mạnh của mình là kết hợp backend engineering vững với AI ứng dụng trong hệ thống production thực tế.',
      },
    ],
    context: 'Context A: Backend foundation → Applied AI → Production reliability',
  },
  {
    id: 2,
    question: {
      en: 'Can you describe a RAG or retrieval system you have worked on?',
      vi: 'Bạn có thể mô tả một hệ thống RAG / retrieval mà bạn đã làm không?',
    },
    paragraphs: [
      {
        en: '*For me,* / I prefer not to rely on only one type of search. / In our system, we combine **lexical search** and **semantic search**.',
        vi: 'Mình không thích chỉ dựa vào một loại tìm kiếm. Hệ thống của tụi mình kết hợp lexical search và semantic search.',
      },
      {
        en: '*The main reason is that* / lexical search is good for **exact keywords**, / while semantic search is better for **meaning and similar context**.',
        vi: 'Lý do là lexical mạnh với từ khóa chính xác, còn semantic mạnh về nghĩa và ngữ cảnh tương tự.',
      },
      {
        en: '*For example,* / the lexical side uses **PostgreSQL full-text search**, / and the semantic side uses **embeddings with pgvector cosine similarity**.',
        vi: 'Ví dụ, phía lexical dùng PostgreSQL full-text search, phía semantic dùng embeddings với pgvector cosine similarity.',
      },
      {
        en: '*Because of that,* / we combine the two rankings with **Reciprocal Rank Fusion, or RRF**, / so a result that performs well across both searches can move higher in the final ranking.',
        vi: 'Vì vậy tụi mình gộp hai bảng xếp hạng bằng Reciprocal Rank Fusion (RRF), kết quả nào tốt ở cả hai sẽ được đẩy lên cao hơn.',
      },
      {
        en: "*At the same time,* / we also think about **failure and security**. / If the embedding service is unavailable, / we can fall back to lexical results, / and every search is still limited by the user's access.",
        vi: 'Đồng thời phải nghĩ tới lỗi và bảo mật. Nếu embedding service hỏng thì fallback về lexical, và mọi truy vấn vẫn giới hạn theo quyền của user.',
      },
      {
        en: '*So overall,* / the goal is to make retrieval more **balanced, reliable, and safe** / instead of depending on vector search alone.',
        vi: 'Tóm lại, mục tiêu là retrieval cân bằng, đáng tin cậy và an toàn hơn — thay vì chỉ dựa vào vector.',
      },
    ],
    context: 'Context B: Keyword/BM25 + Vector → RRF → Fallback & access control',
  },
  {
    id: 3,
    question: {
      en: 'How do you handle errors in an LLM workflow?',
      vi: 'Bạn xử lý lỗi trong workflow LLM như thế nào?',
    },
    paragraphs: [
      {
        en: '*For me,* / I do not just blame the **LLM** when something goes wrong. / I check the **whole workflow** to find the real root cause.',
        vi: 'Mình không đổ lỗi ngay cho LLM khi có sự cố. Mình soi toàn bộ workflow để tìm nguyên nhân gốc.',
      },
      {
        en: '*The main reason is that* / a bad result can come from **bad input, wrong retrieval, backend logic, prompt construction, the AI provider**, / or the model itself.',
        vi: 'Vì kết quả xấu có thể do input sai, retrieval sai, logic backend, cách dựng prompt, provider AI hoặc chính model.',
      },
      {
        en: '*For example,* / for **temporary failures** like network errors, timeouts, or some 5xx errors, / I can use a bounded **retry**. / If one model is unavailable, / I may use a **fallback model**. / But for invalid credentials or malformed requests, / I prefer to **fail fast**.',
        vi: 'Ví dụ, với lỗi tạm thời (network, timeout, một số 5xx) mình dùng retry có giới hạn. Nếu một model không khả dụng thì fallback sang model khác. Nhưng credential sai hoặc request hỏng thì fail fast luôn.',
      },
      {
        en: '*Because of that,* / I first separate **temporary errors from permanent errors** / before deciding whether to retry, fail, or fall back.',
        vi: 'Vì vậy mình luôn phân loại lỗi tạm thời vs vĩnh viễn trước khi quyết định retry, fail hay fallback.',
      },
      {
        en: '*At the same time,* / I normally track the **request or job ID, model used, latency, retry count, error type, token usage**, / and which workflow step failed.',
        vi: 'Đồng thời mình luôn log request/job ID, model, latency, số lần retry, loại lỗi, token và bước nào của workflow đã fail.',
      },
      {
        en: '*So overall,* / I focus on finding the **real root cause**, / using the **right strategy for each error**, / and making the workflow easy to monitor and debug.',
        vi: 'Tóm lại, mình tập trung vào nguyên nhân gốc, chọn chiến lược phù hợp cho từng loại lỗi và giữ workflow dễ monitor/debug.',
      },
    ],
    context: 'Context C: Root cause → Error strategy → Observability',
  },
  {
    id: 4,
    question: {
      en: 'Tell me about a difficult AI-related production problem you solved.',
      vi: 'Kể về một vấn đề production liên quan AI khó mà bạn đã giải quyết.',
    },
    paragraphs: [
      {
        en: '*One example was* / a document **OCR workflow** that processed large PDF files in background workers. / With bigger documents, / the **memory usage** became very high / and the worker sometimes crashed.',
        vi: 'Ví dụ là workflow OCR xử lý PDF lớn trong background worker. Với tài liệu lớn, memory tăng cao và worker đôi khi crash.',
      },
      {
        en: '*The main reason is that* / reducing the batch size helped for a while, / but it did not explain the real bottleneck. / The heavy **OCR inference was still running on CPU inside the worker**.',
        vi: 'Giảm batch size giúp một thời gian nhưng không giải thích được bottleneck thực sự. Vì OCR inference nặng vẫn chạy CPU ngay trong worker.',
      },
      {
        en: '*For example,* / I traced the **processing flow** step by step, / added targeted logging, / checked memory before and after expensive OCR stages, / and compared different **batch sizes**.',
        vi: 'Mình trace luồng xử lý từng bước, log có mục tiêu, đo memory trước/sau các bước OCR nặng, so sánh nhiều batch size khác nhau.',
      },
      {
        en: '*Because of that,* / I confirmed that the main bottleneck was the **OCR CPU inference**. / I first made the CPU path safer with **smaller batches, checkpoints, and recovery logic**.',
        vi: 'Nhờ đó xác nhận bottleneck chính là OCR CPU inference. Mình làm cho CPU path an toàn hơn trước bằng batch nhỏ hơn, checkpoint và recovery logic.',
      },
      {
        en: '*At the same time,* / I worked with **DevOps** / to move the heavy OCR inference / to a separate **GPU-backed service**, / while the worker focused more on orchestration.',
        vi: 'Đồng thời mình làm việc với DevOps để tách OCR nặng ra một service chạy GPU riêng, worker chỉ tập trung điều phối.',
      },
      {
        en: '*So overall,* / we reduced **memory pressure**, / made failures easier to recover from, / and created a better architecture for scaling the OCR workload.',
        vi: 'Tóm lại, tụi mình giảm áp lực memory, dễ phục hồi khi lỗi và có kiến trúc tốt hơn để scale OCR.',
      },
    ],
    context: 'Context D: OOM problem → Trace bottleneck → CPU safety + GPU service',
  },
  {
    id: 5,
    question: {
      en: 'How would you design a reliable AI agent workflow?',
      vi: 'Bạn sẽ thiết kế một workflow AI agent đáng tin cậy như thế nào?',
    },
    paragraphs: [
      {
        en: '*For me,* / I would not put everything into one large **LLM call**. / I would break the workflow into **clear steps**.',
        vi: 'Mình sẽ không nhồi tất cả vào một lần gọi LLM lớn. Mình chia workflow thành các bước rõ ràng.',
      },
      {
        en: '*The main reason is that* / clear step boundaries make the system easier to **debug, retry, monitor, and recover** when something fails.',
        vi: 'Vì ranh giới bước rõ giúp hệ thống dễ debug, retry, monitor và phục hồi khi có lỗi.',
      },
      {
        en: '*For example,* / the flow can be: **understand intent → retrieve context → decide whether a tool is needed → call the tool → validate the result → generate the final response**.',
        vi: 'Ví dụ luồng có thể là: hiểu ý định → lấy ngữ cảnh → quyết định có cần tool → gọi tool → kiểm tra kết quả → tạo phản hồi cuối.',
      },
      {
        en: '*Because of that,* / the **backend** should control tool execution. / It defines the tool contract, validates arguments, checks permissions, / executes the action, / and returns a structured result.',
        vi: 'Vì vậy backend nên kiểm soát việc thực thi tool: định nghĩa contract, validate tham số, check permission, thực thi và trả kết quả có cấu trúc.',
      },
      {
        en: '*At the same time,* / for longer workflows, I would persist important **state**, / use timeout and bounded retry, / keep external actions **idempotent**, / and track latency, tool errors, token usage, cost, and output quality.',
        vi: 'Đồng thời với workflow dài, mình lưu state quan trọng, đặt timeout + retry giới hạn, giữ hành động ngoài idempotent, và theo dõi latency, lỗi tool, token, chi phí, chất lượng output.',
      },
      {
        en: '*So overall,* / I use the **LLM for flexible reasoning**, / but keep important backend actions **deterministic and controlled**.',
        vi: 'Tóm lại, dùng LLM để suy luận linh hoạt nhưng giữ các hành động backend quan trọng ở trạng thái xác định và có kiểm soát.',
      },
    ],
    context: 'Context E: Steps → Controlled tools → Recovery & metrics',
  },
  {
    id: 6,
    question: {
      en: 'Have you worked with Temporal before?',
      vi: 'Bạn đã từng làm việc với Temporal chưa?',
    },
    paragraphs: [
      {
        en: '*For me,* / I have not used **Temporal directly in production** yet.',
        vi: 'Mình chưa dùng Temporal trực tiếp trong production.',
      },
      {
        en: '*The main reason is that* / I have already worked with many of the same problems: **long-running jobs, retries, checkpoints, idempotency, failure recovery**, / and multi-step processing.',
        vi: 'Nhưng mình đã xử lý nhiều vấn đề tương tự: job chạy lâu, retry, checkpoint, idempotency, phục hồi lỗi và xử lý nhiều bước.',
      },
      {
        en: '*For example,* / in our document pipeline, / if a job fails in the middle, / we do not want to restart the **whole workflow from the beginning**.',
        vi: 'Ví dụ trong pipeline tài liệu, nếu job fail giữa chừng, tụi mình không muốn phải chạy lại toàn bộ từ đầu.',
      },
      {
        en: '*Because of that,* / I understand why a durable workflow system is useful. / From what I understand, Temporal persists **workflow state** / and separates external work into **activities**, / which makes retry and recovery easier to manage.',
        vi: 'Vì vậy mình hiểu tại sao workflow bền vững là quan trọng. Theo mình hiểu, Temporal lưu state workflow và tách công việc bên ngoài thành activity, giúp retry/recovery dễ hơn.',
      },
      {
        en: "*At the same time,* / I know I still need to learn Temporal's specific **programming model, APIs, and best practices**.",
        vi: 'Đồng thời mình biết vẫn cần học programming model, API và best practice cụ thể của Temporal.',
      },
      {
        en: '*So overall,* / my main gap is the **tool itself**, / not the underlying distributed workflow concepts.',
        vi: 'Tóm lại, gap chính của mình là bản thân tool, không phải khái niệm workflow phân tán bên dưới.',
      },
    ],
    context: 'Context F: Not used directly → Same problems solved → Learn the tool, not the concept',
  },
  {
    id: 7,
    question: {
      en: 'How much experience do you have with AI agents?',
      vi: 'Bạn có bao nhiêu kinh nghiệm với AI agent?',
    },
    paragraphs: [
      {
        en: '*For me,* / I have not spent several years building fully **autonomous AI agents**. / My recent experience is more focused on **AI-powered backend workflows, retrieval, LLM integration**, / and production reliability.',
        vi: 'Mình chưa có nhiều năm xây agent hoàn toàn tự động. Kinh nghiệm gần đây tập trung vào workflow backend có AI, retrieval, tích hợp LLM và độ tin cậy production.',
      },
      {
        en: '*The main reason is that* / many important agent building blocks are already familiar to me.',
        vi: 'Nhưng nhiều khối xây dựng quan trọng của agent mình đã quen.',
      },
      {
        en: '*For example,* / I have worked with **retrieval, structured LLM input and output, workflow state, tool contracts, retries, logging**, / and failure handling.',
        vi: 'Ví dụ, mình đã làm với retrieval, input/output có cấu trúc cho LLM, state workflow, tool contract, retry, log và xử lý lỗi.',
      },
      {
        en: '*Because of that,* / I think of an agent as a **controlled workflow**: understand the intent, get the right context, decide whether a tool is needed, / execute it through backend controls, / validate the result, / and then generate the response.',
        vi: 'Vì vậy mình xem agent như một workflow có kiểm soát: hiểu ý định → lấy ngữ cảnh đúng → quyết định có cần tool → chạy qua backend có kiểm soát → validate → tạo phản hồi.',
      },
      {
        en: '*At the same time,* / my direct agent experience is still growing, / but the **production engineering foundation** behind agent systems is already very familiar to me.',
        vi: 'Kinh nghiệm agent trực tiếp còn đang phát triển, nhưng nền tảng production engineering đằng sau agent mình đã rất quen.',
      },
      {
        en: '*So overall,* / I am honest about the gap, / but I am confident I can build on the backend and AI workflow experience I already have.',
        vi: 'Tóm lại, mình thẳng thắn về gap nhưng tự tin có thể phát triển tiếp trên nền backend và AI workflow đã có.',
      },
    ],
    context: 'Context E: Not an autonomous-agent expert → Know the building blocks → Can engineer the workflow',
  },
  {
    id: 8,
    question: {
      en: 'Do you have experience with LLM evals?',
      vi: 'Bạn có kinh nghiệm với LLM evals không?',
    },
    paragraphs: [
      {
        en: '*For me,* / I have not owned a large **LLM evaluation platform** in production yet.',
        vi: 'Mình chưa từng sở hữu một platform đánh giá LLM lớn trong production.',
      },
      {
        en: '*The main reason is that* / it follows a testing mindset I already use: define the expected behavior, build test cases, run them repeatedly, / and check for **regressions** when the system changes.',
        vi: 'Nhưng eval theo tư duy testing mình đã dùng: định nghĩa hành vi mong đợi, xây test case, chạy lặp lại và kiểm regression khi hệ thống thay đổi.',
      },
      {
        en: '*For example,* / in retrieval, I care about whether the **correct documents** are returned / and how the **ranking** changes when we update the retrieval strategy.',
        vi: 'Ví dụ với retrieval, mình quan tâm document đúng có được trả về không và ranking thay đổi ra sao khi cập nhật chiến lược retrieval.',
      },
      {
        en: '*Because of that,* / for LLM evals, I would build a **representative dataset**, / define what good behavior looks like, / and measure correctness, groundedness, retrieval quality, tool-call success, latency, and cost.',
        vi: 'Với LLM eval, mình sẽ xây dataset đại diện, định nghĩa thế nào là hành vi tốt, và đo correctness, groundedness, chất lượng retrieval, tỉ lệ tool-call thành công, latency và chi phí.',
      },
      {
        en: '*At the same time,* / for more subjective outputs, / I would combine **automatic evaluation with human review** / instead of depending on only one metric.',
        vi: 'Với output mang tính chủ quan hơn, mình kết hợp eval tự động với review của người thay vì phụ thuộc một chỉ số.',
      },
      {
        en: '*So overall,* / my experience with formal LLM eval platforms is still growing, / but the **evaluation and regression mindset** is already familiar to me.',
        vi: 'Tóm lại, kinh nghiệm với platform eval chính thức còn đang phát triển, nhưng tư duy đánh giá và regression thì đã quen.',
      },
    ],
    context: 'Context G: No large eval platform → Strong test mindset → Dataset + metrics + regression',
  },
  {
    id: 9,
    question: {
      en: 'You have more backend experience than AI experience. Why should we hire you for a 70% AI role?',
      vi: 'Bạn có nhiều kinh nghiệm backend hơn AI. Tại sao nên tuyển bạn cho vị trí 70% AI?',
    },
    paragraphs: [
      {
        en: '*For me,* / that is true. / My strongest foundation is **backend engineering**.',
        vi: 'Điều đó đúng. Nền tảng mạnh nhất của mình là backend engineering.',
      },
      {
        en: '*The main reason is that* / in production, an AI feature is not only the model. / It still needs **data pipelines, retrieval, APIs, queues, state management, retries, monitoring, security**, / and infrastructure.',
        vi: 'Nhưng trong production, tính năng AI không chỉ là model. Nó cần pipeline dữ liệu, retrieval, API, queue, state, retry, monitoring, bảo mật và hạ tầng.',
      },
      {
        en: '*For example,* / those are areas where I already have strong hands-on experience / from building and operating production backend systems.',
        vi: 'Đó là những mảng mình đã có kinh nghiệm thực chiến từ việc xây và vận hành backend production.',
      },
      {
        en: '*Because of that,* / I can focus on growing deeper in AI / without starting again from zero on the production engineering side.',
        vi: 'Vì vậy mình có thể tập trung phát triển sâu về AI mà không phải bắt đầu lại từ đầu ở mảng engineering production.',
      },
      {
        en: '*At the same time,* / recently I have been working more with **OCR, embeddings, hybrid retrieval, LLM integration, model reliability**, / and **GPU inference**.',
        vi: 'Gần đây mình đã làm nhiều hơn với OCR, embeddings, hybrid retrieval, tích hợp LLM, độ tin cậy model và GPU inference.',
      },
      {
        en: '*So overall,* / I see myself as building stronger **AI capability** / on top of a solid **production backend foundation**.',
        vi: 'Tóm lại, mình đang xây dựng năng lực AI mạnh hơn trên nền backend production vững chắc.',
      },
    ],
    context: 'Context A: Backend is true → Backend is an advantage → Already moving deeper into AI',
  },
  {
    id: 10,
    question: {
      en: 'Do you have strong experience with tool calling?',
      vi: 'Bạn có kinh nghiệm sâu về tool calling không?',
    },
    paragraphs: [
      {
        en: '*For me,* / I understand **tool calling** and the backend contracts around AI workflows, / but I have not built a very large production ecosystem with dozens of tools yet.',
        vi: 'Mình hiểu tool calling và các contract backend quanh AI workflow, nhưng chưa xây một hệ sinh thái production rất lớn với hàng chục tool.',
      },
      {
        en: '*The main reason is that* / I do not think an LLM should directly execute **arbitrary actions**. / The backend should stay in control.',
        vi: 'Vì mình không nghĩ LLM nên trực tiếp thực thi hành động tuỳ ý. Backend phải giữ quyền kiểm soát.',
      },
      {
        en: '*For example,* / the backend defines the **tool schema**, validates arguments, checks permissions, executes the operation, / and returns a structured result to the model.',
        vi: 'Ví dụ, backend định nghĩa tool schema, validate tham số, check permission, thực thi và trả kết quả có cấu trúc về cho model.',
      },
      {
        en: '*Because of that,* / we get a clear boundary between **probabilistic LLM reasoning** / and **deterministic backend behavior**.',
        vi: 'Vì vậy có ranh giới rõ giữa suy luận xác suất của LLM và hành vi xác định của backend.',
      },
      {
        en: '*At the same time,* / I would trace every tool call with a **call ID, input, result, latency, and error status**. / For write actions, / I would also use **idempotency and careful retry handling**.',
        vi: 'Đồng thời mình sẽ trace mỗi tool call với call ID, input, kết quả, latency và error. Với hành động ghi, mình dùng idempotency và retry cẩn thận.',
      },
      {
        en: '*So overall,* / the principle I remember is: **the LLM proposes; the backend decides and executes**.',
        vi: 'Tóm lại, nguyên tắc là: LLM đề xuất, backend quyết định và thực thi.',
      },
    ],
    context: 'Context E/H: Limited scale → Contract & control → Observability + idempotency',
  },
  {
    id: 11,
    question: {
      en: "You haven't used our exact AI stack. How quickly can you adapt?",
      vi: 'Bạn chưa dùng đúng stack AI của tụi mình. Bạn thích nghi nhanh cỡ nào?',
    },
    paragraphs: [
      {
        en: '*For me,* / I normally learn a new technology by connecting it to **engineering problems I already understand**.',
        vi: 'Mình học công nghệ mới bằng cách kết nối nó với các vấn đề engineering mình đã hiểu.',
      },
      {
        en: '*The main reason is that* / the framework may change, / but many of the underlying problems stay the same.',
        vi: 'Vì framework có thể thay đổi nhưng nhiều vấn đề nền tảng bên dưới thì không đổi.',
      },
      {
        en: '*For example,* / when I study **Temporal**, I connect it to retries, checkpoints, durable state, / and long-running workflows that I have already worked with.',
        vi: 'Ví dụ khi học Temporal, mình liên hệ với retry, checkpoint, state bền vững và workflow chạy lâu mà mình đã làm.',
      },
      {
        en: '*Because of that,* / this is also how I moved from traditional backend work into **OCR, embeddings, retrieval, LLM integration**, / and GPU-based inference.',
        vi: 'Đây cũng là cách mình chuyển từ backend truyền thống sang OCR, embeddings, retrieval, tích hợp LLM và GPU inference.',
      },
      {
        en: '*At the same time,* / I know every new stack still has its own **abstractions, APIs, and best practices** / that I need to learn.',
        vi: 'Đồng thời mỗi stack mới vẫn có abstraction, API và best practice riêng mình cần học.',
      },
      {
        en: '*So overall,* / I usually do not need to relearn the engineering fundamentals. / I mainly need to learn the new tool, / so I am confident I can adapt relatively quickly.',
        vi: 'Tóm lại, mình không phải học lại kiến thức engineering nền tảng, chỉ cần học tool mới, nên tự tin thích nghi khá nhanh.',
      },
    ],
    context: 'Context I: Map to known problems → Proven adaptation → Learn abstraction, not fundamentals',
  },
  {
    id: 12,
    question: {
      en: 'How would you design an AI agent system for Everfit?',
      vi: 'Bạn sẽ thiết kế hệ thống AI agent cho Everfit ra sao?',
    },
    paragraphs: [
      {
        en: '*For me,* / I would start with the **user goal** / and clearly define what the agent is allowed to do / and what data it can access.',
        vi: 'Mình bắt đầu từ mục tiêu user và định nghĩa rõ agent được phép làm gì, truy cập data nào.',
      },
      {
        en: '*The main reason is that* / I would not want to put the **whole database** into the prompt. / I would only retrieve the context that is relevant and allowed for that user.',
        vi: 'Vì mình không muốn nhét cả database vào prompt. Chỉ lấy context liên quan và được phép cho từng user.',
      },
      {
        en: '*For example,* / if a user asks about training progress or a personalized plan, / the agent may retrieve the relevant **profile, workout history, goals**, / and other allowed context.',
        vi: 'Ví dụ nếu user hỏi tiến độ tập hay kế hoạch cá nhân hoá, agent có thể lấy profile, lịch sử tập, mục tiêu và context được phép.',
      },
      {
        en: '*Because of that,* / I would expose clear **backend tools** for actions like getting workout history, reading progress metrics, / or creating a draft plan. / The backend still validates **arguments and permissions** before executing anything.',
        vi: 'Vì vậy mình sẽ expose các backend tool rõ ràng để lấy lịch sử tập, đọc metric, tạo draft plan… Backend vẫn validate tham số và permission trước khi thực thi.',
      },
      {
        en: '*At the same time,* / I would persist important workflow state, trace tool calls, / use timeout and retry for external services, / and create **eval cases** for common goals and edge cases.',
        vi: 'Đồng thời lưu state workflow quan trọng, trace tool call, dùng timeout + retry cho service ngoài và có eval cho use case phổ biến/edge case.',
      },
      {
        en: '*So overall,* / I would design it as a **controlled AI workflow** / with the right context, safe tool execution, / and enough reliability and evaluation around it.',
        vi: 'Tóm lại, mình thiết kế như một workflow AI có kiểm soát: đúng context, chạy tool an toàn, đủ độ tin cậy và đánh giá xung quanh.',
      },
    ],
    context: 'Context E: User goal/context → Controlled tools → Reliability & evals',
  },
  {
    id: 13,
    question: {
      en: 'How do you control latency and cost in an LLM system?',
      vi: 'Bạn kiểm soát latency và chi phí trong hệ thống LLM thế nào?',
    },
    paragraphs: [
      {
        en: '*For me,* / I first try to reduce **unnecessary LLM work**.',
        vi: 'Đầu tiên mình cố giảm công việc LLM không cần thiết.',
      },
      {
        en: '*The main reason is that* / every model call and every extra token can increase both **latency and cost**.',
        vi: 'Vì mỗi lần gọi model và mỗi token thừa đều làm tăng cả latency lẫn chi phí.',
      },
      {
        en: '*For example,* / some decisions can use normal **backend logic, caching, or precomputed data** / instead of calling a model. / I also try to keep the **context size** under control.',
        vi: 'Ví dụ, một số quyết định có thể dùng logic backend, caching hoặc data đã tính sẵn thay vì gọi model. Mình cũng kiểm soát kích thước context.',
      },
      {
        en: '*Because of that,* / I choose the **model based on the task** / instead of always using the most expensive one. / For independent calls, I can run them in **parallel** when it is safe, / and use timeout and bounded retry.',
        vi: 'Vì vậy mình chọn model theo task chứ không luôn dùng cái đắt nhất. Các call độc lập chạy song song khi an toàn, có timeout và retry giới hạn.',
      },
      {
        en: '*At the same time,* / I track **latency, token usage, retry count, model used, and error rate** / by workflow or operation.',
        vi: 'Đồng thời theo dõi latency, token, số retry, model dùng và error rate theo từng workflow/operation.',
      },
      {
        en: '*So overall,* / I prefer to optimize from **real production data** / instead of guessing which part is slow or expensive.',
        vi: 'Tóm lại, mình tối ưu dựa trên dữ liệu production thật thay vì đoán phần nào chậm/tốn.',
      },
    ],
    context: 'Context C: Avoid unnecessary calls/context → Right model/execution → Measure tokens & latency',
  },
  {
    id: 14,
    question: {
      en: 'How do you prevent hallucination?',
      vi: 'Bạn phòng ngừa hallucination bằng cách nào?',
    },
    paragraphs: [
      {
        en: '*For me,* / the first step is to give the model the **right and limited context**.',
        vi: 'Bước đầu tiên là đưa cho model context đúng và giới hạn.',
      },
      {
        en: '*The main reason is that* / if the context is wrong, / even a strong model can give a very confident **wrong answer**.',
        vi: 'Vì nếu context sai, model mạnh vẫn có thể trả lời sai với vẻ rất tự tin.',
      },
      {
        en: '*For example,* / for knowledge-based questions, I prefer good **retrieval** and relevant evidence / instead of asking the model to depend only on general memory.',
        vi: 'Ví dụ với câu hỏi kiến thức, mình dùng retrieval tốt và evidence liên quan thay vì để model dựa vào trí nhớ chung.',
      },
      {
        en: '*Because of that,* / for machine-consumed output, I prefer **structured formats and backend validation**. / If the model suggests an action that affects data, / the backend should still enforce the business rules.',
        vi: 'Với output cho máy đọc, mình dùng format có cấu trúc và validate ở backend. Nếu model đề xuất hành động ảnh hưởng data, backend vẫn phải enforce business rule.',
      },
      {
        en: '*At the same time,* / I would use **eval cases** for common and risky scenarios. / For high-risk actions, I would rather ask for clarification, require confirmation, / or use a deterministic fallback / than let the model guess.',
        vi: 'Đồng thời có eval cho các case phổ biến và rủi ro cao. Với hành động rủi ro cao mình thà hỏi lại, yêu cầu xác nhận hoặc dùng fallback xác định còn hơn để model đoán.',
      },
      {
        en: '*So overall,* / I do not think hallucination can be completely removed, / but we can **reduce and control the risk** with better context, validation, evals, and safe fallback.',
        vi: 'Tóm lại, không thể loại bỏ hoàn toàn hallucination, nhưng có thể giảm và kiểm soát bằng context tốt hơn, validation, eval và fallback an toàn.',
      },
    ],
    context: 'Context C/G: Better context → Structured validation → Evals & safe fallback',
  },
  {
    id: 15,
    question: {
      en: 'How do you evaluate whether a RAG system is good?',
      vi: 'Bạn đánh giá một hệ thống RAG tốt hay không như thế nào?',
    },
    paragraphs: [
      {
        en: '*For me,* / I would evaluate **retrieval** and the **final answer** separately.',
        vi: 'Mình đánh giá retrieval và câu trả lời cuối tách biệt.',
      },
      {
        en: '*The main reason is that* / if retrieval gives the wrong evidence, / the final LLM answer cannot be reliable even if it sounds good.',
        vi: 'Vì nếu retrieval trả evidence sai, câu trả lời cuối của LLM không đáng tin dù nghe hay.',
      },
      {
        en: '*For example,* / with a labeled test set, I can check whether the **relevant document or chunk** appears in the top results / and compare ranking quality when the retrieval strategy changes.',
        vi: 'Ví dụ với test set có label, mình kiểm document/chunk liên quan có trong top không và so sánh chất lượng ranking khi đổi chiến lược retrieval.',
      },
      {
        en: '*Because of that,* / after retrieval, I check whether the final answer is **correct, grounded in the evidence**, / and avoids unsupported claims.',
        vi: 'Sau retrieval mình kiểm câu trả lời cuối có đúng, có bám vào evidence và tránh khẳng định không có căn cứ.',
      },
      {
        en: '*At the same time,* / I also track **latency, embedding failures, empty retrieval, token cost, and fallback rate**. / I keep a stable eval dataset / and rerun it when embeddings, ranking, prompts, or models change.',
        vi: 'Đồng thời theo dõi latency, lỗi embedding, retrieval rỗng, chi phí token và tỉ lệ fallback. Giữ eval dataset ổn định và rerun mỗi khi thay embeddings, ranking, prompt hay model.',
      },
      {
        en: '*So overall,* / I evaluate the system at three levels: **retrieval quality, answer quality, and production metrics** / so I can detect regressions clearly.',
        vi: 'Tóm lại, mình đánh giá 3 mức: chất lượng retrieval, chất lượng trả lời và metric production — để phát hiện regression rõ ràng.',
      },
    ],
    context: 'Context B/G: Retrieval quality → Answer quality → System metrics + regression',
  },
  {
    id: 16,
    question: {
      en: 'How do you secure an AI agent that can call tools?',
      vi: 'Bạn bảo mật một AI agent có thể gọi tool ra sao?',
    },
    paragraphs: [
      {
        en: '*For me,* / I would start with **least privilege** / and only expose the tools the agent actually needs.',
        vi: 'Mình bắt đầu bằng least privilege — chỉ expose các tool agent thực sự cần.',
      },
      {
        en: '*The main reason is that* / the model should never have unlimited access to **internal services or databases**.',
        vi: 'Vì model không nên có quyền truy cập không giới hạn vào service nội bộ hay database.',
      },
      {
        en: "*For example,* / each tool should have a clear **schema and limited responsibility**. / Before execution, the backend validates the arguments / and checks the user's **permission** through the normal authorization layer.",
        vi: 'Ví dụ, mỗi tool có schema rõ và trách nhiệm giới hạn. Trước khi chạy, backend validate tham số và check permission của user qua lớp authorization thông thường.',
      },
      {
        en: '*Because of that,* / sensitive data should be minimized, / and important or destructive actions may need **explicit user confirmation**.',
        vi: 'Vì vậy phải giảm thiểu dữ liệu nhạy cảm, và các hành động quan trọng/phá huỷ có thể cần user xác nhận rõ ràng.',
      },
      {
        en: '*At the same time,* / I would log tool calls and results with **correlation IDs** while avoiding sensitive data in logs. / For write operations, I would use **idempotency** / so retries cannot accidentally duplicate an action.',
        vi: 'Đồng thời log tool call và kết quả kèm correlation ID nhưng tránh log dữ liệu nhạy cảm. Với operation ghi, dùng idempotency để retry không vô tình lặp hành động.',
      },
      {
        en: '*So overall,* / the model can suggest an action, / but the **backend controls access, validation, execution, and audit**.',
        vi: 'Tóm lại, model có thể đề xuất hành động nhưng backend kiểm soát truy cập, validate, thực thi và audit.',
      },
    ],
    context: 'Context H: Allowlist/least privilege → Permission & validation → Audit + idempotency',
  },
  {
    id: 17,
    question: {
      en: 'Tell me about a production incident you owned end-to-end.',
      vi: 'Kể về một sự cố production mà bạn đã own từ đầu đến cuối.',
    },
    paragraphs: [
      {
        en: '*One example was* / a production issue with **large PDF processing jobs**. / During **OCR**, / the **memory usage** kept increasing, / and eventually the worker crashed.',
        vi: 'Một ví dụ là sự cố production với job xử lý PDF lớn. Trong lúc OCR, memory tăng liên tục và cuối cùng worker crash.',
      },
      {
        en: '*The main reason is that* / I did not want to assume the **worker itself** was the real problem. / I wanted to find the **root cause** first.',
        vi: 'Mình không muốn giả định worker là nguyên nhân. Mình muốn tìm root cause trước.',
      },
      {
        en: '*For example,* / I traced the **processing flow**, / added **targeted logging**, / checked the memory usage at important steps, / and tested different **batch sizes**. / From that, / I found that the main bottleneck was the **OCR CPU inference**.',
        vi: 'Mình trace luồng xử lý, thêm log có mục tiêu, đo memory tại các bước quan trọng và thử nhiều batch size. Từ đó xác định bottleneck chính là OCR CPU inference.',
      },
      {
        en: '*Because of that,* / I first made the current flow more stable / by using **smaller batches** and adding **checkpoint and recovery logic**, / so if one step failed, / we did not need to restart the whole job.',
        vi: 'Vì vậy mình làm cho luồng hiện tại ổn định hơn trước bằng batch nhỏ hơn, checkpoint và recovery logic — bước nào lỗi cũng không phải chạy lại toàn bộ job.',
      },
      {
        en: '*At the same time,* / I handled the **backend and workflow side** / and worked with **DevOps** to move the heavy OCR inference / to a **remote GPU service**.',
        vi: 'Đồng thời mình xử lý phần backend/workflow và phối hợp DevOps để đưa OCR nặng sang một GPU service tách riêng.',
      },
      {
        en: '*So overall,* / I did not only focus on stopping the crash. / I also checked **worker stability, memory usage, job completion, and processing time** / to make sure the new solution was **stable, observable, and safe to roll out**.',
        vi: 'Tóm lại, mình không chỉ dừng crash — còn kiểm ổn định worker, memory, tỉ lệ job hoàn tất và thời gian xử lý để đảm bảo giải pháp mới ổn định, quan sát được và an toàn khi roll out.',
      },
    ],
    context: 'Context D: Incident → Investigation/ownership → Mitigation + architecture improvement',
  },
  {
    id: 18,
    question: {
      en: 'How do you design an async workflow that may run for several minutes?',
      vi: 'Bạn thiết kế async workflow có thể chạy vài phút ra sao?',
    },
    paragraphs: [
      {
        en: '*For me,* / I would not keep an **HTTP request open** / for a job that may run for several minutes.',
        vi: 'Mình không giữ HTTP request mở cho một job chạy nhiều phút.',
      },
      {
        en: '*The main reason is that* / long-running work can take time or fail, / so I prefer to create a **job**, / save its **state**, / put the work into a **queue**, / and return a **job ID** to the client.',
        vi: 'Vì việc chạy lâu có thể tốn thời gian hoặc fail, nên mình tạo job, lưu state, đẩy vào queue và trả về job ID cho client.',
      },
      {
        en: '*For example,* / a **worker** can process the job in the background. / For a multi-step workflow, / I save the **result of each important step** / and use **checkpoints**, / so if one step fails, / I do not need to restart the whole workflow.',
        vi: 'Ví dụ, worker xử lý job trong background. Với workflow nhiều bước, mình lưu kết quả của từng bước quan trọng và dùng checkpoint — nếu bước nào lỗi cũng không phải chạy lại toàn bộ.',
      },
      {
        en: '*Because of that,* / I can clearly separate **temporary errors from permanent errors**, / add **retries** for temporary failures, / and keep external actions **idempotent**.',
        vi: 'Vì vậy mình tách rõ lỗi tạm thời vs vĩnh viễn, retry lỗi tạm thời và giữ hành động ngoài idempotent.',
      },
      {
        en: '*At the same time,* / I also keep the **job status** clear, / for example **queued, running, completed, or failed**, / so it is easier to monitor and debug.',
        vi: 'Đồng thời trạng thái job phải rõ (queued, running, completed, failed) để dễ monitor/debug.',
      },
      {
        en: '*So overall,* / for a more complex workflow, / I may use something like **Temporal** / because it helps manage **workflow state, retries, timers, and recovery**.',
        vi: 'Tóm lại, với workflow phức tạp hơn, mình có thể dùng Temporal vì nó giúp quản lý state, retry, timer và recovery.',
      },
    ],
    context: 'Context F: Async job → Checkpoint/retry/idempotency → Durable orchestration',
  },
  {
    id: 19,
    question: {
      en: 'Tell me about a technical decision you disagreed with.',
      vi: 'Kể về một quyết định kỹ thuật mà bạn không đồng tình.',
    },
    paragraphs: [
      {
        en: '*For me,* / when I disagree with a **technical decision**, / I first try to understand **why the team chose it**.',
        vi: 'Khi mình không đồng tình một quyết định kỹ thuật, mình luôn tìm hiểu vì sao team chọn nó trước.',
      },
      {
        en: '*The main reason is that* / sometimes the decision is not only about technology. / It can also be about **delivery time, risk, existing architecture, or business priority**.',
        vi: 'Vì đôi khi quyết định không chỉ về công nghệ — còn về deadline, rủi ro, kiến trúc hiện có hoặc ưu tiên business.',
      },
      {
        en: '*For example,* / if I think another approach is better, / I do not just say the current one is wrong. / I bring **evidence** like logs, performance data, code behavior, failure cases, / or maintenance cost.',
        vi: 'Ví dụ nếu mình nghĩ cách khác tốt hơn, mình không chỉ nói cách hiện tại sai. Mình mang evidence: log, số liệu performance, hành vi code, failure case hoặc chi phí bảo trì.',
      },
      {
        en: '*Because of that,* / I can explain the **trade-offs** more clearly / and usually give the team **more than one option** to consider.',
        vi: 'Vì vậy mình giải thích trade-off rõ hơn và thường đưa nhiều hơn một phương án để team cân nhắc.',
      },
      {
        en: '*At the same time,* / once the team makes a decision, / I support it and help **execute it**. / If we are still not sure, / I prefer a **small test or controlled rollout** / to collect more evidence.',
        vi: 'Đồng thời khi team đã chốt, mình ủng hộ và giúp thực thi. Nếu vẫn chưa chắc, mình đề xuất test nhỏ hoặc rollout có kiểm soát để thu thêm evidence.',
      },
      {
        en: '*So overall,* / for me, a good technical disagreement is not about **winning an argument**. / It is about making a **clearer decision** / and getting a **better result for the system**.',
        vi: 'Tóm lại, tranh luận kỹ thuật tốt không phải để thắng — mà để ra quyết định rõ hơn và kết quả tốt hơn cho hệ thống.',
      },
    ],
    context: 'Context J: Understand → Evidence/trade-offs → Align & verify',
  },
];

export type StrategyRow = {
  code: string;
  context: string;
  triggers: string;
  questions: string;
};

export const strategyRows: StrategyRow[] = [
  { code: 'A', context: 'Backend → Applied AI → Production', triggers: 'AI experience, fit, backend-heavy background', questions: '1, 9, 11' },
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
