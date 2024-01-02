export default new class EventBus {
    constructor() {
        this.events = {}
        this.profiling = false

        // --- [events] variable
        // {
        //     "tick": [
        //         [object BaseEvent],
        //         [object BaseEvent],
        //         [object BaseEvent]
        //     ]
        // }
    }

    AddEvent(event) {
        if (!(event.name in this.events)) this.events[event.name] = []

        event.id = this.events[event.name].length
        this.events[event.name].push(event)
    }

    StartProfiler() {
        this.profiler = new Map()

        // Setup an entry in the profiler for every event to measure
        // how many times the event was called during the profiler
        for (event_name in Object.keys(this.events)) {
            this.profiler.set(event_name, 0)
        }

        this.profiling = true
    }

    StopProfiler() {
        this.profiling = false
        // I hate javascript ~~sometimes~~ all the time - Dalwyn
        return this.profiler && delete this.profiler
    }

    GetAllEvents() {
        // I do love javascript sometimes. Ignore the comment above this, I was angry then - Dalwyn
        return Object.values(this.events).reduce((result, events) => result.concat(events), [])
    }

    GetAllEventsByName(name) {
        return this.events[name]
    }
}