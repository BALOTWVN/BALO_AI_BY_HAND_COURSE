/* ===== Bài YOLO + 10 bài tập tổng hợp cuối chương ===== */
L({ id: 'yolo', p: 'p2', t: 'YOLO: phát hiện đối tượng chỉ trong một lần nhìn', en: 'You Only Look Once', min: 120, pre: ['detseg', 'loss'], ill: 'yolo',
  goals: ['Hiểu cách YOLO chia lưới và mỗi ô dự đoán hộp', 'Giải mã tay một dự đoán thành tọa độ hộp và điểm tin cậy', 'Chạy NMS và đánh giá bằng IoU, precision, recall'],
  intuit: R`<p>Thử tưởng tượng một tờ giấy kẻ ô úp lên bức ảnh. Mỗi ô có một “người gác”. Người gác chỉ phải trả lời cho những vật có <b>tâm</b> rơi vào ô của mình: “có vật không, vật gì, hộp bao quanh nó rộng bao nhiêu?”. Tất cả người gác trả lời <b>cùng lúc</b>, chỉ cần nhìn ảnh một lần. Đó là ý tưởng của YOLO, và là lý do nó đủ nhanh để chạy theo thời gian thực trên dây chuyền.</p>
<p>Vì nhiều người gác cạnh nhau có thể cùng “thấy” một con mèo, ta nhận về nhiều hộp chồng nhau. Bước <b>NMS</b> giữ lại hộp tự tin nhất và xóa những hộp trùng với nó.</p>`,
  body: R`
<h4>Đầu ra của YOLO</h4>
<p>Ảnh được chia lưới $S\times S$. Mỗi ô dự đoán $B$ hộp; mỗi hộp gồm 4 tọa độ, 1 điểm “có vật” (objectness), cộng xác suất $C$ lớp:</p>
$$\text{Đầu ra} = S\times S\times\big(B\cdot(4+1)+C\big)\quad\text{(YOLOv1: } 7\times7\times30\text{ với } B=2, C=20\text{)}$$
<h4>Giải mã một hộp (kiểu YOLOv2/v3 có anchor)</h4>
$$b_x = \big(\sigma(t_x) + c_x\big)\cdot s,\quad b_y = \big(\sigma(t_y) + c_y\big)\cdot s,\quad b_w = p_w e^{t_w},\quad b_h = p_h e^{t_h}$$
<p>$(c_x, c_y)$: chỉ số ô; $s$: bước lưới (số pixel mỗi ô); $(p_w, p_h)$: kích thước anchor. Sigmoid giữ tâm nằm trong ô; hàm mũ cho phép hộp to hay nhỏ hơn anchor. Điểm cuối = $\sigma(t_o)\times p(\text{lớp})$.</p>
<h4>Hàm mất mát</h4>
<p>Tổng của ba phần: <b>hộp</b> (sai lệch tọa độ, ngày nay thường dùng loss dựa trên IoU như CIoU), <b>objectness</b> (BCE: ô này có vật không), <b>lớp</b> (BCE hoặc cross-entropy). Chỉ ô chịu trách nhiệm cho vật mới bị phạt phần hộp và lớp.</p>
<h4>Sau mạng: lọc và NMS</h4>
<ol><li>Bỏ hộp có điểm dưới ngưỡng (ví dụ 0.25).</li><li>Với từng lớp: sắp hộp theo điểm, giữ hộp cao nhất, xóa hộp có IoU với nó vượt ngưỡng (ví dụ 0.45), lặp lại.</li></ol>
<h4>Các đời YOLO</h4>
<table class="tbl"><tr><th>Đời</th><th>Điểm chính</th></tr>
<tr><td>YOLOv1 (2016)</td><td>Lưới 7×7, một mạng duy nhất, rất nhanh nhưng kém với vật nhỏ.</td></tr>
<tr><td>YOLOv2, v3</td><td>Anchor box, BatchNorm, dự đoán ở 3 tỷ lệ (giống FPN) để bắt vật nhỏ.</td></tr>
<tr><td>YOLOv4, v5</td><td>Nhiều mẹo huấn luyện: tăng cường Mosaic, backbone CSP, tối ưu cho triển khai.</td></tr>
<tr><td>YOLOv8 trở đi</td><td>Không cần anchor (anchor-free), đầu dự đoán tách riêng phần hộp và phần lớp, có thêm nhánh phân đoạn, keypoint.</td></tr></table>
<p>Đánh giá bằng <b>mAP@0.5</b> (hộp đúng khi IoU ≥ 0.5) và <b>mAP@0.5:0.95</b> (trung bình nhiều ngưỡng IoU, khắt khe hơn về vị trí).</p>`,
  worked: { t: 'Giải mã một dự đoán của YOLO thành hộp và điểm',
    setup: R`Ảnh 416×416, bước lưới $s = 32$ (lưới 13×13). Ô $(c_x, c_y) = (6, 4)$, anchor $(p_w, p_h) = (116, 90)$ pixel. Mạng xuất $t_x = 0.4$, $t_y = -0.2$, $t_w = 0.2$, $t_h = -0.1$, $t_o = 2.0$ và logit lớp [mèo 2.5, chó 0.5, bo mạch −1].`,
    steps: [
      R`<b>Tâm theo x:</b> $\sigma(0.4) = 1/(1+e^{-0.4}) = 0.599$. $b_x = (0.599 + 6)\cdot32 = 211.2$ pixel.`,
      R`<b>Tâm theo y:</b> $\sigma(-0.2) = 0.450$. $b_y = (0.450 + 4)\cdot32 = 142.4$ pixel.`,
      R`<b>Kích thước:</b> $b_w = 116\cdot e^{0.2} = 116\cdot1.221 = 141.7$; $b_h = 90\cdot e^{-0.1} = 90\cdot0.905 = 81.4$.`,
      R`<b>Góc hộp:</b> $x_1 = 211.2 - 141.7/2 = 140.4$, $x_2 = 282.1$; $y_1 = 142.4 - 81.4/2 = 101.7$, $y_2 = 183.1$.`,
      R`<b>Objectness:</b> $\sigma(2.0) = 0.881$.`,
      R`<b>Xác suất lớp:</b> $e^{2.5} = 12.18$, $e^{0.5} = 1.65$, $e^{-1} = 0.37$, tổng $14.20$ → mèo $0.858$, chó $0.116$, bo mạch $0.026$.`,
      R`<b>Điểm cuối:</b> $0.881\cdot0.858 = 0.756 > 0.25$ → giữ lại hộp “mèo 76%”.`,
    ],
    ans: R`Hộp mèo tại $(140, 102)$–$(282, 183)$, điểm 0.756.` },
  ex: [
    { q: R`YOLOv1 với lưới 7×7, B = 2, C = 20. Đầu ra có bao nhiêu số? Bao nhiêu hộp ứng viên?`, s: [R`Mỗi ô: $2\cdot5 + 20 = 30$ số.`, R`Tổng: $7\cdot7\cdot30 = 1470$ số.`, R`Hộp ứng viên: $7\cdot7\cdot2 = 98$.`], a: R`1470 số, 98 hộp ứng viên.` },
    { q: R`Hai hộp “mèo” điểm 0.9 và 0.7 có IoU 0.6. Ngưỡng NMS 0.45. Còn lại mấy hộp? Nếu hộp thứ hai là “chó”?`, s: [R`Cùng lớp, IoU 0.6 > 0.45 → xóa hộp 0.7.`, R`Khác lớp: NMS chạy riêng từng lớp, nên không xóa.`], a: R`Cùng lớp: 1 hộp; khác lớp: giữ cả 2.` },
  ],
  miss: [[R`Ô chứa nhiều pixel của vật nhất sẽ dự đoán vật đó.`, R`Ô chứa <b>tâm</b> hộp chịu trách nhiệm (hoặc vài ô quanh tâm ở các bản mới).`], [R`Ngưỡng tin cậy càng cao càng tốt.`, R`Ngưỡng cao làm giảm báo động giả nhưng tăng bỏ sót. Trên dây chuyền AOI thường đặt thấp để không lọt lỗi.`]],
  recap: [R`Lưới $S\times S$, mỗi ô dự đoán hộp + objectness + lớp.`, R`Giải mã: $\sigma$ cho tâm, $e^{t}$ nhân anchor cho kích thước.`, R`Lọc ngưỡng → NMS theo lớp → đánh giá bằng IoU, mAP.`],
  app: 'YOLO phù hợp khi cần đếm và định vị nhiều lỗi rời rạc trên tấm bo (thiếu linh kiện, lệch, cầu hàn) với tốc độ dây chuyền. Lỗi rất nhỏ cần ảnh độ phân giải cao, cắt ô (tiling) hoặc đầu dự đoán ở tỷ lệ nhỏ.',
  papers: ['Redmon et al. (2016) — You Only Look Once: Unified, Real-Time Object Detection', 'Redmon & Farhadi (2018) — YOLOv3: An Incremental Improvement', 'Bochkovskiy et al. (2020) — YOLOv4'] });

RD('yolo', { t: 'You Only Look Once: Unified, Real-Time Object Detection', a: 'J. Redmon, S. Divvala, R. Girshick, A. Farhadi', y: 2016, v: 'CVPR', ax: '1506.02640', why: 'Bài báo gốc biến phát hiện đối tượng thành một bài toán hồi quy duy nhất trên lưới, mở ra cả dòng YOLO.', start: 'Đọc hình mô tả lưới S×S và tensor đầu ra, rồi phần hàm mất mát (các hệ số λ_coord, λ_noobj).', q: ['Vì sao YOLOv1 kém với vật nhỏ đứng sát nhau?', 'Vì sao phải giảm trọng số loss của các ô không có vật (λ_noobj)?'] });

/* ---------- Bài tập tổng hợp ---------- */
const CAPI = { min: 120, en: 'Chapter Capstone' };
L({ ...CAPI, id: 'cap0', p: 'p0', t: 'Tổng hợp chương 0: một “ảnh” 4 pixel qua mô hình mèo/chó', pre: ['vector', 'matmul', 'prob', 'calculus'],
  goals: ['Ghép tích vô hướng, nhân ma trận, softmax, cross-entropy và gradient trong một bài', 'Tự cập nhật trọng số một bước và kiểm tra loss giảm'],
  intuit: R`<p>Mọi mô hình phân loại ảnh, kể cả mạng lớn nhất, đều kết thúc bằng đúng chuỗi phép tính trong bài này: nhân trọng số với đặc trưng, cộng bias, softmax ra xác suất, so với nhãn bằng cross-entropy, rồi lấy gradient để sửa trọng số. Ở đây “ảnh” chỉ có 4 con số, nên bạn tính được hết bằng tay.</p>`,
  body: R`<h4>Đề bài</h4><p>Ảnh được rút gọn thành 4 đặc trưng $\mathbf x = [0.9,\ 0.2,\ 0.8,\ 0.1]$ = [tai nhọn, tai cụp, râu, mõm to]. Mô hình tuyến tính 2 lớp (mèo, chó):</p>
$$W = \begin{bmatrix}1 & -1 & 0.5 & 0\\ -0.5 & 1 & 0 & 1\end{bmatrix},\qquad \mathbf b = [0,\ 0.2]$$
<ol><li>Tính logit cho mèo và chó (bài 0.2, 0.3).</li><li>Tính xác suất bằng softmax và loss với nhãn đúng là <b>mèo</b> (bài 0.5).</li><li>Tính gradient $\partial\mathcal L/\partial\mathbf z = \mathbf p - \mathbf y$ và $\partial\mathcal L/\partial W$ (bài 0.4).</li><li>Cập nhật $W \leftarrow W - 0.5\,\partial\mathcal L/\partial W$, $\mathbf b\leftarrow\mathbf b - 0.5(\mathbf p-\mathbf y)$, rồi tính lại xác suất. Loss có giảm không?</li></ol>`,
  worked: { t: 'Lời giải đầy đủ', setup: R`Làm lần lượt 4 câu; trang tính bên dưới hiện từng con số.`,
    steps: [R`<b>Logit:</b> mèo $= 0.9 - 0.2 + 0.4 + 0 + 0 = 1.1$; chó $= -0.45 + 0.2 + 0 + 0.1 + 0.2 = 0.05$.`,
      R`<b>Softmax:</b> $e^{1.1} = 3.004$, $e^{0.05} = 1.051$, tổng $4.055$ → $p = [0.741,\ 0.259]$.`,
      R`<b>Loss:</b> $-\ln 0.741 = 0.300$.`,
      R`<b>Gradient theo logit:</b> $\mathbf p - \mathbf y = [0.741 - 1,\ 0.259 - 0] = [-0.259,\ 0.259]$.`,
      R`<b>Gradient theo W:</b> mỗi hàng = gradient logit × $\mathbf x$: hàng mèo $= -0.259\cdot\mathbf x = [-0.233, -0.052, -0.207, -0.026]$; hàng chó là số đối.`,
      R`<b>Cập nhật:</b> hàng mèo $+0.5\cdot0.259\cdot\mathbf x$ → $[1.117, -0.974, 0.604, 0.013]$; hàng chó → $[-0.617, 0.974, -0.104, 0.987]$; $\mathbf b = [0.130,\ 0.071]$.`,
      R`<b>Kiểm tra:</b> logit mới mèo $\approx 1.42$, chó $\approx -0.27$ → $p_{\text{mèo}} \approx 0.84$, loss $\approx 0.17$. Loss giảm từ 0.30 còn khoảng 0.17.`],
    ans: R`Trước: $p_{\text{mèo}} = 0.741$, loss 0.300. Sau một bước: $p_{\text{mèo}}\approx0.84$, loss $\approx0.17$.` },
  ex: [{ q: R`Nếu nhãn đúng là <b>chó</b>, gradient theo logit là gì và hàng nào của W tăng?`, s: [R`$\mathbf y = [0, 1]$ → $\mathbf p - \mathbf y = [0.741, -0.741]$.`, R`Đi ngược gradient: hàng mèo giảm theo hướng $\mathbf x$, hàng chó tăng theo hướng $\mathbf x$.`], a: R`$[0.741, -0.741]$; hàng chó tăng, hàng mèo giảm.` }],
  recap: [R`Logit = $W\mathbf x + \mathbf b$ → softmax → $-\ln p_y$.`, R`Gradient: $(\mathbf p - \mathbf y)\mathbf x^\top$.`, R`Một bước đi ngược gradient làm loss giảm.`] });

L({ ...CAPI, id: 'cap1', p: 'pml', t: 'Tổng hợp chương 1: chọn mô hình cho dây chuyền AOI', pre: ['knn', 'tree', 'evaluation'],
  goals: ['Dùng k-NN phân loại một bo mới', 'So sánh hai mô hình bằng ma trận nhầm lẫn, precision, recall', 'Ra quyết định chọn mô hình theo yêu cầu nghiệp vụ'],
  intuit: R`<p>Kỹ sư chất lượng cần một mô hình báo lỗi bo mạch. Có hai ứng viên: k-NN và cây quyết định. Mô hình nào “chính xác hơn” chưa chắc là mô hình tốt hơn: nhà máy yêu cầu <b>không được lọt lỗi</b>. Bài này đi đủ một vòng: dự đoán, đánh giá, và chọn.</p>`,
  body: R`<h4>Đề bài</h4><p>Dữ liệu đã chuẩn hóa: (độ rộng mạch, độ sáng). Tập huấn luyện 6 bo: A(1,1) OK, B(2,1) OK, C(1,2) OK, D(4,4) NG, E(5,3) NG, F(4,5) NG.</p>
<ol><li>Phân loại bo mới $q = (3, 3)$ bằng k-NN với $k = 3$.</li>
<li>Trên 8 bo kiểm tra (nhãn thật: 1 = lỗi), k-NN dự đoán và cây dự đoán như trong trang tính. Tính TP, FP, FN, precision, recall cho từng mô hình.</li>
<li>Nhà máy yêu cầu recall ≥ 0.9. Chọn mô hình nào? Nếu cả hai không đạt thì nên làm gì?</li></ol>`,
  worked: { t: 'Lời giải', setup: R`Các khoảng cách và chỉ số được tính trong trang tính bên dưới.`,
    steps: [R`<b>Khoảng cách tới q:</b> A $2.83$, B $2.24$, C $2.24$, D $1.41$, E $2.00$, F $2.24$.`,
      R`<b>3 láng giềng gần nhất:</b> D (NG), E (NG), và một trong B, C, F (đều 2.24). Dù chọn ai, đã có 2 phiếu NG → <b>NG</b>.`,
      R`<b>k-NN trên 8 bo kiểm tra:</b> TP = 3, FP = 1, FN = 1 → precision $3/4 = 0.75$, recall $3/4 = 0.75$.`,
      R`<b>Cây quyết định:</b> TP = 4, FP = 2, FN = 0 → precision $4/6 = 0.67$, recall $4/4 = 1.0$.`,
      R`<b>Quyết định:</b> yêu cầu recall ≥ 0.9 → chọn <b>cây quyết định</b>, chấp nhận thêm báo động giả (kiểm lại bằng mắt). k-NN “cân bằng” hơn nhưng lọt 1 lỗi trong 4.`],
    ans: R`q là NG. Chọn cây quyết định (recall 1.0, precision 0.67).` },
  ex: [{ q: R`Nếu muốn k-NN đạt recall cao hơn mà không đổi mô hình, có thể làm gì?`, s: [R`Thay vì bỏ phiếu đa số, gọi NG khi có ít nhất 1 trong 3 láng giềng là NG (hạ ngưỡng).`, R`Hoặc cho phiếu NG trọng số lớn hơn.`], a: R`Hạ ngưỡng quyết định: recall tăng, precision giảm.` }],
  recap: [R`Dự đoán → ma trận nhầm lẫn → precision, recall.`, R`Chọn mô hình theo chi phí sai lầm thật, không chỉ accuracy.`] });

L({ ...CAPI, id: 'cap2', p: 'p1', t: 'Tổng hợp chương 2: huấn luyện một mạng nhỏ nhận diện mèo', pre: ['mlp', 'backprop', 'optim'],
  goals: ['Chạy forward qua mạng 2 lớp với đặc trưng thật của ảnh mèo', 'Lan truyền ngược và cập nhật trọng số', 'Kiểm tra loss giảm sau một bước'],
  intuit: R`<p>Ở chương CNN, ảnh mèo sẽ được biến thành 4 đặc trưng [tai nhọn, tai cụp, mõm sáng, râu] = [0.95, 0.40, 0.38, 0.43]. Bài này lấy đúng 4 con số đó làm đầu vào cho một mạng 2 lớp và huấn luyện nó một bước: đây là cách “phần đầu” của mọi mạng phân loại học.</p>`,
  body: R`<h4>Đề bài</h4><p>Đầu vào $\mathbf x = [0.95, 0.40, 0.38, 0.43]$, nhãn $y = 1$ (mèo). Lớp ẩn 2 nơ-ron ReLU với $W_1$ và $\mathbf b_1$ như trong trang tính, lớp ra 1 nơ-ron sigmoid ($W_2$, $b_2$). Loss BCE: $\mathcal L = -\ln \hat y$.</p>
<ol><li>Tính forward: $\mathbf h$, $z_2$, $\hat y$, $\mathcal L$.</li><li>Tính $\partial\mathcal L/\partial z_2 = \hat y - y$, rồi gradient cho $W_2$, $\mathbf h$, $W_1$.</li><li>Cập nhật với $\eta = 0.5$ và tính lại $\hat y$.</li></ol>`,
  worked: { t: 'Lời giải', setup: R`Trang tính bên dưới hiện từng số theo đúng thứ tự forward → backward → cập nhật.`,
    steps: [R`<b>Forward lớp ẩn:</b> $\mathbf h = \text{ReLU}(W_1\mathbf x + \mathbf b_1)$.`, R`<b>Forward lớp ra:</b> $z_2 = W_2\mathbf h + b_2$, $\hat y = \sigma(z_2)$, loss $= -\ln\hat y$.`, R`<b>Backward lớp ra:</b> $\delta_2 = \hat y - 1$ (âm, vì ta muốn $\hat y$ tăng). $\partial\mathcal L/\partial W_2 = \delta_2\mathbf h^\top$.`, R`<b>Về lớp ẩn:</b> $\partial\mathcal L/\partial\mathbf h = W_2^\top\delta_2$, nhân mặt nạ ReLU (nơ-ron nào đang tắt thì gradient bằng 0).`, R`<b>Gradient W₁:</b> $\boldsymbol\delta_1\mathbf x^\top$.`, R`<b>Cập nhật và kiểm tra:</b> sau một bước, $\hat y$ tăng và loss giảm (xem các ô cuối trang tính).`],
    ans: R`Loss giảm sau một bước cập nhật; trang tính cho các con số chính xác.` },
  recap: [R`Forward lưu $\mathbf h$, $z$; backward dùng lại chúng.`, R`ReLU tắt thì gradient không qua.`, R`Một bước gradient descent làm $\hat y$ tiến về nhãn.`] });

L({ ...CAPI, id: 'cap3', p: 'p2', t: 'Tổng hợp chương 3: CNN nhìn ảnh mèo, chó và chỉ ra chỗ sai', pre: ['conv', 'resnet', 'yolo', 'xai'], ill: 'cnncat',
  goals: ['Theo dõi một ảnh qua tích chập, bộ dò bộ phận, tính điểm và softmax', 'Giải thích dự đoán bằng đóng góp của từng vùng', 'Tìm nguyên nhân dự đoán sai và cách sửa'],
  intuit: R`<p>Một mô hình được huấn luyện với ảnh mèo và chó thường. Rồi một ngày nó gặp chó <b>husky</b>: tai nhọn như mèo nhưng mõm to như chó. Mô hình đoán “mèo”. Bài này lần theo từng tầng của mạng để thấy chính xác <b>nó đã nhìn vào đâu</b> và vì sao sai. Cách làm này giống hệt khi phân tích một ảnh bo mạch bị mô hình AOI đoán nhầm.</p>`,
  body: R`<h4>Đề bài</h4><ol><li>Chọn ảnh “Mèo” trong hình minh họa, bấm “Chạy từng tầng”. Mô tả mỗi bản đồ đặc trưng sáng ở đâu.</li>
<li>Tính tay một ô của bản đồ “chéo” ở góc tai husky (trang tính bên dưới).</li>
<li>Chọn ảnh husky với mô hình v1. Viết ra điểm từng bộ phận, logit, xác suất. Mô hình đúng hay sai?</li>
<li>Dùng bảng đóng góp để chỉ ra bộ phận nào gây sai.</li>
<li>Chuyển sang mô hình v2. Giải thích vì sao v2 sửa được, và nêu cách tương tự cho mô hình AOI.</li></ol>`,
  worked: { t: 'Lời giải cho ảnh husky', setup: R`Độ sáng pixel: nền $0.939$, viền đen $0.206$, trắng $0.971$.`,
    steps: [R`<b>Một ô tích chập ở tai trái</b> (vùng 3×3 góc trên): bộ lọc ╱ cho $|0.733|/3 = 0.244$, bộ lọc ╲ cho $|1.466|/3 = 0.489$. Tổng cạnh chéo $0.733$: rất mạnh, vì viền tai tạo đường chéo.`,
      R`<b>Bộ dò bộ phận:</b> tai nhọn $0.95$, tai cụp $0.38$, mõm sáng $0.88$, râu $0.06$.`,
      R`<b>Logit v1:</b> mèo $= 4(0.954) - 2(0.382) - 1(0.875) + 3(0.061) - 0.8 = 1.56$; chó $= -0.954 + 4(0.382) + 0.5(0.875) - 2(0.061) = 0.89$.`,
      R`<b>Softmax:</b> $P(\text{mèo}) = 1/(1 + e^{-(1.56-0.89)}) = 0.66$ → đoán <b>mèo</b>, nhãn là chó → <b>SAI</b>.`,
      R`<b>Chỗ sai:</b> đóng góp lớn nhất cho “mèo” là tai nhọn ($+3.82$). Mõm to là bằng chứng mạnh cho chó, nhưng v1 chỉ cho nó trọng số $0.5$ vì khi huấn luyện, chó nào cũng có tai cụp nên mô hình không cần nhìn mõm.`,
      R`<b>Sửa (v2):</b> thêm ảnh husky vào huấn luyện → trọng số mõm cho chó tăng lên 4, cho mèo giảm xuống −4. Logit: mèo $-0.94$, chó $3.83$ → $P(\text{chó}) = 0.99$, <b>ĐÚNG</b>.`,
      R`<b>Bài học cho AOI:</b> nếu mô hình chỉ thấy một kiểu lỗi trong một bối cảnh, nó có thể học “đường tắt”. Dùng bản đồ giải thích để phát hiện, rồi bổ sung dữ liệu (hoặc dữ liệu tổng hợp) phá vỡ đường tắt đó.`],
    ans: R`v1: husky → mèo 66% (sai, do tai nhọn). v2: chó 99% (đúng, nhờ mõm).` },
  ex: [{ q: R`Trong chế độ “Ảnh tự vẽ”, hãy vẽ thêm râu cho ảnh mèo đang có rồi xóa tai. Dự đoán thay đổi thế nào? Giải thích bằng bảng đóng góp.`, s: [R`Xóa tai: điểm tai nhọn giảm mạnh → logit mèo giảm $4\times$ phần giảm đó.`, R`Râu vẫn đẩy về mèo với trọng số 3.`, R`Quan sát xác suất và vùng đỏ/xanh ở bước 5.`], a: R`Tự quan sát; mục tiêu là đọc được đóng góp của từng bộ phận.` }],
  recap: [R`Tích chập → bộ phận → điểm → softmax.`, R`Đóng góp = trọng số × điểm bộ phận cho biết “nhìn vào đâu”.`, R`Sai do đường tắt trong dữ liệu; sửa bằng dữ liệu đa dạng hơn.`] });

L({ ...CAPI, id: 'cap4', p: 'p3', t: 'Tổng hợp chương 4: chuỗi thời gian và câu chữ', pre: ['rnn', 'lstm', 'embed'], ill: ['tseries', 'nlpattn'],
  goals: ['Phát hiện bất thường trên tín hiệu rung bằng cửa sổ trượt', 'Dự báo bằng một bộ nhớ hồi quy kiểu RNN', 'Thấy văn bản cũng là chuỗi: token, embedding, ngữ cảnh'],
  intuit: R`<p>Cảm biến rung trên trục máy CNC gửi về một số mỗi giây. Một ngày, ổ bi bắt đầu mòn và biên độ rung nhảy vọt. Ta muốn máy tự phát hiện điều đó. Chuỗi thời gian và câu văn có chung một bản chất: <b>thứ tự quan trọng</b>, và hiểu điểm hiện tại cần nhớ những gì đã qua.</p>`,
  body: R`<h4>Đề bài</h4><p>8 số đo rung (mm/s): $[2.0, 2.3, 2.6, 2.3, 2.0, 1.7, 2.0, 3.9]$.</p>
<ol><li>Với cửa sổ 6 điểm trước đó, tính trung bình, độ lệch chuẩn và điểm z của số đo thứ 7 và thứ 8. Điểm nào bất thường (ngưỡng |z| > 3)?</li>
<li>Dự báo bằng bộ nhớ hồi quy $h_t = 0.6\,h_{t-1} + 0.4\,x_t$ (giống một RNN tuyến tính 1 chiều, $h_0 = 2$). Dự báo bước sau là $h_t$. Tính sai số dự báo ở bước 8.</li>
<li>Dùng hình minh họa thứ hai: câu “Con mèo ngồi trên bàn vì nó mệt”. Từ “nó” chú ý vào từ nào? Vì sao RNN thuần khó làm việc này với câu dài?</li></ol>`,
  worked: { t: 'Lời giải', setup: R`Trang tính bên dưới tính cửa sổ trượt và bộ nhớ hồi quy.`,
    steps: [R`<b>Bước 7:</b> cửa sổ $[2.0, 2.3, 2.6, 2.3, 2.0, 1.7]$, trung bình $2.15$, độ lệch chuẩn $\approx 0.29$. $z = (2.0 - 2.15)/0.29 \approx -0.52$: bình thường.`,
      R`<b>Bước 8:</b> cửa sổ $[2.3, 2.6, 2.3, 2.0, 1.7, 2.0]$, trung bình $2.15$, độ lệch chuẩn $\approx 0.29$. $z = (3.9 - 2.15)/0.29 \approx 6.1 > 3$: <b>bất thường</b>.`,
      R`<b>Bộ nhớ hồi quy:</b> $h$ cập nhật mỗi bước; dự báo cho bước 8 là $h_7 \approx 1.99$. Sai số $3.9 - 1.99 \approx 1.91$: rất lớn so với các bước trước (dưới 0.5).`,
      R`<b>Câu chữ:</b> “nó” dồn phần lớn attention vào “mèo”. RNN phải chuyển thông tin “mèo” qua 5 bước trung gian; mỗi bước nhân hệ số nhỏ hơn 1 nên tín hiệu phai dần. Attention nối thẳng “nó” với “mèo” trong một bước.`],
    ans: R`Bước 8 bất thường (z ≈ 6.1); bộ nhớ hồi quy cũng báo sai số lớn (≈ 1.9).` },
  recap: [R`Cửa sổ trượt: trung bình, độ lệch, z-score.`, R`RNN: trạng thái nhớ cập nhật dần; dự báo = trạng thái.`, R`Văn bản là chuỗi token; attention nối xa trực tiếp.`] });

L({ ...CAPI, id: 'cap5', p: 'p4', t: 'Tổng hợp chương 5: ViT phân tích ảnh và tìm chỗ sai', pre: ['attention', 'vit', 'vitfam'], ill: ['vitcat', 'nlpattn'],
  goals: ['Tính attention của token [CLS] lên các mảnh ảnh', 'So sánh cách ViT và CNN nhìn cùng một ảnh', 'Truy ra lỗi do thiết kế đặc trưng'],
  intuit: R`<p>Cùng ảnh husky ở chương CNN, giờ đưa cho một ViT nhỏ. ViT không quét bộ lọc mà <b>đặt câu hỏi</b>: token [CLS] hỏi “mảnh nào giống mèo?” và “mảnh nào giống chó?”. Trọng số attention cho ta biết mô hình đang nhìn vào đâu, nên đây là công cụ tuyệt vời để tìm chỗ sai.</p>`,
  body: R`<h4>Đề bài</h4><p>Mỗi mảnh 4×4 được tóm tắt thành vector $\mathbf e = [\text{độ tối}, \text{mật độ cạnh}, \text{độ sáng mõm}]$. Đặc trưng “độ sáng mõm” chỉ đếm pixel có độ sáng từ 0.80 đến 0.93 (màu kem). Hai truy vấn: $\mathbf q_{\text{mèo}} = [0.5, 3, -2.5]$, $\mathbf q_{\text{chó}} = [3, 0.5, 2.5]$, nhiệt độ $\tau = 0.25$.</p>
<ol><li>Với 4 mảnh tiêu biểu của husky (tai trái, tai phải, trán, mõm), tính attention của từng truy vấn (trang tính).</li>
<li>Tính vector gộp và logit ($\text{logit} = 3\,\mathbf q\cdot\text{gộp}$). Mô hình nghiêng về lớp nào?</li>
<li>Mở hình minh họa ViT với ảnh husky: nó đoán gì? Vì sao đặc trưng “độ sáng mõm” bằng 0 ở mọi mảnh của husky?</li>
<li>Đề xuất hai cách sửa.</li></ol>`,
  worked: { t: 'Lời giải', setup: R`Các vector mảnh lấy từ hình minh họa ViT cho ảnh husky.`,
    steps: [R`<b>Điểm truy vấn mèo</b> = $\mathbf q_{\text{mèo}}\cdot\mathbf e / 0.25$: các mảnh tai có nhiều cạnh nên điểm cao nhất; attention dồn vào hai tai.`,
      R`<b>Điểm truy vấn chó:</b> mảnh trán và mõm tối hơn một chút nên được chú ý, nhưng thành phần “độ sáng mõm” bằng 0 nên truy vấn chó không có bằng chứng mạnh.`,
      R`<b>Kết quả trên toàn ảnh:</b> ViT đoán mèo khoảng 82%: <b>sai</b>.`,
      R`<b>Nguyên nhân:</b> mõm husky trắng tinh (độ sáng 0.97) vượt ngưỡng 0.93 nên bị coi như nền. Đây là lỗi <b>thiết kế đặc trưng / dữ liệu</b>: chó trong tập huấn luyện chỉ có mõm màu kem.`,
      R`<b>Sửa:</b> (1) mở rộng ngưỡng hoặc để mạng tự học embedding mảnh từ dữ liệu đa dạng (ViT thật học phép chiếu từ pixel); (2) thêm ảnh chó lông trắng, tăng cường đổi màu khi huấn luyện.`,
      R`<b>So với CNN:</b> CNN v1 cũng sai vì tai nhọn; v2 sửa bằng cách tin vào mõm. Hai kiến trúc khác nhau nhưng đều học theo dữ liệu được đưa vào.`],
    ans: R`ViT nhỏ đoán husky là mèo vì attention dồn vào tai và đặc trưng mõm “mù” với màu trắng.` },
  recap: [R`Attention của [CLS] = bản đồ “nhìn vào đâu”.`, R`Lỗi có thể nằm ở dữ liệu và đặc trưng, không chỉ ở kiến trúc.`, R`ViT cần nhiều dữ liệu đa dạng hoặc tiền huấn luyện.`] });

L({ ...CAPI, id: 'cap6', p: 'p5', t: 'Tổng hợp chương 6: sinh ảnh lỗi tổng hợp cho AOI', pre: ['vae', 'gan', 'diffrev', 'diffadv'], ill: 'diffcat',
  goals: ['Chọn mô hình sinh phù hợp cho bài toán thiếu ảnh lỗi', 'Tính tay quá trình thêm nhiễu và ước lượng ảnh sạch', 'Đánh giá ảnh sinh bằng tác dụng thực tế'],
  intuit: R`<p>Dây chuyền có 20.000 ảnh bo tốt nhưng chỉ 40 ảnh “đứt mạch”. Mô hình phát hiện học không nổi. Giải pháp là <b>tự sinh thêm ảnh lỗi</b>: đặt vết đứt chân thực lên ảnh bo sạch, kèm luôn nhãn vị trí. Bài này ghép VAE, GAN và Diffusion vào một quyết định thiết kế thật.</p>`,
  body: R`<h4>Đề bài</h4><ol><li>So sánh VAE, GAN, Diffusion theo: độ nét, độ đa dạng, độ ổn định khi huấn luyện, khả năng điều khiển vị trí lỗi. Chọn một.</li>
<li>Với 3 pixel của vùng đường mạch $x_0 = [0.8, 0.8, -0.6]$, nhiễu $\varepsilon = [0.5, -1.0, 0.3]$, $\bar\alpha_t = 0.5$: tính $x_t$.</li>
<li>Mạng dự đoán $\hat\varepsilon = [0.4, -0.8, 0.5]$. Tính $\hat x_0$ và sai số so với $x_0$.</li>
<li>Bạn sẽ chứng minh ảnh sinh “có ích” như thế nào?</li></ol>`,
  worked: { t: 'Lời giải', setup: R`$\sqrt{\bar\alpha} = \sqrt{1-\bar\alpha} = 0.707$.`,
    steps: [R`<b>Chọn mô hình:</b> VAE thường mờ; GAN nét nhưng dễ mất ổn định và mode collapse; Diffusion nét, đa dạng, huấn luyện ổn định và dễ điều khiển bằng mask (inpainting, ControlNet). Chọn <b>Diffusion có điều kiện mask</b>.`,
      R`<b>Thêm nhiễu:</b> $x_t = 0.707\,x_0 + 0.707\,\varepsilon$ → $[0.919,\ -0.141,\ -0.212]$.`,
      R`<b>Ước lượng ảnh sạch:</b> $\hat x_0 = (x_t - 0.707\,\hat\varepsilon)/0.707 = x_t/0.707 - \hat\varepsilon$ → $[0.9,\ 0.6,\ -0.8]$.`,
      R`<b>Sai số:</b> $\hat x_0 - x_0 = [0.1,\ -0.2,\ -0.2]$ = đúng bằng $\varepsilon - \hat\varepsilon$ (vì $\sqrt{\bar\alpha} = \sqrt{1-\bar\alpha}$ ở bước này).`,
      R`<b>Chứng minh có ích:</b> huấn luyện mô hình phát hiện (a) chỉ với ảnh thật, (b) ảnh thật + ảnh sinh. So recall trên tập kiểm tra <b>chỉ gồm ảnh lỗi thật</b>. Thêm FID để kiểm tra độ giống, nhưng quyết định dựa vào recall.`],
    ans: R`Chọn Diffusion có mask; $x_t = [0.919, -0.141, -0.212]$; $\hat x_0 = [0.9, 0.6, -0.8]$.` },
  recap: [R`Diffusion: nét, đa dạng, điều khiển được bằng mask.`, R`$\hat x_0 = (x_t - \sqrt{1-\bar\alpha}\hat\varepsilon)/\sqrt{\bar\alpha}$.`, R`Đánh giá ảnh sinh bằng hiệu quả trên dữ liệu thật.`] });

L({ ...CAPI, id: 'cap7', p: 'p6', t: 'Tổng hợp chương 7: trợ lý AOI đa phương thức', pre: ['contrastive', 'rag', 'lora', 'anomaly'], ill: 'clipcat',
  goals: ['Phân loại ảnh không cần huấn luyện bằng CLIP', 'Truy hồi quy trình xử lý bằng RAG', 'Ước lượng chi phí tinh chỉnh bằng LoRA'],
  intuit: R`<p>Kỹ sư chụp một ảnh lỗi và hỏi: “đây là lỗi gì, xử lý thế nào?”. Một trợ lý hiện đại ghép ba mảnh: CLIP nhìn ảnh và chọn mô tả phù hợp nhất, RAG tìm đúng đoạn quy trình trong tài liệu nhà máy, và LLM viết câu trả lời có trích nguồn. Nếu CLIP chưa quen ảnh AOI, tinh chỉnh nhẹ bằng LoRA.</p>`,
  body: R`<h4>Đề bài</h4><ol><li>Ảnh có vector $\mathbf v = [0.9, 0.1, 0.2]$ (đã chuẩn hóa xấp xỉ). Ba câu mô tả có vector: “vết xước” $[0.8, 0.2, 0.1]$, “đứt mạch” $[0.1, 0.9, 0.3]$, “bo bình thường” $[0.2, 0.1, 0.95]$. Tính cosine, softmax với $\tau = 0.1$, chọn nhãn.</li>
<li>Câu hỏi được nhúng thành $\mathbf q$; dùng bài RAG để chọn 2 đoạn tài liệu gần nhất.</li>
<li>Tinh chỉnh LoRA hạng 8 cho 24 ma trận $1024\times1024$ của encoder ảnh. Bao nhiêu tham số cần học?</li></ol>`,
  worked: { t: 'Lời giải', setup: R`Trang tính bên dưới tính cosine và softmax.`,
    steps: [R`<b>Cosine:</b> “vết xước” cao nhất (≈ 0.99), “đứt mạch” ≈ 0.27, “bo bình thường” ≈ 0.42.`, R`<b>Softmax với τ = 0.1:</b> gần như toàn bộ xác suất vào “vết xước” → nhãn: vết xước.`, R`<b>RAG:</b> truy hồi đoạn “Phân loại lỗi xước bề mặt” và “Quy trình xử lý lỗi” rồi đưa vào prompt cho LLM, yêu cầu trích nguồn.`, R`<b>LoRA:</b> mỗi ma trận $8\cdot(1024+1024) = 16{,}384$; 24 ma trận → $393{,}216$ tham số (so với $25.2$ triệu nếu tinh chỉnh đầy đủ 24 ma trận đó).`],
    ans: R`Nhãn “vết xước”; LoRA cần khoảng 393 nghìn tham số.` },
  recap: [R`CLIP: cosine ảnh–câu + softmax.`, R`RAG: tìm đúng tài liệu rồi mới trả lời.`, R`LoRA: tinh chỉnh rẻ khi miền ảnh khác ảnh internet.`] });

L({ ...CAPI, id: 'cap8', p: 'psym', t: 'Tổng hợp chương 8: robot lấy hàng trong kho', pre: ['search', 'hmm', 'bayesnet'],
  goals: ['Tìm đường bằng A*', 'Định vị bằng một bước lọc Kalman', 'Quyết định dưới bất định bằng Bayes'],
  intuit: R`<p>Robot tự hành trong kho linh kiện phải làm ba việc: <b>đi đâu</b> (tìm đường), <b>đang ở đâu</b> (định vị khi cảm biến nhiễu), và <b>có nên lấy hàng ở kệ này không</b> (kệ có đúng mã hàng không, khi máy quét không hoàn hảo). Ba việc ứng với ba công cụ của chương: A*, Kalman, Bayes. Không cần học sâu.</p>`,
  body: R`<h4>Đề bài</h4><ol><li>Đường đi qua các điểm A → B → C → Kệ với chi phí cạnh 2, 2, 2, 1 và heuristic $h = [5, 3, 1, 0]$. Lập bảng $g$, $f$.</li>
<li>Robot ước lượng vị trí $\mu = 10$ m, $P = 4$; đi thêm 5 m (nhiễu $Q = 1$); cảm biến báo 16 m (nhiễu $R = 5$). Tính vị trí sau hiệu chỉnh.</li>
<li>30% kệ trong khu này chứa mã hàng cần lấy. Máy quét báo “đúng mã” với xác suất 0.9 nếu đúng, 0.2 nếu sai. Máy báo “đúng mã”. Xác suất kệ thật sự đúng mã là bao nhiêu? Có nên lấy không nếu cần chắc trên 60%?</li></ol>`,
  worked: { t: 'Lời giải', setup: R`Trang tính bên dưới tính cả ba phần.`,
    steps: [R`<b>A*:</b> $g = [2, 4, 6, 7]$, $f = g + h = [7, 7, 7, 7]$: heuristic chính xác nên $f$ không đổi dọc đường tối ưu, tổng 7.`, R`<b>Kalman:</b> dự đoán $\mu^- = 15$, $P^- = 5$; $K = 5/10 = 0.5$; $\mu = 15 + 0.5(16 - 15) = 15.5$ m, $P = 2.5$.`, R`<b>Bayes:</b> $0.3\cdot0.9 = 0.27$; $0.7\cdot0.2 = 0.14$; posterior $= 0.27/0.41 = 0.66 > 0.6$ → lấy hàng.`],
    ans: R`Đường dài 7; vị trí 15.5 m; P(đúng mã) = 0.66 → lấy.` },
  recap: [R`A*: $f = g + h$.`, R`Kalman: dự đoán rồi hiệu chỉnh theo $K$.`, R`Bayes: posterior ∝ likelihood × prior.`] });

L({ ...CAPI, id: 'cap9', p: 'pprac', t: 'Tổng hợp chương 9: đưa mô hình ra dây chuyền có trách nhiệm', pre: ['xai', 'deploy', 'ethics'], ill: 'cnncat',
  goals: ['Lượng tử hóa trọng số và kiểm tra dự đoán còn đúng', 'Giải thích một dự đoán bằng đóng góp từng vùng', 'Kiểm tra công bằng giữa hai dây chuyền trước khi triển khai'],
  intuit: R`<p>Mô hình v2 ở chương CNN đã đúng với husky. Trước khi đưa xuống máy công nghiệp, phải trả lời ba câu: chạy nhanh trên máy yếu được không (lượng tử hóa), giải thích được không khi kỹ sư hỏi “vì sao?” (giải thích mô hình), và có công bằng giữa các dây chuyền không (đánh giá theo nhóm).</p>`,
  body: R`<h4>Đề bài</h4><ol><li>Lượng tử hóa 10 trọng số của mô hình v2 xuống INT8 đối xứng (một scale cho cả tensor). Tính lại logit cho ảnh husky. Kết luận có đổi không?</li>
<li>Dùng bảng đóng góp trong hình minh họa (mô hình v2, ảnh husky) để viết một câu giải thích cho kỹ sư.</li>
<li>Trên dây chuyền A, mô hình bắt 95/100 lỗi; dây chuyền B (ánh sáng khác) bắt 70/100. Có triển khai ngay được không? Đề xuất hành động.</li></ol>`,
  worked: { t: 'Lời giải', setup: R`Trang tính bên dưới lượng tử hóa và tính lại logit.`,
    steps: [R`<b>Scale:</b> $\max|w| = 4$ → $s = 4/127 = 0.0315$. Các trọng số làm tròn về bội của $s$, sai số mỗi trọng số không quá $s/2 \approx 0.016$.`, R`<b>Logit sau lượng tử:</b> gần như không đổi (lệch chỉ vài phần nghìn) → vẫn đoán chó với xác suất ≈ 0.99.`, R`<b>Giải thích:</b> “Mô hình chọn <i>chó</i> chủ yếu vì vùng mõm sáng to (+3.5 cho chó, −3.5 cho mèo); tai nhọn có đẩy về mèo nhưng yếu hơn.”`, R`<b>Công bằng:</b> recall chênh 25 điểm phần trăm → chưa triển khai cho B. Thu thêm ảnh B, tăng cường độ sáng, hoặc đặt ngưỡng riêng cho B rồi đánh giá lại.`],
    ans: R`Lượng tử INT8 không đổi kết luận; giải thích dựa vào mõm; chưa triển khai cho dây chuyền B.` },
  recap: [R`Lượng tử: kiểm tra lại kết quả sau khi nén.`, R`Giải thích bằng đóng góp từng vùng.`, R`Báo cáo chỉ số theo từng nhóm trước khi triển khai.`] });
