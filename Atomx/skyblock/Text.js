export class TextHelper {

    /**
     * - Matches the given regex with the given string
     * @param {RegExp} regex 
     * @param {String} string 
     * @returns {RegExpMatchArray | null}
     */
    static getRegexMatch(regex, string) {
        return string.match(regex)
    }

    /**
    * - Check if the criteria is a regex or a string
    * - Regex is way more intensive so only use that if needed
    * @param {Function} fn Callback function
    * @param {String | RegExp} criteria The criteria to match with
    * @param {String} unformatted The current unformatted text
    * @param {Event} event The current packet event
    * @param {String} formatted The current formatted text
    * @returns returns the callback fn with the given matches or the current msg if the criteria is null
    */
    static matchesCriteria(fn, criteria, unformatted, event, formatted) {
        if (!criteria) return fn(unformatted, event, formatted)

        else if (typeof(criteria) === "string") {
            if (unformatted !== criteria) return

            return fn(unformatted, event, formatted)
        }

        else if (criteria instanceof RegExp) {
            const match = TextHelper.getRegexMatch(criteria, unformatted)

            if (!match) return

            return fn(...match.slice(1), event, formatted)
        }
    }

    /**
     * - Makes a regex with the given params
     * @param {String} string 
     * @param {String} flags 
     * @returns {RegExp} the regex created with the given params
     */
    static getRegexFromString(string, flags) {
        return new RegExp(string, flags)
    }
}