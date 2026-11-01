---
title: Migrating content to 0.3.0
editUrl: false
---

The combined **0.3.0** release targets Railroader **0.6.2 or later**. It brings native B&W authoring together with Geared Steam, oil/wood firing, fuel services and Relay APIs. Use the frozen 0.3.0 snapshot for this package's authoring contract and recorded validation limits.

If you play Railroader 2025.1, this version isn't for you. Bells and Whistles 0.3.0 has no Unity Mod Manager build.

## Existing B&W content

- Native TenderBell and FlexibleConnector carriers keep their settings under `parameters`.
- Legacy `kind: "FlexibleConnector"` still needs B&W as a required dependency; a carrier can be optional when the pack works without its visual effect.
- Driven Animation and pack-defined component kinds require B&W.
- The optional aux-water-car pattern still uses a disabled AuxTender carrier, a load-order hint and a marker check. That pattern does not make unconditional B&W module imports optional.
- Tender bells with real Bell components and locomotives with both horn and whistle can receive their default behavior without an extra configuration carrier.

Use [the dependency table](/BellsAndWhistles-Docs/0.3.0/authors/#set-up-your-packs-infojson) for the combination of features your pack actually uses.

## Geared Steam and firing providers

1. Update consumer packs to require `alex6511/bells-and-whistles >=0.3.0` and `rr/game >=0.6.2`.
2. Replace obsolete provider dependencies when nothing else in the pack uses them. B&W does not publish replacement packages under the old providers' IDs, so an old required ID can still block loading.
3. Use [GearedSteam](/BellsAndWhistles-Docs/0.3.0/geared-steam/) and [AlternativeFiring](/BellsAndWhistles-Docs/0.3.0/alternative-firing/) carriers for new definitions. Existing geared sidecars and configured legacy oil bindings remain migration inputs.
4. Supply your own native mechanical AudioClip if you want gear-loop audio. B&W does not distribute the original gear-noise recording.
5. Remove the superseded standalone geared/firing executable providers from the enabled mod set. B&W detects recognized overlapping providers, including ones loaded later, and disables its overlapping behavior rather than applying it twice.
6. Check the Messages panel for duplicate declarations, invalid profiles, missing dependencies/assets and incompatible fuel loads.

A Data.rl patch can add a native declaration to another pack's locomotive. Set the geared carrier's `assetPack` to the pack providing the audio, and require both the target content pack and any external audio provider.

## Preserve loads and preferences

Keep fuel and water in distinct slots, and keep the load IDs, slot indexes and units consistent. Do not turn an existing coal quantity into oil or wood by changing its ID alone. B&W normalizes known legacy aliases only when their units match; other saved-load conversions require an explicit migration.

Geared preferences move to B&W's own settings file when it does not already exist. The original `geared-steam.json` is retained. Per-car gear volume remains local to each player.

B&W's finite fuel outlets use native industry stock. They do not refill storage when a carrier or world reloads. Outlet enabled state and requested target persist in the bound industry's native properties. Every storage binding, including infinite supply, therefore needs an industry ID.

## Multiplayer and release checks

The combined B&W package uses native `scope: "unscoped"`: its package/version participates in multiplayer matching. An author pack's optional dependency does not turn the B&W package into a client-only cosmetic mod. See Railroader's [scope and dependency reference](https://docs.railroadergame.com/modding/info-json/#scope-optional).

Before distributing a converted pack, check its dependency resolution, carrier parameters, saved load units, author audio resolution and behavior with the matching B&W release. Record the checks actually performed. The maintainer has confirmed in-game testing of B&W 0.3.0; do not invent blanket testing claims for individual integrations.

[Versions and audits](/BellsAndWhistles-Docs/0.3.0/versions/) describes how the development guides become a frozen release snapshot.
