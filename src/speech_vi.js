/* ================= CHUẨN HÓA LỜI ĐỌC TIẾNG VIỆT =================
   Biến câu có thuật ngữ tiếng Anh, chữ viết tắt, ký hiệu toán thành câu đọc trôi chảy bằng tiếng Việt.
   Phụ đề vẫn hiện chữ gốc; chỉ phần đưa vào giọng đọc (mô hình TTS hoặc giọng trình duyệt) đi qua hàm này.
   Muốn sửa cách đọc một từ: thêm hoặc sửa một dòng trong SPEAK_WORDS (khóa phân biệt hoa thường). */
const SPEAK_WORDS = {
  // tên mô hình, kiến trúc
  'ViT': 'vít', 'ViTs': 'vít', 'ViTDet': 'vít đét', 'DeiT': 'đây ít', 'Swin': 'xuy in', 'ResNet': 'rét nét', 'ResNet-50': 'rét nét năm mươi', 'ConvNeXt': 'con nếch', 'EfficientNet': 'i phi xần nét', 'MobileNet': 'mô bai nét',
  'AlexNet': 'a léc nét', 'LeNet': 'lơ nét', 'VGG': 'vi gi gi', 'Inception': 'in xép sần', 'U-Net': 'diu nét', 'UNet': 'diu nét', 'YOLO': 'dô lô', 'YOLOS': 'dô lốt', 'YOLO-World': 'dô lô quơ', 'DETR': 'đi tơ', 'RT-DETR': 'a ti đi tơ', 'RF-DETR': 'a ép đi tơ',
  'DINO': 'đi nô', 'DINOv2': 'đi nô vê hai', 'DINOv3': 'đi nô vê ba', 'SAM': 'sam', 'CLIP': 'clíp', 'SigLIP': 'xích líp', 'LLaVA': 'la va', 'Flamingo': 'phla minh gô', 'Florence-2': 'phlo rần hai', 'Qwen': 'quen', 'Llama': 'la ma', 'Mixtral': 'mít tran', 'Mistral': 'mít tran',
  'DeepSeek': 'đíp xích', 'Gemini': 'ghe mi nai', 'Claude': 'clốt', 'GPT': 'gi pi ti', 'ChatGPT': 'chát gi pi ti', 'BERT': 'bớt', 'T5': 'ti năm', 'Whisper': 'quýt pơ', 'Mamba': 'mam ba', 'Chronos': 'crô nốt', 'TimesFM': 'tham ép em', 'Moirai': 'moi rai', 'PatchTST': 'pát ti ét ti',
  'GraphCast': 'gráp cát', 'AlphaFold': 'an pha phôn', 'AlphaGo': 'an pha gô', 'AlphaZero': 'an pha di rô', 'StyleGAN': 'xờ tai gan', 'CycleGAN': 'xai cồ gan', 'GAN': 'gan', 'GANs': 'gan', 'VAE': 'vi ây i', 'DiT': 'đít', 'MMDiT': 'em em đít', 'FLUX': 'phlắc', 'Sora': 'xô ra', 'Veo': 'vê ô', 'Wan': 'oan', 'NeRF': 'nơ phờ',
  'Stable Diffusion': 'xờ tây bồ đi phiu giần', 'Diffusion': 'đi phiu giần', 'diffusion': 'đi phiu giần', 'Transformer': 'trans phóc mơ', 'Transformers': 'trans phóc mơ', 'transformer': 'trans phóc mơ', 'Grad-CAM': 'grát cam', 'SHAP': 'sáp', 'PatchCore': 'pát co', 'Depth Anything': 'đép ờ nhi thinh',
  'Grounding DINO': 'grao đinh đi nô', 'Segment Anything': 'xéc mần ờ nhi thinh', 'Ultralytics': 'un tra li tích', 'Roboflow': 'rô bô phlâu', 'PyTorch': 'pai torch', 'NumPy': 'nam pai', 'ONNX': 'o nít', 'TensorRT': 'ten xơ a ti', 'CoreML': 'co em eo', 'OpenAI': 'âu pần ây ai', 'Meta': 'mê ta', 'Google': 'gu gồ', 'Anthropic': 'an thờ rô pích', 'NVIDIA': 'en vi đi a',
  // thuật ngữ
  'attention': 'ờ ten sần', 'Attention': 'ờ ten sần', 'self-attention': 'xeo ờ ten sần', 'Self-attention': 'xeo ờ ten sần', 'cross-attention': 'cờ rốt ờ ten sần', 'Cross-attention': 'cờ rốt ờ ten sần', 'multi-head': 'mun ti hét', 'Multi-head': 'mun ti hét',
  'token': 'tô ken', 'tokens': 'tô ken', 'Token': 'tô ken', 'embedding': 'em be đinh', 'Embedding': 'em be đinh', 'softmax': 'sóp mác', 'Softmax': 'sóp mác', 'sigmoid': 'xích moi', 'tanh': 'tan hát', 'ReLU': 'rê lu', 'GELU': 'ghê lu', 'SwiGLU': 'xuy glu', 'dropout': 'đróp ao',
  'backbone': 'béc bôn', 'Backbone': 'béc bôn', 'neck': 'néc', 'head': 'hét', 'Neck': 'néc', 'Head': 'hét', 'encoder': 'en côu đơ', 'Encoder': 'en côu đơ', 'decoder': 'đi côu đơ', 'Decoder': 'đi côu đơ', 'projector': 'prô giéc tơ', 'Projector': 'prô giéc tơ', 'patch': 'pát', 'patches': 'pát',
  'batch': 'bát', 'Batch': 'bát', 'BatchNorm': 'bát noóc', 'LayerNorm': 'lây ơ noóc', 'RMSNorm': 'a em ét noóc', 'Adam': 'a đam', 'AdamW': 'a đam đắp bờ liu', 'Momentum': 'mô men tâm', 'momentum': 'mô men tâm', 'gradient': 'gra đi ần', 'Gradient': 'gra đi ần', 'logit': 'lô git', 'logits': 'lô git',
  'pooling': 'pu linh', 'padding': 'pát đinh', 'stride': 'xờ trai', 'kernel': 'kơ nồ', 'filter': 'phin tơ', 'feature': 'phi chờ', 'features': 'phi chờ', 'feature map': 'phi chờ mép', 'pixel': 'pích xeo', 'pixels': 'pích xeo', 'mask': 'mát', 'anchor': 'en cơ', 'prompt': 'prôm', 'zero-shot': 'di rô sót', 'few-shot': 'phiu sót',
  'fine-tune': 'phai tun', 'fine-tuning': 'phai tun ninh', 'pretrain': 'pri trên', 'benchmark': 'ben mác', 'dataset': 'đây ta xét', 'overfitting': 'âu vơ phít tinh', 'underfitting': 'ăn đơ phít tinh', 'precision': 'pri xi giần', 'recall': 'ri con', 'Precision': 'pri xi giần', 'Recall': 'ri con',
  'loss': 'lốt', 'Loss': 'lốt', 'focal loss': 'phâu cồ lốt', 'skip connection': 'xờ kíp cơ néc sần', 'residual': 'ri di điu ồ', 'latent': 'lây tần', 'noise': 'noi', 'denoise': 'đi noi', 'sampling': 'xem pờ linh', 'guidance': 'gai đần', 'rectified flow': 'réc ti phai phlâu',
  'agent': 'ây giần', 'Agent': 'ây giần', 'chatbot': 'chát bót', 'online': 'on lai', 'offline': 'óp lai', 'deepfake': 'đíp phây', 'deep learning': 'đíp lơ ninh', 'machine learning': 'mơ sin lơ ninh', 'Random Forest': 'ren đâm pho rét', 'XGBoost': 'ích gi bút', 'k-means': 'kây min', 'k-NN': 'kây en en', 'Naive Bayes': 'na ai bây', 'Bayes': 'bây',
  'Viterbi': 'vi tơ bi', 'Dijkstra': 'đai cơ tra', 'Minimax': 'mi ni mác', 'Monte Carlo': 'mon tê các lô', 'Q-learning': 'kiu lơ ninh', 'reward': 'ri quot', 'policy': 'po li xi', 'RLHF': 'a eo ếch ép', 'LoRA': 'lo ra', 'QLoRA': 'kiu lo ra', 'MoE': 'em âu i', 'RoPE': 'rốp', 'Mixture of Experts': 'mít chơ ốp ếch pớt',
  'Gaussian': 'gao xi ần', 'Gauss': 'gao', 'Splatting': 'xờ plát tinh', 'KL': 'kây eo', 'IoU': 'ai âu diu', 'NMS': 'en em ét', 'mAP': 'em ây pi', 'F1': 'ép một', 'AUC': 'ây diu xi', 'ROC': 'rốc', 'SGD': 'ét gi đi', 'MLP': 'em eo pi', 'FFN': 'ép ép en', 'CLS': 'xi eo ét', 'FPN': 'ép pi en', 'PAN': 'pan',
  'AOI': 'ây âu ai', 'PCB': 'pi xi bi', 'FPC': 'ép pi xi', 'GPU': 'gi pi diu', 'CPU': 'xi pi diu', 'TPU': 'ti pi diu', 'API': 'ây pi ai', 'RGB': 'a gi bi', 'OCR': 'âu xi a', 'VQA': 'vi kiu ây', 'RAG': 'rác', 'SSM': 'ét ét em', 'RNN': 'a en en', 'LSTM': 'eo ét ti em', 'GRU': 'gi a diu', 'CNN': 'xi en en', 'LLM': 'eo eo em', 'VLM': 'vi eo em',
  'MAE': 'em ây i', 'AI': 'ây ai', 'ML': 'em eo', 'NLP': 'en eo pi', 'CV': 'xi vi', 'GNN': 'gi en en', 'RL': 'a eo', 'XAI': 'ích ây ai', 'PCA': 'pi xi ây', 'SVM': 'ét vi em', 'HMM': 'ếch em em', 'BFS': 'bi ép ét', 'DFS': 'đi ép ét', 'MCTS': 'em xi ti ét', 'CTC': 'xi ti xi', 'EU': 'i diu', 'AI Act': 'ây ai ác',
  // bổ sung từ quét kịch bản
  'Vision Transformer': 'vi giần trans phóc mơ', 'Vision': 'vi giần', 'vector': 'véc tơ', 'Vector': 'véc tơ', 'cross-entropy': 'cờ rốt en trô pi', 'entropy': 'en trô pi', 'cosine': 'cô sin', 'Cosine': 'cô sin', 'Linear': 'li nia', 'linear': 'li nia', 'bias': 'bai ợt',
  'query': 'quy ri', 'key': 'ki', 'value': 'va liu', 'cache': 'kết', 'KV cache': 'kây vi kết', 'husky': 'hớt ki', 'conv': 'côn', 'Conv': 'côn', 'robot': 'rô bốt', 'camera': 'ca mê ra', 'Kalman': 'can man', 'Autoencoder': 'ô tô en côu đơ', 'autoencoder': 'ô tô en côu đơ',
  'Forward': 'pho quợt', 'Backward': 'béc quợt', 'backward': 'béc quợt', 'forward': 'pho quợt', 'Padding': 'pát đinh', 'Stride': 'xờ trai', 'heuristic': 'hiu ri xờ tích', 'beta': 'bê ta', 'alpha': 'an pha', 'Gini': 'gi ni', 'accuracy': 'ác kiu ra xi', 'score': 'xờ co', 'logic': 'lô gích',
  'one-hot': 'oan hót', 'mel': 'men', 'Fourier': 'phu ri ê', 'Router': 'rao tơ', 'router': 'rao tơ', 'Generator': 'gie nơ rây tơ', 'Discriminator': 'đít cờ ri mi nây tơ', 'mode collapse': 'mốt cồ láp', 'likelihood': 'lai cơ hút', 'prior': 'prai ơ', 'Pix2Pix': 'pích tu pích',
  'ControlNet': 'côn trôn nét', 'InfoNCE': 'in phô en xi i', 'perceptron': 'pơ xép trôn', 'Perceptron': 'pơ xép trôn', 'warmup': 'quom ắp', 'Depthwise': 'đép quai', 'depthwise': 'đép quai', 'pointwise': 'poi quai', 'ImageNet': 'i mít nét', 'spectrogram': 'xpéc trô gram', 'Dice': 'đai',
  'argmax': 'a gờ mác', 'validation': 'va li đây sần', 'test': 'tét', 'train': 'trên', 'Turing': 'tiu rinh', 'Atari': 'a ta ri', 'cGAN': 'xi gan', 'PatchGAN': 'pát gan', 'matching': 'mát chinh', 'hybrid': 'hai brít', 'tiling': 'tai linh', 'keypoint': 'ki poi', 'heatmap': 'hít mép',
  'occlusion': 'ô cờ lu giần', 'Occlusion': 'ô cờ lu giần', 'sinusoidal': 'xai nu xoi đồ', 'Boosting': 'bút tinh', 'boosting': 'bút tinh', 'Bagging': 'be ghinh', 'LightGBM': 'lai gi bi em', 'scikit-learn': 'xai kít lơn', 'silhouette': 'xi lu ét', 'autograd': 'ô tô grát', 'pretrained': 'pri trên',
  'Pooling': 'pu linh', 'Dropout': 'đróp ao', 'Mask': 'mát', 'STRIPS': 'xờ tríp', 'Kernel': 'kơ nồ', 'Squeeze-and-Excitation': 'xờ quy ần ếch xai tây sần', 'PaDiM': 'pa đim', 'VinFast': 'vin phát', 'Fast': 'phát', 'AlphaFold 2': 'an pha phôn hai',
  'latent': 'lây tần', 'flow': 'phlâu', 'variational': 've ri ây sần nồ', 'State Space Models': 'xờ tết xờ pết mô đồ', 'Markov': 'mác cốp', 'cross': 'cờ rốt', 'stem': 'xờ tem', 'logit': 'lô git', 'posterior': 'pốt tia ri ơ', 'augmentation': 'âu men tây sần', 'classifier': 'cờ la xi phai ơ', 'patch': 'pát', 'LLaMA': 'la ma', 'SimCLR': 'xim xi eo a', 'MVTec': 'em vi téc', 'Shapley': 'sáp li', 'stereo': 'xtê rê ô', 'sinusoidal': 'xai nu xoi đồ',
  'by Hand': 'bai hen', 'AI by Hand': 'ây ai bai hen', 'Tom Yeh': 'tom dê', 'arXiv': 'ác cai vơ', 'paper': 'pây pơ', 'GitHub': 'gít háp', 'Python': 'pai thơn', 'reflow': 'ri phlâu', 'Hungarian': 'hăng ga ri ần',
};
const SPEAK_LETTER = { A: 'ây', B: 'bi', C: 'xi', D: 'đi', E: 'i', F: 'ép', G: 'gi', H: 'ếch', I: 'ai', J: 'giây', K: 'kây', L: 'eo', M: 'em', N: 'en', O: 'âu', P: 'pi', Q: 'kiu', R: 'a', S: 'ét', T: 'ti', U: 'diu', V: 'vi', W: 'đắp bờ liu', X: 'ích', Y: 'oai', Z: 'dét' };
const SPEAK_SYM = [
  [/[“”"«»]/g, ''], [/[‘’`]/g, ''], [/[\u{1F300}-\u{1FAFF}☀-➿]/gu, ''], [/[✓✔]/g, ''], [/[✗✘]/g, ''],
  [/(\d)\s*×\s*(\d)/g, '$1 nhân $2'], [/×/g, ' nhân '], [/·/g, ' nhân '], [/→|⟶|=>/g, ', ra '], [/←/g, ', từ '], [/↔/g, ' qua lại '], [/≈/g, ' xấp xỉ '], [/≠/g, ' khác '], [/≤/g, ' nhỏ hơn hoặc bằng '], [/≥/g, ' lớn hơn hoặc bằng '],
  [/√/g, ' căn '], [/²/g, ' bình phương'], [/³/g, ' lập phương'], [/ᵀ/g, ' chuyển vị'], [/∑|Σ/g, ' tổng '], [/∞/g, ' vô cùng '], [/±/g, ' cộng trừ '], [/∈/g, ' thuộc '],
  [/σ/g, ' xích ma '], [/μ/g, ' muy '], [/α/g, ' an pha '], [/β/g, ' bê ta '], [/γ/g, ' gam ma '], [/λ/g, ' lam đa '], [/θ/g, ' tê ta '], [/ε/g, ' ép xi lon '], [/τ/g, ' tô '], [/η/g, ' ê ta '], [/δ|Δ/g, ' đen ta '], [/π/g, ' pi '], [/ŷ/g, ' y mũ '], [/x̂/g, ' x mũ '],
  [/(\d)\s*%/g, '$1 phần trăm'], [/(\d)\s*\/\s*(\d)/g, '$1 trên $2'], [/(\d)\s*[–-]\s*(\d)/g, '$1 đến $2'], [/−/g, ' trừ '], [/(\d)\s*\+\s*(\d)/g, '$1 cộng $2'], [/(\d)\s*=\s*/g, '$1 bằng '], [/\s=\s/g, ' bằng '],
  [/(\d+)\.(\d+)/g, '$1 chấm $2'], [/(\d)o\b/g, '$1 âu'], [/\s*[—–]\s*/g, ', '], [/\s\+\s/g, ' cộng '], [/\//g, ' chia '], [/\s*\(\s*/g, ', '], [/\s*\)\s*/g, ', '],
  [/(\d+)k\b/g, '$1 nghìn'], [/(\d+)\s?ms\b/g, '$1 mi li giây'], [/(\d+)\s?kHz\b/g, '$1 ki lô héc'], [/(\d+)\s?GB\b/g, '$1 gi ga bai'], [/(\d+)\s?B\b/g, '$1 tỷ'], [/(\d+)\s?M\b/g, '$1 triệu'],
  [/\bv(\d+)\b/g, 'vê $1'], [/(\w)v(\d+)\b/g, '$1 vê $2'], [/(\d)(D)\b/g, '$1 đê'],
];
function speakVi(text) {
  let s = ' ' + String(text || '') + ' ';
  SPEAK_SYM.forEach(([re, rep]) => { s = s.replace(re, rep); });
  // từ ghép dài trước, từ ngắn sau
  if (!speakVi.dict) { const d = { ...SPEAK_WORDS }; Object.keys(SPEAK_WORDS).forEach(k => { const up = k[0].toUpperCase() + k.slice(1); if (!(up in d)) d[up] = SPEAK_WORDS[k]; }); speakVi.dict = d; speakVi.keys = Object.keys(d).sort((a, b) => b.length - a.length).map(k => [k, new RegExp('(^|[^\\p{L}\\p{N}])' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?=$|[^\\p{L}\\p{N}])', 'gu')]); }
  speakVi.keys.forEach(([k, re]) => { s = s.replace(re, (m, p) => p + speakVi.dict[k]); });
  // chữ viết tắt in hoa chưa có trong từ điển: đánh vần (Q, K, V → kiu, kây, vi)
  s = s.replace(/(^|[^\p{L}])([A-Z]{1,5})(\d*)(?=$|[^\p{L}])/gu, (m, p, w, d) => p + w.split('').map(c => SPEAK_LETTER[c]).join(' ') + (d ? ' ' + d : ''));
  s = s.replace(/[_*#<>\[\]{}|\\^~]/g, ' ').replace(/\(\s*\)/g, '').replace(/\s*-\s*/g, ' ').replace(/\s+([,.;:!?])/g, '$1').replace(/([,;:])(?=\S)/g, '$1 ').replace(/,\s*,/g, ',').replace(/\s+/g, ' ').replace(/,\s*([.;:!?])/g, '$1').replace(/^[,\s]+|[,\s]+$/g, '').trim();
  return s;
}
