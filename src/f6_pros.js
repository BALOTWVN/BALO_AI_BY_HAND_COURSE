/* ================= CHỨC NĂNG · SỨC MẠNH · NHƯỢC ĐIỂM cho từng bài =================
   PR(id, chức năng, [điểm mạnh], [nhược điểm], [mô hình nổi tiếng đang dùng ý tưởng này (id trong MODELS_G)], 'khi nào dùng / khi nào tránh') */
const PROS = {};
const PR = (id, fn, plus, minus, now = [], use = '') => { PROS[id] = { fn, plus, minus, now, use }; };

/* ----- Giai đoạn 0: nền toán ----- */
PR('aitypes', 'Bản đồ giúp bạn biết một bài toán thuộc loại AI nào (biểu tượng, học máy, học sâu, tạo sinh, tăng cường) để chọn đúng công cụ.',
  ['Tránh dùng "dao mổ trâu giết gà": nhiều bài chỉ cần luật hoặc cây quyết định', 'Hiểu vì sao LLM hiện nay là sự kết hợp nhiều nhánh (học sâu + tăng cường + tìm kiếm)', 'Dễ đọc tin tức AI mà không bị thuật ngữ làm rối'],
  ['Ranh giới các nhánh ngày càng mờ', 'Phân loại chỉ là bản đồ, không dạy cách làm', 'Lĩnh vực thay đổi rất nhanh, cần cập nhật'], ['gpt', 'alphazero', 'sam'],
  'Đọc lại bài này mỗi khi gặp một bài toán mới để tự hỏi: dữ liệu có nhãn không, cần giải thích không, cần sinh nội dung không?');
PR('vector', 'Biểu diễn mọi thứ (pixel, từ, người dùng) thành dãy số; tích vô hướng đo hai thứ "giống nhau" bao nhiêu.',
  ['Cực nhanh trên GPU', 'Là phép tính lõi của attention, CLIP, tìm kiếm vector (RAG)', 'Dễ hình dung bằng hình học'],
  ['Tích vô hướng bị ảnh hưởng bởi độ dài vector: cần chuẩn hóa (cosine)', 'Chiều cao (768–4096) không hình dung được trực tiếp', '"Gần nhau" trong không gian vector chưa chắc là đúng ngữ nghĩa'], ['clip', 'siglip2', 'gpt'],
  'Dùng cosine khi so sánh embedding; dùng tích vô hướng thô khi độ lớn có ý nghĩa (như điểm attention).');
PR('matmul', 'Gộp hàng nghìn tích vô hướng thành một phép tính; mọi lớp Linear, attention, tích chập đều quy về nhân ma trận.',
  ['GPU, TPU được thiết kế riêng cho phép này', 'Viết gọn cả mạng nơ-ron thành vài dòng', 'Dễ ước lượng chi phí: (m×k)(k×n) tốn m·k·n phép nhân'],
  ['Chi phí tăng nhanh theo kích thước: attention N×N là nút thắt', 'Sai kích thước là lỗi phổ biến nhất khi lập trình', 'Ma trận lớn tốn bộ nhớ'], ['gpt', 'llama'],
  'Luôn ghi kích thước bên cạnh mỗi ma trận khi tính tay.');
PR('calculus', 'Đạo hàm cho biết đổi tham số một chút thì lỗi thay đổi bao nhiêu và theo hướng nào: la bàn để huấn luyện.',
  ['Quy tắc chuỗi cho phép tính gradient của mạng hàng tỷ tham số', 'Thư viện tự động tính (autograd)', 'Áp dụng cho mọi hàm khả vi'],
  ['Chỉ cho thông tin cục bộ: có thể kẹt ở cực tiểu địa phương', 'Hàm không khả vi (argmax, NMS) phải thay bằng xấp xỉ', 'Gradient có thể biến mất hoặc bùng nổ'], ['gpt', 'resnet'],
  'Khi mô hình không học: kiểm tra gradient có quá nhỏ hoặc quá lớn không.');
PR('prob', 'Biến điểm số thành xác suất (softmax) và đo độ "ngạc nhiên" của dự đoán (cross-entropy).',
  ['Đầu ra dễ hiểu: 0,9 nghĩa là khá chắc', 'Cross-entropy cho gradient đẹp khi đi cùng softmax', 'Là hàm mất mát của LLM và phân loại'],
  ['Mô hình thường "quá tự tin": xác suất không phản ánh đúng tỷ lệ đúng', 'Softmax buộc các lớp loại trừ nhau', 'Lớp hiếm bị lấn át nếu dữ liệu lệch'], ['gpt', 'clip'],
  'Dùng sigmoid riêng từng lớp khi một ảnh có thể có nhiều lỗi cùng lúc.');
PR('gauss', 'Mô tả nhiễu và độ bất định; là "nguyên liệu" của VAE và diffusion.',
  ['Chỉ cần trung bình và độ lệch chuẩn', 'Cộng hai Gauss vẫn ra Gauss: tính toán gọn', 'Z-score phát hiện bất thường đơn giản'],
  ['Dữ liệu thật hay có đuôi dày, nhiều đỉnh', 'Ngoại lai làm lệch trung bình', 'Giả định độc lập thường sai'], ['sd', 'chronos'],
  'Kiểm tra biểu đồ phân bố trước khi giả định Gauss.');

/* ----- Học máy cổ điển ----- */
PR('mlbasics', 'Khung chung của mọi bài học máy: dữ liệu, mô hình, hàm mất mát, tối ưu, đánh giá trên tập chưa thấy.',
  ['Áp dụng cho mọi mô hình từ hồi quy đến LLM', 'Giúp phát hiện quá khớp sớm', 'Ngôn ngữ chung khi làm việc nhóm'],
  ['Dễ rò rỉ dữ liệu giữa tập huấn luyện và kiểm tra', 'Giả định dữ liệu kiểm tra giống dữ liệu thật (thường sai khi đổi dây chuyền)', 'Chọn sai thước đo dẫn tới mô hình sai mục tiêu'], ['resnet', 'yolo26'], '');
PR('evaluation', 'Đo mô hình tốt đến đâu và sai kiểu gì: accuracy, precision, recall, F1, AUC, mAP.',
  ['Chỉ ra loại lỗi quan trọng (bỏ sót lỗi bo mạch đắt hơn báo nhầm)', 'So sánh mô hình công bằng', 'mAP là chuẩn chung của phát hiện vật thể'],
  ['Một con số che giấu nhiều điều: accuracy cao vẫn có thể bỏ sót hết lỗi hiếm', 'Benchmark công khai có thể đã lọt vào dữ liệu huấn luyện', 'Ngưỡng quyết định thay đổi kết quả'], ['yolo26', 'rtdetr'],
  'Với kiểm tra lỗi: báo recall ở mức báo nhầm chấp nhận được, đừng chỉ báo accuracy.');
PR('knn', 'Đoán nhãn bằng cách nhìn k mẫu gần nhất.',
  ['Không cần huấn luyện', 'Dễ giải thích: "giống ảnh lỗi số 37"', 'Kết hợp với embedding DINO/CLIP rất mạnh cho phát hiện bất thường'],
  ['Chậm khi dữ liệu lớn (phải so với tất cả)', 'Nhạy với thang đo và chiều cao', 'Phải chọn k và hàm khoảng cách'], ['dinov2', 'clip'],
  'Dùng cho tìm ảnh tương tự, hoặc làm mốc so sánh nhanh.');
PR('svm', 'Tìm đường phân cách có lề rộng nhất giữa hai lớp; kernel cho phép phân cách cong.',
  ['Tốt với dữ liệu nhỏ, nhiều chiều', 'Lý thuyết chắc chắn', 'Ít quá khớp nhờ lề rộng'],
  ['Chậm với hàng trăm nghìn mẫu', 'Không ra xác suất tự nhiên', 'Chọn kernel và C khá thủ công'], [],
  'Dùng khi có ít mẫu và đặc trưng đã trích sẵn (ví dụ từ CNN).');
PR('tree', 'Chuỗi câu hỏi có/không để ra quyết định.',
  ['Dễ đọc, dễ giải thích cho kỹ sư dây chuyền', 'Không cần chuẩn hóa dữ liệu', 'Xử lý dữ liệu bảng hỗn hợp tốt'],
  ['Một cây dễ quá khớp', 'Không ổn định: đổi dữ liệu chút là cây khác hẳn', 'Không hợp với ảnh, âm thanh thô'], [], '');
PR('ensemble', 'Gộp nhiều cây (Random Forest, XGBoost) để giảm sai số.',
  ['Thường thắng với dữ liệu dạng bảng', 'Ít phải chỉnh', 'Có độ quan trọng đặc trưng'],
  ['Khó giải thích từng quyết định hơn một cây', 'Mô hình to, chậm hơn', 'Không học đặc trưng từ ảnh thô'], [],
  'Dữ liệu bảng (thông số máy, nhiệt độ, áp suất): thử XGBoost trước khi thử mạng nơ-ron.');
PR('kmeans', 'Chia dữ liệu không nhãn thành k cụm.',
  ['Đơn giản, nhanh', 'Khám phá nhóm lỗi chưa biết', 'Nén màu, nén vector'],
  ['Phải chọn k trước', 'Chỉ tìm cụm tròn, cỡ tương tự', 'Nhạy với khởi tạo và ngoại lai'], [], '');
PR('pca', 'Giảm số chiều mà giữ nhiều phương sai nhất.',
  ['Nén và trực quan hóa dữ liệu', 'Khử nhiễu', 'Tăng tốc mô hình phía sau'],
  ['Chỉ bắt quan hệ tuyến tính', 'Thành phần chính khó diễn giải', 'Phương sai lớn chưa chắc là thông tin quan trọng'], [], '');
PR('nbayes', 'Tính xác suất lớp từ bằng chứng, giả định các bằng chứng độc lập.',
  ['Cực nhanh, cần ít dữ liệu', 'Tốt cho lọc thư rác, phân loại văn bản ngắn', 'Dễ cập nhật khi có dữ liệu mới'],
  ['Giả định độc lập thường sai', 'Xác suất ra thường cực đoan', 'Thua mô hình hiện đại khi có nhiều dữ liệu'], [], '');

/* ----- Mạng nơ-ron ----- */
PR('neuron', 'Tổng có trọng số rồi qua hàm kích hoạt: viên gạch nhỏ nhất của mọi mạng sâu.',
  ['Rất đơn giản, tính tay được', 'Ghép nhiều nơ-ron xấp xỉ được hàm bất kỳ', 'Trọng số học được từ dữ liệu'],
  ['Một nơ-ron chỉ phân cách tuyến tính (không giải được XOR)', 'Không có trí nhớ, không biết vị trí', 'Cần rất nhiều nơ-ron cho bài khó'], ['gpt'], '');
PR('activation', 'Thêm độ cong (phi tuyến) để mạng học được quan hệ phức tạp.',
  ['ReLU rẻ, gradient không tắt ở phía dương', 'GELU, SwiGLU giúp Transformer học tốt hơn', 'Sigmoid, tanh dùng cho cổng (LSTM) và xác suất'],
  ['ReLU có thể "chết" (luôn ra 0)', 'Sigmoid làm gradient biến mất ở mạng sâu', 'Chọn sai làm chậm hội tụ'], ['llama', 'gpt'], '');
PR('mlp', 'Xếp nhiều lớp nơ-ron; là khối FFN trong mọi Transformer.',
  ['Xấp xỉ hàm tổng quát', 'Đơn giản, nhanh', 'Hợp với dữ liệu dạng vector'],
  ['Không tận dụng cấu trúc ảnh hay chuỗi', 'Nhiều tham số khi đầu vào lớn', 'Dễ quá khớp'], ['gpt', 'llava'], '');
PR('loss', 'Con số đo mô hình sai bao nhiêu; huấn luyện là làm nó nhỏ đi.',
  ['Định nghĩa rõ mục tiêu', 'Có thể thiết kế riêng (focal loss cho lỗi hiếm, IoU loss cho hộp)', 'Kết hợp nhiều mục tiêu bằng tổng có trọng số'],
  ['Loss giảm không có nghĩa là mô hình hữu ích', 'Chọn sai loss khiến mô hình học "lách luật"', 'Cân bằng các thành phần loss khá thủ công'], ['yolo26', 'clip'], '');
PR('backprop', 'Tính gradient cho mọi trọng số bằng quy tắc chuỗi, đi ngược từ lỗi về đầu vào.',
  ['Chi phí chỉ khoảng gấp đôi một lần chạy xuôi', 'Tự động hoàn toàn trong PyTorch', 'Huấn luyện được mạng hàng tỷ tham số'],
  ['Phải lưu kích hoạt nên tốn bộ nhớ', 'Gradient biến mất/bùng nổ ở mạng sâu', 'Cần hàm khả vi'], ['gpt', 'resnet'], '');
PR('optim', 'Quy tắc bước đi xuống dốc: SGD, Momentum, Adam, AdamW.',
  ['Adam ít phải chỉnh, hội tụ nhanh', 'Momentum vượt qua vùng phẳng, rãnh hẹp', 'Lịch học (warmup, cosine) giúp ổn định'],
  ['Adam tốn bộ nhớ gấp 3 (m, v)', 'Tốc độ học sai là hỏng cả lần huấn luyện', 'Tổng quát hóa đôi khi kém SGD'], ['llama', 'yolo26'],
  'Bắt đầu với AdamW và tốc độ học nhỏ; thấy loss dao động thì giảm.');
PR('norm', 'Đưa kích hoạt về thang ổn định (BatchNorm, LayerNorm, RMSNorm) để mạng sâu học được.',
  ['Huấn luyện nhanh, ổn định hơn', 'Cho phép tốc độ học lớn', 'Có mặt trong mọi kiến trúc hiện đại'],
  ['BatchNorm hỏng khi lô quá nhỏ', 'Khác biệt giữa huấn luyện và suy luận gây lỗi khó tìm', 'Thêm chi phí tính toán nhỏ'], ['llama', 'resnet'], '');

/* ----- CNN ----- */
PR('conv', 'Trượt bộ lọc nhỏ trên ảnh để tìm mẫu cục bộ (cạnh, góc, vết xước).',
  ['Chia sẻ trọng số: ít tham số', 'Vật dịch chỗ vẫn nhận ra', 'Rất nhanh trên GPU và chip biên'],
  ['Chỉ nhìn cục bộ, cần xếp nhiều lớp để thấy toàn cục', 'Không bất biến với xoay, co giãn', 'Bộ lọc cố định sau huấn luyện, không thích ứng theo ảnh'], ['resnet', 'yolo26', 'convnext'], '');
PR('convshape', 'Tính kích thước đầu ra theo padding, stride, kernel.',
  ['Thiết kế mạng không lỗi kích thước', 'Stride giảm độ phân giải để tiết kiệm tính toán', 'Padding giữ thông tin ở mép ảnh'],
  ['Stride lớn làm mất vật nhỏ (lỗi bo mạch rất nhỏ)', 'Padding sinh viền giả', 'Dễ tính sai khi kết hợp nhiều lớp'], ['yolo26'], '');
PR('channels', 'Mỗi lớp có nhiều bộ lọc, mỗi bộ lọc tạo một kênh đặc trưng.',
  ['Học nhiều loại mẫu song song', 'Tích chập 1×1 trộn kênh rẻ', 'Kênh sâu mang ý nghĩa cao (mắt, tai, chân linh kiện)'],
  ['Số tham số tăng theo C_in × C_out', 'Nhiều kênh dư thừa', 'Khó diễn giải từng kênh'], ['resnet', 'efficientnet'], '');
PR('rf', 'Đo vùng ảnh gốc mà một nơ-ron "nhìn thấy".',
  ['Giải thích vì sao cần mạng sâu', 'Giúp chọn kiến trúc theo cỡ vật', 'Cơ sở để hiểu FPN và dilated conv'],
  ['Trường nhìn hiệu dụng nhỏ hơn lý thuyết', 'CNN vẫn khó nắm quan hệ rất xa', 'Tăng trường nhìn bằng pooling làm mất chi tiết'], ['vit', 'swin'], '');
PR('cnnarch', 'Các kiến trúc CNN kinh điển: LeNet, AlexNet, VGG, Inception.',
  ['Hiểu lịch sử giúp đọc paper mới', 'VGG đơn giản, dễ hiểu', 'Vẫn dùng làm xương sống nhẹ'],
  ['Kiến trúc cũ nặng và kém chính xác', 'VGG rất nhiều tham số', 'Đã bị ResNet, ConvNeXt vượt'], ['convnext', 'resnet'], '');
PR('resnet', 'Kết nối tắt y = F(x) + x cho phép huấn luyện mạng rất sâu.',
  ['Gradient chảy thẳng qua đường tắt', 'Mạng 50–150 lớp vẫn học được', 'Ý tưởng có trong mọi Transformer'],
  ['Vẫn là CNN cục bộ', 'Bản lớn tốn bộ nhớ', 'Nhiều khối dư thừa'], ['resnet', 'convnext', 'gpt'], '');
PR('efficient', 'Thiết kế CNN nhẹ: tích chập tách kênh (MobileNet), co giãn cân bằng (EfficientNet).',
  ['Chạy trên điện thoại, camera AOI, chip biên', 'Ít điện năng', 'Độ chính xác trên mỗi phép tính cao'],
  ['Huấn luyện khó hơn', 'Phép tách kênh không nhanh trên mọi GPU', 'Hy sinh chút độ chính xác'], ['efficientnet', 'yolo26'], '');
PR('detseg', 'Không chỉ "ảnh có lỗi không" mà còn "lỗi ở đâu" (hộp) và "pixel nào" (mặt nạ).',
  ['Định vị lỗi giúp sửa chữa và thống kê', 'U-Net phân đoạn tốt với ít dữ liệu', 'Có cả họ mô hình thời gian thực'],
  ['Gán nhãn hộp, mặt nạ rất tốn công', 'Vật nhỏ, sát nhau khó', 'Nhiều siêu tham số (anchor, ngưỡng)'], ['maskrcnn', 'sam', 'detr', 'gdino'],
  'Chỉ cần đếm lỗi: dùng hộp. Cần đo diện tích lỗi: dùng mặt nạ.');
PR('yolo', 'Nhìn ảnh một lần, mỗi ô lưới dự đoán hộp + độ tin cậy + lớp; lọc bằng ngưỡng và NMS.',
  ['Thời gian thực, hợp dây chuyền sản xuất', 'Hệ sinh thái dễ dùng, xuất ra nhiều thiết bị', 'Phát hiện, phân đoạn, tư thế trong một họ mô hình'],
  ['Vật rất nhỏ hoặc chồng lấn nhiều vẫn khó', 'NMS (bản cũ) thêm độ trễ và siêu tham số', 'Danh sách lớp cố định (trừ YOLO-World)'], ['yolo26', 'yolov12', 'yoloworld', 'rtdetr'],
  'Cần tốc độ trên thiết bị biên: YOLO. Cần độ chính xác cao, vật lớn, có GPU: cân nhắc RT-DETR/RF-DETR.');

/* ----- Chuỗi ----- */
PR('embed', 'Biến từ (token) thành vector để mô hình tính toán được.',
  ['Từ gần nghĩa có vector gần nhau', 'Học được từ dữ liệu không nhãn', 'Nền tảng của tìm kiếm ngữ nghĩa'],
  ['Tách từ tiếng Việt có dấu tốn nhiều token hơn tiếng Anh', 'Một vector cho một từ nhiều nghĩa (embedding tĩnh)', 'Mang định kiến từ dữ liệu'], ['gpt', 'clip'], '');
PR('rnn', 'Đọc chuỗi từng bước, mang theo trạng thái ẩn như trí nhớ ngắn hạn.',
  ['Xử lý chuỗi độ dài bất kỳ', 'Bộ nhớ cố định khi suy luận', 'Hợp với tín hiệu trực tuyến'],
  ['Không song song được khi huấn luyện', 'Quên thông tin xa (gradient biến mất)', 'Đã bị Transformer thay ở hầu hết bài'], ['mamba'], '');
PR('lstm', 'RNN có cổng quên/nhớ để giữ thông tin lâu hơn.',
  ['Nhớ xa hơn RNN thường', 'Ổn định khi huấn luyện', 'Vẫn tốt cho chuỗi cảm biến ngắn, dữ liệu ít'],
  ['Vẫn tuần tự, chậm', 'Nhiều tham số hơn RNN', 'Thua Transformer và mô hình nền chuỗi thời gian khi dữ liệu lớn'], ['mamba', 'chronos'], '');
PR('ssm', 'Mô hình không gian trạng thái (Mamba): trạng thái ẩn cập nhật chọn lọc, chi phí tuyến tính theo độ dài.',
  ['Chuỗi rất dài vẫn nhanh', 'Bộ nhớ cố định khi sinh', 'Lai với attention cho kết quả tốt'],
  ['Kém attention ở tác vụ cần tra cứu chính xác', 'Mới, ít công cụ', 'Lý thuyết khó hơn'], ['mamba', 'timesfm'], '');
PR('anomaly', 'Phát hiện cái "khác thường" khi hầu như không có mẫu lỗi.',
  ['Không cần thu thập nhiều ảnh lỗi', 'Bắt được loại lỗi chưa từng thấy', 'Kết hợp tốt với đặc trưng DINO/CLIP (PatchCore)'],
  ['Báo nhầm khi điều kiện chụp thay đổi', 'Khó đặt ngưỡng', 'Không cho biết loại lỗi là gì'], ['dinov2', 'chronos'],
  'Giai đoạn đầu của dây chuyền mới, khi chưa có ảnh lỗi: bắt đầu bằng phát hiện bất thường.');

/* ----- Transformer ----- */
PR('attention', 'Mỗi token hỏi (Q) các token khác (K) để lấy thông tin (V) theo mức liên quan.',
  ['Nhìn toàn cục trong một bước', 'Song song hoàn toàn khi huấn luyện', 'Trọng số attention phần nào giải thích được'],
  ['Chi phí N² theo độ dài chuỗi', 'Không tự biết thứ tự (cần mã hóa vị trí)', 'Cần nhiều dữ liệu'], ['gpt', 'vit', 'flamingo', 'yolov12'], '');
PR('mha', 'Nhiều đầu attention song song, mỗi đầu để ý một kiểu quan hệ.',
  ['Bắt nhiều quan hệ cùng lúc (ngữ pháp, đồng tham chiếu)', 'Cùng chi phí với một đầu lớn', 'GQA/MLA giảm bộ nhớ KV cache'],
  ['Nhiều đầu dư thừa', 'Khó diễn giải tất cả các đầu', 'KV cache lớn khi ngữ cảnh dài'], ['llama', 'deepseek'], '');
PR('posenc', 'Cho Transformer biết thứ tự token (sin/cos, học được, RoPE).',
  ['RoPE giúp mở rộng ngữ cảnh dài', 'Rẻ', 'Áp dụng cho cả ảnh (vị trí 2D)'],
  ['Ngoại suy ra độ dài chưa thấy vẫn khó', 'Chọn sai làm giảm chất lượng ngữ cảnh dài', 'Vị trí 2D/3D cần thiết kế riêng'], ['llama', 'qwenvl'], '');
PR('transformer', 'Khối attention + FFN + chuẩn hóa + kết nối tắt; xếp chồng thành mô hình lớn.',
  ['Một kiến trúc cho chữ, ảnh, âm thanh, protein', 'Co giãn tốt khi tăng dữ liệu và tham số', 'Hệ sinh thái tối ưu khổng lồ'],
  ['Tốn tính toán và bộ nhớ', 'Cần nhiều dữ liệu', 'Khó chạy trên thiết bị rất nhỏ'], ['gpt', 'whisper', 'sd3', 'alphafold'], '');
PR('vit', 'Cắt ảnh thành ô, coi mỗi ô là token, dùng Transformer để phân loại.',
  ['Nhìn toàn cục ngay từ đầu', 'Dùng chung "ngôn ngữ token" với LLM', 'Tiền huấn luyện lớn cho đặc trưng rất mạnh'],
  ['Cần nhiều dữ liệu hoặc mô hình tiền huấn luyện', 'Chi tiết nhỏ hơn một ô dễ mất', 'Chi phí N² với ảnh độ phân giải cao'], ['vit', 'dinov2', 'clip', 'sam'],
  'Có mô hình tiền huấn luyện (DINOv2, CLIP): ViT rất mạnh. Dữ liệu ít, huấn luyện từ đầu: CNN an toàn hơn.');
PR('vitfam', 'Họ cải tiến ViT: Swin (cửa sổ), DeiT (chưng cất), MAE và DINO (tự học).',
  ['Swin có đặc trưng nhiều tỷ lệ cho phát hiện', 'MAE, DINO học không cần nhãn', 'DeiT huấn luyện được trên ImageNet'],
  ['Mỗi biến thể một cái giá về độ phức tạp', 'Nặng hơn CNN trên thiết bị biên', 'Khó chọn giữa quá nhiều lựa chọn'], ['swin', 'dinov2', 'rfdetr'], '');

/* ----- Tạo sinh ----- */
PR('ae', 'Nén dữ liệu qua nút cổ chai rồi tái tạo lại.',
  ['Học biểu diễn gọn không cần nhãn', 'Lỗi tái tạo cao = bất thường', 'Là VAE trong Stable Diffusion'],
  ['Không gian ẩn lộn xộn, khó sinh mẫu mới', 'Ảnh tái tạo mờ', 'Có thể tái tạo cả lỗi (học quá giỏi)'], ['sd'], '');
PR('vae', 'Autoencoder có không gian ẩn dạng Gauss, sinh được mẫu mới.',
  ['Không gian ẩn trơn, nội suy được', 'Huấn luyện ổn định', 'Nén ảnh cho diffusion'],
  ['Ảnh mờ hơn GAN và diffusion', 'Cân bằng KL và tái tạo khó', 'Hiện thường chỉ làm bộ nén'], ['sd', 'sd3'], '');
PR('gan', 'Bộ sinh và bộ phân biệt thi đấu nhau.',
  ['Sinh một bước, rất nhanh', 'Ảnh sắc nét', 'Hữu ích cho dữ liệu tổng hợp, tăng cường dữ liệu'],
  ['Huấn luyện bất ổn', 'Sập mode: chỉ sinh vài kiểu', 'Khó điều khiển bằng chữ'], ['stylegan'], '');
PR('ganvar', 'Biến thể GAN: có điều kiện, CycleGAN (đổi miền không cặp), StyleGAN.',
  ['Đổi phong cách ảnh không cần cặp', 'Điều khiển thuộc tính', 'Sinh lỗi tổng hợp từ ảnh tốt'],
  ['Vẫn bất ổn', 'CycleGAN có thể bịa chi tiết', 'Đã bị diffusion vượt về đa dạng'], ['stylegan'], '');
PR('diffwd', 'Quá trình thêm nhiễu dần cho tới khi ảnh thành nhiễu thuần.',
  ['Có công thức đóng: nhảy thẳng tới bước t bất kỳ', 'Đơn giản, không cần học', 'Tạo dữ liệu huấn luyện vô hạn cho bộ khử nhiễu'],
  ['Lịch nhiễu chọn sai làm hỏng chất lượng', 'Nhiều bước', 'Chỉ là nửa câu chuyện'], ['sd', 'dit'], '');
PR('diffrev', 'Học đoán nhiễu rồi trừ dần để từ nhiễu sinh ra ảnh.',
  ['Đa dạng, ổn định hơn GAN', 'Điều kiện bằng chữ, ảnh, bản phác', 'Chất lượng cao nhất hiện nay'],
  ['Chậm: nhiều bước khử nhiễu', 'Tốn tính toán', 'Có thể sinh chi tiết sai vật lý'], ['sd', 'sd3', 'sora'], '');
PR('diffadv', 'Diffusion hiện đại: không gian ẩn, guidance, DiT, rectified flow, chưng cất ít bước.',
  ['Chạy trên GPU cá nhân', 'Ít bước (1–8) với chưng cất', 'Mở rộng sang video, 3D, protein'],
  ['Mô hình rất lớn', 'Rủi ro deepfake và bản quyền', 'Điều khiển chính xác (đếm, vị trí) vẫn khó'], ['sd3', 'dit', 'sora', 'alphafold'], '');

/* ----- Hiện đại ----- */
PR('contrastive', 'Kéo cặp khớp lại gần, đẩy cặp không khớp ra xa: CLIP, SimCLR, DINO.',
  ['Học từ dữ liệu không nhãn hoặc nhãn yếu', 'Zero-shot bằng chữ', 'Đặc trưng dùng lại cho nhiều tác vụ'],
  ['Cần lô lớn, nhiều mẫu âm', 'Học "lối tắt" nếu dữ liệu thiên lệch', 'Kém ở chi tiết nhỏ, đếm'], ['clip', 'siglip2', 'dinov2'], '');
PR('llm', 'Transformer giải mã đoán token tiếp theo, huấn luyện trên lượng chữ khổng lồ, rồi tinh chỉnh theo chỉ dẫn.',
  ['Một mô hình làm được rất nhiều việc bằng lời nhắc', 'Học trong ngữ cảnh từ vài ví dụ', 'Gọi công cụ, viết code, suy luận nhiều bước'],
  ['Có thể bịa', 'Tốn tính toán, chi phí cao', 'Kiến thức đóng băng tại mốc huấn luyện (cần RAG)'], ['gpt', 'claude', 'gemini', 'llama', 'deepseek', 'qwen'], '');
PR('lora', 'Tinh chỉnh bằng cách chỉ học hai ma trận hạng thấp thêm vào trọng số gốc.',
  ['Giảm số tham số huấn luyện hàng trăm lần', 'Một mô hình gốc, nhiều "bộ chuyển" nhỏ', 'QLoRA tinh chỉnh LLM lớn trên một GPU'],
  ['Thua tinh chỉnh toàn bộ ở thay đổi lớn', 'Chọn hạng r và lớp áp dụng còn thủ công', 'Có thể làm mô hình quên kỹ năng cũ'], ['llama', 'qwen', 'sd'], '');
PR('moe', 'Nhiều chuyên gia FFN, bộ định tuyến chọn vài chuyên gia cho mỗi token.',
  ['Tăng tham số mà không tăng tính toán mỗi token', 'Huấn luyện nhanh hơn mô hình dày đặc cùng chất lượng', 'Dùng trong nhiều LLM lớn hiện nay'],
  ['Vẫn phải nạp mọi chuyên gia vào bộ nhớ', 'Mất cân bằng tải', 'Phức tạp khi phân tán trên nhiều GPU'], ['mixtral', 'deepseek', 'llama', 'qwen'], '');
PR('gnn', 'Học trên đồ thị: mỗi nút tổng hợp thông tin từ hàng xóm.',
  ['Hợp với dữ liệu quan hệ: mạch điện, phân tử, mạng xã hội', 'Bất biến với thứ tự nút', 'Mô phỏng vật lý, thời tiết'],
  ['Làm mượt quá mức khi nhiều lớp', 'Đồ thị lớn khó phân lô', 'Cần xây đồ thị hợp lý'], ['graphcast', 'alphafold'], '');
PR('rl', 'Học bằng thử–sai để tối đa phần thưởng.',
  ['Giải bài toán quyết định nhiều bước', 'Không cần nhãn từng bước', 'Dạy LLM suy luận và làm theo ý người (RLHF)'],
  ['Cần rất nhiều lần thử', 'Phần thưởng thiết kế sai thì mô hình "lách luật"', 'Bất ổn, khó tái lập'], ['alphazero', 'deepseek', 'gpt'], '');
PR('rag', 'Tìm tài liệu liên quan rồi đưa vào ngữ cảnh cho LLM trả lời.',
  ['Cập nhật kiến thức không cần huấn luyện lại', 'Trích dẫn được nguồn', 'Giữ dữ liệu nội bộ (SOP, báo cáo lỗi) tách khỏi mô hình'],
  ['Tìm sai tài liệu thì trả lời sai', 'Chia đoạn và chọn embedding ảnh hưởng nhiều', 'Ngữ cảnh dài làm chậm, tốn chi phí'], ['claude', 'gpt'], '');

/* ----- AI biểu tượng ----- */
PR('search', 'Tìm đường trong không gian trạng thái: BFS, Dijkstra, A*.',
  ['Bảo đảm tìm được lời giải tối ưu (A* với heuristic chấp nhận được)', 'Giải thích được từng bước', 'Dùng trong robot, bản đồ, lập lịch'],
  ['Bùng nổ tổ hợp khi không gian lớn', 'Cần heuristic tốt', 'Không học từ dữ liệu'], ['alphazero'], '');
PR('games', 'Minimax, cắt tỉa alpha-beta, MCTS cho trò chơi đối kháng.',
  ['Chơi tối ưu trong trò chơi nhỏ', 'MCTS + mạng nơ-ron vượt người', 'Ý tưởng tìm kiếm khi suy luận dùng lại trong LLM'],
  ['Cần mô hình luật chơi chính xác', 'Tốn tính toán', 'Khó với trò chơi có thông tin ẩn'], ['alphazero'], '');
PR('logic', 'Luật nếu–thì, hệ chuyên gia, suy diễn.',
  ['Giải thích được hoàn toàn', 'Không cần dữ liệu', 'Bảo đảm tuân thủ quy định'],
  ['Viết luật tốn công, khó bảo trì', 'Không xử lý được nhiễu, ảnh thô', 'Gãy khi gặp trường hợp chưa có luật'], [],
  'Kết hợp tốt với học sâu: mô hình phát hiện lỗi, luật quyết định loại bỏ hay sửa.');
PR('planning', 'Lập kế hoạch và thỏa mãn ràng buộc (lập lịch máy, xếp ca).',
  ['Tìm phương án thỏa mọi ràng buộc', 'Có bộ giải mạnh (SAT, CP, MILP)', 'Giải thích được'],
  ['Bài lớn có thể rất chậm', 'Mô hình hóa bài toán khó', 'Môi trường bất định cần kỹ thuật khác'], [], '');
PR('bayesnet', 'Đồ thị nhân quả với xác suất có điều kiện.',
  ['Suy luận ngược từ triệu chứng ra nguyên nhân', 'Kết hợp kiến thức chuyên gia và dữ liệu', 'Thể hiện độ bất định'],
  ['Suy luận chính xác khó khi mạng lớn', 'Cần biết cấu trúc đồ thị', 'Bảng xác suất bùng nổ'], [], '');
PR('hmm', 'Trạng thái ẩn sinh ra quan sát theo thời gian; thuật toán Viterbi tìm chuỗi trạng thái.',
  ['Gọn, có nền lý thuyết', 'Từng là lõi của nhận dạng giọng nói', 'Tốt cho chuỗi trạng thái máy'],
  ['Giả định Markov bậc 1', 'Biểu diễn hạn chế', 'Đã bị mạng nơ-ron thay ở hầu hết bài'], ['whisper'], '');
PR('evo', 'Tiến hóa quần thể lời giải bằng chọn lọc, lai ghép, đột biến.',
  ['Không cần gradient', 'Tối ưu bài toán rời rạc, hộp đen', 'Tìm kiến trúc mạng (NAS)'],
  ['Chậm, nhiều lần đánh giá', 'Không đảm bảo tối ưu', 'Nhiều siêu tham số'], ['rfdetr'], '');

/* ----- Thực chiến ----- */
PR('xai', 'Giải thích vì sao mô hình quyết định: Grad-CAM, SHAP, bản đồ attention.',
  ['Phát hiện mô hình học sai lý do (nhìn nền thay vì lỗi)', 'Tăng niềm tin của kỹ sư', 'Đáp ứng yêu cầu kiểm định'],
  ['Bản đồ nhiệt có thể gây hiểu nhầm', 'Mỗi phương pháp cho kết quả khác', 'Giải thích chưa chắc là nguyên nhân thật'], ['resnet', 'vit'], '');
PR('deploy', 'Đưa mô hình ra dây chuyền: lượng tử hóa, ONNX/TensorRT, giám sát trôi dữ liệu.',
  ['Chạy nhanh trên thiết bị biên', 'Giảm chi phí', 'Giám sát giúp phát hiện mô hình xuống cấp'],
  ['Lượng tử hóa giảm chút độ chính xác', 'Khác biệt môi trường gây lỗi khó tìm', 'Cần quy trình cập nhật mô hình'], ['yolo26', 'llama'], '');
PR('ethics', 'Công bằng, quyền riêng tư, an toàn, bản quyền.',
  ['Tránh gây hại và rủi ro pháp lý', 'Tăng niềm tin người dùng', 'Bắt buộc ở nhiều thị trường (EU AI Act)'],
  ['Khó đo lường', 'Các mục tiêu có thể mâu thuẫn', 'Thay đổi theo luật từng nước'], ['claude', 'sora'], '');
PR('speech', 'Nhận dạng và tổng hợp giọng nói: phổ mel, CTC, Whisper.',
  ['Giao tiếp rảnh tay ở nhà máy', 'Mô hình đa ngôn ngữ có tiếng Việt', 'Kết hợp LLM thành trợ lý giọng nói'],
  ['Tiếng ồn, thuật ngữ chuyên ngành', 'Có thể bịa câu khi im lặng', 'Độ trễ với mô hình lớn'], ['whisper', 'gemini'], '');
PR('vision3d', 'Hiểu hình học 3D: camera, độ sâu, NeRF, Gaussian Splatting.',
  ['Đo kích thước, độ cao linh kiện', 'Tái tạo cảnh 3D từ ảnh', 'Robot gắp, kiểm tra hàn 3D'],
  ['Cần hiệu chuẩn camera', 'Bề mặt phản chiếu khó', 'Tốn tính toán'], ['depthany'], '');
