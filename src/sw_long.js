/* ================= BÀI TOÁN DÀI: chuỗi nhiều tờ, mỗi tờ đổi một thứ =================
   Mỗi chuỗi đi từ phép tính nhỏ nhất đến cả mô hình. Kết quả tờ trước được chép sang tờ sau
   (ô vàng "đã tính ở tờ trước"), nên người học thấy dữ liệu chảy qua toàn bộ mô hình.
   Mọi con số đều tự đặt cho khóa học này. */
const LONG = {};
const mx = {
  mul: (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, a, k) => s + a * B[k][j], 0))),
  T: A => A[0].map((_, j) => A.map(r => r[j])),
  add: (A, B) => A.map((r, i) => r.map((v, j) => v + B[i][j])),
  map: (A, f) => A.map(r => r.map(f)),
  col: (A, j) => A.map(r => [r[j]]),
  aff: (W, X) => W.map(w => X[0].map((_, j) => w.slice(0, -1).reduce((t, c, k) => t + c * X[k][j], 0) + w[w.length - 1])),
  softcol: A => { const E = mx.map(A, Math.exp); const s = E[0].map((_, j) => E.reduce((a, r) => a + r[j], 0)); return E.map(r => r.map((v, j) => v / s[j])); },
  r: (A, d = 4) => mx.map(A, v => +v.toFixed(d)),
};
const PN2 = (x, d = 2) => (x < 0 ? '(' + fmt(x, d) + ')' : fmt(x, d));
const sigm = x => 1 / (1 + Math.exp(-x));

/* ============ CHUỖI 1: RNN, từ một nơ-ron đến mô hình ngôn ngữ nhỏ ============ */
(() => {
  const VOC = ['mạch', 'bị', 'đứt'];
  const Wx = [[1, -1, 0.5], [0, 1, -1]], Wh = [[0.5, 0], [-0.5, 0.5]], b = [0, 0.2];
  const Wy = [[0, 0, -1], [1, -1, 0.5], [-1, 0.5, 0]]; // 3 lớp × [h1, h2 | bias]
  const onehot = i => VOC.map((_, k) => (k === i ? 1 : 0));
  const stepH = (hp, xi) => [0, 1].map(r => Math.tanh(Wx[r][xi] + Wh[r][0] * hp[0] + Wh[r][1] * hp[1] + b[r]));
  // chạy chuỗi "mạch bị đứt"
  const seq = [0, 1, 2]; let hp = [0, 0]; const Hs = [];
  seq.forEach(t => { hp = stepH(hp, t); Hs.push(hp); });
  const H = mx.r(mx.T(Hs));
  const logits = mx.aff(Wy, H), P = mx.softcol(logits);

  SW.L_rnn1 = { t: 'Tờ 1 · Một nơ-ron, một bước (d = 1)', cols: ['x'],
    steps: [G('x', [[2]], { l: 'Đầu vào x' }), LIN('F', 'x', [[0.5, -0.5]], { l: 'F = w_x·x + b', wl: '[w_x | b]' }), EL('h', 'F', 'tanh', { l: 'h = tanh(F)', dp: 3 }), LIN('y', 'h', [[2, 0.1]], { l: 'y = w_y·h + b_y', wl: '[w_y | b_y]', dp: 3, n: 'Chưa có trí nhớ: cùng x luôn ra cùng y.' })] };
  SW.L_rnn2 = { t: 'Tờ 2 · Thêm hồi quy: h nhớ bước trước (3 bước)', cols: ['t=1', 't=2', 't=3'],
    steps: [G('x', [[2, -1, 1]], { l: 'Chuỗi x' }),
      CU('h', 2, 3, (i, j, g) => { const hp = j ? g('h', 1, j - 1) : 0, x = g('x', 0, j); if (i === 0) { const v = 0.5 * x + 0.8 * hp - 0.5; return [v, `0.5·${PN2(x)} + 0.8·${PN2(hp, 3)} − 0.5 = ${fmt(v, 3)}`, [['x', 0, j], ...(j ? [['h', 1, j - 1]] : [])]]; } const pre = g('h', 0, j), v = Math.tanh(pre); return [v, `tanh(${fmt(pre, 3)}) = ${fmt(v, 3)}`, [['h', 0, j]]]; }, { l: 'w_x = 0.5, w_h = 0.8, b = −0.5', rl: ['F_t', 'h_t'], order: 'col', dp: 3 }),
      CU('y', 1, 3, (i, j, g) => { const h = g('h', 1, j), v = 2 * h + 0.1; return [v, `2·${PN2(h, 3)} + 0.1 = ${fmt(v, 3)}`, [['h', 1, j]]]; }, { l: 'y_t = 2·h_t + 0.1', dp: 3, n: 'Bước 3 có x = 1 nhưng y khác tờ 1 vì h mang theo quá khứ.' })] };
  SW.L_rnn3 = { t: 'Tờ 3 · Trạng thái ẩn 2 chiều, đầu vào là từ (one-hot)', cols: VOC.map(v => `“${v}”`),
    steps: [G('X', mx.T(seq.map(onehot)), { l: 'One-hot của chuỗi “mạch bị đứt”', rl: VOC }),
      CU('S', 4, 3, (i, j, g) => { const xi = seq[j]; const hpv = r => (j ? g('S', 2 + r, j - 1) : 0);
        if (i < 2) { const v = Wx[i][xi] + Wh[i][0] * hpv(0) + Wh[i][1] * hpv(1) + b[i]; return [v, `W_x[${i + 1},“${VOC[xi]}”] + ${Wh[i][0]}·${PN2(hpv(0), 3)} + ${PN2(Wh[i][1])}·${PN2(hpv(1), 3)} + ${b[i]} = ${fmt(v, 3)}`, [['X', xi, j], ...(j ? [['S', 2, j - 1], ['S', 3, j - 1]] : [])]]; }
        const pre = g('S', i - 2, j), v = Math.tanh(pre); return [v, `tanh(${fmt(pre, 3)}) = ${fmt(v, 3)}`, [['S', i - 2, j]]]; },
      { l: 'h_t = tanh(W_x·x_t + W_h·h_{t−1} + b)', rl: ['F₁', 'F₂', 'h₁', 'h₂'], order: 'col', dp: 3, n: `W_x = [[1, −1, 0.5], [0, 1, −1]] (one-hot chỉ "chọn" một cột), W_h = [[0.5, 0], [−0.5, 0.5]], b = [0, 0.2].` })] };
  SW.L_rnn4 = { t: 'Tờ 4 · Đầu ra: đoán từ tiếp theo bằng softmax', cols: VOC.map(v => `sau “${v}”`),
    steps: [G('H', H, { l: 'h_t (đã tính ở tờ 3)', rl: ['h₁', 'h₂'], dp: 3 }), LIN('Z', 'H', Wy, { l: 'Logit z = W_y·h + b_y', wl: '[W_y | b_y]', rl: VOC, dp: 3 }), EL('E', 'Z', 'exp', { rl: VOC, dp: 3, l: 'e^z' }), RED('s', 'E', 'colsum', { l: 'Tổng cột', dp: 3 }), BIN('P', 'E', '÷', 's', { l: 'Xác suất từ tiếp theo', rl: VOC, dp: 3 })] };
  SW.L_rnn5 = { t: 'Tờ 5 · Hàm mất mát: mô hình đoán đúng từ tiếp theo không?', cols: ['sau “mạch”', 'sau “bị”'],
    steps: [G('P', mx.r(P.map(r => r.slice(0, 2)), 3), { l: 'Xác suất (tờ 4, hai bước đầu)', rl: VOC, dp: 3 }), G('Y', [[0, 0], [1, 0], [0, 1]], { l: 'Từ đúng: “bị”, rồi “đứt”', rl: VOC }),
      CU('p', 1, 2, (i, j, g) => { const k = j === 0 ? 1 : 2, v = g('P', k, j); return [v, `p(từ đúng “${VOC[k]}”) = ${fmt(v, 3)}`, [['P', k, j], ['Y', k, j]]]; }, { l: 'Xác suất gán cho từ đúng', dp: 3 }),
      EL('L', 'p', 'neglog', { l: 'Cross-entropy −ln p', dp: 3 }), RED('Lm', 'L', 'rowmean', { l: 'Mất mát trung bình', dp: 3, n: 'Huấn luyện sẽ chỉnh W_x, W_h, W_y để con số này giảm.' })] };
  // tờ 6: sinh tự hồi quy, bắt đầu bằng "mạch", mỗi bước chọn từ có logit lớn nhất rồi đưa vào bước sau
  SW.L_rnn6 = { t: 'Tờ 6 · Tự sinh câu: lấy từ vừa đoán làm đầu vào bước sau', cols: ['bước 1', 'bước 2', 'bước 3'],
    steps: [CU('G', 9, 3, (i, j, g) => {
      const tokIn = j === 0 ? 0 : g('G', 8, j - 1); const hpv = r => (j ? g('G', 3 + r, j - 1) : 0);
      if (i === 0) return [tokIn, j === 0 ? 'bắt đầu bằng “mạch” (số 0)' : `từ vừa sinh ở bước trước: “${VOC[tokIn]}”`, j ? [['G', 8, j - 1]] : []];
      if (i === 1 || i === 2) { const r = i - 1, v = Wx[r][tokIn] + Wh[r][0] * hpv(0) + Wh[r][1] * hpv(1) + b[r]; return [v, `W_x[${r + 1},“${VOC[tokIn]}”] + ${Wh[r][0]}·${PN2(hpv(0), 3)} + ${PN2(Wh[r][1])}·${PN2(hpv(1), 3)} + ${b[r]} = ${fmt(v, 3)}`, [['G', 0, j], ...(j ? [['G', 3, j - 1], ['G', 4, j - 1]] : [])]]; }
      if (i === 3 || i === 4) { const pre = g('G', i - 2, j), v = Math.tanh(pre); return [v, `tanh(${fmt(pre, 3)}) = ${fmt(v, 3)}`, [['G', i - 2, j]]]; }
      if (i >= 5 && i <= 7) { const c = i - 5, h1 = g('G', 3, j), h2 = g('G', 4, j), v = Wy[c][0] * h1 + Wy[c][1] * h2 + Wy[c][2]; return [v, `z(“${VOC[c]}”) = ${Wy[c][0]}·${PN2(h1, 3)} + ${PN2(Wy[c][1])}·${PN2(h2, 3)} + ${Wy[c][2]} = ${fmt(v, 3)}`, [['G', 3, j], ['G', 4, j]]]; }
      const z = [5, 6, 7].map(k => g('G', k, j)), best = z.indexOf(Math.max(...z)); return [best, `argmax(${z.map(v => fmt(v, 2)).join(', ')}) → “${VOC[best]}” (số ${best})`, [['G', 5, j], ['G', 6, j], ['G', 7, j]]];
    }, { l: 'Mỗi cột: từ vào → h → logit → chọn từ', rl: ['từ vào', 'F₁', 'F₂', 'h₁', 'h₂', 'z “mạch”', 'z “bị”', 'z “đứt”', 'từ ra'], order: 'col', dp: 3, n: 'Mô hình tự viết ra “mạch bị đứt” rồi đoán tiếp. Đây chính là cách một mô hình ngôn ngữ (kể cả GPT) viết câu: đoán một từ, đưa từ đó vào lại, đoán tiếp.' })] };
  LONG.rnn = { t: 'RNN: từ một nơ-ron đến mô hình ngôn ngữ nhỏ', lesson: 'rnn', intro: 'Sáu tờ, mỗi tờ thêm đúng một thứ: hồi quy, trạng thái nhiều chiều, đầu ra softmax, hàm mất mát, rồi tự sinh câu. Từ vựng chỉ có 3 từ: “mạch”, “bị”, “đứt”.',
    sheets: [['L_rnn1', 'Bắt đầu: một phép nhân, cộng, tanh.'], ['L_rnn2', 'Đổi một thứ: h nhận thêm h của bước trước.'], ['L_rnn3', 'Đổi một thứ: h có 2 chiều, x là từ dạng one-hot.'], ['L_rnn4', 'Thêm đầu ra: logit → softmax trên 3 từ.'], ['L_rnn5', 'Thêm mục tiêu: cross-entropy với từ đúng.'], ['L_rnn6', 'Đóng vòng: từ vừa đoán thành đầu vào tiếp theo.']] };
})();

/* ============ CHUỖI 2: một khối Transformer đầy đủ ============ */
(() => {
  const toks = ['mạch', 'bị', 'đứt'];
  const X = [[1, 0, 1], [0, 1, 1]], Pp = [[0, 0.5, 1], [1, 0.5, 0]];
  const Xp = mx.add(X, Pp);
  const WQ = [[1, 0], [0, 1]], WK = [[0, 1], [1, 0]], WV = [[1, 1], [0, 1]], WO = [[1, 0], [0.5, 1]];
  const Q = mx.mul(WQ, Xp), K = mx.mul(WK, Xp), V = mx.mul(WV, Xp);
  const S = mx.map(mx.mul(mx.T(K), Q), v => v / Math.SQRT2), A = mx.softcol(S);
  const O = mx.mul(V, A), Op = mx.mul(WO, O), R = mx.add(Xp, Op);
  const mu = R[0].map((_, j) => (R[0][j] + R[1][j]) / 2), va = R[0].map((_, j) => ((R[0][j] - mu[j]) ** 2 + (R[1][j] - mu[j]) ** 2) / 2);
  const N = R.map(r => r.map((v, j) => (v - mu[j]) / Math.sqrt(va[j] + 0.01)));
  const W1 = [[1, 0, 0], [0, 1, 0], [1, -1, 0], [-1, 1, 0.5]], W2 = [[0.5, 0, 1, -0.5, 0], [0, 0.5, -1, 1, 0]];
  const cols = toks.map(t => `“${t}”`);
  SW.L_tf1 = { t: 'Tờ 1 · Nhúng từ + mã hóa vị trí', cols, steps: [G('X', X, { l: 'Embedding của từ', rl: ['d₁', 'd₂'] }), G('P', Pp, { l: 'Vector vị trí (vị trí 1, 2, 3)', rl: ['d₁', 'd₂'] }), BIN('Xp', 'X', '+', 'P', { l: 'Đầu vào khối: X + P', rl: ['d₁', 'd₂'], n: '“mạch” ở vị trí 1 và ở vị trí 3 sẽ có vector khác nhau.' })] };
  SW.L_tf2 = { t: 'Tờ 2 · Chiếu ra Q, K, V', cols, steps: [G('Xp', mx.r(Xp), { l: 'X + P (tờ 1)' }), LIN('Q', 'Xp', WQ, { l: 'Q = W_Q·X', wl: 'W_Q' }), LIN('K', 'Xp', WK, { l: 'K = W_K·X', wl: 'W_K' }), LIN('V', 'Xp', WV, { l: 'V = W_V·X', wl: 'W_V' })] };
  SW.L_tf3 = { t: 'Tờ 3 · Điểm attention và softmax', cols, steps: [G('Q', mx.r(Q), { l: 'Q (tờ 2)' }), G('K', mx.r(K), { l: 'K (tờ 2)' }), MM('S', 'K', 'Q', { At: true, l: 'S = Kᵀ·Q (hàng: key, cột: query)', rl: cols }), BIN('Ss', 'S', '÷', 1.414, { l: 'Chia √d = √2', rl: cols, dp: 3 }), EL('E', 'Ss', 'exp', { l: 'e^(·)', rl: cols, dp: 3 }), RED('Z', 'E', 'colsum', { l: 'Tổng cột', dp: 3 }), BIN('A', 'E', '÷', 'Z', { l: 'Trọng số attention A', rl: cols, dp: 3, n: 'Mỗi cột cộng lại bằng 1: token đó chia sự chú ý cho 3 token.' })] };
  SW.L_tf4 = { t: 'Tờ 4 · Trộn V theo trọng số, chiếu W_O', cols, steps: [G('V', mx.r(V), { l: 'V (tờ 2)' }), G('A', mx.r(A, 3), { l: 'A (tờ 3)', rl: cols, dp: 3 }), MM('O', 'V', 'A', { l: 'O = V·A', dp: 3 }), LIN('Op', 'O', WO, { l: 'Đầu ra attention = W_O·O', wl: 'W_O', dp: 3 })] };
  SW.L_tf5 = { t: 'Tờ 5 · Kết nối tắt + LayerNorm', cols, steps: [G('Xp', mx.r(Xp), { l: 'X + P (tờ 1)' }), G('Op', mx.r(Op, 3), { l: 'Đầu ra attention (tờ 4)', dp: 3 }), BIN('R', 'Xp', '+', 'Op', { l: 'Kết nối tắt R = X + Attn(X)', dp: 3 }), RED('mu', 'R', 'colmean', { l: 'Trung bình μ mỗi token', dp: 3 }),
    CU('v', 1, 3, (i, j, g) => { const a = g('R', 0, j), c = g('R', 1, j), m = g('mu', 0, j), v = ((a - m) ** 2 + (c - m) ** 2) / 2; return [v, `((${fmt(a, 3)} − ${fmt(m, 3)})² + (${fmt(c, 3)} − ${fmt(m, 3)})²) / 2 = ${fmt(v, 3)}`, [['R', 0, j], ['R', 1, j], ['mu', 0, j]]]; }, { l: 'Phương sai σ²', dp: 3 }),
    CU('N', 2, 3, (i, j, g) => { const r = g('R', i, j), m = g('mu', 0, j), s2 = g('v', 0, j), v = (r - m) / Math.sqrt(s2 + 0.01); return [v, `(${fmt(r, 3)} − ${fmt(m, 3)}) / √(${fmt(s2, 3)} + 0.01) = ${fmt(v, 3)}`, [['R', i, j], ['mu', 0, j], ['v', 0, j]]]; }, { l: 'LayerNorm (γ = 1, β = 0)', dp: 3, n: 'Với 2 chiều, LayerNorm luôn ra ±1 (gần đúng): nó chỉ giữ hướng, bỏ độ lớn.' })] };
  SW.L_tf6 = { t: 'Tờ 6 · FFN rồi kết nối tắt lần hai', cols, steps: [G('N', mx.r(N, 3), { l: 'Sau LayerNorm (tờ 5)', dp: 3 }), LIN('H', 'N', W1, { l: 'Mở rộng 2 → 4 + ReLU', wl: '[W₁ | b₁]', relu: true, dp: 3 }), LIN('F', 'H', W2, { l: 'Thu về 4 → 2', wl: '[W₂ | b₂]', dp: 3 }), BIN('Y', 'N', '+', 'F', { l: 'Đầu ra khối = N + FFN(N)', dp: 3, n: 'Xếp 12 khối như vậy là được một Transformer cỡ BERT-base (với d = 768).' })] };
  LONG.transformer = { t: 'Một khối Transformer từ đầu đến cuối', lesson: 'transformer', intro: 'Ba token “mạch bị đứt”, chiều d = 2. Đi hết một khối: nhúng + vị trí → Q, K, V → softmax → trộn V → kết nối tắt + LayerNorm → FFN.',
    sheets: [['L_tf1', 'Nhúng từ và cộng vị trí.'], ['L_tf2', 'Ba phép chiếu tuyến tính.'], ['L_tf3', 'Ai chú ý tới ai.'], ['L_tf4', 'Lấy thông tin theo mức chú ý.'], ['L_tf5', 'Cộng lại đầu vào, chuẩn hóa.'], ['L_tf6', 'Mạng truyền thẳng và cộng lần nữa.']] };
})();

/* ============ CHUỖI 3: CNN phát hiện vết xước, forward + backward ============ */
(() => {
  const I = [[0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 1, 0], [0, 0, 0, 1, 0, 0], [0, 0, 1, 0, 0, 0], [0, 1, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0]].map(r => r.map(v => v * 2 + 1));
  const Kd = [[-1, -1, 1], [-1, 1, -1], [1, -1, -1]];
  const conv = (A, K) => A.slice(0, A.length - 2).map((_, i) => A[0].slice(0, A[0].length - 2).map((__, j) => { let s = 0; for (let u = 0; u < 3; u++) for (let v = 0; v < 3; v++) s += A[i + u][j + v] * K[u][v]; return s; }));
  const C = conv(I, Kd), Rl = mx.map(C, v => Math.max(0, v));
  const Pm = [0, 1].map(i => [0, 1].map(j => Math.max(Rl[2 * i][2 * j], Rl[2 * i][2 * j + 1], Rl[2 * i + 1][2 * j], Rl[2 * i + 1][2 * j + 1])));
  const f = [[Pm[0][0]], [Pm[0][1]], [Pm[1][0]], [Pm[1][1]]];
  const Wc = [[0.2, -0.1, -0.1, 0.2, -1], [-0.2, 0.1, 0.1, -0.2, 1]];
  const z = mx.aff(Wc, f), p = mx.softcol(z);
  const dz = [[p[0][0] - 1], [p[1][0] - 0]];
  SW.L_cnn1 = { t: 'Tờ 1 · Tích chập 3×3 tìm nét chéo', cols: false, steps: [G('I', I, { l: 'Ảnh 6×6 (3 = nét xước sáng, 1 = nền)' }), CONV('C', 'I', Kd, { l: 'Bản đồ đặc trưng 4×4', kl: 'Bộ lọc chéo ↗' })] };
  SW.L_cnn2 = { t: 'Tờ 2 · ReLU rồi gộp cực đại 2×2', cols: false, steps: [G('C', C, { l: 'Bản đồ đặc trưng (tờ 1)' }), EL('R', 'C', 'relu', { l: 'ReLU' }), POOL('P', 'R', { l: 'Max-pool 2×2 → 2×2', n: 'Ô nào có nét chéo mạnh thì giữ lại, ô yếu bị bỏ.' })] };
  SW.L_cnn3 = { t: 'Tờ 3 · Duỗi phẳng, lớp Linear, softmax', cols: ['ảnh này'], steps: [G('f', f, { l: 'Duỗi 2×2 thành vector 4', rl: ['p₁₁', 'p₁₂', 'p₂₁', 'p₂₂'] }), LIN('z', 'f', Wc, { l: 'Logit z = W·f + b', wl: '[W | b]', rl: ['xước', 'tốt'], dp: 3 }), EL('E', 'z', 'exp', { rl: ['xước', 'tốt'], dp: 3, l: 'e^z' }), RED('s', 'E', 'colsum', { l: 'Tổng', dp: 3 }), BIN('p', 'E', '÷', 's', { l: 'Xác suất', rl: ['xước', 'tốt'], dp: 3 })] };
  SW.L_cnn4 = { t: 'Tờ 4 · Mất mát và gradient ở đầu ra', cols: ['ảnh này'], steps: [G('p', mx.r(p, 3), { l: 'Xác suất (tờ 3)', rl: ['xước', 'tốt'], dp: 3 }), G('y', [[1], [0]], { l: 'Nhãn thật: xước', rl: ['xước', 'tốt'] }),
    CU('L', 1, 1, (i, j, g) => { const v = -Math.log(g('p', 0, 0)); return [v, `−ln ${fmt(g('p', 0, 0), 3)} = ${fmt(v, 3)}`, [['p', 0, 0], ['y', 0, 0]]]; }, { l: 'Cross-entropy', dp: 3 }),
    BIN('dz', 'p', '−', 'y', { l: '∂L/∂z = p − y (đẹp nhờ softmax + cross-entropy)', rl: ['xước', 'tốt'], dp: 3 })] };
  SW.L_cnn5 = { t: 'Tờ 5 · Gradient của W và cập nhật một bước', cols: ['p₁₁', 'p₁₂', 'p₂₁', 'p₂₂', '1'], steps: [G('dz', mx.r(dz, 3), { l: '∂L/∂z (tờ 4)', rl: ['xước', 'tốt'], dp: 3 }), G('fb', [f.map(r => r[0]).concat([1])], { l: 'fᵀ kèm 1 cho bias', cl: ['p₁₁', 'p₁₂', 'p₂₁', 'p₂₂', '1'] }),
    MM('dW', 'dz', 'fb', { l: '∂L/∂[W | b] = ∂L/∂z · [f; 1]ᵀ', rl: ['xước', 'tốt'], dp: 3 }),
    CU('Wn', 2, 5, (i, j, g) => { const w = Wc[i][j], d = g('dW', i, j), v = w - 0.5 * d; return [v, `${PN2(w)} − 0.5·${PN2(d, 3)} = ${fmt(v, 3)}`, [['dW', i, j]]]; }, { l: 'W mới = W − 0.5·∂L/∂W', rl: ['xước', 'tốt'], dp: 3, n: 'Trọng số của lớp “xước” tăng ở những ô có nét chéo: lần sau mô hình tự tin hơn.' })] };
  LONG.cnn = { t: 'CNN phát hiện vết xước: forward và backward', lesson: 'conv', intro: 'Một ảnh 6×6 có vết xước chéo. Đi hết đường xuôi (tích chập → ReLU → pool → Linear → softmax) rồi đi ngược để cập nhật trọng số một bước.',
    sheets: [['L_cnn1', 'Bộ lọc tìm nét chéo.'], ['L_cnn2', 'Giữ tín hiệu mạnh, thu nhỏ.'], ['L_cnn3', 'Phân loại: xước hay tốt.'], ['L_cnn4', 'Đo sai và gradient đầu ra.'], ['L_cnn5', 'Lan ngược về trọng số, cập nhật.']] };
})();

/* ============ CHUỖI 4: một bước huấn luyện trọn vẹn của MLP 2-2-1 ============ */
(() => {
  const x = [[1], [2]], y = 1, W1 = [[0.5, -0.5, 0], [1, 0, -1]], W2 = [[1, -1, 0.5]], lr = 0.3;
  const fwd = (A, B) => { const z1 = mx.aff(A, x), h = mx.map(z1, sigm), o = mx.aff(B, h); return { z1, h, o: o[0][0] }; };
  const F = fwd(W1, W2), dO = F.o - y;
  const dW2 = [[dO * F.h[0][0], dO * F.h[1][0], dO]];
  const dh = [[W2[0][0] * dO], [W2[0][1] * dO]], dz1 = dh.map((r, i) => [r[0] * F.h[i][0] * (1 - F.h[i][0])]);
  const dW1 = dz1.map(r => [r[0] * x[0][0], r[0] * x[1][0], r[0]]);
  const W1n = W1.map((r, i) => r.map((v, j) => v - lr * dW1[i][j])), W2n = W2.map((r, i) => r.map((v, j) => v - lr * dW2[i][j]));
  SW.L_mlp1 = { t: 'Tờ 1 · Lan truyền xuôi', cols: ['x'], steps: [G('x', x, { l: 'Đầu vào', rl: ['x₁', 'x₂'] }), LIN('z1', 'x', W1, { l: 'z¹ = W¹·x + b¹', wl: '[W¹ | b¹]', rl: ['z₁', 'z₂'] }), EL('h', 'z1', 'sig', { l: 'h = σ(z¹)', rl: ['h₁', 'h₂'], dp: 3 }), LIN('o', 'h', W2, { l: 'ŷ = W²·h + b²', wl: '[W² | b²]', dp: 3 })] };
  SW.L_mlp2 = { t: 'Tờ 2 · Mất mát và gradient ở đầu ra', cols: ['x'], steps: [G('o', [[+F.o.toFixed(4)]], { l: 'ŷ (tờ 1)', dp: 3 }), G('y', [[y]], { l: 'Nhãn y' }), CU('L', 1, 1, (i, j, g) => { const e = g('o', 0, 0) - 1, v = 0.5 * e * e; return [v, `½·(${fmt(g('o', 0, 0), 3)} − 1)² = ${fmt(v, 4)}`, [['o', 0, 0], ['y', 0, 0]]]; }, { l: 'L = ½(ŷ − y)²', dp: 4 }), BIN('d', 'o', '−', 'y', { l: '∂L/∂ŷ = ŷ − y', dp: 3 })] };
  SW.L_mlp3 = { t: 'Tờ 3 · Gradient lớp 2 và tín hiệu lỗi truyền về lớp ẩn', cols: ['h₁', 'h₂', '1'], steps: [G('d', [[+dO.toFixed(4)]], { l: '∂L/∂ŷ (tờ 2)', dp: 3 }), G('hb', [[+F.h[0][0].toFixed(4), +F.h[1][0].toFixed(4), 1]], { l: '[h; 1]ᵀ (tờ 1)', dp: 3 }), MM('dW2', 'd', 'hb', { l: '∂L/∂[W² | b²]', dp: 4 }),
    CU('dz', 1, 2, (i, j, g) => { const w = W2[0][j], h = g('hb', 0, j), d = g('d', 0, 0), v = w * d * h * (1 - h); return [v, `w²_${j + 1}·δ·h(1−h) = ${PN2(w)}·${PN2(d, 3)}·${fmt(h, 3)}·${fmt(1 - h, 3)} = ${fmt(v, 4)}`, [['d', 0, 0], ['hb', 0, j]]]; }, { l: '∂L/∂z¹ (qua σ′ = h(1 − h))', cl: ['z₁', 'z₂'], dp: 4 })] };
  SW.L_mlp4 = { t: 'Tờ 4 · Gradient lớp 1', cols: ['x₁', 'x₂', '1'], steps: [G('dz', mx.r(dz1, 4), { l: '∂L/∂z¹ (tờ 3, dạng cột)', rl: ['z₁', 'z₂'], dp: 4 }), G('xb', [[1, 2, 1]], { l: '[x; 1]ᵀ' }), MM('dW1', 'dz', 'xb', { l: '∂L/∂[W¹ | b¹] = δ¹·[x; 1]ᵀ', rl: ['z₁', 'z₂'], dp: 4 })] };
  SW.L_mlp5 = { t: 'Tờ 5 · Cập nhật (η = 0.3) và chạy xuôi lại', cols: ['x'], steps: [G('x', x, { l: 'Đầu vào', rl: ['x₁', 'x₂'] }), LIN('z1', 'x', mx.r(W1n, 4), { l: 'z¹ với W¹ mới', wl: '[W¹ | b¹] mới', rl: ['z₁', 'z₂'], dp: 3 }), EL('h', 'z1', 'sig', { l: 'h', rl: ['h₁', 'h₂'], dp: 3 }), LIN('o', 'h', mx.r(W2n, 4), { l: 'ŷ mới', wl: '[W² | b²] mới', dp: 3, n: `Trước: ŷ = ${fmt(F.o, 3)}, mất mát ${fmt(0.5 * dO * dO, 4)}. So với ŷ mới ở đây: đã gần y = 1 hơn chưa?` })] };
  LONG.mlp = { t: 'Một bước huấn luyện trọn vẹn của MLP 2-2-1', lesson: 'backprop', intro: 'Một mẫu x = (1, 2), nhãn y = 1. Chạy xuôi, đo sai, lan ngược qua hai lớp, cập nhật trọng số, rồi chạy xuôi lại để thấy mất mát giảm.',
    sheets: [['L_mlp1', 'Chạy xuôi.'], ['L_mlp2', 'Đo sai.'], ['L_mlp3', 'Lan ngược qua lớp 2.'], ['L_mlp4', 'Lan ngược qua lớp 1.'], ['L_mlp5', 'Cập nhật và kiểm tra lại.']] };
})();

/* ---- giao diện: khung "Bài toán dài" có các tab Tờ 1, Tờ 2... ---- */
const LONG_BY_LESSON = Object.fromEntries(Object.entries(LONG).map(([k, v]) => [v.lesson, k]));
function renderLong(el, key) {
  const L = LONG[key]; let cur = 0;
  el.innerHTML = `<div class="lg"><div class="lg-head"><div class="eyebrow">Bài toán dài · ${L.sheets.length} tờ</div><h3>${L.t}</h3><p>${L.intro}</p></div>
    <div class="lg-tabs" role="tablist">${L.sheets.map(([k, c], i) => `<button role="tab" data-i="${i}"><b>Tờ ${i + 1}</b><small>${c}</small></button>`).join('')}</div>
    <div class="lg-body"></div><div class="lg-nav"><button class="btn small ghost" data-n="-1">← Tờ trước</button><span class="note-s lg-pos"></span><button class="btn small solid" data-n="1">Tờ tiếp →</button></div></div>`;
  const body = $('.lg-body', el);
  const show = i => { cur = Math.max(0, Math.min(L.sheets.length - 1, i)); swRender(body, L.sheets[cur][0]);
    $$('.lg-tabs button', el).forEach((b, k) => { b.classList.toggle('on', k === cur); b.classList.toggle('done', k < cur); b.setAttribute('aria-selected', k === cur); });
    $('.lg-pos', el).textContent = `Tờ ${cur + 1}/${L.sheets.length}`; $('[data-n="-1"]', el).disabled = cur === 0; $('[data-n="1"]', el).disabled = cur === L.sheets.length - 1; };
  el.onclick = e => { const t = e.target.closest('.lg-tabs [data-i]'); if (t) show(+t.dataset.i); const n = e.target.closest('[data-n]'); if (n) { show(cur + +n.dataset.n); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } };
  show(0);
}
