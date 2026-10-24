/* ===== Giai đoạn: Học máy cổ điển ===== */
L({ id: 'knn', p: 'pml', t: 'k láng giềng gần nhất (k-NN)', en: 'k-Nearest Neighbors', min: 60, pre: ['mlbasics', 'vector'],
  goals: ['Phân loại bằng bỏ phiếu k láng giềng', 'Hiểu vai trò của k và của chuẩn hóa đặc trưng', 'Biết “lời nguyền số chiều”'],
  intuit: R`<p>Bạn chuyển tới khu trọ mới và muốn biết quán cơm nào ngon. Bạn hỏi <b>3 người hàng xóm gần nhất</b>; 2 người khen quán A, 1 người khen quán B, bạn đi quán A. Đó là k-NN với $k=3$. Không có “học” gì cả: chỉ nhớ tất cả dữ liệu, và khi cần thì hỏi những điểm giống mình nhất.</p>`,
  body: R`
<h4>Thuật toán</h4>
<ol><li>Lưu toàn bộ dữ liệu huấn luyện.</li><li>Với điểm mới $\mathbf x$, tính khoảng cách tới mọi điểm (thường là Euclid $\|\mathbf x - \mathbf x_i\|$).</li><li>Lấy $k$ điểm gần nhất, bỏ phiếu theo nhãn (hồi quy thì lấy trung bình).</li></ol>
<h4>Chọn k</h4>
<p>$k$ nhỏ (1): ranh giới gồ ghề, nhạy với nhiễu (quá khớp). $k$ lớn: ranh giới mượt, có thể bỏ qua cấu trúc nhỏ (thiếu khớp). Chọn $k$ bằng kiểm định chéo; với 2 lớp nên chọn $k$ lẻ để tránh hòa.</p>
<h4>Chuẩn hóa là bắt buộc</h4>
<p>Nếu một đặc trưng đo bằng µm (0–200) và một đặc trưng là tỷ lệ (0–1), khoảng cách bị đặc trưng µm chi phối hoàn toàn. Chuẩn hóa từng đặc trưng về trung bình 0, độ lệch 1 trước khi tính.</p>
<h4>Lời nguyền số chiều</h4>
<p>Trong không gian nhiều chiều, mọi điểm đều “xa như nhau”; khoảng cách mất ý nghĩa. k-NN trên pixel thô hoạt động kém, nhưng k-NN trên <b>đặc trưng học sâu</b> (embedding) rất mạnh. PatchCore và RAG thực chất là k-NN trên embedding.</p>`,
  w: 'knn',
  worked: { t: 'Phân loại một bo mạch mới bằng k-NN',
    setup: R`Đặc trưng đã chuẩn hóa (độ rộng mạch, độ sáng). Dữ liệu: A $(1,1)$ OK, B $(2,1)$ OK, C $(1,2)$ OK, D $(4,4)$ NG, E $(5,3)$ NG. Điểm mới $\mathbf x = (3, 3)$. Phân loại với $k=1$ và $k=3$.`,
    steps: [
      R`<b>Khoảng cách tới A:</b> $\sqrt{(3-1)^2+(3-1)^2} = \sqrt8 = 2.83$.`,
      R`<b>Tới B:</b> $\sqrt{1+4} = 2.24$. <b>Tới C:</b> $\sqrt{4+1} = 2.24$.`,
      R`<b>Tới D:</b> $\sqrt{1+1} = 1.41$. <b>Tới E:</b> $\sqrt{4+0} = 2.00$.`,
      R`<b>Sắp xếp:</b> D (1.41, NG), E (2.00, NG), B (2.24, OK), C (2.24, OK), A (2.83, OK).`,
      R`<b>k = 1:</b> láng giềng gần nhất D → NG.`,
      R`<b>k = 3:</b> D, E, và một trong B/C (hòa khoảng cách) → 2 NG, 1 OK → NG.`,
      R`<b>k = 5:</b> 2 NG, 3 OK → OK. Kết quả đổi theo $k$: đây là lý do phải chọn $k$ bằng validation.`,
    ],
    ans: R`$k=1$ và $k=3$: NG; $k=5$: OK.` },
  ex: [
    { q: R`Dữ liệu có đặc trưng 1 trong khoảng 0–1000 và đặc trưng 2 trong 0–1. Điểm mới $(500, 0.1)$, hai điểm $P=(510, 0.9)$ và $Q=(450, 0.1)$. Không chuẩn hóa, điểm nào gần hơn?`, s: [R`Tới P: $\sqrt{10^2 + 0.8^2}\approx10.03$.`, R`Tới Q: $\sqrt{50^2 + 0} = 50$.`, R`P gần hơn dù đặc trưng 2 khác rất nhiều (0.1 so với 0.9).`], a: R`P; đặc trưng 2 gần như bị bỏ qua. Cần chuẩn hóa.` },
  ],
  miss: [[R`k-NN huấn luyện chậm.`, R`Huấn luyện tức thì (chỉ lưu dữ liệu); <b>suy luận</b> mới chậm vì phải so với mọi điểm. Dùng cấu trúc tìm kiếm (KD-tree, FAISS) để tăng tốc.`]],
  recap: [R`Nhớ dữ liệu, hỏi $k$ điểm gần nhất, bỏ phiếu.`, R`Luôn chuẩn hóa đặc trưng.`, R`Mạnh khi dùng trên embedding tốt.`],
  papers: ['Cover & Hart (1967) — Nearest neighbor pattern classification'] });

L({ id: 'svm', p: 'pml', t: 'Máy vectơ hỗ trợ (SVM)', en: 'Support Vector Machines', min: 75, pre: ['knn', 'calculus'],
  goals: ['Hiểu “lề rộng nhất” và vectơ hỗ trợ', 'Tính hinge loss bằng tay', 'Hiểu ý tưởng kernel trick'],
  intuit: R`<p>Có hai nhóm học sinh đứng trên sân, bạn phải kẻ một vạch phấn chia hai nhóm. Có vô số vạch chia được. SVM chọn vạch sao cho <b>khoảng trống hai bên rộng nhất</b>, giống kẻ một con đường rộng nhất có thể giữa hai nhóm. Chỉ những học sinh đứng sát mép đường (vectơ hỗ trợ) quyết định vị trí con đường; những người đứng xa có đi đâu cũng không ảnh hưởng.</p>`,
  body: R`
<h4>Siêu phẳng và lề</h4>
<p>Phân loại: $\hat y = \text{sign}(\mathbf w\cdot\mathbf x + b)$, nhãn $y\in\{-1,+1\}$. Khoảng cách từ ranh giới tới đường lề là $1/\|\mathbf w\|$. Làm lề rộng nhất ⇔ làm $\|\mathbf w\|$ nhỏ nhất, với ràng buộc mọi điểm nằm đúng phía và ngoài lề: $y_i(\mathbf w\cdot\mathbf x_i + b)\ge1$.</p>
<h4>Lề mềm và hinge loss</h4>
<p>Dữ liệu thật có nhiễu, nên cho phép vi phạm và phạt:</p>
$$\min_{\mathbf w,b}\ \tfrac12\|\mathbf w\|^2 + C\sum_i\max\big(0,\ 1 - y_i(\mathbf w\cdot\mathbf x_i+b)\big)$$
<p>Hinge loss bằng 0 khi điểm đúng phía và ngoài lề; tăng tuyến tính khi điểm vào trong lề hoặc sai phía. $C$ lớn: phạt nặng vi phạm (lề hẹp); $C$ nhỏ: chấp nhận vài vi phạm để lề rộng.</p>
<h4>Kernel trick</h4>
<p>Dữ liệu không tách được bằng đường thẳng (như XOR) có thể tách được sau khi ánh xạ lên chiều cao hơn. SVM chỉ cần tích vô hướng giữa các điểm, nên thay $\mathbf x_i\cdot\mathbf x_j$ bằng hàm kernel $K(\mathbf x_i,\mathbf x_j)$, ví dụ RBF $\exp(-\gamma\|\mathbf x_i - \mathbf x_j\|^2)$, mà không cần tính ánh xạ tường minh.</p>
<h4>Vị trí hiện nay</h4>
<p>Trước 2012, SVM trên đặc trưng thiết kế tay (HOG, SIFT) là chuẩn cho thị giác. Ngày nay SVM vẫn hữu ích với dữ liệu nhỏ và đặc trưng tốt, ví dụ đặt trên embedding của CNN pretrained.</p>`,
  w: 'svm',
  worked: { t: 'Hinge loss cho 4 điểm',
    setup: R`$\mathbf w = [1, 1]$, $b = -3$. Điểm: $P_1=(3,2), y=+1$; $P_2=(2,1.5), y=+1$; $P_3=(1,1), y=-1$; $P_4=(2,2), y=-1$.`,
    steps: [
      R`<b>Giá trị $f = \mathbf w\cdot\mathbf x + b$:</b> $P_1$: $5-3 = 2$; $P_2$: $3.5-3 = 0.5$; $P_3$: $2 - 3 = -1$; $P_4$: $4-3 = 1$.`,
      R`<b>Lề $m = y\cdot f$:</b> $P_1$: 2; $P_2$: 0.5; $P_3$: 1; $P_4$: $-1$.`,
      R`<b>Hinge $\max(0, 1-m)$:</b> $P_1$: 0 (an toàn); $P_2$: 0.5 (đúng phía nhưng nằm trong lề); $P_3$: 0 (vừa chạm lề: vectơ hỗ trợ); $P_4$: 2 (sai phía).`,
      R`<b>Tổng hinge:</b> 2.5. Thành phần chuẩn: $\frac12\|\mathbf w\|^2 = 1$. Với $C=1$: mục tiêu $= 3.5$.`,
      R`<b>Độ rộng lề:</b> $2/\|\mathbf w\| = 2/1.414 = 1.414$.`,
    ],
    ans: R`Hinge $[0, 0.5, 0, 2]$; $P_4$ bị phân loại sai; mục tiêu = 3.5.` },
  ex: [
    { q: R`Kernel RBF với $\gamma = 0.5$: tính $K(\mathbf a, \mathbf b)$ cho $\mathbf a = (0,0)$, $\mathbf b = (1,1)$ và $\mathbf c = (2,2)$.`, s: [R`$\|\mathbf a - \mathbf b\|^2 = 2$ → $e^{-1} = 0.368$.`, R`$\|\mathbf a - \mathbf c\|^2 = 8$ → $e^{-4} = 0.018$.`], a: R`0.368 và 0.018: kernel RBF là “độ giống nhau” giảm nhanh theo khoảng cách.` },
  ],
  miss: [[R`Mọi điểm đều ảnh hưởng ranh giới SVM.`, R`Chỉ vectơ hỗ trợ (điểm trên hoặc trong lề) ảnh hưởng.`]],
  recap: [R`Lề rộng nhất ⇔ $\|\mathbf w\|$ nhỏ nhất.`, R`Hinge loss $\max(0, 1 - y f)$.`, R`Kernel trick: tách phi tuyến không cần ánh xạ tường minh.`],
  papers: ['Cortes & Vapnik (1995) — Support-vector networks'] });

L({ id: 'tree', p: 'pml', t: 'Cây quyết định', en: 'Decision Trees', min: 75, pre: ['mlbasics', 'prob'],
  goals: ['Tính độ hỗn tạp Gini và entropy', 'Chọn phép tách tốt nhất bằng tay', 'Hiểu vì sao cây dễ quá khớp'],
  intuit: R`<p>Trò chơi “20 câu hỏi”: “Có phải con vật không? Có sống dưới nước không?…” Mỗi câu hỏi tốt chia các khả năng thành hai nhóm “sạch” hơn. Cây quyết định học đúng điều này: tìm câu hỏi (đặc trưng + ngưỡng) làm các nhóm con <b>thuần nhất</b> nhất. Kết quả đọc được như một quy trình kiểm tra: “nếu độ rộng mạch &lt; 70 µm và độ sáng &lt; 0.3 thì NG”.</p>`,
  body: R`
<h4>Độ hỗn tạp</h4>
<p>Với tỷ lệ các lớp $p_1,\dots,p_K$ trong một nút:</p>
$$\text{Gini} = 1 - \sum_k p_k^2,\qquad \text{Entropy} = -\sum_k p_k\log_2 p_k$$
<p>Nút thuần nhất (một lớp) có Gini = 0. Nút 50/50 có Gini = 0.5, entropy = 1.</p>
<h4>Chọn phép tách</h4>
<p>Thử mọi đặc trưng, mọi ngưỡng. Với mỗi phép tách, tính hỗn tạp <b>trung bình có trọng số</b> của hai nút con. Chọn phép tách giảm hỗn tạp nhiều nhất (information gain). Lặp lại đệ quy cho từng nút con.</p>
<h4>Dừng và cắt tỉa</h4>
<p>Cây mọc tới khi mỗi lá thuần nhất sẽ học thuộc dữ liệu (quá khớp). Giới hạn độ sâu, số mẫu tối thiểu mỗi lá, hoặc cắt tỉa sau khi mọc.</p>
<h4>Ưu điểm</h4>
<p>Dễ giải thích, không cần chuẩn hóa, xử lý được đặc trưng hỗn hợp số và phân loại. Yếu điểm: một cây đơn lẻ không ổn định và kém chính xác, nên thực tế dùng <b>rừng</b> hoặc <b>boosting</b> (bài kế).</p>`,
  w: 'tree',
  worked: { t: 'Chọn câu hỏi đầu tiên cho 10 bo mạch',
    setup: R`10 bo: 4 NG, 6 OK. Tách theo “độ rộng &lt; 70 µm?”: nhánh Có gồm 3 NG + 1 OK; nhánh Không gồm 1 NG + 5 OK. Tách theo “độ sáng &lt; 0.3?”: nhánh Có 2 NG + 2 OK; nhánh Không 2 NG + 4 OK. Phép tách nào tốt hơn?`,
    steps: [
      R`<b>Gini gốc:</b> $1 - (0.4^2 + 0.6^2) = 1 - 0.52 = 0.48$.`,
      R`<b>Tách theo độ rộng – nhánh Có (3/1):</b> $1 - (0.75^2 + 0.25^2) = 1 - 0.625 = 0.375$. <b>Nhánh Không (1/5):</b> $1 - ((1/6)^2 + (5/6)^2) = 1 - 0.722 = 0.278$.`,
      R`<b>Trung bình có trọng số:</b> $\frac4{10}0.375 + \frac6{10}0.278 = 0.15 + 0.167 = 0.317$. Gain $= 0.48 - 0.317 = 0.163$.`,
      R`<b>Tách theo độ sáng – nhánh Có (2/2):</b> 0.5. <b>Nhánh Không (2/4):</b> $1 - ((1/3)^2+(2/3)^2) = 0.444$.`,
      R`<b>Trung bình:</b> $0.4\cdot0.5 + 0.6\cdot0.444 = 0.2 + 0.267 = 0.467$. Gain $= 0.013$.`,
      R`<b>Kết luận:</b> chọn “độ rộng &lt; 70 µm” làm nút gốc (gain 0.163 so với 0.013).`,
    ],
    ans: R`Tách theo độ rộng mạch (Gini giảm từ 0.48 còn 0.317).` },
  ex: [
    { q: R`Tính entropy của nút có 3 NG, 1 OK.`, s: [R`$p = [0.75, 0.25]$.`, R`$-0.75\log_2 0.75 = 0.75\cdot0.415 = 0.311$.`, R`$-0.25\log_2 0.25 = 0.25\cdot2 = 0.5$.`], a: R`Entropy $\approx 0.811$ bit.` },
  ],
  miss: [[R`Cây sâu hơn luôn chính xác hơn.`, R`Trên tập train thì có; trên dữ liệu mới thì thường tệ hơn vì quá khớp.`]],
  recap: [R`Gini $= 1 - \sum p_k^2$.`, R`Chọn phép tách giảm hỗn tạp trung bình có trọng số nhiều nhất.`, R`Dễ giải thích; dùng ensemble để mạnh hơn.`],
  papers: ['Breiman et al. (1984) — Classification and Regression Trees (CART)', 'Quinlan (1986) — ID3'] });

L({ id: 'ensemble', p: 'pml', t: 'Rừng ngẫu nhiên & Gradient Boosting', en: 'Random Forest & Boosting', min: 90, pre: ['tree', 'calculus'],
  goals: ['Phân biệt bagging và boosting', 'Tính tay vài vòng gradient boosting', 'Biết vì sao XGBoost/LightGBM thống trị dữ liệu bảng'],
  intuit: R`<p><b>Bagging / rừng ngẫu nhiên</b> như hỏi ý kiến 100 người, mỗi người chỉ được xem một phần dữ liệu và một vài tiêu chí, rồi bỏ phiếu. Từng người có thể sai, nhưng sai theo những cách khác nhau nên trung bình lại đúng hơn.</p>
<p><b>Boosting</b> như một nhóm thợ sửa nối tiếp: người thứ nhất làm thô, người thứ hai chỉ sửa <b>phần sai</b> của người thứ nhất, người thứ ba sửa phần sai còn lại… Mỗi người yếu, nhưng chuỗi người sửa liên tiếp cho kết quả rất tốt.</p>`,
  body: R`
<h4>Rừng ngẫu nhiên (bagging)</h4>
<ol><li>Tạo $B$ tập dữ liệu bằng lấy mẫu có hoàn lại (bootstrap).</li><li>Mỗi tập huấn luyện một cây sâu; ở mỗi nút chỉ xét ngẫu nhiên một phần đặc trưng.</li><li>Dự đoán: bỏ phiếu (phân loại) hoặc trung bình (hồi quy).</li></ol>
<p>Trung bình nhiều mô hình ít tương quan làm <b>giảm phương sai</b>. Rừng khó quá khớp hơn một cây và gần như không cần tinh chỉnh.</p>
<h4>Gradient boosting</h4>
<p>Xây mô hình cộng dồn $F_M(x) = F_0 + \eta\sum_{m=1}^M h_m(x)$, mỗi cây nhỏ $h_m$ khớp với <b>phần dư</b> (với MSE) hay tổng quát hơn là gradient âm của loss:</p>
$$r_i^{(m)} = -\frac{\partial\mathcal L(y_i, F)}{\partial F}\Big|_{F=F_{m-1}(x_i)}\quad(\text{MSE: } r_i = y_i - F_{m-1}(x_i))$$
<p>Đây chính là gradient descent, nhưng bước đi trong “không gian hàm” thay vì không gian tham số. Learning rate $\eta$ nhỏ (0.05–0.1) + nhiều cây thường tốt nhất.</p>
<h4>XGBoost, LightGBM, CatBoost</h4>
<p>Các bản cài đặt tối ưu: thêm điều chuẩn, dùng đạo hàm bậc hai, chia bin đặc trưng, xử lý giá trị thiếu. Trên dữ liệu bảng (dữ liệu sản xuất, chất lượng, tài chính), chúng vẫn thường thắng mạng nơ-ron.</p>`,
  w: 'boost',
  worked: { t: 'Ba vòng gradient boosting trên 4 điểm',
    setup: R`Dữ liệu $(x, y)$: $(1, 2), (2, 4), (3, 7), (4, 9)$. Mỗi “cây” là một gốc cây (stump) tách tại $x \le 2.5$, dự đoán trung bình phần dư mỗi bên. $\eta = 1$ (cho dễ tính).`,
    steps: [
      R`<b>$F_0$ = trung bình $y$:</b> $(2+4+7+9)/4 = 5.5$. Phần dư $r = [-3.5, -1.5, 1.5, 3.5]$.`,
      R`<b>Cây 1:</b> bên trái ($x\le2.5$): trung bình $(-3.5-1.5)/2 = -2.5$; bên phải: $2.5$. $F_1 = [3, 3, 8, 8]$.`,
      R`<b>Phần dư mới:</b> $y - F_1 = [-1, 1, -1, 1]$. MSE giảm từ $(12.25+2.25+2.25+12.25)/4 = 7.25$ xuống $1$.`,
      R`<b>Cây 2</b> cũng tách tại 2.5: trái trung bình $(-1+1)/2 = 0$, phải $0$. Không cải thiện! Stump tại 2.5 đã hết việc.`,
      R`<b>Cây 2 tách khác</b>, tại $x\le1.5$: trái ($x=1$): $-1$; phải ($x=2,3,4$): $(1-1+1)/3 = 0.333$. $F_2 = [2, 3.333, 8.333, 8.333]$; phần dư $[0, 0.667, -1.333, 0.667]$; MSE $= (0 + 0.444 + 1.778 + 0.444)/4 = 0.667$.`,
      R`<b>Bài học:</b> mỗi cây nhỏ chỉ cần sửa phần còn sai; thứ tự và vị trí tách được chọn lại ở mỗi vòng để giảm loss nhiều nhất.`,
    ],
    ans: R`MSE: 7.25 → 1.0 → 0.667 sau hai cây.` },
  ex: [
    { q: R`Bootstrap một tập 5 mẫu. Xác suất một mẫu cụ thể <b>không</b> được chọn lần nào? Với $n$ lớn?`, s: [R`Mỗi lần rút, xác suất không trúng là $4/5$.`, R`5 lần: $(0.8)^5 = 0.328$.`, R`$n$ lớn: $(1-1/n)^n\to e^{-1} = 0.368$.`], a: R`0.328; với $n$ lớn khoảng 36.8% mẫu nằm ngoài mỗi cây (dùng làm “out-of-bag” để đánh giá).` },
  ],
  miss: [[R`Boosting nhiều cây không bao giờ quá khớp.`, R`Có quá khớp nếu quá nhiều cây với $\eta$ lớn; dùng early stopping trên validation.`]],
  recap: [R`Bagging: nhiều cây song song, giảm phương sai.`, R`Boosting: cây nối tiếp, khớp phần dư/gradient.`, R`XGBoost/LightGBM: mặc định cho dữ liệu bảng.`],
  papers: ['Breiman (2001) — Random Forests', 'Friedman (2001) — Greedy Function Approximation: A Gradient Boosting Machine', 'Chen & Guestrin (2016) — XGBoost'] });

L({ id: 'kmeans', p: 'pml', t: 'Phân cụm k-means', en: 'k-Means Clustering', min: 60, pre: ['knn'],
  goals: ['Chạy tay các vòng gán–cập nhật của k-means', 'Chọn k bằng phương pháp khuỷu tay', 'Biết giới hạn của k-means'],
  intuit: R`<p>Chia 30 sinh viên thành 3 nhóm học sao cho mỗi người gần nhóm trưởng nhất. Ban đầu chọn bừa 3 nhóm trưởng. Mỗi người đứng về phía nhóm trưởng gần mình. Sau đó mỗi nhóm <b>dời “nhóm trưởng” tới giữa nhóm</b>. Lặp lại vài lần, các nhóm ổn định. Không ai cần nhãn: thuật toán tự tìm cấu trúc.</p>`,
  body: R`
<h4>Thuật toán (Lloyd)</h4>
<ol><li>Chọn $k$ tâm ban đầu (ngẫu nhiên, hoặc k-means++ để trải đều).</li>
<li><b>Gán:</b> mỗi điểm về tâm gần nhất.</li>
<li><b>Cập nhật:</b> mỗi tâm = trung bình các điểm của cụm.</li>
<li>Lặp đến khi không đổi.</li></ol>
<p>Hàm mục tiêu: tổng bình phương khoảng cách tới tâm (inertia) $J = \sum_i\|\mathbf x_i - \boldsymbol\mu_{c(i)}\|^2$. Mỗi bước gán và cập nhật đều không làm $J$ tăng, nên thuật toán hội tụ (tới cực tiểu cục bộ).</p>
<h4>Chọn k</h4>
<p>Vẽ $J$ theo $k$: $J$ luôn giảm khi $k$ tăng; chọn chỗ “khuỷu tay”, nơi tăng $k$ không còn giảm $J$ nhiều. Hoặc dùng chỉ số silhouette.</p>
<h4>Giới hạn</h4>
<p>Giả định cụm hình cầu, kích thước tương đương; nhạy với ngoại lai và với khởi tạo. Cụm hình dạng phức tạp dùng DBSCAN; cụm có xác suất dùng Gaussian Mixture (EM).</p>
<h4>Ứng dụng</h4>
<p>Gom nhóm các loại lỗi chưa đặt tên từ embedding ảnh, phân khúc khách hàng, lượng tử hóa màu, và chính VQ-VAE dùng ý tưởng sổ mã giống k-means.</p>`,
  w: 'kmeans',
  worked: { t: 'Một vòng k-means trên 6 điểm',
    setup: R`Điểm 1D: $[1, 2, 3, 8, 9, 10]$, $k=2$, tâm ban đầu $\mu_1 = 1$, $\mu_2 = 3$.`,
    steps: [
      R`<b>Gán vòng 1:</b> điểm 1 → $\mu_1$; điểm 2: cách $\mu_1$ 1, cách $\mu_2$ 1 (hòa, chọn $\mu_1$); 3, 8, 9, 10 → $\mu_2$.`,
      R`<b>Cập nhật:</b> $\mu_1 = (1+2)/2 = 1.5$; $\mu_2 = (3+8+9+10)/4 = 7.5$.`,
      R`<b>Gán vòng 2:</b> 1, 2, 3 gần 1.5 hơn (3 cách 1.5 là 1.5, cách 7.5 là 4.5) → cụm 1; 8, 9, 10 → cụm 2.`,
      R`<b>Cập nhật:</b> $\mu_1 = 2$, $\mu_2 = 9$.`,
      R`<b>Vòng 3:</b> gán không đổi → hội tụ. $J = (1+0+1) + (1+0+1) = 4$.`,
    ],
    ans: R`Cụm $\{1,2,3\}$ tâm 2 và $\{8,9,10\}$ tâm 9; $J = 4$.` },
  ex: [
    { q: R`Cùng dữ liệu, khởi tạo $\mu_1 = 9$, $\mu_2 = 10$. Kết quả sau khi hội tụ?`, s: [R`Gán: 1, 2, 3, 8, 9 → $\mu_1$ (gần 9 hơn 10); 10 → $\mu_2$.`, R`Cập nhật: $\mu_1 = 23/5 = 4.6$; $\mu_2 = 10$.`, R`Gán: 1, 2, 3 → 4.6; 8: cách 4.6 là 3.4, cách 10 là 2 → $\mu_2$; 9, 10 → $\mu_2$.`, R`Cập nhật: $\mu_1 = 2$, $\mu_2 = 9$. Hội tụ giống trước.`], a: R`Vẫn ra $\{1,2,3\}$ và $\{8,9,10\}$ sau 3 vòng. Dữ liệu tách rõ thì khởi tạo ít ảnh hưởng; dữ liệu phức tạp thì không như vậy.` },
  ],
  miss: [[R`k-means tìm được số cụm “đúng”.`, R`Bạn phải chọn $k$; thuật toán chỉ chia theo $k$ đã cho.`]],
  recap: [R`Lặp: gán về tâm gần nhất → cập nhật tâm = trung bình.`, R`Mục tiêu: tổng bình phương khoảng cách.`, R`Chọn $k$ bằng khuỷu tay hoặc silhouette.`],
  papers: ['Lloyd (1982) — Least squares quantization in PCM', 'Arthur & Vassilvitskii (2007) — k-means++'] });

L({ id: 'pca', p: 'pml', t: 'Giảm chiều: PCA', en: 'Principal Component Analysis', min: 75, pre: ['matmul', 'gauss'],
  goals: ['Tính ma trận hiệp phương sai và hướng chính', 'Chiếu dữ liệu xuống ít chiều hơn', 'Đọc tỷ lệ phương sai giải thích'],
  intuit: R`<p>Chụp ảnh một chiếc bút chì: chụp từ đầu bút thì chỉ thấy một chấm tròn (mất hết thông tin), chụp ngang thì thấy rõ cả chiều dài. PCA tìm <b>góc chụp giữ được nhiều thông tin nhất</b>, tức hướng mà dữ liệu trải rộng nhất. Hướng thứ hai vuông góc với hướng thứ nhất, và cứ thế.</p>`,
  body: R`
<h4>Các bước</h4>
<ol><li>Trừ trung bình mỗi đặc trưng.</li>
<li>Tính ma trận hiệp phương sai $\Sigma = \frac1n X^\top X$ ($d\times d$).</li>
<li>Tìm vectơ riêng và trị riêng của $\Sigma$: $\Sigma\mathbf v = \lambda\mathbf v$. Sắp $\lambda$ giảm dần.</li>
<li>Giữ $k$ vectơ riêng đầu tiên làm trục mới; chiếu: $Z = XV_k$.</li></ol>
<p>Trị riêng $\lambda_j$ là phương sai dữ liệu theo trục $j$. Tỷ lệ giải thích $= \lambda_j/\sum\lambda$.</p>
<h4>Dùng để làm gì</h4>
<ul><li>Trực quan hóa dữ liệu nhiều chiều (cùng với t-SNE, UMAP).</li><li>Nén đặc trưng, khử nhiễu, tăng tốc mô hình phía sau.</li><li>Phát hiện bất thường: lỗi tái tạo sau khi chiếu xuống rồi chiếu ngược lên (giống autoencoder tuyến tính). PaDiM dùng giảm chiều ngẫu nhiên theo tinh thần tương tự.</li></ul>
<h4>Liên hệ</h4>
<p>PCA chính là autoencoder <b>tuyến tính</b> tối ưu với loss MSE. Autoencoder phi tuyến là bản mở rộng của PCA.</p>`,
  w: 'pca',
  worked: { t: 'PCA cho 4 điểm 2D',
    setup: R`Dữ liệu đã trừ trung bình: $(2, 2), (-2, -2), (1, -1), (-1, 1)$.`,
    steps: [
      R`<b>Hiệp phương sai:</b> $\text{Var}(x) = (4+4+1+1)/4 = 2.5$; $\text{Var}(y) = 2.5$; $\text{Cov}(x,y) = (4+4-1-1)/4 = 1.5$. $\Sigma = \begin{bmatrix}2.5&1.5\\1.5&2.5\end{bmatrix}$.`,
      R`<b>Trị riêng:</b> ma trận dạng $\begin{bmatrix}a&b\\b&a\end{bmatrix}$ có trị riêng $a\pm b$: $\lambda_1 = 4$, $\lambda_2 = 1$.`,
      R`<b>Vectơ riêng:</b> $\mathbf v_1 = \frac1{\sqrt2}[1,1]$ (đường chéo), $\mathbf v_2 = \frac1{\sqrt2}[1,-1]$. Kiểm tra: $\Sigma[1,1] = [4,4] = 4\cdot[1,1]$ ✓.`,
      R`<b>Tỷ lệ giải thích:</b> $4/5 = 80\%$ theo trục 1, $20\%$ theo trục 2.`,
      R`<b>Chiếu xuống 1 chiều:</b> $z = \mathbf x\cdot\mathbf v_1$: $(2,2)\to 4/\sqrt2 = 2.83$; $(-2,-2)\to-2.83$; $(1,-1)\to0$; $(-1,1)\to0$. Phương sai của $z$: $(8+8+0+0)/4 = 4 = \lambda_1$ ✓.`,
    ],
    ans: R`Trục chính $[1,1]/\sqrt2$, giữ 80% phương sai; $z = [2.83, -2.83, 0, 0]$.` },
  ex: [
    { q: R`Trị riêng của một tập 5 đặc trưng: $[6, 2, 1, 0.6, 0.4]$. Cần giữ mấy thành phần để giải thích ≥ 90% phương sai?`, s: [R`Tổng $= 10$.`, R`Cộng dồn: 60%, 80%, 90%.`], a: R`3 thành phần.` },
  ],
  miss: [[R`PCA chọn các đặc trưng quan trọng nhất trong số đặc trưng gốc.`, R`PCA tạo đặc trưng <b>mới</b> là tổ hợp tuyến tính của mọi đặc trưng gốc.`], [R`Không cần chuẩn hóa trước PCA.`, R`Đặc trưng có đơn vị lớn sẽ chiếm trục chính. Thường chuẩn hóa trước.`]],
  recap: [R`Trừ trung bình → hiệp phương sai → vectơ riêng.`, R`Trị riêng = phương sai theo trục.`, R`PCA = autoencoder tuyến tính.`],
  papers: ['Pearson (1901) — On lines and planes of closest fit', 'Jolliffe — Principal Component Analysis'] });

L({ id: 'nbayes', p: 'pml', t: 'Định lý Bayes & Naive Bayes', en: 'Bayes Rule & Naive Bayes', min: 60, pre: ['prob'],
  goals: ['Áp dụng định lý Bayes bằng tay', 'Hiểu giả định “ngây thơ” độc lập có điều kiện', 'Dùng làm mịn Laplace'],
  intuit: R`<p>Máy kiểm tra báo một bo bị lỗi. Máy rất nhạy (bắt 99% lỗi) và ít báo giả (2%). Nhưng chỉ 1% bo thật sự lỗi. Hỏi: bo bị báo lỗi có thật sự lỗi không? Trực giác nói “gần như chắc chắn”, nhưng Bayes cho ra chỉ khoảng <b>33%</b>, vì số bo tốt quá đông nên 2% báo giả của chúng vẫn nhiều hơn số lỗi thật. Bayes dạy ta cập nhật niềm tin đúng cách khi có bằng chứng mới.</p>`,
  body: R`
<h4>Định lý Bayes</h4>
$$P(A\mid B) = \frac{P(B\mid A)\,P(A)}{P(B)},\qquad P(B) = \sum_a P(B\mid a)P(a)$$
<p>$P(A)$: niềm tin trước (prior). $P(B\mid A)$: khả năng (likelihood). $P(A\mid B)$: niềm tin sau khi thấy bằng chứng (posterior).</p>
<h4>Naive Bayes</h4>
<p>Với đặc trưng $x_1,\dots,x_d$, giả định chúng <b>độc lập khi đã biết lớp</b>:</p>
$$P(y\mid x_1..x_d)\propto P(y)\prod_{j} P(x_j\mid y)$$
<p>Giả định “ngây thơ” này hầu như không bao giờ đúng, nhưng mô hình vẫn phân loại tốt (đặc biệt văn bản), huấn luyện cực nhanh (chỉ đếm), cần ít dữ liệu.</p>
<h4>Làm mịn Laplace</h4>
<p>Nếu một từ chưa từng xuất hiện trong lớp, $P=0$ làm cả tích bằng 0. Cộng 1 vào mọi số đếm: $P(w\mid y) = \frac{\text{đếm}(w,y)+1}{\text{tổng}(y)+V}$.</p>
<h4>Bayes ở khắp nơi</h4>
<p>Lọc spam, phân loại ghi chú kỹ thuật, chẩn đoán; và là nền của mạng Bayes, HMM, bộ lọc Kalman (giai đoạn 8), cũng như cách hiểu loss như likelihood.</p>`,
  w: 'nbayes',
  worked: { t: 'Bo bị báo lỗi có thật sự lỗi không?',
    setup: R`$P(\text{lỗi}) = 0.01$. Máy báo lỗi với xác suất $0.99$ nếu bo lỗi, $0.02$ nếu bo tốt. Tính $P(\text{lỗi}\mid\text{báo})$.`,
    steps: [
      R`<b>Tử số:</b> $P(\text{báo}\mid\text{lỗi})P(\text{lỗi}) = 0.99\cdot0.01 = 0.0099$.`,
      R`<b>Báo giả:</b> $P(\text{báo}\mid\text{tốt})P(\text{tốt}) = 0.02\cdot0.99 = 0.0198$.`,
      R`<b>Mẫu số:</b> $P(\text{báo}) = 0.0099 + 0.0198 = 0.0297$.`,
      R`<b>Posterior:</b> $0.0099/0.0297 = 0.333$.`,
      R`<b>Bằng số đếm cho dễ hình dung:</b> 10.000 bo → 100 lỗi (99 bị báo) và 9.900 tốt (198 bị báo). Trong 297 bo bị báo, chỉ 99 lỗi thật: 33%.`,
      R`<b>Kiểm tra lần 2 độc lập</b> (máy khác, cùng thông số): prior mới 0.333. Tử $= 0.99\cdot0.333 = 0.330$; báo giả $= 0.02\cdot0.667 = 0.0133$; posterior $= 0.330/0.343 = 0.961$.`,
    ],
    ans: R`Sau 1 lần báo: 33%. Sau 2 lần báo độc lập: 96%.` },
  ex: [
    { q: R`Phân loại ghi chú vận hành “báo giả” hay “lỗi thật”. Trong 10 ghi chú lỗi thật, từ “đứt” xuất hiện 6 lần, “bụi” 1 lần; trong 10 ghi chú báo giả, “đứt” 1, “bụi” 7. Prior 0.5/0.5. Ghi chú mới chứa cả “đứt” và “bụi”. (Coi xác suất mỗi từ = số ghi chú chứa từ / 10, không làm mịn.)`, s: [R`Lỗi thật: $0.5\cdot0.6\cdot0.1 = 0.03$.`, R`Báo giả: $0.5\cdot0.1\cdot0.7 = 0.035$.`, R`Chuẩn hóa: lỗi thật $= 0.03/0.065 = 0.46$.`], a: R`46% lỗi thật, 54% báo giả: hơi nghiêng về báo giả.` },
  ],
  miss: [[R`Máy nhạy 99% thì kết quả dương tính đúng 99%.`, R`Còn phụ thuộc tỷ lệ nền (prior). Lớp hiếm làm posterior thấp hơn nhiều.`]],
  recap: [R`Posterior ∝ likelihood × prior.`, R`Naive Bayes: nhân xác suất từng đặc trưng.`, R`Làm mịn Laplace tránh xác suất 0.`],
  papers: ['Russell & Norvig — chương 12: Quantifying Uncertainty'] });
