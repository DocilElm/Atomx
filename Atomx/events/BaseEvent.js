import { TextHelper } from "../helper/Text"

// Constant used to get the packet's ENUMS
// and also filter the class in packetRecieved event
const S38PacketPlayerListItem = net.minecraft.network.play.server.S38PacketPlayerListItem

/**
 * - BaseEvent class to create events with profiling features integrated into them
 * @class
 */
export default class BaseEvent {
    constructor(name, callbackFn, properties, featureName) {
        this.name = name.toLowerCase()
        this.callbackFn = callbackFn
        this.properties = properties
        this.featureName = featureName

        this.timesRan = 0
        this.startedAt = null
        this.stoppedAt = null
        this.running = false
        this.event = null

        this._create()
    }

    /**
     * - Internal use
     * - Creates the event for this class
     */
    _create() {
        const profilingFn = (...params) => {
            this.timesRan += 1

            this.callbackFn(...params)

            if (this.properties.debugMode) ChatLib.chat(`&c[&4Atomx&c]&r &aDebugging &b${this.featureName} &aEvent: &b${this.name} &ahas ran &7x${this.timesRan} &afor &6${(this.stoppedAt ?? Date.now()) - (this.startedAt ?? Date.now())}ms`)
        }

        // Make a basic registerWhen function if the user doesn't assign one
        if (!("registerWhen" in this.properties)) this.properties.registerWhen = () => World.isLoaded()

        switch (this.name) {
            // "Vanilla" events
            case "step":
                if ("delay" in this.properties) return this.event = register("step", profilingFn.bind(this)).setDelay(this.properties.delay).unregister()
                if ("fps" in this.properties) return this.event = register("step", profilingFn.bind(this)).setFps(this.properties.fps).unregister()

                break

            case "soundplay":
                this.event = register("soundPlay", profilingFn.bind(this)).setCriteria(this.properties.criteria).unregister()
                
                break

            // Custom events
            case "scoreboardpacket":
                this.event = register("packetRecieved", (packet, rEvent) => {
                    const channel = packet.func_149307_h()
                    if (channel !== 2) return

                    const teamStr = packet.func_149312_c()
                    const teamMatch = teamStr.match(/^team_(\d+)$/)
                    if (!teamMatch) return

                    const formatted = packet.func_149311_e().concat(packet.func_149309_f())
                    const unformatted = formatted.removeFormatting()

                    if (!unformatted) return

                    TextHelper.matchesCriteria(profilingFn.bind(this), this.properties.criteria, unformatted, rEvent, formatted)
                }).setFilteredClass(net.minecraft.network.play.server.S3EPacketTeams).unregister()

                break

            case "tabupdatepacket":
                this.event = register("packetReceived", (packet, rEvent) => {
                    const players = packet.func_179767_a() // .getPlayers()
                    const action = packet.func_179768_b() // .getAction()
                
                    if (action !== S38PacketPlayerListItem.Action.UPDATE_DISPLAY_NAME) return
                
                    players.forEach(addPlayerData => {
                        const name = addPlayerData.func_179961_d() // .getDisplayName()
                        
                        if (!name) return
                
                        const formatted = name.func_150254_d() // .getFormattedText()
                        const unformatted = formatted.removeFormatting()
                    
                        if (action !== S38PacketPlayerListItem.Action.UPDATE_DISPLAY_NAME) return
                
                        TextHelper.matchesCriteria(profilingFn.bind(this), this.properties.criteria, unformatted, rEvent, formatted)
                    })
                }).setFilteredClass(S38PacketPlayerListItem).unregister()

                break

            case "tabaddpacket":
                this.event = register("packetReceived", (packet, rEvent) => {
                    const players = packet.func_179767_a() // .getPlayers()
                    const action = packet.func_179768_b() // .getAction()
        
                    if (action !== S38PacketPlayerListItem.Action.ADD_PLAYER) return
        
                    players.forEach(addPlayerData => {
                        const name = addPlayerData.func_179961_d() // .getDisplayName()
                        
                        if (!name) return
        
                        const formatted = name.func_150254_d() // .getFormattedText()
                        const unformatted = formatted.removeFormatting()
                    
                        if (action !== S38PacketPlayerListItem.Action.ADD_PLAYER) return
        
                        TextHelper.matchesCriteria(profilingFn.bind(this), this.properties.criteria, unformatted, rEvent, formatted)
                    })
                }).setFilteredClass(S38PacketPlayerListItem).unregister()

                break

            case "tabfooterpacket":
                this.event = register("packetReceived", (packet, rEvent) => {
                    packet.func_179701_b()?.func_150253_a()?.forEach(chatComponent => {
                        const formatted = chatComponent.func_150254_d()
                        const unformatted = formatted?.removeFormatting()
        
                        TextHelper.matchesCriteria(profilingFn.bind(this), this.properties.criteria, unformatted, rEvent, formatted)
                    })
                }).setFilteredClass(net.minecraft.network.play.server.S47PacketPlayerListHeaderFooter).unregister()

                break

            case "windowitemspacket":
                this.event = register("packetReceived", (packet) => {
                    profilingFn(packet.func_148910_d())
                }).setFilteredClass(net.minecraft.network.play.server.S30PacketWindowItems).unregister()

                break

            case "windowopenpacket":
                this.event = register("packetReceived", (packet) => {
                    const windowTitle = packet.func_179840_c().func_150254_d().removeFormatting()
                    const windowID = packet.func_148901_c()
                    const hasSlots = packet.func_148900_g()
                    const slotCount = packet.func_148898_f()
                    const guiID = packet.func_148902_e()
                    const entityID = packet.func_148897_h()
                
                    profilingFn(windowTitle, windowID, hasSlots, slotCount, guiID, entityID)
                }).setFilteredClass(net.minecraft.network.play.server.S2DPacketOpenWindow).unregister()

                break

            case "chatpacket":
                this.event = register("packetReceived", (packet, rEvent) => {
                    // Check if the packet is for the actionbar
                    if (packet.func_148916_d()) return
        
                    const chatComponent = packet.func_148915_c()        
                    const formatted = chatComponent?.func_150254_d()
                    const unformatted = formatted?.removeFormatting()
                
                    if (!unformatted) return
                    
                    TextHelper.matchesCriteria(profilingFn.bind(this), this.properties.criteria, unformatted, rEvent, formatted)
                }).setFilteredClass(net.minecraft.network.play.server.S02PacketChat).unregister()

                break

            case "actionbarpacket":
                this.event = register("packetReceived", (packet, rEvent) => {
                    // Check if the packet is for the actionbar
                    if (!packet.func_148916_d()) return
        
                    const chatComponent = packet.func_148915_c()        
                    const formatted = chatComponent?.func_150254_d()
                    const unformatted = formatted?.removeFormatting()
                    
                    if (!unformatted) return
                    
                    TextHelper.matchesCriteria(profilingFn.bind(this), this.properties.criteria, unformatted, rEvent, formatted)
                }).setFilteredClass(net.minecraft.network.play.server.S02PacketChat).unregister()

                break

            case "playerblockplacementpacket":
                this.event = register("packetSent", (packet) => {
                    const position = packet.func_179724_a()
                    const blockPosition = new BlockPos(position)
                
                    const [ x, y, z ] = [blockPosition.x, blockPosition.y, blockPosition.z]
                    const ctBlock = World.getBlockAt(x, y, z)
        
                    profilingFn(ctBlock, [x, y, z], blockPosition)
                }).setFilteredClass(net.minecraft.network.play.client.C08PacketPlayerBlockPlacement).unregister()

                break

            case "playerclickwindowpacket":
                this.event = register("packetSent", (packet) => {
                    // Container name, Slot clicked
                    profilingFn(Player.getContainer().getName(), packet.func_149544_d())
                }).setFilteredClass(net.minecraft.network.play.client.C0EPacketClickWindow).unregister()

                break
        
            default:
                this.event = register(this.name, profilingFn.bind(this)).unregister()
        }
    }

    /**
     * - Starts the profiler for this event
     * @returns this for method chaining
     */
    start() {
        this.startedAt = Date.now()
        this.timesRan = 0
        this.stoppedAt = null

        return this
    }

    /**
     * - Stops the profiler for this event
     * @returns this for method chaining
     */
    stop() {
        this.stoppedAt = Date.now()

        return this
    }

    /**
     * - Resets the profiler for this event
     * @returns this for method chaining
     */
    reset() {
        this.startedAt = null
        this.timesRan = 0
        this.stoppedAt = null

        return this
    }

    /**
     * - Registers this event
     * - If the event is already running it'll return (meaning it will do nothing)
     * @returns this for method chaining
     */
    register() {
        if (this.running) return

        this.running = true
        this.event.register()

        return this
    }

    /**
     * - Unregisters this event
     * - If the event isn't already running it'll return (meaning it will do nothing)
     * @returns this for method chaining
     */
    unregister() {
        if (!this.running) return

        this.running = false
        this.event.unregister()

        return this
    }
}