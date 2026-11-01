---
title: Relay authoring and runtime APIs
---

The B&W Relay modules are being integrated into **0.3.0**. They separate definition construction from runtime queries and controls. These interfaces are documented against the current development code and will be frozen in the release snapshot.

Require `alex6511/bells-and-whistles >=0.3.0` when importing these modules. An unconditional import does not become optional just because its functions are only called inside an `if`.

## Definition-time helpers

`alex6511/BWAuthoring` constructs ordinary native `Script` components. It contains data helpers and can be used in `Scripts/Data.rl`.

```text
import "alex6511/BWAuthoring" as bw

func modifyDefinitions(context) {
    bw.add(context, "example/oil-engine", "bw-firing",
        bw.firing("bunker-c", "example/oil-tender"))
}
```

The example changes a definition that your pack must supply or require. It does not create the engine, tender or their fuel slots. Railroader calls [modifyDefinitions](https://docs.railroadergame.com/modding/data-rl/#modifydefinitions) during definition loading.

| Helper | Result |
| --- | --- |
| `component(exportName, parameters)` | A Script declaration using `alex6511/<exportName>`. |
| `geared(definitionId, profile, assetPack)` | A GearedSteam carrier. Requires `profile.identity` and `profile.historical`; sets the ID and schema `1.1`. |
| `firing(fuel, fuelCarDefinition)` | An AlternativeFiring carrier for `wood` or `bunker-c`. Use an empty fuel-car ID to leave that restriction unset. |
| `storage(id, fuel, industry, infinite)` | A FuelStorage carrier. All storage requires an industry ID for persistent controls; `infinite` only changes supply accounting. |
| `outlet(id, storageId, options)` | A FuelOutlet carrier with the supplied options. The first two arguments determine its ID and storage. |
| `connector(parameters)` | A FlexibleConnector carrier. |
| `bell(parameters)` | A TenderBell carrier. This configures routing; it does not create the visible bell. |
| `auxTender(parameters)` | An AuxTender carrier. |
| `drivenAnimation(parameters)` | A standard Script carrier for Driven Animation, using the same settings as its editor kind. |
| `hornSelector(instrument)` | A HornSelector carrier; `instrument` is `horn` or `whistle`. |
| `add(context, definitionId, componentId, declaration)` | Adds or replaces one named component in the definition's **object-form** component dictionary. Other component IDs are retained. |

These helpers do not replace the feature's validation. Their output still needs the required models, slots, IDs and settings described in the feature guides. `component` does not check that an export name exists.

The helper-generated carriers are enabled by default. For the optional aux-tender pattern, use the [disabled declaration and marker check](/BellsAndWhistles-Docs/aux-tender/#opt-a-car-in) instead of an unconditional BWAuthoring import.

## Runtime modules

Runtime modules use B&W's native bridge. They are available to full-capability runtime interpreters, including pack runtime scripts; they are not available to the restricted `Data.rl` interpreter. Import the public module for the feature you need:

```text
import "alex6511/BWGeared" as geared
import "alex6511/BWFiring" as firing
```

All eight runtime modules provide `capabilities()`. Car arguments below are game car objects, not definition IDs.

| Module | Reads | Controls |
| --- | --- | --- |
| `BWGeared` | `snapshot(car)`, `observe(car, callback)` | `setLocalVolume(car, volume)`: finite 0–3, local preference, default 1. |
| `BWFiring` | `snapshot(car)`, `observe(car, callback)` | None. Firing type is fixed by the definition. |
| `BWFuelService` | `list()`, `snapshot(outletId)`, `observe(outletId, callback)`, `listStorages()`, `getStorage(id)`, `eligibility(outletId, car)` | `setEnabled(outletId, enabled)`, `start(outletId, car)`, `stop(outletId)`; host only. |
| `BWConnectors` | `snapshot(car)`, `observe(car, callback)` | `setEnabled(car, enabled)`: boolean, controls the car's connectors together. |
| `BWBells` | `snapshot(car)`, `observe(car, callback)` | `setLocomotiveBell(locomotive, ringing)`: boolean, writes the locomotive's ordinary bell control. |
| `BWAuxTender` | `snapshot(car)`, `observe(car, callback)` | `setEnabled(car, enabled)`; `setOptions(car, startBelow, rate, topOff)`. |
| `BWAnimation` | `snapshot(car)`, `observe(car, callback)` | `setEnabled(car, enabled)`: controls the car's driven animations together through a native property. |
| `BWHornWhistle` | `snapshot(car)`, `observe(car, callback)` | `select(car, instrument)` chooses `horn` or `whistle`; `setControl(car, value)` writes the native horn control, 0–1. |

For `setOptions`, `startBelow` is a fraction from 0 to 1, `rate` is greater than 0 and at most 100000 load units per simulated minute (gallons for water), and `topOff` is boolean. The normal aux-tender defaults are 0.95 and 1000. The top-off flag is a request that the transfer script clears when finished.

Connector, bell and aux controls write normal car properties. They use the game's property permissions and synchronization; they do not bypass them. The aux transfer itself still runs only on the host. Gear volume is a separate local preference. Fuel-outlet commands are host-only runtime changes; see [their persistence rules](/BellsAndWhistles-Docs/fuel-services/#control-and-inspect-an-outlet).

There is no runtime method for changing a geared profile, firing type, connector geometry, bell-routing declaration or facility definition. Edit the definition and reload it.

## Results and observers

Native reads and commands return:

```json
{ "ok": true, "value": {} }
```

or:

```json
{ "ok": false, "code": "unavailable", "message": "world-unavailable" }
```

`invalid-request` reports invalid arguments; `unsupported` reports controls the object does not support; `unavailable` covers missing worlds, objects and facilities; `host-required` identifies a host-only command attempted by a client. Inspect `ok` before reading `value`. Property helpers validate the target and value before writing native permission-aware properties. Some helpers omit `value` on success. Invalid calls and denied property writes can also **throw**, so handle Relay errors as well as result objects. Horn control rejects nonnumeric, nonfinite and out-of-range values. `setLocomotiveBell` requires a locomotive; use a tender snapshot's `sourceCar` to identify its controlling locomotive.

`observe` immediately calls the callback, then checks for changed snapshots about every 0.25 seconds of unscaled time. Its callback receives the same result shape. It returns a disposable; dispose it when your script stops using it. A callback error or an unavailable/error snapshot removes that subscription. Disposing the owning script or unloading the world clears its subscriptions; subscribe again in the next world.

```text
import "alex6511/BWGeared" as geared
import log

var subscription = null

func onObjectLoad(car) {
    subscription?.dispose()
    subscription = geared.observe(car, (result) => {
        if !result["ok"] {
            log.warning(result["message"])
            return
        }
        let state = result["value"]
        if state["supported"] {
            log.info("Gear audio: \(state["audioStatus"])")
        }
    })
}

func onObjectUnload(car) {
    subscription?.dispose()
    subscription = null
}
```

### Snapshot fields

| Feature | Contents of `value` |
| --- | --- |
| Geared | `supported`; for a matched engine, `config`, `operating`, `audioStatus`, `localVolume`, `settings`, `inertSettings`. Audio status is `omitted`, `unrequested`, `loading`, `ready` or `invalid`. |
| Firing | `supported`; for a valid binding, `config`, `fuelId`, `fuelCarId`, `fuelSlot`, `waterSlot`, `units`, `quantity`, `capacity`, `waterGallons`, `waterCapacityGallons`, `available`, `fuelPerSecond`, `waterPerSecond`, `diagnostic`. Invalid declarations can return only support, availability and diagnostic fields. |
| Fuel service | The outlet fields listed in [Fuel storage and outlets](/BellsAndWhistles-Docs/fuel-services/). `list()` returns an array in `value`. Storage reads return `id`, `fuelId`, `industry`, `infinite`, `units` and `stock`. Eligibility reads return `eligible`, `reason`, `slot`, `enabled`, `carId` and `outletId`. |
| Connectors | `config`, `attachedCount`, `attachments`, `enabled`. |
| Bells | `config`, `attached`, `sourceCar`, `routing`, `controlPropertyKey`, `controlEnabled`, `ringing`. Routing follows the coupled locomotive, including headlight direction. A null config does not mean a real tender bell is unsupported: default routing needs no carrier. |
| Aux tender | `config` plus raw properties `equipped`, `enabled`, `start-below`, `rate`, `top-off`, `state`. Unset properties may be null even when the transfer script uses its defaults. |
| Driven Animation | `config`, loaded model `instances` with clip/input/output/playing state, and `enabled`. An unloaded model has no instances; its declaration remains readable. |
| Horn/Whistle | `supported`, `available`, `crossingSignals`, `config`, `selected`, `playing`, `propertyKey`, `controlPropertyKey`. Selection and the instrument currently available can differ. |

A successful read can contain `supported: false`. Check that flag before assuming a car has geared or firing support. Fuel rates use native load units per second; water rates use gallons per second. An unresolved slot index is `-1`.

`capabilities()` returns a **plain object**, without the `ok/value` wrapper: `apiVersion`, `packageVersion`, `worldLoaded`, `providerConflict`, `definitionMutation`, `localAudio` and `features`. The current API version is 1; definition mutation is false. Read the installed package's version instead of hard-coding a development value.
