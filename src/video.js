/* ================= VIDEO BÀI HỌC ================= */
let VP = null;
const plainText = html => { const d = document.createElement('div'); d.innerHTML = String(html || '').replace(/\$\$[\s\S]*?\$\$/g, ' ').replace(/\$[^$]*\$/g, ' '); return d.textContent.replace(/\s+([,.;:])/g, '$1').replace(/\s+/g, ' ').trim(); };
const firstPara = html => { const m = String(html || '').match(/<p>([\s\S]*?)<\/p>/); return m ? m[1] : html; };
const sentences = t => (t.match(/(?:[^.!?…]|[.,](?=\d))+[.!?…]*/g) || [t]).map(s => s.trim()).filter(Boolean);
const illKeys = l => (l.ill ? (Array.isArray(l.ill) ? l.ill : [l.ill]) : []);

function lessonScenes(l) {
  const ph = phaseOf(l.p), sc = [], isCap = l.id.startsWith('cap');
  sc.push({ k: 'title', head: '', html: `<div class="vs-title"><div class="vs-chip">${isCap ? 'Bài tập tổng hợp' : 'Giai đoạn ' + ph.n} · ${ph.t}</div><div class="hand vs-code">Bài ${l.code}</div><h2 class="vs-words">${l.t.split(' ').map((w, i) => `<span style="animation-delay:${0.25 + i * 0.07}s">${w}</span>`).join(' ')}</h2><div class="vs-en">${l.en}</div></div>`,
    say: `Bài ${l.code}: ${l.t}. Cùng xem nó là gì, mô hình hoạt động ra sao, cách tính bằng tay, và ứng dụng thực tế.` });
  if (l.intuit) sc.push({ k: 'what', head: 'Là gì?', html: `<div class="vs-card vs-text">${firstPara(l.intuit)}</div>`, say: plainText(firstPara(l.intuit)) });
  if (FLOW[l.id]) { const caps = FLOW[l.id].c || []; sc.push({ k: 'flow', head: 'Sơ đồ mô hình', flow: l.id, say: caps.map(plainText).join(' ') || 'Sơ đồ mô hình.', sync: 'flow' }); }
  illKeys(l).slice(0, 1).forEach(k => sc.push({ k: 'ill', head: 'Minh họa trực quan', ill: k, say: `${ILLT[k]}. Hãy quan sát từng bước: dữ liệu đi qua mô hình, các con số được tính, và kết quả đúng hay sai ở đâu.`, minMs: 9000 }));
  sc.push({ k: 'know', head: 'Kiến thức cốt lõi', html: `<ul class="vs-list">${(l.recap || l.goals).map(r => `<li>${r}</li>`).join('')}</ul>`, say: (l.recap || l.goals).map(plainText).map(s => (s.endsWith('.') ? s : s + '.')).join(' '), sync: 'list' });
  const pr = PROS[l.id];
  if (pr) sc.push({ k: 'pros', head: 'Sức mạnh và nhược điểm', html: `<div class="vs-pros"><div class="vs-pp"><div class="vs-ph">✓ Sức mạnh</div><ul class="vs-list">${pr.plus.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="vs-pm"><div class="vs-ph">✗ Nhược điểm</div><ul class="vs-list">${pr.minus.map(x => `<li>${x}</li>`).join('')}</ul></div></div>${pr.now.length ? `<div class="vs-now">Đang dùng trong: ${pr.now.map(id => MBY[id] ? MBY[id].n : '').join(' · ')}</div>` : ''}`,
    say: `Chức năng: ${plainText(pr.fn)} Sức mạnh: ${pr.plus.map(plainText).join('; ')}. Nhược điểm: ${pr.minus.map(plainText).join('; ')}.` });
  if (SW[l.id]) sc.push({ k: 'calc', head: 'Tính tay từng số', calc: l.id, say: `Tính từng con số: ${SW[l.id].t}. Ô đỏ là ô đang tính, ô xanh là các số được dùng. Hãy dừng video và tự tính trước.` });
  if (l.app) sc.push({ k: 'app', head: 'Ứng dụng thực tế', html: `<div class="vs-card vs-text vs-app">${l.app}</div>`, say: plainText(l.app) });
  const rd = READ[l.id];
  if (rd) sc.push({ k: 'paper', head: 'Bài báo nên đọc', html: `<div class="vs-paper"><div class="vs-p-venue">${rd.v} · ${rd.y}</div><div class="vs-p-title">${rd.t}</div><div class="vs-p-auth">${rd.a}</div><div class="vs-p-abs"><b>Vì sao nên đọc.</b> ${rd.why}</div></div>`, say: `Bài báo nên đọc, công bố năm ${rd.y}; tên bài hiện trên màn hình. ${rd.why}` });
  const nx = LESSONS[LESSONS.indexOf(l) + 1];
  sc.push({ k: 'end', head: '', html: `<div class="vs-title"><div class="hand vs-code">Đến lượt bạn</div><p class="vs-en">Kéo xuống: đọc kiến thức, làm ví dụ giải mẫu, bấm trang tính và giải bài tập.</p>${nx ? `<div class="vs-chip">Bài sau: ${nx.code} ${nx.t}</div>` : ''}</div>`, say: 'Đến lượt bạn: kéo xuống, tự tính lại trên giấy và làm bài tập.' + (nx ? ` Bài tiếp theo: ${nx.t}.` : '') });
  return sc;
}
/* lồng tiếng thật: audio/manifest.json do GitHub Actions tạo bằng mô hình TTS (xem tools/tts) */
let NARR = null, NARR_TRY = null;
function loadNarration() {
  if (NARR_TRY) return NARR_TRY;
  NARR_TRY = (/^https?:/.test(location.protocol) && window.fetch ? fetch('audio/manifest.json', { cache: 'no-cache' }).then(r => (r.ok ? r.json() : null)).catch(() => null) : Promise.resolve(null)).then(m => { NARR = m; return m; });
  return NARR_TRY;
}
const narrClip = (lid, si, k, text) => { try { const c = NARR.lessons[lid][si][k]; return c && c.t === text ? c : null; } catch (e) { return null; } };
let VP_AUDIO = null;
function viVoice() { try { return speechSynthesis.getVoices().find(v => /^vi/i.test(v.lang)) || null; } catch (e) { return null; } }
/* thu nhỏ nội dung chữ cho vừa khung video (không để chữ tràn ra ngoài) */
function autoFit(box, inner) { try { inner.style.transform = ''; const bh = box.clientHeight, bw = box.clientWidth, ih = inner.scrollHeight, iw = inner.scrollWidth; if (!bh || !ih) return; const k = Math.max(0.45, Math.min(1, (bh - 4) / ih, (bw - 2) / iw)); inner.style.transform = k < 1 ? `scale(${k.toFixed(3)})` : ''; } catch (e) {} }
function fitInto(box, inner) { try { inner.style.transform = ''; const bw = box.clientWidth - 8, bh = box.clientHeight - 8, iw = inner.scrollWidth, ih = inner.scrollHeight; if (!iw || !ih) return; const k = Math.min(1, bw / iw, bh / ih); inner.style.transform = `scale(${k})`; inner.style.transformOrigin = 'top center'; inner.style.width = (k < 1 ? iw + 'px' : ''); } catch (e) {} }

function videoPlayer(el, l) {
  if (VP) VP.destroy();
  const scenes = lessonScenes(l), est = Math.round(scenes.reduce((a, s) => a + Math.max(6, s.say.length / 14), 0) / 60 + 0.5);
  el.innerHTML = `<div class="vp">
    <div class="vp-stage"><div class="vp-bg"></div><div class="vp-prog"><i></i></div><div class="vp-head"></div><div class="vp-scene"></div><div class="vp-cap" aria-live="polite"></div>
      <button class="vp-big" aria-label="Phát video bài học"><span class="vp-play">▶</span><b>Xem video bài học</b><small>${scenes.length} cảnh · khoảng ${est} phút · có phụ đề</small></button></div>
    <div class="vp-ctl"><button class="btn small solid" data-v="play">▶ Phát</button><button class="btn small ghost" data-v="prev" aria-label="Cảnh trước">⏮</button><button class="btn small ghost" data-v="next" aria-label="Cảnh sau">⏭</button>
      <div class="vp-dots">${scenes.map((s, i) => `<button data-i="${i}" title="${s.head || (i ? 'Kết' : 'Mở đầu')}" aria-label="Cảnh ${i + 1}"></button>`).join('')}</div>
      <label><input type="checkbox" data-v="voice" checked> Giọng đọc</label><label>Tốc độ <select data-v="rate"><option value="0.9">0.9×</option><option value="1" selected>1×</option><option value="1.15">1.15×</option><option value="1.3">1.3×</option></select></label><label><input type="checkbox" data-v="cap" checked> Phụ đề</label></div>
    <div class="vp-note note-s"></div></div>`;
  const stage = $('.vp-scene', el), head = $('.vp-head', el), cap = $('.vp-cap', el), note = $('.vp-note', el), playBtn = $('[data-v=play]', el), big = $('.vp-big', el), prog = $('.vp-prog i', el);
  let cur = 0, playing = false, timers = [], sub = null, token = 0, flowApi = null, fitText = null;
  const clear = () => { timers.forEach(t => clearTimeout(t)); timers = []; try { speechSynthesis.cancel(); } catch (e) {} if (VP_AUDIO) { VP_AUDIO.onended = VP_AUDIO.onerror = null; VP_AUDIO.pause(); VP_AUDIO = null; } if (sub && sub.stop) sub.stop(); if (flowApi) flowApi.stop(); };
  const voiceOn = () => $('[data-v=voice]', el).checked && 'speechSynthesis' in window;
  const show = i => {
    cur = i; const s = scenes[i]; sub = null; flowApi = null; fitText = null;
    head.innerHTML = s.head ? `<span class="vs-hnum">${i}</span>${s.head}` : ''; head.hidden = !s.head;
    stage.className = 'vp-scene k-' + s.k; stage.innerHTML = '';
    if (s.calc) { const box = document.createElement('div'); box.className = 'vs-fit'; const inner = document.createElement('div'); box.append(inner); stage.append(box); sub = swRender(inner, s.calc); requestAnimationFrame(() => fitInto(box, inner)); }
    else if (s.flow) { const box = document.createElement('div'); box.className = 'vs-card vs-flow'; stage.append(box); flowApi = renderFlow(box, FLOW[s.flow], { autoplay: false }); }
    else if (s.ill) { const box = document.createElement('div'); box.className = 'vs-fit'; const inner = document.createElement('div'); inner.className = 'vs-card vs-illc'; box.append(inner); stage.append(box); sub = ILL[s.ill](inner, { noScroll: true }); requestAnimationFrame(() => fitInto(box, inner)); }
    else { const box = document.createElement('div'); box.className = 'vs-auto'; const inner = document.createElement('div'); inner.className = 'vs-auto-in'; inner.innerHTML = s.html; box.append(inner); stage.append(box); fitText = () => autoFit(box, inner); [0, 350, 1200, 2500].forEach(ms => timers.push(setTimeout(() => fitText && fitText(), ms))); requestAnimationFrame(() => fitText && fitText()); }
    stage.classList.remove('enter'); void stage.offsetWidth; stage.classList.add('enter');
    typeset(stage);
    $$('.vp-dots button', el).forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('done', k < i); });
    cap.textContent = ''; cap.hidden = !$('[data-v=cap]', el).checked; prog.style.width = '0%';
    if (s.sync === 'list') $$('.vs-list li', stage).forEach(li => li.classList.add('pend'));
  };
  const run = i => {
    clear(); if (i >= scenes.length) { playing = false; playBtn.textContent = '▶ Xem lại'; return; }
    show(i); const s = scenes[i], my = ++token, parts = sentences(s.say), t0 = Date.now();
    let speechDone = false, subDone = !sub || !s.calc;
    const maybeNext = () => { if (my !== token || !playing) return; if (!(speechDone && subDone)) return; const wait = Math.max(900, (s.minMs || 0) - (Date.now() - t0)); timers.push(setTimeout(() => { if (my === token && playing) run(cur + 1); }, wait)); };
    if (s.calc && sub) { const ms = Math.max(120, Math.min(600, 20000 / sub.total)); sub.play(ms); const wait = () => { if (my !== token) return; const pg = $('.sw-prog', stage); if (pg && /^(\d+)\/\1$/.test(pg.textContent)) { subDone = true; maybeNext(); } else timers.push(setTimeout(wait, 300)); }; wait(); }
    if (s.ill && sub && sub.play) sub.play();
    let k = 0;
    const onSentence = idx => { prog.style.width = Math.round(100 * idx / parts.length) + '%'; if (s.sync === 'flow' && flowApi) flowApi.show(Math.min(idx, flowApi.steps - 1)); if (s.sync === 'list') { const lis = $$('.vs-list li', stage); lis.forEach((li, q) => li.classList.toggle('pend', q > Math.min(idx, lis.length - 1))); } };
    const nextSentence = () => {
      if (my !== token) return;
      if (k >= parts.length) { prog.style.width = '100%'; speechDone = true; maybeNext(); return; }
      onSentence(k); const text = parts[k++]; cap.textContent = text;
      const clip = voiceOn() && NARR ? narrClip(l.id, i, k - 1, text) : null;
      if (clip) { const a = new Audio(clip.f); VP_AUDIO = a; a.playbackRate = +($('[data-v=rate]', el) || {}).value || 1; let done = false; const go = () => { if (done) return; done = true; if (VP_AUDIO === a) VP_AUDIO = null; nextSentence(); };
        a.onended = go; a.onerror = () => timers.push(setTimeout(go, Math.max(1800, text.length * 65))); a.play().catch(() => timers.push(setTimeout(go, Math.max(1800, text.length * 65)))); return; }
      const v = voiceOn() ? viVoice() : null;
      if (v) { const u = new SpeechSynthesisUtterance(speakVi(text)); u.voice = v; u.lang = v.lang; u.rate = 1.02 * (+($('[data-v=rate]', el) || {}).value || 1); u.onend = () => nextSentence(); u.onerror = () => timers.push(setTimeout(nextSentence, Math.max(1800, text.length * 65))); speechSynthesis.speak(u); }
      else timers.push(setTimeout(nextSentence, Math.max(1900, text.length * 66)));
    };
    nextSentence();
  };
  const play = () => { const restart = playBtn.textContent.includes('Xem lại'); big.hidden = true; playing = true; playBtn.textContent = '⏸ Tạm dừng';
    loadNarration().then(() => { if (!playing) return;
      const real = NARR && NARR.lessons && NARR.lessons[l.id];
      note.textContent = real ? `Lồng tiếng: ${NARR.label || NARR.voice}.` : voiceOn() && !viVoice() ? 'Bản này chưa có file lồng tiếng và trình duyệt không có giọng tiếng Việt, nên video chạy với phụ đề. Bản đầy đủ có lồng tiếng ở trang GitHub Pages của dự án.' : voiceOn() ? 'Đang dùng giọng đọc của trình duyệt (bản GitHub Pages có lồng tiếng thật).' : '';
      run(restart ? 0 : cur); }); };
  const pause = () => { playing = false; token++; clear(); playBtn.textContent = '▶ Phát'; };
  playBtn.onclick = () => (playing ? pause() : play());
  big.onclick = play;
  $('[data-v=prev]', el).onclick = () => { const p = playing; pause(); big.hidden = true; show(Math.max(0, cur - 1)); if (p) play(); };
  $('[data-v=next]', el).onclick = () => { const p = playing; pause(); big.hidden = true; show(Math.min(scenes.length - 1, cur + 1)); if (p) play(); };
  $$('.vp-dots button', el).forEach(b => b.onclick = () => { const p = playing; pause(); big.hidden = true; show(+b.dataset.i); if (p) play(); });
  $('[data-v=cap]', el).onchange = e => { cap.hidden = !e.target.checked; };
  $('[data-v=voice]', el).onchange = () => { if (playing) { pause(); play(); } };
  try { speechSynthesis.getVoices(); } catch (e) {}
  const onResize = () => { if (fitText) fitText(); const fb = $('.vs-fit', stage); if (fb && fb.firstChild) fitInto(fb, fb.firstChild); };
  window.addEventListener('resize', onResize);
  show(0);
  VP = { destroy() { playing = false; token++; clear(); window.removeEventListener('resize', onResize); VP = null; } };
}
