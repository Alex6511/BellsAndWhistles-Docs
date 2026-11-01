---
title: Feature examples
editUrl: false
---

These B&W 0.3.0 templates show native Script declarations and Relay imports. Supply your own models, physical locomotive data, load targets, native industry definitions and audio assets before using them as equipment or scenery. They are **authoring templates**, not an installable equipment pack.

- [Pack manifest](/BellsAndWhistles-Docs/0.3.0/feature-examples/Info.json)
- [Nine native definition templates](/BellsAndWhistles-Docs/0.3.0/feature-examples/Definitions.json)
- [Runtime Main.rl](/BellsAndWhistles-Docs/0.3.0/feature-examples/Scripts/Main.rl)
- [Disposable Relay inspector](/BellsAndWhistles-Docs/0.3.0/feature-examples/Scripts/Inspector.rl)
- [Data.rl patch example](/BellsAndWhistles-Docs/0.3.0/feature-examples/Scripts/Data.rl.example)
- [Template notes](/BellsAndWhistles-Docs/0.3.0/feature-examples/README.md)

The definitions cover geared coal, geared oil with a separate tender, wood with a separate tender, an oil tank engine, finite oil and wood facilities, and author-supplied audio. The inspector covers geared, firing, connectors, bells, auxiliary tenders, Driven Animation and Horn/Whistle. Facility inspection uses `BWFuelService`; see the [complete settings/API coverage table](/BellsAndWhistles-Docs/0.3.0/settings-api-coverage/).

The templates deserialize through the native definition reader, and their Relay scripts parse against the current interpreter. Separate consumer fixtures execute the exported APIs from Main, file and inline scripts and execute the authoring helpers in a data-only interpreter. These checks do not establish that an unfinished equipment template is playable.

The combined artifact also passed native Unity curve-concurrency, immediate-reload and author-audio checks. Two generated author clips loaded concurrently, relative and declared cross-pack references resolved, invalid assets stayed bounded, and cache cleanup/cancellation/reload succeeded. No original locomotive recording was used. Fresh gameplay, editor, save/reload and multiplayer acceptance of the combined artifact remain separate from these checks and from the maintainer's earlier confirmed in-game testing of 0.3.0.
