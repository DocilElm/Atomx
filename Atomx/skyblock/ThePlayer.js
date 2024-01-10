import { onActionbarPacket, onOpenWindowPacket, onScoreboardPacket, onWindowItemsPacket } from "./Register"

const removeCommas = (string) => parseFloat(string.replace(/,/g, ""))

/**
 * - Class that handles alot of utilities for the current player's data
 * - Skill average, hp, mana, defense etc...
 * @class
 */
export default new class ThePlayer {
    /**
     * - Creates a new [ThePlayer] class
     */
    constructor() {
        // This variable should not reset
        this.inSbMenu = false

        // Init methods
        this._reset()
        this._reloadRegex()

        onScoreboardPacket(msg => {
            if (this.purseRegex.test(msg)) return this.purse = removeCommas(msg.match(this.purseRegex)[1])
            if (this.bitsRegex.test(msg)) return this.bits = removeCommas(msg.match(this.bitsRegex)[1])
            if (this.copperRegex.test(msg)) return this.copper = removeCommas(msg.match(this.copperRegex)[1])
            if (this.motesRegex.test(msg)) return this.motes = removeCommas(msg.match(this.motesRegex)[1])
        })

        onActionbarPacket(msg => {
            if (this.healthRegex.test(msg)) {
                const [ _, health, maxHealth ] = msg.match(this.healthRegex)

                this.health = removeCommas(health)
                this.maxHealth = removeCommas(maxHealth)
            }

            if (this.manaRegex.test(msg)) {
                const [ _, mana, maxMana ] = msg.match(this.manaRegex)

                this.mana = removeCommas(mana)
                this.maxMana = removeCommas(maxMana)
            }

            if (this.defenseRegex.test(msg)) this.defense = removeCommas(msg.match(this.defenseRegex)[1])
            if (this.overflowManaRegex.test(msg)) this.overflowMana = removeCommas(msg.match(this.overflowManaRegex)[1])
        })

        onOpenWindowPacket(name => this.inSbMenu = name === "SkyBlock Menu")

        onWindowItemsPacket(itemStacks => {
            if (!this.inSbMenu) return

            itemStacks.forEach((vStack, idx) => {
                if (!vStack || idx >= 54) return

                const item = new Item(vStack)
                if (item.getID() === 160) return

                const unformattedName = item.getName().removeFormatting()

                // TODO: make this mess less messy maybe even use switch also make the regex's into their own variables

                // Add player stats from sb menu's skyblock player item
                if (unformattedName === "Your SkyBlock Profile") {
                    this.playerStats = item.getLore().reduce((a, b) => {
                        if (!/^ . ([A-z ]+) ([\d,.\%]+)$/.test(b.removeFormatting())) return a

                        const [ _, name, amount ] = b.removeFormatting().match(/^ . ([A-z ]+) ([\d,.\%]+)$/)

                        a[name] = {
                            amount: removeCommas(amount),
                            formatted: b
                        }

                        return a
                    }, {})

                    return
                }

                // Add player's skill average
                if (unformattedName === "Your Skills") {
                    item.getLore().forEach(value => {
                        if (!/^([\d,.]+) Skill Avg\. \(non-cosmetic\)$/.test(value.removeFormatting())) return

                        this.skillAvg = parseFloat(value.removeFormatting().match(/^([\d,.]+) Skill Avg\. \(non-cosmetic\)$/)[1])
                    })

                    return
                }

                // Add collection(s) amount
                if (unformattedName === "Collections") {
                    item.getLore().forEach(value => {
                        if (!/^ *(\d+)\/(\d+)$/.test(value.removeFormatting())) return

                        const [ _, collection, totalCollection ] = value.removeFormatting().match(/^ *(\d+)\/(\d+)$/)

                        this.collection = parseInt(collection)
                        this.totalCollection = parseInt(totalCollection)
                    })

                    return
                }

                // Add booster cookie's available bits
                if (unformattedName === "Booster Cookie") {
                    item.getLore().forEach(value => {
                        if (/^Bits Available\: ([\d,.]+)$/.test(value.removeFormatting())) return this.bitsAvailable = removeCommas(value.removeFormatting().match(/^Bits Available\: ([\d,.]+)$/)[1])
                        if (!/^Duration\: (.+)$/.test(value.removeFormatting())) return
                        
                        this.cookieDuration = value.removeFormatting().match(/^Duration\: (.+)$/)[1]
                    })

                    return
                }

                // Add the player's current equipped pet
                if (unformattedName === "Pets") {
                    item.getLore().forEach(value => {
                        if (!/^Selected pet\: ([A-z ]+) ?✦?$/.test(value.removeFormatting())) return 

                        this.currentPet = value.removeFormatting().match(/^Selected pet\: ([A-z ]+) ?✦?$/)[1]
                    })

                    return
                }

            })

            this.inSbMenu = false

        })
    }

    /**
     * - Internal use
     */
    _reloadRegex() {
        // Scoreboard
        this.purseRegex = /^Purse\: ([\d,.]+) ?(?:[\(\)\d\+,.]+)?$/
        this.bitsRegex = /^Bits\: ([\d,.]+) ?(?:[\(\)\d\+,.]+)?$/
        this.copperRegex = /^Copper\: ([\d,.]+) ?(?:[\(\)\d\+,.]+)?$/
        this.motesRegex = /^Motes\: ([\d,.]+) ?(?:[\(\)\d\+,.]+)?$/

        // Actionbar
        this.healthRegex = /^(\d[,\d]+)\/([\d,]+)❤/
        this.defenseRegex = /([\d,]+)❈ Defense/
        this.manaRegex = /(\d[\d,]+)\/([\d,]+)✎/
        this.overflowManaRegex = /(\d[\d,.]+)ʬ/
    }
    
    /**
     * - Internal use
     */
    _reset() {
        this.purse = 0
        this.bits = 0
        this.copper = 0
        this.motes = 0

        this.health = 0
        this.maxHealth = 0
        this.mana = 0
        this.maxMana = 0
        this.defense = 0
        this.overflowMana = 0

        this.playerStats = {}
        this.skillAvg = 0
        this.collection = 0
        this.totalCollection = 0
        this.bitsAvailable = 0
        this.cookieDuration = null
        this.currentPet = null
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

    /**
     * - Gets the player's motes amount
     * @returns {Number}
     */
    getMotes() {
        return this.motes
    }

    /**
     * - Gets the player's overflow mana
     * @returns {Number}
     */
    getOverflowMana() {
        return this.overflowMana
    }

    /**
     * - Gets the player object that was gathered whenever the player opened
     * their Skyblock Menu
     * - e.g { "Strength": { amount: 785.24, formatted: "&5&o &c❁ Strength &f785.24" } }
     * @returns {Object}
     */
    getPlayerStats() {
        return this.playerStats
    }

    /**
     * - Gets the player's skill average that was gathered whenever the player opened
     * their Skyblock Menu
     * @returns {Number}
     */
    getSkillAverage() {
        return this.skillAvg
    }

    /**
     * - Gets the player's collections that was gathered whenever the player opened
     * their Skyblock Menu
     * @returns {Number}
     */
    getCollection() {
        return this.collection
    }

    /**
     * - Gets the total collections amount that was gathered whenever the player opened
     * their Skyblock Menu
     * @returns {Number}
     */
    getTotalCollection() {
        return this.totalCollection
    }

    /**
     * - Gets the player's bits available that was gathered whenever the player opened
     * their Skyblock Menu
     * @returns {Number}
     */
    getBitsAvailable() {
        return this.bitsAvailable
    }

    /**
     * - Gets the player's cookie duration that was gathered whenever the player opened
     * their Skyblock Menu
     * @returns {Number}
     */
    getCookieDuration() {
        return this.cookieDuration
    }

    /**
     * - Gets the player's equipped pet that was gathered whenever the player opened
     * their Skyblock Menu
     * @returns {String|null}
     */
    getCurrentPet() {
        return this.currentPet
    }

    /**
     * - Whether the player is currently in skyblock or not
     * @returns {Boolean}
     */
    inSkyblock() {
        return /sk(y|i)block/.test(Scoreboard.getTitle()?.removeFormatting()?.toLowerCase())
    }
}