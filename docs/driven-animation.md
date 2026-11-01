# Driven Animation

A **Driven Animation** component plays an animation clip. A car's speed or a locomotive's throttle, reverser, fuel use or water use drives the clip. It updates every frame, so the motion is smooth.

Use it for parts that move with the locomotive, such as a mechanical lubricator's ratchet arm or a stoker's screw.

The component is built into Bells and Whistles; its kind is `alex6511.DrivenAnimation`.

Without Bells and Whistles, the game can't read a `Definitions.json` that uses this kind. So none of that pack's definitions load. List `alex6511/bells-and-whistles` under `dependencies.required` in your `Info.json`.

## What the model needs

- The clip must be in the **AnimationMap** of the model part the component is on, the same as for the game's PropertyAnimation and ToggleAnimation components.
- For continuous motion (Speed mode), set the clip to loop in Unity. Bells and Whistles only sets how fast the clip plays; a clip that doesn't loop stops at its last frame.

## Add a Driven Animation component

In the editor, choose **Add Component → Driven Animation**. In `Definitions.json`, add a component with `"kind": "alex6511.DrivenAnimation"`.

```json
"lubricator": {
  "kind": "alex6511.DrivenAnimation",
  "name": "Lubricator",
  "animation": { "clipName": "Lubricator" },
  "mode": "speed",
  "input": "speed",
  "keyframes": [
    { "input": 0, "output": 0 },
    { "input": 60, "output": 2 }
  ]
}
```

Here `"mode": "speed"` means that the output sets how fast the clip plays. `"input": "speed"` means that the car's speed in mph drives it.

This plays the lubricator clip at normal speed at 30 mph and twice as fast at 60 mph. It stands still when the car stands still.

## Settings

| Setting | Default | Meaning |
| --- | --- | --- |
| `animation` | none | The clip to play, as `{ "clipName": "..." }`. |
| `mode` | `speed` | `speed` (0): the output is how fast the clip plays. `time` (1): the output is a point in the clip, in seconds, that the part moves to. |
| `input` | `speed` | What drives the animation. See the next table. |
| `source` | `self` | `self` (0) reads the car this component is on. `locomotive` (1) reads the locomotive this car belongs to: the car itself if it's a locomotive, otherwise the locomotive found through its coupled tenders. |
| `keyframes` | none | A list of `{ "input": ..., "output": ... }` pairs. |
| `extrapolate` | `false` | Below the first keyframe or above the last, `false` keeps that keyframe's output. `true` continues the slope of the end segment. |
| `mirrorNegative` | `false` | `true` reads a negative input as positive and negates the output, so reversing plays the same motion backwards. |
| `timeTolerance` | `0.01` | Time mode only: how close, in seconds, the clip must get to its target before it stops. |

`mode`, `input` and `source` can be written as names (`"fuelConsumption"`) or as numbers. The table above gives the numbers for `mode` and `source`, and the [Inputs](#inputs) table gives them for `input`. The editor saves all three as names.

### Inputs

| Input | Number | Value |
| --- | --- | --- |
| `speed` | 0 | Speed in mph. Never negative. |
| `velocity` | 1 | Speed in mph, positive when the car moves toward its F end and negative toward its R end. |
| `throttle` | 2 | Throttle from 0 to 1. On a steam engine this is the regulator; on a diesel, the notch divided by 8. |
| `reverser` | 3 | Reverser from -1 to 1. |
| `fuelConsumption` | 4 | How fast the locomotive is using coal (steam) or fuel (diesel). |
| `waterConsumption` | 5 | How fast a steam engine is using water. |

`throttle`, `reverser`, `fuelConsumption` and `waterConsumption` read 0 when the source car isn't a locomotive. For a part on a tender, set `source` to `locomotive`.

The game doesn't document the units of the fuel and water rates. On a steam engine, the game smooths the coal and water rates over about a second.

Start with a keyframe at input 0, such as `{ "input": 0, "output": 0 }`. Then adjust the keyframes by eye in the game.

## How the output is worked out

1. Bells and Whistles reads the input.
2. It finds the two keyframes on either side of that input and draws a straight line between them. Keyframes are sorted by input, so their order in the list doesn't matter. If two keyframes share an input, the later one wins.
3. In Speed mode, the result is how fast the clip plays: `1` is normal speed, `2` is twice as fast, `0` is stopped, and a negative number plays it backwards.
4. In Time mode, the result is a point in the clip, in seconds. The part plays at normal speed, forwards or backwards, until it's within `timeTolerance` of that point, then stops. Points before the start or after the end of the clip are moved to the start or end.

## Performance and multiplayer

The animation only updates while the car is on screen. Everything it reads is already shared between players, so it adds no network traffic. It hasn't been tested in multiplayer yet.

## Examples

A stoker on a tender, driven by the locomotive's coal use:

```json
"stoker": {
  "kind": "alex6511.DrivenAnimation",
  "name": "Stoker",
  "animation": { "clipName": "Stoker" },
  "mode": "speed",
  "input": "fuelConsumption",
  "source": "locomotive",
  "keyframes": [
    { "input": 0, "output": 0 },
    { "input": 1, "output": 1 }
  ],
  "extrapolate": true
}
```

A cab indicator that follows the reverser. Its clip is 2 seconds long: the start shows full reverse, the middle shows mid gear and the end shows full forward.

```json
"cutoff-indicator": {
  "kind": "alex6511.DrivenAnimation",
  "name": "Cutoff Indicator",
  "animation": { "clipName": "CutoffIndicator" },
  "mode": "time",
  "input": "reverser",
  "keyframes": [
    { "input": -1, "output": 0 },
    { "input": 1, "output": 2 }
  ]
}
```

## Converting from Better Rolling Stock

Driven Animation does the same job as Better Rolling Stock's `CustomAnimationControllerComponent`, with the same inputs, keyframes and modes. Its numbers for `input` and the mode are the same, so they carry over unchanged. To convert an entry:

| Better Rolling Stock | Driven Animation |
| --- | --- |
| `"kind": "CustomAnimationControllerComponent"` | `"kind": "alex6511.DrivenAnimation"` |
| `animation` | `animation`, unchanged |
| `animationType` (0 speed, 1 time) | `mode` |
| `input` (0 to 5) | `input`, unchanged |
| `keyframes` | `keyframes`, unchanged |
| `continueKeyframes` | `extrapolate` |
| `invertSpeed` | `mirrorNegative` |
| `timeThreshold` | `timeTolerance` |
| | `source`: leave it out to read the car itself, as Better Rolling Stock does |

Before:

```json
{
  "kind": "CustomAnimationControllerComponent",
  "name": "Lubricator",
  "animation": { "clipName": "Lubricator" },
  "animationType": 0,
  "input": 0,
  "keyframes": [ { "input": 0, "output": 0 }, { "input": 60, "output": 2 } ],
  "continueKeyframes": false,
  "invertSpeed": true,
  "timeThreshold": 0.01
}
```

After:

```json
{
  "kind": "alex6511.DrivenAnimation",
  "name": "Lubricator",
  "animation": { "clipName": "Lubricator" },
  "mode": 0,
  "input": 0,
  "keyframes": [ { "input": 0, "output": 0 }, { "input": 60, "output": 2 } ],
  "extrapolate": false,
  "mirrorNegative": true,
  "timeTolerance": 0.01
}
```

Then add `alex6511/bells-and-whistles` to `dependencies.required` in `Info.json`. Remove `legotrainman/better-rolling-stock` only if nothing else in the pack uses it, such as `CustomTruckComponent` or `CouplerMoverCompnent`. `CouplerMoverCompnent` is spelled this way in Better Rolling Stock.

A few things work differently:

- `throttle` and `reverser` on a car that isn't a locomotive read 0 instead of failing.
- In Time mode, targets outside the clip are moved to its start or end, so the clip never keeps running past them.
- `source: "locomotive"` is new. It lets a part on a tender follow the locomotive's throttle, reverser, fuel or water use.
