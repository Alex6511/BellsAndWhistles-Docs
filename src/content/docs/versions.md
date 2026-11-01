---
title: Versions and documentation audits
---

Choose a version from the header to read guides for that B&W release. **B&W versions and Railroader versions are separate.** The development channel documents B&W 0.3.0, including the combined integrations being prepared for Railroader 0.6.2 or later. The maintainer has confirmed that 0.3.0 has been tested in-game.

B&W 0.2.1 and 0.2.0 were published as prereleases. Tender Bells 1.0.0 is a legacy predecessor, not a newer B&W release. The initial archives reproduce the player and author documentation available at each release tag; they preserve the documentation available for each historical release.

## When to audit

Review affected guides, release notes, installation steps, compatibility statements, configuration fields, defaults, examples, and troubleshooting:

- In every code PR that changes user-facing or author-facing behavior.
- Before every mod release, including prereleases and patch releases.
- After a supported Railroader update, dependency change, or reported documentation defect.
- At least every 30 days, even if no release is planned.

The weekly Docs workflow checks the build, archive integrity, local links, search output, and review age. A maintainer must investigate failed runs and perform the substantive content review; automated link checks cannot establish behavioral accuracy. Record the date, scope, evidence, and remaining limitations in `public/maintenance.json`. Do not advance the date without doing the review. GitHub can disable scheduled workflows in inactive public repositories; maintainers must keep the weekly schedule enabled and use the manual workflow after inactivity.

## Future plans

The **Future plans** category contains author-review proposals. All future plans are always subject to change, including their scope, interfaces, timing, and target B&W version. A proposal planned for 0.4.0 does not become a 0.3.0 feature because it appears alongside the current development guides.

The snapshot command excludes `future-plans/` content and its navigation from release archives. Before documenting a delivered feature, review its implemented behavior and validation evidence, then move the accepted guide into the appropriate authoring documentation. Preserve existing archived versions.

## Prepare a release snapshot

1. Finish the current guides and examples for the intended B&W version. Review compatibility and testing evidence, including maintainer reports; retain confirmed limitations. Check the actual release package's version, minimum game version and exported APIs against the docs, and finish the integrations described as development before freezing them.
2. Set `current.version` and its development label in `public/versions.json` to the version being prepared. Update the maintenance audit with actual evidence.
3. Freeze the reviewed content. For example:

```sh
npm run version:snapshot -- 0.3.0 prerelease "Railroader >=0.6.2" "Tested in-game; confirmed by the maintainer"
```

This creates a separate content tree, sidebar, and copy of downloadable assets. Internal links point into that version. It refuses to overwrite an existing archive and records a SHA-256 digest of the snapshot. Use the actual compatibility and validation evidence, not the example text blindly.

4. Review the snapshot as its own release documentation, including development or installation notices. Run `npm run check:audit` and `npm run build`. If a correction is required after creation, record an erratum as below rather than silently changing the digest.
5. Open a docs PR, merge after checks, and verify the deployed version URL and [version manifest](/BellsAndWhistles-Docs/versions.json).
6. In the private code repo, record the public docs PR and URL, run its release-documentation gate, and only then tag/publish the mod. The snapshot can be published ahead of the mod; its presence alone is not proof that a mod binary has been released.
7. Add the actual release date to the manifest after publication. Advance the development version when work on the next version starts. Preserve all prior snapshots and URLs.

## Correcting an archive

Routine changes go into development docs. An archive correction must fix documentation for that same release, not backport a later feature or imply retesting. State the reason in a dedicated PR and run:

```sh
npm run version:erratum -- 0.2.1 "Correct the documented field name to match this release"
```

The command increments the archive revision and records the previous digest, correction reason, and date. Reviewers must verify the change against that release. The build fails if snapshot content changes without a corresponding recorded revision. Git history retains the earlier text and metadata.

## Publication boundary

The docs site is built entirely from this public repository. Release gates in the private code repository read the public manifest and deployed archive; the public workflow has no private repository token. Keep private code PR links and implementation evidence in the private code PR. Public documentation should describe supported behavior and public validation limits.
