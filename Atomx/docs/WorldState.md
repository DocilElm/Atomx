# Class WorldState

*  Class that handles current world utilities
* @class
 

### static getTablist()

*  Gets the Tablist's names and removes the formatting of them
* @returns {Array}
     
    
### static getScoreboard(descending = false)

*  Gets the Scoreboard's lines and removes formatting and also emotes from them 
* @param {Boolean} descending 
* @returns {Array}
     
    
### static inTab(string)

*  Whether the given string is in Tablist's names or not
* @param {String} string 
* @returns {Boolean}
     
    
### static inScoreboard(string)

*  Whether the given string is in Scoreboard's names or not
* @param {String} string 
* @returns {Boolean}
     
    
### static inDungeons()

*  Whether the player is currently inside of dungeons or not
* @returns {Boolean}
     
    
### static getCurrentWorld()

*  Gets the current tablist world
* @returns {String}
     
    
### static getCurrentArea()

*  Gets the current scoreboard area
* @returns {String}
     
    
