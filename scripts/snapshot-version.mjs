import { mkdir, readFile, writeFile, copyFile, access } from 'node:fs/promises';
import path from 'node:path';
import sidebar from '../config/sidebar.mjs';
import { base, walk, verifyVersions, snapshotDigest } from './versions-lib.mjs';

const [version, channel, railroader, validation] = process.argv.slice(2);
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version ?? '') ||
    !['prerelease', 'stable'].includes(channel) || !railroader || !validation) {
  throw new Error('Usage: npm run version:snapshot -- <version> <prerelease|stable> "<Railroader compatibility>" "<validation evidence and limitations>"');
}
const root = process.cwd();
const manifest = await verifyVersions(root);
if (version !== manifest.current.version) throw new Error('Version must match the reviewed current development version.');
if (manifest.releases.some((release) => release.slug === version)) throw new Error('Refusing to overwrite an existing snapshot.');
const excluded = new Set(manifest.releases.map((release) => release.slug));
const docsRoot = path.join(root, 'src/content/docs');
for (const existing of [path.join(docsRoot, version), path.join(root, 'public', version), path.join(root, 'src/content/versions', version + '.json')]) {
  const exists = await access(existing).then(() => true, (error) => {
    if (error.code === 'ENOENT') return false;
    throw error;
  });
  if (exists) throw new Error('Refusing to overwrite existing snapshot files: ' + existing);
}
const files = (await walk(docsRoot)).filter((file) => !excluded.has(path.relative(docsRoot, file).split(path.sep)[0]));
for (const file of files) {
  const relative = path.relative(docsRoot, file);
  const dest = path.join(docsRoot, version, relative);
  await mkdir(path.dirname(dest), { recursive: true });
  const content = await readFile(file, 'utf8');
  const archived = content.replaceAll(base, base + version + '/')
    .replaceAll(base + version + '/versions.json', base + 'versions.json')
    .replaceAll(base + version + '/maintenance.json', base + 'maintenance.json')
    .replace(/^---\r?\n([\s\S]*?)\r?\n---/, (_, header) =>
      '---\n' + header.replace(/^editUrl:.*\r?\n?/gm, '') + '\neditUrl: false\n---');
  await writeFile(dest, archived);
}
const publicRoot = path.join(root, 'public');
for (const file of await walk(publicRoot)) {
  const relative = path.relative(publicRoot, file);
  if (excluded.has(relative.split(path.sep)[0]) || ['versions.json', 'maintenance.json'].includes(relative)) continue;
  const dest = path.join(publicRoot, version, relative);
  await mkdir(path.dirname(dest), { recursive: true });
  await copyFile(file, dest);
}
await writeFile(path.join(root, 'src/content/versions', version + '.json'), JSON.stringify({ sidebar }, null, 2) + '\n');
const release = { version, tag: 'v' + version, product: 'BellsAndWhistles', slug: version,
  label: version + (channel === 'prerelease' ? ' (prerelease)' : ''), channel,
  path: base + version + '/', railroader, validation, frozen: true, revision: 1,
  sha256: await snapshotDigest(root, version) };
manifest.releases.unshift(release);
await writeFile(path.join(publicRoot, 'versions.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('Created ' + version + '. Review every page, build, publish the docs, and verify the live release gate before tagging the mod.');
