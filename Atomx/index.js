import Events from "./events"
import AtomxApi from "./skyblock/AtomxApi"

export default Atomx = {
    Events: Events
}

register("command", () => AtomxApi._checkVersion()).setName("atomx forceapireload")