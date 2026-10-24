/* ===== Trang tính: biểu tượng, xác suất, tiến hóa, thực chiến ===== */
WT.astar = 'A* trên lưới: bấm ô để đặt/xóa vật cản';
W.astar = el => {
  const R = 8, Cc = 12; let wall = new Set(['1,4', '2,4', '3,4', '4,4', '5,4', '5,5', '5,6', '5,7', '2,8', '3,8', '1,8']);
  const S = [6, 1], G = [1, 10]; let mode = 'astar';
  el.innerHTML = `<div class="ctl"><label>Thuật toán <select id="al"><option value="astar">A* (Manhattan)</option><option value="bfs">BFS / Dijkstra</option></select></label><button class="btn small ghost" id="clr">Xóa vật cản</button></div><div id="g"></div><div class="calc" id="out"></div>`;
  const run = () => {
    const key = (r, c) => r + ',' + c, h = (r, c) => mode === 'astar' ? Math.abs(r - G[0]) + Math.abs(c - G[1]) : 0;
    const gS = { [key(...S)]: 0 }, par = {}, closed = new Set(); const open = [[h(...S), 0, ...S]]; let order = 0; const ord = {};
    while (open.length) {
      open.sort((a, b) => a[0] - b[0] || b[1] - a[1]); const [, g, r, c] = open.shift(); const k = key(r, c); if (closed.has(k)) continue; closed.add(k); ord[k] = ++order;
      if (r === G[0] && c === G[1]) break;
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => { const nr = r + dr, nc = c + dc, nk = key(nr, nc); if (nr < 0 || nc < 0 || nr >= R || nc >= Cc || wall.has(nk) || closed.has(nk)) return; if (gS[nk] === undefined || g + 1 < gS[nk]) { gS[nk] = g + 1; par[nk] = k; open.push([g + 1 + h(nr, nc), g + 1, nr, nc]); } });
    }
    const path = new Set(); let cur = key(...G); while (par[cur]) { path.add(cur); cur = par[cur]; }
    return { closed, path, len: gS[key(...G)], ord };
  };
  const draw = () => {
    const res = run();
    let s = `<div class="scroll-x"><div style="display:grid;grid-template-columns:repeat(${Cc},30px);gap:2px;width:max-content">`;
    for (let r = 0; r < R; r++) for (let c = 0; c < Cc; c++) {
      const k = r + ',' + c; const isS = r === S[0] && c === S[1], isG = r === G[0] && c === G[1];
      const bg = wall.has(k) ? 'var(--ink)' : res.path.has(k) && !isG ? 'var(--red)' : res.closed.has(k) ? 'var(--pen-soft)' : 'var(--sheet)';
      s += `<div data-k="${k}" style="width:30px;height:30px;border:1px solid var(--line);border-radius:5px;background:${bg};display:grid;place-items:center;font-family:var(--f-hand);font-size:15px;cursor:pointer;color:${res.path.has(k) ? 'var(--sheet)' : 'var(--ink)'}">${isS ? 'S' : isG ? 'G' : ''}</div>`;
    }
    $('#g', el).innerHTML = s + '</div></div>';
    $$('#g [data-k]', el).forEach(d => d.onclick = () => { const k = d.dataset.k; if (k === S.join(',') || k === G.join(',')) return; wall.has(k) ? wall.delete(k) : wall.add(k); draw(); });
    $('#out', el).innerHTML = res.len === undefined ? '<span class="r">Không có đường đi.</span>' : `<span class="hand">Độ dài đường = </span><span class="r">${res.len}</span> <span class="hand">· số ô đã mở rộng = ${res.closed.size}</span><div class="note-s">Ô xanh nhạt: đã mở rộng. So sánh số ô mở rộng giữa A* và BFS: cùng độ dài đường, nhưng A* khám phá ít hơn nhờ heuristic.</div>`;
  };
  $('#al', el).onchange = e => { mode = e.target.value; draw(); };
  $('#clr', el).onclick = () => { wall = new Set(); draw(); };
  draw();
};

WT.minimax = 'Minimax và alpha–beta trên cây 3 nhánh';
W.minimax = el => {
  let leaves = [[3, 12, 8], [2, 4, 6], [14, 5, 2]];
  el.innerHTML = `<div class="ctl"><button class="btn small" id="rnd">Đổi lá ngẫu nhiên</button><span class="note-s" style="margin:0">Sửa trực tiếp giá trị lá.</span></div><div class="mats" id="lv"></div><div class="calc" id="out"></div>`;
  const upd = () => {
    const mins = leaves.map(r => Math.min(...r)); const best = mins.indexOf(Math.max(...mins));
    let alpha = -Infinity, pruned = []; leaves.forEach((r, i) => { let v = Infinity; for (let j = 0; j < r.length; j++) { v = Math.min(v, r[j]); if (v <= alpha) { for (let k = j + 1; k < r.length; k++) pruned.push(i + '-' + k); break; } } alpha = Math.max(alpha, v); });
    $('#lv', el).innerHTML = leaves.map((r, i) => `<div class="mat"><div class="lbl">Nước ${'ABC'[i]} → MIN = <b style="color:var(--red)">${mins[i]}</b></div><table class="m"><tr>${r.map((v, j) => `<td class="${pruned.includes(i + '-' + j) ? 'dim' : (v === mins[i] ? 'hl2' : '')}" style="padding:1px"><input class="num" data-i="${i}" data-j="${j}" value="${v}"></td>`).join('')}</tr></table></div>`).join('');
    $$('#lv input', el).forEach(inp => inp.onchange = () => { leaves[+inp.dataset.i][+inp.dataset.j] = parseFloat(inp.value) || 0; upd(); });
    $('#out', el).innerHTML = `<span class="hand">MAX = max(${mins.join(', ')}) = </span><span class="r">${mins[best]}</span> <span class="hand">→ chọn nước ${'ABC'[best]}</span><br><span class="hand">Alpha–beta bỏ qua ${pruned.length}/9 lá (ô mờ).</span><div class="note-s">Sắp lá nhỏ lên đầu mỗi nhánh để thấy alpha–beta cắt nhiều hơn.</div>`;
  };
  $('#rnd', el).onclick = () => { leaves = leaves.map(r => r.map(() => randInt(0, 15))); upd(); };
  upd();
};

WT.chain = 'Suy diễn tiến từng vòng';
W.chain = el => {
  const RULES = [[['Xám', 'CóLỗ'], 'RỗKhí'], [['RỗKhí', 'NhiệtThấp'], 'ChỉnhProfile'], [['Bóng', 'ĐủThiếc'], 'HànTốt'], [['RỗKhí'], 'NG'], [['HànTốt'], 'OK'], [['ThiếuThiếc'], 'NG']];
  const FACTS = ['Xám', 'CóLỗ', 'NhiệtThấp', 'Bóng', 'ĐủThiếc', 'ThiếuThiếc']; const init = new Set(['Xám', 'CóLỗ', 'NhiệtThấp']);
  el.innerHTML = `<div class="ctl" id="fs"></div><div class="scroll-x"><table class="steps" id="rl"></table></div><div class="calc" id="out"></div>`;
  const upd = () => {
    $('#fs', el).innerHTML = 'Sự kiện quan sát: ' + FACTS.map(f => `<label><input type="checkbox" data-f="${f}"${init.has(f) ? ' checked' : ''}> ${f}</label>`).join('');
    $$('[data-f]', el).forEach(c => c.onchange = () => { c.checked ? init.add(c.dataset.f) : init.delete(c.dataset.f); upd(); });
    const known = new Set(init), when = {}; let round = 0, added = true; const log = [];
    while (added && round < 10) { added = false; round++; const snap = new Set(known); RULES.forEach(([c, k], i) => { if (!known.has(k) && c.every(x => snap.has(x))) { known.add(k); when[i] = round; added = true; log.push(`Vòng ${round}: L${i + 1} (${c.join(' ∧ ')}) ⇒ ${k}`); } }); }
    $('#rl', el).innerHTML = `<tr><th>Luật</th><th>Điều kiện ⇒ kết luận</th><th>Kích hoạt</th></tr>` + RULES.map(([c, k], i) => `<tr style="${when[i] ? '' : 'opacity:.5'}"><td>L${i + 1}</td><td>${c.join(' ∧ ')} ⇒ <b>${k}</b></td><td class="v">${when[i] ? 'vòng ' + when[i] : '—'}</td></tr>`).join('');
    const derived = [...known].filter(x => !init.has(x));
    $('#out', el).innerHTML = (log.length ? log.map(l => `<div class="hand">${l}</div>`).join('') : '<span class="hand">Không suy ra được gì mới.</span>') + `<div><span class="hand">Kết luận mới: </span><span class="r">${derived.join(', ') || '∅'}</span></div>${known.has('NG') && known.has('OK') ? '<div class="note-s" style="color:var(--red)">Mâu thuẫn: vừa NG vừa OK. Tập luật cần thêm ưu tiên hoặc điều kiện loại trừ, một khó khăn kinh điển của hệ chuyên gia.</div>' : ''}`;
  };
  upd();
};

WT.bnet = 'Mạng Bayes Mưa – Vòi tưới – Sân ướt';
W.bnet = el => {
  const st = { pm: 0.2, pv: 0.3, mv: 0.99, m: 0.9, v: 0.8, n: 0.05 }; let ev = 'wet';
  el.innerHTML = `<div class="ctl">${slider('P(Mưa)', 0.01, 0.99, 0.01, st.pm, 'pm')}${slider('P(Vòi)', 0.01, 0.99, 0.01, st.pv, 'pv')}</div><div class="ctl">${slider('P(Ướt|M,V)', 0, 1, 0.01, st.mv, 'mv')}${slider('P(Ướt|M,¬V)', 0, 1, 0.01, st.m, 'm')}${slider('P(Ướt|¬M,V)', 0, 1, 0.01, st.v, 'v')}${slider('P(Ướt|¬M,¬V)', 0, 1, 0.01, st.n, 'n')}</div>
  <div class="ctl"><label>Bằng chứng <select id="ev"><option value="none">Chưa biết gì</option><option value="wet" selected>Sân ướt</option><option value="wetrain">Sân ướt + biết có mưa</option></select></label></div><div class="scroll-x"><table class="steps" id="tb"></table></div><div class="calc" id="out"></div>`;
  const upd = () => {
    const rows = [[1, 1, st.mv], [1, 0, st.m], [0, 1, st.v], [0, 0, st.n]].map(([M, V, pw]) => ({ M, V, p: (M ? st.pm : 1 - st.pm) * (V ? st.pv : 1 - st.pv) * (ev === 'none' ? 1 : pw), keep: ev !== 'wetrain' || M }));
    const Z = rows.filter(r => r.keep).reduce((a, r) => a + r.p, 0);
    const pM = rows.filter(r => r.keep && r.M).reduce((a, r) => a + r.p, 0) / Z, pV = rows.filter(r => r.keep && r.V).reduce((a, r) => a + r.p, 0) / Z;
    $('#tb', el).innerHTML = `<tr><th>Mưa</th><th>Vòi</th><th>P(M)·P(V)${ev === 'none' ? '' : '·P(Ướt|M,V)'}</th></tr>` + rows.map(r => `<tr style="${r.keep ? '' : 'opacity:.35'}"><td>${r.M ? '✓' : '—'}</td><td>${r.V ? '✓' : '—'}</td><td class="v">${fmt(r.p, 4)}</td></tr>`).join('');
    $('#out', el).innerHTML = `<span class="hand">Tổng các dòng còn lại = ${fmt(Z, 4)}</span><br><span class="hand">P(Mưa | bằng chứng) = </span><span class="r">${fmt(pM, 3)}</span> &nbsp; <span class="hand">P(Vòi | bằng chứng) = </span><span class="r">${fmt(pV, 3)}</span><div class="note-s">Chuyển từ “Sân ướt” sang “Sân ướt + biết có mưa”: xác suất vòi tưới tụt về gần mức ban đầu (explaining away).</div>`;
  };
  $('#ev', el).onchange = e => { ev = e.target.value; upd(); };
  bindSliders(el, st, upd); upd();
};

WT.kalman = 'Bộ lọc Kalman 1D theo dõi vị trí';
W.kalman = el => {
  const st = { Q: 1, R: 5 }; const g = gaussRng(12);
  const truth = [], meas = []; let x = 0; for (let t = 0; t < 30; t++) { x += 5 + g() * 1; truth.push(x); meas.push(x + g() * Math.sqrt(5)); }
  el.innerHTML = `<div class="ctl">${slider('nhiễu chuyển động Q', 0.05, 10, 0.05, st.Q, 'Q')}${slider('nhiễu cảm biến R', 0.1, 30, 0.1, st.R, 'R')}</div><div id="cv"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 640, 260);
  const upd = () => {
    let mu = 0, Pv = 4; const est = [], Ks = [];
    meas.forEach(z => { const mp = mu + 5, pp = Pv + st.Q; const K = pp / (pp + st.R); mu = mp + K * (z - mp); Pv = (1 - K) * pp; est.push(mu); Ks.push(K); });
    const dev = (arr, base) => arr.map((v, i) => v - (i + 1) * 5);
    const F = plotFrame(P, [0, 29], [-12, 12], { xl: 'bước (đã trừ chuyển động 5 cm/bước)' });
    const line = (arr, col, w, d = []) => { P.g.strokeStyle = col; P.g.lineWidth = w; P.g.setLineDash(d); P.g.beginPath(); dev(arr).forEach((v, i) => i ? P.g.lineTo(F.X(i), F.Y(v)) : P.g.moveTo(F.X(i), F.Y(v))); P.g.stroke(); P.g.setLineDash([]); };
    line(truth, cssv('muted'), 2, [5, 4]); dev(meas).forEach((v, i) => dot(P, F.X(i), F.Y(v), cssv('red'), 3)); line(est, cssv('pen'), 2.5);
    const err = a => Math.sqrt(a.reduce((s, v, i) => s + (v - truth[i]) ** 2, 0) / a.length);
    $('#out', el).innerHTML = `<span class="hand">Kalman gain ổn định K ≈ ${fmt(Ks[Ks.length - 1], 3)} · sai số RMS: cảm biến ${fmt(err(meas), 2)} → bộ lọc </span><span class="r">${fmt(err(est), 2)}</span><div class="legend"><span><i style="background:var(--muted)"></i>vị trí thật</span><span><i style="background:var(--red);height:8px;width:8px;border-radius:50%"></i>số đo</span><span><i style="background:var(--pen)"></i>ước lượng Kalman</span></div><div class="note-s">R lớn (tin cảm biến ít) → K nhỏ, đường xanh mượt nhưng chậm phản ứng. Q lớn → K lớn, bám số đo.</div>`;
  };
  bindSliders(el, st, upd); upd();
};

WT.ga = 'Giải thuật di truyền tìm chuỗi bit tối ưu';
W.ga = el => {
  const L = 16, target = [...Array(L)].map((_, i) => (i * 7 + 3) % 5 < 2 ? 1 : 0);
  const st = { pm: 0.03 }; let pop, gen, hist; const fit = c => c.reduce((a, b, i) => a + (b === target[i] ? 1 : 0), 0);
  const rnd = () => [...Array(L)].map(() => Math.random() < 0.5 ? 1 : 0);
  const reset = () => { pop = [...Array(12)].map(rnd); gen = 0; hist = [Math.max(...pop.map(fit))]; };
  reset();
  el.innerHTML = `<div class="ctl">${slider('xác suất đột biến', 0, 0.2, 0.005, st.pm, 'pm')}<button class="btn small solid" id="one">1 thế hệ</button><button class="btn small" id="ten">10 thế hệ</button><button class="btn small ghost" id="rst">Quần thể mới</button></div>
  <div class="note-s" style="margin:0 0 6px">Mục tiêu (ẩn với thuật toán, chỉ dùng để chấm điểm): ${target.join('')}</div><div id="pop"></div><div id="cv"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 640, 160);
  const step = () => {
    const f = pop.map(fit); const tot = f.reduce((a, b) => a + b, 0);
    const pick = () => { let r = Math.random() * tot; for (let i = 0; i < pop.length; i++) { r -= f[i]; if (r <= 0) return pop[i]; } return pop[pop.length - 1]; };
    const elite = pop[f.indexOf(Math.max(...f))].slice(); const np = [elite];
    while (np.length < pop.length) { const a = pick(), b = pick(), cut = randInt(1, L - 1); [a.slice(0, cut).concat(b.slice(cut)), b.slice(0, cut).concat(a.slice(cut))].forEach(ch => { if (np.length < pop.length) np.push(ch.map(v => Math.random() < st.pm ? 1 - v : v)); }); }
    pop = np; gen++; hist.push(Math.max(...pop.map(fit)));
  };
  const upd = () => {
    const f = pop.map(fit); const order = f.map((v, i) => i).sort((a, b) => f[b] - f[a]);
    $('#pop', el).innerHTML = `<div class="scroll-x"><table class="steps">${order.slice(0, 6).map(i => `<tr><td style="font-family:var(--f-mono);letter-spacing:2px">${pop[i].map((v, j) => `<span style="color:${v === target[j] ? 'var(--leaf)' : 'var(--red)'}">${v}</span>`).join('')}</td><td class="v">${f[i]}/${L}</td></tr>`).join('')}</table></div>`;
    const F = plotFrame(P, [0, Math.max(10, hist.length - 1)], [0, L], { xl: 'thế hệ' });
    P.g.strokeStyle = cssv('pen'); P.g.lineWidth = 2; P.g.beginPath(); hist.forEach((v, i) => i ? P.g.lineTo(F.X(i), F.Y(v)) : P.g.moveTo(F.X(i), F.Y(v))); P.g.stroke();
    $('#out', el).innerHTML = `<span class="hand">Thế hệ ${gen} · tốt nhất ${Math.max(...f)}/${L} · trung bình ${fmt(f.reduce((a, b) => a + b, 0) / f.length, 2)}</span><div class="note-s">6 cá thể tốt nhất (xanh = khớp, đỏ = sai). Đột biến 0 thì dễ kẹt; đột biến quá lớn thì thành tìm kiếm ngẫu nhiên.</div>`;
  };
  $('#one', el).onclick = () => { step(); upd(); };
  $('#ten', el).onclick = () => { for (let i = 0; i < 10; i++) step(); upd(); };
  $('#rst', el).onclick = () => { reset(); upd(); };
  bindSliders(el, st, () => {}, { pm: v => fmt(v, 3) }); upd();
};

WT.occl = 'Bản đồ che khuất: mô hình nhìn vào đâu?';
W.occl = el => {
  const N = 6; const img = [[1, 1, 0, 0, 1, 1], [1, 1, 0, 0, 1, 1], [1, 1, 0, 0, 1, 1], [1, 1, 1, 0, 1, 1], [1, 1, 0, 0, 1, 1], [1, 1, 0, 0, 1, 1]];
  // "model": detects a copper blob inside the gap column (pixel (3,2)) via a hand-set weight map
  const Wm = [[0, 0, 0.1, 0.1, 0, 0], [0, 0, 0.1, 0.1, 0, 0], [0, 0, 0.3, 0.3, 0, 0], [0, 0, 1.2, 0.3, 0, 0], [0, 0, 0.3, 0.3, 0, 0], [0, 0, 0.1, 0.1, 0, 0]];
  const score = X => sig(X.flat().reduce((a, v, i) => a + v * Wm.flat()[i], 0) * 3 - 2);
  const st = { k: 2 };
  el.innerHTML = `<div class="ctl">${slider('kích thước ô che', 1, 3, 1, st.k, 'k')}</div><div class="mats" id="m"></div><div class="calc" id="out"></div>`;
  const upd = () => {
    const base = score(img), k = st.k, n = N - k + 1, H = [];
    for (let i = 0; i < n; i++) { H.push([]); for (let j = 0; j < n; j++) { const X = img.map((r, a) => r.map((v, b) => a >= i && a < i + k && b >= j && b < j + k ? 0.5 : v)); H[i].push(base - score(X)); } }
    $('#m', el).innerHTML = matHTML(img, { label: 'Ảnh (1 = đồng, 0 = nền); có một gai đồng ở hàng 4', d: 0, cls: (r, c) => r === 3 && c === 2 ? 'hl2' : '' }) + matHTML(H, { label: 'Điểm NG giảm khi che ô bắt đầu tại (i, j)', heat: true, d: 2 });
    $('#out', el).innerHTML = `<span class="hand">Điểm NG gốc = </span><span class="r">${fmt(base, 3)}</span><div class="note-s">Ô càng xanh đậm: che chỗ đó làm điểm NG giảm mạnh, tức mô hình dựa vào vùng đó. Ở đây mô hình nhìn đúng vào gai đồng chen giữa hai đường mạch.</div>`;
  };
  bindSliders(el, st, upd, { k: v => v }); upd();
};

WT.quant = 'Lượng tử hóa trọng số xuống ít bit';
W.quant = el => {
  const st = { bits: 8, out: 0 }; const g = gaussRng(31); const w0 = Array.from({ length: 8 }, () => +(g() * 0.4).toFixed(3));
  el.innerHTML = `<div class="ctl">${slider('số bit', 2, 8, 1, st.bits, 'bits')}${slider('thêm 1 ngoại lai', 0, 5, 0.5, st.out, 'out')}</div><div class="scroll-x"><table class="steps" id="tb"></table></div><div class="calc" id="out"></div>`;
  const upd = () => {
    const w = st.out ? [...w0.slice(0, 7), st.out] : w0; const qmax = 2 ** (st.bits - 1) - 1; const s = Math.max(...w.map(Math.abs)) / qmax;
    const q = w.map(v => Math.round(v / s)), wh = q.map(v => v * s), err = w.map((v, i) => Math.abs(v - wh[i]));
    $('#tb', el).innerHTML = `<tr><th>w (FP32)</th>${w.map(v => `<td>${fmt(v, 3)}</td>`).join('')}</tr><tr><th>q = round(w/s)</th>${q.map(v => `<td class="v">${v}</td>`).join('')}</tr><tr><th>ŵ = s·q</th>${wh.map(v => `<td>${fmt(v, 3)}</td>`).join('')}</tr><tr><th>|sai số|</th>${err.map(v => `<td style="color:${v > s / 2 + 1e-9 ? 'var(--red)' : 'var(--muted)'}">${fmt(v, 4)}</td>`).join('')}</tr>`;
    $('#out', el).innerHTML = `<span class="hand">s = max|w| / ${qmax} = ${fmt(s, 5)} · sai số TB = </span><span class="r">${fmt(err.reduce((a, b) => a + b) / err.length, 4)}</span> <span class="hand">· kích thước ${st.bits}/32 = ${fmt(100 * st.bits / 32, 1)}% bản gốc</span><div class="note-s">Kéo “ngoại lai” lên 5: scale tăng vọt và các trọng số nhỏ bị làm tròn về 0. Đây là lý do LLM cần xử lý ngoại lai khi lượng tử 4-bit.</div>`;
  };
  bindSliders(el, st, upd, { bits: v => v }); upd();
};

WT.fair = 'So sánh chỉ số giữa hai nhóm và chọn ngưỡng riêng';
W.fair = el => {
  const st = { ta: 0.5, tb: 0.5 }; const g = gaussRng(77);
  const mk = (sep, n1, n0) => ({ pos: Array.from({ length: n1 }, () => sig(g() + sep)), neg: Array.from({ length: n0 }, () => sig(g() - sep)) });
  const A = mk(1.8, 100, 900), B = mk(0.9, 100, 900);
  el.innerHTML = `<div class="ctl">${slider('ngưỡng dây chuyền A', 0.05, 0.95, 0.01, st.ta, 'ta')}${slider('ngưỡng dây chuyền B', 0.05, 0.95, 0.01, st.tb, 'tb')}</div><div class="scroll-x"><table class="steps" id="tb"></table></div><div class="calc" id="out"></div>`;
  const m = (G, t) => { const tp = G.pos.filter(v => v >= t).length, fp = G.neg.filter(v => v >= t).length; return { rec: tp / G.pos.length, fpr: fp / G.neg.length, rate: (tp + fp) / (G.pos.length + G.neg.length) }; };
  const upd = () => {
    const a = m(A, st.ta), b = m(B, st.tb);
    $('#tb', el).innerHTML = `<tr><th></th><th>Recall (bắt lỗi)</th><th>FPR (báo giả)</th><th>Tỷ lệ gọi NG</th></tr><tr><td>Dây chuyền A</td><td class="v">${fmt(100 * a.rec, 1)}%</td><td class="v">${fmt(100 * a.fpr, 1)}%</td><td class="v">${fmt(100 * a.rate, 1)}%</td></tr><tr><td>Dây chuyền B</td><td class="v">${fmt(100 * b.rec, 1)}%</td><td class="v">${fmt(100 * b.fpr, 1)}%</td><td class="v">${fmt(100 * b.rate, 1)}%</td></tr>`;
    $('#out', el).innerHTML = `<span class="hand">Chênh lệch recall (cơ hội bình đẳng) = </span><span class="r">${fmt(100 * Math.abs(a.rec - b.rec), 1)} điểm %</span><div class="note-s">Mô hình phân tách dây chuyền B kém hơn (ảnh khác ánh sáng). Cùng ngưỡng thì B lọt lỗi nhiều. Hạ ngưỡng B để cân recall, và quan sát FPR của B tăng: không thể có “miễn phí”.</div>`;
  };
  bindSliders(el, st, upd); upd();
};

WT.spectro = 'Sóng âm và phổ tần số (DFT)';
W.spectro = el => {
  const st = { f1: 4, f2: 11, a2: 0.5, noise: 0 }; const N = 64; const g = gaussRng(3); const nz = Array.from({ length: N }, () => g());
  el.innerHTML = `<div class="ctl">${slider('tần số 1 (chu kỳ/64 mẫu)', 1, 31, 1, st.f1, 'f1')}${slider('tần số 2', 1, 31, 1, st.f2, 'f2')}${slider('biên độ 2', 0, 1, 0.05, st.a2, 'a2')}${slider('nhiễu', 0, 1, 0.05, st.noise, 'noise')}</div><div id="cv"></div><div id="cv2" style="margin-top:8px"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 640, 150), P2 = mkCanvas($('#cv2', el), 640, 170);
  const upd = () => {
    const x = [...Array(N)].map((_, n) => Math.sin(2 * Math.PI * st.f1 * n / N) + st.a2 * Math.sin(2 * Math.PI * st.f2 * n / N) + st.noise * nz[n]);
    const F = plotFrame(P, [0, N - 1], [-2.5, 2.5], { xl: 'mẫu n' }); P.g.strokeStyle = cssv('pen'); P.g.lineWidth = 2; P.g.beginPath(); x.forEach((v, i) => i ? P.g.lineTo(F.X(i), F.Y(v)) : P.g.moveTo(F.X(i), F.Y(v))); P.g.stroke();
    const mag = [...Array(N / 2)].map((_, k) => { let re = 0, im = 0; x.forEach((v, n) => { re += v * Math.cos(2 * Math.PI * k * n / N); im -= v * Math.sin(2 * Math.PI * k * n / N); }); return Math.hypot(re, im) / (N / 2); });
    const F2 = plotFrame(P2, [-0.5, N / 2 - 0.5], [0, 1.2], { xl: 'tần số k' }); const bw = (F2.X(1) - F2.X(0)) * 0.7;
    mag.forEach((m, k) => { P2.g.fillStyle = cssv('red'); P2.g.fillRect(F2.X(k) - bw / 2, F2.Y(Math.min(m, 1.2)), bw, F2.Y(0) - F2.Y(Math.min(m, 1.2))); });
    $('#out', el).innerHTML = `<span class="hand">|X_k| lớn nhất tại k = ${mag.indexOf(Math.max(...mag))}</span><div class="note-s">Trên: tín hiệu theo thời gian (khó đọc khi trộn hai tần số). Dưới: DFT tách ra hai vạch đúng tại ${st.f1} và ${st.f2}, chiều cao tỷ lệ biên độ. Thêm nhiễu: các vạch vẫn nổi rõ trên nền nhiễu.</div>`;
  };
  bindSliders(el, st, upd, { f1: v => v, f2: v => v }); upd();
};

WT.render = 'Trộn màu dọc một tia (NeRF / Gaussian Splatting)';
W.render = el => {
  const st = { s1: 0.1, s2: 2, s3: 5, c1: 0.2, c2: 0.9, c3: 0.5 };
  el.innerHTML = `<div class="ctl">${slider('σ₁', 0, 6, 0.1, st.s1, 's1')}${slider('σ₂', 0, 6, 0.1, st.s2, 's2')}${slider('σ₃', 0, 6, 0.1, st.s3, 's3')}</div><div class="ctl">${slider('màu c₁', 0, 1, 0.05, st.c1, 'c1')}${slider('màu c₂', 0, 1, 0.05, st.c2, 'c2')}${slider('màu c₃', 0, 1, 0.05, st.c3, 'c3')}</div><div class="scroll-x"><table class="steps" id="tb"></table></div><div class="calc" id="out"></div>`;
  const upd = () => {
    let T = 1, C = 0; const rows = [];
    [[st.s1, st.c1], [st.s2, st.c2], [st.s3, st.c3]].forEach(([s, c], i) => { const a = 1 - Math.exp(-s), w = T * a; rows.push([i + 1, a, T, w, c]); C += w * c; T *= 1 - a; });
    $('#tb', el).innerHTML = `<tr><th>Mẫu</th><th>α = 1 − e^(−σ)</th><th>T (ánh sáng lọt tới)</th><th>w = T·α</th><th>màu</th><th></th></tr>` + rows.map(([i, a, t, w, c]) => `<tr><td>${i}</td><td class="v">${fmt(a, 3)}</td><td class="v">${fmt(t, 3)}</td><td class="v">${fmt(w, 3)}</td><td>${fmt(c, 2)}</td><td><div style="width:28px;height:18px;border-radius:4px;border:1px solid var(--line);background:rgb(${c * 255},${c * 255},${c * 255})"></div></td></tr>`).join('');
    const v = Math.round(C * 255);
    $('#out', el).innerHTML = `<span class="hand">Màu pixel = Σ w·c = </span><span class="r">${fmt(C, 3)}</span> <span style="display:inline-block;width:40px;height:22px;border-radius:5px;vertical-align:middle;border:1px solid var(--line);background:rgb(${v},${v},${v})"></span> <span class="hand">· ánh sáng còn lọt qua cuối tia = ${fmt(T, 3)}</span><div class="note-s">Tăng σ₁ lên 6: mẫu đầu thành bề mặt đục, che hết các mẫu sau.</div>`;
  };
  bindSliders(el, st, upd); upd();
};
