"""Create lightweight web copies of large raster assets.

Usage: python3 scripts/optimize-images.py
Originals in assets/ are never changed. Output goes to assets/web/ with
manifest.json, which scripts/components.mjs reads so asset() serves the
optimized file automatically. Re-run after adding or replacing an image.
"""
import json, re, unicodedata
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'assets'
OUT = SRC / 'web'
MAX_WIDTH = 1600
SPECIAL_WIDTH = {'jpm-brand-logo.png': 480}
MIN_BYTES = 150_000
# Readable web names for files whose original names are not ASCII.
NAME_OVERRIDES = {'พิพิธภัณฑ์มหาวิทยาลัยวลัยลักษณ์.png': 'walailak-museum'}
OUT.mkdir(exist_ok=True)

def slug(name, used):
    stem = NAME_OVERRIDES.get(name, Path(name).stem)
    s = unicodedata.normalize('NFKD', stem).encode('ascii', 'ignore').decode()
    s = re.sub(r'[^a-zA-Z0-9]+', '-', s).strip('-').lower() or 'image'
    base, i = s, 2
    while s in used: s, i = f'{base}-{i}', i + 1
    used.add(s)
    return s

manifest, used = {}, set()
for path in sorted(SRC.iterdir()):
    if path.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.webp'}: continue
    if path.stat().st_size < MIN_BYTES and path.name not in SPECIAL_WIDTH: continue
    im = ImageOps.exif_transpose(Image.open(path))
    width = SPECIAL_WIDTH.get(path.name, MAX_WIDTH)
    if im.width > width: im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
    name = slug(path.name, used) + '.webp'
    im.save(OUT / name, 'WEBP', quality=80, method=6)
    out = (OUT / name).stat().st_size
    if out >= path.stat().st_size and path.name not in SPECIAL_WIDTH:
        (OUT / name).unlink(); continue
    manifest[path.name] = {'file': f'web/{name}', 'width': im.width, 'height': im.height}
    print(f'{path.name}: {path.stat().st_size//1024} KB -> {out//1024} KB')

# Social sharing cover (1200x630) cropped from the studio installation photo.
cover = ImageOps.fit(Image.open(SRC / 'hero_installation.jpg').convert('RGB'), (1200, 630), Image.LANCZOS)
cover.save(OUT / 'og-cover.jpg', 'JPEG', quality=82, optimize=True, progressive=True)
(OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'{len(manifest)} images optimized; og-cover.jpg {(OUT / "og-cover.jpg").stat().st_size//1024} KB')
