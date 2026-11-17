# Local picomatch repair

The docs build uses a local copy of picomatch 4.0.7 with a source repair for [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf). Upstream source is from the npm release at [this commit](https://github.com/micromatch/picomatch/tree/6bb40679c218cefba5d4e9662408c5fdf699a8bb). The original MIT license is included.

The parser uses its existing literal fallback when a repeated extglob still contains an unbounded wildcard after the existing safe rewrites. Escaped, quoted and character-class literals remain supported. The private package omits upstream development tooling. `repair.json` records the shipped file hashes. CI checks those hashes and confirms each installed consumer resolves to the repaired code, then runs the ordinary npm audit and site build.

When an upstream release addresses the advisory, remove the local package, resolution override, CI check and linked-package Vite setting together. Verify that a clean install, advisory audit and site build pass with the upstream replacement.
