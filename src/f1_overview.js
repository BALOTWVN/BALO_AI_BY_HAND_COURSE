/* ===== Tổng quan & đánh giá ===== */
L({ id: 'aitypes', p: 'p0', t: 'Các thể loại AI: bốn cách phân loại', en: 'Types of AI', min: 60, pre: [],
  goals: ['Phân loại một hệ AI theo năng lực, chức năng, phương pháp và đầu ra', 'Biết 5 trường phái học máy và đại diện của mỗi trường phái', 'Nhìn AI như một “tác tử” hành động trong môi trường'],
  intuit: R`<p>Hỏi “AI là loại gì” giống hỏi “xe là loại gì”: có thể chia theo <b>công suất</b> (xe máy, ô tô, xe tải), theo <b>nhiên liệu</b> (xăng, điện, hybrid), theo <b>công dụng</b> (chở người, chở hàng). Các cách chia không loại trừ nhau. Một chiếc VinFast VF3 vừa là ô tô nhỏ, vừa chạy điện, vừa chở người.</p>
<p>AI cũng vậy. ChatGPT là <b>AI hẹp</b> (theo năng lực), thuộc trường phái <b>kết nối</b> (theo phương pháp), là mô hình <b>sinh</b> (theo đầu ra), học bằng <b>tự giám sát + tăng cường</b> (theo cách học). Biết nhiều “trục” giúp bạn đặt bất kỳ hệ thống nào lên bản đồ.</p>`,
  body: R`
<h4>Trục 1: theo năng lực</h4>
<table class="tbl"><tr><th>Loại</th><th>Ý nghĩa</th><th>Hiện trạng</th></tr>
<tr><td>AI hẹp (ANI)</td><td>Giỏi một nhóm việc cụ thể</td><td>Mọi AI hiện có, kể cả LLM mạnh nhất</td></tr>
<tr><td>AI tổng quát (AGI)</td><td>Làm được hầu hết việc trí óc con người làm, học việc mới linh hoạt</td><td>Chưa đạt; định nghĩa và mốc thời gian còn tranh luận</td></tr>
<tr><td>Siêu trí tuệ (ASI)</td><td>Vượt xa con người ở hầu hết lĩnh vực</td><td>Giả thuyết</td></tr></table>
<h4>Trục 2: theo chức năng (cách chia phổ biến trên báo chí)</h4>
<ul><li><b>Máy phản xạ:</b> phản ứng với đầu vào hiện tại, không nhớ quá khứ (Deep Blue chơi cờ).</li>
<li><b>Bộ nhớ hạn chế:</b> dùng dữ liệu quá khứ để quyết định; gần như mọi hệ học máy hiện nay.</li>
<li><b>“Theory of mind”</b> và <b>tự nhận thức:</b> các mức giả định, chưa tồn tại. Cách chia này ít dùng trong nghiên cứu.</li></ul>
<h4>Trục 3: theo phương pháp, “5 trường phái” (Pedro Domingos)</h4>
<table class="tbl"><tr><th>Trường phái</th><th>Gốc</th><th>Ý tưởng</th><th>Đại diện</th><th>Trong khóa</th></tr>
<tr><td>Biểu tượng</td><td>Logic</td><td>Tri thức = luật và ký hiệu</td><td>Cây quyết định, hệ chuyên gia, logic</td><td>Giai đoạn 1, 8</td></tr>
<tr><td>Kết nối</td><td>Thần kinh học</td><td>Học trọng số của mạng nơ-ron</td><td>MLP, CNN, Transformer</td><td>Giai đoạn 2–7</td></tr>
<tr><td>Bayes</td><td>Thống kê</td><td>Mọi thứ là xác suất, cập nhật niềm tin</td><td>Naive Bayes, mạng Bayes, HMM</td><td>Giai đoạn 1, 8</td></tr>
<tr><td>Tiến hóa</td><td>Sinh học</td><td>Chọn lọc và lai ghép lời giải</td><td>Giải thuật di truyền</td><td>Giai đoạn 8</td></tr>
<tr><td>Loại suy</td><td>Tâm lý học</td><td>Giống cái đã biết thì xử lý giống vậy</td><td>k-NN, SVM</td><td>Giai đoạn 1</td></tr></table>
<p>Ngoài 5 trường phái còn có <b>AI biểu tượng cổ điển</b> không học từ dữ liệu: tìm kiếm (A*), chơi cờ (minimax), lập kế hoạch. Xu hướng hiện nay là <b>lai</b>: LLM (kết nối) + công cụ tìm kiếm và logic (biểu tượng) + RL.</p>
<h4>Trục 4: theo đầu ra</h4>
<p><b>Phân biệt</b> (discriminative) học $p(y\mid x)$: cho ảnh, đoán nhãn. <b>Sinh</b> (generative) học $p(x)$ hoặc $p(x\mid y)$: tạo ra dữ liệu mới. Phân loại lỗi là phân biệt; sinh ảnh lỗi tổng hợp là sinh.</p>
<h4>Góc nhìn tác tử</h4>
<p>Giáo trình AI kinh điển của Russell & Norvig định nghĩa AI là xây dựng <b>tác tử hợp lý</b>: nhận thức môi trường qua cảm biến, hành động qua cơ cấu chấp hành, chọn hành động tối đa hóa kết quả kỳ vọng. Môi trường được mô tả qua các cặp: quan sát được đầy đủ hay một phần, tất định hay ngẫu nhiên, tĩnh hay động, rời rạc hay liên tục, một hay nhiều tác tử. Cờ vua: đầy đủ, tất định, rời rạc. Lái xe: một phần, ngẫu nhiên, liên tục, nhiều tác tử, khó hơn nhiều.</p>`,
  w: 'aiclass',
  worked: { t: 'Đặt ba hệ thống lên bản đồ',
    setup: R`Phân loại theo 4 trục: (a) máy AOI dùng luật “độ rộng mạch &lt; 80 µm thì báo lỗi”; (b) mô hình PatchCore phát hiện bất thường; (c) Stable Diffusion sinh ảnh lỗi tổng hợp.`,
    steps: [
      R`<b>(a) Năng lực:</b> AI hẹp (thậm chí chỉ là luật). <b>Chức năng:</b> phản xạ (không nhớ, không học). <b>Phương pháp:</b> biểu tượng, luật do kỹ sư viết. <b>Đầu ra:</b> phân biệt (OK/NG).`,
      R`<b>(b) Năng lực:</b> AI hẹp. <b>Chức năng:</b> bộ nhớ hạn chế (lưu ngân hàng đặc trưng ảnh tốt). <b>Phương pháp:</b> lai: đặc trưng từ CNN (kết nối) + so láng giềng gần nhất (loại suy). <b>Đầu ra:</b> phân biệt (điểm bất thường).`,
      R`<b>(c) Năng lực:</b> AI hẹp. <b>Chức năng:</b> bộ nhớ hạn chế. <b>Phương pháp:</b> kết nối (U-Net/Transformer + diffusion). <b>Đầu ra:</b> sinh.`,
      R`<b>Nhận xét:</b> cả ba đều là AI hẹp; khác biệt thực sự nằm ở trục phương pháp và đầu ra. Đó là hai trục hữu ích nhất khi đọc paper.`,
    ],
    ans: R`(a) biểu tượng, phân biệt; (b) lai kết nối + loại suy, phân biệt; (c) kết nối, sinh. Cả ba là AI hẹp.` },
  ex: [
    { q: R`Google Maps tìm đường ngắn nhất từ Biên Hòa đến Vũng Tàu thuộc trường phái nào? Có “học” không?`, s: [R`Lõi là bài toán tìm đường trên đồ thị đường bộ.`, R`Thuật toán A*/Dijkstra là tìm kiếm biểu tượng, không học từ dữ liệu.`, R`Phần dự đoán tắc đường dùng học máy trên dữ liệu lịch sử.`], a: R`Lai: tìm kiếm biểu tượng (A*) + học máy dự đoán thời gian di chuyển.` },
    { q: R`Mô tả môi trường của robot gắp linh kiện trên băng chuyền theo các cặp tính chất.`, s: [R`Quan sát: một phần (camera bị che khuất).`, R`Ngẫu nhiên (vị trí linh kiện thay đổi, ma sát).`, R`Động (băng chuyền chạy), liên tục (tọa độ, lực).`, R`Có thể nhiều tác tử nếu có công nhân hoặc robot khác.`], a: R`Một phần, ngẫu nhiên, động, liên tục, có thể nhiều tác tử: một môi trường khó.` },
  ],
  miss: [[R`AI = học sâu.`, R`Học sâu chỉ là một trường phái. Nhiều hệ AI quan trọng dùng tìm kiếm, logic, xác suất hay cây quyết định.`], [R`LLM mạnh nhất hiện nay đã là AGI.`, R`Theo phân loại thông dụng, mọi hệ hiện có vẫn là AI hẹp; việc khi nào đạt AGI còn tranh luận.`]],
  recap: [R`Bốn trục: năng lực, chức năng, phương pháp, đầu ra.`, R`5 trường phái: biểu tượng, kết nối, Bayes, tiến hóa, loại suy.`, R`AI = tác tử hợp lý trong môi trường.`],
  papers: ['Russell & Norvig — Artificial Intelligence: A Modern Approach (4th ed.), chương 1–2', 'Domingos (2015) — The Master Algorithm'] });

L({ id: 'evaluation', p: 'pml', t: 'Đánh giá mô hình: precision, recall, ROC', en: 'Model Evaluation', min: 90, pre: ['mlbasics'],
  goals: ['Lập ma trận nhầm lẫn và tính precision, recall, F1', 'Đọc đường ROC, PR và chọn ngưỡng', 'Dùng kiểm định chéo k-fold đúng cách'],
  intuit: R`<p>Một máy AOI báo “OK” cho <b>mọi</b> bo mạch đạt độ chính xác 98% nếu chỉ 2% bo bị lỗi. Nghe rất tốt, nhưng máy này vô dụng: nó không bắt được lỗi nào. Đó là <b>nghịch lý độ chính xác</b> khi dữ liệu mất cân bằng.</p>
<p>Hãy nghĩ như <b>lưới đánh cá</b>: <b>recall</b> là bắt được bao nhiêu phần trăm số cá trong hồ; <b>precision</b> là trong mẻ lưới có bao nhiêu phần trăm là cá thật (không phải rác). Lưới mắt nhỏ bắt nhiều cá hơn nhưng vớt thêm nhiều rác; mắt to thì sạch hơn nhưng sót cá. <b>Ngưỡng</b> quyết định cỡ mắt lưới.</p>`,
  body: R`
<h4>Ma trận nhầm lẫn</h4>
<table class="tbl"><tr><th></th><th>Dự đoán NG (lỗi)</th><th>Dự đoán OK</th></tr>
<tr><th>Thật NG</th><td>TP (bắt đúng)</td><td>FN (lọt lỗi)</td></tr>
<tr><th>Thật OK</th><td>FP (báo động giả)</td><td>TN (bỏ qua đúng)</td></tr></table>
$$\text{Precision} = \frac{TP}{TP+FP},\quad \text{Recall} = \frac{TP}{TP+FN},\quad F_1 = \frac{2PR}{P+R}$$
$$\text{Accuracy} = \frac{TP+TN}{\text{tổng}},\qquad \text{FPR} = \frac{FP}{FP+TN}$$
<h4>Ngưỡng và đường cong</h4>
<p>Mô hình cho <b>điểm</b> (xác suất lỗi). Chọn ngưỡng $\tau$: điểm $\ge\tau$ thì gọi NG. Quét $\tau$ từ cao xuống thấp:</p>
<ul><li><b>ROC:</b> trục ngang FPR, trục dọc recall (TPR). AUC = diện tích dưới đường = xác suất một mẫu lỗi ngẫu nhiên có điểm cao hơn một mẫu tốt ngẫu nhiên. 0.5 là đoán bừa, 1 là hoàn hảo.</li>
<li><b>PR:</b> trục ngang recall, dọc precision. Nhạy hơn ROC khi lớp dương rất hiếm.</li></ul>
<h4>Kiểm định chéo k-fold</h4>
<p>Chia dữ liệu thành $k$ phần; lần lượt dùng 1 phần làm validation, $k-1$ phần còn lại để train; lấy trung bình $k$ kết quả. Dùng <b>stratified</b> k-fold để mỗi phần có tỷ lệ lỗi giống nhau. Với ảnh từ cùng một tấm panel, phải chia theo <b>nhóm</b> (group k-fold) để ảnh “anh em” không nằm ở cả train và validation (rò rỉ dữ liệu).</p>
<h4>Hồi quy</h4>
<p>MAE (sai số tuyệt đối trung bình, cùng đơn vị dữ liệu), RMSE (phạt sai số lớn), $R^2 = 1 - \frac{\sum(y-\hat y)^2}{\sum(y-\bar y)^2}$ (tỷ lệ phương sai giải thích được).</p>`,
  w: 'roc',
  worked: { t: 'Đánh giá máy AOI trên 1000 bo mạch',
    setup: R`1000 bo, 20 bo lỗi thật. Mô hình gọi NG 50 bo, trong đó 18 bo lỗi thật.`,
    steps: [
      R`<b>Điền ma trận:</b> TP = 18 (bắt đúng). FN = 20 − 18 = 2 (lọt). FP = 50 − 18 = 32 (báo động giả). TN = 1000 − 18 − 2 − 32 = 948.`,
      R`<b>Accuracy</b> $= (18 + 948)/1000 = 96.6\%$. Thấp hơn cả máy “luôn báo OK” (98%)! Nhưng máy này hữu ích hơn nhiều.`,
      R`<b>Recall</b> $= 18/20 = 90\%$: lọt 10% số bo lỗi.`,
      R`<b>Precision</b> $= 18/50 = 36\%$: cứ 100 bo bị gọi NG, 64 bo thật ra tốt (phải kiểm lại bằng mắt).`,
      R`<b>F1</b> $= 2\cdot0.36\cdot0.9/(0.36+0.9) = 0.648/1.26 = 0.514$.`,
      R`<b>FPR</b> $= 32/(32+948) = 3.3\%$.`,
      R`<b>Quyết định:</b> nếu yêu cầu không được lọt lỗi, recall 90% chưa đủ: hạ ngưỡng để tăng recall, chấp nhận FP tăng. Chi phí kiểm lại 1 bo tốt thường rẻ hơn nhiều so với 1 bo lỗi tới tay khách.`,
    ],
    ans: R`Recall 90%, precision 36%, F1 0.514, accuracy 96.6%, FPR 3.3%.` },
  ex: [
    { q: R`Bốn ảnh lỗi có điểm $[0.9, 0.8, 0.4, 0.3]$; bốn ảnh tốt có điểm $[0.7, 0.35, 0.2, 0.1]$. Tính AUC bằng cách đếm cặp.`, s: [R`AUC = tỷ lệ cặp (lỗi, tốt) mà điểm lỗi > điểm tốt. Có $4\times4=16$ cặp.`, R`Lỗi 0.9: thắng cả 4. Lỗi 0.8: thắng cả 4.`, R`Lỗi 0.4: thắng 0.35, 0.2, 0.1 → 3. Lỗi 0.3: thắng 0.2, 0.1 → 2.`, R`Tổng $4+4+3+2 = 13$.`], a: R`AUC $=13/16 = 0.8125$.` },
    { q: R`Với các điểm ở câu trên, ngưỡng 0.5 cho precision và recall bao nhiêu?`, s: [R`Gọi NG các điểm ≥ 0.5: lỗi 0.9, 0.8 và tốt 0.7.`, R`TP = 2, FP = 1, FN = 2.`, R`P = 2/3, R = 2/4.`], a: R`Precision 0.667, recall 0.5.` },
  ],
  miss: [[R`Accuracy cao là mô hình tốt.`, R`Với dữ liệu mất cân bằng, accuracy gần như vô nghĩa. Nhìn recall, precision, PR-AUC.`], [R`Chọn ngưỡng 0.5 là mặc định đúng.`, R`Ngưỡng là quyết định nghiệp vụ, chọn trên tập validation theo chi phí lọt lỗi và chi phí báo động giả.`]],
  recap: [R`Precision = đúng trong số bị gọi; recall = bắt được trong số thật sự.`, R`ROC-AUC: xác suất xếp hạng đúng một cặp lỗi–tốt.`, R`Kiểm định chéo theo nhóm để tránh rò rỉ.`],
  papers: ['Saito & Rehmsmeier (2015) — The Precision-Recall Plot Is More Informative than the ROC Plot on Imbalanced Datasets'] });
