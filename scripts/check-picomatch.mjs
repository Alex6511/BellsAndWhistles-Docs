import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { Worker } from 'node:worker_threads';

const root = process.cwd();
const vendor = path.resolve(root, 'vendor/picomatch');
const expected = JSON.parse(readFileSync(path.join(vendor, 'repair.json')));
const digest = file => createHash('sha256').update(readFileSync(file)).digest('hex');
for (const [file, hash] of Object.entries(expected.files)) {
  assert.equal(digest(path.join(vendor, file)), hash, `Modified vendored file: ${file}`);
}
const lock = JSON.parse(readFileSync('package-lock.json'));
const pkg = JSON.parse(readFileSync('package.json'));
assert.equal(pkg.dependencies.picomatch, 'file:vendor/picomatch');
assert.equal(pkg.overrides.picomatch, '$picomatch');
let consumers = 0;
for (const [location, entry] of Object.entries(lock.packages)) {
  if (location.endsWith('/picomatch')) {
    if (location === 'vendor/picomatch') continue;
    assert.equal(entry.link, true, `Registry picomatch returned: ${location}`);
    assert.equal(entry.resolved, 'vendor/picomatch');
  }
  if (!entry.dependencies?.picomatch && !entry.peerDependencies?.picomatch) continue;
  const dir = path.resolve(root, location);
  if (!existsSync(path.join(dir, 'package.json'))) continue; // Optional other-platform package.
  const require = createRequire(path.join(dir, 'package.json'));
  assert.equal(realpathSync(require.resolve('picomatch')), realpathSync(path.join(vendor, 'index.js')),
    `Unpatched dependency resolution: ${location || 'root'}`);
  consumers++;
}
assert.ok(consumers >= 6, `Unexpected dependency graph (${consumers} consumers)`);

const workerCode = String.raw`
  const { parentPort, workerData } = require('node:worker_threads');
  const pm = require(workerData.module);
  const results = workerData.cases.map(({pattern, input, options}) => {
    const re = pm.makeRe(pattern, options);
    return {matched: re.test(input), source: re.source};
  });
  parentPort.postMessage(results);
`;
async function evaluate(module, cases, timeout = 3000) {
  const worker = new Worker(workerCode, { eval: true, workerData: {module, cases} });
  try {
    return await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Matcher exceeded time limit')), timeout);
      worker.once('message', result => { clearTimeout(timer); resolve(result); });
      worker.once('error', error => { clearTimeout(timer); reject(error); });
      worker.once('exit', code => { clearTimeout(timer); if (code) reject(new Error(`Worker exit ${code}`)); });
    });
  } finally {
    await worker.terminate();
  }
}

const attacks = [];
for (const operator of ['+', '*']) {
  for (const body of ['*', '*a', 'a*', '*a*', '@(*a)', 'a|*a']) {
    for (const options of [{}, {maxExtglobRecursion: false}, {capture: true}, {windows: true}]) {
      attacks.push({pattern: `${operator}(${body})`, input: 'a'.repeat(20000) + '/!', options});
      attacks.push({pattern: `prefix/${operator}(${body})/end`, input: 'prefix/' + 'a'.repeat(20000) + '/!/end', options});
    }
  }
}
const repaired = await evaluate(path.join(vendor, 'index.js'), attacks);
assert.ok(repaired.every(result => result.matched === false), 'Unsafe pattern unexpectedly matched');

const normal = [
  ['**/*.md', 'guides/start.md', true], ['**/*.md', 'guides/start.js', false],
  ['src/**/*.{md,mdx}', 'src/docs/start.mdx', true], ['**/.*', 'src/.config', true],
  ['@(README|LICENSE)', 'LICENSE', true], ['+(ab)', 'abab', true], ['*(ab)', 'abab', true],
  ['+(a|b)', 'abba', true], ['?(a)', 'a', true], ['!(draft).md', 'guide.md', true],
  ['+(*(a)|*(b))', 'abba', true], ['+(*(a)|*(b))', 'abc', false],
  ['+([*])', '***', true], ['+(\\*)', '***', true], ['+("*")', '***', true],
  ['**/*.md', 'docs\\start.md', true, {windows: true}],
].map(([pattern, input, expected, options]) => ({pattern, input, expected, options}));
const ordinary = await evaluate(path.join(vendor, 'index.js'), normal);
ordinary.forEach((result, i) => assert.equal(result.matched, normal[i].expected, normal[i].pattern));

console.log(`Patched picomatch verified: ${consumers} consumers, ${attacks.length} attack cases, ${normal.length} ordinary cases.`);
