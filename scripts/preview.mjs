import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.mp4': 'video/mp4' };
const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const target = path.resolve(root, relative);
    const inside = path.relative(root, target);
    if (inside.startsWith('..') || path.isAbsolute(inside) || inside.split(/[\\/]/).some(segment => segment.startsWith('.'))) {
      response.writeHead(403).end('Forbidden'); return;
    }
    const info = await stat(target);
    if (!info.isFile()) { response.writeHead(404).end('Not found'); return; }
    const type = types[path.extname(target)] || 'application/octet-stream';
    const data = await readFile(target);
    // Range requests allow seeking in the preserved portfolio videos.
    const range = request.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Math.min(range[2] ? Number(range[2]) : info.size - 1, info.size - 1);
      if (start > end) { response.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end(); return; }
      response.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${info.size}`, 'Content-Length': end - start + 1, 'Accept-Ranges': 'bytes' });
      response.end(request.method === 'HEAD' ? undefined : data.subarray(start, end + 1)); return;
    }
    response.writeHead(200, { 'Content-Type': type, 'Content-Length': info.size, 'Accept-Ranges': 'bytes' });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch { response.writeHead(404).end('Not found'); }
});
server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${server.address().port}`));
