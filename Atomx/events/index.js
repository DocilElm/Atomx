// Greetings to anyone who will read any of the code within this part
// At the time of writing it I was annoyed, hungry and tired. You will
// notice this when reading the code in the comments. I do not care
// - Dalwyn (still annoyed, hungry and tired)

// A very, very well made event system that totally does NOT rely on quircks
// of the JS language. Which is the perfect language ever, said no one ever
// So to get on with it. Read the code, the comments cover about 5% of the 
// functionality or reason for writing said code. Good luck, I guess. 

import EventBus from "./EventBus"
import { CommandEvent, StepEvent, TickEvent } from "./Events"

// Interface to export
export default class Events {
    /**
     * - Create an event
     * 
     * @param {*} name The name of the event 
     * @param {Function} callback The function to call when the event is fired
     * @param {object?} properties 
     * @returns {object} Event
     */
    static Event(name, callback, properties = null) {
        let event
        
        switch (name.toLowerCase()) {
            case "tick":
                event = new TickEvent(callback); break
            case "command":
                event = new CommandEvent(properties, callback); break
            case "step":
                event = new StepEvent(properties, callback); break
            default:
                throw new Error(`${name} is not an event`)
        }

        EventBus.AddEvent(event)
        return event
    }

    // static AddFilter(event, properties) {
    // }

    /**
     * Starts the profiler
     * @returns {Events} this
     */
    static StartProfiler() {
        EventBus.StartProfiler()
        return this
    }

    /**
     * Stops the profiler
     * @returns {Events} this
     */
    static StopProfiler() {
        EventBus.StopProfiler()
        return this
    }

    /**
     * Stop all the events
     * @returns {Events} this
     */
    static StopAllEvents() {
        EventBus.GetAllEvents().forEach(event => event.stop())
        return this
    }

    // I engineer - Not Dalwyn for once 
    // [Made By Dalwyn (this is left open on purpose, deal with it)
    /**
     * Stop all the events of a specific name
     * @param {*} name 
     * @returns 
     */
    static StopAllEventsByName(name) {
        EventBus.GetAllEventsByName(name).forEach(event => event.stop())
        return this
    }
}

// P.S. Not good luck, you chose to read this mess.
// I'm not sure I warned you before but I warn you now.