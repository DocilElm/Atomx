import BaseEvent from "./BaseEvent"

/**
 * - FeatureHandler class to handle multiple events with profiling feature
 * - So that the user can easily make a feature and profile it without issues
 * @class
 */
export default class FeatureHandler {
    constructor(featureName) {
        this.featureName = featureName
        this.subEvents = new Set()

        this.mainEvent = register("tick", () => {
            if (!World.isLoaded() || !this.subEvents.size) return

            this.subEvents.forEach(baseEventClass => {
                // If the event hasn't been registered and the registerWhen
                // function is true start profiling and register the event
                if (baseEventClass.properties.registerWhen() && !baseEventClass.running) {
                    baseEventClass.start()
                    baseEventClass.register()

                    return
                }

                // If the event has been registered and the registerWhen
                // function is false stop profiling and unregister the event
                if (!baseEventClass.properties.registerWhen() && baseEventClass.running) {
                    baseEventClass.stop()
                    baseEventClass.unregister()

                    return
                }
            })
        })
    }

    /**
     * - Creates a new event with profiling features integrated
     * @param {String} name The event name (e.g "step")
     * @param {Function} callbackFn The callback function to run inside of the event
     * @param {{}} properties The properties for this event (e.g a step event will require: { fps: 1, ...etc } or { delay: 1, ...etc } )
     * @returns this for method chaining
     */
    AddEvent(name, callbackFn, properties) {
        this.subEvents.add(new BaseEvent(name, callbackFn, properties, this.featureName))

        return this
    }

    /**
     * - Registers the main event for this class
     * - This event handles all of the other event's registerWhen and whether they should be enabled/disabled
     * @returns this for method chaining
     */
    register() {
        this.mainEvent.register()

        return this
    }

    /**
     * - Unregisters the main event for this class
     * - This event handles all of the other event's registerWhen and whether they should be enabled/disabled
     * @returns this for method chaining
     */
    unregister() {
        this.mainEvent.unregister()

        return this
    }
}