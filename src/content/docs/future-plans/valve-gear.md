---
title: Valve gear authoring proposal
description: Review the proposed three-cycle valve gear workflow and Railroader ADK companion planned for Bells and Whistles 0.4.0, subject to change.
---

:::caution[Planned for 0.4.0 — always subject to change]

This is an **author-review proposal for Bells and Whistles 0.4.0**. All future plans are subject to change, including the target version, scope, field names, menu names, and timing.

The general B&W runtime, reusable pack configuration and companion ADK tool are planned. The configuration examples below describe that proposed interface.

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

## What worked on the A-19

The model author confirmed in-game that variable valve gear worked on the **LLW 440-19 American** with a separate prototype for Railroader **0.6.2**, LLW Volume 2 **0.5.3** and B&W **0.3.0**. The add-on supplied the three baked clips and blended them at the locomotive’s existing driver animation input. Wheel position selected the point in each cycle. The reverser selected the blend. The ordinary driver clip remained available for fallback.

The prototype was built for that one conventional locomotive using its exported rig. The Blender steps below show how an author can prepare equivalent motion. Section-based configuration, articulated playback, the ADK preview and export tools, and general sample packs remain planned for **0.4.0**, subject to change.

## What the three cycles mean

### Bake drivers and valve gear together

**Each of the three exported clips would contain both the driver rotation and the valve gear motion for one complete revolution.** You would reuse the same driver rotation in all three, with the reverser held at a different setting for each bake.

The wheels, rods, and valve gear can remain separate meshes or bones in your source rig. “Together” means their motion is recorded in the same clip; you do not need to join the objects, build three rigs, or hand-animate the wheel rotation three times. Separate actions or controls in your source project are fine if each final bake contains the complete assembly.

| Exported clip | Driver motion to include | Valve gear motion to include |
| --- | --- | --- |
| Forward | One complete revolution | Motion with the reverser held at full forward |
| Neutral | The same complete revolution | Motion with the reverser held centered |
| Reverse | The same complete revolution | Motion with the reverser held at full reverse |

For example, at 25% of the cycle, each driver must be at the **same crank angle in all three clips**, preserving the model's left/right quartering. The reverser-dependent valve gear poses would differ. That alignment lets the blend change the gear setting while keeping the wheels aligned.

**Neutral is still a moving cycle.** Wheels and connected rods must turn when the locomotive rolls in neutral. Forward, neutral, and reverse name the **reverser setting**, not the direction or speed of clip playback. Bake all three with the same reference direction of wheel rotation; the locomotive's actual wheel motion would determine whether they are sampled forwards or backwards.

### How the cycles would be used

For example, with the reverser halfway toward forward, the proposal blends neutral and forward equally. All clips are sampled at the same wheel phase:

| Reverser | Reverse weight | Neutral weight | Forward weight |
| --- | --- | --- | --- |
| -1 | 1 | 0 | 0 |
| -0.5 | 0.5 | 0.5 | 0 |
| 0 | 0 | 1 | 0 |
| 0.5 | 0 | 0.5 | 0.5 |
| 1 | 0 | 0 | 1 |

Wheel phase and reverser position are independent inputs: **wheel motion chooses the point in the cycle; the reverser chooses the blend between cycles**. Moving the reverser while stopped should reposition the gear at the current wheel angle. Rolling backwards with the reverser forward should follow the wheels' actual motion.

While the feature is active, the blended cycles would animate the complete driver assembly. The existing ordinary driver clip would be retained for fallback, rather than playing over the same bones at the same time. You would not set up a drivers-only animation and a separate valve-gear animation to compete over those bones.

## 1. Prepare and bake your model

### Check the parenting in Blender

Open a working copy of the `.blend`. In the Outliner, expand the engine section and trace two paths. Starting at a driving wheel, find the crank pins that turn with it. Starting at the exterior lift shaft, find the pins that carry the valve-gear hangers. Turning the reverser should lift or lower those hangers while the axle stays put. The rods that span moving pins usually need a constraint or a rigged joint to keep both ends connected.

Here is the relevant part of the **LLW 440-19 American** Outliner. Indentation means *is a child of*. The names identify parts on this model only.

```text
Main
├── Driver1                      driving axle
│   └── axle and eccentric pins  turn with the wheel
├── Reverser                     control empty
│   ├── Reversing Yoke.001
│   └── Cylinder.094
└── Cylinder.090                 exterior lift shaft
    ├── Empty.019                hanger pivot on one side
    │   └── Armature.002
    └── Empty.032                hanger pivot on the other side
        └── Armature.005
```

On the A-19 the reverser empty and lift shaft are **siblings**. Their origins lie along the same transverse shaft axis at different positions across the locomotive. Rotating the empty carries its yoke with it. The hanger pivots inherit rotation from the other sibling. For the prototype we kept those parents and made the lift shaft take the chosen reverser angle during the bake. In the source rig, each hanger armature’s two eccentric rods already had inverse kinematics (IK) targets at pins on the driving axle. That gives a rod one end carried by the linkage and a target for its wheel end. We preserved this arrangement and baked the resulting rod poses.

On a new object rig, put the shaft’s origin on its physical bearing. Place a hanger pivot at each lift-arm pin. To attach a loose pivot, select it first in Object Mode, Shift-select the shaft last, then use **Ctrl-P → Object (Keep Transform)**. Repeat on the other side. Locate each wheel-side target at its crank pin and parent it to the rotating wheel or eccentric. Aim or constrain the rod bones to those targets. If your rig already makes these parts follow the correct pins, keep its parents and constraints. [Blender object parenting](https://docs.blender.org/manual/en/4.5/scene_layout/object/editing/parent.html)

**Check your own rig at a fixed wheel frame.** Move the reverser between its endpoints and watch a hanger pivot on each side. Then hold the reverser and scrub the drivers through a turn. The crank pins should orbit the axle, the hangers should carry the links, and the rod ends should meet their pins throughout. If only the cab handle or upper reversing arm responds, follow the Outliner to the parent that actually carries the exterior pivots.

If that shaft needs a control, one Blender option for aligned local axes is a **Copy Rotation** constraint on the shaft. Target the reverser empty, enable the shaft axis only, and use **Local Space** for both target and owner and **Replace** for the driven angle. Check the pivot, neutral offset and direction on your rig before using those settings. A shaft already parented to a rotating control inherits its rotation. Adding the same rotation a second time can double its travel. Keep the established output hierarchy so the ordinary driver clip and all three new clips bind to the same paths. [Blender Copy Rotation options](https://docs.blender.org/manual/en/4.5/animation/constraints/transform/copy_rotation.html)

### Bake one wheel revolution at each reverser setting

1. **Protect the ordinary driver action.** Save a working copy for the bake. Find one complete revolution of the existing drivers, including the matching end pose. For a cycle on frames 0–60, frames 0 and 60 show the same crank position after one full turn. Keep the frame rate, range, starting crank angle, rotation direction and left/right quartering for all three passes.
2. **Hold the reverser while the drivers play.** Use the rig’s full-forward position. If a separate action animates the reverser empty, sample its endpoint, then mute its rotation curve or strip in the working copy and set the empty to that local angle. Leave the driver action and linkage constraints active. Scrub from start to end and verify that the setting holds. On the A-19 the three local X settings were **+25° forward, 0° neutral and −25° reverse**. Determine direction from your own rig and control mapping.
3. **Bake the moving parts.** Select the export objects and the mechanism bones that supply the original driver motion and the new gear motion on both sides. In Blender use **F3 → Bake Action**. Set the revolution’s start and end frames, **Frame Step 1** and **Visual Keying**. Choose **Pose** for bones, **Object** for animated objects or empties, or both for a mixed rig. Include the transform channels the rig uses, including scale for a stretching linkage. Leave **Clear Parents** and **Overwrite Current Action** off. Name or save the resulting take as forward. [Blender Bake Action](https://docs.blender.org/manual/en/4.5/editors/nla/editing/strip.html#bake-action)
4. **Repeat from the same source rig.** Make fresh passes at neutral and full reverse. Starting each from the intact source keeps the previous bake from driving the next one. Bake every ordinary driver property and the same exterior gear properties in each pass, including properties held constant for that setting. Cab controls and brakes keep their own tracks.
5. **Play each bake by itself.** In a disposable export copy, isolate the baked actions and disable source drivers, constraints or NLA tracks that would apply the same motion again. Scrub through a full turn and across the loop seam. Compare forward, neutral and reverse at the same quarter-turn frame. The crank pins should coincide across the three takes, while the gear should show the three settings. In neutral the rods should still move through a revolution.

### Export the three takes

For a rig with several armatures or separately animated objects, a simple route is **one animation FBX per setting**. In each export copy, use the baked actions for that setting across all its animated objects. Export the same section root, parent chain and output names using the same FBX axis and unit settings as the ordinary model. Set the scene range to the single revolution. In **File → Export → FBX → Animation**, enable animation and turn off **NLA Strips** and **All Actions** so the scene exports as one take. A sampling step of 1 and simplification of 0 preserve the mechanical motion for the first comparison.

If your rig stores each complete setting in a single armature action, you can instead export one FBX with three named NLA strips. Use Railroader’s multi-clip settings and keep each strip to the same revolution. [Railroader’s Blender and FBX workflow](https://docs.railroadergame.com/modding/blender-workflow/)

On import, check that each take plays on the **original prefab** as a Generic looping clip. Watch both sides and check the clip’s animated properties. FBX export can add keys to uninvolved bones. Resolve overlaps with cab or brake tracks in the export setup before mapping the clips. For an articulated locomotive, repeat the process for each independently driven section.

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

Prepare a set of three cycles for **each independently animated engine section**. Each set includes that section's drivers and valve gear together. A locomotive with a rear engine in the main body and one additional front engine would normally have six cycles, plus its ordinary driver animations.

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

At intermediate reverser settings, blending the three clips can pull a rod end away from its pin even when each baked cycle fits. On the A-19, offline sampling predicted a gap of up to about 8 mm at half gear. In preview, follow the same pin through a whole revolution at half forward and half reverse. Check the result in-game from both sides.

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

For the planned general workflow, check the exported pack in-game as well as in the preview.

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
