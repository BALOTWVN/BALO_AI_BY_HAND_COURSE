/* ===== Trang tính cho bài mới ===== */
WT.linreg = 'Khớp đường thẳng: tự kéo hoặc để công thức giải';
W.linreg = el => {
  const pts = [[15, 2.5], [20, 3.0], [25, 4.0], [30, 4.5], [35, 4.8]];
  const st = { w: 0.1, b: 1 };
  el.innerHTML = `<div class="ctl">${slider('độ dốc w', -0.1, 0.3, 0.005, st.w, 'w')}${slider('chặn b', -2, 4, 0.05, st.b, 'b')}<button class="btn small solid" id="fit">Giải bằng công thức</button><button class="btn small" id="gd">1 bước GD</button></div>
  <div class="note-s" style="margin:0 0 6px">Dữ liệu: diện tích phòng trọ (m²) → giá thuê (triệu đồng/tháng).</div><div id="cv"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 640, 280);
  const syncSl = () => { $$('input[type=range]', el).forEach(i => { i.value = st[i.dataset.k]; const o = $(`output[data-o="${i.dataset.k}"]`, el); if (o) o.textContent = fmt(st[i.dataset.k], 3); }); };
  const upd = () => {
    const F = plotFrame(P, [10, 40], [0, 6.5], { xl: 'm²' });
    curve(P, F, x => st.w * x + st.b, 10, 40, cssv('pen'), 2.4);
    let sse = 0; pts.forEach(([x, y]) => { const yh = st.w * x + st.b; sse += (yh - y) ** 2; P.g.strokeStyle = cssv('red'); P.g.lineWidth = 1.5; P.g.setLineDash([3, 3]); P.g.beginPath(); P.g.moveTo(F.X(x), F.Y(y)); P.g.lineTo(F.X(x), F.Y(yh)); P.g.stroke(); P.g.setLineDash([]); dot(P, F.X(x), F.Y(y), cssv('red'), 5); });
    const mse = sse / pts.length;
    $('#out', el).innerHTML = `<span class="hand">ŷ = ${fmt(st.w, 3)}·x + ${fmt(st.b, 3)} · MSE = </span><span class="r">${fmt(mse, 4)}</span><div class="note-s">Đường nét đứt đỏ là sai số từng điểm; MSE là trung bình bình phương độ dài chúng. Kéo thanh trượt để làm MSE nhỏ nhất, rồi so với nghiệm công thức.</div>`;
  };
  $('#fit', el).onclick = () => { const n = pts.length, mx = pts.reduce((a, p) => a + p[0], 0) / n, my = pts.reduce((a, p) => a + p[1], 0) / n; const num = pts.reduce((a, [x, y]) => a + (x - mx) * (y - my), 0), den = pts.reduce((a, [x]) => a + (x - mx) ** 2, 0); st.w = num / den; st.b = my - st.w * mx; syncSl(); upd(); };
  $('#gd', el).onclick = () => { const n = pts.length; let gw = 0, gb = 0; pts.forEach(([x, y]) => { const e = st.w * x + st.b - y; gw += 2 * e * x / n; gb += 2 * e / n; }); st.w -= 0.0005 * gw; st.b -= 0.05 * gb; syncSl(); upd(); };
  bindSliders(el, st, upd, { w: v => fmt(v, 3), b: v => fmt(v, 2) }); upd();
};

WT.gnn = 'Truyền thông điệp trên đồ thị linh kiện';
W.gnn = el => {
  const names = ['IC', 'R1', 'C1', 'R2', 'LED'];
  const E = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]];
  const pos = [[90, 110], [220, 50], [220, 170], [350, 110], [480, 110]];
  let h = [5, 0, 0, 0, 0], layer = 0, sel = 3;
  const nb = i => [i, ...E.filter(e => e.includes(i)).map(e => e[0] === i ? e[1] : e[0])];
  el.innerHTML = `<div class="ctl"><button class="btn small solid" id="step">Chạy 1 lớp</button><button class="btn small ghost" id="rst">Đặt lại</button><span class="note-s" style="margin:0">Giá trị đầu: IC có tín hiệu bất thường = 5. Bấm vào một nút để xem phép tính.</span></div><div id="cv" style="max-width:560px"></div><div class="calc" id="out"></div>`;
  const P = mkCanvas($('#cv', el), 560, 220);
  const draw = (prev) => {
    const g = P.g; g.clearRect(0, 0, 560, 220); g.fillStyle = cssv('sheet'); g.fillRect(0, 0, 560, 220);
    g.strokeStyle = cssv('line'); g.lineWidth = 2.5; E.forEach(([a, b]) => { g.beginPath(); g.moveTo(...pos[a]); g.lineTo(...pos[b]); g.stroke(); });
    const mx = Math.max(...h, 1e-9);
    h.forEach((v, i) => { g.fillStyle = cssv('sheet'); g.beginPath(); g.arc(...pos[i], 30, 0, 7); g.fill(); g.globalAlpha = 0.15 + 0.85 * v / mx; g.fillStyle = cssv('red'); g.beginPath(); g.arc(...pos[i], 30, 0, 7); g.fill(); g.globalAlpha = 1; g.strokeStyle = i === sel ? cssv('pen') : cssv('muted'); g.lineWidth = i === sel ? 3 : 1.5; g.beginPath(); g.arc(...pos[i], 30, 0, 7); g.stroke();
      g.fillStyle = cssv('ink'); g.font = '13px ' + cssv('f-body'); g.textAlign = 'center'; g.fillText(names[i], pos[i][0], pos[i][1] - 5); g.font = '18px ' + cssv('f-hand'); g.fillText(fmt(v, 2), pos[i][0], pos[i][1] + 15); });
    const N = nb(sel);
    $('#out', el).innerHTML = `<span class="hand">Lớp ${layer}.</span> ${prev ? `<span class="hand">${names[sel]}: trung bình {${N.map(i => names[i]).join(', ')}} = (${N.map(i => fmt(prev[i], 2)).join(' + ')}) / ${N.length} = </span><span class="r">${fmt(h[sel], 3)}</span>` : 'Bấm “Chạy 1 lớp”.'}<div class="note-s">Mỗi lớp, mỗi nút lấy trung bình của chính nó và hàng xóm. Sau ${layer} lớp, tín hiệu từ IC đã lan tới các nút cách ≤ ${layer} bước. Chạy nhiều lớp: mọi nút tiến về cùng một giá trị (over-smoothing).</div>`;
  };
  let prev = null;
  $('#step', el).onclick = () => { prev = h.slice(); h = h.map((_, i) => { const N = nb(i); return N.reduce((a, j) => a + prev[j], 0) / N.length; }); layer++; draw(prev); };
  $('#rst', el).onclick = () => { h = [5, 0, 0, 0, 0]; layer = 0; prev = null; draw(null); };
  P.c.onclick = e => { const b = P.c.getBoundingClientRect(); const x = (e.clientX - b.left) / b.width * 560, y = (e.clientY - b.top) / b.height * 220; pos.forEach((p, i) => { if (Math.hypot(p[0] - x, p[1] - y) < 34) sel = i; }); draw(prev); };
  draw(null);
};

WT.qlearn = 'Q-learning trên hành lang 5 ô';
W.qlearn = el => {
  const N = 5, st = { a: 0.5, g: 0.9, eps: 0.2 };
  let Q, s, ep, log;
  const reset = () => { Q = [...Array(N)].map(() => [0, 0]); s = 0; ep = 1; log = []; };
  reset();
  el.innerHTML = `<div class="ctl">${slider('α', 0.1, 1, 0.05, st.a, 'a')}${slider('γ', 0.5, 0.99, 0.01, st.g, 'g')}${slider('ε', 0, 1, 0.05, st.eps, 'eps')}</div>
  <div class="ctl"><button class="btn small solid" id="one">1 bước</button><button class="btn small" id="epi">Chạy hết 1 lượt</button><button class="btn small" id="ten">20 lượt</button><button class="btn small ghost" id="rst">Đặt lại</button></div>
  <div id="grid"></div><div class="scroll-x"><table class="steps" id="qt"></table></div><div class="calc" id="out"></div>`;
  const step = () => {
    const greedy = Q[s][1] >= Q[s][0] ? 1 : 0; const act = Math.random() < st.eps ? (Math.random() < 0.5 ? 0 : 1) : greedy;
    const s2 = Math.max(0, Math.min(N - 1, s + (act ? 1 : -1))); const done = s2 === N - 1; const r = done ? 10 : -1;
    const tgt = r + (done ? 0 : st.g * Math.max(...Q[s2])); const old = Q[s][act]; Q[s][act] = old + st.a * (tgt - old);
    log = [`Lượt ${ep}: ô ${s} → ${act ? 'phải' : 'trái'} → ô ${s2}, r = ${r}`, `mục tiêu = ${r}${done ? '' : ` + ${fmt(st.g)}·max Q(${s2},·) = ${r} + ${fmt(st.g)}·${fmt(Math.max(...Q[s2]), 3)}`} = ${fmt(tgt, 3)}`, `Q(${s},${act ? 'phải' : 'trái'}) = ${fmt(old, 3)} + ${fmt(st.a)}·(${fmt(tgt, 3)} − ${fmt(old, 3)}) = ${fmt(Q[s][act], 3)}`];
    s = done ? 0 : s2; if (done) ep++; return done;
  };
  const draw = () => {
    $('#grid', el).innerHTML = `<div style="display:flex;gap:6px;margin-bottom:12px">${[...Array(N)].map((_, i) => `<div style="flex:1;min-width:0;text-align:center;padding:10px 0;border-radius:10px;border:1.5px solid ${i === s ? 'var(--pen)' : 'var(--line)'};background:${i === N - 1 ? 'var(--red-soft)' : 'var(--sheet)'}"><div class="hand" style="font-size:22px">${i === N - 1 ? '★' : i === s ? '◉' : i}</div><div class="note-s" style="margin:0">${i === N - 1 ? '+10' : '−1/bước'}</div></div>`).join('')}</div>`;
    $('#qt', el).innerHTML = `<tr><th>Ô</th>${[...Array(N - 1)].map((_, i) => `<th>${i}</th>`).join('')}</tr><tr><td>Q(·, trái)</td>${Q.slice(0, -1).map(q => `<td class="v">${fmt(q[0], 2)}</td>`).join('')}</tr><tr><td>Q(·, phải)</td>${Q.slice(0, -1).map(q => `<td class="v">${fmt(q[1], 2)}</td>`).join('')}</tr><tr><td>Chính sách</td>${Q.slice(0, -1).map(q => `<td>${q[1] >= q[0] ? '→' : '←'}</td>`).join('')}</tr>`;
    $('#out', el).innerHTML = log.length ? log.map(l => `<div class="hand">${l}</div>`).join('') : '<span class="note-s">Bấm “1 bước” để xem từng cập nhật.</span>';
  };
  $('#one', el).onclick = () => { step(); draw(); };
  $('#epi', el).onclick = () => { for (let k = 0; k < 200; k++) if (step()) break; draw(); };
  $('#ten', el).onclick = () => { for (let e = 0; e < 20; e++) for (let k = 0; k < 200; k++) if (step()) break; draw(); };
  $('#rst', el).onclick = () => { reset(); draw(); };
  bindSliders(el, st, () => {}); draw();
};

WT.rag = 'Truy hồi tài liệu bằng cosine';
W.rag = el => {
  const docs = [
    ['Quy trình xử lý lỗi đứt mạch', [0.8, 0.2, 0.5]], ['Lịch bảo trì máy AOI', [0.1, 0.9, 0.2]], ['Tiêu chuẩn độ rộng đường mạch', [0.6, 0.1, 0.7]],
    ['Hướng dẫn vệ sinh camera', [0.2, 0.8, 0.1]], ['Phân loại lỗi xước bề mặt', [0.7, 0.3, 0.1]],
  ];
  const st = { q: [[0.9, 0.1, 0.4]], k: 2 };
  el.innerHTML = `<div class="ctl">Vector câu hỏi q (3 chiều: “lỗi”, “thiết bị”, “kích thước”): ${inputMat(st.q, 'q')} ${slider('top-k', 1, 5, 1, st.k, 'k')}</div><div class="scroll-x"><table class="steps" id="tb"></table></div><div class="calc" id="out"></div>`;
  const upd = () => {
    readInputs(el, 'q', st.q); const q = st.q[0], nq = Math.hypot(...q) || 1;
    const sc = docs.map(([t, d]) => { const dp = d.reduce((a, v, i) => a + v * q[i], 0); return { t, d, dp, c: dp / (nq * Math.hypot(...d)) }; });
    const order = sc.map((_, i) => i).sort((a, b) => sc[b].c - sc[a].c); const top = new Set(order.slice(0, st.k));
    $('#tb', el).innerHTML = `<tr><th>Đoạn tài liệu</th><th>vector</th><th>q·d</th><th>cosine</th><th style="width:25%"></th></tr>` + order.map(i => `<tr style="${top.has(i) ? '' : 'opacity:.45'}"><td>${top.has(i) ? '✓ ' : ''}${sc[i].t}</td><td>[${sc[i].d.join(', ')}]</td><td class="v">${fmt(sc[i].dp, 3)}</td><td class="v">${fmt(sc[i].c, 3)}</td><td><div class="bar" style="width:${Math.max(0, sc[i].c) * 100}%"></div></td></tr>`).join('');
    $('#out', el).innerHTML = `<span class="hand">Prompt gửi LLM: “Dựa vào: ${order.slice(0, st.k).map(i => '[' + sc[i].t + ']').join(', ')}. Hãy trả lời câu hỏi và trích nguồn.”</span><div class="note-s">Thử q = [0.1, 0.9, 0.1] (câu hỏi về thiết bị) để thấy thứ hạng đảo ngược.</div>`;
  };
  el.addEventListener('input', upd); bindSliders(el, st, upd, { k: v => v }); upd();
};
