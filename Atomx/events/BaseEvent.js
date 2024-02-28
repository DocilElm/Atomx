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
        const profilingFn = () => {
            this.timesRan += 1

            this.callbackFn()

            if (this.properties.debugMode) ChatLib.chat(`&c[&4Atomx&c]&r &aDebugging &b${this.featureName} &aEvent: &b${this.name} &ahas ran &7x${this.timesRan} &afor &6${(this.stoppedAt ?? Date.now()) - (this.startedAt ?? Date.now())}ms`)
        }

        // Make a basic registerWhen function if the user doesn't assign one
        if (!("registerWhen" in this.properties)) this.properties.registerWhen = () => World.isLoaded()

        switch (this.name) {
            case "step":
                if ("delay" in this.properties) return this.event = register("step", profilingFn.bind(this)).setDelay(this.properties.delay).unregister()
                if ("fps" in this.properties) return this.event = register("step", profilingFn.bind(this)).setDelay(this.properties.fps).unregister()
                break

            case "tick":
                this.event = register("tick", profilingFn.bind(this)).unregister()
                break
        
            default:
                throw new Error(`Event with name ${this.name} isn't in the list`)
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