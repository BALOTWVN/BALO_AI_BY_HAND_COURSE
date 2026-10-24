/* ================= HÌNH MINH HỌA SỐNG ĐỘNG ================= */
const ILL = {}, ILLT = {};
const mkC = (w, h, cls = 'ill-c') => { const c = document.createElement('canvas'); const d = window.devicePixelRatio || 1; c.width = w * d; c.height = h * d; c.style.width = w + 'px'; c.style.maxWidth = '100%'; c.style.aspectRatio = w + '/' + h; c.className = cls; const g = c.getContext('2d'); g.scale(d, d); return { c, g, w, h }; };
function heatTo(g, M, x0, y0, s, col = 'pen') { const mx = Math.max(1e-9, ...M.flat()); const base = cssv(col); M.forEach((r, i) => r.forEach((v, j) => { g.fillStyle = cssv('sheet'); g.fillRect(x0 + j * s, y0 + i * s, s, s); g.globalAlpha = Math.min(1, v / mx); g.fillStyle = base; g.fillRect(x0 + j * s, y0 + i * s, s + 0.4, s + 0.4); g.globalAlpha = 1; })); }
const artPicker = (cur, withCustom = true) => `<div class="ill-pick">${['cat', 'dog', 'husky'].concat(withCustom ? ['custom'] : []).map(k => `<button class="chip-btn${k === cur ? ' on' : ''}" data-img="${k}">${ART_NAME[k]}</button>`).join('')}</div>`;
const probBars = (p, truth) => `<div class="bars" style="margin-top:6px"><span>mèo</span><div class="bar ${p.cat >= 0.5 ? 'red' : ''}" style="width:${p.cat * 100}%"></div><span class="val">${fmt(100 * p.cat, 1)}%</span><span>chó</span><div class="bar ${p.dog > 0.5 ? 'red' : ''}" style="width:${p.dog * 100}%"></div><span class="val">${fmt(100 * p.dog, 1)}%</span></div>${truth ? `<div class="verdict ${(p.cat >= 0.5 ? 'mèo' : 'chó') === truth ? 'ok' : 'bad'}">Dự đoán: <b>${p.cat >= 0.5 ? 'mèo' : 'chó'}</b> · Nhãn thật: <b>${truth}</b> → ${(p.cat >= 0.5 ? 'mèo' : 'chó') === truth ? 'ĐÚNG' : 'SAI'}</div>` : ''}`;

/* ---------- 1. CNN nhìn ảnh mèo/chó ---------- */
ILLT.cnncat = 'CNN nhìn một bức ảnh: từ pixel đến quyết định “mèo hay chó”';
ILL.cnncat = (el, o = {}) => {
  let img = o.img || 'cat', model = o.model || 'v1', custom = artGrid('cat').map(r => r.slice()), brush = 'd', stageOn = -1, timer = null;
  el.innerHTML = `<div class="ill-ctl">${artPicker(img)}<div class="ill-pick"><button class="chip-btn" data-m="v1">Mô hình v1</button><button class="chip-btn" data-m="v2">Mô hình v2</button></div><button class="btn small solid" data-a="run">▶ Chạy từng tầng</button></div>
    <div class="ill-pal" hidden>Bút vẽ: ${Object.keys(PAL).map(k => `<button class="sw-pal" data-b="${k}" title="${k}" style="background:rgb(${PAL[k].join(',')})"></button>`).join('')} <span class="note-s">Bấm lên ảnh đầu vào để tô từng pixel.</span></div>
    <div class="ill-flow">
      <div class="ill-st" data-s="0"><div class="ill-h"><b>1</b> Ảnh đầu vào</div><div class="ill-in"></div><div class="note-s">16×16 pixel → đổi sang độ sáng (0 tối – 1 sáng)</div></div>
      <div class="ill-st" data-s="1"><div class="ill-h"><b>2</b> Tầng tích chập: 4 bộ lọc cạnh</div><div class="ill-maps"></div><div class="note-s">Mỗi bản đồ: chỗ càng đậm là chỗ có nét đúng hướng bộ lọc tìm</div></div>
      <div class="ill-st" data-s="2"><div class="ill-h"><b>3</b> Tầng sâu: bộ dò bộ phận</div><div class="ill-parts"></div></div>
      <div class="ill-st" data-s="3"><div class="ill-h"><b>4</b> Tính điểm và softmax</div><div class="ill-score"></div></div>
      <div class="ill-st" data-s="4"><div class="ill-h"><b>5</b> Vì sao? Vùng nào kéo về đáp án</div><div class="ill-why"></div></div>
    </div>`;
  const grid = () => (img === 'custom' ? custom : artGrid(img));
  const render = () => {
    const G = grid(), R = cnnAnalyze(G, model);
    $$('[data-img]', el).forEach(b => b.classList.toggle('on', b.dataset.img === img)); $$('[data-m]', el).forEach(b => b.classList.toggle('on', b.dataset.m === model)); $('.ill-pal', el).hidden = img !== 'custom';
    // 1
    const A = mkC(176, 176); drawArt(A.g, G, 0, 0, 11); const B = mkC(88, 88); B.g.fillStyle = '#000'; R.G.forEach((r, i) => r.forEach((v, j) => { const c = Math.round(v * 255); B.g.fillStyle = `rgb(${c},${c},${c})`; B.g.fillRect(j * 5.5, i * 5.5, 6, 6); }));
    const inn = $('.ill-in', el); inn.innerHTML = ''; inn.append(A.c, B.c);
    A.c.onclick = e => { if (img !== 'custom') return; const r = A.c.getBoundingClientRect(); const j = Math.floor((e.clientX - r.left) / r.width * 16), i = Math.floor((e.clientY - r.top) / r.height * 16); custom[i][j] = brush; render(); };
    A.c.style.cursor = img === 'custom' ? 'crosshair' : 'default';
    // 2
    const mp = $('.ill-maps', el); mp.innerHTML = '';
    Object.keys(R.maps).forEach(k => { const w = document.createElement('div'); w.className = 'ill-mini'; const C = mkC(84, 84); heatTo(C.g, R.maps[k], 0, 0, 6); w.append(C.c); const t = document.createElement('div'); t.className = 'note-s'; t.innerHTML = `<b>${k}</b><br><span class="mono">${CK[k].map(r => r.map(v => (v > 0 ? '+' : v < 0 ? '−' : '0')).join('')).join(' ')}</span>`; w.append(t); mp.append(w); });
    // 3
    const pp = $('.ill-parts', el); pp.innerHTML = '';
    PARTS.forEach(p => { const w = document.createElement('div'); w.className = 'ill-part'; const C = mkC(96, 96); drawArt(C.g, G, 0, 0, 6, 0.35); C.g.strokeStyle = cssv('red'); C.g.lineWidth = 2; p.box.forEach(([r0, c0, r1, c1]) => { C.g.fillStyle = cssv('red'); C.g.globalAlpha = 0.18 + 0.5 * R.f[p.k]; C.g.fillRect(c0 * 6, r0 * 6, (c1 - c0) * 6, (r1 - r0) * 6); C.g.globalAlpha = 1; C.g.strokeRect(c0 * 6 + 1, r0 * 6 + 1, (c1 - c0) * 6 - 2, (r1 - r0) * 6 - 2); }); w.append(C.c);
      const t = document.createElement('div'); t.innerHTML = `<b>${p.t}</b><div class="note-s">${p.d}</div><div class="bar" style="width:${R.f[p.k] * 100}%;margin-top:4px"></div><span class="hand" style="font-size:19px">${fmt(R.f[p.k], 2)}</span>`; w.append(t); pp.append(w); });
    // 4
    const M = R.model;
    $('.ill-score', el).innerHTML = `<div class="note-s" style="margin-bottom:4px">${M.t}</div><div class="scroll-x"><table class="steps"><tr><th>Bộ phận</th><th>điểm f</th><th>w_mèo·f</th><th>w_chó·f</th></tr>${PARTS.map(p => `<tr><td>${p.t}</td><td class="v">${fmt(R.f[p.k], 2)}</td><td class="v" style="color:${R.contrib.cat[p.k] >= 0 ? 'var(--red)' : 'var(--muted)'}">${fmt(M.w.cat[p.k], 1)}·${fmt(R.f[p.k], 2)} = ${fmt(R.contrib.cat[p.k], 2)}</td><td class="v" style="color:${R.contrib.dog[p.k] >= 0 ? 'var(--pen)' : 'var(--muted)'}">${fmt(M.w.dog[p.k], 1)}·${fmt(R.f[p.k], 2)} = ${fmt(R.contrib.dog[p.k], 2)}</td></tr>`).join('')}<tr><td>bias</td><td></td><td class="v">${fmt(M.b.cat, 1)}</td><td class="v">${fmt(M.b.dog, 1)}</td></tr><tr><th>Tổng (logit)</th><td></td><td class="v"><b>${fmt(R.logit.cat, 2)}</b></td><td class="v"><b>${fmt(R.logit.dog, 2)}</b></td></tr></table></div>${probBars(R.prob, img === 'custom' ? null : ART_TRUE[img])}`;
    // 5
    const cls = R.pred === 'mèo' ? 'cat' : 'dog', C = mkC(176, 176); drawArt(C.g, G, 0, 0, 11, 0.45);
    const mx = Math.max(...PARTS.map(p => Math.abs(R.contrib[cls][p.k])), 1e-9);
    PARTS.forEach(p => { const v = R.contrib[cls][p.k]; p.box.forEach(([r0, c0, r1, c1]) => { C.g.globalAlpha = 0.15 + 0.6 * Math.abs(v) / mx; C.g.fillStyle = v >= 0 ? cssv('red') : cssv('pen'); C.g.fillRect(c0 * 11, r0 * 11, (c1 - c0) * 11, (r1 - r0) * 11); C.g.globalAlpha = 1; }); });
    const top = PARTS.slice().sort((a, b) => R.contrib[cls][b.k] - R.contrib[cls][a.k])[0], neg = PARTS.slice().sort((a, b) => R.contrib[cls][a.k] - R.contrib[cls][b.k])[0];
    const truth = img === 'custom' ? null : ART_TRUE[img], wrong = truth && truth !== R.pred;
    const why = $('.ill-why', el); why.innerHTML = ''; why.append(C.c);
    const t = document.createElement('div'); t.className = 'ill-explain';
    t.innerHTML = `<p>Mô hình chọn <b>${R.pred}</b>. Vùng <span style="color:var(--red)">đỏ</span> đẩy điểm “${R.pred}” lên, vùng <span style="color:var(--pen)">xanh</span> kéo xuống.</p><p>Bằng chứng mạnh nhất: <b>${top.t}</b> (+${fmt(R.contrib[cls][top.k], 2)}). Phản đối mạnh nhất: <b>${neg.t}</b> (${fmt(R.contrib[cls][neg.k], 2)}).</p>${wrong ? `<p class="bad-note">Sai ở đâu? Ảnh là ${truth} nhưng có <b>${top.t.toLowerCase()}</b> giống mèo, và mô hình v1 quá tin vào đặc điểm đó vì lúc huấn luyện chỉ mèo mới có tai nhọn. Cách sửa: thêm ảnh chó tai nhọn vào dữ liệu để mô hình học dựa nhiều hơn vào <b>mõm</b>. Bấm “Mô hình v2” để xem kết quả sau khi sửa.</p>` : truth ? '<p class="ok-note">Dự đoán đúng, và bằng chứng mô hình dùng là hợp lý.</p>' : '<p class="note-s">Ảnh tự vẽ không có nhãn: hãy thử vẽ tai cụp hoặc thêm râu và xem điểm thay đổi.</p>'}`;
    why.append(t);
    $$('.ill-st', el).forEach(s => s.classList.toggle('on', +s.dataset.s === stageOn));
  };
  el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.img) { img = b.dataset.img; render(); } else if (b.dataset.m) { model = b.dataset.m; render(); } else if (b.dataset.b) { brush = b.dataset.b; $$('.sw-pal', el).forEach(x => x.classList.toggle('on', x === b)); } else if (b.dataset.a === 'run') api.play(); });
  const api = { play(ms = 1400) { clearInterval(timer); stageOn = 0; render(); timer = setInterval(() => { stageOn++; if (stageOn > 4) { clearInterval(timer); timer = null; stageOn = -1; } render(); const s = $(`.ill-st[data-s="${stageOn}"]`, el); if (s && !o.noScroll) s.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, ms); }, stop() { clearInterval(timer); timer = null; } };
  render(); return api;
};

/* ---------- 2. ViT nhìn ảnh theo mảnh ---------- */
ILLT.vitcat = 'ViT nhìn ảnh theo 16 mảnh: chú ý vào đâu và vì sao đúng hay sai';
ILL.vitcat = (el, o = {}) => {
  let img = o.img || 'husky', q = 'cat', timer = null;
  el.innerHTML = `<div class="ill-ctl">${artPicker(img, false)}<div class="ill-pick"><button class="chip-btn" data-q="cat">Câu hỏi “mèo”</button><button class="chip-btn" data-q="dog">Câu hỏi “chó”</button></div><button class="btn small solid" data-a="run">▶ Chạy</button></div>
   <div class="ill-flow"><div class="ill-st"><div class="ill-h"><b>1</b> Cắt 16 mảnh 4×4, mỗi mảnh thành một vector</div><div class="ill-vin"></div></div><div class="ill-st"><div class="ill-h"><b>2</b> Token [CLS] hỏi các mảnh: trọng số attention</div><div class="ill-vatt"></div></div><div class="ill-st"><div class="ill-h"><b>3</b> Gộp theo trọng số → điểm lớp</div><div class="ill-vsc"></div></div></div>`;
  const render = () => {
    const G = artGrid(img), R = vitAnalyze(G);
    $$('[data-img]', el).forEach(b => b.classList.toggle('on', b.dataset.img === img)); $$('[data-q]', el).forEach(b => b.classList.toggle('on', b.dataset.q === q));
    const A = mkC(176, 176); drawArt(A.g, G, 0, 0, 11); A.g.strokeStyle = cssv('ink'); A.g.lineWidth = 1.5; for (let k = 1; k < 4; k++) { A.g.beginPath(); A.g.moveTo(k * 44, 0); A.g.lineTo(k * 44, 176); A.g.stroke(); A.g.beginPath(); A.g.moveTo(0, k * 44); A.g.lineTo(176, k * 44); A.g.stroke(); }
    const vin = $('.ill-vin', el); vin.innerHTML = ''; vin.append(A.c);
    const tb = document.createElement('div'); tb.className = 'note-s'; tb.innerHTML = `Vector mảnh = [độ tối, mật độ cạnh, độ sáng mõm]. Ví dụ mảnh 1: [${R.patches[0].e.map(v => fmt(v, 2)).join(', ')}], mảnh 14: [${R.patches[13].e.map(v => fmt(v, 2)).join(', ')}].`; vin.append(tb);
    const C = mkC(176, 176); drawArt(C.g, G, 0, 0, 11, 0.5); const at = R.att[q], mxa = Math.max(...at);
    R.patches.forEach((p, k) => { C.g.globalAlpha = 0.75 * at[k] / mxa; C.g.fillStyle = q === 'cat' ? cssv('red') : cssv('pen'); C.g.fillRect(p.pc * 44, p.pr * 44, 44, 44); C.g.globalAlpha = 1; C.g.fillStyle = cssv('ink'); C.g.font = '600 12px ' + cssv('f-mono'); C.g.fillText(Math.round(at[k] * 100) + '%', p.pc * 44 + 6, p.pr * 44 + 16); });
    const va = $('.ill-vatt', el); va.innerHTML = ''; va.append(C.c);
    const top = at.map((v, k) => [v, k]).sort((a, b) => b[0] - a[0]).slice(0, 3);
    const t = document.createElement('div'); t.className = 'note-s'; t.innerHTML = `q_${q === 'cat' ? 'mèo' : 'chó'} = [${R.Q[q].join(', ')}]. Điểm mảnh k = q·e_k / τ, rồi softmax. Ba mảnh được chú ý nhất: ${top.map(([v, k]) => `mảnh ${k + 1} (${fmt(100 * v, 1)}%)`).join(', ')}.`; va.append(t);
    const truth = ART_TRUE[img], pred = R.prob.cat >= 0.5 ? 'mèo' : 'chó';
    $('.ill-vsc', el).innerHTML = `<div class="hand" style="font-size:19px">pooled_mèo = [${R.pooled.cat.map(v => fmt(v, 2)).join(', ')}] → logit ${fmt(R.logit.cat, 2)}<br>pooled_chó = [${R.pooled.dog.map(v => fmt(v, 2)).join(', ')}] → logit ${fmt(R.logit.dog, 2)}</div>${probBars(R.prob, truth)}
      ${pred !== truth ? `<p class="bad-note">Câu hỏi “mèo” dồn attention vào các mảnh góc trên chứa <b>tai nhọn</b> (nhiều cạnh), còn mõm trắng to của husky bị bỏ qua. ViT nhỏ, ít dữ liệu dễ học “đường tắt” như vậy; ViT thật cần rất nhiều ảnh, hoặc tiền huấn luyện (MAE, DINO) rồi tinh chỉnh.</p>` : '<p class="ok-note">Dự đoán đúng. Hãy thử ảnh husky để thấy ViT nhỏ bị đánh lừa.</p>'}`;
  };
  el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.img) { img = b.dataset.img; render(); } if (b.dataset.q) { q = b.dataset.q; render(); } if (b.dataset.a === 'run') api.play(); });
  const api = { play() { clearInterval(timer); let k = 0; const seq = [['cat', 'cat'], ['cat', 'dog'], ['dog', 'cat'], ['husky', 'cat'], ['husky', 'dog']]; timer = setInterval(() => { [img, q] = seq[k++ % seq.length]; render(); if (k >= seq.length) { clearInterval(timer); timer = null; } }, 1800); }, stop() { clearInterval(timer); } };
  render(); return api;
};

/* ---------- 3. NLP: tách token, embedding và attention ---------- */
ILLT.nlpattn = 'Một câu tiếng Việt đi qua mô hình ngôn ngữ: token → vector → attention';
const SENTS = [
  { t: 'Con mèo ngồi trên bàn vì nó mệt', sel: 6, toks: ['Con', 'mèo', 'ngồi', 'trên', 'bàn', 'vì', 'nó', 'mệt'], pieces: ['Con', 'mèo', 'ngồi', 'trên', 'bàn', 'vì', 'nó', 'm', '##ệt'],
    e: [[0.2, 0, 0, 0.8], [1, 0, 0.1, 0], [0.2, 0, 1, 0], [0, 0.3, 0, 0.9], [0, 1, 0, 0], [0, 0, 0.1, 1], [0.6, 0.1, 0, 0.7], [0.7, 0, 0.9, 0]],
    q: [[0, 1.5, 0, 0], [0, 0, 2, 0], [2.5, 0.5, 0, 0], [0, 2, 0, 0], [0, 0, 0, 2], [0, 0, 2, 0], [3, 0, 1, 0], [3, 0, 0, 0]],
    note: '“nó” chú ý mạnh nhất vào “mèo”: mô hình hiểu “nó” chỉ con mèo (vì “mệt” là trạng thái của sinh vật), không phải cái bàn.',
    next: [['ngủ', 0.31], ['lắm', 0.24], ['quá', 0.18], ['rồi', 0.15], ['mỏi', 0.12]] },
  { t: 'Bo mạch bị đứt ở chân linh kiện', sel: 3, toks: ['Bo', 'mạch', 'bị', 'đứt', 'ở', 'chân', 'linh', 'kiện'], pieces: ['Bo', 'mạch', 'bị', 'đứt', 'ở', 'chân', 'linh', 'kiện'],
    e: [[1, 0, 0, 0.2], [1, 0.2, 0, 0], [0, 0, 0.3, 1], [0.2, 0, 1, 0.1], [0, 0.4, 0, 1], [0.3, 1, 0, 0], [0.4, 0.8, 0, 0], [0.4, 0.9, 0, 0]],
    q: [[1, 0, 0, 0], [2, 0, 0, 0], [0, 0, 2, 0], [2.5, 1.2, 0, 0], [0, 2, 0, 0], [0, 1.5, 0, 0], [0, 2.5, 0, 0], [0, 2.5, 0, 0]],
    note: '“đứt” chú ý nhiều vào “mạch” (cái gì bị đứt) và “chân” (đứt ở đâu): đó là thông tin attention trộn vào vector của “đứt”.',
    next: [['IC', 0.34], ['điện', 0.22], ['trở', 0.17], ['tụ', 0.15], ['này', 0.12]] },
];
ILL.nlpattn = (el, o = {}) => {
  let si = o.sent ?? 0, sel = SENTS[si].sel, timer = null;
  el.innerHTML = `<div class="ill-ctl"><div class="ill-pick">${SENTS.map((s, i) => `<button class="chip-btn" data-si="${i}">“${s.t}”</button>`).join('')}</div><button class="btn small solid" data-a="run">▶ Chạy</button></div>
   <div class="ill-flow"><div class="ill-st"><div class="ill-h"><b>1</b> Tách token (từ / mảnh từ) và tra ID</div><div class="ill-tok"></div></div>
   <div class="ill-st"><div class="ill-h"><b>2</b> Mỗi token thành một vector (embedding)</div><div class="ill-emb"></div></div>
   <div class="ill-st"><div class="ill-h"><b>3</b> Attention: bấm vào một từ để xem nó “nhìn” từ nào</div><div class="ill-att"></div></div>
   <div class="ill-st"><div class="ill-h"><b>4</b> Dự đoán từ tiếp theo</div><div class="ill-next"></div></div></div>`;
  const dims = ['sinh vật', 'đồ vật / bộ phận', 'hành động / trạng thái', 'từ chức năng'];
  const render = () => {
    const S = SENTS[si]; $$('[data-si]', el).forEach(b => b.classList.toggle('on', +b.dataset.si === si));
    const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 50000, 7);
    $('.ill-tok', el).innerHTML = `<div class="tok-row">${S.pieces.map(p => `<span class="tok">${p}<small>#${hash(p)}</small></span>`).join('')}</div><div class="note-s">Từ hiếm bị tách thành mảnh nhỏ (ví dụ “##” là mảnh nối tiếp). ID là số thứ tự trong từ điển.</div>`;
    $('.ill-emb', el).innerHTML = `<div class="scroll-x"><table class="steps"><tr><th></th>${dims.map(d => `<th style="font-size:11.5px">${d}</th>`).join('')}</tr>${S.toks.map((t, i) => `<tr><td><b>${t}</b></td>${S.e[i].map(v => `<td><div class="bar" style="width:${v * 60}px;height:10px"></div></td>`).join('')}</tr>`).join('')}</table></div>`;
    const sc = S.toks.map((_, j) => S.q[sel].reduce((a, v, d) => a + v * S.e[j][d], 0) / 1.0), mx = Math.max(...sc), ex = sc.map(v => Math.exp(v - mx)), z = ex.reduce((a, b) => a + b, 0), at = ex.map(v => v / z);
    const W = Math.max(560, S.toks.length * 76), H = 150, xs = S.toks.map((_, i) => 40 + i * (W - 80) / (S.toks.length - 1));
    let svg = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="max-width:none">`;
    at.forEach((a, j) => { if (j === sel) return; const x1 = xs[sel], x2 = xs[j], h = 20 + Math.abs(x2 - x1) * 0.28; svg += `<path d="M${x1},${H - 40} C${x1},${H - 40 - h} ${x2},${H - 40 - h} ${x2},${H - 44}" fill="none" stroke="var(--red)" stroke-width="${0.6 + a * 14}" stroke-opacity="${0.25 + a * 0.75}"/>`; svg += `<text x="${(x1 + x2) / 2}" y="${H - 44 - h * 0.78}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${Math.round(a * 100)}%</text>`; });
    S.toks.forEach((t, i) => { svg += `<g data-tk="${i}" style="cursor:pointer"><rect x="${xs[i] - 32}" y="${H - 38}" width="64" height="28" rx="7" fill="${i === sel ? 'var(--red)' : 'var(--pen-soft)'}" stroke="var(--pen)"/><text x="${xs[i]}" y="${H - 19}" text-anchor="middle" font-size="14" font-weight="600" fill="${i === sel ? 'var(--sheet)' : 'var(--ink)'}" font-family="var(--f-body)">${t}</text></g>`; });
    $('.ill-att', el).innerHTML = `<div class="scroll-x">${svg}</svg></div><div class="note-s">Đường càng dày, “${S.toks[sel]}” càng chú ý tới từ đó (điểm = q_“${S.toks[sel]}” · e, rồi softmax). ${sel === S.sel ? S.note : ''}</div>`;
    $$('[data-tk]', el).forEach(g => g.onclick = () => { sel = +g.dataset.tk; render(); });
    $('.ill-next', el).innerHTML = `<div class="note-s">Sau “${S.t}”, mô hình đề xuất:</div><div class="bars">${S.next.map(([w, p]) => `<span>${w}</span><div class="bar" style="width:${p * 250}%"></div><span class="val">${Math.round(p * 100)}%</span>`).join('')}</div>`;
  };
  el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.si) { si = +b.dataset.si; sel = SENTS[si].sel; render(); } if (b.dataset.a === 'run') api.play(); });
  const api = { play() { clearInterval(timer); let k = 0; timer = setInterval(() => { sel = k % SENTS[si].toks.length; render(); if (++k > SENTS[si].toks.length) { clearInterval(timer); timer = null; sel = SENTS[si].sel; render(); } }, 900); }, stop() { clearInterval(timer); } };
  render(); return api;
};

/* ---------- 4. Chuỗi thời gian ---------- */
ILLT.tseries = 'Chuỗi thời gian: cửa sổ trượt, dự báo và phát hiện bất thường';
ILL.tseries = (el, o = {}) => {
  const gr = gaussRng(8), N = 220, DS = {
    vib: { t: 'Rung động trục máy CNC (mm/s)', y: [...Array(N)].map((_, t) => 2 + 0.6 * Math.sin(2 * Math.PI * t / 24) + 0.12 * gr() + (t >= 150 && t < 158 ? 1.6 : 0)) },
    temp: { t: 'Nhiệt độ lò hàn reflow (°C)', y: [...Array(N)].map((_, t) => 245 + 4 * Math.sin(2 * Math.PI * t / 60) + 0.8 * gr() + (t > 170 ? (t - 170) * 0.35 : 0)) },
  };
  const st = { w: 20, z: 3 }; let ds = 'vib', t = N - 1, timer = null;
  el.innerHTML = `<div class="ill-ctl"><div class="ill-pick"><button class="chip-btn" data-d="vib">Rung động máy</button><button class="chip-btn" data-d="temp">Nhiệt độ lò hàn</button></div>${slider('cửa sổ W', 6, 50, 1, st.w, 'w')}${slider('ngưỡng z', 1.5, 5, 0.1, st.z, 'z')}<button class="btn small solid" data-a="run">▶ Trượt cửa sổ</button></div><div class="ill-ts"></div><div class="calc ill-tsout"></div>`;
  const P = mkCanvas($('.ill-ts', el), 680, 260);
  const render = () => {
    $$('[data-d]', el).forEach(b => b.classList.toggle('on', b.dataset.d === ds));
    const y = DS[ds].y, mn = Math.min(...y), mx = Math.max(...y), pad = (mx - mn) * 0.15;
    const F = plotFrame(P, [0, N - 1], [mn - pad, mx + pad], { xl: 'thời gian t' });
    const pred = [], band = [], flag = [];
    for (let k = st.w; k < N; k++) { const win = y.slice(k - st.w, k), m = win.reduce((a, b) => a + b, 0) / st.w, s = Math.sqrt(win.reduce((a, b) => a + (b - m) ** 2, 0) / st.w) || 1e-6; pred[k] = m; band[k] = s; flag[k] = Math.abs(y[k] - m) / s > st.z; }
    const g = P.g; g.fillStyle = cssv('pen'); g.globalAlpha = 0.12; g.beginPath(); for (let k = st.w; k <= t; k++) g.lineTo(F.X(k), F.Y(pred[k] + st.z * band[k])); for (let k = t; k >= st.w; k--) g.lineTo(F.X(k), F.Y(pred[k] - st.z * band[k])); g.fill(); g.globalAlpha = 1;
    g.strokeStyle = cssv('muted'); g.lineWidth = 1.5; g.beginPath(); y.forEach((v, k) => { if (k > t) return; k ? g.lineTo(F.X(k), F.Y(v)) : g.moveTo(F.X(k), F.Y(v)); }); g.stroke();
    g.strokeStyle = cssv('pen'); g.lineWidth = 2; g.setLineDash([5, 3]); g.beginPath(); for (let k = st.w; k <= t; k++) k === st.w ? g.moveTo(F.X(k), F.Y(pred[k])) : g.lineTo(F.X(k), F.Y(pred[k])); g.stroke(); g.setLineDash([]);
    let nf = 0; for (let k = st.w; k <= t; k++) if (flag[k]) { nf++; dot(P, F.X(k), F.Y(y[k]), cssv('red'), 4.5); }
    g.strokeStyle = cssv('ink'); g.lineWidth = 1.5; g.strokeRect(F.X(Math.max(0, t - st.w)), F.Y(mx + pad) + 2, F.X(t) - F.X(Math.max(0, t - st.w)), F.Y(mn - pad) - F.Y(mx + pad) - 4);
    const k = Math.max(st.w, t), zz = (y[k] - pred[k]) / band[k];
    $('.ill-tsout', el).innerHTML = `<b>${DS[ds].t}</b><br><span class="hand">t = ${k}: cửa sổ ${st.w} điểm trước có trung bình ${fmt(pred[k], 2)}, độ lệch ${fmt(band[k], 3)} → giá trị thật ${fmt(y[k], 2)}, z = ${fmt(zz, 2)} ${Math.abs(zz) > st.z ? '→ BẤT THƯỜNG' : ''}</span><div class="legend"><span><i style="background:var(--muted)"></i>dữ liệu</span><span><i style="background:var(--pen)"></i>dự báo (trung bình cửa sổ) ± z·σ</span><span><i style="background:var(--red);height:8px;width:8px;border-radius:50%"></i>điểm bất thường (${nf})</span></div><div class="note-s">Đây là bộ dự báo đơn giản nhất. RNN/LSTM hay Transformer chuỗi thời gian học được cả chu kỳ và xu hướng, nên dải dự báo hẹp hơn và bắt lỗi sớm hơn. Với lò hàn, nhiệt độ <b>trôi dần</b> sau t = 170: cửa sổ trượt “quen” dần với mức mới và bắt muộn, đó là lý do cần mô hình nhớ dài hơn.</div>`;
  };
  el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.d) { ds = b.dataset.d; t = N - 1; render(); } if (b.dataset.a === 'run') api.play(); });
  bindSliders(el, st, render, { w: v => v });
  const api = { play() { clearInterval(timer); t = st.w; timer = setInterval(() => { t += 3; if (t >= N - 1) { t = N - 1; clearInterval(timer); timer = null; } render(); }, 60); }, stop() { clearInterval(timer); } };
  render(); return api;
};

/* ---------- 5. YOLO trên cảnh có mèo và chó ---------- */
ILLT.yolo = 'YOLO nhìn một lần: lưới → hộp dự đoán → lọc → NMS → kết quả';
ILL.yolo = (el, o = {}) => {
  const W = 384, H = 256, S = 64, objs = [{ k: 'mèo', art: 'cat', x: 36, y: 104, s: 6 }, { k: 'chó', art: 'dog', x: 222, y: 64, s: 8 }];
  const bbox = ob => { const gd = artGrid(ob.art); let r0 = 99, c0 = 99, r1 = -1, c1 = -1; gd.forEach((r, i) => r.forEach((ch, j) => { if (ch !== '.') { r0 = Math.min(r0, i); r1 = Math.max(r1, i); c0 = Math.min(c0, j); c1 = Math.max(c1, j); } })); return [ob.x + c0 * ob.s, ob.y + r0 * ob.s, ob.x + (c1 + 1) * ob.s, ob.y + (r1 + 1) * ob.s]; };
  const GT = objs.map(ob => ({ k: ob.k, b: bbox(ob) }));
  const jit = (b, dx, dy, dw, dh) => [b[0] + dx, b[1] + dy, b[2] + dx + dw, b[3] + dy + dh];
  const C = [
    { b: jit(GT[0].b, 2, 1, -3, 2), k: 'mèo', c: 0.91 }, { b: jit(GT[0].b, -8, 6, 10, -4), k: 'mèo', c: 0.74 }, { b: jit(GT[0].b, 14, -10, -6, 8), k: 'mèo', c: 0.43 }, { b: jit(GT[0].b, 4, 2, 2, 0), k: 'chó', c: 0.22 },
    { b: jit(GT[1].b, -3, 2, 4, -2), k: 'chó', c: 0.88 }, { b: jit(GT[1].b, 9, -6, -5, 9), k: 'chó', c: 0.67 }, { b: jit(GT[1].b, -12, 10, 6, -12), k: 'chó', c: 0.51 }, { b: jit(GT[1].b, 1, 0, -2, 3), k: 'mèo', c: 0.19 },
    { b: [300, 190, 360, 246], k: 'mèo', c: 0.31 }, { b: [140, 20, 200, 70], k: 'chó', c: 0.12 }, { b: [10, 10, 60, 50], k: 'mèo', c: 0.08 },
  ];
  const iou = (a, b) => { const iw = Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])), ih = Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1])), it = iw * ih; return it / ((a[2] - a[0]) * (a[3] - a[1]) + (b[2] - b[0]) * (b[3] - b[1]) - it); };
  const st = { conf: 0.3, nms: 0.45 }; let step = 4, timer = null;
  const steps = ['Ảnh gốc', 'Chia lưới 6×4', 'Mỗi ô dự đoán hộp', 'Lọc theo độ tin cậy', 'NMS bỏ hộp trùng', 'So với nhãn'];
  el.innerHTML = `<div class="ill-ctl"><div class="ill-pick">${steps.map((s, i) => `<button class="chip-btn" data-st="${i}">${i}. ${s}</button>`).join('')}</div></div><div class="ill-ctl">${slider('ngưỡng tin cậy', 0.05, 0.95, 0.01, st.conf, 'conf')}${slider('ngưỡng IoU của NMS', 0.1, 0.9, 0.05, st.nms, 'nms')}<button class="btn small solid" data-a="run">▶ Chạy từng bước</button></div><div class="ill-yolo"></div><div class="calc ill-yout"></div>`;
  const P = mkC(W, H); $('.ill-yolo', el).append(P.c);
  const render = () => {
    $$('[data-st]', el).forEach(b => b.classList.toggle('on', +b.dataset.st === step));
    const g = P.g; g.clearRect(0, 0, W, H); g.fillStyle = '#E9EEF6'; g.fillRect(0, 0, W, H); g.fillStyle = '#D4DBE6'; g.fillRect(0, 196, W, 60);
    objs.forEach(ob => drawArt(g, artGrid(ob.art).map(r => r.map(ch => ch)), ob.x, ob.y, ob.s));
    // transparent background pixels: redraw floor/wall where art is '.'
    objs.forEach(ob => artGrid(ob.art).forEach((r, i) => r.forEach((ch, j) => { if (ch === '.') { const yy = ob.y + i * ob.s; g.fillStyle = yy >= 196 ? '#D4DBE6' : '#E9EEF6'; g.fillRect(ob.x + j * ob.s, yy, ob.s + 0.5, ob.s + 0.5); } })));
    if (step >= 1) { g.strokeStyle = 'rgba(36,69,200,.45)'; g.lineWidth = 1; for (let x = S; x < W; x += S) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = S; y < H; y += S) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } GT.forEach(o2 => { const cx = (o2.b[0] + o2.b[2]) / 2, cy = (o2.b[1] + o2.b[3]) / 2; g.fillStyle = 'rgba(36,69,200,.16)'; g.fillRect(Math.floor(cx / S) * S, Math.floor(cy / S) * S, S, S); g.fillStyle = '#2445C8'; g.beginPath(); g.arc(cx, cy, 4, 0, 7); g.fill(); }); }
    let shown = [];
    if (step === 2) shown = C.map(c => ({ ...c, keep: true }));
    if (step >= 3) shown = C.map(c => ({ ...c, keep: c.c >= st.conf }));
    let final = shown.filter(c => c.keep);
    if (step >= 4) { const out = []; ['mèo', 'chó'].forEach(k => { const L = final.filter(c => c.k === k).sort((a, b) => b.c - a.c); while (L.length) { const a = L.shift(); out.push(a); for (let i = L.length - 1; i >= 0; i--) if (iou(a.b, L[i].b) > st.nms) { L[i].sup = a; L.splice(i, 1); } } }); final = out; }
    const col = k => (k === 'mèo' ? '#CF3626' : '#17865A');
    const drawBox = (c, alpha, dash) => { g.globalAlpha = alpha; g.strokeStyle = col(c.k); g.lineWidth = 2.2; g.setLineDash(dash); g.strokeRect(c.b[0], c.b[1], c.b[2] - c.b[0], c.b[3] - c.b[1]); g.setLineDash([]); g.fillStyle = col(c.k); const lab = `${c.k} ${Math.round(c.c * 100)}%`; g.font = '600 12px ' + cssv('f-body'); const tw = g.measureText(lab).width + 8; g.fillRect(c.b[0], c.b[1] - 16, tw, 16); g.fillStyle = '#fff'; g.fillText(lab, c.b[0] + 4, c.b[1] - 4); g.globalAlpha = 1; };
    if (step === 2) shown.forEach(c => drawBox(c, 0.25 + 0.75 * c.c, []));
    if (step === 3) shown.forEach(c => drawBox(c, c.keep ? 0.9 : 0.12, c.keep ? [] : [4, 3]));
    if (step >= 4) { shown.filter(c => c.keep && !final.includes(c)).forEach(c => drawBox(c, 0.15, [3, 3])); final.forEach(c => drawBox(c, 1, [])); }
    let report = '';
    if (step === 5) { GT.forEach(o2 => { g.strokeStyle = '#2445C8'; g.lineWidth = 1.5; g.setLineDash([6, 4]); g.strokeRect(o2.b[0], o2.b[1], o2.b[2] - o2.b[0], o2.b[3] - o2.b[1]); g.setLineDash([]); });
      const used = new Set(); const rows = final.map(c => { let best = -1, bi = -1; GT.forEach((o2, i) => { const v = iou(c.b, o2.b); if (o2.k === c.k && v > best && !used.has(i)) { best = v; bi = i; } }); const tp = best >= 0.5; if (tp) used.add(bi); return `<tr><td>${c.k} ${Math.round(c.c * 100)}%</td><td class="v">${best < 0 ? '—' : fmt(best, 2)}</td><td style="color:${tp ? 'var(--leaf)' : 'var(--red)'}">${tp ? 'TP (đúng)' : 'FP (sai)'}</td></tr>`; });
      const tp = used.size, fp = final.length - tp, fn = GT.length - tp;
      report = `<div class="scroll-x"><table class="steps"><tr><th>Hộp giữ lại</th><th>IoU với nhãn</th><th>Kết luận</th></tr>${rows.join('')}</table></div><span class="hand">Precision = ${tp}/${tp + fp || 1} = ${fmt(tp / (tp + fp || 1), 2)} · Recall = ${tp}/${GT.length} = ${fmt(tp / GT.length, 2)}</span>${fn ? ' <span class="r">(bỏ sót ' + fn + ' vật)</span>' : ''}`; }
    const msg = ['Ảnh đầu vào: một con mèo và một con chó.', 'Ảnh chia lưới 6×4. Ô chứa <b>tâm</b> của vật (chấm xanh) chịu trách nhiệm dự đoán vật đó.', `Mạng xuất ra ${C.length} hộp, mỗi hộp có tọa độ, độ tin cậy và lớp. Hộp càng rõ là càng tự tin.`, `Giữ hộp có độ tin cậy ≥ ${fmt(st.conf, 2)}: còn ${shown.filter(c => c.keep).length} hộp.`, `NMS (theo từng lớp): giữ hộp tự tin nhất, xóa hộp cùng lớp có IoU > ${fmt(st.nms, 2)} với nó. Còn ${final.length} hộp.`, 'So với nhãn (nét đứt xanh): hộp đúng nếu cùng lớp và IoU ≥ 0.5.'][step];
    $('.ill-yout', el).innerHTML = `<div>${msg}</div>${report}<div class="note-s">Thử: hạ ngưỡng tin cậy xuống 0.1 rồi xem bước 5 (thêm hộp sai). Tăng ngưỡng IoU của NMS lên 0.9 (hộp trùng không bị xóa).</div>`;
  };
  el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.st) { step = +b.dataset.st; render(); } if (b.dataset.a === 'run') api.play(); });
  bindSliders(el, st, render);
  const api = { play() { clearInterval(timer); step = 0; render(); timer = setInterval(() => { step++; render(); if (step >= 5) { clearInterval(timer); timer = null; } }, 1600); }, stop() { clearInterval(timer); } };
  render(); return api;
};

/* ---------- 6. Diffusion trên ảnh mèo ---------- */
ILLT.diffcat = 'Diffusion trên ảnh mèo: thêm nhiễu dần rồi khử nhiễu ngược lại';
ILL.diffcat = (el, o = {}) => {
  const G = artGrid('cat'), x0 = G.map(r => r.map(ch => pxRGB(ch).map(v => v / 127.5 - 1))), gr = gaussRng(4), eps = G.map(r => r.map(() => [gr(), gr(), gr()]));
  const st = { t: 400 }; let timer = null;
  el.innerHTML = `<div class="ill-ctl">${slider('bước t', 0, 1000, 10, st.t, 't')}<button class="btn small" data-a="fwd">▶ Thêm nhiễu 0 → 1000</button><button class="btn small solid" data-a="rev">◀ Khử nhiễu 1000 → 0</button></div><div class="ill-dif"></div><div class="calc ill-dout"></div>`;
  const box = $('.ill-dif', el);
  const render = () => {
    const ab = ABAR.cos[Math.round(st.t)], a = Math.sqrt(ab), b = Math.sqrt(1 - ab);
    const mk = (fn, lab) => { const w = document.createElement('div'); w.className = 'ill-mini'; const C = mkC(144, 144); G.forEach((r, i) => r.forEach((_, j) => { const v = fn(i, j).map(z => Math.max(0, Math.min(255, (z + 1) * 127.5))); C.g.fillStyle = `rgb(${v.join(',')})`; C.g.fillRect(j * 9, i * 9, 9.5, 9.5); })); w.append(C.c); const t = document.createElement('div'); t.className = 'note-s'; t.innerHTML = lab; w.append(t); return w; };
    box.innerHTML = '';
    box.append(mk((i, j) => x0[i][j], 'x₀ (ảnh sạch)'), mk((i, j) => x0[i][j].map((v, c) => a * v + b * eps[i][j][c]), `x_t, t = ${Math.round(st.t)}`), mk((i, j) => eps[i][j].map(v => v / 2.5), 'ε (nhiễu, thu nhỏ để hiển thị)'));
    $('.ill-dout', el).innerHTML = `<span class="hand">ᾱ_t = ${fmt(ab, 3)} → x_t = ${fmt(a, 3)}·x₀ + ${fmt(b, 3)}·ε</span><div class="note-s">Lịch cosine. Khi khử nhiễu, mạng được huấn luyện để đoán ε từ x_t; ở đây ta dùng chính ε thật để mô phỏng một mạng hoàn hảo, nên ảnh hiện dần đúng con mèo ban đầu. Mạng thật đoán ε gần đúng, nên mỗi lần lấy mẫu từ nhiễu khác sẽ ra một con mèo khác.</div>`;
    const s = $('input[type=range]', el); s.value = st.t; $('output', el).textContent = Math.round(st.t);
  };
  const anim = (from, to) => { clearInterval(timer); st.t = from; timer = setInterval(() => { st.t += (to > from ? 20 : -20); if ((to > from && st.t >= to) || (to < from && st.t <= to)) { st.t = to; clearInterval(timer); timer = null; } render(); }, 40); };
  el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.a === 'fwd') anim(0, 1000); if (b.dataset.a === 'rev') anim(1000, 0); });
  bindSliders(el, st, render, { t: v => Math.round(v) });
  const api = { play() { anim(0, 1000); setTimeout(() => anim(1000, 0), 2400); }, stop() { clearInterval(timer); } };
  render(); return api;
};

/* ---------- 7. CLIP zero-shot ---------- */
ILLT.clipcat = 'CLIP phân loại không cần huấn luyện: so ảnh với các câu mô tả';
ILL.clipcat = (el, o = {}) => {
  let img = o.img || 'cat';
  const prompts = [['“ảnh một con mèo”', [1, 0, 0.1, 1, 0.8]], ['“ảnh một con chó”', [0.2, 1, 0.9, 0, 0.5]], ['“ảnh một con chó husky”', [1, 0.2, 1, 0, 0]], ['“ảnh một bo mạch điện tử”', [0, 0, 0.1, 0, -1]]];
  const st = { tau: 0.1, husky: 1 };
  el.innerHTML = `<div class="ill-ctl">${artPicker(img, false)}${slider('nhiệt độ τ', 0.02, 1, 0.01, st.tau, 'tau')}<label><input type="checkbox" checked data-h> Có câu “husky”</label></div><div class="ill-flow" style="grid-template-columns:auto 1fr"><div class="ill-cin"></div><div class="ill-cout"></div></div>`;
  const render = () => {
    $$('[data-img]', el).forEach(b => b.classList.toggle('on', b.dataset.img === img));
    const G = artGrid(img), R = cnnAnalyze(G, 'v1'); let warm = 0; G.forEach(r => r.forEach(ch => { const [rr, gg, bb] = pxRGB(ch); warm += (rr - bb) / 255; })); warm = warm / 256 * 2;
    const v = [R.f.ear, R.f.flop, R.f.muz, R.f.whis * 2, warm], nv = Math.hypot(...v);
    const C = mkC(144, 144); drawArt(C.g, G, 0, 0, 9); const ci = $('.ill-cin', el); ci.innerHTML = ''; ci.append(C.c); const t = document.createElement('div'); t.className = 'note-s'; t.innerHTML = `vector ảnh = [${v.map(x => fmt(x, 2)).join(', ')}]`; ci.append(t);
    const use = prompts.filter((p, i) => i !== 2 || $('[data-h]', el).checked);
    const cos = use.map(([, tv]) => v.reduce((a, x, i) => a + x * tv[i], 0) / (nv * Math.hypot(...tv)));
    const lg = cos.map(c => c / st.tau), m = Math.max(...lg), ex = lg.map(x => Math.exp(x - m)), z = ex.reduce((a, b) => a + b, 0), p = ex.map(x => x / z), best = p.indexOf(Math.max(...p));
    $('.ill-cout', el).innerHTML = `<div class="scroll-x"><table class="steps"><tr><th>Câu mô tả</th><th>cosine</th><th>xác suất</th><th style="width:35%"></th></tr>${use.map(([s], i) => `<tr><td>${s}</td><td class="v">${fmt(cos[i], 3)}</td><td class="v">${fmt(100 * p[i], 1)}%</td><td><div class="bar ${i === best ? 'red' : ''}" style="width:${p[i] * 100}%"></div></td></tr>`).join('')}</table></div><div class="note-s">Không huấn luyện thêm: chỉ cần viết câu mô tả cho từng lớp. Bỏ câu “husky” rồi chọn ảnh husky: nó buộc phải chọn giữa mèo và chó, và kết quả kém chắc chắn hơn. Cách viết câu mô tả (prompt) ảnh hưởng trực tiếp tới kết quả.</div>`;
  };
  el.addEventListener('click', e => { const b = e.target.closest('button'); if (b && b.dataset.img) { img = b.dataset.img; render(); } });
  el.addEventListener('change', e => { if (e.target.matches('[data-h]')) render(); });
  bindSliders(el, st, render);
  render(); return { play() { let k = 0; const seq = ['cat', 'dog', 'husky']; const tm = setInterval(() => { img = seq[k++]; render(); if (k >= 3) clearInterval(tm); }, 1600); }, stop() {} };
};
