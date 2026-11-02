---
title: Runtime validation and development fixes
---

This record covers an **unreleased development candidate following 0.3.0**, tested on Railroader **0.6.2, build 26335745**, with Unity **6000.3.26f1** on 2026-11-01. These fixes have not been added to the published 0.3.0 download. Use the [frozen 0.3.0 guides](/BellsAndWhistles-Docs/0.3.0/) for that release. The maintainer's earlier in-game testing of 0.3.0 remains valid; this record adds specific coverage for the development candidate.

## Fixes found through native testing

- Geared preferences and legacy preference import follow the selected native game home. A separate home has its own local volume settings.
- Inline Script components in packs that explicitly require B&W can import its runtime Relay modules using the declaring pack's dependency scope.
- Fuel outlets find native fuel load targets on the car, including targets outside its visual model hierarchy.
- The Driven Animation Script carrier is created with the model's animation map and rebuilt when that model reloads.
- Tender-chain connectors and bell routing follow actual coupled cars. Opening a coupler ends that attachment even while the cars are touching; recoupling restores it.

The native package identity and API version remain unchanged during this validation. No new release version is assigned by this record.

## Completed checks

The game runs used a separate player copy, separate settings identity and newly created disposable saves. They exercised the actual native game, B&W DLL, component builders and Relay interpreters.

| Area | Evidence and scope |
| --- | --- |
| Fresh SMR 1693 Climax | Two 25-second moving runs, with immediate model reload between them. 4,798,464 native audio sample values; peak absolute value 0.678100; zero extreme or nonfinite samples. This is captured native sample evidence, not a subjective listening assessment. |
| World and Relay lifecycle | Executed another pack's Main, file and inline component scripts and Data.rl authoring. Two save/reload cycles checked observers, effective profiles and local volume persistence. |
| Oil and wood | Tender, tank and articulated configurations moved under native controls and consumed fuel and water. Accounting checks covered geared and native multipliers, depletion, wrong or missing slots, compatible aliases and preservation of incompatible saved loads. |
| Finite facilities | Shared-stock conservation with competing outlets, depletion, capacity, incompatible fuel, reach, enablement, scoped freight accounting and native save/reload persistence. The native coal-loader selection path rejected oil and wood slots, with matching-fuel positive controls. |
| Existing features | Connector and bell attachment, native controls, auxiliary-water conservation and top-off, model culling, off-screen transfer, uncoupling and recoupling. |
| Editor and presentation | Actual native editor preview and saved declarations; file and inline Relay; Driven Animation throttle response, pause/resume and two immediate model reloads; Horn/Whistle selection and control routing. |
| Retained audio fixtures | 240,000 concurrent native callbacks, peak 0.929472, zero extreme values and unchanged healthy synthesis. Immediate diagnostic-object reload passed. Two author packs loaded distinct clips; relative/qualified resolution, invalid assets, cancellation, cleanup and reload passed. |
| Offline checks | 7,962 core tests and 556 geared tests passed; 16 existing geared skips. Native carrier parsing and 11 executed Relay/feature checks also passed. |

The editor fixture used a model from another pack. Its animation-name picker logged a native bundle lookup error; model preview, explicit clip selection, native playback and saved declarations passed. That picker path is not qualified by this run. Expected invalid-definition and far-distance culling diagnostics were retained separately from failed assertions.

## Still open

A second authenticated Railroader client was unavailable. Multiplayer permission enforcement, rejection of client simulation commands, host/client inventory authority and per-player volume isolation still require a real multiplayer session. Offline host guards do not close those checks.

The development candidate is not a new published release. Its fixes, matching release documentation and remaining acceptance decisions must be reviewed before publication. Later game builds need their own compatibility review.
