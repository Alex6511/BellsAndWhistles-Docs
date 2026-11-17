import "alex6511/BWGeared" as geared
import "alex6511/BWFiring" as firing
import "alex6511/BWConnectors" as connectors
import "alex6511/BWBells" as bells
import "alex6511/BWAuxTender" as auxiliary
import "alex6511/BWAnimation" as animation
import "alex6511/BWHornWhistle" as instrument
import log
var subscriptions = []
func report(result) {
    if result["ok"] { log.info("B&W state: \(result["value"])") }
    else { log.warning("B&W: \(result["message"])") }
}
func onObjectLoad(car) {
    dispose()
    subscriptions = [geared.observe(car, report), firing.observe(car, report),
        connectors.observe(car, report), bells.observe(car, report), auxiliary.observe(car, report),
        animation.observe(car, report), instrument.observe(car, report)]
}
func dispose() {
    for subscription in subscriptions { subscription.dispose() }
    subscriptions = []
}
func onObjectUnload(car) { dispose() }
