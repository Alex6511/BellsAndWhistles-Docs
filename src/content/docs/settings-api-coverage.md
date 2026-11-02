---
title: Settings and API coverage
---


The package ID is `alex6511/bells-and-whistles`; API version is 1. Consumer packs require B&W >=0.3.0 and Railroader >=0.6.2. These interfaces execute through the native Relay interpreter. No consumer DLL is needed.

Definition settings are authored with native Script parameters or `BWAuthoring` in Data.rl, persist in the content pack and take effect at definition load. They are read-only at runtime. Effective configuration is returned by the corresponding `snapshot` call. The optional editor kinds use the same configuration. Simulation and inventory writes belong to the host; native car-property controls retain the game's permission checks. Model presentation follows model lifetime.

## Runtime settings

| Setting | Units/default | Read / control | Persistence and authority |
| --- | --- | --- | --- |
| Gear volume per car | Gain 0–3 / 1 | `BWGeared.snapshot.localVolume` / `setLocalVolume` | Local settings file; never replicated. |
| Geared profile and operating state | See tables below | `BWGeared.snapshot.config`, `.operating`, `.audioStatus`, `.inertSettings` | Pack definition; runtime profile switching is unsupported. |
| Alternative firing type, slots, fuel car, quantities, rates, diagnostic | Oil gallons, wood native units, water gallons; rates per simulated second | `BWFiring.snapshot` | Type fixed at load; native save quantities; host debits. |
| Outlet enabled | Boolean / true | `BWFuelService.snapshot` / `setEnabled` | Native industry properties; host writes. |
| Outlet requested car | Car ID / empty (automatic nearest eligible target) | `snapshot` / `start`, `stop` | Native industry properties; host writes. |
| Source stock | Native load units / existing inventory | `listStorages`, `getStorage` | Native industry storage; never initialized by B&W. |
| Eligibility and service state | Named reasons/state | `eligibility`, `snapshot`, `list` | Read-only; host state replicated through industry properties. |
| Connector presentation | Boolean / true | `BWConnectors.snapshot` / `setEnabled` | Native car property; permission-aware. |
| Bell control | Boolean / native control default | `BWBells.snapshot` / `setLocomotiveBell` | Native locomotive control; native permissions. Tender routing reads that locomotive. |
| Auxiliary transfer enabled | Boolean / true | `BWAuxTender.snapshot` / `setEnabled` | Native car properties; host transfers while models are unloaded too. |
| Auxiliary start threshold | Capacity fraction / 0.95 | `snapshot` / `setOptions` | Native car property; valid range 0–1. |
| Auxiliary rate | Water gallons per simulated minute / 1000 | `snapshot` / `setOptions` | Native car property; greater than zero, at most 100000. |
| Auxiliary top-off | Boolean / false | `snapshot` / `setOptions` | Native request property; cleared when completed. |
| Driven animation enabled | Boolean / true | `BWAnimation.snapshot` / `setEnabled` | Native car property; presentation only. |
| Horn/whistle selection | `horn` or `whistle` / pack default, then engine type | `BWHornWhistle.snapshot` / `select` | Native car property; permission-aware. |
| Horn/whistle control | Fraction 0–1 / native control default | `snapshot` / `setControl` | Native control; permission-aware. |

Every runtime module exports `capabilities`, `snapshot` and disposable `observe` (fuel service also exposes source queries). Observers send changed snapshots at most four times per unscaled second; they are not a physics telemetry channel. Dispose them when finished. World unload and owning ScriptInstance disposal remove subscriptions. Invalid/unavailable/host-only calls return explicit failures; native property permission failures can throw.

## Geared definition settings

Read these through `BWGeared.snapshot(car).value.config`. All are pack-owned and fixed at definition load. Author with `BWAuthoring.geared` or the `GearedSteam` carrier. Schema 1.0 and legacy flat readers remain; use schema 1.1 for author-supplied audio. The values below are defaults before validation/normalization, not recommended historical specifications.

| Setting | Units | Default |
| --- | --- | --- |
| `schemaVersion` | Schema string | `1.0`; authoring helper emits `1.1` |
| `assetPack` | Declaring pack ID | Definition's owning pack |
| `identity.definitionId` | Qualified definition ID | Filled from the declaration's definition |
| `identity.modelIdentifier`, `identity.displayName` | Strings | Empty |
| `identity.type` | Enum name | `Shay` |
| `historical.publishedStartingTractiveEffortLbf` | Pounds-force | 25830 |
| `historical.numberOfCylinders` | Count | 3 |
| `historical.maximumBoilerPressurePsi` | psi | 0 (unspecified) |
| `historical.maximumSpeedMph` | mph | 11 |
| `tractiveEffort.effectiveUsageFactor` | Ratio | 0.82 |
| `tractiveEffort.lowSpeedPullBias` | Ratio | 1 |
| `tractiveEffort.speedCurveHalfVelocityMph` | mph | 4 |
| `tractiveEffort.speedCurveExponent` | Exponent | 3.25 |
| `tractiveEffort.tractiveEffortCurve` | `speedMph`, `effortFactor` pairs | Empty; uses calculated curve |
| `response.powerRampUpRate`, `powerRampDownRate` | Response rates | 0.7, 0.9 |
| `response.torqueResponseSpeed`, `loadResponseLag` | Response tuning factors | 0.8, 0.5 |
| `response.minimumOperationalSpeedMph` | mph | 0.25 |
| `mechanical.mechanicalEfficiency`, `gearLossFactor` | Ratios | 1, 0 |
| `chuffTiming.mode` | `Stock` / `EngineBased` | `Stock` |
| `chuffTiming.gearRatioToWheels`, `beatsPerEngineRevolution` | Ratio / count | 2.6, 3 |
| `chuffTiming.beatSpacingPattern` | Positive relative spacings | Empty |
| `chuffTiming.phaseOffset` | Beat phase | 0 |
| `chuffTiming.minimumChuffSpeedMph` | mph | 0.15 |
| `chuffTiming.maxChuffsPerSecond` | Hz | 18 |
| `audio.asset` | Native asset identifier | Empty: silent mechanical loop |
| `audio.chuffRateMultiplier`, `chuffSmoothness`, `chuffVolumeMultiplier` | Multipliers | 1 each |
| `audio.gearNoiseFactor`, `gearOutputGain`, `gearResponsiveness` | Multipliers | 1 each |
| `audio.gearMinPitch`, `gearMaxPitch` | Pitch multipliers | 0.55, 1.55 |
| `audio.gearFullVolumeSpeedFraction` | Maximum-speed fraction | 0.85 |
| `audio.gearMatchStockChuffAudio` | Boolean | true |
| `audio.gearSpatialBlend` | Fraction | 1 |
| `audio.gearMinDistance`, `gearMaxDistance` | Metres | 12, 220 |
| `audio.gearDopplerLevel` | Multiplier | 0.2 |
| `audio.gearRolloffMode` | `Linear` / `Logarithmic` | `Linear` |
| `consumption.coalConsumptionMultiplier`, `waterConsumptionMultiplier` | Ratios | 1 each |
| `consumption.lowSpeedSteamDemandBias`, `highEffortConsumptionBias` | Bias factors | 0 each |
| `consumption.idleCoalBurnPerHour` | Coal-equivalent pounds/hour | 0 |
| `consumption.idleWaterUseGallonsPerHour` | Gallons/hour | 0 |
| `consumption.consumptionUsesPublishedTEReference` | Boolean | true |
| `meta.author`, `meta.notes` | Strings | Empty |

Accepted but inactive legacy tuning remains visible in `inertSettings`: all `adhesion` fields (`adhesionMultiplier` 1.15, `slipToleranceMultiplier` 1.2, `slipSeverityMultiplier` 0.85, `slipOnsetCurveExponent` 1.5, `stallResistance` 0.2); `mechanical.rollingResistanceFactor` 1 and `gradePerformanceBias` 0; `audio.exhaustIntensity` and `exhaustSharpness` 1. Native adhesion remains authoritative. These fields do not acquire new behavior through migration.

The local geared settings document is readable as `snapshot.settings`. `Enabled`, `EnableCustomChuffAudio`, `EnableGearNoise`, `NormalizeAudioToStock`, `EnableControlDiagnostics` and `EnableChuffFaultContainment` default true. `VerboseLogging`, `EnableWheelAnimatorPatch`, `EnableConsumptionTuning`, `EnableDebugOverlay`, `EnableRuntimeSummaryLogs`, `EnableAudioOutputDiagnostics` and `EnableChuffBoundaryRecording` default false. These are retained startup settings, changed in the settings file followed by reload; they have no Relay mutation API. `AudioDiagnosticSettingsRevision` is migration bookkeeping. `GearNoiseVolumeByCar` is the local map controlled by `setLocalVolume`. Fuel conversion and native consumption multipliers still apply when optional geared consumption tuning is off.

## Other definition settings

| Carrier | Settings, units and defaults | Query / authoring |
| --- | --- | --- |
| AlternativeFiring | `fuel` required (`wood` / `bunker-c`); `fuelCarDefinition` empty/unrestricted; `fuelPerCoalPound` 1.8 wood pounds or 0.043 oil gallons per coal-equivalent pound | `BWFiring.snapshot.config`; `BWAuthoring.firing`, or `component` for custom conversion |
| FuelStorage | Namespaced `id`, `fuel`, `industry` required; `infinite` false. Oil/wood load identities are fixed. | `BWFuelService.getStorage`; `BWAuthoring.storage` |
| FuelOutlet | `id`, `storage` required; `rate` 60 native units/second; `radius` 3 metres; `maxSpeedMph` 0.5; `position` [0,0,0] local metres; `enabled` and `requireOwned` true | `BWFuelService.snapshot.config`; `BWAuthoring.outlet` |
| FlexibleConnector | Endpoints/rotations, preset, length, radius, slack, segments, sides, stiffness, damping, gravity, bend limit, solver iterations, color, material, curve and smoothing. Defaults depend on the chosen preset; see the connector guide's preset tables. | `BWConnectors.snapshot.config`; `BWAuthoring.connector` |
| TenderBell | `routing` mirror; optional headlightDirection; `enabled` true | `BWBells.snapshot.config`; `BWAuthoring.bell` |
| AuxTender | `load` defaults to `rr/water`; enablement, threshold and rate are native car properties, not Script parameters. Existing optional marker discovery remains supported. | `BWAuxTender.snapshot`; `BWAuthoring.auxTender` |
| DrivenAnimation | `animation.clipName` required; `mode` speed; `input` speed (mph); `source` self; `keyframes` empty; `extrapolate` and `mirrorNegative` false; `timeTolerance` 0.01 seconds. Time outputs are clip seconds; speed outputs are playback multipliers. | `BWAnimation.snapshot`; `BWAuthoring.drivenAnimation` |
| HornSelector | `default` horn/whistle; omission uses engine type. Disabled carriers can still provide this default. | `BWHornWhistle.snapshot.config`; `BWAuthoring.hornSelector` |

Author facility models, geometry, source industries and inventory separately. Coal towers do not supply alternative fuel. Shared storage is debited once, finite supply is the default, and incompatible nonempty saved loads are never relabeled.

## Native fuel supply (unreleased follow-up)

| Setting | Units / default | Mutability, persistence and authority | Relay surface |
| --- | --- | --- | --- |
| Bunker-C purchase price | $0.27/native gallon; native handling currently $30/car | Definition-time load price; native host purchasing debits company funds. B&W has no runtime price setter. | Native Buy destination; map setup through `BWAuthoring.addBunkerCInterchanges(map)` |
| Receiver `maxStorage` / `carUnloadRate` | Required positive commodity capacity / units per game day | Map-time settings; native host unloading writes persistent industry stock. | `BWAuthoring.fuelReceiver(fuel, trackSpans, capacity, unloadPerDay)`; stock via `BWFuelService.getStorage` |
| Receiver load and freight filter | Oil `toolshed/bunker-c`, `TM`; wood `rr/pulpwood`, `FP,GB` | Fixed native commodity identities; preserves existing supply providers. | `fuelReceiver`; facility `snapshot` / `getStorage` |
| Receiver storage behavior | Shared storage; consumption 0; ordering and order-away false | Native persistent stock; no automatic replenishment. Scoped B&W accounting requires the explicitly authored facility. | `fuelReceiver`; servicing and observations through `BWFuelService` |

These map settings are distinct from the outlet settings above. The [loader examples](/BellsAndWhistles-Docs/feature-examples/) cover both sides of the supply chain.
