/* ===== Giai đoạn: AI thực chiến ===== */
L({ id: 'xai', p: 'pprac', t: 'Giải thích mô hình: Grad-CAM, occlusion, SHAP', en: 'Explainable AI', min: 90, pre: ['resnet', 'ensemble'],
  goals: ['Tạo bản đồ nhiệt bằng che khuất (occlusion)', 'Hiểu công thức Grad-CAM', 'Tính giá trị Shapley bằng tay cho mô hình nhỏ'],
  intuit: R`<p>Mô hình nói “bo này NG”. Kỹ sư hỏi: <b>“vì sao, chỗ nào?”</b>. Giải thích mô hình giống hỏi một học sinh “em nhìn vào đâu mà ra đáp án?”. <b>Occlusion</b>: lấy tay che từng phần ảnh, phần nào bị che mà mô hình đổi ý thì phần đó quan trọng. <b>SHAP</b>: chia “công lao” dự đoán cho từng đặc trưng một cách công bằng, giống chia tiền thưởng cho các thành viên nhóm theo mức đóng góp.</p>`,
  body: R`
<h4>Che khuất (occlusion)</h4>
<p>Trượt một ô xám qua ảnh; tại mỗi vị trí ghi điểm NG bị giảm bao nhiêu. Đơn giản, không cần truy cập bên trong mô hình, nhưng tốn nhiều lần chạy.</p>
<h4>Grad-CAM</h4>
<p>Lấy feature map cuối $A^k$ (kênh $k$) của CNN và gradient của điểm lớp $y^c$ theo nó:</p>
$$\alpha_k^c = \frac1Z\sum_{i,j}\frac{\partial y^c}{\partial A^k_{ij}},\qquad L^c = \text{ReLU}\Big(\sum_k\alpha_k^c A^k\Big)$$
<p>Kênh nào làm tăng điểm lớp thì được trọng số lớn; cộng các kênh lại ra bản đồ nhiệt thô, phóng to lên kích thước ảnh. Với ViT, dùng attention rollout hoặc biến thể Grad-CAM cho token.</p>
<h4>Giá trị Shapley / SHAP</h4>
<p>Công bằng theo lý thuyết trò chơi: đóng góp của đặc trưng $i$ là trung bình phần tăng thêm khi thêm $i$ vào mọi tập con các đặc trưng khác:</p>
$$\phi_i = \sum_{S\subseteq F\setminus\{i\}}\frac{|S|!\,(|F|-|S|-1)!}{|F|!}\big[f(S\cup\{i\}) - f(S)\big]$$
<p>Tổng các $\phi_i$ bằng dự đoán trừ giá trị nền. SHAP rất phổ biến cho mô hình dữ liệu bảng (XGBoost).</p>
<h4>Cẩn thận</h4>
<p>Bản đồ nhiệt đẹp chưa chắc đúng. Kiểm tra bằng “sanity check”: ngẫu nhiên hóa trọng số mà bản đồ không đổi thì phương pháp đó không phản ánh mô hình.</p>`,
  w: 'occl',
  worked: { t: 'Shapley cho mô hình 2 đặc trưng',
    setup: R`Mô hình dự đoán xác suất NG: nền (không đặc trưng nào) $f(\varnothing) = 0.1$; chỉ biết độ rộng mạch hẹp: $f(\{R\}) = 0.5$; chỉ biết độ sáng thấp: $f(\{S\}) = 0.3$; biết cả hai: $f(\{R,S\}) = 0.9$.`,
    steps: [
      R`<b>Hai thứ tự thêm đặc trưng:</b> (R rồi S) và (S rồi R), mỗi thứ tự trọng số 1/2.`,
      R`<b>Đóng góp của R:</b> thứ tự R trước: $f(\{R\}) - f(\varnothing) = 0.4$. Thứ tự S trước: $f(\{R,S\}) - f(\{S\}) = 0.6$. Trung bình $\phi_R = 0.5$.`,
      R`<b>Đóng góp của S:</b> S trước: $0.3 - 0.1 = 0.2$. R trước: $0.9 - 0.5 = 0.4$. $\phi_S = 0.3$.`,
      R`<b>Kiểm tra:</b> $\phi_R + \phi_S = 0.8 = f(\{R,S\}) - f(\varnothing)$ ✓.`,
      R`<b>Đọc:</b> độ rộng mạch đóng góp 0.5, độ sáng 0.3 vào việc đẩy xác suất NG từ 0.1 lên 0.9. Phần tương tác (cả hai cùng có thì tăng thêm) được chia đều.`,
    ],
    ans: R`$\phi_R = 0.5$, $\phi_S = 0.3$.` },
  ex: [
    { q: R`Grad-CAM với 2 kênh. Gradient trung bình $\alpha_1 = 0.5$, $\alpha_2 = -0.2$. $A^1 = \begin{bmatrix}2&0\\0&0\end{bmatrix}$, $A^2 = \begin{bmatrix}1&1\\1&1\end{bmatrix}$. Tính bản đồ.`, s: [R`$0.5A^1 = \begin{bmatrix}1&0\\0&0\end{bmatrix}$; $-0.2A^2 = \begin{bmatrix}-0.2&-0.2\\-0.2&-0.2\end{bmatrix}$.`, R`Tổng: $\begin{bmatrix}0.8&-0.2\\-0.2&-0.2\end{bmatrix}$.`, R`ReLU: $\begin{bmatrix}0.8&0\\0&0\end{bmatrix}$.`], a: R`Chỉ ô trái-trên sáng: mô hình dựa vào vùng đó.` },
  ],
  miss: [[R`Bản đồ nhiệt cho biết nguyên nhân thật của lỗi.`, R`Nó cho biết mô hình <b>dựa vào đâu</b>, có thể là dấu hiệu giả (ví dụ logo, viền ảnh). Đó chính là công dụng: phát hiện mô hình học “đường tắt”.`]],
  recap: [R`Occlusion: che rồi đo thay đổi.`, R`Grad-CAM: trọng số kênh = gradient trung bình.`, R`Shapley: chia công bằng, tổng bằng dự đoán − nền.`],
  papers: ['Selvaraju et al. (2017) — Grad-CAM', 'Lundberg & Lee (2017) — SHAP', 'Adebayo et al. (2018) — Sanity Checks for Saliency Maps'] });

L({ id: 'deploy', p: 'pprac', t: 'Triển khai & nén mô hình', en: 'Deployment & Compression', min: 90, pre: ['efficient', 'prob'],
  goals: ['Lượng tử hóa INT8 bằng tay', 'Hiểu chưng cất tri thức', 'Nắm vòng đời MLOps: đóng gói, phục vụ, giám sát trôi dữ liệu'],
  intuit: R`<p>Mô hình huấn luyện trên GPU lớn giống một đầu bếp nhà hàng với cả căn bếp. Đưa ra dây chuyền thì phải vừa chiếc “xe bán đồ ăn” (máy công nghiệp, camera). <b>Lượng tử hóa</b> như làm tròn giá tiền về nghìn đồng: nhẹ hơn, sai một chút. <b>Chưng cất</b> như thầy giỏi dạy học trò nhỏ tuổi, không chỉ đưa đáp án mà còn nói “câu này phân vân giữa A và B”. <b>Giám sát</b> như định kỳ nếm lại món ăn: nguyên liệu đổi (đèn mới, lô vật liệu mới) thì món có thể hỏng.</p>`,
  body: R`
<h4>Lượng tử hóa</h4>
<p>Biểu diễn số thực 32-bit bằng số nguyên 8-bit:</p>
$$q = \text{round}(x/s) + z,\qquad \hat x = s\,(q - z)$$
<p>Đối xứng: $z=0$, $s = \max|x|/127$. Mô hình nhỏ 4 lần, chạy nhanh hơn trên phần cứng hỗ trợ INT8, thường mất &lt;1% độ chính xác. LLM dùng cả 4-bit.</p>
<h4>Chưng cất tri thức</h4>
<p>Học trò khớp phân phối mềm của thầy với nhiệt độ $T$:</p>
$$\mathcal L = (1-\lambda)\,\text{CE}(y, p_s) + \lambda T^2\,\text{KL}\big(p_t^{(T)}\,\|\,p_s^{(T)}\big)$$
<p>Phân phối mềm chứa “tri thức tối” (lớp nào giống lớp nào), giúp mô hình nhỏ học tốt hơn so với chỉ học nhãn cứng.</p>
<h4>Tỉa (pruning)</h4>
<p>Bỏ trọng số hoặc cả kênh có độ lớn nhỏ, rồi tinh chỉnh lại. Tỉa theo kênh mới thực sự tăng tốc trên phần cứng thông thường.</p>
<h4>Đường ống triển khai</h4>
<ol><li>Xuất mô hình (ONNX), tối ưu cho phần cứng (TensorRT, OpenVINO).</li><li>Đo <b>độ trễ</b> (ms/ảnh) và <b>thông lượng</b> (ảnh/giây) trên máy đích.</li><li>Phục vụ qua API hoặc nhúng trong phần mềm máy AOI.</li><li><b>Giám sát:</b> phân phối dữ liệu trôi (data drift), tỷ lệ NG bất thường, phản hồi từ kiểm tra lại; lưu ảnh khó để huấn luyện lại.</li></ol>`,
  w: 'quant',
  worked: { t: 'Lượng tử hóa INT8 một vector trọng số',
    setup: R`$\mathbf w = [0.50, -1.27, 0.03, 0.88]$. Lượng tử hóa đối xứng 8-bit (khoảng $[-127, 127]$).`,
    steps: [
      R`<b>Scale:</b> $s = \max|w|/127 = 1.27/127 = 0.01$.`,
      R`<b>Lượng tử:</b> $q = \text{round}(w/s) = [50, -127, 3, 88]$.`,
      R`<b>Giải lượng tử:</b> $\hat w = 0.01\cdot q = [0.50, -1.27, 0.03, 0.88]$. Ở ví dụ đẹp này sai số bằng 0.`,
      R`<b>Với $w_3 = 0.034$:</b> $0.034/0.01 = 3.4 \to 3$, $\hat w = 0.03$, sai số $0.004$ (lớn nhất có thể là $s/2 = 0.005$).`,
      R`<b>Ngoại lai:</b> nếu thêm một trọng số $12.7$, $s = 0.1$; khi đó $0.03 \to 0$, $0.50\to0.5$: các trọng số nhỏ mất độ chính xác. Đây là lý do lượng tử hóa theo kênh/nhóm, hoặc xử lý ngoại lai riêng.`,
      R`<b>Bộ nhớ:</b> 4 số × 4 byte = 16 byte → 4 byte + 1 scale.`,
    ],
    ans: R`$q = [50, -127, 3, 88]$, $s = 0.01$.` },
  ex: [
    { q: R`Thầy cho logits $[3, 1, 0]$, $T = 2$. Tính phân phối mềm.`, s: [R`Chia $T$: $[1.5, 0.5, 0]$.`, R`Lũy thừa: $[4.482, 1.649, 1]$, tổng $7.131$.`, R`Chia: $[0.629, 0.231, 0.140]$. (Với $T=1$: $[0.844, 0.114, 0.042]$.)`], a: R`$[0.629, 0.231, 0.140]$: học trò thấy lớp 2 “giống” lớp 1 hơn lớp 3.` },
    { q: R`Mô hình 25M tham số FP32. Kích thước file ở FP32, FP16, INT8, INT4?`, s: [R`FP32: $25\text{M}\cdot4 = 100$ MB.`, R`FP16: 50 MB. INT8: 25 MB. INT4: 12.5 MB.`], a: R`100 / 50 / 25 / 12.5 MB.` },
  ],
  miss: [[R`Mô hình đạt chỉ số tốt trên tập test là xong.`, R`Dữ liệu thật thay đổi theo thời gian; phải giám sát và có quy trình huấn luyện lại.`]],
  recap: [R`INT8: $q = \text{round}(x/s)$, nhỏ 4 lần.`, R`Chưng cất: học phân phối mềm của thầy.`, R`Đo độ trễ trên máy đích; giám sát trôi dữ liệu.`],
  papers: ['Hinton et al. (2015) — Distilling the Knowledge in a Neural Network', 'Jacob et al. (2018) — Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference', 'Sculley et al. (2015) — Hidden Technical Debt in Machine Learning Systems'] });

L({ id: 'ethics', p: 'pprac', t: 'Đạo đức, công bằng & an toàn AI', en: 'Ethics, Fairness & Safety', min: 75, pre: ['evaluation'],
  goals: ['Tính các chỉ số công bằng giữa hai nhóm', 'Nhận diện thiên lệch dữ liệu, ảo giác, rủi ro bảo mật', 'Biết khung quản trị theo mức rủi ro'],
  intuit: R`<p>Một mô hình duyệt hồ sơ vay huấn luyện trên dữ liệu quá khứ, mà quá khứ từng thiên vị một nhóm người. Mô hình sẽ <b>học luôn thiên vị đó</b>, và còn làm nó nhanh hơn, trên quy mô lớn hơn. Trong nhà máy cũng vậy: mô hình AOI huấn luyện chủ yếu trên ảnh của dây chuyền A có thể bỏ sót lỗi trên dây chuyền B. AI có trách nhiệm là đo những chênh lệch này và xử lý chúng trước khi gây hại.</p>`,
  body: R`
<h4>Chỉ số công bằng (hai nhóm A, B)</h4>
<ul><li><b>Cân bằng nhân khẩu (demographic parity):</b> tỷ lệ được chấp thuận bằng nhau: $P(\hat y=1\mid A) = P(\hat y=1\mid B)$.</li>
<li><b>Cơ hội bình đẳng (equal opportunity):</b> recall bằng nhau giữa hai nhóm.</li>
<li><b>Equalized odds:</b> cả recall và FPR bằng nhau.</li></ul>
<p>Các tiêu chí này thường <b>không thể thỏa mãn cùng lúc</b> khi tỷ lệ nền khác nhau; phải chọn theo bối cảnh.</p>
<h4>Các rủi ro thường gặp</h4>
<ul><li><b>Thiên lệch dữ liệu:</b> thiếu đại diện, nhãn sai có hệ thống, đường tắt (mô hình dựa vào thứ không liên quan).</li>
<li><b>Ảo giác của LLM:</b> trả lời trôi chảy nhưng sai; giảm bằng RAG, trích dẫn, kiểm chứng.</li>
<li><b>Bảo mật:</b> tấn công đối kháng (nhiễu nhỏ làm đổi dự đoán), prompt injection với agent, rò rỉ dữ liệu huấn luyện.</li>
<li><b>Quyền riêng tư và bản quyền</b> dữ liệu huấn luyện.</li></ul>
<h4>An toàn và căn chỉnh</h4>
<p>Với mô hình mạnh: căn chỉnh hành vi (RLHF, quy tắc hiến pháp), đánh giá năng lực nguy hiểm, red-teaming, diễn giải cơ chế bên trong. Agent có quyền hành động cần giới hạn quyền và điểm xác nhận của con người.</p>
<h4>Quản trị theo rủi ro</h4>
<p>Đạo luật AI của EU phân loại hệ thống theo mức rủi ro (cấm, rủi ro cao, minh bạch, tối thiểu) và áp dụng dần nghĩa vụ theo lộ trình. Nhiều nước khác, gồm Việt Nam và Đài Loan, cũng đang xây dựng khung pháp lý về AI.</p>`,
  w: 'fair',
  worked: { t: 'Kiểm tra công bằng giữa hai dây chuyền',
    setup: R`Mô hình AOI trên hai dây chuyền. Dây chuyền A: 100 bo lỗi, bắt được 95; 900 bo tốt, báo nhầm 45. Dây chuyền B (ánh sáng khác): 100 bo lỗi, bắt được 70; 900 bo tốt, báo nhầm 18.`,
    steps: [
      R`<b>Recall:</b> A: $95/100 = 95\%$. B: $70/100 = 70\%$. Chênh 25 điểm phần trăm.`,
      R`<b>FPR:</b> A: $45/900 = 5\%$. B: $18/900 = 2\%$.`,
      R`<b>Tỷ lệ bị gọi NG:</b> A: $(95+45)/1000 = 14\%$. B: $(70+18)/1000 = 8.8\%$.`,
      R`<b>Kết luận:</b> vi phạm “cơ hội bình đẳng” nghiêm trọng: lỗi trên B bị lọt gấp 6 lần (30% so với 5%). Nhìn chỉ số tổng hợp sẽ không thấy.`,
      R`<b>Xử lý:</b> thu thêm ảnh B, tăng cường độ sáng khi huấn luyện, hoặc chọn ngưỡng riêng cho B để đạt recall mục tiêu; luôn báo cáo chỉ số theo từng nhóm.`,
    ],
    ans: R`Recall A 95% vs B 70%; FPR 5% vs 2%. Cần xử lý dây chuyền B.` },
  ex: [
    { q: R`Tấn công đối kháng: mô hình tuyến tính $f(\mathbf x) = \mathbf w\cdot\mathbf x$ với $\mathbf w = [1,-1,1,-1]$ (1000 chiều tương tự). Thêm nhiễu $\boldsymbol\delta = \epsilon\,\text{sign}(\mathbf w)$ với $\epsilon = 0.01$. Điểm thay đổi bao nhiêu?`, s: [R`$\mathbf w\cdot\boldsymbol\delta = \epsilon\sum|w_i|$.`, R`$\sum|w_i| = 1000$.`, R`$0.01\cdot1000 = 10$.`], a: R`Tăng 10 dù mỗi pixel chỉ đổi 0.01: nhiễu nhỏ khắp nơi cộng dồn thành thay đổi lớn ở nhiều chiều.` },
  ],
  miss: [[R`Bỏ thuộc tính nhạy cảm khỏi đầu vào là đủ công bằng.`, R`Các đặc trưng khác (địa chỉ, lịch sử) có thể là “đại diện” cho thuộc tính đó. Phải đo kết quả theo nhóm.`]],
  recap: [R`Đo chỉ số theo từng nhóm, không chỉ tổng.`, R`Rủi ro: thiên lệch, ảo giác, đối kháng, quyền riêng tư.`, R`Quản trị theo mức rủi ro; con người duyệt hành động quan trọng.`],
  papers: ['Hardt, Price & Srebro (2016) — Equality of Opportunity in Supervised Learning', 'Goodfellow et al. (2015) — Explaining and Harnessing Adversarial Examples', 'Russell & Norvig — chương 27'] });

L({ id: 'speech', p: 'pprac', t: 'Xử lý giọng nói & âm thanh', en: 'Speech & Audio', min: 90, pre: ['conv', 'transformer'],
  goals: ['Tính DFT 4 điểm bằng tay', 'Hiểu spectrogram và thang mel', 'Nắm kiến trúc nhận dạng giọng nói hiện đại'],
  intuit: R`<p>Nghe một hợp âm guitar, tai bạn tự “tách” ra từng nốt. Biến đổi Fourier làm điều đó bằng toán: biến sóng âm (biên độ theo thời gian) thành <b>công thức pha chế</b> (bao nhiêu phần tần số này, bao nhiêu phần tần số kia). Cắt âm thanh thành các khúc 25 ms và làm Fourier từng khúc, ta có <b>spectrogram</b>: một “bức ảnh” của âm thanh, và mọi kỹ thuật CNN/ViT áp dụng được lên nó.</p>`,
  body: R`
<h4>Từ sóng tới số</h4>
<p>Micro lấy mẫu áp suất không khí $f_s$ lần mỗi giây (16 kHz cho giọng nói). Định lý Nyquist: chỉ biểu diễn được tần số tới $f_s/2$.</p>
<h4>Biến đổi Fourier rời rạc</h4>
$$X_k = \sum_{n=0}^{N-1}x_n\,e^{-2\pi i kn/N},\qquad k = 0,\dots,N-1$$
<p>$|X_k|$ cho biết tần số $k f_s/N$ mạnh cỡ nào. FFT tính nhanh trong $O(N\log N)$.</p>
<h4>Spectrogram và thang mel</h4>
<p>STFT: cửa sổ 25 ms, bước 10 ms → mỗi cột là phổ của một khúc. Tai người phân biệt tần số thấp tốt hơn tần số cao, nên gộp các dải theo <b>thang mel</b> $m = 2595\log_{10}(1 + f/700)$ rồi lấy log năng lượng: <b>log-mel spectrogram</b>, đầu vào chuẩn của mô hình giọng nói.</p>
<h4>Mô hình</h4>
<ul><li><b>Nhận dạng (ASR):</b> encoder (CNN + Transformer/Conformer) trên log-mel; giải mã bằng CTC hoặc decoder Transformer (Whisper).</li>
<li><b>Tổng hợp (TTS):</b> văn bản → mel → vocoder ra sóng; hoặc mô hình token âm thanh sinh trực tiếp.</li>
<li><b>Tự giám sát:</b> wav2vec 2.0 / HuBERT học từ âm thanh không nhãn (che một phần rồi đoán, như BERT).</li></ul>
<h4>Ngoài giọng nói</h4>
<p>Phân tích rung và âm thanh máy móc để bảo trì dự đoán: spectrogram của động cơ + CNN hoặc phát hiện bất thường, cùng kỹ thuật như ảnh.</p>`,
  w: 'spectro',
  worked: { t: 'DFT 4 điểm bằng tay',
    setup: R`Tín hiệu $x = [1, 0, -1, 0]$ (một chu kỳ cosine trong 4 mẫu). Tính $X_0, X_1, X_2, X_3$. Nhớ $e^{-2\pi i k n/4}$ với $N=4$ chỉ nhận các giá trị $1, -i, -1, i$.`,
    steps: [
      R`<b>$X_0$</b> (thành phần trung bình): $1 + 0 - 1 + 0 = 0$.`,
      R`<b>$X_1$:</b> hệ số $e^{-2\pi i n/4}$ cho $n=0..3$ là $[1, -i, -1, i]$. $X_1 = 1\cdot1 + 0\cdot(-i) + (-1)(-1) + 0\cdot i = 2$.`,
      R`<b>$X_2$:</b> hệ số $[1,-1,1,-1]$. $X_2 = 1 + 0 - 1 + 0 = 0$.`,
      R`<b>$X_3$:</b> hệ số $[1, i, -1, -i]$. $X_3 = 1 + 0 + 1 + 0 = 2$.`,
      R`<b>Đọc:</b> năng lượng chỉ ở $k=1$ (và ảnh gương $k=3$): tín hiệu là sóng tần số 1 chu kỳ / 4 mẫu. Với $f_s = 16$ kHz, đó là 4 kHz.`,
    ],
    ans: R`$X = [0, 2, 0, 2]$.` },
  ex: [
    { q: R`Âm thanh 10 giây, 16 kHz, cửa sổ bước 10 ms, 80 dải mel. Kích thước log-mel spectrogram? Whisper làm việc với đầu vào như vậy.`, s: [R`Số khung: $10\text{ s}/10\text{ ms} = 1000$.`, R`Mỗi khung 80 giá trị.`], a: R`$80\times1000$, giống một “ảnh” 80 × 1000.` },
  ],
  miss: [[R`Mô hình giọng nói làm việc trực tiếp với sóng thô.`, R`Phổ biến nhất là log-mel spectrogram; một số mô hình học từ sóng thô qua lớp conv đầu.`]],
  recap: [R`DFT: phân tích tín hiệu thành các tần số.`, R`Log-mel spectrogram = “ảnh” của âm thanh.`, R`ASR hiện đại: encoder Transformer + CTC/decoder.`],
  papers: ['Baevski et al. (2020) — wav2vec 2.0', 'Radford et al. (2022) — Whisper', 'Gulati et al. (2020) — Conformer'] });

L({ id: 'vision3d', p: 'pprac', t: 'Thị giác 3D: camera, độ sâu, NeRF, Gaussian Splatting', en: '3D Vision', min: 90, pre: ['vit', 'matmul'],
  goals: ['Chiếu điểm 3D lên ảnh bằng mô hình camera lỗ kim', 'Tính độ sâu từ hai camera', 'Tính tay kết xuất thể tích của NeRF'],
  intuit: R`<p>Nhắm một mắt rồi đổi sang mắt kia: vật ở gần “nhảy” nhiều, vật ở xa nhảy ít. Não bạn dùng độ lệch đó để đoán khoảng cách: đó là <b>stereo</b>. <b>NeRF</b> thì như một màn sương có màu lấp đầy không gian: nhìn theo một tia sáng, bạn thấy tổng hợp màu của các lớp sương dọc tia, lớp gần che lớp xa. Học được “màn sương” đúng từ vài chục bức ảnh, bạn có thể chụp cảnh từ góc mới.</p>`,
  body: R`
<h4>Camera lỗ kim</h4>
$$u = f\frac{X}{Z} + c_x,\qquad v = f\frac{Y}{Z} + c_y$$
<p>$f$: tiêu cự (pixel), $(c_x, c_y)$: tâm ảnh. Vật xa hơn ($Z$ lớn) thì nhỏ hơn trên ảnh.</p>
<h4>Độ sâu từ stereo</h4>
$$Z = \frac{f\,B}{d}$$
<p>$B$: khoảng cách hai camera; $d$: độ lệch (disparity) cùng một điểm giữa hai ảnh. Máy đo 3D trong kiểm tra kem hàn (SPI) dùng nguyên lý tam giác tương tự (chiếu vân sáng).</p>
<h4>NeRF</h4>
<p>Một MLP nhận vị trí $(x,y,z)$ và hướng nhìn, trả về mật độ $\sigma$ và màu $\mathbf c$. Màu của một pixel là tổng dọc tia:</p>
$$C = \sum_i T_i\,\alpha_i\,\mathbf c_i,\qquad \alpha_i = 1 - e^{-\sigma_i\delta_i},\qquad T_i = \prod_{j\lt i}(1-\alpha_j)$$
<p>$T_i$ là phần ánh sáng còn lọt tới mẫu $i$. Mọi phép tính khả vi, nên học bằng cách so màu kết xuất với ảnh thật.</p>
<h4>3D Gaussian Splatting</h4>
<p>Biểu diễn cảnh bằng hàng triệu Gaussian 3D có màu và độ trong suốt; kết xuất bằng cách “vẩy” chúng lên ảnh rồi trộn theo cùng công thức trên. Nhanh hơn NeRF nhiều, chạy thời gian thực; đang phổ biến trong bản sao số (digital twin) và AR/VR.</p>`,
  w: 'render',
  worked: { t: 'Kết xuất một tia NeRF với 3 mẫu',
    setup: R`Ba mẫu dọc tia, khoảng cách $\delta = 1$. Mật độ $\sigma = [0.1, 2.0, 5.0]$, màu (thang xám) $c = [0.2, 0.9, 0.5]$.`,
    steps: [
      R`<b>Độ đục:</b> $\alpha_1 = 1 - e^{-0.1} = 0.095$; $\alpha_2 = 1 - e^{-2} = 0.865$; $\alpha_3 = 1 - e^{-5} = 0.993$.`,
      R`<b>Ánh sáng lọt tới:</b> $T_1 = 1$; $T_2 = 1 - 0.095 = 0.905$; $T_3 = 0.905\cdot(1-0.865) = 0.905\cdot0.135 = 0.122$.`,
      R`<b>Trọng số</b> $w_i = T_i\alpha_i$: $0.095$; $0.905\cdot0.865 = 0.783$; $0.122\cdot0.993 = 0.121$.`,
      R`<b>Màu pixel:</b> $0.095\cdot0.2 + 0.783\cdot0.9 + 0.121\cdot0.5 = 0.019 + 0.705 + 0.061 = 0.785$.`,
      R`<b>Đọc:</b> mẫu 2 “thắng” vì nó là bề mặt đầu tiên đủ đặc. Mẫu 3 đặc hơn nhưng bị che. Tổng trọng số $0.999$: tia gần như bị chặn hoàn toàn.`,
    ],
    ans: R`Màu $\approx0.785$, chủ yếu từ mẫu thứ 2.` },
  ex: [
    { q: R`Hai camera cách nhau $B = 10$ cm, $f = 800$ px. Một điểm có độ lệch $d = 40$ px. Độ sâu? Nếu $d$ đo sai 1 px?`, s: [R`$Z = 800\cdot10/40 = 200$ cm.`, R`$d = 39$: $Z = 205.1$ cm; $d = 41$: $195.1$ cm.`], a: R`2 m, sai số khoảng ±5 cm cho 1 px: vật càng xa, sai số độ sâu càng lớn.` },
    { q: R`Điểm $(X,Y,Z) = (0.5, -0.2, 2)$ m, $f = 1000$ px, $c_x = 640$, $c_y = 360$. Tọa độ pixel?`, s: [R`$u = 1000\cdot0.5/2 + 640 = 250 + 640$.`, R`$v = 1000\cdot(-0.2)/2 + 360 = -100 + 360$.`], a: R`$(890, 260)$.` },
  ],
  miss: [[R`NeRF lưu một mô hình 3D dạng lưới tam giác.`, R`NeRF lưu một hàm (MLP) cho mật độ và màu; muốn lưới phải trích xuất thêm.`]],
  recap: [R`Chiếu: $u = fX/Z + c_x$.`, R`Stereo: $Z = fB/d$.`, R`NeRF/3DGS: trộn màu dọc tia với $T_i\alpha_i$.`],
  papers: ['Hartley & Zisserman — Multiple View Geometry', 'Mildenhall et al. (2020) — NeRF', 'Kerbl et al. (2023) — 3D Gaussian Splatting'] });
