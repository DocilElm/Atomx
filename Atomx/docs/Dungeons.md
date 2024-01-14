# Class Dungeons

*  A class that handles all sorts of utilities for dungeons
* @class
 

### _reloadRegex()

*  Re-loads the required regex data from the api
*  Internal Use
     
    
### _reset()

*  Resets all of the variables to a default state
*  Internal Use
     
    
### getCurrentRoom()

*  Gets the current room's object data
*  e.g { id: ["282,66", "102,66"], name: "Spawn", ...etc }
* @returns {Object}
     
    
### getPuzzlesAmount()

*  Gets the current dungeon total puzzle amount
* @returns {Number}
     
    
### getCryptsAmount()

*  Gets the current dungeon total crypts
* @returns {Number}
     
    
### getTeamDeaths()

*  Gets the current dungeon team deaths
* @returns {Number}
     
    
### getBlessings()

*  Gets the current blessings of the dungeon
* @returns {Array} ["Blessing of Power 10"]
     
    
### getTeamMembers()

*  Gets the current team members inside the dungeon
* @returns {Object} DocilElm = { class: "Archer", classLevel: 50 }
     
    
### isDupeClass(className)

*  Checks wheather there's another team member with the given class name
* @param {String} className The class name. e.g Mage
* @returns {Boolean}
     
    
### getMageReduction(cooldown = 0)

*  Gets the reduction that mage provides to item cooldowns
* @param {Number} cooldown Base item cooldown
* @returns {Number} - The cooldown time
     
    
