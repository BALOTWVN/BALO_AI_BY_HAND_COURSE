/* ================= SƠ ĐỒ MÔ HÌNH CHUYỂN ĐỘNG ================= */
const FLOW = {};
const FL = (id, n, e, c, o = {}) => { FLOW[id] = { n, e, c, ...o }; };
let _catURL = null;
function catURL() { if (_catURL !== null) return _catURL; try { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); drawArt(g, artGrid('cat'), 0, 0, 4); _catURL = c.toDataURL() || ''; } catch (e) { _catURL = ''; } return _catURL; }
function glyph(kind, x, y, uid) {
  const P = 'var(--pen)', R = 'var(--red)', M = 'var(--muted)';
  switch (kind) {
    case 'img': { const u = catURL(); return u ? `<image href="${u}" x="${x}" y="${y}" width="30" height="30" style="image-rendering:pixelated"/>` : `<rect x="${x}" y="${y}" width="30" height="30" rx="4" fill="${R}" opacity=".3"/>`; }
    case 'mat': return [0, 1, 2].map(i => [0, 1, 2].map(j => `<rect x="${x + j * 10}" y="${y + i * 10}" width="9" height="9" rx="1.5" fill="${P}" opacity="${0.25 + ((i * 3 + j) % 4) * 0.18}"/>`).join('')).join('');
    case 'conv': return [0, 1, 2, 3].map(i => [0, 1, 2, 3].map(j => `<rect x="${x + j * 7.5}" y="${y + i * 7.5}" width="6.5" height="6.5" fill="${P}" opacity=".25"/>`).join('')).join('') + `<rect class="fl-slide" x="${x}" y="${y}" width="15" height="15" fill="none" stroke="${R}" stroke-width="2"/>`;
    case 'nn': return [[6, 8], [6, 22], [24, 4], [24, 15], [24, 26]].map(([a, b], k, arr) => (k < 2 ? arr.slice(2).map(([c, d]) => `<line x1="${x + a}" y1="${y + b}" x2="${x + c}" y2="${y + d}" stroke="${M}" stroke-width="1"/>`).join('') : '')).join('') + [[6, 8], [6, 22], [24, 4], [24, 15], [24, 26]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="4" fill="${P}"/>`).join('');
    case 'op': return `<circle cx="${x + 15}" cy="${y + 15}" r="13" fill="none" stroke="${R}" stroke-width="2"/><circle class="fl-pulse" cx="${x + 15}" cy="${y + 15}" r="5" fill="${R}"/>`;
    case 'txt': return [0, 1, 2].map(i => `<rect x="${x + (i % 2) * 4}" y="${y + 3 + i * 9}" width="${18 + (i % 2) * 8}" height="6" rx="3" fill="${P}" opacity=".7"/>`).join('');
    case 'chart': return `<polyline points="${[0, 6, 12, 18, 24, 30].map((a, k) => `${x + a},${y + 22 - [4, 12, 8, 18, 10, 20][k]}`).join(' ')}" fill="none" stroke="${P}" stroke-width="2.2"/><line x1="${x}" y1="${y + 26}" x2="${x + 30}" y2="${y + 26}" stroke="${M}"/>`;
    case 'prob': return [10, 22, 6].map((h, k) => `<rect class="fl-bar fl-bar${k}" x="${x + 2 + k * 10}" y="${y + 28 - h}" width="7" height="${h}" fill="${k === 1 ? R : P}"/>`).join('');
    case 'noise': return [...Array(14)].map((_, k) => `<circle class="fl-tw" style="animation-delay:${(k * 0.13).toFixed(2)}s" cx="${x + 3 + ((k * 37) % 26)}" cy="${y + 3 + ((k * 53) % 26)}" r="2" fill="${k % 3 ? P : R}"/>`).join('');
    case 'box': return `<rect x="${x + 2}" y="${y + 5}" width="26" height="22" fill="none" stroke="${R}" stroke-width="2"/><rect x="${x + 2}" y="${y}" width="15" height="6" fill="${R}"/>`;
    case 'db': return `<ellipse cx="${x + 15}" cy="${y + 6}" rx="12" ry="4" fill="${P}" opacity=".6"/><path d="M${x + 3},${y + 6} v18 a12,4 0 0 0 24,0 v-18" fill="none" stroke="${P}" stroke-width="2"/><path d="M${x + 3},${y + 15} a12,4 0 0 0 24,0" fill="none" stroke="${P}" stroke-width="1.2"/>`;
    case 'graph': return `<line x1="${x + 6}" y1="${y + 8}" x2="${x + 24}" y2="${y + 10}" stroke="${M}"/><line x1="${x + 6}" y1="${y + 8}" x2="${x + 14}" y2="${y + 25}" stroke="${M}"/><line x1="${x + 24}" y1="${y + 10}" x2="${x + 14}" y2="${y + 25}" stroke="${M}"/><circle cx="${x + 6}" cy="${y + 8}" r="4.5" fill="${P}"/><circle cx="${x + 24}" cy="${y + 10}" r="4.5" fill="${R}"/><circle cx="${x + 14}" cy="${y + 25}" r="4.5" fill="${P}"/>`;
    case 'tree': return `<line x1="${x + 15}" y1="${y + 6}" x2="${x + 6}" y2="${y + 22}" stroke="${M}"/><line x1="${x + 15}" y1="${y + 6}" x2="${x + 24}" y2="${y + 22}" stroke="${M}"/><circle cx="${x + 15}" cy="${y + 6}" r="4.5" fill="${P}"/><rect x="${x + 2}" y="${y + 20}" width="8" height="8" fill="${P}" opacity=".6"/><rect x="${x + 20}" y="${y + 20}" width="8" height="8" fill="${R}"/>`;
    case 'star': return `<polygon class="fl-spin" points="${[...Array(10)].map((_, k) => { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 6 : 14; return `${x + 15 + r * Math.cos(a)},${y + 15 + r * Math.sin(a)}`; }).join(' ')}" fill="${R}" style="transform-origin:${x + 15}px ${y + 15}px"/>`;
    case 'cell': return `<rect x="${x + 1}" y="${y + 4}" width="28" height="22" rx="5" fill="none" stroke="${P}" stroke-width="2"/><line class="fl-flow" x1="${x + 1}" y1="${y + 11}" x2="${x + 29}" y2="${y + 11}" stroke="${R}" stroke-width="2" stroke-dasharray="4 3"/><circle cx="${x + 10}" cy="${y + 19}" r="3" fill="${P}"/><circle cx="${x + 20}" cy="${y + 19}" r="3" fill="${P}"/>`;
    case 'eye': return `<path d="M${x + 1},${y + 15} Q${x + 15},${y + 1} ${x + 29},${y + 15} Q${x + 15},${y + 29} ${x + 1},${y + 15}Z" fill="none" stroke="${P}" stroke-width="2"/><circle class="fl-look" cx="${x + 15}" cy="${y + 15}" r="5" fill="${R}"/>`;
    case 'loss': return `<path d="M${x + 2},${y + 4} C${x + 8},${y + 26} ${x + 20},${y + 26} ${x + 28},${y + 22}" fill="none" stroke="${P}" stroke-width="2"/><circle class="fl-roll" cx="${x + 4}" cy="${y + 8}" r="3.5" fill="${R}"/>`;
    case 'clock': return `<circle cx="${x + 15}" cy="${y + 15}" r="12" fill="none" stroke="${P}" stroke-width="2"/><line class="fl-spin" x1="${x + 15}" y1="${y + 15}" x2="${x + 15}" y2="${y + 6}" stroke="${R}" stroke-width="2.2" style="transform-origin:${x + 15}px ${y + 15}px"/>`;
    case 'doc': return `<path d="M${x + 5},${y + 1} h14 l7,7 v21 h-21z" fill="none" stroke="${P}" stroke-width="2"/>` + [10, 15, 20, 25].map(t => `<line x1="${x + 9}" y1="${y + t}" x2="${x + 22}" y2="${y + t}" stroke="${M}"/>`).join('');
    case 'gear': return `<circle cx="${x + 15}" cy="${y + 15}" r="8" fill="none" stroke="${P}" stroke-width="3"/><g class="fl-spin" style="transform-origin:${x + 15}px ${y + 15}px">${[...Array(8)].map((_, k) => { const a = k * Math.PI / 4; return `<rect x="${x + 13 + 11 * Math.cos(a)}" y="${y + 13 + 11 * Math.sin(a)}" width="4" height="4" fill="${P}"/>`; }).join('')}</g>`;
    default: return '';
  }
}
function parseFlow(sp) {
  const cols = sp.n.split(/\s\|\s/).map(c => c.split(/\s\/\s/).map(s => s.trim()).filter(Boolean).map(s => { const [id, t, k, sub] = s.split(':').map(v => (v || '').trim()); return { id, t, k: k || 'mat', s: sub || '' }; }));
  const edges = (sp.e || '').split(',').map(s => s.trim()).filter(Boolean).map(s => { const m = s.match(/^(\w+)\s*([>~<])\s*(\w+)\s*(?::(.*))?$/); return m ? { a: m[1], t: m[2], b: m[3], lab: (m[4] || '').trim() } : null; }).filter(Boolean);
  return { cols, edges };
}
/* tách chữ thành nhiều dòng để không tràn khỏi ô (ước lượng bề rộng theo cỡ chữ) */
function wrapText(str, maxW, fs, k) {
  const cw = fs * k, max = Math.max(4, Math.floor(maxW / cw)), out = []; let line = '';
  String(str).split(/\s+/).filter(Boolean).forEach(w => {
    while (w.length > max) { if (line) { out.push(line); line = ''; } out.push(w.slice(0, max - 1) + '-'); w = w.slice(max - 1); }
    const cand = line ? line + ' ' + w : w;
    if (cand.length <= max) line = cand; else { out.push(line); line = w; }
  });
  if (line) out.push(line); return out.length ? out : [''];
}
function renderFlow(el, sp, o = {}) {
  if (sp.net) return renderNet(el, sp, o);
  const { cols, edges } = parseFlow(sp), NW = 158, CW = 198, TX = 44, TW = NW - TX - 8, maxR = Math.max(...cols.map(c => c.length));
  cols.flat().forEach(n => { n.fs = 13; n.tl = wrapText(n.t, TW, 13, 0.6); if (n.tl.length > 2) { n.fs = 11.5; n.tl = wrapText(n.t, TW, 11.5, 0.6); } n.sl = n.s ? wrapText(n.s, TW, 10.5, 0.54) : []; if (n.sl.length > 2) { n.sfs = 9.5; n.sl = wrapText(n.s, TW, 9.5, 0.54); } else n.sfs = 10.5; });
  const NH = Math.max(58, ...cols.flat().map(n => 16 + n.tl.length * (n.fs + 3) + n.sl.length * (n.sfs + 3)));
  const hasSkip = edges.some(e => e.t === '~'), top = hasSkip ? 46 : 16, W = 20 + cols.length * CW - (CW - NW) + 20, H = top + maxR * (NH + 18) + 6;
  const pos = {}; cols.forEach((c, i) => c.forEach((n, j) => { const off = (maxR - c.length) * (NH + 18) / 2; pos[n.id] = { x: 20 + i * CW, y: top + off + j * (NH + 18), col: i, n }; }));
  const uid = 'f' + Math.random().toString(36).slice(2, 8);
  let s = `<svg class="fl-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Sơ đồ: ${cols.flat().map(n => n.t).join(', ')}"><defs><marker id="${uid}a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10z" fill="var(--muted)"/></marker><marker id="${uid}r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10z" fill="var(--red)"/></marker></defs>`;
  edges.forEach((e, k) => {
    const A = pos[e.a], B = pos[e.b]; if (!A || !B) return; let d, lx, ly;
    if (e.t === '~') { const x1 = A.x + NW / 2, x2 = B.x + NW / 2, yc = 8; d = `M${x1},${A.y} C${x1},${yc} ${x2},${yc} ${x2},${B.y - 3}`; lx = (x1 + x2) / 2; ly = yc + 14; }
    else if (e.t === '<') { const x1 = A.x, y1 = A.y + NH / 2 + 12, x2 = B.x + NW, y2 = B.y + NH / 2 + 12; d = `M${x1},${y1} C${x1 - 30},${y1} ${x2 + 30},${y2} ${x2 + 3},${y2}`; lx = (x1 + x2) / 2; ly = (y1 + y2) / 2 + 16; }
    else { const x1 = A.x + NW, y1 = A.y + NH / 2, x2 = B.x, y2 = B.y + NH / 2; d = `M${x1},${y1} C${x1 + 30},${y1} ${x2 - 30},${y2} ${x2 - 3},${y2}`; lx = (x1 + x2) / 2; ly = (y1 + y2) / 2 - 7; }
    const red = e.t !== '>';
    s += `<path id="${uid}p${k}" class="fl-e${red ? ' back' : ''}" data-to="${e.t === '<' ? e.a : e.b}" d="${d}" fill="none" stroke="${red ? 'var(--red)' : 'var(--muted)'}" stroke-width="1.8" ${e.t === '>' ? '' : 'stroke-dasharray="5 4"'} marker-end="url(#${uid}${red ? 'r' : 'a'})"/>`;
    s += `<circle class="fl-dot" data-to="${e.t === '<' ? e.a : e.b}" r="4.5" fill="${red ? 'var(--red)' : 'var(--pen)'}"><animateMotion dur="1.1s" repeatCount="indefinite"><mpath href="#${uid}p${k}"/></animateMotion></circle>`;
    if (e.lab) s += `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="11" fill="${red ? 'var(--red)' : 'var(--muted)'}" stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round" paint-order="stroke" font-family="var(--f-body)">${e.lab}</text>`;
  });
  Object.values(pos).forEach(({ x, y, col, n }) => {
    const th = n.tl.length * (n.fs + 3) + n.sl.length * (n.sfs + 3); let ty = y + (NH - th) / 2 + n.fs;
    let t = n.tl.map((ln, i) => `<text x="${x + TX}" y="${ty + i * (n.fs + 3)}" font-size="${n.fs}" font-weight="700" fill="var(--ink)" font-family="var(--f-body)">${ln}</text>`).join('');
    ty += n.tl.length * (n.fs + 3) - n.fs + n.sfs + 1;
    t += n.sl.map((ln, i) => `<text x="${x + TX}" y="${ty + i * (n.sfs + 3)}" font-size="${n.sfs}" fill="var(--muted)" font-family="var(--f-body)">${ln}</text>`).join('');
    s += `<g class="fl-n" data-col="${col}" data-id="${n.id}"><title>${n.t}${n.s ? ' — ' + n.s : ''}</title><rect x="${x}" y="${y}" width="${NW}" height="${NH}" rx="10"/>${glyph(n.k, x + 7, y + (NH - 30) / 2, uid)}${t}</g>`;
  });
  s += '</svg>';
  el.innerHTML = `<div class="fl-wrap"><div class="fl-scroll">${s}</div><div class="fl-cap"><span class="fl-num hand"></span><span class="fl-txt"></span></div><div class="fl-ctl"><button class="btn small ghost" data-f="prev" aria-label="Bước trước">◀</button><button class="btn small solid" data-f="play">⏸ Dừng</button><button class="btn small ghost" data-f="next" aria-label="Bước sau">▶</button><div class="fl-dots">${cols.map((_, i) => `<span data-i="${i}"></span>`).join('')}</div></div></div>`;
  const svg = $('svg', el), cap = $('.fl-txt', el), num = $('.fl-num', el), pb = $('[data-f=play]', el);
  const caps = sp.c || cols.map(c => c.map(n => n.t).join(', '));
  let cur = -1, timer = null;
  const show = i => { cur = (i + cols.length) % cols.length; const ids = new Set(cols[cur].map(n => n.id));
    $$('.fl-n', svg).forEach(g => { const c = +g.dataset.col; g.classList.toggle('on', c === cur); g.classList.toggle('past', c < cur); });
    $$('.fl-e, .fl-dot', svg).forEach(p => p.classList.toggle('on', ids.has(p.dataset.to)));
    num.textContent = (cur + 1) + '/' + cols.length; cap.innerHTML = caps[cur] || ''; $$('.fl-dots span', el).forEach((d, k) => d.classList.toggle('on', k <= cur)); };
  const reduce = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
  const api = { play(ms = 2000) { clearInterval(timer); pb.textContent = '⏸ Dừng'; timer = setInterval(() => show(cur + 1), ms); }, stop() { clearInterval(timer); timer = null; pb.textContent = '▶ Chạy'; }, show, steps: cols.length };
  el.addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; if (b.dataset.f === 'play') { timer ? api.stop() : api.play(); } else { api.stop(); show(cur + (b.dataset.f === 'next' ? 1 : -1)); } });
  show(0); if (!reduce && o.autoplay !== false) api.play(); else api.stop();
  return api;
}

/* ---- Sơ đồ mạng nơ-ron: lan truyền thuận (xanh) và ngược (đỏ) ---- */
function renderNet(el, sp, o = {}) {
  const L = sp.net, lab = sp.lab || [], W = 120 + (L.length - 1) * 150, H = 40 + Math.max(...L) * 52, R = 15;
  const P = L.map((n, i) => [...Array(n)].map((_, j) => ({ x: 60 + i * 150, y: H / 2 + (j - (n - 1) / 2) * 52 })));
  let s = `<svg class="fl-svg net" viewBox="0 0 ${W} ${H + 24}" role="img" aria-label="Mạng nơ-ron ${L.join('–')}">`;
  for (let i = 0; i < L.length - 1; i++) P[i].forEach((a, ia) => P[i + 1].forEach((b, ib) => { s += `<line class="nt-w" data-l="${i}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke-width="${1 + ((ia * 7 + ib * 3) % 4) * 0.6}"/>`; }));
  P.forEach((col, i) => col.forEach((p, j) => { s += `<circle class="nt-n" data-l="${i}" cx="${p.x}" cy="${p.y}" r="${R}"/>`; if (sp.nl && sp.nl[i] && sp.nl[i][j]) s += `<text x="${p.x}" y="${p.y + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)" font-family="var(--f-body)">${sp.nl[i][j]}</text>`; }));
  L.forEach((_, i) => { s += `<text x="${60 + i * 150}" y="${H + 16}" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="var(--f-body)">${lab[i] || ''}</text>`; });
  s += '</svg>';
  el.innerHTML = `<div class="fl-wrap"><div class="fl-scroll">${s}</div><div class="fl-cap"><span class="fl-num hand"></span><span class="fl-txt"></span></div><div class="fl-ctl"><button class="btn small ghost" data-f="prev">◀</button><button class="btn small solid" data-f="play">⏸ Dừng</button><button class="btn small ghost" data-f="next">▶</button></div></div>`;
  const svg = $('svg', el), steps = [];
  L.forEach((_, i) => steps.push({ d: 'f', l: i }));
  if (sp.back) for (let i = L.length - 1; i >= 0; i--) steps.push({ d: 'b', l: i });
  const caps = sp.c || steps.map(st => (st.d === 'f' ? `Lan truyền thuận: lớp ${st.l + 1}` : `Lan truyền ngược: lớp ${st.l + 1}`));
  let cur = -1, timer = null;
  const show = k => { cur = (k + steps.length) % steps.length; const st = steps[cur];
    $$('.nt-n', svg).forEach(c => { const l = +c.dataset.l; c.classList.toggle('on', l === st.l); c.classList.toggle('fwd', st.d === 'f' && l < st.l); c.classList.toggle('bwd', st.d === 'b' && l > st.l); c.classList.toggle('grad', st.d === 'b' && l === st.l); });
    $$('.nt-w', svg).forEach(w => { const l = +w.dataset.l; w.classList.toggle('on', st.d === 'f' ? l === st.l - 1 : l === st.l); w.classList.toggle('back', st.d === 'b'); });
    $('.fl-num', el).textContent = (cur + 1) + '/' + steps.length; $('.fl-txt', el).innerHTML = caps[cur] || ''; };
  const pb = $('[data-f=play]', el);
  const api = { play(ms = 1600) { clearInterval(timer); pb.textContent = '⏸ Dừng'; timer = setInterval(() => show(cur + 1), ms); }, stop() { clearInterval(timer); timer = null; pb.textContent = '▶ Chạy'; }, show, steps: steps.length };
  el.addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; if (b.dataset.f === 'play') { timer ? api.stop() : api.play(); } else { api.stop(); show(cur + (b.dataset.f === 'next' ? 1 : -1)); } });
  const reduce = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
  show(0); if (!reduce && o.autoplay !== false) api.play(); else api.stop();
  return api;
}
