---
title: "Auxiliary Tenders"
---

Bells and Whistles can keep a locomotive's tender topped up from an auxiliary tender (an aux water car) coupled to it. Car authors opt their car in. Players who have Bells and Whistles get a working aux tender. For players who don't, the car still loads normally, with no warnings, and works as a plain water car.

The feature is a Relay script that Bells and Whistles provides, `alex6511/AuxTender`. Relay is Railroader's scripting language, used in `.rl` files.

## What players see

With Bells and Whistles installed, the aux car's **Customize** panel gains an **Auxiliary Tender** section:

| Control | Default | What it does |
| --- | --- | --- |
| Feed Tender | On | Turns the transfer on or off for this car. |
| Start Refill Below | 95% | Refilling starts when the tender drops below this level and stops when it is full. |
| Transfer Rate | 1,000 gal/min | How fast water moves, in game time. |
| Top Off Tender Now | (button) | Starts filling the tender now, whatever its level, and keeps going at the transfer rate until it is full. |

The section starts with a **Status** line. It shows one of these:

| Status | Meaning |
| --- | --- |
| Feeding the tender | Water is moving into the tender now. |
| Ready, tender needs no water | Linked, but the tender needs no water yet. |
| Empty | Linked, but the aux car has no water left. |
| Off | Linked, but **Feed Tender** is off. |
| Not coupled toward an engine | Not linked to a locomotive. |

In the train strip at the bottom left of the screen, an aux car that is linked to a locomotive is drawn in these colours instead of the usual brake colours:

| Colour | Meaning |
| --- | --- |
| Bright blue | Feeding the tender right now. |
| Light blue | Linked and holding water; the tender doesn't need any yet. |
| Grey | Linked, but empty or switched off. |

The tint fades toward the normal brake colour as its brakes apply. Derailed and handbrake colours are shown as usual, and an aux car that isn't linked to a locomotive looks like any other car.

## How water moves

- The aux car feeds the car on the locomotive side: the locomotive's tender, or a locomotive that carries the load itself.
- Aux cars pass water forward toward the locomotive, never back. The current search checks at most eight cars toward the engine.
- Transfer continues while the train is out of view.
- In multiplayer, only the host moves water.

## Opt a car in

You need three small changes in your own pack. Nothing references Bells and Whistles in a way that fails when it is missing.

### 1. Add a disabled Script component to the aux car

In `Definitions.json`, add this to the aux car's `components`:

```json
"aux-tender": {
  "kind": "Script",
  "scriptAsset": "alex6511/AuxTender",
  "scriptInline": null,
  "parameters": {
    "load": "rr/water"
  },
  "name": "Aux Tender",
  "transform": {
    "position": [0.0, 0.0, 0.0],
    "rotation": [0.0, 0.0, 0.0, 1.0],
    "scale": [1.0, 1.0, 1.0]
  },
  "parent": null,
  "enabled": false
}
```

It must stay `"enabled": false` here. The game never builds a disabled component, so it never looks for the Bells and Whistles script and never warns when that mod is absent.

`load` is optional and defaults to `rr/water`. The script can transfer another shared load, but its Customize panel labels rates in gallons per minute; the quantity arithmetic uses that load's native units. Both cars need compatible slots.

The aux car itself needs a load slot for that load, for example:

```json
"loadSlots": [
  { "maximumCapacity": 20000.0, "loadUnits": "Gallons", "requiredLoadIdentifier": "rr/water" }
]
```

Point the car's water `LoadTarget` and `LoadAnimation` components at that slot with `slotIndex`. Slot indexes count from 0, so a car whose only slot is water uses `0`. If `slotIndex` points past the last slot, water columns can't fill the car.

Do not give the aux car a `carType` starting with `LT`; the game treats those as locomotive tenders.

:::tip[Use the in-game editor]

You can make these changes in Railroader's in-game car editor instead of editing `Definitions.json`. Follow [Aux tender](/BellsAndWhistles-Docs/editor-authoring/#aux-tender) in the in-game editor guide.

:::

### 2. Load after Bells and Whistles

In your pack's `Info.json`, add:

```json
"load": {
  "after": ["alex6511/bells-and-whistles"]
}
```

This is only an ordering hint. When Bells and Whistles is not installed, the game skips it silently. This standalone optional water-car pattern needs no B&W dependency. If the same pack imports B&W modules or uses features that require it, declare the required dependency as shown in [For content authors](/BellsAndWhistles-Docs/authors/#set-up-your-packs-infojson).

### 3. Turn the component on from Data.rl

If your pack has no `Scripts/Data.rl`, add this file:

```text title="Scripts/Data.rl"
func modifyDefinitions(definitions) {
    if definitions.getDefinition("alex6511/aux-tender-api-v1") == null { return }
    definitions.merge("your-domain/your-aux-car", {
        "definition": { "components": { "aux-tender": { "enabled": true } } }
    })
}
```

If your pack already has `Scripts/Data.rl`, don't put the `if` line at the top of its `modifyDefinitions`. For players without Bells and Whistles, its `return` skips everything after it in that function. You won't notice this while you test with Bells and Whistles installed.

Instead, wrap the aux tender merge calls in this block inside your existing `modifyDefinitions`:

```
if definitions.getDefinition("alex6511/aux-tender-api-v1") != null {
    definitions.merge("your-domain/your-aux-car", {
        "definition": { "components": { "aux-tender": { "enabled": true } } }
    })
}
```

Replace `your-domain/your-aux-car` with your aux car's identifier. Repeat the `definitions.merge` call for each aux car or livery in your pack. If you use the block, put every call inside it.

`alex6511/aux-tender-api-v1` is a marker that only Bells and Whistles defines, so the component turns on exactly when the script exists. It is an empty texture definition, so it never shows up in any in-game menu. Looking up a missing definition returns nothing and logs nothing.

For a complete example for one car, see [the Virginian AE aux tender example](/BellsAndWhistles-Docs/aux-tender/example/).

## Version 1 contract

The current contract consists of the script name `alex6511/AuxTender`, the marker `alex6511/aux-tender-api-v1`, and the `load` parameter. Keep this marker check tied to that script contract. Use the [versioned docs](/BellsAndWhistles-Docs/versions/) when targeting a particular release.

## Limitations

- A tank locomotive whose water slot is completely empty is not refilled. While it is empty the game can't confirm it has a water slot, and writing anyway could put water into the wrong slot. Tenders are always refilled, even from empty.
- The settings are saved on the aux car as `alex6511.aux.*` properties. They stay in a save if Bells and Whistles is removed later, and are simply ignored.
- The Bells and Whistles DLL draws the train-strip tint from the `alex6511.aux.state` property, which the script keeps up to date.
