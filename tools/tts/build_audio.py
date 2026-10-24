"""Tạo file lồng tiếng cho video bài học từ narration/narration.json.

Mỗi câu thành một file MP3 riêng để video đồng bộ phụ đề, sơ đồ động và danh sách theo từng câu.
Tên file là mã băm của (bộ máy, giọng, tốc độ, chữ đọc), nên chỉ câu nào sửa mới phải tạo lại.

Cấu hình bằng biến môi trường (đặt ở GitHub: Settings → Secrets and variables → Actions):
  TTS_ENGINE   edge (mặc định, miễn phí) | google (Google Cloud Text-to-Speech, trả phí, cần khóa) | none
  TTS_VOICE    edge:   vi-VN-HoaiMyNeural (nữ, mặc định) hoặc vi-VN-NamMinhNeural (nam)
               google: vi-VN-Neural2-A (nữ, mặc định), vi-VN-Neural2-D (nam), vi-VN-Wavenet-A...
  TTS_RATE     tốc độ đọc, ví dụ +0% (mặc định), -5%, +10%  (google: 1.0, 0.95, 1.1)
  GOOGLE_TTS_API_KEY  khóa API khi TTS_ENGINE=google (đặt là Secret, không đặt là Variable)
  TTS_CONCURRENCY     số câu tạo song song (mặc định 6)

Chạy tại máy:  pip install -r tools/tts/requirements.txt && python tools/tts/build_audio.py
Kết quả:       site/audio/manifest.json + site/audio/clips/*.mp3  (bộ nhớ đệm ở .tts-cache/)
"""
import asyncio
import base64
import hashlib
import json
import os
import pathlib
import shutil
import sys
import time

ROOT = pathlib.Path(__file__).resolve().parents[2]
NARRATION = ROOT / 'narration' / 'narration.json'
CACHE = ROOT / '.tts-cache'
OUT = ROOT / 'site' / 'audio'

ENGINE = os.environ.get('TTS_ENGINE', 'edge').strip() or 'edge'
DEFAULT_VOICE = {'edge': 'vi-VN-HoaiMyNeural', 'google': 'vi-VN-Neural2-A'}
VOICE = os.environ.get('TTS_VOICE', '').strip() or DEFAULT_VOICE.get(ENGINE, '')
RATE = os.environ.get('TTS_RATE', '').strip() or ('+0%' if ENGINE == 'edge' else '1.0')
CONC = int(os.environ.get('TTS_CONCURRENCY', '4'))
TIME_BUDGET = int(os.environ.get('TTS_TIME_BUDGET', '1800'))  # giây; hết giờ thì dừng, lần chạy sau làm tiếp nhờ bộ nhớ đệm
LABELS = {'vi-VN-HoaiMyNeural': 'giọng nữ Hoài My (Microsoft Edge TTS)', 'vi-VN-NamMinhNeural': 'giọng nam Nam Minh (Microsoft Edge TTS)'}


def clip_id(text: str) -> str:
    return hashlib.sha1(f'{ENGINE}|{VOICE}|{RATE}|{text}'.encode('utf-8')).hexdigest()[:20]


async def synth_edge(text: str, dest: pathlib.Path) -> None:
    import edge_tts  # noqa: PLC0415
    tmp = dest.with_suffix('.part')
    await asyncio.wait_for(edge_tts.Communicate(text, VOICE, rate=RATE).save(str(tmp)), timeout=45)
    if tmp.stat().st_size < 1000:
        raise RuntimeError('file âm thanh quá nhỏ')
    tmp.replace(dest)


async def synth_google(text: str, dest: pathlib.Path) -> None:
    import aiohttp  # noqa: PLC0415
    key = os.environ.get('GOOGLE_TTS_API_KEY')
    if not key:
        raise SystemExit('Thiếu GOOGLE_TTS_API_KEY cho TTS_ENGINE=google')
    body = {'input': {'text': text}, 'voice': {'languageCode': 'vi-VN', 'name': VOICE},
            'audioConfig': {'audioEncoding': 'MP3', 'speakingRate': float(RATE)}}
    async with aiohttp.ClientSession() as s:
        async with s.post(f'https://texttospeech.googleapis.com/v1/text:synthesize?key={key}', json=body, timeout=aiohttp.ClientTimeout(total=60)) as r:
            if r.status != 200:
                raise RuntimeError(f'Google TTS {r.status}: {(await r.text())[:200]}')
            dest.write_bytes(base64.b64decode((await r.json())['audioContent']))


SYNTH = {'edge': synth_edge, 'google': synth_google}


async def main() -> int:
    if ENGINE == 'none':
        print('TTS_ENGINE=none: bỏ qua lồng tiếng, video dùng giọng đọc của trình duyệt.')
        return 0
    if ENGINE not in SYNTH:
        raise SystemExit(f'TTS_ENGINE không hợp lệ: {ENGINE}')
    data = json.loads(NARRATION.read_text(encoding='utf-8'))
    cache = CACHE / ENGINE
    cache.mkdir(parents=True, exist_ok=True)
    todo = {}
    for scenes in data['lessons'].values():
        for sents in scenes:
            for c in sents:
                if c['s']:
                    todo[clip_id(c['s'])] = c['s']
    need = {k: v for k, v in todo.items() if not (cache / f'{k}.mp3').exists()}
    print(f'{ENGINE} · {VOICE} · tốc độ {RATE}: {len(todo)} câu, đã có sẵn {len(todo) - len(need)}, cần tạo {len(need)}')

    sem = asyncio.Semaphore(CONC)
    failed, done = [], 0
    t0 = time.time()

    stop = False

    async def one(k: str, text: str) -> None:
        nonlocal done, stop
        async with sem:
            if stop or time.time() - t0 > TIME_BUDGET:
                stop = True
                return
            for attempt in range(3):
                try:
                    await SYNTH[ENGINE](text, cache / f'{k}.mp3')
                    break
                except SystemExit:
                    raise
                except Exception as e:  # noqa: BLE001
                    if attempt == 2:
                        failed.append((k, f'{type(e).__name__}: {str(e)[:120]}'))
                    await asyncio.sleep(1.5 * (attempt + 1))
            done += 1
            # dừng sớm nếu dịch vụ hỏng hẳn (20 câu đầu đều lỗi)
            if done >= 20 and len(failed) >= done * 0.9:
                stop = True
                print('Dịch vụ TTS lỗi liên tục, dừng sớm. Lỗi mẫu:', failed[0][1], flush=True)
            if done % 50 == 0:
                print(f'  {done}/{len(need)} câu · lỗi {len(failed)} · {time.time() - t0:.0f} giây', flush=True)

    await asyncio.gather(*(one(k, v) for k, v in need.items()))
    if stop:
        print(f'Dừng ở {done}/{len(need)} câu (hết {TIME_BUDGET} giây hoặc lỗi liên tục); lần chạy sau sẽ làm tiếp.')

    # gom các file đang dùng vào site/audio và ghi manifest
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / 'clips').mkdir(parents=True)
    lessons, have, missing = {}, 0, 0
    for lid, scenes in data['lessons'].items():
        lessons[lid] = []
        for sents in scenes:
            row = []
            for c in sents:
                k = clip_id(c['s']) if c['s'] else None
                src = cache / f'{k}.mp3' if k else None
                if src and src.exists():
                    shutil.copy2(src, OUT / 'clips' / f'{k}.mp3')
                    row.append({'t': c['t'], 'f': f'audio/clips/{k}.mp3'})
                    have += 1
                else:
                    row.append(None)
                    missing += 1
            lessons[lid].append(row)
    manifest = {'engine': ENGINE, 'voice': VOICE, 'rate': RATE, 'label': LABELS.get(VOICE, f'{VOICE} ({ENGINE})'), 'generated': data.get('generated'), 'lessons': lessons}
    (OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False), encoding='utf-8')
    size = sum(p.stat().st_size for p in (OUT / 'clips').glob('*.mp3')) / 1e6
    print(f'Xong: {have} câu có lồng tiếng, {missing} câu thiếu, {size:.1f} MB')
    for k, e in failed[:10]:
        print('  lỗi', k, e)
    total = have + missing
    return 0  # luôn đăng trang; câu thiếu lồng tiếng sẽ dùng giọng trình duyệt


if __name__ == '__main__':
    sys.exit(asyncio.run(main()))
