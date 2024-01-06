import { onScoreboardPacket } from "./Register"

const cleanMatch = (regex, str) => parseFloat(str.match(regex)[1].replace(/,/g, ""))

/*
TODO:
add player's stats from sb menu
add player's current equipped pet
add other world's player's stats e.g different money type inside of the rift
save collection, skill average, total pet xp & more
*/

export default new class ThePlayer {
    constructor() {
        // Init methods
        this._reset()
        this._reloadRegex()

        onScoreboardPacket(msg => {
            if (this.purseRegex.test(msg)) return this.purse = cleanMatch(this.purseRegex, msg)
            if (this.bitsRegex.test(msg)) return this.bits = cleanMatch(this.bitsRegex, msg)
            if (this.copperRegex.test(msg)) return this.copper = cleanMatch(this.copperRegex, msg)
        })
    }

    _reloadRegex() {
        this.purseRegex = /^Purse\: ([\d,.]+) ?(?:[\(\)\d\+,.]+)?$/
        this.bitsRegex = /^Bits\: ([\d,.]+) ?(?:[\(\)\d\+,.]+)?$/
        this.copperRegex = /^Copper\: ([\d,.]+) ?(?:[\(\)\d\+,.]+)?$/
    }
    
    _reset() {
        this.purse = 0
        this.bits = 0
        this.copper = 0

        this.health = 0
        this.maxHealth = 0
        this.mana = 0
        this.maxMana = 0
        this.defense = 0
    }

    /**
     * - Gets the player's purse money
     * @returns {Number}
     */
    getPurse() {
        return this.purse
    }

    /**
     * - Gets the player's bits
     * @returns {Number}
     */
    getBits() {
        return this.bits
    }

    /**
     * - Gets the player's copper
     * @returns {Number}
     */
    getCopper() {
        return this.copper
    }

    /**
     * - Gets the player's health
     * @returns {Number}
     */
    getHealth() {
        return this.health
    }

    /**
     * - Gets the player's max health
     * @returns {Number}
     */
    getMaxHealth() {
        return this.maxHealth
    }

    /**
     * - Gets the player's mana
     * @returns {Number}
     */
    getMana() {
        return this.mana
    }

    /**
     * - Gets the player's max mana
     * @returns {Number}
     */
    getMaxMana() {
        return this.maxMana
    }

    /**
     * - Gets the player's defense
     * @returns {Number}
     */
    getDefense() {
        return this.defense
    }
}