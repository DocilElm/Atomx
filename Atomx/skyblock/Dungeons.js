import AtomxApi from "./AtomxApi"
import { DateHelper } from "./Date"
import { NumberHelper } from "./Number"
import { Persistence } from "./Persistence"
import { onBlessingsChange, onScoreboardPacket, onTabUpdatePacket } from "./Register"
import { TextHelper } from "./Text"
import { WorldState } from "./World"

export default new class Dungeons {
    constructor() {
        // These variables will and should not be reset after world change
        this.lastClass = null
        this.lastClassLevel = null

        // Init methods
        this._reloadRegex()
        this._reset()
        this._makeData()
        this._saveData()

        // Reload regex if the api was changed
        AtomxApi.onApiUpdate(this._reloadRegex.bind(this))

        onScoreboardPacket(score => {
            if (this.currentFloorRegex.test(score) && !this.currentFloor) return this.currentFloor = TextHelper.getRegexMatch(this.currentFloorRegex, score)[1]
            if (this.currentRoomIDRegex.test(score)) return this.currentRoomID = TextHelper.getRegexMatch(this.currentRoomIDRegex, score)[1]
        })

        onTabUpdatePacket(tabName => {
            if (!WorldState.inDungeons()) return
            
            if (this.playerInformationRegex.test(tabName)) {
                const [ _, playerName, className, classLevel ] = tabName.match(this.playerInformationRegex)
                
                // If it isn't the player, it'll be their teammates
                if (playerName !== Player.getName()) {
                    this.teamMembers[playerName] = {
                        class: className,
                        classLevel: NumberHelper.decodeNumeral(classLevel)
                    }
                    return
                }

                this.currentClass = className
                this.currentClassLevel = NumberHelper.decodeNumeral(classLevel)

                // Saving the last class for specific features that might need
                // these variables will and should not be reset after world change
                this.lastClass = this.currentClass
                this.lastClassLevel = this.currentClassLevel
                return
            }

            this.secretsFound = TextHelper.getRegexMatch(this.secretsFoundRegex, tabName)?.[1] ?? this.secretsFound
            this.currentMilestone = TextHelper.getRegexMatch(this.milestoneRegex, tabName)?.[1] ?? this.currentMilestone
            this.completedRooms = TextHelper.getRegexMatch(this.completedRoomsRegex, tabName)?.[1] ?? this.completedRooms
            this.teamDeaths = TextHelper.getRegexMatch(this.teamDeathRegex, tabName)?.[1] ?? this.teamDeaths
            this.puzzlesAmount = TextHelper.getRegexMatch(this.puzzlesAmountRegex, tabName)?.[1] ?? this.puzzlesAmount
            this.cryptsAmount = TextHelper.getRegexMatch(this.cryptsAmountRegex, tabName)?.[1] ?? this.cryptsAmount
        })

        onBlessingsChange(blessingsArray => {
            if (!WorldState.inDungeons()) return

            this.blessings = blessingsArray
        })
    }

    /**
     * - Re-loads the required regex data from the api
     * - Internal Use
     */
    _reloadRegex() {
        const regexData = AtomxApi.getRegexData()?.Dungeons
        if (!regexData) return

        this.currentFloorRegex = regexData.Floor
        this.currentRoomIDRegex = regexData.RoomID
        this.playerInformationRegex = regexData.PlayerInformation
        this.secretsFoundRegex = regexData.SecretsFound
        this.milestoneRegex = regexData.Milestone
        this.completedRoomsRegex = regexData.CompletedRooms
        this.teamDeathRegex = regexData.TeamDeaths
        this.puzzlesAmountRegex = regexData.PuzzlesAmount
        this.cryptsAmountRegex = regexData.CryptsAmount
    }

    /**
     * - Resets all of the variables to a default state
     * - Internal Use
     */
    _reset() {
        // Player stuff
        this.currentFloor = null
        this.currentMilestone = null

        // Room stuff
        this.currentRoomID = null

        // Classes stuff
        this.currentClass = null
        this.currentClassLevel = null

        // Dungeons stuff
        this.secretsFound = null
        this.completedRooms = 0
        this.teamDeaths = 0
        this.puzzlesAmount = 0
        this.cryptsAmount = 0
        this.blessings = []
        this.teamMembers = {}

        // Loading dungeons data
        this.DataFile = Persistence.getDataFromFile("Atomx", "DungeonsData.json")
        this.DungeonsData = this.DataFile?.DungeonsData ?? Persistence.getDataFromURL("https://soopy.dev/api/bettermap/roomdata")
        this.savedDate = this.DataFile?.lastSave
        /**
         * - This is a [Map] that stores all of the room data not the
         * current dungeon's map but the whole dungeons data
         */
        this.DungeonsMapData = new Map()
    }

    _makeData() {
        // Make all of the dungeon data gathered from soopy's api into
        /*
        MapObject: {
            RoomID: <Data Object>
        }
        */
        this.DungeonsData.forEach(obj => {
            obj.id.forEach(roomID => this.DungeonsMapData.set(roomID, obj))
        })

    }

    _saveData() {
        if (this.savedDate && (DateHelper.getMsSinceNow(this.savedDate) >= 86400000)) this.DungeonsData = Persistence.getDataFromURL("https://soopy.dev/api/bettermap/roomdata")

        Persistence.saveDataToFile("Atomx", "DungeonsData.json", {
            DungeonsData: this.DungeonsData,
            lastSave: Date.now()
        }, true)
    }
    
    getCurrentFloor() {
        return this.currentFloor
    }

    getCurrentClass() {
        return this.currentClass ?? this.lastClass
    }

    getCurrentClassLevel() {
        return this.currentClassLevel ?? this.lastClassLevel
    }

    getCurrentRoomID() {
        return this.currentRoomID
    }

    getCurrentRoomName() {
        return this.DungeonsMapData?.get(this.currentRoomID)?.name
    }

    /**
     * - Gets the current room's object data
     * - e.g { id: ["282,66", "102,66"], name: "Spawn", ...etc }
     * @returns {Object}
     */
    getCurrentRoom() {
        return this.DungeonsMapData?.get(this.currentRoomID)
    }

    /**
     * - Gets the current dungeon total puzzle amount
     * @returns {Number}
     */
    getPuzzlesAmount() {
        return this.puzzlesAmount
    }

    /**
     * - Gets the current dungeon total crypts
     * @returns {Number}
     */
    getCryptsAmount() {
        return this.cryptsAmount
    }

    /**
     * - Gets the current dungeon team deaths
     * @returns {Number}
     */
    getTeamDeaths() {
        return this.teamDeaths
    }

    /**
     * - Gets the current blessings of the dungeon
     * @returns {Array} ["Blessing of Power 10"]
     */
    getBlessings() {
        return this.blessings
    }

    /**
     * - Gets the current team members inside the dungeon
     * @returns {Object} DocilElm = { class: "Archer", classLevel: 50 }
     */
    getTeamMembers() {
        return this.teamMembers
    }

    /**
     * - Checks wheather there's another team member with the given class name
     * @param {String} className The class name. e.g Mage
     * @returns {Boolean}
     */
    isDupeClass(className) {
        return Object.values(this.teamMembers)?.reduce((classOccurance, player) => classOccurance + (player.class === className ? 1 : 0), 0) >= 1
    }

    /**
     * - Gets the reduction that mage provides to item cooldowns
     * @param {Number} cooldown Base item cooldown
     * @returns {Number} - The cooldown time
     */
    getMageReduction(cooldown = 0) {
        if (this.getCurrentClass() !== "Mage") return cooldown

        const multiplier = this.isDupeClass("Mage") ? 1 : 2
        const mageReduction = 0.75 - (Math.floor(this.getCurrentClassLevel() / 2) / 100) * multiplier
        return cooldown * mageReduction
    }
}