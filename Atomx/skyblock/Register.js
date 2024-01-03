// THIS IS TEMPORARY
// therefor this code will look very ugly

import { NumberHelper } from "./Number"
import { TextHelper } from "./Text"

let scoreboardEvents = []
let tablsitEvents = []
let blessingEvents = []

export const onScoreboardPacket = (fn, criteria) => scoreboardEvents.push([fn, criteria])
export const onTabUpdatePacket = (fn, criteria) => tablsitEvents.push([fn, criteria])
export const onBlessingsChange = (fn) => blessingEvents.push(fn)

register("packetReceived", (packet) => {
    const channel = packet.func_149307_h()
    if (channel !== 2) return

    const teamStr = packet.func_149312_c()
    const teamMatch = teamStr.match(/^team_(\d+)$/)
    if (!teamMatch) return

    const formatted = packet.func_149311_e().concat(packet.func_149309_f())
    const unformatted = formatted.removeFormatting()

    if (!unformatted) return
    
    // TextHelper.matchesCriteria(fn, criteria, unformatted, event, formatted)
    scoreboardEvents.forEach(event => TextHelper.matchesCriteria(event[0], event[1], unformatted, event, formatted))
}).setFilteredClass(net.minecraft.network.play.server.S3EPacketTeams)

// Constant used to get the packet's ENUMS
// and also filter the class in packetRecieved event
const S38PacketPlayerListItem = net.minecraft.network.play.server.S38PacketPlayerListItem

register("packetReceived", (packet) => {
    const players = packet.func_179767_a() // .getPlayers()
    const action = packet.func_179768_b() // .getAction()

    if (action !== S38PacketPlayerListItem.Action.UPDATE_DISPLAY_NAME) return

    players.forEach(addPlayerData => {
        const name = addPlayerData.func_179961_d() // .getDisplayName()
        
        if (!name) return

        const formatted = name.func_150254_d() // .getFormattedText()
        const unformatted = formatted.removeFormatting()
    
        if (action !== S38PacketPlayerListItem.Action.UPDATE_DISPLAY_NAME) return

        // TextHelper.matchesCriteria(fn, criteria, unformatted, event, formatted)
        tablsitEvents.forEach(event => TextHelper.matchesCriteria(event[0], event[1], unformatted, event, formatted))
    })
}).setFilteredClass(S38PacketPlayerListItem)

register("packetReceived", (packet, _) => {
    let blessingsArray = []

    packet.func_179701_b()?.func_150253_a()?.forEach(chatComponent => {
        const chatComponentText = chatComponent.func_150254_d()?.removeFormatting()

        if (!/^Blessing of (.+)$/.test(chatComponentText)) return
        
        // if (!decodeRomanNumeral) blessingsArray.push(chatComponentText.match(/^Blessing of (.+)$/)?.[1])
        
        const romanNumeral = chatComponentText.match(/^Blessing of [\w\d]+ ([IVXLCDM]+)$/)?.[1]

        blessingsArray.push(chatComponentText.replace(romanNumeral, NumberHelper.decodeNumeral(romanNumeral)))
    })

    // fn(blessingsArray)
    blessingEvents.forEach(fn => fn(blessingsArray))
    blessingsArray = null
}).setFilteredClass(net.minecraft.network.play.server.S47PacketPlayerListHeaderFooter)