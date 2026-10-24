/* ================= GIAI ĐOẠN 5: MÔ HÌNH SINH ================= */
L({ id: 'ae', p: 'p5', t: 'Autoencoder', en: 'Autoencoder', min: 60, pre: ['detseg'],
  goals: ['Hiểu nén – giải nén qua nút cổ chai', 'Dùng lỗi tái tạo để phát hiện bất thường', 'Thấy giới hạn sinh mẫu của AE thường'],
  body: R`
<p>Autoencoder gồm encoder $\mathbf z = f_\phi(\mathbf x)$ nén ảnh xuống vector nhỏ, và decoder $\hat{\mathbf x} = g_\theta(\mathbf z)$ tái tạo lại. Huấn luyện bằng:</p>
$$\mathcal L = \|\mathbf x - g_\theta(f_\phi(\mathbf x))\|^2$$
<p>Vì $\mathbf z$ nhỏ hơn nhiều so với $\mathbf x$, mạng buộc phải giữ lại những gì quan trọng nhất.</p>
<h4>Phát hiện bất thường</h4>
<p>Huấn luyện AE chỉ trên ảnh <b>bình thường</b>. Khi gặp ảnh có lỗi, AE tái tạo ra phiên bản “bình thường hóa”; hiệu $|\mathbf x - \hat{\mathbf x}|$ sáng lên đúng tại vùng lỗi. Đơn giản và không cần nhãn lỗi.</p>
<p>Nhược điểm: AE đủ mạnh đôi khi tái tạo luôn cả lỗi, và ảnh tái tạo thường bị mờ ở vùng chi tiết, gây báo động giả.</p>
<h4>Vì sao AE thường không sinh ảnh tốt</h4>
<p>Không gian $\mathbf z$ không có cấu trúc: lấy ngẫu nhiên một điểm $\mathbf z$ thường rơi vào “vùng trống” mà decoder chưa từng thấy, cho ra ảnh vô nghĩa. VAE giải quyết đúng vấn đề này.</p>
<h4>Biến thể</h4>
<p><b>Denoising AE:</b> thêm nhiễu vào đầu vào, bắt tái tạo ảnh sạch (tiền thân ý tưởng của Diffusion). <b>Sparse AE:</b> phạt độ thưa của $\mathbf z$. <b>VQ-VAE:</b> lượng tử hóa $\mathbf z$ thành mã rời rạc từ một sổ mã.</p>`,
  w: null,
  diag: { nodes: [{ t: 'x', s: '256²' }, { t: 'Encoder', s: 'conv ↓' }, { t: 'z', s: 'nút cổ chai', c: 'red' }, { t: 'Decoder', s: 'conv ↑' }, { t: 'x̂', s: '256²' }] },
  ex: [['Ảnh $64\\times64$ xám nén còn $\\mathbf z$ 128 chiều. Tỷ lệ nén?', '$4096/128 = 32$ lần.']],
  app: 'Đây là cách tiếp cận “chỉ cần ảnh tốt” phổ biến khi dây chuyền có rất ít mẫu lỗi. Hiện nay các phương pháp dựa trên feature pretrained (PatchCore) thường chính xác hơn AE thuần.',
  papers: ['Hinton & Salakhutdinov (2006) — Reducing the dimensionality of data', 'Vincent et al. (2008) — Denoising Autoencoders'] });

L({ id: 'vae', p: 'p5', t: 'Variational Autoencoder (VAE)', en: 'VAE', min: 120, pre: ['ae', 'gauss'],
  goals: ['Viết loss ELBO = tái tạo + KL', 'Tính tay mẹo tái tham số hóa và số hạng KL', 'Hiểu vì sao VAE sinh được ảnh mới'],
  body: R`
<p>VAE biến encoder thành bộ dự đoán <b>phân phối</b>: với mỗi ảnh, encoder xuất ra $\boldsymbol\mu$ và $\log\boldsymbol\sigma^2$, mô tả một vùng Gaussian trong không gian ẩn.</p>
$$q_\phi(\mathbf z|\mathbf x) = \mathcal N(\boldsymbol\mu, \text{diag}(\boldsymbol\sigma^2))$$
<h4>Mẹo tái tham số hóa</h4>
$$\mathbf z = \boldsymbol\mu + \boldsymbol\sigma\odot\boldsymbol\varepsilon,\qquad\boldsymbol\varepsilon\sim\mathcal N(0,I)$$
<p>Gradient đi qua $\boldsymbol\mu,\boldsymbol\sigma$ bình thường; tính ngẫu nhiên nằm trong $\boldsymbol\varepsilon$ không cần đạo hàm.</p>
<h4>Loss (âm của ELBO)</h4>
$$\mathcal L = \underbrace{\|\mathbf x - \hat{\mathbf x}\|^2}_{\text{tái tạo}} + \beta\,\underbrace{\sum_j \tfrac12\left(\mu_j^2 + \sigma_j^2 - 1 - \ln\sigma_j^2\right)}_{D_{KL}(q\|\mathcal N(0,I))}$$
<p>Hai số hạng kéo co: tái tạo muốn mỗi ảnh có vùng riêng, nhỏ, tách biệt; KL muốn mọi vùng chồng lên $\mathcal N(0,I)$. Kết quả là một không gian ẩn <b>liên tục và lấp đầy</b>: lấy mẫu $\mathbf z\sim\mathcal N(0,I)$ rồi decode sẽ ra ảnh hợp lý.</p>
<h4>Vì sao ảnh VAE hay bị mờ</h4>
<p>Loss MSE tương đương giả định nhiễu Gaussian quanh ảnh trung bình; khi không chắc chắn, mô hình trả về trung bình của nhiều khả năng, tức là ảnh mờ. GAN và Diffusion khắc phục điều này.</p>
<h4>VAE trong Stable Diffusion</h4>
<p>Latent Diffusion dùng VAE (với loss perceptual + adversarial) để nén ảnh $512^2\times3$ xuống latent $64^2\times4$. Diffusion chạy trong không gian nhỏ này, rẻ hơn khoảng 48 lần.</p>`,
  w: 'vae',
  diag: { nodes: ['x', 'Encoder', { t: 'μ, log σ²', s: '' }, { t: 'z = μ + σ·ε', s: 'ε ~ N(0,I)', c: 'red' }, 'Decoder', 'x̂'] },
  ex: [['$\\mu=[0.5, -1]$, $\\sigma=[1, 0.5]$. Tính KL.', 'Chiều 1: $\\tfrac12(0.25+1-1-0)=0.125$. Chiều 2: $\\tfrac12(1+0.25-1-\\ln0.25) = \\tfrac12(0.25+1.386)=0.818$. Tổng $\\approx0.943$.']],
  app: '', papers: ['Kingma & Welling (2014) — Auto-Encoding Variational Bayes', 'Higgins et al. (2017) — β-VAE'] });

L({ id: 'gan', p: 'p5', t: 'Mạng đối kháng sinh (GAN)', en: 'Generative Adversarial Networks', min: 120, pre: ['loss', 'optim'],
  goals: ['Viết hàm mục tiêu minimax', 'Tính tay loss của D và G', 'Hiểu luân phiên huấn luyện và loss non-saturating'],
  body: R`
<p>Hai mạng đấu với nhau. <b>Generator</b> $G$ biến nhiễu $\mathbf z$ thành ảnh giả. <b>Discriminator</b> $D$ đoán xác suất ảnh là thật.</p>
$$\min_G\max_D\; V(D,G) = \mathbb E_{\mathbf x\sim p_{data}}[\log D(\mathbf x)] + \mathbb E_{\mathbf z}[\log(1-D(G(\mathbf z)))]$$
<h4>Huấn luyện luân phiên</h4>
<ol><li><b>Bước D:</b> lấy batch ảnh thật và ảnh giả. Tối thiểu hóa BCE với nhãn thật = 1, giả = 0:
$$\mathcal L_D = -\log D(\mathbf x) - \log(1 - D(G(\mathbf z)))$$</li>
<li><b>Bước G:</b> giữ D cố định, cập nhật G để D tin ảnh giả là thật. Dùng dạng <i>non-saturating</i>:
$$\mathcal L_G = -\log D(G(\mathbf z))$$</li></ol>
<h4>Vì sao không dùng $\log(1-D(G(z)))$ cho G?</h4>
<p>Lúc đầu ảnh giả rất tệ, $D(G(\mathbf z))\approx0$, nên $\log(1-D)$ phẳng, gradient gần 0, G không học được. Dạng $-\log D(G(\mathbf z))$ cho gradient lớn đúng lúc G cần nhất.</p>
<h4>Lý thuyết</h4>
<p>Với G cố định, D tối ưu là $D^*(\mathbf x) = \frac{p_{data}(\mathbf x)}{p_{data}(\mathbf x)+p_g(\mathbf x)}$. Thay vào, G đang tối thiểu hóa Jensen–Shannon divergence giữa phân phối thật và phân phối sinh. Điểm cân bằng: $p_g = p_{data}$, $D = 0.5$ ở mọi nơi.</p>
<h4>Khó khăn</h4>
<ul><li><b>Mode collapse:</b> G chỉ sinh vài kiểu ảnh lừa được D.</li><li><b>Mất ổn định:</b> hai mạng dao động thay vì hội tụ.</li><li>Không có loss nào phản ánh trực tiếp chất lượng ảnh; phải dùng FID.</li></ul>`,
  w: 'gan',
  diag: { nodes: [{ t: 'z ~ N(0,I)', s: 'nhiễu' }, { t: 'Generator', s: 'G' }, { t: 'Ảnh giả', s: 'G(z)' }, { t: 'Discriminator', s: 'D', c: 'red' }, { t: 'Thật / Giả', s: 'xác suất' }] },
  ex: [['$D(\\mathbf x)=0.8$, $D(G(\\mathbf z))=0.3$. Tính $\\mathcal L_D$ và $\\mathcal L_G$ (log tự nhiên).', '$\\mathcal L_D = -\\ln0.8 - \\ln0.7 = 0.223+0.357 = 0.580$. $\\mathcal L_G = -\\ln0.3 = 1.204$.']],
  app: 'GAN từng là công cụ chính để sinh ảnh lỗi tổng hợp (synthetic defect) cho dữ liệu AOI thiếu mẫu, đặc biệt các biến thể có điều kiện như Pix2Pix: vẽ mask lỗi, mô hình “dán” lỗi chân thực vào ảnh bo mạch sạch.',
  papers: ['Goodfellow et al. (2014) — Generative Adversarial Nets'] });

L({ id: 'ganvar', p: 'p5', t: 'Biến thể GAN: DCGAN → StyleGAN', en: 'GAN Variants', min: 90, pre: ['gan', 'detseg'],
  goals: ['Nắm các cải tiến chính của GAN', 'Phân biệt GAN có điều kiện, Pix2Pix, CycleGAN', 'Hiểu FID đánh giá chất lượng sinh'],
  body: R`
<table class="tbl"><tr><th>Mô hình</th><th>Ý tưởng</th></tr>
<tr><td>DCGAN (2015)</td><td>Quy tắc kiến trúc ổn định: conv stride thay pooling, BN, ReLU ở G, LeakyReLU ở D.</td></tr>
<tr><td>cGAN</td><td>Thêm điều kiện $y$ (nhãn lớp) vào cả G và D: $G(\mathbf z, y)$.</td></tr>
<tr><td>WGAN / WGAN-GP</td><td>Thay JS divergence bằng khoảng cách Wasserstein; D thành “critic” không có sigmoid; phạt gradient để giữ tính Lipschitz. Huấn luyện ổn định hơn nhiều.</td></tr>
<tr><td>Pix2Pix</td><td>Dịch ảnh có cặp: G là U-Net, D là PatchGAN (chấm điểm từng mảnh), loss $= \mathcal L_{GAN} + \lambda\|\mathbf y - G(\mathbf x)\|_1$.</td></tr>
<tr><td>CycleGAN</td><td>Dịch ảnh <b>không cặp</b> giữa hai miền A↔B, thêm loss chu trình $\|F(G(\mathbf x)) - \mathbf x\|_1$.</td></tr>
<tr><td>StyleGAN 1–3</td><td>Mạng ánh xạ $\mathbf z\to\mathbf w$ (MLP 8 lớp), tiêm $\mathbf w$ vào từng tầng qua AdaIN/điều chế, thêm nhiễu cho chi tiết ngẫu nhiên. Chất lượng khuôn mặt gần như thật.</td></tr></table>
<h4>FID</h4>
<p>Đưa ảnh thật và ảnh sinh qua Inception, lấy feature, xấp xỉ mỗi tập bằng một Gaussian $(\boldsymbol\mu,\Sigma)$:</p>
$$\text{FID} = \|\boldsymbol\mu_r - \boldsymbol\mu_g\|^2 + \text{Tr}\big(\Sigma_r + \Sigma_g - 2(\Sigma_r\Sigma_g)^{1/2}\big)$$
<p>Càng thấp càng tốt. Đo cả chất lượng lẫn độ đa dạng.</p>`,
  w: null,
  ex: [['Muốn biến ảnh bo mạch sạch thành ảnh có lỗi theo mask cho trước, nhưng chỉ có ít cặp ảnh. Chọn Pix2Pix hay CycleGAN?', 'Có cặp (ảnh + mask → ảnh lỗi) thì Pix2Pix chính xác hơn. Nếu chỉ có hai tập ảnh rời rạc (tốt / lỗi) không khớp cặp thì CycleGAN.']],
  app: 'Khi sinh dữ liệu lỗi tổng hợp, ngoài FID nên đánh giá bằng hiệu quả thực tế: mô hình phát hiện huấn luyện thêm ảnh tổng hợp có tăng recall trên ảnh lỗi thật không.',
  papers: ['Radford et al. (2016) — DCGAN', 'Gulrajani et al. (2017) — WGAN-GP', 'Isola et al. (2017) — Pix2Pix', 'Zhu et al. (2017) — CycleGAN', 'Karras et al. (2019) — StyleGAN'] });

L({ id: 'diffwd', p: 'p5', t: 'Diffusion I: quá trình thêm nhiễu', en: 'Diffusion — Forward Process', min: 90, pre: ['gauss', 'vae'],
  goals: ['Viết quá trình thêm nhiễu từng bước', 'Suy ra công thức nhảy thẳng tới bước $t$', 'So sánh lịch nhiễu tuyến tính và cosine'],
  body: R`
<p>Ý tưởng của Diffusion: phá ảnh thành nhiễu rất từ từ (dễ), rồi học cách đảo ngược từng bước nhỏ (khó nhưng làm được, vì mỗi bước rất nhỏ).</p>
<h4>Một bước thêm nhiễu</h4>
$$q(\mathbf x_t|\mathbf x_{t-1}) = \mathcal N\big(\sqrt{1-\beta_t}\,\mathbf x_{t-1},\;\beta_t I\big)$$
<p>Thu nhỏ ảnh một chút và thêm nhiễu phương sai $\beta_t$ (rất nhỏ, ví dụ từ $10^{-4}$ đến $0.02$, qua $T=1000$ bước). Hệ số $\sqrt{1-\beta_t}$ giữ cho tổng phương sai không phình ra.</p>
<h4>Nhảy thẳng tới bước $t$</h4>
<p>Đặt $\alpha_t = 1-\beta_t$ và $\bar\alpha_t = \prod_{s=1}^t\alpha_s$. Nhờ tính chất cộng Gaussian (<a href="#gauss">bài Gaussian</a>):</p>
$$\boxed{\mathbf x_t = \sqrt{\bar\alpha_t}\,\mathbf x_0 + \sqrt{1-\bar\alpha_t}\,\boldsymbol\varepsilon,\qquad\boldsymbol\varepsilon\sim\mathcal N(0,I)}$$
<p>Đây là công thức quan trọng nhất của Diffusion: khi huấn luyện, ta không cần chạy $t$ bước, chỉ cần chọn $t$ ngẫu nhiên và trộn ảnh với nhiễu theo tỷ lệ $\sqrt{\bar\alpha_t}:\sqrt{1-\bar\alpha_t}$.</p>
<h4>Lịch nhiễu</h4>
<ul><li><b>Tuyến tính</b> (DDPM): $\beta_t$ tăng đều. Ảnh bị phá hủy quá sớm, nhiều bước cuối gần như thuần nhiễu.</li>
<li><b>Cosine</b> (Improved DDPM): $\bar\alpha_t = \cos^2\!\big(\frac{t/T+s}{1+s}\cdot\frac\pi2\big)$. Thông tin giảm đều hơn.</li></ul>
<p>Đại lượng hữu ích: tỷ số tín hiệu/nhiễu $\text{SNR}(t) = \bar\alpha_t/(1-\bar\alpha_t)$, giảm đơn điệu theo $t$.</p>`,
  w: 'diffuse',
  ex: [['$\\bar\\alpha_t = 0.64$, $x_0 = 1.0$, $\\varepsilon = -0.5$. Tính $x_t$.', '$\\sqrt{0.64}=0.8$, $\\sqrt{0.36}=0.6$. $x_t = 0.8 - 0.3 = 0.5$.']],
  app: '', papers: ['Sohl-Dickstein et al. (2015) — Deep Unsupervised Learning using Nonequilibrium Thermodynamics', 'Ho et al. (2020) — DDPM', 'Nichol & Dhariwal (2021) — Improved DDPM'] });

L({ id: 'diffrev', p: 'p5', t: 'Diffusion II: khử nhiễu & huấn luyện', en: 'Diffusion — Reverse & Training', min: 120, pre: ['diffwd', 'detseg'],
  goals: ['Hiểu loss “dự đoán nhiễu”', 'Tính tay một bước lấy mẫu DDPM', 'Biết U-Net với time embedding'],
  body: R`
<h4>Huấn luyện: dự đoán nhiễu</h4>
<p>Mạng $\boldsymbol\varepsilon_\theta(\mathbf x_t, t)$ nhìn ảnh nhiễu và bước $t$, đoán xem nhiễu nào đã được thêm vào. Thuật toán:</p>
<ol><li>Lấy ảnh $\mathbf x_0$, chọn $t\sim\text{Uniform}\{1..T\}$, lấy $\boldsymbol\varepsilon\sim\mathcal N(0,I)$.</li>
<li>Tạo $\mathbf x_t = \sqrt{\bar\alpha_t}\mathbf x_0 + \sqrt{1-\bar\alpha_t}\boldsymbol\varepsilon$.</li>
<li>Loss: $\;\mathcal L = \|\boldsymbol\varepsilon - \boldsymbol\varepsilon_\theta(\mathbf x_t, t)\|^2$.</li></ol>
<p>Chỉ là MSE. Đơn giản hơn GAN rất nhiều và ổn định.</p>
<h4>Từ nhiễu dự đoán suy ra ảnh sạch</h4>
$$\hat{\mathbf x}_0 = \frac{\mathbf x_t - \sqrt{1-\bar\alpha_t}\,\boldsymbol\varepsilon_\theta}{\sqrt{\bar\alpha_t}}$$
<h4>Một bước lấy mẫu DDPM</h4>
$$\mathbf x_{t-1} = \frac{1}{\sqrt{\alpha_t}}\left(\mathbf x_t - \frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\,\boldsymbol\varepsilon_\theta(\mathbf x_t,t)\right) + \sigma_t\mathbf z,\qquad\mathbf z\sim\mathcal N(0,I)$$
<p>Bắt đầu từ $\mathbf x_T\sim\mathcal N(0,I)$, lặp 1000 lần từ $t=T$ về $1$ (ở bước cuối không thêm $\mathbf z$).</p>
<h4>Mạng khử nhiễu</h4>
<p>Thường là <b>U-Net</b> với khối residual, GroupNorm, SiLU, self-attention ở độ phân giải thấp. Bước $t$ được mã hóa sinusoidal (như positional encoding), qua MLP, rồi cộng vào từng khối residual, để một mạng duy nhất biết đang khử nhiễu ở “mức độ” nào.</p>
<h4>Ba cách tham số hóa tương đương</h4>
<p>Dự đoán $\boldsymbol\varepsilon$, dự đoán $\mathbf x_0$, hoặc dự đoán vận tốc $\mathbf v = \sqrt{\bar\alpha_t}\boldsymbol\varepsilon - \sqrt{1-\bar\alpha_t}\mathbf x_0$. Chúng chuyển đổi được cho nhau; $\mathbf v$ ổn định hơn ở hai đầu lịch nhiễu.</p>`,
  w: 'denoise',
  diag: { nodes: [{ t: 'x_T', s: 'nhiễu thuần' }, { t: 'ε_θ(x_t, t)', s: 'U-Net', c: 'red' }, { t: 'x_{t−1}', s: 'bớt nhiễu' }, { t: '… ×T', s: '' }, { t: 'x_0', s: 'ảnh' }] },
  ex: [['$\\bar\\alpha_t=0.25$, $x_t = 0.4$, $\\varepsilon_\\theta = 0.2$. Tính $\\hat x_0$.', '$\\hat x_0 = (0.4 - \\sqrt{0.75}\\cdot0.2)/0.5 = (0.4-0.173)/0.5 = 0.454$.']],
  app: 'Diffusion có điều kiện (mask lỗi, loại lỗi, ảnh nền sạch) hiện là hướng chủ đạo để sinh ảnh lỗi tổng hợp với độ đa dạng và độ chân thực cao hơn GAN, ít bị mode collapse.',
  papers: ['Ho et al. (2020) — DDPM', 'Salimans & Ho (2022) — Progressive Distillation (v-prediction)'] });

L({ id: 'diffadv', p: 'p5', t: 'Diffusion III: DDIM, CFG, Latent Diffusion, DiT, Flow', en: 'Modern Diffusion', min: 120, pre: ['diffrev', 'transformer'],
  goals: ['Hiểu DDIM lấy mẫu nhanh', 'Tính tay classifier-free guidance', 'Nắm Latent Diffusion, ControlNet, DiT, Flow Matching'],
  body: R`
<h4>DDIM: lấy mẫu nhanh</h4>
<p>Quá trình ngược tất định (khi $\eta=0$), cho phép nhảy cóc: dùng 20–50 bước thay vì 1000 mà không cần huấn luyện lại.</p>
$$\mathbf x_{t'} = \sqrt{\bar\alpha_{t'}}\,\hat{\mathbf x}_0 + \sqrt{1-\bar\alpha_{t'}}\,\boldsymbol\varepsilon_\theta$$
<h4>Classifier-Free Guidance (CFG)</h4>
<p>Huấn luyện một mạng cho cả có điều kiện $c$ và không điều kiện (bỏ $c$ ngẫu nhiên 10% thời gian). Khi lấy mẫu:</p>
$$\tilde{\boldsymbol\varepsilon} = \boldsymbol\varepsilon_\theta(\mathbf x_t, \varnothing) + w\big(\boldsymbol\varepsilon_\theta(\mathbf x_t, c) - \boldsymbol\varepsilon_\theta(\mathbf x_t,\varnothing)\big)$$
<p>$w=1$ là có điều kiện thường; $w$ lớn (5–9) đẩy mạnh theo hướng “giống điều kiện hơn”, đổi lại giảm đa dạng.</p>
<h4>Latent Diffusion (Stable Diffusion)</h4>
<p>Chạy diffusion trong latent của VAE ($64\times64\times4$ thay vì $512\times512\times3$). Văn bản qua text encoder (CLIP), đưa vào U-Net bằng <b>cross-attention</b>.</p>
<h4>ControlNet</h4>
<p>Sao chép encoder của U-Net thành nhánh huấn luyện được, nhận điều kiện không gian (cạnh, độ sâu, tư thế, mask), nối vào mạng gốc qua conv $1\times1$ khởi tạo bằng 0. Mô hình gốc được giữ nguyên, nên không mất chất lượng.</p>
<h4>DiT (Diffusion Transformer)</h4>
<p>Thay U-Net bằng Transformer trên các mảnh latent (giống ViT). Bước $t$ và lớp điều kiện tiêm qua <b>adaLN</b>: dùng chúng dự đoán $\gamma,\beta$ của LayerNorm. Mở rộng tốt theo quy mô; là nền của Stable Diffusion 3, FLUX, Sora.</p>
<h4>Flow Matching / Rectified Flow</h4>
<p>Nối ảnh và nhiễu bằng đường thẳng $\mathbf x_t = (1-t)\mathbf x_0 + t\boldsymbol\varepsilon$, mạng học vận tốc $\mathbf v_\theta \approx \boldsymbol\varepsilon - \mathbf x_0$. Sinh ảnh bằng cách giải phương trình vi phân từ nhiễu về ảnh; đường gần thẳng nên cần ít bước.</p>`,
  w: 'cfg',
  ex: [['$\\varepsilon_u = 0.2$, $\\varepsilon_c = 0.5$, $w=7.5$. Tính $\\tilde\\varepsilon$.', '$0.2 + 7.5\\cdot0.3 = 2.45$. Hướng điều kiện bị khuếch đại rất mạnh.']],
  app: 'ControlNet hoặc inpainting có điều kiện mask cho phép đặt lỗi tổng hợp đúng vị trí mong muốn trên ảnh bo mạch thật, kèm sẵn nhãn phân đoạn.',
  papers: ['Song et al. (2021) — DDIM', 'Ho & Salimans (2022) — Classifier-Free Guidance', 'Rombach et al. (2022) — Latent Diffusion', 'Zhang et al. (2023) — ControlNet', 'Peebles & Xie (2023) — DiT', 'Lipman et al. (2023) — Flow Matching', 'Liu et al. (2023) — Rectified Flow'] });

/* ================= GIAI ĐOẠN 6: HIỆN ĐẠI ================= */
L({ id: 'contrastive', p: 'p6', t: 'Học tương phản & CLIP', en: 'Contrastive Learning & CLIP', min: 90, pre: ['prob', 'vit'],
  goals: ['Tính tay loss InfoNCE trên ma trận tương đồng', 'Hiểu SimCLR và CLIP', 'Dùng CLIP cho phân loại zero-shot'],
  body: R`
<p>Học tương phản: kéo các cặp “dương” (cùng nội dung) lại gần, đẩy các cặp “âm” ra xa, không cần nhãn lớp.</p>
<h4>InfoNCE</h4>
<p>Với batch $N$ cặp, tính ma trận tương đồng cosine $S_{ij} = \mathbf u_i\cdot\mathbf v_j$ (đã chuẩn hóa). Loss cho hàng $i$ chính là cross-entropy với đáp án nằm trên đường chéo:</p>
$$\mathcal L_i = -\log\frac{\exp(S_{ii}/\tau)}{\sum_{j=1}^{N}\exp(S_{ij}/\tau)}$$
<h4>SimCLR</h4>
<p>Hai góc nhìn tăng cường (cắt, đổi màu) của cùng một ảnh là cặp dương; mọi ảnh khác trong batch là cặp âm. Batch càng lớn càng nhiều mẫu âm.</p>
<h4>CLIP</h4>
<p>Encoder ảnh (ViT) và encoder văn bản (Transformer) được huấn luyện trên 400 triệu cặp ảnh–chú thích. Loss InfoNCE đối xứng (theo hàng và theo cột), $\tau$ học được.</p>
<h4>Zero-shot</h4>
<p>Viết câu “ảnh bo mạch có vết xước”, “ảnh bo mạch bình thường”…, mã hóa thành vector, chọn câu có cosine cao nhất với vector ảnh. Phân loại không cần huấn luyện thêm.</p>`,
  w: 'clip',
  ex: [['Hàng $S = [0.9, 0.2, 0.1]$, $\\tau=0.1$, đáp án ở vị trí 1. Loss?', 'Logits $[9,2,1]$. $e^9=8103$, $e^2=7.39$, $e^1=2.72$. $p = 8103/8113 = 0.9988$, loss $\\approx0.0012$.']],
  app: 'CLIP zero-shot trên ảnh AOI thường yếu vì miền ảnh khác xa ảnh internet; các phương pháp như WinCLIP/AnomalyCLIP tinh chỉnh câu prompt và so sánh theo từng mảnh để cải thiện.',
  papers: ['Chen et al. (2020) — SimCLR', 'Radford et al. (2021) — CLIP', 'Jeong et al. (2023) — WinCLIP'] });

L({ id: 'llm', p: 'p6', t: 'GPT & mô hình ngôn ngữ lớn', en: 'Large Language Models', min: 90, pre: ['transformer', 'mha'],
  goals: ['Hiểu huấn luyện dự đoán token tiếp theo', 'Tính tay temperature, top-k, top-p', 'Hiểu KV cache và quy luật mở rộng'],
  body: R`
<p>LLM là chồng khối Transformer decoder (attention nhân quả), huấn luyện trên hàng nghìn tỷ token với một mục tiêu duy nhất:</p>
$$\mathcal L = -\sum_t \log p_\theta(x_t \mid x_{\lt t})$$
<h4>Ba giai đoạn</h4>
<ol><li><b>Tiền huấn luyện:</b> dự đoán token tiếp theo trên văn bản thô.</li>
<li><b>Tinh chỉnh có giám sát (SFT):</b> học theo cặp câu hỏi–trả lời mẫu.</li>
<li><b>Căn chỉnh</b> (RLHF, DPO…): học theo đánh giá ưu tiên của con người.</li></ol>
<h4>Giải mã</h4>
<ul><li><b>Temperature</b> $T$: chia logits cho $T$ trước softmax.</li>
<li><b>Top-k:</b> chỉ giữ $k$ token xác suất cao nhất, chuẩn hóa lại.</li>
<li><b>Top-p (nucleus):</b> giữ tập nhỏ nhất có tổng xác suất ≥ $p$.</li></ul>
<h4>KV cache</h4>
<p>Khi sinh token mới, $K, V$ của các token cũ không đổi; lưu lại để không tính lại. Mỗi bước chỉ tính $\mathbf q, \mathbf k, \mathbf v$ cho một token. Đổi lại tốn bộ nhớ: $2\cdot L\cdot n\cdot d$ số cho mỗi chuỗi.</p>
<h4>Quy luật mở rộng</h4>
<p>Loss giảm theo luật lũy thừa khi tăng tham số, dữ liệu và tính toán. Chinchilla gợi ý khoảng <b>20 token mỗi tham số</b> là tối ưu tính toán khi huấn luyện.</p>`,
  w: 'topp',
  ex: [['Xác suất $[0.5, 0.25, 0.15, 0.1]$, top-p $=0.7$. Giữ token nào, xác suất mới?', 'Cộng dồn: 0.5, 0.75 ≥ 0.7. Giữ 2 token đầu: $[0.667, 0.333]$.']],
  app: '', papers: ['Radford et al. (2019) — GPT-2', 'Brown et al. (2020) — GPT-3', 'Hoffmann et al. (2022) — Chinchilla', 'Holtzman et al. (2020) — Nucleus Sampling'] });

L({ id: 'lora', p: 'p6', t: 'Tinh chỉnh hiệu quả: LoRA', en: 'LoRA & PEFT', min: 60, pre: ['matmul', 'transformer'],
  goals: ['Hiểu phân rã hạng thấp $\\Delta W = BA$', 'Tính số tham số tiết kiệm', 'Biết QLoRA, adapter, prompt tuning'],
  body: R`
<p>Tinh chỉnh toàn bộ một mô hình tỷ tham số rất tốn bộ nhớ. LoRA giữ nguyên $W_0$, chỉ học một <b>phần cập nhật hạng thấp</b>:</p>
$$W = W_0 + \Delta W = W_0 + \frac{\alpha}{r}BA,\qquad B\in\mathbb R^{d\times r},\;A\in\mathbb R^{r\times k},\;r\ll\min(d,k)$$
<p>$A$ khởi tạo ngẫu nhiên, $B$ khởi tạo bằng 0, nên lúc đầu $\Delta W = 0$ và mô hình giữ nguyên hành vi.</p>
<h4>Tiết kiệm</h4>
<p>$W$ kích thước $4096\times4096$ có 16.8 triệu tham số. LoRA $r=8$: $4096\cdot8 + 8\cdot4096 = 65{,}536$, chỉ 0.39%.</p>
<h4>Sau huấn luyện</h4>
<p>Gộp $W_0 + \frac{\alpha}{r}BA$ thành một ma trận: không tăng độ trễ suy luận. Có thể giữ nhiều LoRA cho nhiều tác vụ và hoán đổi nhanh.</p>
<h4>Họ hàng</h4>
<ul><li><b>QLoRA:</b> lượng tử hóa $W_0$ xuống 4-bit, LoRA ở độ chính xác cao. Tinh chỉnh mô hình 65B trên một GPU.</li>
<li><b>Adapter:</b> chèn MLP nhỏ vào giữa các lớp.</li>
<li><b>Prompt / prefix tuning:</b> học vài vector đầu chuỗi.</li></ul>
<p>LoRA cũng rất phổ biến với Stable Diffusion để dạy mô hình một phong cách hay một đối tượng mới từ vài chục ảnh.</p>`,
  w: 'lora',
  ex: [['ViT-Base: áp LoRA $r=4$ lên $W_Q, W_V$ ($768\\times768$) ở 12 khối. Tổng tham số LoRA?', 'Mỗi ma trận $2\\cdot768\\cdot4 = 6{,}144$; $\\times2\\times12 = 147{,}456$.']],
  app: 'LoRA trên Stable Diffusion với vài chục ảnh bo mạch thật là cách rẻ để mô hình sinh ảnh đúng “phong cách” chiếu sáng của máy AOI cụ thể.',
  papers: ['Hu et al. (2022) — LoRA', 'Dettmers et al. (2023) — QLoRA'] });

L({ id: 'moe', p: 'p6', t: 'Mixture of Experts', en: 'Mixture of Experts', min: 60, pre: ['transformer', 'prob'],
  goals: ['Tính tay định tuyến top-k', 'Hiểu tham số tổng vs tham số kích hoạt', 'Biết loss cân bằng tải'],
  body: R`
<p>Thay một FFN bằng $E$ FFN “chuyên gia” và một <b>router</b> nhỏ. Mỗi token chỉ đi qua $k$ chuyên gia (thường $k=1$ hoặc 2):</p>
$$\mathbf g = \text{softmax}(W_r\mathbf x),\qquad \mathbf y = \sum_{i\in\text{TopK}(\mathbf g)} \frac{g_i}{\sum_{j\in\text{TopK}} g_j}\,\text{FFN}_i(\mathbf x)$$
<h4>Vì sao hấp dẫn</h4>
<p>Tổng tham số lớn (nhiều kiến thức), nhưng chi phí tính mỗi token chỉ bằng $k$ chuyên gia. Ví dụ 8 chuyên gia, top-2: dung lượng ~8 lần, tính toán ~2 lần.</p>
<h4>Cân bằng tải</h4>
<p>Router dễ dồn mọi token cho vài chuyên gia “ưa thích”. Thêm loss phụ $\mathcal L_{aux} = E\sum_i f_i P_i$ ($f_i$: tỷ lệ token gửi tới chuyên gia $i$, $P_i$: xác suất router trung bình) để phân phối đều.</p>`,
  w: 'moe',
  ex: [['Router cho $[0.1, 0.5, 0.3, 0.1]$, top-2. Trọng số chuẩn hóa?', 'Chọn chuyên gia 2 và 3: $0.5/0.8 = 0.625$, $0.3/0.8=0.375$.']],
  app: '', papers: ['Shazeer et al. (2017) — Outrageously Large Neural Networks', 'Fedus et al. (2022) — Switch Transformer'] });

L({ id: 'ssm', p: 'p6', t: 'State Space Models & Mamba', en: 'SSMs & Mamba', min: 60, pre: ['rnn', 'attention'],
  goals: ['Viết phương trình trạng thái rời rạc', 'Hiểu vì sao SSM huấn luyện song song mà suy luận như RNN', 'Biết cơ chế chọn lọc của Mamba'],
  body: R`
<p>SSM quay lại ý tưởng hồi quy nhưng <b>tuyến tính</b>:</p>
$$\mathbf h_t = \bar A\,\mathbf h_{t-1} + \bar B\,x_t,\qquad y_t = C\,\mathbf h_t$$
<p>Vì không có phi tuyến giữa các bước, đầu ra trải ra thành một phép chập: $y = x * \bar K$ với $\bar K = (C\bar B, C\bar A\bar B, C\bar A^2\bar B,\dots)$. Huấn luyện song song như CNN; suy luận từng bước như RNN với bộ nhớ cố định, chi phí $O(n)$ thay vì $O(n^2)$ của attention.</p>
<h4>Mamba: chọn lọc</h4>
<p>S4 dùng $\bar A,\bar B, C$ cố định nên không “chọn” được nhớ gì. Mamba cho $\bar B, C$ và bước rời rạc $\Delta$ <b>phụ thuộc đầu vào</b>, giống cổng của LSTM: token quan trọng thì ghi mạnh vào trạng thái, token rác thì bỏ qua. Mất tính chập, bù lại bằng thuật toán quét song song tối ưu cho phần cứng.</p>
<h4>Vị trí hiện nay</h4>
<p>Cạnh tranh với Transformer ở chuỗi rất dài; nhiều mô hình lai xen kẽ lớp Mamba và lớp attention. Trong thị giác có Vision Mamba, VMamba.</p>`,
  w: null,
  ex: [['SSM vô hướng $\\bar A=0.5, \\bar B=1, C=1$, đầu vào $[1,0,0]$, $h_0=0$. Tính $y$.', '$h=[1, 0.5, 0.25]$, $y=[1,0.5,0.25]$; chính là kernel $\\bar K$.']],
  app: '', papers: ['Gu et al. (2022) — S4', 'Gu & Dao (2023) — Mamba'] });

L({ id: 'anomaly', p: 'p6', t: 'Ứng dụng: phát hiện lỗi công nghiệp', en: 'Industrial Defect Detection', min: 120, pre: ['resnet', 'vitfam', 'diffadv'],
  goals: ['Chọn phương pháp theo lượng dữ liệu lỗi', 'Hiểu PatchCore, PaDiM', 'Xây chiến lược dữ liệu tổng hợp'],
  body: R`
<p>Bài tổng hợp: ghép mọi thứ đã học vào một bài toán thực tế.</p>
<h4>Chọn hướng theo dữ liệu</h4>
<table class="tbl"><tr><th>Tình huống dữ liệu</th><th>Hướng phù hợp</th></tr>
<tr><td>Chỉ có ảnh tốt</td><td>Phát hiện bất thường không giám sát: PatchCore, PaDiM, EfficientAD, AE/Diffusion tái tạo</td></tr>
<tr><td>Vài chục ảnh lỗi</td><td>Few-shot, tăng cường bằng dữ liệu tổng hợp (cắt dán, GAN, Diffusion)</td></tr>
<tr><td>Hàng nghìn ảnh lỗi có nhãn</td><td>Phân loại (ResNet, EfficientNet, ViT), phát hiện (YOLO), phân đoạn (U-Net)</td></tr>
<tr><td>Nhiều ảnh không nhãn</td><td>Tiền huấn luyện tự giám sát (MAE, DINO) rồi tinh chỉnh</td></tr></table>
<h4>PaDiM</h4>
<p>Lấy feature các tầng giữa của CNN pretrained tại mỗi vị trí mảnh; với ảnh tốt, ước lượng Gaussian $(\boldsymbol\mu_{ij},\Sigma_{ij})$ cho từng vị trí. Điểm bất thường là khoảng cách Mahalanobis.</p>
<h4>PatchCore</h4>
<p>Lưu feature mảnh của ảnh tốt vào một <b>ngân hàng bộ nhớ</b> (rút gọn bằng coreset). Ảnh mới: mỗi mảnh tìm láng giềng gần nhất trong ngân hàng; khoảng cách lớn nghĩa là bất thường. Không cần huấn luyện mạng.</p>
<h4>Dữ liệu tổng hợp</h4>
<ul><li><b>Cắt dán / CutPaste, DRAEM:</b> tạo lỗi giả bằng kết cấu ngẫu nhiên.</li>
<li><b>GAN có điều kiện:</b> Pix2Pix từ mask lỗi.</li>
<li><b>Diffusion inpainting / ControlNet:</b> đa dạng và chân thực nhất hiện nay.</li>
<li>Luôn đo <b>khoảng cách miền</b>: thêm ảnh tổng hợp phải làm tăng chỉ số trên tập kiểm tra <i>thật</i>.</li></ul>
<h4>Thước đo</h4>
<p>Mức ảnh: AUROC, recall tại tỷ lệ báo động giả cố định (quan trọng nhất trên dây chuyền: không được để lọt lỗi). Mức pixel: AUROC pixel, PRO, Dice.</p>`,
  w: null,
  diag: { nodes: [{ t: 'Ảnh AOI', s: 'tiling' }, { t: 'Backbone', s: 'ResNet / DINOv2' }, { t: 'Feature mảnh', s: 'tầng 2–3' }, { t: 'So với bộ nhớ', s: 'k-NN', c: 'red' }, { t: 'Bản đồ điểm', s: 'ngưỡng' }, 'OK / NG'] },
  ex: [['Vì sao trên dây chuyền thường cố định recall rất cao (ví dụ 99.5%) rồi mới tối ưu tỷ lệ báo động giả?', 'Lọt lỗi (false negative) gây hậu quả ở khách hàng tốn kém hơn nhiều so với kiểm tra lại một bo tốt (false positive).']],
  app: 'Đây là bài “capstone”: hãy chạy thử PatchCore trên tập ảnh của chính bạn, sau đó so sánh với mô hình phân loại có giám sát và mô hình có thêm dữ liệu tổng hợp từ Diffusion.',
  papers: ['Defard et al. (2021) — PaDiM', 'Roth et al. (2022) — PatchCore', 'Zavrtanik et al. (2021) — DRAEM', 'Batzner et al. (2024) — EfficientAD', 'Bergmann et al. (2019) — MVTec AD'] });
