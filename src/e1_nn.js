/* ===== Bài mới: Học máy là gì ===== */
L({ id: 'mlbasics', p: 'p1', t: 'Học máy là gì: dữ liệu, mô hình, hồi quy tuyến tính', en: 'Machine Learning Basics', min: 90, pre: ['calculus', 'vector'],
  goals: ['Phân biệt học có giám sát, không giám sát, tự giám sát, tăng cường', 'Tự khớp đường thẳng hồi quy bằng tay', 'Hiểu train/validation/test và quá khớp'],
  body: R`
<p>Lập trình truyền thống: con người viết <b>luật</b>, máy áp luật lên dữ liệu. Học máy đảo ngược: con người đưa <b>dữ liệu và đáp án</b>, máy tự tìm luật.</p>
<h4>Bốn kiểu học</h4>
<table class="tbl"><tr><th>Kiểu</th><th>Có gì</th><th>Ví dụ</th></tr>
<tr><td>Có giám sát</td><td>Đầu vào + nhãn đúng</td><td>Ảnh bo mạch → “xước / đứt / OK”</td></tr>
<tr><td>Không giám sát</td><td>Chỉ có đầu vào</td><td>Gom nhóm khách hàng, phát hiện bất thường</td></tr>
<tr><td>Tự giám sát</td><td>Tự tạo nhãn từ dữ liệu</td><td>Che 15% từ rồi đoán (BERT), đoán token tiếp theo (GPT), che mảnh ảnh (MAE)</td></tr>
<tr><td>Tăng cường</td><td>Môi trường + phần thưởng</td><td>Chơi cờ vây, điều khiển robot, RLHF cho chatbot</td></tr></table>
<h4>Ba thành phần của mọi bài học máy</h4>
<ol><li><b>Mô hình</b> $f_\theta$: dạng hàm có tham số $\theta$ (đường thẳng, mạng nơ-ron…).</li>
<li><b>Hàm mất mát</b> $\mathcal L$: đo mô hình sai bao nhiêu trên dữ liệu.</li>
<li><b>Thuật toán tối ưu</b>: chỉnh $\theta$ để $\mathcal L$ nhỏ (công thức đóng hoặc gradient descent).</li></ol>
<h4>Hồi quy tuyến tính: mô hình đơn giản nhất</h4>
<p>Mô hình $\hat y = wx + b$, loss MSE $\frac1n\sum(\hat y_i - y_i)^2$. Đặt đạo hàm bằng 0 được nghiệm đóng:</p>
$$w = \frac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2},\qquad b = \bar y - w\bar x$$
<p>Mạng nơ-ron chỉ là phiên bản “nhiều tầng, phi tuyến” của ý tưởng này, và không còn nghiệm đóng nên phải dùng gradient descent.</p>
<h4>Train, validation, test</h4>
<p><b>Train</b> để học tham số, <b>validation</b> để chọn siêu tham số (learning rate, số lớp, khi nào dừng), <b>test</b> chỉ dùng <i>một lần</i> ở cuối để báo cáo. Nhìn test nhiều lần rồi chỉnh mô hình là “học tủ”.</p>
<h4>Quá khớp và thiếu khớp</h4>
<p><b>Thiếu khớp</b> (underfitting): mô hình quá đơn giản, sai cả trên train. <b>Quá khớp</b> (overfitting): mô hình học thuộc cả nhiễu, train rất tốt nhưng test tệ. Dấu hiệu: loss train tiếp tục giảm trong khi loss validation bắt đầu tăng.</p>`,
  w: 'linreg',
  papers: ['Hastie, Tibshirani, Friedman — The Elements of Statistical Learning (chương 3)'] });

A('mlbasics', {
  intuit: R`<p>Bạn muốn đoán giá thuê phòng trọ ở Thủ Đức theo diện tích. Bạn hỏi 4 phòng: 15 m² giá 2.5 triệu, 20 m² 3.0 triệu, 25 m² 4.0 triệu, 30 m² 4.5 triệu. Bạn kẻ một đường thẳng “đi giữa” 4 điểm này trên giấy. Đường đó chính là <b>mô hình</b>; độ dốc của nó (thêm 1 m² thì thêm bao nhiêu tiền) là <b>tham số học được</b>.</p>
<p><b>Train/test</b> giống ôn thi: bạn luyện trên đề cương (train), thử sức bằng đề thi thử (validation), và chỉ có một lần thi thật (test). Học thuộc lòng đáp án đề cương thì điểm thi thử cao nhưng thi thật trượt: đó là quá khớp.</p>`,
  worked: { t: 'Khớp đường thẳng giá phòng trọ bằng tay',
    setup: R`Dữ liệu $(x, y)$ = (diện tích m², giá triệu đồng): $(15, 2.5), (20, 3.0), (25, 4.0), (30, 4.5)$. Tìm $w, b$ của $\hat y = wx+b$ theo MSE, rồi dự đoán giá phòng 22 m².`,
    steps: [
      R`<b>Trung bình:</b> $\bar x = (15+20+25+30)/4 = 22.5$; $\bar y = (2.5+3.0+4.0+4.5)/4 = 3.5$.`,
      R`<b>Độ lệch:</b> $x_i-\bar x = [-7.5, -2.5, 2.5, 7.5]$; $y_i - \bar y = [-1.0, -0.5, 0.5, 1.0]$.`,
      R`<b>Tử số</b> $\sum(x_i-\bar x)(y_i-\bar y) = 7.5 + 1.25 + 1.25 + 7.5 = 17.5$.`,
      R`<b>Mẫu số</b> $\sum(x_i-\bar x)^2 = 56.25+6.25+6.25+56.25 = 125$.`,
      R`<b>Hệ số:</b> $w = 17.5/125 = 0.14$ triệu/m²; $b = 3.5 - 0.14\cdot22.5 = 3.5-3.15 = 0.35$ triệu.`,
      R`<b>Kiểm tra sai số:</b> dự đoán $[2.45, 3.15, 3.85, 4.55]$, sai số $[-0.05, 0.15, -0.15, 0.05]$, MSE $= (0.0025+0.0225+0.0225+0.0025)/4 = 0.0125$. Tổng sai số bằng 0 (tính chất của nghiệm bình phương tối thiểu).`,
      R`<b>Dự đoán:</b> phòng 22 m²: $0.14\cdot22 + 0.35 = 3.43$ triệu.`,
    ],
    ans: R`$\hat y = 0.14x + 0.35$. Mỗi m² thêm khoảng 140 nghìn đồng; phòng 22 m² ≈ 3.43 triệu.` },
  ex: [
    { q: R`Với cùng dữ liệu, làm một bước gradient descent từ $w=0, b=0$, $\eta=0.001$. Gradient của MSE là $\frac{\partial\mathcal L}{\partial w} = \frac2n\sum(\hat y_i-y_i)x_i$, $\frac{\partial\mathcal L}{\partial b} = \frac2n\sum(\hat y_i - y_i)$.`, s: [R`Với $w=b=0$, mọi $\hat y_i = 0$, sai số $\hat y - y = [-2.5,-3,-4,-4.5]$.`, R`$\sum(\hat y-y)x = -37.5 - 60 - 100 - 135 = -332.5$; nhân $\frac24$: $-166.25$.`, R`$\sum(\hat y - y) = -14$; nhân $\frac24$: $-7$.`, R`Cập nhật: $w = 0 - 0.001\cdot(-166.25) = 0.166$; $b = 0 + 0.007 = 0.007$.`], a: R`$w\approx0.166$, $b=0.007$. Một bước đã đưa $w$ về gần nghiệm 0.14; $b$ học chậm hơn nhiều vì gradient nhỏ hơn (đây là lý do nên chuẩn hóa $x$).` },
    { q: R`Một mô hình đạt loss train 0.01 nhưng loss validation 0.80. Mô hình bị gì và bạn sẽ thử những gì?`, s: [R`Khoảng cách train–validation rất lớn: dấu hiệu quá khớp.`, R`Giải pháp về dữ liệu: thêm dữ liệu, tăng cường dữ liệu.`, R`Giải pháp về mô hình: mô hình nhỏ hơn, dropout, weight decay, dừng sớm.`], a: R`Quá khớp. Ưu tiên thêm/tăng cường dữ liệu, sau đó điều chuẩn và dừng sớm.` },
  ],
  miss: [[R`Độ chính xác trên tập train càng cao càng tốt.`, R`Chỉ số quan trọng là trên dữ liệu <b>chưa thấy</b> (validation/test).`], [R`Dùng tập test để chọn số epoch.`, R`Đó là việc của validation. Dùng test để chọn gì cũng làm kết quả báo cáo bị lạc quan giả.`]],
  recap: [R`Học máy = mô hình + hàm mất mát + tối ưu.`, R`Hồi quy tuyến tính có nghiệm đóng $w=\text{cov}/\text{var}$.`, R`Train để học, validation để chọn, test để báo cáo một lần.`],
});

A('neuron', {
  intuit: R`<p>Một nơ-ron giống <b>nhân viên duyệt hồ sơ vay</b>. Ba thông tin: thu nhập, số năm đi làm, số nợ hiện có. Anh ta có “trọng số” trong đầu: thu nhập quan trọng (+0.5), kinh nghiệm cũng tốt (+0.3), nợ là điểm trừ (−0.8). Cộng điểm có trọng số, trừ đi “độ khó tính” (bias), rồi quyết định duyệt hay không (hàm kích hoạt).</p>
<p>Huấn luyện là quá trình nhân viên này rút kinh nghiệm: mỗi lần duyệt sai, anh ta chỉnh lại mức độ coi trọng từng tiêu chí.</p>`,
  worked: { t: 'Huấn luyện perceptron học phép OR',
    setup: R`Dữ liệu OR: $(0,0)\to0$, $(0,1)\to1$, $(1,0)\to1$, $(1,1)\to1$. Bắt đầu $\mathbf w=[0,0]$, $b=0$, $\eta = 1$. Đầu ra $\hat y = 1$ nếu $z = \mathbf w\cdot\mathbf x+b > 0$, ngược lại 0. Quy tắc: $\mathbf w \leftarrow \mathbf w + \eta(y-\hat y)\mathbf x$, $b\leftarrow b + \eta(y-\hat y)$.`,
    steps: [
      R`<b>Mẫu (0,0), y=0:</b> $z=0$, $\hat y=0$. Đúng, không đổi.`,
      R`<b>Mẫu (0,1), y=1:</b> $z = 0$, $\hat y = 0$. Sai, $y-\hat y = 1$. Cập nhật $\mathbf w = [0,0]+[0,1] = [0,1]$, $b = 1$.`,
      R`<b>Mẫu (1,0), y=1:</b> $z = 0 + 0 + 1 = 1 > 0$, $\hat y = 1$. Đúng.`,
      R`<b>Mẫu (1,1), y=1:</b> $z = 0+1+1 = 2$, $\hat y=1$. Đúng.`,
      R`<b>Vòng 2, mẫu (0,0):</b> $z = b = 1 > 0$, $\hat y=1$ nhưng $y=0$. Sai, $y-\hat y=-1$: $\mathbf w = [0,1]$ (vì $\mathbf x=0$), $b = 0$.`,
      R`<b>(0,1):</b> $z=1$, đúng. <b>(1,0):</b> $z = 0$, $\hat y = 0$, sai → $\mathbf w = [1,1]$, $b = 1$. <b>(1,1):</b> $z=3$ đúng.`,
      R`<b>Vòng 3:</b> (0,0): $z=1$ sai → $b=0$. (0,1): $z=1$ đúng. (1,0): $z=1$ đúng. (1,1): $z=2$ đúng.`,
      R`<b>Vòng 4:</b> (0,0): $z=0$ → 0 đúng; ba mẫu còn lại $z\ge1$ đúng. Không còn lỗi, thuật toán dừng.`,
    ],
    ans: R`$\mathbf w=[1,1]$, $b=0$ (với ngưỡng $z>0$). Đường ranh giới $x_1+x_2=0$ tách (0,0) khỏi ba điểm còn lại.` },
  ex: [
    { q: R`$\mathbf w=[0.5,-1]$, $b=0.2$, $\mathbf x=[2,1]$, kích hoạt ReLU. Tính đầu ra.`, s: [R`Nhân: $0.5\cdot2 = 1$; $-1\cdot1 = -1$.`, R`Cộng và thêm bias: $1 - 1 + 0.2 = 0.2$.`, R`ReLU(0.2) = 0.2.`], a: R`$a = 0.2$.` },
    { q: R`Tìm $\mathbf w, b$ để nơ-ron bậc thang thực hiện phép AND.`, s: [R`Cần $z>0$ chỉ với $(1,1)$.`, R`Chọn $\mathbf w=[1,1]$: $z$ lần lượt là $b, 1+b, 1+b, 2+b$.`, R`Cần $1+b\le0$ và $2+b>0$, tức $-2\lt b\le-1$. Chọn $b=-1.5$.`], a: R`$\mathbf w=[1,1], b=-1.5$.` },
    { q: R`Vì sao không có $\mathbf w, b$ nào làm được XOR?`, s: [R`Cần $b\le0$ (từ (0,0)), $w_1+b>0$, $w_2+b>0$, $w_1+w_2+b\le0$.`, R`Cộng hai bất đẳng thức giữa: $w_1+w_2+2b>0$.`, R`Từ cái cuối: $w_1+w_2\le -b$, nên $w_1+w_2+2b\le b\le0$. Mâu thuẫn.`], a: R`Không tồn tại: XOR không tách được tuyến tính.` },
  ],
  miss: [[R`Nơ-ron nhân tạo mô phỏng chính xác nơ-ron sinh học.`, R`Chỉ lấy cảm hứng rất thô. Đó là một hàm toán học: tổng có trọng số + phi tuyến.`], [R`Bias không quan trọng.`, R`Không có bias, ranh giới luôn phải đi qua gốc tọa độ.`]],
  recap: [R`$a=f(\mathbf w\cdot\mathbf x+b)$.`, R`Một nơ-ron = một nhát cắt thẳng.`, R`XOR cần ít nhất hai lớp.`],
});

A('activation', {
  intuit: R`<p>Hàm tuyến tính như một <b>chiếc thước thẳng</b>: nối bao nhiêu thước thẳng lại vẫn chỉ vẽ được đường thẳng. Hàm kích hoạt là <b>khớp gối</b> cho phép “bẻ cong”. Có đủ nhiều khớp gối, bạn uốn được mọi hình dạng.</p>
<p>ReLU giống <b>van một chiều</b>: tín hiệu âm bị chặn, tín hiệu dương đi qua nguyên vẹn. Sigmoid giống <b>núm vặn âm lượng có giới hạn</b>: vặn quá mức cũng chỉ tới 0 hoặc 1, và ở hai đầu nó gần như “cứng” lại (gradient gần 0).</p>`,
  worked: { t: 'Chứng minh bằng số: hai lớp tuyến tính = một lớp',
    setup: R`Lớp 1: $\mathbf h = W_1\mathbf x$ với $W_1=\begin{bmatrix}1&-1\\2&0\end{bmatrix}$. Lớp 2: $y = W_2\mathbf h$ với $W_2 = [1, 1]$. Thử $\mathbf x = [1, 2]$, có và không có ReLU.`,
    steps: [
      R`<b>Không ReLU:</b> $\mathbf h = [1\cdot1 - 1\cdot2,\ 2\cdot1+0] = [-1, 2]$; $y = -1 + 2 = 1$.`,
      R`<b>Gộp hai ma trận:</b> $W_2W_1 = [1\cdot1+1\cdot2,\ 1\cdot(-1)+1\cdot0] = [3, -1]$. Thử: $3\cdot1 - 1\cdot2 = 1$. Bằng nhau: hai lớp chỉ là một lớp $[3,-1]$.`,
      R`<b>Có ReLU:</b> $\mathbf h = \text{ReLU}([-1, 2]) = [0, 2]$; $y = 0+2 = 2$.`,
      R`<b>Không gộp được nữa:</b> kết quả 2 không bằng $[3,-1]\cdot\mathbf x = 1$. ReLU đã “tắt” nơ-ron thứ nhất cho đầu vào này; với đầu vào khác nó có thể bật. Mạng giờ là hàm tuyến tính <i>từng khúc</i>.`,
    ],
    ans: R`Không phi tuyến: $y = 1$ (giống một lớp). Có ReLU: $y = 2$, hàm không còn tuyến tính.` },
  ex: [
    { q: R`Tính $\sigma(0)$, $\sigma(2)$, $\sigma'(2)$.`, s: [R`$\sigma(0) = 1/(1+1) = 0.5$.`, R`$\sigma(2) = 1/(1+e^{-2}) = 1/1.1353 = 0.881$.`, R`$\sigma'(2) = 0.881\cdot(1-0.881) = 0.105$.`], a: R`$0.5$; $0.881$; $0.105$.` },
    { q: R`Gradient đi qua 5 lớp sigmoid, mỗi lớp nhân thêm $\sigma'(z)$ với $z=2$. Còn lại bao nhiêu phần? Nếu là ReLU với $z>0$?`, s: [R`Sigmoid: $0.105^5$.`, R`$0.105^2 = 0.011$; $^4 = 0.000122$; $^5\approx1.3\times10^{-5}$.`, R`ReLU: $1^5 = 1$.`], a: R`Sigmoid: còn $\approx 0.0013\%$ (tiêu biến). ReLU: giữ nguyên.` },
  ],
  miss: [[R`ReLU không khả vi tại 0 nên không dùng được với gradient descent.`, R`Thực tế lấy đạo hàm tại 0 bằng 0 (hoặc 1); xác suất rơi đúng 0 gần như bằng không.`], [R`Hàm kích hoạt nào cũng như nhau.`, R`Chọn sai có thể làm mạng không học: sigmoid ở mạng sâu gây tiêu biến gradient.`]],
  recap: [R`Không phi tuyến thì mạng sâu = một lớp tuyến tính.`, R`ReLU cho CNN, GELU/SwiGLU cho Transformer.`, R`Sigmoid/tanh bão hòa → gradient nhỏ.`],
});

A('mlp', {
  intuit: R`<p>Bạn có một tờ giấy với chấm đỏ ở hai góc chéo và chấm xanh ở hai góc còn lại (XOR). Một nhát kéo thẳng không thể tách đỏ khỏi xanh. Nhưng nếu bạn <b>gấp tờ giấy</b> theo đường chéo, hai góc đỏ chồng lên nhau, và giờ một nhát cắt là đủ.</p>
<p>Lớp ẩn của MLP chính là “gấp giấy”: nó biến đổi không gian để lớp sau chỉ cần một nhát cắt thẳng. Mạng càng sâu thì gấp được càng nhiều lần, tạo hình dạng càng phức tạp.</p>`,
  worked: { t: 'Forward pass MLP 2→2→1 giải XOR, từng con số',
    setup: R`$W^{(1)} = \begin{bmatrix}1&1\\1&1\end{bmatrix}$, $\mathbf b^{(1)} = [0,-1]$, ReLU, $W^{(2)} = [1,-2]$, $b^{(2)}=0$. Tính đầu ra cho cả 4 đầu vào.`,
    steps: [
      R`<b>Đầu vào (0,0):</b> $\mathbf z^{(1)} = [0+0+0,\ 0+0-1] = [0,-1]$; $\mathbf h = [0, 0]$; $y = 0 - 0 = 0$. ✓`,
      R`<b>(0,1):</b> $\mathbf z^{(1)} = [1, 0]$; $\mathbf h = [1, 0]$; $y = 1$. ✓`,
      R`<b>(1,0):</b> giống hệt (0,1) vì $W^{(1)}$ đối xứng: $y=1$. ✓`,
      R`<b>(1,1):</b> $\mathbf z^{(1)} = [2, 1]$; $\mathbf h = [2,1]$; $y = 2 - 2 = 0$. ✓`,
      R`<b>Nhìn lớp ẩn:</b> bốn điểm thành $(0,0), (1,0), (1,0), (2,1)$. Hai điểm “1” chồng lên nhau: tờ giấy đã được gấp. Đường $h_1 - 2h_2 = 0.5$ tách được.`,
      R`<b>Đếm tham số:</b> $2\cdot2+2 + 2\cdot1+1 = 9$.`,
    ],
    ans: R`Đầu ra $[0,1,1,0]$ khớp XOR với 9 tham số.` },
  ex: [
    { q: R`Đếm tham số MLP $3\to4\to2$.`, s: [R`Lớp 1: $3\cdot4$ trọng số + 4 bias = 16.`, R`Lớp 2: $4\cdot2 + 2 = 10$.`], a: R`26.` },
    { q: R`MLP $784\to512\to512\to10$ cho MNIST có bao nhiêu tham số? Lớp nào chiếm nhiều nhất?`, s: [R`$784\cdot512+512 = 401{,}920$.`, R`$512\cdot512+512 = 262{,}656$.`, R`$512\cdot10+10 = 5{,}130$.`, R`Tổng $669{,}706$.`], a: R`≈ 670 nghìn tham số; lớp đầu chiếm 60%.` },
  ],
  miss: [[R`Mạng càng rộng càng tốt.`, R`Mạng sâu thường biểu diễn hiệu quả hơn mạng rộng với cùng số tham số; nhưng sâu quá cần residual và chuẩn hóa.`]],
  recap: [R`MLP = (Linear → kích hoạt) lặp lại.`, R`Tham số mỗi lớp $d_{in}d_{out}+d_{out}$.`, R`Lớp ẩn “gấp” không gian cho lớp sau.`],
});

A('loss', {
  intuit: R`<p>Hai thầy chấm bài. <b>Thầy MSE</b> phạt theo bình phương: sai 1 điểm trừ 1, sai 3 điểm trừ 9. Thầy rất ghét lỗi lớn, nên một bài làm sai nặng có thể kéo cả lớp. <b>Thầy MAE</b> phạt tỷ lệ thuận: sai 3 trừ 3, bình tĩnh hơn với các trường hợp kỳ quặc.</p>
<p><b>Focal loss</b> là thầy giáo chủ nhiệm biết tập trung: học sinh đã giỏi (mẫu dễ, đoán đúng tự tin) thì thầy gần như không để ý; thầy dồn thời gian kèm học sinh yếu (mẫu khó, thường là lớp lỗi hiếm).</p>`,
  worked: { t: 'Một ngoại lai làm MSE và MAE khác nhau thế nào',
    setup: R`Nhãn thật $y = [10, 12, 11, 50]$ (giá trị 50 là ngoại lai do nhập sai). Mô hình A dự đoán $[10, 12, 11, 12]$ (bỏ qua ngoại lai); mô hình B dự đoán $[20, 20, 20, 20]$. Tính MSE và MAE.`,
    steps: [
      R`<b>Sai số A:</b> $[0,0,0,-38]$. MSE $= 38^2/4 = 1444/4 = 361$. MAE $= 38/4 = 9.5$.`,
      R`<b>Sai số B:</b> $[10, 8, 9, -30]$. MSE $= (100+64+81+900)/4 = 1145/4 = 286.25$. MAE $= (10+8+9+30)/4 = 14.25$.`,
      R`<b>So sánh:</b> theo MSE, B “tốt hơn” A (286 < 361) dù B sai mọi điểm bình thường. Theo MAE, A tốt hơn (9.5 < 14.25).`,
      R`<b>Kết luận:</b> MSE bị ngoại lai kéo mạnh. Khi dữ liệu có nhãn nhiễu, cân nhắc MAE hoặc Huber loss.`,
    ],
    ans: R`MSE: A = 361, B = 286.25. MAE: A = 9.5, B = 14.25. Hai loss chọn hai mô hình khác nhau.` },
  ex: [
    { q: R`$p_t = 0.9$ (mẫu dễ) và $p_t = 0.3$ (mẫu khó), $\gamma=2$. Tính CE và focal cho mỗi mẫu, rồi tỷ lệ đóng góp khó/dễ.`, s: [R`Dễ: CE $=-\ln0.9 = 0.105$; focal $= 0.1^2\cdot0.105 = 0.00105$.`, R`Khó: CE $= -\ln0.3 = 1.204$; focal $= 0.7^2\cdot1.204 = 0.49\cdot1.204 = 0.590$.`, R`Tỷ lệ khó/dễ: CE $1.204/0.105 \approx 11.5$; focal $0.590/0.00105\approx562$.`], a: R`Focal làm mẫu khó quan trọng gấp ~562 lần mẫu dễ (CE chỉ ~11.5 lần).` },
    { q: R`Mask thật $[1,1,0,0]$, dự đoán $[0.9, 0.5, 0.1, 0]$. Tính Dice loss.`, s: [R`Giao $\sum p_ig_i = 0.9+0.5 = 1.4$.`, R`$\sum p_i = 1.5$, $\sum g_i = 2$.`, R`Dice $= 2\cdot1.4/3.5 = 0.8$.`], a: R`Dice loss $= 0.2$.` },
  ],
  miss: [[R`Loss nhỏ hơn thì mô hình tốt hơn, bất kể loss nào.`, R`Chỉ so được trong cùng một loss và cùng dữ liệu. Thước đo cuối cùng là metric nghiệp vụ (recall lỗi, mAP…).`]],
  recap: [R`MSE phạt lỗi lớn mạnh; MAE bền với ngoại lai.`, R`CE cho phân loại; focal cho mất cân bằng.`, R`Dice cho phân đoạn vùng nhỏ.`],
});

A('backprop', {
  intuit: R`<p>Nhà máy có dây chuyền 3 trạm: cắt → khoan → hàn. Cuối dây chuyền phát hiện sản phẩm lỗi. Để sửa, bạn <b>truy ngược</b>: lỗi ở mối hàn do trạm hàn chịu bao nhiêu phần, do lỗ khoan lệch bao nhiêu phần, do cắt sai bao nhiêu phần. Mỗi trạm chỉ cần biết “đầu ra của tôi ảnh hưởng tới trạm sau bao nhiêu” (đạo hàm cục bộ), rồi chuyền trách nhiệm ngược lên.</p>
<p>Backprop tự động hóa việc “chia trách nhiệm” này cho hàng triệu tham số, chỉ với chi phí khoảng gấp đôi một lần forward.</p>`,
  worked: { t: 'Backprop qua mạng 2 lớp, đầy đủ con số',
    setup: R`$x = 2$, nhãn $t = 1$. Lớp 1: $z_1 = w_1x$, $h = \text{ReLU}(z_1)$. Lớp 2: $\hat y = w_2h$. Loss $L = \frac12(\hat y - t)^2$. Bắt đầu $w_1 = 0.5$, $w_2 = 2$, $\eta = 0.1$.`,
    steps: [
      R`<b>Forward:</b> $z_1 = 0.5\cdot2 = 1$; $h = \text{ReLU}(1) = 1$; $\hat y = 2\cdot1 = 2$; $L = \frac12(2-1)^2 = 0.5$.`,
      R`<b>Bắt đầu từ cuối:</b> $\frac{\partial L}{\partial\hat y} = \hat y - t = 1$.`,
      R`<b>Gradient cho $w_2$:</b> $\hat y = w_2h$ nên $\frac{\partial\hat y}{\partial w_2} = h = 1$. Vậy $\frac{\partial L}{\partial w_2} = 1\cdot1 = 1$.`,
      R`<b>Truyền về $h$:</b> $\frac{\partial\hat y}{\partial h} = w_2 = 2$, nên $\frac{\partial L}{\partial h} = 1\cdot2 = 2$.`,
      R`<b>Qua ReLU:</b> $z_1 = 1 > 0$ nên ReLU cho gradient đi qua (nhân 1): $\frac{\partial L}{\partial z_1} = 2$.`,
      R`<b>Gradient cho $w_1$:</b> $\frac{\partial z_1}{\partial w_1} = x = 2$, nên $\frac{\partial L}{\partial w_1} = 2\cdot2 = 4$.`,
      R`<b>Cập nhật:</b> $w_1 = 0.5 - 0.1\cdot4 = 0.1$; $w_2 = 2 - 0.1\cdot1 = 1.9$.`,
      R`<b>Forward lại:</b> $z_1=0.2$, $h=0.2$, $\hat y = 0.38$, $L = \frac12(0.38-1)^2 = 0.192$. Loss giảm từ 0.5 xuống 0.192. (Bước hơi mạnh: $\hat y$ vọt từ 2 xuống 0.38, qua cả đích 1. Bước tiếp sẽ quay lại.)`,
    ],
    ans: R`$\partial L/\partial w_1 = 4$, $\partial L/\partial w_2 = 1$; sau một bước loss 0.5 → 0.192.` },
  ex: [
    { q: R`$z=wx+b$, $a=\sigma(z)$, $L=\frac12(a-y)^2$ với $w=0.8, b=-0.5, x=1.5, y=1$. Tính $\partial L/\partial w$.`, s: [R`Forward: $z = 1.2-0.5 = 0.7$; $a = \sigma(0.7) = 0.668$.`, R`$\partial L/\partial a = a - y = -0.332$.`, R`$\partial a/\partial z = 0.668\cdot0.332 = 0.222$.`, R`$\partial L/\partial z = -0.332\cdot0.222 = -0.0737$.`, R`$\partial L/\partial w = -0.0737\cdot1.5 = -0.111$.`], a: R`$\approx -0.111$: tăng $w$ sẽ giảm loss.` },
    { q: R`Lớp Linear $3\to2$ nhận $\mathbf x=[1,0,2]$, gradient từ phía sau $\boldsymbol\delta=[0.5,-1]$, $W=\begin{bmatrix}1&0&1\\0&2&-1\end{bmatrix}$. Tính $\partial L/\partial W$ và $\partial L/\partial\mathbf x$.`, s: [R`$\partial L/\partial W = \boldsymbol\delta\mathbf x^\top$: hàng 1 $= 0.5\cdot[1,0,2] = [0.5, 0, 1]$; hàng 2 $= -1\cdot[1,0,2] = [-1,0,-2]$.`, R`$\partial L/\partial\mathbf x = W^\top\boldsymbol\delta$: thành phần 1 $= 1\cdot0.5 + 0\cdot(-1) = 0.5$; 2: $0\cdot0.5 + 2\cdot(-1) = -2$; 3: $1\cdot0.5 + (-1)(-1) = 1.5$.`], a: R`$\partial L/\partial W = \begin{bmatrix}0.5&0&1\\-1&0&-2\end{bmatrix}$, $\partial L/\partial\mathbf x = [0.5, -2, 1.5]$.` },
  ],
  miss: [[R`Backprop là một thuật toán học riêng biệt.`, R`Backprop chỉ <b>tính gradient</b>. Việc học (cập nhật) là của optimizer (SGD, Adam).`], [R`Không cần lưu giá trị forward.`, R`Backward cần $x$, $h$, $z$ từ forward. Đó là lý do huấn luyện tốn bộ nhớ hơn suy luận rất nhiều.`]],
  recap: [R`Forward lưu giá trị → backward nhân đạo hàm cục bộ từ cuối về đầu.`, R`Linear: $\partial W = \boldsymbol\delta\mathbf x^\top$, $\partial\mathbf x = W^\top\boldsymbol\delta$.`, R`ReLU: cho gradient qua nếu $z>0$.`],
});

A('optim', {
  intuit: R`<p><b>SGD</b> là người xuống núi trong sương, mỗi bước đi theo độ dốc dưới chân. Trong một thung lũng hẹp dài, anh ta cứ nhảy qua lại hai bên vách mà tiến rất chậm dọc thung lũng.</p>
<p><b>Momentum</b> là hòn bi lăn: nó nhớ vận tốc cũ, nên các cú nhảy qua lại triệt tiêu nhau, còn chuyển động dọc thung lũng thì tích lũy và nhanh dần.</p>
<p><b>Adam</b> là người đi giày tự điều chỉnh: ở hướng nào mặt đất luôn dốc mạnh thì bước ngắn lại, hướng nào thoai thoải thì bước dài ra. Mỗi tham số có “cỡ bước” riêng.</p>`,
  worked: { t: 'Ba bước SGD và Momentum trên $f(w)=w^2$',
    setup: R`$f(w) = w^2$, $f'(w) = 2w$, bắt đầu $w_0 = 4$, $\eta = 0.1$, momentum $\beta = 0.9$, $v_0 = 0$.`,
    steps: [
      R`<b>SGD bước 1:</b> $g = 8$; $w_1 = 4 - 0.8 = 3.2$. <b>Bước 2:</b> $g=6.4$; $w_2 = 3.2-0.64 = 2.56$. <b>Bước 3:</b> $g = 5.12$; $w_3 = 2.048$. Mỗi bước nhân $w$ với $0.8$.`,
      R`<b>Momentum bước 1:</b> $v_1 = 0.9\cdot0 + 8 = 8$; $w_1 = 4 - 0.1\cdot8 = 3.2$ (giống SGD).`,
      R`<b>Momentum bước 2:</b> $g = 6.4$; $v_2 = 0.9\cdot8 + 6.4 = 13.6$; $w_2 = 3.2 - 1.36 = 1.84$.`,
      R`<b>Momentum bước 3:</b> $g = 3.68$; $v_3 = 0.9\cdot13.6 + 3.68 = 15.92$; $w_3 = 1.84 - 1.592 = 0.248$.`,
      R`<b>So sánh:</b> sau 3 bước SGD ở 2.048, Momentum ở 0.248, gần đích 0 hơn nhiều. Nhưng vận tốc lớn sẽ làm nó vượt qua 0 rồi quay lại (dao động tắt dần).`,
    ],
    ans: R`Sau 3 bước: SGD $w=2.048$, Momentum $w=0.248$.` },
  ex: [
    { q: R`Adam bước 1 với $g=0.2$, $\beta_1=0.9$, $\beta_2=0.999$, $\eta=0.01$. Tính độ lớn bước cập nhật.`, s: [R`$m_1 = 0.1\cdot0.2 = 0.02$; $v_1 = 0.001\cdot0.04 = 0.00004$.`, R`Hiệu chỉnh: $\hat m = 0.02/0.1 = 0.2$; $\hat v = 0.00004/0.001 = 0.04$.`, R`Bước $= 0.01\cdot0.2/\sqrt{0.04} = 0.01\cdot0.2/0.2 = 0.01$.`], a: R`$0.01$, đúng bằng $\eta$, bất kể độ lớn gradient. Đây là lý do Adam ít nhạy với tỷ lệ của gradient.` },
    { q: R`Với $f(w)=w^2$ và SGD, $\eta$ phải nằm trong khoảng nào để hội tụ?`, s: [R`$w_{t+1} = w_t - \eta\cdot2w_t = (1-2\eta)w_t$.`, R`Hội tụ khi $|1-2\eta|<1$.`, R`Tức $0<\eta<1$. Với $\eta = 0.5$: về 0 ngay một bước. Với $\eta>1$: phân kỳ.`], a: R`$0<\eta<1$.` },
  ],
  miss: [[R`Adam luôn tốt hơn SGD.`, R`Với CNN phân loại, SGD + momentum được tinh chỉnh tốt thường tổng quát hóa ngang hoặc hơn. Adam/AdamW là mặc định cho Transformer.`], [R`Learning rate càng nhỏ càng an toàn.`, R`Quá nhỏ thì học rất chậm và dễ kẹt. Tìm lr bằng thử nghiệm (lr range test) và dùng warmup + giảm dần.`]],
  recap: [R`SGD: $\theta -= \eta g$.`, R`Momentum: tích lũy vận tốc. Adam: bước riêng mỗi tham số.`, R`AdamW + warmup + cosine là cấu hình chuẩn cho Transformer.`],
});

A('norm', {
  intuit: R`<p>Hai lớp thi cùng môn: lớp A chấm thang 10, lớp B chấm thang 100. Muốn so sánh học sinh, bạn quy về “đứng ở đâu so với trung bình, cách bao nhiêu độ lệch chuẩn”. Đó là chuẩn hóa.</p>
<p><b>BatchNorm</b> so mỗi học sinh với <b>cả lớp hôm nay</b> (các mẫu trong batch), theo từng môn. <b>LayerNorm</b> so mỗi học sinh với <b>chính các môn của mình</b>: môn nào trội, môn nào kém so với trung bình bản thân. Vì không cần “cả lớp”, LayerNorm dùng được cả khi chỉ có một học sinh (batch = 1) hay chuỗi dài ngắn khác nhau.</p>
<p><b>Dropout</b> như cho ngẫu nhiên vài thành viên nhóm nghỉ mỗi buổi tập: cả đội phải học cách không phụ thuộc vào một người.</p>`,
  worked: { t: 'BatchNorm cho một đặc trưng trên batch 4 mẫu',
    setup: R`Một kênh có giá trị trên batch: $[2, 4, 6, 8]$. Tham số học được $\gamma = 2$, $\beta = 1$, bỏ qua $\epsilon$.`,
    steps: [
      R`<b>Trung bình:</b> $\mu = (2+4+6+8)/4 = 5$.`,
      R`<b>Phương sai:</b> độ lệch $[-3,-1,1,3]$, bình phương $[9,1,1,9]$, trung bình $\sigma^2 = 5$; $\sigma = \sqrt5\approx2.236$.`,
      R`<b>Chuẩn hóa:</b> $\hat x = [-3,-1,1,3]/2.236 = [-1.342, -0.447, 0.447, 1.342]$. Giờ trung bình 0, độ lệch chuẩn 1.`,
      R`<b>Co giãn và dời:</b> $y = 2\hat x + 1 = [-1.683, 0.106, 1.894, 3.683]$.`,
      R`<b>Vì sao cần $\gamma, \beta$?</b> Để mạng có thể “hoàn tác” chuẩn hóa nếu cần: nếu học được $\gamma = \sigma$, $\beta = \mu$ thì $y = x$ như ban đầu.`,
      R`<b>Lúc suy luận:</b> không có batch, nên dùng $\mu, \sigma$ trung bình trượt đã lưu trong lúc train (<code>model.eval()</code>). Quên gọi eval là lỗi kinh điển.`,
    ],
    ans: R`$y \approx [-1.683, 0.106, 1.894, 3.683]$.` },
  ex: [
    { q: R`LayerNorm của $[2,4,6]$ ($\gamma=1,\beta=0$).`, s: [R`$\mu = 4$.`, R`$\sigma^2 = (4+0+4)/3 = 2.667$, $\sigma = 1.633$.`, R`$\hat x = [-2, 0, 2]/1.633$.`], a: R`$[-1.225, 0, 1.225]$.` },
    { q: R`Dropout $p=0.5$ trên $[2,4,6,8]$ với mặt nạ $[1,0,0,1]$. Đầu ra khi train và khi suy luận?`, s: [R`Train: giữ vị trí 1 và 4, nhân $\frac1{1-0.5}=2$: $[4,0,0,16]$.`, R`Kiểm tra kỳ vọng: trung bình mỗi phần tử vẫn bằng giá trị gốc.`, R`Suy luận: không tắt gì, không nhân gì: $[2,4,6,8]$.`], a: R`Train $[4,0,0,16]$; suy luận $[2,4,6,8]$.` },
  ],
  miss: [[R`BatchNorm hoạt động tốt với batch size 1–2.`, R`Thống kê batch quá nhỏ rất nhiễu. Dùng GroupNorm/LayerNorm khi batch nhỏ (như huấn luyện Diffusion hay ảnh độ phân giải cao).`]],
  recap: [R`Chuẩn hóa = trừ trung bình, chia độ lệch, rồi $\gamma\hat x + \beta$.`, R`BN theo batch (CNN), LN theo đặc trưng (Transformer).`, R`Dropout chỉ bật khi train.`],
});
