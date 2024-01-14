import { NumberHelper } from "./Number"

/**
 * - Date utility functions
 * @class
 */
export class DateHelper {
    /**
     * - Gets the seconds since starting date
     * @param {Date} startingDate 
     * @param {Date} endingDate 
     * @returns string that contains the time in a fixed decimal value of 2
     */
    static getSecondsSince(startingDate, endingDate) {
        if (!startingDate || !endingDate || (startingDate instanceof Array && !startingDate[1])) return "0s"

        if (startingDate instanceof Array) return `${((startingDate[0]-startingDate[1])/1000).toFixed(2)}s`
        
        return `${((startingDate-endingDate)/1000).toFixed(2)}s`
    }

    /**
     * - Gets the time in ms from the old date to now
     * @param {Date} date 
     * @returns {Number}
     */
    static getMsSinceNow(date) {
        return (Date.now()-date)
    }

    /**
     * - Gets the time since old date from current date
     * @param {Date} oldDate 
     * @returns {String} hrs:mins:secs
     */
    static getTime(oldDate) {
        const seconds = Math.round((Date.now() - oldDate) / 1000 % 60)
        const mins = Math.floor((Date.now() - oldDate) / 1000 / 60 % 60)
        const hours = Math.floor((Date.now() - oldDate) / 1000 / 60 / 60 % 24)
    
        return `${hours}:${mins}:${seconds}`
    }

    /**
     * - Gets the items/hr with the given time and items
     * @param {Item} item 
     * @param {Date} time 
     * @returns {String}
     */
    static getHourPerItems(item, time) {
        return NumberHelper.addCommasTrunc(Math.round(((item ?? 0)/(time ?? 1)) * 3600))
    }
}