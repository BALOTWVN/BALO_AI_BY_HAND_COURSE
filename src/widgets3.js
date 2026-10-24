/* ================= GIAI ĐOẠN 4 ================= */
WT.attn = 'Self-attention tính tay: 3 token, d = 2';
W.attn = el => {
  const st = { X: [[1, 0], [0, 1], [1, 1]], WQ: [[1, 0], [0, 2]], WK: [[1, 1], [0, 1]], WV: [[2, 0], [0, 1]] };
  let causal = false, row = 2; const tok = ['“đường”', '“mạch”', '“đứt”'];
  el.innerHTML = `<div class="ctl"><label><input type="checkbox" id="cz"> Mặt nạ nhân quả (decoder)</label><span class="note-s" style="margin:0">Sửa X hoặc W, bấm một hàng của A để xem chi tiết.</span></div>
  <div class="scroll-x"><div class="mats" style="width:max-content">
    <div class="mat"><div class="lbl">X <i>(token × d)</i></div>${inputMat(st.X, 'X')}</div>
    <div class="mat"><div class="lbl">W<sub>Q</sub></div>${inputMat(st.WQ, 'WQ')}</div><div class="mat"><div class="lbl">W<sub>K</sub></div>${inputMat(st.WK, 'WK')}</div><div class="mat"><div class="lbl">W<sub>V</sub></div>${inputMat(st.WV, 'WV')}</div>
  </div><div class="mats" id="m2" style="width:max-content;margin-top:14px"></div><div class="mats" id="m3" style="width:max-content;margin-top:14px"></div></div><div class="calc" id="out"></div>`;
  const upd = () => {
    ['X', 'WQ', 'WK', 'WV'].forEach(k => readInputs(el, k, st[k]));
    const Q = matmul(st.X, st.WQ), K = matmul(st.X, st.WK), V = matmul(st.X, st.WV);
    const S = matmul(Q, T(K)), Ss = S.map(r => r.map(v => v / Math.SQRT2));
    const Sm = Ss.map((r, i) => r.map((v, j) => causal && j > i ? -Infinity : v)); const A = Sm.map(softmaxArr); const O = matmul(A, V);
    $('#m2', el).innerHTML = matHTML(Q, { label: 'Q = XW<sub>Q</sub>' }) + matHTML(K, { label: 'K = XW<sub>K</sub>' }) + matHTML(V, { label: 'V = XW<sub>V</sub>' }) + matHTML(S, { label: 'S = QKᵀ', heat: true });
    $('#m3', el).innerHTML = matHTML(Sm.map(r => r.map(v => isFinite(v) ? v : '−∞')), { label: 'S / √2' + (causal ? ' + mặt nạ' : '') }) +
      matHTML(A, { label: 'A = softmax theo hàng', heat: true, d: 3, click: true, id: 'A', cls: i => i === row ? 'hl2' : '' }) + matHTML(O, { label: 'Đầu ra O = AV', d: 3, cls: i => i === row ? 'hl2' : '' });
    const r = row;
    $('#out', el).innerHTML = `<div><b>Token ${tok[r]}</b> (hàng ${r + 1}):</div>
      <span class="hand">điểm = q·k = [${S[r].map(v => fmt(v)).join(', ')}] → ÷√2 = [${Sm[r].map(v => isFinite(v) ? fmt(v) : '−∞').join(', ')}]</span><br>
      <span class="hand">softmax → [${A[r].map(v => fmt(v, 3)).join(', ')}]</span><br>
      <span class="hand">o = ${A[r].map((a, j) => `${fmt(a, 3)}·[${V[j].map(v => fmt(v)).join(',')}]`).join(' + ')} = </span><span class="r">[${O[r].map(v => fmt(v, 3)).join(', ')}]</span>
      <div class="note-s">Token này “chú ý” nhiều nhất tới ${tok[A[r].indexOf(Math.max(...A[r]))]}.</div>`;
    $$('#A tr', el).forEach((tr, i) => tr.onclick = () => { row = i; upd(); });
  };
  $('#cz', el).onchange = e => { causal = e.target.checked; upd(); };
  el.addEventListener('input', upd); upd();
};

WT.pe = 'Bản đồ mã hóa vị trí sinusoidal';
W.pe = el => {
  const st = { d: 64, p: 10 };
  el.innerHTML = `<div class="ctl">${slider('d (số chiều)', 8, 128, 8, st.d, 'd')}${slider('vị trí p', 0, 63, 1, st.p, 'p')}</div><div id="cv"></div><div id="cv2" style="margin-top:10px"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 640, 220), P2 = mkCanvas($('#cv2', el), 640, 170);
  const pe = (pos, i, d) => { const k = Math.floor(i / 2); const ang = pos / Math.pow(10000, 2 * k / d); return i % 2 ? Math.cos(ang) : Math.sin(ang); };
  const upd = () => {
    const { g } = P; const N = 64, d = st.d, cw = (640 - 50) / N, ch = (220 - 20) / d;
    g.clearRect(0, 0, 640, 220); g.fillStyle = cssv('sheet'); g.fillRect(0, 0, 640, 220);
    const pen = cssv('pen'), red = cssv('red');
    for (let pos = 0; pos < N; pos++) for (let i = 0; i < d; i++) { const v = pe(pos, i, d); g.fillStyle = v >= 0 ? pen : red; g.globalAlpha = Math.abs(v) * 0.9; g.fillRect(40 + pos * cw, 10 + i * ch, cw + 0.5, ch + 0.5); }
    g.globalAlpha = 1; g.strokeStyle = cssv('ink'); g.lineWidth = 1.5; g.strokeRect(40 + st.p * cw, 10, cw, d * ch);
    g.fillStyle = cssv('muted'); g.font = '11px ' + cssv('f-mono'); g.save(); g.translate(14, 115); g.rotate(-Math.PI / 2); g.textAlign = 'center'; g.fillText('chiều i →', 0, 0); g.restore(); g.fillText('vị trí →', 590, 216);
    const pv = [...Array(d)].map((_, i) => pe(st.p, i, d));
    const sim = q => pv.reduce((a, v, i) => a + v * pe(q, i, d), 0) / (d / 2);
    const F = plotFrame(P2, [0, 63], [-0.5, 1.05], { xl: 'vị trí q' }); curve(P2, F, sim, 0, 63, cssv('pen'), 2); dot(P2, F.X(st.p), F.Y(1), cssv('red'));
    $('#out', el).innerHTML = `<span class="hand">PE(${st.p}) = [${pv.slice(0, 6).map(v => fmt(v, 3)).join(', ')}, …]</span><div class="note-s">Trên: màu xanh = dương, đỏ = âm; hàng trên đổi màu nhanh (tần số cao), hàng dưới chậm. Dưới: tích vô hướng PE(p)·PE(q) cao nhất tại q = p và giảm dần theo khoảng cách: mô hình đọc được “gần” hay “xa”.</div>`;
  };
  bindSliders(el, st, upd, { d: v => v, p: v => v }); upd();
};

WT.tfparams = 'Đếm tham số Transformer';
W.tfparams = el => {
  const PRE = { 'ViT-Tiny': [192, 12, 0, 4], 'ViT-Base': [768, 12, 0, 4], 'ViT-Large': [1024, 24, 0, 4], 'GPT-2 small': [768, 12, 50257, 4], 'BERT-Large': [1024, 24, 30522, 4] };
  const st = { d: 768, L: 12, V: 0, r: 4 };
  el.innerHTML = `<div class="ctl">${Object.keys(PRE).map(k => `<button class="btn small ghost" data-p="${k}">${k}</button>`).join('')}</div>
  <div class="ctl"><label>d <input type="number" id="d" min="16" step="16" value="768" style="width:6em"></label><label>Số khối L <input type="number" id="L" min="1" value="12" style="width:5em"></label><label>Từ điển V <input type="number" id="V" min="0" value="0" style="width:7em"></label><label>FFN × <input type="number" id="r" min="1" value="4" style="width:4em"></label></div>
  <div class="bars" id="bars"></div><div class="calc" id="out"></div>`;
  const upd = () => {
    ['d', 'L', 'V', 'r'].forEach(k => st[k] = Math.max(0, +$('#' + k, el).value || 0));
    const at = 4 * st.d * st.d + 4 * st.d, ff = 2 * st.r * st.d * st.d + st.r * st.d + st.d, ln = 4 * st.d, blk = at + ff + ln, emb = st.V * st.d, tot = blk * st.L + emb;
    const mx = Math.max(at * st.L, ff * st.L, emb, 1);
    $('#bars', el).innerHTML = `<span>Attention</span><div class="bar" style="width:${100 * at * st.L / mx}%"></div><span class="val">${fmt(at * st.L / 1e6, 1)}M</span>
      <span>FFN</span><div class="bar red" style="width:${100 * ff * st.L / mx}%"></div><span class="val">${fmt(ff * st.L / 1e6, 1)}M</span>
      <span>Embedding</span><div class="bar off" style="width:${100 * emb / mx}%"></div><span class="val">${fmt(emb / 1e6, 1)}M</span>`;
    $('#out', el).innerHTML = `<span class="hand">Mỗi khối ≈ 4d² + 2·${st.r}·d² = ${fmt((4 + 2 * st.r) * st.d * st.d / 1e6, 2)}M · ×${st.L} khối + embedding = </span><span class="r">${fmt(tot / 1e6, 1)}M</span> <span class="note-s">tham số (tính cả bias, LayerNorm)</span>`;
  };
  $$('[data-p]', el).forEach(b => b.onclick = () => { const [d, L, V, r] = PRE[b.dataset.p]; $('#d', el).value = d; $('#L', el).value = L; $('#V', el).value = V; $('#r', el).value = r; upd(); });
  el.addEventListener('input', upd); upd();
};

// procedural PCB image (used by ViT + diffusion widgets)
function pcbGray(n, seed = 7) {
  const r = rng(seed), img = new Float32Array(n * n).fill(0.15);
  const rect = (x0, y0, w, h, v) => { for (let y = Math.max(0, y0); y < Math.min(n, y0 + h); y++) for (let x = Math.max(0, x0); x < Math.min(n, x0 + w); x++) img[y * n + x] = v; };
  const u = n / 64;
  for (let k = 0; k < 5; k++) rect(Math.round((6 + k * 12) * u), 0, Math.round(3 * u), n, 0.8);
  rect(0, Math.round(20 * u), Math.round(40 * u), Math.round(3 * u), 0.8);
  rect(Math.round(30 * u), Math.round(40 * u), n, Math.round(3 * u), 0.8);
  for (let k = 0; k < 6; k++) { const cx = Math.round((8 + r() * 48) * u), cy = Math.round((8 + r() * 48) * u); rect(cx - Math.round(3 * u), cy - Math.round(3 * u), Math.round(6 * u), Math.round(6 * u), 0.95); }
  rect(Math.round(30 * u), Math.round(10 * u), Math.round(3 * u), Math.round(4 * u), 0.15); // a break defect
  rect(Math.round(43 * u), Math.round(50 * u), Math.round(3 * u), Math.round(3 * u), 0.95); // a copper splash
  return img;
}

WT.patch = 'Cắt ảnh bo mạch thành token cho ViT';
W.patch = el => {
  const st = { P: 16 }; let sel = 40;
  el.innerHTML = `<div class="ctl"><label>Kích thước mảnh P <select id="ps">${[8, 14, 16, 28, 32, 56].map(p => `<option${p === 16 ? ' selected' : ''}>${p}</option>`).join('')}</select></label><span class="note-s" style="margin:0">Bấm vào một mảnh.</span></div>
  <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start"><div id="cv" style="width:min(100%,336px)"></div><div class="calc" id="out" style="flex:1;min-width:220px;margin-top:0"></div></div>`;
  const P = mkCanvas($('#cv', el), 336, 336); const img = pcbGray(224, 11);
  const base = document.createElement('canvas'); base.width = base.height = 224; const bg = base.getContext('2d'); const id = bg.createImageData(224, 224);
  for (let i = 0; i < 224 * 224; i++) { const v = img[i]; const cu = v > 0.5; id.data[i * 4] = cu ? 200 + 30 * (v - .8) : 22; id.data[i * 4 + 1] = cu ? 150 + 30 * (v - .8) : 74; id.data[i * 4 + 2] = cu ? 90 : 52; id.data[i * 4 + 3] = 255; }
  bg.putImageData(id, 0, 0);
  const upd = () => {
    const g = P.g, n = 224 / st.P, s = 336 / 224; g.clearRect(0, 0, 336, 336); g.imageSmoothingEnabled = false; g.drawImage(base, 0, 0, 336, 336);
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 1; for (let i = 1; i < n; i++) { g.beginPath(); g.moveTo(i * st.P * s, 0); g.lineTo(i * st.P * s, 336); g.stroke(); g.beginPath(); g.moveTo(0, i * st.P * s); g.lineTo(336, i * st.P * s); g.stroke(); }
    if (sel >= n * n) sel = 0; const sr = Math.floor(sel / n), sc = sel % n;
    g.strokeStyle = '#ff5a48'; g.lineWidth = 3; g.strokeRect(sc * st.P * s, sr * st.P * s, st.P * s, st.P * s);
    const N = n * n;
    $('#out', el).innerHTML = `<span class="hand">N = (224 / ${st.P})² = </span><span class="r">${N}</span> <span class="hand">token + [CLS] = ${N + 1}</span><br>
      <span class="hand">mỗi mảnh: ${st.P}×${st.P}×3 = </span><span class="r">${st.P * st.P * 3}</span> <span class="hand">số → chiếu thành d = 768</span><br>
      <span class="hand">mảnh đang chọn: hàng ${sr + 1}, cột ${sc + 1} → token #${sel + 1}</span><br>
      <span class="hand">ma trận attention: ${N + 1}² = ${fmtN((N + 1) ** 2)} ô/đầu</span>
      <div class="note-s">So với P = 16: chi phí attention ×${fmt(((N + 1) / 197) ** 2, 2)}. Ảnh có một chỗ đứt mạch và một chấm đồng thừa; với P lớn, lỗi nhỏ chỉ còn vài pixel trong một token.</div>`;
  };
  P.c.onclick = e => { const b = P.c.getBoundingClientRect(); const n = 224 / st.P; const x = Math.floor((e.clientX - b.left) / b.width * n), y = Math.floor((e.clientY - b.top) / b.height * n); sel = y * n + x; upd(); };
  $('#ps', el).onchange = e => { st.P = +e.target.value; sel = 0; upd(); };
  upd();
};

/* ================= GIAI ĐOẠN 5 ================= */
WT.vae = 'Mẹo tái tham số hóa & KL trong không gian ẩn 2D';
W.vae = el => {
  const st = { m1: 1, m2: -0.5, l1: -0.5, l2: -1.5 }; let e = [0.6, -1.1]; const gr = gaussRng(42);
  el.innerHTML = `<div class="ctl">${slider('μ₁', -2.5, 2.5, 0.1, st.m1, 'm1')}${slider('μ₂', -2.5, 2.5, 0.1, st.m2, 'm2')}${slider('log σ₁²', -3, 1.5, 0.1, st.l1, 'l1')}${slider('log σ₂²', -3, 1.5, 0.1, st.l2, 'l2')}<button class="btn small" id="smp">Lấy ε mới</button></div>
  <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start"><div id="cv" style="width:min(100%,320px)"></div><div class="calc" id="out" style="flex:1;min-width:240px;margin-top:0"></div></div>`;
  const P = mkCanvas($('#cv', el), 320, 320);
  const upd = () => {
    const s1 = Math.exp(st.l1 / 2), s2 = Math.exp(st.l2 / 2); const z = [st.m1 + s1 * e[0], st.m2 + s2 * e[1]];
    const kl = [[st.m1, st.l1], [st.m2, st.l2]].map(([m, l]) => 0.5 * (m * m + Math.exp(l) - 1 - l));
    const F = plotFrame(P, [-3.5, 3.5], [-3.5, 3.5]); const g = P.g;
    const ell = (cx, cy, rx, ry, col, dash) => { g.strokeStyle = col; g.lineWidth = 2; g.setLineDash(dash); g.beginPath(); g.ellipse(F.X(cx), F.Y(cy), Math.abs(F.X(rx) - F.X(0)), Math.abs(F.Y(ry) - F.Y(0)), 0, 0, 7); g.stroke(); g.setLineDash([]); };
    ell(0, 0, 1, 1, cssv('muted'), [5, 4]); ell(0, 0, 2, 2, cssv('line'), [5, 4]);
    ell(st.m1, st.m2, s1, s2, cssv('pen'), []); ell(st.m1, st.m2, 2 * s1, 2 * s2, cssv('pen'), [2, 3]);
    dot(P, F.X(st.m1), F.Y(st.m2), cssv('pen'), 4); dot(P, F.X(z[0]), F.Y(z[1]), cssv('red'), 6);
    $('#out', el).innerHTML = `<span class="hand">σ = exp(½ log σ²) = [${fmt(s1, 3)}, ${fmt(s2, 3)}]</span><br><span class="hand">ε = [${fmt(e[0], 2)}, ${fmt(e[1], 2)}]</span><br>
      <span class="hand">z = μ + σ⊙ε = </span><span class="r">[${fmt(z[0], 3)}, ${fmt(z[1], 3)}]</span><br>
      <span class="hand">KL = ${fmt(kl[0], 3)} + ${fmt(kl[1], 3)} = </span><span class="r">${fmt(kl[0] + kl[1], 3)}</span>
      <div class="note-s">Vòng nét đứt xám = N(0, I). KL kéo vòng xanh về trùng vòng xám; loss tái tạo muốn vòng xanh nhỏ và riêng biệt cho mỗi ảnh.</div>`;
  };
  $('#smp', el).onclick = () => { e = [gr(), gr()]; upd(); };
  bindSliders(el, st, upd); upd();
};

WT.gan = 'Loss của Discriminator và Generator';
W.gan = el => {
  const st = { dr: 0.8, df: 0.3 };
  el.innerHTML = `<div class="ctl">${slider('D(x) với ảnh thật', 0.01, 0.99, 0.01, st.dr, 'dr')}${slider('D(G(z)) với ảnh giả', 0.01, 0.99, 0.01, st.df, 'df')}</div><div id="cv"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 640, 260);
  const upd = () => {
    const F = plotFrame(P, [0, 1], [-4.5, 4.5], { xl: 'D(G(z))' });
    curve(P, F, d => Math.log(1 - d), 0.005, 0.995, cssv('muted'), 2, [5, 4]);
    curve(P, F, d => -Math.log(d), 0.005, 0.995, cssv('red'), 2.4);
    dot(P, F.X(st.df), F.Y(Math.log(1 - st.df)), cssv('muted')); dot(P, F.X(st.df), F.Y(-Math.log(st.df)), cssv('red'));
    const LD = -Math.log(st.dr) - Math.log(1 - st.df), LG = -Math.log(st.df);
    $('#out', el).innerHTML = `<span class="hand">L<sub>D</sub> = −ln ${fmt(st.dr)} − ln(1 − ${fmt(st.df)}) = ${fmt(-Math.log(st.dr), 3)} + ${fmt(-Math.log(1 - st.df), 3)} = </span><span class="r">${fmt(LD, 3)}</span><br>
      <span class="hand">L<sub>G</sub> = −ln ${fmt(st.df)} = </span><span class="r">${fmt(LG, 3)}</span><br>
      <span class="hand">độ dốc theo D(G(z)): bão hòa ${fmt(-1 / (1 - st.df), 2)} vs non-saturating ${fmt(-1 / st.df, 2)}</span>
      <div class="legend"><span><i style="background:var(--muted)"></i>ln(1 − D(G(z))) — G tối thiểu hóa (bản gốc)</span><span><i style="background:var(--red)"></i>−ln D(G(z)) — non-saturating</span></div>
      <div class="note-s">Kéo D(G(z)) về gần 0 (G còn tệ): đường xám gần như phẳng, đường đỏ dốc đứng. Cân bằng lý thuyết: D(x) = D(G(z)) = 0.5, khi đó L<sub>D</sub> = 2 ln 2 ≈ 1.386.</div>`;
  };
  bindSliders(el, st, upd); upd();
};

const betaLin = t => 1e-4 + (0.02 - 1e-4) * (t - 1) / 999;
const ABAR = { lin: [1], cos: [1] };
for (let t = 1; t <= 1000; t++) ABAR.lin.push(ABAR.lin[t - 1] * (1 - betaLin(t)));
{ const s = 0.008, f = t => Math.cos(((t / 1000 + s) / (1 + s)) * Math.PI / 2) ** 2; for (let t = 1; t <= 1000; t++) ABAR.cos.push(Math.max(1e-5, f(t) / f(0))); }

WT.diffuse = 'Thêm nhiễu vào ảnh bo mạch theo bước t';
W.diffuse = el => {
  const st = { t: 250 }; let sch = 'lin';
  el.innerHTML = `<div class="ctl">${slider('bước t', 0, 1000, 5, st.t, 't')}<label>Lịch nhiễu <select id="sc"><option value="lin">Tuyến tính (DDPM)</option><option value="cos">Cosine</option></select></label></div>
  <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start"><div style="display:flex;gap:10px"><div><div class="note-s" style="margin:0 0 4px">x₀</div><div id="c0" style="width:150px"></div></div><div><div class="note-s" style="margin:0 0 4px">x<sub>t</sub></div><div id="c1" style="width:150px"></div></div></div><div id="cv" style="flex:1;min-width:260px"></div></div><div class="calc" id="out"></div>`;
  const n = 64, x0 = pcbGray(n, 3).map(v => v * 2 - 1); const g = gaussRng(5); const eps = Float32Array.from({ length: n * n }, () => g());
  const mk = sel => { const c = document.createElement('canvas'); c.width = c.height = n; c.style.cssText = 'width:150px;height:150px;image-rendering:pixelated;border-radius:8px;border:1px solid var(--line)'; $(sel, el).appendChild(c); return c.getContext('2d'); };
  const g0 = mk('#c0'), g1 = mk('#c1'); const P = mkCanvas($('#cv', el), 420, 200);
  const paint = (ctx, arr) => { const id = ctx.createImageData(n, n); for (let i = 0; i < n * n; i++) { const v = Math.max(0, Math.min(255, (arr[i] + 1) * 127.5)); id.data[i * 4] = v; id.data[i * 4 + 1] = v; id.data[i * 4 + 2] = v; id.data[i * 4 + 3] = 255; } ctx.putImageData(id, 0, 0); };
  paint(g0, x0);
  const upd = () => {
    const ab = ABAR[sch][st.t], a = Math.sqrt(ab), b = Math.sqrt(1 - ab); paint(g1, x0.map((v, i) => a * v + b * eps[i]));
    const F = plotFrame(P, [0, 1000], [0, 1], { xl: 't' });
    curve(P, F, t => ABAR.lin[Math.round(t)], 0, 1000, sch === 'lin' ? cssv('pen') : cssv('line'), 2);
    curve(P, F, t => ABAR.cos[Math.round(t)], 0, 1000, sch === 'cos' ? cssv('pen') : cssv('line'), 2, [6, 4]);
    dot(P, F.X(st.t), F.Y(ab), cssv('red'));
    $('#out', el).innerHTML = `<span class="hand">ᾱ<sub>${st.t}</sub> = ${fmt(ab, 4)} → x<sub>t</sub> = ${fmt(a, 3)}·x₀ + ${fmt(b, 3)}·ε</span> · <span class="hand">SNR = </span><span class="r">${ab > 0.9999 ? '∞' : fmt(ab / (1 - ab), 3)}</span>
      <div class="note-s">Đồ thị: ᾱ<sub>t</sub> theo t (liền = tuyến tính, đứt = cosine). Với lịch tuyến tính, ở t ≈ 600 ảnh gần như đã mất hết; cosine giữ thông tin lâu hơn.</div>`;
  };
  $('#sc', el).onchange = e => { sch = e.target.value; upd(); };
  bindSliders(el, st, upd, { t: v => v }); upd();
};

WT.denoise = 'Một bước khử nhiễu DDPM trên vector 4 pixel';
W.denoise = el => {
  const st = { t: 500, err: 0 }; const x0 = [0.8, -0.4, 0.1, 0.6], eps = [0.5, -1.2, 0.9, 0.3], zz = [0.2, 0.7, -0.4, -1.0];
  el.innerHTML = `<div class="ctl">${slider('bước t', 2, 1000, 1, st.t, 't')}${slider('sai số của mạng', 0, 1, 0.05, st.err, 'err')}</div><div class="scroll-x"><table class="steps" id="tb"></table></div><div class="calc" id="out"></div>`;
  const upd = () => {
    const t = st.t, ab = ABAR.lin[t], abp = ABAR.lin[t - 1], beta = betaLin(t), al = 1 - beta, sigma = Math.sqrt(beta * (1 - abp) / (1 - ab));
    const xt = x0.map((v, i) => Math.sqrt(ab) * v + Math.sqrt(1 - ab) * eps[i]);
    const ep = eps.map((v, i) => v + st.err * zz[(i + 1) % 4]);
    const x0h = xt.map((v, i) => (v - Math.sqrt(1 - ab) * ep[i]) / Math.sqrt(ab));
    const xp = xt.map((v, i) => (v - beta / Math.sqrt(1 - ab) * ep[i]) / Math.sqrt(al) + sigma * zz[i]);
    const row = (name, f, arr, d = 3) => `<tr><td>${name}</td><td style="font-size:13px;color:var(--muted)">${f}</td>${arr.map(v => `<td class="v">${fmt(v, d)}</td>`).join('')}</tr>`;
    $('#tb', el).innerHTML = `<tr><th>Đại lượng</th><th>Công thức</th><th>px 1</th><th>px 2</th><th>px 3</th><th>px 4</th></tr>` +
      row('x₀ (thật)', '', x0, 2) + row('ε (thật)', '', eps, 2) + row('x<sub>t</sub>', '√ᾱ·x₀ + √(1−ᾱ)·ε', xt) + row('ε<sub>θ</sub>', 'mạng dự đoán', ep) +
      row('x̂₀', '(x<sub>t</sub> − √(1−ᾱ)·ε<sub>θ</sub>) / √ᾱ', x0h) + row('x<sub>t−1</sub>', '(x<sub>t</sub> − β/√(1−ᾱ)·ε<sub>θ</sub>)/√α + σz', xp);
    const mse = ep.reduce((a, v, i) => a + (v - eps[i]) ** 2, 0) / 4;
    $('#out', el).innerHTML = `<span class="hand">β<sub>t</sub> = ${fmt(beta, 5)}, α<sub>t</sub> = ${fmt(al, 5)}, ᾱ<sub>t</sub> = ${fmt(ab, 4)}, σ<sub>t</sub> = ${fmt(sigma, 4)}</span><br><span class="hand">Loss huấn luyện ‖ε − ε<sub>θ</sub>‖²/4 = </span><span class="r">${fmt(mse, 4)}</span>
     <div class="note-s">Với sai số 0, x̂₀ khôi phục chính xác x₀. Tăng sai số ở t lớn: x̂₀ lệch rất xa (vì chia cho √ᾱ nhỏ), nhưng x<sub>t−1</sub> chỉ nhích một bước nhỏ. Đó là lý do lấy mẫu phải đi nhiều bước.</div>`;
  };
  bindSliders(el, st, upd, { t: v => v }); upd();
};

WT.cfg = 'Classifier-free guidance trên vector 2D';
W.cfg = el => {
  const st = { w: 3 }; const eu = [0.6, 0.2], ec = [0.8, 0.7];
  el.innerHTML = `<div class="ctl">${slider('hệ số w', 0, 10, 0.5, st.w, 'w')}</div><div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start"><div id="cv" style="width:min(100%,340px)"></div><div class="calc" id="out" style="flex:1;min-width:240px;margin-top:0"></div></div>`;
  const P = mkCanvas($('#cv', el), 340, 340);
  const upd = () => {
    const e = eu.map((v, i) => v + st.w * (ec[i] - v)); const R = Math.max(1.2, Math.abs(e[0]), Math.abs(e[1])) * 1.15;
    const F = plotFrame(P, [-R * 0.3, R], [-R * 0.3, R]); const g = P.g;
    const arrow = (v, col, w = 2.5, dash = []) => { g.strokeStyle = col; g.fillStyle = col; g.lineWidth = w; g.setLineDash(dash); g.beginPath(); g.moveTo(F.X(0), F.Y(0)); g.lineTo(F.X(v[0]), F.Y(v[1])); g.stroke(); g.setLineDash([]); const a = Math.atan2(F.Y(v[1]) - F.Y(0), F.X(v[0]) - F.X(0)); g.beginPath(); g.moveTo(F.X(v[0]), F.Y(v[1])); g.lineTo(F.X(v[0]) - 10 * Math.cos(a - .4), F.Y(v[1]) - 10 * Math.sin(a - .4)); g.lineTo(F.X(v[0]) - 10 * Math.cos(a + .4), F.Y(v[1]) - 10 * Math.sin(a + .4)); g.fill(); };
    g.strokeStyle = cssv('line'); g.setLineDash([4, 4]); g.lineWidth = 1.5; g.beginPath(); g.moveTo(F.X(eu[0]), F.Y(eu[1])); g.lineTo(F.X(e[0]), F.Y(e[1])); g.stroke(); g.setLineDash([]);
    arrow(eu, cssv('muted')); arrow(ec, cssv('pen')); arrow(e, cssv('red'), 3);
    $('#out', el).innerHTML = `<span class="hand">ε<sub>u</sub> = [${eu.join(', ')}], ε<sub>c</sub> = [${ec.join(', ')}]</span><br><span class="hand">ε̃ = ε<sub>u</sub> + ${fmt(st.w)}·(ε<sub>c</sub> − ε<sub>u</sub>) = </span><span class="r">[${e.map(v => fmt(v, 2)).join(', ')}]</span>
     <div class="legend"><span><i style="background:var(--muted)"></i>không điều kiện</span><span><i style="background:var(--pen)"></i>có điều kiện</span><span><i style="background:var(--red)"></i>sau guidance</span></div>
     <div class="note-s">w = 0: bỏ hẳn điều kiện. w = 1: có điều kiện thường. w > 1: ngoại suy ra xa hơn theo hướng “giống prompt”.</div>`;
  };
  bindSliders(el, st, upd); upd();
};

/* ================= GIAI ĐOẠN 6 ================= */
WT.clip = 'Ma trận tương đồng ảnh–văn bản & InfoNCE';
W.clip = el => {
  const st = { S: [[0.82, 0.31, 0.12], [0.28, 0.75, 0.40], [0.10, 0.45, 0.69]], tau: 0.1 };
  const im = ['ảnh xước', 'ảnh đứt mạch', 'ảnh tốt'], tx = ['“vết xước”', '“mạch bị đứt”', '“bo bình thường”'];
  el.innerHTML = `<div class="ctl">${slider('τ', 0.02, 1, 0.01, st.tau, 'tau')}<span class="note-s" style="margin:0">Hàng = ảnh, cột = câu chữ. Sửa các ô cosine.</span></div>
  <div class="scroll-x"><div class="mats" style="width:max-content"><div class="mat"><div class="lbl">Cosine S (${tx.join(', ')})</div>${inputMat(st.S, 'S')}</div><div id="pa"></div></div></div><div class="calc" id="out"></div>`;
  const upd = () => {
    readInputs(el, 'S', st.S); const Lg = st.S.map(r => r.map(v => v / st.tau));
    const Pr = Lg.map(softmaxArr), Pc = T(T(Lg).map(softmaxArr));
    const li = Pr.map((r, i) => -Math.log(r[i])), lt = [0, 1, 2].map(j => -Math.log(Pc[j][j]));
    $('#pa', el).innerHTML = matHTML(Pr, { label: 'softmax theo hàng (ảnh → chữ)', heat: true, d: 3, cls: (i, j) => i === j ? 'hl' : '' });
    $('#out', el).innerHTML = `<span class="hand">Loss ảnh→chữ: ${li.map((v, i) => `${im[i]} ${fmt(v, 3)}`).join(' · ')}</span><br><span class="hand">Loss chữ→ảnh: ${lt.map(v => fmt(v, 3)).join(' · ')}</span><br>
     <span class="hand">CLIP loss = ½(trung bình hai chiều) = </span><span class="r">${fmt((li.reduce((a, b) => a + b) + lt.reduce((a, b) => a + b)) / 6, 4)}</span>
     <div class="note-s">τ nhỏ khuếch đại khác biệt cosine nhỏ thành xác suất rất nhọn. Thử tăng ô [2,3] lên 0.8 để thấy loss của ảnh đứt mạch tăng vọt.</div>`;
  };
  el.addEventListener('input', upd); bindSliders(el, st, upd); upd();
};

WT.topp = 'Lấy mẫu token: temperature, top-k, top-p';
W.topp = el => {
  const words = ['lỗi', 'mạch', 'xước', 'đồng', 'tốt', 'hàn'], logits = [2.2, 1.6, 1.1, 0.4, -0.2, -1.0];
  const st = { T: 1, k: 6, p: 0.9 };
  el.innerHTML = `<div class="ctl">${slider('Temperature', 0.1, 2.5, 0.05, st.T, 'T')}${slider('top-k', 1, 6, 1, st.k, 'k')}${slider('top-p', 0.1, 1, 0.01, st.p, 'p')}</div><div class="note-s" style="margin:0 0 8px">Ngữ cảnh: “Ảnh AOI cho thấy bo mạch bị …”</div><div class="bars" id="bars"></div><div class="calc" id="out"></div>`;
  const upd = () => {
    const pr = softmaxArr(logits.map(z => z / st.T)); const order = pr.map((v, i) => i).sort((a, b) => pr[b] - pr[a]);
    let keep = new Set(order.slice(0, st.k)); let cum = 0; const keepP = new Set(); for (const i of order) { if (!keep.has(i)) break; keepP.add(i); cum += pr[i]; if (cum >= st.p) break; }
    const Z = [...keepP].reduce((a, i) => a + pr[i], 0);
    $('#bars', el).innerHTML = order.map(i => `<span>${words[i]} <span class="note-s">(z=${logits[i]})</span></span><div class="bar ${keepP.has(i) ? '' : 'off'}" style="width:${pr[i] * 100}%"></div><span class="val">${fmt(pr[i], 3)}${keepP.has(i) ? ' → ' + fmt(pr[i] / Z, 3) : ''}</span>`).join('');
    $('#out', el).innerHTML = `<span class="hand">Giữ ${keepP.size} token, tổng xác suất trước chuẩn hóa = ${fmt(Z, 3)}</span><div class="note-s">Cột phải: xác suất sau softmax(z/T) → sau khi lọc và chia lại cho tổng. Top-k cắt theo số lượng; top-p cắt theo khối xác suất tích lũy.</div>`;
  };
  bindSliders(el, st, upd, { k: v => v }); upd();
};

WT.lora = 'LoRA: tham số đầy đủ vs hạng thấp';
W.lora = el => {
  const st = { d: 4096, k: 4096, r: 8, n: 64 };
  el.innerHTML = `<div class="ctl">${slider('d', 256, 8192, 256, st.d, 'd')}${slider('k', 256, 8192, 256, st.k, 'k')}${slider('hạng r', 1, 128, 1, st.r, 'r')}${slider('số ma trận áp LoRA', 1, 256, 1, st.n, 'n')}</div><div id="vis"></div><div class="calc" id="out"></div>`;
  const upd = () => {
    const full = st.d * st.k, lo = st.r * (st.d + st.k); const S = 150 / Math.max(st.d, st.k); const rw = Math.max(2, st.r * S * 6);
    $('#vis', el).innerHTML = `<div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
      <div style="text-align:center"><div style="width:${st.k * S}px;height:${st.d * S}px;background:var(--line);border-radius:4px;margin:auto"></div><div class="note-s">W₀ (đóng băng) ${st.d}×${st.k}</div></div><span class="hand" style="font-size:26px">+</span>
      <div style="text-align:center"><div style="width:${rw}px;height:${st.d * S}px;background:var(--red);border-radius:3px;margin:auto"></div><div class="note-s">B ${st.d}×${st.r}</div></div><span class="hand" style="font-size:22px">×</span>
      <div style="text-align:center"><div style="width:${st.k * S}px;height:${rw}px;background:var(--pen);border-radius:3px;margin:auto"></div><div class="note-s">A ${st.r}×${st.k}</div></div></div>`;
    $('#out', el).innerHTML = `<span class="hand">Mỗi ma trận: ${st.r}·(${st.d} + ${st.k}) = ${fmtN(lo)} so với ${fmtN(full)} → </span><span class="r">${fmt(100 * lo / full, 3)}%</span><br><span class="hand">Tổng ${st.n} ma trận: ${fmt(lo * st.n / 1e6, 2)}M tham số huấn luyện (thay vì ${fmt(full * st.n / 1e6, 0)}M)</span>`;
  };
  bindSliders(el, st, upd, { d: v => v, k: v => v, r: v => v, n: v => v }); upd();
};

WT.moe = 'Định tuyến một token qua 4 chuyên gia';
W.moe = el => {
  const st = { x: [[1, -0.5]], Wr: [[0.2, 0.1], [1.0, -0.4], [0.6, 0.3], [-0.5, 0.8]], k: 2 };
  const experts = [x => 2 * x[0], x => x[0] - x[1], x => 3 * x[1] + 1, x => -x[0]];
  const ename = ['2x₁', 'x₁ − x₂', '3x₂ + 1', '−x₁'];
  el.innerHTML = `<div class="ctl">${slider('top-k', 1, 4, 1, st.k, 'k')}</div><div class="mats"><div class="mat"><div class="lbl">token x</div>${inputMat(st.x, 'x')}</div><div class="mat"><div class="lbl">Router W<sub>r</sub> (4 × 2)</div>${inputMat(st.Wr, 'Wr')}</div></div>
  <div class="scroll-x" style="margin-top:12px"><table class="steps" id="tb"></table></div><div class="calc" id="out"></div>`;
  const upd = () => {
    readInputs(el, 'x', st.x); readInputs(el, 'Wr', st.Wr); const x = st.x[0];
    const lg = st.Wr.map(r => r[0] * x[0] + r[1] * x[1]); const g = softmaxArr(lg); const order = g.map((v, i) => i).sort((a, b) => g[b] - g[a]); const sel = new Set(order.slice(0, st.k));
    const Z = [...sel].reduce((a, i) => a + g[i], 0); let y = 0; const parts = [];
    $('#tb', el).innerHTML = `<tr><th>Chuyên gia</th><th>logit</th><th>softmax g</th><th>chọn?</th><th>trọng số</th><th>FFN<sub>i</sub>(x) (giả lập)</th></tr>` + g.map((v, i) => {
      const on = sel.has(i), wgt = on ? v / Z : 0, out = experts[i](x); if (on) { y += wgt * out; parts.push(`${fmt(wgt, 3)}·${fmt(out, 2)}`); }
      return `<tr style="${on ? '' : 'opacity:.45'}"><td>E${i + 1}</td><td class="v">${fmt(lg[i], 2)}</td><td class="v">${fmt(v, 3)}</td><td>${on ? '✓' : '—'}</td><td class="v">${on ? fmt(wgt, 3) : '0'}</td><td>${ename[i]} = ${fmt(out, 2)}</td></tr>`; }).join('');
    $('#out', el).innerHTML = `<span class="hand">y = ${parts.join(' + ')} = </span><span class="r">${fmt(y, 3)}</span> <div class="note-s">Chỉ ${st.k}/4 chuyên gia được tính → chi phí ×${st.k}, dung lượng ×4.</div>`;
  };
  el.addEventListener('input', upd); bindSliders(el, st, upd, { k: v => v }); upd();
};
