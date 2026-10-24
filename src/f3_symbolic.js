/* ===== Giai đoạn: AI biểu tượng, xác suất & tiến hóa ===== */
L({ id: 'search', p: 'psym', t: 'Tìm kiếm: BFS, Dijkstra, A*', en: 'Search & A*', min: 90, pre: ['aitypes'],
  goals: ['Mô hình hóa bài toán thành trạng thái và hành động', 'Chạy tay BFS và A*', 'Hiểu heuristic chấp nhận được'],
  intuit: R`<p>Tìm đường trong mê cung bằng cách nào? <b>BFS</b> như đổ nước vào lối vào: nước lan đều mọi ngả, tới đích theo đường ngắn nhất về số bước, nhưng lan khắp nơi. <b>A*</b> như người có la bàn chỉ hướng đích: vẫn thận trọng, nhưng ưu tiên lối đi vừa đã đi ít vừa “có vẻ” gần đích. Google Maps, robot kho, nhân vật trong game đều dùng ý tưởng này.</p>`,
  body: R`
<h4>Mô hình hóa</h4>
<p>Một bài toán tìm kiếm gồm: trạng thái đầu, tập hành động, mô hình chuyển trạng thái, kiểm tra đích, chi phí mỗi bước. Lời giải là chuỗi hành động từ đầu tới đích.</p>
<h4>Không có thông tin</h4>
<ul><li><b>BFS:</b> mở rộng theo từng lớp độ sâu; tối ưu khi mọi bước cùng chi phí.</li>
<li><b>DFS:</b> đi sâu một nhánh trước; tốn ít bộ nhớ, không đảm bảo tối ưu.</li>
<li><b>Dijkstra (uniform cost):</b> luôn mở rộng nút có tổng chi phí $g(n)$ nhỏ nhất; tối ưu với chi phí không âm.</li></ul>
<h4>A*</h4>
$$f(n) = g(n) + h(n)$$
<p>$g(n)$: chi phí đã đi; $h(n)$: ước lượng chi phí còn lại tới đích. Luôn mở rộng nút có $f$ nhỏ nhất. Nếu $h$ <b>không bao giờ ước lượng quá</b> chi phí thật (chấp nhận được), A* tìm ra đường tối ưu. Ví dụ trên lưới: khoảng cách Manhattan $|x-x^*| + |y-y^*|$.</p>
<h4>Ngày nay</h4>
<p>Tìm kiếm vẫn là xương sống của lập lịch, định tuyến, lập kế hoạch robot; và kết hợp với học sâu trong AlphaGo (MCTS), và trong cách các LLM “suy luận” bằng cách thử nhiều hướng rồi chọn.</p>`,
  w: 'astar',
  worked: { t: 'A* trên đồ thị 5 thành phố',
    setup: R`Cạnh (km): S–A 2, S–B 5, A–B 2, A–C 6, B–C 2, C–G 1, B–G 6. Heuristic (đường chim bay tới G): $h(S)=6, h(A)=5, h(B)=3, h(C)=1, h(G)=0$. Tìm đường S → G.`,
    steps: [
      R`<b>Mở S:</b> $g=0$. Hàng đợi: A ($g=2$, $f=2+5=7$), B ($g=5$, $f=5+3=8$).`,
      R`<b>Lấy A</b> ($f=7$ nhỏ nhất). Láng giềng: B qua A: $g=4$, $f=7$ (tốt hơn B cũ $g=5$, cập nhật); C qua A: $g=8$, $f=9$.`,
      R`<b>Hàng đợi:</b> B ($f=7$), C ($f=9$). <b>Lấy B</b> ($g=4$). Láng giềng: C qua B: $g=6$, $f=7$ (tốt hơn 8, cập nhật); G qua B: $g=10$, $f=10$.`,
      R`<b>Hàng đợi:</b> C ($f=7$), G ($f=10$). <b>Lấy C</b> ($g=6$). G qua C: $g=7$, $f=7$ (tốt hơn 10).`,
      R`<b>Lấy G</b> ($f=7$): tới đích. Truy ngược: G ← C ← B ← A ← S.`,
      R`<b>Kết quả:</b> S → A → B → C → G, dài $2+2+2+1 = 7$ km. Đường trực tiếp S → B → G dài 11; S → B → C → G dài 8. A* chỉ mở 4 nút thay vì quét toàn bộ.`,
    ],
    ans: R`S–A–B–C–G, tổng 7 km.` },
  ex: [
    { q: R`Trên lưới 5×5 không vật cản, đi 4 hướng, từ (0,0) tới (4,4). Heuristic Manhattan tại (0,0)? Có chấp nhận được không? Nếu dùng $h = 2\times$Manhattan?`, s: [R`$h = 4 + 4 = 8$.`, R`Đường ngắn nhất thật cũng là 8 bước, nên $h$ không vượt quá: chấp nhận được.`, R`$h = 16 > 8$: ước lượng quá, A* chạy nhanh hơn nhưng có thể trả đường không tối ưu khi có vật cản.`], a: R`8; chấp nhận được. $2\times$ Manhattan không còn đảm bảo tối ưu.` },
  ],
  miss: [[R`Heuristic càng lớn càng tốt.`, R`Lớn quá (vượt chi phí thật) thì mất đảm bảo tối ưu. Heuristic tốt là sát nhưng không vượt.`]],
  recap: [R`Bài toán = trạng thái, hành động, chi phí, đích.`, R`A*: $f = g + h$, mở nút $f$ nhỏ nhất.`, R`$h$ chấp nhận được ⇒ đường tối ưu.`],
  papers: ['Hart, Nilsson & Raphael (1968) — A formal basis for the heuristic determination of minimum cost paths', 'Russell & Norvig — chương 3'] });

L({ id: 'games', p: 'psym', t: 'Trò chơi đối kháng: Minimax & MCTS', en: 'Adversarial Search', min: 75, pre: ['search'],
  goals: ['Tính minimax trên cây trò chơi', 'Cắt tỉa alpha–beta bằng tay', 'Hiểu MCTS trong AlphaGo'],
  intuit: R`<p>Chơi cờ tướng, bạn nghĩ: “nếu mình đi nước này, đối thủ sẽ đáp trả <b>tệ nhất cho mình</b>, rồi mình lại chọn nước tốt nhất…” Minimax chính là suy nghĩ đó: mình tối đa hóa, đối thủ tối thiểu hóa, xen kẽ từng tầng. Alpha–beta là mẹo “thôi khỏi xét nhánh này nữa, đằng nào đối thủ cũng không để mình đi tới đó”.</p>`,
  body: R`
<h4>Minimax</h4>
$$V(s) = \begin{cases}\text{điểm}(s) & s \text{ là lá}\\ \max_a V(s') & \text{lượt MAX}\\ \min_a V(s') & \text{lượt MIN}\end{cases}$$
<p>Tính từ lá ngược lên gốc. Với cờ thật, cây quá lớn ($\sim35^{80}$ với cờ vua), nên cắt ở độ sâu cố định và dùng <b>hàm đánh giá</b> (đếm quân, vị trí).</p>
<h4>Cắt tỉa alpha–beta</h4>
<p>$\alpha$: giá trị tốt nhất MAX đã chắc chắn có; $\beta$: giá trị tốt nhất MIN đã chắc chắn có. Khi $\alpha\ge\beta$ ở một nút, các nhánh còn lại không thể ảnh hưởng kết quả, bỏ qua. Kết quả giống hệt minimax, nhưng duyệt ít hơn nhiều (lý tưởng: căn bậc hai số nút).</p>
<h4>MCTS và AlphaGo</h4>
<p>Cờ vây quá lớn cho minimax. Monte Carlo Tree Search lặp 4 bước: <b>chọn</b> nhánh hứa hẹn (cân bằng khai thác/khám phá), <b>mở rộng</b>, <b>mô phỏng</b> ván đấu tới cuối, <b>lan truyền ngược</b> kết quả. AlphaGo thay mô phỏng ngẫu nhiên bằng <b>mạng giá trị</b> và hướng dẫn chọn nước bằng <b>mạng chính sách</b>: kết hợp tìm kiếm biểu tượng với học sâu và RL.</p>`,
  w: 'minimax',
  worked: { t: 'Minimax và alpha–beta trên cây 2 tầng',
    setup: R`Gốc là lượt MAX, có 3 nước A, B, C. Mỗi nước dẫn tới lượt MIN với các lá: A → $[3, 12, 8]$; B → $[2, 4, 6]$; C → $[14, 5, 2]$.`,
    steps: [
      R`<b>MIN tại A:</b> $\min(3,12,8) = 3$.`,
      R`<b>MIN tại B:</b> $\min(2,4,6) = 2$. <b>MIN tại C:</b> $\min(14,5,2) = 2$.`,
      R`<b>MAX tại gốc:</b> $\max(3,2,2) = 3$ → chọn A.`,
      R`<b>Alpha–beta:</b> sau khi xét A, $\alpha = 3$ (MAX chắc có ít nhất 3).`,
      R`<b>Xét B:</b> lá đầu tiên là 2, nên MIN ở B sẽ $\le 2 < \alpha = 3$. MAX sẽ không chọn B: bỏ qua lá 4, 6.`,
      R`<b>Xét C:</b> lá 14 (MIN tại C hiện $\le14$, chưa cắt), lá 5 ($\le5$, chưa cắt vì $5 > 3$), lá 2 ($\le2<3$). Không bỏ được lá nào ở C.`,
      R`<b>Tiết kiệm:</b> 2/9 lá. Nếu sắp nước tốt lên trước (thứ tự tốt), cắt được nhiều hơn.`,
    ],
    ans: R`Giá trị gốc 3, chọn A; alpha–beta bỏ qua 2 lá.` },
  ex: [
    { q: R`Đổi thứ tự lá của C thành $[2, 5, 14]$. Alpha–beta bỏ qua được bao nhiêu lá ở C?`, s: [R`Lá đầu 2 ≤ $\alpha = 3$: cắt ngay.`, R`Bỏ qua 5 và 14.`], a: R`2 lá; tổng cộng bỏ 4/9 lá.` },
  ],
  miss: [[R`Máy chơi cờ duyệt hết mọi nước đi.`, R`Không thể; chúng cắt độ sâu, dùng hàm đánh giá, alpha–beta, hoặc MCTS + mạng nơ-ron.`]],
  recap: [R`MAX lấy max, MIN lấy min, tính từ lá lên.`, R`Alpha–beta: cùng kết quả, duyệt ít hơn.`, R`AlphaGo = MCTS + mạng chính sách + mạng giá trị.`],
  papers: ['Knuth & Moore (1975) — An analysis of alpha-beta pruning', 'Silver et al. (2016) — Mastering the game of Go'] });

L({ id: 'logic', p: 'psym', t: 'Logic, hệ chuyên gia & đồ thị tri thức', en: 'Logic & Knowledge', min: 75, pre: ['aitypes'],
  goals: ['Suy diễn tiến (forward chaining) trên tập luật', 'Biểu diễn tri thức bằng bộ ba chủ–vị–tân', 'Biết vai trò của tri thức biểu tượng cạnh LLM'],
  intuit: R`<p>Một kỹ sư lâu năm có hàng trăm “nếu… thì…” trong đầu: “nếu mối hàn xám và có lỗ thì nghi rỗ khí; nếu rỗ khí và nhiệt độ lò thấp thì chỉnh profile nhiệt”. <b>Hệ chuyên gia</b> ghi những luật đó ra và để máy tự suy diễn. Ưu điểm: giải thích được từng bước. Nhược điểm: viết và bảo trì hàng nghìn luật rất cực, và luật không tự học.</p>`,
  body: R`
<h4>Logic mệnh đề và vị từ</h4>
<p>Mệnh đề: “$P\Rightarrow Q$” (nếu P thì Q). Logic vị từ bậc nhất thêm biến và lượng từ: $\forall x\,(\text{BoMạch}(x)\land\text{ĐứtMạch}(x)\Rightarrow\text{NG}(x))$.</p>
<h4>Suy diễn</h4>
<ul><li><b>Suy diễn tiến:</b> từ sự kiện đã biết, áp mọi luật có điều kiện thỏa mãn, thêm kết luận mới, lặp đến khi không thêm được gì.</li>
<li><b>Suy diễn lùi:</b> từ mục tiêu cần chứng minh, tìm luật kết luận ra nó, rồi chứng minh các điều kiện (cách Prolog làm).</li></ul>
<h4>Đồ thị tri thức</h4>
<p>Tri thức dạng bộ ba (chủ thể, quan hệ, đối tượng): (R12, gắn_trên, BoA), (R12, loại, ĐiệnTrở), (ĐiệnTrở, là_một, LinhKiện). Truy vấn bằng SPARQL hoặc duyệt đồ thị. Google Knowledge Graph, Wikidata là ví dụ lớn.</p>
<h4>Bên cạnh LLM</h4>
<p>LLM giỏi ngôn ngữ nhưng có thể sai sự thật và khó kiểm chứng; hệ biểu tượng chính xác, kiểm chứng được nhưng cứng nhắc. Xu hướng <b>neuro-symbolic</b>: LLM gọi bộ giải logic, công cụ tính toán, đồ thị tri thức (GraphRAG), hoặc sinh chứng minh để bộ kiểm tra hình thức xác minh.</p>`,
  w: 'chain',
  worked: { t: 'Suy diễn tiến trong hệ chẩn đoán mối hàn',
    setup: R`Luật: (L1) Xám ∧ CóLỗ ⇒ RỗKhí. (L2) RỗKhí ∧ NhiệtThấp ⇒ ChỉnhProfile. (L3) Bóng ∧ ĐủThiếc ⇒ HànTốt. (L4) RỗKhí ⇒ NG. Sự kiện ban đầu: {Xám, CóLỗ, NhiệtThấp}.`,
    steps: [
      R`<b>Vòng 1:</b> L1 thỏa (Xám, CóLỗ có trong tập) → thêm <b>RỗKhí</b>. L2 cần RỗKhí: lúc bắt đầu vòng chưa có. L3 không thỏa.`,
      R`<b>Vòng 2:</b> L2 thỏa (RỗKhí, NhiệtThấp) → thêm <b>ChỉnhProfile</b>. L4 thỏa → thêm <b>NG</b>.`,
      R`<b>Vòng 3:</b> không luật nào thêm được sự kiện mới → dừng.`,
      R`<b>Giải thích được:</b> NG vì RỗKhí (L4); RỗKhí vì Xám và CóLỗ (L1). Đây là điểm mạnh mà mạng nơ-ron thiếu.`,
    ],
    ans: R`Kết luận: RỗKhí, NG, ChỉnhProfile.` },
  ex: [
    { q: R`Viết các bộ ba cho câu: “Tụ C5 loại gốm 100nF, gắn trên bo B2, bị lỗi lệch vị trí.”`, s: [R`(C5, loại, TụGốm); (C5, điện_dung, 100nF).`, R`(C5, gắn_trên, B2).`, R`(C5, có_lỗi, LệchVịTrí).`], a: R`4 bộ ba như trên; từ đó truy vấn được “mọi linh kiện lệch vị trí trên B2”.` },
  ],
  miss: [[R`AI biểu tượng đã lỗi thời.`, R`Vẫn có mặt trong kiểm chứng phần mềm, lập lịch, cơ sở tri thức, và ngày càng được kết hợp với LLM.`]],
  recap: [R`Luật “nếu–thì” + suy diễn tiến/lùi.`, R`Đồ thị tri thức: bộ ba chủ–vị–tân.`, R`Neuro-symbolic: kết hợp LLM với logic và tri thức.`],
  papers: ['Russell & Norvig — chương 7–10', 'Buchanan & Shortliffe (1984) — Rule-Based Expert Systems: MYCIN'] });

L({ id: 'planning', p: 'psym', t: 'Lập kế hoạch & thỏa mãn ràng buộc', en: 'Planning & CSP', min: 60, pre: ['search', 'logic'],
  goals: ['Mô tả hành động bằng điều kiện và hiệu ứng (STRIPS)', 'Giải bài toán ràng buộc bằng quay lui', 'Liên hệ với lập lịch sản xuất'],
  intuit: R`<p>Nấu bữa tối: muốn “luộc mì” thì cần “có nước sôi”; muốn “nước sôi” thì cần “nồi có nước” và “bếp bật”. Lập kế hoạch là xâu chuỗi các hành động sao cho điều kiện của mỗi bước được đáp ứng bởi bước trước. <b>Bài toán ràng buộc</b> như xếp lịch thi: mỗi môn một ca, hai môn có chung sinh viên không được cùng ca, phòng không quá sức chứa.</p>`,
  body: R`
<h4>STRIPS</h4>
<p>Mỗi hành động có <b>điều kiện</b> (preconditions) và <b>hiệu ứng</b> (thêm / xóa sự kiện). Ví dụ: <i>Hàn(L)</i>: điều kiện {Đặt(L), MỏHànNóng}; hiệu ứng thêm {Hàn(L)}. Kế hoạch tìm bằng tìm kiếm tiến (từ trạng thái đầu) hoặc lùi (từ mục tiêu), với heuristic như A*.</p>
<h4>Bài toán thỏa mãn ràng buộc (CSP)</h4>
<p>Biến, miền giá trị, ràng buộc. Giải bằng <b>quay lui</b>: gán từng biến, kiểm ràng buộc, sai thì lùi lại. Tăng tốc: chọn biến ít lựa chọn nhất trước (MRV), loại trừ giá trị trước (forward checking).</p>
<h4>Ứng dụng công nghiệp</h4>
<p>Lập lịch máy, xếp ca, định tuyến xe, cân bằng chuyền: thường mô hình hóa bằng CSP hoặc quy hoạch nguyên (MILP) và giải bằng bộ giải chuyên dụng (OR-Tools, Gurobi). RL và học sâu đang được dùng để <b>học heuristic</b> cho các bộ giải này.</p>`,
  w: null,
  diag: { nodes: [{ t: 'ĐặtLinhKiện', s: 'cần: bo trống' }, { t: 'BậtMỏHàn', s: '→ nóng' }, { t: 'Hàn', s: 'cần: đặt + nóng', c: 'red' }, { t: 'KiểmTraAOI', s: 'cần: đã hàn' }, 'Hoàn thành'] },
  worked: { t: 'Tô màu lịch thi bằng quay lui',
    setup: R`4 môn: Toán (T), Lý (L), Hóa (H), Sinh (S). Cặp có chung sinh viên (không được cùng ca): T–L, T–H, L–H, H–S. Có 3 ca: 1, 2, 3.`,
    steps: [
      R`<b>Chọn biến ràng buộc nhiều nhất trước:</b> H (nối T, L, S). Gán H = 1.`,
      R`<b>T:</b> khác H → thử 2. OK. <b>L:</b> khác T và H → không được 1, 2 → gán 3.`,
      R`<b>S:</b> chỉ cần khác H (1) → gán 2.`,
      R`<b>Kiểm tra mọi ràng buộc:</b> T(2)≠L(3) ✓, T(2)≠H(1) ✓, L(3)≠H(1) ✓, H(1)≠S(2) ✓.`,
      R`<b>Nếu chỉ có 2 ca:</b> T, L, H đôi một ràng buộc (tam giác) nên cần ít nhất 3 ca: quay lui sẽ thử hết và báo vô nghiệm.`,
    ],
    ans: R`H = 1, T = 2, L = 3, S = 2. Cần tối thiểu 3 ca.` },
  ex: [
    { q: R`Hành động <i>KiểmTraAOI</i> có điều kiện {ĐãHàn}. Trạng thái đầu {BoTrống}. Dùng các hành động trong sơ đồ, viết kế hoạch ngắn nhất.`, s: [R`Mục tiêu cần KiểmTraAOI → cần ĐãHàn.`, R`Hàn cần Đặt và MỏHànNóng.`, R`Đặt cần BoTrống (có sẵn); BậtMỏHàn không cần gì.`], a: R`ĐặtLinhKiện → BậtMỏHàn → Hàn → KiểmTraAOI (có thể đổi chỗ hai bước đầu).` },
  ],
  miss: [[R`Lập lịch là việc của học máy.`, R`Phần lõi thường là tối ưu tổ hợp/CSP; học máy hỗ trợ dự báo đầu vào và học heuristic.`]],
  recap: [R`STRIPS: điều kiện + hiệu ứng.`, R`CSP: biến, miền, ràng buộc; giải bằng quay lui + heuristic.`, R`Nền tảng của lập lịch sản xuất.`],
  papers: ['Fikes & Nilsson (1971) — STRIPS', 'Russell & Norvig — chương 6, 11'] });

L({ id: 'bayesnet', p: 'psym', t: 'Mạng Bayes', en: 'Bayesian Networks', min: 75, pre: ['nbayes'],
  goals: ['Đọc đồ thị nhân quả và bảng xác suất có điều kiện', 'Suy luận bằng liệt kê', 'Hiểu “giải thích loại trừ” (explaining away)'],
  intuit: R`<p>Sáng ra thấy sân ướt. Có thể do <b>mưa</b>, cũng có thể do <b>vòi tưới tự động</b>. Nếu sau đó bạn biết tối qua trời mưa, khả năng vòi tưới đã chạy <b>giảm xuống</b>: mưa đã “giải thích” sân ướt rồi. Mạng Bayes là bản đồ các nguyên nhân và hệ quả như vậy, kèm con số, để máy lập luận dưới sự không chắc chắn.</p>`,
  body: R`
<h4>Cấu trúc</h4>
<p>Đồ thị có hướng không chu trình: mỗi nút là một biến, mũi tên từ nguyên nhân tới hệ quả. Mỗi nút có bảng xác suất có điều kiện $P(X\mid\text{cha}(X))$. Phân phối chung:</p>
$$P(X_1,\dots,X_n) = \prod_i P(X_i\mid\text{cha}(X_i))$$
<p>Thay vì $2^n$ con số cho $n$ biến nhị phân, chỉ cần vài bảng nhỏ.</p>
<h4>Suy luận</h4>
<p>Muốn $P(\text{Mưa}\mid\text{Ướt})$: cộng phân phối chung trên các biến ẩn (liệt kê), rồi chuẩn hóa. Mạng lớn dùng loại biến (variable elimination) hoặc lấy mẫu (MCMC).</p>
<h4>Ứng dụng</h4>
<p>Chẩn đoán y tế và kỹ thuật (tìm nguyên nhân gốc lỗi trên dây chuyền), đánh giá rủi ro, lọc spam. Mạng Bayes là nền cho suy luận nhân quả, mô hình đồ thị xác suất, HMM (bài kế).</p>`,
  w: 'bnet',
  worked: { t: 'Mưa hay vòi tưới?',
    setup: R`$P(M) = 0.2$, $P(V) = 0.3$ (độc lập). $P(\text{Ướt}\mid M, V)$: cả hai 0.99; chỉ mưa 0.9; chỉ vòi 0.8; không cái nào 0.05. Thấy sân ướt. Tính $P(M\mid\text{Ướt})$, rồi $P(V\mid\text{Ướt}, M)$ so với $P(V\mid\text{Ướt})$.`,
    steps: [
      R`<b>Liệt kê 4 trường hợp (nhân prior × likelihood):</b> (M,V): $0.2\cdot0.3\cdot0.99 = 0.0594$; (M,¬V): $0.2\cdot0.7\cdot0.9 = 0.126$; (¬M,V): $0.8\cdot0.3\cdot0.8 = 0.192$; (¬M,¬V): $0.8\cdot0.7\cdot0.05 = 0.028$.`,
      R`<b>Tổng</b> $P(\text{Ướt}) = 0.0594+0.126+0.192+0.028 = 0.4054$.`,
      R`<b>$P(M\mid\text{Ướt})$</b> $= (0.0594+0.126)/0.4054 = 0.457$. Thấy ướt, khả năng mưa tăng từ 20% lên 46%.`,
      R`<b>$P(V\mid\text{Ướt})$</b> $= (0.0594 + 0.192)/0.4054 = 0.620$.`,
      R`<b>Biết thêm là có mưa:</b> chỉ còn 2 trường hợp có M: $P(V\mid\text{Ướt}, M) = 0.0594/(0.0594+0.126) = 0.320$.`,
      R`<b>Giải thích loại trừ:</b> xác suất vòi tưới giảm từ 62% về 32% (gần prior 30%) vì mưa đã giải thích sân ướt.`,
    ],
    ans: R`$P(M\mid\text{Ướt}) = 0.457$; $P(V\mid\text{Ướt}) = 0.620$ giảm xuống $0.320$ khi biết có mưa.` },
  ex: [
    { q: R`Mạng 5 biến nhị phân dạng chuỗi A → B → C → D → E. Cần bao nhiêu con số xác suất độc lập? So với bảng phân phối chung đầy đủ?`, s: [R`A: 1 số. Mỗi nút còn lại có 1 cha nhị phân: 2 số, ×4 nút = 8.`, R`Tổng 9.`, R`Bảng đầy đủ: $2^5 - 1 = 31$.`], a: R`9 so với 31; với 30 biến: 59 so với hơn 1 tỷ.` },
  ],
  miss: [[R`Mũi tên trong mạng Bayes luôn là quan hệ nhân quả.`, R`Mũi tên chỉ mã hóa phụ thuộc có điều kiện; diễn giải nhân quả cần thêm giả định.`]],
  recap: [R`Phân phối chung = tích các $P(X_i\mid\text{cha})$.`, R`Suy luận: liệt kê → chuẩn hóa.`, R`Explaining away: một nguyên nhân được xác nhận làm nguyên nhân khác giảm.`],
  papers: ['Pearl (1988) — Probabilistic Reasoning in Intelligent Systems', 'Russell & Norvig — chương 13'] });

L({ id: 'hmm', p: 'psym', t: 'Suy luận theo thời gian: HMM & bộ lọc Kalman', en: 'HMM & Kalman Filter', min: 90, pre: ['bayesnet', 'gauss'],
  goals: ['Cập nhật niềm tin theo vòng dự đoán – hiệu chỉnh', 'Tính tay một bước lọc Kalman 1D', 'Biết ứng dụng trong theo dõi và dự báo'],
  intuit: R`<p>Bạn lái xe trong đường hầm, mất GPS. Bạn vẫn <b>dự đoán</b> vị trí từ tốc độ (càng đi lâu càng kém chắc chắn). Ra khỏi hầm, GPS báo một vị trí hơi lệch. Bạn <b>không tin hoàn toàn</b> cả hai: kết hợp dự đoán và đo đạc theo mức đáng tin của mỗi bên. Bộ lọc Kalman làm đúng việc này, hàng trăm lần mỗi giây, trong điện thoại, máy bay, robot.</p>`,
  body: R`
<h4>Mô hình trạng thái ẩn</h4>
<p>Trạng thái thật $x_t$ không thấy trực tiếp; chỉ thấy quan sát nhiễu $z_t$. Hai mô hình: <b>chuyển trạng thái</b> $P(x_t\mid x_{t-1})$ và <b>cảm biến</b> $P(z_t\mid x_t)$. Mỗi bước gồm:</p>
<ol><li><b>Dự đoán:</b> đẩy niềm tin qua mô hình chuyển động (niềm tin nở rộng ra).</li><li><b>Hiệu chỉnh:</b> nhân với likelihood của quan sát mới rồi chuẩn hóa (Bayes; niềm tin co lại).</li></ol>
<h4>HMM</h4>
<p>Trạng thái rời rạc (ví dụ máy: “bình thường / mòn / sắp hỏng”). Thuật toán forward cho xác suất trạng thái hiện tại; Viterbi cho chuỗi trạng thái khả dĩ nhất. Từng là nền tảng của nhận dạng giọng nói trước học sâu.</p>
<h4>Bộ lọc Kalman (1D)</h4>
<p>Trạng thái liên tục, mọi thứ Gaussian. Niềm tin $\mathcal N(\mu, P)$; nhiễu chuyển động $Q$; nhiễu đo $R$.</p>
$$\text{Dự đoán: } \mu^- = \mu + u,\quad P^- = P + Q$$
$$K = \frac{P^-}{P^- + R},\quad \mu = \mu^- + K(z - \mu^-),\quad P = (1-K)P^-$$
<p>$K$ (Kalman gain) từ 0 đến 1: đo đạc càng chính xác ($R$ nhỏ), càng tin quan sát.</p>`,
  w: 'kalman',
  worked: { t: 'Theo dõi vị trí băng tải bằng Kalman 1D',
    setup: R`Niềm tin hiện tại $\mu = 10$ cm, $P = 4$. Băng tải chạy $u = 5$ cm mỗi bước, nhiễu chuyển động $Q = 1$. Cảm biến đo $z = 16$ cm, nhiễu đo $R = 5$.`,
    steps: [
      R`<b>Dự đoán:</b> $\mu^- = 10 + 5 = 15$; $P^- = 4 + 1 = 5$.`,
      R`<b>Kalman gain:</b> $K = 5/(5+5) = 0.5$: tin dự đoán và cảm biến như nhau.`,
      R`<b>Hiệu chỉnh trung bình:</b> $\mu = 15 + 0.5\cdot(16 - 15) = 15.5$.`,
      R`<b>Hiệu chỉnh độ bất định:</b> $P = (1-0.5)\cdot5 = 2.5$. Nhỏ hơn cả $P^-$ (5) lẫn $R$ (5): kết hợp hai nguồn cho kết quả chắc chắn hơn từng nguồn riêng.`,
      R`<b>Nếu cảm biến tốt hơn ($R = 1$):</b> $K = 5/6 = 0.833$; $\mu = 15 + 0.833 = 15.83$; $P = 0.833$. Kết quả gần số đo hơn.`,
    ],
    ans: R`$\mu = 15.5$, $P = 2.5$ (với $R=5$).` },
  ex: [
    { q: R`HMM 2 trạng thái máy: Tốt (T), Mòn (M). Chuyển: T→T 0.9, T→M 0.1, M→M 1. Cảm biến rung “cao” với xác suất 0.1 nếu T, 0.7 nếu M. Niềm tin ban đầu $[0.95, 0.05]$. Đo được “cao”. Niềm tin mới?`, s: [R`Dự đoán: $P(T) = 0.95\cdot0.9 = 0.855$; $P(M) = 0.95\cdot0.1 + 0.05 = 0.145$.`, R`Nhân likelihood: T $0.855\cdot0.1 = 0.0855$; M $0.145\cdot0.7 = 0.1015$.`, R`Chuẩn hóa: tổng 0.187; T $= 0.457$, M $= 0.543$.`], a: R`$P(\text{Mòn}) \approx 54\%$: một lần rung cao đã đủ để nghi ngờ mạnh.` },
  ],
  miss: [[R`Kalman chỉ lấy trung bình dự đoán và đo đạc.`, R`Đó là trung bình <b>có trọng số theo độ tin cậy</b>, và nó cập nhật cả độ bất định.`]],
  recap: [R`Dự đoán (nở rộng) → hiệu chỉnh (co lại).`, R`HMM: trạng thái rời rạc; Kalman: Gaussian liên tục.`, R`$K = P^-/(P^- + R)$.`],
  papers: ['Kalman (1960) — A New Approach to Linear Filtering and Prediction Problems', 'Rabiner (1989) — A Tutorial on Hidden Markov Models'] });

L({ id: 'evo', p: 'psym', t: 'Giải thuật di truyền & tối ưu bầy đàn', en: 'Evolutionary Algorithms', min: 75, pre: ['aitypes', 'prob'],
  goals: ['Chạy tay một thế hệ GA: chọn lọc, lai ghép, đột biến', 'Hiểu PSO', 'Biết khi nào dùng tiến hóa thay vì gradient'],
  intuit: R`<p>Chọn giống lúa: gieo nhiều giống, giữ lại cây cho năng suất cao nhất, cho chúng <b>lai</b> với nhau, thỉnh thoảng có <b>đột biến</b> ngẫu nhiên. Qua nhiều mùa, giống lúa tốt dần mà không ai cần hiểu “đạo hàm năng suất theo gen”. Giải thuật di truyền dùng ý tưởng này cho bài toán mà gradient không có hoặc vô dụng: xếp lịch, thiết kế, chọn siêu tham số.</p>`,
  body: R`
<h4>Giải thuật di truyền (GA)</h4>
<ol><li><b>Mã hóa</b> lời giải thành “nhiễm sắc thể” (chuỗi bit, hoán vị, vector số).</li>
<li><b>Khởi tạo</b> quần thể ngẫu nhiên; tính <b>độ thích nghi</b> (fitness) từng cá thể.</li>
<li><b>Chọn lọc:</b> cá thể tốt có xác suất làm cha mẹ cao hơn (bánh xe roulette, đấu loại).</li>
<li><b>Lai ghép:</b> cắt hai cha mẹ tại một điểm, ghép nửa này với nửa kia.</li>
<li><b>Đột biến:</b> lật ngẫu nhiên vài bit với xác suất nhỏ (giữ đa dạng).</li>
<li>Lặp qua nhiều thế hệ; có thể giữ lại cá thể tốt nhất (elitism).</li></ol>
<h4>Tối ưu bầy đàn (PSO)</h4>
<p>Mỗi “con chim” có vị trí và vận tốc, bị kéo về vị trí tốt nhất <i>của nó</i> và tốt nhất <i>của cả đàn</i>:</p>
$$\mathbf v \leftarrow \omega\mathbf v + c_1r_1(\mathbf p_{best} - \mathbf x) + c_2r_2(\mathbf g_{best} - \mathbf x),\quad \mathbf x\leftarrow\mathbf x + \mathbf v$$
<h4>Khi nào dùng</h4>
<p>Không gian rời rạc hoặc không khả vi, nhiều cực trị cục bộ, hàm mục tiêu là hộp đen (mô phỏng). Ví dụ: lập lịch job-shop, cân bằng chuyền, thiết kế anten, tìm kiếm kiến trúc mạng (NAS). Nhược điểm: tốn nhiều lần đánh giá, không đảm bảo tối ưu.</p>`,
  w: 'ga',
  worked: { t: 'Một thế hệ GA tối đa hóa số bit 1',
    setup: R`Chuỗi 6 bit, fitness = số bit 1. Quần thể: A = 110100 (3), B = 011110 (4), C = 100001 (2), D = 001000 (1).`,
    steps: [
      R`<b>Xác suất chọn (roulette):</b> tổng fitness $= 10$. A 0.3, B 0.4, C 0.2, D 0.1.`,
      R`<b>Giả sử bốc được cặp (B, A)</b> và (B, C). Cá thể yếu D không được chọn.`,
      R`<b>Lai ghép (B, A) tại điểm 3:</b> B = 011|110, A = 110|100 → con1 = 011100 (3), con2 = 110110 (4).`,
      R`<b>Lai ghép (B, C) tại điểm 2:</b> B = 01|1110, C = 10|0001 → con3 = 01 + 0001 = 010001 (2), con4 = 10 + 1110 = 101110 (4).`,
      R`<b>Đột biến</b> (xác suất nhỏ): giả sử bit cuối của con2 lật: 110110 → 110111 (5).`,
      R`<b>Thế hệ mới:</b> 011100 (3), 110111 (5), 010001 (2), 101110 (4). Fitness trung bình tăng từ 2.5 lên 3.5; tốt nhất tăng từ 4 lên 5.`,
    ],
    ans: R`Trung bình 2.5 → 3.5; cá thể tốt nhất 110111 (5 bit 1).` },
  ex: [
    { q: R`PSO 1D: $x = 2$, $v = 0$, $p_{best} = 3$, $g_{best} = 5$, $\omega = 0.5$, $c_1 = c_2 = 1$, $r_1 = 0.5$, $r_2 = 0.4$. Tính $v$ và $x$ mới.`, s: [R`$v = 0.5\cdot0 + 1\cdot0.5\cdot(3-2) + 1\cdot0.4\cdot(5-2)$.`, R`$= 0 + 0.5 + 1.2 = 1.7$.`, R`$x = 2 + 1.7 = 3.7$.`], a: R`$v = 1.7$, $x = 3.7$: tiến về phía các vị trí tốt.` },
  ],
  miss: [[R`Tiến hóa luôn tốt hơn gradient vì tránh được cực trị cục bộ.`, R`Khi có gradient (như huấn luyện mạng nơ-ron), gradient descent hiệu quả hơn rất nhiều. Tiến hóa dành cho bài toán không có gradient hữu ích.`]],
  recap: [R`GA: chọn lọc → lai ghép → đột biến, lặp qua thế hệ.`, R`PSO: bị kéo về tốt nhất cá nhân và cả đàn.`, R`Dùng cho tối ưu rời rạc, hộp đen.`],
  papers: ['Holland (1975) — Adaptation in Natural and Artificial Systems', 'Kennedy & Eberhart (1995) — Particle Swarm Optimization'] });
