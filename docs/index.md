# Bells and Whistles

Bells and Whistles is a Railroader mod for rolling-stock authors, the people who make locomotives and cars. It rings tender bells, draws hoses and pipes, tops up tenders from auxiliary water cars and animates moving parts. It also lets a locomotive use both a horn and a whistle.

Players install it so that cars which use these features work in their game.

!!! warning "Experimental: not yet tested in a running game"

    **0.3.0 is an experimental rework for Railroader 0.6.0**. It targets the game's native mod system and was built and checked against the public 0.6.0 release. It has not been tested in a running game yet.

    If you play Railroader 2025.1, this version isn't for you. Bells and Whistles 0.3.0 has no Unity Mod Manager build.

    [See what changed in 0.3.0](whats-new.md)

## Get started

1. **Install it.** [Installing Bells and Whistles](installing.md) takes three steps.
2. **Pick a feature.** [For content authors](authors.md) lists the features and the `Info.json` entry that each one needs.
3. **Set it up.** Use [the in-game editor](editor-authoring.md), or edit `Definitions.json` as the feature's page shows.

## Features

<div class="grid cards" markdown>

-   :material-bell-ring:{ .lg .middle } **Tender Bells**

    ---

    Rings the `Bell` component on a steam locomotive's tender together with the locomotive's bell.

    Optionally, the locomotive's headlights pick one bell to ring. With only the rear headlight on, the tender bell rings alone. Otherwise, the locomotive bell rings alone.

    [:material-arrow-right: Set up tender bells](tender-bells.md)

-   :material-pipe:{ .lg .middle } **Flexible Connectors**

    ---

    Draws simulated hoses, cables and semi-rigid pipes between named transforms (named objects in a car's model). The two ends can be on the same car or on coupled cars.

    [:material-arrow-right: Add flexible connectors](flexible-connectors.md)

-   :material-cog-play:{ .lg .middle } **Driven Animation**

    ---

    Plays an animation clip driven by a car's speed or a locomotive's throttle, reverser, fuel use or water use. Use it for parts such as a lubricator arm or a stoker screw.

    [:material-arrow-right: Add a driven animation](driven-animation.md)

-   :material-bullhorn:{ .lg .middle } **Horn and Whistle**

    ---

    Lets players choose whether the horn control plays the whistle or the horn on a locomotive that has both, such as a steam engine with an air horn.

    [:material-arrow-right: Give a locomotive both](horn-and-whistle.md)

-   :material-water-pump:{ .lg .middle } **Auxiliary Tenders**

    ---

    Keeps a locomotive's tender topped up with water from a coupled auxiliary car. Your pack needs no dependency on Bells and Whistles. For players without it, the car works as a plain water car.

    [:material-arrow-right: Set up an auxiliary tender](aux-tender/README.md)

-   :material-puzzle-plus:{ .lg .middle } **Your own component kinds**

    ---

    This prototype lets your pack declare its own component kinds (new values for a component's `kind`, such as `acme.SignalLamp`) in a `ComponentKinds.json` file. They work like the game's own kinds, but your pack then can't load without Bells and Whistles.

    [:material-arrow-right: Declare your own kinds](component-kinds/README.md)

</div>

Tender Bells, Flexible Connectors, Driven Animation and Horn and Whistle only change what you see and hear. They add no brake, steam, water or electrical simulation. Auxiliary Tenders does move water between cars.

Every feature acts only on cars whose definitions opt in.
