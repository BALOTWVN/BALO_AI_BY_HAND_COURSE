"""Ghép mã nguồn trong src/ thành một trang web duy nhất.

Chạy:  python build.py
Ra:    index.html            trang đầy đủ (mở trực tiếp bằng trình duyệt hoặc đăng GitHub Pages)
       dist/ai-bang-tay.html bản rút gọn không có <!doctype>/<head> (dùng cho Claude Artifact)
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / 'src'
DIST = ROOT / 'dist'

# Thứ tự nạp quan trọng: dữ liệu → công cụ vẽ → giao diện → app.js (khởi động) cuối cùng.
ORDER = [
    'd0_phases.js', 'art.js', 'reads.js',
    'd1_math_nn.js', 'd2_cnn_seq.js', 'd3_transformer.js', 'd4_gen_modern.js',
    'e0_math.js', 'e1_nn.js', 'e2_cnn.js', 'e3_tf.js', 'e4_gen.js', 'e5_new.js',
    'f1_overview.js', 'f2_classic.js', 'f3_symbolic.js', 'f4_practice.js', 'f5_caps.js',
    'f6_pros.js', 'f7_models.js', 'f8_kit.js', 'f9_guide.js',
    'widgets1.js', 'widgets2.js', 'widgets3.js', 'widgets4.js', 'widgets5.js', 'widgets6.js',
    'stepper.js', 'sw_defs.js', 'sw_defs2.js', 'sw_long.js', 'ill.js', 'flow.js', 'flow_specs.js',
    'speech_vi.js', 'video.js', 'kit_ui.js', 'map.js', 'app.js',
]

MATHJAX = """<script>
window.MathJax = { tex: { inlineMath: [['$', '$']], displayMath: [['$$', '$$']] }, svg: { fontCache: 'global' },
  options: { enableMenu: false, menuOptions: { settings: { assistiveMml: false } } },
  startup: { typeset: false, pageReady() { return MathJax.startup.defaultPageReady().then(() => { if (window.__pendingTypeset && window.typeset) typeset(); }); } } };
</script>
<script async src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js"></script>
"""

HEAD = """<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Khóa tự học AI tiếng Việt theo phương pháp AI by Hand: 78 bài từ toán nền tảng đến CNN, ViT, YOLO, Diffusion, LLM, có trang tính bấm từng số, sơ đồ động, video lồng tiếng và Xưởng lắp ráp mô hình.">
<meta property="og:title" content="AI Bằng Tay: học AI bằng bút và giấy">
<meta property="og:description" content="78 bài tự học AI tiếng Việt, tính tay từng con số, sơ đồ động, video lồng tiếng, Xưởng lắp ráp mô hình.">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232F4FD8'/%3E%3Ctext x='32' y='43' font-size='30' text-anchor='middle' fill='white' font-family='Arial' font-weight='700'%3EAI%3C/text%3E%3C/svg%3E">
"""


def main() -> None:
    missing = [f for f in ORDER if not (SRC / f).exists()]
    if missing:
        raise SystemExit(f'Thiếu file trong src/: {missing}')
    extra = sorted(p.name for p in SRC.glob('*.js') if p.name not in ORDER)
    if extra:
        print('Cảnh báo: các file sau trong src/ không được ghép:', extra)
    js = '\n'.join((SRC / f).read_text(encoding='utf-8') for f in ORDER)
    shell = (SRC / 'shell.html').read_text(encoding='utf-8')
    body = shell + MATHJAX + '<script>\n' + js + '\n</script>\n'
    (ROOT / 'index.html').write_text(HEAD + body, encoding='utf-8')
    DIST.mkdir(exist_ok=True)
    (DIST / 'ai-bang-tay.html').write_text(body, encoding='utf-8')
    print(f'index.html: {len(HEAD + body) / 1024:.0f} KB, {len(ORDER)} file JS')


if __name__ == '__main__':
    main()
