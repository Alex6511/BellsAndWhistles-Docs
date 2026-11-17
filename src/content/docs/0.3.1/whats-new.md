---
title: "0.3.1 changes and native features"
editUrl: false
---

Bells and Whistles 0.3.1 continues the native mod support introduced in 0.3.0 for **Railroader 0.6.2 or later**. It adds compatibility with the relocated home-directory API in 0.6.3 experimental build 26740326, runtime fixes and fuel-supply integration. The maintainer's earlier in-game testing of 0.3.0 remains valid. [Runtime validation](/BellsAndWhistles-Docs/0.3.1/runtime-validation/) separates final 0.3.1 qualification from historical results and still-open multiplayer acceptance.

If you play Railroader 2025.1, this version isn't for you. Bells and Whistles 0.3.0 has no Unity Mod Manager build.

## Native authoring

- **Native pack:** the package ID is `alex6511/bells-and-whistles`. B&W no longer uses Unity Mod Manager or requires Library of Stuff.
- **Script carriers:** connectors, tender-bell settings and other feature declarations use the game's native Script component and its parameters.
- **Legacy connector kind:** `kind: "FlexibleConnector"` remains supported, including older array-form component data. Packs using that custom kind must require B&W.
- **Legacy bell routing:** the `[BellsAndWhistles:HeadlightDirection]` and `[TenderBells:HeadlightDirection]` tokens remain recognized.

## Features in 0.3.0

- [Driven Animation](/BellsAndWhistles-Docs/0.3.1/driven-animation/) drives clips from car speed or locomotive controls and native demand rates. Its guide includes the Better Rolling Stock field mapping.
- [Horn and Whistle](/BellsAndWhistles-Docs/0.3.1/horn-and-whistle/) lets a locomotive carry both instruments, choose one in Customize and use that selection for Auto Engineer crossing signals.
- [Auxiliary Tenders](/BellsAndWhistles-Docs/0.3.1/aux-tender/) transfer water toward the locomotive, with host-owned transfers, player controls and train-strip status colors.
- [Custom component kinds](/BellsAndWhistles-Docs/0.3.1/component-kinds/) give pack-owned Relay scripts typed fields and editor entries.

## Combined integrations in 0.3.0

- [Geared Steam](/BellsAndWhistles-Docs/0.3.1/geared-steam/) adds definition-bound geared profiles, performance and response tuning, chuff timing, native mechanical-audio references and per-car local volume. Retained but inactive settings are identified in the guide.
- [Oil and wood firing](/BellsAndWhistles-Docs/0.3.1/alternative-firing/) adds fixed Bunker-C or wood declarations, distinct fuel/water accounting and guarded migration of known compatible legacy load IDs.
- [Fuel storage and outlets](/BellsAndWhistles-Docs/0.3.1/fuel-services/) connect authored props to finite industry stock or explicitly infinite supplies. They respect stock, target capacity, rate, reach, speed and ownership settings.
- [Relay APIs](/BellsAndWhistles-Docs/0.3.1/relay-api/) provide definition helpers, state queries, disposable observers, local audio volume and supported car/facility controls.

The mechanical loop uses an author-supplied AudioClip; the original Geared Steam recording is not bundled. Coal towers do not become oil or wood outlets. Runtime APIs do not switch profiles or firing types.

## Changes in 0.3.1

Geared preferences follow Railroader 0.6.3's native home-directory API, with the earlier API retained as a compatibility fallback. The final 0.3.1 DLL passed 8,518 offline tests, 13 executable integration checks and 430 native assertions on build 26740326. Sixteen existing offline skips remain. Native coverage includes moving Climax audio, author clips, world/model reload, Relay, firing, finite facilities, fuel supply and the tested editor paths. Real multiplayer remains unqualified.

The follow-up also adds Bunker-C purchase destinations alongside native diesel interchange suppliers, with a default $0.27/gallon price and native handling/return behavior. [Oil and wood loader examples](/BellsAndWhistles-Docs/0.3.1/fuel-services/#supplying-your-loader-unreleased-follow-up) show freight receiving, finite storage and locomotive outlets. Wood uses existing `rr/pulpwood` providers. New data-only Relay helpers support receiving declarations and later-authored interchanges.

Version 0.3.1 fixes relocated-home geared settings, inline Relay imports in dependent packs, native fuel-target discovery, Driven Animation Script lifetime, and connector/bell detachment when couplers open. These fixes are not in the 0.3.0 download. See [runtime validation](/BellsAndWhistles-Docs/0.3.1/runtime-validation/) for the scope and limits of these results.

## Upgrade content

Follow [Migrating to 0.3.1](/BellsAndWhistles-Docs/0.3.1/migration/) for provider replacement, dependencies, saved loads and audio references. A native Script carrier may still require B&W for its intended gameplay behavior. Unconditional imports of B&W modules require it too.

Use [Installing](/BellsAndWhistles-Docs/0.3.1/installing/) for player setup and [Versions and audits](/BellsAndWhistles-Docs/0.3.1/versions/) for the frozen documentation attached to a release.
