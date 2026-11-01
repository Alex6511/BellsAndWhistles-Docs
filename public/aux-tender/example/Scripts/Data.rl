// Turns on the aux tender script only when Bells and Whistles provides it, so the car still
// loads cleanly, with no warnings, for players who don't have that mod.
func modifyDefinitions(definitions) {
    if definitions.getDefinition("alex6511/aux-tender-api-v1") == null { return }
    definitions.merge("eilelwen/vgn-ae-at", {
        "definition": { "components": { "aux-tender": { "enabled": true } } }
    })
}
