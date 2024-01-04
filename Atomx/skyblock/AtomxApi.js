import { Persistence } from "./Persistence"
import { TextHelper } from "./Text"

// This class loads the repo's api data for this library
// regex, criterias etc
export default new class AtomxApi {
    static AtomxPrefix = `&c[&4Atomx&c]&r`

    constructor() {
        this.api = Persistence.getDataFromFile("Atomx", "AtomxApi.json") ?? Persistence.getDataFromURL("https://raw.githubusercontent.com/DocilElm/Atomx/main/api/api.json")
        this.RegexData = this.api.RegexData
        this.BossEntryMessage = this.api.BossEntryMessage
        this.GardenItemID = this.api.GardenItemID
        this.GardenRareItems = this.api.GardenRareItems
        this.TrophyFishColors = this.api.TriphyFishColors

        this.eventHandler = new Set()

        this._checkVersion()
        this._saveData()

        // Check api version every 5mins
        // this is for testing purposes prod will be 20mins-30mins
        register("step", this._checkVersion.bind(this)).setDelay(300)
    }

    /**
     * - Runs the given function whenever the AtomxApi gets updated
     * 
     * @param {Function} fn 
     * @returns this for method chaining
     */
    onApiUpdate(fn) {
        this.eventHandler.add(fn)
        
        return this
    }

    _refresh() {
        this.api = Persistence.getDataFromURL("https://raw.githubusercontent.com/DocilElm/Atomx/main/api/api.json")
        this.RegexData = this.api.RegexData
        this.BossEntryMessage = this.api.BossEntryMessage
        this.GardenItemID = this.api.GardenItemID
        this.GardenRareItems = this.api.GardenRareItems
        this.TrophyFishColors = this.api.TriphyFishColors

        this.eventHandler.forEach(fn => fn())

        this._saveData()

        ChatLib.chat(ChatLib.getChatBreak("&c-"))
        ChatLib.chat(`${AtomxApi.AtomxPrefix} &aNew api version found updating variables!`)
        ChatLib.chat(`${AtomxApi.AtomxPrefix} &aChangelogs&f:`)
        this.api.changelog?.forEach(log => ChatLib.chat(`${AtomxApi.AtomxPrefix} &a> &6${log}`))
        ChatLib.chat(ChatLib.getChatBreak("&c-"))
    }

    _saveData() {
        Persistence.saveDataToFile("Atomx", "AtomxApi.json", this.api, true)
    }

    _checkVersion() {
        const repoVersion = Persistence.getDataFromURL("https://raw.githubusercontent.com/DocilElm/Atomx/main/api/api.json").apiVersion
        const localVersion = this.api.apiVersion

        if (repoVersion === localVersion) return

        this._refresh()
    }

    getRegexData() {
        const obj = {}

        // Makes the object values into actual regex values
        // so that the user doesn't have to worry about them being
        // a string since it's gathered from the api
        Object.keys(this.RegexData).forEach(category => {
            if (!(category in obj)) obj[category] = {}

            Object.keys(this.RegexData[category]).forEach(key => {
                const pattern = this.RegexData[category][key].pattern
                const flags = this.RegexData[category][key].flags

                obj[category][key] = TextHelper.getRegexFromString(pattern, flags)
            })
        })

        return obj
    }

    getBossEntryMessage() {
        return this.BossEntryMessage
    }

    getGardenItemID() {
        return this.GardenItemID
    }

    getGardenRareItems() {
        return this.GardenRareItems
    }

    getTrophyFishColors() {
        return this.TrophyFishColors
    }
}