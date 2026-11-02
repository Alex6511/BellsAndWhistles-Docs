---
title: Feature examples
---

These development templates following B&W 0.3.0 show native Script declarations, Relay imports, and oil/wood receiving facilities. Supply your own models, physical locomotive data, load targets, native industry definitions and audio assets before using them as equipment or scenery. They are **authoring templates**, not an installable equipment pack. The frozen 0.3.0 examples remain available in that version's guide.

- [Pack manifest](/BellsAndWhistles-Docs/feature-examples/Info.json)
- [Nine native definition templates](/BellsAndWhistles-Docs/feature-examples/Definitions.json)
- [Runtime Main.rl](/BellsAndWhistles-Docs/feature-examples/Scripts/Main.rl)
- [Disposable Relay inspector](/BellsAndWhistles-Docs/feature-examples/Scripts/Inspector.rl)
- [Data.rl patch example](/BellsAndWhistles-Docs/feature-examples/Scripts/Data.rl.example)
- [Oil/wood receiving industry map patch](/BellsAndWhistles-Docs/feature-examples/FuelLoaders.MapPatch.json)
- [Receiving map Data.rl example](/BellsAndWhistles-Docs/feature-examples/Scripts/FuelLoaders.Data.rl.example)
- [Template notes](/BellsAndWhistles-Docs/feature-examples/README.md)

The definitions cover geared coal, geared oil with a separate tender, wood with a separate tender, an oil tank engine, finite oil and wood facilities, and author-supplied audio. The inspector covers geared, firing, connectors, bells, auxiliary tenders, Driven Animation and Horn/Whistle. Facility inspection uses `BWFuelService`; see the [complete settings/API coverage table](/BellsAndWhistles-Docs/settings-api-coverage/).

The receiving examples connect interchange-bought `toolshed/bunker-c` and provider-sourced `rr/pulpwood` to finite native stock. The [adaptation notes](/BellsAndWhistles-Docs/feature-examples/README.md) cover track locations, freight waybills, separate prop placement, capacities, day-versus-second rates and outlet servicing. The new oil purchase path requires the unreleased follow-up build.

The templates deserialize through the native definition reader, and their Relay scripts parse against the current interpreter. Separate consumer fixtures execute the exported APIs from Main, file and inline scripts and execute the authoring helpers in a data-only interpreter. These checks do not establish that an unfinished equipment template is playable.

The combined artifact also passed native Unity curve-concurrency, immediate-reload and author-audio checks. Two generated author clips loaded concurrently, relative and declared cross-pack references resolved, invalid assets stayed bounded, and cache cleanup/cancellation/reload succeeded. No original locomotive recording was used. See [runtime validation](/BellsAndWhistles-Docs/runtime-validation/) for the subsequent isolated gameplay, editor and reload results and the remaining multiplayer limitation. Those results do not make these unfinished templates playable.
