import AtomxApi from "../AtomxApi"
import { ItemHelper } from "./ItemHelper"
import Price from "./Price"

/**
 * - Class to handle items more commonly used on chest profit features
 * @class
 */
export default class ItemHandler {
    /**
     * - Makes a new [ItemHandler] class
     * @param {Item} item 
     */
    constructor(item) {
        this.item = item
        this.name = item.getName()
        this.itemID = ItemHelper.getSkyblockItemID(item)
        this.itemLore = item.getLore()
        this.amount = 1

        this._reloadRegex()
        this.getSbID()

        // Reload regex if the api was changed
        AtomxApi.onApiUpdate(this._reloadRegex.bind(this))
    }

    /**
     * - Internal use
     */
    _reloadRegex() {
        const regexData = AtomxApi.getRegexData().ItemHandler
        if (!regexData) return

        this.essenceRegex = regexData.Essence
    }

    /**
     * - Gets the skyblock ID of the given item
     * @returns
     */
    getSbID() {
        const itemName = this.name.removeFormatting()

        if (this.essenceRegex.test(itemName)){
            const [ _, type, amount ] = itemName.match(this.essenceRegex)

            this.itemID = `ESSENCE_${type}`.toUpperCase()
            this.amount = parseInt(amount)
        }

        if (this.itemID.startsWith("ENCHANTMENT")){
            if (this.itemLore.length < 2) return
            this.name = this.itemLore[1]
        }

        this.getValue()
    }

    /**
     * - Gets the item's price based off of the amount and the skyblock ID
     * @returns {Number}
     */
    getValue() {
        return Math.floor(Price.getSellPrice(this.itemID) * this.amount)
    }
}