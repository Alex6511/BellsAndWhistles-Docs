// Example script for the "example.CarGreeting" component kind declared in ../ComponentKinds.json.
//
// Bells and Whistles runs it the way the game runs a Script component's script. The component's
// settings arrive in `parameters` with their declared types: text, whole number, decimal,
// true/false and list of text. Settings a definition leaves out have their declared defaults.

import log

var greeter = null

func onObjectLoad(car) {
    if greeter != null { return }
    greeter = Coroutine(() => {
        yield parameters["delaySeconds"]
        let text = "\(parameters["greeting"]) \(car.name) \(parameters["tags"])"
        for i in 0..<parameters["repeat"] {
            if parameters["asWarning"] {
                log.warning(text)
            } else {
                log.info(text)
            }
        }
    })
}

func onObjectUnload(car) {
    if greeter != null {
        greeter.stop()
        greeter = null
    }
}
