import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

export const base = '/BellsAndWhistles-Docs/';
export async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch((error) => {
    if (error.code === 'ENOENT') return [];
    throw error;
  });
  const files = [];
  for (const entry of entries) {
    const target = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error('Symlinks are not allowed in version snapshots: ' + target);
    if (entry.isDirectory()) files.push(...await walk(target));
    else files.push(target);
  }
  return files.sort();
}
export async function snapshotFiles(root, slug) {
  if (!/^[a-z0-9][a-z0-9.-]*$/.test(slug)) throw new Error('Unsafe version slug: ' + slug);
  const docs = await walk(path.join(root, 'src/content/docs', slug));
  if (docs.length === 0) throw new Error('Empty or missing archive: ' + slug);
  return [...docs, path.join(root, 'src/content/versions', slug + '.json'),
    ...await walk(path.join(root, 'public', slug))].sort();
}
export async function snapshotDigest(root, slug) {
  const hash = createHash('sha256');
  for (const file of await snapshotFiles(root, slug)) {
    hash.update(path.relative(root, file).split(path.sep).join('/'));
    hash.update('\0');
    hash.update(await readFile(file));
    hash.update('\0');
  }
  return hash.digest('hex');
}
export async function verifyVersions(root) {
  const manifest = JSON.parse(await readFile(path.join(root, 'public/versions.json'), 'utf8'));
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.releases)) throw new Error('Invalid versions manifest');
  if (manifest.current.status !== 'development' || !manifest.current.railroader) throw new Error('Current docs must be clearly marked development with Railroader compatibility');
  const slugs = new Set();
  for (const release of manifest.releases) {
    if (slugs.has(release.slug)) throw new Error('Duplicate version: ' + release.slug);
    slugs.add(release.slug);
    if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(release.version) ||
        release.tag !== 'v' + release.version ||
        !['BellsAndWhistles', 'TenderBells'].includes(release.product) ||
        !['prerelease', 'stable'].includes(release.channel) ||
        !release.frozen || !release.railroader || !release.validation ||
        !Number.isInteger(release.revision) || release.revision < 1 ||
        release.path !== base + release.slug + '/') {
      throw new Error('Invalid release metadata: ' + release.slug);
    }
    const digest = await snapshotDigest(root, release.slug);
    if (digest !== release.sha256) throw new Error('Frozen archive changed: ' + release.slug + '. Restore it or follow the documented erratum procedure.');
  }
  return manifest;
}

export function assertArchiveHistory(previous, current) {
  for (const before of previous.releases) {
    const after = current.releases.find((release) => release.slug === before.slug);
    if (!after) throw new Error('Published archive removed: ' + before.slug);
    for (const key of ['product', 'version', 'tag', 'slug', 'path', 'channel']) {
      if (before[key] !== after[key]) throw new Error('Published release identity changed: ' + before.slug);
    }
    if (before.sha256 === after.sha256) {
      if (before.revision !== after.revision || JSON.stringify(before.errata ?? []) !== JSON.stringify(after.errata ?? [])) {
        throw new Error('Archive history changed without a content correction: ' + before.slug);
      }
      continue;
    }
    const last = after.errata?.at(-1);
    if (after.revision !== before.revision + 1 || last?.revision !== after.revision ||
        last?.previousSha256 !== before.sha256 || !last?.reason?.trim() ||
        !/^\d{4}-\d{2}-\d{2}$/.test(last?.date ?? '') ||
        JSON.stringify(after.errata.slice(0, -1)) !== JSON.stringify(before.errata ?? [])) {
      throw new Error('Archive change requires a recorded erratum: ' + before.slug);
    }
  }
}
