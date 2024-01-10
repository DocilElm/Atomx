import Promise from "../../PromiseV2"
import request from "../../requestV2"
import { DateHelper } from "../helper/Date"
import { Persistence } from "../helper/Persistence"

/** 
 * - Class to handle all sorts of utilities for item's prices
 * @class
*/
export default new class Price {
    /**
     * - Makes a new [Price] class
     */
    constructor() {
        this.bazaarSellApi = new Map()
        this.bazaarBuyApi = new Map()
        this.lowestBinApi = new Map()

        this.cachedBzFile = Persistence.getDataFromFile("Atomx", "Bazaar.json")
        // Load time since saved
        this.lastSave = this.cachedBzFile?.lastSave

        // Updating the api data
        this.update()

        // Load all the data required
        this.loadApiData()

        // Refresh values
        register("step", this.update.bind(this)).setFps(1)
    }

    /**
     * - Loads the api data from saved files
     * - Into the map variables
     */
    loadApiData() {
        const bzFile = Persistence.getDataFromFile("Atomx", "Bazaar.json")
        this.lastSave = bzFile.lastSave

        const bzApi = bzFile.bzPrices
        const lbApi = Persistence.getDataFromFile("Atomx", "LowestBin.json")

        if (!bzApi || !this.lastSave) return this.lastSave = null

        Object.entries(bzApi).forEach(([key, value]) => {
            this.bazaarBuyApi.set(key, value.buy)
            this.bazaarSellApi.set(key, value.sell)
        })

        Object.entries(lbApi).forEach(([key, value]) => {
            this.lowestBinApi.set(key, value)
        })
    }

    /**
     * - Updates all of the api data and saves it to their files
     */
    update() {
        // Wait every 20mins to update the api data
        if (this.lastSave && DateHelper.getMsSinceNow(this.lastSave) <= (1000*60)*20) return
        this.lastSave = Date.now() // to avoid double trigger
        
        Promise.all([
            request({url: "https://api.hypixel.net/skyblock/bazaar", headers: { 'User-Agent': ' Mozilla/5.0', 'Content-Type': 'application/json' }, json: true}),
            request({url: "https://moulberry.codes/lowestbin.json", headers: { 'User-Agent': ' Mozilla/5.0', 'Content-Type': 'application/json' }, json: true})
        ]).then(response => {
            if (!response[0].success) return

            // Get required bazaar data so we can easier make a map from it
            const bzPrices = Object.keys(response[0].products).reduce((previousValue, value) => {
                const product = response[0].products[value]

                previousValue[value] = {
                    buy: product.quick_status.buyPrice,
                    sell: product.quick_status.sellPrice
                }

                return previousValue
            }, {})

            Persistence.saveDataToFile("Atomx", "Bazaar.json", {
                bzPrices: bzPrices,
                lastSave: Date.now()
            })
            Persistence.saveDataToFile("Atomx", "LowestBin.json", response[1])

            this.loadApiData()
        })
    }

    /**
     * - Gets the bazaar buy price or bin for the given Skyblock ID item
     * @param {String} skyblockID 
     * @returns {Number | null}
     */
    getPrice(skyblockID) {
        if (this.bazaarSellApi.has(skyblockID)) return this.bazaarSellApi.get(skyblockID)

        if (!this.lowestBinApi.has(skyblockID)) return

        return this.lowestBinApi.get(skyblockID)
    }

    /**
     * - Gets the bazaar sell price or lowest bin for the given Skyblock ID item
     * @param {String} skyblockID 
     * @param {String} ultimateName The ultimate enchant's name
     * @returns {Number | null}
     */
    getSellPrice(skyblockID, ultimateName) {
        if (!skyblockID) return

        if (skyblockID.startsWith("ENCHANTMENT_") && !this.bazaarSellApi.has(skyblockID))
            return this.bazaarSellApi.get(`ENCHANTMENT_ULTIMATE_${ultimateName}`)

        if (this.bazaarSellApi.has(skyblockID)) return this.bazaarSellApi.get(skyblockID)

        if (!this.lowestBinApi.has(skyblockID)) return

        return this.lowestBinApi.get(skyblockID)
    }
}