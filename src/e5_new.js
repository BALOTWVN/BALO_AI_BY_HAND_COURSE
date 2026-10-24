/* ===== Bài mới giai đoạn 6 ===== */
L({ id: 'gnn', p: 'p6', t: 'Mạng nơ-ron đồ thị (GNN)', en: 'Graph Neural Networks', min: 75, pre: ['mlp', 'matmul'],
  goals: ['Biểu diễn dữ liệu dạng đồ thị bằng ma trận kề', 'Tính tay một bước truyền thông điệp (message passing)', 'Biết các ứng dụng: phân tử, mạng xã hội, mạch điện'],
  body: R`
<p>Nhiều dữ liệu không phải lưới (ảnh) hay chuỗi (văn bản) mà là <b>đồ thị</b>: phân tử (nguyên tử – liên kết), mạng xã hội, bản đồ giao thông, netlist mạch điện (linh kiện – đường nối).</p>
<h4>Biểu diễn</h4>
<p>Đồ thị $n$ nút: ma trận đặc trưng $X\in\mathbb R^{n\times d}$ và ma trận kề $A\in\{0,1\}^{n\times n}$ ($A_{ij} = 1$ nếu nút $i$ nối nút $j$).</p>
<h4>Truyền thông điệp</h4>
<p>Mỗi lớp, mỗi nút <b>gom thông tin từ hàng xóm</b> rồi cập nhật chính mình:</p>
$$\mathbf h_i^{(l+1)} = \sigma\Big(W\cdot\text{AGG}\big(\{\mathbf h_j^{(l)} : j\in\mathcal N(i)\cup\{i\}\}\big)\Big)$$
<p>Với GCN, phép gom là trung bình có chuẩn hóa: $H^{(l+1)} = \sigma(\hat D^{-1/2}\hat A\hat D^{-1/2}H^{(l)}W)$, trong đó $\hat A = A + I$ (thêm vòng tự nối).</p>
<h4>Liên hệ</h4>
<ul><li>CNN là GNN trên đồ thị lưới (mỗi pixel nối 8 hàng xóm, có trọng số theo vị trí).</li>
<li>Transformer là GNN trên <b>đồ thị đầy đủ</b>, với trọng số cạnh (attention) học từ nội dung.</li></ul>
<p>Sau $L$ lớp, mỗi nút “biết” về vùng lân cận bán kính $L$, giống trường tiếp nhận.</p>
<h4>Ứng dụng nổi bật</h4>
<p>Dự đoán tính chất phân tử và thuốc, dự báo thời tiết (GraphCast dùng GNN trên lưới cầu), hệ gợi ý, phát hiện gian lận, thiết kế chip (đặt linh kiện).</p>`,
  w: 'gnn',
  papers: ['Kipf & Welling (2017) — GCN', 'Veličković et al. (2018) — Graph Attention Networks', 'Lam et al. (2023) — GraphCast'] });

L({ id: 'rl', p: 'p6', t: 'Học tăng cường (RL)', en: 'Reinforcement Learning', min: 120, pre: ['prob', 'optim'],
  goals: ['Hiểu tác tử, trạng thái, hành động, phần thưởng', 'Tính tay cập nhật Q-learning', 'Thấy mối nối giữa RL và RLHF của chatbot'],
  body: R`
<p>Không có đáp án đúng cho từng bước, chỉ có <b>phần thưởng</b> (thường đến muộn). Tác tử phải tự thử, sai, và rút kinh nghiệm.</p>
<h4>Khung MDP</h4>
<p>Ở trạng thái $s$, tác tử chọn hành động $a$, nhận thưởng $r$, chuyển sang $s'$. Mục tiêu: tối đa tổng thưởng có chiết khấu $G = r_0 + \gamma r_1 + \gamma^2r_2 + \dots$ với $0<\gamma<1$.</p>
<h4>Giá trị Q và phương trình Bellman</h4>
<p>$Q(s,a)$ = tổng thưởng kỳ vọng nếu ở $s$ làm $a$ rồi sau đó chơi tối ưu:</p>
$$Q(s,a) = r + \gamma\max_{a'}Q(s',a')$$
<h4>Q-learning</h4>
$$Q(s,a)\leftarrow Q(s,a) + \alpha\Big[\underbrace{r + \gamma\max_{a'}Q(s',a')}_{\text{mục tiêu}} - Q(s,a)\Big]$$
<p>Cập nhật dần ước lượng về phía “thưởng nhận được + giá trị tốt nhất của bước sau”. Để khám phá, dùng $\varepsilon$-greedy: thỉnh thoảng chọn hành động ngẫu nhiên.</p>
<h4>Từ Q-table đến học sâu</h4>
<ul><li><b>DQN</b>: mạng nơ-ron xấp xỉ $Q$, chơi Atari từ pixel (2015).</li>
<li><b>Policy gradient / PPO</b>: học thẳng chính sách $\pi_\theta(a|s)$, tăng xác suất hành động dẫn tới thưởng cao: $\nabla J = \mathbb E[\nabla\log\pi_\theta(a|s)\,A(s,a)]$.</li>
<li><b>AlphaGo / AlphaZero</b>: RL + tìm kiếm cây Monte Carlo.</li>
<li><b>RLHF</b>: mô hình thưởng học từ đánh giá của con người, rồi PPO tinh chỉnh LLM để tối đa thưởng. Các mô hình “suy luận” gần đây được huấn luyện thêm bằng RL với phần thưởng kiểm chứng được (toán, code).</li></ul>`,
  w: 'qlearn',
  papers: ['Sutton & Barto — Reinforcement Learning: An Introduction', 'Mnih et al. (2015) — DQN', 'Schulman et al. (2017) — PPO', 'Ouyang et al. (2022) — InstructGPT (RLHF)'] });

L({ id: 'rag', p: 'p6', t: 'RAG & AI Agent', en: 'Retrieval & Agents', min: 90, pre: ['llm', 'contrastive'],
  goals: ['Hiểu quy trình RAG: chia nhỏ, nhúng, truy hồi, sinh', 'Tính tay truy hồi bằng cosine', 'Hiểu vòng lặp agent: suy nghĩ → gọi công cụ → quan sát'],
  body: R`
<p>LLM chỉ biết những gì có trong dữ liệu huấn luyện và có thể “bịa”. Hai kỹ thuật giúp nó làm việc với thông tin thật và hành động trong thế giới:</p>
<h4>RAG (Retrieval-Augmented Generation)</h4>
<ol><li><b>Chia nhỏ</b> tài liệu (ví dụ quy trình kiểm tra AOI, tiêu chuẩn IPC) thành đoạn 200–500 token.</li>
<li><b>Nhúng</b> mỗi đoạn thành vector bằng mô hình embedding, lưu vào cơ sở dữ liệu vector.</li>
<li>Khi có câu hỏi: nhúng câu hỏi, <b>tìm k đoạn gần nhất</b> theo cosine.</li>
<li>Đưa câu hỏi + các đoạn đó vào prompt; LLM trả lời <b>dựa trên</b> tài liệu và trích nguồn.</li></ol>
<p>Cải tiến thường gặp: tìm kiếm lai (từ khóa BM25 + vector), xếp hạng lại (reranker), chia đoạn theo cấu trúc tài liệu.</p>
<h4>AI Agent</h4>
<p>Agent là LLM chạy trong <b>vòng lặp</b>: đọc mục tiêu → lập kế hoạch → gọi công cụ (tìm kiếm, chạy code, truy vấn cơ sở dữ liệu, điều khiển trình duyệt) → đọc kết quả → quyết định bước tiếp, cho đến khi xong.</p>
$$\text{mục tiêu} \to [\text{suy nghĩ} \to \text{hành động} \to \text{quan sát}]^{*} \to \text{kết quả}$$
<p>Các thành phần: mô hình nền, mô tả công cụ (schema), bộ nhớ (ngắn hạn trong ngữ cảnh, dài hạn qua RAG), và cơ chế kiểm soát (giới hạn quyền, xác nhận của con người). Các giao thức chuẩn như MCP giúp kết nối agent với công cụ và dữ liệu theo một cách thống nhất.</p>
<h4>Đánh giá</h4>
<p>Đo theo tỷ lệ hoàn thành tác vụ thật (sửa lỗi code, thao tác máy tính, trả lời có trích dẫn đúng), không chỉ theo độ trôi chảy của văn bản.</p>`,
  w: 'rag',
  papers: ['Lewis et al. (2020) — Retrieval-Augmented Generation', 'Yao et al. (2023) — ReAct', 'Schick et al. (2023) — Toolformer'] });

A('gnn', {
  intuit: R`<p>Trong lớp học, điểm của bạn ảnh hưởng bởi nhóm bạn chơi thân. GNN mô hình hóa đúng điều đó: mỗi người (nút) cập nhật “hồ sơ” của mình bằng cách <b>lắng nghe hồ sơ của bạn bè</b> (hàng xóm). Sau 1 vòng, bạn biết về bạn bè; sau 2 vòng, biết cả bạn của bạn bè.</p>
<p>Với mạch in: một linh kiện bất thường thường ảnh hưởng các linh kiện nối với nó. GNN trên netlist có thể lan truyền tín hiệu “đáng ngờ” theo đường nối.</p>`,
  worked: { t: 'Một lớp truyền thông điệp trung bình trên đồ thị 4 nút',
    setup: R`Đồ thị: 1–2, 2–3, 3–4 (dạng chuỗi). Đặc trưng 1 chiều $x = [4, 0, 2, 6]$. Gom = trung bình của chính nút và hàng xóm, rồi nhân $w = 0.5$, ReLU.`,
    steps: [
      R`<b>Hàng xóm (gồm chính mình):</b> nút 1: {1,2}; nút 2: {1,2,3}; nút 3: {2,3,4}; nút 4: {3,4}.`,
      R`<b>Trung bình:</b> nút 1: $(4+0)/2 = 2$; nút 2: $(4+0+2)/3 = 2$; nút 3: $(0+2+6)/3 = 2.667$; nút 4: $(2+6)/2 = 4$.`,
      R`<b>Nhân $w$ và ReLU:</b> $h^{(1)} = [1, 1, 1.333, 2]$.`,
      R`<b>Dạng ma trận:</b> $\hat A = A + I$, chia mỗi hàng cho bậc: hàng 2 là $[\frac13,\frac13,\frac13,0]$. $H^{(1)} = \text{ReLU}(\hat D^{-1}\hat AXw)$, đúng kết quả trên.`,
      R`<b>Lớp thứ 2:</b> nút 1: $(1+1)/2\cdot0.5 = 0.5$; nút 4: $(1.333+2)/2\cdot0.5 = 0.833$. Giờ nút 1 đã nhận chút thông tin từ nút 3 (cách 2 bước).`,
    ],
    ans: R`$h^{(1)} = [1, 1, 1.333, 2]$. Giá trị “san bằng” dần theo hàng xóm.` },
  ex: [
    { q: R`Đồ thị tam giác 1–2–3–1, $x=[3,0,0]$, gom trung bình gồm chính mình, không có $w$. Sau 1 lớp và 2 lớp?`, s: [R`Mỗi nút nối hai nút còn lại: trung bình cả 3 nút.`, R`Lớp 1: mọi nút $= 1$.`, R`Lớp 2: vẫn $1$.`], a: R`$[1,1,1]$ sau một lớp: thông tin lan đều. Nhiều lớp quá làm mọi nút giống nhau (over-smoothing).` },
  ],
  miss: [[R`GNN cần đồ thị có thứ tự nút cố định.`, R`Phép gom (trung bình, tổng, max) không phụ thuộc thứ tự, nên GNN bất biến với hoán vị nút.`]],
  recap: [R`Nút cập nhật bằng cách gom hàng xóm.`, R`$L$ lớp ↔ tầm nhìn $L$ bước.`, R`CNN = GNN trên lưới; Transformer = GNN trên đồ thị đầy đủ.`],
});

A('rl', {
  intuit: R`<p>Dạy chó ngồi: bạn không giải thích “gập chân sau 90 độ”. Chó thử đủ thứ, khi tình cờ ngồi thì được bánh thưởng. Dần dần nó gắn “ngồi” với “bánh”. Khó khăn: phần thưởng đến <b>muộn</b>. Trong cờ vây, chỉ biết thắng thua sau 200 nước; nước nào đã quyết định thắng thua?</p>
<p>Giá trị $Q$ như <b>bảng kinh nghiệm</b>: “ở tình huống này mà làm việc kia thì về lâu dài được bao nhiêu điểm”. Q-learning cập nhật bảng đó mỗi lần thử, kéo ước lượng cũ về phía “thưởng vừa nhận + giá trị tốt nhất của bước tiếp theo”.</p>`,
  worked: { t: 'Q-learning trên hành lang 4 ô',
    setup: R`Hành lang ô 0–1–2–3. Ô 3 là đích (thưởng +10, kết thúc). Mỗi bước khác thưởng $-1$. Hành động: trái, phải. $\gamma = 0.9$, $\alpha = 0.5$. Bảng Q khởi đầu bằng 0.`,
    steps: [
      R`<b>Lượt 1, ở ô 2, đi phải → ô 3 (đích), $r = +10$:</b> mục tiêu $= 10 + 0$ (kết thúc nên không có bước sau). $Q(2,\text{phải}) = 0 + 0.5(10 - 0) = 5$.`,
      R`<b>Lượt 2, ở ô 1, đi phải → ô 2, $r = -1$:</b> $\max Q(2,\cdot) = 5$. Mục tiêu $= -1 + 0.9\cdot5 = 3.5$. $Q(1,\text{phải}) = 0 + 0.5\cdot3.5 = 1.75$.`,
      R`<b>Lượt 3, ở ô 0, đi phải → ô 1, $r=-1$:</b> mục tiêu $= -1 + 0.9\cdot1.75 = 0.575$. $Q(0,\text{phải}) = 0.2875$.`,
      R`<b>Lượt 4, ở ô 2, lại đi phải:</b> $Q(2,\text{phải}) = 5 + 0.5(10 - 5) = 7.5$.`,
      R`<b>Lượt 5, ở ô 1, đi trái → ô 0, $r=-1$:</b> mục tiêu $= -1 + 0.9\cdot0.2875 = -0.741$. $Q(1,\text{trái}) = -0.371$. Giờ ở ô 1, “phải” (1.75) tốt hơn “trái” (−0.37).`,
      R`<b>Quan sát:</b> giá trị của đích lan ngược dần từ ô 2 về ô 0, mỗi ô xa hơn bị nhân $\gamma$ và trừ chi phí bước. Giá trị hội tụ: $Q(2,\text{phải}) = 10$, $Q(1,\text{phải}) = -1 + 9 = 8$, $Q(0,\text{phải}) = -1 + 7.2 = 6.2$.`,
    ],
    ans: R`Sau 5 lượt: $Q(2,\text{phải})=7.5$, $Q(1,\text{phải})=1.75$, $Q(0,\text{phải})=0.29$, $Q(1,\text{trái})=-0.37$; hội tụ về 10, 8, 6.2.` },
  ex: [
    { q: R`Tổng thưởng chiết khấu của chuỗi thưởng $[-1, -1, 10]$ với $\gamma = 0.9$?`, s: [R`$G = -1 + 0.9\cdot(-1) + 0.81\cdot10$.`, R`$= -1 - 0.9 + 8.1$.`], a: R`$G = 6.2$, đúng bằng $Q(0,\text{phải})$ hội tụ.` },
    { q: R`$\varepsilon$-greedy với $\varepsilon = 0.1$ và 2 hành động. Xác suất chọn hành động tốt nhất?`, s: [R`90%: chọn tham lam (hành động tốt nhất).`, R`10%: chọn ngẫu nhiên, trong đó 50% trúng hành động tốt nhất.`], a: R`$0.9 + 0.05 = 0.95$.` },
  ],
  miss: [[R`RL chỉ dùng cho game.`, R`RL đứng sau RLHF của chatbot, điều khiển robot, tối ưu lịch sản xuất, làm mát trung tâm dữ liệu.`]],
  recap: [R`Tác tử – trạng thái – hành động – thưởng.`, R`Q-learning: $Q \mathrel{+}= \alpha(r + \gamma\max Q' - Q)$.`, R`RLHF = mô hình thưởng + PPO trên LLM.`],
});

A('rag', {
  intuit: R`<p>LLM thuần giống học sinh đi thi <b>không được mang tài liệu</b>: nhớ gì viết nấy, không nhớ thì có khi bịa. RAG cho phép <b>mang tài liệu vào phòng thi</b>: trước khi trả lời, tra đúng trang liên quan rồi mới viết. Agent thì như nhân viên thực tập được giao việc: biết dùng máy tính, tra cứu, gửi email, rồi báo cáo kết quả; mỗi bước phải tự quyết định làm gì tiếp.</p>`,
  worked: { t: 'Truy hồi top-2 bằng cosine',
    setup: R`Câu hỏi: “Lỗi đứt mạch xử lý thế nào?” nhúng thành $\mathbf q = [0.9, 0.1, 0.4]$. Ba đoạn tài liệu: $\mathbf d_1$ “Quy trình xử lý đứt mạch” $= [0.8, 0.2, 0.5]$; $\mathbf d_2$ “Lịch bảo trì máy AOI” $= [0.1, 0.9, 0.2]$; $\mathbf d_3$ “Tiêu chuẩn độ rộng đường mạch” $= [0.6, 0.1, 0.7]$.`,
    steps: [
      R`<b>Độ dài:</b> $\|\mathbf q\| = \sqrt{0.81+0.01+0.16} = 0.990$; $\|\mathbf d_1\| = \sqrt{0.64+0.04+0.25} = 0.964$; $\|\mathbf d_2\| = \sqrt{0.01+0.81+0.04} = 0.927$; $\|\mathbf d_3\| = \sqrt{0.36+0.01+0.49} = 0.927$.`,
      R`<b>Tích vô hướng:</b> $\mathbf q\cdot\mathbf d_1 = 0.72+0.02+0.20 = 0.94$; $\mathbf q\cdot\mathbf d_2 = 0.09+0.09+0.08 = 0.26$; $\mathbf q\cdot\mathbf d_3 = 0.54+0.01+0.28 = 0.83$.`,
      R`<b>Cosine:</b> $d_1$: $0.94/(0.990\cdot0.964) = 0.985$; $d_2$: $0.26/(0.990\cdot0.927) = 0.283$; $d_3$: $0.83/(0.990\cdot0.927) = 0.904$.`,
      R`<b>Top-2:</b> $d_1$ (0.985) và $d_3$ (0.904). Bỏ $d_2$.`,
      R`<b>Prompt cuối:</b> “Dựa vào [đoạn 1] và [đoạn 3], trả lời: Lỗi đứt mạch xử lý thế nào? Trích nguồn.” LLM trả lời dựa trên tài liệu thật của nhà máy.`,
    ],
    ans: R`Truy hồi $d_1$ (0.985) và $d_3$ (0.904).` },
  ex: [
    { q: R`Agent được giao: “Tổng hợp tỷ lệ lỗi tuần này và gửi cho trưởng ca.” Liệt kê vòng lặp suy nghĩ → hành động → quan sát và chỗ cần con người xác nhận.`, s: [R`Suy nghĩ: cần dữ liệu lỗi → hành động: truy vấn cơ sở dữ liệu AOI → quan sát: bảng số liệu.`, R`Suy nghĩ: cần tính tỷ lệ → hành động: chạy code → quan sát: kết quả, biểu đồ.`, R`Suy nghĩ: soạn báo cáo → hành động: viết email nháp.`, R`Gửi email là hành động không hoàn tác được → dừng để con người xác nhận.`], a: R`Ba vòng công cụ (truy vấn, tính toán, soạn), và một điểm xác nhận trước khi gửi.` },
  ],
  miss: [[R`RAG xóa bỏ hoàn toàn chuyện “bịa”.`, R`Giảm mạnh nếu truy hồi đúng; truy hồi sai đoạn thì mô hình vẫn trả lời sai. Phải đánh giá riêng chất lượng truy hồi.`]],
  recap: [R`RAG: chia đoạn → nhúng → tìm gần nhất → sinh có trích dẫn.`, R`Agent: vòng lặp suy nghĩ – hành động – quan sát.`, R`Hành động không hoàn tác cần con người duyệt.`],
});
