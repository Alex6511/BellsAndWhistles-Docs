import test from 'node:test';
import assert from 'node:assert/strict';
import { access, cp, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { verifyVersions, assertArchiveHistory } from './versions-lib.mjs';

test('release snapshots preserve old versions and assets, reject overwrite, and require recorded errata', async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), 'bw-docs-version-test-'));
  try {
    for (const directory of ['src', 'public', 'scripts', 'config']) {
      await cp(directory, path.join(fixture, directory), { recursive: true });
    }
    await writeFile(path.join(fixture, 'package.json'), '{"type":"module"}');
    const before = await verifyVersions(fixture);
    // Exercise a new version even when the current development version already
    // has its release snapshot. Never remove or rewrite a copied real archive.
    let major = 999;
    while (before.releases.some((release) => release.version === `${major}.0.0`)) major++;
    const version = `${major}.0.0`;
    before.current.version = version;
    before.current.label = version + ' (development)';
    await writeFile(path.join(fixture, 'public/versions.json'), JSON.stringify(before));
    const run = (script, args) => spawnSync(process.execPath, [path.join(fixture, 'scripts', script), ...args], {
      cwd: fixture, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8',
    });
    const snapshot = run('snapshot-version.mjs', [version, 'prerelease', 'Railroader 0.6.0', 'Offline only']);
    assert.equal(snapshot.status, 0, snapshot.stderr);
    const after = await verifyVersions(fixture);
    assert.deepEqual(after.releases.slice(1), before.releases, 'Historical version metadata changed');
    const example = 'component-kinds/example/ComponentKinds.json';
    assert.deepEqual(await readFile(path.join(fixture, 'public', example)),
      await readFile(path.join(fixture, 'public', version, example)));
    const index = await readFile(path.join(fixture, 'src/content/docs', version, 'index.mdx'), 'utf8');
    assert.ok(index.includes(`/BellsAndWhistles-Docs/${version}/installing/`));
    assert.ok(index.includes('editUrl: false'));
    // Review proposals stay available at the development root, not in a release.
    await access(path.join(fixture, 'src/content/docs/future-plans/valve-gear.md'));
    await assert.rejects(access(path.join(fixture, 'src/content/docs', version, 'future-plans')), { code: 'ENOENT' });
    const archivedSidebar = JSON.parse(await readFile(path.join(fixture, 'src/content/versions', version + '.json'), 'utf8'));
    assert.ok(!JSON.stringify(archivedSidebar).includes('future-plans'));
    assert.ok(JSON.stringify(archivedSidebar).includes('driven-animation'));
    const versionGuide = await readFile(path.join(fixture, 'src/content/docs', version, 'versions.md'), 'utf8');
    assert.ok(versionGuide.includes('/BellsAndWhistles-Docs/versions.json'));
    assert.ok(!versionGuide.includes(`/BellsAndWhistles-Docs/${version}/versions.json`));
    assert.notEqual(run('snapshot-version.mjs', [version, 'prerelease', 'Railroader 0.6.0', 'Offline only']).status, 0);
    const target = path.join(fixture, 'src/content/docs', version, 'index.mdx');
    await writeFile(target, index + '\nCorrection for this release.\n');
    await assert.rejects(verifyVersions(fixture), /Frozen archive changed/);
    const erratum = run('refresh-archive.mjs', [version, 'Correct the frozen release description']);
    assert.equal(erratum.status, 0, erratum.stderr);
    const corrected = await verifyVersions(fixture);
    assertArchiveHistory(after, corrected);
    assert.throws(() => assertArchiveHistory(after, { ...corrected, releases: corrected.releases.slice(1) }), /removed/);
    const silent = structuredClone(corrected);
    silent.releases[0].revision = 1;
    delete silent.releases[0].errata;
    assert.throws(() => assertArchiveHistory(after, silent), /recorded erratum/);
    assert.equal(corrected.releases[0].revision, 2);
    assert.equal(corrected.releases[0].errata[0].previousSha256, after.releases[0].sha256);
  } finally {
    const parent = path.resolve(tmpdir()) + path.sep;
    if (!path.resolve(fixture).startsWith(parent) || !path.basename(fixture).startsWith('bw-docs-version-test-')) {
      throw new Error('Refusing cleanup outside the owned temporary fixture.');
    }
    await rm(fixture, { recursive: true, force: true });
  }
});
