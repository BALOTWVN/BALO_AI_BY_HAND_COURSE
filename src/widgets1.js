/* ================= WIDGET HELPERS ================= */
const W = {}, WT = {};
const fmt = (x, d = 2) => { if (!isFinite(x)) return x > 0 ? '∞' : '−∞'; const v = Math.round(x * 10 ** d) / 10 ** d; return (Object.is(v, -0) ? 0 : v).toString().replace('-', '−'); };
const fmtN = x => Math.round(x).toLocaleString('vi-VN');
const cssv = n => getComputedStyle(document.documentElement).getPropertyValue('--' + n).trim();
const sig = x => 1 / (1 + Math.exp(-x));
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
function softmaxArr(z) { const m = Math.max(...z.filter(isFinite)); const e = z.map(v => isFinite(v) ? Math.exp(v - m) : 0); const s = e.reduce((a, b) => a + b, 0); return e.map(v => v / s); }
function matmul(A, B) { return A.map(r => B[0].map((_, j) => r.reduce((s, a, k) => s + a * B[k][j], 0))); }
const T = M => M[0].map((_, j) => M.map(r => r[j]));
// seeded RNG for repeatable noise
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function gaussRng(seed) { const r = rng(seed); return () => { let u = 0, v = 0; while (u === 0) u = r(); v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }; }

// heat color for a cell: positive = pen, negative = red
function heat(v, max) { if (!max) return ''; const p = Math.min(1, Math.abs(v) / max) * 42; return `background:color-mix(in srgb, ${v >= 0 ? 'var(--pen)' : 'var(--red)'} ${p.toFixed(0)}%, var(--sheet))`; }
function matHTML(M, o = {}) {
  const mx = o.heat ? Math.max(...M.flat().map(Math.abs), 1e-9) : 0;
  let s = `<div class="mat">${o.label ? `<div class="lbl">${o.label}</div>` : ''}<table class="m"${o.id ? ` id="${o.id}"` : ''}>`;
  M.forEach((r, i) => { s += '<tr>' + r.map((v, j) => { const c = o.cls ? o.cls(i, j) : ''; return `<td class="${c}${o.click ? ' click' : ''}" data-i="${i}" data-j="${j}" style="${o.heat ? heat(v, mx) : ''}">${typeof v === 'string' ? v : fmt(v, o.d ?? 2)}</td>`; }).join('') + '</tr>'; });
  return s + '</table></div>';
}
function inputMat(M, name) {
  return `<table class="m">${M.map((r, i) => '<tr>' + r.map((v, j) => `<td style="padding:1px"><input class="num" data-m="${name}" data-i="${i}" data-j="${j}" value="${v}" inputmode="decimal" aria-label="${name}[${i},${j}]"></td>`).join('') + '</tr>').join('')}</table>`;
}
function readInputs(root, name, M) { $$(`input[data-m="${name}"]`, root).forEach(inp => { const v = parseFloat(inp.value.replace(',', '.').replace('−', '-')); M[+inp.dataset.i][+inp.dataset.j] = isNaN(v) ? 0 : v; }); }
let _sid = 0;
function slider(label, min, max, step, val, key) { const id = 'sl' + (++_sid); return `<label for="${id}">${label} <input type="range" id="${id}" data-k="${key}" min="${min}" max="${max}" step="${step}" value="${val}"><output data-o="${key}">${val}</output></label>`; }
function bindSliders(root, st, cb, fmtFn) {
  $$('input[type=range]', root).forEach(inp => {
    const k = inp.dataset.k; const o = $(`output[data-o="${k}"]`, root);
    const show = () => { if (o) o.textContent = fmtFn && fmtFn[k] ? fmtFn[k](st[k]) : fmt(st[k], 2); };
    inp.addEventListener('input', () => { st[k] = parseFloat(inp.value); show(); cb(); });
    show();
  });
}
// canvas with DPR + plot helpers
function mkCanvas(el, w = 640, h = 300) {
  const c = document.createElement('canvas'); c.className = 'plot'; const dpr = window.devicePixelRatio || 1;
  c.width = w * dpr; c.height = h * dpr; c.style.aspectRatio = w + '/' + h; el.appendChild(c);
  const g = c.getContext('2d'); g.scale(dpr, dpr); c._w = w; c._h = h; return { c, g, w, h };
}
function plotFrame(P, xr, yr, opt = {}) {
  const { g, w, h } = P; const m = { l: 44, r: 14, t: 14, b: 30 };
  if (P._clip) { g.restore(); P._clip = false; }
  g.clearRect(0, 0, w, h); g.fillStyle = cssv('sheet'); g.fillRect(0, 0, w, h);
  const X = x => m.l + (x - xr[0]) / (xr[1] - xr[0]) * (w - m.l - m.r);
  const Y = y => h - m.b - (y - yr[0]) / (yr[1] - yr[0]) * (h - m.t - m.b);
  g.strokeStyle = cssv('line'); g.lineWidth = 1; g.font = '11px ' + cssv('f-mono'); g.fillStyle = cssv('muted');
  const tx = opt.xt || nice(xr), ty = opt.yt || nice(yr);
  tx.forEach(v => { g.beginPath(); g.moveTo(X(v), m.t); g.lineTo(X(v), h - m.b); g.stroke(); g.textAlign = 'center'; g.fillText(fmt(v, 2), X(v), h - m.b + 15); });
  ty.forEach(v => { g.beginPath(); g.moveTo(m.l, Y(v)); g.lineTo(w - m.r, Y(v)); g.stroke(); g.textAlign = 'right'; g.fillText(fmt(v, 2), m.l - 6, Y(v) + 4); });
  g.strokeStyle = cssv('muted'); g.lineWidth = 1.2;
  if (yr[0] < 0 && yr[1] > 0) { g.beginPath(); g.moveTo(m.l, Y(0)); g.lineTo(w - m.r, Y(0)); g.stroke(); }
  if (xr[0] < 0 && xr[1] > 0) { g.beginPath(); g.moveTo(X(0), m.t); g.lineTo(X(0), h - m.b); g.stroke(); }
  if (opt.xl) { g.textAlign = 'right'; g.fillStyle = cssv('muted'); g.fillText(opt.xl, w - m.r, h - m.b - 6); }
  g.save(); g.beginPath(); g.rect(m.l, m.t - 6, w - m.l - m.r, h - m.t - m.b + 6); g.clip(); P._clip = true;
  return { X, Y, m };
}
function nice(r) { const span = r[1] - r[0]; const st = Math.pow(10, Math.floor(Math.log10(span / 5))); const s = [1, 2, 2.5, 5, 10].map(k => k * st).find(k => span / k <= 7); const out = []; for (let v = Math.ceil(r[0] / s) * s; v <= r[1] + 1e-9; v += s) out.push(+v.toFixed(6)); return out; }
function curve(P, F, f, x0, x1, color, width = 2.2, dash = []) {
  const { g } = P; g.strokeStyle = color; g.lineWidth = width; g.setLineDash(dash); g.beginPath();
  const n = 240; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; const y = f(x); const px = F.X(x), py = F.Y(y); i ? g.lineTo(px, py) : g.moveTo(px, py); }
  g.stroke(); g.setLineDash([]);
}
function dot(P, x, y, color, r = 5) { P.g.fillStyle = color; P.g.beginPath(); P.g.arc(x, y, r, 0, 7); P.g.fill(); }

/* ================= GIAI ĐOẠN 0 ================= */
WT.dot = 'Tích vô hướng & cosine';
W.dot = el => {
  const st = { a: [[2, -1, 3, 0.5]], b: [[1, 4, 0, 2]] };
  el.innerHTML = `<div class="ctl"><button class="btn small" id="rnd">Đổi số ngẫu nhiên</button></div>
  <div class="scroll-x"><table class="steps"><tr><th>a</th><td>${inputMat(st.a, 'a')}</td></tr><tr><th>b</th><td>${inputMat(st.b, 'b')}</td></tr><tr><th>a·b từng cột</th><td id="prod"></td></tr></table></div>
  <div class="calc" id="out"></div>`;
  const upd = () => {
    readInputs(el, 'a', st.a); readInputs(el, 'b', st.b);
    const a = st.a[0], b = st.b[0]; const p = a.map((v, i) => v * b[i]); const s = p.reduce((x, y) => x + y, 0);
    const na = Math.hypot(...a), nb = Math.hypot(...b); const cos = s / (na * nb || 1);
    $('#prod', el).innerHTML = matHTML([p], { cls: () => 'hl2' });
    $('#out', el).innerHTML = `<div><span class="hand">a·b = ${p.map(v => fmt(v)).join(' + ')} = </span><span class="r">${fmt(s)}</span></div>
      <div class="res-line"><span>‖a‖ = √(${a.map(v => fmt(v) + '²').join('+')}) = <b>${fmt(na)}</b></span><span>‖b‖ = <b>${fmt(nb)}</b></span><span>cos θ = <b>${fmt(cos, 3)}</b></span><span>θ ≈ <b>${fmt(Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI, 1)}°</b></span></div>
      <p class="note-s">${cos > 0.7 ? 'Hai vector khá cùng hướng.' : cos < -0.3 ? 'Hai vector gần ngược hướng.' : 'Hai vector gần vuông góc: “ít giống nhau”.'}</p>`;
  };
  el.addEventListener('input', upd);
  $('#rnd', el).onclick = () => { $$('input.num', el).forEach(i => i.value = randInt(-4, 4)); upd(); };
  upd();
};

WT.matmul = 'Nhân ma trận hàng × cột';
W.matmul = el => {
  let A, B, sel = [0, 0];
  const gen = () => { A = [...Array(2)].map(() => [...Array(3)].map(() => randInt(-3, 3))); B = [...Array(3)].map(() => [...Array(2)].map(() => randInt(-3, 3))); };
  A = [[1, 2, 0], [-1, 3, 2]]; B = [[2, 1], [0, -1], [1, 3]];
  const draw = () => {
    const C = matmul(A, B); const [i, j] = sel;
    el.innerHTML = `<div class="ctl"><button class="btn small" id="rnd">Đổi số</button><span class="note-s" style="margin:0">Bấm vào một ô của C để xem cách tính.</span></div>
    <div class="scroll-x"><div style="display:grid;grid-template-columns:auto auto;gap:8px 14px;align-items:end;width:max-content">
      <div></div>${matHTML(B, { label: 'B <i>(3×2)</i>', cls: (r, c) => c === j ? 'hl' : 'dim' })}
      ${matHTML(A, { label: 'A <i>(2×3)</i>', cls: (r) => r === i ? 'hl' : 'dim' })}${matHTML(C, { label: 'C = AB <i>(2×2)</i>', click: true, cls: (r, c) => r === i && c === j ? 'hl2' : '', id: 'C' })}
    </div></div>
    <div class="calc"><span class="hand">C[${i + 1},${j + 1}] = ${A[i].map((a, k) => `(${fmt(a)})(${fmt(B[k][j])})`).join(' + ')} = ${A[i].map((a, k) => fmt(a * B[k][j])).join(' + ')} = </span><span class="r">${fmt(C[i][j])}</span></div>`;
    $$('#C td', el).forEach(td => td.onclick = () => { sel = [+td.dataset.i, +td.dataset.j]; draw(); });
    $('#rnd', el).onclick = () => { gen(); draw(); };
  };
  draw();
};

WT.deriv = 'Độ dốc tiếp tuyến của f(x) = x³ − 3x';
W.deriv = el => {
  const st = { x: 1.5 };
  el.innerHTML = `<div class="ctl">${slider('x₀', -2.2, 2.2, 0.05, st.x, 'x')}</div><div id="cv"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 640, 300);
  const f = x => x ** 3 - 3 * x, fp = x => 3 * x * x - 3;
  const upd = () => {
    const F = plotFrame(P, [-2.5, 2.5], [-6, 6]);
    curve(P, F, f, -2.5, 2.5, cssv('pen'));
    const x0 = st.x, y0 = f(x0), s = fp(x0);
    curve(P, F, x => y0 + s * (x - x0), x0 - 1.2, x0 + 1.2, cssv('red'), 2, [6, 4]);
    dot(P, F.X(x0), F.Y(y0), cssv('red'));
    const h = 0.001, num = (f(x0 + h) - f(x0)) / h;
    $('#out', el).innerHTML = `<span class="hand">f(x₀) = (${fmt(x0)})³ − 3·(${fmt(x0)}) = ${fmt(y0, 3)}</span><br>
      <span class="hand">f′(x₀) = 3x₀² − 3 = </span><span class="r">${fmt(s, 3)}</span>
      <span class="note-s"> · sai phân (f(x₀+0.001) − f(x₀))/0.001 ≈ ${fmt(num, 3)}</span>
      <p class="note-s">${Math.abs(s) < 0.15 ? 'Độ dốc gần 0: đây là điểm cực trị, nơi gradient descent sẽ dừng lại.' : s > 0 ? 'Độ dốc dương: muốn giảm f thì đi sang trái (ngược dấu đạo hàm).' : 'Độ dốc âm: muốn giảm f thì đi sang phải.'}</p>`;
  };
  bindSliders(el, st, upd); upd();
};

WT.softmax = 'Softmax, nhiệt độ & cross-entropy';
W.softmax = el => {
  const st = { z0: 2, z1: 1, z2: 0, z3: -1, T: 1, y: 1 };
  el.innerHTML = `<div class="ctl">${[0, 1, 2, 3].map(i => slider('z' + (i + 1), -4, 4, 0.1, st['z' + i], 'z' + i)).join('')}${slider('Nhiệt độ T', 0.1, 3, 0.05, st.T, 'T')}
   <label>Nhãn đúng <select id="y">${[0, 1, 2, 3].map(i => `<option value="${i}"${i === st.y ? ' selected' : ''}>lớp ${i + 1}</option>`).join('')}</select></label></div>
   <div class="scroll-x"><table class="steps" id="tb"></table></div><div class="calc" id="out"></div>`;
  const upd = () => {
    const z = [0, 1, 2, 3].map(i => st['z' + i] / st.T); const mx = Math.max(...z);
    const e = z.map(v => Math.exp(v - mx)); const S = e.reduce((a, b) => a + b, 0); const p = e.map(v => v / S);
    $('#tb', el).innerHTML = `<tr><th>Lớp</th><th>z/T</th><th>z/T − max</th><th>e^(·)</th><th>p = e/Σ</th><th style="width:40%"></th><th>p − y</th></tr>` +
      p.map((v, i) => `<tr><td>${i + 1}${i === st.y ? ' ★' : ''}</td><td class="v">${fmt(z[i])}</td><td class="v">${fmt(z[i] - mx)}</td><td class="v">${fmt(e[i], 3)}</td><td class="v">${fmt(v, 3)}</td><td><div class="bar ${i === st.y ? 'red' : ''}" style="width:${v * 100}%"></div></td><td class="v">${fmt(v - (i === st.y ? 1 : 0), 3)}</td></tr>`).join('');
    const H = -p.reduce((a, v) => a + (v > 0 ? v * Math.log(v) : 0), 0);
    $('#out', el).innerHTML = `<span class="hand">Σ e = ${fmt(S, 3)} · Loss = −ln p<sub>${st.y + 1}</sub> = −ln ${fmt(p[st.y], 3)} = </span><span class="r">${fmt(-Math.log(p[st.y]), 3)}</span><div class="note-s">Entropy H(p) = ${fmt(H, 3)} (tối đa ln 4 = 1.386 khi đều). Kéo T về 0.1: phân phối gần như one-hot.</div>`;
  };
  $('#y', el).onchange = e => { st.y = +e.target.value; upd(); };
  bindSliders(el, st, upd); upd();
};

WT.gauss = 'Gaussian, lấy mẫu & KL';
W.gauss = el => {
  const st = { mu: 1, s: 0.7 }; let eps = 0.5;
  el.innerHTML = `<div class="ctl">${slider('μ', -3, 3, 0.1, st.mu, 'mu')}${slider('σ', 0.2, 2.5, 0.05, st.s, 's')}<button class="btn small" id="smp">Lấy ε mới</button></div><div id="cv"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 640, 260);
  const N = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s)) / Math.sqrt(2 * Math.PI * s * s);
  const upd = () => {
    const ymax = Math.max(0.45, N(st.mu, st.mu, st.s) * 1.1);
    const F = plotFrame(P, [-5, 5], [0, ymax]);
    curve(P, F, x => N(x, 0, 1), -5, 5, cssv('muted'), 2, [5, 4]);
    curve(P, F, x => N(x, st.mu, st.s), -5, 5, cssv('pen'), 2.4);
    const x = st.mu + st.s * eps; dot(P, F.X(x), F.Y(N(x, st.mu, st.s)), cssv('red'));
    const kl = 0.5 * (st.mu ** 2 + st.s ** 2 - 1 - Math.log(st.s ** 2));
    $('#out', el).innerHTML = `<span class="hand">ε = ${fmt(eps, 3)} → x = μ + σε = ${fmt(st.mu)} + ${fmt(st.s)}·(${fmt(eps, 3)}) = </span><span class="r">${fmt(x, 3)}</span><br>
    <span class="hand">KL(N(μ,σ²) ‖ N(0,1)) = ½(μ² + σ² − 1 − ln σ²) = ½(${fmt(st.mu ** 2)} + ${fmt(st.s ** 2)} − 1 − (${fmt(Math.log(st.s ** 2), 3)})) = </span><span class="r">${fmt(kl, 3)}</span>
    <div class="legend"><span><i style="background:var(--pen)"></i>N(μ, σ²)</span><span><i style="background:var(--muted)"></i>N(0, 1) chuẩn</span><span><i style="background:var(--red);height:8px;width:8px;border-radius:50%"></i>mẫu x</span></div>`;
  };
  const g = gaussRng(Date.now() % 100000);
  $('#smp', el).onclick = () => { eps = g(); upd(); };
  bindSliders(el, st, upd); upd();
};

/* ================= GIAI ĐOẠN 1 ================= */
const ACTS = {
  'ReLU': [x => Math.max(0, x), x => x > 0 ? 1 : 0],
  'Sigmoid': [sig, x => sig(x) * (1 - sig(x))],
  'Tanh': [Math.tanh, x => 1 - Math.tanh(x) ** 2],
  'Leaky ReLU': [x => x > 0 ? x : 0.1 * x, x => x > 0 ? 1 : 0.1],
  'GELU': [x => 0.5 * x * (1 + Math.tanh(0.79788456 * (x + 0.044715 * x ** 3))), x => { const h = 1e-4, f = ACTS.GELU[0]; return (f(x + h) - f(x - h)) / (2 * h); }],
  'SiLU': [x => x * sig(x), x => sig(x) * (1 + x * (1 - sig(x)))],
  'Tuyến tính (không kích hoạt)': [x => x, () => 1],
};
WT.neuron = 'Một nơ-ron: nhân → cộng → kích hoạt';
W.neuron = el => {
  const st = { x: [[2, 1, -1]], w: [[0.5, -1, 0.3]], b: [[0.2]] }; let act = 'ReLU';
  el.innerHTML = `<div class="ctl"><label>Kích hoạt <select id="act">${Object.keys(ACTS).map(k => `<option>${k}</option>`).join('')}</select></label></div>
  <div class="scroll-x"><table class="steps"><tr><th>x</th><td>${inputMat(st.x, 'x')}</td></tr><tr><th>w</th><td>${inputMat(st.w, 'w')}</td></tr><tr><th>b</th><td>${inputMat(st.b, 'b')}</td></tr><tr><th>w·x</th><td id="pr"></td></tr></table></div><div class="calc" id="out"></div>`;
  const upd = () => {
    ['x', 'w', 'b'].forEach(k => readInputs(el, k, st[k]));
    const x = st.x[0], w = st.w[0], b = st.b[0][0]; const p = x.map((v, i) => v * w[i]); const z = p.reduce((a, c) => a + c, 0) + b; const a = ACTS[act][0](z);
    $('#pr', el).innerHTML = matHTML([p], { cls: () => 'hl' });
    $('#out', el).innerHTML = `<span class="hand">① z = ${p.map(v => fmt(v)).join(' + ')} + (${fmt(b)}) = ${fmt(z, 3)}</span><br><span class="hand">② a = ${act}(${fmt(z, 3)}) = </span><span class="r">${fmt(a, 3)}</span>`;
  };
  $('#act', el).onchange = e => { act = e.target.value; upd(); };
  el.addEventListener('input', upd); upd();
};

WT.act = 'Hàm kích hoạt và đạo hàm';
W.act = el => {
  const st = { x: 0.5 }; let fn = 'GELU';
  el.innerHTML = `<div class="ctl"><label>Hàm <select id="fn">${Object.keys(ACTS).map(k => `<option${k === fn ? ' selected' : ''}>${k}</option>`).join('')}</select></label>${slider('x', -4, 4, 0.05, st.x, 'x')}</div><div id="cv"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 640, 280);
  const upd = () => {
    const [f, d] = ACTS[fn]; const F = plotFrame(P, [-4, 4], [-1.5, 4]);
    curve(P, F, f, -4, 4, cssv('pen'), 2.4); curve(P, F, d, -4, 4, cssv('red'), 2, [6, 4]);
    dot(P, F.X(st.x), F.Y(f(st.x)), cssv('pen')); dot(P, F.X(st.x), F.Y(d(st.x)), cssv('red'));
    $('#out', el).innerHTML = `<span class="hand">${fn}(${fmt(st.x)}) = </span><span class="r">${fmt(f(st.x), 3)}</span> &nbsp; <span class="hand">đạo hàm = </span><span class="r">${fmt(d(st.x), 3)}</span>
    <div class="legend"><span><i style="background:var(--pen)"></i>f(x)</span><span><i style="background:var(--red)"></i>f′(x)</span></div>`;
  };
  $('#fn', el).onchange = e => { fn = e.target.value; upd(); };
  bindSliders(el, st, upd); upd();
};

WT.mlp = 'Mạng 2 lớp giải XOR';
W.mlp = el => {
  const st = { W1: [[1, 1], [1, 1]], b1: [[0, -1]], W2: [[1, -2]], b2: [[0]] };
  el.innerHTML = `<div class="mats"><div class="mat"><div class="lbl">W¹ (hàng = nơ-ron ẩn)</div>${inputMat(st.W1, 'W1')}</div><div class="mat"><div class="lbl">b¹</div>${inputMat(st.b1, 'b1')}</div><div class="mat"><div class="lbl">W²</div>${inputMat(st.W2, 'W2')}</div><div class="mat"><div class="lbl">b²</div>${inputMat(st.b2, 'b2')}</div></div>
  <div class="scroll-x" style="margin-top:14px"><table class="steps" id="tb"></table></div><div class="calc" id="out"></div>`;
  const upd = () => {
    ['W1', 'b1', 'W2', 'b2'].forEach(k => readInputs(el, k, st[k]));
    let ok = 0; let rows = `<tr><th>x₁ x₂</th><th>z¹ = W¹x + b¹</th><th>h = ReLU(z¹)</th><th>ŷ = W²h + b²</th><th>XOR</th></tr>`;
    [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(x => {
      const z = st.W1.map((r, i) => r[0] * x[0] + r[1] * x[1] + st.b1[0][i]); const h = z.map(v => Math.max(0, v));
      const y = st.W2[0][0] * h[0] + st.W2[0][1] * h[1] + st.b2[0][0]; const t = x[0] ^ x[1]; const good = Math.abs(y - t) < 0.25; ok += good;
      rows += `<tr><td>${x.join(' ')}</td><td class="v">[${z.map(v => fmt(v)).join(', ')}]</td><td class="v">[${h.map(v => fmt(v)).join(', ')}]</td><td class="v">${fmt(y)}</td><td>${t} ${good ? '<span style="color:var(--leaf)">✓</span>' : '<span style="color:var(--red)">✗</span>'}</td></tr>`;
    });
    $('#tb', el).innerHTML = rows;
    $('#out', el).innerHTML = ok === 4 ? '<b style="color:var(--leaf)">Đúng cả 4 trường hợp.</b> Thử đổi b¹ thành [0, 0] để thấy mạng hỏng.' : `<b style="color:var(--red)">Đúng ${ok}/4.</b> Lời giải mẫu: W¹ = [[1,1],[1,1]], b¹ = [0, −1], W² = [1, −2], b² = 0.`;
  };
  el.addEventListener('input', upd); upd();
};

WT.focal = 'Cross-entropy và focal loss';
W.focal = el => {
  const st = { pt: 0.8, g: 2 };
  el.innerHTML = `<div class="ctl">${slider('p<sub>t</sub> (xác suất lớp đúng)', 0.02, 1, 0.01, st.pt, 'pt')}${slider('γ', 0, 5, 0.5, st.g, 'g')}</div><div id="cv"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 640, 260);
  const upd = () => {
    const F = plotFrame(P, [0, 1], [0, 4], { xl: 'pₜ' });
    curve(P, F, p => -Math.log(Math.max(p, 1e-3)), 0.02, 1, cssv('muted'), 2, [5, 4]);
    curve(P, F, p => -((1 - p) ** st.g) * Math.log(Math.max(p, 1e-3)), 0.02, 1, cssv('pen'), 2.4);
    const ce = -Math.log(st.pt), fl = (1 - st.pt) ** st.g * ce;
    dot(P, F.X(st.pt), F.Y(Math.min(ce, 4)), cssv('muted')); dot(P, F.X(st.pt), F.Y(Math.min(fl, 4)), cssv('red'));
    $('#out', el).innerHTML = `<span class="hand">CE = −ln ${fmt(st.pt)} = ${fmt(ce, 3)} · Focal = (1 − ${fmt(st.pt)})^${fmt(st.g)} · ${fmt(ce, 3)} = </span><span class="r">${fmt(fl, 4)}</span>
     <div class="note-s">Mẫu này đóng góp ${fmt(100 * fl / (ce || 1), 1)}% so với CE. Mẫu dễ (pₜ cao) gần như bị bỏ qua; mẫu khó giữ nguyên trọng số.</div>
     <div class="legend"><span><i style="background:var(--muted)"></i>Cross-entropy</span><span><i style="background:var(--pen)"></i>Focal loss</span></div>`;
  };
  bindSliders(el, st, upd); upd();
};
