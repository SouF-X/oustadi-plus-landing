import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {resolve, relative, dirname, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT must be between 0 and 65535.');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.json':'application/json'};
const server = createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, {'Allow':'GET, HEAD'}).end(); return;
    }
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname) }
    catch { response.writeHead(400).end('Bad request'); return }
    let file = resolve(root, `.${pathname}`);
    const local = relative(root, file);
    if (local === '..' || local.startsWith(`..${sep}`) || pathname.includes('\0')) {
      response.writeHead(403).end('Forbidden'); return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    response.writeHead(200, {'Content-Type':types[extname(file)] || 'application/octet-stream','Content-Length':body.length,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    response.writeHead(['ENOENT','ENOTDIR','EISDIR'].includes(error.code) ? 404 : 500).end('Not found');
  }
});
server.listen(port, host, () => console.log(`Oustadi Plus: http://${host}:${server.address().port}`));
