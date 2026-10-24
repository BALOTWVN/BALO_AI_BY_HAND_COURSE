/* ===== Sơ đồ chuyển động cho từng bài (cột | khối / khối; cạnh a>b, a~b đường tắt, a<b gradient) ===== */
FL('aitypes', 'ai:AI:gear:mọi kỹ thuật thông minh | ml:Học máy:chart:học từ dữ liệu / sy:AI biểu tượng:tree:luật, tìm kiếm | dl:Học sâu:nn:mạng nhiều lớp | fm:Mô hình nền tảng:star:LLM, VLM, diffusion', 'ai>ml, ai>sy, ml>dl, dl>fm, sy~fm:kết hợp',
  ['AI là chiếc ô lớn nhất: mọi cách làm máy hành xử thông minh.', 'Hai nhánh lớn: học quy luật từ dữ liệu, và dùng luật / tìm kiếm do con người thiết kế.', 'Học sâu là học máy bằng mạng nơ-ron nhiều lớp.', 'Mô hình nền tảng: học sâu ở quy mô cực lớn, ngày càng kết hợp cả công cụ biểu tượng.']);
FL('vector', 'u:Khẩu vị u:mat:[3, 2, 4, 1] / a:Quán A:mat:[4, 1, 5, 0] | m:Nhân từng cặp:op:12, 2, 20, 0 | s:Cộng lại:op:Σ | d:Điểm = 34:prob:một con số', 'u>m, a>m, m>s, s>d',
  ['Hai vector cùng độ dài: khẩu vị của bạn và hồ sơ một quán.', 'Nhân từng cặp phần tử cùng vị trí.', 'Cộng tất cả các tích lại.', 'Kết quả là một số: càng lớn càng “hợp nhau”.']);
FL('matmul', 'a:Giỏ hàng:mat:2 người × 3 món / b:Bảng giá:mat:3 món × 2 chợ | r:Hàng × cột:op:tích vô hướng | c:Tổng tiền:mat:2 người × 2 chợ', 'a>r, b>r, r>c',
  ['Hai ma trận: hai số ở giữa (3 món) phải bằng nhau.', 'Mỗi ô kết quả = một hàng của A nhân thẳng với một cột của B.', 'Kết quả 2×2: mỗi người, mỗi chợ một con số.']);
FL('calculus', 'w:Tham số w:mat | z:z = wx + b:op | e:Sai số e:op:z − t | l:Loss e²:loss', 'w>z, z>e, e>l, l<e:2e, e<z:×1, z<w:×x',
  ['Tham số w đi vào mô hình.', 'Mô hình tính z.', 'So với đáp án: sai số e.', 'Loss = e². Mũi tên đỏ: gradient chảy ngược, nhân đạo hàm từng khâu (quy tắc chuỗi).']);
FL('prob', 'z:Logits:mat:[2, 1, 0] | x:Lũy thừa e^z:op | n:Chia tổng:op | p:Xác suất:prob:[0.67, 0.24, 0.09] | c:Loss −ln p:loss', 'z>x, x>n, n>p, p>c',
  ['Mạng xuất ra các số thực bất kỳ (logits).', 'Lấy e mũ: tất cả thành số dương, số lớn được khuếch đại.', 'Chia cho tổng để cộng lại bằng 1.', 'Ta có phân phối xác suất trên các lớp.', 'Cross-entropy phạt theo xác suất của lớp đúng.']);
FL('gauss', 'mu:μ:mat:tâm / sd:σ:mat:độ rộng / ep:ε ~ N(0,1):noise | x:μ + σ·ε:op | s:Mẫu x:chart', 'mu>x, sd>x, ep>x, x>s',
  ['Ba thành phần: tâm, độ rộng, và một số ngẫu nhiên chuẩn.', 'Co giãn ε theo σ rồi dời tới μ (mẹo tái tham số hóa).', 'Lặp lại nhiều lần: các mẫu vẽ thành hình chuông.']);
FL('cap0', 'x:Ảnh 4 số:img | z:Logit W·x + b:mat | p:Softmax:prob | l:Loss:loss | g:Gradient p − y:op', 'x>z, z>p, p>l, l>g, g~z:cập nhật W',
  ['Ảnh rút gọn thành 4 đặc trưng.', 'Nhân trọng số, cộng bias: điểm cho mèo và chó.', 'Softmax: xác suất.', 'So với nhãn: loss.', 'Gradient đi ngược để sửa W; loss giảm sau mỗi bước.']);

FL('mlbasics', 'd:Dữ liệu (x, y):db:diện tích, giá | m:Mô hình wx + b:chart | l:Loss MSE:loss | o:Tối ưu:gear:chỉnh w, b', 'd>m, m>l, l>o, o~m:cập nhật',
  ['Dữ liệu có đáp án.', 'Mô hình đưa ra dự đoán.', 'Loss đo dự đoán sai bao nhiêu.', 'Bộ tối ưu chỉnh tham số, rồi lặp lại.']);
FL('evaluation', 's:Điểm mô hình:prob | t:Ngưỡng τ:op | c:Ma trận nhầm lẫn:mat:TP FP FN TN | m:Precision, Recall:chart', 's>t, t>c, c>m',
  ['Mô hình cho mỗi bo một điểm “lỗi”.', 'So với ngưỡng để ra quyết định.', 'Đếm đúng/sai vào 4 ô.', 'Tính chỉ số; đổi ngưỡng để đổi điểm cân bằng.']);
FL('knn', 'q:Điểm mới:img | d:Khoảng cách:op:tới mọi điểm | k:k gần nhất:graph | v:Bỏ phiếu:prob', 'q>d, d>k, k>v',
  ['Một điểm cần phân loại.', 'Đo khoảng cách tới mọi điểm đã biết.', 'Lấy k điểm gần nhất.', 'Nhãn nhiều phiếu nhất thắng.']);
FL('svm', 'x:Điểm dữ liệu:mat | f:f = w·x + b:op | m:Lề y·f:op | h:Hinge loss:loss', 'x>f, f>m, m>h, h~f:làm lề rộng nhất',
  ['Các điểm của hai lớp.', 'Tính khoảng cách có dấu tới đường phân tách.', 'Nhân với nhãn: lề.', 'Phạt điểm nằm trong lề hoặc sai phía; tối ưu để lề rộng nhất.']);
FL('tree', 'r:Câu hỏi 1:tree:độ rộng < 70? | a:Câu hỏi 2:tree:độ sáng < 0.3? / b:Lá OK:star | c:Lá NG:star / d:Lá OK:star', 'r>a:có, r>b:không, a>c:có, a>d:không',
  ['Câu hỏi làm giảm Gini nhiều nhất ở gốc.', 'Mỗi nhánh hỏi tiếp câu hỏi tốt nhất của riêng nó.', 'Lá cho kết luận.']);
FL('ensemble', 'f:F₀ trung bình:chart | h1:Cây 1:tree:khớp phần dư | h2:Cây 2:tree:sửa phần còn sai | s:Tổng các cây:op:F₀ + η·Σh', 'f>h1, h1>h2, h2>s, f~s',
  ['Bắt đầu bằng dự đoán trung bình.', 'Cây 1 học phần dư.', 'Cây 2 học phần còn sai của cây 1.', 'Cộng dồn tất cả: mô hình mạnh từ nhiều cây yếu.']);
FL('kmeans', 'x:Điểm chưa nhãn:graph | a:Gán tâm gần nhất:op | u:Dời tâm:op:trung bình cụm | c:Cụm ổn định:prob', 'x>a, a>u, u~a:lặp, u>c',
  ['Dữ liệu không có nhãn.', 'Mỗi điểm về tâm gần nhất.', 'Dời mỗi tâm tới giữa cụm của nó.', 'Lặp đến khi không đổi.']);
FL('pca', 'x:Dữ liệu:mat:nhiều chiều | s:Hiệp phương sai:mat | v:Vectơ riêng:op:hướng trải rộng nhất | z:Chiếu:chart:ít chiều', 'x>s, s>v, v>z',
  ['Dữ liệu đã trừ trung bình.', 'Ma trận hiệp phương sai.', 'Tìm hướng dữ liệu trải rộng nhất.', 'Chiếu xuống vài hướng đó.']);
FL('nbayes', 'p:Prior:prob:tỷ lệ nền | l:Likelihood:prob:P(bằng chứng∣lớp) | m:Nhân:op | n:Chuẩn hóa:op | q:Posterior:prob', 'p>m, l>m, m>n, n>q',
  ['Niềm tin ban đầu.', 'Khả năng thấy bằng chứng nếu mỗi lớp đúng.', 'Nhân hai thứ.', 'Chia tổng.', 'Niềm tin mới sau khi thấy bằng chứng.']);
FL('cap1', 'd:Dữ liệu bo:db | k:k-NN:graph / t:Cây:tree | e:Đánh giá:mat:precision, recall | c:Chọn mô hình:star', 'd>k, d>t, k>e, t>e, e>c',
  ['Dữ liệu huấn luyện và kiểm tra.', 'Hai mô hình ứng viên.', 'Đánh giá trên cùng tập kiểm tra.', 'Chọn theo yêu cầu: không lọt lỗi.']);

FL('neuron', '', '', ['Ba đầu vào x₁, x₂, x₃ nhân trọng số.', 'Cộng lại, thêm bias, qua hàm kích hoạt: một đầu ra.'], { net: [3, 1], lab: ['đầu vào', 'nơ-ron'], nl: [['x₁', 'x₂', 'x₃'], ['a']] });
FL('activation', 'z:z = w·x + b:mat | r:ReLU:chart / s:Sigmoid:chart / t:GELU:chart | a:Kích hoạt a:mat', 'z>r, z>s, z>t, r>a, s>a, t>a',
  ['Tổng có trọng số z.', 'Qua một hàm phi tuyến: chính nó “bẻ cong” không gian.', 'Đầu ra đi tiếp tới lớp sau.']);
FL('mlp', '', '', ['Đầu vào XOR (x₁, x₂).', 'Lớp ẩn “gấp” không gian bằng ReLU.', 'Lớp ra chỉ cần một nhát cắt thẳng.'], { net: [2, 2, 1], lab: ['đầu vào', 'lớp ẩn', 'đầu ra'], nl: [['x₁', 'x₂'], ['h₁', 'h₂'], ['ŷ']] });
FL('loss', 'yh:Dự đoán ŷ:prob / y:Nhãn y:prob | d:So sánh:op | l:Loss:loss:MSE, CE, Focal, Dice | g:Gradient:op', 'yh>d, y>d, d>l, l>g, g~yh:sửa mô hình',
  ['Dự đoán và đáp án.', 'So sánh.', 'Loss chọn “phạt” kiểu gì.', 'Gradient của loss chỉ hướng sửa mô hình.']);
FL('backprop', '', '', ['Forward: đầu vào.', 'Forward: lớp ẩn tính và lưu giá trị.', 'Forward: đầu ra, tính loss.', 'Backward: gradient tại đầu ra = ŷ − y.', 'Backward: chia trách nhiệm cho lớp ẩn (Wᵀδ ⊙ ReLU′).', 'Backward: gradient cho trọng số lớp đầu; cập nhật tất cả.'], { net: [2, 3, 1], back: true, lab: ['đầu vào', 'lớp ẩn', 'đầu ra'], nl: [['x₁', 'x₂'], ['h₁', 'h₂', 'h₃'], ['ŷ']] });
FL('optim', 'g:Gradient g:op | m:Đà m:chart:trung bình g / v:Độ lớn v:chart:trung bình g² | u:Bước Adam:op:m/√v | w:Tham số mới:mat', 'g>m, g>v, m>u, v>u, u>w, w~g:bước sau',
  ['Gradient tại điểm hiện tại.', 'Adam nhớ hướng (m) và độ lớn (v) của gradient.', 'Bước đi = hướng chia độ lớn: mỗi tham số một cỡ bước.', 'Cập nhật rồi lặp lại.']);
FL('norm', 'x:Batch, token:mat | s:μ và σ:op:theo batch hay theo đặc trưng | n:(x − μ)/σ:op | y:γ·x̂ + β:mat', 'x>s, s>n, x>n, n>y',
  ['Dữ liệu vào lớp.', 'Tính trung bình, độ lệch (BN theo batch, LN theo đặc trưng).', 'Chuẩn hóa về trung bình 0, độ lệch 1.', 'Co giãn và dời bằng tham số học được.']);
FL('cap2', '', '', ['Đặc trưng ảnh mèo.', 'Lớp ẩn ReLU.', 'Đầu ra sigmoid: P(mèo).', 'Gradient tại đầu ra: ŷ − 1.', 'Về lớp ẩn: nơ-ron tắt thì gradient bằng 0.', 'Về trọng số lớp đầu; cập nhật và loss giảm.'], { net: [4, 2, 1], back: true, lab: ['4 đặc trưng', 'lớp ẩn', 'P(mèo)'], nl: [['tai', 'cụp', 'mõm', 'râu'], ['h₁', 'h₂'], ['ŷ']] });

FL('conv', 'i:Ảnh:img:16×16 | k:Kernel 3×3 trượt:conv:chia sẻ trọng số | f:Feature map:mat:14×14 | r:ReLU:chart', 'i>k, k>f, f>r',
  ['Ảnh đầu vào.', 'Một bộ lọc nhỏ trượt khắp ảnh, mỗi vị trí tính một tích vô hướng.', 'Kết quả là bản đồ đặc trưng: chỗ nào có mẫu thì sáng.', 'ReLU giữ phản ứng dương.']);
FL('convshape', 'i:Map 4×4:mat | p:Max pool 2×2:conv:stride 2 | o:Map 2×2:mat', 'i>p, p>o',
  ['Feature map đầu vào.', 'Cửa sổ 2×2 nhảy 2 ô, giữ số lớn nhất.', 'Kích thước giảm một nửa, giữ tín hiệu mạnh.']);
FL('channels', 'i:Ảnh RGB:img:3 kênh | k:Conv 1×1:conv:trộn kênh | o:2 kênh ra:mat', 'i>k, k>o',
  ['Ảnh có 3 kênh màu chồng lên nhau.', 'Mỗi bộ lọc nhìn xuyên mọi kênh và trộn chúng.', 'Số kênh ra = số bộ lọc.']);
FL('rf', 'l1:Lớp 1:conv:RF 3 | l2:Lớp 2:conv:RF 5 | p:Pool:conv:RF 6, J = 2 | l3:Lớp 3:conv:RF 10', 'l1>l2, l2>p, p>l3',
  ['Lớp đầu nhìn vùng 3×3.', 'Chồng thêm lớp: tầm nhìn mở rộng.', 'Pooling làm mỗi bước nhảy xa gấp đôi.', 'Lớp sâu “thấy” vùng lớn của ảnh.']);
FL('cnnarch', 'i:Ảnh 224²:img | s:Stem:conv:112² | b1:Khối 1:conv:56² × 64 | b2:Khối 2:conv:28² × 128 | b3:Khối 3:conv:7² × 512 | h:Head:nn:GAP + FC | o:1000 lớp:prob', 'i>s, s>b1, b1>b2, b2>b3, b3>h, h>o',
  ['Ảnh đầu vào.', 'Stem giảm kích thước nhanh.', 'Lớp nông: cạnh, chấm.', 'Lớp giữa: hoa văn, kết cấu.', 'Lớp sâu: bộ phận, vật thể; ảnh nhỏ dần, kênh dày dần.', 'Gộp và phân loại.', 'Xác suất cho từng lớp.']);
FL('resnet', 'x:x:mat | c1:Conv 3×3:conv:BN, ReLU | c2:Conv 3×3:conv:BN | a:⊕:op:F(x) + x | y:ReLU:mat', 'x>c1, c1>c2, c2>a, x~a:đường tắt, a>y',
  ['Đầu vào khối.', 'Nhánh F học phần chênh lệch.', 'Lớp thứ hai của nhánh F.', 'Cộng đường tắt: thông tin và gradient đi thẳng qua.', 'Kích hoạt đầu ra.']);
FL('efficient', 'x:Feature map:mat | dw:Depthwise 3×3:conv:mỗi kênh riêng | pw:Pointwise 1×1:conv:trộn kênh | se:SE:prob:chấm điểm kênh | y:Đầu ra:mat', 'x>dw, dw>pw, pw>se, se>y',
  ['Đầu vào.', 'Lọc không gian từng kênh (rẻ).', 'Trộn kênh bằng 1×1.', 'SE tự tăng giảm tầm quan trọng của từng kênh.', 'Khối gọn, chạy nhanh trên máy yếu.']);
FL('detseg', 'i:Ảnh:img | e1:Encoder:conv:H/2 | b:Đáy:conv:H/8 | d1:Decoder:conv:H/2 | m:Mask lỗi:box:mỗi pixel', 'i>e1, e1>b, b>d1, e1~d1:nối, d1>m',
  ['Ảnh bo mạch.', 'Encoder thu nhỏ, hiểu ngữ cảnh.', 'Đáy chữ U: ý nghĩa đậm nhất.', 'Decoder phóng to lại, nhận chi tiết từ kết nối tắt.', 'Mask đánh dấu từng pixel lỗi.']);
FL('yolo', 'i:Ảnh:img | bb:Backbone:conv:trích đặc trưng | nk:Neck FPN:conv:trộn đa tỷ lệ | hd:Head:mat:S×S×(5B + C) | f:Lọc + NMS:op | o:Hộp kết quả:box', 'i>bb, bb>nk, nk>hd, hd>f, f>o',
  ['Ảnh vào, nhìn một lần.', 'Backbone CNN trích đặc trưng.', 'Neck trộn đặc trưng nhiều tỷ lệ để bắt cả vật nhỏ.', 'Mỗi ô lưới dự đoán hộp, độ tin cậy và lớp.', 'Bỏ hộp yếu, NMS xóa hộp trùng.', 'Hộp cuối cùng với nhãn.']);
FL('cap3', 'i:Ảnh husky:img | c:4 bộ lọc cạnh:conv | p:Bộ dò bộ phận:eye:tai, mõm, râu | s:Điểm + softmax:prob | x:Giải thích:eye:vùng nào gây sai', 'i>c, c>p, p>s, s>x, x~p:sửa bằng dữ liệu',
  ['Ảnh chó husky tai nhọn.', 'Tầng tích chập tìm cạnh.', 'Tầng sâu tìm bộ phận.', 'Tính điểm: mô hình v1 đoán mèo.', 'Bảng đóng góp chỉ ra: lỗi do tai nhọn; sửa bằng thêm dữ liệu.']);

FL('embed', 't:Câu:txt:“bo mạch bị đứt” | k:Token + ID:txt:#812, #93… | e:Bảng embedding E:mat:V × d | v:Vector từ:mat:d chiều', 't>k, k>e, e>v',
  ['Câu chữ.', 'Tách thành token và tra số thứ tự.', 'Tra bảng E (= one-hot × E).', 'Mỗi token thành một vector mang nghĩa.']);
FL('rnn', 'x:x₁, x₂, x₃:txt | h1:h₁:cell | h2:h₂:cell | h3:h₃:cell | y:Dự đoán:prob', 'x>h1, h1>h2, h2>h3, h3>y, h3<h2:gradient, h2<h1',
  ['Chuỗi đi vào từng bước.', 'Trạng thái ẩn mang tóm tắt quá khứ.', 'Cùng trọng số dùng lại ở mỗi bước.', 'Thông tin xa phai dần qua mỗi bước.', 'Gradient ngược qua nhiều bước dễ tiêu biến.']);
FL('lstm', 'c:Ô nhớ c:cell:đường cộng | f:Cổng quên:op:× f | i:Cổng vào:op:+ i·c̃ | o:Cổng ra:op:× o | h:h_t:mat', 'c>f, f>i, i>o, o>h, c~i:gradient đi thẳng',
  ['Ô nhớ như cuốn sổ tay.', 'Cổng quên xóa bớt.', 'Cổng vào ghi thêm thông tin mới.', 'Cổng ra quyết định đọc gì.', 'Sổ được cập nhật bằng phép cộng nên nhớ được lâu.']);
FL('cap4', 's:Cảm biến rung:chart | w:Cửa sổ trượt:clock:6 điểm gần nhất | m:Dự báo:chart:trung bình, RNN | z:Điểm z:op | a:Cảnh báo:star', 's>w, w>m, m>z, s>z, z>a',
  ['Tín hiệu theo thời gian.', 'Nhìn cửa sổ các điểm gần nhất.', 'Dự báo giá trị kế tiếp.', 'Đo độ lệch bằng điểm z.', '|z| vượt ngưỡng: cảnh báo bất thường.']);

FL('attention', 'x:Token:txt:3 từ | q:Q:mat:tôi tìm gì / k:K:mat:tôi chứa gì / v:V:mat:nội dung | s:Điểm QKᵀ/√d:mat | a:Softmax:prob:trọng số | o:Đầu ra A·V:mat', 'x>q, x>k, x>v, q>s, k>s, s>a, a>o, v>o',
  ['Các token đầu vào.', 'Mỗi token chiếu thành query, key, value.', 'So mọi query với mọi key.', 'Softmax từng cột: mỗi token chú ý bao nhiêu vào các token khác.', 'Trộn value theo trọng số: vector mới hiểu ngữ cảnh.']);
FL('mha', 'x:X:txt | h1:Đầu 1:eye:vị trí gần / h2:Đầu 2:eye:quan hệ xa / h3:Đầu h:eye:… | c:Ghép:op | o:W_O:mat', 'x>h1, x>h2, x>h3, h1>c, h2>c, h3>c, c>o',
  ['Cùng đầu vào.', 'Nhiều đầu song song, mỗi đầu học một kiểu quan hệ.', 'Ghép kết quả các đầu.', 'Trộn bằng W_O.']);
FL('posenc', 'e:Embedding:mat / p:Vị trí:clock:sin, cos | a:⊕:op | t:Transformer:nn', 'e>a, p>a, a>t',
  ['Nghĩa của token và vị trí của nó.', 'Cộng (hoặc xoay q, k với RoPE).', 'Giờ attention phân biệt được thứ tự.']);
FL('transformer', 'x:x:mat | n1:LayerNorm:op | at:Attention:eye | a1:⊕:op | n2:LayerNorm:op | ff:FFN:nn:d → 4d → d | a2:⊕:op', 'x>n1, n1>at, at>a1, x~a1, a1>n2, n2>ff, ff>a2, a1~a2',
  ['Đầu vào khối.', 'Chuẩn hóa.', 'Attention trộn thông tin giữa các token.', 'Cộng đường tắt.', 'Chuẩn hóa.', 'FFN xử lý từng token.', 'Cộng đường tắt; xếp chồng N khối như vậy.']);
FL('vit', 'i:Ảnh:img | p:16 mảnh:conv:4×4 | e:Chiếu + vị trí:mat | t:Encoder ×L:nn | c:[CLS] → lớp:prob', 'i>p, p>e, e>t, t>c',
  ['Ảnh đầu vào.', 'Cắt thành mảnh như các “từ”.', 'Mỗi mảnh thành vector, cộng vị trí, thêm [CLS].', 'Các khối Transformer cho mảnh “nói chuyện” với nhau.', '[CLS] tóm tắt cả ảnh để phân loại.']);
FL('vitfam', 'i:Ảnh:img | m:Che 75% mảnh:noise | e:Encoder:nn:chỉ thấy 25% | d:Decoder nhẹ:nn | r:Ảnh khôi phục:img', 'i>m, m>e, e>d, d>r, r~i:so sánh',
  ['Ảnh không cần nhãn.', 'Che phần lớn mảnh.', 'Encoder chỉ xử lý mảnh còn lại.', 'Decoder đoán phần bị che.', 'So với ảnh gốc: học biểu diễn mạnh mà không cần nhãn.']);
FL('cap5', 'i:Ảnh husky:img | p:Mảnh:conv | q:[CLS] hỏi:eye:mèo? chó? | a:Attention map:prob | s:Điểm + kiểm tra:star', 'i>p, p>q, q>a, a>s',
  ['Ảnh husky.', 'Cắt mảnh, tóm tắt mỗi mảnh.', 'Hai câu hỏi “mèo” và “chó”.', 'Bản đồ attention cho biết đang nhìn vào đâu.', 'Tính điểm và truy ra lỗi đặc trưng mõm trắng.']);

FL('ae', 'x:x:img | e:Encoder:nn | z:z:mat:nút cổ chai | d:Decoder:nn | r:x̂:img', 'x>e, e>z, z>d, d>r, x~r:lỗi tái tạo',
  ['Ảnh đầu vào.', 'Nén dần.', 'Nút cổ chai: chỉ giữ điều quan trọng.', 'Giải nén.', 'So ảnh tái tạo với ảnh gốc: chỗ khác nhiều là bất thường.']);
FL('vae', 'x:x:img | e:Encoder:nn | ms:μ, σ:mat | z:z = μ + σε:noise | d:Decoder:nn | r:x̂:img', 'x>e, e>ms, ms>z, z>d, d>r',
  ['Ảnh đầu vào.', 'Encoder.', 'Dự đoán một vùng Gaussian, không phải một điểm.', 'Lấy mẫu bằng mẹo tái tham số hóa.', 'Decoder.', 'Ảnh tái tạo; KL giữ không gian ẩn liền mạch để sinh ảnh mới.']);
FL('gan', 'z:Nhiễu z:noise | g:Generator:nn | f:Ảnh giả:img / r:Ảnh thật:img | d:Discriminator:nn | o:Thật hay giả:prob', 'z>g, g>f, f>d, r>d, d>o, o~g:gradient cho G',
  ['Nhiễu ngẫu nhiên.', 'Generator vẽ ảnh.', 'Ảnh giả và ảnh thật.', 'Discriminator chấm điểm.', 'G học qua lời phê của D, cả hai cùng giỏi lên.']);
FL('ganvar', 'm:Mask lỗi:box | g:G U-Net:nn | y:Ảnh lỗi sinh:img | d:PatchGAN:mat:chấm từng mảnh | l:Loss GAN + L1:loss', 'm>g, g>y, y>d, d>l, l~g',
  ['Điều kiện: mask vị trí lỗi.', 'G kiểu U-Net vẽ ảnh theo mask.', 'Ảnh lỗi tổng hợp.', 'PatchGAN chấm độ thật từng mảnh.', 'Loss = đối kháng + L1.']);
FL('diffwd', 'x:x₀:img | n1:+ nhiễu:noise:t = 250 | n2:+ nhiễu:noise:t = 600 | t:x_T:noise:nhiễu thuần', 'x>n1, n1>n2, n2>t, x~t:nhảy thẳng tới t',
  ['Ảnh sạch.', 'Thêm một ít nhiễu.', 'Thêm nữa: ảnh mờ dần.', 'Cuối cùng chỉ còn nhiễu. Công thức nhảy thẳng tới bất kỳ t.']);
FL('diffrev', 't:x_T:noise | u1:Mạng đoán ε:nn:U-Net | x1:x_{t−1}:noise | u2:Lặp lại:nn | x:x₀ mới:img', 't>u1, u1>x1, x1>u2, u2>x',
  ['Bắt đầu từ nhiễu.', 'Mạng đoán nhiễu nào đang có.', 'Bớt một ít nhiễu.', 'Lặp lại nhiều bước.', 'Một ảnh mới hiện ra.']);
FL('diffadv', 'p:Prompt:txt | te:Text encoder:nn:CLIP | z:Latent nhiễu:noise:64×64×4 | u:U-Net hoặc DiT:nn:cross-attn | d:VAE decoder:nn | i:Ảnh:img', 'p>te, te>u, z>u, u>d, d>i',
  ['Câu mô tả.', 'Mã hóa thành vector.', 'Nhiễu trong không gian ẩn nhỏ.', 'Khử nhiễu có điều kiện (CFG phóng đại điều kiện).', 'Giải mã latent thành ảnh.', 'Ảnh độ phân giải cao.']);
FL('cap6', 'g:Ảnh tốt:img / m:Mask lỗi:box | df:Diffusion inpaint:nn | s:Ảnh lỗi tổng hợp:img | t:Huấn luyện detector:nn | r:Recall trên ảnh thật:chart', 'g>df, m>df, df>s, s>t, t>r',
  ['Ảnh bo tốt và mask vị trí lỗi.', 'Diffusion vẽ lỗi vào đúng chỗ.', 'Nhiều ảnh lỗi kèm nhãn.', 'Huấn luyện mô hình phát hiện.', 'Kiểm chứng bằng recall trên ảnh lỗi thật.']);

FL('contrastive', 'i:Ảnh:img / t:Câu chữ:txt | ie:Image encoder:nn / te:Text encoder:nn | s:Ma trận cosine:mat | l:InfoNCE:loss:đường chéo đúng', 'i>ie, t>te, ie>s, te>s, s>l',
  ['Cặp ảnh và chú thích.', 'Hai encoder riêng.', 'So mọi ảnh với mọi câu.', 'Kéo cặp đúng lại gần, đẩy cặp sai ra xa.']);
FL('llm', 'p:Prompt:txt | k:Token:txt | tf:Transformer ×N:nn:causal | pr:Xác suất từ:prob | s:Lấy mẫu:op:T, top-p | n:Token mới:txt', 'p>k, k>tf, tf>pr, pr>s, s>n, n~k:tự hồi quy',
  ['Câu hỏi.', 'Tách token.', 'Các khối Transformer (chỉ nhìn quá khứ).', 'Phân phối xác suất cho từ tiếp theo.', 'Chọn một từ.', 'Gắn vào cuối và lặp lại.']);
FL('lora', 'x:x:mat | w:W₀ đóng băng:mat / a:A:mat:r × k | b:B:mat:d × r | s:⊕:op | y:y:mat', 'x>w, x>a, a>b, w>s, b>s, s>y',
  ['Đầu vào.', 'Nhánh gốc đóng băng; nhánh LoRA hạng thấp.', 'B·A là phần cập nhật nhỏ.', 'Cộng hai nhánh.', 'Sau huấn luyện gộp lại, không chậm hơn.']);
FL('moe', 'x:Token:txt | r:Router:prob | e1:Chuyên gia 1:nn / e2:Chuyên gia 2:nn / e3:Chuyên gia 3:nn | c:Trộn top-2:op | y:Đầu ra:mat', 'x>r, r>e1, r>e2, r>e3, e1>c, e2>c, c>y',
  ['Một token.', 'Router chấm điểm các chuyên gia.', 'Chỉ 2 chuyên gia tốt nhất được chạy.', 'Trộn theo trọng số.', 'Dung lượng lớn, chi phí nhỏ.']);
FL('ssm', 'x:x_t:chart | h:h_t = Ā·h + B̄·x:cell | y:y_t = C·h:chart | k:Kernel K̄:conv:huấn luyện song song', 'x>h, h>y, x~k, k>y',
  ['Tín hiệu vào.', 'Trạng thái cập nhật tuyến tính.', 'Đầu ra.', 'Vì tuyến tính nên tương đương một phép tích chập: huấn luyện song song, suy luận như RNN.']);
FL('gnn', 'g:Đồ thị:graph:linh kiện, đường nối | m:Gom hàng xóm:op | w:× W + ReLU:nn | h:Đặc trưng mới:graph', 'g>m, m>w, w>h, h~m:lớp tiếp',
  ['Dữ liệu dạng đồ thị.', 'Mỗi nút lấy trung bình của hàng xóm.', 'Biến đổi tuyến tính và kích hoạt.', 'Lặp nhiều lớp: nhìn xa hơn.']);
FL('rl', 'a:Tác tử:nn | e:Môi trường:gear | r:Thưởng r:star | q:Cập nhật Q:mat', 'a>e:hành động, e>r, r>q, q~a:chính sách tốt hơn',
  ['Tác tử chọn hành động.', 'Môi trường thay đổi.', 'Nhận phần thưởng (có khi đến muộn).', 'Cập nhật kinh nghiệm và chọn tốt hơn lần sau.']);
FL('rag', 'q:Câu hỏi:txt | em:Nhúng:mat | db:CSDL vector:db | k:Top-k đoạn:doc | m:LLM:nn | a:Trả lời + nguồn:doc', 'q>em, em>db, db>k, k>m, q~m, m>a',
  ['Câu hỏi của kỹ sư.', 'Biến thành vector.', 'Tìm trong kho tài liệu.', 'Lấy các đoạn gần nhất.', 'LLM đọc câu hỏi kèm tài liệu.', 'Trả lời có trích nguồn.']);
FL('anomaly', 'i:Ảnh AOI:img | bb:Backbone:conv:pretrained | f:Đặc trưng mảnh:mat | mb:Bộ nhớ ảnh tốt:db | d:Khoảng cách k-NN:op | h:Bản đồ bất thường:box', 'i>bb, bb>f, f>d, mb>d, d>h',
  ['Ảnh mới.', 'Trích đặc trưng bằng mạng đã huấn luyện sẵn.', 'Đặc trưng từng mảnh.', 'So với ngân hàng mảnh tốt.', 'Mảnh nào xa mọi mảnh tốt là bất thường.', 'Bản đồ khoanh vùng lỗi.']);
FL('cap7', 'i:Ảnh lỗi:img / q:Câu hỏi:txt | c:CLIP:eye:chọn mô tả / r:RAG:db:tìm quy trình | m:LLM:nn | a:Trả lời:doc', 'i>c, q>r, c>m, r>m, m>a',
  ['Ảnh và câu hỏi.', 'CLIP gọi tên lỗi; RAG tìm tài liệu.', 'LLM tổng hợp.', 'Câu trả lời có trích nguồn.']);

FL('search', 's:Điểm đầu:graph | o:Hàng đợi:prob:f = g + h nhỏ nhất | x:Mở rộng:graph | g:Đích:star', 's>o, o>x, x~o:lặp, x>g',
  ['Bắt đầu.', 'Luôn lấy nút có f nhỏ nhất.', 'Mở rộng láng giềng, cập nhật g.', 'Tới đích: đường tối ưu nếu h không ước lượng quá.']);
FL('games', 'l:Lá:mat:điểm cuối ván | m:MIN:tree:đối thủ chọn nhỏ | r:MAX:tree:mình chọn lớn | v:Nước đi:star', 'l>m, m>r, r>v',
  ['Đánh giá các thế cờ cuối.', 'Đối thủ chọn nước tệ nhất cho mình.', 'Mình chọn nước tốt nhất trong các trường hợp đó.', 'Nước đi được chọn; alpha–beta bỏ qua nhánh vô ích.']);
FL('logic', 'f:Sự kiện:doc | r:Luật nếu – thì:tree | i:Suy diễn:gear | k:Kết luận mới:star', 'f>i, r>i, i>k, k~f:thêm vào',
  ['Những gì đã biết.', 'Tri thức chuyên gia dạng luật.', 'Áp luật có điều kiện thỏa mãn.', 'Thêm kết luận, lặp đến khi không thêm được.']);
FL('planning', 's:Trạng thái đầu:doc | a:Hành động:gear:điều kiện → hiệu ứng | p:Kế hoạch:tree | g:Mục tiêu:star', 's>a, a>p, p>g',
  ['Hiện trạng.', 'Các hành động và điều kiện của chúng.', 'Xâu chuỗi hành động (tìm kiếm).', 'Đạt mục tiêu.']);
FL('bayesnet', 'm:Mưa:graph / v:Vòi tưới:graph | w:Sân ướt:graph | p:Suy luận ngược:op | q:P(nguyên nhân∣ướt):prob', 'm>w, v>w, w>p, p>q',
  ['Hai nguyên nhân.', 'Một hệ quả quan sát được.', 'Từ hệ quả suy ngược.', 'Xác suất của từng nguyên nhân.']);
FL('hmm', 'b:Niềm tin:chart | p:Dự đoán:op:+u, +Q | z:Số đo:chart | k:Hiệu chỉnh:op:theo K | n:Niềm tin mới:chart', 'b>p, p>k, z>k, k>n, n~b:bước tiếp',
  ['Niềm tin hiện tại về vị trí.', 'Dự đoán theo chuyển động (bất định tăng).', 'Cảm biến đo được.', 'Kết hợp theo độ tin cậy.', 'Niềm tin mới chắc chắn hơn.']);
FL('evo', 'p:Quần thể:graph | f:Fitness:prob | s:Chọn lọc:op | c:Lai ghép:op | m:Đột biến:noise | n:Thế hệ mới:graph', 'p>f, f>s, s>c, c>m, m>n, n~p',
  ['Nhiều lời giải ngẫu nhiên.', 'Chấm điểm.', 'Cá thể tốt được chọn nhiều.', 'Lai ghép.', 'Đột biến nhỏ.', 'Thế hệ mới tốt hơn; lặp lại.']);
FL('cap8', 'm:Bản đồ kho:graph | a:A*:tree:đường đi | k:Kalman:chart:vị trí | b:Bayes:prob:đúng mã? | x:Lấy hàng:star', 'm>a, a>k, k>b, b>x',
  ['Bản đồ kho.', 'Tìm đường.', 'Định vị khi cảm biến nhiễu.', 'Quyết định dưới bất định.', 'Hành động.']);

FL('xai', 'i:Ảnh:img | c:CNN:conv | s:Điểm lớp:prob | g:Gradient:op:ngược về feature map | h:Grad-CAM:eye:vùng quan trọng', 'i>c, c>s, s>g, g>h, h~i:chồng lên ảnh',
  ['Ảnh đầu vào.', 'Mạng trích đặc trưng.', 'Điểm của lớp dự đoán.', 'Gradient cho biết kênh nào quan trọng.', 'Bản đồ nhiệt chỉ vùng mô hình nhìn vào.']);
FL('deploy', 'm:Mô hình FP32:nn | q:Lượng tử INT8:mat | o:ONNX, TensorRT:gear | e:Máy AOI:img | w:Giám sát:chart:trôi dữ liệu', 'm>q, q>o, o>e, e>w, w~m:huấn luyện lại',
  ['Mô hình sau huấn luyện.', 'Nén xuống INT8.', 'Tối ưu cho phần cứng.', 'Chạy trên dây chuyền.', 'Theo dõi dữ liệu thay đổi và huấn luyện lại khi cần.']);
FL('ethics', 'd:Dữ liệu:db | m:Mô hình:nn | g:Chỉ số theo nhóm:chart | a:Kiểm tra:eye:công bằng, rủi ro | h:Con người duyệt:star', 'd>m, m>g, g>a, a>h, a~d:bổ sung dữ liệu',
  ['Dữ liệu có thể lệch.', 'Mô hình học theo.', 'Đo riêng từng nhóm.', 'Phát hiện chênh lệch, rủi ro.', 'Quyết định quan trọng có người duyệt.']);
FL('speech', 'w:Sóng âm:chart | f:STFT:op:cửa sổ 25 ms | m:Log-mel:mat:ảnh của âm thanh | e:Encoder:nn | d:Decoder:nn | t:Văn bản:txt', 'w>f, f>m, m>e, e>d, d>t',
  ['Sóng âm từ micro.', 'Fourier từng khúc ngắn.', 'Spectrogram thang mel.', 'Encoder Transformer.', 'Decoder sinh chữ.', 'Văn bản.']);
FL('vision3d', 'c:Ảnh nhiều góc:img | r:Tia sáng:op:mỗi pixel | n:MLP NeRF:nn:σ, màu | v:Trộn dọc tia:op:T·α·c | i:Ảnh góc mới:img', 'c>r, r>n, n>v, v>i, i~c:so sánh khi học',
  ['Vài chục ảnh từ nhiều góc.', 'Mỗi pixel là một tia sáng.', 'Mạng cho mật độ và màu tại mỗi điểm.', 'Trộn màu dọc tia.', 'Kết xuất góc nhìn chưa từng chụp.']);
FL('cap9', 'm:Mô hình v2:nn | q:INT8:mat | x:Giải thích:eye | f:Công bằng:chart | d:Triển khai:star', 'm>q, q>x, x>f, f>d',
  ['Mô hình đã sửa lỗi husky.', 'Nén và kiểm tra kết quả không đổi.', 'Giải thích được cho kỹ sư.', 'Kiểm tra từng dây chuyền.', 'Triển khai có giám sát.']);
