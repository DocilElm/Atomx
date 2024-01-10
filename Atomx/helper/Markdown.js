const spaceRegex =     / *\/\*\*/g
const classNameRegex = /export (?:[A-z ]+)? ?class ([A-z]+)/g
const fnRegex =        / *([A-z ]+)\((.+)?\) \{/

const convertToMd = (string) => string.replace(/\*\//g, "").replace(/ *\* [- ]?/g, "* ")
const cleanClassDescription = (string, classMatch) => string.split(classMatch)[0]

/**
 * - Makes a markdown file basing it off of the jsdocs of other file
 * @class
 */
export default class MakeMarkdown {
    /**
     * @param {String} moduleName 
     */
    constructor(moduleName) {
        this.moduleName = moduleName
        this.markdownText = ""
    }

    /**
     * - Makes a markdown based off of the jsdoc of the given file directory
     * @param {String} fileDirectory 
     * @param {String|null} saveAs The directory to save it as (null by default this will save it as the class's name instead)
     * @returns 
     */
    classMarkdown(fileDirectory, saveAs = null) {
        this.markdownText = ""
        this.text = FileLib.read(this.moduleName, fileDirectory).split(spaceRegex)
        this.text.splice(0, 1)

        this.text.forEach(a => {
            const match = a.match(classNameRegex)
        
            if (match) {
                // for some reason this wants to be stupid
                this.className = match[0].replace(/export (?:[A-z }]+)? ?class /g, "")

                this.markdownText += `# Class ${this.className}\n`
                this.markdownText += `${convertToMd(cleanClassDescription(a, match[0]))}\n`
        
                return
            }
        
            const [ _, fnName, params ] = a.match(fnRegex)
            
            if (!fnName) return

            const description = convertToMd(a.split(fnName)[0])
        
            this.markdownText += `### ${fnName}(${params ?? ""})\n${description}\n`
        })

        if (saveAs) return this._save(fileDirectory)

        this._save()
    }

    /**
     * - Saves the [markdownText] into a file
     * @param {String|null} fileDirectory 
     */
    _save(fileDirectory) {
        FileLib.write(
            this.moduleName,
            `/markdown/${fileDirectory ?? this.className}.md`,
            this.markdownText,
            true
        )
    }
}