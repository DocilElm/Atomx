import AtomxApi from "../AtomxApi"
import { DateHelper } from "../helper/Date"
import { NumberHelper } from "../helper/Number"
import { Persistence } from "../helper/Persistence"
import { TextHelper } from "../helper/Text"
import { WorldState } from "./World"
import { onActionbarPacket, onBlessingsChange, onScoreboardPacket, onTabUpdatePacket } from "./Register"

const PuzzleEnums = {
    "✦": 0,
    "✔": 1,
    "✖": 2
}

/**
 * - A class that handles all sorts of utilities for dungeons
 * @class
 */
export default new class Dungeons {
    constructor() {
        // These variables will and should not be reset after world change
        this.lastClass = null
        this.lastClassLevel = null
        this.listeners = {}

        // Init methods
        this._reloadRegex()
        this._reset()
        this._makeData()
        this._saveData()

        // Reload regex if the api was changed
        AtomxApi.onApiUpdate(this._reloadRegex.bind(this))

        onScoreboardPacket(score => {
            if (this.currentFloorRegex.test(score) && !this.currentFloor) return this.currentFloor = TextHelper.getRegexMatch(this.currentFloorRegex, score)[1]

            if (this.currentRoomIDRegex.test(score)) {
                this.currentRoomID = TextHelper.getRegexMatch(this.currentRoomIDRegex, score)[1]

                // Run all of the listener functions assigned to this room
                this.listeners[this.getCurrentRoomName()?.toLowerCase()]?.forEach(fn => fn())
                this.listeners.roomid?.forEach(fn => fn(this.getCurrentRoomName()))
                return
            }
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

            if (this.puzzleHandlerRegex.test(tabName)) {
                const [ _, puzzleName, puzzleSymbol, usernameFailed ] = tabName.match(this.puzzleHandlerRegex)

                this.listeners.puzzles?.forEach(fn => fn(puzzleName, PuzzleEnums[puzzleSymbol], usernameFailed))

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

        onActionbarPacket(msg => {
            if (!WorldState.inDungeons() || !this.secretsHandlerRegex.test(msg)) return

            const currentRoom = this.getCurrentRoomName()

            if (!currentRoom) return

            const [ _, secrets, totalSecrets ] = msg.match(this.secretsHandlerRegex)

            if (!(currentRoom in this.roomSecrets)) this.roomSecrets[currentRoom] = [secrets, totalSecrets]

            let roomArr = this.roomSecrets[currentRoom]
            const amountGathered = (secrets - roomArr[0])

            if (totalSecrets !== roomArr[1] || amountGathered > 2 || amountGathered === 0) return

            roomArr[0] = secrets

            this.listeners.secrets.forEach(fn => fn(secrets, totalSecrets, currentRoom))
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
        this.puzzleHandlerRegex = regexData.PuzzleHandler
        this.secretsHandlerRegex = regexData.SecretsHandler
        this.bossRoomID = new Set(AtomxApi.getBossRoomID())
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
        this.roomSecrets = {}

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
        
        // - This is a [Map] that stores all of the room data not the
        // current dungeon's map but the whole dungeons data
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

    /**
     * - Runs the given function whenever the player enters the specified room
     * @param {String} roomName 
     * @param {Function} fn 
     * @returns this for method chaining or null
     */
    onRoomEnter(roomName, fn) {
        if (!roomName) return
        if (!(roomName.toLowerCase() in this.listeners)) this.listeners[roomName.toLowerCase()] = []

        this.listeners[roomName.toLowerCase()].push(fn)

        return this
    }

    /**
     * - Runs the given function whenever an event happens in tablist with a puzzle
     * - E.g puzzle enter = 0, puzzle completed = 1, puzzle failed = 2. the event is sent as a param to the fn
     * @param {Function} fn 
     * @returns this for method chaining
     */
    onPuzzleEvent(fn) {
        if (!("puzzles" in this.listeners)) this.listeners.puzzles = []

        this.listeners.puzzles.push(fn)

        return this
    }

    /**
     * - Runs the given function whenever the previous "current" secrets gets changed above hotbar (aka actionbar)
     * @param {Function} fn 
     * @returns this for method chaining
     */
    onSecretsEvent(fn) {
        if (!("secrets" in this.listeners)) this.listeners.secrets = []

        this.listeners.secrets.push(fn)
        
        return this
    }

    /**
     * - Runs the given function whenever the roomID changes in the scoreboard returns the room name as a param
     * @param {Function} fn 
     * @returns this for method chaining
     */
    onRoomIDEvent(fn) {
        if (!("roomid" in this.listeners)) this.listeners.roomid = []

        this.listeners.roomid.push(fn)

        return this
    }

    /**
     * - Checks whether the current room the player is in is a puzzle
     * @returns {Boolean}
     */
    inPuzzle() {
        return this.getCurrentRoom()?.type === "puzzle"
    }

    /**
     * - Checks whether the player is currently inside boss room
     * @returns {Boolean}
     */
    inBossRoom() {
        return this.bossRoomID.has(this.getCurrentRoomID())
    }
}