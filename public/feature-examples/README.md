# Native authoring examples — development after 0.3.0

These are declaration templates, not finished rolling stock or scenery. Copy the named components and matching load slots into definitions owned by your equipment pack. Supply models, locomotive physics, load targets, textures, placement, native industries and any audio assets. The example pack contains no art or recording and should not be installed as playable equipment.

Definitions.json covers geared coal, geared oil and its tender, wood and its tender, an oil tank engine, finite oil/wood facilities, and a geared engine with custom audio. Replace the bwexample identities and industry bindings with your own. Preserve unrelated components of your real definitions. Capacities here are illustrative; no inventory is seeded.

Oil uses toolshed/bunker-c in gallons. Wood uses rr/pulpwood with the installed Load definition's native units. Water uses a separate rr/water gallon slot. Nonempty coal or unknown loads are never relabeled automatically.

For custom audio, export your own AudioClip as author-gear in the declaring pack's Bundle and use ./author-gear. Omit audio.asset for silent mechanical noise while physics and chuffs continue. Qualified anotherauthor/gear references require the exact supplying package in dependencies.required. No recording from the old provider is included.

Scripts/Inspector.rl is an optional car Script (bwexample/Inspector) that imports the public APIs and disposes observers on object unload. Main.rl reads capabilities at world load. Data.rl.example patches one named component; rename it to Data.rl only after substituting your definition ID. Data.rl does not run in the editor: validate direct authored definitions there too.

Facilities bind existing native industry storage. Authors configure receiving unloaders, stock, placement and geometry. Each B&W facility model must omit old Toolshed service components. Multiple outlets may share a storage ID and debit the same native inventory once per transfer.

## Build an oil loader or wood shed

The new interchange supply patch and receiving helper belong to the unreleased follow-up, not the published 0.3.0 ZIP. Use the matching development build for these examples.

1. In your map pack, create a receiving siding and a locomotive servicing position. Give the map area and each industry stable IDs. A receiving track is where freight cars unload; the prop outlet is where a locomotive or tender refuels.
2. Copy the oil and/or wood industry from `FuelLoaders.MapPatch.json`. Replace `bwexample/area` with an existing area ID, replace the two depot IDs consistently, set the industry's world position, and replace the `YOUR-...-TRACK` locations with real track locations in your map. Track locations use `segment|a-or-b|distance`. The spans must cover the receiving cars. Do not install the placeholder coordinates.
3. Copy the matching `finite-oil-facility` or `finite-wood-facility` prop from `Definitions.json` into your pack and supply its model. Its `FuelStorage.industry` must match the receiving industry. Place one instance at the service position with the native map editor or your map pack. Point `FuelOutlet.position` at the hose/chute in local metres, then set its reach and rate. Give every placed facility its own storage and outlet IDs.
4. Place `FuelLoaders.MapPatch.json` at your pack root and merge `Scripts/FuelLoaders.Data.rl.example` into your existing `Scripts/Data.rl`. Its JSON merge preserves unrelated dictionary entries but replaces arrays at the same path, so use your own component IDs. `Data.rl` runs when loading the map, not in the editor: author and inspect the prop directly there.
5. Buy Bunker-C using the game's native Buy destination on an empty or partly filled compatible tank car (`TM`) at an available interchange with a diesel supplier. B&W adds the oil seller alongside that supplier. The default price is $0.27/gallon, plus the native handling charge (currently $30/car); the game handles funds, off-map filling and return scheduling. Waybill the returned car to your depot's receiving component. Existing oil sellers are preserved.
6. For wood, collect `rr/pulpwood` from any native or modded pulpwood provider using a compatible freight car, then waybill it to the wood shed's receiving component. The native commodity accepts pulpwood flatcars and gondolas (`FP,GB`). Provider stock, contracts and progression still apply. No replacement wood commodity or automatic free supply is added.
7. Bring a compatible locomotive or tender within outlet reach. Its separate fuel slot and native `LoadTarget` must match the fuel and units. Enable the outlet or use `BWFuelService.start(outletId, car)` on the host. Check stock, eligibility and transfer state through `BWFuelService`; see `Scripts/Inspector.rl` and the public Relay guide.

The oil example stores 16,000 gallons and receives 32,000 gallons/game day; wood stores 120,000 pounds and receives 240,000 pounds/game day. These are sample capacities and rates. **Native industry `carUnloadRate` is per game day; B&W outlet `rate` is per simulated second.** Shared storage is persistent and starts empty. Keep `storageConsumptionRate: 0`, `orderLoads: false`, `orderAwayEmpties: false` and `sharedStorage: true` for a manually stocked fuel depot. B&W's storage-only accounting applies only while its explicit finite facility is registered. Do not add a separate consuming industry process merely to hold fuel.

For a map you build entirely in Relay, `BWAuthoring.fuelReceiver(fuel, trackSpans, capacity, unloadPerDay)` constructs the same receiving component. It does not create a map, track, industry, prop or initial inventory. `BWAuthoring.addBunkerCInterchanges(map)` can run after a consumer pack adds its own diesel interchange; it is safe to call again and preserves authored oil suppliers. B&W runs it during its own map-data pass, so a later-added interchange must call it in the adding pack.

The published examples contain declarations and an adaptable native map patch, not scenery assets or a pre-positioned playable facility. Validate your finished map's receiving track, unloading, outlet alignment, depletion and save/reload in a disposable game. Coal towers still supply coal only.

See the settings/API coverage table for defaults, units, authority and persistence. Offline native serialization and Relay checks do not replace editor, save/reload and multiplayer acceptance of a finished pack.
