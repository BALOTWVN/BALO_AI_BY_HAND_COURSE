A('ae', {
  intuit: R`<p>Autoencoder như <b>bắt một họa sĩ vẽ lại bức ảnh chỉ từ 10 dòng ghi chú</b>. Người ghi chú (encoder) phải chọn ghi điều quan trọng nhất; họa sĩ (decoder) vẽ lại từ đó. Nếu chỉ luyện trên ảnh bo mạch <i>tốt</i>, cả hai sẽ rất giỏi mô tả và vẽ lại “bo tốt”. Đưa một ảnh có vết xước vào, ghi chú không có chỗ cho vết xước, họa sĩ vẽ ra một bo sạch. So bức vẽ với ảnh gốc: chỗ khác nhau chính là lỗi.</p>`,
  worked: { t: 'Điểm bất thường từ lỗi tái tạo',
    setup: R`Ảnh 4 pixel. Ảnh bình thường $\mathbf x_a = [0.8, 0.8, 0.2, 0.2]$, AE tái tạo $\hat{\mathbf x}_a = [0.78, 0.82, 0.21, 0.19]$. Ảnh có lỗi $\mathbf x_b = [0.8, 0.1, 0.2, 0.2]$ (pixel 2 bị đứt), AE tái tạo $\hat{\mathbf x}_b = [0.79, 0.75, 0.22, 0.20]$. Ngưỡng MSE $= 0.01$.`,
    steps: [
      R`<b>Sai số ảnh a:</b> $[0.02, -0.02, -0.01, 0.01]$; bình phương $[0.0004, 0.0004, 0.0001, 0.0001]$; MSE $= 0.001/4 = 0.00025$.`,
      R`<b>Sai số ảnh b:</b> $[0.01, -0.65, -0.02, 0]$; bình phương $[0.0001, 0.4225, 0.0004, 0]$; MSE $= 0.423/4 = 0.1058$.`,
      R`<b>So ngưỡng:</b> a: $0.00025 < 0.01$ → OK. b: $0.106 > 0.01$ → NG.`,
      R`<b>Bản đồ lỗi:</b> $|\mathbf x_b - \hat{\mathbf x}_b| = [0.01, 0.65, 0.02, 0]$, sáng rực ở pixel 2, đúng vị trí đứt mạch.`,
    ],
    ans: R`Ảnh a: OK (MSE 0.00025); ảnh b: NG (MSE 0.106), lỗi định vị ở pixel 2.` },
  ex: [
    { q: R`Ảnh $64\times64$ xám nén còn $\mathbf z$ 128 chiều. Tỷ lệ nén? Nếu $\mathbf z$ có 4096 chiều thì sao?`, s: [R`$4096/128 = 32$.`, R`$\mathbf z$ 4096 chiều = kích thước ảnh: không nén, mạng có thể học ánh xạ đồng nhất và tái tạo luôn cả lỗi.`], a: R`32 lần; nút cổ chai quá rộng làm AE vô dụng cho phát hiện bất thường.` },
  ],
  miss: [[R`AE tái tạo càng tốt càng phát hiện lỗi tốt.`, R`AE quá giỏi sẽ tái tạo cả lỗi. Cần nút cổ chai đủ chặt hoặc thêm ràng buộc.`]],
  recap: [R`Encoder nén → $\mathbf z$ → decoder giải nén.`, R`Học trên ảnh tốt; lỗi tái tạo cao = bất thường.`, R`Không gian ẩn rời rạc, khó sinh mẫu mới.`],
});

A('vae', {
  intuit: R`<p>Autoencoder thường cất mỗi ảnh vào <b>một ngăn tủ cố định</b>; giữa các ngăn là khoảng trống, lục vào đó chỉ thấy rác. VAE thì cất mỗi ảnh vào <b>một vùng mờ</b> (Gaussian), và bắt mọi vùng phải chồng lên một tủ chung hình chuông $\mathcal N(0,I)$. Kết quả: tủ được lấp đầy liên tục, lấy bừa một điểm trong tủ cũng ra một ảnh hợp lý; đi từ điểm này sang điểm kia thì ảnh biến đổi mượt mà.</p>
<p>Loss của VAE là cuộc kéo co: <b>tái tạo</b> muốn mỗi ảnh có vùng riêng, nhỏ, rõ; <b>KL</b> muốn mọi vùng giống hệt chuông chung.</p>`,
  worked: { t: 'Tính toàn bộ loss VAE cho một ảnh 2 pixel',
    setup: R`Encoder cho $\boldsymbol\mu = [0.5, -1]$, $\log\boldsymbol\sigma^2 = [0, -1.386]$. Nhiễu $\boldsymbol\varepsilon = [0.2, -0.4]$. Decoder tuyến tính $\hat{\mathbf x} = [z_1 + z_2,\ z_1 - z_2]$. Ảnh thật $\mathbf x = [0, 1]$.`,
    steps: [
      R`<b>Độ lệch chuẩn:</b> $\boldsymbol\sigma = \exp(\frac12\log\boldsymbol\sigma^2) = [e^0, e^{-0.693}] = [1, 0.5]$.`,
      R`<b>Tái tham số hóa:</b> $\mathbf z = \boldsymbol\mu + \boldsymbol\sigma\odot\boldsymbol\varepsilon = [0.5 + 0.2,\ -1 + 0.5\cdot(-0.4)] = [0.7, -1.2]$.`,
      R`<b>Decode:</b> $\hat{\mathbf x} = [0.7 - 1.2,\ 0.7 + 1.2] = [-0.5, 1.9]$.`,
      R`<b>Loss tái tạo:</b> $\|\mathbf x - \hat{\mathbf x}\|^2 = 0.5^2 + 0.9^2 = 0.25 + 0.81 = 1.06$.`,
      R`<b>KL chiều 1:</b> $\frac12(0.25 + 1 - 1 - 0) = 0.125$. <b>Chiều 2:</b> $\frac12(1 + 0.25 - 1 + 1.386) = 0.818$.`,
      R`<b>Tổng loss:</b> $1.06 + 0.125 + 0.818 = 2.003$ (với $\beta = 1$).`,
      R`<b>Đọc kết quả:</b> chiều 2 bị phạt KL nhiều vì vừa lệch tâm ($\mu=-1$) vừa hẹp ($\sigma=0.5$). Khi sinh ảnh mới, ta bỏ encoder, lấy $\mathbf z\sim\mathcal N(0,I)$ rồi decode.`,
    ],
    ans: R`$\mathbf z = [0.7, -1.2]$, tái tạo $1.06$, KL $0.943$, tổng $\approx2.0$.` },
  ex: [
    { q: R`Vì sao không lấy mẫu $\mathbf z$ trực tiếp từ $\mathcal N(\boldsymbol\mu, \boldsymbol\sigma^2)$ mà phải viết $\boldsymbol\mu + \boldsymbol\sigma\boldsymbol\varepsilon$?`, s: [R`Lấy mẫu trực tiếp là thao tác ngẫu nhiên, không có đạo hàm theo $\boldsymbol\mu, \boldsymbol\sigma$.`, R`Viết lại: $\boldsymbol\varepsilon$ ngẫu nhiên nhưng không phụ thuộc tham số; $\mathbf z$ là hàm khả vi của $\boldsymbol\mu, \boldsymbol\sigma$: $\partial z/\partial\mu = 1$, $\partial z/\partial\sigma = \varepsilon$.`], a: R`Để gradient chảy qua bước lấy mẫu về encoder.` },
  ],
  miss: [[R`VAE cho ảnh nét như GAN.`, R`VAE thuần thường mờ; VAE trong Stable Diffusion có thêm loss perceptual và adversarial.`]],
  recap: [R`Encoder ra $\boldsymbol\mu, \log\boldsymbol\sigma^2$.`, R`$\mathbf z = \boldsymbol\mu + \boldsymbol\sigma\odot\boldsymbol\varepsilon$.`, R`Loss = tái tạo + KL.`],
});

A('gan', {
  intuit: R`<p>GAN là cuộc đấu giữa <b>kẻ làm tiền giả</b> (Generator) và <b>cảnh sát</b> (Discriminator). Ban đầu tiền giả rất vụng, cảnh sát dễ dàng nhận ra. Kẻ làm giả học từ những lần bị bắt và làm tinh vi hơn; cảnh sát cũng phải tinh mắt hơn. Cuộc chạy đua kết thúc khi tiền giả giống thật đến mức cảnh sát chỉ đoán đúng 50%, tức đoán bừa.</p>
<p>Điểm tinh tế: kẻ làm giả <b>không bao giờ nhìn thấy tiền thật</b>. Nó chỉ học qua “lời phê” (gradient) của cảnh sát.</p>`,
  worked: { t: 'Một vòng huấn luyện GAN 1 chiều bằng tay',
    setup: R`Dữ liệu thật: $x = 4$. Generator $G(z) = a z + b$ với $a = 1$, $b = 0$; nhiễu $z = 1$ nên $G(z) = 1$. Discriminator $D(x) = \sigma(wx + c)$ với $w = 1$, $c = -2.5$. Learning rate $\eta=0.5$.`,
    steps: [
      R`<b>D chấm điểm:</b> ảnh thật $D(4) = \sigma(1.5) = 0.818$. Ảnh giả $D(1) = \sigma(-1.5) = 0.182$. D đang làm khá tốt.`,
      R`<b>Loss của D:</b> $\mathcal L_D = -\ln0.818 - \ln(1-0.182) = 0.201 + 0.201 = 0.402$.`,
      R`<b>Gradient của D theo $w$:</b> với BCE, $\partial\mathcal L/\partial(\text{logit}) = D - \text{nhãn}$. Thật: $0.818 - 1 = -0.182$, nhân $x=4$: $-0.728$. Giả: $0.182 - 0 = 0.182$, nhân $x=1$: $0.182$. Tổng $\partial\mathcal L_D/\partial w = -0.546$.`,
      R`<b>Theo $c$:</b> $-0.182 + 0.182 = 0$. Cập nhật D: $w = 1 + 0.5\cdot0.546 = 1.273$; $c = -2.5$.`,
      R`<b>Bước G (non-saturating):</b> $\mathcal L_G = -\ln D(G(z))$. Với D mới: logit $= 1.273\cdot1 - 2.5 = -1.227$, $D = 0.227$, $\mathcal L_G = 1.483$.`,
      R`<b>Gradient của G theo $b$:</b> $\partial\mathcal L_G/\partial\text{logit} = D - 1 = -0.773$; $\partial\text{logit}/\partial G = w = 1.273$; $\partial G/\partial b = 1$. Tích $= -0.984$. Cập nhật $b = 0 + 0.5\cdot0.984 = 0.492$.`,
      R`<b>Kết quả:</b> mẫu giả mới $G(z) = 1.492$, tiến về phía dữ liệu thật 4. Lặp lại nhiều vòng, G sẽ tiến dần tới 4.`,
    ],
    ans: R`Sau một vòng: $w=1.273$, mẫu giả dịch từ 1 lên 1.492.` },
  ex: [
    { q: R`$D(\mathbf x) = 0.8$, $D(G(\mathbf z)) = 0.3$. Tính $\mathcal L_D$ và $\mathcal L_G$.`, s: [R`$\mathcal L_D = -\ln0.8 - \ln0.7 = 0.223 + 0.357$.`, R`$\mathcal L_G = -\ln 0.3$.`], a: R`$\mathcal L_D = 0.580$, $\mathcal L_G = 1.204$.` },
    { q: R`Tại cân bằng lý thuyết, $D = 0.5$ ở mọi nơi. Tính $\mathcal L_D$.`, s: [R`$-\ln0.5 - \ln0.5 = 2\ln2$.`], a: R`$\approx1.386$. Thấy loss D quanh giá trị này là dấu hiệu cân bằng (dù không đảm bảo ảnh đẹp).` },
  ],
  miss: [[R`Loss G giảm nghĩa là ảnh đẹp hơn.`, R`Loss GAN dao động và không phản ánh chất lượng; hãy nhìn ảnh và đo FID.`], [R`G học trực tiếp từ ảnh thật.`, R`G chỉ học qua gradient của D.`]],
  recap: [R`D: BCE thật = 1, giả = 0.`, R`G: $-\log D(G(z))$ (non-saturating).`, R`Huấn luyện luân phiên; dễ mất ổn định và mode collapse.`],
});

A('ganvar', {
  intuit: R`<p><b>cGAN</b>: thay vì “vẽ một bức tranh bất kỳ”, bạn ra đề “vẽ một vết xước”. <b>Pix2Pix</b>: đưa bản phác thảo, yêu cầu tô màu đúng theo bản phác thảo (có cặp ảnh mẫu). <b>CycleGAN</b>: dịch ảnh mùa hè sang mùa đông mà không có cặp ảnh cùng cảnh; ràng buộc “dịch đi rồi dịch về phải ra ảnh cũ”, giống dịch tiếng Việt sang Anh rồi dịch ngược phải ra câu ban đầu. <b>StyleGAN</b>: các núm vặn riêng cho từng cấp chi tiết, từ dáng tổng thể đến lỗ chân lông.</p>`,
  worked: { t: 'Loss của Pix2Pix cho một ảnh 3 pixel',
    setup: R`Đầu vào (mask lỗi) qua G cho ảnh $G(\mathbf x) = [0.6, 0.2, 0.9]$; ảnh thật $\mathbf y = [0.5, 0.1, 1.0]$. PatchGAN chấm 2 mảnh của ảnh giả: $[0.4, 0.6]$. $\lambda = 100$.`,
    steps: [
      R`<b>Loss đối kháng (non-saturating) trung bình trên mảnh:</b> $\frac12(-\ln0.4 - \ln0.6) = \frac12(0.916 + 0.511) = 0.714$.`,
      R`<b>Loss L1:</b> $\frac13(|0.1| + |0.1| + |0.1|) = 0.1$.`,
      R`<b>Tổng cho G:</b> $0.714 + 100\cdot0.1 = 10.714$.`,
      R`<b>Nhận xét:</b> $\lambda = 100$ làm L1 chi phối: G trước hết phải giống ảnh thật về tổng thể; loss đối kháng lo phần chi tiết sắc nét (L1 một mình cho ảnh mờ).`,
    ],
    ans: R`$\mathcal L_G \approx 10.71$, trong đó L1 đóng góp 10.` },
  ex: [
    { q: R`FID: hai tập feature 1 chiều, thật $\mu_r = 2, \sigma_r^2 = 1$; sinh $\mu_g = 2.5, \sigma_g^2 = 4$. Tính FID (công thức 1 chiều: $(\mu_r - \mu_g)^2 + \sigma_r^2 + \sigma_g^2 - 2\sigma_r\sigma_g$).`, s: [R`$(2-2.5)^2 = 0.25$.`, R`$1 + 4 - 2\cdot1\cdot2 = 1$.`], a: R`FID $= 1.25$. Phần phương sai cho thấy ảnh sinh quá đa dạng/nhiễu.` },
  ],
  miss: [[R`FID thấp là đủ để dùng ảnh sinh làm dữ liệu huấn luyện.`, R`Phải kiểm chứng trên tác vụ thật: thêm ảnh sinh có làm tăng recall trên ảnh lỗi thật không.`]],
  recap: [R`cGAN: có điều kiện; Pix2Pix: có cặp, L1 + PatchGAN.`, R`CycleGAN: không cặp, loss chu trình.`, R`WGAN-GP ổn định; StyleGAN chất lượng cao; FID để đánh giá.`],
});

A('diffwd', {
  intuit: R`<p>Nhỏ một giọt mực vào ly nước. Theo thời gian mực loang ra, cuối cùng cả ly đục đều, không còn hình dạng giọt mực. Quá trình này <b>dễ</b> và tự nhiên. Diffusion hỏi: nếu quay phim lại rồi <b>chiếu ngược</b>, có học được cách “gom mực về thành giọt” không? Mỗi bước ngược rất nhỏ nên đoán được.</p>
<p>Với ảnh: thêm một chút nhiễu nhiều lần đến khi ảnh thành nhiễu thuần. Công thức “nhảy thẳng” cho phép lấy ngay ảnh ở bất kỳ thời điểm $t$ nào, như tua phim đến đúng giây cần xem.</p>`,
  worked: { t: 'Tính $\bar\alpha_t$ và ảnh nhiễu với lịch 4 bước',
    setup: R`Lịch đồ chơi $T=4$: $\beta = [0.1, 0.2, 0.3, 0.4]$. Một pixel $x_0 = 1$, nhiễu $\varepsilon = 0.5$.`,
    steps: [
      R`<b>$\alpha_t = 1-\beta_t$:</b> $[0.9, 0.8, 0.7, 0.6]$.`,
      R`<b>$\bar\alpha_t$ tích dồn:</b> $\bar\alpha_1 = 0.9$; $\bar\alpha_2 = 0.72$; $\bar\alpha_3 = 0.504$; $\bar\alpha_4 = 0.302$.`,
      R`<b>Hệ số tại $t=2$:</b> $\sqrt{0.72} = 0.849$; $\sqrt{0.28} = 0.529$.`,
      R`<b>Nhảy thẳng tới $t=2$:</b> $x_2 = 0.849\cdot1 + 0.529\cdot0.5 = 0.849 + 0.265 = 1.113$.`,
      R`<b>Tại $t=4$:</b> $\sqrt{0.302} = 0.550$, $\sqrt{0.698} = 0.835$; $x_4 = 0.550 + 0.418 = 0.968$. Tín hiệu chỉ còn 55%, nhiễu 83.5%.`,
      R`<b>SNR:</b> $t=2$: $0.72/0.28 = 2.57$; $t=4$: $0.302/0.698 = 0.43$. Với $T=1000$ thật, $\bar\alpha_{1000}\approx4\times10^{-5}$: gần như chỉ còn nhiễu.`,
    ],
    ans: R`$\bar\alpha = [0.9, 0.72, 0.504, 0.302]$; $x_2 = 1.113$; $x_4 = 0.968$.` },
  ex: [
    { q: R`$\bar\alpha_t = 0.64$, $x_0 = 1.0$, $\varepsilon = -0.5$. Tính $x_t$.`, s: [R`$\sqrt{0.64} = 0.8$; $\sqrt{0.36} = 0.6$.`, R`$0.8\cdot1 + 0.6\cdot(-0.5) = 0.8 - 0.3$.`], a: R`$x_t = 0.5$.` },
    { q: R`Kiểm tra bằng cách đi từng bước: với lịch đồ chơi trên, $x_1 = \sqrt{0.9}x_0 + \sqrt{0.1}\varepsilon_1$, $x_2 = \sqrt{0.8}x_1 + \sqrt{0.2}\varepsilon_2$. Hệ số của $x_0$ và phương sai nhiễu trong $x_2$?`, s: [R`Hệ số $x_0$: $\sqrt{0.8}\sqrt{0.9} = \sqrt{0.72} = 0.849$.`, R`Phương sai nhiễu: $0.8\cdot0.1 + 0.2 = 0.28$.`, R`Khớp $1-\bar\alpha_2 = 0.28$.`], a: R`$0.849$ và $0.28$, khớp công thức nhảy thẳng.` },
  ],
  miss: [[R`Quá trình thêm nhiễu cần huấn luyện.`, R`Thêm nhiễu là cố định, không có tham số. Chỉ quá trình ngược mới cần mạng.`]],
  recap: [R`$\bar\alpha_t = \prod(1-\beta_s)$.`, R`$x_t = \sqrt{\bar\alpha_t}x_0 + \sqrt{1-\bar\alpha_t}\varepsilon$.`, R`Lịch cosine giữ thông tin lâu hơn lịch tuyến tính.`],
});

A('diffrev', {
  intuit: R`<p>Mạng khử nhiễu là <b>người phục chế tranh</b> được huấn luyện theo cách đặc biệt: ta lấy tranh đẹp, cố tình rắc bụi với lượng ngẫu nhiên, rồi hỏi “bụi nằm ở đâu?”. Vì ta biết chính xác bụi đã rắc, chấm điểm dễ dàng (MSE). Sau hàng triệu lần luyện, đưa cho anh ta một tấm toàn bụi, anh ta lau từng lớp mỏng, mỗi lần lộ ra thêm một chút hình ảnh, cuối cùng ra một bức tranh <i>mới</i>.</p>`,
  worked: { t: 'Một bước khử nhiễu DDPM với lịch đồ chơi',
    setup: R`Dùng lịch ở bài trước: $t=2$, $\beta_2 = 0.2$, $\alpha_2 = 0.8$, $\bar\alpha_2 = 0.72$, $\bar\alpha_1 = 0.9$. Pixel hiện tại $x_2 = 1.113$. Mạng dự đoán $\varepsilon_\theta = 0.5$ (đoán đúng). Nhiễu thêm vào $z = 0.3$.`,
    steps: [
      R`<b>Ước lượng ảnh sạch:</b> $\hat x_0 = \frac{x_2 - \sqrt{1-\bar\alpha_2}\,\varepsilon_\theta}{\sqrt{\bar\alpha_2}} = \frac{1.113 - 0.529\cdot0.5}{0.849} = \frac{0.849}{0.849} = 1.0$. Khôi phục đúng $x_0 = 1$.`,
      R`<b>Hệ số trong công thức DDPM:</b> $\frac{\beta_2}{\sqrt{1-\bar\alpha_2}} = \frac{0.2}{0.529} = 0.378$; $\frac1{\sqrt{\alpha_2}} = \frac1{0.894} = 1.118$.`,
      R`<b>Phần trung bình:</b> $\mu = 1.118\cdot(1.113 - 0.378\cdot0.5) = 1.118\cdot0.924 = 1.033$.`,
      R`<b>Độ lệch chuẩn thêm vào:</b> $\sigma_2 = \sqrt{\beta_2\frac{1-\bar\alpha_1}{1-\bar\alpha_2}} = \sqrt{0.2\cdot\frac{0.1}{0.28}} = \sqrt{0.0714} = 0.267$.`,
      R`<b>Bước ngược:</b> $x_1 = 1.033 + 0.267\cdot0.3 = 1.113$.`,
      R`<b>Kiểm tra hợp lý:</b> ở $t=1$, $x_1$ nên quanh $\sqrt{0.9}\cdot1 = 0.949$ cộng nhiễu độ lệch $\sqrt{0.1} = 0.316$. Giá trị 1.113 nằm trong khoảng đó.`,
      R`<b>Huấn luyện:</b> nếu mạng dự đoán $\varepsilon_\theta = 0.7$ thay vì 0.5, loss $= (0.5-0.7)^2 = 0.04$, và gradient đẩy dự đoán về 0.5.`,
    ],
    ans: R`$\hat x_0 = 1.0$, $x_1 \approx 1.113$ (với $z = 0.3$).` },
  ex: [
    { q: R`$\bar\alpha_t=0.25$, $x_t = 0.4$, $\varepsilon_\theta = 0.2$. Tính $\hat x_0$.`, s: [R`$\sqrt{0.25} = 0.5$; $\sqrt{0.75} = 0.866$.`, R`$x_t - 0.866\cdot0.2 = 0.4 - 0.173 = 0.227$.`, R`Chia 0.5.`], a: R`$\hat x_0 \approx 0.454$.` },
    { q: R`Cùng bài trên, nếu $\varepsilon_\theta$ sai lệch thêm 0.1, $\hat x_0$ lệch bao nhiêu? Nếu $\bar\alpha_t = 0.01$?`, s: [R`Độ lệch $\hat x_0 = \sqrt{1-\bar\alpha}\cdot0.1/\sqrt{\bar\alpha}$.`, R`$\bar\alpha=0.25$: $0.866\cdot0.1/0.5 = 0.173$.`, R`$\bar\alpha=0.01$: $0.995\cdot0.1/0.1 = 0.995$.`], a: R`0.173 và 0.995: ở bước nhiễu nặng, dự đoán $\hat x_0$ một phát rất không đáng tin; vì vậy phải đi nhiều bước nhỏ.` },
  ],
  miss: [[R`Mạng dự đoán thẳng ảnh sạch trong một bước.`, R`Thường dự đoán nhiễu, rồi đi từng bước nhỏ. (Các phương pháp chưng cất mới có thể giảm còn 1–4 bước.)`]],
  recap: [R`Loss $\|\varepsilon - \varepsilon_\theta(x_t,t)\|^2$.`, R`$\hat x_0 = (x_t - \sqrt{1-\bar\alpha}\varepsilon_\theta)/\sqrt{\bar\alpha}$.`, R`U-Net + time embedding là mạng khử nhiễu kinh điển.`],
});

A('diffadv', {
  intuit: R`<p><b>DDIM</b>: thay vì đi bộ 1000 bậc thang, bạn đi thang cuốn nhảy cóc 50 bậc mà vẫn tới đúng tầng. <b>CFG</b>: nhờ hai người vẽ, một người không biết đề, một người biết đề. Lấy khác biệt giữa hai bức (“phần do đề bài tạo ra”) rồi <b>phóng đại lên $w$ lần</b>, ảnh sẽ bám sát đề hơn. <b>Latent Diffusion</b>: thay vì phục chế bức tranh khổ lớn, bạn phục chế bản phác nhỏ (latent), rồi nhờ VAE phóng to lại. <b>Flow matching</b>: thay vì đường đi ngoằn ngoèo, học đi theo đường thẳng từ nhiễu tới ảnh, nên cần ít bước.</p>`,
  worked: { t: 'Một bước DDIM nhảy cóc kết hợp CFG',
    setup: R`Đang ở $t=800$ với $\bar\alpha_{800} = 0.04$, muốn nhảy thẳng về $t'=600$ với $\bar\alpha_{600} = 0.20$. Pixel $x_t = 0.9$. Dự đoán không điều kiện $\varepsilon_u = 0.8$, có điều kiện $\varepsilon_c = 1.0$, $w = 3$.`,
    steps: [
      R`<b>CFG:</b> $\tilde\varepsilon = 0.8 + 3\cdot(1.0 - 0.8) = 0.8 + 0.6 = 1.4$.`,
      R`<b>Ảnh sạch ước lượng:</b> $\sqrt{0.04} = 0.2$, $\sqrt{0.96} = 0.980$. $\hat x_0 = (0.9 - 0.980\cdot1.4)/0.2 = (0.9 - 1.372)/0.2 = -2.36$.`,
      R`<b>Kẹp giá trị:</b> ảnh chuẩn hóa trong $[-1,1]$, nên thực tế thường kẹp $\hat x_0 = -1$ (bước “clipping”). Đây là dấu hiệu $w$ lớn đẩy giá trị ra ngoài miền, gây ảnh bão hòa màu.`,
      R`<b>Nhảy DDIM về $t'$:</b> giữ đơn giản, dùng $\hat x_0 = -1$ và $\tilde\varepsilon = 1.4$ (nhiều cài đặt còn tính lại $\varepsilon$ từ $\hat x_0$ sau khi kẹp). $\sqrt{0.20} = 0.447$, $\sqrt{0.80} = 0.894$. $x_{t'} = 0.447\cdot(-1) + 0.894\cdot1.4 = -0.447 + 1.252 = 0.805$.`,
      R`<b>Không CFG để so sánh</b> ($\varepsilon = 1.0$): $\hat x_0 = (0.9 - 0.980)/0.2 = -0.40$; $x_{t'} = 0.447\cdot(-0.4) + 0.894\cdot1.0 = 0.715$.`,
    ],
    ans: R`Có CFG ($w=3$): $x_{600}\approx0.805$ (sau khi kẹp). Không CFG: $0.715$. Một bước thay cho 200 bước DDPM.` },
  ex: [
    { q: R`$\varepsilon_u = 0.2$, $\varepsilon_c = 0.5$, $w = 7.5$. Tính $\tilde\varepsilon$. Với $w = 0$ và $w = 1$?`, s: [R`$w = 7.5$: $0.2 + 7.5\cdot0.3 = 2.45$.`, R`$w = 0$: $0.2$ (bỏ điều kiện).`, R`$w=1$: $0.5$ (có điều kiện thường).`], a: R`$2.45$; $0.2$; $0.5$.` },
    { q: R`Stable Diffusion: ảnh $512\times512\times3$, latent $64\times64\times4$. Diffusion trong latent rẻ hơn bao nhiêu lần (theo số phần tử)?`, s: [R`Ảnh: $786{,}432$.`, R`Latent: $16{,}384$.`, R`Tỷ lệ: 48.`], a: R`48 lần.` },
  ],
  miss: [[R`$w$ càng lớn ảnh càng tốt.`, R`$w$ quá lớn làm ảnh bão hòa, ít đa dạng. Thường chọn 3–9.`]],
  recap: [R`DDIM: tất định, nhảy cóc.`, R`CFG: $\varepsilon_u + w(\varepsilon_c - \varepsilon_u)$.`, R`Latent diffusion, ControlNet, DiT, flow matching là chuẩn hiện nay.`],
});

A('contrastive', {
  intuit: R`<p>Học tương phản giống <b>trò chơi ghép đôi</b> trong buổi giao lưu: có 32 tấm ảnh và 32 câu mô tả bị trộn. Mô hình phải kéo mỗi ảnh lại gần đúng câu của nó và đẩy xa 31 câu còn lại. Không ai dạy “đây là con mèo”, nhưng sau hàng trăm triệu ván, mô hình tự hiểu ảnh và chữ nói về cùng một thứ.</p>`,
  worked: { t: 'InfoNCE cho batch 3 cặp ảnh–chữ',
    setup: R`Cosine giữa 3 ảnh (hàng) và 3 câu (cột): $S = \begin{bmatrix}0.8&0.3&0.1\\0.2&0.7&0.4\\0.1&0.5&0.6\end{bmatrix}$, $\tau = 0.1$. Đáp án đúng trên đường chéo.`,
    steps: [
      R`<b>Chia $\tau$:</b> logits $= 10S$: hàng 1 $[8,3,1]$, hàng 2 $[2,7,4]$, hàng 3 $[1,5,6]$.`,
      R`<b>Hàng 1:</b> trừ max: $[0,-5,-7]$; lũy thừa $[1, 0.0067, 0.0009]$; $p_{11} = 1/1.0076 = 0.9925$; loss $= 0.0076$.`,
      R`<b>Hàng 2:</b> trừ max: $[-5, 0, -3]$; lũy thừa $[0.0067, 1, 0.0498]$; $p_{22} = 1/1.0565 = 0.9465$; loss $= 0.055$.`,
      R`<b>Hàng 3:</b> trừ max: $[-5,-1,0]$; lũy thừa $[0.0067, 0.368, 1]$; $p_{33} = 1/1.3747 = 0.727$; loss $= 0.318$.`,
      R`<b>Trung bình chiều ảnh→chữ:</b> $(0.0076 + 0.055 + 0.318)/3 = 0.127$. CLIP tính thêm chiều chữ→ảnh (softmax theo cột) rồi lấy trung bình hai chiều.`,
      R`<b>Đọc kết quả:</b> ảnh 3 bị “nhầm” với câu 2 (cosine 0.5, gần 0.6); gradient sẽ kéo $S_{33}$ lên và đẩy $S_{32}$ xuống.`,
    ],
    ans: R`Loss ảnh→chữ $\approx0.127$; cặp 3 là cặp khó nhất.` },
  ex: [
    { q: R`Hàng $S=[0.9,0.2,0.1]$, $\tau = 0.1$, đáp án ở vị trí 1. Nếu $\tau = 1$ thì sao?`, s: [R`$\tau=0.1$: logits $[9,2,1]$; $p = 8103/(8103+7.39+2.72) = 0.9988$; loss $0.0012$.`, R`$\tau = 1$: logits $[0.9,0.2,0.1]$; lũy thừa $[2.460, 1.221, 1.105]$; $p = 2.460/4.786 = 0.514$; loss $0.666$.`], a: R`$\tau$ nhỏ: loss 0.0012; $\tau = 1$: loss 0.666. $\tau$ quyết định mô hình “khắt khe” cỡ nào.` },
  ],
  miss: [[R`CLIP hiểu mọi loại ảnh.`, R`CLIP mạnh với ảnh internet; ảnh công nghiệp chuyên biệt (AOI, y tế) thường cần tinh chỉnh.`]],
  recap: [R`Kéo cặp dương lại gần, đẩy cặp âm ra xa.`, R`InfoNCE = cross-entropy với đáp án trên đường chéo.`, R`CLIP: zero-shot bằng cách so ảnh với câu mô tả.`],
});

A('llm', {
  intuit: R`<p>LLM là một <b>cỗ máy đoán chữ tiếp theo</b> đã đọc gần như toàn bộ internet. “Hôm nay trời …” → “đẹp” 30%, “mưa” 25%, … Đoán đủ giỏi, nó phải “hiểu” ngữ pháp, sự kiện, logic, thậm chí cách viết code, vì đó là cách duy nhất đoán đúng chữ tiếp theo trong mọi loại văn bản.</p>
<p><b>KV cache</b> giống ghi chú khi đọc sách: đọc tới trang 100 bạn không đọc lại 99 trang đầu, chỉ xem ghi chú (key, value đã lưu).</p>`,
  worked: { t: 'Loss của một câu và bộ nhớ KV cache',
    setup: R`Câu “mạch bị đứt”. Mô hình cho xác suất: $p(\text{mạch}\mid\text{BOS}) = 0.05$, $p(\text{bị}\mid\text{mạch}) = 0.4$, $p(\text{đứt}\mid\text{mạch bị}) = 0.25$. Mô hình có 32 lớp, $d = 4096$, ngữ cảnh 8192 token, lưu fp16.`,
    steps: [
      R`<b>Loss từng token:</b> $-\ln0.05 = 2.996$; $-\ln0.4 = 0.916$; $-\ln0.25 = 1.386$.`,
      R`<b>Loss trung bình:</b> $(2.996 + 0.916 + 1.386)/3 = 1.766$.`,
      R`<b>Perplexity</b> $= e^{1.766} = 5.85$: trung bình mô hình phân vân như chọn giữa ~6 khả năng.`,
      R`<b>KV cache mỗi token:</b> mỗi lớp lưu $\mathbf k$ và $\mathbf v$, mỗi cái 4096 số: $2\cdot32\cdot4096 = 262{,}144$ số.`,
      R`<b>Toàn ngữ cảnh:</b> $262{,}144\cdot8192 \approx 2.15$ tỷ số; fp16 2 byte: $\approx 4.3$ GB cho <i>một</i> chuỗi. Đó là lý do có Grouped-Query Attention (chia sẻ K, V giữa các đầu).`,
    ],
    ans: R`Loss trung bình 1.766, perplexity ≈ 5.85; KV cache ≈ 4.3 GB.` },
  ex: [
    { q: R`Xác suất $[0.5, 0.25, 0.15, 0.1]$, top-p $=0.7$. Giữ token nào, xác suất mới?`, s: [R`Sắp xếp giảm dần (đã sắp).`, R`Cộng dồn: $0.5$ (< 0.7), $0.75$ (≥ 0.7) → dừng.`, R`Giữ 2 token, chia cho $0.75$.`], a: R`$[0.667, 0.333]$.` },
  ],
  miss: [[R`LLM tra cứu cơ sở dữ liệu khi trả lời.`, R`Mô hình thuần chỉ sinh từ tham số đã học; muốn tra cứu phải gắn thêm RAG hoặc công cụ.`]],
  recap: [R`Huấn luyện: đoán token tiếp theo (cross-entropy).`, R`Giải mã: temperature, top-k, top-p.`, R`KV cache đổi bộ nhớ lấy tốc độ.`],
});

A('lora', {
  intuit: R`<p>Bạn muốn chỉnh một bản nhạc giao hưởng 100 nhạc công cho hợp không khí đám cưới. Thay vì tuyển lại cả dàn nhạc (tinh chỉnh toàn bộ), bạn thuê <b>một nhạc trưởng phụ</b> chỉ đưa ra vài chỉ dẫn đơn giản (“kèn to hơn, trống nhẹ lại”). Vài chỉ dẫn đó chính là ma trận hạng thấp $BA$: rất ít tham số nhưng đủ thay đổi tổng thể.</p>`,
  worked: { t: 'Cập nhật hạng 1 cho ma trận 3×3',
    setup: R`$W_0 = I_3$ (đơn vị). LoRA $r = 1$: $B = [1, 0, 2]^\top$ ($3\times1$), $A = [0.5, 0, -0.5]$ ($1\times3$), $\alpha/r = 1$. Đầu vào $\mathbf x = [2, 1, 1]$.`,
    steps: [
      R`<b>$\Delta W = BA$:</b> hàng $i$ = $B_i\cdot A$: $\begin{bmatrix}0.5&0&-0.5\\0&0&0\\1&0&-1\end{bmatrix}$.`,
      R`<b>Số tham số:</b> $\Delta W$ đầy đủ có 9 ô; LoRA chỉ học $3 + 3 = 6$. Với ma trận $4096\times4096$, $r=8$: 65,536 so với 16.8 triệu.`,
      R`<b>Tính đầu ra cách 1:</b> $W_0\mathbf x = [2,1,1]$; $A\mathbf x = 0.5\cdot2 - 0.5\cdot1 = 0.5$; $B(A\mathbf x) = [0.5, 0, 1]$. Tổng $[2.5, 1, 2]$.`,
      R`<b>Cách 2 (gộp):</b> $(W_0 + \Delta W)\mathbf x$: hàng 1 $= 1.5\cdot2 + 0 - 0.5\cdot1 = 2.5$; hàng 2 $= 1$; hàng 3 $= 1\cdot2 + 0 + 0\cdot1 = 2$. Giống nhau, nên sau huấn luyện có thể gộp, không tốn thêm thời gian suy luận.`,
    ],
    ans: R`Đầu ra $[2.5, 1, 2]$; chỉ 6 tham số huấn luyện thay vì 9.` },
  ex: [
    { q: R`ViT-Base: LoRA $r=4$ trên $W_Q, W_V$ ($768\times768$) ở cả 12 khối. Tổng tham số LoRA? Bao nhiêu % của 86M?`, s: [R`Mỗi ma trận: $4\cdot(768+768) = 6{,}144$.`, R`2 ma trận × 12 khối: $147{,}456$.`, R`$147{,}456/86{,}000{,}000\approx0.17\%$.`], a: R`≈ 147 nghìn, khoảng 0.17%.` },
  ],
  miss: [[R`LoRA làm mô hình chạy chậm hơn khi dùng.`, R`Sau khi gộp $W_0 + BA$ thì không chậm hơn.`]],
  recap: [R`$W = W_0 + \frac\alpha rBA$, chỉ học $A, B$.`, R`$B$ khởi tạo 0.`, R`QLoRA: $W_0$ 4-bit.`],
});

A('moe', {
  intuit: R`<p>Bệnh viện có nhiều bác sĩ chuyên khoa và một <b>quầy tiếp nhận</b> (router). Mỗi bệnh nhân (token) chỉ được chuyển tới 1–2 chuyên khoa phù hợp nhất, không ai khám qua tất cả. Bệnh viện “biết” rất nhiều (nhiều bác sĩ), nhưng mỗi ca khám chỉ tốn công của vài người.</p>`,
  worked: { t: 'Định tuyến một token qua 4 chuyên gia',
    setup: R`Logits router $[0.1, 1.5, 1.0, -0.5]$, top-2. Đầu ra các chuyên gia (giả lập): $E_1 = 3$, $E_2 = 1$, $E_3 = -2$, $E_4 = 5$.`,
    steps: [
      R`<b>Softmax:</b> lũy thừa $[1.105, 4.482, 2.718, 0.607]$, tổng $8.912$; $g = [0.124, 0.503, 0.305, 0.068]$.`,
      R`<b>Chọn top-2:</b> $E_2$ (0.503) và $E_3$ (0.305).`,
      R`<b>Chuẩn hóa lại:</b> $0.503/0.808 = 0.622$; $0.305/0.808 = 0.378$.`,
      R`<b>Kết hợp:</b> $y = 0.622\cdot1 + 0.378\cdot(-2) = 0.622 - 0.756 = -0.134$.`,
      R`<b>Chi phí:</b> chỉ chạy 2/4 chuyên gia. $E_1$, $E_4$ không tốn tính toán cho token này.`,
    ],
    ans: R`$y \approx -0.134$.` },
  ex: [
    { q: R`Router cho $[0.1, 0.5, 0.3, 0.1]$, top-2. Trọng số chuẩn hóa?`, s: [R`Chọn 0.5 và 0.3.`, R`Tổng 0.8.`], a: R`$0.625$ và $0.375$.` },
  ],
  miss: [[R`MoE nhẹ hơn về bộ nhớ.`, R`Vẫn phải nạp <b>mọi</b> chuyên gia vào bộ nhớ; chỉ tiết kiệm tính toán.`]],
  recap: [R`Router softmax → top-k → trộn có trọng số.`, R`Tham số tổng lớn, tính toán theo $k$.`, R`Cần loss cân bằng tải.`],
});

A('ssm', {
  intuit: R`<p>SSM như một <b>cái bể nước</b>: mỗi giây nước rò bớt một tỷ lệ cố định ($\bar A$), và bạn đổ thêm lượng nước bằng tín hiệu vào ($\bar B x_t$). Mực nước là trạng thái, đo mực nước là đầu ra. Vì quy luật tuyến tính, có thể tính trước “dấu vết” của mỗi giọt nước qua thời gian (kernel tích chập), cho phép huấn luyện song song.</p>
<p><b>Mamba</b> cho phép bể tự điều chỉnh van theo nước đổ vào: nước quan trọng thì giữ lâu, nước rác thì xả nhanh.</p>`,
  worked: { t: 'SSM vô hướng: hồi quy và tích chập cho cùng kết quả',
    setup: R`$\bar A = 0.5$, $\bar B = 1$, $C = 2$, $h_0 = 0$, đầu vào $x = [1, 2, 0]$.`,
    steps: [
      R`<b>Kiểu hồi quy:</b> $h_1 = 1$, $y_1 = 2$. $h_2 = 0.5 + 2 = 2.5$, $y_2 = 5$. $h_3 = 1.25$, $y_3 = 2.5$.`,
      R`<b>Kernel:</b> $\bar K = [C\bar B, C\bar A\bar B, C\bar A^2\bar B] = [2, 1, 0.5]$.`,
      R`<b>Kiểu tích chập:</b> $y_1 = 2\cdot1 = 2$. $y_2 = 2\cdot2 + 1\cdot1 = 5$. $y_3 = 2\cdot0 + 1\cdot2 + 0.5\cdot1 = 2.5$.`,
      R`<b>Khớp:</b> cả hai cho $[2, 5, 2.5]$. Huấn luyện dùng tích chập (song song), suy luận dùng hồi quy (bộ nhớ hằng số).`,
    ],
    ans: R`$y = [2, 5, 2.5]$ theo cả hai cách.` },
  ex: [
    { q: R`$\bar A = 0.5$, $\bar B = 1$, $C=1$, đầu vào $[1,0,0]$. Tính $y$.`, s: [R`$h = [1, 0.5, 0.25]$.`], a: R`$y = [1, 0.5, 0.25]$: chính là kernel.` },
  ],
  miss: [[R`Mamba đã thay thế Transformer.`, R`Hiện cạnh tranh ở chuỗi dài và thường kết hợp lai với attention.`]],
  recap: [R`$h_t = \bar Ah_{t-1} + \bar Bx_t$, $y_t = Ch_t$.`, R`Tuyến tính → tích chập song song khi train.`, R`Mamba: tham số phụ thuộc đầu vào (chọn lọc).`],
});

A('anomaly', {
  intuit: R`<p>PatchCore như một <b>thanh tra lâu năm</b> đã xem hàng nghìn bo mạch tốt và nhớ “mặt mũi” từng mảnh nhỏ (pad, đường mạch, lỗ khoan). Gặp bo mới, với mỗi mảnh anh ta hỏi: “mảnh này giống mảnh tốt nào nhất trong trí nhớ?”. Nếu mảnh giống nhất vẫn khác xa, đó là bất thường. Không cần ai dạy “vết xước trông thế nào”.</p>`,
  worked: { t: 'PatchCore bằng tay với đặc trưng 2 chiều',
    setup: R`Ngân hàng bộ nhớ (từ ảnh tốt): $M = \{[1,1], [1,2], [2,1], [5,5]\}$. Ảnh mới có 3 mảnh: $p_1 = [1.1, 1.0]$, $p_2 = [4.8, 5.1]$, $p_3 = [3, 3]$. Ngưỡng khoảng cách 1.0.`,
    steps: [
      R`<b>$p_1$:</b> khoảng cách tới $[1,1]$: $\sqrt{0.01 + 0} = 0.1$ (nhỏ nhất). Điểm $= 0.1$.`,
      R`<b>$p_2$:</b> tới $[5,5]$: $\sqrt{0.04 + 0.01} = 0.224$. Điểm $= 0.224$.`,
      R`<b>$p_3$:</b> tới $[1,2]$: $\sqrt{4+1} = 2.236$; tới $[2,1]$: $2.236$; tới $[5,5]$: $\sqrt{8} = 2.828$; tới $[1,1]$: $2.828$. Nhỏ nhất $2.236$.`,
      R`<b>Điểm ảnh</b> = max các mảnh $= 2.236 > 1.0$ → NG. Bản đồ bất thường sáng ở $p_3$.`,
      R`<b>Lưu ý:</b> $p_2$ cách xa cụm chính nhưng vẫn bình thường vì có mảnh tốt tương tự (ví dụ vùng pad). Đây là ưu điểm của so sánh láng giềng gần nhất so với chỉ so với trung bình.`,
    ],
    ans: R`Ảnh NG, điểm 2.236 tại mảnh $p_3$.` },
  ex: [
    { q: R`Dây chuyền yêu cầu recall ≥ 99.5%. Trên 1000 ảnh lỗi kiểm tra, mô hình bắt được 993. Đạt chưa? Nếu hạ ngưỡng thì điều gì xảy ra?`, s: [R`Recall $= 993/1000 = 99.3\%$, chưa đạt.`, R`Hạ ngưỡng: nhiều ảnh bị gọi NG hơn → recall tăng.`, R`Đổi lại tỷ lệ báo động giả tăng (bo tốt bị gửi kiểm lại).`], a: R`Chưa đạt; hạ ngưỡng để tăng recall và chấp nhận thêm báo động giả.` },
  ],
  miss: [[R`AUROC cao là đủ để triển khai.`, R`Cần đánh giá ở <b>ngưỡng vận hành</b>: recall và tỷ lệ báo động giả thực tế.`]],
  recap: [R`Chọn phương pháp theo lượng dữ liệu lỗi.`, R`PatchCore: k-NN với ngân hàng mảnh tốt.`, R`Dữ liệu tổng hợp phải được kiểm chứng trên dữ liệu thật.`],
});
