import AtomxApi from "../AtomxApi"
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

                switch (unformattedName) {
                    case "Your SkyBlock Profile":
                        this.playerStats = item.getLore().reduce((a, b) => {
                            if (!this.playerStatsRegex.test(b.removeFormatting())) return a
    
                            const [ _, name, amount ] = b.removeFormatting().match(this.playerStatsRegex)
    
                            a[name] = {
                                amount: removeCommas(amount),
                                formatted: b
                            }
    
                            return a
                        }, {})
                        break

                    case "Your Skills":
                        item.getLore().forEach(value => {
                            if (!this.skillAvgRegex.test(value.removeFormatting())) return
    
                            this.skillAvg = parseFloat(value.removeFormatting().match(this.skillAvgRegex)[1])
                        })
                        break

                    case "Collections":
                        item.getLore().forEach(value => {
                            if (!this.collectionRegex.test(value.removeFormatting())) return
    
                            const [ _, collection, totalCollection ] = value.removeFormatting().match(this.collectionRegex)
    
                            this.collection = parseInt(collection)
                            this.totalCollection = parseInt(totalCollection)
                        })
                        break

                    case "Booster Cookie":
                        item.getLore().forEach(value => {
                            if (this.bitsAvailableRegex.test(value.removeFormatting())) return this.bitsAvailable = removeCommas(value.removeFormatting().match(this.bitsAvailableRegex)[1])
                            if (!this.cookieDurationRegex.test(value.removeFormatting())) return
                            
                            this.cookieDuration = value.removeFormatting().match(this.cookieDurationRegex)[1]
                        })
                        break

                    case "Pets":
                        item.getLore().forEach(value => {
                            if (!this.selectedPetRegex.test(value.removeFormatting())) return 
    
                            this.currentPet = value.removeFormatting().match(this.selectedPetRegex)[1]
                        })
                        break
                
                    default: break
                }

            })

            this.inSbMenu = false

        })
    }

    /**
     * - Internal use
     */
    _reloadRegex() {
        const ThePlayerRegex = AtomxApi.getRegexData()?.ThePlayer

        if (!ThePlayerRegex) return

        // Scoreboard
        this.purseRegex = ThePlayerRegex.Purse
        this.bitsRegex = ThePlayerRegex.Bits
        this.copperRegex = ThePlayerRegex.Copper
        this.motesRegex = ThePlayerRegex.Motes

        // Actionbar
        this.healthRegex = ThePlayerRegex.Health
        this.defenseRegex = ThePlayerRegex.Defense
        this.manaRegex = ThePlayerRegex.Mana
        this.overflowManaRegex = ThePlayerRegex.OverflowMana

        // Skyblock Menu
        this.playerStatsRegex = ThePlayerRegex.PlayerStats
        this.skillAvgRegex = ThePlayerRegex.SkillAverage
        this.collectionRegex = ThePlayerRegex.Collection
        this.bitsAvailableRegex = ThePlayerRegex.BitsAvailable
        this.cookieDurationRegex = ThePlayerRegex.CookieDuration
        this.selectedPetRegex = ThePlayerRegex.SelectedPet
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