import { Persistence } from "./Persistence"

// This class loads the repo's api data for this library
// regex, criterias etc
export default new class AtomxApi {
    static AtomxPrefix = `&c[&4Atomx&c]&r`

    constructor() {
        this.apiMetadata = Persistence.getDataFromFile("Atomx", "AtomxApi.json")?.MetaData ?? Persistence.getDataFromURL("https://raw.githubusercontent.com/DocilElm/Atomx/main/api/metadata.json")
        this.RegexData = Persistence.getDataFromFile("Atomx", "AtomxApi.json")?.RegexData ?? Persistence.getDataFromURL("https://raw.githubusercontent.com/DocilElm/Atomx/main/api/RegexData.json")
        this.BossEntryMessage = null
        this.GardenItemID = null
        this.GardenRareItems = null

        this._checkVersion()
        this._saveData()

        // Check api version every 5mins
        // this is for testing purposes prod will be 20mins-30mins
        register("step", this._checkVersion.bind(this)).setDelay(300)
    }

    _refresh() {
        this.apiMetadata = Persistence.getDataFromURL("https://raw.githubusercontent.com/DocilElm/Atomx/main/api/metadata.json")
        this.RegexData = Persistence.getDataFromURL("https://raw.githubusercontent.com/DocilElm/Atomx/main/api/RegexData.json")
        this.BossEntryMessage = null
        this.GardenItemID = null
        this.GardenRareItems = null

        this._saveData()
    }

    _saveData() {
        let data = {
            MetaData: this.apiMetadata,
            RegexData: this.RegexData,
            BossEntryMessage: this.BossEntryMessage,
            GardenItemID: this.GardenItemID,
            GardenRareItems: this.GardenRareItems
        }
        Persistence.saveDataToFile("Atomx", "AtomxApi.json", data, true)
    }

    _checkVersion() {
        const repoVersion = Persistence.getDataFromURL("https://raw.githubusercontent.com/DocilElm/Atomx/main/api/metadata.json").apiVersion
        const localVersion = this.apiMetadata.apiVersion

        if (repoVersion === localVersion) return

        ChatLib.chat(`${AtomxApi.AtomxPrefix} &aNew api version found updating variables!`)
        this._refresh()
    }
}