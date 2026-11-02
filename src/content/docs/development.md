---
title: Contributing to the documentation
---

These guides and their small content-author examples are maintained in the public [BellsAndWhistles-Docs repository](https://github.com/Alex6511/BellsAndWhistles-Docs). The mod implementation is maintained separately. A copy of the game or private source is not needed to build the site.

## Preview and edit

Install Node 24, then run:

```sh
npm ci
npm run dev
```

Open the local address printed by Astro. Edit Markdown or MDX in `src/content/docs/`; navigation is in `config/sidebar.mjs`. Downloadable examples live in `public/`.

Use Starlight callouts and components. Local site links include the `/BellsAndWhistles-Docs/` base path. Preserve public URLs when reorganizing content.

## Verify

```sh
npm run check:audit
npm run build
```

The build verifies frozen version hashes, all local page and asset links, section anchors, version navigation, and search output. Generated files go in `dist/`. The maintenance check fails when a substantive review is overdue.

Base testing statements on maintainer reports and recorded test evidence. The maintainer has confirmed in-game testing of B&W 0.3.0. The current development guides include unreleased follow-up fixes after 0.3.0, targeting Railroader 0.6.2 or later. [Runtime validation](/BellsAndWhistles-Docs/runtime-validation/) records their specific native coverage and remaining multiplayer checks. Keep their development status visible until a matching release snapshot is ready.

## Publish

Open a normal pull request. The Docs workflow runs the checks before changes reach `main`, then publishes the site to GitHub Pages. Manual runs publish only from `main`; weekly scheduled runs audit without redeploying.

Publishing uses this public repository's own workflow token and requires no private source access. Review imported pages and examples before publishing; exclude implementation files, binaries, credentials, internal paths, and private history.

Read [Versions and audits](/BellsAndWhistles-Docs/versions/) before preparing a release or correcting an archive.
