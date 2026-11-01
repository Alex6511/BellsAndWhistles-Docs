---
title: Valve gear authoring proposal
description: Review the proposed three-cycle valve gear workflow and Railroader ADK companion planned for Bells and Whistles 0.4.0, subject to change.
---

:::caution[Planned for 0.4.0 — always subject to change]

This is an **author-review proposal for Bells and Whistles 0.4.0**. All future plans are subject to change, including the target version, scope, field names, menu names, and timing.

The valve gear runtime and companion ADK tool described here are planned features. These examples are not a working setup for current releases. This page records the intended authoring experience, not completed implementation, ADK validation, or in-game acceptance. It does not change the existing testing statements for B&W 0.3.0.

:::

The proposed feature would let you animate valve gear from both **driver rotation** and **reverser position**. You would bake three complete cycles, assign them in a companion ADK window, and preview the blend before building your locomotive pack.

| Target | Proposal |
| --- | --- |
| B&W release | **0.4.0**, subject to change |
| Railroader | Native mod system; initial integration baseline **0.6.2**. Supported builds still need validation. |
| Authoring environment | Official Railroader ADK; initial Unity target **6000.3.26f1**. Recheck the [ADK project version](https://github.com/giraffelab/railroader-adk/blob/main/ProjectSettings/ProjectVersion.txt) before setting up a project. |
| Model types | Conventional steam locomotives and separate engine sections on articulated locomotives |
| Author input | Three baked cycles per engine section and its existing ordinary driver animation |
| Players | The locomotive pack; B&W would enable variable valve gear when available. Players would not install the editor companion. |

## What the three cycles mean

Each clip would describe **one complete driver revolution** at a fixed reverser setting:

| Clip | Reverser setting | What to bake |
| --- | --- | --- |
| Forward | Full forward | The complete driver assembly and valve gear through one revolution |
| Neutral | Centered | A complete revolution with the gear in its neutral setting |
| Reverse | Full reverse | A complete revolution with the gear in its reverse setting |

**Neutral is still a moving cycle.** Wheels and connected rods must turn when the locomotive rolls in neutral.

All three clips must use the same crank position at the same point in their cycles. Reverse describes the gear setting: bake it with the same reference direction of wheel rotation as the other clips. The locomotive's actual wheel motion would determine whether the cycles are sampled forwards or backwards.

For example, with the reverser halfway toward forward, the proposal blends neutral and forward equally. All clips are sampled at the same wheel phase:

| Reverser | Reverse weight | Neutral weight | Forward weight |
| --- | --- | --- | --- |
| -1 | 1 | 0 | 0 |
| -0.5 | 0.5 | 0.5 | 0 |
| 0 | 0 | 1 | 0 |
| 0.5 | 0 | 0.5 | 0.5 |
| 1 | 0 | 0 | 1 |

Wheel phase and reverser position are independent inputs. Moving the reverser while stopped should reposition the gear at the current wheel angle. Rolling backwards with the reverser forward should follow the wheels' actual motion.

## 1. Prepare and bake your model

Keep your source rig and existing driver animation. That existing clip would remain the ordinary animation used when variable valve gear is unavailable.

For each engine section:

1. Choose a repeatable starting crank position and retain the model's left/right quartering.
2. Set the reverser to full forward and bake one complete revolution.
3. Repeat at neutral and full reverse, using the same starting angle, rotation direction, and hierarchy.
4. Bake the evaluated bone or transform motion so playback does not depend on the source application's constraints.
5. Include the complete driver assembly animated by the ordinary driver clip, together with the valve gear. Use matching animated properties in all three clips, including properties that remain constant in one setting.
6. Check that each cycle closes without a visible jump. Keep the wheels in phase across all three settings before exporting.

If you use Blender, follow Railroader's [Blender workflow](https://docs.railroadergame.com/modding/blender-workflow/) for the model export. The proposed tool would consume baked animation; it would not build a mechanism rig or derive the missing neutral/reverse cycles from a single forward clip.

Equal clip lengths are the simplest authoring choice. The proposed runtime would also accept different durations by sampling the same normalized phase in each clip.

### Keep control animations separate

Review any existing cab reverser, power-reverser, brake, or [Driven Animation](/BellsAndWhistles-Docs/driven-animation/) clip that touches the same mechanism. A separate animation must not compete for properties owned by the three-cycle blend.

A cab lever can keep its own animation when it moves separate bones. If an existing clip also keys the valve gear, separate those tracks during authoring and check the resulting ordinary fallback animation too. The proposed importer would identify conflicts, not silently delete curves. Railroader documents this overlap limitation in its [PropertyAnimation guidance](https://docs.railroadergame.com/modding/components/propertyanimation/).

## 2. Import the cycles and map engine sections

Import the model and cycles into your ADK pack as compatible Generic animation clips. Keep bone names, hierarchy, and animation roots consistent between exports.

Register the clips in the relevant section's `AnimationMap`. Clip names in the map are what the definition would reference; they need not match the FBX filename. Follow Railroader's [AnimationMap placement rules](https://docs.railroadergame.com/modding/asset-maps/): curves are resolved relative to the object carrying the map and animator.

Suggested names for a conventional locomotive:

| Purpose | Example map name |
| --- | --- |
| Existing ordinary driver animation | `Drivers` |
| Forward cycle | `ValveGear.Forward` |
| Neutral cycle | `ValveGear.Neutral` |
| Reverse cycle | `ValveGear.Reverse` |

The ordinary wheel animation reference would remain `Drivers`; adding this feature should not replace the pack's fallback setup.

### Articulated locomotives

Prepare a set of three cycles for **each independently animated engine section**. A locomotive with a rear engine in the main body and one additional front engine would normally have six cycles, plus its ordinary driver animations.

The proposed setup would identify the main body with an empty `engineSetIdentifier`. An additional section would use the exact identifier from the definition's `engineSets` list, such as `front`. This is a definition identifier, not an arbitrary display name or bone path.

Each section would use its own AnimationMap, ordinary driver animation, and native wheel phase. The same map names can be reused in separate section maps. Preserve the section layout required by Railroader's [articulated locomotive definition](https://docs.railroadergame.com/modding/definitions/articulatedsteamlocomotive/).

Quartering belongs in the authored animation. Existing articulated phase offsets would be respected; you would not add a second quarter-turn offset just to use this feature.

## 3. Configure the proposed ADK companion

The planned entry point is **Railroader → Bells and Whistles → Valve Gear**. This menu and its controls are proposed; they are not available in the current ADK.

The intended workflow is:

1. Select the pack, locomotive definition, and model prefab.
2. Review the discovered main body and additional engine sections.
3. Select each section's existing driver animation and its forward, neutral, and reverse cycles.
4. Run validation and follow diagnostics to the affected section, clip, or transform.
5. Save the authoring profile with your project sources, outside the content exported to players.

Validation is intended to check missing clips, wrong animation roots, unresolved transform paths, inconsistent bindings, incomplete coverage of the ordinary driver animation, loop seams, and conflicts with other animations.

A successful validation report would not establish that the mechanism looks mechanically correct. Preview remains an author review step.

## 4. Preview both inputs before exporting

The proposed preview would use a disposable copy of the model, leaving the source prefab untouched. It would share the runtime's phase and blend calculations.

Planned controls include wheel-phase scrubbing, signed RPM playback, a reverser slider, full-forward/neutral/full-reverse shortcuts, and comparison with the ordinary animation. Articulated previews would allow separate section phases and speeds as well as a combined view.

Use these scenarios to inspect your work:

| Preview check | What to look for |
| --- | --- |
| A complete revolution at each endpoint | Correct crank alignment, connected rods, and a clean loop seam |
| A complete revolution at intermediate settings | Joint separation, unexpected rod length changes, clipping, or a discontinuity near neutral |
| Fixed wheel phase while moving the reverser | Gear movement without rotating the wheels |
| Negative RPM with a forward reverser setting | Wheels and gear follow actual rotation rather than reversing because of the control setting |
| Articulated sections at different phases/speeds | Each mechanism follows its own drivers |
| Ordinary animation comparison | A usable fallback when the feature is unavailable |

:::note[Blending is an approximation]

Blending three baked poses does not solve the linkage geometry at intermediate reverser settings. Even good endpoint clips can produce small gaps or intersections between them. Inspect the joints throughout the blend and report mechanisms that cannot be represented acceptably.

:::

## 5. Review the proposed exported configuration

The companion is intended to prepare standard AnimationMap entries and Script components. You would review those changes before applying them, with existing wheel references preserved.

**The following is a proposed example of entries inside `definition.components`. Its field names and behavior are subject to change; it is not a current-release configuration.**

```json
{
  "valve-gear-main": {
    "kind": "Script",
    "name": "Main engine valve gear",
    "enabled": false,
    "scriptAsset": "alex6511/ValveGear",
    "parameters": {
      "schemaVersion": 1,
      "engineSetIdentifier": "",
      "forward": "ValveGear.Forward",
      "neutral": "ValveGear.Neutral",
      "reverse": "ValveGear.Reverse"
    }
  },
  "valve-gear-front": {
    "kind": "Script",
    "name": "Front engine valve gear",
    "enabled": false,
    "scriptAsset": "alex6511/ValveGear",
    "parameters": {
      "schemaVersion": 1,
      "engineSetIdentifier": "front",
      "forward": "ValveGear.Forward",
      "neutral": "ValveGear.Neutral",
      "reverse": "ValveGear.Reverse"
    }
  }
}
```

A conventional locomotive would use only `valve-gear-main`. The articulated example assumes an additional section actually named `front`. One declaration per section is intended; each resolves its clip names in that section's map.

### Optional activation and ordinary fallback

The disabled state is intentional. The planned export would include optional B&W dependency/load-order information and a guarded `Data.rl` activation hook. The hook would enable the declarations only when compatible valve gear support is present.

If the pack already has a `Data.rl`, the tool would provide a helper and integration snippet while preserving existing author logic. Completing that integration would be part of the setup; merely adding the JSON above would not enable the feature.

The intended results are:

| Installation or configuration | Intended result |
| --- | --- |
| Compatible B&W and a valid setup | Variable valve gear follows driver phase and reverser |
| B&W absent or too old to provide this feature | Ordinary animation; no unresolved valve gear Script errors |
| Invalid clips or unsupported runtime integration | A useful diagnostic and ordinary animation retained |

The exact capability guard and minimum B&W requirement would be documented with the implementation. Installing B&W 0.3.0 is not intended to activate this proposal.

## 6. Build, test, and distribute

After review and export, use the normal [ADK pack workflow](https://docs.railroadergame.com/modding/adk/). Pull newer in-game definition edits from ModDev before building, because a build can overwrite them. Save the source pack and authoring profile as part of your own version-controlled project.

The intended player pack would contain standard animation assets, maps, definitions, and Relay files. It would not require the editor companion or contain its editor DLL.

Once an implementation is available, verify the exported pack in-game as well as in the preview:

- Forward and reverse travel, coasting, wheelslip, and stationary reverser changes.
- Both endpoint and intermediate reverser settings.
- Independent articulated engine movement.
- Model reloads and returning to a previously unseen locomotive.
- Ordinary animation with B&W missing or disabled.
- Cab controls, brakes, other animations, and multiplayer client appearance.

A successful ADK build alone would not complete those checks.

## Feedback requested from modders

Please [open a documentation issue](https://github.com/Alex6511/BellsAndWhistles-Docs/issues/new) and link this page. Useful review topics include:

- Can your existing rig produce three complete, phase-aligned cycles with matching bindings?
- Which parts currently share tracks with cab or power-reverser animations?
- Does the engine-section mapping fit your articulated model hierarchy?
- Which preview controls or diagnostics would make a failed import easier to fix?
- Would the proposed Data.rl integration preserve your pack's current scripting workflow?
- Where would three-cycle blending produce unacceptable linkage movement?

Include the mechanism and the phase/reverser setting involved when describing a visual problem. Procedural rigging with empties or joints, automatic mechanism construction, and changes to steam physics are outside this proposal.

The intended first delivery includes conventional and articulated examples to exercise the workflow. The **0.4.0 target and all details remain subject to change** as author feedback and validation inform the implementation.
