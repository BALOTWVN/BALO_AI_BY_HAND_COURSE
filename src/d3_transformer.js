/* ================= GIAI ĐOẠN 4: ATTENTION & TRANSFORMER ================= */
L({ id: 'attention', p: 'p4', t: 'Self-attention: Q, K, V', en: 'Self-Attention', min: 150, pre: ['prob', 'matmul', 'embed'],
  goals: ['Tính tay Q, K, V, điểm attention, softmax và đầu ra', 'Hiểu vì sao chia cho $\\sqrt{d_k}$', 'Thấy attention là “tra cứu mềm”'],
  body: R`
<p>Attention trả lời câu hỏi: <i>“để hiểu token này, tôi nên nhìn những token nào, và nhìn bao nhiêu?”</i></p>
<h4>Ba vai trò</h4>
<p>Từ ma trận đầu vào $X$ ($n$ token × $d$ chiều), chiếu ra ba ma trận:</p>
$$Q = XW_Q,\qquad K = XW_K,\qquad V = XW_V$$
<ul><li><b>Query</b> $\mathbf q_i$: “tôi đang tìm gì”.</li><li><b>Key</b> $\mathbf k_j$: “tôi chứa gì” (để được tìm thấy).</li><li><b>Value</b> $\mathbf v_j$: “nội dung tôi đưa ra nếu được chọn”.</li></ul>
<h4>Công thức</h4>
$$\text{Attention}(Q,K,V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$
<h4>Năm bước tính tay</h4>
<ol><li>Tính $Q, K, V$ (ba phép nhân ma trận).</li>
<li>Điểm $S = QK^\top$: ô $(i,j)$ là $\mathbf q_i\cdot\mathbf k_j$. Ma trận $n\times n$.</li>
<li>Chia cho $\sqrt{d_k}$.</li>
<li>Softmax <b>theo từng hàng</b>: mỗi token có một phân phối trọng số trên các token.</li>
<li>Nhân với $V$: đầu ra của token $i$ là trung bình có trọng số của các value.</li></ol>
<h4>Vì sao chia $\sqrt{d_k}$?</h4>
<p>Nếu các phần tử của $\mathbf q,\mathbf k$ độc lập, trung bình 0, phương sai 1, thì $\mathbf q\cdot\mathbf k$ có phương sai $d_k$. Với $d_k=64$, điểm số dao động cỡ ±8, softmax gần như one-hot và gradient gần 0. Chia $\sqrt{d_k}$ đưa phương sai về 1.</p>
<h4>So với CNN và RNN</h4>
<p>Conv chỉ nhìn hàng xóm cố định; attention nhìn <b>toàn bộ</b> chuỗi trong một bước với trọng số phụ thuộc nội dung. Giá phải trả: chi phí $O(n^2)$ theo độ dài chuỗi.</p>`,
  w: 'attn',
  ex: [
    ['Điểm của một hàng là $[2, 0, 0]$ sau khi đã chia $\\sqrt{d_k}$. Trọng số attention?', 'softmax: $[7.389,1,1]/9.389 = [0.787, 0.107, 0.107]$.'],
    ['Với trọng số trên và $\\mathbf v_1=[1,0], \\mathbf v_2=[0,1], \\mathbf v_3=[1,1]$, đầu ra?', '$0.787[1,0]+0.107[0,1]+0.107[1,1] = [0.894, 0.213]$.'],
  ],
  app: 'Trên ảnh bo mạch, attention cho phép một mảng nhìn sang mảng ở xa có cấu trúc lặp lại (ví dụ dãy chân linh kiện) để phát hiện chân nào khác thường.',
  papers: ['Bahdanau et al. (2015) — Neural MT by Jointly Learning to Align', 'Vaswani et al. (2017) — Attention Is All You Need'] });

L({ id: 'mha', p: 'p4', t: 'Multi-head attention & mặt nạ', en: 'Multi-Head & Masking', min: 75, pre: ['attention'],
  goals: ['Hiểu vì sao cần nhiều đầu', 'Tính shape qua multi-head', 'Áp mặt nạ nhân quả và cross-attention'],
  body: R`
<p>Một đầu attention chỉ học được một kiểu quan hệ. <b>Multi-head</b> chạy $h$ đầu song song, mỗi đầu có chiều $d_k = d/h$:</p>
$$\text{head}_i = \text{Attention}(XW_Q^{(i)}, XW_K^{(i)}, XW_V^{(i)})$$
$$\text{MHA}(X) = \text{Concat}(\text{head}_1,\dots,\text{head}_h)\,W_O$$
<p>Ví dụ ViT-Base: $d=768$, $h=12$, mỗi đầu $d_k=64$. Tổng chi phí xấp xỉ một đầu lớn, nhưng mô hình học được 12 “góc nhìn” khác nhau (vị trí gần, vị trí xa, cùng màu, cùng cạnh…).</p>
<h4>Mặt nạ nhân quả (causal mask)</h4>
<p>Khi sinh văn bản, token $i$ không được nhìn token tương lai $j>i$. Ta cộng $-\infty$ vào các ô đó trước softmax:</p>
$$S_{ij} \leftarrow \begin{cases}S_{ij} & j\le i\\ -\infty & j>i\end{cases}$$
<p>Sau softmax, các ô này bằng 0. Ma trận trọng số trở thành tam giác dưới.</p>
<h4>Cross-attention</h4>
<p>Query đến từ một nguồn, key/value đến từ nguồn khác. Dùng trong dịch máy (decoder hỏi encoder), Stable Diffusion (ảnh hỏi văn bản prompt), DETR (truy vấn đối tượng hỏi feature ảnh).</p>
<h4>Biến thể hiệu quả</h4>
<p><b>Multi-Query / Grouped-Query Attention</b>: nhiều đầu query dùng chung K, V để giảm bộ nhớ KV cache. <b>FlashAttention</b>: tính đúng attention nhưng theo khối để tận dụng bộ nhớ nhanh của GPU.</p>`,
  w: null,
  ex: [['$n=196$ token, $d=768$, $h=12$. Shape của ma trận điểm $S$ trong mỗi đầu, và tổng số ô điểm?', 'Mỗi đầu $196\\times196$; tổng $12\\cdot196^2 = 460{,}992$ ô.']],
  app: '', papers: ['Shazeer (2019) — Multi-Query Attention', 'Dao et al. (2022) — FlashAttention'] });

L({ id: 'posenc', p: 'p4', t: 'Mã hóa vị trí: sinusoidal & RoPE', en: 'Positional Encoding', min: 60, pre: ['attention'],
  goals: ['Hiểu vì sao attention cần thông tin vị trí', 'Tính mã hóa sinusoidal', 'Hiểu ý tưởng xoay của RoPE'],
  body: R`
<p>Attention <b>không có khái niệm thứ tự</b>: hoán vị các token thì đầu ra chỉ hoán vị theo. “Chó cắn người” và “người cắn chó” giống nhau nếu không thêm vị trí.</p>
<h4>Sinusoidal (Transformer gốc)</h4>
$$PE_{(pos,2i)} = \sin\!\left(\frac{pos}{10000^{2i/d}}\right),\qquad PE_{(pos,2i+1)} = \cos\!\left(\frac{pos}{10000^{2i/d}}\right)$$
<p>Mỗi cặp chiều là một “kim đồng hồ” quay với tần số khác nhau: chiều đầu quay nhanh (phân biệt vị trí kề nhau), chiều sau quay chậm (phân biệt vị trí xa). Vector này được <b>cộng</b> vào embedding.</p>
<h4>Learned position embedding</h4>
<p>ViT và BERT học trực tiếp một vector cho mỗi vị trí. Đơn giản, nhưng không tự kéo dài sang độ dài lớn hơn lúc train (ViT phải nội suy khi đổi độ phân giải).</p>
<h4>RoPE (Rotary)</h4>
<p>Thay vì cộng, RoPE <b>xoay</b> từng cặp chiều của $\mathbf q$ và $\mathbf k$ một góc $pos\cdot\theta_i$:</p>
$$\begin{bmatrix}q'_{2i}\\q'_{2i+1}\end{bmatrix} = \begin{bmatrix}\cos m\theta_i & -\sin m\theta_i\\ \sin m\theta_i & \cos m\theta_i\end{bmatrix}\begin{bmatrix}q_{2i}\\q_{2i+1}\end{bmatrix}$$
<p>Khi đó $\mathbf q'_m\cdot\mathbf k'_n$ chỉ phụ thuộc <b>khoảng cách</b> $m-n$. Đây là mặc định của LLaMA và hầu hết LLM hiện nay.</p>`,
  w: 'pe',
  ex: [['Tính $PE_{(1,0)}$ và $PE_{(1,1)}$.', '$i=0$ nên tần số 1: $\\sin(1)\\approx0.841$, $\\cos(1)\\approx0.540$.']],
  app: '', papers: ['Su et al. (2021) — RoFormer (RoPE)'] });

L({ id: 'transformer', p: 'p4', t: 'Khối Transformer hoàn chỉnh', en: 'The Transformer Block', min: 90, pre: ['mha', 'posenc', 'norm', 'resnet'],
  goals: ['Lắp ráp attention + FFN + residual + LayerNorm', 'Đếm tham số mỗi khối', 'Phân biệt encoder, decoder, encoder–decoder'],
  body: R`
<p>Một khối Transformer (kiểu Pre-LN, dùng trong ViT và GPT) gồm hai bước con, mỗi bước có kết nối tắt:</p>
$$\mathbf x \leftarrow \mathbf x + \text{MHA}(\text{LN}(\mathbf x))$$
$$\mathbf x \leftarrow \mathbf x + \text{FFN}(\text{LN}(\mathbf x))$$
$$\text{FFN}(\mathbf x) = W_2\,\text{GELU}(W_1\mathbf x + \mathbf b_1) + \mathbf b_2,\qquad W_1\in\mathbb R^{4d\times d}$$
<p>Attention <b>trộn thông tin giữa các token</b>; FFN <b>xử lý từng token riêng</b> (nhiều nghiên cứu xem FFN như bộ nhớ key–value lưu kiến thức).</p>
<h4>Đếm tham số (bỏ bias, LN)</h4>
<ul><li>Attention: $W_Q,W_K,W_V,W_O$ mỗi cái $d\times d$, tổng $4d^2$.</li>
<li>FFN: $d\times4d$ và $4d\times d$, tổng $8d^2$.</li>
<li><b>Mỗi khối $\approx 12d^2$.</b></li></ul>
<p>ViT-Base: $d=768$, 12 khối, $12\cdot12\cdot768^2\approx85$ triệu. Khớp với con số 86M công bố.</p>
<h4>Ba họ kiến trúc</h4>
<table class="tbl"><tr><th>Họ</th><th>Attention</th><th>Ví dụ</th></tr>
<tr><td>Encoder</td><td>Hai chiều (nhìn mọi token)</td><td>BERT, ViT</td></tr>
<tr><td>Decoder</td><td>Nhân quả (chỉ nhìn quá khứ)</td><td>GPT, LLaMA</td></tr>
<tr><td>Encoder–decoder</td><td>Encoder hai chiều + decoder nhân quả + cross-attention</td><td>Transformer gốc, T5, DETR</td></tr></table>
<h4>Post-LN và Pre-LN</h4>
<p>Bản gốc 2017 đặt LN <i>sau</i> phép cộng residual (Post-LN), khó huấn luyện sâu, cần warmup cẩn thận. Pre-LN đặt LN trong nhánh, giữ đường residual “sạch”, ổn định hơn nhiều.</p>`,
  w: 'tfparams',
  diag: { nodes: ['x', 'LayerNorm', { t: 'Multi-Head', s: 'Attention' }, { t: '⊕', c: 'red' }, 'LayerNorm', { t: 'FFN', s: 'd→4d→d' }, { t: '⊕', c: 'red' }, 'x′'], skips: [[0, 3, ''], [3, 6, '']] },
  ex: [['GPT-2 small: $d=768$, 12 khối, từ điển 50{,}257. Ước lượng tổng tham số.', 'Khối: $12\\cdot12\\cdot768^2\\approx85$M; embedding $50{,}257\\cdot768\\approx38.6$M. Tổng ≈ 124M (khớp con số công bố).']],
  app: '', papers: ['Vaswani et al. (2017) — Attention Is All You Need', 'Xiong et al. (2020) — On Layer Normalization in the Transformer'] });

L({ id: 'vit', p: 'p4', t: 'Vision Transformer (ViT)', en: 'Vision Transformer', min: 90, pre: ['transformer', 'conv'],
  goals: ['Biến ảnh thành chuỗi token bằng tay', 'Tính số token, shape từng bước', 'So sánh thiên kiến quy nạp của ViT với CNN'],
  body: R`
<p>ViT (Dosovitskiy và cộng sự, 2020) chứng minh: chỉ cần cắt ảnh thành mảnh và đưa vào Transformer chuẩn là đủ, nếu có đủ dữ liệu.</p>
<h4>Sáu bước</h4>
<ol><li><b>Cắt mảnh:</b> ảnh $H\times W\times C$ thành $N = \frac{HW}{P^2}$ mảnh $P\times P\times C$. Với $224^2$, $P=16$: $N=196$.</li>
<li><b>Trải phẳng & chiếu:</b> mỗi mảnh thành vector $P^2C = 768$ chiều, nhân với $E\in\mathbb R^{768\times d}$. (Tương đương một conv $16\times16$ stride 16.)</li>
<li><b>Thêm token [CLS]:</b> một vector học được đặt đầu chuỗi, thành $197$ token.</li>
<li><b>Cộng position embedding</b> (học được, 197 vector).</li>
<li><b>Qua $L$ khối Transformer encoder.</b></li>
<li><b>Lấy đầu ra của [CLS]</b> → LayerNorm → Linear → logits các lớp.</li></ol>
$$\mathbf z_0 = [\mathbf x_{cls};\,\mathbf x_p^1E;\,\dots;\,\mathbf x_p^NE] + E_{pos}$$
<h4>Thiên kiến quy nạp</h4>
<p>CNN mặc định giả định tính cục bộ và bất biến tịnh tiến; ViT gần như không giả định gì, nó phải <b>tự học</b> từ dữ liệu. Hệ quả: với dữ liệu nhỏ (như ImageNet-1k thuần), ViT thua ResNet; với dữ liệu lớn (JFT-300M) thì vượt. DeiT dùng augmentation mạnh và chưng cất tri thức để ViT học tốt trên ImageNet-1k.</p>
<h4>Kích thước mảnh</h4>
<p>Mảnh nhỏ hơn thì nhiều token hơn (chi tiết hơn) nhưng chi phí attention tăng theo bình phương: $P=8$ cho 784 token, đắt gấp 16 lần $P=16$.</p>`,
  w: 'patch',
  diag: { nodes: [{ t: 'Ảnh', s: '224²×3' }, { t: 'Cắt mảnh', s: '196 × 16²×3' }, { t: 'Chiếu tuyến tính', s: '196 × 768' }, { t: '+[CLS] +Pos', s: '197 × 768' }, { t: 'Encoder ×12', s: '197 × 768' }, { t: 'Head', s: '[CLS] → lớp' }] },
  ex: [['Ảnh $384\\times384$, $P=16$. Bao nhiêu token (kể cả CLS)?', '$(384/16)^2 + 1 = 576 + 1 = 577$.']],
  app: 'Ảnh AOI thường độ phân giải cao và lỗi rất nhỏ. Với ViT cần chú ý: mảnh 16×16 có thể “nuốt” mất một vết lỗi 5 pixel, nên thường phải cắt ảnh (tiling) hoặc dùng mảnh nhỏ hơn.',
  papers: ['Dosovitskiy et al. (2021) — An Image is Worth 16x16 Words', 'Touvron et al. (2021) — DeiT'] });

L({ id: 'vitfam', p: 'p4', t: 'Họ ViT: Swin, DETR, MAE, DINO, SAM', en: 'The ViT Family', min: 90, pre: ['vit', 'detseg'],
  goals: ['Hiểu window attention của Swin', 'Hiểu DETR coi phát hiện là bài toán tập hợp', 'Biết các phương pháp tự giám sát MAE, DINO'],
  body: R`
<h4>Swin Transformer</h4>
<p>Chỉ tính attention <b>trong cửa sổ</b> $M\times M$ (ví dụ 7×7 token), chi phí tuyến tính theo kích thước ảnh. Lớp kế tiếp <b>dịch cửa sổ</b> đi nửa ô để thông tin chảy giữa các cửa sổ. Thêm phép gộp mảnh (patch merging) tạo cấu trúc tháp như CNN, nên Swin thay được backbone cho detection và segmentation.</p>
<h4>DETR</h4>
<p>Bỏ anchor và NMS. Dùng $N$ <b>object query</b> học được, mỗi query cross-attend vào feature ảnh và dự đoán một hộp (hoặc “không có gì”). Huấn luyện bằng <b>ghép cặp Hungarian</b> giữa dự đoán và nhãn, để mỗi vật thể được gán đúng một dự đoán.</p>
<h4>MAE (Masked Autoencoder)</h4>
<p>Che ngẫu nhiên <b>75%</b> mảnh, encoder chỉ xử lý 25% còn lại, decoder nhẹ khôi phục pixel bị che. Học biểu diễn mạnh mà không cần nhãn, và huấn luyện rẻ vì encoder chỉ thấy 1/4 token.</p>
<h4>DINO / DINOv2</h4>
<p>Tự chưng cất: mạng “học trò” khớp đầu ra với mạng “thầy” (trung bình trượt của học trò) trên các góc nhìn khác nhau của cùng một ảnh. Feature DINOv2 rất tốt cho tìm kiếm, phân đoạn và phát hiện bất thường mà không cần tinh chỉnh.</p>
<h4>SAM (Segment Anything)</h4>
<p>Encoder ViT lớn + decoder nhận prompt (điểm, hộp, văn bản) và xuất mask. Huấn luyện trên hơn một tỷ mask. Hữu ích để gán nhãn nhanh.</p>`,
  w: null,
  ex: [['Ảnh $56\\times56$ token, cửa sổ $7\\times7$. Số cặp attention của Swin so với attention toàn cục?', 'Toàn cục: $3136^2\\approx9.8$M. Swin: 64 cửa sổ × $49^2$ = $153{,}664$, nhỏ hơn 64 lần.']],
  app: 'DINOv2 và MAE là điểm khởi đầu mạnh khi có rất ít ảnh lỗi có nhãn: học trên ảnh không nhãn của chính dây chuyền rồi mới tinh chỉnh.',
  papers: ['Liu et al. (2021) — Swin Transformer', 'Carion et al. (2020) — DETR', 'He et al. (2022) — MAE', 'Oquab et al. (2023) — DINOv2', 'Kirillov et al. (2023) — Segment Anything'] });
