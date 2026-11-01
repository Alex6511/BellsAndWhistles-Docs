import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'parse5';
import { walk, base } from './versions-lib.mjs';

const root = path.resolve('dist');
const files = await walk(root);
const fileSet = new Set(files.map((file) => path.relative(root, file).split(path.sep).join('/')));
const pages = new Map();
const failures = [];
function visit(node, callback) {
  callback(node);
  for (const child of node.childNodes ?? []) visit(child, callback);
  if (node.content) visit(node.content, callback);
}
for (const file of files.filter((file) => file.endsWith('.html'))) {
  const relative = path.relative(root, file).split(path.sep).join('/');
  const html = await readFile(file, 'utf8');
  const tree = parse(html);
  const ids = new Set();
  const links = [];
  visit(tree, (node) => {
    const attrs = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
    if (attrs.id) ids.add(attrs.id);
    // Astro emits /404/ as metadata while GitHub Pages serves the error document as 404.html.
    if (relative === '404.html' && node.tagName === 'link' && attrs.rel === 'canonical') return;
    for (const name of ['href', 'src']) if (attrs[name]) links.push(attrs[name]);
  });
  pages.set(relative, { ids, links, html });
}
for (const [file, page] of pages) {
  const sourceURL = new URL(base + file.replace(/index\.html$/, ''), 'https://alex6511.github.io');
  for (const link of page.links) {
    if (/^(mailto:|tel:|data:|javascript:)/.test(link)) continue;
    const url = new URL(link, sourceURL);
    if (url.origin !== sourceURL.origin) continue;
    if (!url.pathname.startsWith(base)) { failures.push(file + ': outside site base: ' + link); continue; }
    let target = decodeURIComponent(url.pathname.slice(base.length));
    if (!target || target.endsWith('/')) target += 'index.html';
    if (!fileSet.has(target)) { failures.push(file + ': missing target: ' + link); continue; }
    if (url.hash && pages.has(target) && !pages.get(target).ids.has(decodeURIComponent(url.hash.slice(1)))) {
      failures.push(file + ': missing anchor: ' + link);
    }
  }
}
const manifest = JSON.parse(await readFile('public/versions.json', 'utf8'));
for (const release of manifest.releases) {
  const html = pages.get(release.slug + '/index.html')?.html ?? '';
  if (!html.includes(release.version)) failures.push('Missing version page: ' + release.slug);
}
if (!fileSet.has('pagefind/pagefind.js')) failures.push('Search index is missing');
const home = pages.get('index.html')?.html ?? '';
const packages = JSON.parse(await readFile('package.json', 'utf8')).dependencies;
if (!home.includes('Astro v' + packages.astro) || !home.includes('Starlight v' + packages['@astrojs/starlight'])) failures.push('Unexpected framework metadata');
for (const text of [manifest.current.label, ...manifest.releases.map((release) => release.label)]) {
  if (!home.includes(text)) failures.push('Version selector missing: ' + text);
}
if (failures.length) throw new Error([...new Set(failures)].join('\n'));
console.log('Checked ' + pages.size + ' HTML pages, all local links and anchors, version selector, framework metadata, and search assets.');
