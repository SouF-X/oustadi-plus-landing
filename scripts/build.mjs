import './check.mjs';
import {readFile, writeFile} from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configured = process.env.SITE_URL || process.env.URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
  || process.env.CF_PAGES_URL;
if (configured) {
  const url = new URL(configured);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('SITE_URL must be an HTTP(S) URL without credentials.');
  }
  url.hash = '';
  url.search = '';
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  const file = resolve(root, 'dist/index.html');
  let html = await readFile(file, 'utf8');
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, (_, before, after) => before + url.href + after);
  html = html.replace(/(<meta property="og:image" content=")[^"]*(")/, (_, before, after) => before + new URL('assets/social-preview.png', url).href + after);
  await writeFile(file, html);
  console.log(`Social metadata configured for ${url.href}`);
}
console.log('Ready to deploy: dist/ (no runtime dependencies).');
