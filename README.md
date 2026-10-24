# AI Bằng Tay: học AI bằng bút và giấy

Khóa tự học AI bằng tiếng Việt, theo tinh thần *AI by Hand* của Prof. Tom Yeh: hiểu mô hình bằng cách **tự tính từng con số**, không chỉ đọc công thức.

**Học ngay:** https://balotwvn.github.io/BALO_AI_BY_HAND_COURSE/

| | |
|---|---|
| 78 bài học | Từ vector, đạo hàm, xác suất đến CNN, ViT, YOLO, GAN, Diffusion, LLM, MoE, Mamba, RL, AI biểu tượng |
| 10 giai đoạn, 27 tuần | Mỗi chương kết thúc bằng một bài tập tổng hợp |
| 77 trang tính bấm từng số | Mỗi lần bấm hiện ra một con số, ô đang tính tô đỏ, ô được dùng tô xanh |
| Sơ đồ mô hình động | Có cho cả 78 bài; dữ liệu chạy dọc mũi tên, từng khối sáng theo lời giải thích |
| 7 minh họa tương tác | CNN và ViT nhìn ảnh chó/mèo/husky và chỉ ra chỗ sai, attention, chuỗi thời gian, YOLO, diffusion, CLIP |
| Video từng bài | Lồng tiếng tiếng Việt bằng mô hình TTS, có phụ đề |
| Chức năng · Sức mạnh · Nhược điểm | Cho từng bài, kèm các mô hình nổi tiếng hiện nay dùng ý tưởng đó |
| Thư viện 41 mô hình | GPT, Claude, Gemini, Llama, DeepSeek, Qwen, CLIP, SigLIP 2, DINOv3, YOLO26, RT-DETR, SAM 3, FLUX, Whisper, Chronos… |
| Xưởng lắp ráp mô hình | Ghép CNN, ViT, YOLO, LLM, bộ mã hóa chữ như Lego: lắp X với Y ra mô hình gì, lắp sai thì hỏng ở khớp nào |
| Hướng dẫn đọc paper | Mỗi bài có bài báo gốc nên đọc, đọc phần nào trước, câu hỏi khi đọc |

## Cấu trúc dự án

```
src/                      mã nguồn (mỗi file một phần nội dung hoặc một công cụ)
  shell.html              khung trang và toàn bộ CSS
  d*.js, e*.js, f*.js     nội dung bài học, bài tập, ưu/nhược điểm, thư viện mô hình
  stepper.js, sw_defs*.js trang tính bấm từng số
  flow.js, flow_specs.js  sơ đồ mô hình động
  ill.js, art.js          minh họa tương tác (ảnh chó/mèo vẽ bằng code)
  video.js                trình phát video bài học
  speech_vi.js            chuẩn hóa lời đọc: thuật ngữ tiếng Anh, chữ viết tắt, ký hiệu toán
  f8_kit.js, kit_ui.js    Xưởng lắp ráp mô hình
  app.js                  điều hướng, mục lục, trang chủ (nạp cuối cùng)
build.py                  ghép src/ thành index.html
tools/export_narration.js xuất kịch bản lồng tiếng của mọi bài
tools/tts/build_audio.py  tạo file lồng tiếng bằng mô hình TTS
.github/workflows/        tự dựng trang, tạo lồng tiếng và đăng GitHub Pages sau mỗi lần đẩy code
index.html                bản đã ghép, mở trực tiếp được khi không có mạng (không có lồng tiếng)
```

## Chạy trên máy

```bash
python build.py            # tạo index.html, mở bằng trình duyệt là học được
```

Muốn có cả lồng tiếng khi chạy trên máy:

```bash
npm install
node tools/export_narration.js
pip install -r tools/tts/requirements.txt
python tools/tts/build_audio.py
mkdir -p site && cp index.html site/ && python -m http.server -d site 8000
# mở http://localhost:8000
```

## Lồng tiếng

Video không dùng giọng đọc của trình duyệt nữa. Mỗi câu thuyết minh được tạo sẵn thành một file MP3 bằng mô hình chuyển chữ thành giọng nói (TTS), nên phụ đề, sơ đồ động và danh sách vẫn chạy khớp theo từng câu.

Trước khi đưa vào mô hình, mỗi câu đi qua `speakVi()` trong `src/speech_vi.js`:

| Chữ gốc (phụ đề) | Lời đọc |
|---|---|
| ViT cắt ảnh thành ô 16×16, thêm token CLS → 197 token × 768. | vít cắt ảnh thành ô 16 nhân 16, thêm tô ken xi eo ét, ra 197 tô ken nhân 768. |
| YOLOv12 và RT-DETR: Q, K, V | dô lô vê 12 và a ti đi tơ: kiu, kây, vi |
| softmax(QKᵀ/√d) | sóp mác, kiu kây chuyển vị chia căn d |

Thấy từ nào đọc chưa hay? Thêm một dòng vào `SPEAK_WORDS` trong `src/speech_vi.js` rồi đẩy lên. Chỉ những câu bị thay đổi mới phải tạo lại giọng đọc.

**Chọn bộ máy và giọng đọc:** GitHub → Settings → Secrets and variables → Actions → *Variables*:

| Biến | Giá trị | Ghi chú |
|---|---|---|
| `TTS_ENGINE` | `edge` (mặc định) | Giọng nơ-ron Microsoft Edge, miễn phí, chất lượng tốt. Dịch vụ không chính thức nên có thể ngừng hoạt động. |
| | `google` | Google Cloud Text-to-Speech, trả phí theo ký tự (có hạn mức miễn phí hằng tháng). Cần thêm *Secret* `GOOGLE_TTS_API_KEY`. |
| | `none` | Không lồng tiếng, video dùng giọng trình duyệt. |
| `TTS_VOICE` | `vi-VN-HoaiMyNeural` (nữ), `vi-VN-NamMinhNeural` (nam) | Cho `edge` |
| | `vi-VN-Neural2-A` (nữ), `vi-VN-Neural2-D` (nam) | Cho `google` |
| `TTS_RATE` | `+0%`, `-5%`, `+10%` (edge) · `1.0`, `0.95` (google) | Tốc độ đọc |

Đổi biến xong, vào tab **Actions → Xây dựng và đăng trang → Run workflow** để tạo lại.

## Đăng lên GitHub Pages

1. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
2. Mỗi lần đẩy code lên nhánh `main`, workflow sẽ dựng `index.html`, kiểm tra cú pháp, xuất kịch bản, tạo lồng tiếng (có bộ nhớ đệm) rồi đăng trang.

## Đóng góp

Sửa nội dung trong `src/`, chạy `python build.py`, mở `index.html` để kiểm tra, rồi tạo pull request. Số liệu trong ví dụ và trang tính đều tự đặt, không chép từ tài liệu của Prof. Tom Yeh.

## Ghi công

- Phương pháp *AI by Hand* của Prof. Tom Yeh (University of Colorado Boulder). Dự án này là tài liệu tự học độc lập bằng tiếng Việt, không liên kết chính thức với tác giả.
- Công thức toán hiển thị bằng [MathJax](https://www.mathjax.org/), phông chữ Be Vietnam Pro và Patrick Hand từ Google Fonts.
