import AtomxApi from "./AtomxApi"
import Events from "./events"

export default Atomx = {
    Events: Events
}

register("command", () => AtomxApi._checkVersion()).setName("atomx forceapireload")