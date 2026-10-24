/* ===== Ảnh pixel-art tự vẽ (16×16, đối xứng) và các “mô hình” minh họa có tính toán thật ===== */
const PAL = { '.': [236, 240, 246], d: [60, 50, 45], o: [235, 150, 70], p: [240, 150, 170], w: [250, 248, 240], k: [25, 25, 30], n: [90, 170, 90],
  g: [150, 155, 165], b: [165, 110, 65], e: [100, 65, 40], c: [235, 215, 180], u: [80, 150, 230] };
const ARTL = {
  cat: ['........', '.d......', '.dd.....', '.dpd....', '.dppdooo', '.doooooo', '.dooodoo', '.doooooo', '.doonkoo', '.doooooo', 'ddooowww', '.dooowwp', 'ddoowwww', '..dooooo', '...ddddd', '........'],
  dog: ['........', '........', '...ddddd', '.eedbbbb', 'eeedbbbb', 'eeedbbbb', 'eeedbkbb', 'eeedbbbb', '.eedbbcc', '..edbccc', '...dbcck', '...dbccc', '...dbcpp', '....dccp', '.....ddd', '........'],
  husky: ['........', '.d......', '.dd.....', '.dwd....', '.dwwdggg', '.dgggggg', '.dgggwgg', '.dggwwgg', '.dgwukww', '.dgwwwww', '.dgwwwww', '.ddwwwwk', '..dwwwww', '..dwwwww', '...ddddd', '........'],
};
const ART_NAME = { cat: 'Mèo', dog: 'Chó', husky: 'Chó husky (tai nhọn)', custom: 'Ảnh tự vẽ' };
const ART_TRUE = { cat: 'mèo', dog: 'chó', husky: 'chó' };
const artGrid = name => ARTL[name].map(h => (h + h.split('').reverse().join('')).split(''));
const pxRGB = ch => PAL[ch] || PAL['.'];
const pxGray = ch => { const [r, g, b] = pxRGB(ch); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
function drawArt(ctx, grid, x0, y0, s, alpha = 1) { ctx.save(); ctx.globalAlpha = alpha; grid.forEach((row, i) => row.forEach((ch, j) => { const [r, g, b] = pxRGB(ch); ctx.fillStyle = `rgb(${r},${g},${b})`; ctx.fillRect(x0 + j * s, y0 + i * s, s + 0.5, s + 0.5); })); ctx.restore(); }

/* ---- CNN tự thiết kế: 4 kernel cạnh → 4 bộ dò bộ phận → 2 điểm lớp ---- */
const CK = {
  'cạnh dọc': [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]],
  'cạnh ngang': [[-1, -1, -1], [0, 0, 0], [1, 1, 1]],
  'chéo ╱': [[0, 1, 1], [-1, 0, 1], [-1, -1, 0]],
  'chéo ╲': [[1, 1, 0], [1, 0, -1], [0, -1, -1]],
};
function conv2(G, K) { const n = G.length - 2, out = []; for (let i = 0; i < n; i++) { out.push([]); for (let j = 0; j < n; j++) { let s = 0; for (let u = 0; u < 3; u++) for (let v = 0; v < 3; v++) s += G[i + u][j + v] * K[u][v]; out[i].push(Math.abs(s) / 3); } } return out; }
const PARTS = [
  { k: 'ear', t: 'Tai nhọn', d: 'cạnh chéo ở góc trên hai bên', box: [[0, 0, 2, 3], [0, 13, 2, 16]] },
  { k: 'flop', t: 'Tai cụp tối màu', d: 'vùng tối dọc hai bên đầu', box: [[3, 0, 10, 3], [3, 13, 10, 16]] },
  { k: 'muz', t: 'Mõm sáng to', d: 'mảng sáng giữa nửa dưới', box: [[8, 4, 14, 12]] },
  { k: 'whis', t: 'Râu ria', d: 'nét tối thò ra ngoài mặt', box: [[9, 0, 13, 1], [9, 15, 13, 16]] },
];
const MODELS = {
  v1: { t: 'Mô hình v1 (chỉ học mèo và chó thường)', w: { cat: { ear: 4, flop: -2, muz: -1, whis: 3 }, dog: { ear: -1, flop: 4, muz: 0.5, whis: -2 } }, b: { cat: -0.8, dog: 0 } },
  v2: { t: 'Mô hình v2 (đã thêm ảnh husky vào huấn luyện)', w: { cat: { ear: 3, flop: -3, muz: -4, whis: 4 }, dog: { ear: -0.5, flop: 4, muz: 4, whis: -2 } }, b: { cat: 0.6, dog: -0.6 } },
};
function cnnAnalyze(grid, model = 'v1') {
  const G = grid.map(r => r.map(pxGray));
  const maps = {}; Object.keys(CK).forEach(k => { maps[k] = conv2(G, CK[k]); });
  const regionMean = (fn, boxes) => { let s = 0, n = 0; boxes.forEach(([r0, c0, r1, c1]) => { for (let i = r0; i < r1; i++) for (let j = c0; j < c1; j++) { s += fn(i, j); n++; } }); return s / n; };
  const diag = (i, j) => { const a = Math.min(13, Math.max(0, i - 1)), b = Math.min(13, Math.max(0, j - 1)); return maps['chéo ╱'][a][b] + maps['chéo ╲'][a][b]; };
  const f = {
    ear: Math.min(1, regionMean(diag, PARTS[0].box) * 1.3),
    flop: regionMean((i, j) => 1 - G[i][j], PARTS[1].box),
    muz: regionMean((i, j) => (G[i][j] > 0.8 ? 1 : 0), PARTS[2].box),
    whis: regionMean((i, j) => 1 - G[i][j], PARTS[3].box),
  };
  const M = MODELS[model], logit = {}, contrib = {};
  ['cat', 'dog'].forEach(c => { contrib[c] = {}; let s = M.b[c]; PARTS.forEach(p => { contrib[c][p.k] = M.w[c][p.k] * f[p.k]; s += contrib[c][p.k]; }); logit[c] = s; });
  const m = Math.max(logit.cat, logit.dog), ec = Math.exp(logit.cat - m), ed = Math.exp(logit.dog - m);
  const prob = { cat: ec / (ec + ed), dog: ed / (ec + ed) };
  return { G, maps, f, logit, contrib, prob, pred: prob.cat >= 0.5 ? 'mèo' : 'chó', model: M };
}

/* ---- ViT tự thiết kế: 16 mảnh 4×4 → embedding 3 chiều → 2 câu hỏi CLS ---- */
function vitAnalyze(grid) {
  const G = grid.map(r => r.map(pxGray));
  const patches = [];
  for (let pr = 0; pr < 4; pr++) for (let pc = 0; pc < 4; pc++) {
    let dark = 0, bright = 0, edge = 0, n = 0;
    for (let i = pr * 4; i < pr * 4 + 4; i++) for (let j = pc * 4; j < pc * 4 + 4; j++) { const g = G[i][j]; dark += 1 - g; bright += g > 0.8 && g < 0.93 ? 1 : 0; if (j + 1 < 16) edge += Math.abs(G[i][j + 1] - g); if (i + 1 < 16) edge += Math.abs(G[i + 1][j] - g); n++; }
    patches.push({ pr, pc, e: [dark / n, edge / n, bright / n] });
  }
  const Q = { cat: [0.5, 3, -2.5], dog: [3, 0.5, 2.5] }, tau = 0.25;
  const att = {}; ['cat', 'dog'].forEach(c => { const s = patches.map(p => p.e.reduce((a, v, i) => a + v * Q[c][i], 0) / tau); const m = Math.max(...s); const ex = s.map(v => Math.exp(v - m)); const z = ex.reduce((a, b) => a + b, 0); att[c] = ex.map(v => v / z); });
  const pooled = {}; ['cat', 'dog'].forEach(c => { pooled[c] = [0, 1, 2].map(i => patches.reduce((a, p, k) => a + att[c][k] * p.e[i], 0)); });
  const logit = { cat: pooled.cat.reduce((a, v, i) => a + v * Q.cat[i], 0) * 3, dog: pooled.dog.reduce((a, v, i) => a + v * Q.dog[i], 0) * 3 };
  const m = Math.max(logit.cat, logit.dog), ec = Math.exp(logit.cat - m), ed = Math.exp(logit.dog - m);
  return { patches, att, pooled, logit, prob: { cat: ec / (ec + ed), dog: ed / (ec + ed) }, Q };
}
