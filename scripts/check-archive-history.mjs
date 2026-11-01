import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { assertArchiveHistory } from './versions-lib.mjs';

const base = process.env.DOCS_BASE_SHA;
if (!base || /^0+$/.test(base)) {
  console.log('No prior commit supplied; archive hashes are still checked.');
} else {
  if (!/^[0-9a-f]{40}$/.test(base)) throw new Error('Invalid archive comparison commit');
  const git = (args) => spawnSync('git', args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
  if (git(['cat-file', '-e', base + '^{commit}']).status !== 0) throw new Error('Archive comparison commit is unavailable.');
  const previous = git(['show', base + ':public/versions.json']);
  if (previous.status !== 0) {
    if (!previous.stderr.includes("does not exist in") && !previous.stderr.includes("exists on disk, but not in")) {
      throw new Error(previous.stderr);
    }
    console.log('This change introduces the first version manifest.');
  } else {
    const current = JSON.parse(await readFile('public/versions.json', 'utf8'));
    assertArchiveHistory(JSON.parse(previous.stdout), current);
    console.log('Existing releases and explicit archive revision history verified against ' + base.slice(0, 7) + '.');
  }
}
