import EventBus from "./EventBus"

export class EventFactory {
    static MakeEvent(name, callback) {
        return new EventFactory.BaseEvent(name, callback)
    }

    // The base class that events extend
    // All logic that needs to be shared is stored here
    static BaseEvent = class {
        constructor(name, callback) {
            this.name = name.toLowerCase()
            this.callback = callback
            this.running = true

            // I am a JS connoisseur - Dalwyn
            this.RunCallback = this.RunCallback.bind(this)
        }

        RunCallback(...parameters) {
            this.callback(...parameters)

            // Update the profiler's count when the function is ran
            // if the profiler is currently being run
            if (!EventBus.profiling) return
            EventBus.profiler[this.name] += 1
        }

        start() {
            if (!this.register) {
                throw new Error(`This event ${this.name} does not have an assigned register, it cannot be started`)
            }

            this.running = true
            this.register.register()
        }

        stop() {
            if (!this.register) {
                throw new Error(`This event ${this.name} does not have an assigned register, it cannot be stopped`)
            }

            this.running = false
            this.register.unregister()
        }

    }

    // static FilterWrapper = class {
    //     /*
    //     properties object
    //     {
    //         registerWhen() {
    //             return World.isLoaded()
    //         },
    //         register: "tick"
    //     }
    //     */
    //     constructor(properties, event) {
    //         this.event = event
    //         this.filter = register(properties.register, (...parameters) => {
    //             const should_be_running = properties.registerWhen(...parameters)
    //             const is_currently_running = event.running

    //             if (should_be_running && !is_currently_running) event.start()
    //             else if (!should_be_running && is_currently_running) event.stop()
    //         })
    //     }

    //     GetUnderlyingEvent() {
    //         return this.event
    //     }

    //     // Be able to change the filter condition, requires
    //     // unregistering current filter and making a new one
    // } 
}

export class TickEvent extends EventFactory.BaseEvent {
    constructor(callback) {
        super("tick", callback)

        // Doc fixed this on 02/01/2024, what a legend
        this.register = register("tick", this.RunCallback)
    }
}

export class CommandEvent extends EventFactory.BaseEvent {
    /**
     * The parameters for properties are
     * 
     * @param {String} commandName The command name to be set into this register
     * @param {String|Array} commandAlias The alis or aliases to set into this command
     */
    constructor(properties, callback) {
        super("command", callback)

        this.register = register("command", this.RunCallback)
            .setName(properties.name)
            .setAliases(properties.aliases)
    }
}

export class StepEvent extends EventFactory.BaseEvent {
    /**
     * The parameters for properties are
     * 
     * @param {Number} steps How many times it should be run or how long it should wait depending on @delay
     * @param {Boolean} delay If it should use the wait X seconds instead of X fires per second method
     */
    constructor(properties, callback) {
        super("step", callback)
        
        this.register = register("step", this.RunCallback)

        if (properties.delay) {
            this.register.setDelay(properties.steps)
        } else {
            this.register.setFps(properties.steps)
        }
    }
}

export class RenderOverlayEvent extends EventFactory.BaseEvent {
    constructor(callback) {
        super("renderOverlay", callback)

        this.register = register("renderOverlay", this.RunCallback)
    }
}