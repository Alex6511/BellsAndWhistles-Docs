import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { verifyVersions } from './versions-lib.mjs';

test('release snapshots preserve old versions and assets, reject overwrite, and require recorded errata', async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), 'bw-docs-version-test-'));
  try {
    for (const directory of ['src', 'public', 'scripts', 'config']) {
      await cp(directory, path.join(fixture, directory), { recursive: true });
    }
    await writeFile(path.join(fixture, 'package.json'), '{"type":"module"}');
    const before = await verifyVersions(fixture);
    const run = (script, args) => spawnSync(process.execPath, [path.join(fixture, 'scripts', script), ...args], {
      cwd: fixture, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8',
    });
    const snapshot = run('snapshot-version.mjs', ['0.3.0', 'prerelease', 'Railroader 0.6.0', 'Offline only']);
    assert.equal(snapshot.status, 0, snapshot.stderr);
    const after = await verifyVersions(fixture);
    assert.deepEqual(after.releases.slice(1), before.releases, 'Historical version metadata changed');
    const example = 'component-kinds/example/ComponentKinds.json';
    assert.deepEqual(await readFile(path.join(fixture, 'public', example)),
      await readFile(path.join(fixture, 'public/0.3.0', example)));
    const index = await readFile(path.join(fixture, 'src/content/docs/0.3.0/index.mdx'), 'utf8');
    assert.ok(index.includes('/BellsAndWhistles-Docs/0.3.0/installing/'));
    assert.notEqual(run('snapshot-version.mjs', ['0.3.0', 'prerelease', 'Railroader 0.6.0', 'Offline only']).status, 0);
    const target = path.join(fixture, 'src/content/docs/0.3.0/index.mdx');
    await writeFile(target, index + '\nCorrection for this release.\n');
    await assert.rejects(verifyVersions(fixture), /Frozen archive changed/);
    const erratum = run('refresh-archive.mjs', ['0.3.0', 'Correct the frozen release description']);
    assert.equal(erratum.status, 0, erratum.stderr);
    const corrected = await verifyVersions(fixture);
    assert.equal(corrected.releases[0].revision, 2);
    assert.equal(corrected.releases[0].errata[0].previousSha256, after.releases[0].sha256);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
