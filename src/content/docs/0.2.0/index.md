---
title: "Bells and Whistles 0.2.0"
editUrl: false
---

:::caution[Archived release documentation]

This is the documentation from **v0.2.0** (2026-05-25). This B&W version was published as a prerelease. These guides use the older loader and component APIs. Use the current development guides for the native mod system.

[Read current development docs](/BellsAndWhistles-Docs/) or use the version selector.

:::


Bells and Whistles is a Railroader mod that bundles two features for rolling-stock authors:

- **Tender Bells** — mirrors the steam locomotive's bell state onto a `Bell` component mounted on its tender, with optional headlight-direction routing.
- **Flexible Connectors** — generates runtime tube meshes (hoses, cables, semi-rigid pipes) between named transforms on coupled cars.

Both features are visual-only. They do not add brake, steam, water, or electrical simulation. They only activate when a car definition explicitly opts in by including the matching component.

---

## Tender Bells

Tender Bells lets a tender-mounted Railroader `Bell` component follow the bell state of the steam locomotive coupled to it.

This mod does not create a bell, move a bell, edit a locomotive pack, or guess where a tender bell should go. A model author must add a real `Bell` component to the tender definition. If the tender has no `Bell` component, this feature intentionally does nothing.

### What This Feature Does

Railroader already knows how to build `Bell` components on car models. The missing piece is that the base game only wires the locomotive's own body into the locomotive bell control. Tender bodies can contain a `Bell`, but the locomotive bell key is not normally connected to that tender bell.

Tender Bells fills only that gap:

- It looks for loaded cars whose definition archetype is `Tender`.
- It looks under the tender body for actual `RollingStock.Bell` components built from `Definitions.json`.
- It finds the adjacent steam locomotive, including through a contiguous chain of tenders.
- It mirrors the locomotive's bell state onto the tender bell.
- If enabled on the tender bell component, it can route the active bell by the source locomotive headlight direction.

Because it mirrors the locomotive bell key, it works with the normal bell hotkey, cab controls, Auto Engineer bell use, and other code that changes the locomotive bell state.

### Tender Definition Example

Add a `Bell` component to the tender object's `definition.components` array:

```json
{
  "kind": "Bell",
  "animation": {
    "clipName": "TenderBell"
  },
  "name": "Tender Bell",
  "transform": {
    "position": [0.0, 3.15, -2.4],
    "rotation": [0.0, 0.0, 0.0, 1.0],
    "scale": [1.0, 1.0, 1.0]
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

### Optional Direction-Based Routing

By default, the tender bell mirrors the locomotive bell key whenever the source locomotive bell is on.

To pick between the locomotive bell and the tender bell based on the source locomotive's headlights, add this token to the tender `Bell` component's `name`:

```json
"name": "Tender Bell [BellsAndWhistles:HeadlightDirection]"
```

In this mode, rear-only headlights ring the tender bell and suppress the locomotive bell. Forward headlights, both headlights, or no directional headlight state ring the locomotive bell and keep the tender bell off.

For backward compatibility, the legacy `[TenderBells:HeadlightDirection]` token is still recognized.

### Cab Controls

Leave normal bell controls on the locomotive, not the tender. Railroader's locomotive code searches the locomotive body for controls with `purpose: "Bell"` and writes those to the locomotive bell key. Tender Bells reads that same key and mirrors it onto the tender's `Bell` component.

### Compatibility Rules

For the tender bell to attach, all of these must be true:

- The mod is installed and enabled in Railloader or UMM.
- The car definition is a tender with `"archetype": "Tender"`.
- The tender's loaded body contains at least one real `Bell` component.
- The tender is coupled to a steam locomotive, or to another tender chain that reaches a steam locomotive.

---

## Flexible Connectors

Flexible Connectors lets rolling stock model authors define visual hoses, cables, and semi-rigid pipes between moving transforms.

Target use cases:

- Articulated locomotive branch pipes that follow a moving front engine.
- Tender-to-locomotive water, steam, air, or electrical lines.
- Extra visual hoses between coupled cars.
- Stiffer connector shapes that should bend less than Railroader's brake hoses.

### What This Feature Does

- A `FlexibleConnector` entry is read from a car object's `Definitions.json`.
- When [Legotrainman's Library of Stuff](https://www.nexusmods.com/railroader) is installed, `FlexibleConnector` is registered as a first-class editor component. Authors can add it from the in-game editor's Add Component dropdown, edit its fields in the inspector, and **save** — the editor's save call round-trips through Newtonsoft + Library of Stuff's JsonSubType registry, so the modified `Definitions.json` keeps the `"kind": "FlexibleConnector"` entry intact.
- The runtime contains a fallback that strips FlexibleConnector entries before the stock parser reads the definitions. However, this release’s UMM manifest requires **Library of Stuff 1.4.0 or later**. Install that dependency for the UMM package; the fallback code does not remove the manifest requirement. The editor also needs the library to preserve connector entries on save.
- When the matching car body loads, the mod resolves the configured start and end transforms.
- A generated tube mesh is simulated between those transforms every frame. For Bézier-curved presets, mesh rings are sampled along a Catmull-Rom path through the simulated control points so the tube looks smooth instead of facet-kinked.

### Articulated Branch Pipe Example

Put this in the locomotive object's `definition.components` array:

```json
{
  "kind": "FlexibleConnector",
  "name": "Left Branch Pipe",
  "start": {
    "path": ["Boiler", "BranchPipeSocket_L"],
    "rotation": [0.0, 0.0, 0.0]
  },
  "end": {
    "path": ["FrontEngine", "SteamChestSocket_L"],
    "rotation": [0.0, 180.0, 0.0]
  },
  "preset": "RigidSteamPipe",
  "curve": "bezier",
  "smoothing": 4,
  "radius": 0.055,
  "segments": 10,
  "stiffness": 0.98,
  "damping": 0.68,
  "gravity": 0.15,
  "maxBendDegrees": 12,
  "solverIterations": 18,
  "color": "#55524d"
}
```

### Tender-To-Locomotive Line Example

Put this in the tender object's `definition.components` array:

```json
{
  "kind": "FlexibleConnector",
  "name": "Tender Water Line Left",
  "start": {
    "car": "self",
    "path": ["WaterLineSocket_L"]
  },
  "end": {
    "car": "locomotive",
    "path": ["TenderWaterLineSocket_L"]
  },
  "preset": "AirLine",
  "radius": 0.025,
  "slack": 1.12,
  "segments": 12,
  "stiffness": 0.65,
  "damping": 0.88,
  "gravity": 6.0,
  "maxBendDegrees": 55,
  "color": "#171717"
}
```

This endpoint setup means: start on the tender itself, then search through the coupled tender chain for a locomotive and resolve the end path on that locomotive body.

### Endpoint Fields

Each endpoint can be a string path:

```json
"start": "Boiler/BranchPipeSocket_L"
```

Or an object:

```json
"end": {
  "car": "locomotive",
  "path": ["TenderWaterLineSocket_L"]
}
```

Supported `car` values: `self`, `front`/`f`, `rear`/`r`, `a`/`logicalA`, `b`/`logicalB`, `tender`, `locomotive`.

Endpoint rotations are optional. When supplied, the endpoint's local +Z axis is treated as the direction the connector leaves that endpoint. For the end endpoint, +Z should usually point back toward the connector. With `useTransformRotation: true`, the transform’s rotation is combined with the optional Euler `rotation` offset. The default is true when an offset is supplied and false otherwise; false disables endpoint orientation.

### Tuning Fields

| Field | Meaning |
| --- | --- |
| `preset` | Base tuning: `Hose`, `AirLine`, `Cable`, `RigidPipe`, `RigidSteamPipe`, or `Chain`. |
| `curve` | Mesh interpolation between simulated points: `linear` (faceted, current behavior), `bezier`/`catmull` (smooth Catmull-Rom→Bézier), or `none` (skip rendering entirely). Omit to use the preset default — rigid presets default to `bezier`, all others to `linear`. |
| `smoothing` | Render subdivisions per simulated segment when `curve` is `bezier`/`catmull`. `1`–`16`. Ignored for `linear`/`none`. Rigid presets default to `4`. |
| `radius` | Tube radius in Unity meters. |
| `length` | Fixed connector length. If omitted, the mod uses endpoint distance times `slack`. |
| `slack` | Multiplier used when `length` is omitted. Must be at least `1.0`. |
| `segments` | Number of generated lengthwise pipe sections. |
| `axialSegments` | Number of tube sides around the circumference. |
| `stiffness` | Constraint strength from `0.0` to `1.0`. Higher is more rigid. |
| `damping` | Motion damping from `0.0` to `1.0`. Lower settles faster. |
| `gravity` | Downward pull. Use low values for rigid steam pipes. |
| `maxBendDegrees` | Limits how sharply adjacent segments can bend. |
| `solverIterations` | Constraint passes per frame. Higher is stiffer and more expensive. |
| `color` | HTML color string like `"#222222"` or an array `[r, g, b, a]`. |

### Authoring With Lego's Library of Stuff

Tuning a `FlexibleConnector` is an author-time activity. There is no in-game customize-window UI for these fields, and there shouldn't be — players don't pick a pipe's stiffness any more than they pick its mesh topology. Set the values in the definition JSON, ship the asset pack, done.

The recommended authoring loop uses Railroader's built-in editor together with Library of Stuff:

1. Install [Legotrainman's Library of Stuff](https://www.nexusmods.com/railroader) (1.4.0 or later). With it loaded, `FlexibleConnector` is registered as a JSON subtype on `Model.Definition.Component`, added to the editor's Add Component dropdown, and given a builder in `ComponentFactory`. Without it, the steps below silently lose your edits on save.
2. Launch Railroader with `/editor` in the Steam launch options.
3. Copy the rolling stock you want to author from `Railroader_Data\StreamingAssets\AssetPacks` into `%USERPROFILE%\AppData\LocalLow\Giraffe Lab LLC\Railroader\AssetPacks` so the editor can write changes back.
4. Open the editor, select your locomotive or car, open the components list, and pick `FlexibleConnector` from the Add Component dropdown.
5. Edit fields in the inspector. The editor reflects over public properties, so you'll see cells for `name`, `transform`, `enabled`, `start`, `end`, `preset`, `curve`, `smoothing`, `radius`, `length`, `slack`, `segments`, `axialSegments`, `stiffness`, `damping`, `gravity`, `maxBendDegrees`, `solverIterations`, and `color`. A few quirks to expect:
    - Integer fields fall back to a generic cell (the editor doesn't ship a dedicated int cell), the same way Lego's own `Priority` field does.
    - `start` and `end` render as nested cells — you'll see `car`, `path`, `rotation`, and `useTransformRotation` sub-fields. Edit them the same as any nested object.
6. Save. The editor serializes the modified definition back to your AssetPack folder. `FlexibleConnector` entries round-trip because Library of Stuff has registered the JsonSubType in both directions.
7. To ship as a UMM mod that patches existing rolling stock, copy the saved component JSON into your mod's `LegosLibraryOfStuff\Definitions\<name>.json` file inside the `bulkAdds` array. Library of Stuff applies your `bulkAdds` at runtime — you can also wrap it as a `MakeComponentGroup` so the customize window can toggle the connector on or off.

### Current Limitations

- No collision.
- No end cap or collar prefab support yet.
- No texture/material lookup from the asset pack yet; only generated color material.
- The connector is visual and local; it does not synchronize gameplay state.

---
