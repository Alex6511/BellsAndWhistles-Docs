# Documentation repository instructions

This is the public documentation repository for Bells and Whistles. Keep implementation code, game binaries, credentials, private issue details, internal paths, and private repository history out of it.

- Use Astro and Starlight. Maintain existing public page and example URLs.
- Read `src/content/docs/versions.md` before changing release snapshots or publication behavior.
- Classify every change as development docs, a new release snapshot, an explicit archive erratum, or site maintenance. Match each guide and sample to its B&W version; record Railroader compatibility separately.
- Audit relevant pages whenever public behavior, defaults, installation, dependencies, schemas, examples, or game compatibility changes. Coordinate with the corresponding private code PR without copying private context into the public PR.
- Base testing status on actual evidence, including explicit maintainer reports. The maintainer has confirmed in-game testing of B&W 0.3.0. Never infer that a mod or feature is untested because the current documentation task did not launch the game, or carry forward an old testing-status claim as a current fact. Do not invent per-feature test coverage.
- Run `npm run check:audit` and `npm run build`. Maintain a substantive review record in `public/maintenance.json` at least every 30 days; do not merely advance the date to silence CI.
- Preserve archived versions. Use the documented snapshot or erratum command; do not silently overwrite a prior release.
- Publish only through the GitHub Pages workflow after a normal ready-for-review PR. Review failed weekly audit runs and fix or explicitly track the problem; a tracking issue alone is not completion.
