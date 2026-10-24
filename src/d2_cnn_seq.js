/* ================= GIAI ĐOẠN 2: CNN ================= */
L({ id: 'conv', p: 'p2', t: 'Phép tích chập 2D', en: '2D Convolution', min: 120, pre: ['vector', 'mlp'],
  goals: ['Tính tay tích chập một kernel 3×3 trên ảnh', 'Hiểu chia sẻ trọng số và tính bất biến tịnh tiến', 'Đọc được ý nghĩa của kernel cạnh, làm mờ, làm sắc'],
  body: R`
<p>MLP nối mọi pixel với mọi nơ-ron: ảnh 224×224×3 qua 1000 nơ-ron đã tốn 150 triệu tham số, và mạng phải học lại “cạnh dọc” ở từng vị trí. Tích chập giải quyết bằng hai ý tưởng:</p>
<ul><li><b>Kết nối cục bộ:</b> mỗi đầu ra chỉ nhìn một vùng nhỏ $k\times k$.</li>
<li><b>Chia sẻ trọng số:</b> cùng một kernel trượt khắp ảnh.</li></ul>
$$Y_{i,j} = \sum_{u=0}^{k-1}\sum_{v=0}^{k-1} X_{i+u,\,j+v}\,K_{u,v} + b$$
<p>Mỗi ô đầu ra là <b>tích vô hướng</b> giữa kernel và mảng ảnh nằm dưới nó. (Nói chính xác, đây là <i>cross-correlation</i>; tích chập toán học lật kernel, nhưng vì kernel được học nên không khác biệt.)</p>
<h4>Kernel nói gì</h4>
<table class="tbl"><tr><th>Kernel</th><th>Tác dụng</th></tr>
<tr><td>$\begin{bmatrix}-1&0&1\\-2&0&2\\-1&0&1\end{bmatrix}$</td><td>Sobel: phát hiện cạnh dọc</td></tr>
<tr><td>$\frac19\begin{bmatrix}1&1&1\\1&1&1\\1&1&1\end{bmatrix}$</td><td>Làm mờ (trung bình)</td></tr>
<tr><td>$\begin{bmatrix}0&-1&0\\-1&5&-1\\0&-1&0\end{bmatrix}$</td><td>Làm sắc nét</td></tr></table>
<p>CNN không dùng kernel thiết kế sẵn; nó <b>học</b> kernel. Nhưng lớp đầu của CNN đã huấn luyện thường trông giống bộ lọc cạnh và Gabor.</p>
<h4>Tính bất biến tịnh tiến</h4>
<p>Dịch vật thể sang phải 5 pixel thì feature map cũng dịch theo 5 pixel (equivariance). Kết hợp pooling, mạng nhận ra vật thể ở bất kỳ đâu.</p>`,
  w: 'conv',
  ex: [
    ['Ảnh 5×5, kernel 3×3, stride 1, không padding. Kích thước đầu ra?', '$5-3+1 = 3$, tức $3\\times3$.'],
    ['Mảng $\\begin{bmatrix}1&2&3\\\\4&5&6\\\\7&8&9\\end{bmatrix}$ nhân với kernel Sobel dọc. Kết quả?', '$(-1+3) + (-8+12) + (-7+9) = 2+4+2 = 8$.'],
  ],
  app: 'Trên ảnh AOI, đường mạch đồng có cạnh rất sắc. Kernel cạnh phản ứng mạnh tại chỗ đường mạch bị đứt hoặc lồi lõm, nên lớp conv đầu tiên đã “thấy” lỗi một phần.',
  papers: ['LeCun et al. (1998) — Gradient-based learning applied to document recognition'] });

L({ id: 'convshape', p: 'p2', t: 'Padding, stride, pooling & kích thước', en: 'Shapes & Pooling', min: 75, pre: ['conv'],
  goals: ['Thuộc công thức kích thước đầu ra', 'Đếm tham số lớp conv', 'Phân biệt max pool, avg pool, global average pool'],
  body: R`
<h4>Công thức vàng</h4>
$$N_{out} = \left\lfloor\frac{N_{in} + 2P - K}{S}\right\rfloor + 1$$
<p>$N$: kích thước, $K$: kernel, $P$: padding, $S$: stride. Hai trường hợp hay gặp:</p>
<ul><li>$K=3, P=1, S=1$: giữ nguyên kích thước (“same”).</li><li>$K=3, P=1, S=2$: giảm một nửa.</li></ul>
<h4>Đếm tham số</h4>
$$\#\text{params} = K\cdot K\cdot C_{in}\cdot C_{out} + C_{out}$$
<p>Mỗi bộ lọc có kích thước $K\times K\times C_{in}$ và cho ra <b>một</b> kênh đầu ra. Muốn $C_{out}$ kênh thì cần $C_{out}$ bộ lọc.</p>
<h4>Pooling</h4>
<ul><li><b>Max pool 2×2, stride 2:</b> giữ giá trị lớn nhất trong mỗi ô 2×2, giảm kích thước một nửa, không có tham số.</li>
<li><b>Average pool:</b> lấy trung bình.</li>
<li><b>Global average pool (GAP):</b> gộp cả feature map $H\times W\times C$ thành vector $C$ chiều. Thay cho các lớp FC khổng lồ ở cuối mạng (từ ResNet trở đi).</li></ul>
<h4>Phép tính FLOPs</h4>
$$\text{MACs} = H_{out}\cdot W_{out}\cdot K^2\cdot C_{in}\cdot C_{out}$$`,
  w: 'convcalc',
  ex: [
    ['Ảnh $224\\times224\\times3$, conv $7\\times7$, 64 bộ lọc, stride 2, padding 3. Shape đầu ra và số tham số?', '$\\lfloor(224+6-7)/2\\rfloor+1 = 112$. Shape $112\\times112\\times64$. Tham số $7\\cdot7\\cdot3\\cdot64+64 = 9{,}472$. Đây là lớp đầu của ResNet.'],
    ['Max pool 2×2 trên $\\begin{bmatrix}1&3&2&0\\\\5&4&1&1\\\\0&2&6&7\\\\1&1&8&2\\end{bmatrix}$.', '$\\begin{bmatrix}5&2\\\\2&8\\end{bmatrix}$.'],
  ],
  app: '', papers: [] });

L({ id: 'channels', p: 'p2', t: 'Đa kênh, conv 1×1 & feature map', en: 'Channels & 1×1 Conv', min: 75, pre: ['convshape'],
  goals: ['Tính tay tích chập trên ảnh nhiều kênh', 'Hiểu conv 1×1 là MLP áp cho từng pixel', 'Phân biệt grouped và depthwise convolution'],
  body: R`
<p>Ảnh màu có 3 kênh (R, G, B). Feature map ở lớp sâu có thể có 512 kênh. Một bộ lọc tích chập <b>xuyên qua toàn bộ chiều sâu</b>:</p>
$$Y_{i,j} = \sum_{c=1}^{C_{in}}\;\sum_{u,v} X^{(c)}_{i+u,j+v}\,K^{(c)}_{u,v} + b$$
<p>Tức là: chập từng kênh với lát kernel tương ứng, rồi <b>cộng</b> tất cả kênh lại thành một bản đồ duy nhất.</p>
<h4>Conv 1×1</h4>
<p>Kernel $1\times1$ không nhìn hàng xóm; nó chỉ trộn các kênh tại cùng một pixel. Về bản chất, đó là một lớp Linear $C_{in}\to C_{out}$ áp dụng riêng cho từng pixel. Dùng để:</p>
<ul><li>Giảm/tăng số kênh rẻ (bottleneck của ResNet, Inception).</li><li>Trộn thông tin giữa các kênh sau depthwise conv.</li></ul>
<h4>Grouped & depthwise</h4>
<p><b>Grouped conv</b> chia kênh thành $g$ nhóm chập độc lập, giảm tham số $g$ lần. <b>Depthwise</b> là trường hợp $g = C_{in}$: mỗi kênh có kernel riêng, không trộn kênh. Ghép depthwise $3\times3$ + pointwise $1\times1$ ra <b>depthwise separable conv</b> (MobileNet).</p>`,
  w: 'mconv',
  ex: [
    ['Feature map $56\\times56\\times256$ qua conv $1\\times1$ còn 64 kênh. Số tham số?', '$256\\cdot64 + 64 = 16{,}448$.'],
    ['Conv $3\\times3$, $C_{in}=C_{out}=128$, groups=4. Số trọng số (bỏ bias)?', '$3\\cdot3\\cdot(128/4)\\cdot128 = 36{,}864$, bằng 1/4 conv thường.'],
  ],
  app: '', papers: ['Lin et al. (2013) — Network in Network'] });

L({ id: 'rf', p: 'p2', t: 'Trường tiếp nhận & phân cấp đặc trưng', en: 'Receptive Field', min: 60, pre: ['convshape'],
  goals: ['Tính trường tiếp nhận qua nhiều lớp', 'Hiểu vì sao hai conv 3×3 tốt hơn một conv 5×5', 'Biết dilated convolution'],
  body: R`
<p><b>Trường tiếp nhận</b> (receptive field, RF) là vùng trên ảnh gốc ảnh hưởng tới một ô đầu ra. Lớp càng sâu, RF càng lớn.</p>
$$r_l = r_{l-1} + (k_l - 1)\prod_{i=1}^{l-1}s_i,\qquad r_0 = 1$$
<h4>Hai 3×3 hay một 5×5?</h4>
<p>Hai conv 3×3 liên tiếp (stride 1) có RF $1+2+2=5$, bằng một conv 5×5. Nhưng tham số: $2\cdot9C^2 = 18C^2$ so với $25C^2$, và có thêm một lớp phi tuyến. Đây là ý tưởng của VGG.</p>
<h4>Phân cấp đặc trưng</h4>
<p>Lớp đầu (RF nhỏ) thấy cạnh và chấm; lớp giữa thấy hoa văn và kết cấu; lớp sâu (RF lớn) thấy bộ phận và cả vật thể. Đây là lý do feature từ lớp giữa của mạng pretrained thường tốt nhất cho phát hiện bất thường kết cấu.</p>
<h4>Dilated (atrous) convolution</h4>
<p>Chèn khoảng trống giữa các phần tử kernel với hệ số $d$: kernel $3\times3$, $d=2$ phủ vùng $5\times5$ mà vẫn chỉ có 9 trọng số. Dùng trong DeepLab để mở rộng RF mà không giảm độ phân giải.</p>`,
  w: 'rf',
  ex: [
    ['Ba lớp conv 3×3 stride 1. RF?', '$1+2+2+2=7$.'],
    ['Conv 3×3 s2 rồi conv 3×3 s1. RF?', '$1 + 2\\cdot1 = 3$, rồi $3 + 2\\cdot2 = 7$.'],
  ],
  app: 'Chọn tầng đặc trưng phải khớp kích thước lỗi: lỗi chấm nhỏ cần RF nhỏ (tầng nông, độ phân giải cao); lỗi lệch cả linh kiện cần RF lớn.',
  papers: ['Simonyan & Zisserman (2014) — VGG', 'Yu & Koltun (2016) — Dilated Convolutions'] });

L({ id: 'cnnarch', p: 'p2', t: 'Kiến trúc CNN kinh điển', en: 'Classic CNNs', min: 60, pre: ['rf'],
  goals: ['Nắm dòng tiến hóa LeNet → AlexNet → VGG → Inception', 'Đọc sơ đồ kiến trúc và đoán shape từng tầng'],
  body: R`
<table class="tbl"><tr><th>Năm</th><th>Mô hình</th><th>Ý tưởng chính</th></tr>
<tr><td>1998</td><td>LeNet-5</td><td>Conv → pool → conv → pool → FC. Đọc chữ số viết tay.</td></tr>
<tr><td>2012</td><td>AlexNet</td><td>ReLU, dropout, GPU, augmentation. Thắng ImageNet cách biệt, mở ra kỷ nguyên học sâu.</td></tr>
<tr><td>2014</td><td>VGG-16</td><td>Chỉ dùng conv 3×3, chồng sâu 16 lớp. Đơn giản, đều đặn.</td></tr>
<tr><td>2014</td><td>GoogLeNet / Inception</td><td>Nhiều nhánh song song 1×1, 3×3, 5×5, pool; conv 1×1 để giảm kênh.</td></tr>
<tr><td>2015</td><td>ResNet</td><td>Kết nối tắt; huấn luyện được 152 lớp (bài kế tiếp).</td></tr></table>
<h4>Mẫu chung</h4>
<p>Gần như mọi CNN phân loại đều theo khuôn: <b>kích thước không gian giảm dần, số kênh tăng dần</b>. Ví dụ VGG: $224^2\times64 \to 112^2\times128 \to 56^2\times256 \to 28^2\times512 \to 14^2\times512 \to 7^2\times512$. Mỗi lần giảm một nửa không gian thì nhân đôi kênh, để chi phí tính toán mỗi tầng xấp xỉ bằng nhau.</p>
<h4>Phần đầu (stem), thân (body), đầu (head)</h4>
<p>Cách đọc kiến trúc hiện đại: <b>stem</b> giảm kích thước nhanh, <b>backbone</b> trích xuất đặc trưng, <b>neck</b> (như FPN) trộn đa tỷ lệ, <b>head</b> ra dự đoán. Hiểu khuôn này giúp bạn đọc YOLO, Mask R-CNN hay U-Net nhanh hơn nhiều.</p>`,
  w: null,
  diag: { nodes: [{ t: 'Ảnh', s: '224²×3' }, { t: 'Conv×2', s: '224²×64' }, { t: 'Pool', s: '112²' }, { t: 'Conv×2', s: '112²×128' }, { t: '…', s: '' }, { t: 'Conv×3', s: '14²×512' }, { t: 'Pool', s: '7²×512' }, { t: 'FC×3', s: '4096→1000' }] },
  ex: [['VGG-16 có khoảng 138 triệu tham số. Phần lớn nằm ở đâu?', 'Ở lớp FC đầu tiên: $7\\cdot7\\cdot512\\cdot4096 \\approx 102.8$ triệu. Đây là lý do mạng sau thay FC bằng global average pooling.']],
  app: '', papers: ['Krizhevsky et al. (2012) — AlexNet', 'Szegedy et al. (2015) — Going Deeper with Convolutions'] });

L({ id: 'resnet', p: 'p2', t: 'ResNet & kết nối tắt', en: 'Residual Networks', min: 75, pre: ['cnnarch', 'backprop'],
  goals: ['Hiểu vì sao mạng sâu khó huấn luyện', 'Viết khối residual và bottleneck', 'Giải thích kết nối tắt dưới góc nhìn gradient'],
  body: R`
<p>Năm 2015, người ta thấy mạng 56 lớp có <b>lỗi huấn luyện</b> cao hơn mạng 20 lớp. Không phải overfitting, mà là tối ưu thất bại. Giải pháp của He và cộng sự:</p>
$$\mathbf y = F(\mathbf x) + \mathbf x$$
<p>Thay vì học ánh xạ $H(\mathbf x)$, khối chỉ cần học <b>phần dư</b> $F(\mathbf x) = H(\mathbf x) - \mathbf x$. Nếu lớp không cần thiết, nó chỉ việc cho $F\approx0$ để trở thành ánh xạ đồng nhất.</p>
<h4>Góc nhìn gradient</h4>
$$\frac{\partial \mathbf y}{\partial \mathbf x} = \frac{\partial F}{\partial \mathbf x} + I$$
<p>Số hạng $I$ tạo một “đường cao tốc” để gradient chảy thẳng về các lớp đầu mà không bị nhân nhỏ dần. Nhớ lại quy tắc: nút cộng truyền gradient nguyên vẹn.</p>
<h4>Bottleneck</h4>
<p>ResNet-50 trở lên dùng: conv $1\times1$ giảm kênh (256→64) → conv $3\times3$ (64) → conv $1\times1$ tăng lại (64→256). Rẻ hơn hai conv $3\times3$ ở 256 kênh khoảng 17 lần.</p>
<h4>Di sản</h4>
<p>Kết nối tắt có mặt trong <b>mọi</b> kiến trúc hiện đại: Transformer ($\mathbf x + \text{Attn}(\text{LN}(\mathbf x))$), U-Net, DenseNet (nối thay vì cộng), Diffusion.</p>`,
  w: 'resgrad',
  diag: { nodes: ['x', { t: 'Conv 3×3', s: 'BN, ReLU' }, { t: 'Conv 3×3', s: 'BN' }, { t: '⊕', c: 'red' }, 'ReLU', 'y'], skips: [[0, 3, 'đồng nhất']] },
  ex: [['Nếu mỗi lớp nhân gradient với 0.5, qua 20 lớp còn bao nhiêu? Với residual $(1+0.5)$ thì sao?', 'Không residual: $0.5^{20}\\approx 10^{-6}$. Với residual gradient không tiêu biến (thực tế BN và trọng số giữ nó ở mức hợp lý chứ không bùng nổ).']],
  app: 'ResNet-18/50 pretrained trên ImageNet vẫn là backbone mặc định tốt cho phân loại lỗi AOI và cho các phương pháp như PatchCore, PaDiM.',
  papers: ['He et al. (2016) — Deep Residual Learning', 'Huang et al. (2017) — DenseNet'] });

L({ id: 'efficient', p: 'p2', t: 'CNN hiệu quả: MobileNet, EfficientNet, ConvNeXt', en: 'Efficient CNNs', min: 60, pre: ['channels', 'resnet'],
  goals: ['Tính mức tiết kiệm của depthwise separable conv', 'Hiểu khối Squeeze-and-Excitation', 'Biết compound scaling và ConvNeXt'],
  body: R`
<h4>Depthwise separable (MobileNet)</h4>
<p>Conv thường $K\times K$, $C_{in}\to C_{out}$ tốn $K^2C_{in}C_{out}$ trọng số. Tách thành depthwise ($K^2C_{in}$) + pointwise ($C_{in}C_{out}$). Tỷ lệ:</p>
$$\frac{K^2C_{in}+C_{in}C_{out}}{K^2C_{in}C_{out}} = \frac1{C_{out}} + \frac1{K^2}\approx\frac19 \text{ với } K=3$$
<h4>Inverted residual (MobileNetV2)</h4>
<p>Mở rộng kênh ×6 bằng $1\times1$ → depthwise $3\times3$ → thu hẹp $1\times1$, kết nối tắt ở hai đầu hẹp.</p>
<h4>Squeeze-and-Excitation</h4>
<p>GAP feature map thành vector $C$ chiều → MLP nhỏ → sigmoid → nhân lại vào từng kênh. Mạng tự học “kênh nào quan trọng” cho ảnh hiện tại. Đây là một dạng attention theo kênh.</p>
<h4>EfficientNet</h4>
<p>Tăng đồng thời độ sâu $d=\alpha^\phi$, độ rộng $w=\beta^\phi$, độ phân giải $r=\gamma^\phi$ với ràng buộc $\alpha\beta^2\gamma^2\approx2$, thay vì chỉ tăng một chiều.</p>
<h4>ConvNeXt (2022)</h4>
<p>Hiện đại hóa ResNet theo các mẹo của Transformer: kernel depthwise $7\times7$, LayerNorm, GELU, inverted bottleneck, ít lớp chuẩn hóa hơn. Kết quả ngang ngửa Swin Transformer, chứng tỏ CNN chưa hề lỗi thời.</p>`,
  w: 'dwcalc',
  ex: [['Conv $3\\times3$, 256→256. So sánh số trọng số thường vs depthwise separable.', 'Thường: $589{,}824$. Tách: $2{,}304 + 65{,}536 = 67{,}840$, nhỏ hơn khoảng 8.7 lần.']],
  app: 'Kiểm tra AOI trên dây chuyền cần suy luận nhanh trên máy công nghiệp; MobileNet/EfficientNet là lựa chọn tốt khi không có GPU lớn.',
  papers: ['Howard et al. (2017) — MobileNets', 'Hu et al. (2018) — Squeeze-and-Excitation', 'Tan & Le (2019) — EfficientNet', 'Liu et al. (2022) — ConvNeXt'] });

L({ id: 'detseg', p: 'p2', t: 'Phát hiện & phân đoạn: YOLO, FPN, U-Net', en: 'Detection & Segmentation', min: 120, pre: ['resnet', 'loss'],
  goals: ['Tính IoU bằng tay', 'Hiểu NMS, anchor, FPN', 'Đọc kiến trúc U-Net và YOLO'],
  body: R`
<h4>IoU</h4>
$$\text{IoU} = \frac{|A\cap B|}{|A\cup B|}$$
<p>Thước đo độ trùng giữa hai hộp, từ 0 đến 1. Một dự đoán thường được tính là đúng khi IoU ≥ 0.5.</p>
<h4>Phát hiện đối tượng</h4>
<ul><li><b>Hai giai đoạn (Faster R-CNN):</b> đề xuất vùng (RPN) rồi phân loại từng vùng. Chính xác, chậm hơn.</li>
<li><b>Một giai đoạn (YOLO, SSD, RetinaNet):</b> chia ảnh thành lưới; mỗi ô dự đoán trực tiếp hộp, độ tin cậy và lớp. Nhanh, hợp thời gian thực.</li>
<li><b>Anchor-free</b> (FCOS, YOLOv8 trở đi): dự đoán khoảng cách từ điểm đến 4 cạnh, không cần hộp mẫu.</li></ul>
<p><b>NMS</b> (non-maximum suppression): sắp hộp theo độ tin cậy, giữ hộp cao nhất, xóa các hộp còn lại có IoU với nó vượt ngưỡng, lặp lại.</p>
<h4>FPN (Feature Pyramid Network)</h4>
<p>Feature sâu giàu ngữ nghĩa nhưng thô; feature nông chi tiết nhưng “ngây thơ”. FPN đi từ trên xuống, upsample feature sâu và cộng với feature nông qua kết nối ngang, cho mỗi tầng vừa ngữ nghĩa vừa chi tiết. Rất quan trọng với vật thể nhỏ.</p>
<h4>U-Net</h4>
<p>Encoder giảm kích thước (như CNN phân loại), decoder tăng lại kích thước (transposed conv hoặc upsample), và <b>kết nối tắt</b> nối feature cùng độ phân giải từ encoder sang decoder. Đầu ra là mask cùng kích thước ảnh. U-Net cũng là “xương sống” của mô hình Diffusion.</p>
<h4>Đánh giá</h4>
<p>Phát hiện dùng <b>mAP</b> (trung bình diện tích dưới đường precision–recall qua các lớp, thường ở IoU 0.5 hoặc 0.5:0.95). Phân đoạn dùng <b>IoU/Dice</b> trên pixel.</p>`,
  w: 'iou',
  diag: { nodes: [{ t: 'Ảnh', s: 'H×W' }, { t: 'Enc 1', s: 'H/2' }, { t: 'Enc 2', s: 'H/4' }, { t: 'Đáy', s: 'H/8' }, { t: 'Dec 2', s: 'H/4' }, { t: 'Dec 1', s: 'H/2' }, { t: 'Mask', s: 'H×W' }], skips: [[1, 5, 'nối'], [2, 4, 'nối']] },
  ex: [['Hộp A = (0,0)-(4,4), B = (2,2)-(6,6). IoU?', 'Giao $2\\times2=4$; hợp $16+16-4=28$. IoU $=4/28\\approx0.143$.']],
  app: 'U-Net là lựa chọn kinh điển để khoanh vùng lỗi bo mạch ở mức pixel và cũng là mạng dự đoán keypoint tốt (heatmap). YOLO hợp khi cần đếm và định vị nhiều lỗi rời rạc.',
  papers: ['Ronneberger et al. (2015) — U-Net', 'Redmon et al. (2016) — YOLO', 'Lin et al. (2017) — Feature Pyramid Networks', 'Ren et al. (2015) — Faster R-CNN'] });

/* ================= GIAI ĐOẠN 3: CHUỖI ================= */
L({ id: 'embed', p: 'p3', t: 'Token & embedding', en: 'Tokens & Embeddings', min: 45, pre: ['matmul'],
  goals: ['Hiểu tokenization', 'Thấy embedding lookup chính là one-hot × ma trận', 'Hiểu không gian embedding'],
  body: R`
<p>Mạng chỉ xử lý số, nên văn bản phải được cắt thành <b>token</b> (từ, mảnh từ theo BPE, hoặc ký tự) và đánh số ID.</p>
<h4>Embedding = tra bảng = nhân ma trận</h4>
<p>Ma trận embedding $E$ có kích thước $V\times d$ ($V$ token trong từ điển, mỗi token một vector $d$ chiều). Lấy embedding của token $i$:</p>
$$\mathbf e_i = \text{onehot}(i)^\top E = E[i,:]$$
<p>Nhân vector one-hot với $E$ chỉ “nhặt” ra hàng thứ $i$. Thực tế ta tra bảng trực tiếp cho nhanh, nhưng về toán học đây là một lớp Linear không bias.</p>
<h4>Không gian ngữ nghĩa</h4>
<p>Sau huấn luyện, token có nghĩa gần nhau nằm gần nhau. Ví dụ nổi tiếng của word2vec: $\text{vua} - \text{đàn ông} + \text{phụ nữ}\approx\text{hoàng hậu}$.</p>
<h4>Ảnh cũng là token</h4>
<p>ViT cắt ảnh thành mảnh $16\times16$, trải phẳng và nhân với ma trận chiếu: chính là “embedding” cho ảnh. Khi bạn hiểu điều này, Transformer cho chữ và cho ảnh trở thành một.</p>`,
  w: null,
  ex: [['Từ điển 50{,}000 token, $d=768$. Ma trận embedding có bao nhiêu tham số?', '$50{,}000\\cdot768 = 38.4$ triệu.']],
  app: '', papers: ['Mikolov et al. (2013) — word2vec', 'Sennrich et al. (2016) — BPE'] });

L({ id: 'rnn', p: 'p3', t: 'Mạng hồi quy (RNN)', en: 'Recurrent Networks', min: 60, pre: ['embed', 'backprop'],
  goals: ['Tính tay vài bước của RNN', 'Hiểu BPTT và vấn đề gradient theo thời gian'],
  body: R`
<p>RNN xử lý chuỗi bằng cách mang theo một <b>trạng thái ẩn</b> $\mathbf h_t$ qua từng bước:</p>
$$\mathbf h_t = \tanh(W_h\mathbf h_{t-1} + W_x\mathbf x_t + \mathbf b),\qquad \mathbf y_t = W_y\mathbf h_t$$
<p>Cùng một bộ trọng số dùng lại ở mọi bước, giống như CNN chia sẻ kernel theo không gian, RNN chia sẻ theo thời gian.</p>
<h4>BPTT</h4>
<p>“Trải” RNN thành mạng sâu $T$ lớp rồi backprop như thường. Gradient từ bước $T$ về bước 1 phải nhân $W_h$ (và đạo hàm tanh) khoảng $T$ lần:</p>
$$\frac{\partial\mathbf h_T}{\partial\mathbf h_1} = \prod_{t=2}^{T} \text{diag}(1-\mathbf h_t^2)\,W_h$$
<p>Trị riêng của $W_h$ nhỏ hơn 1 thì gradient tiêu biến, lớn hơn 1 thì bùng nổ. RNN thuần khó nhớ phụ thuộc xa.</p>
<h4>Hai hạn chế dẫn tới Transformer</h4>
<ol><li>Phải tính tuần tự, không song song hóa theo thời gian.</li><li>Thông tin từ xa phải đi qua nhiều bước, dễ mất.</li></ol>`,
  w: 'rnn',
  ex: [['RNN vô hướng: $w_h=0.5, w_x=1, b=0$, $h_0=0$, chuỗi $x=[1, 0, 0]$. Tính $h_1,h_2,h_3$.', '$h_1=\\tanh(1)=0.762$, $h_2=\\tanh(0.381)=0.364$, $h_3=\\tanh(0.182)=0.180$. Thông tin của $x_1$ phai dần.']],
  app: '', papers: ['Elman (1990) — Finding structure in time'] });

L({ id: 'lstm', p: 'p3', t: 'LSTM & GRU', en: 'LSTM & GRU', min: 60, pre: ['rnn'],
  goals: ['Viết công thức các cổng LSTM', 'Hiểu “đường cao tốc” cell state'],
  body: R`
<p>LSTM thêm <b>cell state</b> $\mathbf c_t$ và ba cổng sigmoid điều tiết dòng thông tin:</p>
$$\mathbf f_t = \sigma(W_f[\mathbf h_{t-1},\mathbf x_t]+\mathbf b_f)\quad\text{(cổng quên)}$$
$$\mathbf i_t = \sigma(W_i[\mathbf h_{t-1},\mathbf x_t]+\mathbf b_i)\quad\text{(cổng vào)}$$
$$\tilde{\mathbf c}_t = \tanh(W_c[\mathbf h_{t-1},\mathbf x_t]+\mathbf b_c)\quad\text{(nội dung mới)}$$
$$\mathbf c_t = \mathbf f_t\odot\mathbf c_{t-1} + \mathbf i_t\odot\tilde{\mathbf c}_t$$
$$\mathbf o_t = \sigma(W_o[\cdot]+\mathbf b_o),\qquad \mathbf h_t = \mathbf o_t\odot\tanh(\mathbf c_t)$$
<p>Điểm mấu chốt: $\mathbf c_t$ được cập nhật bằng phép <b>cộng</b>. Khi $\mathbf f_t\approx1$, gradient đi qua gần như nguyên vẹn, giống kết nối tắt của ResNet theo trục thời gian.</p>
<h4>GRU</h4>
<p>Gộp cổng quên và cổng vào thành cổng cập nhật $\mathbf z_t$, bỏ cell state riêng: $\mathbf h_t = (1-\mathbf z_t)\odot\mathbf h_{t-1} + \mathbf z_t\odot\tilde{\mathbf h}_t$. Ít tham số hơn, hiệu quả tương đương.</p>
<h4>Bài học thiết kế</h4>
<p>Cổng (gating) và đường cộng là hai ý tưởng sống tiếp trong Transformer (SwiGLU, residual) và Mamba (cổng chọn lọc).</p>`,
  w: null,
  diag: { nodes: [{ t: 'c₍t−1₎', s: 'cell' }, { t: '⊗ f', s: 'quên' }, { t: '⊕ i·c̃', s: 'thêm mới', c: 'red' }, { t: 'c_t', s: 'cell' }, { t: 'tanh ⊗ o', s: 'xuất' }, 'h_t'] },
  ex: [['$f=0.9, c_{t-1}=2, i=0.2, \\tilde c=1$. Tính $c_t$.', '$0.9\\cdot2 + 0.2\\cdot1 = 2.0$.']],
  app: '', papers: ['Hochreiter & Schmidhuber (1997) — LSTM', 'Cho et al. (2014) — GRU'] });
