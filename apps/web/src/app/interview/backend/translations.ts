import type { BackendQuestion, EnglishBackendQuestion } from './source-questions';

// Vietnamese study translations correspond by topic number and question order to source-questions.ts.
export type BackendTranslation = { questionVi: string; answerVi: string; keyIdeaVi: string };
export const translations: Record<number, BackendTranslation[]> = {
  1: [
    {
      questionVi: 'Node.js xử lý công việc I/O và CPU-heavy như thế nào, và điều gì có thể chặn event loop?',
      answerVi: 'Về cơ bản, Node.js chạy JavaScript trên main event loop. Với công việc I/O, như truy vấn database hoặc network request, Node.js có thể chờ mà không chặn main thread. Khi tôi dùng async và await, chỉ function hiện tại tạm dừng, trong khi event loop vẫn có thể tiếp tục xử lý công việc khác. Một số thao tác file và DNS cũng có thể dùng libuv worker pool. CPU-heavy thì khác. Ví dụ, xử lý tài liệu nặng hoặc một phép tính lớn có thể dùng rất nhiều CPU. Nếu tôi chạy công việc đó trên main thread, nó có thể chặn event loop, nên các request khác phải chờ. Với CPU-heavy work, tôi có thể dùng worker threads, background queue, hoặc separate service, tùy use case. Tóm lại, Node.js hoạt động rất tốt với hệ thống I/O-heavy, nhưng tôi tránh chạy CPU-heavy work trực tiếp trên main thread.',
      keyIdeaVi: 'I/O bắt đầu → await tạm dừng function hiện tại → event loop vẫn rảnh → I/O hoàn thành → function tiếp tục → xử lý tài liệu nặng / phép tính lớn → CPU-heavy work chặn event loop → chuyển công việc nặng ra khỏi main thread',
    },
  ],
  2: [
    {
      questionVi: 'Tính idempotent là gì và khi nào cần đến nó?',
      answerVi: 'Idempotency nghĩa là cùng một request hoặc message có thể được xử lý nhiều lần mà không tạo ra cùng một hành động nghiệp vụ hai lần. Một cách phổ biến là dùng request ID, job ID hoặc một khóa duy nhất.',
      keyIdeaVi: 'Cùng request hoặc message đến lại → kiểm tra request ID, job ID hoặc khóa duy nhất → không lặp lại hành động nghiệp vụ.',
    },
  ],
  3: [
    {
      questionVi: 'Bạn điều tra API chậm như thế nào khi CPU usage vẫn thấp?',
      answerVi: 'Về cơ bản, nếu API chậm nhưng CPU usage thấp, thường là các request đang phải chờ thay vì thực hiện tính toán nặng. Đầu tiên, tôi trace một slow request và kiểm tra thời gian đang nằm ở đâu, ví dụ database query, connection pool hoặc external API. Nếu database chậm, tôi kiểm tra slow query log, query plan, index, lượng dữ liệu trả về và các N+1 query có thể xảy ra. Nếu connection pool bị đầy, request mới phải chờ một connection rảnh. Khi đó tôi kiểm tra active connection, long-running query, pool size, timeout và xem connection có được release đúng hay không. Tôi cố gắng sửa root cause trước khi thêm API instance, vì nhiều instance hơn có thể tạo thêm nhiều database connection. Sau đó tôi đo lại latency.',
      keyIdeaVi: 'API chậm + CPU thấp → request đang chờ → trace thời gian nằm ở đâu → kiểm tra DB query + pool + external call → sửa root cause trước khi scale → đo lại',
    },
    {
      questionVi: 'Chỉ mục cơ sở dữ liệu là gì và đánh đổi của nó là gì?',
      answerVi: 'Chỉ mục giúp cơ sở dữ liệu tìm dữ liệu nhanh hơn mà không cần quét toàn bộ bảng. Nó hữu ích với các cột thường dùng trong điều kiện WHERE, JOIN hoặc ORDER BY. Tuy nhiên, chỉ mục tốn thêm dung lượng và làm thao tác chèn, cập nhật tốn kém hơn, nên tôi không thêm chỉ mục ở mọi nơi.',
      keyIdeaVi: 'Chỉ mục → tìm dòng nhanh hơn mà không quét cả bảng → dùng cho cột thường xuất hiện trong WHERE, JOIN hoặc ORDER BY → cân nhắc dung lượng và thao tác ghi chậm hơn.',
    },
    {
      questionVi: 'Bạn ngăn race condition khi hai yêu cầu cập nhật cùng một dữ liệu như thế nào?',
      answerVi: 'Về cơ bản, nó phụ thuộc vào loại dữ liệu và mức độ quan trọng của việc cập nhật. Trong dự án hiện tại của tôi, với một số cập nhật form quan trọng, chúng tôi dùng database transaction cùng với write lock. Nếu một request đang cập nhật row đó, request khác phải chờ cho đến khi request đầu tiên hoàn thành. Đây là pessimistic locking. Một lựa chọn khác là optimistic locking. Một cách phổ biến là dùng version number. Backend kiểm tra version có còn giống như trước hay không trước khi cập nhật. Nếu request khác đã thay đổi dữ liệu trước đó, version sẽ khác, vì vậy chúng tôi trả về conflict thay vì ghi đè dữ liệu mới hơn. Với một số background job, chúng tôi dùng thêm một kiểm tra đơn giản khác. Chúng tôi chỉ cập nhật job nếu trạng thái hiện tại vẫn đúng như mình mong đợi. Nếu một process khác đã thay đổi nó trước rồi, update thứ hai sẽ không làm gì cả. Tóm lại, tôi chọn cách xử lý theo từng use case: write lock cho những cập nhật quan trọng và ngắn, version check cho dữ liệu người dùng chỉnh sửa, và status check cho background job.',
      keyIdeaVi: 'Hai request cập nhật cùng dữ liệu → chọn theo use case → pessimistic: dùng write lock, request thứ hai chờ → optimistic: version đã đổi thì trả conflict → background job: chỉ cập nhật nếu trạng thái hiện tại vẫn đúng',
    },
  ],
  4: [
    {
      questionVi: 'Tại sao bạn dùng RabbitMQ thay vì xử lý mọi thứ trong yêu cầu API?',
      answerVi: 'Tôi dùng queue khi công việc có thể chạy lâu hoặc không cần hoàn thành trong request API. Cách này giúp API phản hồi nhanh, còn worker xử lý job riêng.',
      keyIdeaVi: 'Công việc chạy lâu ngoài request API → đưa job vào queue → worker xử lý riêng → API vẫn phản hồi nhanh.',
    },
    {
      questionVi: 'ACK và NACK trong RabbitMQ là gì?',
      answerVi: 'Tôi ACK sau khi message được xử lý thành công. Nếu xử lý thất bại, tôi có thể NACK và retry hoặc gửi message vào dead-letter queue, tùy theo lỗi.',
      keyIdeaVi: 'Thành công → ACK → thất bại → NACK → retry hoặc đưa vào dead-letter queue tùy theo lỗi.',
    },
    {
      questionVi: 'Bạn xử lý thông điệp trùng lặp như thế nào?',
      answerVi: 'Tôi thiết kế consumer theo hướng idempotent. Trước khi thay đổi dữ liệu, tôi kiểm tra job hoặc hành động nghiệp vụ đó đã được xử lý chưa. Điều này giúp tôi tránh làm cùng một công việc hai lần.',
      keyIdeaVi: 'Message bị gửi trùng → kiểm tra job hoặc hành động nghiệp vụ đã được xử lý chưa → tránh làm công việc hai lần.',
    },
    {
      questionVi: 'Transaction cơ sở dữ liệu thành công nhưng gửi thông điệp lên RabbitMQ thất bại. Bạn sẽ làm gì?',
      answerVi: 'Một giải pháp phổ biến là Outbox Pattern. Tôi lưu thay đổi nghiệp vụ và event trong cùng một database transaction, sau đó publish event sau.',
      keyIdeaVi: 'DB đã lưu thay đổi nhưng publish thất bại → Outbox → lưu thay đổi và event cùng lúc → publish sau.',
    },
    {
      questionVi: 'Bạn làm gì để một job bất đồng bộ vẫn đáng tin cậy khi việc xử lý có thể thất bại hoặc cùng một message được gửi đến nhiều lần?',
      answerVi: 'Về cơ bản, với các công việc chạy lâu, tôi thường xử lý chúng ở background. API tạo một job, và worker xử lý job đó từ queue. Nếu có lỗi tạm thời, tôi chỉ retry một vài lần. Nhưng cùng một message có thể được gửi lại nhiều hơn một lần, nên tôi cũng thiết kế consumer theo hướng idempotent. Ví dụ, trước khi xử lý job, tôi có thể kiểm tra job ID và trạng thái hiện tại để tránh làm cùng một công việc hai lần. Tôi chỉ ACK message sau khi công việc đã hoàn thành thành công. Một rủi ro khác là database update thành công nhưng việc publish message tiếp theo lại thất bại. Một giải pháp phổ biến là Outbox Pattern. Chúng ta lưu business change và event trong cùng một database transaction, sau đó publish event sau. Tóm lại, các điểm quan trọng là background processing, retry có giới hạn, idempotency và trạng thái job rõ ràng.',
      keyIdeaVi: 'Công việc chạy lâu → queue → lỗi tạm thời: retry vài lần → message trùng: idempotency → thành công: ACK → DB thành công nhưng publish lỗi: Outbox',
    },
  ],
  5: [
    {
      questionVi: 'Bạn dùng Redis cache an toàn như thế nào, và xử lý thế nào khi cache bị cũ hoặc Redis không khả dụng?',
      answerVi: 'Về cơ bản, tôi dùng Redis cho dữ liệu được đọc thường xuyên và không cần lấy từ database mỗi lần. Một cách phổ biến là cache-aside. Đầu tiên, application kiểm tra Redis. Nếu chưa có dữ liệu, nó lấy từ database rồi lưu vào Redis với TTL. Phần khó là giữ cache luôn mới sau khi database thay đổi. Sau khi update thành công, tôi thường xóa cache key liên quan để request tiếp theo lấy dữ liệu mới từ database. Với dữ liệu bắt buộc phải luôn mới, tôi có thể đọc trực tiếp từ database thay vì dùng cache. Nếu Redis bị down và chỉ được dùng làm cache, tôi dùng timeout ngắn rồi fallback sang database. Nhưng tôi cũng theo dõi tải của database vì quá nhiều fallback traffic có thể làm database quá tải. Tóm lại, tôi dùng Redis để giảm tải database, nhưng cũng luôn nghĩ đến cache invalidation, TTL và fallback.',
      keyIdeaVi: 'Đọc thường xuyên → Redis cache-aside → cache miss: DB → lưu với TTL → DB update: xóa cache → Redis down: timeout ngắn + fallback DB → theo dõi tải DB',
    },
  ],
  6: [
    {
      questionVi: 'Mở rộng theo chiều ngang là gì?',
      answerVi: 'Mở rộng theo chiều ngang nghĩa là thêm nhiều instance ứng dụng thay vì nâng cấp một máy chủ. Load balancer có thể phân phối yêu cầu giữa các instance. Ứng dụng nên tránh chỉ lưu trạng thái phiên quan trọng trong bộ nhớ cục bộ vì yêu cầu tiếp theo có thể được chuyển đến instance khác.',
      keyIdeaVi: 'Cần thêm năng lực xử lý → thêm instance ứng dụng → load balancer phân phối yêu cầu → tránh chỉ lưu phiên quan trọng trong bộ nhớ cục bộ.',
    },
  ],
  7: [
    {
      questionVi: 'Bạn thiết kế cơ chế thử lại như thế nào?',
      answerVi: 'Về cơ bản, tôi chỉ retry các lỗi tạm thời, chẳng hạn như timeout hoặc lỗi network tạm thời. Tôi đặt giới hạn số lần retry và dùng exponential backoff, để mỗi lần retry sẽ chờ lâu hơn một chút. Với input không hợp lệ, lỗi permission hoặc cấu hình sai, tôi fail fast và không retry. Nếu operation có thể tạo dữ liệu trùng lặp, tôi cũng làm cho nó idempotent.',
      keyIdeaVi: 'Lỗi tạm thời → giới hạn retry → exponential backoff → lỗi permanent = fail fast → idempotency chống duplicate',
    },
    {
      questionVi: 'Circuit breaker là gì?',
      answerVi: 'Circuit breaker tạm ngừng gọi một dịch vụ khi dịch vụ đó liên tục gặp lỗi. Điều này giúp ứng dụng không phải chờ các lần hết thời gian lặp lại và cho dịch vụ bị lỗi thời gian phục hồi. Sau một khoảng thời gian, chúng ta có thể cho phép một ít yêu cầu để kiểm tra xem dịch vụ đã hoạt động bình thường chưa.',
      keyIdeaVi: 'Dịch vụ lỗi liên tục → tạm ngừng gọi → tránh chờ timeout lặp lại và cho dịch vụ phục hồi → sau đó gửi ít yêu cầu để kiểm tra.',
    },
  ],
  8: [
    {
      questionVi: 'Bạn giữ dữ liệu nhất quán giữa nhiều dịch vụ như thế nào?',
      answerVi: 'Ví dụ, dịch vụ đơn hàng có thể lưu đơn trước khi dịch vụ thanh toán xác nhận đã trả tiền. Tôi lưu đơn hàng cùng sự kiện outbox trong một transaction, rồi phát sự kiện cho dịch vụ thanh toán. Consumer thanh toán xử lý thông điệp trùng và báo thành công hoặc thất bại; nếu thất bại, tôi đánh dấu hủy đơn hoặc bắt đầu hoàn tiền khi cần. Các dịch vụ sẽ nhất quán sau một thời gian, nên trạng thái đơn hàng phải cho thấy thanh toán vẫn đang chờ.',
      keyIdeaVi: 'Lưu đơn trước khi thanh toán → ghi đơn và outbox cùng transaction → consumer thanh toán xử lý trùng → xác nhận hoặc bù trừ → hiển thị chờ đến khi nhất quán.',
    },
  ],
  9: [
    {
      questionVi: 'Bạn thiết kế một backend API an toàn và đáng tin cậy như thế nào?',
      answerVi: 'Về cơ bản, tôi không tin hoàn toàn vào client. Đầu tiên, tôi kiểm tra dữ liệu đầu vào trước khi xử lý request. Sau đó tôi kiểm tra authentication để biết người dùng là ai. Tiếp theo, tôi kiểm tra authorization để chắc chắn người dùng có quyền thực hiện hành động đó. Trong Clincove, access control khá nghiêm ngặt vì chúng tôi làm việc với dữ liệu thử nghiệm lâm sàng. Ví dụ, backend cũng kiểm tra người dùng được truy cập study và site nào. Trong một số luồng, study và site phải khớp với access scope của người dùng. Nếu không khớp, backend sẽ không trả về resource đó. Vì vậy, ngay cả khi frontend ẩn một button, backend vẫn kiểm tra permission và resource scope. Tôi cũng trả về lỗi rõ ràng, ví dụ validation error, unauthorized, forbidden hoặc server error. Với các thao tác quan trọng, tôi lưu log hoặc audit information cùng request context để dễ truy vết vấn đề. Tóm lại, flow của tôi là kiểm tra input, xác định user, kiểm tra permission và resource scope, xử lý request và trả về response rõ ràng.',
      keyIdeaVi: 'Client request → kiểm tra input → xác thực user → kiểm tra permission → kiểm tra study/site scope → xử lý → lỗi rõ ràng → audit/tracing',
    },
  ],
  10: [
    {
      questionVi: 'Bạn xử lý file lớn và điều tra vấn đề hiệu năng hoặc sự cố production như thế nào?',
      answerVi: 'Về cơ bản, với file lớn, tôi không xử lý mọi thứ trong một API request. Tôi tạo một background job và xử lý tài liệu từng bước. Với tài liệu lớn, tôi dùng batch nhỏ hơn và lưu tiến độ, để job có thể tiếp tục nếu có lỗi. Trong một sự cố production, một tài liệu lớn làm memory usage tăng cao và OCR job bị fail. Đầu tiên, tôi kiểm tra job logs, memory usage, processing time và bước nào bị lỗi. Chúng tôi phát hiện OCR vừa tốn memory vừa chậm. Vì vậy, chúng tôi giảm batch size và concurrency, đồng thời thêm checkpoint và resume. Sau đó, chúng tôi chuyển phần OCR inference nặng sang remote GPU service. Thời gian OCR cải thiện từ khoảng 46 giây mỗi trang xuống còn khoảng 2 giây mỗi trang. Tóm lại, trước tiên tôi làm cho job có khả năng recovery, sau đó đo bottleneck, và cuối cùng tối ưu phần chậm nhất.',
      keyIdeaVi: 'File lớn → background job → batch nhỏ hơn → checkpoint/resume → kiểm tra logs + memory + bước lỗi → tìm nút thắt OCR → chuyển OCR nặng sang GPU → đo mức cải thiện',
    },
    {
      questionVi: 'Bạn sẽ thiết kế hệ thống thông báo như thế nào?',
      answerVi: 'Khi đơn hàng được xác nhận, tôi lưu job thông báo cùng thay đổi đơn hàng và đưa qua outbox vào hàng đợi cho worker gửi email. Worker lưu mã giao gửi, thử lại lỗi tạm thời từ nhà cung cấp với số lần giới hạn và đánh dấu lỗi cố định để kiểm tra. Nó kiểm tra mã job trước khi gửi lại, dù nhà cung cấp bên ngoài vẫn có thể gửi trùng nếu không hỗ trợ idempotency. Người dùng có thể thấy trạng thái đang chờ hoặc thất bại thay vì mặc định email đã đến.',
      keyIdeaVi: 'Xác nhận đơn → lưu job và xếp thông báo qua outbox → worker theo dõi giao gửi và giới hạn thử lại → chống trùng kể cả phía nhà cung cấp → hiển thị trạng thái chờ hoặc lỗi.',
    },
    {
      questionVi: 'Bạn sẽ thiết kế API chịu được lưu lượng truy cập cao như thế nào?',
      answerVi: 'Trước tiên tôi đo endpoint nào chậm khi tải cao, thay vì vội thêm máy chủ. Nếu việc đọc cơ sở dữ liệu là nút thắt, tôi xem kế hoạch truy vấn, thêm chỉ mục phù hợp và cache dữ liệu chỉ đọc an toàn với TTL. Các instance API không lưu trạng thái sau load balancer có thể mở rộng, nhưng mỗi instance cũng dùng kết nối cơ sở dữ liệu nên tôi giới hạn kích thước pool. Tôi dùng timeout và giới hạn tần suất để bảo vệ hệ thống, rồi kiểm thử tải lại.',
      keyIdeaVi: 'Đo endpoint chậm → sửa truy vấn và cache dữ liệu đọc an toàn → mở rộng API không lưu trạng thái nhưng giới hạn kết nối DB → bảo vệ bằng timeout và giới hạn tần suất → kiểm thử lại.',
    },
  ],
  11: [
    {
      questionVi: 'Bạn chạy một ứng dụng Node.js ổn định trên production như thế nào?',
      answerVi: 'Về cơ bản, tôi dùng Docker để đóng gói application và các dependency, để cùng một image có thể chạy ở development, testing và production. Trên production, Nginx có thể đứng trước Node.js application như một reverse proxy. Nó nhận client request và chuyển request đến các Node.js instance. Nó cũng có thể xử lý TLS, load balancing và request limit. Khi chạy nhiều instance, health check cũng rất quan trọng. Liveness check cho platform biết application process có còn sống hay không, để có thể restart một instance bị lỗi. Readiness check cho biết instance đã sẵn sàng nhận traffic hay chưa. Ví dụ, một instance có thể đang sống nhưng vẫn đang khởi động, nên chưa nên nhận request. Tóm lại, Docker cho tôi runtime nhất quán, Nginx xử lý traffic phía trước application, và health check giúp đảm bảo traffic chỉ đi đến các instance đã sẵn sàng.',
      keyIdeaVi: 'Docker đóng gói runtime → Nginx nhận và route traffic → TLS/load balancing/limit → liveness: process còn sống? → readiness: sẵn sàng nhận traffic? → chỉ gửi traffic đến instance sẵn sàng',
    },
  ],
  12: [
    {
      questionVi: 'Bạn kiểm thử thay đổi backend và ngăn regression bug như thế nào?',
      answerVi: 'Về cơ bản, tôi dùng các mức test khác nhau cho các loại rủi ro khác nhau. Unit test kiểm tra một phần logic nhỏ và độc lập. Integration test kiểm tra nhiều phần hoạt động cùng nhau, ví dụ service và database. End-to-end test kiểm tra một flow hoàn chỉnh từ API request đến kết quả cuối cùng. Khi sửa một bug, đầu tiên tôi reproduce bug đó và hiểu root cause. Sau đó tôi thêm một test bị fail trước khi fix và pass sau khi fix. Với các flow quan trọng, tôi cũng giữ integration test hoặc end-to-end test. Monitoring trên production giúp chúng tôi phát hiện những vấn đề mà test có thể bỏ sót. Tóm lại, tôi chọn đúng mức test cho thay đổi và thêm regression test khi sửa bug.',
      keyIdeaVi: 'Thay đổi hoặc bug → chọn mức test → unit: logic nhỏ → integration: nhiều phần cùng nhau → E2E: full flow → reproduce bug → thêm regression test → monitor production',
    },
    {
      questionVi: 'Bạn xem xét những gì khi review code?',
      answerVi: 'Trước tiên tôi kiểm tra tính đúng đắn: logic nghiệp vụ, các trường hợp đặc biệt, xử lý lỗi, bảo mật và các vấn đề dữ liệu có thể xảy ra. Sau đó tôi xem xét khả năng đọc, bảo trì, độ bao phủ kiểm thử, hiệu năng khi cần và việc thay đổi có tuân theo kiến trúc hiện tại hay không. Tôi cố gắng đưa ra nhận xét cụ thể và giải thích vì sao thay đổi đó quan trọng.',
      keyIdeaVi: 'Xem tính đúng đắn và trường hợp đặc biệt trước → kiểm tra bảo mật, rủi ro dữ liệu → xem độ dễ đọc, kiểm thử và kiến trúc → giải thích góp ý cụ thể.',
    },
  ],
};

/** Pair the unchanged English source with translations in the same topic/question order. */
export function withVietnamese(topicId: number, questions: EnglishBackendQuestion[]): BackendQuestion[] {
  const topicTranslations = translations[topicId];
  if (!topicTranslations || topicTranslations.length !== questions.length) {
    throw new Error(`Missing Vietnamese translations for backend topic ${topicId}`);
  }
  return questions.map((question, index) => ({ ...question, ...topicTranslations[index] }));
}
