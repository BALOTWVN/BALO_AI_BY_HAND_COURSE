/* ===== Trang tính: tổng quan, đánh giá, học máy cổ điển ===== */
WT.aiclass = 'Đặt một hệ thống lên bản đồ phân loại';
W.aiclass = el => {
  const SYS = {
    'ChatGPT / Claude / Gemini': ['AI hẹp', 'Bộ nhớ hạn chế', 'Kết nối (Transformer) + RL', 'Sinh', 'Tự giám sát + tăng cường'],
    'AlphaGo': ['AI hẹp', 'Bộ nhớ hạn chế', 'Lai: tìm kiếm MCTS (biểu tượng) + mạng nơ-ron', 'Ra quyết định', 'Có giám sát + tăng cường'],
    'Deep Blue (cờ vua 1997)': ['AI hẹp', 'Máy phản xạ', 'Biểu tượng: minimax + alpha–beta + hàm đánh giá viết tay', 'Ra quyết định', 'Không học'],
    'Bộ lọc thư rác Naive Bayes': ['AI hẹp', 'Bộ nhớ hạn chế', 'Bayes', 'Phân biệt', 'Có giám sát'],
    'Hệ chuyên gia chẩn đoán (MYCIN)': ['AI hẹp', 'Máy phản xạ', 'Biểu tượng: luật nếu–thì', 'Phân biệt', 'Không học (luật do chuyên gia viết)'],
    'Máy AOI dùng YOLO': ['AI hẹp', 'Bộ nhớ hạn chế', 'Kết nối (CNN)', 'Phân biệt (phát hiện)', 'Có giám sát'],
    'PatchCore phát hiện bất thường': ['AI hẹp', 'Bộ nhớ hạn chế', 'Lai: kết nối (đặc trưng CNN) + loại suy (k-NN)', 'Phân biệt (điểm bất thường)', 'Không giám sát'],
    'Stable Diffusion': ['AI hẹp', 'Bộ nhớ hạn chế', 'Kết nối (U-Net/DiT + diffusion)', 'Sinh', 'Có giám sát yếu (cặp ảnh–chú thích)'],
    'Google Maps tìm đường': ['AI hẹp', 'Bộ nhớ hạn chế', 'Lai: tìm kiếm A* (biểu tượng) + học máy dự báo giao thông', 'Ra quyết định', 'Có giám sát (phần dự báo)'],
    'Lập lịch bằng giải thuật di truyền': ['AI hẹp', 'Máy phản xạ', 'Tiến hóa', 'Tối ưu', 'Không học từ dữ liệu'],
  };
  const axes = ['Năng lực', 'Chức năng', 'Phương pháp / trường phái', 'Kiểu đầu ra', 'Cách học'];
  el.innerHTML = `<div class="ctl"><label>Hệ thống <select id="sy">${Object.keys(SYS).map(k => `<option>${k}</option>`).join('')}</select></label></div><div class="scroll-x"><table class="steps" id="tb"></table></div><p class="note-s">Thử tự phân loại trên giấy trước khi chọn hệ thống để xem đáp án.</p>`;
  const upd = () => { const v = SYS[$('#sy', el).value]; $('#tb', el).innerHTML = axes.map((a, i) => `<tr><th>${a}</th><td class="v" style="white-space:normal">${v[i]}</td></tr>`).join(''); };
  $('#sy', el).onchange = upd; upd();
};

WT.roc = 'Ngưỡng, ma trận nhầm lẫn và đường ROC';
W.roc = el => {
  const st = { sep: 1.8, th: 0.5 };
  el.innerHTML = `<div class="ctl">${slider('độ tách lớp', 0, 4, 0.1, st.sep, 'sep')}${slider('ngưỡng τ', 0, 1, 0.01, st.th, 'th')}</div>
  <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start"><div id="cv" style="flex:1;min-width:260px"></div><div id="cv2" style="width:min(100%,260px)"></div></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 420, 220), P2 = mkCanvas($('#cv2', el), 260, 260);
  const g = gaussRng(17); const ok0 = Array.from({ length: 300 }, () => g()), ng0 = Array.from({ length: 60 }, () => g());
  const upd = () => {
    const toS = z => sig(z); const ok = ok0.map(z => toS(z - st.sep / 2)), ng = ng0.map(z => toS(z + st.sep / 2));
    const F = plotFrame(P, [0, 1], [0, 1], { xl: 'điểm NG' });
    const hist = (arr, col) => { const b = new Array(20).fill(0); arr.forEach(v => b[Math.min(19, Math.floor(v * 20))]++); const mx = arr.length / 6; b.forEach((c, i) => { P.g.fillStyle = col; P.g.globalAlpha = 0.45; P.g.fillRect(F.X(i / 20), F.Y(Math.min(1, c / mx)), F.X(0.05) - F.X(0) - 1, F.Y(0) - F.Y(Math.min(1, c / mx))); }); P.g.globalAlpha = 1; };
    hist(ok, cssv('pen')); hist(ng, cssv('red'));
    P.g.strokeStyle = cssv('ink'); P.g.lineWidth = 2; P.g.beginPath(); P.g.moveTo(F.X(st.th), F.Y(0)); P.g.lineTo(F.X(st.th), F.Y(1)); P.g.stroke();
    const TP = ng.filter(v => v >= st.th).length, FN = ng.length - TP, FP = ok.filter(v => v >= st.th).length, TN = ok.length - FP;
    const pts = []; for (let t = 1.001; t >= -0.001; t -= 0.01) pts.push([ok.filter(v => v >= t).length / ok.length, ng.filter(v => v >= t).length / ng.length]);
    let auc = 0; for (let i = 1; i < pts.length; i++) auc += (pts[i][0] - pts[i - 1][0]) * (pts[i][1] + pts[i - 1][1]) / 2;
    const F2 = plotFrame(P2, [0, 1], [0, 1], { xl: 'FPR' }); curve(P2, F2, x => x, 0, 1, cssv('line'), 1.5, [4, 4]);
    P2.g.strokeStyle = cssv('pen'); P2.g.lineWidth = 2.2; P2.g.beginPath(); pts.forEach(([x, y], i) => i ? P2.g.lineTo(F2.X(x), F2.Y(y)) : P2.g.moveTo(F2.X(x), F2.Y(y))); P2.g.stroke();
    dot(P2, F2.X(FP / ok.length), F2.Y(TP / ng.length), cssv('red'), 6);
    const pr = TP / (TP + FP || 1), rc = TP / ng.length;
    $('#out', el).innerHTML = `<div class="scroll-x"><table class="tbl" style="margin:0 0 10px"><tr><th></th><th>Gọi NG</th><th>Gọi OK</th></tr><tr><th>Thật NG (${ng.length})</th><td>TP = <b>${TP}</b></td><td>FN = <b>${FN}</b></td></tr><tr><th>Thật OK (${ok.length})</th><td>FP = <b>${FP}</b></td><td>TN = <b>${TN}</b></td></tr></table></div>
      <div class="res-line"><span>Recall <b>${fmt(100 * rc, 1)}%</b></span><span>Precision <b>${fmt(100 * pr, 1)}%</b></span><span>F1 <b>${fmt(2 * pr * rc / (pr + rc || 1), 3)}</b></span><span>Accuracy <b>${fmt(100 * (TP + TN) / 360, 1)}%</b></span><span>AUC <b>${fmt(auc, 3)}</b></span></div>
      <div class="legend"><span><i style="background:var(--pen);height:8px"></i>bo tốt (300)</span><span><i style="background:var(--red);height:8px"></i>bo lỗi (60)</span><span>Vạch đen: ngưỡng; chấm đỏ trên ROC: điểm vận hành hiện tại</span></div>`;
  };
  bindSliders(el, st, upd); upd();
};

WT.knn = 'k-NN: bấm vào mặt phẳng để phân loại điểm mới';
W.knn = el => {
  const r = gaussRng(4); const pts = [];
  for (let i = 0; i < 18; i++) pts.push([2.5 + r() * 0.9, 2.5 + r() * 0.9, 0]);
  for (let i = 0; i < 14; i++) pts.push([5.5 + r() * 0.9, 5 + r() * 1.0, 1]);
  pts.push([4.2, 4.0, 1], [4.6, 3.6, 0]);
  const st = { k: 3 }; let q = [4.3, 4.2];
  el.innerHTML = `<div class="ctl">${slider('k', 1, 15, 2, st.k, 'k')}<span class="note-s" style="margin:0">Bấm lên hình để đặt điểm cần phân loại.</span></div><div id="cv" style="max-width:420px"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 420, 380);
  const upd = () => {
    const F = plotFrame(P, [0, 8], [0, 8]);
    const ds = pts.map((p, i) => ({ i, d: Math.hypot(p[0] - q[0], p[1] - q[1]) })).sort((a, b) => a.d - b.d).slice(0, st.k);
    ds.forEach(({ i }) => { P.g.strokeStyle = cssv('muted'); P.g.lineWidth = 1; P.g.beginPath(); P.g.moveTo(F.X(q[0]), F.Y(q[1])); P.g.lineTo(F.X(pts[i][0]), F.Y(pts[i][1])); P.g.stroke(); });
    pts.forEach(p => dot(P, F.X(p[0]), F.Y(p[1]), p[2] ? cssv('red') : cssv('pen'), 5));
    const v1 = ds.filter(({ i }) => pts[i][2]).length, lab = v1 > st.k / 2 ? 1 : 0;
    P.g.strokeStyle = cssv('ink'); P.g.lineWidth = 2.5; P.g.beginPath(); P.g.arc(F.X(q[0]), F.Y(q[1]), 8, 0, 7); P.g.stroke();
    $('#out', el).innerHTML = `<span class="hand">${st.k} láng giềng gần nhất: ${v1} NG, ${st.k - v1} OK → </span><span class="r">${lab ? 'NG' : 'OK'}</span><div class="note-s">Khoảng cách: ${ds.map(d => fmt(d.d, 2)).join(', ')}. Đặt điểm ở vùng giữa hai cụm rồi đổi k để thấy kết quả lật.</div><div class="legend"><span><i style="background:var(--pen);height:8px"></i>OK</span><span><i style="background:var(--red);height:8px"></i>NG</span></div>`;
    P._F = F;
  };
  P.c.onclick = e => { const b = P.c.getBoundingClientRect(); const x = (e.clientX - b.left) / b.width * 420, y = (e.clientY - b.top) / b.height * 380; q = [(x - 44) / (420 - 58) * 8, (380 - 30 - y) / (380 - 44) * 8]; upd(); };
  bindSliders(el, st, upd, { k: v => v }); upd();
};

WT.svm = 'Đường phân tách, lề và hinge loss';
W.svm = el => {
  const data = [[3, 2, 1], [2, 1.5, 1], [3.5, 3, 1], [4, 1.5, 1], [1, 1, -1], [2, 2.2, -1], [0.5, 2, -1], [1.2, 0.3, -1]];
  const st = { ang: 45, b: -3.2, n: 1 };
  el.innerHTML = `<div class="ctl">${slider('góc của w (độ)', 0, 180, 1, st.ang, 'ang')}${slider('độ lớn ‖w‖', 0.3, 3, 0.05, st.n, 'n')}${slider('b', -8, 2, 0.05, st.b, 'b')}</div><div id="cv" style="max-width:420px"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 420, 380);
  const upd = () => {
    const w = [st.n * Math.cos(st.ang * Math.PI / 180), st.n * Math.sin(st.ang * Math.PI / 180)];
    const F = plotFrame(P, [0, 5], [-0.5, 4]);
    const line = (c, col, dash) => { if (Math.abs(w[1]) < 1e-6) return; curve(P, F, x => (c - st.b - w[0] * x) / w[1], 0, 5, col, 2, dash); };
    line(0, cssv('ink'), []); line(1, cssv('muted'), [5, 4]); line(-1, cssv('muted'), [5, 4]);
    let hinge = 0; const rows = data.map(([x, y, l]) => { const f = w[0] * x + w[1] * y + st.b; const h = Math.max(0, 1 - l * f); hinge += h; dot(P, F.X(x), F.Y(y), l > 0 ? cssv('red') : cssv('pen'), h > 0 ? 7 : 5); if (h > 0) { P.g.strokeStyle = cssv('ink'); P.g.lineWidth = 1.5; P.g.beginPath(); P.g.arc(F.X(x), F.Y(y), 10, 0, 7); P.g.stroke(); } return h; });
    const obj = 0.5 * st.n * st.n + hinge;
    $('#out', el).innerHTML = `<span class="hand">w = [${fmt(w[0], 2)}, ${fmt(w[1], 2)}], b = ${fmt(st.b, 2)}</span><br><span class="hand">Tổng hinge = ${rows.map(h => fmt(h, 2)).join(' + ')} = ${fmt(hinge, 2)}; ½‖w‖² = ${fmt(0.5 * st.n * st.n, 2)}; mục tiêu = </span><span class="r">${fmt(obj, 2)}</span>
      <div class="note-s">Độ rộng lề = 2/‖w‖ = ${fmt(2 / st.n, 2)}. Điểm có vòng tròn đang vi phạm lề (hinge &gt; 0). Giảm ‖w‖ thì lề rộng ra nhưng nhiều điểm vi phạm hơn: đó là sự đánh đổi mà C điều chỉnh.</div>`;
  };
  bindSliders(el, st, upd); upd();
};

WT.tree = 'Tìm ngưỡng tách tốt nhất bằng Gini';
W.tree = el => {
  const data = [[45, 1], [52, 1], [58, 1], [63, 0], [66, 1], [71, 0], [74, 0], [78, 0], [82, 0], [88, 0]];
  const st = { t: 60 };
  el.innerHTML = `<div class="ctl">${slider('ngưỡng độ rộng (µm)', 40, 90, 1, st.t, 't')}<button class="btn small" id="best">Tìm ngưỡng tốt nhất</button></div><div id="pts"></div><div class="calc" id="out"></div>`;
  const gini = arr => { if (!arr.length) return 0; const p = arr.filter(v => v).length / arr.length; return 1 - p * p - (1 - p) * (1 - p); };
  const ev = t => { const L = data.filter(d => d[0] < t).map(d => d[1]), R = data.filter(d => d[0] >= t).map(d => d[1]); return { L, R, gl: gini(L), gr: gini(R), w: (L.length * gini(L) + R.length * gini(R)) / data.length }; };
  const upd = () => {
    const r = ev(st.t), g0 = gini(data.map(d => d[1]));
    $('#pts', el).innerHTML = `<div class="scroll-x"><div style="display:flex;gap:4px;width:max-content">${data.map(([x, y]) => `<div style="text-align:center;padding:6px 8px;border-radius:8px;border:1.5px solid ${x < st.t ? 'var(--pen)' : 'var(--line)'};background:${y ? 'var(--red-soft)' : 'var(--sheet)'}"><div class="hand" style="font-size:19px">${x}</div><div class="note-s" style="margin:0">${y ? 'NG' : 'OK'}</div></div>`).join('')}</div></div>`;
    const cnt = a => `${a.filter(v => v).length} NG / ${a.filter(v => !v).length} OK`;
    $('#out', el).innerHTML = `<span class="hand">Gini gốc = ${fmt(g0, 3)}</span><br><span class="hand">Trái (&lt; ${st.t}): ${cnt(r.L)} → Gini ${fmt(r.gl, 3)} · Phải: ${cnt(r.R)} → Gini ${fmt(r.gr, 3)}</span><br><span class="hand">Trung bình có trọng số = ${r.L.length}/10·${fmt(r.gl, 3)} + ${r.R.length}/10·${fmt(r.gr, 3)} = ${fmt(r.w, 3)} → giảm </span><span class="r">${fmt(g0 - r.w, 3)}</span><div class="note-s">Ô viền xanh: rơi vào nhánh trái. Có một bo 66 µm lỗi và một bo 63 µm tốt: không ngưỡng nào tách hoàn hảo.</div>`;
  };
  $('#best', el).onclick = () => { let best = 40, bw = 9; for (let t = 40; t <= 90; t++) { const w = ev(t).w; if (w < bw - 1e-9) { bw = w; best = t; } } st.t = best; const i = $('input[type=range]', el); i.value = best; $('output', el).textContent = best; upd(); };
  bindSliders(el, st, upd, { t: v => v }); upd();
};

WT.boost = 'Gradient boosting: mỗi gốc cây sửa phần dư';
W.boost = el => {
  const xs = [...Array(16)].map((_, i) => i * 0.4); const ys = xs.map(x => Math.sin(x) * 2 + x * 0.3 + (Math.sin(x * 7) * 0.25));
  const st = { lr: 0.5 }; let F, trees;
  const reset = () => { const m = ys.reduce((a, b) => a + b) / ys.length; F = xs.map(() => m); trees = 0; };
  reset();
  el.innerHTML = `<div class="ctl">${slider('η', 0.1, 1, 0.05, st.lr, 'lr')}<button class="btn small solid" id="add">Thêm 1 cây</button><button class="btn small" id="add10">+10 cây</button><button class="btn small ghost" id="rst">Đặt lại</button></div><div id="cv"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 640, 260);
  const addTree = () => {
    const r = ys.map((y, i) => y - F[i]); let best = null;
    for (let k = 1; k < xs.length; k++) { const L = r.slice(0, k), R = r.slice(k); const ml = L.reduce((a, b) => a + b) / L.length, mr = R.reduce((a, b) => a + b) / R.length; const sse = L.reduce((a, v) => a + (v - ml) ** 2, 0) + R.reduce((a, v) => a + (v - mr) ** 2, 0); if (!best || sse < best.sse) best = { k, ml, mr, sse }; }
    F = F.map((f, i) => f + st.lr * (i < best.k ? best.ml : best.mr)); trees++; return best;
  };
  let last = null;
  const upd = () => {
    const Fr = plotFrame(P, [0, 6.2], [-2.5, 4.5]);
    P.g.strokeStyle = cssv('pen'); P.g.lineWidth = 2.4; P.g.beginPath(); xs.forEach((x, i) => { const px = Fr.X(x), py = Fr.Y(F[i]); if (i) { P.g.lineTo(px, Fr.Y(F[i - 1])); P.g.lineTo(px, py); } else P.g.moveTo(px, py); }); P.g.stroke();
    xs.forEach((x, i) => dot(P, Fr.X(x), Fr.Y(ys[i]), cssv('red'), 4));
    const mse = ys.reduce((a, y, i) => a + (y - F[i]) ** 2, 0) / ys.length;
    $('#out', el).innerHTML = `<span class="hand">Số cây: ${trees} · MSE = </span><span class="r">${fmt(mse, 4)}</span>${last ? `<div class="hand">Cây vừa thêm: tách tại x = ${fmt((xs[last.k - 1] + xs[last.k]) / 2, 2)}, trái cộng ${fmt(st.lr * last.ml, 3)}, phải cộng ${fmt(st.lr * last.mr, 3)}</div>` : ''}<div class="note-s">Đường xanh là mô hình cộng dồn (hình bậc thang vì mỗi cây là một gốc cây). Thêm cây dần dần, mô hình bám dữ liệu; quá nhiều cây sẽ khớp cả nhiễu.</div>`;
  };
  $('#add', el).onclick = () => { last = addTree(); upd(); };
  $('#add10', el).onclick = () => { for (let i = 0; i < 10; i++) last = addTree(); upd(); };
  $('#rst', el).onclick = () => { reset(); last = null; upd(); };
  bindSliders(el, st, () => {}); upd();
};

WT.kmeans = 'k-means từng bước: gán rồi cập nhật';
W.kmeans = el => {
  const r = gaussRng(9); const pts = [];
  [[2, 2], [6, 2.5], [4, 6]].forEach(([cx, cy]) => { for (let i = 0; i < 12; i++) pts.push([cx + r() * 0.8, cy + r() * 0.8]); });
  const st = { k: 3 }; let C, A, phase, it;
  const reset = () => { C = [...Array(st.k)].map((_, i) => [pts[i * 5][0], pts[i * 5][1]]); A = pts.map(() => -1); phase = 0; it = 0; };
  reset();
  el.innerHTML = `<div class="ctl">${slider('k', 2, 5, 1, st.k, 'k')}<button class="btn small solid" id="stp">Bước tiếp</button><button class="btn small ghost" id="rst">Khởi tạo lại</button></div><div id="cv" style="max-width:420px"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 420, 380);
  const cols = () => [cssv('pen'), cssv('red'), cssv('leaf'), cssv('muted'), cssv('ink')];
  const upd = msg => {
    const F = plotFrame(P, [0, 8], [0, 8]); const cl = cols();
    pts.forEach((p, i) => dot(P, F.X(p[0]), F.Y(p[1]), A[i] < 0 ? cssv('line') : cl[A[i]], 5));
    C.forEach((c, j) => { P.g.fillStyle = cl[j]; P.g.strokeStyle = cssv('sheet'); P.g.lineWidth = 2; P.g.beginPath(); P.g.rect(F.X(c[0]) - 8, F.Y(c[1]) - 8, 16, 16); P.g.fill(); P.g.stroke(); });
    const J = A[0] < 0 ? NaN : pts.reduce((a, p, i) => a + (p[0] - C[A[i]][0]) ** 2 + (p[1] - C[A[i]][1]) ** 2, 0);
    $('#out', el).innerHTML = `<span class="hand">Vòng ${it} · ${msg || 'Bấm “Bước tiếp”: lần lượt gán điểm, rồi dời tâm.'}</span>${isNaN(J) ? '' : `<br><span class="hand">J = tổng bình phương khoảng cách = </span><span class="r">${fmt(J, 2)}</span>`}<div class="note-s">Hình vuông là tâm cụm. Thử k = 2 hoặc 4 và xem J.</div>`;
  };
  $('#stp', el).onclick = () => {
    if (phase === 0) { let ch = 0; pts.forEach((p, i) => { let b = 0, bd = 1e9; C.forEach((c, j) => { const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2; if (d < bd) { bd = d; b = j; } }); if (A[i] !== b) ch++; A[i] = b; }); phase = 1; it++; upd(`Gán: ${ch} điểm đổi cụm.${ch === 0 ? ' Đã hội tụ.' : ''}`); }
    else { C = C.map((c, j) => { const m = pts.filter((_, i) => A[i] === j); return m.length ? [m.reduce((a, p) => a + p[0], 0) / m.length, m.reduce((a, p) => a + p[1], 0) / m.length] : c; }); phase = 0; upd('Cập nhật: mỗi tâm dời tới trung bình cụm.'); }
  };
  $('#rst', el).onclick = () => { reset(); upd(); };
  bindSliders(el, st, () => { reset(); upd(); }, { k: v => v }); upd();
};

WT.pca = 'Xoay trục chiếu để giữ nhiều phương sai nhất';
W.pca = el => {
  const r = gaussRng(21); const pts = [...Array(40)].map(() => { const a = r() * 1.6, b = r() * 0.45; return [a * 0.8 - b * 0.6, a * 0.6 + b * 0.8]; });
  const mx = pts.reduce((s, p) => s + p[0], 0) / pts.length, my = pts.reduce((s, p) => s + p[1], 0) / pts.length; pts.forEach(p => { p[0] -= mx; p[1] -= my; });
  const sxx = pts.reduce((s, p) => s + p[0] * p[0], 0) / pts.length, syy = pts.reduce((s, p) => s + p[1] * p[1], 0) / pts.length, sxy = pts.reduce((s, p) => s + p[0] * p[1], 0) / pts.length;
  const tr = sxx + syy, det = sxx * syy - sxy * sxy, l1 = tr / 2 + Math.sqrt(tr * tr / 4 - det), best = Math.atan2(l1 - sxx, sxy) * 180 / Math.PI;
  const st = { a: 0 };
  el.innerHTML = `<div class="ctl">${slider('góc trục chiếu (độ)', 0, 180, 1, st.a, 'a')}<button class="btn small" id="b">Đặt vào trục chính</button></div><div id="cv" style="max-width:420px"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 420, 380);
  const upd = () => {
    const F = plotFrame(P, [-3.5, 3.5], [-3, 3]); const t = st.a * Math.PI / 180, u = [Math.cos(t), Math.sin(t)];
    curve(P, F, x => Math.abs(u[0]) < 1e-6 ? 0 : x * u[1] / u[0], -3.5, 3.5, cssv('pen'), 2);
    let v = 0; pts.forEach(p => { const z = p[0] * u[0] + p[1] * u[1]; v += z * z; const q = [z * u[0], z * u[1]]; P.g.strokeStyle = cssv('line'); P.g.lineWidth = 1; P.g.beginPath(); P.g.moveTo(F.X(p[0]), F.Y(p[1])); P.g.lineTo(F.X(q[0]), F.Y(q[1])); P.g.stroke(); dot(P, F.X(q[0]), F.Y(q[1]), cssv('pen'), 2.5); dot(P, F.X(p[0]), F.Y(p[1]), cssv('red'), 4); });
    v /= pts.length;
    $('#out', el).innerHTML = `<span class="hand">Phương sai theo trục = </span><span class="r">${fmt(v, 3)}</span> <span class="hand">/ tổng ${fmt(tr, 3)} = ${fmt(100 * v / tr, 1)}%</span><br><span class="hand">Σ = [[${fmt(sxx, 2)}, ${fmt(sxy, 2)}], [${fmt(sxy, 2)}, ${fmt(syy, 2)}]] · λ₁ = ${fmt(l1, 3)} tại góc ${fmt((best + 180) % 180, 1)}°</span><div class="note-s">Xoay trục: phương sai của hình chiếu lớn nhất đúng tại vectơ riêng thứ nhất, và bằng λ₁.</div>`;
  };
  $('#b', el).onclick = () => { st.a = Math.round((best + 180) % 180); const i = $('input[type=range]', el); i.value = st.a; $('output', el).textContent = st.a; upd(); };
  bindSliders(el, st, upd, { a: v => v }); upd();
};

WT.nbayes = 'Naive Bayes phân loại ghi chú vận hành';
W.nbayes = el => {
  const words = ['đứt', 'xước', 'bụi', 'lệch', 'sáng', 'kiểm lại OK'];
  const cnt = { real: [6, 5, 1, 4, 2, 0], fake: [1, 2, 7, 1, 6, 8] }; const N = { real: 10, fake: 10 };
  const st = { prior: 0.3 }; const on = new Set(['đứt', 'bụi']);
  el.innerHTML = `<div class="ctl">${slider('P(lỗi thật) ban đầu', 0.05, 0.95, 0.05, st.prior, 'prior')}</div><div class="ctl" id="ws"></div><div class="scroll-x"><table class="steps" id="tb"></table></div><div class="calc" id="out"></div>`;
  const upd = () => {
    $('#ws', el).innerHTML = 'Ghi chú chứa: ' + words.map(w => `<label><input type="checkbox" data-w="${w}"${on.has(w) ? ' checked' : ''}> ${w}</label>`).join('');
    $$('[data-w]', el).forEach(c => c.onchange = () => { c.checked ? on.add(c.dataset.w) : on.delete(c.dataset.w); upd(); });
    let pr = st.prior, pf = 1 - st.prior; let rows = `<tr><th>Từ</th><th>P(từ | lỗi thật)</th><th>P(từ | báo giả)</th></tr>`;
    words.forEach((w, i) => { if (!on.has(w)) return; const a = (cnt.real[i] + 1) / (N.real + 2), b = (cnt.fake[i] + 1) / (N.fake + 2); pr *= a; pf *= b; rows += `<tr><td>${w}</td><td class="v">(${cnt.real[i]}+1)/12 = ${fmt(a, 3)}</td><td class="v">(${cnt.fake[i]}+1)/12 = ${fmt(b, 3)}</td></tr>`; });
    $('#tb', el).innerHTML = rows;
    $('#out', el).innerHTML = `<span class="hand">lỗi thật ∝ ${fmt(st.prior, 2)} × … = ${pr.toExponential(3)} · báo giả ∝ ${fmt(1 - st.prior, 2)} × … = ${pf.toExponential(3)}</span><br><span class="hand">P(lỗi thật | ghi chú) = </span><span class="r">${fmt(100 * pr / (pr + pf), 1)}%</span><div class="note-s">Số đếm trên 10 ghi chú mỗi loại, làm mịn Laplace (cộng 1 vào tử, 2 vào mẫu vì mỗi từ có/không).</div>`;
  };
  bindSliders(el, st, upd); upd();
};
