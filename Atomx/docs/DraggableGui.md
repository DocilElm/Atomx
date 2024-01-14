# Class DraggableGui

* @class
 

### constructor(obj, featureObj, defaultString = null)

*  Creates a new DraggableGui with the given params
* 
* @param {Object} obj The PogObject for this [DraggableGui]
* @param {Object} featureObj The feature object. e.g { x: 0, y: 0, scale: 1 }
* @param {String|null} defaultString This is only used by the [DraggableHandler] you can leave this empty
     
    
### setCommand(commandName)

*  Sets a command to open this [Gui] with
* @param {String} commandName 
* @returns this for method chaining
     
    
### onRender(func)

*  Runs the given function whenever this [Gui] is opened
* @param {Function} func 
     
    
### getX()

*  Gets this [Gui]'s X value
* @returns {Number}
     
    
### getY()

*  Gets this [Gui]'s Y value
* @returns {Number}
     
    
### getScale()

*  Gets this [Gui]'s Scale value
* @returns {Number}
     
    
### open()

*  Opens this Gui
     
    
### close()

*  Closes this gui
     
    
### isOpen()

*  Whether this [Gui] is currently open or not
* @returns {Boolean}
     
    
### hasBoundingBox()

*  Checks whether this DraggableGui has bounding box
* @returns {Boolean}
     
    
### setSize(width, height)

*  Sets the current DraggableGui's [width, height]
* @param {Number} width 
* @param {Number} height 
* @returns this for method chaining
     
    
### setString(string, shouldCheck = false)

*  Sets the current DraggableGui's [string]
* @param {String} string 
* @param {Boolean} shouldCheck Whether to check if the string is already defined or not. if it is it returns without adding the new one
* @returns this for method chaining
     
    
### getSize()

*  Gets the size [width, height] of the current string or the set values
* @returns {[Number, Number]| null}
     
    
### getBoundingBox()

*  Gets this DraggableGui's bounding box [ x1, y1, x2, y2 ]
* @returns {[Number, Number, Number, Number] | null}
     
    
### drawBoundingBox()

*  Draws a outline box surrounding the default string
     
    
### checkBoundingBox(mx, my)

*  Checks whether the given [mx, my] values are near this [Gui]'s boundary
* @param {Number} mx 
* @param {Number} my 
* @returns {Boolean}
     
    
