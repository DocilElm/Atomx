import { onChatPacket } from "./Register"

const messagesToHide = [
    /^-*$/,
    /^Party (Members|Members\:|Leader\:|Moderators\:).+$/,
    /^You are not currently in a party\.$/
]

const removeRank = (name) => name.replace(/(\[[A-z]+\++\] )/, "")

/**
 * - Class to handle (almost) everything one could need from the user's party
 * @class
 */
export default new class Party {
    /**
     * - Makes a new [Party] class
     */
    constructor() {
        // These variables should not be reset
        this.commandSent = false

        // Init methods
        this._reset()
        this._reloadRegex()

        this.register = register("step", () => {
            if (!World.isLoaded() || this.commandSent) return

            ChatLib.command("pl", false)

            this.register.unregister()

            setTimeout(() => {
                this.commandSent = true
            }, 400)
        }).setFps(1)

        onChatPacket((msg, event) => {
            if (messagesToHide.some(reg => reg.test(msg)) && !this.commandSent) cancel(event)

            // Add members count into the variable
            if (this.membersAmountRegex.test(msg)) return this.party.MembersCount = parseInt(msg.match(this.membersAmountRegex)[1])

            // Return if the [msg] doesn't match the [partyMembersRegex]
            if (!this.partyMembersRegex.test(msg)) return

            // Add members whenever "/p list" is sent
            const [ _, memberType, members ] = msg.match(this.partyMembersRegex)

            // Splits all the players to make them into an array
            const memberArr = members.split(" ●")

            memberArr.forEach(name => {
                // Checks whether the player name is not empty
                if (!name) return

                // Adds it into the list with the given [memberType]
                this.party[memberType][removeRank(name)] = removeRank(name)
            })

            return

        })

        // The current registers is all based off of a single register
        // so it doesn't matter if i create multilpe of them since they'll
        // all go towards the same one and it's easier to handle anyways

        this.playerJoined.forEach(reg => 
            onChatPacket(name => {
                this.party.Members[name] = name
            }, reg))

        this.playerLeft.forEach(reg => 
            onChatPacket(name => {
                delete this.party.Members[name]
                delete this.party.Moderators[name] // -> just in case
            }, reg))

        this.noParty.forEach(reg => onChatPacket(() => this._reset(), reg))

        this.partyLeader.forEach(reg => onChatPacket(name => {
            this.party.Leader = name
            this.isInParty = true

            delete this.party.Members[name]
            delete this.party.Moderators[name] // -> just in case
        }, reg))
    }

    // maybe add this into the api instead of here
    /**
     * - Internal use
     */
    _reloadRegex() {
        this.membersAmountRegex = /^Party Members \((\d+)\)$/
        this.partyMembersRegex = /^Party (Members|Moderators)\: (.+ ●) ?$/

        this.noParty = [
            /^You are not currently in a party\.$/,
            /^You have been kicked from the party by (?:\[[A-z\+]+\])? ?([\w]{1,16})$/,
            /^The party was disbanded because the party leader disconnected\.$/,
            /^The party was disbanded because all invites expired and the party was empty\.$/,
            /^You left the party\.$/
        ]

        this.partyLeader = [
            /^Party Leader\: (?:\[[A-z\+]+\])? ?([\w]{1,16}) ●$/,
            /^The party was transferred to (?:\[[A-z\+]+\])? ?([\w]{1,16}) by .+$/,
            /^You have joined (?:\[[A-z\+]+\])? ?([\w]{1,16})\'s party\!$/,
            /^(?:\[[A-z]+\++\])? ?([\w]{1,16}) invited .+ to the party\! They have 60 seconds to accept\.$/
        ]

        this.playerJoined = [
            /^(?:\[[A-z]+\++\])? ?([\w]{1,16}) joined the party\.$/,
            /^.+ invited (?:\[[A-z]+\++\])? ?([\w]{1,16}) to the party\! They have 60 seconds to accept\.$/
        ]

        this.playerLeft = [
            /^(?:\[[A-z]+\++\])? ?([\w]{1,16}) has been removed from the party\.$/,
            /^(?:\[[A-z]+\++\])? ?([\w]{1,16}) has left the party\.$/,
            /^(?:\[[A-z]+\++\])? ?([\w]{1,16}) was removed from your party because they disconnected\.$/,
            /^Kicked (?:\[[A-z]+\++\])? ?([\w]{1,16}) because they were offline\.$/
        ]
    }

    /**
     * - Internal use
     */
    _reset() {
        this.party = {
            "Members": {},
            "Moderators": {},
            "Leader": null,
            "MembersCount": 0
        }

        this.isInParty = false
    }

    /**
     * - Whether the player is currently in a party or not
     * @returns {Boolean}
     */
    inParty() {
        return this.isInParty
    }

    /**
     * - Gets the current party's object, e.g { Members: ...etc, Moderators: ...etc, Leader: DocilElm }
     * @returns {Object}
     */
    getObject() {
        return this.party
    }

    /**
     * - Gets the current party's leader
     * @returns {String|null}
     */
    getLeader() {
        return this.party.Leader
    }

    /**
     * - Gets the current party's members list
     * @returns {Array}
     */
    getMembers() {
        return Object.values(this.party.Members)
    }

    /**
     * - Gets the current party's moderators list
     * @returns {Array}
     */
    getModerators() {
        return Object.values(this.party.Moderators)
    }

    /**
     * - Gets the current party's total users count
     * @returns {Number}
     */
    getPartyCount() {
        return this.party.MembersCount
    }
}