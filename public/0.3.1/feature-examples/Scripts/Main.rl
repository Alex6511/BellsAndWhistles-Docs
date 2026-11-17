import "alex6511/BWGeared" as geared
import "alex6511/BWFuelService" as service
import log
func onWorldLoad() {
    let caps = geared.capabilities()
    log.info("B&W \(caps["packageVersion"]), API \(caps["apiVersion"])")
    let sources = service.listStorages()
    if !sources["ok"] { log.warning(sources["message"]) }
}
