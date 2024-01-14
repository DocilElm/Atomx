# Class DraggableHandler

* @class
 

### constructor(text = "&a&lClick at any component to open their edit gui")

*  Creates a new DraggableHandler with the given params
*  This class handles all of the Edit Guis and makes
* a Main Edit Gui that when opened it will give you the option
* to open other Edut Guis with a single click
* 
* @param {String} text The string that will appear in the center screen when this gui is opened
     
    
### setCommand(commandName)

*  Sets a command to open this gui with
* @param {String} commandName 
* @returns this for method chaining
     
    
### setObj(obj)

*  Sets the pogobject for this class
* @param {Object} obj 
* @returns this for method chaining
     
    
### addGui(featureObj, defaultString = null, obj = null)

* 
*  Creates a new [DraggableGui] with the given params and returns it
* @param {Object} featureObj The feature object e.g { x: 0, y: 0, scale: 1 }
* @param {String|null} defaultString The default string to use as boundary for the main edit gui (can be left null/empty)
* @param {Object|null} obj The {PogObject} class (if left null/empty and you have called #setObj it'll use that set PogObject instead)
* @returns {DraggableGui}
     
    
### _unload()

*  Unregisters and deletes lists
*  Internal use
     
    
