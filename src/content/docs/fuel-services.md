---
title: Fuel storage and outlets
---

Fuel services were introduced in **Bells and Whistles 0.3.0** for Bunker-C and wood. A storage declaration identifies the supply; an outlet transfers it into a compatible nearby car. Authors supply the prop, placement, native industry storage and load targets.

These are development interfaces for Railroader **0.6.2 or later**. Require B&W in your pack. B&W does not discover or convert existing facilities by their names or by proximity.

## Declare storage and an outlet

Put enabled `Script` components on a **prop**. Fuel facilities attached to cars are rejected. This example contains two entries for the prop's `definition.components`:

```json
{
  "oil-storage": {
    "kind": "Script",
    "scriptAsset": "alex6511/FuelStorage",
    "parameters": {
      "id": "example/yard-oil",
      "fuel": "bunker-c",
      "industry": "example/yard-oil-industry",
      "infinite": false
    }
  },
  "oil-outlet": {
    "kind": "Script",
    "scriptAsset": "alex6511/FuelOutlet",
    "parameters": {
      "id": "example/yard-oil-outlet",
      "storage": "example/yard-oil",
      "rate": 60,
      "radius": 3,
      "maxSpeedMph": 0.5,
      "position": [0, 0, 0],
      "enabled": true,
      "requireOwned": true
    }
  }
}
```

Replace every `example/...` ID. The industry must actually exist and have storage for the chosen load. These declarations neither create an industry nor give it starting stock. Use the native [map authoring system](https://docs.railroadergame.com/modding/data-rl/#modifymap) for your facility.

IDs are unique across loaded facilities. Placing two instances that declare the same storage or outlet ID causes a duplicate-ID diagnostic. Give distinct facilities distinct IDs.

## Storage settings

| Parameter | Default | Meaning |
| --- | --- | --- |
| `id` | Required | Namespaced storage ID containing `/`. |
| `fuel` | Required | `bunker-c` (`toolshed/bunker-c`) or `wood` (`rr/pulpwood`). |
| `industry` | Required | Native industry ID for persistent controls and, with finite supply, stored fuel. |
| `infinite` | `false` | Explicitly allows unlimited supply. Do not use this for a finite facility. |

Finite stock and its persistence belong to the game's industry storage. Multiple outlets bound to the same storage draw from that same balance. Registering B&W's carrier does not reset or refill it.

B&W suppresses freight-delivery receivables only for explicitly bound finite storage-only unloaders with ordering off, negligible consumption and no active formula consuming that fuel. This does not disable revenue for every industry using the same load. A facility containing a Toolshed universal-service component is diagnosed as a provider conflict and B&W does not transfer from it or claim its accounting.

## Outlet settings

| Parameter | Default | Allowed values / units |
| --- | --- | --- |
| `id` | Required | Namespaced, unique outlet ID. |
| `storage` | Required | Storage ID, not the industry ID. |
| `rate` | 60 | 0.0001–100000 **native load units per simulated second**. Oil uses gallons; wood uses its load's native units. |
| `radius` | 3 | 0.01–50 metres. The target's own nonnegative radius is also included in the reach check. |
| `maxSpeedMph` | 0.5 | 0–5 mph. Cars moving faster are skipped. |
| `position` | `[0, 0, 0]` | Three finite coordinates, local to the carrier's transform. |
| `enabled` | `true` | Initial service state, inside `parameters`. The outer component's `enabled: false` prevents registration entirely. |
| `requireOwned` | `true` | Restrict service to player-owned cars. |

An enabled outlet automatically chooses the nearest eligible fuel load target in reach. The car needs the matching load slot, matching units and spare capacity. A nonempty incompatible load is skipped. Transfer is limited by the rate, remaining capacity and available finite stock.

The [unreleased target-discovery fix](/BellsAndWhistles-Docs/runtime-validation/) recognizes native load targets attached outside the car's visual model hierarchy. That correction is required for the native targets exercised by the facility acceptance run.

The host performs transfers, approximately once per simulated second. A car does not need an AlternativeFiring carrier merely to receive a matching load: service eligibility is based on its load slot and target.

## Control and inspect an outlet

Import `alex6511/BWFuelService` in a runtime Relay script:

- `list()` returns snapshots of all registered outlets.
- `snapshot(outletId)` reads one outlet.
- `observe(outletId, callback)` watches for changes.
- `setEnabled(outletId, enabled)` enables or disables it.
- `listStorages()` and `getStorage(id)` read registered storage and its stock.
- `eligibility(outletId, car)` checks a car without starting a transfer.
- `start(outletId, car)` checks eligibility, then enables it and restricts it to that car.
- `stop(outletId)` disables it and clears the requested car.

Commands require the host. Enabling an outlet again after `start` keeps its requested car until `stop` clears it. Enabled state, requested car and service state use the bound industry's native persistent properties. Clients can read the replicated properties; only the host runs transfers and writes service state. Authored defaults apply only before a stored property exists. All storage, including explicitly infinite supply, requires an industry binding for these controls. Infinite supply does not debit that industry's stock. Facility reconstruction never seeds or replenishes inventory.

Snapshots include `id`, `config`, `enabled`, `state`, `requestedCar`, `fuelId`, `units`, `infinite`, `stock`, `capacity`, `industry` and `providerConflict`. Infinite or unavailable stock/capacity can be `null`; do not treat it as zero. `provider-conflict` is also a service state and eligibility failure.

An eligibility result contains `eligible`, `reason`, `slot`, `enabled`, `carId` and `outletId`. Reasons include missing storage/industry/model, `not-owned`, `moving`, `incompatible-slot`, `incompatible-saved-load`, `full`, `empty` and `out-of-reach`. Eligibility does not require the outlet to be enabled; `start` can enable an eligible outlet. An eligible result does not promise a transfer while the prop is inactive or a provider conflict disables services.

Common states are `off`, `feeding`, `empty`, `missing-storage`, `missing-industry`, `no-compatible-target` and `error`. A new outlet starts as `ready`; `full` can occur when no transferable capacity remains during a transfer. See [Relay results and observers](/BellsAndWhistles-Docs/relay-api/#results-and-observers).
