---
title: "Tender Bells 1.0.0"
editUrl: false
---

:::caution[Archived release documentation]

This is the documentation from **v1.0.0** (2026-05-12). Tender Bells is the legacy predecessor, not a newer Bells and Whistles release. These guides use the older loader and component APIs. They are not the native Railroader 0.6.0 development guides.

[Read current development docs](/BellsAndWhistles-Docs/) or use the version selector.

:::


Tender Bells lets a tender-mounted Railroader `Bell` component follow the bell state of the steam locomotive coupled to it.

This mod does not create a bell, move a bell, edit a locomotive pack, or guess where a tender bell should go. A model author must add a real `Bell` component to the tender definition. If the tender has no `Bell` component, this mod intentionally does nothing.

## What The Mod Does

Railroader already knows how to build `Bell` components on car models. The missing piece is that the base game only wires the locomotive's own body into the locomotive bell control. Tender bodies can contain a `Bell`, but the locomotive bell key is not normally connected to that tender bell.

Tender Bells fills only that gap:

- It looks for loaded cars whose definition archetype is `Tender`.
- It looks under the tender body for actual `RollingStock.Bell` components built from `Definitions.json`.
- It finds the adjacent steam locomotive, including through a contiguous chain of tenders.
- It mirrors the locomotive's bell state onto the tender bell.

Because it mirrors the locomotive bell key, it works with the normal bell hotkey, cab controls, Auto Engineer bell use, and other code that changes the locomotive bell state.

## How Railroader Packs Usually Fit Together

Most locomotive mods ship at least one folder per object or asset pack:

- `Catalog.json` describes the asset pack and maps asset identifiers to prefab files in `Bundle`.
- `Definitions.json` describes game objects, such as the locomotive and tender, and points each object at its model asset with `modelIdentifier`.
- Steam locomotive definitions use `"kind": "SteamLocomotive"` and usually set `tenderIdentifier` to the tender object's identifier.
- Tender definitions are regular `"kind": "Car"` objects with `"archetype": "Tender"`.
- Component entries live in the object's `definition.components` array.

For example, a locomotive definition commonly has:

```json
{
  "identifier": "my-locomotive",
  "definition": {
    "kind": "SteamLocomotive",
    "tenderIdentifier": "my-tender",
    "modelIdentifier": "my-locomotive",
    "archetype": "LocomotiveSteam",
    "components": []
  }
}
```

And the tender is a separate object:

```json
{
  "identifier": "my-tender",
  "definition": {
    "kind": "Car",
    "modelIdentifier": "my-tender",
    "archetype": "Tender",
    "components": []
  }
}
```

The tender bell support belongs in the tender object's `components` array, not in the locomotive object.

## Model Setup

In Unity, Blender, or your existing Railroader export workflow, the tender needs a visible bell model and an animation clip that can be resolved by Railroader's `AnimationMap`.

Recommended setup:

1. Put the bell mesh on the tender prefab where it should appear.
2. Use a stable transform hierarchy for the animated part, such as a bell yoke or swing pivot.
3. Animate the bell swing as a looping clip.
4. Add that clip to the prefab's `AnimationMap`.
5. Use the same clip name in the tender `Bell` component's `animation.clipName`.

The game-provided `Bell` component supplies the bell audio and drives the clip through the model animator. It does not place your visible bell mesh for you.

## Tender Definition Example

Add a `Bell` component to the tender definition:

```json
{
  "kind": "Bell",
  "animation": {
    "clipName": "TenderBell"
  },
  "name": "Tender Bell",
  "transform": {
    "position": [
      0.0,
      3.15,
      -2.4
    ],
    "rotation": [
      0.0,
      0.0,
      0.0,
      1.0
    ],
    "scale": [
      1.0,
      1.0,
      1.0
    ]
  },
  "parent": null,
  "enabled": true
}
```

Notes:

- Put this entry in the tender object's `definition.components` array.
- Keep `"kind": "Bell"` exactly.
- `animation.clipName` must match an animation available on the tender prefab's `AnimationMap`.
- `transform.position` should be the bell sound/component location on the tender.
- `parent` can be `null` if the transform is already local to the tender body. Use a transform path only if that is how the rest of the model's components are authored.

## Cab Controls

Leave normal bell controls on the locomotive, not the tender.

Railroader's locomotive code searches the locomotive body for controls with `purpose: "Bell"` and writes those controls to the locomotive bell key. Tender Bells reads that same locomotive bell key and mirrors it onto the tender's `Bell` component.

A typical clickable locomotive bell control looks like this:

```json
{
  "kind": "ToggleControl",
  "purpose": "Bell",
  "targetColliderObject": {
    "path": [
      "Cab",
      "BellHandle"
    ]
  },
  "title": "Bell",
  "messageTrue": "On",
  "messageFalse": "Off",
  "name": "BellControl",
  "transform": {
    "position": [
      0.0,
      0.0,
      0.0
    ],
    "rotation": [
      0.0,
      0.0,
      0.0,
      1.0
    ],
    "scale": [
      1.0,
      1.0,
      1.0
    ]
  },
  "parent": null,
  "enabled": true
}
```

If your locomotive already has a working bell hotkey or bell cab control, you usually do not need to add another control. The tender bell will follow that existing locomotive state.

If you use an animated `RadialControl` for the cab handle instead of `ToggleControl`, the same placement rule applies: put it on the locomotive definition, set `"purpose": "Bell"`, and point its `animation.clipName` at a clip on the locomotive prefab. Tender Bells still only needs the tender-side `Bell` component.

## Compatibility Rules

For Tender Bells to attach, all of these must be true:

- The mod is installed and enabled in Railloader or UMM.
- The car definition is a tender with `"archetype": "Tender"`.
- The tender's loaded body contains at least one real `Bell` component.
- The tender is coupled to a steam locomotive, or to another tender chain that reaches a steam locomotive.
- The source locomotive is the one whose bell state should drive the tender bell.

This means a third-party tender will not gain a bell just because the mod is installed. The tender author has to ship the bell model, animation, and `Bell` component.

## Testing Checklist

1. Start Railroader with Tender Bells enabled.
2. Spawn or load the locomotive and tender.
3. Couple the tender to the locomotive if it is not already coupled.
4. Select the locomotive and toggle the normal locomotive bell.
5. Confirm the tender bell audio starts and stops with the locomotive bell.
6. Confirm the tender bell animation plays if an animation clip was configured.
7. Check `railloader.log` and the Railroader player log for missing animation, missing transform path, or JSON definition errors.

## Troubleshooting

### The locomotive bell works, but the tender bell does nothing

Check the tender `Definitions.json`. The tender must have its own component entry with `"kind": "Bell"`. A bell component on the locomotive does not count.

The DM&IR M-3 Yellowstone is a useful example of this distinction: its locomotive definition has a `Bell`, but its `m-3tender` definition is a tender car with load/headlight/decal components and no `Bell`. Tender Bells will intentionally ignore that tender until the model pack adds a tender-side `Bell` component.

### The bell rings but does not animate

The `Bell` component can still play audio if the model animation is missing, but the visible swing needs a valid animation clip. Confirm that:

- The tender prefab has an `AnimationMap`.
- The `AnimationMap` contains the clip named by `animation.clipName`.
- The clip animates the tender bell mesh or pivot, not a similarly named object on the locomotive prefab.

### The cab handle moves but the tender bell does not ring

Make sure the cab control is on the locomotive definition and uses `purpose: "Bell"`. Locomotive code wires bell controls found on the locomotive body to the locomotive bell key. Tender Bells mirrors that locomotive key; it does not make tender-mounted controls drive the locomotive.

### The tender has a bell mesh, but no sound

A mesh alone is not enough. Add a `Bell` component to the tender definition. Railroader's `Bell` component creates the bell audio source and connects it to the `Locomotive/Bell` audio mixer group.

### The bell only works when the tender is directly behind the engine

Tender Bells supports a contiguous tender chain. If another non-tender car sits between the locomotive and the tender, the follower stops there and the bell will not mirror.
