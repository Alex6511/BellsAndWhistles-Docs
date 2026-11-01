---
title: "Horn and Whistle"
---

Some locomotives carried both a steam whistle and an air horn. The Southern Pacific GS-4 is one example.

A Railroader locomotive's definition can have both a `Whistle` and a `Horn` component. The game's **Customize** window then shows a sound section for each.

However, the game gives each locomotive only one **Whistle/Horn** control. Without Bells and Whistles, only one instrument ever sounds: whichever finished loading last.

With Bells and Whistles, players choose which instrument that control plays.

## What players get

On a locomotive with both instruments, the **Customize** window gets a **Horn and Whistle** section. Its **Whistle/Horn Plays** setting is either **Whistle** or **Horn**.

- The Whistle/Horn key, the cab controls and anything else that sounds the horn play the instrument you picked. The other one stays silent.
- At crossings, Auto Engineer shapes its signal for the instrument that plays, as the game does for an ordinary diesel or steam engine.
- A steam locomotive starts on its whistle, and any other locomotive starts on its horn. The locomotive's pack can [choose another starting instrument](#choose-the-starting-instrument).
- While the horn plays, the whistle's steam plume stays off.
- If the instrument you picked is switched off, for example by a paint scheme, the other one plays. The section then says so.
- The game's own **Whistle** and **Horn** sections still choose what each instrument sounds like.

The choice is stored on the locomotive, so it's saved with your game. In multiplayer, it's shared with the other players. Changing it needs the same permission as the game's own horn and whistle settings.

Like the rest of 0.3.0, this feature hasn't been tested in a running game yet.

## Give a locomotive both instruments

Add a `Whistle` component and a `Horn` component to the locomotive's definition. Both are the game's own component kinds.

```json
"components": {
  "whistle": {
    "kind": "Whistle",
    "name": "Whistle",
    "defaultWhistleIdentifier": "rr/wh-5-drg-st"
  },
  "horn": {
    "kind": "Horn",
    "name": "Horn",
    "defaultHornIdentifier": "rr/horn-leslie-rs5t"
  }
}
```

This example uses the 0.6.0 object form of `components`. [Object and array forms of components](/BellsAndWhistles-Docs/authors/#object-and-array-forms-of-components) explains both.

`defaultWhistleIdentifier` and `defaultHornIdentifier` set the sound each instrument starts with. If you leave one empty, the game uses the sound shown in the example. Players can pick other sounds in **Customize**.

Either component can start switched off with `"enabled": false`. A Relay script can switch it on or off later, for example with `car.components["horn"].enabled = true`. A paint scheme can switch off an instrument that starts enabled, but it can't switch on one that starts disabled.

The locomotive still gets the **Horn and Whistle** section. While the chosen instrument is switched off, the other one plays.

If a locomotive has two horns or two whistles, only one of them plays, as in the game without Bells and Whistles.

## Choose the starting instrument

You don't need to set anything. Without a setting, a steam locomotive starts on its whistle and any other locomotive on its horn.

To start on the other instrument, add a `HornSelector` [carrier](/BellsAndWhistles-Docs/authors/#what-a-carrier-is) to the locomotive. It is a `Script` component, and its `parameters` hold the setting.

```json
"horn-selector": {
  "kind": "Script",
  "name": "Horn Selector",
  "scriptAsset": "alex6511/HornSelector",
  "parameters": { "default": "horn" },
  "enabled": false
}
```

| Parameter | Default | Meaning |
| --- | --- | --- |
| `default` | `whistle` on a steam locomotive, `horn` on any other | The instrument the Whistle/Horn control plays until a player picks one: `whistle` or `horn`, in any letter case. Bells and Whistles logs any other value and ignores it. |

A player's choice in **Customize** always wins over `default`.

Ship the carrier with `"enabled": false`, as in the example. Bells and Whistles reads it either way. The game never runs a disabled component, so players without Bells and Whistles get no script error.

This differs from the other carriers. Bells and Whistles ignores a `TenderBell` or `FlexibleConnector` carrier that is disabled.

:::tip[Use the in-game editor]

You can add both instruments and the carrier in Railroader's in-game car editor. [Horn selector](/BellsAndWhistles-Docs/editor-authoring/#horn-selector) gives the steps.

:::

## Add Bells and Whistles to `Info.json`

List `alex6511/bells-and-whistles` under `dependencies.optional` in your pack's `Info.json`. [Set up your pack's `Info.json`](/BellsAndWhistles-Docs/authors/#set-up-your-packs-infojson) shows the entry.

Without the mod, your locomotive still loads, but only one of its two instruments sounds. A `HornSelector` carrier shipped disabled adds nothing to the log.
