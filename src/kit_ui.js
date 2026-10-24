/* ================= GIAO DIỆN: XƯỞNG LẮP RÁP + THƯ VIỆN MÔ HÌNH + KHỐI ƯU/NHƯỢC ================= */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mlink = id => MBY[id] ? `<a class="mchip" href="#models" data-m="${id}">${MBY[id].n}</a>` : '';

/* ---- khối "Chức năng · Sức mạnh · Nhược điểm" trong bài học ---- */
function prosHTML(id) {
  const p = PROS[id]; if (!p) return '';
  return `<div class="pros"><div class="pros-fn"><span class="pros-ic">⚙</span><div><div class="eyebrow">Chức năng</div>${p.fn}</div></div>
  <div class="pros-cols"><div class="pros-plus"><div class="eyebrow">Sức mạnh</div><ul>${p.plus.map(x => `<li>${x}</li>`).join('')}</ul></div>
  <div class="pros-minus"><div class="eyebrow">Nhược điểm</div><ul>${p.minus.map(x => `<li>${x}</li>`).join('')}</ul></div></div>
  ${p.use ? `<div class="pros-use"><b>Khi nào dùng?</b> ${p.use}</div>` : ''}
  ${p.now.length ? `<div class="pros-now"><b>Mô hình nổi tiếng hiện nay dùng ý tưởng này:</b> ${p.now.map(mlink).join(' ')}</div>` : ''}</div>`;
}

/* ---- trang Thư viện mô hình ---- */
function modelCard(m) {
  const url = m.url || (m.ax ? `https://arxiv.org/abs/${m.ax}` : `https://scholar.google.com/scholar?q=${encodeURIComponent(m.pt)}`);
  return `<article class="mcard" id="m-${m.id}"><header><h3>${m.n}</h3><div class="note-s">${m.mk} · ${m.y}</div></header>
    <p class="mc-arch"><b>Kiến trúc.</b> ${m.arch}</p><p><b>Làm được gì.</b> ${m.fn}</p>
    <div class="pros-cols sm"><div class="pros-plus"><div class="eyebrow">Sức mạnh</div><ul>${m.plus.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="pros-minus"><div class="eyebrow">Nhược điểm</div><ul>${m.minus.map(x => `<li>${x}</li>`).join('')}</ul></div></div>
    <footer>${m.ls.filter(l => byId[l]).map(l => `<a class="chip" href="#${l}">Bài ${byId[l].code} ${byId[l].t}</a>`).join('')}${m.kit && KRBY[m.kit] ? `<a class="chip kitc" href="#kit" data-kit="${m.kit}">🧩 Lắp thử trong Xưởng</a>` : ''}<a class="chip" href="${url}" target="_blank" rel="noopener">📄 ${m.ax ? 'Paper arXiv ' + m.ax : m.url ? 'Tài liệu' : 'Tìm paper'}</a></footer></article>`;
}
function renderModels(focus) {
  $('#page').innerHTML = `<div class="eyebrow">Cập nhật 10/2026</div><h1>Mô hình nổi tiếng hiện nay</h1>
  <p class="lead">${MODELS_G.length} mô hình đang định hình AI: mỗi thẻ cho biết kiến trúc, làm được gì, sức mạnh, nhược điểm, bài học liên quan và paper gốc. Bấm "Lắp thử trong Xưởng" để xem mô hình được ghép từ những khối nào.</p>
  <p class="note-s">Thông tin về mô hình đóng (GPT, Claude, Gemini, Sora, Veo) chỉ ở mức công khai; số liệu benchmark thay đổi rất nhanh nên trang này tập trung vào kiến trúc và ý tưởng.</p>
  <div class="mfilter">${MGROUPS.map(([g, t]) => `<a class="chip" href="#models" data-g="${g}">${t}</a>`).join('')}</div>
  ${MGROUPS.map(([g, t]) => `<h2 id="g-${g}" class="mgroup">${t}</h2><div class="mgrid">${MODELS_G.filter(m => m.g === g).map(modelCard).join('')}</div>`).join('')}`;
  $('#page').onclick = e => { const k = e.target.closest('[data-kit]'); if (k) { KIT_PRESET = k.dataset.kit; }
    const g = e.target.closest('[data-g]'); if (g) { e.preventDefault(); const t = $('#g-' + g.dataset.g); t && t.scrollIntoView({ behavior: 'smooth' }); } };
  if (focus) setTimeout(() => { const c = $('#m-' + focus); if (c) { c.scrollIntoView({ block: 'center' }); c.classList.add('flash'); } }, 60);
}
let MODEL_FOCUS = null, KIT_PRESET = null;
document.addEventListener('click', e => { const a = e.target.closest('a.mchip'); if (a) { MODEL_FOCUS = a.dataset.m; if (location.hash === '#models') { renderModels(MODEL_FOCUS); MODEL_FOCUS = null; } }
  const k = e.target.closest('a[data-kit]'); if (k) { KIT_PRESET = k.dataset.kit; if (location.hash === '#kit') { lastView = ''; route(); } } });

/* ---- XƯỞNG LẮP RÁP ---- */
function kitParse(sig) { const [ab, t] = sig.split('=>').map(s => s && s.trim()); const [a, b] = ab.split('|').map(s => s.trim()); const sp = s => (s ? s.split('>').map(x => x.trim()).filter(Boolean) : []); return { A: sp(a), B: sp(b), T: sp(t) }; }
function kitSig(st) { let s = st.A.join('>'); if (st.B.length) s += ' | ' + st.B.join('>'); if (st.T.length) s += (st.B.length ? ' => ' : '>') + st.T.join('>'); return s; }
const kitNorm = sig => { const p = kitParse(sig.includes('=>') ? sig : sig); return kitSig(p); };
const ADAPT = ['grid2tok', 'tok2grid', 'fpn', 'pool', 'proj', 'tfenc'];
function kitFix(from, want) { // tìm 1–2 khối chuyển kiểu
  for (const a of ADAPT) if (KB[a].i.includes(from)) { const t = KB[a].o({ t: from, H: 7, W: 7, C: 8, N: 50, d: 8, cls: 1 }).t; if (want.includes(t)) return [a]; }
  for (const a of ADAPT) if (KB[a].i.includes(from)) { const t1 = KB[a].o({ t: from, H: 7, W: 7, C: 8, N: 50, d: 8, cls: 1 }).t; for (const b of ADAPT) if (b !== a && KB[b].i.includes(t1)) { const t2 = KB[b].o({ t: t1, H: 7, W: 7, C: 8, N: 50, d: 8, cls: 1 }).t; if (want.includes(t2)) return [a, b]; } }
  return null;
}
const tn = t => (KT[t] ? KT[t][0] : t);
function kitEval(st) {
  const out = { trace: [], errs: [], end: null };
  const runChain = (zone, ids, s0) => { let s = s0; ids.forEach((id, i) => { const b = KB[id];
    if (b.c === 'join') { out.errs.push({ zone, i, msg: `"${b.n}" là khối ghép hai nhánh, chỉ đặt ở đầu vùng "Sau khi ghép".` }); return; }
    if (b.c === 'in') { if (i !== 0 || zone === 'T') out.errs.push({ zone, i, msg: `"${b.n}" là đầu vào, phải đứng đầu nhánh A hoặc B.` }); s = b.o(); out.trace.push({ zone, id, s }); return; }
    if (!s) { out.errs.push({ zone, i, msg: `Nhánh ${zone} chưa có đầu vào: thêm Ảnh, Văn bản, Âm thanh... ở đầu.` }); return; }
    if (KOUT.includes(s.t)) { out.errs.push({ zone, i, msg: `Đã có đầu ra (${tn(s.t)}) rồi, không lắp thêm "${b.n}" phía sau được.` }); return; }
    if (!b.i.includes(s.t)) { const fix = kitFix(s.t, b.i); out.errs.push({ zone, i, msg: `Lệch khớp: khối trước ra <b>${tn(s.t)}</b> nhưng "${b.n}" cần <b>${b.i.map(tn).join(' hoặc ')}</b>.`, fix, at: i }); return; }
    const ns = b.o(s); if (ns.bad) out.errs.push({ zone, i, msg: 'Số token không xếp được thành lưới vuông.' });
    if (id === 'proj' && s.d === 'khớp') out.errs.push({ zone, i, msg: 'Đã chiếu rồi, không cần thêm Projector.' });
    s = ns; out.trace.push({ zone, id, s, from: zone === 'T' && i === 0 ? null : undefined }); }); return s; };
  if (!st.A.length && !st.B.length && !st.T.length) return out;
  const sa = runChain('A', st.A, null);
  let cur = sa;
  if (st.B.length) {
    const sb = runChain('B', st.B, null);
    const j = st.T[0] && KB[st.T[0]];
    if (!j || j.c !== 'join') out.errs.push({ zone: 'T', i: 0, msg: 'Có hai nhánh thì phải có một khối <b>Ghép 2 nhánh</b> (Cross-attention, Nối chuỗi token, Căn chỉnh tương phản, U-Net/DiT khử nhiễu) ở đầu vùng "Sau khi ghép".' });
    else if (sa && sb) {
      let ok = true;
      if (!j.i.includes(sa.t)) { ok = false; out.errs.push({ zone: 'A', i: st.A.length, msg: `"${j.n}" cần nhánh A ra <b>${j.i.map(tn).join(' hoặc ')}</b>, nhưng nhánh A đang ra <b>${tn(sa.t)}</b>.`, fix: kitFix(sa.t, j.i) }); }
      if (!j.i2.includes(sb.t)) { ok = false; out.errs.push({ zone: 'B', i: st.B.length, msg: `"${j.n}" cần nhánh B ra <b>${j.i2.map(tn).join(' hoặc ')}</b>, nhưng nhánh B đang ra <b>${tn(sb.t)}</b>.`, fix: kitFix(sb.t, j.i2) }); }
      if (ok && (st.T[0] === 'concat' || st.T[0] === 'contrast') && sa.d !== sb.d && sa.d !== 'khớp' && sb.d !== 'khớp') { ok = false; out.errs.push({ zone: 'A', i: st.A.length, msg: `Hai nhánh khác chiều (d = ${sa.d} và ${sb.d}) nên không ${st.T[0] === 'concat' ? 'nối' : 'so cosine'} được. Thêm <b>Projector</b> vào cuối một nhánh để đưa về cùng chiều.`, fix: ['proj'] }); }
      if (ok) { cur = j.o(sa, sb); out.trace.push({ zone: 'T', id: st.T[0], s: cur, join: true }); }
      else cur = null;
    }
    if (cur) cur = runChain('T', st.T.slice(1), cur);
  } else if (st.T.length) {
    if (KB[st.T[0]].c === 'join') out.errs.push({ zone: 'T', i: 0, msg: `"${KB[st.T[0]].n}" cần hai nhánh: hãy thêm một đầu vào ở nhánh B.` });
    else cur = runChain('T', st.T, cur);
  }
  out.end = cur;
  return out;
}
function kitMatch(st) { const s = kitSig(st); for (const r of KR) for (const g of r.sig) { const p = kitParse(g); if (kitSig(p) === s) return r; } return null; }
function kitNearest(st) { // gợi ý công thức gần nhất (khoảng cách chỉnh sửa trên danh sách khối)
  const a = [...st.A, '|', ...st.B, '|', ...st.T]; let best = null, bd = 99;
  const dist = (x, y) => { const d = Array.from({ length: x.length + 1 }, (_, i) => [i, ...Array(y.length).fill(0)]); for (let j = 1; j <= y.length; j++) d[0][j] = j; for (let i = 1; i <= x.length; i++) for (let j = 1; j <= y.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1)); return d[x.length][y.length]; };
  KR.forEach(r => r.sig.forEach(g => { const p = kitParse(g); const b = [...p.A, '|', ...p.B, '|', ...(p.B.length ? p.T : p.T)]; const v = dist(a, b); if (v < bd) { bd = v; best = { r, g, v }; } }));
  return best;
}
function kitBrick(id, extra = '') {
  const b = KB[id], cat = KCAT.find(c => c[0] === b.c), ins = b.i.length ? KT[b.i[0]][1] : 'transparent';
  const outT = b.c === 'head' || b.c === 'in' || b.c === 'join' ? null : null;
  return `<button class="brick c-${b.c}" style="--bc:${cat[2]};--pin:${ins}" data-b="${id}" ${extra} title="${esc(b.d)}" draggable="true"><span class="studs"><i></i><i></i><i></i></span><span class="bn">${b.n}</span><small>${b.i.length ? b.i.map(tn).join(' / ') : 'nguồn'}${b.i2 ? ' + ' + b.i2.map(tn).join(' / ') : ''} → ${b.c === 'in' ? tn(b.o().t) : b.c === 'join' ? (id === 'contrast' ? tn('sim') : id === 'concat' ? tn('tok') : id === 'xattn' ? 'như nhánh A' : tn('lat')) : outLabel(id)}</small></button>`;
}
function outLabel(id) { const b = KB[id]; const t0 = b.i[0]; const s = b.o({ t: t0, H: 7, W: 7, C: 8, N: 50, d: 8, L: 512, cls: 1 }); return tn(s.t); }

function renderKit() {
  const st = { A: [], B: [], T: [] }; let zone = 'A';
  const preset = KIT_PRESET; KIT_PRESET = null;
  $('#page').innerHTML = `<div class="eyebrow">Học bằng cách lắp</div><h1>Xưởng lắp ráp mô hình</h1>
  <p class="lead">Mọi mô hình thị giác và ngôn ngữ đều là các <b>khối Lego</b> nối với nhau qua <b>khớp có kiểu dữ liệu</b>: ảnh, lưới đặc trưng, chuỗi token, vector... Khớp phải vừa thì mới cắm được. Lắp đúng một công thức nổi tiếng, Xưởng sẽ cho biết bạn vừa tạo ra mô hình nào ngoài đời.</p>
  <details class="kit-rules"><summary>Luật lắp ráp (đọc 1 phút)</summary>
    <ol><li><b>Đầu vào</b> đứng đầu mỗi nhánh. Nhánh A bắt buộc, nhánh B dùng khi có hai loại dữ liệu (ảnh + chữ).</li>
    <li><b>Bộ mã hóa</b> biến dữ liệu thô thành đặc trưng: CNN ra <span class="kt" style="--k:${KT.fmap[1]}">lưới</span>, ViT và bộ tách từ ra <span class="kt" style="--k:${KT.tok[1]}">chuỗi token</span>.</li>
    <li><b>Khớp nối</b> đổi kiểu: duỗi lưới ↔ chuỗi token, gộp thành <span class="kt" style="--k:${KT.vec[1]}">vector</span>, Projector đổi chiều cho khớp nhánh kia.</li>
    <li><b>Ghép 2 nhánh</b>: cross-attention (A hỏi, B trả lời), nối chuỗi token, căn chỉnh tương phản, khử nhiễu có điều kiện.</li>
    <li><b>Đầu ra</b> quyết định mô hình làm gì: nhãn, hộp, mặt nạ, chữ, ảnh, dự báo.</li></ol>
    <p>Mẹo: ViT ra chuỗi còn đầu YOLO cần lưới, nên "ViT + YOLO" phải có khớp <i>Xếp token thành lưới</i>. Còn đầu DETR ăn chuỗi token trực tiếp, nên "ViT + DETR" cắm thẳng được.</p></details>

  <div class="section-label"><span class="hand">Lắp có hướng dẫn: đi từ suy nghĩ</span></div>
  <p class="note-s" style="margin-top:-4px">Chọn bài toán → chọn điều kiện thực tế → xem bản thiết kế còn trống → lắp từng khối với câu hỏi gợi ý. Chọn sai sẽ được giải thích vì sao.</p>
  <div id="kitGuide"></div>
  <div class="section-label"><span class="hand">Bảng ghép nhanh: lắp X với Y ra cái gì?</span></div>
  <div class="kgrid-wrap"><table class="kgrid"><thead><tr><th></th>${KGRID.cols.map(c => `<th>${c[1]}</th>`).join('')}</tr></thead><tbody>${KGRID.rows.map(r => `<tr><th>${r[1]}</th>${KGRID.cols.map(c => { const k = KGRID.cell[r[0] + ',' + c[0]]; return k ? `<td><button class="kg" data-r="${k}">${KRBY[k].n.replace(/^.*= /, '')}</button></td>` : '<td class="kg0">—</td>'; }).join('')}</tr>`).join('')}</tbody></table></div>

  <div class="section-label" id="kitFree"><span class="hand">Bàn lắp tự do</span></div>
  <p class="note-s" style="margin-top:-4px">Đã quen rồi thì tự ghép bất kỳ khối nào. Xưởng kiểm tra từng khớp và nhận ra mô hình nổi tiếng nếu bạn lắp trúng công thức.</p>
  <div class="kit">
    <div class="kit-pal">${KCAT.map(([c, t, col]) => `<div class="kp-group"><div class="kp-h" style="--bc:${col}">${t}</div><div class="kp-b">${Object.keys(KB).filter(id => KB[id].c === c).map(id => kitBrick(id)).join('')}</div></div>`).join('')}</div>
    <div class="kit-main">
      <div class="kit-presets"><span class="note-s">Lắp sẵn:</span> ${[['hybrid', 'CNN + ViT'], ['vityolo', 'ViT + YOLO'], ['yolos', 'ViT + DETR'], ['vlm', 'ViT + LLM'], ['clip', 'CLIP'], ['sam', 'SAM'], ['gdino', 'Grounding DINO'], ['yoloworld', 'YOLO-World'], ['sd', 'Stable Diffusion'], ['whisper', 'Whisper'], ['yolo', 'YOLO']].map(([k, t]) => `<button class="chip-btn" data-r="${k}">${t}</button>`).join('')}
        <button class="chip-btn bad" data-wrong="1">Thử lắp sai: ViT → YOLO</button></div>
      <div class="kit-board">
        ${[['A', 'Nhánh A'], ['B', 'Nhánh B (tùy chọn)'], ['T', 'Sau khi ghép']].map(([z, t]) => `<div class="kz" data-z="${z}"><div class="kz-h"><b>${t}</b><span class="note-s kz-hint"></span></div><div class="kz-row" data-z="${z}"></div></div>`).join('')}
        <div class="kit-act"><button class="btn small ghost" data-k="undo">↶ Bỏ khối cuối</button><button class="btn small ghost" data-k="clear">Xóa hết</button><span class="note-s">Bấm khối ở bảng trái để thêm vào vùng đang chọn (viền đỏ), hoặc kéo thả. Bấm khối trên bàn để gỡ.</span></div>
      </div>
      <div id="kitOut"></div>
    </div>
  </div>
  <div class="section-label"><span class="hand">Thử thách</span></div>
  <div class="kquest">${KQUEST.map(([q, ok], i) => `<div class="kq" data-q="${i}"><span class="kq-ic">○</span><span>${q}</span></div>`).join('')}</div>`;

  const out = $('#kitOut');
  const draw = () => {
    ['A', 'B', 'T'].forEach(z => { const row = $(`.kz-row[data-z="${z}"]`); row.innerHTML = st[z].length ? st[z].map((id, i) => (i ? '<span class="kjoint"></span>' : '') + kitBrick(id, `data-zone="${z}" data-i="${i}"`)).join('') : `<span class="kz-empty">${z === 'A' ? 'Bắt đầu bằng một khối Đầu vào' : z === 'B' ? 'Để trống nếu chỉ có một loại dữ liệu' : 'Khối ghép (nếu có 2 nhánh) rồi đầu ra'}</span>`;
      $(`.kz[data-z="${z}"]`).classList.toggle('on', zone === z); });
    const ev = kitEval(st), r = ev.errs.length ? null : kitMatch(st);
    ev.errs.forEach(e => { const b = $(`.kz-row[data-z="${e.zone}"] .brick[data-i="${Math.min(e.i, st[e.zone].length - 1)}"]`); if (b) b.classList.add('err'); });
    let h = '';
    if (!st.A.length && !st.B.length) { out.innerHTML = '<div class="kit-empty">Chưa có khối nào. Chọn một mẫu "Lắp sẵn" hoặc bấm vào bảng ghép nhanh để bắt đầu.</div>'; quests(null); return; }
    if (ev.errs.length) h += `<div class="kit-status bad">⚡ Chưa lắp được: ${ev.errs.length} chỗ chưa khớp</div><ul class="kit-errs">${ev.errs.map(e => `<li>${e.msg}${e.fix ? ` <button class="btn small solid" data-fix="${e.zone}:${e.at == null ? st[e.zone].length : e.at}:${e.fix.join(',')}">Chèn ${e.fix.map(f => KB[f].n).join(' + ')}</button>` : ''}</li>`).join('')}</ul>`;
    else if (!ev.end || !KOUT.includes(ev.end.t)) { const heads = Object.keys(KB).filter(id => KB[id].c === 'head' && ev.end && KB[id].i.includes(ev.end.t)); h += `<div class="kit-status mid">🧩 Khớp đúng hết, nhưng chưa có đầu ra. Hiện đang ra: <b>${ev.end ? tn(ev.end.t) : '—'}</b>${heads.length ? '. Thử thêm: ' + heads.map(x => `<button class="chip-btn" data-add="${x}">${KB[x].n}</button>`).join(' ') : ''}</div>`; }
    else h += `<div class="kit-status ok">✓ Lắp thành công: ${tn(st.A.length ? KB[st.A[0]].o().t : '')}${st.B.length ? ' + ' + tn(KB[st.B[0]].o().t) : ''} → <b>${tn(ev.end.t)}</b></div>`;
    h += `<div class="kit-flow" id="kitFlow"></div>`;
    if (ev.trace.length) h += `<details class="kit-trace" ${ev.errs.length ? '' : 'open'}><summary>Theo dõi kích thước dữ liệu qua từng khối</summary><table><thead><tr><th>Nhánh</th><th>Khối</th><th>Ra</th><th>Kiểu</th><th>Làm gì</th></tr></thead><tbody>${ev.trace.map(t => `<tr><td>${t.zone}</td><td><b>${KB[t.id].n}</b></td><td class="mono">${esc(t.s.s)}</td><td><span class="kt" style="--k:${KT[t.s.t][1]}">${tn(t.s.t)}</span></td><td>${KB[t.id].d}</td></tr>`).join('')}</tbody></table></details>`;
    if (r) {
      const g = r.sig.find(x => kitSig(kitParse(x)) === kitSig(st)); const note = r.note ? r.note(g) : '';
      h += `<div class="kit-card"><div class="eyebrow">Bạn vừa lắp ra</div><h2>${r.n}</h2><p><b>Bài toán:</b> ${r.task}</p>
        ${r.m.length || r.extra ? `<p><b>Mô hình thật:</b> ${r.m.map(mlink).join(' ')} ${r.extra ? `<span class="note-s">${r.extra}</span>` : ''}</p>` : ''}
        ${note ? `<p class="bad-note">${note}</p>` : ''}
        <div class="eyebrow" style="margin-top:10px">Lắp ra sao</div><ol class="kit-how">${r.how.map(x => `<li>${x}</li>`).join('')}</ol>
        <div class="pros-cols"><div class="pros-plus"><div class="eyebrow">Sức mạnh</div><ul>${r.plus.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="pros-minus"><div class="eyebrow">Nhược điểm</div><ul>${r.minus.map(x => `<li>${x}</li>`).join('')}</ul></div></div>
        <p class="note-s">${r.ls.filter(l => byId[l]).map(l => `<a class="chip" href="#${l}">Bài ${byId[l].code} ${byId[l].t}</a>`).join(' ')} ${r.ax ? `<a class="chip" href="https://arxiv.org/abs/${r.ax}" target="_blank" rel="noopener">📄 ${r.pt}</a>` : ''}</p></div>`;
    } else if (!ev.errs.length && ev.end && KOUT.includes(ev.end.t)) {
      const nb = kitNearest(st);
      h += `<div class="kit-card own"><div class="eyebrow">Thiết kế của riêng bạn</div><h2>Mô hình tự chế hợp lệ</h2><p>Các khớp đều vừa: dữ liệu đi từ ${st.A.map(id => KB[id].n).join(' → ')}${st.B.length ? ' (cùng nhánh B: ' + st.B.map(id => KB[id].n).join(' → ') + ')' : ''}${st.T.length ? ' → ' + st.T.map(id => KB[id].n).join(' → ') : ''} và ra <b>${tn(ev.end.t)}</b>. Chưa trùng công thức nổi tiếng nào trong Xưởng: lắp được chưa chắc đã tốt, hãy tự hỏi mỗi khối có thật sự cần không.</p>${nb ? `<p>Gần giống nhất: <button class="chip-btn" data-r="${nb.r.id}" data-g="${esc(nb.g)}">${nb.r.n}</button> (khác ${nb.v} khối).</p>` : ''}</div>`;
    }
    out.innerHTML = h;
    // sơ đồ động sinh từ bàn lắp
    const nodes = [], edges = [], caps = []; const clean = s => String(s).replace(/[:|,/]/g, ' ').replace(/\s+/g, ' ').trim();
    const la = st.A.length, lb = st.B.length, m = Math.max(la, lb), cols = [];
    for (let c = 0; c < m; c++) cols.push([]);
    st.A.forEach((id, i) => cols[m - la + i].push({ k: 'a' + i, id, z: 'A', i }));
    st.B.forEach((id, i) => cols[m - lb + i].push({ k: 'b' + i, id, z: 'B', i }));
    st.T.forEach((id, i) => cols.push([{ k: 't' + i, id, z: 'T', i }]));
    const tr = {}; ev.trace.forEach(t => { tr[t.zone + ':' + (t.zone === 'T' ? st.T.indexOf(t.id) : st[t.zone].indexOf(t.id))] = t.s.s; });
    const spec = cols.map(c => c.map(n => `${n.k}:${clean(KB[n.id].n)}:${KB[n.id].k}:${clean(tr[n.z + ':' + n.i] || '')}`).join(' / ')).join(' | ');
    for (let i = 1; i < la; i++) edges.push(`a${i - 1}>a${i}`); for (let i = 1; i < lb; i++) edges.push(`b${i - 1}>b${i}`);
    if (st.T.length) { if (la) edges.push(`a${la - 1}>t0`); if (lb) edges.push(`b${lb - 1}>t0`); }
    for (let i = 1; i < st.T.length; i++) edges.push(`t${i - 1}>t${i}`);
    cols.forEach(c => caps.push(c.map(n => `<b>${KB[n.id].n}</b>: ${KB[n.id].d}`).join('<br>')));
    try { if (cols.length) renderFlow($('#kitFlow'), { n: spec, e: edges.join(', '), c: caps }); } catch (e) { $('#kitFlow').innerHTML = ''; }
    quests(r);
  };
  const quests = r => $$('.kq').forEach(q => { const ok = r && KQUEST[+q.dataset.q][1].includes(r.id); q.classList.toggle('ok', !!ok); $('.kq-ic', q).textContent = ok ? '✓' : '○'; });
  const load = (sig) => { const p = kitParse(sig); st.A = p.A; st.B = p.B; st.T = p.T; zone = p.T.length ? 'T' : 'A'; draw(); };
  const add = (id, z) => { const b = KB[id];
    if (b.c === 'in') { const t = !st.A.length ? 'A' : !st.B.length ? 'B' : (z === 'A' ? 'A' : 'B'); if (st[t].length && KB[st[t][0]].c === 'in') st[t][0] = id; else st[t].unshift(id); zone = t; }
    else if (b.c === 'join') { if (st.T[0] && KB[st.T[0]].c === 'join') st.T[0] = id; else st.T.unshift(id); zone = 'T'; }
    else { let t = z || zone; if (b.c === 'head' && st.B.length) t = 'T'; st[t].push(id); if (b.c === 'head') zone = t; }
    draw(); };
  $('#page').onclick = e => {
    const kz = e.target.closest('.kz'); const pb = e.target.closest('.kit-pal .brick'); const placed = e.target.closest('.kz-row .brick');
    if (pb) { add(pb.dataset.b, zone); return; }
    if (placed) { st[placed.dataset.zone].splice(+placed.dataset.i, 1); draw(); return; }
    const pr = e.target.closest('[data-r]'); if (pr) { const r = KRBY[pr.dataset.r]; load(pr.dataset.g || r.sig[0]); $('.kit-board').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (e.target.closest('[data-wrong]')) { load('in_img>vit>yolo'); return; }
    const fx = e.target.closest('[data-fix]'); if (fx) { const [z, at, f] = fx.dataset.fix.split(':'); st[z].splice(+at, 0, ...f.split(',')); draw(); return; }
    const ad = e.target.closest('[data-add]'); if (ad) { st[st.T.length || st.B.length ? 'T' : 'A'].push(ad.dataset.add); draw(); return; }
    const k = e.target.closest('[data-k]'); if (k) { if (k.dataset.k === 'clear') { st.A = []; st.B = []; st.T = []; zone = 'A'; } else { const z = st.T.length ? 'T' : st.B.length && zone === 'B' ? 'B' : 'A'; st[z].pop(); } draw(); return; }
    if (kz) { zone = kz.dataset.z; draw(); }
  };
  // kéo thả
  $('#page').ondragstart = e => { const b = e.target.closest('.kit-pal .brick'); if (b) e.dataTransfer.setData('text/plain', b.dataset.b); };
  $$('.kz', $('#page')).forEach(z => { z.addEventListener('dragover', e => { e.preventDefault(); z.classList.add('drop'); }); z.addEventListener('dragleave', () => z.classList.remove('drop'));
    z.addEventListener('drop', e => { e.preventDefault(); z.classList.remove('drop'); const id = e.dataTransfer.getData('text/plain'); if (KB[id]) { zone = z.dataset.z; add(id, z.dataset.z); } }); });
  if (preset && KRBY[preset]) load(KRBY[preset].sig[0]); else load(KRBY.vityolo.sig[0]);
  renderGuide($('#kitGuide'), sig => { load(sig); setTimeout(() => { const o = $('#kitOut'); if (o) o.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80); });
}

/* ---- CHẾ ĐỘ LẮP CÓ HƯỚNG DẪN ---- */
function renderGuide(el, finish) {
  const S = { stage: 'task', task: null, r: null, sig: null, steps: [], built: { A: [], B: [], T: [] }, k: 0, miss: 0, hint: 0, tried: [], fb: '' };
  const hsh = (s, n) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h % n; };
  const typeOf = zone => { if (zone === 'T') { const ev = kitEval(S.built); return ev.end ? ev.end.t : null; } const ev = kitEval({ A: S.built[zone], B: [], T: [] }); return ev.end ? ev.end.t : null; };
  const kt = t => (t ? `<span class="kt" style="--k:${KT[t][1]}">${tn(t)}</span>` : '—');
  const pipe = (showAll) => {
    const p = kitParse(S.sig); const rowZ = (z, lab) => { const tgt = p[z]; if (!tgt.length) return ''; const done = S.built[z];
      return `<div class="gp-row"><span class="gp-lab">${lab}</span>${tgt.map((id, i) => { const isCur = S.stage === 'build' && S.steps[S.k] && S.steps[S.k].z === z && S.steps[S.k].i === i; return (i ? '<span class="kjoint"></span>' : '') + (i < done.length || showAll ? kitBrick(showAll && i >= done.length ? id : done[i], 'tabindex="-1"') : `<span class="gp-q${isCur ? ' cur' : ''}">?</span>`); }).join('')}</div>`; };
    return `<div class="gpipe">${rowZ('A', p.B.length ? 'Nhánh A' : 'Mô hình')}${rowZ('B', 'Nhánh B')}${rowZ('T', p.B.length ? 'Sau khi ghép' : 'Tiếp')}</div>`;
  };
  const optionsFor = () => {
    const st = S.steps[S.k], tgt = st.id, b = KB[tgt]; let pool;
    if (b.c === 'in') pool = Object.keys(KB).filter(id => KB[id].c === 'in' && id !== tgt);
    else if (b.c === 'join') pool = Object.keys(KB).filter(id => KB[id].c === 'join' && id !== tgt);
    else { const cur = typeOf(st.z); const comp = Object.keys(KB).filter(id => id !== tgt && !['in', 'join'].includes(KB[id].c) && KB[id].i.includes(cur)); const inc = Object.keys(KB).filter(id => id !== tgt && !['in', 'join'].includes(KB[id].c) && !KB[id].i.includes(cur));
      const pref = comp.filter(id => GALT[id + '>' + tgt]); const c1 = (pref.length ? pref : comp); pool = [];
      if (c1.length) pool.push(c1[hsh(S.sig + S.k, c1.length)]); const c2 = comp.filter(x => !pool.includes(x)); if (c2.length) pool.push(c2[hsh(S.sig + S.k + 'b', c2.length)]);
      if (inc.length) pool.push(inc[hsh(S.sig + S.k + 'c', inc.length)]); }
    const picks = pool.slice(0, 3); const all = [...picks, tgt]; const off = hsh(S.sig + 'o' + S.k, all.length);
    return all.map((_, i) => all[(i + off) % all.length]);
  };
  const judge = id => {
    const st = S.steps[S.k], tgt = st.id;
    if (id === tgt) return { ok: true };
    const b = KB[id], alt = GALT[id + '>' + tgt];
    if (b.c === 'in') return { ok: false, msg: `Bài toán "${S.task.t}" nhận <b>${S.task.in}</b>. Nhánh ${st.z} ở đây cần ${KB[tgt].n.toLowerCase()}, không phải ${b.n.toLowerCase()}.` };
    if (b.c === 'join') { const ta = typeOf('A'), tb = typeOf('B'); const fit = b.i.includes(ta) && b.i2.includes(tb);
      return { ok: false, msg: alt || (fit ? `"${b.n}" cắm được, nhưng nó ra ${b.o({ t: ta, H: 64, W: 64, C: 4, N: 10, d: 8 }, { t: tb, N: 8, d: 8 }) ? tn(b.o({ t: ta, H: 64, W: 64, C: 4, N: 10, d: 8 }, { t: tb, N: 8, d: 8 }).t) : '?'}, không đưa tới <b>${S.task.out}</b> mà bài toán cần.` : `"${b.n}" cần nhánh A ra ${b.i.map(tn).join(' hoặc ')} và nhánh B ra ${b.i2.map(tn).join(' hoặc ')}; hiện nhánh A ra ${tn(ta)}, nhánh B ra ${tn(tb)}.`) }; }
    const cur = typeOf(st.z);
    if (!b.i.includes(cur)) return { ok: false, msg: `Không cắm được: "${b.n}" cần <b>${b.i.map(tn).join(' hoặc ')}</b>, mà khối trước đang ra <b>${tn(cur)}</b>.` };
    const out = b.o({ t: cur, H: 7, W: 7, C: 8, N: 50, d: 8, L: 512, cls: 1 }).t;
    if (KOUT.includes(out)) return { ok: false, msg: alt || `"${b.n}" cắm được nhưng là đầu ra <b>${tn(out)}</b>, trong khi bài toán cần <b>${S.task.out}</b>${S.k < S.steps.length - 1 ? ', và còn khối phải lắp trước đó' : ''}.` };
    return { ok: false, msg: alt || `"${b.n}" cắm được (nó nhận ${tn(cur)}, ra ${tn(out)}), nhưng chưa phải bước cần ở đây. Đọc lại câu hỏi gợi ý: khối tiếp theo phải giải quyết điều gì?` };
  };
  const draw = () => {
    let h = '';
    if (S.stage === 'task') {
      h = `<div class="g-step"><span class="g-n">1</span><div><b>Bạn muốn mô hình làm gì?</b><div class="note-s">Bắt đầu từ bài toán, không phải từ khối. Chọn một:</div></div></div>
        <div class="g-tasks">${GTASK.map(t => `<button class="g-task" data-gt="${t.id}"><span class="g-ic">${t.ic}</span><b>${t.t}</b><small>${t.d}</small><span class="g-io">${t.in} → ${t.out}</span></button>`).join('')}</div>`;
    } else if (S.stage === 'cond') {
      h = `<div class="g-crumb"><button class="linkbtn" data-gback="task">← Đổi bài toán</button> ${S.task.ic} ${S.task.t}</div>
        <div class="g-step"><span class="g-n">2</span><div><b>${S.task.q}</b><div class="note-s">Cùng một bài toán, điều kiện khác thì kiến trúc khác.</div></div></div>
        <div class="g-conds">${S.task.opt.map(([rid, t, why]) => `<button class="g-cond" data-gc="${rid}"><b>${t}</b><small>${why}</small></button>`).join('')}</div>`;
    } else if (S.stage === 'plan') {
      const p = kitParse(S.sig);
      h = `<div class="g-crumb"><button class="linkbtn" data-gback="cond">← Đổi điều kiện</button> ${S.task.ic} ${S.task.t}</div>
        <div class="g-step"><span class="g-n">3</span><div><b>Bản thiết kế: ${S.steps.length} khối${p.B.length ? ', hai nhánh' : ''}</b><div class="note-s">Trước khi lắp, tự đoán xem mỗi dấu ? là khối gì. Dữ liệu vào: <b>${S.task.in}</b>, đầu ra cần: <b>${S.task.out}</b>.</div></div></div>
        ${pipe(false)}
        <div class="g-think">${p.B.length ? '<b>Vì sao có hai nhánh?</b> Bài toán có hai loại dữ liệu. Mỗi loại cần bộ mã hóa riêng, rồi một khối ghép đưa chúng về chung.' : '<b>Khung tư duy:</b> dữ liệu thô → "mắt" (bộ mã hóa) → khớp nối nếu kiểu dữ liệu chưa vừa → đầu ra đúng bài toán.'}</div>
        <div class="g-act"><button class="btn solid" data-gstart="1">Bắt đầu lắp từng khối →</button></div>`;
    } else if (S.stage === 'build') {
      const st = S.steps[S.k], tgt = st.id, th = GTHINK[tgt] || ['Khối tiếp theo là gì?', KB[tgt].d], cur = KB[tgt].c === 'in' ? null : KB[tgt].c === 'join' ? null : typeOf(st.z);
      const cat = KCAT.find(c => c[0] === KB[tgt].c);
      h = `<div class="g-crumb"><button class="linkbtn" data-gback="plan">← Bản thiết kế</button> ${S.task.ic} ${S.task.t} · khối ${S.k + 1}/${S.steps.length}</div>${pipe(false)}
        <div class="g-q"><div class="g-qh">🤔 ${th[0]}</div>
        <div class="note-s">${KB[tgt].c === 'join' ? `Nhánh A đang ra ${kt(typeOf('A'))}, nhánh B đang ra ${kt(typeOf('B'))}.` : cur ? `Khối trước đang ra ${kt(cur)}. Bài toán cần ra <b>${S.task.out}</b>.` : `Đây là khối đầu tiên của ${st.z === 'B' ? 'nhánh B' : 'mô hình'}.`}</div>
        ${S.hint >= 1 ? `<div class="g-hint">Gợi ý: cần một khối loại <b style="color:${cat[2]}">${cat[1]}</b>.</div>` : ''}
        <div class="g-opts">${optionsFor().map(id => kitBrick(id, `data-go="${id}"${S.tried.includes(id) ? ' data-tried="1"' : ''}${S.hint >= 2 && id === tgt ? ' data-glow="1"' : ''}`)).join('')}</div>
        ${S.fb}
        <div class="g-act">${S.hint < 2 ? `<button class="btn small ghost" data-ghint="1">💡 ${S.hint ? 'Chỉ luôn khối đúng' : 'Gợi ý'}</button>` : ''}<span class="note-s">Chọn sai không sao: đọc giải thích rồi chọn lại.</span></div></div>`;
    } else if (S.stage === 'done') {
      h = `<div class="g-crumb">${S.task.ic} ${S.task.t}</div>${pipe(true)}
        <div class="g-done"><div class="g-qh">🎉 Lắp xong: ${S.r.n}</div><p>${S.miss === 0 ? 'Không chọn sai lần nào. Xuất sắc!' : `Bạn chọn lại ${S.miss} lần. Mỗi lần sai là một khớp nối bạn vừa hiểu thêm.`}</p>
        <p><b>Mô hình thật:</b> ${S.r.m.map(mlink).join(' ') || S.r.extra || '—'}</p><ol class="kit-how">${S.r.how.map(x => `<li>${x}</li>`).join('')}</ol>
        <div class="g-act"><button class="btn solid" data-gfinish="1">Xem sơ đồ động, kích thước, sức mạnh và nhược điểm ↓</button><button class="btn ghost" data-gback="task">Lắp mô hình khác</button></div></div>`;
    }
    el.innerHTML = `<div class="guide">${h}</div>`;
  };
  el.onclick = e => {
    const t = e.target.closest('[data-gt]'); if (t) { S.task = GTASK.find(x => x.id === t.dataset.gt); S.stage = 'cond'; if (S.task.opt.length === 1) pickR(S.task.opt[0][0]); draw(); return; }
    const c = e.target.closest('[data-gc]'); if (c) { pickR(c.dataset.gc); draw(); return; }
    const bk = e.target.closest('[data-gback]'); if (bk) { S.stage = bk.dataset.gback; if (S.stage === 'cond' && S.task.opt.length === 1) S.stage = 'task'; S.built = { A: [], B: [], T: [] }; S.k = 0; S.fb = ''; S.tried = []; S.hint = 0; draw(); return; }
    if (e.target.closest('[data-gstart]')) { S.stage = 'build'; S.k = 0; S.built = { A: [], B: [], T: [] }; S.miss = 0; S.fb = ''; S.tried = []; S.hint = 0; draw(); return; }
    if (e.target.closest('[data-ghint]')) { S.hint++; draw(); return; }
    if (e.target.closest('[data-gfinish]')) { finish(S.sig); return; }
    const o = e.target.closest('[data-go]'); if (o && S.stage === 'build') {
      const id = o.dataset.go, j = judge(id), st = S.steps[S.k];
      if (j.ok) { S.built[st.z].push(id); const why = (GTHINK[id] || [])[1] || KB[id].d; S.k++; S.tried = []; S.hint = 0;
        if (S.k >= S.steps.length) { S.stage = 'done'; S.fb = ''; } else S.fb = `<div class="g-fb ok">✓ <b>${KB[id].n}</b>: ${why}</div>`; }
      else { S.miss++; if (!S.tried.includes(id)) S.tried.push(id); S.fb = `<div class="g-fb bad">✗ ${j.msg}</div>`; }
      draw(); }
  };
  const pickR = rid => { S.r = KRBY[rid]; S.sig = S.r.sig[0]; const p = kitParse(S.sig); S.steps = [...p.A.map((id, i) => ({ z: 'A', i, id })), ...p.B.map((id, i) => ({ z: 'B', i, id })), ...p.T.map((id, i) => ({ z: 'T', i, id }))]; S.stage = 'plan'; };
  draw();
}
