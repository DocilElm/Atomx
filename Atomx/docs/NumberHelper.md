# Class NumberHelper

*  Number utilities
* @class
 

### static decodeNumeral(numeral)

* Decodes a roman numeral into it's respective number. Eg VII -> 7, LII -> 52 etc.
* Returns null if the numeral is invalid.
* Supported symbols: I, V, X, L, C, D, M
* @param {String} numeral 
* @returns {Number | null}
    
    
### static convertToRoman(number)

*  Converts the given number into it's roman numeral form (e.g 5 -> V)
* @param {Number} number 
* @returns 
    
   
### static addCommas(number)

*  Adds commas to the given number
* @param {Number} number 
* @returns 
     
    
### static addCommasTrunc(number)

*  Adds comma to the given number and also removes the decimal points
* @param {Number} number 
* @returns 
     
    
### static convertToNumber(string)

*  Converts a string into it's value in number e.g 1.2k to 1200
* @param {String} string 
* @returns {Number}
     
    
### static checkBoundingBox([x, y], [x1, y1, x2, y2])

*  Checks wheather the [x, y] array1 is in the bounding box of [x1, y1, x2, y2] array2
* @param {Array} array1 
* @param {Array} array2 
* @returns {Boolean}
     
    
