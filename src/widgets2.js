WT.backprop = 'Một vòng huấn luyện: forward → loss → backward → cập nhật';
W.backprop = el => {
  const init = { x: 1.5, y: 1, w: 0.8, b: -0.5, lr: 1 };
  let st = { ...init }; let hist = [];
  el.innerHTML = `<div class="ctl">${slider('x', -3, 3, 0.1, st.x, 'x')}${slider('nhãn y', 0, 1, 1, st.y, 'y')}${slider('η', 0.1, 5, 0.1, st.lr, 'lr')}
    <button class="btn small solid" id="step">Một bước GD</button><button class="btn small" id="ten">10 bước</button><button class="btn small ghost" id="rst">Đặt lại</button></div>
    <div class="scroll-x"><table class="steps" id="tb"></table></div><div id="cv"></div>`;
  const P = mkCanvas($('#cv', el), 640, 150);
  const comp = () => { const z = st.w * st.x + st.b, a = sig(z), L = 0.5 * (a - st.y) ** 2, dA = a - st.y, dZ = dA * a * (1 - a); return { z, a, L, dA, dZ, dW: dZ * st.x, dB: dZ }; };
  const upd = () => {
    const r = comp();
    $('#tb', el).innerHTML = `<tr><th></th><th>Bước</th><th>Công thức</th><th>Giá trị</th></tr>
    <tr><td rowspan="3" style="color:var(--pen);font-weight:600">Forward</td><td>z</td><td>w·x + b = ${fmt(st.w, 3)}·${fmt(st.x)} + (${fmt(st.b, 3)})</td><td class="v">${fmt(r.z, 4)}</td></tr>
    <tr><td>a</td><td>σ(z)</td><td class="v">${fmt(r.a, 4)}</td></tr>
    <tr><td>L</td><td>½(a − y)²</td><td class="v">${fmt(r.L, 5)}</td></tr>
    <tr><td rowspan="4" style="color:var(--red);font-weight:600">Backward</td><td>∂L/∂a</td><td>a − y</td><td class="v">${fmt(r.dA, 4)}</td></tr>
    <tr><td>∂L/∂z</td><td>∂L/∂a · a(1 − a) = ${fmt(r.dA, 4)} · ${fmt(r.a * (1 - r.a), 4)}</td><td class="v">${fmt(r.dZ, 4)}</td></tr>
    <tr><td>∂L/∂w</td><td>∂L/∂z · x</td><td class="v">${fmt(r.dW, 4)}</td></tr>
    <tr><td>∂L/∂b</td><td>∂L/∂z · 1</td><td class="v">${fmt(r.dB, 4)}</td></tr>
    <tr><td style="color:var(--leaf);font-weight:600">Update</td><td>w, b</td><td>w − η·∂L/∂w, b − η·∂L/∂b</td><td class="v">${fmt(st.w - st.lr * r.dW, 4)}, ${fmt(st.b - st.lr * r.dB, 4)}</td></tr>`;
    const Lmax = Math.max(0.02, ...hist, r.L) * 1.1; const n = Math.max(10, hist.length + 1);
    const F = plotFrame(P, [0, n], [0, Lmax], { xl: 'bước' });
    const pts = [...hist, r.L]; P.g.strokeStyle = cssv('red'); P.g.lineWidth = 2; P.g.beginPath(); pts.forEach((v, i) => { i ? P.g.lineTo(F.X(i), F.Y(v)) : P.g.moveTo(F.X(i), F.Y(v)); }); P.g.stroke();
    pts.forEach((v, i) => dot(P, F.X(i), F.Y(v), cssv('red'), 3));
  };
  const step = () => { const r = comp(); hist.push(r.L); st.w -= st.lr * r.dW; st.b -= st.lr * r.dB; };
  $('#step', el).onclick = () => { step(); upd(); };
  $('#ten', el).onclick = () => { for (let i = 0; i < 10; i++) step(); upd(); };
  $('#rst', el).onclick = () => { st.w = init.w; st.b = init.b; hist = []; upd(); };
  bindSliders(el, st, () => { hist = []; upd(); }); upd();
};

WT.optim = 'SGD vs Momentum vs Adam trên thung lũng hẹp';
W.optim = el => {
  const st = { lr: 0.2, n: 40 };
  el.innerHTML = `<div class="ctl">${slider('η', 0.02, 0.5, 0.01, st.lr, 'lr')}${slider('số bước', 5, 150, 1, st.n, 'n')}</div><div id="cv"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 640, 320);
  const f = (x, y) => 0.1 * x * x + 2 * y * y, gr = (x, y) => [0.2 * x, 4 * y];
  const run = type => {
    let x = -4.5, y = 1.6, vx = 0, vy = 0, mx = 0, my = 0, sx = 0, sy = 0; const path = [[x, y]];
    for (let t = 1; t <= st.n; t++) {
      const [gx, gy] = gr(x, y);
      if (type === 'sgd') { x -= st.lr * gx; y -= st.lr * gy; }
      else if (type === 'mom') { vx = 0.9 * vx + gx; vy = 0.9 * vy + gy; x -= st.lr * vx; y -= st.lr * vy; }
      else { mx = 0.9 * mx + 0.1 * gx; my = 0.9 * my + 0.1 * gy; sx = 0.999 * sx + 0.001 * gx * gx; sy = 0.999 * sy + 0.001 * gy * gy;
        const bx = mx / (1 - 0.9 ** t), by = my / (1 - 0.9 ** t), cx = sx / (1 - 0.999 ** t), cy = sy / (1 - 0.999 ** t);
        x -= st.lr * bx / (Math.sqrt(cx) + 1e-8); y -= st.lr * by / (Math.sqrt(cy) + 1e-8); }
      if (!isFinite(x) || Math.abs(x) > 1e3 || Math.abs(y) > 1e3) break;
      path.push([x, y]);
    }
    return path;
  };
  const upd = () => {
    const F = plotFrame(P, [-5, 5], [-2, 2]); const g = P.g;
    g.strokeStyle = cssv('line'); g.lineWidth = 1.2;
    [0.05, 0.2, 0.5, 1, 1.8, 3, 4.5].forEach(c => { g.beginPath(); for (let i = 0; i <= 100; i++) { const t = i / 100 * 2 * Math.PI; const x = Math.sqrt(c / 0.1) * Math.cos(t), y = Math.sqrt(c / 2) * Math.sin(t); i ? g.lineTo(F.X(x), F.Y(y)) : g.moveTo(F.X(x), F.Y(y)); } g.stroke(); });
    const cols = { sgd: cssv('muted'), mom: cssv('red'), adam: cssv('pen') }; const res = {};
    Object.keys(cols).forEach(k => { const p = run(k); res[k] = p[p.length - 1]; g.strokeStyle = cols[k]; g.lineWidth = 2; g.beginPath(); p.forEach(([x, y], i) => i ? g.lineTo(F.X(x), F.Y(y)) : g.moveTo(F.X(x), F.Y(y))); g.stroke(); p.forEach(([x, y]) => dot(P, F.X(x), F.Y(y), cols[k], 2.2)); });
    dot(P, F.X(0), F.Y(0), cssv('leaf'), 5);
    $('#out', el).innerHTML = `<div class="legend"><span><i style="background:var(--muted)"></i>SGD: f = ${fmt(f(...res.sgd), 4)}</span><span><i style="background:var(--red)"></i>Momentum β=0.9: f = ${fmt(f(...res.mom), 4)}</span><span><i style="background:var(--pen)"></i>Adam: f = ${fmt(f(...res.adam), 4)}</span></div>
    <p class="note-s">f(x, y) = 0.1x² + 2y²: dốc gấp 20 lần theo y so với x. SGD đi rất chậm theo x; Momentum tích lũy tốc độ theo x nhưng dao động; Adam chuẩn hóa bước theo từng trục. Thử η = 0.5 để thấy SGD dao động mạnh theo y.</p>`;
  };
  bindSliders(el, st, upd, { n: v => v }); upd();
};

WT.norm = 'BatchNorm vs LayerNorm trên cùng một ma trận';
W.norm = el => {
  let X = [[2, 4, 6], [1, 0, 5], [3, 8, 1], [6, 4, 0]];
  const nz = arr => { const m = arr.reduce((a, b) => a + b, 0) / arr.length; const v = arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length; return { m, s: Math.sqrt(v + 1e-5), out: arr.map(x => (x - m) / Math.sqrt(v + 1e-5)) }; };
  const draw = () => {
    const ln = X.map(r => nz(r)); const bnc = T(X).map(c => nz(c)); const BN = T(bnc.map(c => c.out));
    el.innerHTML = `<div class="ctl"><button class="btn small" id="rnd">Đổi số</button><span class="note-s" style="margin:0">Hàng = mẫu trong batch, cột = đặc trưng (hoặc kênh).</span></div>
    <div class="mats">${matHTML(X, { label: 'X <i>(4 mẫu × 3 đặc trưng)</i>', d: 1 })}
      <div class="mat"><div class="lbl">BatchNorm: μ, σ theo <span style="color:var(--pen)">cột</span></div>${matHTML(BN, { heat: true })}<div class="note-s">μ = [${bnc.map(c => fmt(c.m)).join(', ')}]<br>σ = [${bnc.map(c => fmt(c.s)).join(', ')}]</div></div>
      <div class="mat"><div class="lbl">LayerNorm: μ, σ theo <span style="color:var(--red)">hàng</span></div>${matHTML(ln.map(r => r.out), { heat: true })}<div class="note-s">μ = [${ln.map(r => fmt(r.m)).join(', ')}]<br>σ = [${ln.map(r => fmt(r.s)).join(', ')}]</div></div></div>
    <div class="calc"><span class="hand">Ví dụ ô [1,1] với LN: (${fmt(X[0][0])} − ${fmt(ln[0].m)}) / ${fmt(ln[0].s)} = </span><span class="r">${fmt(ln[0].out[0])}</span> &nbsp; <span class="hand">với BN: (${fmt(X[0][0])} − ${fmt(bnc[0].m)}) / ${fmt(bnc[0].s)} = </span><span class="r">${fmt(bnc[0].out[0])}</span></div>`;
    $('#rnd', el).onclick = () => { X = X.map(r => r.map(() => randInt(0, 9))); draw(); };
  };
  draw();
};

/* ================= GIAI ĐOẠN 2 ================= */
const KERNELS = {
  'Sobel dọc': [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]],
  'Sobel ngang': [[-1, -2, -1], [0, 0, 0], [1, 2, 1]],
  'Làm mờ (×1/9)': [[1, 1, 1], [1, 1, 1], [1, 1, 1]].map(r => r.map(v => v / 9)),
  'Làm sắc': [[0, -1, 0], [-1, 5, -1], [0, -1, 0]],
  'Laplace': [[0, 1, 0], [1, -4, 1], [0, 1, 0]],
};
WT.conv = 'Tích chập 3×3 trên ảnh đường mạch bị đứt';
W.conv = el => {
  // 7×7 "copper trace" with a break at row 3
  const IMG = [[0, 0, 9, 9, 0, 0, 0], [0, 0, 9, 9, 0, 0, 0], [0, 0, 9, 9, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 9, 9, 0, 0, 0], [0, 0, 9, 9, 0, 0, 0], [0, 0, 9, 9, 9, 9, 9]];
  let kname = 'Sobel dọc', K = KERNELS[kname].map(r => r.slice()), P = 0, S = 1, sel = [0, 0];
  const conv = () => {
    const X = P ? [Array(7 + 2 * P).fill(0), ...IMG.map(r => [0, ...r, 0]), Array(7 + 2 * P).fill(0)] : IMG;
    const N = X.length, n = Math.floor((N - 3) / S) + 1; const Y = [];
    for (let i = 0; i < n; i++) { Y.push([]); for (let j = 0; j < n; j++) { let s = 0; for (let u = 0; u < 3; u++) for (let v = 0; v < 3; v++) s += X[i * S + u][j * S + v] * K[u][v]; Y[i].push(s); } }
    return { X, Y };
  };
  const draw = () => {
    const { X, Y } = conv(); if (sel[0] >= Y.length || sel[1] >= Y.length) sel = [0, 0];
    const [i, j] = sel; const r0 = i * S, c0 = j * S;
    const terms = []; for (let u = 0; u < 3; u++) for (let v = 0; v < 3; v++) if (K[u][v] !== 0 && X[r0 + u][c0 + v] !== 0) terms.push(`${fmt(X[r0 + u][c0 + v])}·${fmt(K[u][v])}`);
    el.innerHTML = `<div class="ctl"><label>Kernel <select id="kn">${Object.keys(KERNELS).map(k => `<option${k === kname ? ' selected' : ''}>${k}</option>`).join('')}</select></label>
      <label>Padding <select id="pd"><option value="0"${P === 0 ? ' selected' : ''}>0</option><option value="1"${P === 1 ? ' selected' : ''}>1</option></select></label>
      <label>Stride <select id="sd"><option value="1"${S === 1 ? ' selected' : ''}>1</option><option value="2"${S === 2 ? ' selected' : ''}>2</option></select></label></div>
    <div class="scroll-x"><div class="mats" style="flex-wrap:nowrap;width:max-content">
      ${matHTML(X, { label: `Ảnh vào <i>(${X.length}×${X.length})</i>`, d: 0, cls: (r, c) => r >= r0 && r < r0 + 3 && c >= c0 && c < c0 + 3 ? 'hl' : (P && (r === 0 || c === 0 || r === X.length - 1 || c === X.length - 1) ? 'dim' : '') })}
      <div class="mat"><div class="lbl">Kernel <i>(sửa được)</i></div>${inputMat(K.map(r => r.map(v => +v.toFixed(3))), 'K')}</div>
      ${matHTML(Y, { label: `Đầu ra <i>(${Y.length}×${Y.length})</i>`, heat: true, click: true, d: 1, id: 'Y', cls: (r, c) => r === i && c === j ? 'hl2' : '' })}
    </div></div>
    <div class="calc"><span class="hand">Y[${i + 1},${j + 1}] = ${terms.length ? terms.join(' + ') : '0'} = </span><span class="r">${fmt(Y[i][j], 2)}</span>
    <div class="note-s">Kích thước: ⌊(7 + 2·${P} − 3)/${S}⌋ + 1 = ${Y.length}. Ô xanh đậm nhất là nơi kernel “thấy” mẫu nó tìm; hãy xem đầu ra quanh hàng 4, chỗ đường mạch bị đứt.</div></div>`;
    $('#kn', el).onchange = e => { kname = e.target.value; K = KERNELS[kname].map(r => r.slice()); draw(); };
    $('#pd', el).onchange = e => { P = +e.target.value; draw(); };
    $('#sd', el).onchange = e => { S = +e.target.value; sel = [0, 0]; draw(); };
    $$('#Y td', el).forEach(td => td.onclick = () => { sel = [+td.dataset.i, +td.dataset.j]; draw(); });
    $$('input[data-m="K"]', el).forEach(inp => inp.onchange = () => { readInputs(el, 'K', K); draw(); });
  };
  sel = [2, 0]; draw();
};

WT.convcalc = 'Máy tính kích thước, tham số & max pooling';
W.convcalc = el => {
  const st = { N: 224, K: 7, P: 3, S: 2, Ci: 3, Co: 64 };
  let M = [[1, 3, 2, 0], [5, 4, 1, 1], [0, 2, 6, 7], [1, 1, 8, 2]];
  el.innerHTML = `<div class="ctl">${slider('N vào', 4, 512, 1, st.N, 'N')}${slider('Kernel K', 1, 11, 1, st.K, 'K')}${slider('Padding P', 0, 5, 1, st.P, 'P')}${slider('Stride S', 1, 4, 1, st.S, 'S')}${slider('C vào', 1, 512, 1, st.Ci, 'Ci')}${slider('C ra', 1, 1024, 1, st.Co, 'Co')}</div>
  <div class="calc" id="out"></div><h4 style="margin:20px 0 8px;font-size:15px">Max pooling 2×2, stride 2</h4><div class="ctl"><button class="btn small" id="rnd">Đổi số</button></div><div id="mp"></div>`;
  const upd = () => {
    const n = Math.floor((st.N + 2 * st.P - st.K) / st.S) + 1; const prm = st.K * st.K * st.Ci * st.Co + st.Co; const mac = n * n * st.K * st.K * st.Ci * st.Co;
    $('#out', el).innerHTML = n < 1 ? '<span class="r">Kernel lớn hơn ảnh đã padding, đầu ra không hợp lệ.</span>' :
      `<span class="hand">N<sub>ra</sub> = ⌊(${st.N} + 2·${st.P} − ${st.K}) / ${st.S}⌋ + 1 = </span><span class="r">${n}</span> → shape <b>${n}×${n}×${st.Co}</b><br>
       <span class="hand">Tham số = ${st.K}·${st.K}·${st.Ci}·${st.Co} + ${st.Co} = </span><span class="r">${fmtN(prm)}</span><br>
       <span class="hand">MACs = ${n}²·${st.K}²·${st.Ci}·${st.Co} = </span><span class="r">${fmtN(mac)}</span> <span class="note-s">(≈ ${fmt(mac / 1e9, 2)} G)</span>`;
  };
  const mp = () => {
    const out = [[0, 0], [0, 0]]; for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) out[i][j] = Math.max(M[2 * i][2 * j], M[2 * i][2 * j + 1], M[2 * i + 1][2 * j], M[2 * i + 1][2 * j + 1]);
    $('#mp', el).innerHTML = `<div class="mats">${matHTML(M, { d: 0, cls: (r, c) => { const blk = (Math.floor(r / 2) + Math.floor(c / 2)) % 2 ? 'hl2' : 'hl'; return M[r][c] === out[Math.floor(r / 2)][Math.floor(c / 2)] ? blk : ''; } })}${matHTML(out, { d: 0, label: 'Kết quả 2×2' })}</div>`;
  };
  $('#rnd', el).onclick = () => { M = M.map(r => r.map(() => randInt(0, 9))); mp(); };
  bindSliders(el, st, upd, { N: v => v, K: v => v, P: v => v, S: v => v, Ci: v => v, Co: v => v }); upd(); mp();
};

WT.mconv = 'Tích chập trên ảnh 2 kênh';
W.mconv = el => {
  let X1 = [[1, 0, 2, 1], [0, 1, 3, 0], [2, 1, 0, 1], [1, 0, 1, 2]], X2 = [[0, 2, 1, 0], [1, 1, 0, 2], [0, 3, 1, 1], [2, 0, 0, 1]];
  let K1 = [[1, -1], [0, 2]], K2 = [[2, 0], [-1, 1]], b = 1, sel = [0, 0];
  const cv = (X, K) => [0, 1, 2].map(i => [0, 1, 2].map(j => X[i][j] * K[0][0] + X[i][j + 1] * K[0][1] + X[i + 1][j] * K[1][0] + X[i + 1][j + 1] * K[1][1]));
  const draw = () => {
    const Y1 = cv(X1, K1), Y2 = cv(X2, K2), Y = Y1.map((r, i) => r.map((v, j) => v + Y2[i][j] + b)); const [i, j] = sel;
    const win = (r, c) => r >= i && r < i + 2 && c >= j && c < j + 2 ? 'hl' : '';
    const ex = (X, K) => `${X[i][j]}·${K[0][0]} + ${X[i][j + 1]}·${K[0][1]} + ${X[i + 1][j]}·${K[1][0]} + ${X[i + 1][j + 1]}·${K[1][1]}`;
    el.innerHTML = `<div class="ctl"><button class="btn small" id="rnd">Đổi số</button><span class="note-s" style="margin:0">Bấm một ô đầu ra.</span></div>
    <div class="scroll-x"><div class="mats" style="width:max-content">
      ${matHTML(X1, { label: 'Kênh 1', d: 0, cls: win })}${matHTML(K1, { label: 'K kênh 1', d: 0 })}${matHTML(Y1, { label: 'X₁ ∗ K₁', d: 0, cls: (r, c) => r === i && c === j ? 'hl' : '' })}
    </div><div class="mats" style="width:max-content;margin-top:10px">
      ${matHTML(X2, { label: 'Kênh 2', d: 0, cls: win })}${matHTML(K2, { label: 'K kênh 2', d: 0 })}${matHTML(Y2, { label: 'X₂ ∗ K₂', d: 0, cls: (r, c) => r === i && c === j ? 'hl' : '' })}
      ${matHTML(Y, { label: `Tổng + b (b = ${b})`, d: 0, click: true, id: 'Y', heat: true, cls: (r, c) => r === i && c === j ? 'hl2' : '' })}
    </div></div>
    <div class="calc"><span class="hand">(${ex(X1, K1)}) + (${ex(X2, K2)}) + ${b} = ${Y1[i][j]} + ${Y2[i][j]} + ${b} = </span><span class="r">${Y[i][j]}</span>
    <div class="note-s">Một bộ lọc = 2 lát kernel (mỗi kênh một lát) → một bản đồ đầu ra. Muốn 64 kênh ra thì cần 64 bộ lọc như vậy.</div></div>`;
    $$('#Y td', el).forEach(td => td.onclick = () => { sel = [+td.dataset.i, +td.dataset.j]; draw(); });
    $('#rnd', el).onclick = () => { const r = () => [0, 1, 2, 3].map(() => [0, 1, 2, 3].map(() => randInt(0, 3))); X1 = r(); X2 = r(); K1 = [[randInt(-2, 2), randInt(-2, 2)], [randInt(-2, 2), randInt(-2, 2)]]; K2 = [[randInt(-2, 2), randInt(-2, 2)], [randInt(-2, 2), randInt(-2, 2)]]; draw(); };
  };
  draw();
};

WT.rf = 'Tính trường tiếp nhận qua các lớp';
W.rf = el => {
  const PRE = { '3 conv 3×3': [[3, 1], [3, 1], [3, 1]], 'ResNet stem': [[7, 2], [3, 2], [3, 1], [3, 1]], 'VGG (2 block)': [[3, 1], [3, 1], [2, 2], [3, 1], [3, 1], [2, 2]], 'ViT patch 16': [[16, 16]] };
  let L = PRE['ResNet stem'].map(r => r.slice());
  const draw = () => {
    let r = 1, j = 1; let rows = '<tr><th>Lớp</th><th>k</th><th>s</th><th>r = r<sub>trước</sub> + (k−1)·J</th><th>J (bước nhảy tích lũy)</th></tr><tr><td>ảnh</td><td></td><td></td><td class="v">1</td><td class="v">1</td></tr>';
    L.forEach(([k, s], i) => { const r2 = r + (k - 1) * j; rows += `<tr><td>${i + 1}</td><td><input class="num" data-l="${i}" data-c="0" value="${k}"></td><td><input class="num" data-l="${i}" data-c="1" value="${s}"></td><td class="v">${r} + ${k - 1}·${j} = ${r2}</td><td class="v">${j * s}</td></tr>`; r = r2; j *= s; });
    el.innerHTML = `<div class="ctl">${Object.keys(PRE).map(k => `<button class="btn small ghost" data-p="${k}">${k}</button>`).join('')}<button class="btn small" id="add">+ lớp 3×3</button><button class="btn small ghost" id="del">− bỏ lớp cuối</button></div>
    <div class="scroll-x"><table class="steps">${rows}</table></div><div class="calc"><span class="hand">Trường tiếp nhận cuối = </span><span class="r">${r}×${r}</span> <span class="note-s">pixel · mỗi ô đầu ra cách nhau ${j} pixel trên ảnh gốc.</span></div>`;
    $$('[data-p]', el).forEach(b => b.onclick = () => { L = PRE[b.dataset.p].map(r => r.slice()); draw(); });
    $('#add', el).onclick = () => { L.push([3, 1]); draw(); };
    $('#del', el).onclick = () => { if (L.length > 1) L.pop(); draw(); };
    $$('input[data-l]', el).forEach(inp => inp.onchange = () => { const v = Math.max(1, parseInt(inp.value) || 1); L[+inp.dataset.l][+inp.dataset.c] = v; draw(); });
  };
  draw();
};

WT.resgrad = 'ResNet như tập hợp nhiều đường đi';
W.resgrad = el => {
  const st = { L: 20, a: 0.5 };
  el.innerHTML = `<div class="ctl">${slider('Số khối L', 2, 50, 1, st.L, 'L')}${slider('Hệ số gradient mỗi nhánh F', 0.1, 1.2, 0.05, st.a, 'a')}</div><div id="cv"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 640, 260);
  const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; };
  const upd = () => {
    const L = st.L, a = st.a; const cnt = [], gc = [];
    for (let k = 0; k <= L; k++) { cnt.push(C(L, k)); gc.push(C(L, k) * a ** k); }
    const sc = Math.max(...cnt), sg = Math.max(...gc);
    const F = plotFrame(P, [-0.5, L + 0.5], [0, 1.05], { xl: 'số khối F trên đường đi (k)' });
    const bw = Math.max(1, (F.X(1) - F.X(0)) * 0.38);
    for (let k = 0; k <= L; k++) { P.g.fillStyle = cssv('line'); P.g.fillRect(F.X(k) - bw, F.Y(cnt[k] / sc), bw, F.Y(0) - F.Y(cnt[k] / sc)); P.g.fillStyle = cssv('red'); P.g.fillRect(F.X(k), F.Y(gc[k] / sg), bw, F.Y(0) - F.Y(gc[k] / sg)); }
    const total = gc.reduce((x, y) => x + y, 0); let acc = 0, k90 = 0; for (let k = 0; k <= L; k++) { acc += gc[k]; if (acc / total >= 0.9) { k90 = k; break; } }
    $('#out', el).innerHTML = `<div class="legend"><span><i style="background:var(--line);height:10px"></i>số đường đi có độ dài k: C(L,k)</span><span><i style="background:var(--red);height:10px"></i>đóng góp gradient: C(L,k)·a<sup>k</sup></span></div>
    <p class="note-s">Mạng ResNet ${L} khối chứa 2<sup>${L}</sup> đường đi. 90% gradient đến từ các đường đi qua ≤ ${k90} khối. Mạng thường (không tắt) chỉ có một đường dài ${L}, gradient cỡ a<sup>L</sup> = ${a ** L < 1e-4 ? (a ** L).toExponential(1) : fmt(a ** L, 4)}.</p>`;
  };
  bindSliders(el, st, upd, { L: v => v }); upd();
};

WT.dwcalc = 'Conv thường vs depthwise separable';
W.dwcalc = el => {
  const st = { K: 3, Ci: 256, Co: 256, H: 28 };
  el.innerHTML = `<div class="ctl">${slider('K', 1, 7, 2, st.K, 'K')}${slider('C vào', 8, 1024, 8, st.Ci, 'Ci')}${slider('C ra', 8, 1024, 8, st.Co, 'Co')}${slider('H = W', 7, 112, 7, st.H, 'H')}</div><div class="bars" id="bars"></div><div class="calc" id="out"></div>`;
  const upd = () => {
    const std = st.K * st.K * st.Ci * st.Co, dw = st.K * st.K * st.Ci, pw = st.Ci * st.Co, ds = dw + pw, mx = std;
    $('#bars', el).innerHTML = `<span>Thường</span><div class="bar" style="width:100%"></div><span class="val">${fmtN(std)}</span>
      <span>Depthwise</span><div class="bar red" style="width:${100 * dw / mx}%"></div><span class="val">${fmtN(dw)}</span>
      <span>Pointwise 1×1</span><div class="bar red" style="width:${100 * pw / mx}%"></div><span class="val">${fmtN(pw)}</span>`;
    $('#out', el).innerHTML = `<span class="hand">Tỷ lệ = (${fmtN(dw)} + ${fmtN(pw)}) / ${fmtN(std)} = </span><span class="r">${fmt(ds / std, 3)}</span> <span class="note-s">→ nhỏ hơn ${fmt(std / ds, 1)} lần · MACs ${fmt(std * st.H * st.H / 1e6, 1)}M → ${fmt(ds * st.H * st.H / 1e6, 1)}M</span>`;
  };
  bindSliders(el, st, upd, { K: v => v, Ci: v => v, Co: v => v, H: v => v }); upd();
};

WT.iou = 'IoU giữa hai hộp';
W.iou = el => {
  const st = { x: 3, y: 2, w: 5, h: 4 }; const A = { x: 1, y: 1, w: 5, h: 5 };
  el.innerHTML = `<div class="ctl">${slider('B: x', 0, 9, 1, st.x, 'x')}${slider('B: y', 0, 9, 1, st.y, 'y')}${slider('B: rộng', 1, 8, 1, st.w, 'w')}${slider('B: cao', 1, 8, 1, st.h, 'h')}</div><div id="cv" style="max-width:360px"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 360, 360);
  const upd = () => {
    const g = P.g, s = 30, o = 15; g.clearRect(0, 0, 360, 360); g.fillStyle = cssv('sheet'); g.fillRect(0, 0, 360, 360);
    g.strokeStyle = cssv('line'); g.lineWidth = 1; for (let i = 0; i <= 11; i++) { g.beginPath(); g.moveTo(o + i * s, o); g.lineTo(o + i * s, o + 11 * s); g.stroke(); g.beginPath(); g.moveTo(o, o + i * s); g.lineTo(o + 11 * s, o + i * s); g.stroke(); }
    const B = st; const ix = Math.max(0, Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x)), iy = Math.max(0, Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y));
    const inter = ix * iy, uni = A.w * A.h + B.w * B.h - inter;
    if (inter) { g.fillStyle = cssv('red'); g.globalAlpha = .3; g.fillRect(o + Math.max(A.x, B.x) * s, o + Math.max(A.y, B.y) * s, ix * s, iy * s); g.globalAlpha = 1; }
    g.lineWidth = 2.5; g.strokeStyle = cssv('pen'); g.strokeRect(o + A.x * s, o + A.y * s, A.w * s, A.h * s);
    g.setLineDash([7, 4]); g.strokeStyle = cssv('red'); g.strokeRect(o + B.x * s, o + B.y * s, B.w * s, B.h * s); g.setLineDash([]);
    g.font = '15px ' + cssv('f-hand'); g.fillStyle = cssv('pen'); g.fillText('A (nhãn)', o + A.x * s + 4, o + A.y * s + 18); g.fillStyle = cssv('red'); g.fillText('B (dự đoán)', o + B.x * s + 4, o + (B.y + B.h) * s - 6);
    $('#out', el).innerHTML = `<span class="hand">Giao = ${ix}×${iy} = ${inter} · Hợp = ${A.w * A.h} + ${B.w * B.h} − ${inter} = ${uni} · IoU = </span><span class="r">${fmt(inter / uni, 3)}</span> <span class="note-s">${inter / uni >= 0.5 ? '≥ 0.5: tính là phát hiện đúng.' : '< 0.5: thường bị tính là sai.'}</span>`;
  };
  bindSliders(el, st, upd, { x: v => v, y: v => v, w: v => v, h: v => v }); upd();
};

/* ================= GIAI ĐOẠN 3 ================= */
WT.rnn = 'RNN vô hướng chạy từng bước';
W.rnn = el => {
  const st = { wh: 0.5, wx: 1 }; const xs = [[1, 0, 0, 0, 0, 0]];
  el.innerHTML = `<div class="ctl">${slider('w<sub>h</sub>', -1.5, 1.5, 0.05, st.wh, 'wh')}${slider('w<sub>x</sub>', -2, 2, 0.1, st.wx, 'wx')}</div><div class="ctl">chuỗi x: ${inputMat(xs, 'x')}</div><div class="scroll-x"><table class="steps" id="tb"></table></div><div class="calc" id="out"></div>`;
  const upd = () => {
    readInputs(el, 'x', xs); let h = 0, rows = '<tr><th>t</th><th>x<sub>t</sub></th><th>w<sub>h</sub>·h<sub>t−1</sub> + w<sub>x</sub>·x<sub>t</sub></th><th>h<sub>t</sub> = tanh(·)</th><th style="width:30%"></th></tr>'; let grad = 1; const hs = [];
    xs[0].forEach((x, t) => { const pre = st.wh * h + st.wx * x; h = Math.tanh(pre); hs.push(h); if (t > 0) grad *= (1 - h * h) * st.wh; rows += `<tr><td>${t + 1}</td><td class="v">${fmt(x)}</td><td>${fmt(st.wh)}·${fmt(hs[t - 1] ?? 0, 3)} + ${fmt(st.wx)}·${fmt(x)} = ${fmt(pre, 3)}</td><td class="v">${fmt(h, 3)}</td><td><div class="bar ${h < 0 ? 'red' : ''}" style="width:${Math.abs(h) * 100}%"></div></td></tr>`; });
    $('#tb', el).innerHTML = rows;
    $('#out', el).innerHTML = `<span class="hand">∂h<sub>6</sub>/∂h<sub>1</sub> = Π (1 − h<sub>t</sub>²)·w<sub>h</sub> = </span><span class="r">${Math.abs(grad) < 1e-3 ? grad.toExponential(2) : fmt(grad, 4)}</span><div class="note-s">${Math.abs(grad) < 0.05 ? 'Gradient gần như biến mất: RNN “quên” bước đầu.' : 'Gradient còn đáng kể. Thử |w<sub>h</sub>| > 1 và đầu vào lớn để thấy bão hòa tanh.'}</div>`;
  };
  el.addEventListener('input', upd); bindSliders(el, st, upd); upd();
};
