---
title: "Your own component kinds"
---

A content pack can add its own component kinds, such as `"kind": "acme.SignalLamp"`. They work like the game's built-in kinds:

- `Definitions.json` and `Data.rl` accept them.
- The in-game car editor lists them under **Add Component**, with a field for each setting.
- Saving in the editor keeps them.

Behind the scenes, each component of your kind runs a Relay script that your pack exports. Relay is Railroader's scripting language, used in `.rl` files. The script gets the component's settings in `parameters`, exactly as if you had written a `Script` component with those parameters. A custom kind gives you named, typed fields with defaults, so authors don't have to type parameter names by hand.

Bells and Whistles does the registering. The game itself has no way for a pack to add kinds.

## Before you choose this

A plain `Script` component can do everything a custom kind can do. Choose a custom kind only if the nicer editing is worth these costs:

- **Your pack needs Bells and Whistles.** Without it, the game can't read your `Definitions.json`, so none of your pack's definitions load. A `Script` component, by contrast, loads anywhere and only logs a script error.
- **No new abilities.** The script can do only what any Relay script can do. It can't create meshes, for example, or drive tender bells.
- **It may break after a game update.** The game has no public way to add kinds. Bells and Whistles changes some of the game's private lists instead, and a game update can change those. After an update, the mod's maintainers need to check compatibility again.
- **Kind names are shared by every loaded pack.** Each name must start with your pack's domain, so names from different authors can't clash.

## Set up a pack

This page's example is a complete pack. It adds a **Car Greeting** component that writes a message to the log when a car loads. Its files match the steps below:

1. [Info.json](/BellsAndWhistles-Docs/component-kinds/example/Info.json)
2. [ComponentKinds.json](/BellsAndWhistles-Docs/component-kinds/example/ComponentKinds.json)
3. <a href="/BellsAndWhistles-Docs/component-kinds/example/Scripts/CarGreeting.rl" download="CarGreeting.rl">Scripts/CarGreeting.rl</a> (download)
4. [car-greeting-component.json](/BellsAndWhistles-Docs/component-kinds/example/car-greeting-component.json)

### 1. Set up Info.json

In your pack's `Info.json`, list Bells and Whistles as `required`. Players who don't have it then get a clear "missing mod" message instead of a `Definitions.json` error. Also export the script that runs your kind:

```json
"dependencies": {
  "required": ["rr/game", "alex6511/bells-and-whistles >=0.3.0"]
},
"exports": {
  "./CarGreeting": "Scripts/CarGreeting.rl"
}
```

### 2. Declare the kind

Put a `ComponentKinds.json` file next to `Info.json`:

```json
{
  "kinds": [
    {
      "kind": "example.CarGreeting",
      "displayName": "Car Greeting",
      "script": "./CarGreeting",
      "appliesTo": ["car"],
      "settings": [
        { "name": "greeting", "type": "text", "default": "Hello from", "description": "Written to the log before the car's name." },
        { "name": "repeat", "type": "wholeNumber", "default": 1 },
        { "name": "delaySeconds", "type": "decimal", "default": 2.5 },
        { "name": "asWarning", "type": "trueFalse", "default": false },
        { "name": "tags", "type": "textList", "default": ["example"] }
      ]
    }
  ]
}
```

| Field | Required | Meaning |
| --- | --- | --- |
| `kind` | yes | The name used in `"kind"`. It must start with your pack's domain and a dot, then a capital letter, using only letters and digits. For pack `example/car-greeting` the domain is `example`, so `example.CarGreeting` is valid. |
| `displayName` | no | The name in the editor's **Add Component** menu. Use words made of letters and digits, each starting with a capital letter. Without it, the menu shows the part of `kind` after the dot, split into words. |
| `script` | yes | The exported Relay module that runs the component, written like a `Script` component's `scriptAsset`: `domain/Export`, or `./Export` for your own pack. |
| `appliesTo` | no | Where the editor offers the kind: `car` (the default), `prop`, `truck`, or `any`. Give one value or a list. |
| `settings` | no | The fields your script needs, in the order the editor shows them. |

Each setting has:

| Field | Required | Meaning |
| --- | --- | --- |
| `name` | yes | The name in `Definitions.json` and in `parameters`. Start with a small letter. The second character must be a small letter or a digit, so `hoseLength` works but `aBc` doesn't. Use only letters and digits, up to 64 characters. It can't be `kind`, `name`, `transform`, `parent` or `enabled`, because every component already has those. |
| `type` | yes | One of the types below. |
| `default` | no | The value used when a definition leaves the setting out. Without it, the default is empty text, `0`, `false` or an empty list. |
| `description` | no | Shown as a tooltip in the editor. |

| `type` | Holds | Example default |
| --- | --- | --- |
| `text` | text | `"Hello from"` |
| `wholeNumber` | a whole number | `3` |
| `decimal` | a number with a fractional part | `2.5` |
| `trueFalse` | `true` or `false` | `false` |
| `textList` | a list of text values | `["Body", "Lamp"]` |

Capital letters, spaces, dashes and slashes in `type` are ignored, so `whole number` and `true/false` work too.

### 3. Write the script

Write the script as you would for a `Script` component. Every setting is in `parameters`, under its `name`, with its type. Settings a definition leaves out have their defaults. The example's script reads all five of its settings this way:

<details>
<summary>Scripts/CarGreeting.rl</summary>


```text
// Example script for the "example.CarGreeting" component kind declared in ../ComponentKinds.json.
//
// Bells and Whistles runs it the way the game runs a Script component's script. The component's
// settings arrive in `parameters` with their declared types: text, whole number, decimal,
// true/false and list of text. Settings a definition leaves out have their declared defaults.

import log

var greeter = null

func onObjectLoad(car) {
    if greeter != null { return }
    greeter = Coroutine(() => {
        yield parameters["delaySeconds"]
        let text = "\(parameters["greeting"]) \(car.name) \(parameters["tags"])"
        for i in 0..<parameters["repeat"] {
            if parameters["asWarning"] {
                log.warning(text)
            } else {
                log.info(text)
            }
        }
    })
}

func onObjectUnload(car) {
    if greeter != null {
        greeter.stop()
        greeter = null
    }
}
```

<a href="/BellsAndWhistles-Docs/component-kinds/example/Scripts/CarGreeting.rl" download="CarGreeting.rl">Download CarGreeting.rl</a>

</details>

The game calls handlers such as `onObjectLoad(car)` at the same times as for a `Script` component.

### 4. Use the kind

In the in-game editor, choose **Add Component → Car Greeting**. Or write it in `Definitions.json`:

```json
"greeting": {
  "kind": "example.CarGreeting",
  "name": "Greeting",
  "greeting": "Good morning from",
  "repeat": 2,
  "tags": ["flatcar", "demo"]
}
```

`name`, `enabled`, `transform` and `parent` work as on any component. Settings left out, here `delaySeconds` and `asWarning`, get their defaults.

The kind can be used in any pack, not only in the one that declares it. A pack that uses another pack's kind should require both that pack and Bells and Whistles.

## When something is wrong

Bells and Whistles reads `ComponentKinds.json` from every enabled pack each time the game loads the mod set. Mistakes appear in the game's **Messages** panel under the declaring pack. A kind with a mistake is not registered. If any of your cars use that kind, your `Definitions.json` then fails to load as well, so fix the first message first.

A kind is refused when:

- its name doesn't start with the pack's domain, or the rest of the name isn't a capital letter followed by letters and digits;
- the game, Bells and Whistles or another pack already uses the name, even with different capital letters;
- `script`, `appliesTo` or a setting is missing or malformed, or a `default` doesn't match its `type`;
- two settings share a name.

You get a warning, but the kind still works, when:

- your `Info.json` doesn't require Bells and Whistles;
- no loaded pack exports the `script`. Each component then fails to start its script;
- the editor can't show your `displayName` exactly as written, or two kinds would appear under the same name;
- the file has a field Bells and Whistles doesn't know, which is usually a typo.

## Good to know

- Values in a definition must match the setting's type, as with the game's own kinds. For example, `"repeat": 2.5` for a `wholeNumber` setting stops the whole `Definitions.json` from loading.
- If you remove or rename a setting, existing definitions keep the old value. Saving in the editor keeps it too, but the script no longer receives it.
- Changes to `ComponentKinds.json` apply the next time the game loads the mod set, for example after a restart.
- Bells and Whistles' own features read real `Script` components only. A custom kind whose `script` is `alex6511/FlexibleConnector`, for example, does not draw a connector.
