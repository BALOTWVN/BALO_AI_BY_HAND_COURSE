/* ================= TRANG TÍNH BẤM-TỪNG-SỐ ================= */
const SW = {};
const G = (name, m, o = {}) => ({ op: 'given', name, m, ...o });
const LIN = (name, src, W, o = {}) => ({ op: 'linear', name, src, W, ...o });
const EL = (name, src, fn, o = {}) => ({ op: 'elem', name, src, fn, ...o });
const BIN = (name, a, sym, b, o = {}) => ({ op: 'bin', name, a, sym, b, ...o });
const RED = (name, src, kind, o = {}) => ({ op: 'reduce', name, src, kind, ...o });
const MM = (name, A, B, o = {}) => ({ op: 'mm', name, A, B, ...o });
const CU = (name, rows, cols, fn, o = {}) => ({ op: 'custom', name, rows, cols, fn, ...o });
const CONV = (name, src, K, o = {}) => ({ op: 'conv', name, src, K, ...o });
const POOL = (name, src, o = {}) => ({ op: 'pool', name, src, ...o });

const SWFN = {
  relu: [x => Math.max(0, x), (x, v, F) => `ReLU(${F(x)}) = ${F(v)}`],
  exp: [Math.exp, (x, v, F) => `e^${x < 0 ? '(' + F(x) + ')' : F(x)} = ${F(v)}`],
  sig: [x => 1 / (1 + Math.exp(-x)), (x, v, F) => `σ(${F(x)}) = 1 / (1 + e^${x > 0 ? '(' + F(-x) + ')' : F(-x)}) = ${F(v)}`],
  tanh: [Math.tanh, (x, v, F) => `tanh(${F(x)}) = ${F(v)}`],
  sq: [x => x * x, (x, v, F) => `${x < 0 ? '(' + F(x) + ')' : F(x)}² = ${F(v)}`],
  sqrt: [x => Math.sqrt(Math.max(0, x)), (x, v, F) => `√${F(x)} = ${F(v)}`],
  abs: [Math.abs, (x, v, F) => `|${F(x)}| = ${F(v)}`],
  neglog: [x => -Math.log(x), (x, v, F) => `−ln ${F(x)} = ${F(v)}`],
  round: [x => Math.round(x), (x, v) => `round(${fmt(x, 2)}) = ${v}`],
};

function swCompute(def) {
  const M = {}, rows = [], order = []; let pend = [];
  const reg = (name, v, o = {}) => { M[name] = Object.assign({ name, v, given: true, kind: 'op' }, o); };
  def.steps.forEach(s => {
    const dp = s.dp ?? def.dp ?? 2; const F = x => fmt(x, dp); const PN = x => (x < 0 ? '(' + F(x) + ')' : F(x));
    if (s.op === 'given') {
      reg(s.name, s.m, { label: s.l, rl: s.rl, cl: s.cl, kind: s.side === 'left' ? 'op' : 'data', dp: s.dp });
      if (s.side === 'left') pend.push(s.name); else rows.push({ left: [], right: s.name, label: s.l, note: s.n });
      return;
    }
    const left = pend; pend = [];
    const lit = (x, tag, lab, rl) => { if (typeof x === 'string') return { n: x, m: M[x].v }; if (typeof x === 'number') return { n: null, m: [[x]], scalar: x }; const n = s.name + '·' + tag; reg(n, x, { label: lab || tag, rl, dp: s.dp }); left.push(n); return { n, m: x }; };
    const out = { name: s.name, v: [], show: [], f: [], hl: [], strike: [], label: s.l, rl: s.rl, cl: s.cl, kind: 'data', given: false, dp };
    M[s.name] = out;
    let R, C, cell;
    if (s.op === 'linear') {
      const P = M[s.src].v, W = s.W, nb = W[0].length - P.length, wn = s.name + '·W';
      reg(wn, W, { label: s.wl || 'W', bias: nb === 1, dp: s.wdp }); left.unshift(wn);
      R = W.length; C = P[0].length;
      cell = (i, j) => { let v = 0; const parts = [], hl = []; for (let k = 0; k < P.length; k++) { v += W[i][k] * P[k][j]; parts.push(PN(W[i][k]) + '·' + PN(P[k][j])); hl.push([wn, i, k], [s.src, k, j]); } if (nb === 1) { v += W[i][P.length]; parts.push(PN(W[i][P.length])); hl.push([wn, i, P.length]); } const f = parts.join(' + ') + ' = ' + F(v); if (s.relu && v < 0) return { v: 0, show: v, strike: true, f: f + ' → ReLU gạch đi, còn 0', hl }; return { v, f, hl }; };
    } else if (s.op === 'mm') {
      const A = lit(s.A, 'A', s.al, s.arl), B = lit(s.B, 'B', s.bl, s.brl);
      const ga = (i, k) => (s.At ? A.m[k][i] : A.m[i][k]), gb = (k, j) => (s.Bt ? B.m[j][k] : B.m[k][j]);
      const ha = (i, k) => (s.At ? [A.n, k, i] : [A.n, i, k]), hb = (k, j) => (s.Bt ? [B.n, j, k] : [B.n, k, j]);
      R = s.At ? A.m[0].length : A.m.length; const K = s.At ? A.m.length : A.m[0].length; C = s.Bt ? B.m.length : B.m[0].length;
      cell = (i, j) => { let v = 0; const parts = [], hl = []; for (let k = 0; k < K; k++) { v += ga(i, k) * gb(k, j); parts.push(PN(ga(i, k)) + '·' + PN(gb(k, j))); hl.push(ha(i, k), hb(k, j)); } return { v, f: parts.join(' + ') + ' = ' + F(v), hl }; };
    } else if (s.op === 'elem') {
      const P = M[s.src].v; const fn = typeof s.fn === 'string' ? SWFN[s.fn] : [s.fn.f, s.fn.t];
      R = P.length; C = P[0].length;
      cell = (i, j) => { const x = P[i][j], v = fn[0](x); return { v, f: fn[1](x, v, F), hl: [[s.src, i, j]] }; };
    } else if (s.op === 'bin') {
      const A = lit(s.a, 'a', s.al), B = lit(s.b, 'b', s.bl);
      const pick = (o, i, j) => { const r = o.m.length === 1 ? o.m[0] : o.m[i]; return r.length === 1 ? r[0] : r[j]; };
      const hx = (o, i, j) => (o.n ? [[o.n, o.m.length === 1 ? 0 : i, o.m[0].length === 1 ? 0 : j]] : []);
      R = Math.max(A.m.length, B.m.length); C = Math.max(A.m[0].length, B.m[0].length);
      const opf = { '+': (a, b) => a + b, '−': (a, b) => a - b, '×': (a, b) => a * b, '÷': (a, b) => a / b }[s.sym];
      cell = (i, j) => { const a = pick(A, i, j), b = pick(B, i, j), v = opf(a, b); return { v, f: `${F(a)} ${s.sym} ${PN(b)} = ${F(v)}`, hl: [...hx(A, i, j), ...hx(B, i, j)] }; };
    } else if (s.op === 'reduce') {
      const P = M[s.src].v, k = s.kind, byCol = k.startsWith('col');
      R = byCol ? 1 : P.length; C = byCol ? P[0].length : 1;
      cell = (i, j) => { const vals = byCol ? P.map(r => r[j]) : P[i]; const hl = vals.map((_, t) => (byCol ? [s.src, t, j] : [s.src, i, t])); const sum = vals.reduce((a, b) => a + b, 0);
        if (k.endsWith('sum')) return { v: sum, f: vals.map(PN).join(' + ') + ' = ' + F(sum), hl };
        if (k.endsWith('mean')) return { v: sum / vals.length, f: `(${vals.map(PN).join(' + ')}) / ${vals.length} = ${F(sum / vals.length)}`, hl };
        if (k.endsWith('max')) { const v = Math.max(...vals); return { v, f: `max(${vals.map(F).join(', ')}) = ${F(v)}`, hl }; }
        const v = Math.min(...vals); return { v, f: `min(${vals.map(F).join(', ')}) = ${F(v)}`, hl }; };
    } else if (s.op === 'conv') {
      const I = M[s.src].v, K = s.K, st = s.stride || 1, kh = K.length, kw = K[0].length, kn = s.name + '·K';
      reg(kn, K, { label: s.kl || 'Kernel' }); left.unshift(kn);
      R = Math.floor((I.length - kh) / st) + 1; C = Math.floor((I[0].length - kw) / st) + 1;
      cell = (i, j) => { let v = 0; const parts = [], hl = []; for (let u = 0; u < kh; u++) for (let w = 0; w < kw; w++) { const x = I[i * st + u][j * st + w]; v += x * K[u][w]; hl.push([s.src, i * st + u, j * st + w], [kn, u, w]); if (x !== 0 && K[u][w] !== 0) parts.push(PN(x) + '·' + PN(K[u][w])); } return { v, f: (parts.length ? parts.join(' + ') : '0') + ' = ' + F(v) + (parts.length < kh * kw ? '  (bỏ qua các tích bằng 0)' : ''), hl }; };
    } else if (s.op === 'pool') {
      const I = M[s.src].v, sz = s.size || 2, st = s.stride || sz;
      R = Math.floor((I.length - sz) / st) + 1; C = Math.floor((I[0].length - sz) / st) + 1;
      cell = (i, j) => { const vals = [], hl = []; for (let u = 0; u < sz; u++) for (let w = 0; w < sz; w++) { vals.push(I[i * st + u][j * st + w]); hl.push([s.src, i * st + u, j * st + w]); } if (s.kind === 'avg') { const v = vals.reduce((a, b) => a + b, 0) / vals.length; return { v, f: `(${vals.map(F).join(' + ')}) / ${vals.length} = ${F(v)}`, hl }; } const v = Math.max(...vals); return { v, f: `max(${vals.map(F).join(', ')}) = ${F(v)}`, hl }; };
    } else if (s.op === 'custom') {
      R = s.rows; C = s.cols;
      const g = (n, i, j) => M[n].v[i][j];
      cell = (i, j) => { const r = s.fn(i, j, g); return Array.isArray(r) ? { v: r[0], f: r[1], hl: r[2] || [] } : r; };
    } else throw new Error('Không rõ phép: ' + s.op);
    for (let i = 0; i < R; i++) { out.v.push(new Array(C).fill(0)); out.show.push(new Array(C).fill(0)); out.f.push(new Array(C).fill('')); out.hl.push(new Array(C).fill(null)); out.strike.push(new Array(C).fill(false)); }
    const seq = []; if (s.order === 'col') { for (let j = 0; j < C; j++) for (let i = 0; i < R; i++) seq.push([i, j]); } else { for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) seq.push([i, j]); }
    seq.forEach(([i, j]) => { const r = cell(i, j); out.v[i][j] = r.v; out.show[i][j] = r.show !== undefined ? r.show : r.v; out.f[i][j] = r.f; out.hl[i][j] = r.hl || []; out.strike[i][j] = !!r.strike; order.push([s.name, i, j]); });
    rows.push({ left, right: s.name, label: s.l, note: s.n });
  });
  return { M, rows, order };
}

function swRender(el, key, opts = {}) {
  const def = SW[key]; const { M, rows, order } = swCompute(def);
  const tbl = name => {
    const m = M[name]; const colL = m.cl === false ? null : (m.cl || (m.kind === 'data' && def.cols && def.cols.length === m.v[0].length ? def.cols : null));
    let h = `<div class="sw-mat ${m.kind}">${m.kind === 'op' && m.label ? `<div class="sw-ml">${m.label}</div>` : ''}<table>`;
    if (colL) h += `<tr>${m.rl ? '<th></th>' : ''}${colL.map(c => `<th class="cl">${c}</th>`).join('')}</tr>`;
    m.v.forEach((r, i) => { h += '<tr>' + (m.rl ? `<th class="rl">${m.rl[i] ?? ''}</th>` : '') + r.map((v, j) => `<td data-k="${name}|${i}|${j}" class="${m.given ? 'g' : 'e'}${m.bias && j === r.length - 1 ? ' bias' : ''}">${m.given ? fmt(v, m.dp ?? 2) : ''}</td>`).join('') + '</tr>'; });
    return h + '</table></div>';
  };
  const grid = rows.map(r => `<div class="sw-l"><div class="sw-lab">${r.label || ''}</div>${r.note ? `<div class="sw-note">${r.note}</div>` : ''}${r.left.length ? `<div class="sw-ops">${r.left.map(tbl).join('')}</div>` : ''}</div><div class="sw-r">${tbl(r.right)}</div>`).join('');
  el.innerHTML = `<div class="sw" tabindex="0" aria-label="Trang tính bấm từng số: ${def.t}">
    <div class="sw-top"><b>${def.t}</b>${def.d ? `<span>${def.d}</span>` : ''}</div>
    <div class="sw-ctl"><button class="btn small ghost" data-a="back" aria-label="Lùi một số">◀</button><button class="btn small solid" data-a="next">Số tiếp ▶</button><button class="btn small" data-a="block">Hết bước này</button><button class="btn small ghost" data-a="all">Hiện tất cả</button><button class="btn small ghost" data-a="reset">Làm lại</button><button class="btn small ghost" data-a="play">▶ Tự chạy</button><span class="sw-prog note-s"></span></div>
    <div class="sw-scroll"><div class="sw-grid">${grid}</div></div>
    <div class="sw-bar" aria-live="polite"></div></div>`;
  const cells = {}; $$('td[data-k]', el).forEach(td => { cells[td.dataset.k] = td; });
  const K = o => o[0] + '|' + o[1] + '|' + o[2];
  const bar = $('.sw-bar', el), prog = $('.sw-prog', el), playBtn = $('[data-a=play]', el);
  let idx = 0, timer = null;
  const paint = () => {
    Object.values(cells).forEach(td => td.classList.remove('cur', 'hl'));
    order.forEach((o, k) => { const td = cells[K(o)], m = M[o[0]]; if (k < idx) { td.textContent = fmt(m.show[o[1]][o[2]], m.dp); td.classList.remove('e'); td.classList.add('r'); td.classList.toggle('strike', m.strike[o[1]][o[2]]); } else { td.textContent = ''; td.classList.add('e'); td.classList.remove('r', 'strike'); } });
    if (idx > 0) { const o = order[idx - 1], m = M[o[0]]; cells[K(o)].classList.add('cur'); m.hl[o[1]][o[2]].forEach(h => { const td = cells[K(h)]; if (td && !td.classList.contains('cur')) td.classList.add('hl'); }); bar.innerHTML = `<span class="sw-step">${m.label || o[0]} · ô (${o[1] + 1}, ${o[2] + 1})</span><span class="hand">${m.f[o[1]][o[2]]}</span>`; }
    else bar.innerHTML = '<span class="note-s">Bấm “Số tiếp” (hoặc phím →) để tính từng ô. Ô đỏ là ô đang tính, ô xanh là các số được dùng. Tự tính ra giấy trước rồi mới bấm.</span>';
    prog.textContent = `${idx}/${order.length}`;
  };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; playBtn.textContent = '▶ Tự chạy'; } };
  const api = {
    next() { if (idx < order.length) { idx++; paint(); } else stop(); return idx < order.length; },
    back() { if (idx > 0) { idx--; paint(); } },
    block() { if (idx >= order.length) return; const n = order[idx][0]; while (idx < order.length && order[idx][0] === n) idx++; paint(); },
    all() { idx = order.length; paint(); stop(); },
    reset() { idx = 0; paint(); stop(); },
    play(ms = 650) { stop(); playBtn.textContent = '⏸ Dừng'; timer = setInterval(() => { if (!api.next()) stop(); }, ms); },
    stop, total: order.length,
  };
  el._sw = api;
  $('.sw-ctl', el).addEventListener('click', e => { const a = e.target.closest('[data-a]'); if (!a) return; const act = a.dataset.a; if (act === 'play') { timer ? stop() : api.play(); return; } stop(); api[act](); });
  $('.sw', el).addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); stop(); api.next(); } else if (e.key === 'ArrowLeft') { e.preventDefault(); stop(); api.back(); } });
  paint();
  return api;
}
