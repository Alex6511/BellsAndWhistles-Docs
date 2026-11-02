---
title: "0.3.0 and development fixes"
---

Bells and Whistles 0.3.0 uses Railroader's native mod system for **Railroader 0.6.2 or later**. The maintainer has confirmed earlier in-game testing of 0.3.0. An unreleased follow-up candidate has now passed native gameplay, editor, save/reload and audio checks; multiplayer acceptance remains open. [Runtime validation](/BellsAndWhistles-Docs/runtime-validation/) records the exact scope and limitations.

If you play Railroader 2025.1, this version isn't for you. Bells and Whistles 0.3.0 has no Unity Mod Manager build.

## Native authoring

- **Native pack:** the package ID is `alex6511/bells-and-whistles`. B&W no longer uses Unity Mod Manager or requires Library of Stuff.
- **Script carriers:** connectors, tender-bell settings and other feature declarations use the game's native Script component and its parameters.
- **Legacy connector kind:** `kind: "FlexibleConnector"` remains supported, including older array-form component data. Packs using that custom kind must require B&W.
- **Legacy bell routing:** the `[BellsAndWhistles:HeadlightDirection]` and `[TenderBells:HeadlightDirection]` tokens remain recognized.

## Features in 0.3.0

- [Driven Animation](/BellsAndWhistles-Docs/driven-animation/) drives clips from car speed or locomotive controls and native demand rates. Its guide includes the Better Rolling Stock field mapping.
- [Horn and Whistle](/BellsAndWhistles-Docs/horn-and-whistle/) lets a locomotive carry both instruments, choose one in Customize and use that selection for Auto Engineer crossing signals.
- [Auxiliary Tenders](/BellsAndWhistles-Docs/aux-tender/) transfer water toward the locomotive, with host-owned transfers, player controls and train-strip status colors.
- [Custom component kinds](/BellsAndWhistles-Docs/component-kinds/) give pack-owned Relay scripts typed fields and editor entries.

## Combined integrations in 0.3.0

- [Geared Steam](/BellsAndWhistles-Docs/geared-steam/) adds definition-bound geared profiles, performance and response tuning, chuff timing, native mechanical-audio references and per-car local volume. Retained but inactive settings are identified in the guide.
- [Oil and wood firing](/BellsAndWhistles-Docs/alternative-firing/) adds fixed Bunker-C or wood declarations, distinct fuel/water accounting and guarded migration of known compatible legacy load IDs.
- [Fuel storage and outlets](/BellsAndWhistles-Docs/fuel-services/) connect authored props to finite industry stock or explicitly infinite supplies. They respect stock, target capacity, rate, reach, speed and ownership settings.
- [Relay APIs](/BellsAndWhistles-Docs/relay-api/) provide definition helpers, state queries, disposable observers, local audio volume and supported car/facility controls.

The mechanical loop uses an author-supplied AudioClip; the original Geared Steam recording is not bundled. Coal towers do not become oil or wood outlets. Runtime APIs do not switch profiles or firing types.

## Unreleased runtime fixes

The follow-up also adds Bunker-C purchase destinations alongside native diesel interchange suppliers, with a default $0.27/gallon price and native handling/return behavior. [Oil and wood loader examples](/BellsAndWhistles-Docs/fuel-services/#supplying-your-loader-unreleased-follow-up) show freight receiving, finite storage and locomotive outlets. Wood uses existing `rr/pulpwood` providers. New data-only Relay helpers support receiving declarations and later-authored interchanges.

The development candidate fixes relocated-home geared settings, inline Relay imports in dependent packs, native fuel-target discovery, Driven Animation Script lifetime, and connector/bell detachment when couplers open. These fixes are not in the published 0.3.0 download. See [runtime validation](/BellsAndWhistles-Docs/runtime-validation/) before relying on that candidate's results.

## Upgrade content

Follow [Migrating to 0.3.0](/BellsAndWhistles-Docs/migration/) for provider replacement, dependencies, saved loads and audio references. A native Script carrier may still require B&W for its intended gameplay behavior. Unconditional imports of B&W modules require it too.

Use [Installing](/BellsAndWhistles-Docs/installing/) for player setup and [Versions and audits](/BellsAndWhistles-Docs/versions/) for the frozen documentation attached to a release.
