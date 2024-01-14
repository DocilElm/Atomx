// register("packetReceived", (packet, _) => {
//     console.log("packet received")
//     console.log(JSON.stringify(packet))
// })

// ---------- DATABASE --------------
class Rule {
    constructor(name, value) {
        this.name = name
        this.value = value
    }
}

const GardenRule = new Rule("CURRENT_LOCATION", "GARDEN")
// ---------------------------------

// -------- PROCESS MANAGER -----------
const inactive_events = new Map()
const running_events = new Map()

// Proxy the database with an example function
const ProxyDB = new Proxy(DB,
    {
        set(db, key, value) {
        // Get the previous value
        const previous_value = db[key];

        // Get the rules associated with the key
        let rules;
        switch (key) {
            case "CURRENT_LOCATION":
                // Get the rules associated with this key
                rules = [{name: "CURRENT_LOCATION", value: ["GARDEN", "HUB"]}, {name: "CURRENT_LOCATION", value: "GARDEN"}]
                break;
        }

        // Update the DB
        db[key] = value

        // Trigger the events with the rules
        rules.forEach(rule => {
            if (Array.isArray(rule.value)) {
                ProcessManager.TriggerRule(key, rule.value.includes(value), rule.value.includes(previous_value))
            } else {
                ProcessManager.TriggerRule(key, rule.value === value, rule.value === previous_value)
            }
        })

        // Indicate success
        return true;
        },
    },
);

// Load in from DB the rule names into running and inactive events
// So this is just a demonstration
// inactive_events.set("RULE:NOTHING", []) // This one is not needed
inactive_events.set("RULE:WORLD_LOADED", [])
inactive_events.set("RULE:CURRENT_LOCATION:GARDEN", [])
running_events.set("RULE:NOTHING", [])
running_events.set("RULE:WORLD_LOADED", [])
running_events.set("RULE:CURRENT_LOCATION:GARDEN", [])

class Event {
    constructor(register, rules) {
        this.register = register
        this.rules = rules
        this.highest = rules.sort((a, b) => b - a)?.[0]

        ProcessManager.AddEvent(this)
    }
}

const ProcessManager = {
    TriggerRule(rule_name, matches_rule, was_matching_rule) {
        if (!matches_rule && was_matching_rule ) {
            running_events.get(rule_name).forEach(event => event.register.unregister())
            // Move running events to inactive events
            return
        }
        if (matches_rule && !was_matching_rule) {
            inactive_events.get(rule_name).forEach(event => event.register.register())
            // Move inactive events to running events
        }
    },
    AddEvent(event) {
        const event = new Event(register, rules)

        // Check for nothing rule
        if (event.highest == "RULE:NOTHING") {
            running_events.get(event.highest).push(event)
            return
        }
        // Add the rule to inactive events
        inactive_events.get(event.highest).push(event)
    }
}
// ---------------------------------

// ------ DATA COLLECTOR -----------

// Not sure yet how to properly implement this

register("tick", () => {
    // Get scoreboard for location
    // Update location
    ProxyDB.CURRENT_LOCATION = "GARDEN"
})
// ---------------------------------