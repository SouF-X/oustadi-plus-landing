import {readFile, access} from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
for (const file of ['app.js', 'motion.js']) {
  const result = spawnSync(process.execPath, ['--check', resolve(dist, file)], {stdio: 'inherit'});
  if (result.status !== 0) throw new Error(`JavaScript validation failed: ${file}`);
}
const html = await readFile(resolve(dist, 'index.html'), 'utf8');
let count = 0;
for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) {
  const reference = match[1];
  if (reference.startsWith('#') || /^(?:[a-z]+:|\/\/)/i.test(reference)) continue;
  const local = reference.split(/[?#]/)[0];
  await access(resolve(dist, local));
  count++;
}
for (const name of ['styles.css', 'scene.css', 'motion.css', 'chrome.css']) {
  const css = await readFile(resolve(dist, name), 'utf8');
  for (const match of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) {
    if (/^(?:data:|https?:)/i.test(match[1])) continue;
    await access(resolve(dist, match[1]));
    count++;
  }
}
for (const name of ['package.json', 'vercel.json', 'tokens.json']) {
  JSON.parse(await readFile(resolve(root, name), 'utf8'));
}
console.log(`Validated JavaScript, configuration and ${count} local asset references.`);
