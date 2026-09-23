import type { BackendQuestion, EnglishBackendQuestion } from './source-questions';

// Vietnamese study translations correspond by topic number and question order to source-questions.ts.
export type BackendTranslation = { questionVi: string; answerVi: string; keyIdeaVi: string };
export const translations: Record<number, BackendTranslation[]> = {
  1: [
    {
      questionVi: 'Event loop trong Node.js là gì và tại sao nó quan trọng?',
      answerVi: 'Node.js chạy các callback JavaScript trên event loop. Với yêu cầu tới cơ sở dữ liệu, Node.js có thể chờ phản hồi qua mạng mà không chặn event loop, rồi chạy callback khi có kết quả. Việc đọc tệp và một số lệnh DNS có thể dùng nhóm luồng libuv. Tôi theo dõi độ trễ event loop vì JavaScript tính toán nặng trên luồng chính vẫn làm các yêu cầu khác bị chậm.',
      keyIdeaVi: 'Callback JavaScript chạy trên event loop → I/O mạng có thể chờ mà không chặn; một số việc với tệp và DNS dùng nhóm luồng → theo dõi độ trễ do JavaScript nặng.',
    },
    {
      questionVi: 'Tác vụ nặng về I/O khác tác vụ nặng về CPU như thế nào?',
      answerVi: 'Tác vụ nặng về I/O dành phần lớn thời gian để chờ, ví dụ như truy vấn cơ sở dữ liệu, yêu cầu mạng hoặc thao tác với tệp. Node.js xử lý tốt các tác vụ này vì không cần chặn luồng chính trong lúc chờ. Tác vụ nặng về CPU sử dụng nhiều thời gian xử lý, ví dụ như xử lý ảnh hoặc tính toán phức tạp. Chúng có thể chặn event loop, nên tôi sẽ chuyển chúng sang worker thread, hàng đợi hoặc một dịch vụ khác.',
      keyIdeaVi: 'Tác vụ I/O chủ yếu chờ → Node.js xử lý yêu cầu khác → tác vụ nặng CPU chặn event loop → chuyển sang worker, hàng đợi hoặc dịch vụ khác.',
    },
    {
      questionVi: 'Async/await khác mã chạy đồng bộ như thế nào?',
      answerVi: 'Mã đồng bộ chặn luồng JavaScript cho đến khi chạy xong. Khi await một lệnh gọi cơ sở dữ liệu, hàm async hiện tại tạm dừng, nhưng event loop vẫn xử lý được các callback khác trong lúc chờ I/O. Khi có kết quả, hàm tiếp tục chạy. Await không chuyển phép tính nặng CPU ra khỏi luồng chính; với trường hợp đó tôi sẽ dùng worker thread.',
      keyIdeaVi: 'Mã đồng bộ chặn luồng → await chỉ tạm dừng hàm async hiện tại khi chờ I/O → callback khác vẫn chạy → JavaScript nặng CPU cần worker thread.',
    },
    {
      questionVi: 'Điều gì xảy ra nếu một yêu cầu thực hiện phép tính nặng về CPU?',
      answerVi: 'Nếu phép tính chạy trên luồng chính, nó có thể chặn event loop. Các yêu cầu khác phải chờ, khiến API chậm đi. Tôi sẽ tránh xử lý tác vụ nặng về CPU trực tiếp trong trình xử lý yêu cầu. Tùy trường hợp, tôi có thể dùng worker thread, hàng đợi xử lý nền hoặc một dịch vụ riêng.',
      keyIdeaVi: 'Tác vụ nặng CPU trên luồng chính → chặn event loop → yêu cầu khác bị chậm → dùng worker thread, hàng đợi hoặc dịch vụ riêng.',
    },
  ],
  2: [
    {
      questionVi: 'Bạn thiết kế một REST API đáng tin cậy như thế nào?',
      answerVi: 'Tôi bắt đầu với một tài nguyên rõ ràng, chẳng hạn đơn hàng, và xác định kết quả trả về của từng endpoint. Với yêu cầu tạo mới, tôi kiểm tra đầu vào, quyền của người dùng và trả lỗi theo cấu trúc nhất quán nếu thất bại. Nếu client thử tạo lại, khóa idempotency giúp tránh tạo trùng đơn hàng. Tôi phân trang danh sách và ghi mã yêu cầu vào log để truy vết lỗi.',
      keyIdeaVi: 'Định nghĩa endpoint đơn hàng → kiểm tra đầu vào và quyền ghi → dùng khóa idempotency khi thử lại → phân trang dữ liệu đọc và truy lỗi bằng mã yêu cầu.',
    },
    {
      questionVi: 'Tính idempotent là gì và khi nào cần đến nó?',
      answerVi: 'Tính idempotent nghĩa là gửi cùng một yêu cầu nhiều lần không được tạo ra cùng một hành động nhiều lần. Ví dụ, với API thanh toán hoặc tạo công việc, tôi có thể dùng khóa idempotency. Tôi lưu khóa cùng kết quả và dùng ràng buộc duy nhất trong cơ sở dữ liệu. Nếu yêu cầu tương tự đến lần nữa, tôi trả về kết quả trước đó thay vì tạo thêm bản ghi.',
      keyIdeaVi: 'Yêu cầu lặp lại → dùng khóa idempotency cho thao tác quan trọng → lưu khóa và kết quả với ràng buộc duy nhất → trả kết quả cũ thay vì tạo trùng.',
    },
    {
      questionVi: 'Bạn xử lý lỗi API như thế nào?',
      answerVi: 'Tôi phân biệt lỗi dự kiến với lỗi không dự kiến. Ví dụ, dữ liệu không hợp lệ có thể trả về 400, truy cập không được phép trả về 401 hoặc 403, và không tìm thấy dữ liệu trả về 404. Với lỗi không dự kiến, tôi trả về thông báo an toàn cho client và giữ chi tiết kỹ thuật trong log máy chủ. Tôi cũng dùng mã định danh yêu cầu để truy vết lỗi.',
      keyIdeaVi: 'Phân loại lỗi dự kiến và không dự kiến → trả mã HTTP phù hợp → lưu chi tiết lỗi bất ngờ trong log máy chủ → dùng mã yêu cầu để truy vết.',
    },
  ],
  3: [
    {
      questionVi: 'Một API chạy chậm. Bạn điều tra cơ sở dữ liệu như thế nào?',
      answerVi: 'Trước tiên, tôi kiểm tra xem cơ sở dữ liệu có thực sự là nút thắt hay không. Tôi xem thời gian xử lý API, log truy vấn chậm và các chỉ số của cơ sở dữ liệu. Sau đó tôi kiểm tra kế hoạch truy vấn, chỉ mục, lượng dữ liệu trả về và khả năng có truy vấn N+1. Tôi cũng kiểm tra pool kết nối và các khóa. Tôi cố gắng giải quyết nguyên nhân gốc trước khi tăng tài nguyên cơ sở dữ liệu.',
      keyIdeaVi: 'API chậm → xác nhận cơ sở dữ liệu là nút thắt → kiểm tra thời gian, kế hoạch truy vấn, chỉ mục, pool và khóa → sửa nguyên nhân trước khi tăng tài nguyên.',
    },
    {
      questionVi: 'Chỉ mục cơ sở dữ liệu là gì và đánh đổi của nó là gì?',
      answerVi: 'Chỉ mục giúp cơ sở dữ liệu tìm dữ liệu nhanh hơn mà không cần quét toàn bộ bảng. Nó hữu ích với các cột thường dùng trong điều kiện WHERE, JOIN hoặc ORDER BY. Tuy nhiên, chỉ mục tốn thêm dung lượng và làm thao tác chèn, cập nhật tốn kém hơn, nên tôi không thêm chỉ mục ở mọi nơi.',
      keyIdeaVi: 'Chỉ mục → tìm dòng nhanh hơn mà không quét cả bảng → dùng cho cột thường xuất hiện trong WHERE, JOIN hoặc ORDER BY → cân nhắc dung lượng và thao tác ghi chậm hơn.',
    },
    {
      questionVi: 'Điều gì xảy ra khi pool kết nối cơ sở dữ liệu đã đầy?',
      answerVi: 'Các yêu cầu mới có thể phải đợi kết nối cơ sở dữ liệu còn trống. Vì chúng đang chờ I/O, mức sử dụng CPU của Node.js vẫn có thể thấp trong khi thời gian phản hồi API tăng rất cao. Tôi sẽ kiểm tra các kết nối đang hoạt động, truy vấn chạy lâu, kích thước pool, thời gian chờ và việc giải phóng kết nối có đúng hay không.',
      keyIdeaVi: 'Pool kết nối đầy → yêu cầu phải chờ dù CPU thấp → API phản hồi chậm → kiểm tra kết nối đang dùng, truy vấn dài, thời gian chờ và việc giải phóng kết nối.',
    },
    {
      questionVi: 'Bạn ngăn race condition khi hai yêu cầu cập nhật cùng một dữ liệu như thế nào?',
      answerVi: 'Nếu hai yêu cầu cùng thay đổi số dư, thao tác đọc rồi ghi riêng có thể làm mất một lần cập nhật. Tôi sẽ cập nhật nguyên tử trong một transaction, kèm điều kiện số dư vẫn hợp lệ. Khi sửa hồ sơ, tôi kiểm tra số phiên bản và trả lỗi xung đột nếu hồ sơ đã thay đổi. Ràng buộc duy nhất bảo vệ quy tắc như mỗi mã đơn hàng ngoài chỉ có một bản ghi, nhưng không ngăn được mọi race condition.',
      keyIdeaVi: 'Cập nhật số dư đồng thời có thể mất dữ liệu → cập nhật nguyên tử có điều kiện trong transaction → kiểm tra phiên bản khi sửa → ràng buộc duy nhất chỉ bảo vệ quy tắc không trùng cụ thể.',
    },
  ],
  4: [
    {
      questionVi: 'Tại sao bạn dùng RabbitMQ thay vì xử lý mọi thứ trong yêu cầu API?',
      answerVi: 'Nếu gửi email mất nhiều thời gian, tôi lưu job cùng thay đổi nghiệp vụ, phát job qua outbox rồi để API phản hồi trước khi giao email. Consumer RabbitMQ xử lý job và chỉ ACK sau khi thành công. Tôi giới hạn số lần thử lại và xử lý trường hợp thông điệp được giao trùng, vì hàng đợi không tự bảo đảm công việc chỉ chạy đúng một lần. Yêu cầu API nhanh hơn, nhưng cần thêm broker và email có thể đến trễ.',
      keyIdeaVi: 'Gửi email chậm → lưu job cùng thay đổi nghiệp vụ và phát qua outbox → consumer ACK sau khi thành công → giới hạn thử lại và xử lý trùng → đánh đổi bằng độ phức tạp và độ trễ giao email.',
    },
    {
      questionVi: 'ACK và NACK trong RabbitMQ là gì?',
      answerVi: 'Sau khi xử lý thành công, consumer gửi ACK để RabbitMQ xóa thông điệp. Nếu không xử lý được, consumer có thể NACK với requeue=true để đưa thông điệp về hàng đợi, hoặc requeue=false để chuyển sang hàng đợi lỗi nếu đã cấu hình dead-letter exchange; nếu không, thông điệp bị loại bỏ. Tôi tránh đưa lỗi cố định vào hàng đợi mãi và dùng cơ chế thử lại có giới hạn.',
      keyIdeaVi: 'Thành công → ACK xóa thông điệp → thất bại → NACK requeue=true đưa lại hàng đợi; false chuyển sang hàng đợi lỗi nếu có cấu hình hoặc loại bỏ → giới hạn thử lại.',
    },
    {
      questionVi: 'Bạn xử lý thông điệp trùng lặp như thế nào?',
      answerVi: 'Worker có thể xử lý xong job nhưng mất ACK, khiến RabbitMQ giao thông điệp thêm lần nữa. Tôi lưu mã job với ràng buộc duy nhất trong cùng transaction với thay đổi nghiệp vụ. Nếu mã đó đã tồn tại, tôi bỏ qua thay đổi và ACK thông điệp trùng. Với lệnh gọi thanh toán ra bên ngoài, tôi cũng gửi khóa idempotency ổn định cho nhà cung cấp.',
      keyIdeaVi: 'Mất ACK → giao thông điệp trùng → lưu mã job và thay đổi nghiệp vụ cùng transaction → bỏ qua và ACK bản trùng → dùng khóa idempotency với dịch vụ ngoài.',
    },
    {
      questionVi: 'Transaction cơ sở dữ liệu thành công nhưng gửi thông điệp lên RabbitMQ thất bại. Bạn sẽ làm gì?',
      answerVi: 'Điều này có thể gây ra trạng thái không nhất quán vì dữ liệu đã được lưu nhưng sự kiện lại bị thiếu. Một giải pháp phổ biến là Outbox Pattern. Tôi lưu dữ liệu nghiệp vụ và một bản ghi outbox trong cùng một transaction cơ sở dữ liệu. Một worker riêng đọc bảng outbox và gửi thông điệp. Nếu gửi thất bại, worker có thể thử lại an toàn.',
      keyIdeaVi: 'Đã lưu dữ liệu nhưng gửi thất bại → thiếu sự kiện → lưu dữ liệu nghiệp vụ và bản ghi outbox cùng transaction → worker gửi và thử lại an toàn.',
    },
  ],
  5: [
    {
      questionVi: 'Khi nào bạn sử dụng bộ nhớ đệm Redis?',
      answerVi: 'Tôi dùng bộ nhớ đệm cho dữ liệu được đọc thường xuyên và không cần tính toán hoặc tải từ cơ sở dữ liệu mỗi lần. Một cách phổ biến là cache-aside. Ứng dụng kiểm tra Redis trước. Nếu không có dữ liệu, ứng dụng tải từ cơ sở dữ liệu rồi lưu vào Redis với thời hạn TTL.',
      keyIdeaVi: 'Dữ liệu được đọc thường xuyên → kiểm tra Redis trước → nếu thiếu thì tải từ cơ sở dữ liệu → lưu đệm với TTL.',
    },
    {
      questionVi: 'Phần khó của việc dùng bộ nhớ đệm là gì?',
      answerVi: 'Phần khó là dữ liệu cache bị cũ sau khi ghi vào cơ sở dữ liệu. Với cache-aside, tôi đọc Redis trước, nếu không có thì đọc cơ sở dữ liệu và lưu kết quả kèm TTL. Sau khi cập nhật thành công, tôi xóa khóa cache liên quan để lần đọc sau tải lại dữ liệu. Vẫn có thể xảy ra race condition ngắn giữa đọc và ghi, nên tôi đọc trực tiếp cơ sở dữ liệu khi cần dữ liệu mới nhất.',
      keyIdeaVi: 'Cache-aside đọc Redis rồi tới cơ sở dữ liệu nếu thiếu → lưu với TTL → xóa cache sau khi ghi thành công → đọc trực tiếp cơ sở dữ liệu khi không chấp nhận dữ liệu cũ.',
    },
    {
      questionVi: 'Điều gì xảy ra nếu Redis ngừng hoạt động?',
      answerVi: 'Nếu Redis chỉ là cache, tôi đặt timeout ngắn và đọc từ cơ sở dữ liệu khi Redis không hoạt động. Tôi theo dõi tải cơ sở dữ liệu và giới hạn lưu lượng nếu phương án dự phòng làm quá tải nó. Tôi không xem dữ liệu chỉ lưu trong cache là trạng thái bền vững. Nếu Redis lưu trạng thái quan trọng, trước tiên tôi xác định cách lưu bền, chuyển đổi khi lỗi và khôi phục các lần ghi bị mất.',
      keyIdeaVi: 'Cache tùy chọn lỗi → timeout ngắn và đọc cơ sở dữ liệu → theo dõi tải → trạng thái quan trọng cần phương án lưu bền, chuyển đổi khi lỗi và khôi phục ghi.',
    },
  ],
  6: [
    {
      questionVi: 'Lưu lượng tăng gấp 10 lần, thời gian phản hồi chậm nhưng CPU thấp. Nguyên nhân có thể là gì?',
      answerVi: 'Phản hồi chậm khi CPU thấp thường nghĩa là yêu cầu đang chờ chứ không phải đang tính toán. Tôi sẽ theo dõi một yêu cầu chậm và kiểm tra thời gian truy vấn cơ sở dữ liệu, thời gian chờ pool kết nối và timeout của API bên ngoài trước. Nếu pool đầy, tôi sửa truy vấn chạy lâu hoặc lỗi không trả kết nối trước khi thêm instance API, vì thêm instance có thể tăng áp lực lên cơ sở dữ liệu. Sau đó tôi đo lại độ trễ.',
      keyIdeaVi: 'CPU thấp + độ trễ cao → truy vết chỗ yêu cầu phải chờ → kiểm tra truy vấn, pool và timeout bên ngoài → sửa nút thắt trước khi mở rộng → đo lại.',
    },
    {
      questionVi: 'Mở rộng theo chiều ngang là gì?',
      answerVi: 'Mở rộng theo chiều ngang nghĩa là thêm nhiều instance ứng dụng thay vì nâng cấp một máy chủ. Load balancer có thể phân phối yêu cầu giữa các instance. Ứng dụng nên tránh chỉ lưu trạng thái phiên quan trọng trong bộ nhớ cục bộ vì yêu cầu tiếp theo có thể được chuyển đến instance khác.',
      keyIdeaVi: 'Cần thêm năng lực xử lý → thêm instance ứng dụng → load balancer phân phối yêu cầu → tránh chỉ lưu phiên quan trọng trong bộ nhớ cục bộ.',
    },
    {
      questionVi: 'Bạn tìm nút thắt hiệu năng như thế nào?',
      answerVi: 'Tôi bắt đầu bằng đo lường thay vì đoán. Tôi kiểm tra độ trễ yêu cầu, thông lượng, tỷ lệ lỗi, CPU, bộ nhớ, thời gian truy vấn cơ sở dữ liệu, thời gian gọi API bên ngoài và các chỉ số hàng đợi. Sau đó tôi theo dõi một yêu cầu chậm qua hệ thống để xem phần nào tốn nhiều thời gian nhất. Tôi tối ưu phần chậm quan trọng nhất trước rồi đo lại sau khi thay đổi.',
      keyIdeaVi: 'Đo độ trễ, lỗi và thời gian từng phần → theo dõi yêu cầu chậm → tìm chỗ tốn thời gian → tối ưu nút thắt chính → đo lại.',
    },
  ],
  7: [
    {
      questionVi: 'Bạn thiết kế cơ chế thử lại như thế nào?',
      answerVi: 'Tôi chỉ thử lại với lỗi tạm thời, như hết thời gian chờ mạng hoặc lỗi dịch vụ tạm thời. Tôi không thử lại với dữ liệu đầu vào không hợp lệ hoặc lỗi xác thực. Tôi đặt giới hạn số lần thử lại, dùng thời gian chờ tăng theo hàm mũ và đôi khi thêm jitter. Thao tác cũng cần có tính idempotent vì thử lại có thể thực hiện cùng một hành động thêm lần nữa.',
      keyIdeaVi: 'Lỗi tạm thời → thử lại có giới hạn và giãn cách tăng dần → không thử lại lỗi đầu vào hoặc xác thực → giữ thao tác idempotent.',
    },
    {
      questionVi: 'Circuit breaker là gì?',
      answerVi: 'Circuit breaker tạm ngừng gọi một dịch vụ khi dịch vụ đó liên tục gặp lỗi. Điều này giúp ứng dụng không phải chờ các lần hết thời gian lặp lại và cho dịch vụ bị lỗi thời gian phục hồi. Sau một khoảng thời gian, chúng ta có thể cho phép một ít yêu cầu để kiểm tra xem dịch vụ đã hoạt động bình thường chưa.',
      keyIdeaVi: 'Dịch vụ lỗi liên tục → tạm ngừng gọi → tránh chờ timeout lặp lại và cho dịch vụ phục hồi → sau đó gửi ít yêu cầu để kiểm tra.',
    },
    {
      questionVi: 'Một API trên production đột nhiên gặp nhiều lỗi. Bạn làm gì trước tiên?',
      answerVi: 'Trước tiên, tôi kiểm tra mức độ ảnh hưởng và các thay đổi gần đây. Tôi xem log, chỉ số, tỷ lệ lỗi, độ trễ và các endpoint bị ảnh hưởng. Nếu một lần triển khai gần đây gây ra vấn đề, rollback có thể là cách an toàn nhanh nhất. Sau khi hệ thống ổn định, tôi điều tra nguyên nhân gốc, khắc phục và bổ sung giám sát hoặc kiểm thử để tránh lặp lại.',
      keyIdeaVi: 'Lỗi production tăng → kiểm tra tác động, log và thay đổi gần đây → rollback nếu do triển khai → ổn định hệ thống → sửa nguyên nhân, bổ sung giám sát hoặc kiểm thử.',
    },
  ],
  8: [
    {
      questionVi: 'Khóa lạc quan là gì?',
      answerVi: 'Khóa lạc quan giả định rằng xung đột không xảy ra thường xuyên. Một bản ghi thường có số phiên bản. Khi cập nhật, tôi cũng kiểm tra phiên bản đó. Nếu yêu cầu khác đã thay đổi bản ghi, cập nhật sẽ thất bại và tôi có thể thử lại hoặc trả về lỗi xung đột cho client.',
      keyIdeaVi: 'Xung đột hiếm → theo dõi phiên bản bản ghi → kiểm tra khi cập nhật → nếu đã đổi, thử lại hoặc trả lỗi xung đột.',
    },
    {
      questionVi: 'Khi nào bạn dùng khóa bi quan?',
      answerVi: 'Tôi dùng khóa bi quan khi xung đột sẽ gây tốn kém và tôi cần ngăn các transaction khác thay đổi cùng dữ liệu trong lúc transaction của tôi đang chạy. Cách này kiểm soát chặt hơn, nhưng có thể giảm khả năng xử lý đồng thời và gây chờ khóa hoặc deadlock, nên tôi sử dụng cẩn thận.',
      keyIdeaVi: 'Xung đột gây tốn kém → khóa dữ liệu trong transaction → ngăn thay đổi cạnh tranh → cân nhắc giảm xử lý đồng thời, chờ khóa hoặc deadlock.',
    },
    {
      questionVi: 'Bạn giữ dữ liệu nhất quán giữa nhiều dịch vụ như thế nào?',
      answerVi: 'Ví dụ, dịch vụ đơn hàng có thể lưu đơn trước khi dịch vụ thanh toán xác nhận đã trả tiền. Tôi lưu đơn hàng cùng sự kiện outbox trong một transaction, rồi phát sự kiện cho dịch vụ thanh toán. Consumer thanh toán xử lý thông điệp trùng và báo thành công hoặc thất bại; nếu thất bại, tôi đánh dấu hủy đơn hoặc bắt đầu hoàn tiền khi cần. Các dịch vụ sẽ nhất quán sau một thời gian, nên trạng thái đơn hàng phải cho thấy thanh toán vẫn đang chờ.',
      keyIdeaVi: 'Lưu đơn trước khi thanh toán → ghi đơn và outbox cùng transaction → consumer thanh toán xử lý trùng → xác nhận hoặc bù trừ → hiển thị chờ đến khi nhất quán.',
    },
  ],
  9: [
    {
      questionVi: 'Xác thực và phân quyền khác nhau như thế nào?',
      answerVi: 'Xác thực kiểm tra người dùng là ai. Phân quyền kiểm tra người dùng đó được phép làm gì. Ví dụ, JWT có thể giúp xác thực người dùng, nhưng backend vẫn cần kiểm tra vai trò hoặc quyền trước khi thực hiện một hành động.',
      keyIdeaVi: 'Xác thực kiểm tra danh tính → phân quyền kiểm tra quyền hạn → JWT có thể nhận diện người dùng → backend vẫn kiểm tra vai trò hoặc quyền trước khi hành động.',
    },
    {
      questionVi: 'Bạn bảo vệ một backend API như thế nào?',
      answerVi: 'Với API đơn hàng được bảo vệ, trước tiên tôi xác thực người dùng và kiểm tra đơn hàng có thuộc về họ không, thay vì chỉ xem token hợp lệ. Tôi kiểm tra đầu vào và dùng truy vấn có tham số để tránh truy cập cơ sở dữ liệu thiếu an toàn. Tôi dùng HTTPS, không ghi bí mật vào log và giới hạn tần suất các endpoint nhạy cảm như đăng nhập. Tôi cũng rà soát thư viện phụ thuộc và ghi mã yêu cầu an toàn để truy vết sự cố.',
      keyIdeaVi: 'Đơn hàng được bảo vệ → kiểm tra danh tính và quyền sở hữu → kiểm tra đầu vào và tham số hóa truy vấn → dùng HTTPS và log an toàn → giới hạn endpoint nhạy cảm.',
    },
    {
      questionVi: 'Tại sao backend vẫn phải kiểm tra quyền dù frontend đã ẩn nút?',
      answerVi: 'Kiểm tra ở frontend giúp cải thiện trải nghiệm người dùng, nhưng không phải ranh giới bảo mật. Người dùng có thể gọi API trực tiếp. Backend phải kiểm tra quyền trước khi thực hiện hành động vì backend kiểm soát dữ liệu thật và các thao tác nghiệp vụ.',
      keyIdeaVi: 'Ẩn nút ở frontend không phải bảo mật → người dùng có thể gọi API trực tiếp → backend phải kiểm tra quyền trước khi sửa dữ liệu thật.',
    },
  ],
  10: [
    {
      questionVi: 'Bạn sẽ thiết kế hệ thống xử lý tệp lớn như thế nào?',
      answerVi: 'Tôi sẽ tải tệp lên kho lưu trữ đối tượng, rồi tạo job trỏ đến vị trí tệp thay vì xử lý ngay trong yêu cầu API. Worker đọc tệp theo từng phần, lưu tiến độ và cập nhật trạng thái để client kiểm tra. Nếu worker dừng, nó có thể tiếp tục từ checkpoint mà không lặp lại những phần đã hoàn tất. Tôi giới hạn kích thước tệp và thiết kế từng bước để thử lại an toàn, tránh tệp lỗi làm kẹt hàng đợi.',
      keyIdeaVi: 'Tải tệp lớn lên kho đối tượng → xếp job chứa vị trí tệp vào hàng đợi → xử lý từng phần và hiển thị trạng thái → dùng checkpoint, thử lại an toàn → hạn chế tệp lỗi.',
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
      questionVi: 'Tại sao bạn dùng Docker?',
      answerVi: 'Docker cung cấp môi trường chạy nhất quán cho ứng dụng. Cùng một image có thể chạy trong môi trường phát triển, kiểm thử và production. Docker cũng giúp triển khai dễ hơn vì ứng dụng và các thư viện phụ thuộc được đóng gói cùng nhau.',
      keyIdeaVi: 'Đóng gói ứng dụng và thư viện vào Docker image → chạy cùng môi trường ở phát triển, kiểm thử và production → triển khai dễ hơn.',
    },
    {
      questionVi: 'Nginx đóng vai trò gì ở phía trước ứng dụng Node.js?',
      answerVi: 'Nginx có thể hoạt động như một reverse proxy. Nó nhận yêu cầu từ client và chuyển tiếp đến các instance Node.js. Nó cũng có thể xử lý TLS, cân bằng tải, giới hạn yêu cầu và một số nội dung tĩnh. Nhờ đó, một phần công việc hạ tầng được tách khỏi ứng dụng Node.js.',
      keyIdeaVi: 'Nginx nhận yêu cầu từ client → chuyển đến các instance Node.js → có thể xử lý TLS, cân bằng tải và giới hạn yêu cầu → tách việc hạ tầng khỏi ứng dụng.',
    },
    {
      questionVi: 'Kiểm tra readiness và liveness là gì?',
      answerVi: 'Kiểm tra liveness cho nền tảng biết tiến trình ứng dụng còn hoạt động hay không. Nếu không khỏe, nền tảng có thể khởi động lại. Kiểm tra readiness cho biết ứng dụng đã sẵn sàng nhận lưu lượng hay chưa. Ví dụ, một instance có thể đang chạy nhưng vẫn khởi động, nên chưa được nhận yêu cầu.',
      keyIdeaVi: 'Liveness kiểm tra tiến trình còn chạy không → khởi động lại nếu lỗi → readiness kiểm tra khả năng nhận lưu lượng → đợi khởi động xong.',
    },
  ],
  12: [
    {
      questionVi: 'Kiểm thử đơn vị, tích hợp và đầu cuối khác nhau như thế nào?',
      answerVi: 'Kiểm thử đơn vị kiểm tra một phần logic nhỏ một cách độc lập. Kiểm thử tích hợp kiểm tra cách nhiều thành phần phối hợp với nhau, ví dụ như service và cơ sở dữ liệu. Kiểm thử đầu cuối kiểm tra một luồng hoàn chỉnh từ yêu cầu API đến kết quả cuối cùng. Tôi dùng nhiều cấp độ kiểm thử vì mỗi cấp độ phát hiện một loại vấn đề khác nhau.',
      keyIdeaVi: 'Kiểm thử đơn vị kiểm tra logic riêng lẻ → tích hợp kiểm tra các phần cùng nhau → đầu cuối kiểm tra toàn luồng → mỗi cấp phát hiện lỗi khác nhau.',
    },
    {
      questionVi: 'Bạn xem xét những gì khi review code?',
      answerVi: 'Trước tiên tôi kiểm tra tính đúng đắn: logic nghiệp vụ, các trường hợp đặc biệt, xử lý lỗi, bảo mật và các vấn đề dữ liệu có thể xảy ra. Sau đó tôi xem xét khả năng đọc, bảo trì, độ bao phủ kiểm thử, hiệu năng khi cần và việc thay đổi có tuân theo kiến trúc hiện tại hay không. Tôi cố gắng đưa ra nhận xét cụ thể và giải thích vì sao thay đổi đó quan trọng.',
      keyIdeaVi: 'Xem tính đúng đắn và trường hợp đặc biệt trước → kiểm tra bảo mật, rủi ro dữ liệu → xem độ dễ đọc, kiểm thử và kiến trúc → giải thích góp ý cụ thể.',
    },
    {
      questionVi: 'Bạn ngăn lỗi hồi quy như thế nào?',
      answerVi: 'Trước tiên tôi tái hiện lỗi và tìm hiểu nguyên nhân gốc. Sau đó tôi sửa lỗi và thêm một bài kiểm thử thất bại trước khi sửa, thành công sau khi sửa. Với các luồng quan trọng, tôi cũng duy trì kiểm thử tích hợp hoặc đầu cuối. Giám sát trên production giúp phát hiện những vấn đề mà kiểm thử có thể bỏ sót.',
      keyIdeaVi: 'Tái hiện lỗi → tìm nguyên nhân gốc → sửa và thêm kiểm thử trước/sau → giữ kiểm thử luồng quan trọng và giám sát production.',
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
