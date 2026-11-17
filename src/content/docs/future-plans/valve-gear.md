---
title: Valve gear authoring proposal
description: Review the proposed three-cycle valve gear workflow and Railroader ADK companion planned for Bells and Whistles 0.4.0, subject to change.
---

:::caution[Planned for 0.4.0 — always subject to change]

This is an **author-review proposal for Bells and Whistles 0.4.0**. All future plans are subject to change, including the target version, scope, field names, menu names, and timing.

The general runtime and companion are in development. Author steps below refer to the 0.4.0 development build. The separate A-19 playtest and the general workflow have different validation status.

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

### What the practice pack verified in the ADK

An automated headless editor test in a clean official Railroader ADK (Unity **6000.3.26f1**) previewed one complete wheel turn on both original practice locomotives at full reverse, half reverse, neutral, half forward and full forward. It checked independent front and rear wheel speeds on the articulated engine and compared each section with its ordinary driver animation. The ADK built both locomotives into one player pack. The test reopened the pack and checked each section’s exported clips.

A second test started with a one-sided Blender practice rig with one wheel action (`Drivers`) and one control empty (`Reverser`). Blender **4.5.16** reopened the ordinary, reverse, neutral and forward FBXs and checked every frame of the wheel turn. The same four FBXs went into a clean official ADK with Unity **6000.3.26f1**. The companion previewed **366 poses** without changing the source prefab. The ADK built the player pack and the test reopened its bundle to check the exported clips.

The A-19 prototype remains the only model-author report from inside the game. The reusable 0.4.0 runtime still needs in-game testing, including whether the same exported pack plays its ordinary animation when B&W is disabled or absent. A first-time author walkthrough and a test on the actual Virginian AE also remain open.

## Starting with one wheel animation

A **clip** is a recording of how parts move. If you already have one working wheel animation and a reverser control in Blender, you have the starting material. For the A-19 demonstration, the author supplied that original rig. The three recordings used by the demonstration were made afterwards.

Imagine filming the same side of the engine three times. Leave the wheels at the same starting angle for each take. Put the reverser in reverse, turn the wheels once, and record the wheels and rods together. Repeat with the reverser in the middle, then in forward. In Blender, **baking** saves the positions and rotations from each take so the game can play it. You animate the wheels once and reuse that wheel action for all three recordings. Keep the original wheel animation as well.

| What you already have | What you make in Blender | What you choose in the ADK |
| --- | --- | --- |
| One wheel revolution and a way to set the exterior gear | Three complete recordings of that revolution, each at a different gear setting | Drag each recording to its matching **Reverse**, **Neutral**, or **Forward** box |
| A working ordinary driver clip | Keep that clip in your locomotive | The tool reads **Ordinary driver** from the pack automatically |

If you only have the original imported wheel clip in Unity, go back to the source rig. A clip with the gear fixed in one position contains no recording of what your linkage does at the other two settings. You can reuse three finished clips from a sister locomotive if they line up on its model through a whole turn.

**Players use one pack.** A player with compatible B&W can see the variable gear. A player without it should see the same locomotive with its ordinary wheel and rod animation. The companion is an authoring tool. Players should never need it.

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

If that shaft needs a control, one Blender option for aligned local axes is a **Copy Rotation** constraint on the shaft. Target the reverser empty, enable the shaft axis only, and choose **Replace**. Check the constraint at a fixed wheel frame. On the A-19, the parented reverser and shaft can use **Local Space** for both target and owner. On the axis-aligned Blender practice rig, the reverser empty has no parent. Using Local Space for both left the shaft still. **World Space** for that target and **Local Space** for the shaft made the hanger follow the reverser. Verify the pivot, neutral position and direction on your own rig. A shaft already parented to a rotating control inherits its rotation. Adding the same rotation a second time can double its travel. Keep the established output hierarchy so the ordinary driver clip and all three new clips bind to the same paths. [Blender Copy Rotation options](https://docs.blender.org/manual/en/4.5/animation/constraints/transform/copy_rotation.html)

### Bake one wheel revolution at each reverser setting

1. **Protect the ordinary driver action.** Save a working copy for the bake. Find one complete revolution of the existing drivers, including the matching end pose. For a cycle on frames 0–60, frames 0 and 60 show the same crank position after one full turn. Keep the frame rate, range, starting crank angle, rotation direction and left/right quartering for all three passes.
2. **Hold the reverser while the drivers play.** Use the rig’s full-forward position. If a separate action animates the reverser empty, sample its endpoint, then mute its rotation curve or strip in the working copy and set the empty to that local angle. Leave the driver action and linkage constraints active. Scrub from start to end and verify that the setting holds. On the A-19 the three local X settings were **+25° forward, 0° neutral and −25° reverse**. Determine direction from your own rig and control mapping.
3. **Bake the moving parts on both sides.** In Pose Mode, select the bones that move the wheels and gear. Use **F3 → Bake Action**, choose **Pose** and **Only Selected Bones**, and enable **Visual Keying** to record the motion produced by constraints. Set the start and end of your revolution and **Frame Step 1**. Include the transform channels your linkage uses, including scale for rods that stretch. Leave **Clear Parents** and **Overwrite Current Action** off.

   If separate objects or empties also carry motion, bake them in a second pass. Switch to **Object Mode**, select those objects, and choose **Object** as the only **Bake Data** option. Use the same held angle, frame range and Visual Keying. Blender 4.5’s selected-bone bake skips separate empties even if you also tick Object. If the first bake changes how the rig moves, make the second pass from the intact working copy and use both sets of baked actions together for this setting. [Blender Bake Action](https://docs.blender.org/manual/en/4.5/editors/nla/editing/strip.html#bake-action)
4. **Repeat from the same source rig.** Make fresh passes at neutral and full reverse. Starting each from the intact source keeps the previous bake from driving the next one. Bake every ordinary driver property and the same exterior gear properties in each pass, including properties held constant for that setting. Cab controls and brakes keep their own tracks.
5. **Play each bake by itself.** In a disposable export copy, isolate the baked actions and disable source drivers, constraints or NLA tracks that would apply the same motion again. Scrub through a full turn and across the loop seam. Compare forward, neutral and reverse at the same quarter-turn frame. The crank pins should coincide across the three takes, while the gear should show the three settings. In neutral the rods should still move through a revolution.

### Export the three takes

For a rig with several armatures or separately animated objects, a simple route is **one animation FBX per setting**. In each export copy, use the baked actions for that setting across all its animated objects. Export the same section root, parent chain and output names using the same FBX axis and unit settings as the ordinary model. Set the scene range to the single revolution. In **File → Export → FBX → Animation**, enable animation and turn off **NLA Strips** and **All Actions** so the scene exports as one take. For an animation-only export, include the wheels, rods and gear for this section and their required parent hierarchy. Keep the same names and parent paths as the ordinary clip. In this copy, **Sampling Rate 1** and **Simplify 0** retain the held gear position as well as the wheel motion.

If the cab, brakes or opposite engine share the same armature, **Selected Objects** includes that entire armature. With **Simplify 0**, the FBX can contain keys for every exported bone, including stationary cab controls. Exclude unrelated branches in the animation-only copy, then check the three clips in the ADK. Keep the original model intact. [Blender 4.5 FBX exporter](https://github.com/blender/blender/blob/v4.5.0/scripts/addons_core/io_scene_fbx/fbx_utils.py#L1175-L1204)

If your rig stores each complete setting in a single armature action, you can instead export one FBX with three named NLA strips. Use Railroader’s multi-clip settings and keep each strip to the same revolution. [Railroader’s Blender and FBX workflow](https://docs.railroadergame.com/modding/blender-workflow/)

On import, check that each take plays on the **original prefab** as a Generic looping clip. Watch both sides and check the clip’s animated properties. FBX export can add keys to uninvolved bones. Resolve overlaps with cab or brake tracks in the export setup before mapping the clips. For an articulated locomotive, repeat the process for each independently driven section.

### Keep control animations separate

Review any existing cab reverser, power-reverser, brake, or [Driven Animation](/BellsAndWhistles-Docs/driven-animation/) clip that touches the same mechanism. A separate animation must not compete for properties owned by the three-cycle blend.

A cab lever can keep its own animation when it moves separate bones. If an existing clip also keys the valve gear, separate those tracks during authoring and check the resulting ordinary fallback animation too. The proposed importer would identify conflicts, not silently delete curves. Railroader documents this overlap limitation in its [PropertyAnimation guidance](https://docs.railroadergame.com/modding/components/propertyanimation/).

## 2. Import the cycles and map engine sections

1. Drag your animation FBX files into your pack’s folder in the Unity **Project** window. Select an FBX file. In its **Inspector**, open **Rig**, set **Animation Type** to **Generic**, then click **Apply**.
2. Open the **Animation** tab and enable **Import Animation**. In **Clips**, select the take for your wheel revolution, give it a recognizable name, and enable **Loop Time**. Repeat for any other takes in that FBX, then click **Apply**. Repeat these import settings for each animation FBX. [Unity animation import settings](https://docs.unity.com/en-us/engine/6000.3/manual/assets-and-media/asset-types/models/importing/class-animation-clip)
3. In the **Project** window, click the small arrow next to the FBX. Find the **animation clip** with the name you just set. That child asset is what you drag to **Reverse**, **Neutral** or **Forward** in the companion window. The practice pack supplies these clips as separate assets that you can drag directly.

The companion finds the ordinary driver clip in the section’s existing `AnimationMap`. A map pairs a name with an animation clip, and the paths recorded by the clip start at the object carrying that map and its Animator. When you review your three assignments and click **Apply** in the companion, it writes the new map entries for you. Leave the working ordinary entry in place. [Railroader AnimationMap placement](https://docs.railroadergame.com/modding/asset-maps/)

A conventional locomotive might have these names in its map.

| Purpose | Example map name |
| --- | --- |
| Existing ordinary driver animation | `Drivers` |
| Forward cycle | `ValveGear.Forward` |
| Neutral cycle | `ValveGear.Neutral` |
| Reverse cycle | `ValveGear.Reverse` |

The ordinary wheel animation reference would remain `Drivers`; adding this feature should not replace the pack's fallback setup.

### Articulated locomotives

Think of the rear and front as two locomotives sharing one reverser handle. The handle tells both which gear setting to use. Each set of wheels tells **only its own rods** where they are in the revolution. Make three takes for the rear, then three for the front, using each section’s original wheel action.

The installed **Virginian Class AE** gives a concrete example. The names below come from its locomotive definition. Its source rig and six finished takes still need author review.

| Which part you are recording | Model part | Ordinary wheel clip to keep | Takes you assign |
| --- | --- | --- | --- |
| Rear engine under the main body | `Main` | `Back-Drivers` | Rear reverse, rear neutral, rear forward |
| Front engine, shown in the tool as `low_pressure` | `Front` | `Front-Drivers` | Front reverse, front neutral, front forward |

In Blender, leave each engine’s wheels, rods and gear under their existing section. For each engine, use the same animation root as its ordinary driver clip. For example, expand `Front` in the Unity Hierarchy. If a child inside `Front` has the Animator and AnimationMap that play `Front-Drivers`, that child is the animation root. Bake the front takes with the same paths relative to that child. Leave the working map on that object and keep its name and parent. The tool reads `low_pressure` from the locomotive definition. Each section has its own list of clips, and the same map name can refer to a different recording in each list. [Railroader’s articulated locomotive structure](https://docs.railroadergame.com/modding/definitions/articulatedsteamlocomotive/)

**Try this in preview.** Select both sections. Set rear speed to 0 RPM and the front to 12 RPM. Press **Play** and watch the rear crank pins while the front wheels and rods turn. Swap the speeds, then try two different speeds together. With both speeds at zero, move the reverser. The gear on each section should change setting while its wheels stay parked. Keep the wheel quartering in the original wheel animation. Railroader supplies the section’s phase offset.

With B&W unavailable the rear should play `Back-Drivers` and the front should play `Front-Drivers`. With B&W available, a bad clip assignment on one section should fall back on that section; the correctly configured section should keep working.

## 3. Configure the ADK companion

The following steps describe the **0.4.0 development companion** for authors with a supplied build.

**Updating a pack you already have?** If you changed the locomotive in Railroader’s Definition Editor since the last ADK build, bring those edits into Unity first. Open **Railroader → Asset Packs**, select your pack and review the listed differences. Click **Pull** to bring the in-game edits into your project. Then open the valve gear window and click **Refresh packs** so you configure the latest locomotive definition. [Railroader’s pack workflow](https://docs.railroadergame.com/modding/adk/#asset-pack-workflow)

1. Open your Railroader ADK project. In Unity’s **Window → Package Management → Package Manager**, use **+ → Install package from tarball** and choose the supplied companion `.tgz`. Open **Railroader → Bells and Whistles → Valve Gear**.
2. To practice first, use **Railroader → Bells and Whistles → Create Valve Gear Practice Pack**. The creation dialog calls it **Valve Gear Practice**. In the Valve Gear window, click **Refresh packs**, choose its folder `bw-valve-gear-practice` under **Pack**, then select **Valve Gear Practice – Single** under **Locomotive**.
3. Check **Configure Main body**. The window fills in **Ordinary driver** from the pack. In the **Project** window, open `Assets/AssetPacks/bw-valve-gear-practice` and drag `RearReverse` to **Reverse**, `RearNeutral` to **Neutral**, and `RearForward` to **Forward**. For your own engine, choose its pack and locomotive, check the model shown, then expand each imported FBX and drag its named clip into the matching slot.
4. For **Valve Gear Practice – Articulated**, check both **Main body** and **low_pressure**. Use the three `Rear` clips for the main body and the three `Front` clips for the front. Test the two speeds independently as described above.
5. Click **Validate and preview**. If the tool names a missing part, check that you chose the clip and model for the same section. Turn on **Compare ordinary driver** to see the ordinary animation at the same wheel position.
6. Choose **Review and apply to pack**. Check the locomotive name, the ordinary driver and the three assignments for each selected section. Review the listed file changes, then click **Apply**. **Save profile** keeps your selections in the project for later. When the preview looks right, [build the player pack](#6-build-test-and-distribute).

**If you received the optional Author Starter**, you can try the Blender model with its ordinary driver already connected. With the development companion installed:

1. In your ADK project, open `Assets`. If `AssetPacks` does not exist yet, create a folder named `AssetPacks` inside `Assets` first. In File Explorer, open the starter’s `ADK` folder. Copy the entire `bw-blender-import-practice` folder **and** its adjacent `bw-blender-import-practice.meta` file into your ADK project’s `Assets/AssetPacks` folder. Keep the files and their `.meta` files together so Unity can find the existing clip references.
2. Return to Unity. Open **Railroader → Bells and Whistles → Valve Gear**, click **Refresh packs**, choose `bw-blender-import-practice` under **Pack** and **Blender Valve Gear Practice** under **Locomotive**. Check **Configure Main body**. **Ordinary driver** should show `OrdinaryDrivers`.
3. In the **Project** window, open the pack’s `Takes` folder. Expand `Reverse.fbx`, `Neutral.fbx` and `Forward.fbx`. Drag the named clip inside each to the matching slot. Use **Validate and preview**, then **Review and apply to pack** when ready.

For a second engine, select its definition and assign its recordings. If it shares the first model’s rig, preview its motion before reusing those clips. You can author another engine with the same B&W build.

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

At intermediate reverser settings, blending the three clips can pull a rod end away from its pin even when each baked cycle fits. On the one-sided Blender practice mechanism, the link met both pins at reverse, neutral and forward. At half gear, the largest measured gap was **22.8 mm at the hanger** and **15.1 mm at the crank**. These measurements describe that practice rig only. On the separate A-19 prototype, offline sampling predicted a gap of up to about 8 mm at half gear. In your preview, follow **both ends** of each link through a full turn at half forward and half reverse, then check each side in-game.

:::

## 5. Review the proposed exported configuration

**Read-only example.** If you used **Apply**, you can skip this section. The companion writes the entries for you and keeps the ordinary driver assignment. The example shows what an articulated locomotive’s two engine sections look like inside `definition.components`. These fields are planned for 0.4.0 and may change.

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

`Scripts/Data.rl` is a file Railroader reads as it loads your pack. **Apply** creates it if needed. If the pack already has a startup function, the companion adds a check there for compatible B&W support and keeps the pack’s other instructions. Players without that support get the ordinary driver animation.

If **Apply** stops with a message about `Data.rl`, keep the original file. Send the exact message, the pack name and the locomotive name to whoever maintains your pack’s script or to the companion maintainer. The review stops before changing the pack when it cannot safely add the check.

The intended results are:

| Installation or configuration | Intended result |
| --- | --- |
| Compatible B&W and a valid setup | Variable valve gear follows driver phase and reverser |
| B&W absent or too old to provide this feature | Ordinary animation; no unresolved valve gear Script errors |
| Invalid clips or unsupported runtime integration | A useful diagnostic and ordinary animation retained |

The exact capability guard and minimum B&W requirement would be documented with the implementation. Installing B&W 0.3.0 is not intended to activate this proposal.

## 6. Build, test, and distribute

1. After **Apply**, open **Railroader → Asset Packs**, select your pack and click **Build**. If this is your first build, set **Paths → ModDev** to `Documents/Railroader/ModDev` first. If Build reports that it would overwrite newer in-game work, cancel and follow the **Pull** step above. Refresh the pack and recheck your assignments before applying again.
2. Open the ModDev folder you selected. Zip **only your pack’s built folder** there, with its contents together. Players extract that folder into `Documents/Railroader/Mods`. The editor companion, authoring profile and Blender project stay with the author. Players can install compatible B&W separately to turn on variable valve gear. [Railroader’s build and distribution instructions](https://docs.railroadergame.com/modding/adk/)

Keep the editable source pack and authoring profile in your own project.

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
