---
title: "Set up Bells and Whistles features in the in-game editor"
---

You can set up the bell, connector, horn and auxiliary-tender features below in Railroader's car editor, without editing `Definitions.json` by hand. The features in the table below use the game's own **Script** component. The editor can't create the small `Data.rl` file that the aux tender uses, so this page gives it below.

| Feature | Goes on | Script Asset |
| --- | --- | --- |
| Tender bell routing | The tender | `alex6511/TenderBell` |
| Flexible connector (hoses, cables, pipes) | Either car that the connector joins. Set `start` and `end` relative to that car. | `alex6511/FlexibleConnector` |
| Horn selector (which instrument a locomotive with a horn and a whistle starts on) | The locomotive | `alex6511/HornSelector` |
| Aux tender (water car that keeps the tender topped up) | The aux car | `alex6511/AuxTender` |

Driven Animation isn't a Script component. It plays an animation clip driven by a car's speed or a locomotive's throttle, reverser, fuel use or water use.

Add Driven Animation with **Add Component → Driven Animation**. [Driven Animation](/BellsAndWhistles-Docs/driven-animation/) explains its settings.

The new 0.3.0 integrations use additional enabled Script carriers: [GearedSteam](/BellsAndWhistles-Docs/geared-steam/) and [AlternativeFiring](/BellsAndWhistles-Docs/alternative-firing/) on locomotives, and [FuelStorage/FuelOutlet](/BellsAndWhistles-Docs/fuel-services/) on props. Their guides give the nested parameters and prerequisites. [BWAuthoring](/BellsAndWhistles-Docs/relay-api/#definition-time-helpers) can construct these declarations in Data.rl.

## Before you start

1. Install Bells and Whistles. [Installing Bells and Whistles](/BellsAndWhistles-Docs/installing/) gives the steps.
2. Work on your own pack from `Documents\Railroader\ModDev`, because that is the folder the editor can save to.
3. Add Bells and Whistles to your pack's `Info.json`. [For content authors](/BellsAndWhistles-Docs/authors/#set-up-your-packs-infojson) shows the entry that each feature needs.

## Add a Script component

1. Open **Editor**, pick your mod, and select the car.
2. Choose **Add Component → Script**.
3. Give it a clear **Name**. Renaming doesn't change the component's ID. The editor set the ID from the default name when you added the component, so it starts as `script` (or `script-2`, …). If something refers to the component by ID, as the aux tender's `Data.rl` does, set the ID yourself in the component's ID field.
4. In **Script Asset**, type the asset from the table above exactly as shown. It is case-sensitive and needs the `alex6511/` part.
5. Under **Parameters**, add an entry for each setting you want, set its key, and choose its type (text, whole number, decimal, true/false, list or group). Leave out any setting where the default suits you.
6. Leave **Enabled** ticked, except for the horn selector and the aux tender (see below).
7. Save.

## Tender bell

The tender needs a real `Bell` component whose animation clip exists in the tender model. Leave cab bell controls on the locomotive.

With that, Bells and Whistles already rings the tender bell with the locomotive's bell. You don't need any setup for that. Add a TenderBell Script component only to change the routing or to stop Bells and Whistles from driving the bell.

| Parameter | Type | Default | Meaning |
| --- | --- | --- | --- |
| `routing` | text | `mirror` | `mirror`: the tender bell rings whenever the locomotive bell is on. `headlightDirection`: with only the rear headlight on, the tender bell rings alone; in any other case, the locomotive bell rings alone. |
| `enabled` | true/false | true | `false` stops Bells and Whistles from driving this tender's bells. |

Set `enabled` under **Parameters**. Unticking the component's **Enabled** box doesn't do the same. Bells and Whistles then ignores the component, and the tender bell behaves as if the tender had no TenderBell component.

## Flexible connector

| Parameter | Type | Meaning |
| --- | --- | --- |
| `start`, `end` | group, or text | Each end of the connector. As a group: `car` (text: `self`, `front`, `rear`, `a`, `b`, `tender` or `locomotive`), `path` (list of text: transform names from the car body), optional `rotation` (list of 3 decimals). As text: a path such as `Boiler/BranchPipeSocket_L` on the same car. |
| `preset` | text | `Hose`, `AirLine`, `Cable`, `RigidPipe`, `RigidSteamPipe` or `Chain`. |
| `curve` | text | `linear`, `bezier` or `none`. |
| `smoothing` | whole number | Render subdivisions per segment for `bezier`, 1 to 16. |
| `radius` | decimal | Tube radius in metres. |
| `length` / `slack` | decimal | Fixed length, or a multiple of the endpoint distance (at least 1.0). |
| `segments` / `axialSegments` | whole number | Simulated segments along the tube / faces around it. |
| `stiffness`, `damping` | decimal | 0.0 to 1.0. |
| `gravity`, `maxBendDegrees` | decimal | Downward pull; sharpest bend allowed between segments. |
| `solverIterations` | whole number | Constraint passes per frame. |
| `color` | text | `#rrggbb` or `#rrggbbaa`. |
| `material` | text | `generated` (default) or `airHose` to borrow the car's air-hose material. |

Every parameter except `start` and `end` is optional; the preset fills in the rest. [Flexible Connectors](/BellsAndWhistles-Docs/flexible-connectors/#parameters) explains each one in more detail.

With Bells and Whistles installed, **Add Component** also lists **Flexible Connector**. That is the older component kind, with the same settings as fields instead of parameters. A pack that uses it can't load its cars without Bells and Whistles, so use the Script component instead.

## Horn selector

The locomotive needs a whistle and a horn. Add them with **Add Component → Whistle** and **Add Component → Horn**. Players then get the **Horn and Whistle** section in Customize, with no other setup.

Add a HornSelector Script component only to change which instrument the locomotive starts on.

| Parameter | Type | Default | Meaning |
| --- | --- | --- | --- |
| `default` | text | `whistle` on a steam locomotive, `horn` on any other | `whistle` or `horn`: the instrument the Whistle/Horn control plays until a player picks one in Customize. |

Untick the HornSelector component's **Enabled** box. Bells and Whistles reads it anyway, and players without Bells and Whistles then get no script error.

[Horn and Whistle](/BellsAndWhistles-Docs/horn-and-whistle/) explains what players get.

## Aux tender

Put this on the aux water car, not on the locomotive's own tender.

| Parameter | Type | Default | Meaning |
| --- | --- | --- | --- |
| `load` | text | `rr/water` | The load to pass forward. The aux car and the receiving tender or locomotive must both carry it. |

The car also needs:

- A load slot for that load (for water, `requiredLoadIdentifier` `rr/water`).
- Its water **LoadTarget** and **LoadAnimation** components pointing at that slot. **Slot Index** counts from 0, so a car whose only slot is water uses 0. If it points past the last slot, water columns can't fill the car.
- A car type that does **not** start with `LT`, because the game treats `LT…` cars as locomotive tenders.

### Finish the setup: turn the component on from Data.rl

Do all three steps. They also keep the car loading cleanly for players without Bells and Whistles.

1. Name the Script component **Aux Tender**, set its **ID** to `aux-tender`, and **untick Enabled**. The game never builds a disabled component, so players without Bells and Whistles get a plain water car and no warnings.
2. In your pack's `Info.json`, add a load-order hint. It is not a dependency, and it is skipped silently when Bells and Whistles isn't installed:

    ```json
    "load": { "after": ["alex6511/bells-and-whistles"] }
    ```

3. Add `Scripts/Data.rl` to your pack. If your pack already has `Scripts/Data.rl`, follow [Turn the component on from Data.rl](/BellsAndWhistles-Docs/aux-tender/#3-turn-the-component-on-from-datarl) instead.

    Use one `definitions.merge` call for each aux car or livery:

    ```text title="Scripts/Data.rl"
    func modifyDefinitions(definitions) {
        if definitions.getDefinition("alex6511/aux-tender-api-v1") == null { return }
        definitions.merge("your-domain/your-aux-car", {
            "definition": { "components": { "aux-tender": { "enabled": true } } }
        })
    }
    ```

    `alex6511/aux-tender-api-v1` only exists when Bells and Whistles is installed. So the component turns on exactly when the script is there to run it.

    When you save in the editor, your `Definitions.json` keeps the component disabled. That is what you want: `Data.rl` turns it on each time the game loads definitions.

[Auxiliary Tenders](/BellsAndWhistles-Docs/aux-tender/) describes what players then get: an **Auxiliary Tender** section in Customize (status, feed on/off, refill threshold, transfer rate, top-off button) and blue tints in the train strip.
