/* ================= APP ================= */
const ORDER = ['aitypes','vector','matmul','calculus','prob','gauss','cap0',
  'mlbasics','evaluation','knn','svm','tree','ensemble','kmeans','pca','nbayes','cap1',
  'neuron','activation','mlp','loss','backprop','optim','norm','cap2',
  'conv','convshape','channels','rf','cnnarch','resnet','efficient','detseg','yolo','cap3','embed','rnn','lstm','cap4',
  'attention','mha','posenc','transformer','vit','vitfam','cap5','ae','vae','gan','ganvar','diffwd','diffrev','diffadv','cap6',
  'contrastive','llm','lora','moe','ssm','gnn','rl','rag','anomaly','cap7',
  'search','games','logic','planning','bayesnet','hmm','evo','cap8',
  'xai','deploy','ethics','speech','vision3d','cap9'];
const ILLMAP = { conv: 'cnncat', cnnarch: 'cnncat', detseg: 'yolo', embed: 'nlpattn', rnn: 'tseries', lstm: 'tseries', ssm: 'tseries', attention: 'nlpattn', llm: 'nlpattn', vit: 'vitcat', vitfam: 'vitcat', diffwd: 'diffcat', diffrev: 'diffcat', contrastive: 'clipcat', xai: 'cnncat', anomaly: 'tseries' };
LESSONS.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
LESSONS.forEach(l => { if (AUG[l.id]) Object.assign(l, AUG[l.id]); if (!l.ill && ILLMAP[l.id]) l.ill = ILLMAP[l.id]; });
LESSONS.find(l => l.id === 'mlbasics').p = 'pml';
(() => {
  const P = id => PHASES.find(p => p.id === id);
  Object.assign(P('p0'), { t: 'Nền tảng Toán & Tổng quan', en: 'Foundations', d: 'Các thể loại AI, rồi vector, ma trận, đạo hàm, xác suất. Mọi mô hình phía sau chỉ là tổ hợp của bốn công cụ toán này.' });
  Object.assign(P('p1'), { d: 'Một nơ-ron, MLP, hàm mất mát, lan truyền ngược, tối ưu hóa, chuẩn hóa.' });
  Object.assign(P('p6'), { weeks: '3 tuần', d: 'CLIP, LLM, LoRA, Mixture-of-Experts, Mamba, mạng đồ thị, học tăng cường, RAG & Agent, và ứng dụng phát hiện lỗi công nghiệp.' });
  PHASES.splice(1, 0, { id: 'pml', t: 'Học máy cổ điển', en: 'Classical Machine Learning', weeks: '3 tuần',
    d: 'Hồi quy, đánh giá mô hình, k-NN, SVM, cây quyết định, rừng ngẫu nhiên & boosting, k-means, PCA, Naive Bayes.',
    out: 'Chọn và đánh giá đúng mô hình cho dữ liệu bảng; tính tay Gini, Bayes, một vòng k-means và boosting.' });
  PHASES.push({ id: 'psym', t: 'AI biểu tượng, xác suất & tiến hóa', en: 'Symbolic, Probabilistic & Evolutionary AI', weeks: '2 tuần',
    d: 'Tìm kiếm A*, minimax, logic & đồ thị tri thức, lập kế hoạch, mạng Bayes, HMM & Kalman, giải thuật di truyền.',
    out: 'Giải tay bài toán tìm đường, cây trò chơi, suy luận Bayes và một bước lọc Kalman; biết khi nào không cần học sâu.' });
  PHASES.push({ id: 'pprac', t: 'AI thực chiến', en: 'AI in Practice', weeks: '2 tuần',
    d: 'Giải thích mô hình, triển khai & nén, đạo đức – công bằng – an toàn, xử lý giọng nói, thị giác 3D.',
    out: 'Đưa mô hình ra dây chuyền có trách nhiệm: giải thích được, chạy nhanh, công bằng giữa các nhóm, được giám sát.' });
  PHASES.forEach((p, i) => p.n = i);
})();
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const byId = {}; LESSONS.forEach(l => byId[l.id] = l);
const phaseOf = id => PHASES.find(p => p.id === id);
// lesson codes like 2.3
PHASES.forEach(p => { LESSONS.filter(l => l.p === p.id).forEach((l, i) => { l.code = p.n + '.' + (i + 1); }); });

const WEEKS = [
  ['aitypes', 'vector', 'matmul'], ['calculus', 'prob', 'gauss', 'cap0'],
  ['mlbasics', 'evaluation', 'knn'], ['svm', 'tree', 'ensemble'], ['kmeans', 'pca', 'nbayes', 'cap1'],
  ['neuron', 'activation', 'mlp'], ['loss', 'backprop'], ['optim', 'norm', 'cap2'],
  ['conv', 'convshape', 'channels'], ['rf', 'cnnarch', 'resnet'], ['efficient', 'detseg', 'yolo'], ['cap3'],
  ['embed', 'rnn', 'lstm', 'cap4'],
  ['attention'], ['mha', 'posenc', 'transformer'], ['vit', 'vitfam', 'cap5'],
  ['ae', 'vae'], ['gan', 'ganvar'], ['diffwd', 'diffrev'], ['diffadv', 'cap6'],
  ['contrastive', 'llm', 'lora'], ['moe', 'ssm', 'gnn'], ['rl', 'rag', 'anomaly', 'cap7'],
  ['search', 'games', 'logic'], ['planning', 'bayesnet', 'hmm', 'evo', 'cap8'],
  ['xai', 'deploy', 'ethics'], ['speech', 'vision3d', 'cap9'],
];

/* ---------- progress (per viewer) ---------- */
let DONE = {};
try { DONE = JSON.parse(localStorage.getItem('abt-done') || '{}') || {}; } catch (e) { DONE = {}; }
function saveDone() { try { localStorage.setItem('abt-done', JSON.stringify(DONE)); } catch (e) {} }
function progText() { const n = LESSONS.filter(l => DONE[l.id]).length; return n + '/' + LESSONS.length + ' bài'; }

/* ---------- table of contents ---------- */
function renderToc(filter = '') {
  const f = filter.trim().toLowerCase();
  let html = '';
  PHASES.forEach(p => {
    const ls = LESSONS.filter(l => l.p === p.id && (!f || (l.t + ' ' + l.en + ' ' + l.id).toLowerCase().includes(f)));
    if (!ls.length) return;
    const done = LESSONS.filter(l => l.p === p.id && DONE[l.id]).length;
    const tot = LESSONS.filter(l => l.p === p.id).length;
    html += `<div class="ph-group"><div class="ph-head"><span class="ph-num">${p.n}</span>${p.t}<small>${done}/${tot}</small></div><ul>`;
    ls.forEach(l => { html += `<li><a href="#${l.id}" data-id="${l.id}"><span class="code">${l.code}</span><span>${l.t}</span>${DONE[l.id] ? '<span class="tick">✓</span>' : ''}</a></li>`; });
    html += '</ul></div>';
  });
  $('#toc').innerHTML = html || '<p class="note-s">Không tìm thấy bài nào.</p>';
  markToc();
  $('#progMini').textContent = progText();
}
function markToc() { const cur = location.hash.slice(1); $$('#toc a').forEach(a => a.classList.toggle('on', a.dataset.id === cur)); }

/* ---------- diagram: flow of boxes with optional skip arcs ---------- */
function diagram(spec) {
  const nodes = spec.nodes.map(n => typeof n === 'string' ? { t: n, s: '' } : n);
  const pad = 14, gap = 30, h = 54;
  const widths = nodes.map(n => Math.max(54, Math.max(n.t.length * 8.2, (n.s || '').length * 6.6) + 22));
  const skips = spec.skips || [];
  const top = skips.length ? 34 + 14 * (skips.length - 1) : 10;
  let x = pad; const xs = [];
  widths.forEach(w => { xs.push(x); x += w + gap; });
  const W = x - gap + pad, H = top + h + 14;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Sơ đồ: ${nodes.map(n => n.t).join(' → ')}" style="max-width:none">`;
  s += `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted)"/></marker>
        <marker id="ahr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--red)"/></marker></defs>`;
  skips.forEach(([a, b, lab], k) => {
    const x1 = xs[a] + widths[a] / 2, x2 = xs[b] + widths[b] / 2, y0 = top, yc = top - 22 - 14 * k;
    s += `<path d="M${x1},${y0} C${x1},${yc} ${x2},${yc} ${x2},${y0 - 2}" fill="none" stroke="var(--red)" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#ahr)"/>`;
    if (lab) s += `<text x="${(x1 + x2) / 2}" y="${yc + 7}" text-anchor="middle" font-size="12" fill="var(--red)" font-family="var(--f-body)">${lab}</text>`;
  });
  nodes.forEach((n, i) => {
    const c = n.c === 'red' ? 'var(--red)' : 'var(--pen)';
    const bg = n.c === 'red' ? 'var(--red-soft)' : 'var(--pen-soft)';
    s += `<rect x="${xs[i]}" y="${top}" width="${widths[i]}" height="${h}" rx="9" fill="${bg}" stroke="${c}" stroke-width="1.4"/>`;
    s += `<text x="${xs[i] + widths[i] / 2}" y="${top + (n.s ? 23 : 32)}" text-anchor="middle" font-size="14" font-weight="600" fill="var(--ink)" font-family="var(--f-body)">${n.t}</text>`;
    if (n.s) s += `<text x="${xs[i] + widths[i] / 2}" y="${top + 41}" text-anchor="middle" font-size="11.5" fill="var(--muted)" font-family="var(--f-mono)">${n.s}</text>`;
    if (i < nodes.length - 1) s += `<line x1="${xs[i] + widths[i] + 3}" y1="${top + h / 2}" x2="${xs[i + 1] - 4}" y2="${top + h / 2}" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#ah)"/>`;
  });
  return s + '</svg>';
}

/* ---------- pages ---------- */
function totalMin(ids) { return ids.reduce((a, id) => a + (byId[id] ? byId[id].min : 0), 0); }
function hrs(m) { const h = m / 60; return (Math.round(h * 2) / 2).toString().replace('.', ',') + ' giờ'; }

function renderHome() {
  const nW = Object.keys(W).length;
  const allMin = totalMin(LESSONS.map(l => l.id));
  let h = `<section class="hero">
    <div class="eyebrow">Khóa tự học tiếng Việt · theo phương pháp “AI by Hand” của Prof. Tom Yeh</div>
    <h1>Hiểu AI bằng <span class="hand">bút và giấy</span></h1>
    <p class="lead">Từ tích vô hướng đến Diffusion Transformer. Mỗi bài có giải thích, công thức, sơ đồ và một trang tính tay tương tác để bạn tự làm từng con số trước khi chạm vào PyTorch.</p>
    <div class="stats"><div><b>${LESSONS.length}</b><span>bài học</span></div><div><b>${PHASES.length}</b><span>giai đoạn</span></div><div><b>${WEEKS.length}</b><span>tuần (~${Math.round(allMin / 60)} giờ)</span></div><div><b>${nW}</b><span>trang tính tay</span></div></div>
    <div class="done-row" style="margin-top:14px"><a class="btn solid" href="#${firstUndone()}">${LESSONS.some(l => DONE[l.id]) ? 'Học tiếp' : 'Bắt đầu bài 0.1'} →</a><a class="btn ghost" href="#plan">Xem kế hoạch ${WEEKS.length} tuần</a><span class="note-s" style="margin:0">Tiến độ: ${progText()} (lưu trên trình duyệt này)</span></div>
  </section>
  <a class="map-teaser" href="#map"><span class="hand">Bản đồ AI thế giới</span><span>18 lĩnh vực AI hiện nay: thị giác, LLM, agent, robot, AI cho khoa học… mỗi lĩnh vực nối về bài nền tảng trong khóa. →</span></a>
  <div class="teasers"><a class="map-teaser kit-t" href="#kit"><span class="hand">🧩 Xưởng lắp ráp mô hình</span><span>Ghép CNN, ViT, YOLO, LLM, bộ mã hóa chữ như Lego: lắp ViT + YOLO ra gì, ViT + LLM ra gì, lắp sai thì hỏng ở khớp nào.</span></a>
  <a class="map-teaser" href="#models"><span class="hand">Mô hình nổi tiếng hiện nay</span><span>${MODELS_G.length} mô hình từ GPT, Claude, Llama, DeepSeek đến YOLO26, SAM 3, DINOv3, FLUX, Whisper: kiến trúc, sức mạnh, nhược điểm, paper.</span></a></div>
  <h2>Lộ trình ${PHASES.length} giai đoạn</h2>
  <p class="prose">Đi theo thứ tự. Mỗi giai đoạn dựa trên giai đoạn trước; mỗi bài ghi rõ bài tiên quyết. Mốc “đầu ra” là điều bạn phải làm được bằng tay trước khi sang giai đoạn kế.</p>
  <div class="road">`;
  PHASES.forEach(p => {
    const ls = LESSONS.filter(l => l.p === p.id);
    h += `<div class="road-item"><div class="road-num">${p.n}</div><div class="road-card">
      <span class="wk">${p.weeks} · ${hrs(totalMin(ls.map(l => l.id)))}</span>
      <h3>${p.t}<small>${p.en}</small></h3><p>${p.d}</p>
      <p class="out"><b>Đầu ra:</b> ${p.out}</p>
      <div class="lchips">${ls.map(l => `<a href="#${l.id}" class="${DONE[l.id] ? 'done' : ''}${l.id.startsWith('cap') ? ' cap' : ''}">${l.code} ${l.t}${DONE[l.id] ? ' ✓' : ''}</a>`).join('')}</div>
    </div></div>`;
  });
  h += `</div>
  <h2>Cách học một bài</h2>
  <div class="method">
    <div><span class="hand">1 · Đọc</span><h3>Nắm trực giác trước</h3><p>Đọc phần “Hiểu bằng trực giác”, rồi phần kiến thức và sơ đồ. Trả lời được “bài này giải quyết vấn đề gì” trước khi đi vào công thức.</p></div>
    <div><span class="hand">2 · Tính tay</span><h3>Theo ví dụ giải mẫu</h3><p>Che lời giải, tự làm ví dụ mẫu trên vở, mở từng bước để đối chiếu. Sau đó đổi số trong trang tính tay và làm lại.</p></div>
    <div><span class="hand">3 · Bài tập</span><h3>Tự kiểm tra</h3><p>Làm bài tập cuối bài trước khi mở đáp án. Sai ở đâu thì quay lại đúng bước đó trong trang tính tay.</p></div>
    <div><span class="hand">4 · Code</span><h3>Viết lại bằng NumPy</h3><p>Cài đặt đúng phép tính vừa làm bằng NumPy, so với PyTorch. Khi khớp số với bản tính tay, bạn đã thực sự hiểu.</p></div>
  </div>
  <h2>Tài nguyên đi kèm</h2>
  <ul class="res-list prose">
    <li><a href="https://www.byhand.ai" target="_blank" rel="noopener">AI by Hand (byhand.ai)</a> — bản gốc của Prof. Tom Yeh: workbook, Excel blueprints, seminar.</li>
    <li><a href="https://www.youtube.com/@ai-by-hand" target="_blank" rel="noopener">AI by Hand trên YouTube</a> và LinkedIn của Prof. Tom Yeh — bài vẽ tay miễn phí.</li>
    <li><a href="https://d2l.aivivn.com" target="_blank" rel="noopener">Đắm mình vào Học Sâu</a> — bản dịch tiếng Việt của Dive into Deep Learning, có code.</li>
    <li><a href="https://cs231n.stanford.edu" target="_blank" rel="noopener">Stanford CS231n</a> — CNN và thị giác máy tính.</li>
    <li><a href="https://www.3blue1brown.com/topics/neural-networks" target="_blank" rel="noopener">3Blue1Brown — Neural Networks</a> — hình ảnh trực quan cho backprop và Transformer.</li>
    <li><a href="https://lilianweng.github.io" target="_blank" rel="noopener">Lil’Log (Lilian Weng)</a> — bài tổng quan rất kỹ về Diffusion, GAN, VAE.</li>
  </ul>
  <div class="done-row"><button class="btn small ghost" id="copyJson">Sao chép dữ liệu khóa học (JSON)</button><span class="note-s" id="copyMsg" style="margin:0"></span></div>
  <p class="foot">Nội dung tự biên soạn bằng tiếng Việt, lấy cảm hứng từ phương pháp “AI by Hand” của Prof. Tom Yeh (CU Boulder). Không sao chép worksheet gốc; hãy ủng hộ bản gốc tại byhand.ai.</p>`;
  $('#page').innerHTML = h;
  $('#copyJson').onclick = () => {
    const data = { phases: PHASES, weeks: WEEKS, lessons: LESSONS.map(l => ({ id: l.id, code: l.code, phase: l.p, title: l.t, en: l.en, minutes: l.min, prerequisites: l.pre, goals: l.goals, exercises: l.ex, application: l.app, papers: l.papers, body_html: l.body.trim() })) };
    const txt = JSON.stringify(data, null, 2);
    const msg = $('#copyMsg');
    try { navigator.clipboard.writeText(txt).then(() => msg.textContent = 'Đã sao chép ' + Math.round(txt.length / 1024) + ' KB.', () => fallbackCopy(txt, msg)); } catch (e) { fallbackCopy(txt, msg); }
  };
  typeset();
}
function fallbackCopy(txt, msg) {
  const ta = document.createElement('textarea'); ta.value = txt; ta.style.cssText = 'width:100%;height:160px;margin-top:10px;font:12px var(--f-mono)';
  msg.textContent = 'Trình duyệt chặn sao chép tự động; hãy chọn và sao chép trong ô bên dưới.';
  msg.parentNode.after(ta); ta.select();
}
function firstUndone() { const l = LESSONS.find(l => !DONE[l.id]); return l ? l.id : LESSONS[0].id; }

function renderPlan() {
  let rows = '';
  WEEKS.forEach((ids, i) => {
    const ph = phaseOf(byId[ids[0]].p);
    rows += `<tr><td>Tuần ${i + 1}</td><td>${ph.n} · ${ph.t}</td><td>${ids.map(id => `<a href="#${id}">${byId[id].code} ${byId[id].t}</a>${DONE[id] ? ' ✓' : ''}`).join('<br>')}</td><td style="white-space:nowrap">${hrs(totalMin(ids) * 2.5)}</td></tr>`;
  });
  $('#page').innerHTML = `<div class="eyebrow">Kế hoạch học</div><h1>${WEEKS.length} tuần, từ vector đến Diffusion</h1>
  <p class="lead">Thời lượng gợi ý đã tính cả đọc, tính tay, bài tập và viết lại bằng NumPy (khoảng 2,5 lần thời gian đọc). Bạn bận thì giãn ra gấp đôi; quan trọng là không bỏ bước tính tay.</p>
  <div class="tbl-wrap"><table class="tbl weeks"><tr><th>Tuần</th><th>Giai đoạn</th><th>Bài học</th><th>Giờ</th></tr>${rows}</table></div>
  <h2>Cách đọc một bài báo theo 3 lượt</h2>
  <div class="prose"><p>Mỗi bài học có một bài báo kinh điển kèm câu hỏi dẫn dắt. Đọc theo phương pháp “ba lượt” của S. Keshav (<a href="https://scholar.google.com/scholar?q=%22How+to+Read+a+Paper%22+Keshav" target="_blank" rel="noopener">How to Read a Paper</a>, 2007):</p>
  <ol><li><b>Lượt 1 (10 phút):</b> đọc tiêu đề, tóm tắt, phần mở đầu, các tiêu đề mục, kết luận; lướt hình và danh sách tham khảo. Trả lời: bài thuộc loại gì, giải quyết vấn đề gì, đóng góp chính là gì.</li>
  <li><b>Lượt 2 (khoảng 1 giờ):</b> đọc kỹ nhưng bỏ qua chứng minh. Xem kỹ từng hình, bảng, trục đồ thị. Ghi chú những gì chưa hiểu và các bài tham khảo cần đọc thêm.</li>
  <li><b>Lượt 3 (vài giờ):</b> tự “làm lại” bài báo: viết lại công thức chính, tính tay một ví dụ nhỏ như trong trang tính, rồi cài đặt bằng code. Tìm giả định ẩn và điểm yếu.</li></ol>
  <p>Mẹo: đọc paper ngay sau khi làm xong trang tính “Tính tay từng số” của bài đó. Bạn sẽ nhận ra các công thức trong paper chính là những phép tính vừa bấm qua.</p></div>
  <h2>Năm cột mốc dự án</h2>
  <div class="prose">
  <p><b>Sau tuần 5 — Học máy cổ điển trên dữ liệu thật:</b> lấy một bảng dữ liệu sản xuất (thông số máy, kết quả kiểm tra), so sánh hồi quy logistic, random forest và XGBoost bằng kiểm định chéo; báo cáo recall/precision ở ngưỡng vận hành và giải thích bằng SHAP.</p>
  <p><b>Sau tuần 8 — MLP từ số 0:</b> viết MLP + backprop bằng NumPy thuần, huấn luyện trên MNIST, đạt trên 97%. Kiểm tra gradient bằng sai phân hữu hạn.</p>
  <p><b>Sau tuần 15 — CNN vs ViT:</b> huấn luyện ResNet-18 và ViT-Tiny trên cùng một tập ảnh nhỏ của bạn. So sánh độ chính xác, tốc độ, và bản đồ Grad-CAM / attention.</p>
  <p><b>Sau tuần 19 — Mô hình sinh:</b> viết DDPM nhỏ trên ảnh 32×32, thêm điều kiện lớp và classifier-free guidance; đánh giá bằng FID và bằng tác dụng thực tế khi dùng ảnh sinh để huấn luyện bộ phân loại.</p>
  <p><b>Sau tuần 26 — Đưa ra dây chuyền:</b> lượng tử hóa INT8 mô hình tốt nhất, đo độ trễ trên máy đích, báo cáo chỉ số theo từng dây chuyền/sản phẩm, và dựng giám sát trôi dữ liệu.</p>
  </div>`;
}

function stepsHTML(steps, ans, key) {
  return `<ol class="wsteps" data-k="${key}">${steps.map((st, i) => `<li${i ? ' hidden' : ''}><span class="sn">Bước ${i + 1}</span><div>${st}</div></li>`).join('')}</ol>
  <div class="ans" hidden><span class="hand">Đáp số</span> ${ans}</div>
  <div class="step-ctl"><button class="btn small solid" data-act="next">Bước tiếp →</button><button class="btn small ghost" data-act="all">Hiện tất cả</button><span class="note-s" data-prog style="margin:0">1/${steps.length}</span></div>`;
}
function wireSteps(root) {
  $$('.step-ctl', root).forEach(ctl => {
    const ol = ctl.previousElementSibling.previousElementSibling, ans = ctl.previousElementSibling, lis = $$('li', ol), prog = $('[data-prog]', ctl);
    const show = n => { lis.forEach((li, i) => li.hidden = i >= n); const done = n >= lis.length; ans.hidden = !done; prog.textContent = done ? 'Đã hiện đủ' : n + '/' + lis.length; $('[data-act=next]', ctl).hidden = done; $('[data-act=all]', ctl).hidden = done; };
    let n = 1;
    $('[data-act=next]', ctl).onclick = () => { n++; show(n); };
    $('[data-act=all]', ctl).onclick = () => { n = lis.length; show(n); };
  });
}
function renderLesson(l) {
  const ph = phaseOf(l.p);
  const idx = LESSONS.indexOf(l);
  const prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
  let h = `<div class="eyebrow">Giai đoạn ${ph.n} · ${ph.t} · Bài ${l.code}</div>
  <h1>${l.t}</h1><div class="note-s" style="margin-top:-6px">${l.en}</div>
  <div class="meta"><span class="chip">⏱ ${l.min} phút đọc</span>${l.pre.length ? l.pre.map(id => `<a class="chip" href="#${id}">cần: ${byId[id].code} ${byId[id].t}</a>`).join('') : '<span class="chip">không cần bài trước</span>'}</div>
  <div class="section-label"><span class="hand">Video bài học</span></div><div id="vid"></div>
  <div class="goals"><div class="eyebrow">Học xong bài này bạn sẽ</div><ul>${l.goals.map(g => `<li>${g}</li>`).join('')}</ul></div>`;
  if (l.intuit) h += `<div class="intuit"><div class="eyebrow">Hiểu bằng trực giác</div>${l.intuit}</div>`;
  if (FLOW[l.id]) h += `<div class="section-label"><span class="hand">Sơ đồ mô hình</span></div><div id="flw"></div>`;
  illKeys(l).forEach((k, i) => { h += `<div class="section-label"><span class="hand">Minh họa trực quan</span></div><div class="ill-box"><div class="ill-title"><b>${ILLT[k]}</b></div><div class="ill-body" id="ill${i}"></div></div>`; });
  h += `<div class="section-label"><span class="hand">${l.id.startsWith('cap') ? 'Đề bài' : 'Kiến thức'}</span></div><div class="prose">${l.body}</div>`;
  if (l.diag && !FLOW[l.id]) h += `<div class="diag">${diagram(l.diag)}</div>`;
  if (PROS[l.id]) h += `<div class="section-label"><span class="hand">Chức năng · Sức mạnh · Nhược điểm</span></div>${prosHTML(l.id)}`;
  if (KITLINK[l.id]) h += `<a class="kit-link" href="#kit" data-kit="${KITLINK[l.id]}"><span>🧩</span><div><b>Lắp thử trong Xưởng lắp ráp</b><small>${KRBY[KITLINK[l.id]].n}: xem mô hình này được ghép từ những khối nào và ghép sai thì hỏng ở đâu.</small></div></a>`;
  if (l.worked) h += `<div class="section-label"><span class="hand">Ví dụ giải mẫu</span></div><div class="worked"><h3>${l.worked.t}</h3><p class="setup"><b>Đề bài.</b> ${l.worked.setup}</p>${stepsHTML(l.worked.steps, l.worked.ans, 'w')}</div>`;
  if (SW[l.id]) h += `<div class="section-label"><span class="hand">Tính tay từng số</span></div><p class="note-s" style="margin-top:-4px">Mỗi lần bấm hiện ra một con số. Chép các ma trận ra giấy, tự tính ô tiếp theo rồi mới bấm để kiểm tra.</p><div id="swb"></div>`;
  if (l.w && W[l.w]) h += `<div class="section-label"><span class="hand">Phòng thí nghiệm</span></div><div class="sheet-box"><div class="sheet-head"><span class="hand">✍</span><b>${WT[l.w] || 'Trang tính'}</b><small>Đổi số, bấm vào ô, rồi chép ra giấy để tự tính lại</small></div><div class="sheet" id="wg"></div></div>`;
  if (l.miss && l.miss.length) h += `<div class="section-label"><span class="hand">Lỗi hay hiểu sai</span></div><div class="miss">${l.miss.map(([a, b]) => `<div><p class="wrong"><span>✗</span>${a}</p><p class="right"><span>✓</span>${b}</p></div>`).join('')}</div>`;
  if (l.ex && l.ex.length) {
    h += `<div class="section-label"><span class="hand">Bài tập</span></div><p class="note-s" style="margin-top:-4px">Tự làm ra giấy trước. Bí thì mở từng bước gợi ý, đừng mở hết một lần.</p>`;
    l.ex.forEach((e, i) => {
      const q = Array.isArray(e) ? e[0] : e.q;
      const body = Array.isArray(e) ? `<div class="a">${e[1]}</div>` : `<div class="a">${stepsHTML(e.s, e.a, 'e' + i)}</div>`;
      h += `<details class="ex"><summary><span class="q">${i + 1}.</span><span>${q}</span><span class="hint">lời giải</span></summary>${body}</details>`;
    });
  }
  if (l.recap && l.recap.length) h += `<div class="recap"><div class="eyebrow">Ghi nhớ</div><ul>${l.recap.map(r => `<li>${r}</li>`).join('')}</ul></div>`;
  if (l.app) h += `<div class="app-note"><b>Áp dụng vào bài toán kiểm tra lỗi bo mạch:</b> ${l.app}</div>`;
  const rd = READ[l.id];
  if (rd || (l.papers && l.papers.length)) h += `<div class="section-label"><span class="hand">Đọc bài báo</span></div>`;
  if (rd) h += `<div class="paper-card"><div class="eyebrow">Bài báo nên đọc trước</div><a class="pc-title" href="${paperUrl(rd)}" target="_blank" rel="noopener">${rd.t}</a><div class="pc-meta">${rd.a} · <i>${rd.v}</i>, ${rd.y}${rd.ax ? ` · arXiv ${rd.ax}` : ''}</div>
    <dl><dt>Vì sao nên đọc</dt><dd>${rd.why}</dd><dt>Đọc phần nào trước</dt><dd>${rd.start}</dd><dt>Câu hỏi khi đọc</dt><dd><ol>${rd.q.map(q => `<li>${q}</li>`).join('')}</ol></dd></dl>
    <p class="note-s" style="margin:6px 0 0">Mới đọc paper? Xem <a href="#plan">cách đọc một bài báo theo 3 lượt</a>.</p></div>`;
  if (l.papers && l.papers.length) h += `<div class="note-s" style="margin-top:14px">Đọc thêm (bấm để tìm trên Google Scholar):</div><ul class="papers">${l.papers.map(p => `<li><a href="${scholarUrl(p)}" target="_blank" rel="noopener">${p}</a></li>`).join('')}</ul>`;
  h += `<div class="done-row"><button class="btn ${DONE[l.id] ? '' : 'solid'}" id="doneBtn">${DONE[l.id] ? '✓ Đã học xong — bỏ đánh dấu' : 'Đánh dấu đã học xong'}</button></div>`;
  h += `<div class="pager">${prev ? `<a href="#${prev.id}"><small>← Bài trước · ${prev.code}</small>${prev.t}</a>` : '<span></span>'}${next ? `<a class="next" href="#${next.id}"><small>Bài sau · ${next.code} →</small>${next.t}</a>` : '<a class="next" href="#home"><small>Hoàn thành lộ trình →</small>Về trang lộ trình</a>'}</div>`;
  $('#page').innerHTML = h;
  if (FLOW[l.id]) { try { renderFlow($('#flw'), FLOW[l.id]); } catch (e) { $('#flw').innerHTML = '<p class="note-s">Không tải được sơ đồ: ' + e.message + '</p>'; } }
  illKeys(l).forEach((k, i) => { try { ILL[k]($('#ill' + i)); } catch (e) { $('#ill' + i).innerHTML = '<p class="note-s">Không tải được hình minh họa: ' + e.message + '</p>'; } });
  try { videoPlayer($('#vid'), l); } catch (e) { $('#vid').innerHTML = '<p class="note-s">Không tải được video: ' + e.message + '</p>'; }
  if (SW[l.id]) { try { swRender($('#swb'), l.id); } catch (e) { $('#swb').innerHTML = '<p class="note-s">Không tải được trang tính: ' + e.message + '</p>'; } }
  if (l.w && W[l.w]) { try { W[l.w]($('#wg')); } catch (e) { $('#wg').innerHTML = '<p class="note-s">Không tải được trang tính: ' + e.message + '</p>'; } }
  wireSteps($('#page'));
  $('#doneBtn').onclick = () => { if (DONE[l.id]) delete DONE[l.id]; else DONE[l.id] = 1; saveDone(); renderToc($('#search').value); renderLesson(l); };
  typeset();
}

/* ---------- MathJax ---------- */
function typeset(el) {
  const target = el || $('#page');
  if (window.MathJax && MathJax.typesetPromise) { MathJax.typesetClear && MathJax.typesetClear([target]); MathJax.typesetPromise([target]).catch(() => {}); }
  else { window.__pendingTypeset = true; }
}

const KITLINK = { cnnarch: 'cnncls', resnet: 'cnncls', vit: 'hybrid', vitfam: 'vityolo', yolo: 'vityolo', detseg: 'yolos', contrastive: 'clip', llm: 'vlm', diffrev: 'sd', diffadv: 'sd3', attention: 'flamingo', transformer: 'detr', speech: 'whisper', ssm: 'ts', cap3: 'hybrid', cap5: 'vlm', cap6: 'sd', cap7: 'clip', gan: 'gan', embed: 'bert' };
/* ---------- router ---------- */
let lastView = '';
function route() {
  const id = location.hash.slice(1) || 'home';
  if (id === lastView) return;
  lastView = id;
  if (VP) VP.destroy();
  $('#page').onclick = null; $('#page').ondragstart = null;
  if (byId[id]) renderLesson(byId[id]);
  else if (id === 'plan') { renderPlan(); }
  else if (id === 'map') { renderMap(); }
  else if (id === 'models') { renderModels(MODEL_FOCUS); MODEL_FOCUS = null; }
  else if (id === 'kit') { renderKit(); }
  else { renderHome(); }
  $('#navHome').classList.toggle('on', id === 'home' || !byId[id] && !['plan', 'map', 'models', 'kit'].includes(id));
  $('#navKit').classList.toggle('on', id === 'kit'); $('#navModels').classList.toggle('on', id === 'models');
  $('#navMap').classList.toggle('on', id === 'map');
  $('#navPlan').classList.toggle('on', id === 'plan');
  markToc();
  if (window.matchMedia('(max-width: 920px)').matches) $('#side').hidden = true;
  window.scrollTo(0, 0);
}
function rerender() { lastView = ''; route(); }

window.addEventListener('hashchange', route);
$('#search').addEventListener('input', e => renderToc(e.target.value));
$('#menuBtn').addEventListener('click', () => { $('#side').hidden = !$('#side').hidden; });
try { window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', rerender); } catch (e) {}
new MutationObserver(rerender).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
renderToc();
route();
