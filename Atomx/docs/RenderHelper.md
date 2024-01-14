# Class RenderHelper

*  Class that adds some utilities for rendering
* @class
 

### static outlineBlock(ctBlock, r, g, b, a, phase = true, thick = 3)

*  Draws an outline box at the given block hitbox
* @param {Block} ctBlock 
* @param {Number} r 
* @param {Number} g 
* @param {Number} b 
* @param {Number} a 
* @param {Boolean} phase 
* @param {Number} thick 
     
    
### static filledBlock(ctBlock, r, g, b, a, phase = true)

*  Draws a filled box at the given block hitbox
* @param {Block} ctBlock 
* @param {Number} r 
* @param {Number} g 
* @param {Number} b 
* @param {Number} a 
* @param {Boolean} phase 
     
    
### static getGuiRenderPositions(mcGuiContainer)

*  Gets the gui's X and Y values
* @param {GuiContainer} mcGuiContainer The GuiContainer. if null it'll try to assign the current GuiContainer
* @returns {[Number, Number] | null}
     
    
### static getSlotRenderPosition(slotNumber, mcGuiContainer)

*  Gets the given slotNumber's render position [x, y]
* @param {Number} slotNumber 
* @param {GuiContainer | null} mcGuiContainer
* @returns {[Number, Number]}
     
    
### static getGuiRenderBoundings(mcGuiContainer)

*  Gets the GuiContainer [x1, y1, x2, y2] bounds using the last slot [44]
* @param {GuiContainer} mcGuiContainer 
* @returns {[Number, Number, Number, Number]}
     
    
### static drawLineThroughPoints(points, r, g, b, a, phase=true, lineWidth=3)

*  Draws a line through the given points
* @param {Number[][]} points - List of vertices as [[x, y, z], [x, y, z], ...]
* @param {Number} r 
* @param {Number} g 
* @param {Number} b 
* @param {Number} a 
* @param {Boolean} phase - Show the line through walls
* @param {Number} lineWidth - The width of the line
     
    
### static drawEntityAxis(axis, r, g, b, a, lineWidth = 1, phase = false)

*  Draws an entity box with the given AxisAlignedBB values
* @param {AxisAlignedBB} axis 
* @param {Number} r 
* @param {Number} g 
* @param {Number} b 
* @param {Number} a 
* @param {Number} lineWidth
* @param {Boolean} phase 
     
    
### static drawEntityBox(x, y, z, w, h, r, g, b, a, lineWidth = 1, phase = false)

*  Draws an entity box with the given [x, y, z, w, h] values
* @param {Number} x 
* @param {Number} y 
* @param {Number} z 
* @param {Number} w 
* @param {Number} h 
* @param {Number} r 
* @param {Number} g 
* @param {Number} b 
* @param {Number} a 
* @param {Number} lineWidth
* @param {Boolean} phase 
     
    
### static drawEntityAxisFilled(axis, r, g, b, a, lineWidth = 1, phase = false)

*  Draws an entity filled box with the given AxisAlignedBB values
* @param {AxisAlignedBB} axis 
* @param {Number} r 
* @param {Number} g 
* @param {Number} b 
* @param {Number} a 
* @param {Number} lineWidth
* @param {Boolean} phase 
     
    
### static drawEntityBoxFilled(x, y, z, w, h, r, g, b, a, lineWidth = 1, phase = false)

*  Draws an entity filled box with the given [x, y, z, w, h] values
* @param {Number} x 
* @param {Number} y 
* @param {Number} z 
* @param {Number} w 
* @param {Number} h 
* @param {Number} r 
* @param {Number} g 
* @param {Number} b 
* @param {Number} a 
* @param {Number} lineWidth
* @param {Boolean} phase 
     
    
