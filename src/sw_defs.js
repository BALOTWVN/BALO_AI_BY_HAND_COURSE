/* ===== Định nghĩa trang tính bấm-từng-số cho từng bài ===== */
const _r = n => [...Array(n).keys()];

SW.vector = { t: 'Điểm hợp khẩu vị = tích vô hướng', d: 'Mỗi cột là hồ sơ vị của một quán. Khẩu vị của bạn u = [3, 2, 4, 1].', cols: ['quán A', 'quán B', 'quán C'],
  steps: [G('Q', [[4, 2, 8], [1, 4, 2], [5, 1, 10], [0, 3, 0]], { l: 'Hồ sơ 3 quán', rl: ['mặn', 'ngọt', 'cay', 'béo'] }),
    MM('s', [[3, 2, 4, 1]], 'Q', { l: 'Điểm = u · quán', al: 'u' }),
    EL('q2', 'Q', 'sq', { l: 'Bình phương từng vị', rl: ['mặn', 'ngọt', 'cay', 'béo'] }), RED('n2', 'q2', 'colsum', { l: '‖quán‖² = tổng cột' }), EL('n', 'n2', 'sqrt', { l: '‖quán‖' }),
    BIN('c1', 's', '÷', 'n', { l: 'Điểm / ‖quán‖' }), BIN('cos', 'c1', '÷', 5.477, { l: 'cos θ (chia thêm ‖u‖ = √30)', dp: 3, n: 'Quán C = 2 × quán A nên cosine bằng nhau.' })] };

SW.matmul = { t: 'Tiền đi chợ: giỏ hàng × bảng giá', d: 'Mỗi ô kết quả = một hàng giỏ hàng nhân thẳng với một cột bảng giá.', cols: ['Bến Thành', 'Tân Định'],
  steps: [G('P', [[150, 130], [10, 12], [35, 30]], { l: 'Bảng giá (nghìn đồng)', rl: ['thịt', 'rau', 'trứng'] }),
    MM('C', [[2, 3, 1], [1, 0, 2]], 'P', { l: 'Tổng tiền = Giỏ · Giá', al: 'Giỏ (Lan, Minh)', arl: ['Lan', 'Minh'], rl: ['Lan', 'Minh'] })] };

SW.calculus = { t: 'Đạo hàm f′(x) = 3x² − 3 và một bước đi xuống dốc', cols: ['x=−2', 'x=−1', 'x=0', 'x=1', 'x=2'],
  steps: [G('x', [[-2, -1, 0, 1, 2]], { l: 'x' }), EL('x2', 'x', 'sq', { l: 'x²' }), BIN('t', 'x2', '×', 3, { l: '3x²' }), BIN('d', 't', '−', 3, { l: 'f′(x) = 3x² − 3', n: 'Dương: hàm đang tăng. Âm: đang giảm. Bằng 0: cực trị.' }),
    CU('nx', 1, 5, (i, j, g) => { const x = g('x', 0, j), d = g('d', 0, j), v = x - 0.1 * d; return [v, `${fmt(x)} − 0.1·${d < 0 ? '(' + fmt(d) + ')' : fmt(d)} = ${fmt(v, 2)}`, [['x', 0, j], ['d', 0, j]]]; }, { l: 'Một bước GD: x − 0.1·f′(x)' })] };

SW.prob = { t: 'Softmax và cross-entropy cho 3 ảnh bo mạch', cols: ['ảnh 1', 'ảnh 2', 'ảnh 3'],
  steps: [G('z', [[2, 0.5, 1], [0.5, 2, 1], [-1, 0, 1]], { l: 'Logits', rl: ['xước', 'đứt', 'OK'] }),
    EL('e', 'z', 'exp', { l: 'e^z', rl: ['xước', 'đứt', 'OK'] }), RED('s', 'e', 'colsum', { l: 'Tổng mỗi cột' }), BIN('p', 'e', '÷', 's', { l: 'p = e^z / tổng', rl: ['xước', 'đứt', 'OK'], dp: 3 }),
    CU('L', 1, 3, (i, j, g) => { const y = [1, 1, 2][j], p = g('p', y, j); return [-Math.log(p), `nhãn đúng “${['xước', 'đứt', 'OK'][y]}”: −ln ${fmt(p, 3)} = ${fmt(-Math.log(p), 3)}`, [['p', y, j]]]; }, { l: 'Loss = −ln p(nhãn đúng)', n: 'Nhãn đúng: ảnh 1 đứt, ảnh 2 đứt, ảnh 3 OK.', dp: 3 })] };

SW.gauss = { t: 'Lấy mẫu z = μ + σ·ε và tính KL', cols: ['chiều 1', 'chiều 2', 'chiều 3'],
  steps: [G('mu', [[0.5, -1, 0]], { l: 'μ' }), G('lv', [[0, -1.39, 0.69]], { l: 'log σ²' }), G('eps', [[0.2, -0.4, 1.5]], { l: 'ε ~ N(0, 1)' }),
    EL('sd', 'lv', { f: x => Math.exp(x / 2), t: (x, v) => `e^(${fmt(x, 2)} / 2) = ${fmt(v, 2)}` }, { l: 'σ = e^(½·log σ²)' }),
    BIN('se', 'sd', '×', 'eps', { l: 'σ·ε' }), BIN('zz', 'mu', '+', 'se', { l: 'z = μ + σ·ε' }),
    CU('kl', 1, 3, (i, j, g) => { const m = g('mu', 0, j), l = g('lv', 0, j), v = 0.5 * (m * m + Math.exp(l) - 1 - l); return [v, `½(${fmt(m * m, 2)} + ${fmt(Math.exp(l), 2)} − 1 − (${fmt(l, 2)})) = ${fmt(v, 3)}`, [['mu', 0, j], ['lv', 0, j]]]; }, { l: 'KL từng chiều = ½(μ² + σ² − 1 − log σ²)', dp: 3 })] };

SW.mlbasics = { t: 'Dự đoán giá phòng trọ và tính MSE', cols: ['15 m²', '20 m²', '25 m²', '30 m²'],
  steps: [G('x', [[15, 20, 25, 30]], { l: 'Diện tích x' }), LIN('yh', 'x', [[0.14, 0.35]], { l: 'ŷ = 0.14·x + 0.35', wl: '[w | b]' }), G('y', [[2.5, 3, 4, 4.5]], { l: 'Giá thật y (triệu)' }),
    BIN('e', 'yh', '−', 'y', { l: 'Sai số ŷ − y' }), EL('e2', 'e', 'sq', { l: 'Bình phương', dp: 4 }), RED('mse', 'e2', 'rowmean', { l: 'MSE = trung bình', dp: 4 })] };

SW.evaluation = { t: 'Ngưỡng → dự đoán → TP, FP, FN → chỉ số', cols: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'],
  steps: [G('s', [[0.9, 0.7, 0.6, 0.4, 0.3, 0.1]], { l: 'Điểm NG mô hình cho' }), G('y', [[1, 0, 1, 1, 0, 0]], { l: 'Nhãn thật (1 = lỗi)' }),
    EL('p', 's', { f: x => (x >= 0.5 ? 1 : 0), t: (x, v) => `${fmt(x, 2)} ${x >= 0.5 ? '≥' : '<'} 0.5 → ${v}` }, { l: 'Dự đoán với ngưỡng 0.5' }),
    BIN('tp', 'p', '×', 'y', { l: 'TP = dự đoán × nhãn' }),
    CU('fp', 1, 6, (i, j, g) => { const p = g('p', 0, j), y = g('y', 0, j); return [p * (1 - y), `${p}·(1 − ${y}) = ${p * (1 - y)}`, [['p', 0, j], ['y', 0, j]]]; }, { l: 'FP = dự đoán × (1 − nhãn)' }),
    CU('fn', 1, 6, (i, j, g) => { const p = g('p', 0, j), y = g('y', 0, j); return [(1 - p) * y, `(1 − ${p})·${y} = ${(1 - p) * y}`, [['p', 0, j], ['y', 0, j]]]; }, { l: 'FN = (1 − dự đoán) × nhãn' }),
    CU('m', 3, 1, (i, j, g) => { const S = n => _r(6).reduce((a, k) => a + g(n, 0, k), 0), H = n => _r(6).map(k => [n, 0, k]); const tp = S('tp'), fp = S('fp'), fn = S('fn'), P = tp / (tp + fp), Rc = tp / (tp + fn);
      if (i === 0) return [P, `Precision = TP/(TP+FP) = ${tp}/${tp + fp} = ${fmt(P, 3)}`, [...H('tp'), ...H('fp')]];
      if (i === 1) return [Rc, `Recall = TP/(TP+FN) = ${tp}/${tp + fn} = ${fmt(Rc, 3)}`, [...H('tp'), ...H('fn')]];
      return [2 * P * Rc / (P + Rc), `F1 = 2·${fmt(P, 3)}·${fmt(Rc, 3)} / (${fmt(P, 3)} + ${fmt(Rc, 3)}) = ${fmt(2 * P * Rc / (P + Rc), 3)}`, [['m', 0, 0], ['m', 1, 0]]]; }, { l: 'Chỉ số', rl: ['Precision', 'Recall', 'F1'], cl: ['giá trị'], dp: 3 })] };

SW.knn = { t: 'k-NN: khoảng cách từ điểm mới q = (3, 3)', cols: ['A (OK)', 'B (OK)', 'C (OK)', 'D (NG)', 'E (NG)'],
  steps: [G('P', [[1, 2, 1, 4, 5], [1, 1, 2, 4, 3]], { l: 'Điểm đã biết', rl: ['đặc trưng 1', 'đặc trưng 2'] }),
    BIN('d', 'P', '−', [[3], [3]], { l: 'Hiệu với q', bl: 'q' }), EL('d2', 'd', 'sq', { l: 'Bình phương' }), RED('s', 'd2', 'colsum', { l: 'Khoảng cách²' }), EL('dist', 's', 'sqrt', { l: 'Khoảng cách' }),
    CU('rank', 1, 5, (i, j, g) => { const ds = _r(5).map(k => g('dist', 0, k)), r = ds.filter(v => v < ds[j] - 1e-9).length + 1; return [r, `hạng ${r} (khoảng cách ${fmt(ds[j], 2)})`, [['dist', 0, j]]]; }, { l: 'Thứ hạng gần', n: 'k = 3: D, E và một trong B/C → 2 NG, 1 OK → NG.' })] };

SW.svm = { t: 'SVM: f = w·x + b, lề và hinge loss', cols: ['P1 (+)', 'P2 (+)', 'P3 (−)', 'P4 (−)'],
  steps: [G('X', [[3, 2, 1, 2], [2, 1.5, 1, 2]], { l: 'Điểm', rl: ['x₁', 'x₂'] }), LIN('f', 'X', [[1, 1, -3]], { l: 'f = w·x + b', wl: '[w | b]' }), G('y', [[1, 1, -1, -1]], { l: 'Nhãn y' }),
    BIN('m', 'y', '×', 'f', { l: 'Lề m = y·f' }), EL('h', 'm', { f: x => Math.max(0, 1 - x), t: (x, v) => `max(0, 1 − ${x < 0 ? '(' + fmt(x, 2) + ')' : fmt(x, 2)}) = ${fmt(v, 2)}` }, { l: 'Hinge = max(0, 1 − m)', n: '0: an toàn. 0–1: nằm trong lề. Trên 1: sai phía.' })] };

SW.tree = { t: 'Gini của nút gốc, hai nút con và mức giảm', cols: ['gốc', 'trái (< 70 µm)', 'phải'],
  steps: [G('c', [[4, 3, 1], [6, 1, 5]], { l: 'Số bo', rl: ['NG', 'OK'] }), RED('n', 'c', 'colsum', { l: 'Tổng mỗi nút' }), BIN('p', 'c', '÷', 'n', { l: 'Tỷ lệ p', rl: ['NG', 'OK'], dp: 3 }), EL('p2', 'p', 'sq', { l: 'p²', dp: 3 }), RED('sp', 'p2', 'colsum', { l: 'Σ p²', dp: 3 }), BIN('gini', 1, '−', 'sp', { l: 'Gini = 1 − Σ p²', dp: 3 }),
    CU('w', 2, 1, (i, j, g) => { if (i === 0) { const v = 0.4 * g('gini', 0, 1) + 0.6 * g('gini', 0, 2); return [v, `4/10·${fmt(g('gini', 0, 1), 3)} + 6/10·${fmt(g('gini', 0, 2), 3)} = ${fmt(v, 3)}`, [['gini', 0, 1], ['gini', 0, 2], ['n', 0, 1], ['n', 0, 2]]]; } const v = g('gini', 0, 0) - g('w', 0, 0); return [v, `${fmt(g('gini', 0, 0), 3)} − ${fmt(g('w', 0, 0), 3)} = ${fmt(v, 3)}`, [['gini', 0, 0], ['w', 0, 0]]]; }, { l: 'Sau khi tách', rl: ['Gini TB có trọng số', 'Mức giảm (gain)'], cl: ['giá trị'], dp: 3 })] };

SW.ensemble = { t: 'Hai vòng gradient boosting bằng gốc cây', cols: ['x=1', 'x=2', 'x=3', 'x=4'],
  steps: [G('y', [[2, 4, 7, 9]], { l: 'y thật' }), G('F0', [[5.5, 5.5, 5.5, 5.5]], { l: 'F₀ = trung bình y' }), BIN('r1', 'y', '−', 'F0', { l: 'Phần dư r₁ = y − F₀' }),
    CU('h1', 1, 4, (i, j, g) => { const idx = j < 2 ? [0, 1] : [2, 3], v = (g('r1', 0, idx[0]) + g('r1', 0, idx[1])) / 2; return [v, `cây 1 tách x ≤ 2.5, bên ${j < 2 ? 'trái' : 'phải'}: (${fmt(g('r1', 0, idx[0]))} + ${fmt(g('r1', 0, idx[1]))}) / 2 = ${fmt(v)}`, idx.map(k => ['r1', 0, k])]; }, { l: 'Cây 1 dự đoán h₁' }),
    BIN('F1', 'F0', '+', 'h1', { l: 'F₁ = F₀ + h₁' }), BIN('r2', 'y', '−', 'F1', { l: 'Phần dư r₂' }),
    CU('h2', 1, 4, (i, j, g) => { const idx = j < 1 ? [0] : [1, 2, 3], v = idx.reduce((a, k) => a + g('r2', 0, k), 0) / idx.length; return [v, `cây 2 tách x ≤ 1.5, bên ${j < 1 ? 'trái' : 'phải'}: trung bình r₂ = ${fmt(v, 3)}`, idx.map(k => ['r2', 0, k])]; }, { l: 'Cây 2 dự đoán h₂', dp: 3 }),
    BIN('F2', 'F1', '+', 'h2', { l: 'F₂ = F₁ + h₂', dp: 3 }), BIN('r3', 'y', '−', 'F2', { l: 'Phần dư còn lại', dp: 3 })] };

SW.kmeans = { t: 'Một vòng k-means trên 6 điểm', cols: ['1', '2', '3', '8', '9', '10'],
  steps: [G('x', [[1, 2, 3, 8, 9, 10]], { l: 'Điểm x' }),
    CU('d', 2, 6, (i, j, g) => { const mu = [1, 3][i], v = Math.abs(g('x', 0, j) - mu); return [v, `|${g('x', 0, j)} − ${mu}| = ${v}`, [['x', 0, j]]]; }, { l: 'Khoảng cách tới tâm', rl: ['μ₁ = 1', 'μ₂ = 3'], order: 'col' }),
    CU('a', 1, 6, (i, j, g) => { const a = g('d', 0, j) <= g('d', 1, j) ? 1 : 2; return [a, `${fmt(g('d', 0, j))} ${a === 1 ? '≤' : '>'} ${fmt(g('d', 1, j))} → cụm ${a}`, [['d', 0, j], ['d', 1, j]]]; }, { l: 'Gán cụm gần nhất' }),
    CU('mu', 1, 2, (i, j, g) => { const ks = _r(6).filter(k => g('a', 0, k) === j + 1), v = ks.reduce((s, k) => s + g('x', 0, k), 0) / ks.length; return [v, `trung bình {${ks.map(k => g('x', 0, k)).join(', ')}} = ${fmt(v, 2)}`, ks.map(k => ['x', 0, k])]; }, { l: 'Tâm mới', cl: ['μ₁', 'μ₂'] })] };

SW.pca = { t: 'Ma trận hiệp phương sai và chiếu lên trục chính', cols: ['p1', 'p2', 'p3', 'p4'],
  steps: [G('X', [[2, -2, 1, -1], [2, -2, -1, 1]], { l: 'Dữ liệu đã trừ trung bình', rl: ['x', 'y'] }),
    MM('XX', 'X', 'X', { Bt: true, l: 'X·Xᵀ', rl: ['x', 'y'], cl: ['x', 'y'] }), BIN('S', 'XX', '÷', 4, { l: 'Σ = X·Xᵀ / 4', rl: ['x', 'y'], cl: ['x', 'y'] }),
    MM('z', [[0.707, 0.707]], 'X', { l: 'z = v₁ᵀ·X (chiếu lên trục chính)', al: 'v₁ᵀ', dp: 3 }), EL('z2', 'z', 'sq', { l: 'z²', dp: 3 }), RED('vz', 'z2', 'rowmean', { l: 'Phương sai theo trục', n: 'Xấp xỉ trị riêng lớn nhất λ₁ = 4.', dp: 3 })] };

SW.nbayes = { t: 'Bo bị báo lỗi có thật sự lỗi? (Bayes hai lần)', cols: ['lỗi', 'tốt'],
  steps: [G('pr', [[0.01, 0.99]], { l: 'Prior P(trạng thái)' }), G('lk', [[0.99, 0.02]], { l: 'P(báo lỗi | trạng thái)' }),
    BIN('j', 'pr', '×', 'lk', { l: 'Prior × likelihood', dp: 4 }), RED('z', 'j', 'rowsum', { l: 'P(báo) = tổng', dp: 4 }), BIN('post', 'j', '÷', 'z', { l: 'Posterior sau lần báo 1', dp: 3 }),
    BIN('j2', 'post', '×', 'lk', { l: 'Lần báo 2: posterior cũ × likelihood', dp: 4 }), RED('z2', 'j2', 'rowsum', { l: 'Tổng', dp: 4 }), BIN('post2', 'j2', '÷', 'z2', { l: 'Posterior sau lần báo 2', dp: 3 })] };

SW.neuron = { t: 'Một nơ-ron xử lý 4 hồ sơ', cols: ['x₁', 'x₂', 'x₃', 'x₄'],
  steps: [G('X', [[2, 1, 0, 3], [1, 0, 2, 1], [-1, 1, 1, 0]], { l: 'Đầu vào (3 đặc trưng)' }), LIN('z', 'X', [[0.5, -1, 0.3, 0.2]], { l: 'z = w·x + b', wl: '[w | b]' }), EL('a', 'z', 'relu', { l: 'a = ReLU(z)' })] };

SW.activation = { t: 'Ba hàm kích hoạt và đạo hàm sigmoid', cols: ['z=−2', 'z=−0.5', 'z=0', 'z=1', 'z=3'],
  steps: [G('z', [[-2, -0.5, 0, 1, 3]], { l: 'z' }), EL('r', 'z', 'relu', { l: 'ReLU' }), EL('s', 'z', 'sig', { l: 'Sigmoid', dp: 3 }), EL('t', 'z', 'tanh', { l: 'Tanh', dp: 3 }),
    CU('ds', 1, 5, (i, j, g) => { const s = g('s', 0, j), v = s * (1 - s); return [v, `σ(1 − σ) = ${fmt(s, 3)}·${fmt(1 - s, 3)} = ${fmt(v, 3)}`, [['s', 0, j]]]; }, { l: 'Đạo hàm sigmoid', dp: 3, n: 'Lớn nhất 0.25 tại z = 0: gốc của tiêu biến gradient.' })] };

SW.mlp = { t: 'MLP 2 → 2 → 1 giải bài toán XOR', cols: ['(0,0)', '(0,1)', '(1,0)', '(1,1)'],
  steps: [G('X', [[0, 0, 1, 1], [0, 1, 0, 1]], { l: 'Đầu vào', rl: ['x₁', 'x₂'] }), LIN('h', 'X', [[1, 1, 0], [1, 1, -1]], { l: 'Lớp ẩn + ReLU', relu: true, wl: '[W¹ | b¹]' }), LIN('y', 'h', [[1, -2, 0]], { l: 'Đầu ra ŷ', wl: '[W² | b²]', n: 'So với XOR: 0, 1, 1, 0.' })] };

SW.loss = { t: 'MSE và MAE khi có một ngoại lai', cols: ['m1', 'm2', 'm3', 'm4'],
  steps: [G('y', [[10, 12, 11, 50]], { l: 'Nhãn y (50 là ngoại lai)' }), G('yh', [[20, 20, 20, 20]], { l: 'Dự đoán ŷ' }), BIN('e', 'yh', '−', 'y', { l: 'Sai số' }), EL('e2', 'e', 'sq', { l: 'Bình phương' }), EL('ea', 'e', 'abs', { l: 'Trị tuyệt đối' }), RED('mse', 'e2', 'rowmean', { l: 'MSE' }), RED('mae', 'ea', 'rowmean', { l: 'MAE' })] };

SW.backprop = { t: 'Lan truyền ngược qua lớp Linear 3 → 2', cols: ['x'],
  steps: [G('x', [[1], [0], [2]], { l: 'Đầu vào x (cột)' }), LIN('z', 'x', [[1, 0, 1], [0, 2, -1]], { l: 'Forward: z = W·x', wl: 'W' }), G('dz', [[0.5], [-1]], { l: 'Gradient từ phía sau δ = ∂L/∂z', cl: ['δ'] }),
    MM('dW', 'dz', 'x', { Bt: true, l: '∂L/∂W = δ·xᵀ', cl: ['x₁', 'x₂', 'x₃'] }), MM('dx', 'z·W', 'dz', { At: true, l: '∂L/∂x = Wᵀ·δ', cl: ['∂x'] }),
    CU('Wn', 2, 3, (i, j, g) => { const w = g('z·W', i, j), d = g('dW', i, j), v = w - 0.1 * d; return [v, `${fmt(w)} − 0.1·${d < 0 ? '(' + fmt(d) + ')' : fmt(d)} = ${fmt(v, 2)}`, [['z·W', i, j], ['dW', i, j]]]; }, { l: 'Cập nhật: W − 0.1·∂L/∂W', cl: ['x₁', 'x₂', 'x₃'] })] };

SW.optim = { t: 'SGD và Momentum trên f(w) = w²', cols: ['t=0', 't=1', 't=2', 't=3'],
  steps: [CU('sgd', 2, 4, (i, j, g) => { if (j === 0) return i === 0 ? [4, 'khởi đầu w₀ = 4', []] : [8, 'g = 2·4 = 8', [['sgd', 0, 0]]]; if (i === 0) { const w = g('sgd', 0, j - 1), gg = g('sgd', 1, j - 1), v = w - 0.1 * gg; return [v, `w = ${fmt(w, 3)} − 0.1·${fmt(gg, 3)} = ${fmt(v, 3)}`, [['sgd', 0, j - 1], ['sgd', 1, j - 1]]]; } const w = g('sgd', 0, j); return [2 * w, `g = 2·${fmt(w, 3)} = ${fmt(2 * w, 3)}`, [['sgd', 0, j]]]; }, { l: 'SGD (η = 0.1)', rl: ['w', 'g'], order: 'col', dp: 3 }),
    CU('mom', 3, 4, (i, j, g) => { if (j === 0) return [[4, 'khởi đầu w₀ = 4', []], [8, 'g = 2·4 = 8', [['mom', 0, 0]]], [8, 'v = 0.9·0 + 8 = 8', [['mom', 1, 0]]]][i]; if (i === 0) { const w = g('mom', 0, j - 1), v0 = g('mom', 2, j - 1), v = w - 0.1 * v0; return [v, `w = ${fmt(w, 3)} − 0.1·${fmt(v0, 3)} = ${fmt(v, 3)}`, [['mom', 0, j - 1], ['mom', 2, j - 1]]]; } if (i === 1) { const w = g('mom', 0, j); return [2 * w, `g = 2·${fmt(w, 3)} = ${fmt(2 * w, 3)}`, [['mom', 0, j]]]; } const vp = g('mom', 2, j - 1), gg = g('mom', 1, j), v = 0.9 * vp + gg; return [v, `v = 0.9·${fmt(vp, 3)} + ${fmt(gg, 3)} = ${fmt(v, 3)}`, [['mom', 2, j - 1], ['mom', 1, j]]]; }, { l: 'Momentum (β = 0.9)', rl: ['w', 'g', 'v'], order: 'col', dp: 3 })] };

SW.norm = { t: 'LayerNorm từng mẫu (theo cột)', cols: ['mẫu 1', 'mẫu 2', 'mẫu 3'],
  steps: [G('X', [[2, 1, 4], [4, 3, 4], [6, 8, 1]], { l: 'Đặc trưng × mẫu', rl: ['f1', 'f2', 'f3'] }), RED('mu', 'X', 'colmean', { l: 'μ mỗi mẫu' }), BIN('c', 'X', '−', 'mu', { l: 'x − μ' }), EL('c2', 'c', 'sq', { l: '(x − μ)²' }), RED('var', 'c2', 'colmean', { l: 'σ²' }), EL('sd', 'var', 'sqrt', { l: 'σ', dp: 3 }), BIN('xh', 'c', '÷', 'sd', { l: 'x̂ = (x − μ) / σ', dp: 3 }), BIN('gx', 'xh', '×', 2, { l: 'γ·x̂ (γ = 2)', dp: 3 }), BIN('yy', 'gx', '+', 1, { l: 'y = γ·x̂ + β (β = 1)', dp: 3 })] };

SW.conv = { t: 'Kernel cạnh dọc trên ảnh đường mạch bị đứt',
  steps: [G('I', [[0, 0, 9, 9, 0], [0, 0, 9, 9, 0], [0, 0, 0, 0, 0], [0, 0, 9, 9, 0], [0, 0, 9, 9, 0]], { l: 'Ảnh 5×5 (mạch đứt ở hàng 3)' }), CONV('Y', 'I', [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], { l: 'Đầu ra 3×3' }), EL('R', 'Y', 'relu', { l: 'ReLU', n: 'Chỉ giữ cạnh “tối → sáng” từ trái sang phải.' })] };

SW.convshape = { t: 'Max pooling, average pooling và conv stride 2',
  steps: [G('I', [[1, 3, 2, 0], [5, 4, 1, 1], [0, 2, 6, 7], [1, 1, 8, 2]], { l: 'Feature map 4×4' }), POOL('P', 'I', { size: 2, kind: 'max', l: 'Max pool 2×2' }), POOL('A', 'I', { size: 2, kind: 'avg', l: 'Average pool 2×2' }), CONV('S', 'I', [[1, 0], [0, 1]], { stride: 2, l: 'Conv 2×2, stride 2' })] };

SW.channels = { t: 'Conv 1×1: trộn 3 kênh màu thành 2 kênh', cols: ['px1', 'px2', 'px3', 'px4'],
  steps: [G('X', [[200, 0, 255, 10], [100, 255, 255, 20], [50, 0, 255, 200]], { l: 'Ảnh 2×2 (mỗi cột là 1 pixel)', rl: ['R', 'G', 'B'] }), LIN('Y', 'X', [[0.3, 0.59, 0.11], [0, 0, 1]], { l: '2 kênh ra', wl: 'Kernel 1×1 (2 bộ lọc)', rl: ['xám', 'xanh'], dp: 1 })] };

SW.rf = { t: 'Trường tiếp nhận qua 5 lớp', cols: ['conv3', 'conv3', 'pool2', 'conv3', 'conv3'],
  steps: [G('L', [[3, 3, 2, 3, 3], [1, 1, 2, 1, 1]], { l: 'Kernel k và stride s', rl: ['k', 's'] }),
    CU('r', 2, 5, (i, j, g) => { const k = g('L', 0, j), s = g('L', 1, j), rp = j ? g('r', 0, j - 1) : 1, Jp = j ? g('r', 1, j - 1) : 1, hp = j ? [['r', 0, j - 1], ['r', 1, j - 1]] : []; if (i === 0) return [rp + (k - 1) * Jp, `${rp} + (${k} − 1)·${Jp} = ${rp + (k - 1) * Jp}`, [['L', 0, j], ...hp]]; return [Jp * s, `${Jp}·${s} = ${Jp * s}`, [['L', 1, j], ...hp.slice(1)]]; }, { l: 'RF và bước nhảy tích lũy J', rl: ['RF r', 'J'], order: 'col' })] };

SW.cnnarch = { t: 'Đếm tham số từng lớp LeNet-5', cols: ['C1', 'C3', 'F5', 'F6', 'Ra'],
  steps: [G('L', [[5, 5, 1, 1, 1], [1, 6, 400, 120, 84], [6, 16, 120, 84, 10]], { l: 'K, C vào, C ra', rl: ['K', 'C vào', 'C ra'] }),
    CU('p', 1, 5, (i, j, g) => { const K = g('L', 0, j), a = g('L', 1, j), b = g('L', 2, j), v = K * K * a * b + b; return [v, `${K}·${K}·${a}·${b} + ${b} = ${v}`, [['L', 0, j], ['L', 1, j], ['L', 2, j]]]; }, { l: 'Tham số = K²·C_vào·C_ra + C_ra' }), RED('t', 'p', 'rowsum', { l: 'Tổng', cl: ['tổng'] })] };

SW.resnet = { t: 'Khối residual: y = ReLU(F(x) + x)', cols: ['x₁', 'x₂', 'x₃', 'x₄'],
  steps: [G('X', [[2, 0, 1, -1], [1, 3, -2, 0]], { l: 'Đầu vào x' }), LIN('h', 'X', [[1, -1], [0, 1]], { l: 'Nhánh F, lớp 1 + ReLU', relu: true, wl: 'W₁' }), LIN('F', 'h', [[-0.5, 1], [1, -1]], { l: 'Nhánh F, lớp 2', wl: 'W₂' }), BIN('s', 'F', '+', 'X', { l: 'F(x) + x (đường tắt)' }), EL('y', 's', 'relu', { l: 'y = ReLU(·)' })] };

SW.efficient = { t: 'Squeeze-and-Excitation: chấm điểm từng kênh', cols: ['p1', 'p2', 'p3', 'p4'],
  steps: [G('X', [[1, 3, 2, 2], [0, 1, 0, 1], [4, 4, 2, 6]], { l: 'Feature map (3 kênh × 4 vị trí)', rl: ['k1', 'k2', 'k3'] }), RED('s', 'X', 'rowmean', { l: 'Squeeze: trung bình mỗi kênh', cl: ['s'] }),
    LIN('h', 's', [[0.5, 0, 0.25], [0, 1, -0.5]], { l: 'FC 3 → 2 + ReLU', relu: true, cl: ['h'] }), LIN('e', 'h', [[1, 0], [0, 2], [0.5, -1]], { l: 'FC 2 → 3', cl: ['e'] }), EL('w', 'e', 'sig', { l: 'Trọng số kênh = σ(·)', cl: ['w'], dp: 3 }), BIN('Y', 'X', '×', 'w', { l: 'Nhân lại từng kênh', dp: 2 })] };

SW.detseg = { t: 'IoU giữa hộp nhãn và hộp dự đoán', cols: ['cặp 1', 'cặp 2', 'cặp 3'],
  steps: [G('A', [[0, 0, 1], [0, 0, 1], [4, 4, 5], [4, 4, 5]], { l: 'Hộp nhãn A', rl: ['x1', 'y1', 'x2', 'y2'] }), G('B', [[2, 1, 6], [2, 1, 6], [6, 5, 9], [6, 5, 9]], { l: 'Hộp dự đoán B', rl: ['x1', 'y1', 'x2', 'y2'] }),
    CU('I', 5, 3, (i, j, g) => { const a = k => g('A', k, j), b = k => g('B', k, j); const iw = Math.max(0, Math.min(a(2), b(2)) - Math.max(a(0), b(0))), ih = Math.max(0, Math.min(a(3), b(3)) - Math.max(a(1), b(1))), it = iw * ih, ua = (a(2) - a(0)) * (a(3) - a(1)), ub = (b(2) - b(0)) * (b(3) - b(1)), un = ua + ub - it;
      if (i === 0) return [iw, `max(0, min(${a(2)}, ${b(2)}) − max(${a(0)}, ${b(0)})) = ${iw}`, [['A', 2, j], ['B', 2, j], ['A', 0, j], ['B', 0, j]]];
      if (i === 1) return [ih, `max(0, min(${a(3)}, ${b(3)}) − max(${a(1)}, ${b(1)})) = ${ih}`, [['A', 3, j], ['B', 3, j], ['A', 1, j], ['B', 1, j]]];
      if (i === 2) return [it, `${iw}·${ih} = ${it}`, [['I', 0, j], ['I', 1, j]]];
      if (i === 3) return [un, `${ua} + ${ub} − ${it} = ${un}`, [['I', 2, j]]];
      return [it / un, `${it} / ${un} = ${fmt(it / un, 3)}`, [['I', 2, j], ['I', 3, j]]]; }, { l: 'Tính IoU', rl: ['rộng giao', 'cao giao', 'giao', 'hợp', 'IoU'], order: 'col', dp: 3 })] };

SW.embed = { t: 'Tra embedding = ma trận × one-hot', cols: ['“bún”', '“mạch”', '“phở”'],
  steps: [G('O', [[0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 0]], { l: 'One-hot (từ điển 4 từ)', rl: ['phở', 'bún', 'mạch', 'lỗi'] }),
    MM('e', [[0.9, 0.8, 0.1, 0.2], [0.1, 0.2, 0.9, 0.7]], 'O', { l: 'Embedding = Eᵀ·one-hot', al: 'Eᵀ (cột = từ)' }),
    MM('sim', 'e', 'e', { At: true, l: 'Độ giống eᵀ·e', rl: ['bún', 'mạch', 'phở'], cl: ['bún', 'mạch', 'phở'], dp: 2 })] };

SW.rnn = { t: 'RNN chạy 4 bước (w_h = 0.5, w_x = 1)', cols: ['t=1', 't=2', 't=3', 't=4'],
  steps: [G('x', [[1, 0, 0, 1]], { l: 'Chuỗi x' }),
    CU('h', 2, 4, (i, j, g) => { const hp = j ? g('h', 1, j - 1) : 0, x = g('x', 0, j); if (i === 0) { const v = 0.5 * hp + x; return [v, `0.5·${fmt(hp, 3)} + 1·${fmt(x)} = ${fmt(v, 3)}`, [['x', 0, j], ...(j ? [['h', 1, j - 1]] : [])]]; } const pre = g('h', 0, j), v = Math.tanh(pre); return [v, `tanh(${fmt(pre, 3)}) = ${fmt(v, 3)}`, [['h', 0, j]]]; }, { l: 'Trạng thái ẩn', rl: ['tiền kích hoạt', 'h_t'], order: 'col', dp: 3, n: 'Tín hiệu của x₁ phai dần qua từng bước.' })] };

SW.lstm = { t: 'LSTM: 3 bước của cổng và ô nhớ', cols: ['t=1', 't=2', 't=3'],
  steps: [G('Z', [[2, 2, -2], [0, 1, 0], [1, -1, 1], [1, 1, 2]], { l: 'Tổng trước kích hoạt (đã tính sẵn)', rl: ['z_f', 'z_i', 'z_c', 'z_o'] }),
    CU('s', 6, 3, (i, j, g) => { const z = k => g('Z', k, j), cp = j ? g('s', 4, j - 1) : 0;
      if (i === 0) { const v = sig(z(0)); return [v, `f = σ(${fmt(z(0))}) = ${fmt(v, 3)}`, [['Z', 0, j]]]; }
      if (i === 1) { const v = sig(z(1)); return [v, `i = σ(${fmt(z(1))}) = ${fmt(v, 3)}`, [['Z', 1, j]]]; }
      if (i === 2) { const v = Math.tanh(z(2)); return [v, `c̃ = tanh(${fmt(z(2))}) = ${fmt(v, 3)}`, [['Z', 2, j]]]; }
      if (i === 3) { const v = sig(z(3)); return [v, `o = σ(${fmt(z(3))}) = ${fmt(v, 3)}`, [['Z', 3, j]]]; }
      if (i === 4) { const f = g('s', 0, j), ii = g('s', 1, j), c = g('s', 2, j), v = f * cp + ii * c; return [v, `c = f·c_trước + i·c̃ = ${fmt(f, 3)}·${fmt(cp, 3)} + ${fmt(ii, 3)}·${fmt(c, 3)} = ${fmt(v, 3)}`, [['s', 0, j], ['s', 1, j], ['s', 2, j], ...(j ? [['s', 4, j - 1]] : [])]]; }
      const v = g('s', 3, j) * Math.tanh(g('s', 4, j)); return [v, `h = o·tanh(c) = ${fmt(g('s', 3, j), 3)}·${fmt(Math.tanh(g('s', 4, j)), 3)} = ${fmt(v, 3)}`, [['s', 3, j], ['s', 4, j]]]; }, { l: 'Cổng và ô nhớ', rl: ['f', 'i', 'c̃', 'o', 'c_t', 'h_t'], order: 'col', dp: 3 })] };

SW.attention = { t: 'Self-attention cho 3 token', d: 'Quy ước: mỗi cột là một token.', cols: ['“mạch”', '“bị”', '“đứt”'],
  steps: [G('X', [[1, 0, 1], [0, 1, 1]], { l: 'Embedding X' }), LIN('Q', 'X', [[1, 0], [0, 2]], { l: 'Q = W_Q·X', wl: 'W_Q' }), LIN('K', 'X', [[1, 1], [0, 1]], { l: 'K = W_K·X', wl: 'W_K' }), LIN('V', 'X', [[2, 0], [0, 1]], { l: 'V = W_V·X', wl: 'W_V' }),
    MM('S', 'K', 'Q', { At: true, l: 'Điểm S = Kᵀ·Q', rl: ['k₁', 'k₂', 'k₃'], n: 'Cột j: token j đang hỏi; hàng i: token i được hỏi.' }), BIN('Ss', 'S', '÷', 1.414, { l: 'Chia √d_k = √2', rl: ['k₁', 'k₂', 'k₃'] }), EL('E', 'Ss', 'exp', { l: 'e^(·)', rl: ['k₁', 'k₂', 'k₃'] }), RED('Zs', 'E', 'colsum', { l: 'Tổng mỗi cột' }), BIN('A', 'E', '÷', 'Zs', { l: 'Trọng số attention (softmax theo cột)', rl: ['k₁', 'k₂', 'k₃'], dp: 3 }), MM('O', 'V', 'A', { l: 'Đầu ra O = V·A', dp: 3 })] };

SW.mha = { t: 'Ghép 2 đầu attention, chiếu W_O và mặt nạ nhân quả', cols: ['tok1', 'tok2', 'tok3'],
  steps: [G('H1', [[0.5, 1.2, 0.9]], { l: 'Đầu ra đầu 1 (d = 1)' }), G('H2', [[2, 0.3, 1.1]], { l: 'Đầu ra đầu 2 (d = 1)' }),
    CU('C', 2, 3, (i, j, g) => { const n = i ? 'H2' : 'H1', v = g(n, 0, j); return [v, `lấy từ đầu ${i + 1}: ${fmt(v)}`, [[n, 0, j]]]; }, { l: 'Ghép (concat)' }), LIN('O', 'C', [[1, 0.5], [-1, 1]], { l: 'O = W_O·Concat', wl: 'W_O' }),
    CU('mk', 3, 3, (i, j) => { const s = [[1, 2, 0], [0, 1, 3], [2, 1, 1]][i][j]; return i > j ? [-Infinity, `token ${j + 1} không được nhìn token ${i + 1} (tương lai) → −∞`, []] : [s, `điểm ${s} giữ nguyên`, []]; }, { l: 'Điểm sau mặt nạ (hàng = key)', rl: ['k1', 'k2', 'k3'] }),
    EL('me', 'mk', 'exp', { l: 'e^(·): −∞ thành 0', rl: ['k1', 'k2', 'k3'] }), RED('ms', 'me', 'colsum', { l: 'Tổng cột' }), BIN('ma', 'me', '÷', 'ms', { l: 'Trọng số (tam giác)', rl: ['k1', 'k2', 'k3'], dp: 3 })] };

SW.posenc = { t: 'Mã hóa vị trí sinusoidal với d = 4', cols: ['p=0', 'p=1', 'p=2', 'p=3'],
  steps: [CU('PE', 4, 4, (i, j) => { const w = i < 2 ? 1 : 0.01, fn = i % 2 ? Math.cos : Math.sin, v = fn(j * w); return [v, `${i % 2 ? 'cos' : 'sin'}(${j}·${w}) = ${fmt(v, 3)}`, []]; }, { l: 'PE (hàng = chiều)', rl: ['sin ω₀p', 'cos ω₀p', 'sin ω₁p', 'cos ω₁p'], dp: 3 }),
    MM('sim', 'PE', 'PE', { At: true, l: 'Độ giống PEᵀ·PE', rl: ['p=0', 'p=1', 'p=2', 'p=3'], n: 'Vị trí gần nhau thì tích lớn hơn.' })] };

SW.transformer = { t: 'FFN và kết nối tắt trong khối Transformer', cols: ['tok1', 'tok2', 'tok3'],
  steps: [G('X', [[1, 0, 2], [0, 1, -1]], { l: 'Đầu vào (sau attention), d = 2' }), LIN('H', 'X', [[1, 1, 0], [1, -1, 0], [-1, 0, 1], [0, 2, -1]], { l: 'FFN lớp 1: 2 → 4 + ReLU', relu: true, wl: '[W₁ | b₁]' }), LIN('F', 'H', [[1, 0, 0.5, 0], [0, 1, 0, -0.5]], { l: 'FFN lớp 2: 4 → 2', wl: 'W₂' }), BIN('Y', 'X', '+', 'F', { l: 'x + FFN(x)' })] };

SW.vit = { t: 'Cắt ảnh 4×4 thành 4 token cho ViT', cols: ['mảnh 1', 'mảnh 2', 'mảnh 3', 'mảnh 4'],
  steps: [G('I', [[1, 2, 0, 0], [3, 4, 0, 0], [0, 0, 5, 6], [0, 0, 7, 8]], { l: 'Ảnh 4×4', cl: false }),
    CU('P', 4, 4, (i, j, g) => { const pr = Math.floor(j / 2) * 2, pc = (j % 2) * 2, r = pr + Math.floor(i / 2), c = pc + (i % 2), v = g('I', r, c); return [v, `mảnh ${j + 1}, phần tử ${i + 1} ← ảnh[${r + 1}, ${c + 1}] = ${v}`, [['I', r, c]]]; }, { l: 'Trải phẳng mỗi mảnh 2×2 thành 1 cột', order: 'col' }),
    LIN('T', 'P', [[1, 0, 1, 0], [0, 1, 0, 1]], { l: 'Chiếu tuyến tính E (4 → 2)', wl: 'E' }), BIN('Tp', 'T', '+', [[0, 0.1, 0.2, 0.3], [0, 0, 0, 0]], { l: '+ position embedding', bl: 'pos' })] };

SW.ae = { t: 'Autoencoder 4 → 3 → 2 → 3 → 4', d: 'Mỗi cột là một mẫu. Hàng cuối của mỗi ma trận trọng số (cột viền nét đứt) là bias.', cols: ['x₁', 'x₂', 'x₃', 'x₄'],
  steps: [G('X', [[2, 1, 0, 1], [1, 2, 1, 0], [0, 1, 2, 1], [1, 0, 1, 2]], { l: 'Đầu vào X' }),
    LIN('h1', 'X', [[1, 0, 1, 0, 0], [0, 1, 0, 1, -1], [1, -1, 0, 0, 1]], { l: 'Encoder: 4 → 3 + ReLU', relu: true, wl: '[W | b]' }),
    LIN('z', 'h1', [[1, 1, 0, -1], [0, -1, 1, 0]], { l: 'Nút cổ chai: 3 → 2 + ReLU', relu: true, wl: '[W | b]' }),
    LIN('h2', 'z', [[1, 0, 0], [0, 1, 1], [1, 1, -1]], { l: 'Decoder: 2 → 3 + ReLU', relu: true, wl: '[W | b]' }),
    LIN('Y', 'h2', [[1, 0, 0, 0], [0, 1, 0, 1], [0, 0, 1, 0], [1, -1, 1, 0]], { l: 'Đầu ra Y: 3 → 4', wl: '[W | b]' }),
    BIN('D', 'Y', '−', 'X', { l: 'Y − X (đích là chính X)' }), BIN('gr', 'D', '×', 2, { l: '∂L/∂Y = 2(Y − X)', n: 'Gradient của MSE, bắt đầu lan truyền ngược.' })] };

SW.vae = { t: 'Một lượt VAE đầy đủ: lấy mẫu → giải mã → loss', cols: ['chiều 1', 'chiều 2'],
  steps: [G('mu', [[0.5, -1]], { l: 'μ (encoder)' }), G('lv', [[0, -1.386]], { l: 'log σ² (encoder)', dp: 3 }), G('eps', [[0.2, -0.4]], { l: 'ε ~ N(0, 1)' }),
    EL('sd', 'lv', { f: x => Math.exp(x / 2), t: (x, v) => `e^(${fmt(x, 3)} / 2) = ${fmt(v, 2)}` }, { l: 'σ' }), BIN('se', 'sd', '×', 'eps', { l: 'σ·ε' }), BIN('z', 'mu', '+', 'se', { l: 'z = μ + σ·ε' }),
    CU('xh', 1, 2, (i, j, g) => { const a = g('z', 0, 0), b = g('z', 0, 1), v = j ? a - b : a + b; return [v, `x̂${j + 1} = z₁ ${j ? '−' : '+'} z₂ = ${fmt(a, 2)} ${j ? '−' : '+'} (${fmt(b, 2)}) = ${fmt(v, 2)}`, [['z', 0, 0], ['z', 0, 1]]]; }, { l: 'Decoder (tuyến tính)' }),
    G('x', [[0, 1]], { l: 'Ảnh thật x' }), BIN('d', 'xh', '−', 'x', { l: 'x̂ − x' }), EL('d2', 'd', 'sq', { l: 'Bình phương' }),
    CU('kl', 1, 2, (i, j, g) => { const m = g('mu', 0, j), l = g('lv', 0, j), v = 0.5 * (m * m + Math.exp(l) - 1 - l); return [v, `½(${fmt(m * m, 2)} + ${fmt(Math.exp(l), 2)} − 1 − (${fmt(l, 3)})) = ${fmt(v, 3)}`, [['mu', 0, j], ['lv', 0, j]]]; }, { l: 'KL từng chiều', dp: 3 }),
    CU('L', 1, 1, (i, j, g) => { const rec = g('d2', 0, 0) + g('d2', 0, 1), kl = g('kl', 0, 0) + g('kl', 0, 1); return [rec + kl, `tái tạo ${fmt(rec, 3)} + KL ${fmt(kl, 3)} = ${fmt(rec + kl, 3)}`, [['d2', 0, 0], ['d2', 0, 1], ['kl', 0, 0], ['kl', 0, 1]]]; }, { l: 'Loss VAE', cl: ['tổng'], dp: 3 })] };

SW.gan = { t: 'Discriminator chấm 2 ảnh thật và 2 ảnh giả', cols: ['thật 1', 'thật 2', 'giả 1', 'giả 2'],
  steps: [G('X', [[4, 3.5, 1, 2]], { l: 'Đặc trưng ảnh x' }), LIN('lg', 'X', [[1, -2.5]], { l: 'logit = w·x + c', wl: '[w | c]' }), EL('D', 'lg', 'sig', { l: 'D(x) = σ(logit)', dp: 3 }),
    CU('LD', 1, 4, (i, j, g) => { const d = g('D', 0, j), real = j < 2, v = real ? -Math.log(d) : -Math.log(1 - d); return [v, real ? `ảnh thật: −ln D = −ln ${fmt(d, 3)} = ${fmt(v, 3)}` : `ảnh giả: −ln(1 − D) = −ln ${fmt(1 - d, 3)} = ${fmt(v, 3)}`, [['D', 0, j]]]; }, { l: 'Loss của D từng ảnh', dp: 3 }),
    CU('LG', 1, 4, (i, j, g) => { if (j < 2) return [0, 'G không tính loss trên ảnh thật', []]; const d = g('D', 0, j), v = -Math.log(d); return [v, `−ln D(G(z)) = −ln ${fmt(d, 3)} = ${fmt(v, 3)}`, [['D', 0, j]]]; }, { l: 'Loss của G (non-saturating)', dp: 3 })] };

SW.ganvar = { t: 'Loss Pix2Pix = đối kháng + λ·L1', cols: ['px1', 'px2', 'px3'],
  steps: [G('Gx', [[0.6, 0.2, 0.9]], { l: 'Ảnh sinh G(x)' }), G('y', [[0.5, 0.1, 1]], { l: 'Ảnh thật y' }), BIN('d', 'Gx', '−', 'y', { l: 'Hiệu' }), EL('a', 'd', 'abs', { l: '|hiệu|' }), RED('l1', 'a', 'rowmean', { l: 'L1', cl: ['L1'] }),
    G('Dp', [[0.4, 0.6]], { l: 'PatchGAN chấm 2 mảnh ảnh sinh', cl: ['mảnh 1', 'mảnh 2'] }), EL('adv', 'Dp', 'neglog', { l: '−ln D', cl: ['mảnh 1', 'mảnh 2'], dp: 3 }), RED('am', 'adv', 'rowmean', { l: 'Loss đối kháng', cl: ['adv'], dp: 3 }),
    CU('tot', 1, 1, (i, j, g) => { const a = g('am', 0, 0), l = g('l1', 0, 0), v = a + 100 * l; return [v, `${fmt(a, 3)} + 100·${fmt(l, 3)} = ${fmt(v, 2)}`, [['am', 0, 0], ['l1', 0, 0]]]; }, { l: 'Tổng (λ = 100)', cl: ['L_G'] })] };

SW.diffwd = { t: 'Thêm nhiễu tới các bước t khác nhau (lịch 4 bước)', cols: ['t=1', 't=2', 't=3', 't=4'],
  steps: [G('b', [[0.1, 0.2, 0.3, 0.4]], { l: 'β_t' }), BIN('a', 1, '−', 'b', { l: 'α_t = 1 − β_t' }),
    CU('ab', 1, 4, (i, j, g) => { const p = j ? g('ab', 0, j - 1) : 1, v = p * g('a', 0, j); return [v, `${fmt(p, 3)}·${fmt(g('a', 0, j), 2)} = ${fmt(v, 3)}`, [['a', 0, j], ...(j ? [['ab', 0, j - 1]] : [])]]; }, { l: 'ᾱ_t = tích dồn', dp: 3 }),
    EL('sa', 'ab', 'sqrt', { l: '√ᾱ_t', dp: 3 }), CU('sb', 1, 4, (i, j, g) => { const v = Math.sqrt(1 - g('ab', 0, j)); return [v, `√(1 − ${fmt(g('ab', 0, j), 3)}) = ${fmt(v, 3)}`, [['ab', 0, j]]]; }, { l: '√(1 − ᾱ_t)', dp: 3 }),
    G('x0', [[1], [-0.5], [0.2]], { l: 'Ảnh x₀ (3 pixel)', cl: ['x₀'] }), G('ep', [[0.5], [1], [-1.2]], { l: 'Nhiễu ε', cl: ['ε'] }),
    CU('xt', 3, 4, (i, j, g) => { const s = g('sa', 0, j), n = g('sb', 0, j), x = g('x0', i, 0), e = g('ep', i, 0), v = s * x + n * e; return [v, `${fmt(s, 3)}·${x < 0 ? '(' + fmt(x) + ')' : fmt(x)} + ${fmt(n, 3)}·${e < 0 ? '(' + fmt(e) + ')' : fmt(e)} = ${fmt(v, 3)}`, [['sa', 0, j], ['sb', 0, j], ['x0', i, 0], ['ep', i, 0]]]; }, { l: 'x_t = √ᾱ·x₀ + √(1−ᾱ)·ε', dp: 3 })] };

SW.diffrev = { t: 'Khử nhiễu: ước lượng x̂₀ và đi một bước x_{t−1}', cols: ['px1', 'px2', 'px3'],
  steps: [G('xt', [[1.113, 0.4, -0.9]], { l: 'x_t (t = 2, ᾱ = 0.72)', dp: 3 }), G('eh', [[0.5, 0.9, -1]], { l: 'ε_θ mạng dự đoán' }),
    CU('x0', 1, 3, (i, j, g) => { const x = g('xt', 0, j), e = g('eh', 0, j), v = (x - 0.529 * e) / 0.849; return [v, `(${fmt(x, 3)} − 0.529·${e < 0 ? '(' + fmt(e) + ')' : fmt(e)}) / 0.849 = ${fmt(v, 3)}`, [['xt', 0, j], ['eh', 0, j]]]; }, { l: 'x̂₀ = (x_t − √(1−ᾱ)·ε_θ) / √ᾱ', dp: 3 }),
    CU('mu', 1, 3, (i, j, g) => { const x = g('xt', 0, j), e = g('eh', 0, j), v = 1.118 * (x - 0.378 * e); return [v, `1.118·(${fmt(x, 3)} − 0.378·${e < 0 ? '(' + fmt(e) + ')' : fmt(e)}) = ${fmt(v, 3)}`, [['xt', 0, j], ['eh', 0, j]]]; }, { l: 'μ = (x_t − β/√(1−ᾱ)·ε_θ) / √α', dp: 3 }),
    G('zn', [[0.3, -0.5, 0.1]], { l: 'Nhiễu mới z' }),
    CU('xp', 1, 3, (i, j, g) => { const m = g('mu', 0, j), z = g('zn', 0, j), v = m + 0.267 * z; return [v, `${fmt(m, 3)} + 0.267·${z < 0 ? '(' + fmt(z) + ')' : fmt(z)} = ${fmt(v, 3)}`, [['mu', 0, j], ['zn', 0, j]]]; }, { l: 'x_{t−1} = μ + σ·z (σ = 0.267)', dp: 3 })] };

SW.diffadv = { t: 'Classifier-free guidance với các hệ số w', cols: ['w=0', 'w=1', 'w=3', 'w=7.5'],
  steps: [G('w', [[0, 1, 3, 7.5]], { l: 'Hệ số w' }), G('eu', [[0.2], [0.6]], { l: 'ε không điều kiện', cl: ['ε_u'] }), G('ec', [[0.5], [0.8]], { l: 'ε có điều kiện', cl: ['ε_c'] }),
    BIN('df', 'ec', '−', 'eu', { l: 'Δ = ε_c − ε_u', cl: ['Δ'] }), BIN('sc', 'df', '×', 'w', { l: 'w·Δ' }), BIN('et', 'sc', '+', 'eu', { l: 'ε̃ = ε_u + w·Δ', n: 'w = 0: bỏ điều kiện. w = 1: có điều kiện thường. w > 1: phóng đại.' })] };

SW.contrastive = { t: 'Ma trận tương đồng và InfoNCE (τ = 0.1)', cols: ['ảnh xước', 'ảnh đứt', 'ảnh tốt'],
  steps: [G('S', [[0.8, 0.2, 0.1], [0.3, 0.7, 0.5], [0.1, 0.4, 0.6]], { l: 'Cosine câu × ảnh', rl: ['“xước”', '“đứt”', '“tốt”'] }), BIN('Lg', 'S', '÷', 0.1, { l: 'Chia τ', rl: ['“xước”', '“đứt”', '“tốt”'] }), EL('E', 'Lg', 'exp', { l: 'e^(·)', rl: ['“xước”', '“đứt”', '“tốt”'], dp: 1 }), RED('Z', 'E', 'colsum', { l: 'Tổng mỗi cột', dp: 1 }), BIN('P', 'E', '÷', 'Z', { l: 'Softmax theo cột', rl: ['“xước”', '“đứt”', '“tốt”'], dp: 4 }),
    CU('loss', 1, 3, (i, j, g) => { const p = g('P', j, j), v = -Math.log(p); return [v, `−ln p(câu đúng) = −ln ${fmt(p, 4)} = ${fmt(v, 4)}`, [['P', j, j]]]; }, { l: 'Loss mỗi ảnh', dp: 4 })] };

SW.llm = { t: 'Xác suất từ tiếp theo với các nhiệt độ T', cols: ['T=0.5', 'T=1', 'T=2'],
  steps: [G('z', [[2.2], [1.6], [1.1], [0.4]], { l: 'Logits', rl: ['lỗi', 'mạch', 'xước', 'đồng'], cl: ['z'] }), G('T', [[0.5, 1, 2]], { l: 'Nhiệt độ T' }),
    BIN('zt', 'z', '÷', 'T', { l: 'z / T', rl: ['lỗi', 'mạch', 'xước', 'đồng'] }), EL('e', 'zt', 'exp', { l: 'e^(·)', rl: ['lỗi', 'mạch', 'xước', 'đồng'] }), RED('s', 'e', 'colsum', { l: 'Tổng' }), BIN('p', 'e', '÷', 's', { l: 'Xác suất', rl: ['lỗi', 'mạch', 'xước', 'đồng'], dp: 3 })] };

SW.lora = { t: 'LoRA hạng 1: ΔW = B·A rồi dùng W₀ + ΔW', cols: ['c1', 'c2', 'c3'],
  steps: [MM('dW', [[1], [0], [2]], [[0.5, 0, -0.5]], { l: 'ΔW = B·A (6 tham số học)', al: 'B (3×1)', bl: 'A (1×3)' }), BIN('W', 'dW', '+', [[1, 0, 0], [0, 1, 0], [0, 0, 1]], { l: 'W = W₀ + ΔW', bl: 'W₀ = I' }), MM('y', 'W', [[2], [1], [1]], { l: 'y = W·x', bl: 'x', cl: ['y'] })] };

SW.moe = { t: 'Router chọn 2 trong 4 chuyên gia', cols: ['token'],
  steps: [G('x', [[1], [-0.5]], { l: 'Token x' }), LIN('lg', 'x', [[0.2, 0.1], [1, -1], [0.6, 0.3], [-0.5, 0.8]], { l: 'Logit router = W_r·x', wl: 'W_r', rl: ['E1', 'E2', 'E3', 'E4'] }), EL('e', 'lg', 'exp', { l: 'e^(·)', rl: ['E1', 'E2', 'E3', 'E4'] }), RED('s', 'e', 'colsum', { l: 'Tổng' }), BIN('g', 'e', '÷', 's', { l: 'Xác suất router', rl: ['E1', 'E2', 'E3', 'E4'], dp: 3 }),
    CU('k', 4, 1, (i, j, g) => { const v = _r(4).map(t => g('g', t, 0)), top = _r(4).sort((a, b) => v[b] - v[a]).slice(0, 2), Z = v[top[0]] + v[top[1]], w = top.includes(i) ? v[i] / Z : 0; return [w, top.includes(i) ? `trong top-2: ${fmt(v[i], 3)} / ${fmt(Z, 3)} = ${fmt(w, 3)}` : 'không nằm trong top-2 → 0', top.map(t => ['g', t, 0])]; }, { l: 'Trọng số top-2', rl: ['E1', 'E2', 'E3', 'E4'], dp: 3 }),
    G('Eo', [[3], [1], [-2], [5]], { l: 'Đầu ra từng chuyên gia', rl: ['E1', 'E2', 'E3', 'E4'] }), BIN('c', 'k', '×', 'Eo', { l: 'Trọng số × đầu ra', rl: ['E1', 'E2', 'E3', 'E4'], dp: 3 }), RED('y', 'c', 'colsum', { l: 'y = tổng', dp: 3 })] };

SW.ssm = { t: 'SSM: hồi quy và tích chập cho cùng kết quả', cols: ['t=1', 't=2', 't=3', 't=4'],
  steps: [G('x', [[1, 2, 0, 1]], { l: 'Đầu vào x' }),
    CU('h', 2, 4, (i, j, g) => { const hp = j ? g('h', 0, j - 1) : 0; if (i === 0) { const v = 0.5 * hp + g('x', 0, j); return [v, `h = 0.5·${fmt(hp, 3)} + ${fmt(g('x', 0, j))} = ${fmt(v, 3)}`, [['x', 0, j], ...(j ? [['h', 0, j - 1]] : [])]]; } const v = 2 * g('h', 0, j); return [v, `y = 2·${fmt(g('h', 0, j), 3)} = ${fmt(v, 3)}`, [['h', 0, j]]]; }, { l: 'Hồi quy (Ā = 0.5, B̄ = 1, C = 2)', rl: ['h_t', 'y_t'], order: 'col', dp: 3 }),
    CU('K', 1, 4, (i, j) => { const v = 2 * Math.pow(0.5, j); return [v, `C·Ā^${j}·B̄ = 2·${fmt(Math.pow(0.5, j), 3)} = ${fmt(v, 3)}`, []]; }, { l: 'Kernel K̄', dp: 3 }),
    CU('yc', 1, 4, (i, j, g) => { let v = 0; const parts = [], hl = []; for (let k = 0; k <= j; k++) { v += g('K', 0, k) * g('x', 0, j - k); parts.push(`${fmt(g('K', 0, k), 3)}·${fmt(g('x', 0, j - k))}`); hl.push(['K', 0, k], ['x', 0, j - k]); } return [v, parts.join(' + ') + ' = ' + fmt(v, 3), hl]; }, { l: 'Tích chập y = K̄ ∗ x', dp: 3, n: 'Trùng với hàng y_t ở trên.' })] };

SW.gnn = { t: 'Một lớp GCN trên 4 linh kiện nối thành chuỗi', cols: ['IC', 'R1', 'R2', 'LED'],
  steps: [G('X', [[4, 0, 2, 6]], { l: 'Đặc trưng nút' }), G('A', [[0.5, 1 / 3, 0, 0], [0.5, 1 / 3, 1 / 3, 0], [0, 1 / 3, 1 / 3, 0.5], [0, 0, 1 / 3, 0.5]], { l: 'Â chuẩn hóa (cột j: trọng số trung bình hàng xóm của nút j)', rl: ['IC', 'R1', 'R2', 'LED'] }),
    MM('Mg', 'X', 'A', { l: 'Gom hàng xóm: X·Â', dp: 3 }), BIN('H', 'Mg', '×', 0.5, { l: '× W (= 0.5)', dp: 3 }), EL('Hr', 'H', 'relu', { l: 'ReLU', dp: 3 })] };

SW.rl = { t: '5 lần cập nhật Q-learning trên hành lang', cols: ['lượt 1', 'lượt 2', 'lượt 3', 'lượt 4', 'lượt 5'],
  steps: [G('ev', [[2, 1, 0, 2, 1], [1, 1, 1, 1, 0], [10, -1, -1, 10, -1]], { l: 'Trải nghiệm', rl: ['ô s', 'phải? (1/0)', 'thưởng r'] }),
    CU('Q', 4, 5, (i, j, g) => { const E = [[2, '→', 10, null], [1, '→', -1, 2], [0, '→', -1, 1], [2, '→', 10, null], [1, '←', -1, 0]][j], row = { '0→': 0, '1→': 1, '2→': 2, '1←': 3 }[E[0] + E[1]], prev = k => (j ? g('Q', k, j - 1) : 0);
      if (i !== row) return [prev(i), `không đổi: ${fmt(prev(i), 3)}`, j ? [['Q', i, j - 1]] : []];
      const mx = E[3] === null ? 0 : E[3] === 2 ? prev(2) : E[3] === 1 ? Math.max(prev(1), prev(3)) : prev(0), old = prev(i), tg = E[2] + 0.9 * mx, v = old + 0.5 * (tg - old);
      return [v, `mục tiêu = ${E[2]} + 0.9·${fmt(mx, 3)} = ${fmt(tg, 3)}; Q = ${fmt(old, 3)} + 0.5·(${fmt(tg, 3)} − ${fmt(old, 3)}) = ${fmt(v, 3)}`, [...(j ? [['Q', i, j - 1]] : []), ['ev', 0, j], ['ev', 2, j]]]; }, { l: 'Bảng Q (α = 0.5, γ = 0.9)', rl: ['Q(0, →)', 'Q(1, →)', 'Q(2, →)', 'Q(1, ←)'], order: 'col', dp: 3 })] };

SW.rag = { t: 'Truy hồi: cosine giữa câu hỏi và 3 đoạn tài liệu', cols: ['đoạn 1', 'đoạn 2', 'đoạn 3'],
  steps: [G('D', [[0.8, 0.1, 0.6], [0.2, 0.9, 0.1], [0.5, 0.2, 0.7]], { l: 'Vector đoạn tài liệu', rl: ['lỗi', 'thiết bị', 'kích thước'] }),
    MM('dp', [[0.9, 0.1, 0.4]], 'D', { l: 'q·d', al: 'qᵀ', dp: 3 }), EL('D2', 'D', 'sq', { l: 'd²', dp: 3 }), RED('n2', 'D2', 'colsum', { l: '‖d‖²', dp: 3 }), EL('n', 'n2', 'sqrt', { l: '‖d‖', dp: 3 }),
    CU('cos', 1, 3, (i, j, g) => { const v = g('dp', 0, j) / (0.99 * g('n', 0, j)); return [v, `${fmt(g('dp', 0, j), 3)} / (0.990·${fmt(g('n', 0, j), 3)}) = ${fmt(v, 3)}`, [['dp', 0, j], ['n', 0, j]]]; }, { l: 'cos = q·d / (‖q‖·‖d‖), ‖q‖ = 0.990', dp: 3, n: 'Lấy top-2: đoạn 1 và đoạn 3.' })] };

SW.anomaly = { t: 'PatchCore: khoảng cách tới ngân hàng mảnh tốt', cols: ['p₁', 'p₂', 'p₃'],
  steps: [G('T', [[1.1, 4.8, 3], [1, 5.1, 3]], { l: 'Mảnh của ảnh mới', rl: ['f1', 'f2'] }), G('Mb', [[1, 1, 2, 5], [1, 2, 1, 5]], { l: 'Ngân hàng bộ nhớ (ảnh tốt)', rl: ['f1', 'f2'], cl: ['m1', 'm2', 'm3', 'm4'] }),
    CU('D', 4, 3, (i, j, g) => { const a = g('Mb', 0, i) - g('T', 0, j), b = g('Mb', 1, i) - g('T', 1, j), v = Math.hypot(a, b); return [v, `√(${fmt(a, 2)}² + ${fmt(b, 2)}²) = ${fmt(v, 3)}`, [['Mb', 0, i], ['Mb', 1, i], ['T', 0, j], ['T', 1, j]]]; }, { l: 'Khoảng cách m_i ↔ p_j', rl: ['m1', 'm2', 'm3', 'm4'], order: 'col', dp: 3 }),
    RED('s', 'D', 'colmin', { l: 'Điểm bất thường = khoảng cách gần nhất', dp: 3 }),
    CU('img', 1, 1, (i, j, g) => { const v = Math.max(g('s', 0, 0), g('s', 0, 1), g('s', 0, 2)); return [v, `max(${_r(3).map(k => fmt(g('s', 0, k), 3)).join(', ')}) = ${fmt(v, 3)} ${v > 1 ? '> 1 → NG' : '≤ 1 → OK'}`, _r(3).map(k => ['s', 0, k])]; }, { l: 'Điểm cả ảnh (ngưỡng 1.0)', cl: ['ảnh'], dp: 3 })] };

SW.search = { t: 'A*: bảng f = g + h trên đường đi tối ưu', cols: ['A', 'B (qua A)', 'C (qua B)', 'G (qua C)'],
  steps: [G('c', [[2, 2, 2, 1]], { l: 'Chi phí cạnh vừa đi' }), CU('g', 1, 4, (i, j, gg) => { const p = j ? gg('g', 0, j - 1) : 0, v = p + gg('c', 0, j); return [v, `${p} + ${gg('c', 0, j)} = ${v}`, [['c', 0, j], ...(j ? [['g', 0, j - 1]] : [])]]; }, { l: 'g = chi phí đã đi' }), G('h', [[5, 3, 1, 0]], { l: 'h = ước lượng còn lại' }), BIN('f', 'g', '+', 'h', { l: 'f = g + h', n: 'f không đổi (= 7) dọc đường tối ưu khi h chính xác.' })] };

SW.games = { t: 'Minimax trên cây 3 nước đi', cols: ['nước A', 'nước B', 'nước C'],
  steps: [G('Lf', [[3, 2, 14], [12, 4, 5], [8, 6, 2]], { l: 'Lá (mỗi cột là một nước của MAX)' }), RED('mn', 'Lf', 'colmin', { l: 'MIN chọn nhỏ nhất' }),
    CU('mx', 1, 1, (i, j, g) => { const v = _r(3).map(k => g('mn', 0, k)), m = Math.max(...v); return [m, `max(${v.join(', ')}) = ${m} → chọn nước ${'ABC'[v.indexOf(m)]}`, _r(3).map(k => ['mn', 0, k])]; }, { l: 'MAX chọn lớn nhất', cl: ['gốc'] })] };

SW.logic = { t: 'Cổng logic bằng nơ-ron ngưỡng và bảng chân trị', cols: ['(0,0)', '(0,1)', '(1,0)', '(1,1)'],
  steps: [G('X', [[0, 0, 1, 1], [0, 1, 0, 1]], { l: 'Giá trị A, B', rl: ['A', 'B'] }), LIN('z', 'X', [[1, 1, -1.5], [1, 1, -0.5]], { l: 'z = w·x + b', wl: '[w | b]', rl: ['AND', 'OR'] }),
    EL('o', 'z', { f: x => (x > 0 ? 1 : 0), t: (x, v) => `${fmt(x, 2)} ${x > 0 ? '>' : '≤'} 0 → ${v}` }, { l: 'Ngưỡng → đúng (1) / sai (0)', rl: ['AND', 'OR'] }),
    CU('imp', 1, 4, (i, j, g) => { const a = g('X', 0, j), b = g('X', 1, j), v = !a || b ? 1 : 0; return [v, `A ⇒ B = (không A) hoặc B = ${v}`, [['X', 0, j], ['X', 1, j]]]; }, { l: 'Luật A ⇒ B' })] };

SW.bayesnet = { t: 'Liệt kê: mưa hay vòi tưới?', cols: ['M, V', 'M, ¬V', '¬M, V', '¬M, ¬V'],
  steps: [G('pm', [[0.2, 0.2, 0.8, 0.8]], { l: 'P(Mưa = ·)' }), G('pv', [[0.3, 0.7, 0.3, 0.7]], { l: 'P(Vòi = ·)' }), G('pw', [[0.99, 0.9, 0.8, 0.05]], { l: 'P(Ướt | M, V)' }),
    BIN('a', 'pm', '×', 'pv', { l: 'P(M)·P(V)', dp: 3 }), BIN('j', 'a', '×', 'pw', { l: '× P(Ướt | M, V)', dp: 4 }), RED('z', 'j', 'rowsum', { l: 'P(Ướt)', cl: ['P(Ướt)'], dp: 4 }), BIN('post', 'j', '÷', 'z', { l: 'P(trường hợp | Ướt)', dp: 3 }),
    CU('ans', 2, 1, (i, j, g) => { if (i === 0) { const v = g('post', 0, 0) + g('post', 0, 1); return [v, `P(Mưa | Ướt) = ${fmt(g('post', 0, 0), 3)} + ${fmt(g('post', 0, 1), 3)} = ${fmt(v, 3)}`, [['post', 0, 0], ['post', 0, 1]]]; } const v = g('post', 0, 0) + g('post', 0, 2); return [v, `P(Vòi | Ướt) = ${fmt(g('post', 0, 0), 3)} + ${fmt(g('post', 0, 2), 3)} = ${fmt(v, 3)}`, [['post', 0, 0], ['post', 0, 2]]]; }, { l: 'Cộng các trường hợp', rl: ['P(Mưa | Ướt)', 'P(Vòi | Ướt)'], cl: ['xác suất'], dp: 3 })] };

SW.hmm = { t: 'Bộ lọc Kalman 4 bước (Q = 1, R = 5, u = 5)', cols: ['t=1', 't=2', 't=3', 't=4'],
  steps: [G('z', [[16, 19, 26, 31]], { l: 'Số đo cảm biến z' }),
    CU('k', 5, 4, (i, j, g) => { const mu0 = j ? g('k', 3, j - 1) : 10, P0 = j ? g('k', 4, j - 1) : 4;
      if (i === 0) return [mu0 + 5, `μ⁻ = ${fmt(mu0, 2)} + 5 = ${fmt(mu0 + 5, 2)}`, j ? [['k', 3, j - 1]] : []];
      if (i === 1) return [P0 + 1, `P⁻ = ${fmt(P0, 3)} + 1 = ${fmt(P0 + 1, 3)}`, j ? [['k', 4, j - 1]] : []];
      if (i === 2) { const pp = g('k', 1, j), v = pp / (pp + 5); return [v, `K = ${fmt(pp, 3)} / (${fmt(pp, 3)} + 5) = ${fmt(v, 3)}`, [['k', 1, j]]]; }
      if (i === 3) { const m = g('k', 0, j), K = g('k', 2, j), zz = g('z', 0, j), v = m + K * (zz - m); return [v, `μ = ${fmt(m, 2)} + ${fmt(K, 3)}·(${zz} − ${fmt(m, 2)}) = ${fmt(v, 2)}`, [['k', 0, j], ['k', 2, j], ['z', 0, j]]]; }
      const v = (1 - g('k', 2, j)) * g('k', 1, j); return [v, `P = (1 − ${fmt(g('k', 2, j), 3)})·${fmt(g('k', 1, j), 3)} = ${fmt(v, 3)}`, [['k', 2, j], ['k', 1, j]]]; }, { l: 'Dự đoán → hiệu chỉnh (μ₀ = 10, P₀ = 4)', rl: ['μ⁻', 'P⁻', 'K', 'μ', 'P'], order: 'col', dp: 3 })] };

SW.evo = { t: 'Chọn lọc roulette trong giải thuật di truyền', cols: ['A', 'B', 'C', 'D'],
  steps: [G('fit', [[3, 4, 2, 1]], { l: 'Fitness (số bit 1)' }), RED('t', 'fit', 'rowsum', { l: 'Tổng', cl: ['tổng'] }), BIN('p', 'fit', '÷', 't', { l: 'Xác suất được chọn' }),
    CU('cum', 1, 4, (i, j, g) => { const p = j ? g('cum', 0, j - 1) : 0, v = p + g('p', 0, j); return [v, `${fmt(p, 2)} + ${fmt(g('p', 0, j), 2)} = ${fmt(v, 2)}`, [['p', 0, j], ...(j ? [['cum', 0, j - 1]] : [])]]; }, { l: 'Cộng dồn (vạch trên bánh xe)' }),
    CU('pick', 1, 4, (i, j, g) => { const r = [0.55, 0.2, 0.9, 0.65][j]; let k = 0; while (g('cum', 0, k) < r - 1e-9) k++; return [k + 1, `số ngẫu nhiên ${r} rơi vào ô ${'ABCD'[k]} (≤ ${fmt(g('cum', 0, k), 2)}) → cá thể số ${k + 1}`, [['cum', 0, k]]]; }, { l: 'Bốc 4 lần làm cha mẹ', cl: ['lần 1', 'lần 2', 'lần 3', 'lần 4'], n: '1 = A, 2 = B, 3 = C, 4 = D. Cá thể yếu D không được chọn.' })] };

SW.xai = { t: 'Grad-CAM trên feature map 2 kênh', cols: ['vị trí 1', 'vị trí 2', 'vị trí 3', 'vị trí 4'],
  steps: [G('A', [[2, 0, 0, 1], [1, 1, 1, 1]], { l: 'Feature map', rl: ['kênh 1', 'kênh 2'] }), G('al', [[0.5], [-0.2]], { l: 'α = gradient trung bình mỗi kênh', rl: ['kênh 1', 'kênh 2'], cl: ['α'] }),
    BIN('wA', 'A', '×', 'al', { l: 'α_k·A_k', rl: ['kênh 1', 'kênh 2'] }), RED('s', 'wA', 'colsum', { l: 'Cộng các kênh' }), EL('cam', 's', 'relu', { l: 'Grad-CAM = ReLU(·)', n: 'Chỉ vị trí 1 và 4 “sáng”.' })] };

SW.deploy = { t: 'Lượng tử hóa INT8 đối xứng', cols: ['w1', 'w2', 'w3', 'w4', 'w5'],
  steps: [G('w', [[0.5, -1.27, 0.034, 0.88, -0.2]], { l: 'Trọng số FP32', dp: 3 }),
    CU('s', 1, 1, (i, j, g) => { const m = Math.max(..._r(5).map(k => Math.abs(g('w', 0, k)))); return [m / 127, `max|w| / 127 = ${fmt(m, 3)} / 127 = ${fmt(m / 127, 4)}`, _r(5).map(k => ['w', 0, k])]; }, { l: 'Scale s', cl: ['s'], dp: 4 }),
    BIN('ws', 'w', '÷', 's', { l: 'w / s', dp: 2 }), EL('q', 'ws', 'round', { l: 'q = round(w / s): số nguyên 8-bit', dp: 0 }), BIN('wh', 'q', '×', 's', { l: 'ŵ = s·q', dp: 4 }), BIN('er', 'w', '−', 'wh', { l: 'Sai số w − ŵ', dp: 4 })] };

SW.ethics = { t: 'Recall và FPR theo từng dây chuyền', cols: ['dây chuyền A', 'dây chuyền B'],
  steps: [G('c', [[95, 70], [5, 30], [45, 18], [855, 882]], { l: 'Đếm (100 bo lỗi, 900 bo tốt mỗi dây chuyền)', rl: ['TP', 'FN', 'FP', 'TN'] }),
    CU('m', 3, 2, (i, j, g) => { const tp = g('c', 0, j), fn = g('c', 1, j), fp = g('c', 2, j), tn = g('c', 3, j);
      if (i === 0) return [tp / (tp + fn), `Recall = ${tp}/(${tp} + ${fn}) = ${fmt(tp / (tp + fn), 3)}`, [['c', 0, j], ['c', 1, j]]];
      if (i === 1) return [fp / (fp + tn), `FPR = ${fp}/(${fp} + ${tn}) = ${fmt(fp / (fp + tn), 3)}`, [['c', 2, j], ['c', 3, j]]];
      return [(tp + fp) / 1000, `(${tp} + ${fp}) / 1000 = ${fmt((tp + fp) / 1000, 3)}`, [['c', 0, j], ['c', 2, j]]]; }, { l: 'Chỉ số', rl: ['Recall', 'FPR', 'Tỷ lệ gọi NG'], dp: 3 }),
    CU('gap', 1, 1, (i, j, g) => { const v = g('m', 0, 0) - g('m', 0, 1); return [v, `${fmt(g('m', 0, 0), 3)} − ${fmt(g('m', 0, 1), 3)} = ${fmt(v, 3)}`, [['m', 0, 0], ['m', 0, 1]]]; }, { l: 'Chênh lệch recall', cl: ['A − B'], dp: 3 })] };

SW.speech = { t: 'DFT 4 điểm bằng phép nhân ma trận', cols: ['x'],
  steps: [G('x', [[1], [0], [-1], [0]], { l: 'Tín hiệu x (4 mẫu)', cl: ['x'] }),
    MM('re', [[1, 1, 1, 1], [1, 0, -1, 0], [1, -1, 1, -1], [1, 0, -1, 0]], 'x', { l: 'Phần thực = cos(2πkn/4)·x', al: 'cos', rl: ['k=0', 'k=1', 'k=2', 'k=3'], cl: ['Re'] }),
    MM('im', [[0, 0, 0, 0], [0, -1, 0, 1], [0, 0, 0, 0], [0, 1, 0, -1]], 'x', { l: 'Phần ảo = −sin(2πkn/4)·x', al: '−sin', rl: ['k=0', 'k=1', 'k=2', 'k=3'], cl: ['Im'] }),
    CU('mag', 4, 1, (i, j, g) => { const a = g('re', i, 0), b = g('im', i, 0), v = Math.hypot(a, b); return [v, `√(${fmt(a)}² + ${fmt(b)}²) = ${fmt(v, 2)}`, [['re', i, 0], ['im', i, 0]]]; }, { l: '|X_k|', rl: ['k=0', 'k=1', 'k=2', 'k=3'], cl: ['|X|'], n: 'Năng lượng chỉ ở k = 1 (và ảnh gương k = 3).' })] };

SW.vision3d = { t: 'Kết xuất một tia NeRF với 3 mẫu', cols: ['mẫu 1', 'mẫu 2', 'mẫu 3'],
  steps: [G('sg', [[0.1, 2, 5]], { l: 'Mật độ σ' }), G('c', [[0.2, 0.9, 0.5]], { l: 'Màu c (thang xám)' }),
    EL('al', 'sg', { f: x => 1 - Math.exp(-x), t: (x, v) => `1 − e^(−${fmt(x, 2)}) = ${fmt(v, 3)}` }, { l: 'α = 1 − e^(−σδ), δ = 1', dp: 3 }),
    CU('T', 1, 3, (i, j, g) => { const p = j ? g('T', 0, j - 1) * (1 - g('al', 0, j - 1)) : 1; return [p, j ? `${fmt(g('T', 0, j - 1), 3)}·(1 − ${fmt(g('al', 0, j - 1), 3)}) = ${fmt(p, 3)}` : 'T₁ = 1 (chưa bị che)', j ? [['T', 0, j - 1], ['al', 0, j - 1]] : []]; }, { l: 'T = ánh sáng còn lọt tới', dp: 3 }),
    BIN('w', 'T', '×', 'al', { l: 'w = T·α', dp: 3 }), BIN('wc', 'w', '×', 'c', { l: 'w·c', dp: 3 }), RED('C', 'wc', 'rowsum', { l: 'Màu pixel = Σ w·c', cl: ['màu'], dp: 3 })] };

SW.vitfam = { t: 'Chi phí attention: ViT, MAE, toàn cục và Swin', cols: ['ViT 196 token', 'MAE: 49 token', '56×56 toàn cục', 'Swin: 64 cửa sổ'],
  steps: [G('n', [[196, 49, 3136, 49]], { l: 'Số token mỗi nhóm attention', dp: 0 }), G('gp', [[1, 1, 1, 64]], { l: 'Số nhóm', dp: 0 }), EL('n2', 'n', 'sq', { l: 'Số cặp mỗi nhóm = n²', dp: 0 }), BIN('tot', 'n2', '×', 'gp', { l: 'Tổng số cặp', dp: 0 }),
    CU('ratio', 1, 4, (i, j, g) => { const base = j < 2 ? 0 : 2, v = g('tot', 0, base) / g('tot', 0, j); return [v, j === base ? 'mốc so sánh = 1' : `${g('tot', 0, base)} / ${g('tot', 0, j)} = ${fmt(v, 1)} lần rẻ hơn`, [['tot', 0, base], ['tot', 0, j]]]; }, { l: 'Rẻ hơn bao nhiêu lần', dp: 1, n: 'MAE so với ViT đầy đủ; Swin so với attention toàn cục.' })] };

SW.planning = { t: 'Kiểm tra ràng buộc lịch thi (CSP)', cols: ['thử 1', 'thử 2', 'thử 3'],
  steps: [G('as', [[1, 2, 2], [1, 3, 3], [2, 1, 1], [3, 2, 1]], { l: 'Ca thi được gán', rl: ['Toán', 'Lý', 'Hóa', 'Sinh'] }),
    CU('vi', 4, 3, (i, j, g) => { const P = [[0, 1, 'T–L'], [0, 2, 'T–H'], [1, 2, 'L–H'], [2, 3, 'H–S']][i], a = g('as', P[0], j), b = g('as', P[1], j), v = a === b ? 1 : 0; return [v, `${P[2]}: ca ${a} ${a === b ? '=' : '≠'} ca ${b} → ${v ? 'vi phạm' : 'ổn'}`, [['as', P[0], j], ['as', P[1], j]]]; }, { l: 'Vi phạm từng ràng buộc (1 = trùng ca)', rl: ['T–L', 'T–H', 'L–H', 'H–S'] }),
    RED('nv', 'vi', 'colsum', { l: 'Số vi phạm', n: 'Phương án nào bằng 0 là lời giải hợp lệ.' })] };
