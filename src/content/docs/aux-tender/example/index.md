---
title: "Example: Virginian AE aux tender"
---

These are the exact changes for the aux tender in the Virginian AE 2-10-10-2 pack (`eilelwen/vng-ae-210102`, version 1.0.0), whose aux car is `eilelwen/vgn-ae-at`. The car already has the 20,000-gallon `rr/water` slot it needs.

## Make the changes

1. **Fix the water slot index.** Set `slotIndex` to `0` on the `lt-water` LoadTarget and the `la-water` LoadAnimation. You can do this in the editor or in `Definitions.json`.

    Both components have `"slotIndex": 1`, copied from the tenders, where water comes after coal. But the aux car's only load slot is water, at index 0.

    Water columns skip a target whose slot index is past the last slot, so the car can't be filled. The game logs `target LoadTarget Water index 1 is out of range`.

2. **Add the Script component.** In `Definitions.json`, find the `components` of `eilelwen/vgn-ae-at`. Add the `aux-tender` entry from [aux-tender-component.json](/BellsAndWhistles-Docs/aux-tender/example/aux-tender-component.json), next to the existing `ctrl-bodytext` components. Keep `"enabled": false`.

    In the editor: Add Component → Script, ID `aux-tender`, Script Asset `alex6511/AuxTender`, Enabled unticked. See the [in-game editor guide](/BellsAndWhistles-Docs/editor-authoring/#aux-tender).

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

    <a href="/BellsAndWhistles-Docs/aux-tender/example/Scripts/Data.rl" download="Data.rl">Download Data.rl</a>

## Check the result

1. Load a game without Bells and Whistles. The aux car should appear and work as a normal water car, with nothing new in the Messages panel.
2. Install Bells and Whistles. The Customize panel shows **Auxiliary Tender**. With the aux car coupled behind the AE's tender, the tender refills from it.
