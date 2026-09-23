import type { BackendQuestion, EnglishBackendQuestion } from './source-questions';

// Vietnamese study translations correspond by topic number and question order to source-questions.ts.
export type BackendTranslation = { questionVi: string; answerVi: string; keyIdeaVi: string };
export const translations: Record<number, BackendTranslation[]> = {
  1: [
    {
      questionVi: 'Event loop trong Node.js là gì và tại sao nó quan trọng?',
      answerVi: 'Node.js dùng một luồng chính để chạy JavaScript. Event loop giúp Node.js xử lý nhiều yêu cầu mà không phải đợi từng tác vụ I/O hoàn thành. Khi Node.js bắt đầu một tác vụ I/O, như đọc tệp hoặc gọi cơ sở dữ liệu, nó vẫn có thể tiếp tục xử lý công việc khác. Khi tác vụ I/O hoàn tất, callback của nó được đưa trở lại event loop. Vì vậy Node.js phù hợp với ứng dụng có nhiều tác vụ I/O, nhưng chúng ta nên tránh xử lý tác vụ nặng về CPU trên luồng chính.',
      keyIdeaVi: 'Node.js dùng một luồng chính để chạy JavaScript. Event loop giúp Node.js xử lý nhiều yêu cầu mà không phải đợi từng tác vụ I/O hoàn thành.',
    },
    {
      questionVi: 'Tác vụ nặng về I/O khác tác vụ nặng về CPU như thế nào?',
      answerVi: 'Tác vụ nặng về I/O dành phần lớn thời gian để chờ, ví dụ như truy vấn cơ sở dữ liệu, yêu cầu mạng hoặc thao tác với tệp. Node.js xử lý tốt các tác vụ này vì không cần chặn luồng chính trong lúc chờ. Tác vụ nặng về CPU sử dụng nhiều thời gian xử lý, ví dụ như xử lý ảnh hoặc tính toán phức tạp. Chúng có thể chặn event loop, nên tôi sẽ chuyển chúng sang worker thread, hàng đợi hoặc một dịch vụ khác.',
      keyIdeaVi: 'Tác vụ nặng về I/O dành phần lớn thời gian để chờ, ví dụ như truy vấn cơ sở dữ liệu, yêu cầu mạng hoặc thao tác với tệp. Node.js xử lý tốt các tác vụ này vì không cần chặn luồng chính trong lúc chờ.',
    },
    {
      questionVi: 'Async/await khác mã chạy đồng bộ như thế nào?',
      answerVi: 'Mã chạy đồng bộ chờ một tác vụ hoàn tất rồi mới chuyển sang tác vụ tiếp theo. Với async/await, Node.js có thể bắt đầu một thao tác bất đồng bộ và tiếp tục công việc khác trong lúc chờ. Async/await cũng giúp mã bất đồng bộ dễ đọc và bảo trì hơn. Tuy nhiên, dùng await không tự động biến tác vụ nặng về CPU thành không chặn luồng.',
      keyIdeaVi: 'Mã chạy đồng bộ chờ một tác vụ hoàn tất rồi mới chuyển sang tác vụ tiếp theo. Với async/await, Node.js có thể bắt đầu một thao tác bất đồng bộ và tiếp tục công việc khác trong lúc chờ.',
    },
    {
      questionVi: 'Điều gì xảy ra nếu một yêu cầu thực hiện phép tính nặng về CPU?',
      answerVi: 'Nếu phép tính chạy trên luồng chính, nó có thể chặn event loop. Các yêu cầu khác phải chờ, khiến API chậm đi. Tôi sẽ tránh xử lý tác vụ nặng về CPU trực tiếp trong trình xử lý yêu cầu. Tùy trường hợp, tôi có thể dùng worker thread, hàng đợi xử lý nền hoặc một dịch vụ riêng.',
      keyIdeaVi: 'Nếu phép tính chạy trên luồng chính, nó có thể chặn event loop. Các yêu cầu khác phải chờ, khiến API chậm đi.',
    },
  ],
  2: [
    {
      questionVi: 'Bạn thiết kế một REST API đáng tin cậy như thế nào?',
      answerVi: 'Tôi bắt đầu bằng cách xác định rõ tài nguyên và endpoint. Tôi kiểm tra dữ liệu đầu vào, trả về mã trạng thái HTTP nhất quán và dùng cấu trúc phản hồi lỗi chuẩn. Với API danh sách, tôi thường hỗ trợ phân trang và lọc. Với các thao tác ghi quan trọng, tôi cũng cân nhắc xác thực, phân quyền, tính idempotent, ghi log và giới hạn tần suất.',
      keyIdeaVi: 'Tôi bắt đầu bằng cách xác định rõ tài nguyên và endpoint. Tôi kiểm tra dữ liệu đầu vào, trả về mã trạng thái HTTP nhất quán và dùng cấu trúc phản hồi lỗi chuẩn.',
    },
    {
      questionVi: 'Tính idempotent là gì và khi nào cần đến nó?',
      answerVi: 'Tính idempotent nghĩa là gửi cùng một yêu cầu nhiều lần không được tạo ra cùng một hành động nhiều lần. Ví dụ, với API thanh toán hoặc tạo công việc, tôi có thể dùng khóa idempotency. Tôi lưu khóa cùng kết quả và dùng ràng buộc duy nhất trong cơ sở dữ liệu. Nếu yêu cầu tương tự đến lần nữa, tôi trả về kết quả trước đó thay vì tạo thêm bản ghi.',
      keyIdeaVi: 'Tính idempotent nghĩa là gửi cùng một yêu cầu nhiều lần không được tạo ra cùng một hành động nhiều lần.',
    },
    {
      questionVi: 'Bạn xử lý lỗi API như thế nào?',
      answerVi: 'Tôi phân biệt lỗi dự kiến với lỗi không dự kiến. Ví dụ, dữ liệu không hợp lệ có thể trả về 400, truy cập không được phép trả về 401 hoặc 403, và không tìm thấy dữ liệu trả về 404. Với lỗi không dự kiến, tôi trả về thông báo an toàn cho client và giữ chi tiết kỹ thuật trong log máy chủ. Tôi cũng dùng mã định danh yêu cầu để truy vết lỗi.',
      keyIdeaVi: 'Tôi phân biệt lỗi dự kiến với lỗi không dự kiến. Ví dụ, dữ liệu không hợp lệ có thể trả về 400, truy cập không được phép trả về 401 hoặc 403, và không tìm thấy dữ liệu trả về 404.',
    },
  ],
  3: [
    {
      questionVi: 'Một API chạy chậm. Bạn điều tra cơ sở dữ liệu như thế nào?',
      answerVi: 'Trước tiên, tôi kiểm tra xem cơ sở dữ liệu có thực sự là nút thắt hay không. Tôi xem thời gian xử lý API, log truy vấn chậm và các chỉ số của cơ sở dữ liệu. Sau đó tôi kiểm tra kế hoạch truy vấn, chỉ mục, lượng dữ liệu trả về và khả năng có truy vấn N+1. Tôi cũng kiểm tra pool kết nối và các khóa. Tôi cố gắng giải quyết nguyên nhân gốc trước khi tăng tài nguyên cơ sở dữ liệu.',
      keyIdeaVi: 'Trước tiên, tôi kiểm tra xem cơ sở dữ liệu có thực sự là nút thắt hay không. Tôi xem thời gian xử lý API, log truy vấn chậm và các chỉ số của cơ sở dữ liệu.',
    },
    {
      questionVi: 'Chỉ mục cơ sở dữ liệu là gì và đánh đổi của nó là gì?',
      answerVi: 'Chỉ mục giúp cơ sở dữ liệu tìm dữ liệu nhanh hơn mà không cần quét toàn bộ bảng. Nó hữu ích với các cột thường dùng trong điều kiện WHERE, JOIN hoặc ORDER BY. Tuy nhiên, chỉ mục tốn thêm dung lượng và làm thao tác chèn, cập nhật tốn kém hơn, nên tôi không thêm chỉ mục ở mọi nơi.',
      keyIdeaVi: 'Chỉ mục giúp cơ sở dữ liệu tìm dữ liệu nhanh hơn mà không cần quét toàn bộ bảng.',
    },
    {
      questionVi: 'Điều gì xảy ra khi pool kết nối cơ sở dữ liệu đã đầy?',
      answerVi: 'Các yêu cầu mới có thể phải đợi kết nối cơ sở dữ liệu còn trống. Vì chúng đang chờ I/O, mức sử dụng CPU của Node.js vẫn có thể thấp trong khi thời gian phản hồi API tăng rất cao. Tôi sẽ kiểm tra các kết nối đang hoạt động, truy vấn chạy lâu, kích thước pool, thời gian chờ và việc giải phóng kết nối có đúng hay không.',
      keyIdeaVi: 'Các yêu cầu mới có thể phải đợi kết nối cơ sở dữ liệu còn trống. Vì chúng đang chờ I/O, mức sử dụng CPU của Node.js vẫn có thể thấp trong khi thời gian phản hồi API tăng rất cao.',
    },
    {
      questionVi: 'Bạn ngăn race condition khi hai yêu cầu cập nhật cùng một dữ liệu như thế nào?',
      answerVi: 'Giải pháp tùy thuộc vào tình huống nghiệp vụ. Tôi có thể dùng transaction của cơ sở dữ liệu, ràng buộc duy nhất, khóa lạc quan hoặc khóa bi quan. Tôi ưu tiên ràng buộc cơ sở dữ liệu khi có thể, vì chúng bảo vệ dữ liệu ngay cả khi hai yêu cầu ứng dụng chạy cùng lúc.',
      keyIdeaVi: 'Giải pháp tùy thuộc vào tình huống nghiệp vụ. Tôi có thể dùng transaction của cơ sở dữ liệu, ràng buộc duy nhất, khóa lạc quan hoặc khóa bi quan.',
    },
  ],
  4: [
    {
      questionVi: 'Tại sao bạn dùng RabbitMQ thay vì xử lý mọi thứ trong yêu cầu API?',
      answerVi: 'Hàng đợi cho phép API chuyển công việc chậm hoặc công việc nền ra ngoài yêu cầu. API có thể phản hồi nhanh hơn và các worker có thể xử lý công việc riêng. Nó cũng hỗ trợ thử lại, tăng độ tin cậy và giúp mở rộng dễ hơn. Đánh đổi là hệ thống phức tạp hơn và đôi khi thời gian xử lý dài hơn.',
      keyIdeaVi: 'Hàng đợi cho phép API chuyển công việc chậm hoặc công việc nền ra ngoài yêu cầu. API có thể phản hồi nhanh hơn và các worker có thể xử lý công việc riêng.',
    },
    {
      questionVi: 'ACK và NACK trong RabbitMQ là gì?',
      answerVi: 'ACK báo cho RabbitMQ rằng consumer đã xử lý thông điệp thành công, nên thông điệp có thể được xóa. NACK nghĩa là xử lý thất bại. Tùy cấu hình, thông điệp có thể được thử lại, đưa lại vào hàng đợi hoặc gửi đến hàng đợi lỗi.',
      keyIdeaVi: 'ACK báo cho RabbitMQ rằng consumer đã xử lý thông điệp thành công, nên thông điệp có thể được xóa.',
    },
    {
      questionVi: 'Bạn xử lý thông điệp trùng lặp như thế nào?',
      answerVi: 'Tôi giả định một thông điệp có thể được gửi đến nhiều lần. Consumer cần có tính idempotent. Ví dụ, tôi có thể dùng mã công việc hoặc mã nghiệp vụ và lưu vào cơ sở dữ liệu với ràng buộc duy nhất. Trước khi thực hiện hành động, tôi kiểm tra xem nó đã được xử lý hay chưa.',
      keyIdeaVi: 'Tôi giả định một thông điệp có thể được gửi đến nhiều lần. Consumer cần có tính idempotent.',
    },
    {
      questionVi: 'Transaction cơ sở dữ liệu thành công nhưng gửi thông điệp lên RabbitMQ thất bại. Bạn sẽ làm gì?',
      answerVi: 'Điều này có thể gây ra trạng thái không nhất quán vì dữ liệu đã được lưu nhưng sự kiện lại bị thiếu. Một giải pháp phổ biến là Outbox Pattern. Tôi lưu dữ liệu nghiệp vụ và một bản ghi outbox trong cùng một transaction cơ sở dữ liệu. Một worker riêng đọc bảng outbox và gửi thông điệp. Nếu gửi thất bại, worker có thể thử lại an toàn.',
      keyIdeaVi: 'Điều này có thể gây ra trạng thái không nhất quán vì dữ liệu đã được lưu nhưng sự kiện lại bị thiếu.',
    },
  ],
  5: [
    {
      questionVi: 'Khi nào bạn sử dụng bộ nhớ đệm Redis?',
      answerVi: 'Tôi dùng bộ nhớ đệm cho dữ liệu được đọc thường xuyên và không cần tính toán hoặc tải từ cơ sở dữ liệu mỗi lần. Một cách phổ biến là cache-aside. Ứng dụng kiểm tra Redis trước. Nếu không có dữ liệu, ứng dụng tải từ cơ sở dữ liệu rồi lưu vào Redis với thời hạn TTL.',
      keyIdeaVi: 'Tôi dùng bộ nhớ đệm cho dữ liệu được đọc thường xuyên và không cần tính toán hoặc tải từ cơ sở dữ liệu mỗi lần.',
    },
    {
      questionVi: 'Phần khó của việc dùng bộ nhớ đệm là gì?',
      answerVi: 'Phần khó là giữ cho dữ liệu trong bộ nhớ đệm chính xác. Khi cơ sở dữ liệu thay đổi, dữ liệu cũ vẫn có thể còn trong bộ nhớ đệm. Tôi thường dùng chiến lược vô hiệu hóa rõ ràng và TTL hợp lý. Với dữ liệu quan trọng, tôi ưu tiên tính chính xác hơn là giữ dữ liệu trong bộ nhớ đệm quá lâu.',
      keyIdeaVi: 'Phần khó là giữ cho dữ liệu trong bộ nhớ đệm chính xác. Khi cơ sở dữ liệu thay đổi, dữ liệu cũ vẫn có thể còn trong bộ nhớ đệm.',
    },
    {
      questionVi: 'Điều gì xảy ra nếu Redis ngừng hoạt động?',
      answerVi: 'Với bộ nhớ đệm thông thường, tôi cố gắng để ứng dụng chuyển sang đọc cơ sở dữ liệu thay vì lỗi hoàn toàn. Tôi cũng đặt thời gian chờ và giám sát để sự cố Redis không khiến mọi yêu cầu phải đợi quá lâu. Tuy nhiên, nếu Redis lưu trạng thái quan trọng, thiết kế cần kế hoạch khôi phục chặt chẽ hơn.',
      keyIdeaVi: 'Với bộ nhớ đệm thông thường, tôi cố gắng để ứng dụng chuyển sang đọc cơ sở dữ liệu thay vì lỗi hoàn toàn.',
    },
  ],
  6: [
    {
      questionVi: 'Lưu lượng tăng gấp 10 lần, thời gian phản hồi chậm nhưng CPU thấp. Nguyên nhân có thể là gì?',
      answerVi: 'Nếu thời gian phản hồi chậm nhưng CPU vẫn thấp, trước tiên tôi sẽ nghĩ đến vấn đề I/O chứ không phải CPU. Hệ thống có thể đang chờ truy vấn cơ sở dữ liệu, API bên ngoài, Redis hoặc kết nối cơ sở dữ liệu. Đầu tiên, tôi kiểm tra log và các chỉ số để tìm API bị chậm. Sau đó tôi kiểm tra cơ sở dữ liệu, pool kết nối, dịch vụ bên ngoài, độ trễ event loop, bộ nhớ và các yêu cầu đang chờ. Nếu lưu lượng quá cao, chúng ta có thể tăng số instance, nhưng tôi sẽ tìm nút thắt trước vì thêm máy chủ có thể không giải quyết được vấn đề thực sự.',
      keyIdeaVi: 'Nếu thời gian phản hồi chậm nhưng CPU vẫn thấp, trước tiên tôi sẽ nghĩ đến vấn đề I/O chứ không phải CPU.',
    },
    {
      questionVi: 'Mở rộng theo chiều ngang là gì?',
      answerVi: 'Mở rộng theo chiều ngang nghĩa là thêm nhiều instance ứng dụng thay vì nâng cấp một máy chủ. Load balancer có thể phân phối yêu cầu giữa các instance. Ứng dụng nên tránh chỉ lưu trạng thái phiên quan trọng trong bộ nhớ cục bộ vì yêu cầu tiếp theo có thể được chuyển đến instance khác.',
      keyIdeaVi: 'Mở rộng theo chiều ngang nghĩa là thêm nhiều instance ứng dụng thay vì nâng cấp một máy chủ.',
    },
    {
      questionVi: 'Bạn tìm nút thắt hiệu năng như thế nào?',
      answerVi: 'Tôi bắt đầu bằng đo lường thay vì đoán. Tôi kiểm tra độ trễ yêu cầu, thông lượng, tỷ lệ lỗi, CPU, bộ nhớ, thời gian truy vấn cơ sở dữ liệu, thời gian gọi API bên ngoài và các chỉ số hàng đợi. Sau đó tôi theo dõi một yêu cầu chậm qua hệ thống để xem phần nào tốn nhiều thời gian nhất. Tôi tối ưu phần chậm quan trọng nhất trước rồi đo lại sau khi thay đổi.',
      keyIdeaVi: 'Tôi bắt đầu bằng đo lường thay vì đoán. Tôi kiểm tra độ trễ yêu cầu, thông lượng, tỷ lệ lỗi, CPU, bộ nhớ, thời gian truy vấn cơ sở dữ liệu, thời gian gọi API bên ngoài và các chỉ số hàng đợi.',
    },
  ],
  7: [
    {
      questionVi: 'Bạn thiết kế cơ chế thử lại như thế nào?',
      answerVi: 'Tôi chỉ thử lại với lỗi tạm thời, như hết thời gian chờ mạng hoặc lỗi dịch vụ tạm thời. Tôi không thử lại với dữ liệu đầu vào không hợp lệ hoặc lỗi xác thực. Tôi đặt giới hạn số lần thử lại, dùng thời gian chờ tăng theo hàm mũ và đôi khi thêm jitter. Thao tác cũng cần có tính idempotent vì thử lại có thể thực hiện cùng một hành động thêm lần nữa.',
      keyIdeaVi: 'Tôi chỉ thử lại với lỗi tạm thời, như hết thời gian chờ mạng hoặc lỗi dịch vụ tạm thời. Tôi không thử lại với dữ liệu đầu vào không hợp lệ hoặc lỗi xác thực.',
    },
    {
      questionVi: 'Circuit breaker là gì?',
      answerVi: 'Circuit breaker tạm ngừng gọi một dịch vụ khi dịch vụ đó liên tục gặp lỗi. Điều này giúp ứng dụng không phải chờ các lần hết thời gian lặp lại và cho dịch vụ bị lỗi thời gian phục hồi. Sau một khoảng thời gian, chúng ta có thể cho phép một ít yêu cầu để kiểm tra xem dịch vụ đã hoạt động bình thường chưa.',
      keyIdeaVi: 'Circuit breaker tạm ngừng gọi một dịch vụ khi dịch vụ đó liên tục gặp lỗi.',
    },
    {
      questionVi: 'Một API trên production đột nhiên gặp nhiều lỗi. Bạn làm gì trước tiên?',
      answerVi: 'Trước tiên, tôi kiểm tra mức độ ảnh hưởng và các thay đổi gần đây. Tôi xem log, chỉ số, tỷ lệ lỗi, độ trễ và các endpoint bị ảnh hưởng. Nếu một lần triển khai gần đây gây ra vấn đề, rollback có thể là cách an toàn nhanh nhất. Sau khi hệ thống ổn định, tôi điều tra nguyên nhân gốc, khắc phục và bổ sung giám sát hoặc kiểm thử để tránh lặp lại.',
      keyIdeaVi: 'Trước tiên, tôi kiểm tra mức độ ảnh hưởng và các thay đổi gần đây. Tôi xem log, chỉ số, tỷ lệ lỗi, độ trễ và các endpoint bị ảnh hưởng.',
    },
  ],
  8: [
    {
      questionVi: 'Khóa lạc quan là gì?',
      answerVi: 'Khóa lạc quan giả định rằng xung đột không xảy ra thường xuyên. Một bản ghi thường có số phiên bản. Khi cập nhật, tôi cũng kiểm tra phiên bản đó. Nếu yêu cầu khác đã thay đổi bản ghi, cập nhật sẽ thất bại và tôi có thể thử lại hoặc trả về lỗi xung đột cho client.',
      keyIdeaVi: 'Khóa lạc quan giả định rằng xung đột không xảy ra thường xuyên. Một bản ghi thường có số phiên bản.',
    },
    {
      questionVi: 'Khi nào bạn dùng khóa bi quan?',
      answerVi: 'Tôi dùng khóa bi quan khi xung đột sẽ gây tốn kém và tôi cần ngăn các transaction khác thay đổi cùng dữ liệu trong lúc transaction của tôi đang chạy. Cách này kiểm soát chặt hơn, nhưng có thể giảm khả năng xử lý đồng thời và gây chờ khóa hoặc deadlock, nên tôi sử dụng cẩn thận.',
      keyIdeaVi: 'Tôi dùng khóa bi quan khi xung đột sẽ gây tốn kém và tôi cần ngăn các transaction khác thay đổi cùng dữ liệu trong lúc transaction của tôi đang chạy.',
    },
    {
      questionVi: 'Bạn giữ dữ liệu nhất quán giữa nhiều dịch vụ như thế nào?',
      answerVi: 'Trong nhiều hệ thống, không có một transaction cơ sở dữ liệu chung cho các dịch vụ độc lập. Tôi thường thiết kế từng thao tác cục bộ sao cho đáng tin cậy và dùng sự kiện để giao tiếp. Các mẫu như Outbox, consumer idempotent, thử lại và hành động bù trừ giúp đạt được nhất quán cuối cùng một cách an toàn.',
      keyIdeaVi: 'Trong nhiều hệ thống, không có một transaction cơ sở dữ liệu chung cho các dịch vụ độc lập. Tôi thường thiết kế từng thao tác cục bộ sao cho đáng tin cậy và dùng sự kiện để giao tiếp.',
    },
  ],
  9: [
    {
      questionVi: 'Xác thực và phân quyền khác nhau như thế nào?',
      answerVi: 'Xác thực kiểm tra người dùng là ai. Phân quyền kiểm tra người dùng đó được phép làm gì. Ví dụ, JWT có thể giúp xác thực người dùng, nhưng backend vẫn cần kiểm tra vai trò hoặc quyền trước khi thực hiện một hành động.',
      keyIdeaVi: 'Xác thực kiểm tra người dùng là ai. Phân quyền kiểm tra người dùng đó được phép làm gì.',
    },
    {
      questionVi: 'Bạn bảo vệ một backend API như thế nào?',
      answerVi: 'Tôi kiểm tra mọi dữ liệu đầu vào, dùng xác thực và phân quyền, bảo vệ các bí mật, dùng HTTPS và tránh để lộ thông tin nhạy cảm trong lỗi hoặc log. Tôi cũng dùng truy vấn cơ sở dữ liệu có tham số, giới hạn tần suất khi cần, cập nhật các thư viện phụ thuộc và kiểm tra quyền đúng cách cho mọi hành động được bảo vệ.',
      keyIdeaVi: 'Tôi kiểm tra mọi dữ liệu đầu vào, dùng xác thực và phân quyền, bảo vệ các bí mật, dùng HTTPS và tránh để lộ thông tin nhạy cảm trong lỗi hoặc log.',
    },
    {
      questionVi: 'Tại sao backend vẫn phải kiểm tra quyền dù frontend đã ẩn nút?',
      answerVi: 'Kiểm tra ở frontend giúp cải thiện trải nghiệm người dùng, nhưng không phải ranh giới bảo mật. Người dùng có thể gọi API trực tiếp. Backend phải kiểm tra quyền trước khi thực hiện hành động vì backend kiểm soát dữ liệu thật và các thao tác nghiệp vụ.',
      keyIdeaVi: 'Kiểm tra ở frontend giúp cải thiện trải nghiệm người dùng, nhưng không phải ranh giới bảo mật. Người dùng có thể gọi API trực tiếp.',
    },
  ],
  10: [
    {
      questionVi: 'Bạn sẽ thiết kế hệ thống xử lý tệp lớn như thế nào?',
      answerVi: 'Tôi sẽ không xử lý toàn bộ tệp lớn bên trong yêu cầu API. API tải tệp lên kho lưu trữ đối tượng và tạo một công việc. Hàng đợi gửi công việc đến worker. Worker xử lý tệp theo các bước nhỏ hơn và cập nhật trạng thái công việc, ví dụ: đang chờ, đang chạy, hoàn tất hoặc thất bại. Với công việc lớn, tôi cũng dùng checkpoint để worker có thể tiếp tục từ bước thành công gần nhất sau khi gặp lỗi.',
      keyIdeaVi: 'Tôi sẽ không xử lý toàn bộ tệp lớn bên trong yêu cầu API.',
    },
    {
      questionVi: 'Bạn sẽ thiết kế hệ thống thông báo như thế nào?',
      answerVi: 'Tôi sẽ tách việc tạo thông báo khỏi việc gửi thông báo. Dịch vụ chính tạo sự kiện hoặc công việc thông báo và gửi vào hàng đợi. Các worker có thể gửi email, thông báo đẩy hoặc loại thông báo khác. Tôi sẽ thêm cơ chế thử lại, tính idempotent, theo dõi trạng thái và quy trình xử lý công việc lỗi trong hàng đợi lỗi.',
      keyIdeaVi: 'Tôi sẽ tách việc tạo thông báo khỏi việc gửi thông báo. Dịch vụ chính tạo sự kiện hoặc công việc thông báo và gửi vào hàng đợi.',
    },
    {
      questionVi: 'Bạn sẽ thiết kế API chịu được lưu lượng truy cập cao như thế nào?',
      answerVi: 'Tôi bắt đầu với các instance API không lưu trạng thái ở sau load balancer. Tôi dùng chỉ mục cơ sở dữ liệu và pool kết nối, đồng thời lưu đệm dữ liệu thường được đọc khi an toàn. Công việc nền chậm có thể đưa vào hàng đợi. Tôi cũng thêm giới hạn tần suất, thời gian chờ, giám sát và mở rộng theo chiều ngang. Thiết kế cụ thể tùy thuộc vào vị trí nút thắt thực sự.',
      keyIdeaVi: 'Tôi bắt đầu với các instance API không lưu trạng thái ở sau load balancer. Tôi dùng chỉ mục cơ sở dữ liệu và pool kết nối, đồng thời lưu đệm dữ liệu thường được đọc khi an toàn.',
    },
  ],
  11: [
    {
      questionVi: 'Tại sao bạn dùng Docker?',
      answerVi: 'Docker cung cấp môi trường chạy nhất quán cho ứng dụng. Cùng một image có thể chạy trong môi trường phát triển, kiểm thử và production. Docker cũng giúp triển khai dễ hơn vì ứng dụng và các thư viện phụ thuộc được đóng gói cùng nhau.',
      keyIdeaVi: 'Docker cung cấp môi trường chạy nhất quán cho ứng dụng. Cùng một image có thể chạy trong môi trường phát triển, kiểm thử và production.',
    },
    {
      questionVi: 'Nginx đóng vai trò gì ở phía trước ứng dụng Node.js?',
      answerVi: 'Nginx có thể hoạt động như một reverse proxy. Nó nhận yêu cầu từ client và chuyển tiếp đến các instance Node.js. Nó cũng có thể xử lý TLS, cân bằng tải, giới hạn yêu cầu và một số nội dung tĩnh. Nhờ đó, một phần công việc hạ tầng được tách khỏi ứng dụng Node.js.',
      keyIdeaVi: 'Nginx có thể hoạt động như một reverse proxy. Nó nhận yêu cầu từ client và chuyển tiếp đến các instance Node.js.',
    },
    {
      questionVi: 'Kiểm tra readiness và liveness là gì?',
      answerVi: 'Kiểm tra liveness cho nền tảng biết tiến trình ứng dụng còn hoạt động hay không. Nếu không khỏe, nền tảng có thể khởi động lại. Kiểm tra readiness cho biết ứng dụng đã sẵn sàng nhận lưu lượng hay chưa. Ví dụ, một instance có thể đang chạy nhưng vẫn khởi động, nên chưa được nhận yêu cầu.',
      keyIdeaVi: 'Kiểm tra liveness cho nền tảng biết tiến trình ứng dụng còn hoạt động hay không. Nếu không khỏe, nền tảng có thể khởi động lại.',
    },
  ],
  12: [
    {
      questionVi: 'Kiểm thử đơn vị, tích hợp và đầu cuối khác nhau như thế nào?',
      answerVi: 'Kiểm thử đơn vị kiểm tra một phần logic nhỏ một cách độc lập. Kiểm thử tích hợp kiểm tra cách nhiều thành phần phối hợp với nhau, ví dụ như service và cơ sở dữ liệu. Kiểm thử đầu cuối kiểm tra một luồng hoàn chỉnh từ yêu cầu API đến kết quả cuối cùng. Tôi dùng nhiều cấp độ kiểm thử vì mỗi cấp độ phát hiện một loại vấn đề khác nhau.',
      keyIdeaVi: 'Kiểm thử đơn vị kiểm tra một phần logic nhỏ một cách độc lập. Kiểm thử tích hợp kiểm tra cách nhiều thành phần phối hợp với nhau, ví dụ như service và cơ sở dữ liệu.',
    },
    {
      questionVi: 'Bạn xem xét những gì khi review code?',
      answerVi: 'Trước tiên tôi kiểm tra tính đúng đắn: logic nghiệp vụ, các trường hợp đặc biệt, xử lý lỗi, bảo mật và các vấn đề dữ liệu có thể xảy ra. Sau đó tôi xem xét khả năng đọc, bảo trì, độ bao phủ kiểm thử, hiệu năng khi cần và việc thay đổi có tuân theo kiến trúc hiện tại hay không. Tôi cố gắng đưa ra nhận xét cụ thể và giải thích vì sao thay đổi đó quan trọng.',
      keyIdeaVi: 'Trước tiên tôi kiểm tra tính đúng đắn: logic nghiệp vụ, các trường hợp đặc biệt, xử lý lỗi, bảo mật và các vấn đề dữ liệu có thể xảy ra.',
    },
    {
      questionVi: 'Bạn ngăn lỗi hồi quy như thế nào?',
      answerVi: 'Trước tiên tôi tái hiện lỗi và tìm hiểu nguyên nhân gốc. Sau đó tôi sửa lỗi và thêm một bài kiểm thử thất bại trước khi sửa, thành công sau khi sửa. Với các luồng quan trọng, tôi cũng duy trì kiểm thử tích hợp hoặc đầu cuối. Giám sát trên production giúp phát hiện những vấn đề mà kiểm thử có thể bỏ sót.',
      keyIdeaVi: 'Trước tiên tôi tái hiện lỗi và tìm hiểu nguyên nhân gốc. Sau đó tôi sửa lỗi và thêm một bài kiểm thử thất bại trước khi sửa, thành công sau khi sửa.',
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
