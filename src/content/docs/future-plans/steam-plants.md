---
title: Steam plants and realistic simpling — authoring proposal
description: A proposed B&W 0.4.0 workflow for authoring compound steam locomotives, with the Virginian AE as a test bed. Subject to change; not a supported API.
---

:::caution[Future plan — 0.4.0 target, always subject to change]

This proposal targets **Bells and Whistles 0.4.0**. The target, scope, interfaces, defaults, and examples are **subject to change**. It is not a release commitment or a supported authoring API.

The steam-plant feature described here is not available in B&W 0.3.0. Names such as `SteamPlant`, `BWAuthoring.steamPlant`, `BWSteamPlant`, and the capability marker below are **proposed**, not existing exports. No working example pack or gameplay validation is claimed by this page. B&W 0.3.0's existing maintainer-confirmed testing is a separate matter.

The intended platform is Railroader's native mod system. A supported Railroader version/build range for this feature has not yet been established.

:::

The aim is to let an author describe a locomotive's steam circuit and controls, while B&W supplies the simulation. The Virginian AE would be the first real test bed; the format must also describe other Mallets, triplex arrangements, multiple low-pressure groups, and compounds with several cylinder banks driving the same wheels.

This is a review of the **authoring workflow**. The JSON below is a proposed data sketch, and the Relay examples illustrate intended integration. They are deliberately incomplete and must not be shipped as a working configuration.

## What you would supply

| Author supplies | B&W would provide |
| --- | --- |
| A normal native locomotive definition, tender, model, animations, and load slots. | Steam-plant simulation for an explicitly opted-in locomotive. |
| Cylinder dimensions, wheel-group bindings, boiler/receiver data, firing data, and steam connections. | Pressure, heat and mass accounting, cylinder work, feed and auxiliary demand. |
| Valve arrangement and control bindings, including what the simpling handle requests. | Actual valve transitions and the resulting steam flow, effort, consumption, and exhaust state. |
| Sources, estimates, and a calibration record. | Diagnostics and a generic inspection/control panel for checking the model. |

You would not need to write a boiler solver or a script that continually changes tractive effort. A cab animation alone would not create a working simpling valve. The handle must request a valve action in a configured circuit.

The initial scope is one boiler per locomotive, coal/wood firebeds or Bunker-C firing, assisted operation with manual takeover, and recoverable operating consequences. Persistent mechanical damage and multiple boilers are outside this proposal's initial scope.

## 1. Prepare the locomotive and its evidence

Start with a functioning native locomotive. Confirm the main and additional engine-set identifiers, which wheels each set drives, tender fuel/water slots, and the exact property keys used by the cab.

For an extension to someone else's locomotive, put the changes in your own integration pack, declare its dependency on the owning pack, and use `Scripts/Data.rl` to modify the target definition. Preserve their installed files and unrelated components. Obtain permission for any assets you redistribute; a definition patch does not grant redistribution rights.

Keep a worksheet with the value, original units, source, confidence, and any conversion for each parameter:

| Area | Information needed for review and calibration |
| --- | --- |
| Boiler | Working pressure, internal volume, working water inventory/level geometry, evaporative surface, superheater surface, and heat-loss assumptions. |
| Firing | Fuel type and heating value, grate/firebed or burner characteristics, draft response, and any atomizing-steam demand. |
| Cylinder banks | Cylinder count, bore, stroke, cutoff/admission assumptions, clearance, and driven group. |
| Circuit | Receivers and their volumes; pipes/ports and flow restrictions; reducing, intercepting, starting, drain, and exhaust arrangements. |
| Feed and auxiliaries | Injectors/feed devices, blower, compressor, stoker, dynamo, whistle, isolation controls, and demand estimates. |
| Native integration | Engine-set identifiers, wheel sizes, relevant load slots/units, and the basis of the authored locomotive mass. |

Missing historical data is expected. Mark an estimate as an estimate and test its sensitivity; do not disguise a tuning value as a measured specification. Proposed validation should identify missing required inputs rather than silently inventing locomotive-specific geometry.

For the AE, contemporary material records **30 × 32-inch HP cylinders**, **48 × 32-inch LP cylinders**, and rated tractive efforts of **147,200 lbf compound** and **176,600 lbf simple**. Those are historical calibration references, not a complete plant specification or drawbar-pull guarantee. See the [historical 2-10-10-2 articles and tables](https://wx4.org/to/foam/past/less_traveled2017/pdfs/ATSF%26Virgn2-10-10-2s_opt.pdf), particularly PDF pages 12–14. The [AE specification-diagram catalog entry](https://www.nwhs.org/archivesdb/detail.php?ID=125037) is a further archival lead; the entry alone does not verify drawing dimensions.

## 2. Describe cylinder banks separately from driven groups

A **bank** is a set of cylinders receiving and exhausting steam. A **driven group** identifies the native wheels receiving that bank's work. A **receiver** stores steam between stages. These are different things even when a simple locomotive has one of each.

Here is the proposed AE-style mapping. The empty physical inputs are intentional review placeholders, not defaults or values the future validator would accept.

```json title="Proposed profile fragment — incomplete, not loadable"
{
  "schemaVersion": 1,
  "identity": {
    "definitionId": "example/compound-locomotive",
    "displayName": "Compound locomotive review example"
  },
  "drivenGroups": [
    { "id": "rear", "engineSet": { "kind": "main" } },
    {
      "id": "front",
      "engineSet": { "kind": "additional", "identifier": "low_pressure" }
    }
  ],
  "cylinderBanks": [
    { "id": "hp", "drivenGroup": "rear", "cylinderCount": 2, "boreIn": 30, "strokeIn": 32 },
    { "id": "lp", "drivenGroup": "front", "cylinderCount": 2, "boreIn": 48, "strokeIn": 32 }
  ],
  "receivers": [
    { "id": "intermediate", "volumeM3": null }
  ],
  "boiler": {
    "maximumPressureGaugePsi": 215,
    "internalVolumeM3": null,
    "workingWaterMassKg": null,
    "evaporativeSurfaceM2": null,
    "superheaterSurfaceM2": null
  },
  "firing": {
    "fuel": "coal",
    "lowerHeatingValueMJPerKg": null
  }
}
```

`example/compound-locomotive` is a placeholder. The AE test-bed integration would target `eilelwen/vgn-ae-ls` and verify its additional engine identifier `low_pressure`. Names such as `hp`, `lp`, `front`, and `rear` are author-chosen references inside this example; the simulation must not infer physics from those names.

The 215 psi value is a starting point from the AE's authored boiler setting, not a calibrated receiver pressure. A fixed pressure value already present in an additional native engine definition would not replace the receiver model. Pressure field names distinguish gauge pressure from absolute pressure; dimensions and energy fields carry their units. The final field layout and supported input units remain open for review.

Additional valve, feed, auxiliary, water-level, resource-binding, initial-state, and calibration information would be required for a complete plant. The profile above is not a minimum working configuration.

### How this stays generic

| Arrangement | Authoring change |
| --- | --- |
| Two-engine Mallet | Bind HP and LP banks to two driven groups and connect them through the appropriate receiver. |
| Triplex or multiple LP groups | Add banks and driven groups, then describe the actual split supply and exhaust paths. Do not duplicate steam inventory merely because two banks share a receiver. |
| Shared-wheelgroup compound | Point multiple banks at the same driven-group ID while keeping their inlet/exhaust paths separate. |
| Simple engine | Connect its bank or banks directly to the relevant supply/exhaust circuit, without inventing a receiver or simpling apparatus. |

The model would use the supplied graph and bindings, not an AE/Mallet/triplex name switch.

## 3. Define what the valves actually connect

For a representative intercepting/reducing arrangement, the author would describe these paths:

| Operating state | HP admission | HP exhaust | LP admission | LP exhaust |
| --- | --- | --- | --- | --- |
| Compound | Regulated boiler steam | Receiver | Receiver steam | Authored final exhaust |
| Simple | Regulated boiler steam | Bypass to authored exhaust | Reduced live steam | Authored final exhaust |
| Transition/automatic starting | Determined by the valve positions and pressure conditions | Determined by the valve positions | Determined by the valve positions | Authored exhaust |

This table illustrates one arrangement, not a universal Mallet circuit. Contemporary [Mallet operating descriptions](https://www.gutenberg.org/files/17783/17783-h/17783-h.htm) describe intercepting/reducing and automatic-starting behavior; authors must establish which apparatus their locomotive actually carried.

A proposed route fragment would make the connections explicit:

```json title="Proposed circuit fragment — connection names are provisional"
{
  "connections": [
    { "from": "boiler", "to": "hp.inlet", "through": "regulator" },
    { "from": "hp.exhaust", "to": "intermediate", "through": "intercept.compound" },
    { "from": "intermediate", "to": "lp.inlet", "through": "receiverAdmission" },
    { "from": "hp.exhaust", "to": "stack", "through": "intercept.simple" },
    { "from": "boiler", "to": "lp.inlet", "through": "simplingReducer" },
    { "from": "lp.exhaust", "to": "stack", "through": "finalExhaust" }
  ]
}
```

Each referenced valve/path would also need a definition: restrictions/flow areas, applicable reduction settings, travel or response, and the conditions that open or close it. The receiver admission path must behave correctly when reduced live steam is admitted; drawing a bypass without the appropriate interception/isolation is not enough. Those definitions are deliberately not invented for the AE in this example.

Automatic starting would be a property of the authored apparatus. The manual handle requests simpling; it does not directly set receiver pressure, add a fixed power bonus, or overwrite actual valve state. B&W would expose both the request and the achieved state so an author can diagnose a delayed or inhibited transition.

## 4. Attach the proposed carrier safely

The proposal follows B&W's existing native Script-carrier approach, with a new feature-specific contract. The existing [optional aux-tender pattern](/BellsAndWhistles-Docs/aux-tender/#opt-a-car-in) illustrates guarded activation, but its marker must **not** be reused to detect steam-plant support.

```json title="Proposed Definitions.json component fragment — do not ship"
"bw-steam-plant": {
  "kind": "Script",
  "scriptAsset": "alex6511/SteamPlant",
  "enabled": false,
  "parameters": {
    "profile": null
  }
}
```

`profile` would contain the completed inline configuration, including the fragments above and the missing required data. It is not a filename in this proposal. `null` deliberately keeps this sketch incomplete.

For a pack that can operate with ordinary native physics when this feature is absent, the proposed workflow is:

1. Supply a valid native fallback definition and a disabled carrier.
2. Use a B&W load-order hint and require the pack that owns any locomotive you modify.
3. Check a **steam-plant contract marker**, then enable only the corresponding carrier.
4. Keep unrelated `Data.rl` modifications running when the marker is absent.

```text title="Proposed Scripts/Data.rl fragment — marker is not implemented"
func modifyDefinitions(definitions) {
    // Proposed marker name; not present in B&W 0.3.0.
    if definitions.getDefinition("alex6511/steam-plant-api-v1") != null {
        definitions.merge("example/compound-locomotive", {
            "definition": { "components": {
                "bw-steam-plant": { "enabled": true }
            } }
        })
    }

    // Keep the pack's unrelated definition changes here.
}
```

The marker name and schema contract need final agreement. A package-version check alone should not turn an incompatible schema on. The intended fallback is silent ordinary operation when support is absent; a malformed explicitly activated plant should instead produce an actionable error, not quietly simulate a different locomotive.

If your pack requires the future simulation, or unconditionally imports a future B&W helper/runtime module, declare the eventual compatible B&W dependency. **Do not use `>=0.3.0` as a requirement for this feature.** The 0.4.0 target does not establish a supported dependency range today. An unconditional import remains unconditional even if the function call is inside a marker check.

For a required integration, `BWAuthoring.steamPlant(parameters)` is the proposed convenience constructor. It would produce the same declaration; it would not create the locomotive, supply missing geometry, or make an invalid circuit valid. The [current Relay API guide](/BellsAndWhistles-Docs/relay-api/) explains the existing separation between definition-time helpers and runtime modules.

## 5. Bind the cab and expose missing controls

Bind controls by their exact property keys and purpose. Binding a boiler gauge, sight glass, injector valve, or stoker requires confirming what the component actually reads/writes. A plausible model name or animation clip is not enough.

```json title="Proposed control fragment — not a supported binding schema"
{
  "controls": {
    "simpling": {
      "propertyKey": "SimplingValve",
      "simpleWhen": true
    }
  },
  "assistance": {
    "firing": true,
    "feedwater": true,
    "auxiliaries": true
  },
  "initialState": {
    "preset": "ready-to-work"
  }
}
```

The AE's `SimplingValve` key is case-sensitive. Verify which visual handle position writes `true` before retaining `simpleWhen: true`; the example proposes an explicit mapping, not a verified handle orientation.

The intended interaction rules are:

- A manual adjustment takes the affected subsystem out of assistance until the player re-enables it. Assistance respects isolating valves.
- Auto Engineer uses the available plant performance and leaves the manual simpling request alone. Authored automatic-starting apparatus still works.
- Unbound controls remain available through the generic plant panel. Do not invent a cab binding to satisfy the configuration.
- Ready-to-work initialization applies only to a newly initialized plant. Save/load preserves the actual fire, water, energy, valve state, and assistance selections, including shutdown/cold conditions.
- Read-only gauges and custom UI display simulated state. They do not write boiler pressure or inventory to create the desired result.

`BWSteamPlant` is the proposed runtime module for capability discovery, snapshots, observation, and authorized commands. Exact method signatures and snapshot fields are not frozen. Expected readouts include boiler/receiver conditions, requested and actual simpling state, per-bank work, resource rates, assistance modes, and diagnostics. The host would own the simulation; custom scripts would request control changes and dispose observers when their UI or owning object is unloaded.

## 6. Check resources and compatibility

Identify which tender or on-engine slots provide fuel and feedwater, including their native units. Boiler water is distinct from tender water: water entering the boiler and steam leaving it must not both charge the tender for the same quantity. Injector return/overflow and auxiliary demand also need accounting.

Choose a single owner for steam force and consumption. Do not stack an existing geared/steam override or alternative-firing consumption patch over the future plant. The exact migration and coexistence rules must be verified and documented before authors replace those integrations. Fuel facilities and auxiliary tenders should continue to replenish their ordinary inventories through their own supported interfaces.

Record whether the authored locomotive weight includes service water/fuel so the plant can account for changing contents without adding that mass twice. Sound and animation consumers should use outputs from the same plant; they must not advance a second simulation.

## 7. Calibrate and review the pack

The AE would establish the first integrated workflow, not a universal profile for every compound. Record fuel, starting pressure and water level, throttle/cutoff, speed, grade, load, assistance settings, and the measurement point for every comparison.

| Check | What the author should be able to establish |
| --- | --- |
| Native fallback | Without compatible support, the pack still loads and its intended fallback remains usable. |
| Binding and validation | Every bank reaches the intended wheels; missing IDs, duplicate ownership, and incomplete values produce useful errors. |
| Compound start and running | Receiver pressure develops from the circuit, with no independent fixed LP-pressure setting masquerading as a receiver. |
| Simpling and transition | Handle request, actual valve state, HP exhaust path, LP admission, effort, and steam use change consistently. |
| Sustained work | Boiler pressure and fuel/water use reflect firing, feed, draft, cutoff, and auxiliary demand. |
| Manual operation | Cab controls and assistance do not fight each other; isolation and manual takeover behave as documented. |
| Save/load and multiplayer | Plant state survives reload/reconnect without fresh resources, a hot reset, or client-side duplicate consumption. |
| Other arrangements | A multiple-LP or shared-wheelgroup example can be expressed without adding locomotive-name exceptions. |

Compare historical rated effort at its stated measurement point. Keep cylinder work, wheel-rim effort, adhesion-limited force, and drawbar pull separate. A successful low-speed effort match alone does not validate steam consumption, boiler endurance, or every operating condition.

## Questions for modders

Please review the examples as an interface proposal and send feedback through the [public documentation issues](https://github.com/Alex6511/BellsAndWhistles-Docs/issues):

1. Can the bank/group/receiver distinction represent your locomotive? Show any valve or exhaust arrangement it cannot express.
2. Which required physical inputs can you source, and which would need documented presets or estimation guidance?
3. Are unit-bearing fields such as `boreIn`, `volumeM3`, and `maximumPressureGaugePsi` clear enough, or would another authoring convention reduce mistakes?
4. Would an inline profile be practical for your pack, or do you need reusable profile assets? Separate profile-file loading is not defined by this proposal.
5. Can your cab expose the necessary property keys? Which controls need the generic panel, and which readouts would help calibration?
6. Does your pack need ordinary-physics fallback, or should installation require a compatible steam-plant provider?

Scope, configuration names, defaults, examples, and the **0.4.0 target remain subject to change**. Follow [Future plans](/BellsAndWhistles-Docs/future-plans/) for the status of proposals; use release-specific guides for supported content.
