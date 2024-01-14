# Class TextHelper

*  A class that handles text specific functions
* @class
 

### static getRegexMatch(regex, string)

*  Matches the given regex with the given string
* @param {RegExp} regex 
* @param {String} string 
* @returns {RegExpMatchArray | null}
     
    
### static matchesCriteria(fn, criteria, unformatted, event, formatted)

*  Check if the criteria is a regex or a string
*  Regex is way more intensive so only use that if needed
* @param {Function} fn Callback function
* @param {String | RegExp} criteria The criteria to match with
* @param {String} unformatted The current unformatted text
* @param {Event} event The current packet event
* @param {String} formatted The current formatted text
* @returns returns the callback fn with the given matches or the current msg if the criteria is null
    
    
### static getRegexFromString(string, flags)

*  Makes a regex with the given params
* @param {String} string 
* @param {String} flags 
* @returns {RegExp} the regex created with the given params
     
    
