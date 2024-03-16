/**
 * - Class that handles current world utilities
 * @class
 */
class WorldStateClass {
    /**
     * - Gets the Tablist's names and removes the formatting of them
     * @returns {Array}
     */
    getTablist() {
        // Return an empty array if the world isn't loaded
        if (!World.isLoaded()) return []

        return TabList?.getNames()?.map(name => name?.removeFormatting())
    }

    /**
     * - Gets the Scoreboard's lines and removes formatting and also emotes from them 
     * @param {Boolean} descending 
     * @returns {Array}
     */
    getScoreboard(descending = false) {
        // Return an empty array if the world isn't loaded
        if (!World.isLoaded()) return []
        
        return Scoreboard.getLines(descending)?.map(line => line?.getName()?.removeFormatting()?.replace(/[^\u0000-\u007F]/g, ""))
    }

    /**
     * - Whether the given string is in Tablist's names or not
     * @param {String} string 
     * @returns {Boolean}
     */
    inTab(string) {
        if (!World.isLoaded()) return false

        return WorldState.getTablist()?.find(name => name?.match(/^(Area|Dungeon): ([\w\d ]+)$/))?.toLowerCase()?.includes(string.toLowerCase())
    }

    /**
     * - Whether the given string is in Scoreboard's names or not
     * @param {String} string 
     * @returns {Boolean}
     */
    inScoreboard(string) {
        if (!World.isLoaded()) return false

        return WorldState.getScoreboard()?.some(names => names?.toLowerCase()?.includes(string.toLowerCase()))
    }

    /**
     * - Whether the player is currently inside of dungeons or not
     * @returns {Boolean}
     */
    inDungeons() {
        if (!World.isLoaded()) return false

        return WorldState.inTab("Catacombs")
    }

    /**
     * - Gets the current tablist world
     * @returns {String}
     */
    getCurrentWorld() {
        if (!World.isLoaded()) return

        for (tabName of WorldState.getTablist()) {
            let worldName = tabName.match(/^(Area|Dungeon): ([\w\d ]+)$/)?.[2]

            if (!worldName) continue
            return worldName
        }
    }

    /**
     * - Gets the current scoreboard area
     * @returns {String}
     */
    getCurrentArea() {
        if (!World.isLoaded()) return

        for (score of WorldState.getScoreboard()) {
            let areaName = score.match(/^  (.+)$/)?.[1]

            if (!areaName) continue
            return areaName
        }
    }
}

// Support the modules that used the older version of this class
// that's why we export this like that and call the class that ugly name
export const WorldState = new WorldStateClass()