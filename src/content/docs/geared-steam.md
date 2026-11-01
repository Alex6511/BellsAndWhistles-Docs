---
title: Geared Steam
---

Geared Steam support is being integrated into **Bells and Whistles 0.3.0**. It gives opted-in steam locomotives a geared tractive-effort profile, response tuning, speed limits, chuff timing and author-supplied mechanical audio. This page documents the current development interface; the [release snapshot](/BellsAndWhistles-Docs/versions/) will freeze it when integration is complete.

This changes locomotive behavior. Require `alex6511/bells-and-whistles >=0.3.0` and `rr/game >=0.6.2` in your pack. See [migration](/BellsAndWhistles-Docs/migration/) before replacing a standalone Geared Steam provider.

## Declare a geared locomotive

Add one enabled `Script` component to the locomotive's `definition.components`:

```json
"geared-steam": {
  "kind": "Script",
  "scriptAsset": "alex6511/GearedSteam",
  "parameters": {
    "assetPack": "example/geared-engine",
    "profile": {
      "schemaVersion": "1.1",
      "identity": {
        "definitionId": "example/shay",
        "type": "Shay",
        "displayName": "Example Shay"
      },
      "historical": {
        "publishedStartingTractiveEffortLbf": 25000,
        "numberOfCylinders": 3,
        "maximumBoilerPressurePsi": 180,
        "maximumSpeedMph": 15
      },
      "chuffTiming": {
        "mode": "EngineBased",
        "gearRatioToWheels": 2.6,
        "beatsPerEngineRevolution": 3
      }
    }
  }
}
```

The numbers are an authoring example, not a historical specification. Replace them with values appropriate to your locomotive. The profile is fixed by the definition; there is no runtime API for swapping its type or rewriting its tuning.

`profile` is required. A supplied `identity.definitionId` must match the locomotive receiving the component; when omitted, the carrier reader fills in that definition's ID. Types are `Shay`, `Heisler`, `Climax` and `OtherGeared`. Do not add several GearedSteam carriers to one definition.

## Profile settings

The nested profile accepts schema `1.0` and `1.1`. Use `1.1` for new declarations with the native audio asset field.

| Section | Active settings and units |
| --- | --- |
| `historical` | Starting tractive effort in pounds-force, cylinder count, boiler pressure in psi and maximum speed in mph. Supply locomotive-specific values. |
| `tractiveEffort` | `effectiveUsageFactor` (default 0.82), `lowSpeedPullBias` (1), `speedCurveHalfVelocityMph` (4), `speedCurveExponent` (3.25), or `tractiveEffortCurve` points with `speedMph` and `effortFactor`. |
| `response` | `powerRampUpRate` (0.7), `powerRampDownRate` (0.9), `torqueResponseSpeed` (0.8), `loadResponseLag` (0.5) and `minimumOperationalSpeedMph` (0.25). These tune the response, rather than directly setting cab controls. |
| `mechanical` | `mechanicalEfficiency` (1) and `gearLossFactor` (0) affect delivered effort. |
| `chuffTiming` | `mode` is `Stock` by default or `EngineBased`. Engine-based timing uses `gearRatioToWheels` (2.6), `beatsPerEngineRevolution` (3), optional positive `beatSpacingPattern` values, `phaseOffset` (0), `minimumChuffSpeedMph` (0.15) and `maxChuffsPerSecond` (18). |
| `audio` | Chuff and mechanical-loop settings described below. |
| `consumption` | Optional coal-equivalent and water tuning. Its runtime switch, `EnableConsumptionTuning`, defaults to **false**. Supplying this section alone does not turn it on. |

Consumption fields include `coalConsumptionMultiplier` and `waterConsumptionMultiplier` (both 1), `lowSpeedSteamDemandBias` and `highEffortConsumptionBias` (both 0), `idleCoalBurnPerHour` and `idleWaterUseGallonsPerHour` (both 0), and `consumptionUsesPublishedTEReference` (true). Fuel-type conversion is a separate [Alternative Firing](/BellsAndWhistles-Docs/alternative-firing/) declaration.

Values are normalized to the implementation's allowed ranges before the profile is used. For example, historical maximum speed is clamped to 4–40 mph and cylinder count to 1–8. An explicit tractive-effort curve needs at least two points with strictly ascending, distinct speeds. Check diagnostics after editing; accepting a field does not guarantee that an out-of-range value was retained.

### Retained fields that do not change behavior

These fields remain readable for profile compatibility but are **inactive**:

- `adhesion.*`: the game's native adhesion and wheel-slip behavior remains authoritative.
- `audio.exhaustIntensity` and `audio.exhaustSharpness`.
- `mechanical.rollingResistanceFactor` and `mechanical.gradePerformanceBias`.

The [Relay API](/BellsAndWhistles-Docs/relay-api/) exposes this list as `inertSettings`.

## Supply mechanical audio

B&W does not bundle the original Geared Steam gear-noise recording. To add a mechanical loop, supply an AudioClip in your own native asset pack and add:

```json
"audio": {
  "asset": "./gear-loop",
  "gearNoiseFactor": 1,
  "gearOutputGain": 1,
  "gearMinPitch": 0.55,
  "gearMaxPitch": 1.55
}
```

This is the `audio` section inside `profile`.

- `./gear-loop` is relative to the pack named by the carrier's `assetPack`. Use your actual pack identifier, especially when your `Data.rl` modifies another pack's locomotive.
- If `assetPack` is omitted, ownership is inferred from the locomotive definition.
- A qualified reference such as `example/gear-loop` must resolve to exactly one provider among that owner and its **required** dependencies.
- Use native asset identifiers. Filesystem paths, URLs and traversal paths are not supported.
- Omitted, missing or invalid audio disables the mechanical loop; it does not remove the geared profile or the chuff feature.

Additional audio defaults are `chuffRateMultiplier: 1`, `chuffSmoothness: 1`, `chuffVolumeMultiplier: 1`, `gearResponsiveness: 1`, `gearFullVolumeSpeedFraction: 0.85`, `gearMatchStockChuffAudio: true`, `gearSpatialBlend: 1`, `gearMinDistance: 12`, `gearMaxDistance: 220`, `gearDopplerLevel: 0.2` and `gearRolloffMode: "Linear"`. Distances are metres; pitch, gain and volume values are multipliers. Rolloff also accepts `Logarithmic`.

Players have a local gear-noise volume per car: **0–3**, default **1**. It is stored in `Documents\Railroader\ModSettings\bells-and-whistles-geared.json`, outside the multiplayer save. When that file does not yet exist, compatible preferences are imported from `geared-steam.json` without rewriting the old file.

## Existing profiles

Enabled native packs can still supply `*.gearedsteam.json` sidecars, including the older flat format. A sidecar discovered in a content pack must describe a definition owned by that pack. A native GearedSteam declaration takes precedence over a legacy profile. An invalid explicit declaration is diagnosed rather than silently replaced by a legacy profile.

Use [BWAuthoring](/BellsAndWhistles-Docs/relay-api/#definition-time-helpers) to generate declarations in `Data.rl`, and [BWGeared](/BellsAndWhistles-Docs/relay-api/#runtime-modules) to read state or change local volume.
