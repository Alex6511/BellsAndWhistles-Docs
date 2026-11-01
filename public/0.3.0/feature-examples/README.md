# Native authoring examples — 0.3.0

These are declaration templates, not finished rolling stock or scenery. Copy the named components and matching load slots into definitions owned by your equipment pack. Supply models, locomotive physics, load targets, textures, placement, native industries and any audio assets. The example pack contains no art or recording and should not be installed as playable equipment.

Definitions.json covers geared coal, geared oil and its tender, wood and its tender, an oil tank engine, finite oil/wood facilities, and a geared engine with custom audio. Replace the bwexample identities and industry bindings with your own. Preserve unrelated components of your real definitions. Capacities here are illustrative; no inventory is seeded.

Oil uses toolshed/bunker-c in gallons. Wood uses rr/pulpwood with the installed Load definition's native units. Water uses a separate rr/water gallon slot. Nonempty coal or unknown loads are never relabeled automatically.

For custom audio, export your own AudioClip as author-gear in the declaring pack's Bundle and use ./author-gear. Omit audio.asset for silent mechanical noise while physics and chuffs continue. Qualified anotherauthor/gear references require the exact supplying package in dependencies.required. No recording from the old provider is included.

Scripts/Inspector.rl is an optional car Script (bwexample/Inspector) that imports the public APIs and disposes observers on object unload. Main.rl reads capabilities at world load. Data.rl.example patches one named component; rename it to Data.rl only after substituting your definition ID. Data.rl does not run in the editor: validate direct authored definitions there too.

Facilities bind existing native industry storage. Authors configure receiving unloaders, stock, placement and geometry. Each B&W facility model must omit old Toolshed service components. Multiple outlets may share a storage ID and debit the same native inventory once per transfer.

See the settings/API coverage table for defaults, units, authority and persistence. Offline native serialization and Relay checks do not replace editor, save/reload and multiplayer acceptance of a finished pack.
