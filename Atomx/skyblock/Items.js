import Price from "./Price"

// Static methods for [Item]
// we can probably make seperate files for these though i didn't know
// what to name them so in Items they go
export class ItemHelper {
    /**
     * - Gets the extra attributes of the Item
     * @param {Item} item 
     * @returns {Object}
     */
    static getExtraAttribute(item) {
        return item?.getNBT()?.toObject()?.tag?.ExtraAttributes
    }

    // From BloomCore
    /**
     * - Gets the Skyblock item ID of the given MCItem or CT Item
     * @param {Item | MCItemStack} item 
     */
    static getSkyblockItemID(item) {
        if (item instanceof net.minecraft.item.ItemStack) item = new Item(item)
        if (!(item instanceof Item)) return

        const extraAttributes = item.getNBT()?.getCompoundTag("tag")?.getCompoundTag("ExtraAttributes")
        const itemID = extraAttributes?.getString("id")

        if (itemID !== "ENCHANTED_BOOK") return itemID
        
        // Enchanted books are a pain in the ass
        const enchantments = extraAttributes.getCompoundTag("enchantments")
        const enchants = [...enchantments.getKeySet()]

        if (!enchants.length) return

        const enchantment = enchants[0]
        const level = enchantments.getInteger(enchants[0])

        return `ENCHANTMENT_${enchantment.toUpperCase()}_${level}`
    }
}

// This should never change though i might add it to the api
const essenceRegex =       /(Undead|Wither) Essence x(\d+)/

export default class ItemHandler {
    constructor(item) {
        this.item = item
        this.name = item.getName()
        this.itemID = ItemHelper.getSkyblockItemID(item)
        this.itemLore = item.getLore()
        this.amount = 1

        this.getSbID()
    }

    getSbID(){
        const itemName = this.name.removeFormatting()

        if (essenceRegex.test(itemName)){
            const [ _, type, amount ] = itemName.match(essenceRegex)

            this.itemID = `ESSENCE_${type}`.toUpperCase()
            this.amount = parseInt(amount)
        }

        if (this.itemID.startsWith("ENCHANTMENT")){
            if (this.itemLore.length < 2) return
            this.name = this.itemLore[1]
        }

        this.getValue()
    }

    getValue(){
        return Math.floor(Price.getSellPrice(this.itemID) * this.amount)
    }
}