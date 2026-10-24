/* ===== Phần mở rộng: trực giác, ví dụ giải mẫu, bài tập từng bước ===== */
const AUG = {};
function A(id, o) { AUG[id] = o; }

A('vector', {
  intuit: R`<p>Tưởng tượng bạn mô tả khẩu vị phở bằng 4 con số (thang 0–5): <b>[mặn, ngọt, cay, béo]</b>. Khẩu vị của bạn là $\mathbf u = [3, 2, 4, 1]$: thích cay, hơi mặn, không thích béo.</p>
<p>Mỗi quán phở cũng có một “hồ sơ vị” như vậy. Muốn biết quán nào hợp với bạn, bạn <b>nhân từng tiêu chí rồi cộng lại</b>: tiêu chí bạn coi trọng (số lớn) mà quán cũng làm đậm (số lớn) thì đóng góp nhiều điểm. Đó chính là tích vô hướng.</p>
<p>Còn cosine trả lời câu hỏi tinh tế hơn: <i>“tỷ lệ các vị có giống gu tôi không?”</i>, bất kể quán nêm nhạt hay đậm. Một quán nêm mọi thứ gấp đôi vẫn có cùng “phong cách”, nên cosine không đổi.</p>`,
  worked: { t: 'Chọn quán phở hợp khẩu vị nhất',
    setup: R`Khẩu vị bạn $\mathbf u=[3,2,4,1]$. Ba quán: $A=[4,1,5,0]$ (cay nồng), $B=[2,4,1,3]$ (ngọt béo), $C=[8,2,10,0]$ (giống hệt A nhưng nêm gấp đôi mọi vị). Quán nào hợp nhất?`,
    steps: [
      R`<b>Tích vô hướng với A.</b> Nhân từng cặp: $3\cdot4=12$, $2\cdot1=2$, $4\cdot5=20$, $1\cdot0=0$. Cộng: $\mathbf u\cdot A = 34$.`,
      R`<b>Với B:</b> $3\cdot2 + 2\cdot4 + 4\cdot1 + 1\cdot3 = 6+8+4+3 = 21$. <b>Với C:</b> $3\cdot8+2\cdot2+4\cdot10+1\cdot0 = 24+4+40+0=68$.`,
      R`<b>Nhận xét:</b> C thắng (68) chỉ vì nêm đậm, chứ “phong cách” giống hệt A. Tích vô hướng bị độ lớn chi phối, nên ta cần chuẩn hóa.`,
      R`<b>Độ dài:</b> $\|\mathbf u\| = \sqrt{9+4+16+1}=\sqrt{30}\approx5.477$; $\|A\|=\sqrt{16+1+25+0}=\sqrt{42}\approx6.481$; $\|B\|=\sqrt{4+16+1+9}=\sqrt{30}\approx5.477$; $\|C\| = \sqrt{64+4+100}=\sqrt{168}\approx12.961$ (đúng bằng $2\|A\|$).`,
      R`<b>Cosine:</b> $\cos(\mathbf u,A) = \frac{34}{5.477\cdot6.481}=\frac{34}{35.50}\approx0.958$; $\cos(\mathbf u,B)=\frac{21}{30}=0.700$; $\cos(\mathbf u,C)=\frac{68}{5.477\cdot12.961}=\frac{68}{70.99}\approx0.958$.`,
      R`<b>Kiểm tra bằng tính chất:</b> $C=2A$ nên cosine của C phải bằng của A. Đúng là cả hai đều $0.958$. Luôn dùng các tính chất như vậy để tự kiểm tra bài tính tay.`,
    ],
    ans: R`A (và bản nêm đậm của nó) hợp gu nhất với cosine ≈ 0.958; B chỉ đạt 0.700. Dùng cosine khi chỉ quan tâm “hướng”, dùng tích vô hướng khi độ lớn cũng có ý nghĩa.` },
  ex: [
    { q: R`Tính $[2,-1,3]\cdot[1,4,0]$.`, s: [R`Viết thẳng cột: $(2,1)$, $(-1,4)$, $(3,0)$.`, R`Nhân từng cặp: $2$, $-4$, $0$.`, R`Cộng: $2 + (-4) + 0$.`], a: R`$-2$. Dấu âm nghĩa là hai vector hơi ngược hướng.` },
    { q: R`Tính cosine giữa $\mathbf a=[1,0]$ và $\mathbf b=[1,1]$, suy ra góc giữa chúng.`, s: [R`Tích vô hướng: $1\cdot1 + 0\cdot1 = 1$.`, R`Độ dài: $\|\mathbf a\|=1$, $\|\mathbf b\| = \sqrt{1^2+1^2}=\sqrt2\approx1.414$.`, R`$\cos\theta = 1/(1\cdot1.414) \approx 0.707$.`, R`Góc có cosine $0.707$ là $45^\circ$ (vì $\cos45^\circ=\frac{\sqrt2}{2}$).`], a: R`$\cos\theta\approx0.707$, $\theta=45^\circ$.` },
    { q: R`Một ảnh xám $3\times3$ là $\begin{bmatrix}0&9&0\\0&9&0\\0&9&0\end{bmatrix}$ (vạch dọc). “Mẫu” $\mathbf w$ cũng là vạch dọc nhưng giá trị 1. Trải phẳng cả hai rồi tính tích vô hướng. Nếu mẫu là vạch ngang thì sao?`, s: [R`Trải phẳng theo hàng: ảnh $\mathbf x=[0,9,0,0,9,0,0,9,0]$; mẫu dọc $\mathbf w=[0,1,0,0,1,0,0,1,0]$.`, R`Chỉ 3 vị trí cùng khác 0: $9\cdot1\cdot3 = 27$.`, R`Mẫu ngang $\mathbf w'=[0,0,0,1,1,1,0,0,0]$: chỉ vị trí giữa trùng: $9\cdot1 = 9$.`, R`So sánh: 27 > 9, mẫu dọc “khớp” hơn. Đây chính là cách một nơ-ron hay một kernel tích chập phát hiện hình dạng.`], a: R`Mẫu dọc: 27; mẫu ngang: 9.` },
  ],
  miss: [[R`Tích vô hướng lớn nghĩa là hai vector giống nhau.`, R`Chỉ đúng khi độ dài tương đương. Vector rất dài cho tích lớn dù hướng khác. Muốn so “hướng” thì dùng cosine.`], [R`Tích vô hướng cho ra một vector.`, R`Kết quả là <b>một số</b>. Phép “nhân từng phần tử” $\mathbf a\odot\mathbf b$ mới cho ra vector.`]],
  recap: [R`$\mathbf a\cdot\mathbf b=\sum a_ib_i$: nhân thẳng cột, cộng lại.`, R`Cosine = tích vô hướng chia tích độ dài, đo “cùng hướng”.`, R`Nơ-ron, tích chập, attention, CLIP đều dựa trên phép đo này.`],
});

A('matmul', {
  intuit: R`<p>Hai bạn Lan và Minh đi chợ. Lan mua <b>2 kg thịt, 3 bó rau, 1 chục trứng</b>; Minh mua <b>1 kg thịt, 0 rau, 2 chục trứng</b>. Có hai chợ với bảng giá khác nhau (nghìn đồng): chợ Bến Thành [thịt 150, rau 10, trứng 35], chợ Tân Định [thịt 130, rau 12, trứng 30].</p>
<p>Muốn biết <i>mỗi người tốn bao nhiêu ở mỗi chợ</i>, bạn lấy giỏ hàng của một người (một <b>hàng</b>) “nhân thẳng” với bảng giá của một chợ (một <b>cột</b>) rồi cộng. Bốn kết quả xếp thành bảng 2 người × 2 chợ. Đó chính là nhân ma trận: mỗi ô là một tích vô hướng giữa một hàng và một cột.</p>
<p>Một lớp Linear làm đúng việc này: mỗi mẫu dữ liệu là “giỏ hàng”, mỗi nơ-ron là “một bảng giá”.</p>`,
  worked: { t: 'Tiền đi chợ của Lan và Minh',
    setup: R`$A$ = giỏ hàng (hàng: Lan, Minh; cột: thịt, rau, trứng) $=\begin{bmatrix}2&3&1\\1&0&2\end{bmatrix}$. $B$ = bảng giá (hàng: thịt, rau, trứng; cột: Bến Thành, Tân Định) $=\begin{bmatrix}150&130\\10&12\\35&30\end{bmatrix}$. Tính $C=AB$.`,
    steps: [
      R`<b>Kiểm tra kích thước:</b> $(2\times\mathbf 3)(\mathbf 3\times2)$. Hai số giữa đều là 3 (ba mặt hàng) nên nhân được, kết quả $2\times2$.`,
      R`<b>$C_{11}$ (Lan, Bến Thành):</b> hàng 1 của $A$ · cột 1 của $B$ $= 2\cdot150 + 3\cdot10 + 1\cdot35 = 300+30+35 = 365$.`,
      R`<b>$C_{12}$ (Lan, Tân Định):</b> $2\cdot130 + 3\cdot12 + 1\cdot30 = 260+36+30 = 326$.`,
      R`<b>$C_{21}$ (Minh, Bến Thành):</b> $1\cdot150 + 0\cdot10 + 2\cdot35 = 150+0+70 = 220$.`,
      R`<b>$C_{22}$ (Minh, Tân Định):</b> $1\cdot130 + 0\cdot12 + 2\cdot30 = 130+0+60=190$.`,
      R`<b>Đọc kết quả:</b> $C=\begin{bmatrix}365&326\\220&190\end{bmatrix}$. Cả hai đều nên đi Tân Định. Đếm phép nhân: $2\cdot3\cdot2 = 12$, đúng bằng $m\cdot n\cdot p$.`,
    ],
    ans: R`$C = \begin{bmatrix}365&326\\220&190\end{bmatrix}$ (nghìn đồng).` },
  ex: [
    { q: R`Batch 32 ảnh MNIST (mỗi ảnh 784 số) đi qua Linear(784 → 128). Shape đầu ra? Bao nhiêu phép nhân?`, s: [R`Viết shape: $X$ là $32\times784$, $W^\top$ là $784\times128$.`, R`Áp quy tắc $(m\times n)(n\times p)=(m\times p)$: $32\times128$.`, R`Số phép nhân $= m\cdot n\cdot p = 32\cdot784\cdot128$.`, R`Tính: $32\cdot784 = 25{,}088$; $25{,}088\cdot128 = 3{,}211{,}264$.`], a: R`Đầu ra $32\times128$; khoảng 3.2 triệu phép nhân.` },
    { q: R`Tính $\begin{bmatrix}1&2\\3&4\end{bmatrix}\begin{bmatrix}0&1\\1&0\end{bmatrix}$ và $\begin{bmatrix}0&1\\1&0\end{bmatrix}\begin{bmatrix}1&2\\3&4\end{bmatrix}$. Hai kết quả có bằng nhau không?`, s: [R`$AB$: ô $(1,1)$ $=1\cdot0+2\cdot1=2$; $(1,2)=1\cdot1+2\cdot0=1$; $(2,1)=3\cdot0+4\cdot1=4$; $(2,2)=3\cdot1+4\cdot0=3$.`, R`$AB=\begin{bmatrix}2&1\\4&3\end{bmatrix}$: hai <b>cột</b> của $A$ bị đổi chỗ.`, R`$BA$: $(1,1)=0\cdot1+1\cdot3=3$; $(1,2)=0\cdot2+1\cdot4=4$; $(2,1)=1$; $(2,2)=2$. $BA=\begin{bmatrix}3&4\\1&2\end{bmatrix}$: hai <b>hàng</b> bị đổi chỗ.`], a: R`Không bằng nhau. Nhân ma trận không giao hoán: nhân bên phải tác động lên cột, nhân bên trái tác động lên hàng.` },
  ],
  miss: [[R`Nhân ma trận là nhân từng ô cùng vị trí.`, R`Đó là phép Hadamard $A\odot B$ (cần cùng shape). Nhân ma trận là hàng × cột.`], [R`Shape nào nhân cũng được, PyTorch tự lo.`, R`Hai chiều “ở giữa” phải bằng nhau. Lỗi <code>mat1 and mat2 shapes cannot be multiplied</code> là lỗi bạn sẽ gặp nhiều nhất.`]],
  recap: [R`$C_{ij}$ = hàng $i$ của $A$ · cột $j$ của $B$.`, R`$(m\times n)(n\times p) = m\times p$; chi phí $mnp$ phép nhân.`, R`Lớp Linear: $Y = XW^\top + \mathbf b$.`],
});

A('calculus', {
  intuit: R`<p>Bạn đang lái xe máy xuống đèo Prenn trong sương mù dày, không nhìn thấy chân đèo. Cách duy nhất để xuống là <b>cảm nhận độ dốc ngay dưới bánh xe</b> rồi đi về phía thấp hơn. Đạo hàm chính là “độ dốc dưới bánh xe”: nó không cho biết đáy ở đâu, chỉ cho biết hướng nào đang đi xuống và dốc cỡ nào.</p>
<p><b>Quy tắc chuỗi</b> giống đổi tiền qua nhiều bước. 1 USD = 32 TWD, 1 TWD = 800 VND. Muốn biết 1 USD bằng bao nhiêu VND, ta <b>nhân các tỷ giá</b>: $32\times800 = 25{,}600$. Trong mạng nơ-ron cũng vậy: loss thay đổi bao nhiêu khi trọng số đầu tiên thay đổi = tích các “tỷ giá” (đạo hàm cục bộ) dọc đường đi.</p>`,
  worked: { t: 'Gradient của một mô hình 1 tham số',
    setup: R`Mô hình $\hat y = wx + b$ với $w=2, b=1$. Dữ liệu: $x=3$, đáp án $t=5$. Loss $L = (\hat y - t)^2$. Tính $\partial L/\partial w$, $\partial L/\partial b$, rồi kiểm tra bằng số.`,
    steps: [
      R`<b>Chia nhỏ thành các nút:</b> $z = wx + b$, $e = z - t$, $L = e^2$. Mỗi nút chỉ là một phép tính đơn giản.`,
      R`<b>Forward:</b> $z = 2\cdot3+1 = 7$; $e = 7-5 = 2$; $L = 2^2 = 4$.`,
      R`<b>Đạo hàm cục bộ từng nút:</b> $\frac{\partial L}{\partial e} = 2e = 4$; $\frac{\partial e}{\partial z} = 1$; $\frac{\partial z}{\partial w} = x = 3$; $\frac{\partial z}{\partial b} = 1$.`,
      R`<b>Nhân dọc đường (quy tắc chuỗi):</b> $\frac{\partial L}{\partial w} = 4\cdot1\cdot3 = 12$; $\frac{\partial L}{\partial b} = 4\cdot1\cdot1 = 4$.`,
      R`<b>Kiểm tra bằng số:</b> tăng $w$ lên $2.001$: $z=7.003$, $L = 2.003^2 = 4.012009$. Thay đổi $\approx 0.012$ khi $w$ tăng $0.001$, tức độ dốc $\approx12$. Khớp!`,
      R`<b>Ý nghĩa:</b> gradient dương nên muốn giảm loss phải <i>giảm</i> $w$ và $b$. Với bước $\eta=0.01$: $w \leftarrow 2 - 0.12 = 1.88$, $b\leftarrow 1-0.04=0.96$. Kiểm tra: $\hat y = 1.88\cdot3+0.96 = 6.6$, loss $=2.56 < 4$.`,
    ],
    ans: R`$\partial L/\partial w = 12$, $\partial L/\partial b = 4$; một bước giảm gradient đưa loss từ 4 xuống 2.56.` },
  ex: [
    { q: R`Cho $f(x)=x^3-3x$. Tìm $f'(2)$ và cho biết tại $x=2$ hàm đang tăng hay giảm.`, s: [R`Đạo hàm từng số hạng: $(x^3)' = 3x^2$, $(3x)'=3$.`, R`$f'(x) = 3x^2-3$.`, R`Thay $x=2$: $3\cdot4-3 = 9$.`], a: R`$f'(2)=9>0$: hàm đang tăng, và tăng khá nhanh.` },
    { q: R`Cho $L=\sigma(wx)$ với $\sigma$ là sigmoid, $w=0$, $x=4$. Tính $\partial L/\partial w$.`, s: [R`Đặt $z = wx = 0$. $\sigma(0)=0.5$.`, R`Đạo hàm sigmoid: $\sigma'(z) = \sigma(z)(1-\sigma(z)) = 0.5\cdot0.5=0.25$.`, R`$\partial z/\partial w = x = 4$.`, R`Quy tắc chuỗi: $0.25\cdot4 = 1$.`], a: R`$\partial L/\partial w = 1$.` },
    { q: R`Hàm hai biến $f(w_1,w_2) = w_1^2 + 3w_1w_2$. Tính gradient tại $(1, 2)$.`, s: [R`Đạo hàm riêng theo $w_1$ (coi $w_2$ là hằng): $2w_1 + 3w_2$.`, R`Theo $w_2$ (coi $w_1$ là hằng): $3w_1$.`, R`Thay $(1,2)$: $2+6 = 8$; $3$.`], a: R`$\nabla f(1,2) = [8, 3]$. Đi theo $-[8,3]$ để giảm $f$ nhanh nhất.` },
  ],
  miss: [[R`Gradient chỉ thẳng tới điểm thấp nhất.`, R`Gradient chỉ hướng dốc nhất <b>tại chỗ đang đứng</b>. Đi một bước nhỏ rồi phải đo lại.`], [R`Quy tắc chuỗi là cộng các đạo hàm.`, R`Dọc một đường thì <b>nhân</b>; khi nhiều đường cùng dẫn tới một biến thì <b>cộng</b> các tích lại.`]],
  recap: [R`Đạo hàm = độ dốc cục bộ; gradient = vector các độ dốc.`, R`Quy tắc chuỗi: nhân đạo hàm cục bộ dọc đường đi.`, R`Kiểm tra gradient bằng sai phân $\frac{f(x+h)-f(x)}{h}$.`],
});

A('prob', {
  intuit: R`<p>Ba bạn ứng cử lớp trưởng nhận “điểm nhiệt tình” từ lớp: An 2, Bình 1, Chi 0. Softmax biến các điểm này thành tỷ lệ phiếu. Nó dùng $e^{\text{điểm}}$ nên <b>người dẫn đầu được khuếch đại</b>: chênh 1 điểm thành chênh khoảng 2.7 lần phiếu.</p>
<p><b>Nhiệt độ</b> như mức độ “hưng phấn” của cử tri: nhiệt độ thấp thì ai cao điểm nhất gần như lấy hết phiếu; nhiệt độ cao thì phiếu chia đều hơn.</p>
<p><b>Cross-entropy</b> là “điểm phạt khi cá cược”. Mô hình phải đặt cược xác suất cho từng đáp án. Nếu nó đặt 90% vào đáp án đúng, phạt nhẹ ($-\ln0.9 = 0.105$). Nếu nó tự tin 99% vào đáp án sai, đáp án đúng chỉ được 1%, phạt rất nặng ($-\ln0.01 = 4.6$).</p>`,
  worked: { t: 'Bộ phân loại lỗi bo mạch 3 lớp',
    setup: R`Mạng xuất logits $\mathbf z = [2.0,\ 0.5,\ -1.0]$ cho ba lớp [xước, đứt mạch, OK]. Ảnh thật là <b>đứt mạch</b> (lớp 2). Tính xác suất, loss, và gradient theo logits.`,
    steps: [
      R`<b>Trừ max</b> (max = 2.0) để ổn định số: $[0,\ -1.5,\ -3.0]$. Kết quả softmax không đổi vì $\frac{e^{z_i-c}}{\sum e^{z_j-c}} = \frac{e^{z_i}}{\sum e^{z_j}}$.`,
      R`<b>Lũy thừa:</b> $e^0 = 1$, $e^{-1.5}\approx0.2231$, $e^{-3}\approx0.0498$.`,
      R`<b>Tổng:</b> $1 + 0.2231 + 0.0498 = 1.2729$.`,
      R`<b>Chia:</b> $p = [1/1.2729,\ 0.2231/1.2729,\ 0.0498/1.2729] \approx [0.786,\ 0.175,\ 0.039]$. Kiểm tra tổng $=1.000$. Mô hình đang tin là “xước”.`,
      R`<b>Loss:</b> lớp đúng là lớp 2: $\mathcal L = -\ln 0.175 \approx 1.743$. Khá cao vì mô hình đoán sai.`,
      R`<b>Gradient</b> $=p - y = [0.786-0,\ 0.175-1,\ 0.039-0] = [0.786,\ -0.825,\ 0.039]$.`,
      R`<b>Đọc gradient:</b> đi ngược gradient sẽ <i>giảm</i> logit “xước” (dương lớn), <i>tăng</i> logit “đứt mạch” (âm lớn), gần như không đụng “OK”. Đúng điều ta muốn.`,
    ],
    ans: R`$p\approx[0.786, 0.175, 0.039]$, loss $\approx1.743$, gradient $\approx[0.786, -0.825, 0.039]$.` },
  ex: [
    { q: R`Tính softmax của $[2,1,0]$.`, s: [R`Trừ max: $[0,-1,-2]$.`, R`Lũy thừa: $1,\ 0.3679,\ 0.1353$.`, R`Tổng $=1.5032$.`, R`Chia: $[0.665, 0.245, 0.090]$.`], a: R`$[0.665, 0.245, 0.090]$.` },
    { q: R`Làm lại câu trên với nhiệt độ $T=0.5$ và $T=2$. Nhận xét.`, s: [R`$T=0.5$: chia logits cho 0.5 → $[4,2,0]$. Trừ max $[0,-2,-4]$, lũy thừa $[1, 0.1353, 0.0183]$, tổng $1.1536$.`, R`Kết quả $T=0.5$: $[0.867, 0.117, 0.016]$.`, R`$T=2$: logits $[1, 0.5, 0]$, trừ max $[0,-0.5,-1]$, lũy thừa $[1, 0.6065, 0.3679]$, tổng $1.9744$.`, R`Kết quả $T=2$: $[0.506, 0.307, 0.186]$.`], a: R`$T$ nhỏ làm phân phối nhọn (gần chắc chắn), $T$ lớn làm phân phối phẳng (ngẫu nhiên hơn).` },
    { q: R`Mô hình A cho lớp đúng xác suất 0.6; mô hình B cho 0.3. Loss của mỗi mô hình là bao nhiêu? B tệ hơn A “gấp mấy lần” theo loss?`, s: [R`A: $-\ln0.6 = 0.511$.`, R`B: $-\ln0.3 = 1.204$.`, R`Tỷ lệ $1.204/0.511\approx2.36$.`], a: R`A: 0.511, B: 1.204. Xác suất giảm một nửa nhưng loss tăng 2.36 lần, vì log phạt nặng dần khi xác suất tiến về 0.` },
  ],
  miss: [[R`Softmax chỉ là chia mỗi logit cho tổng các logit.`, R`Phải lấy $e^z$ trước. Chia trực tiếp sẽ hỏng khi có logit âm và không khuếch đại đúng cách.`], [R`Xác suất softmax cao = mô hình chắc chắn đúng.`, R`Mạng hiện đại thường <b>tự tin quá mức</b> (over-confident). Cần hiệu chỉnh (calibration) nếu dùng xác suất để ra quyết định trên dây chuyền.`]],
  recap: [R`Softmax: $e^{z_i}/\sum e^{z_j}$, nhớ trừ max.`, R`Cross-entropy $=-\ln p_{\text{đúng}}$.`, R`Gradient theo logits $= p - y$.`],
});

A('gauss', {
  intuit: R`<p>Đo chiều cao 1000 sinh viên nam: phần lớn quanh 168 cm, càng xa càng hiếm, đồ thị hình chuông. Đó là Gaussian với $\mu=168$ (tâm chuông) và $\sigma\approx6$ (độ rộng chuông).</p>
<p><b>Lấy mẫu theo kiểu tái tham số hóa</b> giống như: trước tiên tung một “xúc xắc chuẩn” $\varepsilon$ (chuông tâm 0, rộng 1), rồi <b>kéo giãn</b> nó ra $\sigma$ lần và <b>dời</b> tới $\mu$. Phần ngẫu nhiên (xúc xắc) tách khỏi phần ta điều khiển ($\mu$, $\sigma$).</p>
<p><b>Cộng nhiễu</b> giống pha nước muối: đổ hai ly muối loãng vào nhau vẫn là nước muối, chỉ là độ mặn cộng lại. Thêm nhiễu Gaussian hai lần vẫn là một lần nhiễu Gaussian, với phương sai cộng lại. Diffusion dựa hoàn toàn vào điều này.</p>`,
  worked: { t: 'Gộp hai lần thêm nhiễu thành một',
    setup: R`Một pixel có giá trị $x_0 = 1$. Lần 1: $x_1 = 0.9x_0 + \sqrt{0.19}\,\varepsilon_1$. Lần 2: $x_2 = 0.8x_1 + 0.6\,\varepsilon_2$. Viết $x_2$ dưới dạng $a\,x_0 + b\,\varepsilon$ với một nhiễu duy nhất $\varepsilon\sim\mathcal N(0,1)$.`,
    steps: [
      R`<b>Thay $x_1$ vào:</b> $x_2 = 0.8(0.9x_0 + \sqrt{0.19}\varepsilon_1) + 0.6\varepsilon_2 = 0.72x_0 + 0.8\sqrt{0.19}\,\varepsilon_1 + 0.6\,\varepsilon_2$.`,
      R`<b>Hệ số tín hiệu:</b> $a = 0.72$.`,
      R`<b>Phương sai phần nhiễu:</b> hai nhiễu độc lập nên phương sai cộng: $(0.8)^2\cdot0.19 + 0.6^2 = 0.64\cdot0.19 + 0.36 = 0.1216 + 0.36 = 0.4816$.`,
      R`<b>Độ lệch chuẩn:</b> $b = \sqrt{0.4816}\approx0.694$.`,
      R`<b>Kiểm tra:</b> $a^2 + b^2 = 0.5184 + 0.4816 = 1$. Tổng phương sai được bảo toàn (đây là lý do Diffusion dùng hệ số $\sqrt{1-\beta}$).`,
    ],
    ans: R`$x_2 = 0.72\,x_0 + 0.694\,\varepsilon$. Hai bước nhiễu gộp thành một bước, đúng công thức “nhảy thẳng” của Diffusion với $\sqrt{\bar\alpha}=0.72$.` },
  ex: [
    { q: R`Với $\mu=2$, $\sigma=0.5$, $\varepsilon=-1.2$, tính mẫu $x$.`, s: [R`Co giãn: $\sigma\varepsilon = 0.5\cdot(-1.2) = -0.6$.`, R`Dời: $x = 2 + (-0.6)$.`], a: R`$x=1.4$.` },
    { q: R`Tính $D_{KL}(\mathcal N(1, 0.25)\,\|\,\mathcal N(0,1))$ (phương sai $0.25$, tức $\sigma=0.5$).`, s: [R`Công thức $\tfrac12(\mu^2+\sigma^2-1-\ln\sigma^2)$.`, R`$\mu^2 = 1$, $\sigma^2 = 0.25$, $\ln 0.25 = -1.386$.`, R`$\tfrac12(1 + 0.25 - 1 + 1.386) = \tfrac12\cdot1.636$.`], a: R`$\approx0.818$. Cả việc lệch tâm lẫn việc “hẹp” hơn chuẩn đều bị phạt.` },
  ],
  miss: [[R`Cộng hai nhiễu thì độ lệch chuẩn cộng lại.`, R`<b>Phương sai</b> cộng lại, không phải độ lệch chuẩn: $\sqrt{0.6^2+0.8^2}=1$, không phải $1.4$.`], [R`KL là khoảng cách đối xứng.`, R`$D_{KL}(p\|q)\neq D_{KL}(q\|p)$ nói chung.`]],
  recap: [R`Mẫu Gaussian: $x=\mu+\sigma\varepsilon$.`, R`Nhiễu độc lập: phương sai cộng lại.`, R`KL với $\mathcal N(0,1)$: $\tfrac12(\mu^2+\sigma^2-1-\ln\sigma^2)$.`],
});
