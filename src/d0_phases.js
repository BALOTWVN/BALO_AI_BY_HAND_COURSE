const R = String.raw;

const PHASES = [
  { id: 'p0', n: 0, t: 'Nền tảng Toán', en: 'Math Foundations', weeks: '2 tuần',
    d: 'Vector, ma trận, đạo hàm, xác suất. Mọi mô hình phía sau chỉ là tổ hợp của bốn thứ này.',
    out: 'Tự nhân ma trận, tính gradient bằng quy tắc chuỗi, tính softmax và cross-entropy trên giấy.' },
  { id: 'p1', n: 1, t: 'Mạng Nơ-ron', en: 'Neural Networks', weeks: '3 tuần',
    d: 'Từ một nơ-ron đến MLP: lan truyền thuận, hàm mất mát, lan truyền ngược, tối ưu hóa, chuẩn hóa.',
    out: 'Tự tay chạy một vòng huấn luyện (forward → loss → backward → cập nhật) cho mạng nhỏ.' },
  { id: 'p2', n: 2, t: 'Mạng Tích chập (CNN)', en: 'Convolutional Networks', weeks: '3 tuần',
    d: 'Tích chập, pooling, trường tiếp nhận, ResNet, mạng hiệu quả, phát hiện và phân đoạn đối tượng.',
    out: 'Tính kích thước, số tham số và đầu ra của bất kỳ lớp conv nào; đọc hiểu ResNet, U-Net, YOLO.' },
  { id: 'p3', n: 3, t: 'Chuỗi & Embedding', en: 'Sequences', weeks: '1 tuần',
    d: 'Token, embedding, RNN, LSTM. Bước đệm để hiểu vì sao attention ra đời.',
    out: 'Giải thích được vấn đề tiêu biến gradient theo thời gian và cách cổng LSTM xử lý nó.' },
  { id: 'p4', n: 4, t: 'Attention & Transformer', en: 'Attention & Transformers', weeks: '3 tuần',
    d: 'Self-attention, multi-head, mã hóa vị trí, khối Transformer, Vision Transformer và họ hàng.',
    out: 'Tính tay toàn bộ một lớp self-attention; giải thích ViT biến ảnh thành chuỗi token như thế nào.' },
  { id: 'p5', n: 5, t: 'Mô hình Sinh', en: 'Generative Models', weeks: '4 tuần',
    d: 'Autoencoder, VAE, GAN và các biến thể, Diffusion từ DDPM đến Latent Diffusion, DiT, Flow Matching.',
    out: 'Viết ra hàm mất mát của VAE, GAN, Diffusion và tính tay một bước khử nhiễu.' },
  { id: 'p6', n: 6, t: 'Mô hình Hiện đại', en: 'Modern Models', weeks: '2 tuần',
    d: 'Học tương phản và CLIP, LLM, LoRA, Mixture-of-Experts, Mamba, và ứng dụng phát hiện lỗi công nghiệp.',
    out: 'Đọc được paper mới và định vị nó trên bản đồ: thành phần nào cũ, thành phần nào mới.' },
];

const LESSONS = [];
function L(o) { LESSONS.push(o); }
