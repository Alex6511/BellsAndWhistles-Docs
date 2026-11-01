---
title: "What's new in 0.3.0"
---

Version 0.3.0 is an experimental rework of Bells and Whistles for Railroader 0.6.0. It has not been tested in a running game yet.

To upgrade the mod, follow [Installing Bells and Whistles](/BellsAndWhistles-Docs/installing/).

## If you made content for an earlier version

- **Legacy `FlexibleConnector` entries** still load, but a pack that uses them can't load its cars without Bells and Whistles. List Bells and Whistles as `required`, or convert the entries to `Script` carriers. [Legacy `FlexibleConnector` components](/BellsAndWhistles-Docs/flexible-connectors/#legacy-flexibleconnector-components) shows both forms.
- **Packs with [carriers](/BellsAndWhistles-Docs/authors/#what-a-carrier-is)** list Bells and Whistles as `optional`. [Set up your pack's `Info.json`](/BellsAndWhistles-Docs/authors/#set-up-your-packs-infojson) shows the entry that each feature needs.

## Loading and compatibility

- **Native 0.6.0 mod.** Bells and Whistles is now a 0.6.0 mod pack that the game loads itself. Its `Info.json` has the identifier `alex6511/bells-and-whistles`. Bells and Whistles no longer uses Unity Mod Manager.
- **Native `Script` carriers.** You declare [connectors](/BellsAndWhistles-Docs/flexible-connectors/) and [tender-bell settings](/BellsAndWhistles-Docs/tender-bells/) with the game's own `"kind": "Script"` component. Point its `scriptAsset` at `alex6511/FlexibleConnector` or `alex6511/TenderBell`, and put the settings in `parameters`. Such a component is a [carrier](/BellsAndWhistles-Docs/authors/#what-a-carrier-is). The game's own parser accepts carriers, so your cars still load for players who don't have Bells and Whistles. Each car with a carrier then logs a script-resolution error. Your `Data.rl` can also add connectors to other packs' cars.
- **No Library of Stuff dependency.** Bells and Whistles registers the [legacy `"kind": "FlexibleConnector"` component](/BellsAndWhistles-Docs/flexible-connectors/#legacy-flexibleconnector-components) with the game itself. That kind parses, appears in the in-game editor and works in `Data.rl` without any other mod.
- **Legacy content keeps working.** `"kind": "FlexibleConnector"` entries load in both the [2025.1 array form and the 0.6.0 object form](/BellsAndWhistles-Docs/authors/#object-and-array-forms-of-components) of `components`. Bells and Whistles still honours the `[BellsAndWhistles:HeadlightDirection]` and `[TenderBells:HeadlightDirection]` tokens.

## New features

- **Driven Animation.** The `alex6511.DrivenAnimation` component plays an animation clip driven by a car's speed or a locomotive's throttle, reverser, fuel use or water use. It does the same job as Better Rolling Stock's `CustomAnimationControllerComponent`. Without Bells and Whistles, the game can't read a `Definitions.json` that uses this kind, so none of that pack's definitions load. See [Driven Animation](/BellsAndWhistles-Docs/driven-animation/), including [how to convert Better Rolling Stock entries](/BellsAndWhistles-Docs/driven-animation/#converting-from-better-rolling-stock).
- **Horn and Whistle.** A locomotive can have both a `Whistle` and a `Horn` component, as the Southern Pacific GS-4 did. Players choose in **Customize** which one the Whistle/Horn control plays, and Auto Engineer's crossing signals follow that choice. Without Bells and Whistles, only one of them sounds. An optional `alex6511/HornSelector` carrier sets which instrument the locomotive starts on. See [Horn and Whistle](/BellsAndWhistles-Docs/horn-and-whistle/).
- **Auxiliary Tenders.** Bells and Whistles keeps a locomotive's tender topped up with water from a coupled auxiliary car. The feature is written in Relay, Railroader's scripting language. See [Auxiliary Tenders](/BellsAndWhistles-Docs/aux-tender/).
- **Your own component kinds (prototype).** Your pack can declare its own component kinds, such as `"kind": "acme.SignalLamp"`, in a `ComponentKinds.json` file. Bells and Whistles registers them, so they load and appear in the editor like the game's own kinds. Each one runs a Relay script from your pack, and your pack can't load without Bells and Whistles. See [Your own component kinds](/BellsAndWhistles-Docs/component-kinds/).

## Connector and bell improvements

- **Culling.** Connectors use the game's air-hose culling. Bells and Whistles doesn't simulate or draw a connector while it is off screen or far away.
- **Air-hose material.** Set `"material": "airHose"` on a connector to borrow the car's stock air-hose material instead of a flat generated colour.
- **Cheaper tender bells.** Finding the coupled locomotive no longer allocates memory every frame.
