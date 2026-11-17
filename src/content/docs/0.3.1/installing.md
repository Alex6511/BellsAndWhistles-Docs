---
title: "Installing Bells and Whistles"
editUrl: false
---

Bells and Whistles 0.3.1 is a native Railroader mod pack with the identifier `alex6511/bells-and-whistles`, for **Railroader 0.6.2 or later**.

:::note[About this version]

B&W 0.3.1 has isolated native single-player, editor, reload and audio qualification on 0.6.3 experimental build 26740326. Real multiplayer remains unqualified. Follow the steps below for the matching build, and check its included manifest and release notes. This documentation repository does not distribute mod binaries.

If you play Railroader 2025.1, this version isn't for you. Bells and Whistles 0.3.0 has no Unity Mod Manager build.

:::

## What you need

- **Railroader 0.6.2 or later** for the combined package, matching its minimum game dependency.
- A B&W build and any content packs whose features you want to use.

B&W does not require Unity Mod Manager or Library of Stuff. A later Railroader version satisfying the minimum version constraint is not, by itself, evidence of compatibility with every future update; consult the matching release notes.

## Install the mod

1. **Allow DLL mods.** In Railroader, turn on **Preferences → Allow Unsafe DLL Mods**, then restart the game. B&W contains compiled code and needs this setting.
2. **Copy the mod folder.** Back up the previous package, then extract the supplied `bells-and-whistles` folder into `Documents\Railroader\Mods\`, or the `Mods` folder of your relocated native game home. Replace the earlier copy of that package while preserving `ModSettings`. If an older native B&W folder uses a different name, remove that superseded copy so only one enabled pack has this identifier.
3. **Enable the mod.** On the main menu, open **Mods** and enable **Bells and Whistles**.

Railroader's [installing mods guide](https://docs.railroadergame.com/modding/installing-mods/) describes native mod installation.

## Replacing standalone geared or firing mods

Use content packs updated for B&W's dependency ID. Remove the superseded executable providers from the enabled mod set; B&W detects recognized overlaps and disables its overlapping features. Merely copying B&W beside an old provider does not migrate the consumer pack or its saved loads.

See [Migrating to 0.3.1](/BellsAndWhistles-Docs/0.3.1/migration/) for the steps. B&W includes no automatic coal-to-oil or coal-to-wood save conversion.

## Multiplayer

The combined package uses native `scope: "unscoped"`, so the package and version must match across multiplayer peers. See Railroader's [scope reference](https://docs.railroadergame.com/modding/info-json/#scope-optional). Local gear-volume preferences remain personal.

## Next steps

Players can follow the feature guides for available controls. Content authors should start with [For content authors](/BellsAndWhistles-Docs/0.3.1/authors/).
