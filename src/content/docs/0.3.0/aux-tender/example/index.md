---
title: "Example: Virginian AE aux tender"
editUrl: false
---

This worked example targets the aux tender in the Virginian AE 2-10-10-2 pack (`eilelwen/vng-ae-210102`, version 1.0.0), whose aux car is `eilelwen/vgn-ae-at`. The example assumes a single 20,000-gallon `rr/water` slot at index 0. Check your installed pack's definition before applying it; later pack revisions may already include the fix or use different IDs and slots.

## Make the changes

1. **Fix the water slot index.** Set `slotIndex` to `0` on the `lt-water` LoadTarget and the `la-water` LoadAnimation. You can do this in the editor or in `Definitions.json`.

    If these components have `"slotIndex": 1` while the aux car has only one water slot, they point past the end of its slot list. Set both to 0 for that layout.

    Water columns skip a target whose slot index is past the last slot, so the car can't be filled. The game logs `target LoadTarget Water index 1 is out of range`.

2. **Add the Script component.** In `Definitions.json`, find the `components` of `eilelwen/vgn-ae-at`. Add the `aux-tender` entry from [aux-tender-component.json](/BellsAndWhistles-Docs/0.3.0/aux-tender/example/aux-tender-component.json), next to the existing `ctrl-bodytext` components. Keep `"enabled": false`.

    In the editor: Add Component → Script, ID `aux-tender`, Script Asset `alex6511/AuxTender`, Enabled unticked. See the [in-game editor guide](/BellsAndWhistles-Docs/0.3.0/editor-authoring/#aux-tender).

3. **Add the load-order hint.** In `Info.json`, add `"load": { "after": ["alex6511/bells-and-whistles"] }`.

4. **Add Scripts/Data.rl.** Add this file to the pack. The pack's existing `Scripts/Main.rl` is unchanged.

    ```text title="Scripts/Data.rl"
    // Turns on the aux tender script only when Bells and Whistles provides it, so the car still
    // loads cleanly, with no warnings, for players who don't have that mod.
    func modifyDefinitions(definitions) {
        if definitions.getDefinition("alex6511/aux-tender-api-v1") == null { return }
        definitions.merge("eilelwen/vgn-ae-at", {
            "definition": { "components": { "aux-tender": { "enabled": true } } }
        })
    }
    ```

    <a href="/BellsAndWhistles-Docs/0.3.0/aux-tender/example/Scripts/Data.rl" download="Data.rl">Download Data.rl</a>

## Check the result

1. Load a game without Bells and Whistles. The aux car should appear and work as a normal water car, with nothing new in the Messages panel.
2. Install Bells and Whistles. The Customize panel shows **Auxiliary Tender**. With the aux car coupled behind the AE's tender, the tender refills from it.
