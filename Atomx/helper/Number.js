const romanNumerals = {"M": 1000, "CM": 900, "D": 500, "CD": 400, "C": 100, "XC": 90, "L": 50, "XL": 40, "X": 10, "IX": 9, "V": 5, "IV": 4, "I": 1}
const numberFormat = {"k": 1000, "M": 1000000, "B": 1000000000}

/**
 * - Number utilities
 * @class
 */
export class NumberHelper {

    // This function was inspired from BloomCore
    /**
    * Decodes a roman numeral into it's respective number. Eg VII -> 7, LII -> 52 etc.
    * Returns null if the numeral is invalid.
    * Supported symbols: I, V, X, L, C, D, M
    * @param {String} numeral 
    * @returns {Number | null}
    */
    static decodeNumeral(numeral) {
        if (!numeral.match(/^[IVXLCDM]+$/)) return null
        
        let number = 0
        
        for (let index = 0; index < numeral.length; index++) {
            // Get the current symbol
            let currentSymbolValue = romanNumerals[numeral[index]]
            // If it is possible, get the next one
            let nextSymbolValue = (index + 1 < numeral.length) ? romanNumerals[numeral[index + 1]] : 0
   
            // Check if the current one is smaller than the next,
            // if so it falls under the special rules of roman numerals
            if (currentSymbolValue < nextSymbolValue) {
                number += nextSymbolValue - currentSymbolValue
                // Skip the next numeral
                index++
            } else {
                // Otherwise just add the number
                number += currentSymbolValue
            }
            
        }

        return number
   }

   /**
    * - Converts the given number into it's roman numeral form (e.g 5 -> V)
    * @param {Number} number 
    * @returns 
    */
   static convertToRoman(number) {
        if (!number) return number

        let result = ""

        // Loop over the romanNumerals
        for ([roman, value] in romanNumerals) {
            // If the number is greater than the value of the current roman numeral
            // it means that part of it can be replaced by the current roman numeral
            while (number >= value) {
                // Add the numeral to the result
                result += roman 
                // Remove that value from the number
                number -= value
            }
        }

        return result
    }
    
    /**
     * - Adds commas to the given number
     * @param {Number} number 
     * @returns 
     */
    static addCommas(number) {
        return number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? number
    }
    
    /**
     * - Adds comma to the given number and also removes the decimal points
     * @param {Number} number 
     * @returns 
     */
    static addCommasTrunc(number) {
        return this.addCommas(Math.trunc((Math.round(number * 100) / 100)))
    }

    /**
     * - Converts a string into it's value in number e.g 1.2k to 1200
     * @param {String} string 
     * @returns {Number}
     */
    static convertToNumber(string) {
        if (!/^([\d.,]+)([A-z]+)$/.test(string)) return parseFloat(string.replace(/,/g, ""))

        const [ _, number, format ] = string.match(/^([\d.,]+)([A-z]+)$/)

        return parseFloat(number) * numberFormat[format]
    }

    /**
     * - Checks wheather the [x, y] array1 is in the bounding box of [x1, y1, x2, y2] array2
     * @param {Array} array1 
     * @param {Array} array2 
     * @returns {Boolean}
     */
    static checkBoundingBox([x, y], [x1, y1, x2, y2]) {
        return (x >= x1 && x <= x2) && (y >= y1 && y <= y2)
    }
}