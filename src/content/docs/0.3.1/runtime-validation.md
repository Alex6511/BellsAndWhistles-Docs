---
title: Runtime validation
editUrl: false
---

This record distinguishes **B&W 0.3.1** qualification on **Railroader 0.6.3 experimental build 26740326 / Unity 6000.3.28f1** (2026-11-17) from earlier testing. The minimum declared game version remains 0.6.2. Later game builds need their own compatibility review. The maintainer's earlier in-game testing of 0.3.0 remains valid; its [frozen guides](/BellsAndWhistles-Docs/0.3.0/) describe that release.

## Final 0.3.1 artifact

The final DLL passed **7,962 core tests, 556 geared tests and 13 executable integration checks**, with 16 existing geared skips. Offline Unity adapters were applied only to copied test assemblies. The production DLL remained unchanged.

Separate native player runs passed **430 assertions**:

| Area | Assertions | Scope |
| --- | ---: | --- |
| Home isolation | 6 | Private native home, local preferences and save root. |
| Supply chain | 52 | Native priced Bunker-C purchases, pulpwood pickup, finite receiving/servicing, conservation and save. |
| Firing and Relay | 138 | Tender/tank/articulated oil and wood, invalid and partial loads, multipliers, real Relay consumers and two world reloads. |
| Facilities and models | 94 | Shared stock, persistence, outlet validation, model culling and reload. |
| Existing features | 63 | Connector/bell coupling, native controls, auxiliary-water transfer and off-screen operation. |
| Editor | 18 | Tested native editor presentation and saved declarations. |
| Native curve and diagnostic reload | 14 | Concurrent native callbacks, healthy synthesis, immediate destruction/reacquisition and cleanup. |
| Moving SMR 1693 Climax | 27 | Two moving runs and immediate model reload, with native audio capture. |
| Author audio | 18 | Two real native pack stores, relative/qualified assets, invalid inputs, cancellation, cleanup and reload. |

All player jobs exited cleanly with no remaining owned processes and unchanged normal settings. They used a separate player, settings identity and disposable saves.

The supply fixture verified all four native diesel suppliers also offer Bunker-C: a 100-gallon top-up cost $27 plus $30 handling, with native off-map waiting and return scheduling. Native pulpwood freight and oil freight filled finite depots and reached locomotive fuel slots without unintended delivery payout. Initial inventory was not recreated on facility reload.

The curve fixture executed **240,000 native callbacks and 61,440,000 sample values**, peaking at **0.929472** with zero extreme samples and unchanged healthy synthesis. The Climax captured **4,802,560 sample values** across two moving runs above 7 mph, peaking at **0.705983** with zero extreme or nonfinite values. These are native sample measurements, not a subjective listening assessment.

Author audio used generated tones rather than a borrowed recording. The corrected editor fixture built and loaded both bundles; the current game player independently loaded them through the final provider. Omitted audio stayed silent, bad inputs disabled only their loops, and cleanup/cancellation could not repopulate stale cache entries.

The editor reported oil/wood fuel-slot validation for fixture definitions that add firing declarations through Data.rl. Data.rl does not run in the editor, so the 18 editor assertions do not qualify those declarations. Expected invalid-load and distant-model diagnostics remain distinct from failed assertions.

## Fixes found through native testing

- Geared preferences and legacy preference import follow the selected native game home. A separate home has its own local volume settings.
- Inline Script components in packs that explicitly require B&W can import its runtime Relay modules using the declaring pack's dependency scope.
- Fuel outlets find native fuel load targets on the car, including targets outside its visual model hierarchy.
- The Driven Animation Script carrier is created with the model's animation map and rebuilt when that model reloads.
- Tender-chain connectors and bell routing follow actual coupled cars. Opening a coupler ends that attachment even while the cars are touching; recoupling restores it.

The package identity and API version remain unchanged in 0.3.1.

## Historical candidate checks — 2026-11-01

These earlier candidate runs used Railroader 0.6.2 build 26335745 / Unity 6000.3.26f1, a separate player copy, separate settings identity and newly created disposable saves. They exercised the actual native game, B&W DLL, component builders and Relay interpreters.

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

Real multiplayer remains an explicit prerelease limitation. These single-player results do not establish host/client behavior.
