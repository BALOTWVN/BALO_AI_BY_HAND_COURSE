/* ================= BẢN ĐỒ AI THẾ GIỚI ================= */
const FIELD_GROUPS = [
  { id: 'per', t: 'Nhận thức', d: 'Máy “nhìn” và “nghe” thế giới.' },
  { id: 'lang', t: 'Ngôn ngữ & suy luận', d: 'Hiểu, viết, lập luận, viết code.' },
  { id: 'gen', t: 'Sinh nội dung', d: 'Tạo ảnh, video, âm thanh, 3D.' },
  { id: 'act', t: 'Hành động', d: 'Ra quyết định và tác động lên thế giới.' },
  { id: 'app', t: 'Ứng dụng chuyên ngành', d: 'Khoa học, công nghiệp, kinh doanh.' },
  { id: 'base', t: 'Nền tảng & trách nhiệm', d: 'Phần cứng, hiệu quả, an toàn, quản trị.' },
];
const FIELDS = [
  { g: 'per', t: 'Thị giác máy tính', en: 'Computer Vision',
    task: 'Phân loại, phát hiện, phân đoạn, theo dõi đối tượng, OCR, tái dựng 3D, kiểm tra ngoại quan công nghiệp (AOI).',
    models: 'ResNet, ConvNeXt, YOLO, U-Net, ViT, Swin, DETR, DINOv2, SAM.',
    now: 'Mô hình nền tảng thị giác (DINOv2, SAM) thành điểm xuất phát mặc định thay vì huấn luyện từ đầu. Ở thiết bị biên và dây chuyền, CNN/YOLO gọn nhẹ vẫn chiếm ưu thế. Thị giác ngày càng được gộp vào mô hình đa phương thức.',
    l: ['conv', 'resnet', 'detseg', 'yolo', 'vit', 'cap3', 'cap5'] },
  { g: 'per', t: 'Giọng nói & âm thanh', en: 'Speech & Audio',
    task: 'Nhận dạng tiếng nói (ASR), tổng hợp giọng (TTS), nhân bản giọng, dịch nói, tách nguồn âm, sinh nhạc.',
    models: 'Whisper, wav2vec 2.0, các mô hình giọng nói đầu-cuối của trợ lý ảo, mô hình sinh nhạc.',
    now: 'Trợ lý giọng nói chuyển sang dạng “nghe–nói trực tiếp” độ trễ thấp thay vì ghép ASR → LLM → TTS. Âm thanh được token hóa và xử lý bằng Transformer như văn bản.',
    l: ['speech', 'embed', 'transformer'] },
  { g: 'lang', t: 'Mô hình ngôn ngữ lớn', en: 'LLMs',
    task: 'Hỏi đáp, viết, dịch, tóm tắt, phân tích tài liệu, lập trình, suy luận toán.',
    models: 'Các họ GPT, Claude, Gemini (đóng); Llama, Qwen, DeepSeek, Mistral (mở trọng số).',
    now: 'Mô hình “suy luận” dùng thêm tính toán lúc trả lời và được huấn luyện thêm bằng RL với phần thưởng kiểm chứng được. Năng lực lập trình tăng rất nhanh; mô hình mở trọng số bám sát mô hình đóng. Vẫn còn điểm yếu khó đoán, ví dụ đọc đồng hồ kim.',
    l: ['attention', 'transformer', 'llm', 'lora', 'moe'] },
  { g: 'lang', t: 'Đa phương thức', en: 'Multimodal / VLM',
    task: 'Hiểu ảnh + chữ cùng lúc: mô tả ảnh, hỏi đáp về ảnh, đọc tài liệu, biểu đồ, bản vẽ kỹ thuật.',
    models: 'CLIP, SigLIP, LLaVA, các LLM đa phương thức gốc.',
    now: 'Hầu hết mô hình hàng đầu nhận được ảnh, âm thanh, video ngay từ đầu. Ứng dụng nổi bật: đọc hóa đơn, bản vẽ, ảnh lỗi rồi giải thích bằng lời.',
    l: ['contrastive', 'vit', 'llm'] },
  { g: 'gen', t: 'Sinh ảnh', en: 'Image Generation',
    task: 'Tạo ảnh từ mô tả, chỉnh sửa ảnh, inpainting, chuyển phong cách, sinh dữ liệu tổng hợp.',
    models: 'GAN, StyleGAN, Stable Diffusion, FLUX, Imagen, ControlNet, LoRA.',
    now: 'Diffusion và flow matching với kiến trúc Transformer (DiT) là chuẩn. Điều khiển chính xác (ControlNet, chỉnh sửa theo chỉ dẫn) và dữ liệu tổng hợp cho huấn luyện là hai hướng ứng dụng mạnh.',
    l: ['gan', 'ganvar', 'vae', 'diffwd', 'diffrev', 'diffadv'] },
  { g: 'gen', t: 'Sinh video & 3D', en: 'Video & 3D',
    task: 'Tạo video từ chữ/ảnh, kéo dài video, sinh cảnh 3D, tái dựng 3D từ ảnh.',
    models: 'Sora, Veo, Kling, Wan (mở); NeRF, 3D Gaussian Splatting.',
    now: 'Video dài hơn, nhất quán hơn, có âm thanh đồng bộ; nhiều mô hình mã nguồn mở chạy được trên GPU đơn lẻ. Mô hình video đang được dùng như “mô hình thế giới” để mô phỏng cho robot.',
    l: ['diffadv', 'vision3d', 'vit'] },
  { g: 'act', t: 'AI Agent', en: 'Agents',
    task: 'Tự thực hiện nhiều bước: tra cứu, chạy code, thao tác máy tính và trình duyệt, gọi API.',
    models: 'LLM + công cụ (function calling), giao thức kết nối công cụ như MCP, hệ đa agent.',
    now: 'Agent chuyển từ làm một tác vụ sang đảm nhận cả quy trình nhiều bước, với hệ đa agent chuyên trách lập kế hoạch, thực thi, kiểm tra. Năng lực thao tác máy tính tăng mạnh nhưng vẫn thất bại khoảng 1/3 tác vụ có cấu trúc; quản trị và an ninh cho agent trở thành mối quan tâm lớn.',
    l: ['llm', 'rag'] },
  { g: 'act', t: 'Học tăng cường', en: 'Reinforcement Learning',
    task: 'Ra quyết định tuần tự: chơi game, điều khiển, tối ưu lịch trình, căn chỉnh LLM.',
    models: 'DQN, PPO, AlphaGo/AlphaZero/MuZero, RLHF, DPO.',
    now: 'RL trở lại trung tâm nhờ huấn luyện mô hình suy luận và agent với phần thưởng kiểm chứng được (toán đúng/sai, code chạy qua test).',
    l: ['rl', 'llm'] },
  { g: 'act', t: 'Robot & AI vật lý', en: 'Robotics / Embodied AI',
    task: 'Cầm nắm, lắp ráp, di chuyển, robot hình người, kho bãi.',
    models: 'Mô hình thị giác–ngôn ngữ–hành động (VLA), mô hình thế giới (world models), học bắt chước.',
    now: 'Mô hình thế giới dự đoán hậu quả hành động trước khi làm, và sinh dữ liệu mô phỏng để huấn luyện robot (ví dụ họ Cosmos của NVIDIA). Trung Quốc dẫn đầu về số robot công nghiệp lắp đặt.',
    l: ['rl', 'search', 'hmm', 'diffadv'] },
  { g: 'act', t: 'Xe tự lái', en: 'Autonomous Driving',
    task: 'Nhận thức 3D (BEV, occupancy), dự đoán chuyển động, lập kế hoạch, điều khiển.',
    models: 'Mạng đa camera BEV, Transformer, mô hình lái đầu-cuối.',
    now: 'Dịch vụ taxi không người lái đã vận hành thương mại ở một số thành phố của Mỹ và Trung Quốc; xu hướng chuyển sang mô hình đầu-cuối và mô hình thế giới để mô phỏng tình huống hiếm.',
    l: ['detseg', 'vision3d', 'hmm', 'rl'] },
  { g: 'app', t: 'AI cho khoa học', en: 'AI for Science',
    task: 'Dự đoán cấu trúc protein, thiết kế thuốc và vật liệu, dự báo thời tiết, hỗ trợ nghiên cứu.',
    models: 'AlphaFold, GraphCast/GenCast, GNoME, các LLM “đồng nghiên cứu”.',
    now: 'AlphaFold được trao giải Nobel Hóa học 2024. Mô hình dự báo thời tiết học sâu cạnh tranh với mô hình vật lý truyền thống. Mô hình hàng đầu đạt hoặc vượt mức chuyên gia trên câu hỏi khoa học trình độ tiến sĩ.',
    l: ['gnn', 'transformer', 'diffadv'] },
  { g: 'app', t: 'Kiểm tra công nghiệp & sản xuất', en: 'Industrial AI',
    task: 'Phát hiện lỗi ngoại quan (AOI), bảo trì dự đoán, tối ưu quy trình, kiểm soát chất lượng thống kê.',
    models: 'CNN/YOLO, U-Net, PatchCore, PaDiM, EfficientAD, sinh dữ liệu lỗi bằng GAN/Diffusion.',
    now: 'Phát hiện bất thường không giám sát và dữ liệu tổng hợp bù cho việc thiếu ảnh lỗi; mô hình đa phương thức bắt đầu được dùng để giải thích lỗi bằng ngôn ngữ cho kỹ sư.',
    l: ['yolo', 'evaluation', 'xai', 'anomaly', 'cap9'] },
  { g: 'app', t: 'Gợi ý & quảng cáo', en: 'Recommender Systems',
    task: 'Đề xuất sản phẩm, video, tin tức; xếp hạng kết quả tìm kiếm.',
    models: 'Mô hình hai tháp (two-tower), embedding, Transformer theo chuỗi hành vi.',
    now: 'Là ứng dụng AI mang lại doanh thu lớn nhất hiện nay; đang chuyển sang mô hình sinh để đề xuất.',
    l: ['embed', 'knn', 'contrastive', 'pca'] },
  { g: 'app', t: 'Dữ liệu bảng & chuỗi thời gian', en: 'Tabular & Time Series',
    task: 'Dự báo nhu cầu, phát hiện gian lận, chấm điểm tín dụng, dự báo hỏng hóc thiết bị.',
    models: 'XGBoost, LightGBM, LSTM, Transformer chuỗi thời gian, mô hình nền tảng chuỗi thời gian.',
    now: 'Cây quyết định tăng cường (gradient boosting) vẫn rất mạnh với dữ liệu bảng; mô hình nền tảng cho chuỗi thời gian cho phép dự báo không cần huấn luyện riêng.',
    l: ['tree', 'ensemble', 'lstm', 'cap4'] },
  { g: 'app', t: 'Học trên đồ thị', en: 'Graph Learning',
    task: 'Phân tử, mạng xã hội, giao thông, phát hiện gian lận, thiết kế chip.',
    models: 'GCN, GAT, GraphSAGE, Graph Transformer.',
    now: 'Mạnh trong khoa học (phân tử, vật liệu, thời tiết) và chống gian lận.',
    l: ['gnn'] },
  { g: 'base', t: 'AI hiệu quả & trên thiết bị', en: 'Efficient / Edge AI',
    task: 'Chạy mô hình trên điện thoại, máy công nghiệp, camera; giảm chi phí suy luận.',
    models: 'Lượng tử hóa INT8/4-bit, chưng cất tri thức, tỉa, MoE, Mamba, mô hình nhỏ chuyên biệt.',
    now: 'Mô hình nhỏ được chưng cất từ mô hình lớn chạy được trên laptop và điện thoại; chi phí suy luận trên mỗi đơn vị năng lực giảm nhanh.',
    l: ['deploy', 'efficient', 'lora', 'moe'] },
  { g: 'base', t: 'Hạ tầng & phần cứng', en: 'Compute & Infrastructure',
    task: 'GPU/TPU, trung tâm dữ liệu, huấn luyện phân tán, năng lượng.',
    models: 'NVIDIA GPU, TPU, chip chuyên dụng; FlashAttention, song song dữ liệu/mô hình.',
    now: 'Mỹ có số trung tâm dữ liệu AI nhiều gấp hơn 10 lần bất kỳ nước nào; gần như mọi chip AI hàng đầu đều do TSMC (Đài Loan) sản xuất. Năng lượng là ràng buộc lớn.',
    l: ['mha', 'transformer'] },
  { g: 'base', t: 'An toàn, căn chỉnh & quản trị', en: 'Safety, Alignment & Governance',
    task: 'Làm mô hình trung thực, hữu ích, vô hại; diễn giải mô hình; đánh giá rủi ro; luật và tiêu chuẩn.',
    models: 'RLHF, Constitutional AI, red-teaming, interpretability (diễn giải cơ chế), bộ đánh giá năng lực nguy hiểm.',
    now: 'Số sự cố AI được ghi nhận tăng (233 năm 2024 lên 362 năm 2025); báo cáo về an toàn vẫn thưa thớt so với báo cáo năng lực. Đạo luật AI của EU áp dụng dần theo lộ trình.',
    l: ['ethics', 'xai', 'rl'] },
];
const TIMELINE = [
  ['1950', 'Turing đề xuất “phép thử Turing”.'], ['1956', 'Hội thảo Dartmouth đặt tên “Trí tuệ nhân tạo”.'], ['1958', 'Perceptron của Rosenblatt.'],
  ['1969', 'Minsky & Papert chỉ ra giới hạn perceptron; mùa đông AI.'], ['1986', 'Lan truyền ngược được phổ biến rộng rãi.'], ['1989–98', 'CNN đọc chữ số (LeNet).'],
  ['1997', 'LSTM; Deep Blue thắng Kasparov.'], ['2012', 'AlexNet thắng ImageNet: bùng nổ học sâu.'], ['2014', 'GAN; seq2seq và attention cho dịch máy.'],
  ['2015', 'ResNet; U-Net.'], ['2016', 'AlphaGo thắng Lee Sedol.'], ['2017', 'Transformer: “Attention Is All You Need”.'],
  ['2018', 'BERT, GPT: tiền huấn luyện trên văn bản lớn.'], ['2020', 'GPT-3, ViT, DDPM; AlphaFold 2 giải bài toán gấp protein.'], ['2021', 'CLIP, DALL·E.'],
  ['2022', 'Stable Diffusion, ChatGPT.'], ['2023', 'GPT-4, Llama mở trọng số, SAM.'], ['2024', 'Mô hình sinh video; Nobel Vật lý (Hopfield, Hinton) và Hóa học (Hassabis, Jumper, Baker) cho AI.'],
  ['2025', 'Mô hình suy luận (DeepSeek-R1…), agent viết code và thao tác máy tính.'], ['2026', 'Agent đảm nhận quy trình nhiều bước; mô hình thế giới cho robot; điểm lập trình tiến gần mức bão hòa trên SWE-bench Verified.'],
];
const PATHS = [
  ['Nghiên cứu thị giác máy tính / kiểm tra công nghiệp', ['p0', 'pml', 'p1', 'p2', 'p4', 'p5', 'pprac'], 'evaluation, detseg, vit, vitfam, diffadv, anomaly, xai'],
  ['Kỹ sư LLM / ứng dụng AI tạo sinh', ['p0', 'p1', 'p3', 'p4', 'p6'], 'transformer, llm, lora, rag'],
  ['Mô hình sinh & dữ liệu tổng hợp', ['p0', 'p1', 'p2', 'p5'], 'vae, gan, diffwd, diffrev, diffadv'],
  ['Robot & ra quyết định', ['p0', 'p1', 'p2', 'p4', 'p6'], 'rl, vit, diffadv'],
  ['Khoa học dữ liệu công nghiệp (IE/IEEM)', ['p0', 'pml', 'psym', 'pprac'], 'evaluation, ensemble, bayesnet, hmm, evo, planning, deploy'],
  ['Hiểu toàn cảnh mọi trường phái AI', ['p0', 'pml', 'p1', 'psym'], 'aitypes, tree, nbayes, knn, search, logic, evo'],
];

function taxonomySVG() {
  const W = 640, H = 300;
  const box = (x, y, w, h, c, bg, t, s) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${bg}" stroke="${c}" stroke-width="1.6"/><text x="${x + 14}" y="${y + 24}" font-size="15" font-weight="700" fill="var(--ink)" font-family="var(--f-body)">${t}</text><text x="${x + 14}" y="${y + 42}" font-size="12" fill="var(--muted)" font-family="var(--f-body)">${s}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px" role="img" aria-label="AI chứa học máy, học máy chứa học sâu, học sâu chứa mô hình nền tảng">
  ${box(4, 4, 632, 292, 'var(--line)', 'var(--sheet)', 'Trí tuệ nhân tạo (AI)', 'Mọi kỹ thuật làm máy hành xử thông minh: luật, tìm kiếm, logic, học máy…')}
  ${box(40, 58, 560, 226, 'var(--muted)', 'var(--paper)', 'Học máy (Machine Learning)', 'Tự học quy luật từ dữ liệu: hồi quy, cây quyết định, SVM, k-NN, mạng nơ-ron…')}
  ${box(76, 112, 488, 160, 'var(--pen)', 'var(--pen-soft)', 'Học sâu (Deep Learning)', 'Mạng nơ-ron nhiều lớp: MLP, CNN, RNN, Transformer, GAN, Diffusion…')}
  ${box(112, 166, 416, 94, 'var(--red)', 'var(--red-soft)', 'Mô hình nền tảng (Foundation Models)', 'Huấn luyện một lần trên dữ liệu cực lớn, dùng cho nhiều việc:')}
  <text x="126" y="244" font-size="13" fill="var(--red)" font-family="var(--f-hand)" style="font-size:17px">LLM · VLM · Diffusion · mô hình thị giác nền tảng · mô hình thế giới</text></svg>`;
}

function renderMap() {
  const link = id => byId[id] ? `<a href="#${id}">${byId[id].code} ${byId[id].t}</a>` : '';
  let h = `<div class="eyebrow">Toàn cảnh</div><h1>Bản đồ AI thế giới</h1>
  <p class="lead">Các lĩnh vực chính của AI hiện nay, bài toán, mô hình tiêu biểu, tình hình mới nhất và bài nào trong khóa học là nền tảng cho từng lĩnh vực. Cập nhật tháng 10/2026.</p>
  <p class="prose">Muốn hiểu các cách phân loại AI (năng lực, chức năng, trường phái, đầu ra), xem bài <a href="#aitypes">0.1 Các thể loại AI</a>.</p>
  <h2>AI, học máy, học sâu khác nhau thế nào</h2>
  <div class="diag" style="padding:14px">${taxonomySVG()}</div>
  <div class="tbl-wrap"><table class="tbl"><tr><th>Cách học</th><th>Dữ liệu cần</th><th>Ví dụ</th><th>Bài liên quan</th></tr>
  <tr><td>Có giám sát</td><td>Đầu vào + nhãn</td><td>Phân loại lỗi bo mạch, dự báo giá</td><td>${link('mlbasics')}, ${link('detseg')}</td></tr>
  <tr><td>Không giám sát</td><td>Chỉ đầu vào</td><td>Phân cụm, phát hiện bất thường</td><td>${link('ae')}, ${link('anomaly')}</td></tr>
  <tr><td>Tự giám sát</td><td>Dữ liệu thô, tự tạo nhãn</td><td>GPT đoán token, MAE che mảnh, CLIP ghép cặp</td><td>${link('llm')}, ${link('vitfam')}, ${link('contrastive')}</td></tr>
  <tr><td>Tăng cường</td><td>Môi trường + phần thưởng</td><td>AlphaGo, robot, RLHF</td><td>${link('rl')}</td></tr></table></div>
  <h2>Một số con số năm 2026</h2>
  <div class="stats" style="grid-template-columns:repeat(4,minmax(0,1fr))"><div><b>~60→~100%</b><span>điểm SWE-bench Verified (lập trình) trong một năm</span></div><div><b>12→66%</b><span>tỷ lệ hoàn thành tác vụ máy tính (OSWorld) của agent</span></div><div><b>88%</b><span>tổ chức đã dùng AI năm 2025</span></div><div><b>233→362</b><span>sự cố AI được ghi nhận, 2024→2025</span></div></div>
  <p class="note-s">Theo tóm tắt Báo cáo AI Index 2026 của Stanford HAI. Cùng nguồn: đầu tư tư nhân vào AI tại Mỹ năm 2025 khoảng 285,9 tỷ USD, gấp hơn 23 lần Trung Quốc (12,4 tỷ USD); Trung Quốc dẫn đầu về số công bố, trích dẫn và robot công nghiệp lắp đặt.</p>
  <h2>18 lĩnh vực, 6 nhóm</h2>`;
  FIELD_GROUPS.forEach(gr => {
    h += `<h3>${gr.t} <small style="font-weight:400;color:var(--muted);font-size:14px">· ${gr.d}</small></h3><div class="fields">`;
    FIELDS.filter(f => f.g === gr.id).forEach(f => {
      h += `<div class="field"><div class="field-h"><b>${f.t}</b><span>${f.en}</span></div>
        <dl><dt>Bài toán</dt><dd>${f.task}</dd><dt>Mô hình tiêu biểu</dt><dd>${f.models}</dd><dt>Hiện nay</dt><dd>${f.now}</dd></dl>
        <div class="lchips">${f.l.filter(id => byId[id]).map(id => `<a href="#${id}">${byId[id].code} ${byId[id].t}</a>`).join('')}</div></div>`;
    });
    h += '</div>';
  });
  h += `<h2>Dòng thời gian</h2><div class="tl">${TIMELINE.map(([y, t]) => `<div class="tl-i"><span class="hand">${y}</span><p>${t}</p></div>`).join('')}</div>
  <h2>Chọn hướng đi sau nền tảng</h2>
  <div class="tbl-wrap"><table class="tbl"><tr><th>Mục tiêu</th><th>Giai đoạn cần học kỹ</th><th>Bài trọng tâm</th></tr>
  ${PATHS.map(([t, ps, ls]) => `<tr><td>${t}</td><td>${ps.map(p => phaseOf(p).n).join(' → ')}</td><td>${ls.split(', ').map(link).join('<br>')}</td></tr>`).join('')}</table></div>
  <h3>Nguồn</h3><ul class="papers">
  <li><a href="https://hai.stanford.edu/news/inside-the-ai-index-12-takeaways-from-the-2026-report" target="_blank" rel="noopener">Stanford HAI — Inside the AI Index: 12 takeaways from the 2026 report</a></li>
  <li><a href="https://starkinsider.com/2026/04/stanford-2026-ai-index-report.html" target="_blank" rel="noopener">Stark Insider — tóm tắt số liệu Stanford AI Index 2026</a></li>
  <li><a href="https://www.analyticsvidhya.com/blog/2026/01/ai-agents-trends/" target="_blank" rel="noopener">Analytics Vidhya — AI agent trends 2026</a></li>
  <li><a href="https://metavert.io/world-models-for-robotics" target="_blank" rel="noopener">Metavert — World models for robotics</a></li></ul>`;
  $('#page').innerHTML = h;
  typeset();
}
