/* ================= GIAI ĐOẠN 0: TOÁN ================= */
L({ id: 'vector', p: 'p0', t: 'Vector & tích vô hướng', en: 'Vectors & Dot Product', min: 60, pre: [],
  goals: ['Biểu diễn dữ liệu (ảnh, từ, đặc trưng) thành vector', 'Tính tích vô hướng và cosine similarity bằng tay', 'Hiểu vì sao tích vô hướng là “phép đo độ giống nhau”'],
  body: R`
<p>Trong học sâu, <b>mọi thứ là vector</b>. Một ảnh xám 28×28 trải phẳng thành vector 784 chiều. Một từ được biểu diễn bằng vector 768 chiều. Một mảng 64×64 cắt từ ảnh AOI của bo mạch cũng chỉ là 4096 con số.</p>
<p>Vector $\mathbf{x} = [x_1, x_2, \dots, x_n]$ là một danh sách số có thứ tự. Hai phép toán quan trọng nhất:</p>
<h4>1. Tích vô hướng (dot product)</h4>
$$\mathbf{a}\cdot\mathbf{b} = \sum_{i=1}^{n} a_i b_i = a_1b_1 + a_2b_2 + \dots + a_nb_n$$
<p>Cách làm tay: nhân từng cặp phần tử cùng vị trí, rồi cộng tất cả lại. Kết quả là <b>một số</b>.</p>
<h4>2. Độ dài (chuẩn L2)</h4>
$$\|\mathbf{a}\| = \sqrt{\mathbf{a}\cdot\mathbf{a}} = \sqrt{a_1^2 + \dots + a_n^2}$$
<h4>Ý nghĩa hình học</h4>
$$\mathbf{a}\cdot\mathbf{b} = \|\mathbf{a}\|\,\|\mathbf{b}\|\cos\theta \quad\Rightarrow\quad \cos\theta = \frac{\mathbf{a}\cdot\mathbf{b}}{\|\mathbf{a}\|\|\mathbf{b}\|}$$
<p>Hai vector cùng hướng cho tích dương lớn, vuông góc cho 0, ngược hướng cho số âm. Đó là lý do tích vô hướng xuất hiện khắp nơi:</p>
<ul>
<li><b>Nơ-ron</b>: $z = \mathbf{w}\cdot\mathbf{x} + b$, tức là “đầu vào giống mẫu $\mathbf{w}$ bao nhiêu”.</li>
<li><b>Tích chập</b>: mỗi ô đầu ra là tích vô hướng giữa kernel và một mảng ảnh.</li>
<li><b>Attention</b>: điểm số $\mathbf{q}\cdot\mathbf{k}$ đo mức liên quan giữa hai token.</li>
<li><b>CLIP</b>: cosine similarity giữa vector ảnh và vector câu chữ.</li>
</ul>
<div class="tip"><b>Mẹo tính tay:</b> viết hai vector thành hai hàng thẳng cột, nhân dọc từng cột, ghi tích bên dưới, cộng ngang. Đây chính là “động tác” lặp lại hàng triệu lần trong GPU.</div>`,
  w: 'dot',
  ex: [
    ['Tính $[2,-1,3]\\cdot[1,4,0]$.', '$2\\cdot1 + (-1)\\cdot4 + 3\\cdot0 = 2 - 4 + 0 = -2$.'],
    ['Tính cosine giữa $[1,0]$ và $[1,1]$.', 'Tích vô hướng $=1$; độ dài $1$ và $\\sqrt2$. $\\cos\\theta = 1/\\sqrt2 \\approx 0.707$ (góc 45°).'],
    ['Nếu nhân mọi phần tử của $\\mathbf{a}$ với 3, cosine với $\\mathbf{b}$ thay đổi thế nào?', 'Không đổi. Cosine chỉ phụ thuộc hướng, không phụ thuộc độ dài. Đây là lý do CLIP chuẩn hóa vector trước khi so sánh.'],
  ],
  app: 'Khi so sánh ảnh bo mạch với ảnh “mẫu vàng” (golden sample), cosine similarity giữa hai vector đặc trưng là cách đơn giản nhất để đo mức khác biệt.',
  papers: [] });

L({ id: 'matmul', p: 'p0', t: 'Nhân ma trận', en: 'Matrix Multiplication', min: 90, pre: ['vector'],
  goals: ['Nhân hai ma trận bằng tay theo quy tắc hàng × cột', 'Kiểm tra kích thước trước khi nhân', 'Nhìn một lớp Linear như một phép nhân ma trận'],
  body: R`
<p>Ma trận là bảng số $m$ hàng × $n$ cột. Nhân ma trận chỉ là <b>làm nhiều tích vô hướng cùng lúc</b>.</p>
$$C = AB,\qquad C_{ij} = \sum_{k} A_{ik}B_{kj} = (\text{hàng } i \text{ của } A)\cdot(\text{cột } j \text{ của } B)$$
<h4>Quy tắc kích thước</h4>
$$(m\times n)\,(n\times p) = (m\times p)$$
<p>Hai số “ở giữa” phải bằng nhau và biến mất. Kiểm tra kích thước là thói quen số một khi đọc code PyTorch: hầu hết lỗi đều là lỗi shape.</p>
<h4>Lớp Linear = nhân ma trận</h4>
<p>Một batch $B$ mẫu, mỗi mẫu có $d_{in}$ đặc trưng, đi qua lớp Linear có $d_{out}$ đầu ra:</p>
$$Y_{(B\times d_{out})} = X_{(B\times d_{in})}\; W^{\top}_{(d_{in}\times d_{out})} + \mathbf{b}$$
<p>Mỗi hàng của $W$ là một “mẫu” mà một nơ-ron đang tìm. Vector $\mathbf{b}$ được <i>broadcast</i>, tức là cộng vào mọi hàng.</p>
<h4>Chi phí tính toán</h4>
<p>Nhân $(m\times n)(n\times p)$ cần $m\cdot n\cdot p$ phép nhân. Khi người ta nói “FLOPs” của mô hình, phần lớn đến từ đây (thường đếm $2mnp$ vì có cả phép cộng).</p>
<div class="tip"><b>Cách AI by Hand:</b> đặt $A$ bên trái, $B$ phía trên, kết quả $C$ ở ô giao nhau. Muốn tính ô $C_{ij}$ thì nhìn sang trái lấy hàng $i$, nhìn lên lấy cột $j$. Bố cục này giúp bạn không bao giờ nhầm chiều.</div>`,
  w: 'matmul',
  ex: [
    ['Batch 32 ảnh MNIST (784 chiều) qua Linear(784→128). Shape đầu ra và số phép nhân?', 'Đầu ra $32\\times128$. Số phép nhân $32\\cdot784\\cdot128 = 3{,}211{,}264$.'],
    ['Tính $\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$.', '$\\begin{bmatrix}2&1\\\\4&3\\end{bmatrix}$. Ma trận thứ hai hoán đổi hai cột.'],
    ['$AB$ có bằng $BA$ không?', 'Nói chung là không. Nhân ma trận không giao hoán, và nhiều khi $BA$ còn không xác định do sai kích thước.'],
  ],
  app: 'Lớp phân loại cuối cùng của mô hình AOI (ví dụ 512 đặc trưng → 6 loại lỗi) là một phép nhân ma trận $512\\times6$.',
  papers: [] });

L({ id: 'calculus', p: 'p0', t: 'Đạo hàm, gradient & quy tắc chuỗi', en: 'Derivatives & Chain Rule', min: 90, pre: ['vector'],
  goals: ['Hiểu đạo hàm là độ dốc cục bộ', 'Tính gradient của hàm nhiều biến', 'Thành thạo quy tắc chuỗi trên đồ thị tính toán'],
  body: R`
<p>Huấn luyện mạng nơ-ron là đi tìm tham số làm hàm mất mát nhỏ nhất. Muốn biết nên đi hướng nào, ta cần <b>độ dốc</b>, tức đạo hàm.</p>
$$f'(x) = \lim_{h\to0}\frac{f(x+h)-f(x)}{h}$$
<p>Nghĩa thực tế: tăng $x$ thêm một lượng rất nhỏ $\Delta x$ thì $f$ thay đổi khoảng $f'(x)\,\Delta x$.</p>
<h4>Gradient</h4>
<p>Với hàm nhiều biến $f(w_1,\dots,w_n)$, gradient gom mọi đạo hàm riêng lại thành vector:</p>
$$\nabla f = \left[\frac{\partial f}{\partial w_1}, \dots, \frac{\partial f}{\partial w_n}\right]$$
<p>Gradient chỉ hướng <b>tăng nhanh nhất</b>. Vì vậy ta đi ngược gradient để giảm loss.</p>
<h4>Quy tắc chuỗi: trái tim của backprop</h4>
<p>Nếu $L$ phụ thuộc $y$, và $y$ phụ thuộc $x$:</p>
$$\frac{\partial L}{\partial x} = \frac{\partial L}{\partial y}\cdot\frac{\partial y}{\partial x}$$
<p>Ví dụ: $L = (wx + b - t)^2$. Đặt $z = wx+b$, $e = z - t$, $L = e^2$. Khi đó</p>
$$\frac{\partial L}{\partial w} = \underbrace{2e}_{\partial L/\partial e}\cdot\underbrace{1}_{\partial e/\partial z}\cdot\underbrace{x}_{\partial z/\partial w} = 2(wx+b-t)\,x$$
<p>Mỗi nút trong đồ thị chỉ cần biết <b>đạo hàm cục bộ</b> của chính nó, rồi nhân với gradient từ phía sau truyền về. Đó là toàn bộ bí mật của autograd.</p>
<h4>Bảng đạo hàm cần thuộc</h4>
<table class="tbl"><tr><th>Hàm</th><th>Đạo hàm</th></tr>
<tr><td>$x^n$</td><td>$nx^{n-1}$</td></tr>
<tr><td>$e^x$</td><td>$e^x$</td></tr>
<tr><td>$\ln x$</td><td>$1/x$</td></tr>
<tr><td>$\sigma(x)=\frac{1}{1+e^{-x}}$</td><td>$\sigma(x)(1-\sigma(x))$</td></tr>
<tr><td>$\tanh x$</td><td>$1-\tanh^2 x$</td></tr>
<tr><td>$\max(0,x)$</td><td>$1$ nếu $x>0$, ngược lại $0$</td></tr></table>`,
  w: 'deriv',
  ex: [
    ['Cho $f(x)=x^3-3x$. Tìm $f\'(2)$.', '$f\'(x)=3x^2-3$, nên $f\'(2)=9$.'],
    ['Cho $L=(wx+b-t)^2$ với $w=2,x=3,b=1,t=5$. Tính $\\partial L/\\partial w$ và $\\partial L/\\partial b$.', '$e = 6+1-5 = 2$. $\\partial L/\\partial w = 2\\cdot2\\cdot3 = 12$, $\\partial L/\\partial b = 2\\cdot2 = 4$.'],
    ['Vì sao nói gradient “chảy ngược”?', 'Ta bắt đầu từ $\\partial L/\\partial L = 1$ ở cuối đồ thị, rồi nhân dần các đạo hàm cục bộ khi đi về đầu vào.'],
  ],
  app: '', papers: [] });

L({ id: 'prob', p: 'p0', t: 'Xác suất, softmax & cross-entropy', en: 'Softmax & Cross-Entropy', min: 90, pre: ['vector', 'calculus'],
  goals: ['Biến logits thành phân phối xác suất bằng softmax', 'Tính cross-entropy loss bằng tay', 'Hiểu vai trò của nhiệt độ (temperature)'],
  body: R`
<p>Mạng phân loại xuất ra các số thực tùy ý gọi là <b>logits</b> $\mathbf{z}=[z_1,\dots,z_K]$. Để thành xác suất (không âm, tổng bằng 1), ta dùng <b>softmax</b>:</p>
$$p_i = \frac{e^{z_i}}{\sum_{j=1}^{K} e^{z_j}}$$
<h4>Các bước tính tay</h4>
<ol><li>Trừ mọi logit cho giá trị lớn nhất (để $e^x$ không tràn số, kết quả không đổi).</li>
<li>Lấy $e^{z_i}$ cho từng phần tử.</li>
<li>Cộng tất cả lại.</li>
<li>Chia từng phần tử cho tổng.</li></ol>
<h4>Nhiệt độ</h4>
$$p_i = \frac{e^{z_i/T}}{\sum_j e^{z_j/T}}$$
<p>$T<1$ làm phân phối nhọn hơn (tự tin hơn), $T>1$ làm phẳng hơn. LLM dùng $T$ khi lấy mẫu; CLIP và học tương phản dùng $T$ nhỏ như 0.07.</p>
<h4>Cross-entropy</h4>
<p>Nếu nhãn đúng là lớp $y$, loss chỉ “nhìn” vào xác suất của lớp đúng:</p>
$$\mathcal{L}_{CE} = -\log p_y$$
<p>$p_y = 1$ thì loss bằng 0; $p_y \to 0$ thì loss tiến ra vô cùng. Mạng bị phạt rất nặng khi tự tin mà sai.</p>
<h4>Gradient đẹp nhất trong học sâu</h4>
$$\frac{\partial \mathcal{L}}{\partial z_i} = p_i - \mathbb{1}[i=y]$$
<p>Tức là “dự đoán trừ đáp án”. Lớp đúng bị đẩy lên, các lớp sai bị kéo xuống theo đúng xác suất chúng đang chiếm.</p>
<h4>Entropy & KL</h4>
<p>Entropy $H(p) = -\sum p_i\log p_i$ đo độ bất định. KL divergence $D_{KL}(p\|q) = \sum p_i \log\frac{p_i}{q_i}$ đo khoảng cách (không đối xứng) giữa hai phân phối. Cross-entropy $= H(p) + D_{KL}(p\|q)$.</p>`,
  w: 'softmax',
  ex: [
    ['Tính softmax của $[2, 1, 0]$ (lấy $e\\approx2.718$).', '$e^2=7.389, e^1=2.718, e^0=1$, tổng $11.107$. Kết quả $\\approx[0.665, 0.245, 0.090]$.'],
    ['Với kết quả trên và nhãn đúng là lớp 2 (giá trị $0.245$), cross-entropy là bao nhiêu?', '$-\\ln 0.245 \\approx 1.406$.'],
    ['Gradient theo logits trong câu trên?', '$p - y = [0.665, 0.245-1, 0.090] = [0.665, -0.755, 0.090]$.'],
  ],
  app: 'Dữ liệu lỗi bo mạch thường mất cân bằng (rất nhiều ảnh “OK”, ít ảnh lỗi). Khi đó người ta thêm trọng số lớp vào cross-entropy hoặc dùng focal loss (bài Hàm mất mát).',
  papers: [] });

L({ id: 'gauss', p: 'p0', t: 'Phân phối Gaussian & KL divergence', en: 'Gaussians & KL', min: 75, pre: ['prob'],
  goals: ['Lấy mẫu từ Gaussian bằng công thức $\\mu + \\sigma\\varepsilon$', 'Tính KL giữa hai Gaussian', 'Chuẩn bị nền toán cho VAE và Diffusion'],
  body: R`
<p>Phân phối chuẩn (Gaussian) là “ngôn ngữ chung” của VAE và Diffusion.</p>
$$\mathcal{N}(x;\mu,\sigma^2) = \frac{1}{\sqrt{2\pi\sigma^2}}\exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$$
<h4>Lấy mẫu (reparameterization)</h4>
$$x = \mu + \sigma\,\varepsilon,\qquad \varepsilon\sim\mathcal{N}(0,1)$$
<p>Viết như vậy, phần ngẫu nhiên $\varepsilon$ tách khỏi tham số $\mu,\sigma$, nên ta lấy đạo hàm theo $\mu,\sigma$ được. Đây chính là “mẹo tái tham số hóa” của VAE.</p>
<h4>Tính chất cộng (cực quan trọng cho Diffusion)</h4>
<p>Tổng hai Gaussian độc lập vẫn là Gaussian, phương sai cộng lại:</p>
$$a\,\varepsilon_1 + b\,\varepsilon_2 \sim \mathcal{N}(0, a^2+b^2)$$
<p>Nhờ tính chất này, thêm nhiễu $t$ lần liên tiếp có thể gộp thành <b>một lần</b> thêm nhiễu duy nhất.</p>
<h4>KL giữa hai Gaussian</h4>
$$D_{KL}\big(\mathcal{N}(\mu,\sigma^2)\,\|\,\mathcal{N}(0,1)\big) = \tfrac12\left(\mu^2 + \sigma^2 - 1 - \ln\sigma^2\right)$$
<p>Công thức này là số hạng “điều chuẩn” trong loss của VAE. Nó bằng 0 khi $\mu=0,\sigma=1$.</p>
<h4>MLE và loss quen thuộc</h4>
<p>Giả sử nhiễu Gaussian rồi tối đa hóa likelihood thì thu được <b>MSE</b>. Giả sử phân phối phân loại (categorical) thì thu được <b>cross-entropy</b>. Loss không phải chọn tùy tiện: nó là giả định về dữ liệu.</p>`,
  w: 'gauss',
  ex: [
    ['Với $\\mu=2,\\sigma=0.5$ và $\\varepsilon=-1.2$, mẫu $x$ bằng bao nhiêu?', '$x = 2 + 0.5\\cdot(-1.2) = 1.4$.'],
    ['Tính $D_{KL}$ của $\\mathcal N(1, 1)$ so với $\\mathcal N(0,1)$.', '$\\tfrac12(1 + 1 - 1 - 0) = 0.5$.'],
    ['$0.8\\varepsilon_1 + 0.6\\varepsilon_2$ có phân phối gì?', '$\\mathcal N(0, 0.64+0.36) = \\mathcal N(0,1)$.'],
  ],
  app: '', papers: [] });

/* ================= GIAI ĐOẠN 1: MẠNG NƠ-RON ================= */
L({ id: 'neuron', p: 'p1', t: 'Nơ-ron nhân tạo & perceptron', en: 'Neuron & Perceptron', min: 60, pre: ['vector'],
  goals: ['Tính đầu ra một nơ-ron: tổng có trọng số + bias + kích hoạt', 'Hiểu ranh giới quyết định tuyến tính', 'Thấy giới hạn của một nơ-ron (bài toán XOR)'],
  body: R`
<p>Một nơ-ron nhân tạo làm ba việc:</p>
$$z = \mathbf{w}\cdot\mathbf{x} + b,\qquad a = f(z)$$
<ol><li><b>Nhân</b> từng đầu vào với trọng số.</li><li><b>Cộng</b> lại và thêm bias $b$.</li><li><b>Kích hoạt</b> qua hàm phi tuyến $f$.</li></ol>
<p>Trọng số $\mathbf{w}$ cho biết đầu vào nào quan trọng; bias dịch ngưỡng kích hoạt.</p>
<h4>Ranh giới quyết định</h4>
<p>Tập điểm $\mathbf{w}\cdot\mathbf{x}+b=0$ là một đường thẳng (2D), mặt phẳng (3D), hay siêu phẳng. Một nơ-ron chỉ chia không gian được <b>bằng một nhát cắt thẳng</b>.</p>
<h4>Perceptron (Rosenblatt, 1958)</h4>
<p>Với $f$ là hàm bậc thang, quy tắc học là: nếu đoán sai thì $\mathbf{w}\leftarrow\mathbf{w} + \eta\,(y-\hat y)\,\mathbf{x}$. Thuật toán hội tụ nếu dữ liệu tách được tuyến tính.</p>
<h4>Bài toán XOR</h4>
<p>Bốn điểm $(0,0)\to0$, $(0,1)\to1$, $(1,0)\to1$, $(1,1)\to0$ không thể chia bằng một đường thẳng. Phát hiện này (Minsky & Papert, 1969) góp phần gây ra “mùa đông AI” đầu tiên. Lời giải là <b>xếp nhiều nơ-ron thành lớp</b>, xem bài MLP.</p>`,
  w: 'neuron',
  ex: [
    ['$\\mathbf w=[0.5,-1]$, $b=0.2$, $\\mathbf x=[2,1]$, $f$=ReLU. Tính $a$.', '$z = 1 - 1 + 0.2 = 0.2$, $a = 0.2$.'],
    ['Tìm $\\mathbf w, b$ để nơ-ron bậc thang thực hiện phép AND.', 'Ví dụ $\\mathbf w=[1,1], b=-1.5$: chỉ $(1,1)$ cho $z=0.5>0$.'],
  ],
  app: '', papers: ['Rosenblatt (1958) — The Perceptron'] });

L({ id: 'activation', p: 'p1', t: 'Hàm kích hoạt', en: 'Activation Functions', min: 60, pre: ['neuron', 'calculus'],
  goals: ['Hiểu vì sao cần phi tuyến', 'So sánh sigmoid, tanh, ReLU, GELU, SiLU', 'Nhận ra hiện tượng tiêu biến gradient'],
  body: R`
<p>Nếu bỏ hàm kích hoạt, chồng bao nhiêu lớp cũng chỉ bằng <b>một lớp tuyến tính</b>: $W_2(W_1\mathbf x) = (W_2W_1)\mathbf x$. Phi tuyến là thứ cho mạng sâu sức mạnh biểu diễn.</p>
<table class="tbl"><tr><th>Hàm</th><th>Công thức</th><th>Dùng ở đâu</th></tr>
<tr><td>Sigmoid</td><td>$\frac{1}{1+e^{-x}}$</td><td>Đầu ra nhị phân, cổng LSTM</td></tr>
<tr><td>Tanh</td><td>$\frac{e^x-e^{-x}}{e^x+e^{-x}}$</td><td>RNN, LSTM</td></tr>
<tr><td>ReLU</td><td>$\max(0,x)$</td><td>CNN kinh điển (ResNet, VGG)</td></tr>
<tr><td>Leaky ReLU</td><td>$\max(0.01x, x)$</td><td>GAN (discriminator)</td></tr>
<tr><td>GELU</td><td>$x\,\Phi(x)$</td><td>Transformer, ViT, BERT, GPT</td></tr>
<tr><td>SiLU / Swish</td><td>$x\,\sigma(x)$</td><td>EfficientNet, YOLO, U-Net của Diffusion</td></tr></table>
<h4>Tiêu biến gradient</h4>
<p>Đạo hàm sigmoid lớn nhất chỉ là $0.25$. Qua 10 lớp, gradient có thể nhỏ cỡ $0.25^{10}\approx 10^{-6}$, các lớp đầu gần như không học. ReLU có đạo hàm bằng 1 ở vùng dương nên khắc phục được, nhưng có thể gây “ReLU chết” (nơ-ron luôn ra 0). GELU và SiLU mềm hơn ở gần 0, cho gradient mượt.</p>
<h4>Gated Linear Unit (GLU / SwiGLU)</h4>
<p>LLM hiện đại dùng $\text{SwiGLU}(\mathbf x) = \text{SiLU}(\mathbf xW_1)\odot(\mathbf xW_2)$: một nhánh làm “cổng” điều tiết nhánh còn lại.</p>`,
  w: 'act',
  ex: [
    ['Tính $\\sigma(0)$ và $\\sigma\'(0)$.', '$\\sigma(0)=0.5$; $\\sigma\'(0)=0.5\\cdot0.5=0.25$.'],
    ['ReLU của $[-2, 0.5, 3, -0.1]$?', '$[0, 0.5, 3, 0]$.'],
    ['GELU(0) bằng bao nhiêu? GELU(−3) xấp xỉ?', 'GELU(0)=0. GELU(−3) ≈ $-3\\cdot\\Phi(-3) \\approx -3\\cdot0.00135\\approx-0.004$.'],
  ],
  app: '', papers: ['Hendrycks & Gimpel (2016) — GELU', 'Shazeer (2020) — GLU Variants Improve Transformer'] });

L({ id: 'mlp', p: 'p1', t: 'MLP & lan truyền thuận', en: 'Multi-Layer Perceptron', min: 90, pre: ['matmul', 'activation'],
  goals: ['Tính forward pass của MLP nhiều lớp', 'Đếm số tham số', 'Giải XOR bằng mạng 2 lớp'],
  body: R`
<p>MLP (Multi-Layer Perceptron) xếp nhiều lớp nơ-ron nối tiếp. Mỗi lớp là một phép nhân ma trận theo sau bởi kích hoạt:</p>
$$\mathbf h^{(1)} = f(W^{(1)}\mathbf x + \mathbf b^{(1)}),\quad \mathbf h^{(2)} = f(W^{(2)}\mathbf h^{(1)} + \mathbf b^{(2)}),\;\dots$$
<h4>Đếm tham số</h4>
<p>Lớp từ $d_{in}$ sang $d_{out}$ có $d_{in}\cdot d_{out} + d_{out}$ tham số (ma trận + bias). MLP $784\to256\to128\to10$ có:</p>
$$784\cdot256+256 + 256\cdot128+128 + 128\cdot10+10 = 235{,}146$$
<h4>Giải XOR bằng tay</h4>
<p>Lớp ẩn có 2 nơ-ron ReLU:</p>
$$h_1 = \text{ReLU}(x_1 + x_2),\qquad h_2 = \text{ReLU}(x_1 + x_2 - 1)$$
$$y = h_1 - 2h_2$$
<p>Thử: $(1,1)$ cho $h_1=2,h_2=1,y=0$. $(1,0)$ cho $h_1=1,h_2=0,y=1$. Lớp ẩn đã “bẻ cong” không gian để lớp cuối chỉ cần một nhát cắt thẳng.</p>
<h4>Định lý xấp xỉ phổ quát</h4>
<p>MLP một lớp ẩn đủ rộng có thể xấp xỉ mọi hàm liên tục trên miền đóng. Nhưng “đủ rộng” có thể cực lớn; mạng <b>sâu</b> thường hiệu quả hơn mạng <b>rộng</b> với cùng số tham số.</p>
<h4>MLP vẫn còn ở khắp nơi</h4>
<p>Khối FFN trong Transformer là MLP 2 lớp. Đầu phân loại của CNN là MLP. Nhánh time-embedding của Diffusion là MLP. Mapping network của StyleGAN là MLP 8 lớp.</p>`,
  w: 'mlp',
  diag: { nodes: ['x ∈ ℝ²', { t: 'Linear 2→2', s: 'W¹, b¹' }, 'ReLU', { t: 'Linear 2→1', s: 'W², b²' }, 'ŷ'] },
  ex: [
    ['Đếm tham số MLP $3\\to4\\to2$.', '$3\\cdot4+4 + 4\\cdot2+2 = 26$.'],
    ['Kiểm tra mạng XOR ở trên với đầu vào $(0,0)$.', '$h_1=0,h_2=\\text{ReLU}(-1)=0$, $y=0$. Đúng.'],
  ],
  app: '', papers: ['Rumelhart, Hinton, Williams (1986)', 'Cybenko (1989) — Universal approximation'] });

L({ id: 'loss', p: 'p1', t: 'Hàm mất mát', en: 'Loss Functions', min: 75, pre: ['prob'],
  goals: ['Chọn đúng loss cho hồi quy, phân loại, phân đoạn', 'Hiểu focal loss cho dữ liệu mất cân bằng', 'Tính Dice loss bằng tay'],
  body: R`
<p>Loss là “điểm phạt” cho biết dự đoán tệ cỡ nào. Chọn loss = chọn điều bạn thực sự muốn tối ưu.</p>
<table class="tbl"><tr><th>Loss</th><th>Công thức</th><th>Bài toán</th></tr>
<tr><td>MSE</td><td>$\frac1n\sum(y-\hat y)^2$</td><td>Hồi quy, Diffusion (dự đoán nhiễu)</td></tr>
<tr><td>MAE / L1</td><td>$\frac1n\sum|y-\hat y|$</td><td>Hồi quy bền với ngoại lai, Pix2Pix</td></tr>
<tr><td>BCE</td><td>$-[y\log p + (1-y)\log(1-p)]$</td><td>Nhị phân, đa nhãn, GAN</td></tr>
<tr><td>Cross-entropy</td><td>$-\log p_y$</td><td>Phân loại nhiều lớp</td></tr>
<tr><td>Focal</td><td>$-(1-p_t)^\gamma\log p_t$</td><td>Mất cân bằng mạnh, phát hiện vật thể</td></tr>
<tr><td>Dice</td><td>$1-\frac{2|A\cap B|}{|A|+|B|}$</td><td>Phân đoạn vùng nhỏ</td></tr></table>
<h4>Focal loss</h4>
<p>Với $p_t$ là xác suất của lớp đúng, hệ số $(1-p_t)^\gamma$ <b>giảm trọng số mẫu dễ</b>. Mẫu đã đoán đúng với $p_t=0.9$, $\gamma=2$ chỉ còn $0.01$ lần loss gốc. Mô hình dồn sức cho mẫu khó, thường là lớp hiếm.</p>
<h4>Dice loss</h4>
<p>Với mask dự đoán mềm $p_i$ và mask thật $g_i$:</p>
$$\mathcal L_{Dice} = 1 - \frac{2\sum p_ig_i + \epsilon}{\sum p_i + \sum g_i + \epsilon}$$
<p>Dice không bị “ngộp” bởi hàng triệu pixel nền như BCE từng pixel, nên rất hợp với vết lỗi nhỏ.</p>`,
  w: 'focal',
  ex: [
    ['$p_t=0.6$, $\\gamma=2$. Tỷ lệ focal/CE?', '$(1-0.6)^2 = 0.16$.'],
    ['Mask thật $[1,1,0,0]$, dự đoán $[0.9, 0.5, 0.1, 0]$. Tính Dice (bỏ $\\epsilon$).', 'Giao $= 0.9+0.5 = 1.4$; tổng $=1.5+2=3.5$. Dice $=2.8/3.5=0.8$, loss $=0.2$.'],
  ],
  app: 'Vết xước, đứt mạch, chấm đồng thừa trên bo mạch thường chỉ chiếm vài chục pixel trong ảnh hàng triệu pixel. Kết hợp BCE + Dice, hoặc focal loss, là lựa chọn phổ biến.',
  papers: ['Lin et al. (2017) — Focal Loss for Dense Object Detection', 'Milletari et al. (2016) — V-Net (Dice loss)'] });

L({ id: 'backprop', p: 'p1', t: 'Lan truyền ngược', en: 'Backpropagation', min: 120, pre: ['calculus', 'mlp', 'loss'],
  goals: ['Tính gradient từng tham số bằng quy tắc chuỗi', 'Thuộc công thức gradient của lớp Linear', 'Tự chạy một vòng huấn luyện bằng tay'],
  body: R`
<p>Backprop chỉ là quy tắc chuỗi áp dụng có hệ thống từ cuối về đầu, tái sử dụng kết quả trung gian để không phải tính lại.</p>
<h4>Bốn bước của một vòng huấn luyện</h4>
<ol><li><b>Forward:</b> tính và <i>lưu</i> mọi giá trị trung gian $z, a$.</li>
<li><b>Loss:</b> so sánh đầu ra với nhãn.</li>
<li><b>Backward:</b> đi ngược, tính $\partial L/\partial(\cdot)$ cho mọi nút.</li>
<li><b>Update:</b> $\theta \leftarrow \theta - \eta\,\nabla_\theta L$.</li></ol>
<h4>Công thức cho lớp Linear</h4>
<p>Với $\mathbf z = W\mathbf x + \mathbf b$ và đã biết $\boldsymbol\delta = \partial L/\partial\mathbf z$:</p>
$$\frac{\partial L}{\partial W} = \boldsymbol\delta\,\mathbf x^\top,\qquad \frac{\partial L}{\partial \mathbf b} = \boldsymbol\delta,\qquad \frac{\partial L}{\partial \mathbf x} = W^\top\boldsymbol\delta$$
<p>Ghi nhớ bằng kích thước: $\partial L/\partial W$ phải cùng shape với $W$ ($d_{out}\times d_{in}$), nên chỉ có thể là $\boldsymbol\delta_{(d_{out}\times1)}\mathbf x^\top_{(1\times d_{in})}$.</p>
<h4>Qua hàm kích hoạt</h4>
$$\boldsymbol\delta^{(l)} = \big(W^{(l+1)\top}\boldsymbol\delta^{(l+1)}\big)\odot f'(\mathbf z^{(l)})$$
<p>$\odot$ là nhân từng phần tử. Với ReLU, $f'$ là mặt nạ 0/1: gradient chỉ đi qua những nơ-ron đã “bật”.</p>
<h4>Ba quy tắc khi gradient gặp nút</h4>
<ul><li><b>Nút cộng</b> chia đều: gradient đi nguyên vẹn vào cả hai nhánh. (Đây là lý do kết nối tắt của ResNet hiệu quả.)</li>
<li><b>Nút nhân</b> hoán đổi: $\partial(xy)/\partial x = y$.</li>
<li><b>Nút rẽ nhánh</b> (một biến dùng nhiều nơi) thì cộng dồn gradient từ mọi nơi.</li></ul>
<div class="tip">Trong widget dưới, hãy bấm “Một bước GD” vài lần và theo dõi loss giảm. Đó là toàn bộ quá trình huấn luyện, thu nhỏ còn 2 tham số.</div>`,
  w: 'backprop',
  ex: [
    ['$z = wx+b$, $a=\\sigma(z)$, $L=\\tfrac12(a-y)^2$. Viết $\\partial L/\\partial w$.', '$(a-y)\\cdot a(1-a)\\cdot x$.'],
    ['Lớp Linear $3\\to2$ nhận $\\mathbf x=[1,0,2]$ và $\\boldsymbol\\delta=[0.5,-1]$. Tính $\\partial L/\\partial W$.', '$\\begin{bmatrix}0.5&0&1\\\\-1&0&-2\\end{bmatrix}$.'],
  ],
  app: '', papers: ['Rumelhart, Hinton, Williams (1986) — Learning representations by back-propagating errors'] });

L({ id: 'optim', p: 'p1', t: 'Tối ưu hóa: SGD, Momentum, Adam', en: 'Optimizers', min: 90, pre: ['backprop'],
  goals: ['Viết công thức cập nhật của SGD, Momentum, Adam', 'Chọn learning rate và lịch giảm lr', 'Hiểu AdamW khác Adam ở đâu'],
  body: R`
<h4>Gradient descent và SGD</h4>
$$\theta_{t+1} = \theta_t - \eta\,\mathbf g_t$$
<p>SGD dùng gradient trên một mini-batch (32–256 mẫu) thay vì toàn bộ dữ liệu: nhanh hơn và nhiễu vừa đủ để thoát điểm yên ngựa.</p>
<h4>Momentum</h4>
$$\mathbf v_{t} = \beta\mathbf v_{t-1} + \mathbf g_t,\qquad \theta_{t+1} = \theta_t - \eta\mathbf v_t$$
<p>Như hòn bi lăn xuống dốc: tích lũy vận tốc theo hướng ổn định, triệt tiêu dao động ngang trong thung lũng hẹp.</p>
<h4>Adam</h4>
$$\mathbf m_t = \beta_1\mathbf m_{t-1} + (1-\beta_1)\mathbf g_t,\qquad \mathbf v_t = \beta_2\mathbf v_{t-1} + (1-\beta_2)\mathbf g_t^2$$
$$\hat{\mathbf m}_t = \frac{\mathbf m_t}{1-\beta_1^t},\quad \hat{\mathbf v}_t = \frac{\mathbf v_t}{1-\beta_2^t},\qquad \theta_{t+1} = \theta_t - \eta\frac{\hat{\mathbf m}_t}{\sqrt{\hat{\mathbf v}_t}+\epsilon}$$
<p>Mỗi tham số có learning rate riêng: tham số gradient lớn thì bước nhỏ lại, gradient nhỏ thì bước lớn lên. Mặc định $\beta_1=0.9,\beta_2=0.999$.</p>
<h4>AdamW</h4>
<p>Adam gốc trộn weight decay vào gradient nên bị chia cho $\sqrt{\hat v}$. AdamW tách riêng: $\theta \leftarrow \theta - \eta\lambda\theta$. Đây là mặc định cho Transformer và ViT.</p>
<h4>Lịch learning rate</h4>
<ul><li><b>Warmup:</b> tăng tuyến tính từ 0 trong vài nghìn bước đầu (quan trọng với Transformer).</li>
<li><b>Cosine decay:</b> $\eta_t = \eta_{min} + \tfrac12(\eta_{max}-\eta_{min})(1+\cos\frac{\pi t}{T})$.</li>
<li><b>Step decay:</b> chia 10 ở các mốc cố định (ResNet kinh điển).</li></ul>`,
  w: 'optim',
  ex: [
    ['Adam bước 1: $g=0.2$, $\\beta_1=0.9,\\beta_2=0.999$, $\\eta=0.01$. Tính bước cập nhật.', '$m=0.02, v=0.00004$; $\\hat m=0.2, \\hat v=0.04$; bước $=0.01\\cdot0.2/0.2 = 0.01$. Bước đầu tiên của Adam luôn có độ lớn xấp xỉ $\\eta$.'],
    ['Vì sao cần bias correction?', '$m_0=v_0=0$ nên các bước đầu bị kéo về 0; chia cho $1-\\beta^t$ bù lại.'],
  ],
  app: '', papers: ['Kingma & Ba (2015) — Adam', 'Loshchilov & Hutter (2019) — AdamW'] });

L({ id: 'norm', p: 'p1', t: 'Chuẩn hóa & chống quá khớp', en: 'Normalization & Regularization', min: 90, pre: ['backprop'],
  goals: ['Tính BatchNorm và LayerNorm bằng tay', 'Biết khi nào dùng BN, LN, GN', 'Dùng dropout, weight decay, augmentation đúng chỗ'],
  body: R`
<h4>Chuẩn hóa</h4>
<p>Mọi kiểu chuẩn hóa đều làm cùng một việc: trừ trung bình, chia độ lệch chuẩn, rồi nhân $\gamma$ cộng $\beta$ học được:</p>
$$\hat x = \frac{x-\mu}{\sqrt{\sigma^2+\epsilon}},\qquad y = \gamma\hat x + \beta$$
<p>Khác nhau duy nhất ở chỗ <b>tính $\mu,\sigma$ trên trục nào</b>:</p>
<table class="tbl"><tr><th>Loại</th><th>Tính thống kê trên</th><th>Dùng trong</th></tr>
<tr><td>BatchNorm</td><td>Các mẫu trong batch (theo từng kênh)</td><td>CNN: ResNet, YOLO</td></tr>
<tr><td>LayerNorm</td><td>Các đặc trưng của một mẫu</td><td>Transformer, ViT, LLM</td></tr>
<tr><td>GroupNorm</td><td>Một nhóm kênh của một mẫu</td><td>U-Net của Diffusion, batch nhỏ</td></tr>
<tr><td>RMSNorm</td><td>Như LN nhưng không trừ trung bình</td><td>LLaMA và LLM mới</td></tr></table>
<p>BatchNorm phụ thuộc kích thước batch và hoạt động khác nhau giữa train/eval (dùng running mean). LayerNorm không phụ thuộc batch nên hợp với chuỗi độ dài thay đổi.</p>
<h4>Khởi tạo trọng số</h4>
<p>Xavier: $\text{Var}(w) = \frac{2}{n_{in}+n_{out}}$ (cho tanh). He: $\text{Var}(w)=\frac{2}{n_{in}}$ (cho ReLU). Mục tiêu là giữ phương sai tín hiệu ổn định qua các lớp.</p>
<h4>Chống quá khớp</h4>
<ul><li><b>Dropout:</b> khi train, tắt ngẫu nhiên mỗi nơ-ron với xác suất $p$ và nhân phần còn lại với $\frac1{1-p}$.</li>
<li><b>Weight decay:</b> phạt $\lambda\|\theta\|^2$, kéo trọng số về gần 0.</li>
<li><b>Data augmentation:</b> lật, xoay, cắt, đổi màu, Mixup, CutMix. Thường là cách hiệu quả nhất.</li>
<li><b>Early stopping:</b> dừng khi loss validation bắt đầu tăng.</li></ul>`,
  w: 'norm',
  ex: [
    ['LayerNorm của $[2, 4, 6]$ (bỏ $\\epsilon$, $\\gamma=1,\\beta=0$).', '$\\mu=4$, $\\sigma^2 = (4+0+4)/3 = 8/3$, $\\sigma\\approx1.633$. Kết quả $\\approx[-1.225, 0, 1.225]$.'],
    ['Dropout $p=0.5$, đầu vào $[2,4,6,8]$, mặt nạ $[1,0,0,1]$. Đầu ra?', '$[4, 0, 0, 16]$ (nhân với $1/(1-0.5)=2$).'],
  ],
  app: 'Augmentation cho ảnh AOI cần cẩn thận: xoay 90° thường hợp lệ, nhưng biến đổi màu quá mạnh có thể biến vùng oxy hóa thành “bình thường” hoặc ngược lại.',
  papers: ['Ioffe & Szegedy (2015) — Batch Normalization', 'Ba et al. (2016) — Layer Normalization', 'Srivastava et al. (2014) — Dropout'] });
