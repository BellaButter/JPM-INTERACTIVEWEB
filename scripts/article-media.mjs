// Article images (2026-10-27): cover and inline figures for insights/*.html.
// New article photos go in assets/articles/; an existing photo in assets/ can be reused by its file name.
// Width and height are read from the file header so the page reserves space and does not jump.
import { existsSync, readFileSync } from 'node:fs';
import { asset, assetSize, escape as e } from './components.mjs';

const root = new URL('../assets/', import.meta.url);

// Pixel size from a PNG, JPEG, GIF or WebP header; null when the format is not recognised.
export function imageSize(file) {
  const b = readFileSync(file);
  if (b.toString('ascii', 1, 4) === 'PNG') return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b.toString('ascii', 0, 3) === 'GIF') return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const kind = b.toString('ascii', 12, 16);
    if (kind === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (kind === 'VP8L') { const bits = b.readUInt32LE(21); return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }; }
    if (kind === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    for (let i = 2; i < b.length - 8;) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1], length = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      i += 2 + length;
    }
  }
  return null;
}

// Resolves an article image name to { src, path, size } with src relative to the page (prefix) and path from the site root.
export function articleImage(name, prefix = '') {
  if (existsSync(new URL(`articles/${name}`, root))) {
    const size = imageSize(new URL(`articles/${name}`, root));
    return { src: `${prefix}assets/articles/${encodeURIComponent(name)}`, path: `assets/articles/${encodeURIComponent(name)}`, original: `assets/articles/${encodeURIComponent(name)}`, size: size ? ` width="${size.width}" height="${size.height}"` : '', dims: size };
  }
  if (!existsSync(new URL(name, root))) throw new Error(`Article image not found: assets/articles/${name} or assets/${name}`);
  // A name with a folder (e.g. playground/tap-game.webp) keeps its slashes; Thai pages swap playground shots for the Thai ones.
  const nested = name.includes('/') ? 'assets/' + name.split('/').map(encodeURIComponent).join('/') : '';
  const path = nested || asset(name);
  const sized = assetSize(name);
  const dims = sized ? { width: +sized.match(/width="(\d+)"/)[1], height: +sized.match(/height="(\d+)"/)[1] } : imageSize(new URL(name, root));
  // original: the untouched file, used for sharing previews (some chat apps handle JPEG/PNG better than WebP).
  return { src: prefix + path, path, original: nested || `assets/${encodeURIComponent(name)}`, size: dims ? ` width="${dims.width}" height="${dims.height}"` : '', dims };
}

// <figure> markup. The cover loads first; inline figures load lazily.
export function articleFigure(media, prefix, { cover = false } = {}) {
  if (!media?.image) return '';
  const img = articleImage(media.image, prefix);
  return `<figure class="${cover ? 'article-cover' : 'article-figure'}"><img src="${img.src}"${img.size} alt="${e(media.alt || '')}" ${cover ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">${media.caption ? `<figcaption>${e(media.caption)}</figcaption>` : ''}</figure>`;
}
