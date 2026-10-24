A('attention', {
  intuit: R`<p>Bạn vào <b>thư viện</b> với một câu hỏi (query): “sách về hàn mạch in”. Mỗi cuốn sách có <b>nhãn gáy</b> (key) và <b>nội dung</b> (value). Bạn so câu hỏi với từng nhãn gáy (tích vô hướng), cuốn nào khớp nhiều thì đọc kỹ, cuốn ít khớp thì lướt qua. Kiến thức bạn mang về là <b>trộn nội dung các cuốn theo mức độ khớp</b>. Đó là attention: một cách tra cứu “mềm”, không chọn hẳn một cuốn mà pha trộn có trọng số.</p>
<p>Trong câu “Mạch bị <u>đứt</u> ở chân linh kiện”, token “đứt” cần biết <i>cái gì</i> bị đứt. Query của “đứt” khớp mạnh với key của “mạch”, nên đầu ra của “đứt” được trộn nhiều thông tin từ “mạch”.</p>`,
  worked: { t: 'Self-attention đầy đủ cho 3 token, $d_k = 2$',
    setup: R`Ba token đã có $Q = \begin{bmatrix}1&0\\0&1\\1&1\end{bmatrix}$, $K = \begin{bmatrix}1&0\\1&1\\0&1\end{bmatrix}$, $V = \begin{bmatrix}1&0\\0&2\\1&1\end{bmatrix}$. Tính đầu ra cho token 3.`,
    steps: [
      R`<b>Điểm của token 3:</b> $\mathbf q_3 = [1,1]$. $\mathbf q_3\cdot\mathbf k_1 = 1$; $\mathbf q_3\cdot\mathbf k_2 = 2$; $\mathbf q_3\cdot\mathbf k_3 = 1$. Hàng điểm $[1, 2, 1]$.`,
      R`<b>Chia $\sqrt{d_k}=\sqrt2 = 1.414$:</b> $[0.707, 1.414, 0.707]$.`,
      R`<b>Softmax:</b> trừ max: $[-0.707, 0, -0.707]$; lũy thừa $[0.493, 1, 0.493]$; tổng $1.986$; chia: $[0.248, 0.503, 0.248]$.`,
      R`<b>Trộn value:</b> $0.248\cdot[1,0] + 0.503\cdot[0,2] + 0.248\cdot[1,1] = [0.248+0.248,\ 1.006+0.248] = [0.496, 1.254]$.`,
      R`<b>Đọc kết quả:</b> token 3 chú ý nhiều nhất vào token 2 (50%), vì key của token 2 giống query của nó nhất.`,
      R`<b>Toàn ma trận:</b> làm tương tự cho token 1 và 2, ta có $S = QK^\top = \begin{bmatrix}1&1&0\\0&1&1\\1&2&1\end{bmatrix}$. Mỗi hàng softmax riêng, rồi $O = AV$. Chi phí: $3\times3$ điểm, tức $n^2$.`,
    ],
    ans: R`$\mathbf o_3 \approx [0.496, 1.254]$, trọng số attention $[0.248, 0.503, 0.248]$.` },
  ex: [
    { q: R`Một hàng điểm sau khi chia $\sqrt{d_k}$ là $[2,0,0]$. Tính trọng số attention.`, s: [R`Lũy thừa: $e^2=7.389$, $1$, $1$.`, R`Tổng $9.389$.`, R`Chia: $[0.787, 0.107, 0.107]$.`], a: R`$[0.787, 0.107, 0.107]$.` },
    { q: R`Với trọng số trên và $\mathbf v_1=[1,0]$, $\mathbf v_2=[0,1]$, $\mathbf v_3=[1,1]$, tính đầu ra.`, s: [R`$0.787\cdot[1,0] = [0.787, 0]$.`, R`$0.107\cdot[0,1] = [0, 0.107]$.`, R`$0.107\cdot[1,1] = [0.107, 0.107]$.`, R`Cộng: $[0.894, 0.214]$.`], a: R`$[0.894, 0.214]$.` },
    { q: R`Với $d_k = 64$ và $\mathbf q, \mathbf k$ có phần tử ngẫu nhiên phương sai 1, tích $\mathbf q\cdot\mathbf k$ có độ lệch chuẩn bao nhiêu? Sau khi chia $\sqrt{64}$?`, s: [R`Tổng 64 tích độc lập, mỗi tích phương sai 1: phương sai 64.`, R`Độ lệch chuẩn $\sqrt{64} = 8$.`, R`Chia 8: độ lệch chuẩn 1.`], a: R`8 trước khi chia, 1 sau khi chia. Không chia thì softmax quá nhọn, gradient gần 0.` },
  ],
  miss: [[R`Q, K, V là ba dữ liệu khác nhau.`, R`Trong self-attention, cả ba đều sinh từ <b>cùng</b> $X$ qua ba ma trận chiếu khác nhau.`], [R`Softmax áp trên toàn ma trận.`, R`Softmax <b>theo từng hàng</b>: mỗi token có phân phối riêng.`]],
  recap: [R`$\text{softmax}(QK^\top/\sqrt{d_k})V$.`, R`Mỗi hàng: trọng số mình chú ý vào các token khác.`, R`Chi phí $O(n^2)$ theo độ dài.`],
});

A('mha', {
  intuit: R`<p>Một hội đồng chấm luận văn có 8 thành viên, mỗi người nhìn một khía cạnh: người soi phương pháp, người soi số liệu, người soi văn phong… Sau đó tổng hợp ý kiến. <b>Multi-head attention</b> là hội đồng như vậy: mỗi “đầu” học một kiểu quan hệ riêng, rồi ghép kết quả lại và trộn bằng $W_O$.</p>
<p><b>Mặt nạ nhân quả</b> giống thi viết chính tả: khi viết chữ thứ 5, bạn chỉ được nhìn 4 chữ đã viết, không được nhìn trước chữ tiếp theo.</p>`,
  worked: { t: 'Theo dõi shape qua một lớp MHA của ViT-Base',
    setup: R`Đầu vào $X$: 197 token × 768. $h = 12$ đầu, $d_k = 64$.`,
    steps: [
      R`<b>Chiếu Q, K, V:</b> $X W_Q$: $(197\times768)(768\times768) = 197\times768$. Tương tự cho K, V.`,
      R`<b>Tách đầu:</b> $197\times768 \to 197\times12\times64 \to$ hoán vị thành $12\times197\times64$.`,
      R`<b>Điểm mỗi đầu:</b> $(197\times64)(64\times197) = 197\times197$. 12 đầu: $12\times197\times197$.`,
      R`<b>Softmax rồi nhân V:</b> $(197\times197)(197\times64) = 197\times64$ mỗi đầu.`,
      R`<b>Ghép đầu:</b> $12\times197\times64 \to 197\times768$.`,
      R`<b>Chiếu $W_O$:</b> $(197\times768)(768\times768) = 197\times768$. Shape đầu ra bằng đầu vào, nên cộng residual được.`,
      R`<b>Tham số:</b> $4\cdot768^2 \approx 2.36$ triệu (không phụ thuộc số đầu).`,
    ],
    ans: R`$197\times768 \to$ 12 đầu $\times197\times64 \to 197\times768$; 2.36M tham số.` },
  ex: [
    { q: R`Áp mặt nạ nhân quả lên hàng điểm của token 2 (trong 3 token): $[1, 2, 3]$. Trọng số?`, s: [R`Token 2 chỉ thấy token 1, 2: điểm thành $[1, 2, -\infty]$.`, R`Lũy thừa: $[2.718, 7.389, 0]$, tổng $10.107$.`, R`Chia: $[0.269, 0.731, 0]$.`], a: R`$[0.269, 0.731, 0]$.` },
    { q: R`$n = 196$, $h = 12$. Bao nhiêu ô điểm attention trong một lớp?`, s: [R`Mỗi đầu $196^2 = 38{,}416$.`, R`Nhân 12: $460{,}992$.`], a: R`≈ 461 nghìn ô.` },
  ],
  miss: [[R`Nhiều đầu thì nhiều tham số hơn.`, R`Số tham số $4d^2$ không đổi; chỉ là chia $d$ thành nhiều phần nhỏ.`]],
  recap: [R`$h$ đầu song song, mỗi đầu $d/h$ chiều.`, R`Mặt nạ nhân quả: $-\infty$ cho tương lai.`, R`Cross-attention: Q từ nguồn này, K/V từ nguồn kia.`],
});

A('posenc', {
  intuit: R`<p>Attention giống một cái túi đựng chữ: đổ chữ ra, nó không biết chữ nào đứng trước. Ta phải <b>đóng dấu vị trí</b> lên từng chữ.</p>
<p>Mã hóa sinusoidal giống <b>một chiếc đồng hồ nhiều kim</b>: kim giây quay nhanh (phân biệt 1 giây với 2 giây), kim phút chậm hơn, kim giờ chậm nữa. Nhìn tổ hợp các kim, bạn biết chính xác thời điểm. Mỗi cặp chiều của PE là một kim.</p>
<p><b>RoPE</b> thì xoay vector query và key một góc tỷ lệ với vị trí. Khi so hai token, chỉ <b>góc chênh lệch</b> (khoảng cách) còn lại, giống như hai người đứng trên vòng xoay: dù vòng quay bao nhiêu, khoảng cách giữa họ không đổi.</p>`,
  worked: { t: 'Tính PE với $d=4$ cho vị trí 0, 1, 2',
    setup: R`$d=4$ có 2 cặp chiều. Cặp 0: tần số $1/10000^{0}=1$. Cặp 1: tần số $1/10000^{2/4} = 1/100 = 0.01$. $PE = [\sin(p\omega_0), \cos(p\omega_0), \sin(p\omega_1), \cos(p\omega_1)]$.`,
    steps: [
      R`<b>p = 0:</b> $[\sin0, \cos0, \sin0, \cos0] = [0, 1, 0, 1]$.`,
      R`<b>p = 1:</b> $[\sin1, \cos1, \sin0.01, \cos0.01] = [0.841, 0.540, 0.010, 1.000]$.`,
      R`<b>p = 2:</b> $[\sin2, \cos2, \sin0.02, \cos0.02] = [0.909, -0.416, 0.020, 1.000]$.`,
      R`<b>Độ giống:</b> $PE_0\cdot PE_1 = 0.540 + 1.000 = 1.540$; $PE_0\cdot PE_2 = -0.416+1.000 = 0.584$. Vị trí gần thì giống nhau hơn.`,
      R`<b>Quan sát:</b> cặp 0 (kim nhanh) thay đổi mạnh mỗi bước; cặp 1 (kim chậm) gần như đứng yên trong khoảng ngắn nhưng phân biệt được các vị trí cách hàng trăm bước.`,
    ],
    ans: R`$PE_0 = [0,1,0,1]$, $PE_1 = [0.841,0.540,0.010,1]$, $PE_2=[0.909,-0.416,0.020,1]$.` },
  ex: [
    { q: R`RoPE với một cặp chiều, $\theta = 0.5$ rad/vị trí. $\mathbf q = [1, 0]$ ở vị trí 2, $\mathbf k = [1,0]$ ở vị trí 1. Tính $\mathbf q'\cdot\mathbf k'$.`, s: [R`Xoay $\mathbf q$ góc $2\cdot0.5 = 1$ rad: $[\cos1, \sin1] = [0.540, 0.841]$.`, R`Xoay $\mathbf k$ góc $0.5$: $[\cos0.5,\sin0.5] = [0.878, 0.479]$.`, R`Tích: $0.540\cdot0.878 + 0.841\cdot0.479 = 0.474+0.403 = 0.877$.`, R`So sánh $\cos(1 - 0.5) = \cos0.5 = 0.878$: chỉ phụ thuộc khoảng cách 1.`], a: R`$\approx0.877 = \cos(0.5)$.` },
  ],
  miss: [[R`Positional encoding là phần “thêm cho đẹp”.`, R`Thiếu nó, Transformer không phân biệt được thứ tự token.`]],
  recap: [R`Sinusoidal: nhiều “kim đồng hồ” tần số khác nhau, cộng vào embedding.`, R`Learned: học thẳng mỗi vị trí một vector.`, R`RoPE: xoay q, k; tích chỉ phụ thuộc khoảng cách.`],
});

A('transformer', {
  intuit: R`<p>Một khối Transformer giống <b>một buổi họp nhóm có hai phần</b>. Phần 1 (attention): mọi người trao đổi, mỗi người lắng nghe những ai liên quan tới mình. Phần 2 (FFN): mỗi người về bàn riêng suy nghĩ, xử lý những gì vừa nghe. LayerNorm là “điều chỉnh âm lượng” trước mỗi phần. Kết nối tắt nghĩa là mỗi người <b>giữ lại ghi chép cũ</b> và chỉ bổ sung thêm, không xé bỏ.</p>
<p>Xếp 12, 24, hay 96 buổi họp như vậy liên tiếp, bạn có ViT-Base, ViT-Large, hay một LLM lớn.</p>`,
  worked: { t: 'Đếm tham số ViT-Base từng phần',
    setup: R`$d=768$, 12 khối, FFN mở rộng ×4, ảnh $224^2$, mảnh 16, 1000 lớp.`,
    steps: [
      R`<b>Patch embedding:</b> mỗi mảnh $16\cdot16\cdot3 = 768$ số → $d=768$: $768\cdot768 + 768 = 590{,}592$.`,
      R`<b>CLS + position:</b> $768 + 197\cdot768 = 152{,}064$.`,
      R`<b>Mỗi khối – attention:</b> $4\cdot(768^2 + 768) = 2{,}362{,}368$.`,
      R`<b>Mỗi khối – FFN:</b> $768\cdot3072 + 3072 + 3072\cdot768 + 768 = 4{,}722{,}432$.`,
      R`<b>Mỗi khối – 2 LayerNorm:</b> $4\cdot768 = 3{,}072$. Tổng một khối $\approx 7{,}087{,}872$.`,
      R`<b>12 khối:</b> $85{,}054{,}464$. Cộng đầu phân loại $768\cdot1000+1000 = 769{,}000$ và LN cuối $1{,}536$.`,
      R`<b>Tổng:</b> $590{,}592 + 152{,}064 + 85{,}054{,}464 + 769{,}000 + 1{,}536 \approx 86.6$ triệu. Khớp con số 86M công bố. FFN chiếm 2/3 mỗi khối.`,
    ],
    ans: R`≈ 86.6 triệu tham số; mỗi khối ≈ $12d^2$.` },
  ex: [
    { q: R`GPT-2 small: $d=768$, 12 khối, từ điển 50,257, ngữ cảnh 1024. Ước lượng tổng tham số.`, s: [R`Khối: $12\cdot12\cdot768^2\approx84.9$M.`, R`Token embedding: $50{,}257\cdot768\approx38.6$M (dùng chung với lớp đầu ra).`, R`Position: $1024\cdot768\approx0.8$M.`], a: R`≈ 124M.` },
  ],
  miss: [[R`Attention chiếm phần lớn tham số.`, R`FFN chiếm khoảng 2/3. Attention chiếm phần lớn <b>chi phí tính</b> khi chuỗi dài.`]],
  recap: [R`$x \mathrel{+}= \text{MHA}(\text{LN}(x))$; $x\mathrel{+}=\text{FFN}(\text{LN}(x))$.`, R`Mỗi khối $\approx12d^2$ tham số.`, R`Encoder (ViT, BERT), decoder (GPT), cả hai (T5).`],
});

A('vit', {
  intuit: R`<p>ViT xử lý ảnh như xử lý một câu: <b>cắt bức ảnh thành các ô gạch</b> 16×16, mỗi ô gạch là một “từ”. Bức ảnh 224×224 trở thành một câu 196 từ. Sau đó Transformer đọc câu này y hệt đọc văn bản. Token [CLS] như một “thư ký” không mang nội dung riêng, ngồi nghe mọi ô gạch rồi tóm tắt cả ảnh.</p>
<p>So với CNN: CNN được dạy sẵn “nhìn hàng xóm trước” (thiên kiến cục bộ). ViT không được dạy gì, nó tự phát hiện ra quy luật từ dữ liệu, nên cần rất nhiều dữ liệu nhưng linh hoạt hơn.</p>`,
  worked: { t: 'Biến một ảnh 4×4 thành token với mảnh 2×2',
    setup: R`Ảnh xám $\begin{bmatrix}1&2&0&0\\3&4&0&0\\0&0&5&6\\0&0&7&8\end{bmatrix}$, $P=2$, chiếu xuống $d=2$ bằng $E = \begin{bmatrix}1&0\\0&1\\1&0\\0&1\end{bmatrix}$ ($4\times2$).`,
    steps: [
      R`<b>Số mảnh:</b> $(4/2)^2 = 4$ token.`,
      R`<b>Cắt và trải phẳng</b> (theo hàng trong mỗi mảnh): mảnh 1 (trái-trên) $[1,2,3,4]$; mảnh 2 (phải-trên) $[0,0,0,0]$; mảnh 3 (trái-dưới) $[0,0,0,0]$; mảnh 4 (phải-dưới) $[5,6,7,8]$.`,
      R`<b>Chiếu tuyến tính</b> $\mathbf x_pE$: mảnh 1: $[1+3,\ 2+4] = [4, 6]$; mảnh 2, 3: $[0,0]$; mảnh 4: $[5+7, 6+8] = [12, 14]$.`,
      R`<b>Thêm [CLS]</b> (vector học được, giả sử $[0.1, 0.1]$) ở đầu: chuỗi 5 token.`,
      R`<b>Cộng position embedding</b> (giả sử $[0,0], [0.1,0], [0.2,0], [0.3,0], [0.4,0]$): token cuối thành $[12.4, 14]$. Hai mảnh 2 và 3 giống hệt nhau về nội dung giờ khác nhau nhờ vị trí.`,
      R`<b>Tương đương conv:</b> phép chiếu này chính là conv kernel $2\times2$, stride 2, 2 kênh ra.`,
    ],
    ans: R`Chuỗi 5 token × 2 chiều, trong đó 4 token mảnh $[4,6], [0,0], [0,0], [12,14]$ trước khi cộng vị trí.` },
  ex: [
    { q: R`Ảnh $384\times384$, $P=16$. Bao nhiêu token (kể cả CLS)? Chi phí attention so với $224\times224$?`, s: [R`$(384/16)^2 = 24^2 = 576$; thêm CLS: 577.`, R`Ở 224: 197 token.`, R`Tỷ lệ chi phí $\approx(577/197)^2 \approx 8.6$.`], a: R`577 token; attention đắt gấp ~8.6 lần.` },
  ],
  miss: [[R`ViT luôn tốt hơn CNN.`, R`Với dữ liệu nhỏ, CNN (hoặc ViT pretrained lớn rồi tinh chỉnh) thường tốt hơn ViT huấn luyện từ đầu.`]],
  recap: [R`Ảnh → mảnh $P\times P$ → chiếu → +CLS +pos → encoder.`, R`Số token $(H/P)^2$; chi phí $\propto$ token².`, R`Patch embedding = conv $P\times P$ stride $P$.`],
});

A('vitfam', {
  intuit: R`<p><b>Swin</b> như họp theo tổ: mỗi tổ (cửa sổ) bàn trong tổ, buổi sau đổi tổ lệch đi một nửa để thông tin lan sang tổ khác. Rẻ hơn họp toàn công ty mỗi lần.</p>
<p><b>MAE</b> như trò chơi xếp hình bị giấu 75% mảnh: muốn đoán đúng phần bị giấu, mô hình buộc phải hiểu cấu trúc ảnh. <b>DINO</b> như học trò bắt chước thầy, mà thầy chính là phiên bản “trung bình” của học trò trong quá khứ. <b>DETR</b> như một nhóm thám tử, mỗi người được giao tìm đúng một vật, không ai tìm trùng.</p>`,
  worked: { t: 'Đếm chi phí Swin và MAE',
    setup: R`Feature map $56\times56$ token. Swin cửa sổ $7\times7$. Riêng MAE: ảnh 196 mảnh, che 75%.`,
    steps: [
      R`<b>Attention toàn cục:</b> $3136$ token, $3136^2\approx9.83$ triệu cặp.`,
      R`<b>Số cửa sổ Swin:</b> $(56/7)^2 = 64$ cửa sổ, mỗi cửa sổ 49 token.`,
      R`<b>Cặp trong Swin:</b> $64\cdot49^2 = 64\cdot2401 = 153{,}664$; nhỏ hơn 64 lần.`,
      R`<b>MAE:</b> che 75% của 196 mảnh = 147 mảnh; encoder chỉ thấy 49 mảnh.`,
      R`<b>Chi phí encoder MAE:</b> $49^2 = 2{,}401$ so với $196^2 = 38{,}416$: nhẹ hơn 16 lần ở phần attention.`,
    ],
    ans: R`Swin rẻ hơn 64 lần; encoder MAE rẻ hơn 16 lần.` },
  ex: [
    { q: R`DETR có 100 object query, ảnh chỉ có 3 lỗi. 97 query còn lại học dự đoán gì?`, s: [R`Ghép Hungarian gán 3 query với 3 lỗi.`, R`97 query còn lại được gán nhãn “không có vật” ($\varnothing$).`], a: R`Lớp “không có gì”, nên không cần NMS.` },
  ],
  miss: [[R`Tự giám sát (MAE, DINO) không cần dữ liệu.`, R`Không cần <b>nhãn</b>, nhưng cần rất nhiều ảnh.`]],
  recap: [R`Swin: attention trong cửa sổ + dịch cửa sổ.`, R`DETR: query + ghép Hungarian, bỏ NMS.`, R`MAE/DINO: học biểu diễn không cần nhãn.`],
});
