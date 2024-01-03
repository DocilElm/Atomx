export class Persistence {
    /**
     * - Gets the data from the given url and returns it as [JSON] format
     * @param {string} url The url where the data is located
     * @param {*} defaultValue The default value to return if the data is not found (e.g [] or {})
     * @returns {*} 
     */
    static getDataFromURL(url, defaultValue = {}) {
        if (!url) throw new Error(`(${url}) is not a valid URL`)

        return JSON.parse(FileLib.getUrlContent(url)) ?? defaultValue
    }

    /**
     * - Gets the data from a local file and returns it as [JSON] format
     * @param {string} moduleName The module name to use in the path
     * @param {string} filePath The relative path of where it is located in \<ModuleName\>/data
     * @param {*} defaultValue The default value to return if the data is not found (e.g [] or {})
     * @returns {*} 
     */
    static getDataFromFile(moduleName, filePath, defaultValue = {}) {
        if (!moduleName) throw new Error(`(${moduleName}) is not a valid module name`)

        return JSON.parse(FileLib.read(moduleName, `data/${filePath}`)) ?? defaultValue
    }

    /**
     * - Save data to a local file
     * @param {string} moduleName The module name to use in the path
     * @param {string} filePath The relative path of where it is located in \<ModuleName\>/data
     * @param {*} data The data to save to the file, defaults to an empty object
     * @param {boolean} createFolderTree Recursively create the needed folder tree
     */
    static saveDataToFile(moduleName, filePath, data = {}, createFolderTree = true) {
        if (!moduleName) throw new Error(`(${moduleName}) is not a valid module name`)
        
        FileLib.write(moduleName, `data/${filePath}`, JSON.stringify(data, null, 4), createFolderTree)
    }
}