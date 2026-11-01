# Tender Bells

Tender Bells rings the `Bell` component on a steam locomotive's tender together with the locomotive's own bell.

Optionally, the locomotive's headlights pick one bell to ring. With only the rear headlight on, the tender bell rings alone. Otherwise, the locomotive bell rings alone.

Railroader builds `Bell` components on any car. However, it wires only the locomotive's own body to the locomotive bell control. Tender Bells fills that gap.

## How Tender Bells works

- It looks for loaded cars whose car type is a tender. Each one needs real `RollingStock.Bell` components in its body, built from the definition.
- It finds the locomotive next to the tender. This also works through a chain of coupled tenders.
- Every frame, it copies the locomotive's bell state to the tender bell. As a result, the bell hotkey, the cab controls and Auto Engineer all work for the tender bell.
- Optionally, the locomotive's headlights choose which bell rings. [Routing with the TenderBell carrier](#routing-with-the-tenderbell-carrier) explains how.

!!! note "Add the bell yourself"
    Bells and Whistles doesn't create or position bells. If the tender has no `Bell` component, nothing happens.

## Tender definition example

Give the tender a `Bell` component in its definition:

```json
"components": {
  "tender-bell": {
    "kind": "Bell",
    "name": "Tender Bell",
    "animation": { "clipName": "TenderBell" },
    "transform": {
      "position": [0.0, 3.15, -2.4],
      "rotation": [0.0, 0.0, 0.0, 1.0],
      "scale": [1.0, 1.0, 1.0]
    },
    "enabled": true
  }
}
```

This example uses the 0.6.0 object form of `components`. [Object and array forms of components](authors.md#object-and-array-forms-of-components) explains both.

Check two things:

- `animation.clipName` must match an animation in the tender prefab's `AnimationMap`.
- Leave cab controls with `purpose: "Bell"` on the locomotive. The tender reads the locomotive's bell key.

## Add Bells and Whistles to `Info.json`

List `alex6511/bells-and-whistles` under `dependencies.optional` in your pack's `Info.json`. [Set up your pack's `Info.json`](authors.md#set-up-your-packs-infojson) shows the entry.

Without the mod, your cars still load, but each car with a [carrier](authors.md#what-a-carrier-is) logs a script-resolution error.

## Routing with the TenderBell carrier

You don't need a carrier. Without one, the tender bell mirrors the locomotive bell, unless a [legacy marker](#legacy-routing-markers) selects headlight routing.

To choose the routing explicitly, add a `Script` carrier to the tender. A [carrier](authors.md#what-a-carrier-is) is a `Script` component whose `scriptAsset` is `alex6511/FlexibleConnector`, `alex6511/TenderBell` or `alex6511/HornSelector`. Its `parameters` hold the settings.

Put the carrier in the tender's `components`, next to the bell:

```json
"tender-bell-routing": {
  "kind": "Script",
  "name": "Tender Bell Routing",
  "scriptAsset": "alex6511/TenderBell",
  "parameters": { "routing": "headlightDirection" }
}
```

The carrier takes these parameters:

| Parameter | Default | Meaning |
| --- | --- | --- |
| `routing` | `mirror` | `mirror`: the tender bell rings whenever the locomotive bell is on. `headlightDirection`: the locomotive's headlights choose which bell rings, as the next table shows. |
| `enabled` | `true` | Set `"enabled": false` inside `parameters` to stop Bells and Whistles from driving this tender's bells. |

Put `enabled` inside `parameters`. If you set `"enabled": false` on the `Script` component itself, Bells and Whistles ignores the carrier. The tender bell then behaves as if there were no carrier.

With `headlightDirection`, the locomotive's headlights choose which bell rings while its bell is on:

| Headlights on | Tender bell | Locomotive bell |
| --- | --- | --- |
| Rear only | Rings | Silent |
| Forward only | Silent | Rings |
| Forward and rear | Silent | Rings |
| None | Silent | Rings |

!!! tip "Use the in-game editor"
    You can add the carrier in Railroader's in-game car editor instead of editing `Definitions.json`. Follow [Add a Script component](editor-authoring.md#add-a-script-component), then set the parameters listed under [Tender bell](editor-authoring.md#tender-bell).

## Legacy routing markers

Without a carrier, the legacy markers still select headlight routing. Any one of these selects it:

- A `[BellsAndWhistles:HeadlightDirection]` token in the `name` of the tender's `Bell` component, for example `"name": "Tender Bell [BellsAndWhistles:HeadlightDirection]"`.
- A `[TenderBells:HeadlightDirection]` token in that `name`.
- A `BellsAndWhistles.HeadlightDirection` metadata tag on the tender.
