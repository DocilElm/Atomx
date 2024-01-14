# Class Persistence

*  Mostly file utilities
* @class
 

### static getDataFromURL(url, defaultValue = {})

*  Gets the data from the given url and returns it as [JSON] format
* @param {string} url The url where the data is located
* @param {*} defaultValue The default value to return if the data is not found (e.g [] or {})
* @returns {*} 
     
    
### static getDataFromFile(moduleName, filePath, defaultValue = {})

*  Gets the data from a local file and returns it as [JSON] format
* @param {string} moduleName The module name to use in the path
* @param {string} filePath The relative path of where it is located in \<ModuleName\>/data
* @param {*} defaultValue The default value to return if the data is not found (e.g [] or {})
* @returns {*} 
     
    
### static saveDataToFile(moduleName, filePath, data = {}, createFolderTree = true)

*  Save data to a local file
* @param {string} moduleName The module name to use in the path
* @param {string} filePath The relative path of where it is located in \<ModuleName\>/data
* @param {*} data The data to save to the file, defaults to an empty object
* @param {boolean} createFolderTree Recursively create the needed folder tree
     
    
