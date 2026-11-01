---
title: "What's new in 0.3.0"
editUrl: false
---

Bells and Whistles 0.3.0 uses Railroader's native mod system for **Railroader 0.6.2 or later**. The maintainer has confirmed earlier in-game testing of 0.3.0. The combined build additionally passed offline and native engine fixtures; fresh combined gameplay, editor, save/reload and multiplayer acceptance remain separate.

If you play Railroader 2025.1, this version isn't for you. Bells and Whistles 0.3.0 has no Unity Mod Manager build.

## Native authoring

- **Native pack:** the package ID is `alex6511/bells-and-whistles`. B&W no longer uses Unity Mod Manager or requires Library of Stuff.
- **Script carriers:** connectors, tender-bell settings and other feature declarations use the game's native Script component and its parameters.
- **Legacy connector kind:** `kind: "FlexibleConnector"` remains supported, including older array-form component data. Packs using that custom kind must require B&W.
- **Legacy bell routing:** the `[BellsAndWhistles:HeadlightDirection]` and `[TenderBells:HeadlightDirection]` tokens remain recognized.

## Features in 0.3.0

- [Driven Animation](/BellsAndWhistles-Docs/0.3.0/driven-animation/) drives clips from car speed or locomotive controls and native demand rates. Its guide includes the Better Rolling Stock field mapping.
- [Horn and Whistle](/BellsAndWhistles-Docs/0.3.0/horn-and-whistle/) lets a locomotive carry both instruments, choose one in Customize and use that selection for Auto Engineer crossing signals.
- [Auxiliary Tenders](/BellsAndWhistles-Docs/0.3.0/aux-tender/) transfer water toward the locomotive, with host-owned transfers, player controls and train-strip status colors.
- [Custom component kinds](/BellsAndWhistles-Docs/0.3.0/component-kinds/) give pack-owned Relay scripts typed fields and editor entries.

## Integrations being completed for this release

- [Geared Steam](/BellsAndWhistles-Docs/0.3.0/geared-steam/) adds definition-bound geared profiles, performance and response tuning, chuff timing, native mechanical-audio references and per-car local volume. Retained but inactive settings are identified in the guide.
- [Oil and wood firing](/BellsAndWhistles-Docs/0.3.0/alternative-firing/) adds fixed Bunker-C or wood declarations, distinct fuel/water accounting and guarded migration of known compatible legacy load IDs.
- [Fuel storage and outlets](/BellsAndWhistles-Docs/0.3.0/fuel-services/) connect authored props to finite industry stock or explicitly infinite supplies. They respect stock, target capacity, rate, reach, speed and ownership settings.
- [Relay APIs](/BellsAndWhistles-Docs/0.3.0/relay-api/) provide definition helpers, state queries, disposable observers, local audio volume and supported car/facility controls.

The mechanical loop uses an author-supplied AudioClip; the original Geared Steam recording is not bundled. Coal towers do not become oil or wood outlets. Runtime APIs do not switch profiles or firing types.

## Upgrade content

Follow [Migrating to 0.3.0](/BellsAndWhistles-Docs/0.3.0/migration/) for provider replacement, dependencies, saved loads and audio references. A native Script carrier may still require B&W for its intended gameplay behavior. Unconditional imports of B&W modules require it too.

Use [Installing](/BellsAndWhistles-Docs/0.3.0/installing/) for player setup and [Versions and audits](/BellsAndWhistles-Docs/0.3.0/versions/) for the frozen documentation attached to a release.
