/* Xuất kịch bản lồng tiếng cho mọi bài học → narration/narration.json
   Mỗi câu gồm: t (chữ gốc, dùng làm phụ đề) và s (chữ đã chuẩn hóa để đọc, qua speakVi).
   Chạy sau `python build.py`:   node tools/export_narration.js */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replace(/<script async src[^>]*><\/script>/, '');
const vc = new VirtualConsole();
const dom = new JSDOM(html, {
  runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://localhost/#home', virtualConsole: vc,
  beforeParse(w) {
    const noop = new Proxy(function () {}, { get: (t, p) => (p === Symbol.toPrimitive ? () => 0 : p === 'createImageData' ? (a, b) => ({ data: new Uint8ClampedArray(a * b * 4) }) : noop), apply: () => noop });
    w.HTMLCanvasElement.prototype.getContext = () => noop;
    w.HTMLCanvasElement.prototype.toDataURL = () => 'data:,';
    w.HTMLElement.prototype.scrollIntoView = () => {};
    w.matchMedia = () => ({ matches: false, addEventListener() {} });
    w.scrollTo = () => {};
  },
});
const w = dom.window;
const out = w.eval(`(() => {
  const lessons = {};
  let n = 0, chars = 0;
  LESSONS.forEach(l => {
    lessons[l.id] = lessonScenes(l).map(sc => sentences(sc.say).map(t => { const s = speakVi(t); n++; chars += s.length; return { t, s }; }));
  });
  return { generated: new Date().toISOString(), sentences: n, chars, lessons };
})()`);
fs.mkdirSync(path.join(ROOT, 'narration'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'narration', 'narration.json'), JSON.stringify(out, null, 1));
console.log(`narration.json: ${Object.keys(out.lessons).length} bài, ${out.sentences} câu, ${out.chars} ký tự`);
process.exit(0);
