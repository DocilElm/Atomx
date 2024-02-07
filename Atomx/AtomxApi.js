import { Persistence } from "./helper/Persistence"
import { TextHelper } from "./helper/Text"

const sendCenteredMsg = (msg) => ChatLib.chat(ChatLib.getCenteredText(msg))

/**
 * - This class loads the repo's api data for this library regex, criterias etc
 * @class
 */
export default new class AtomxApi {
    static AtomxPrefix = `&c[&4Atomx&c]&r`

    /**
     * - Creates a new AtomxApi class
     */
    constructor() {
        this.api = Persistence.getDataFromFile("Atomx", "AtomxApi.json") ?? Persistence.getDataFromURL("https://raw.githubusercontent.com/DocilElm/Atomx/main/api/api.json")
        this.RegexData = this.api.RegexData
        this.BossEntryMessage = this.api.BossEntryMessage
        this.GardenItemID = this.api.GardenItemID
        this.GardenRareItems = this.api.GardenRareItems
        this.TrophyFishColors = this.api.TriphyFishColors
        this.BossRoomID = this.api.BossRoomID

        this.eventHandler = new Set()
        
        this._checkVersion()
        this._saveData()

        // Check api version every 20mins
        register("step", this._checkVersion.bind(this)).setDelay(1200)
    }

    /**
     * - Runs the given function whenever the AtomxApi gets updated
     * @param {Function} fn 
     * @returns this for method chaining
     */
    onApiUpdate(fn) {
        this.eventHandler.add(fn)
        
        return this
    }

    /**
     * - Internal use
     */
    _refresh() {
        this.api = Persistence.getDataFromURL("https://raw.githubusercontent.com/DocilElm/Atomx/main/api/api.json")
        this.RegexData = this.api.RegexData
        this.BossEntryMessage = this.api.BossEntryMessage
        this.GardenItemID = this.api.GardenItemID
        this.GardenRareItems = this.api.GardenRareItems
        this.TrophyFishColors = this.api.TriphyFishColors

        this.eventHandler.forEach(fn => fn())

        this._saveData()

        this.sendChangelog(AtomxApi.AtomxPrefix, " &aNew api version found updating variables!", this.api.changelog)
    }

    /**
     * - Internal use
     */
    _saveData() {
        Persistence.saveDataToFile("Atomx", "AtomxApi.json", this.api, true)
    }

    /**
     * - Internal use
     */
    _checkVersion() {
        const repoVersion = Persistence.getDataFromURL("https://raw.githubusercontent.com/DocilElm/Atomx/main/api/api.json").apiVersion
        const localVersion = this.api.apiVersion

        if (repoVersion === localVersion) return

        this._refresh()
    }

    /**
     * - Gets the regex data from the Atomx's api
     * @returns {Object}
     */
    getRegexData() {
        const obj = {}

        // Makes the object values into actual regex values
        // so that the user doesn't have to worry about them being
        // a string since it's gathered from the api
        Object.keys(this.RegexData).forEach(category => {
            if (!(category in obj)) obj[category] = {}

            Object.keys(this.RegexData[category]).forEach(key => {
                const pattern = this.RegexData[category][key].pattern
                if (!pattern) return

                const flags = this.RegexData[category][key].flags

                obj[category][key] = TextHelper.getRegexFromString(pattern, flags)
            })
        })

        return obj
    }

    /**
     * - Gets the regex data from the [PartyArray] Atomx api entry
     * @returns {Object}
     */
    getPartyArray() {
        const obj = {}

        Object.keys(this.RegexData.PartyArray).forEach(category => {
            if (!(category in obj)) obj[category] = []

            const arr = this.RegexData.PartyArray[category].map(reg => TextHelper.getRegexFromString(reg, ""))
            obj[category] = arr

        })

        return obj
    }

    /**
     * - Gets the [BossEntryMessage] data from Atomx's api
     * @returns {Array}
     */
    getBossEntryMessage() {
        return this.BossEntryMessage
    }

    /**
     * - Gets the [GardenItemID] data from Atomx's api
     * @returns {Object}
     */
    getGardenItemID() {
        return this.GardenItemID
    }

    /**
     * - Gets the [GardenRareItems] data from Atomx's api
     * @returns {Object}
     */
    getGardenRareItems() {
        return this.GardenRareItems
    }

    /**
     * - Gets the [TrophyFishColors] data from Atomx's api
     * @returns {Object}
     */
    getTrophyFishColors() {
        return this.TrophyFishColors
    }

    /**
     * - Gets the [BossRoomID] data from Atomx's api
     * @returns {Array}
     */
    getBossRoomID() {
        return this.BossRoomID
    }

    /**
     * - Sends a changelog like message with the given params
     * @param {String} prefix The main module prefix
     * @param {String} title The title of the update
     * @param {Array} changes The array with the changes made
     * @param {String} chatBreak The string to use as chat break (default: "&c-")
     * @param {String} logText The string to use as log text for changelogs (default: " &a> &6")
     */
    sendChangelog(prefix, title, changes = [], chatBreak = "&c-", logText = " &a> &6") {
        ChatLib.chat(ChatLib.getChatBreak(chatBreak))
        sendCenteredMsg(prefix)
        sendCenteredMsg(title)
        changes?.forEach(log => sendCenteredMsg(`${logText}${log}`))
        ChatLib.chat(ChatLib.getChatBreak(chatBreak))
    }
}