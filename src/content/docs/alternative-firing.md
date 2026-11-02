---
title: Oil and wood firing
---

Bunker-C oil and wood firing were introduced in **Bells and Whistles 0.3.0**. Authors choose the fuel in the locomotive definition. B&W uses the game's steam demand to consume that fuel and water from the appropriate car.

This page describes the 0.3.0 interface. Require `alex6511/bells-and-whistles >=0.3.0` and `rr/game >=0.6.2`. See [migration](/BellsAndWhistles-Docs/migration/) for existing provider dependencies and saved loads.

The unreleased follow-up adds native **Bunker-C interchange purchasing**, alongside diesel suppliers. Wood uses ordinary `rr/pulpwood` from any pulpwood provider. Haul either fuel to a finite receiving facility, then refuel through its authored outlet. See [fuel supply and loader examples](/BellsAndWhistles-Docs/fuel-services/#supplying-your-loader-unreleased-follow-up); the published 0.3.0 ZIP does not include the new oil sellers.

## Declare the firing type

Add one enabled carrier to the **locomotive**, not its tender:

```json
"alternative-firing": {
  "kind": "Script",
  "scriptAsset": "alex6511/AlternativeFiring",
  "parameters": {
    "fuel": "bunker-c",
    "fuelCarDefinition": "example/oil-tender"
  }
}
```

| Parameter | Default | Meaning |
| --- | --- | --- |
| `fuel` | Required | Exactly `bunker-c` or `wood`. |
| `fuelCarDefinition` | Empty | When supplied, the resolved fuel car must have this qualified definition ID. Empty allows the fuel car selected by the game's locomotive/tender relationship. |
| `fuelPerCoalPound` | 0.043 for oil; 1.8 for wood | Oil **gallons** or wood **pounds** per pound of coal-equivalent demand. Must be positive and finite. |

For wood, change `fuel` to `wood` and supply the appropriate fuel-car ID. This is a fixed author setting. The runtime API reads firing state; it does not switch a locomotive between coal, oil and wood.

## Configure the fuel car

The game resolves the fuel car, including a tender or a locomotive carrying its own fuel. If `fuelCarDefinition` is present it must match that resolved car.

The car needs **separate fuel and water slots**:

| Fuel | Required load ID | Slot units |
| --- | --- | --- |
| Bunker-C | `toolshed/bunker-c` | `Gallons` |
| Wood | `rr/pulpwood` | Match the native load's units |
| Water | `rr/water` | `Gallons` |

An oil tender's slots could be:

```json
"loadSlots": [
  { "requiredLoadIdentifier": "toolshed/bunker-c", "loadUnits": "Gallons", "maximumCapacity": 3000 },
  { "requiredLoadIdentifier": "rr/water", "loadUnits": "Gallons", "maximumCapacity": 10000 }
]
```

Those capacities are examples. Set each `LoadTarget` and `LoadAnimation` to the correct `slotIndex`. A fuel outlet needs a matching fuel `LoadTarget`; a water target belongs to the water slot.

There must be one unambiguous slot for each required load, with matching units. Duplicate fuel slots, a wrong tender, missing loads, invalid quantities or incompatible saved loads prevent the bound locomotive from treating its fuel as available. Read the game's diagnostic message or `BWFiring.snapshot(locomotive)`.

Wood's conversion coefficient is expressed in pounds, but the runtime converts it to the native `rr/pulpwood` load units before debiting the slot. Do not assume one native load unit is one pound.

## Consumption and refilling

Only the host debits fuel and water. Consumption follows the locomotive's native rates and fuel-consumption multiplier, including the multiplier used by articulated locomotives. Oil and wood do not eliminate water use. Fuel and water quantities remain in the game's load state.

Coal towers do **not** dispense Bunker-C or wood through B&W. Authors provide [fuel storage and outlets](/BellsAndWhistles-Docs/fuel-services/) for these fuels.

This module supplies firing and service behavior, not a set of scenery models or a general replacement for Toolshed facilities.

## Existing saves and declarations

Known legacy `bunker-c` or `pulpwood` load IDs can be normalized to their qualified IDs while retaining the quantity only when their units are compatible. Unknown loads and coal are not converted by relabeling their quantities. An incompatible saved load requires an explicit migration; changing the definition alone does not convert it.

Existing configured oil bindings remain a fallback. An explicit AlternativeFiring carrier wins. A malformed or duplicate explicit declaration is diagnosed and prevents fuel use rather than silently selecting the old binding.

[The Relay reference](/BellsAndWhistles-Docs/relay-api/) describes firing snapshots, including fuel ID, fuel car, slot indexes, quantities, capacities, consumption rates, availability and diagnostics.
