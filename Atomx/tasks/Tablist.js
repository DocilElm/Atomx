const S38PacketPlayerListItem = net.minecraft.network.play.server.S38PacketPlayerListItem

    // /**
    // * - Check if the criteria is a regex or a string
    // * - Regex is way more intensive so only use that if needed
    // * @param {Function} fn Callback function
    // * @param {String | RegExp} criteria The criteria to match with
    // * @param {String} unformatted The current unformatted text
    // * @param {Event} event The current packet event
    // * @param {String} formatted The current formatted text
    // * @returns returns the callback fn with the given matches or the current msg if the criteria is null
    // */
    // static matchesCriteria(fn, criteria, unformatted, event, formatted) {
    //     if (!criteria) return fn(unformatted, event, formatted)

    //     else if (typeof(criteria) === "string") {
    //         if (unformatted !== criteria) return

    //         return fn(unformatted, event, formatted)
    //     }

    //     else if (criteria instanceof RegExp) {
    //         const match = TextHelper.getRegexMatch(criteria, unformatted)

    //         if (!match) return

    //         return fn(...match.slice(1), event, formatted)
    //     }
    // }

register("packetReceived", (packet) => {
    const players = packet.func_179767_a() // .getPlayers()
    const action = packet.func_179768_b() // .getAction()

    if (action !== S38PacketPlayerListItem.Action.UPDATE_DISPLAY_NAME) return

    players.forEach(player => {
        const name = player.func_179961_d() // .getDisplayName()

        if (!name) return

        const formatted = name.func_150254_d() // .getFormattedText()
        const unformatted = formatted.removeFormatting()


    })
}).setFilteredClass(S38PacketPlayerListItem)
