/* ===== Trang tính cho YOLO và các bài tổng hợp ===== */
const sg = x => 1 / (1 + Math.exp(-x));
SW.yolo = { t: 'Giải mã 3 dự đoán YOLO, lọc ngưỡng và NMS', d: 'Lưới 13×13, bước 32 pixel, anchor (116, 90).', cols: ['ô (6,4)', 'ô (7,4)', 'ô (2,9)'],
  steps: [G('T', [[0.4, -1, 0], [-0.2, -0.1, 0.3], [0.2, 0.1, -0.5], [-0.1, 0, -0.3], [2, 0.8, -1.5]], { l: 'Đầu ra thô của mạng', rl: ['t_x', 't_y', 't_w', 't_h', 't_o'] }), G('cc', [[6, 7, 2], [4, 4, 9]], { l: 'Chỉ số ô', rl: ['c_x', 'c_y'] }),
    CU('B', 5, 3, (i, j, g) => { const t = k => g('T', k, j);
      if (i === 0) { const v = (sg(t(0)) + g('cc', 0, j)) * 32; return [v, `b_x = (σ(${fmt(t(0))}) + ${g('cc', 0, j)})·32 = (${fmt(sg(t(0)), 3)} + ${g('cc', 0, j)})·32 = ${fmt(v, 1)}`, [['T', 0, j], ['cc', 0, j]]]; }
      if (i === 1) { const v = (sg(t(1)) + g('cc', 1, j)) * 32; return [v, `b_y = (σ(${fmt(t(1))}) + ${g('cc', 1, j)})·32 = ${fmt(v, 1)}`, [['T', 1, j], ['cc', 1, j]]]; }
      if (i === 2) { const v = 116 * Math.exp(t(2)); return [v, `b_w = 116·e^${fmt(t(2))} = ${fmt(v, 1)}`, [['T', 2, j]]]; }
      if (i === 3) { const v = 90 * Math.exp(t(3)); return [v, `b_h = 90·e^${fmt(t(3))} = ${fmt(v, 1)}`, [['T', 3, j]]]; }
      const v = sg(t(4)); return [v, `objectness = σ(${fmt(t(4))}) = ${fmt(v, 3)}`, [['T', 4, j]]]; }, { l: 'Giải mã hộp', rl: ['b_x', 'b_y', 'b_w', 'b_h', 'điểm'], order: 'col', dp: 1 }),
    CU('K', 1, 3, (i, j, g) => { const s = g('B', 4, j), keep = s >= 0.25 ? 1 : 0; return [keep, `${fmt(s, 3)} ${keep ? '≥' : '<'} 0.25 → ${keep ? 'giữ' : 'bỏ'}`, [['B', 4, j]]]; }, { l: 'Lọc ngưỡng 0.25 (1 = giữ)' }),
    CU('I', 1, 1, (i, j, g) => { const bx = k => [g('B', 0, k) - g('B', 2, k) / 2, g('B', 1, k) - g('B', 3, k) / 2, g('B', 0, k) + g('B', 2, k) / 2, g('B', 1, k) + g('B', 3, k) / 2]; const a = bx(0), b = bx(1); const iw = Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])), ih = Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1])), it = iw * ih, un = (a[2] - a[0]) * (a[3] - a[1]) + (b[2] - b[0]) * (b[3] - b[1]) - it; return [it / un, `giao ${fmt(iw, 1)}×${fmt(ih, 1)} = ${fmt(it, 0)}; hợp ${fmt(un, 0)}; IoU = ${fmt(it / un, 3)} > 0.45 → NMS xóa hộp ô (7,4) vì điểm thấp hơn`, [['B', 0, 0], ['B', 0, 1], ['B', 2, 0], ['B', 2, 1]]]; }, { l: 'IoU hộp 1 và hộp 2', cl: ['IoU'], dp: 3, n: 'Kết quả cuối: chỉ còn hộp ở ô (6,4).' })] };

SW.cap0 = { t: 'Một bước huấn luyện mô hình mèo/chó 4 đặc trưng', cols: ['x'],
  steps: [G('x', [[0.9], [0.2], [0.8], [0.1]], { l: 'Đặc trưng ảnh', rl: ['tai nhọn', 'tai cụp', 'râu', 'mõm to'] }),
    LIN('z', 'x', [[1, -1, 0.5, 0, 0], [-0.5, 1, 0, 1, 0.2]], { l: 'Logit = W·x + b', wl: '[W | b]', rl: ['mèo', 'chó'] }), EL('e', 'z', 'exp', { l: 'e^z', rl: ['mèo', 'chó'], dp: 3 }), RED('s', 'e', 'colsum', { l: 'Tổng', dp: 3 }), BIN('p', 'e', '÷', 's', { l: 'Xác suất', rl: ['mèo', 'chó'], dp: 3 }),
    CU('L', 1, 1, (i, j, g) => [-Math.log(g('p', 0, 0)), `−ln ${fmt(g('p', 0, 0), 3)} = ${fmt(-Math.log(g('p', 0, 0)), 3)}`, [['p', 0, 0]]], { l: 'Loss (nhãn: mèo)', dp: 3 }),
    BIN('d', 'p', '−', [[1], [0]], { l: 'δ = p − y', bl: 'y', rl: ['mèo', 'chó'], dp: 3 }), MM('dW', 'd', 'x', { Bt: true, l: '∂L/∂W = δ·xᵀ', cl: ['tai nhọn', 'tai cụp', 'râu', 'mõm to'], rl: ['mèo', 'chó'], dp: 3 }),
    CU('Wn', 2, 5, (i, j, g) => { const w = g('z·W', i, j), d = j < 4 ? g('dW', i, j) : g('d', i, 0), v = w - 0.5 * d; return [v, `${fmt(w)} − 0.5·${d < 0 ? '(' + fmt(d, 3) + ')' : fmt(d, 3)} = ${fmt(v, 3)}`, [['z·W', i, j], j < 4 ? ['dW', i, j] : ['d', i, 0]]]; }, { l: 'W, b mới (η = 0.5)', cl: ['tai nhọn', 'tai cụp', 'râu', 'mõm to', 'b'], rl: ['mèo', 'chó'], dp: 3 }),
    CU('z2', 2, 1, (i, j, g) => { let v = g('Wn', i, 4); const parts = []; for (let k = 0; k < 4; k++) { v += g('Wn', i, k) * g('x', k, 0); parts.push(`${fmt(g('Wn', i, k), 3)}·${fmt(g('x', k, 0))}`); } return [v, parts.join(' + ') + ` + ${fmt(g('Wn', i, 4), 3)} = ${fmt(v, 3)}`, [...[0, 1, 2, 3, 4].map(k => ['Wn', i, k])]]; }, { l: 'Logit mới', rl: ['mèo', 'chó'], dp: 3 }),
    CU('p2', 1, 1, (i, j, g) => { const a = g('z2', 0, 0), b = g('z2', 1, 0), p = 1 / (1 + Math.exp(b - a)); return [p, `P(mèo) = 1/(1 + e^(${fmt(b, 3)} − ${fmt(a, 3)})) = ${fmt(p, 3)}; loss mới = ${fmt(-Math.log(p), 3)}`, [['z2', 0, 0], ['z2', 1, 0]]]; }, { l: 'Xác suất mèo sau cập nhật', dp: 3 })] };

SW.cap1 = { t: 'k-NN cho bo mới và so sánh hai mô hình', cols: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8'],
  steps: [G('P', [[1, 2, 1, 4, 5, 4], [1, 1, 2, 4, 3, 5]], { l: 'Tập huấn luyện', rl: ['độ rộng', 'độ sáng'], cl: ['A OK', 'B OK', 'C OK', 'D NG', 'E NG', 'F NG'] }),
    CU('dq', 1, 6, (i, j, g) => { const a = g('P', 0, j) - 3, b = g('P', 1, j) - 3, v = Math.hypot(a, b); return [v, `√(${fmt(a)}² + ${fmt(b)}²) = ${fmt(v, 2)}`, [['P', 0, j], ['P', 1, j]]]; }, { l: 'Khoảng cách tới q = (3, 3)', cl: ['A', 'B', 'C', 'D', 'E', 'F'] }),
    G('y', [[1, 1, 1, 1, 0, 0, 0, 0]], { l: 'Nhãn thật 8 bo kiểm tra' }), G('pk', [[1, 1, 1, 0, 1, 0, 0, 0]], { l: 'k-NN dự đoán' }), G('pt', [[1, 1, 1, 1, 1, 1, 0, 0]], { l: 'Cây dự đoán' }),
    CU('m', 5, 2, (i, j, g) => { const p = j ? 'pt' : 'pk', S = f => _r(8).reduce((a, k) => a + f(g(p, 0, k), g('y', 0, k)), 0), tp = S((a, b) => a * b), fp = S((a, b) => a * (1 - b)), fn = S((a, b) => (1 - a) * b), H = [..._r(8).map(k => [p, 0, k]), ..._r(8).map(k => ['y', 0, k])];
      return [[tp, `TP = ${tp}`], [fp, `FP = ${fp}`], [fn, `FN = ${fn}`], [tp / (tp + fp), `Precision = ${tp}/${tp + fp} = ${fmt(tp / (tp + fp), 3)}`], [tp / (tp + fn), `Recall = ${tp}/${tp + fn} = ${fmt(tp / (tp + fn), 3)}`]][i].concat([H]); }, { l: 'Đánh giá', rl: ['TP', 'FP', 'FN', 'Precision', 'Recall'], cl: ['k-NN', 'Cây'], order: 'col', dp: 3, n: 'Yêu cầu recall ≥ 0.9 → chọn cây.' })] };

SW.cap2 = { t: 'Forward, backward và cập nhật mạng 4 → 2 → 1', cols: ['ảnh mèo'],
  steps: [G('x', [[0.95], [0.4], [0.38], [0.43]], { l: 'Đặc trưng ảnh mèo', rl: ['tai nhọn', 'tai cụp', 'mõm', 'râu'] }),
    LIN('h', 'x', [[1, -1, 0, 1, 0], [-1, 1, 1, 0, 0.1]], { l: 'Lớp ẩn + ReLU', relu: true, wl: '[W₁ | b₁]', rl: ['h₁', 'h₂'], dp: 3 }),
    LIN('z', 'h', [[2, -1, -0.5]], { l: 'z₂ = W₂·h + b₂', wl: '[W₂ | b₂]', dp: 3 }), EL('yh', 'z', 'sig', { l: 'ŷ = σ(z₂)', dp: 3 }), EL('L', 'yh', 'neglog', { l: 'Loss = −ln ŷ (nhãn mèo = 1)', dp: 3 }),
    BIN('d2', 'yh', '−', 1, { l: 'δ₂ = ŷ − 1', dp: 3 }), MM('dW2', 'd2', 'h', { Bt: true, l: '∂L/∂W₂ = δ₂·hᵀ', cl: ['h₁', 'h₂'], dp: 3 }),
    CU('dh', 2, 1, (i, j, g) => { const w = g('z·W', 0, i), d = g('d2', 0, 0), on = g('h', i, 0) > 0, v = on ? w * d : 0; return [v, `${fmt(w)}·${fmt(d, 3)}${on ? '' : ' → nơ-ron tắt (ReLU) → 0'} = ${fmt(v, 3)}`, [['z·W', 0, i], ['d2', 0, 0], ['h', i, 0]]]; }, { l: 'δ₁ = W₂ᵀ·δ₂ ⊙ ReLU′', rl: ['h₁', 'h₂'], dp: 3 }),
    MM('dW1', 'dh', 'x', { Bt: true, l: '∂L/∂W₁ = δ₁·xᵀ', rl: ['h₁', 'h₂'], cl: ['tai nhọn', 'tai cụp', 'mõm', 'râu'], dp: 3 }),
    CU('W2n', 1, 3, (i, j, g) => { const w = g('z·W', 0, j), d = j < 2 ? g('dW2', 0, j) : g('d2', 0, 0), v = w - 0.5 * d; return [v, `${fmt(w)} − 0.5·${fmt(d, 3)} = ${fmt(v, 3)}`, [['z·W', 0, j], j < 2 ? ['dW2', 0, j] : ['d2', 0, 0]]]; }, { l: 'W₂, b₂ mới', cl: ['w₁', 'w₂', 'b'], dp: 3 }),
    CU('chk', 1, 1, (i, j, g) => { const W1 = [[1, -1, 0, 1, 0], [-1, 1, 1, 0, 0.1]], x = [0.95, 0.4, 0.38, 0.43]; const h = W1.map((r, a) => { let s = r[4] - 0.5 * g('dh', a, 0); for (let k = 0; k < 4; k++) s += (r[k] - 0.5 * g('dW1', a, k)) * x[k]; return Math.max(0, s); }); const z = g('W2n', 0, 0) * h[0] + g('W2n', 0, 1) * h[1] + g('W2n', 0, 2), y = sig(z); return [y, `h mới = [${h.map(v => fmt(v, 3)).join(', ')}], z₂ = ${fmt(z, 3)}, ŷ = ${fmt(y, 3)}, loss = ${fmt(-Math.log(y), 3)}`, [['W2n', 0, 0], ['W2n', 0, 1], ['W2n', 0, 2]]]; }, { l: 'Kiểm tra sau cập nhật (cả W₁, b₁)', cl: ['ŷ mới'], dp: 3 })] };

const HUSKY4 = [['.', '.', '.', '.'], ['.', 'd', '.', '.'], ['.', 'd', 'd', '.'], ['.', 'd', 'w', 'd']].map(r => r.map(ch => +pxGray(ch).toFixed(3)));
SW.cap3 = { t: 'Từ pixel góc tai husky đến quyết định của mô hình v1', d: 'Độ sáng: nền 0.939, viền 0.206, trắng 0.971.',
  steps: [G('I', HUSKY4, { l: 'Góc trên trái ảnh husky (4×4)', dp: 3 }),
    CONV('C1', 'I', [[0, 1, 1], [-1, 0, 1], [-1, -1, 0]], { l: 'Bộ lọc chéo ╱', kl: 'Kernel ╱', dp: 3 }), CONV('C2', 'I', [[1, 1, 0], [1, 0, -1], [0, -1, -1]], { l: 'Bộ lọc chéo ╲', kl: 'Kernel ╲', dp: 3 }),
    CU('E', 2, 2, (i, j, g) => { const v = (Math.abs(g('C1', i, j)) + Math.abs(g('C2', i, j))) / 3; return [v, `(|${fmt(g('C1', i, j), 3)}| + |${fmt(g('C2', i, j), 3)}|)/3 = ${fmt(v, 3)}`, [['C1', i, j], ['C2', i, j]]]; }, { l: 'Độ mạnh cạnh chéo', dp: 3, n: 'Ô (1,1) chính là vùng 3×3 tính trong lời giải.' }),
    G('f', [[0.954], [0.382], [0.875], [0.061]], { l: 'Điểm 4 bộ phận (cả ảnh)', rl: ['tai nhọn', 'tai cụp', 'mõm sáng', 'râu'], cl: ['f'], dp: 3 }),
    LIN('z', 'f', [[4, -2, -1, 3, -0.8], [-1, 4, 0.5, -2, 0]], { l: 'Logit mô hình v1', wl: '[W | b] v1', rl: ['mèo', 'chó'], cl: ['logit'], dp: 3 }),
    EL('e', 'z', 'exp', { l: 'e^z', rl: ['mèo', 'chó'], cl: ['e^z'], dp: 3 }), RED('s', 'e', 'colsum', { l: 'Tổng', cl: ['Σ'], dp: 3 }), BIN('p', 'e', '÷', 's', { l: 'Xác suất', rl: ['mèo', 'chó'], cl: ['p'], dp: 3, n: 'Nhãn thật là chó → mô hình v1 SAI.' }),
    LIN('z2', 'f', [[3, -3, -4, 4, 0.6], [-0.5, 4, 4, -2, -0.6]], { l: 'Logit mô hình v2 (đã học husky)', wl: '[W | b] v2', rl: ['mèo', 'chó'], cl: ['logit'], dp: 3, n: 'Chó thắng rõ: v2 ĐÚNG.' })] };

SW.cap4 = { t: 'Cửa sổ trượt, z-score và bộ nhớ hồi quy', cols: ['t=1', 't=2', 't=3', 't=4', 't=5', 't=6', 't=7', 't=8'],
  steps: [G('x', [[2, 2.3, 2.6, 2.3, 2, 1.7, 2, 3.9]], { l: 'Số đo rung (mm/s)' }),
    CU('w', 3, 2, (i, j, g) => { const t = 6 + j, win = _r(6).map(k => g('x', 0, t - 6 + k)), m = win.reduce((a, b) => a + b, 0) / 6, sd = Math.sqrt(win.reduce((a, b) => a + (b - m) ** 2, 0) / 6), x = g('x', 0, t), H = _r(6).map(k => ['x', 0, t - 6 + k]);
      if (i === 0) return [m, `trung bình [${win.join(', ')}] = ${fmt(m, 3)}`, H]; if (i === 1) return [sd, `độ lệch chuẩn = ${fmt(sd, 3)}`, H]; const z = (x - m) / sd; return [z, `z = (${x} − ${fmt(m, 3)}) / ${fmt(sd, 3)} = ${fmt(z, 2)}${Math.abs(z) > 3 ? ' → BẤT THƯỜNG' : ''}`, [['x', 0, t], ['w', 0, j], ['w', 1, j]]]; }, { l: 'Cửa sổ 6 điểm cho bước 7 và 8', rl: ['trung bình', 'độ lệch', 'z'], cl: ['bước 7', 'bước 8'], order: 'col', dp: 3 }),
    CU('h', 2, 8, (i, j, g) => { if (i === 0) { const hp = j ? g('h', 0, j - 1) : 2, v = 0.6 * hp + 0.4 * g('x', 0, j); return [v, `h = 0.6·${fmt(hp, 3)} + 0.4·${fmt(g('x', 0, j))} = ${fmt(v, 3)}`, [['x', 0, j], ...(j ? [['h', 0, j - 1]] : [])]]; } if (j === 0) return [0, 'chưa có dự báo cho bước 1', []]; const pr = g('h', 0, j - 1), v = g('x', 0, j) - pr; return [v, `sai số = ${fmt(g('x', 0, j))} − h_trước ${fmt(pr, 3)} = ${fmt(v, 3)}`, [['x', 0, j], ['h', 0, j - 1]]]; }, { l: 'Bộ nhớ hồi quy h_t = 0.6·h + 0.4·x (h₀ = 2)', rl: ['h_t', 'sai số dự báo'], order: 'col', dp: 3 })] };

const HP = [0, 3, 5, 13].map(k => vitAnalyze(artGrid('husky')).patches[k].e.map(v => +v.toFixed(3)));
SW.cap5 = { t: 'Attention của [CLS] lên 4 mảnh ảnh husky', cols: ['tai trái', 'tai phải', 'trán', 'mõm'],
  steps: [G('E', [0, 1, 2].map(d => HP.map(p => p[d])), { l: 'Vector mảnh (cột)', rl: ['độ tối', 'cạnh', 'sáng mõm'], dp: 3 }),
    MM('sc', [[0.5, 3, -2.5], [3, 0.5, 2.5]], 'E', { l: 'Điểm q·e', al: 'q_mèo, q_chó', rl: ['q_mèo', 'q_chó'], dp: 3 }), BIN('st', 'sc', '÷', 0.25, { l: 'Chia τ = 0.25', rl: ['q_mèo', 'q_chó'], dp: 3 }),
    CU('A', 2, 4, (i, j, g) => { const r = _r(4).map(k => g('st', i, k)), m = Math.max(...r), ex = r.map(v => Math.exp(v - m)), z = ex.reduce((a, b) => a + b, 0), v = ex[j] / z; return [v, `softmax hàng ${i ? 'chó' : 'mèo'}: e^(${fmt(r[j] - m, 2)}) / ${fmt(z, 3)} = ${fmt(v, 3)}`, _r(4).map(k => ['st', i, k])]; }, { l: 'Trọng số attention', rl: ['q_mèo', 'q_chó'], dp: 3 }),
    MM('pool', 'A', 'E', { Bt: true, l: 'Vector gộp = A·Eᵀ', rl: ['mèo', 'chó'], cl: ['tối', 'cạnh', 'sáng'], dp: 3 }),
    CU('lg', 2, 1, (i, j, g) => { const q = i ? [3, 0.5, 2.5] : [0.5, 3, -2.5], v = 3 * _r(3).reduce((a, k) => a + q[k] * g('pool', i, k), 0); return [v, `3·(${q.map((w, k) => `${fmt(w)}·${fmt(g('pool', i, k), 3)}`).join(' + ')}) = ${fmt(v, 3)}`, _r(3).map(k => ['pool', i, k])]; }, { l: 'Logit', rl: ['mèo', 'chó'], cl: ['logit'], dp: 3, n: '“sáng mõm” = 0 ở mọi mảnh: mõm trắng của husky bị coi như nền.' })] };

SW.cap6 = { t: 'Thêm nhiễu và ước lượng ảnh sạch (ᾱ = 0.5)', cols: ['px1', 'px2', 'px3'],
  steps: [G('x0', [[0.8, 0.8, -0.6]], { l: 'x₀ (vùng đường mạch)' }), G('ep', [[0.5, -1, 0.3]], { l: 'ε thật' }),
    CU('xt', 1, 3, (i, j, g) => { const v = 0.7071 * g('x0', 0, j) + 0.7071 * g('ep', 0, j); return [v, `0.707·${fmt(g('x0', 0, j))} + 0.707·${fmt(g('ep', 0, j))} = ${fmt(v, 3)}`, [['x0', 0, j], ['ep', 0, j]]]; }, { l: 'x_t', dp: 3 }),
    G('eh', [[0.4, -0.8, 0.5]], { l: 'ε̂ mạng dự đoán' }),
    CU('xh', 1, 3, (i, j, g) => { const v = (g('xt', 0, j) - 0.7071 * g('eh', 0, j)) / 0.7071; return [v, `(${fmt(g('xt', 0, j), 3)} − 0.707·${fmt(g('eh', 0, j))}) / 0.707 = ${fmt(v, 3)}`, [['xt', 0, j], ['eh', 0, j]]]; }, { l: 'x̂₀', dp: 3 }), BIN('er', 'xh', '−', 'x0', { l: 'Sai số x̂₀ − x₀', dp: 3 }), EL('e2', 'er', 'sq', { l: 'Bình phương', dp: 3 }), RED('mse', 'e2', 'rowmean', { l: 'MSE', cl: ['MSE'], dp: 4 })] };

SW.cap7 = { t: 'CLIP zero-shot cho ảnh lỗi', cols: ['“vết xước”', '“đứt mạch”', '“bo bình thường”'],
  steps: [G('T', [[0.8, 0.1, 0.2], [0.2, 0.9, 0.1], [0.1, 0.3, 0.95]], { l: 'Vector câu mô tả (cột)' }),
    MM('dp', [[0.9, 0.1, 0.2]], 'T', { l: 'v·t', al: 'vector ảnh v', dp: 3 }), EL('t2', 'T', 'sq', { l: 't²', dp: 3 }), RED('n2', 't2', 'colsum', { l: '‖t‖²', dp: 3 }), EL('n', 'n2', 'sqrt', { l: '‖t‖', dp: 3 }),
    CU('cos', 1, 3, (i, j, g) => { const v = g('dp', 0, j) / (0.927 * g('n', 0, j)); return [v, `${fmt(g('dp', 0, j), 3)} / (0.927·${fmt(g('n', 0, j), 3)}) = ${fmt(v, 3)}`, [['dp', 0, j], ['n', 0, j]]]; }, { l: 'cosine (‖v‖ = 0.927)', dp: 3 }),
    BIN('lg', 'cos', '÷', 0.1, { l: 'Chia τ = 0.1', dp: 2 }), EL('e', 'lg', 'exp', { l: 'e^(·)', dp: 2 }), RED('z', 'e', 'rowsum', { l: 'Tổng', cl: ['Σ'], dp: 2 }), BIN('p', 'e', '÷', 'z', { l: 'Xác suất', dp: 4 })] };

SW.cap8 = { t: 'A*, Kalman và Bayes cho robot kho', cols: ['A', 'B', 'C', 'Kệ'],
  steps: [G('c', [[2, 2, 2, 1]], { l: 'Chi phí cạnh' }), CU('g', 1, 4, (i, j, gg) => { const p = j ? gg('g', 0, j - 1) : 0, v = p + gg('c', 0, j); return [v, `${p} + ${gg('c', 0, j)} = ${v}`, [['c', 0, j], ...(j ? [['g', 0, j - 1]] : [])]]; }, { l: 'g' }), G('h', [[5, 3, 1, 0]], { l: 'h' }), BIN('f', 'g', '+', 'h', { l: 'f = g + h' }),
    CU('k', 5, 1, (i, j, g) => [[15, 'μ⁻ = 10 + 5 = 15'], [5, 'P⁻ = 4 + 1 = 5'], [0.5, 'K = 5/(5 + 5) = 0.5'], [15.5, 'μ = 15 + 0.5·(16 − 15) = 15.5'], [2.5, 'P = (1 − 0.5)·5 = 2.5']][i].concat([[]]), { l: 'Kalman (đo 16 m)', rl: ['μ⁻', 'P⁻', 'K', 'μ', 'P'], cl: ['vị trí'], dp: 2 }),
    G('pr', [[0.3, 0.7]], { l: 'Prior kệ', cl: ['đúng mã', 'sai mã'] }), G('lk', [[0.9, 0.2]], { l: 'P(quét “đúng” | ·)', cl: ['đúng mã', 'sai mã'] }), BIN('j', 'pr', '×', 'lk', { l: 'Prior × likelihood', cl: ['đúng mã', 'sai mã'], dp: 3 }), RED('z', 'j', 'rowsum', { l: 'Tổng', cl: ['Σ'], dp: 3 }), BIN('post', 'j', '÷', 'z', { l: 'Posterior', cl: ['đúng mã', 'sai mã'], dp: 3, n: '0.66 > 0.6 → lấy hàng.' })] };

SW.cap9 = { t: 'Lượng tử hóa INT8 mô hình v2 và tính lại cho husky', cols: ['m:tai', 'm:cụp', 'm:mõm', 'm:râu', 'm:b', 'c:tai', 'c:cụp', 'c:mõm', 'c:râu', 'c:b'],
  steps: [G('w', [[3, -3, -4, 4, 0.6, -0.5, 4, 4, -2, -0.6]], { l: 'Trọng số v2 (m = mèo, c = chó)' }),
    CU('s', 1, 1, (i, j, g) => { const m = Math.max(..._r(10).map(k => Math.abs(g('w', 0, k)))); return [m / 127, `max|w| / 127 = ${m} / 127 = ${fmt(m / 127, 4)}`, _r(10).map(k => ['w', 0, k])]; }, { l: 'Scale s', cl: ['s'], dp: 4 }),
    BIN('ws', 'w', '÷', 's', { l: 'w / s', dp: 1 }), EL('q', 'ws', 'round', { l: 'q (INT8)', dp: 0 }), BIN('wh', 'q', '×', 's', { l: 'ŵ = s·q', dp: 3 }),
    CU('lg', 2, 1, (i, j, g) => { const f = [0.954, 0.382, 0.875, 0.061, 1], o = i * 5; let v = 0, v0 = 0; f.forEach((x, k) => { v += g('wh', 0, o + k) * x; v0 += g('w', 0, o + k) * x; }); return [v, `${i ? 'chó' : 'mèo'}: Σ ŵ·f = ${fmt(v, 3)} (bản FP32: ${fmt(v0, 3)})`, _r(5).map(k => ['wh', 0, o + k])]; }, { l: 'Logit husky sau lượng tử', rl: ['mèo', 'chó'], cl: ['logit'], dp: 3, n: 'Chó vẫn thắng xa: lượng tử không đổi kết luận.' })] };
