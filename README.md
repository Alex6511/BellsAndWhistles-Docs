# Bells and Whistles documentation

[Read the documentation](https://alex6511.github.io/BellsAndWhistles-Docs/).

This public repository contains the versioned player and content-author guides, examples, and site configuration. The mod implementation is maintained in a separate private repository.

The site uses **Astro and Starlight**, matching the framework used by the official Railroader documentation. Starlight Versions adds release-specific navigation and search.

## Development

Use Node 24 (or Node 22.23.4+):

```sh
npm ci
npm run dev
```

Before opening a pull request:

```sh
npm run check:audit
npm run build
```

The build verifies frozen archive hashes, internal links and anchors, version navigation, and search assets. GitHub Actions builds every PR, publishes `main` to GitHub Pages, and audits the site weekly.

## Versions and maintenance

Current guides describe **0.3.0 development**, with Railroader compatibility and runtime limitations stated separately. The version selector includes B&W 0.2.1 and 0.2.0 prereleases and the legacy Tender Bells 1.0.0 predecessor. Archives were recovered from each release tag; their examples retain the APIs of that release.

- [Maintenance and versioning guide](src/content/docs/versions.md)
- [Contributor guide](src/content/docs/development.md)
- [Repository instructions](AGENTS.md)
- [Machine-readable versions](public/versions.json)
- [Latest maintenance audit](public/maintenance.json)

Every release gets a frozen snapshot before the mod is tagged. Routine updates affect development docs; archive corrections require an explicit, recorded erratum. A documented review is due at least every 30 days and after relevant mod or game changes.
