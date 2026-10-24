A('conv', {
  intuit: R`<p>Bạn cầm một <b>tấm bìa có khoét lỗ 3×3</b> và trượt nó trên tờ báo để tìm chữ “A”. Ở mỗi vị trí, bạn so những gì nhìn thấy qua lỗ với hình chữ A trong đầu (tích vô hướng), ghi điểm vào một tờ giấy mới đúng vị trí đó. Trượt hết tờ báo, bạn có một <b>bản đồ điểm</b>: chỗ nào sáng là chỗ có chữ A.</p>
<p>Tấm bìa chính là <b>kernel</b>, bản đồ điểm là <b>feature map</b>. Điểm mấu chốt: bạn dùng <b>cùng một hình chữ A</b> trong đầu cho mọi vị trí, không cần học riêng “chữ A ở góc trái” và “chữ A ở giữa”. Đó là chia sẻ trọng số.</p>
<p>Kiểm tra AOI cũng vậy: một kernel “cạnh dọc” trượt dọc đường mạch, và bật sáng ở mép mạch, đặc biệt mạnh ở chỗ mạch bị gãy hoặc có gai đồng.</p>`,
  worked: { t: 'Tích chập 2×2 trên ảnh 4×4, đủ 9 ô',
    setup: R`Ảnh $X=\begin{bmatrix}1&2&0&1\\0&1&3&2\\2&0&1&0\\1&1&0&2\end{bmatrix}$, kernel $K=\begin{bmatrix}1&0\\-1&1\end{bmatrix}$, stride 1, không padding, bias 0.`,
    steps: [
      R`<b>Kích thước đầu ra:</b> $(4-2)/1+1 = 3$, tức $3\times3$ = 9 ô cần tính.`,
      R`<b>Cách tính một ô:</b> đặt kernel lên vùng 2×2, nhân từng cặp, cộng: $Y_{ij} = X_{i,j}\cdot1 + X_{i,j+1}\cdot0 + X_{i+1,j}\cdot(-1) + X_{i+1,j+1}\cdot1$. Rút gọn: $Y_{ij} = X_{i,j} - X_{i+1,j} + X_{i+1,j+1}$.`,
      R`<b>Hàng 1:</b> $Y_{11} = 1 - 0 + 1 = 2$; $Y_{12} = 2 - 1 + 3 = 4$; $Y_{13} = 0 - 3 + 2 = -1$.`,
      R`<b>Hàng 2:</b> $Y_{21} = 0 - 2 + 0 = -2$; $Y_{22} = 1 - 0 + 1 = 2$; $Y_{23} = 3 - 1 + 0 = 2$.`,
      R`<b>Hàng 3:</b> $Y_{31} = 2 - 1 + 1 = 2$; $Y_{32} = 0 - 1 + 0 = -1$; $Y_{33} = 1 - 0 + 2 = 3$.`,
      R`<b>Kết quả:</b> $Y = \begin{bmatrix}2&4&-1\\-2&2&2\\2&-1&3\end{bmatrix}$. Số phép nhân: 9 ô × 4 = 36, nhưng chỉ có <b>4 tham số</b>. Một lớp Linear nối 16 pixel với 9 đầu ra cần 144 tham số.`,
    ],
    ans: R`$Y = \begin{bmatrix}2&4&-1\\-2&2&2\\2&-1&3\end{bmatrix}$.` },
  ex: [
    { q: R`Ảnh 5×5, kernel 3×3, stride 1, không padding. Kích thước đầu ra?`, s: [R`Công thức $(N-K)/S + 1$.`, R`$(5-3)/1+1 = 3$.`], a: R`$3\times3$.` },
    { q: R`Mảng $\begin{bmatrix}1&2&3\\4&5&6\\7&8&9\end{bmatrix}$ chập với Sobel dọc $\begin{bmatrix}-1&0&1\\-2&0&2\\-1&0&1\end{bmatrix}$. Giải thích ý nghĩa kết quả.`, s: [R`Hàng 1: $-1\cdot1 + 0\cdot2 + 1\cdot3 = 2$.`, R`Hàng 2: $-2\cdot4 + 0 + 2\cdot6 = 4$.`, R`Hàng 3: $-1\cdot7 + 0 + 1\cdot9 = 2$.`, R`Tổng: $8$.`], a: R`8 > 0: giá trị tăng từ trái sang phải, tức có “cạnh dọc” sáng dần về bên phải.` },
  ],
  miss: [[R`Kernel được thiết kế bằng tay như Sobel.`, R`Trong CNN, kernel là tham số <b>học được</b>. Sobel chỉ để minh họa.`], [R`Tích chập làm mất thông tin vị trí.`, R`Tích chập giữ vị trí (equivariant); pooling và các lớp cuối mới làm mờ dần vị trí.`]],
  recap: [R`Mỗi ô đầu ra = tích vô hướng kernel với một vùng ảnh.`, R`Ít tham số nhờ dùng chung kernel.`, R`Đầu ra $(N-K)/S+1$.`],
});

A('convshape', {
  intuit: R`<p><b>Padding</b> như dán thêm viền giấy trắng quanh bức ảnh để kính lúp 3×3 trượt được tới tận mép. <b>Stride</b> là bước nhảy của kính lúp: nhảy 2 ô một lần thì bản đồ kết quả nhỏ đi một nửa. <b>Max pooling</b> như mỗi tổ 4 người chỉ cử người điểm cao nhất lên báo cáo: giữ lại tín hiệu mạnh nhất, giảm số người cần nghe.</p>`,
  worked: { t: 'Theo dõi shape qua phần đầu ResNet-18',
    setup: R`Ảnh $224\times224\times3$. Stem: conv $7\times7$, 64 kênh, stride 2, padding 3 → BN → ReLU → maxpool $3\times3$ stride 2 padding 1 → hai khối conv $3\times3$, 64 kênh, stride 1, padding 1.`,
    steps: [
      R`<b>Conv 7×7:</b> $\lfloor(224 + 6 - 7)/2\rfloor + 1 = \lfloor223/2\rfloor + 1 = 111+1 = 112$. Shape $112\times112\times64$.`,
      R`<b>Tham số conv 7×7:</b> $7\cdot7\cdot3\cdot64 = 9{,}408$ (ResNet không dùng bias khi có BN).`,
      R`<b>Maxpool 3×3 s2 p1:</b> $\lfloor(112+2-3)/2\rfloor+1 = 55+1 = 56$. Shape $56\times56\times64$, không thêm tham số.`,
      R`<b>Conv 3×3 s1 p1:</b> $(56+2-3)/1+1 = 56$. Giữ nguyên $56\times56\times64$.`,
      R`<b>Tham số mỗi conv 3×3:</b> $3\cdot3\cdot64\cdot64 = 36{,}864$. Bốn conv trong layer1: $147{,}456$.`,
      R`<b>MACs của conv 7×7:</b> $112^2\cdot49\cdot3\cdot64 = 12{,}544\cdot9{,}408 \approx 118$ triệu.`,
    ],
    ans: R`$224^2\times3 \to 112^2\times64 \to 56^2\times64$ (giữ nguyên qua layer1).` },
  ex: [
    { q: R`Conv $3\times3$, stride 2, padding 1 trên ảnh $64\times64\times32$, 64 bộ lọc. Shape và số tham số (có bias)?`, s: [R`$\lfloor(64+2-3)/2\rfloor+1 = 31+1 = 32$.`, R`Shape $32\times32\times64$.`, R`Tham số $3\cdot3\cdot32\cdot64 + 64 = 18{,}496$.`], a: R`$32\times32\times64$; 18,496 tham số.` },
    { q: R`Max pool 2×2 stride 2 trên $\begin{bmatrix}1&3&2&0\\5&4&1&1\\0&2&6&7\\1&1&8&2\end{bmatrix}$. Nếu là average pool thì sao?`, s: [R`Chia 4 khối 2×2: trái-trên $\{1,3,5,4\}$, phải-trên $\{2,0,1,1\}$, trái-dưới $\{0,2,1,1\}$, phải-dưới $\{6,7,8,2\}$.`, R`Max: $5, 2, 2, 8$.`, R`Average: $13/4=3.25$, $4/4=1$, $4/4=1$, $23/4 = 5.75$.`], a: R`Max $\begin{bmatrix}5&2\\2&8\end{bmatrix}$; average $\begin{bmatrix}3.25&1\\1&5.75\end{bmatrix}$.` },
  ],
  miss: [[R`Pooling có tham số học được.`, R`Max/avg pooling không có tham số. Global average pooling cũng vậy.`]],
  recap: [R`$N_{out}=\lfloor(N+2P-K)/S\rfloor+1$.`, R`Tham số $K^2C_{in}C_{out}(+C_{out})$.`, R`$K=3,P=1,S=1$ giữ kích thước; $S=2$ giảm một nửa.`],
});

A('channels', {
  intuit: R`<p>Ảnh màu là ba tờ giấy trong suốt xếp chồng: một tờ đỏ, một tờ xanh lá, một tờ xanh dương. Một bộ lọc tích chập nhìn <b>xuyên qua cả ba tờ cùng lúc</b>, mỗi tờ có lát kernel riêng, rồi cộng tất cả thành một bản đồ.</p>
<p>Ví dụ quen thuộc nhất của conv 1×1: <b>chuyển ảnh màu sang ảnh xám</b>. Công thức xám $= 0.299R + 0.587G + 0.114B$ chính là một conv 1×1 với 3 kênh vào, 1 kênh ra, trọng số $[0.299, 0.587, 0.114]$. Nó không nhìn hàng xóm, chỉ trộn các kênh tại từng pixel.</p>`,
  worked: { t: 'Conv 1×1: ảnh màu 2×2 sang ảnh xám',
    setup: R`Ảnh $2\times2\times3$, mỗi pixel ghi $(R,G,B)$: trái-trên $(200, 100, 50)$, phải-trên $(0, 255, 0)$, trái-dưới $(255,255,255)$, phải-dưới $(10, 20, 200)$. Kernel 1×1: $\mathbf w=[0.299, 0.587, 0.114]$.`,
    steps: [
      R`<b>Trái-trên:</b> $0.299\cdot200 + 0.587\cdot100 + 0.114\cdot50 = 59.8 + 58.7 + 5.7 = 124.2$.`,
      R`<b>Phải-trên (xanh lá thuần):</b> $0 + 0.587\cdot255 + 0 = 149.7$.`,
      R`<b>Trái-dưới (trắng):</b> $(0.299+0.587+0.114)\cdot255 = 1\cdot255 = 255$. Trắng vẫn là trắng.`,
      R`<b>Phải-dưới (xanh dương đậm):</b> $0.299\cdot10 + 0.587\cdot20 + 0.114\cdot200 = 2.99 + 11.74 + 22.8 = 37.5$.`,
      R`<b>Kết quả</b> $\begin{bmatrix}124.2&149.7\\255&37.5\end{bmatrix}$. Số tham số: $1\cdot1\cdot3\cdot1 = 3$. Trong CNN, 3 con số này được <i>học</i>, và thường có hàng trăm kênh ra thay vì 1.`,
    ],
    ans: R`$\begin{bmatrix}124.2&149.7\\255&37.5\end{bmatrix}$.` },
  ex: [
    { q: R`Feature map $56\times56\times256$ qua conv $1\times1$ còn 64 kênh. Số tham số và MACs?`, s: [R`Tham số $256\cdot64 + 64 = 16{,}448$.`, R`MACs $= 56\cdot56\cdot256\cdot64 = 3136\cdot16{,}384 \approx 51.4$ triệu.`], a: R`16,448 tham số; ≈ 51 triệu MACs.` },
    { q: R`Conv $3\times3$, $C_{in}=C_{out}=128$, groups $=4$. Số trọng số? Nếu groups $=128$ (depthwise)?`, s: [R`Mỗi nhóm có $128/4 = 32$ kênh vào và 32 kênh ra.`, R`Mỗi nhóm: $9\cdot32\cdot32 = 9{,}216$; 4 nhóm: $36{,}864$.`, R`Depthwise: mỗi kênh một kernel $3\times3$: $9\cdot128 = 1{,}152$.`], a: R`Groups 4: 36,864; depthwise: 1,152.` },
  ],
  miss: [[R`Mỗi kênh đầu vào cho ra một kênh đầu ra.`, R`Mỗi <b>bộ lọc</b> (nhìn mọi kênh vào) cho ra một kênh ra. Số kênh ra = số bộ lọc.`]],
  recap: [R`Bộ lọc có độ sâu bằng $C_{in}$, cộng dồn mọi kênh.`, R`Conv 1×1 = Linear theo từng pixel.`, R`Depthwise không trộn kênh; pointwise 1×1 trộn lại.`],
});

A('rf', {
  intuit: R`<p>Hãy nghĩ về một công ty: <b>công nhân</b> chỉ thấy vài linh kiện trước mặt (RF nhỏ). <b>Tổ trưởng</b> nghe báo cáo từ 3 công nhân, nên “thấy” cả một bàn. <b>Quản đốc</b> nghe 3 tổ trưởng, thấy cả một xưởng. <b>Giám đốc</b> thấy toàn nhà máy. Không ai trực tiếp nhìn toàn bộ, nhưng thông tin được gộp dần qua từng cấp.</p>
<p>Stride giống việc mỗi tổ trưởng phụ trách các khu <i>không chồng lấn</i>: tầm nhìn của cấp trên mở rộng nhanh hơn nhiều.</p>`,
  worked: { t: 'Trường tiếp nhận của một chồng lớp kiểu VGG',
    setup: R`Chuỗi lớp: conv3 (s1) → conv3 (s1) → maxpool2 (s2) → conv3 (s1) → conv3 (s1). Tính RF sau từng lớp. Công thức $r_l = r_{l-1} + (k_l-1)J_{l-1}$, $J_l = J_{l-1}s_l$, $r_0 = 1$, $J_0=1$.`,
    steps: [
      R`<b>Conv3 thứ 1:</b> $r = 1 + 2\cdot1 = 3$; $J = 1$.`,
      R`<b>Conv3 thứ 2:</b> $r = 3 + 2\cdot1 = 5$; $J = 1$.`,
      R`<b>Maxpool 2, s2:</b> $r = 5 + 1\cdot1 = 6$; $J = 2$ (từ đây mỗi bước trên feature map = 2 pixel ảnh).`,
      R`<b>Conv3 thứ 3:</b> $r = 6 + 2\cdot2 = 10$; $J=2$.`,
      R`<b>Conv3 thứ 4:</b> $r = 10 + 2\cdot2 = 14$; $J = 2$.`,
      R`<b>Nhận xét:</b> sau pooling, mỗi conv 3×3 mở rộng RF thêm 4 pixel thay vì 2. Càng nhiều lần giảm kích thước, RF càng nở nhanh.`,
    ],
    ans: R`RF cuối $= 14\times14$ pixel.` },
  ex: [
    { q: R`Ba lớp conv 3×3 stride 1. RF?`, s: [R`$1 \to 3 \to 5 \to 7$.`], a: R`$7\times7$, bằng một conv $7\times7$ nhưng ít tham số hơn ($27C^2$ so với $49C^2$).` },
    { q: R`Conv 3×3 stride 2 rồi conv 3×3 stride 1. RF?`, s: [R`Lớp 1: $r = 1 + 2\cdot1 = 3$; $J = 2$.`, R`Lớp 2: $r = 3 + 2\cdot2 = 7$.`], a: R`$7\times7$.` },
  ],
  miss: [[R`RF lý thuyết là vùng mạng thực sự “nhìn”.`, R`RF <i>hiệu dụng</i> thường nhỏ hơn nhiều và tập trung ở giữa (dạng Gaussian).`]],
  recap: [R`$r_l = r_{l-1} + (k_l-1)J_{l-1}$.`, R`Stride và pooling làm RF nở nhanh.`, R`Chọn tầng đặc trưng có RF khớp kích thước lỗi.`],
});

A('cnnarch', {
  intuit: R`<p>Các kiến trúc CNN kinh điển giống các đời xe máy: <b>LeNet</b> là chiếc Cub đầu tiên (đơn giản, làm được việc nhỏ), <b>AlexNet</b> là lúc lắp động cơ mạnh (GPU) và chạy thắng đường đua ImageNet, <b>VGG</b> chuẩn hóa thiết kế thành các khối giống hệt nhau, <b>Inception</b> thử nhiều “bánh răng” song song, <b>ResNet</b> phát minh ra hộp số cho phép chạy rất xa (rất sâu).</p>
<p>Quy luật chung để đọc mọi CNN: <b>ảnh nhỏ dần, kênh dày dần</b>, giống phễu: không gian thu hẹp, ý nghĩa đậm dần.</p>`,
  worked: { t: 'Đếm tham số LeNet-5',
    setup: R`Ảnh $32\times32\times1$. C1: conv $5\times5$, 6 kênh. S2: pool 2. C3: conv $5\times5$, 16 kênh. S4: pool 2. C5: FC $400\to120$. F6: FC $120\to84$. Đầu ra: FC $84\to10$. (Phiên bản đơn giản: C3 nối đủ 6 kênh.)`,
    steps: [
      R`<b>C1:</b> shape $28\times28\times6$; tham số $5\cdot5\cdot1\cdot6+6 = 156$.`,
      R`<b>S2:</b> $14\times14\times6$, 0 tham số.`,
      R`<b>C3:</b> $10\times10\times16$; tham số $5\cdot5\cdot6\cdot16 + 16 = 2{,}416$.`,
      R`<b>S4:</b> $5\times5\times16 = 400$ số, 0 tham số.`,
      R`<b>C5:</b> $400\cdot120+120 = 48{,}120$. <b>F6:</b> $120\cdot84+84 = 10{,}164$. <b>Ra:</b> $84\cdot10+10 = 850$.`,
      R`<b>Tổng:</b> $156+2{,}416+48{,}120+10{,}164+850 = 61{,}706$. Các lớp FC chiếm 96% tham số dù conv làm phần lớn phép tính.`,
    ],
    ans: R`≈ 61.7 nghìn tham số.` },
  ex: [
    { q: R`VGG-16 có khoảng 138 triệu tham số. Lớp FC đầu tiên ($7\cdot7\cdot512 \to 4096$) chiếm bao nhiêu?`, s: [R`$7\cdot7\cdot512 = 25{,}088$.`, R`$25{,}088\cdot4096 \approx 102.8$ triệu.`, R`Tỷ lệ $102.8/138\approx74\%$.`], a: R`≈ 102.8 triệu (≈ 74%). Vì vậy các mạng sau dùng global average pooling.` },
  ],
  miss: [[R`Mạng mới hơn luôn có nhiều tham số hơn.`, R`ResNet-50 (25M) nhỏ hơn VGG-16 (138M) nhiều nhưng chính xác hơn.`]],
  recap: [R`Kích thước không gian giảm, số kênh tăng.`, R`Stem → backbone → neck → head.`, R`FC cuối mạng tốn tham số; GAP thay thế.`],
});

A('resnet', {
  intuit: R`<p>Thầy giáo yêu cầu học sinh sửa bài văn. Cách 1: viết lại toàn bộ bài từ đầu (mạng thường phải học cả ánh xạ $H(x)$). Cách 2: <b>giữ nguyên bản gốc, chỉ ghi chú phần cần sửa</b> bằng bút đỏ (mạng residual chỉ học phần chênh lệch $F(x)$). Nếu bài đã tốt, học sinh chỉ cần… không sửa gì. Cách 2 dễ hơn nhiều.</p>
<p>Về gradient: kết nối tắt như <b>đường cao tốc song song với đường làng</b>. Dù đường làng (các lớp conv) có ổ gà làm tín hiệu yếu đi, gradient vẫn chạy thẳng trên cao tốc về các lớp đầu.</p>`,
  worked: { t: 'Một khối residual vô hướng: forward và backward',
    setup: R`Đầu vào $x = 2$. Nhánh $F(x) = w_2\,\text{ReLU}(w_1x)$ với $w_1 = 0.5$, $w_2 = -0.3$. Đầu ra $y = F(x) + x$. Giả sử gradient từ phía sau $\partial L/\partial y = 1$.`,
    steps: [
      R`<b>Forward nhánh F:</b> $w_1x = 1$; ReLU $= 1$; $F = -0.3$.`,
      R`<b>Đầu ra:</b> $y = -0.3 + 2 = 1.7$. Nhánh F chỉ “chỉnh nhẹ” $x$.`,
      R`<b>Backward qua nút cộng:</b> gradient chia đều vào hai nhánh, mỗi nhánh nhận $1$.`,
      R`<b>Nhánh F:</b> $\partial F/\partial x = w_2\cdot1\cdot w_1 = -0.15$ (ReLU đang bật). Gradient qua nhánh F: $1\cdot(-0.15) = -0.15$.`,
      R`<b>Nhánh tắt:</b> $\partial x/\partial x = 1$, gradient $= 1$.`,
      R`<b>Tổng:</b> $\partial L/\partial x = 1 - 0.15 = 0.85$. Nếu không có kết nối tắt, gradient chỉ còn $-0.15$. Qua 20 khối: $0.85^{20}\approx0.039$ so với $0.15^{20}\approx3\times10^{-17}$.`,
    ],
    ans: R`$y = 1.7$; $\partial L/\partial x = 0.85$ (so với $-0.15$ nếu không có đường tắt).` },
  ex: [
    { q: R`Tính số tham số của khối bottleneck ResNet-50: conv1×1 256→64, conv3×3 64→64, conv1×1 64→256 (bỏ bias, BN). So với hai conv 3×3 256→256.`, s: [R`$256\cdot64 = 16{,}384$.`, R`$9\cdot64\cdot64 = 36{,}864$.`, R`$64\cdot256 = 16{,}384$. Tổng $69{,}632$.`, R`Hai conv 3×3 256: $2\cdot9\cdot256^2 = 1{,}179{,}648$.`], a: R`Bottleneck ≈ 70 nghìn, nhỏ hơn khoảng 17 lần.` },
  ],
  miss: [[R`Kết nối tắt chỉ để tránh overfitting.`, R`Mục đích chính là làm <b>tối ưu</b> dễ hơn (gradient chảy tốt, dễ học ánh xạ gần đồng nhất).`], [R`Khi shape khác nhau thì không cộng được nên bỏ đường tắt.`, R`Dùng conv 1×1 (stride 2 nếu cần) trên đường tắt để khớp shape.`]],
  recap: [R`$y = F(x) + x$: chỉ học phần chênh lệch.`, R`Gradient: $\partial y/\partial x = \partial F/\partial x + 1$.`, R`Có mặt trong mọi kiến trúc hiện đại.`],
});

A('efficient', {
  intuit: R`<p>Conv thường giống một đầu bếp vừa thái vừa trộn mọi nguyên liệu cùng lúc cho mỗi món. <b>Depthwise separable</b> tách thành hai công đoạn: một người chỉ <b>thái</b> từng nguyên liệu riêng (depthwise: mỗi kênh một kernel), một người chỉ <b>trộn</b> (pointwise 1×1). Ít động tác hơn nhiều mà món ăn gần như không đổi.</p>
<p><b>Squeeze-and-Excitation</b> như người điều phối nhìn tổng quan bữa tiệc rồi nói: “hôm nay khách thích cay, tăng ớt lên, giảm đường xuống”. Mạng tự tăng/giảm tầm quan trọng của từng kênh tùy ảnh.</p>`,
  worked: { t: 'Một khối MobileNetV2 (inverted residual)',
    setup: R`Feature map $28\times28\times32$. Khối: mở rộng 1×1 (×6 → 192 kênh) → depthwise 3×3 (192) → thu hẹp 1×1 (→32). Đếm tham số (bỏ BN) và so với một conv 3×3 thường 32→32.`,
    steps: [
      R`<b>Mở rộng 1×1:</b> $32\cdot192 = 6{,}144$.`,
      R`<b>Depthwise 3×3:</b> $9\cdot192 = 1{,}728$.`,
      R`<b>Thu hẹp 1×1:</b> $192\cdot32 = 6{,}144$.`,
      R`<b>Tổng:</b> $14{,}016$. Conv 3×3 thường 32→32: $9\cdot32\cdot32 = 9{,}216$.`,
      R`<b>Nhận xét:</b> khối MobileNetV2 nhiều tham số hơn conv đơn, nhưng xử lý ở không gian 192 kênh “giàu” hơn; so với conv 3×3 thường ở 192 kênh ($331{,}776$) thì rẻ hơn 24 lần.`,
    ],
    ans: R`14,016 tham số cho khối; rẻ hơn ~24 lần so với conv thường ở cùng độ rộng 192.` },
  ex: [
    { q: R`Conv 3×3, 256→256. So sánh số trọng số thường và depthwise separable.`, s: [R`Thường: $9\cdot256\cdot256 = 589{,}824$.`, R`Depthwise: $9\cdot256 = 2{,}304$. Pointwise: $256\cdot256 = 65{,}536$.`, R`Tổng $67{,}840$; tỷ lệ $589{,}824/67{,}840\approx8.7$.`], a: R`Nhỏ hơn ~8.7 lần.` },
  ],
  miss: [[R`Ít tham số hơn thì luôn chạy nhanh hơn.`, R`Depthwise conv có cường độ tính toán thấp, đôi khi chạy trên GPU không nhanh như kỳ vọng. Phải đo độ trễ thật trên phần cứng đích.`]],
  recap: [R`Depthwise + pointwise ≈ 1/9 chi phí.`, R`SE: attention theo kênh.`, R`EfficientNet mở rộng đồng thời sâu, rộng, độ phân giải.`],
});

A('detseg', {
  intuit: R`<p><b>Phân loại</b> trả lời “ảnh có lỗi không?”. <b>Phát hiện</b> trả lời “lỗi ở đâu, khoanh hộp lại”. <b>Phân đoạn</b> tô màu từng pixel lỗi. Ba mức này như ba câu hỏi của giám sát chất lượng: có hỏng không, hỏng ở đâu, hỏng đúng hình dạng gì.</p>
<p><b>NMS</b> giống khi nhiều người cùng chỉ vào một vết xước và mỗi người khoanh một hộp hơi khác nhau. Bạn giữ hộp của người tự tin nhất, xóa các hộp trùng nhiều với nó, rồi xét tiếp các vết khác.</p>
<p><b>U-Net</b> như vẽ bản đồ: encoder đọc toàn cảnh để hiểu “đây là đường mạch”, decoder vẽ lại chi tiết; kết nối tắt mang theo nét vẽ gốc để đường biên không bị nhòe.</p>`,
  worked: { t: 'NMS trên 4 hộp dự đoán',
    setup: R`Bốn hộp (x1, y1, x2, y2, điểm): $A=(0,0,4,4,0.9)$, $B=(1,1,5,5,0.8)$, $C=(0,0,4,3,0.7)$, $D=(6,6,9,9,0.6)$. Ngưỡng IoU $=0.5$.`,
    steps: [
      R`<b>Sắp xếp theo điểm:</b> A (0.9), B (0.8), C (0.7), D (0.6). Giữ A.`,
      R`<b>IoU(A, B):</b> giao $= (4-1)\cdot(4-1) = 9$; hợp $= 16+16-9 = 23$; IoU $= 9/23 = 0.391 < 0.5$. Giữ B (có thể là vết lỗi khác).`,
      R`<b>IoU(A, C):</b> C nằm trong A: giao $= 4\cdot3 = 12$; hợp $= 16+12-12 = 16$; IoU $= 0.75 > 0.5$. Xóa C (trùng A).`,
      R`<b>IoU(A, D):</b> không giao, IoU = 0. Giữ D.`,
      R`<b>Xét B làm gốc mới:</b> so với D: không giao. Giữ D.`,
      R`<b>Kết quả:</b> A, B, D. Lưu ý A và B chồng nhau 39% nhưng vẫn giữ cả hai; nếu thực ra là một lỗi, cần hạ ngưỡng IoU.`,
    ],
    ans: R`Giữ A, B, D; xóa C.` },
  ex: [
    { q: R`Hộp A = (0,0)–(4,4), B = (2,2)–(6,6). Tính IoU.`, s: [R`Giao: $x$ từ 2 đến 4, $y$ từ 2 đến 4: $2\times2 = 4$.`, R`Diện tích A = B = 16.`, R`Hợp $= 16+16-4 = 28$.`], a: R`IoU $=4/28\approx0.143$.` },
    { q: R`Lưới YOLO $13\times13$, mỗi ô dự đoán 3 hộp, mỗi hộp gồm 4 tọa độ + 1 độ tin cậy + 6 lớp lỗi. Đầu ra có bao nhiêu số?`, s: [R`Mỗi hộp: $4+1+6 = 11$ số.`, R`Mỗi ô: $3\cdot11 = 33$.`, R`Toàn lưới: $13\cdot13\cdot33 = 5{,}577$.`], a: R`Tensor $13\times13\times33$ = 5,577 số.` },
  ],
  miss: [[R`mAP cao nghĩa là không bỏ sót lỗi.`, R`mAP là trung bình trên nhiều ngưỡng. Trên dây chuyền cần nhìn riêng <b>recall</b> ở ngưỡng vận hành.`]],
  recap: [R`IoU = giao / hợp.`, R`NMS giữ hộp tự tin nhất, xóa hộp trùng.`, R`U-Net: encoder–decoder + nối tắt; FPN: kết hợp đa tỷ lệ.`],
});

A('embed', {
  intuit: R`<p>Từ điển có 50.000 từ. Thay vì đánh số khô khan, mỗi từ được cấp một <b>“tọa độ trên bản đồ nghĩa”</b> với vài trăm chiều. “Phở”, “bún”, “hủ tiếu” nằm gần nhau; “phở” và “bo mạch” nằm rất xa. Mạng học bản đồ này sao cho các từ hay xuất hiện trong ngữ cảnh giống nhau thì đứng gần nhau.</p>
<p>Tra embedding giống <b>tra số nhà</b>: biết ID của từ, lấy ngay hàng tương ứng trong bảng.</p>`,
  worked: { t: 'Tra embedding bằng phép nhân one-hot',
    setup: R`Từ điển 4 từ: [phở=0, bún=1, mạch=2, lỗi=3]. Bảng embedding $E$ ($4\times2$) $= \begin{bmatrix}0.9&0.1\\0.8&0.2\\0.1&0.9\\0.2&0.7\end{bmatrix}$. Lấy embedding của “bún” và đo độ giống với “phở” và “mạch”.`,
    steps: [
      R`<b>One-hot của “bún”:</b> $[0,1,0,0]$.`,
      R`<b>Nhân với $E$:</b> $[0,1,0,0]E = 0\cdot\text{hàng}_0 + 1\cdot\text{hàng}_1 + 0 + 0 = [0.8, 0.2]$. Đúng là hàng thứ 1.`,
      R`<b>Cosine(bún, phở):</b> $\frac{0.8\cdot0.9+0.2\cdot0.1}{\sqrt{0.68}\sqrt{0.82}} = \frac{0.74}{0.825\cdot0.906} = 0.990$.`,
      R`<b>Cosine(bún, mạch):</b> $\frac{0.8\cdot0.1 + 0.2\cdot0.9}{0.825\cdot0.906} = \frac{0.26}{0.747} = 0.348$.`,
    ],
    ans: R`“bún” = $[0.8, 0.2]$; rất gần “phở” (0.99), xa “mạch” (0.35).` },
  ex: [
    { q: R`Từ điển 50,000, $d=768$. Ma trận embedding bao nhiêu tham số? Bao nhiêu MB ở float32?`, s: [R`$50{,}000\cdot768 = 38.4$ triệu.`, R`Mỗi số 4 byte: $153.6$ triệu byte.`], a: R`38.4 triệu tham số ≈ 154 MB.` },
  ],
  miss: [[R`ID của từ mang ý nghĩa (ID gần nhau thì nghĩa gần nhau).`, R`ID chỉ là số thứ tự. Ý nghĩa nằm trong vector embedding học được.`]],
  recap: [R`Embedding = one-hot × E = tra hàng.`, R`Nghĩa gần ↔ vector gần.`, R`ViT: mảnh ảnh × ma trận chiếu = “embedding” của ảnh.`],
});

A('rnn', {
  intuit: R`<p>RNN đọc câu như người <b>nghe kể chuyện qua điện thoại</b>: nghe từng từ, cập nhật “tóm tắt trong đầu” (trạng thái ẩn) rồi quên chi tiết. Câu chuyện dài thì những gì nghe đầu tiên phai dần. Đó chính là tiêu biến gradient: thông tin từ xa bị nhân với hệ số nhỏ qua mỗi bước.</p>`,
  worked: { t: 'RNN vô hướng chạy 3 bước và gradient ngược',
    setup: R`$h_t = \tanh(w_hh_{t-1} + w_xx_t)$ với $w_h = 0.5$, $w_x = 1$, $h_0 = 0$, chuỗi $x = [1, 0, 0]$.`,
    steps: [
      R`<b>t=1:</b> $h_1 = \tanh(0 + 1) = 0.762$.`,
      R`<b>t=2:</b> $h_2 = \tanh(0.5\cdot0.762) = \tanh(0.381) = 0.364$.`,
      R`<b>t=3:</b> $h_3 = \tanh(0.182) = 0.180$. Tín hiệu từ $x_1$ phai dần.`,
      R`<b>Gradient $\partial h_3/\partial h_2$:</b> $(1-h_3^2)w_h = (1-0.032)\cdot0.5 = 0.484$.`,
      R`<b>$\partial h_2/\partial h_1$:</b> $(1 - 0.132)\cdot0.5 = 0.434$.`,
      R`<b>Nhân lại:</b> $\partial h_3/\partial h_1 = 0.484\cdot0.434 = 0.210$. Mỗi bước mất hơn một nửa; sau 20 bước chỉ còn cỡ $10^{-7}$.`,
    ],
    ans: R`$h = [0.762, 0.364, 0.180]$; $\partial h_3/\partial h_1 \approx 0.21$.` },
  ex: [
    { q: R`Lặp lại với $w_h = 1.5$, $x=[1,0,0]$. Gradient có tiêu biến không?`, s: [R`$h_1 = 0.762$; $h_2 = \tanh(1.143) = 0.815$; $h_3 = \tanh(1.222) = 0.840$.`, R`$\partial h_3/\partial h_2 = (1-0.706)\cdot1.5 = 0.441$; $\partial h_2/\partial h_1 = (1-0.664)\cdot1.5 = 0.504$.`, R`Tích $\approx0.222$.`], a: R`Vẫn giảm: tanh bão hòa “ăn” bớt gradient dù $w_h > 1$. Tăng $w_h$ không phải lời giải; cần cổng (LSTM).` },
  ],
  miss: [[R`RNN có nhiều bộ trọng số, mỗi bước một bộ.`, R`Cùng một bộ $W_h, W_x$ dùng lại ở mọi bước.`]],
  recap: [R`$h_t = \tanh(W_hh_{t-1} + W_xx_t + b)$.`, R`Gradient theo thời gian là tích nhiều hệ số → tiêu biến/bùng nổ.`, R`Tuần tự, khó song song.`],
});

A('lstm', {
  intuit: R`<p>LSTM như <b>cuốn sổ tay</b> bên cạnh trí nhớ ngắn hạn. Mỗi bước, ba “người gác cổng” quyết định: <b>cổng quên</b> xóa bớt dòng nào trong sổ; <b>cổng vào</b> ghi thêm gì mới; <b>cổng ra</b> đọc to phần nào. Vì sổ tay được cập nhật bằng phép cộng (gạch bớt + ghi thêm) chứ không viết lại, thông tin quan trọng có thể nằm đó rất lâu.</p>`,
  worked: { t: 'Một bước LSTM vô hướng',
    setup: R`Đã tính sẵn các tổng trước kích hoạt: cổng quên $z_f = 2$, cổng vào $z_i = 0$, nội dung mới $z_c = 1$, cổng ra $z_o = 1$. $c_{t-1} = 0.5$.`,
    steps: [
      R`<b>Cổng:</b> $f = \sigma(2) = 0.881$; $i = \sigma(0) = 0.5$; $o = \sigma(1) = 0.731$.`,
      R`<b>Nội dung mới:</b> $\tilde c = \tanh(1) = 0.762$.`,
      R`<b>Cập nhật sổ:</b> $c_t = f\cdot c_{t-1} + i\cdot\tilde c = 0.881\cdot0.5 + 0.5\cdot0.762 = 0.440 + 0.381 = 0.821$.`,
      R`<b>Đọc ra:</b> $h_t = o\cdot\tanh(c_t) = 0.731\cdot\tanh(0.821) = 0.731\cdot0.676 = 0.494$.`,
      R`<b>Gradient qua sổ:</b> $\partial c_t/\partial c_{t-1} = f = 0.881$, không bị nhân thêm đạo hàm tanh như RNN. Khi $f\approx1$, gradient giữ gần nguyên qua nhiều bước.`,
    ],
    ans: R`$c_t = 0.821$, $h_t = 0.494$.` },
  ex: [
    { q: R`$f=0.9$, $c_{t-1}=2$, $i=0.2$, $\tilde c=1$. Tính $c_t$. Nếu $f=0$ thì sao?`, s: [R`$0.9\cdot2 + 0.2\cdot1 = 1.8+0.2$.`, R`$f=0$: $0 + 0.2 = 0.2$: xóa sạch trí nhớ cũ.`], a: R`$c_t = 2.0$; với $f=0$, $c_t = 0.2$.` },
  ],
  miss: [[R`LSTM loại bỏ hoàn toàn tiêu biến gradient.`, R`Giảm mạnh nhưng không triệt để; chuỗi hàng nghìn bước vẫn khó.`]],
  recap: [R`Ba cổng sigmoid: quên, vào, ra.`, R`$c_t = f\odot c_{t-1} + i\odot\tilde c$: cập nhật bằng phép cộng.`, R`GRU: gọn hơn, 2 cổng.`],
});
