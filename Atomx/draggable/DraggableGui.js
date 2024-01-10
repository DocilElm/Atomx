/**
 * @class
 */
export class DraggableGui {
    /**
     * - Creates a new DraggableGui with the given params
     * 
     * @param {Object} obj The PogObject for this [DraggableGui]
     * @param {Object} featureObj The feature object. e.g { x: 0, y: 0, scale: 1 }
     * @param {String|null} defaultString This is only used by the [DraggableHandler] you can leave this empty
     */
    constructor(obj, featureObj, defaultString = null) {
        this.obj = obj
        this.featureObj = featureObj

        // Used to set boundary
        this.defaultString = defaultString
        this.width = null
        this.height = null

        this.gui = new Gui()

        // Create obj if it doesn't have the correct data
        if (!("x" in featureObj) || !("y" in featureObj) || !("scale" in featureObj)) featureObj = { x: 0, y: 0, scale: 1 }

        this.gui.registerScrolled((_, __, dir) => {
            if (dir == 1) this.featureObj.scale += 0.02
            else this.featureObj.scale -= 0.02

            this.obj.save()
        })

        this.gui.registerMouseDragged((mx, my) => {
            this.featureObj.x = mx
            this.featureObj.y = my

            this.obj.save()
        })
    }

    /**
     * - Sets a command to open this [Gui] with
     * @param {String} commandName 
     * @returns this for method chaining
     */
    setCommand(commandName) {
        register("command", this.open.bind(this)).setName(commandName)
        
        return this
    }

    /**
     * - Runs the given function whenever this [Gui] is opened
     * @param {Function} func 
     */
    onRender(func) {
        this.gui.registerDraw(func)
        // Sets the default function to use on the handler
        this.defaultFunc = func
    }

    /**
     * - Gets this [Gui]'s X value
     * @returns {Number}
     */
    getX() {
        return this.featureObj.x ?? 0
    }

    /**
     * - Gets this [Gui]'s Y value
     * @returns {Number}
     */
    getY() {
        return this.featureObj.y ?? 0
    }

    /**
     * - Gets this [Gui]'s Scale value
     * @returns {Number}
     */
    getScale() {
        return this.featureObj.scale ?? 1
    }

    /**
     * - Opens this Gui
     */
    open() {
        this.gui.open()
    }

    /**
     * - Closes this gui
     */
    close() {
        this.gui.close()
    }

    /**
     * - Whether this [Gui] is currently open or not
     * @returns {Boolean}
     */
    isOpen() {
        return this.gui.isOpen()
    }

    /**
     * - Checks whether this DraggableGui has bounding box
     * @returns {Boolean}
     */
    hasBoundingBox() {
        if (this.width !== null && this.height !== null) return true
        if (!this.defaultString) return false

        return true
    }

    /**
     * - Sets the current DraggableGui's [width, height]
     * @param {Number} width 
     * @param {Number} height 
     * @returns this for method chaining
     */
    setSize(width, height) {
        this.width = width
        this.height = height

        return this
    }

    /**
     * - Sets the current DraggableGui's [string]
     * @param {String} string 
     * @param {Boolean} shouldCheck Whether to check if the string is already defined or not. if it is it returns without adding the new one
     * @returns this for method chaining
     */
    setString(string, shouldCheck = false) {
        if (shouldCheck && this.defaultString !== null) return

        this.defaultString = string

        return this
    }

    /**
     * - Gets the size [width, height] of the current string or the set values
     * @returns {[Number, Number]| null}
     */
    getSize() {
        if (!this.hasBoundingBox()) return null

        // If [w, h] values are set by the feature we return those
        if (this.width !== null && this.height !== null) return [ this.width, this.height ]

        // Check whether the string has [\n] spaces
        // if it doesn't get the [w, h] from a 1 line string
        if (!/\n+/g.test(this.defaultString)) return [
            Renderer.getStringWidth(this.defaultString.removeFormatting()),
            Renderer.getFontRenderer().field_78288_b
        ]

        // Get the [w, h] values from a multiple space [\n] string

        // Gets the amount of [\n] in the string
        const spaceAmount = this.defaultString.match(/\n+/g)?.length+1
        // Gets the first text that has [\n] on it
        const subString = this.defaultString.match(/(.+)\n+/)?.[1]

        // If either of these isn't defined we return [null]
        if (!spaceAmount || !subString) return null

        // Else we return the [w, h] values
        return [
            Renderer.getStringWidth(subString.removeFormatting()), // Gets the [subString] width to use as width
            spaceAmount * Renderer.getFontRenderer().field_78288_b // Gets the [FONT_HEIGHT] and times it by the amount of [\n]
        ]
    }

    /**
     * - Gets this DraggableGui's bounding box [ x1, y1, x2, y2 ]
     * @returns {[Number, Number, Number, Number] | null}
     */
    getBoundingBox() {
        // Using [size] so it can be checked before-hand for a null value
        // not using [ w, h ] = #getSize else it'll npe
        const size = this.getSize()

        // If the [size] is null we return || should never happen
        if (!size) return null

        // Else we return [ x1, y1, x2, y2 ] bounds
        return [
            this.getX(),
            this.getY(),
            this.getX() + size[0],
            this.getY() + size[1]
        ]
    }

    /**
     * - Draws a outline box surrounding the default string
     */
    drawBoundingBox() {
        const [ x1, y1, x2, y2 ] = this.getBoundingBox()
        const thickness = 1.5
        const color = Renderer.color(0, 0, 0, 80)

        // Draw top line
        Renderer.drawLine(
            color,
            x1 - thickness,
            y1 - 1,
            x2 - thickness,
            y1 - 1,
            thickness
        )

        // Draw left side line
        Renderer.drawLine(
            color,
            x1 - thickness,
            y1 - 1,
            x1 - thickness,
            y2 - 1,
            thickness
        )

        // Draw right side line
        Renderer.drawLine(
            color,
            x2 + thickness,
            y1 + 1,
            x2 + thickness,
            y2 + 1,
            thickness
        )

        // Draw bottom line
        Renderer.drawLine(
            color,
            x1 + thickness,
            y2 + 1,
            x2 + thickness,
            y2 + 1,
            thickness
        )
    }

    /**
     * - Checks whether the given [mx, my] values are near this [Gui]'s boundary
     * @param {Number} mx 
     * @param {Number} my 
     * @returns {Boolean}
     */
    checkBoundingBox(mx, my) {
        const [ x1, y1, x2, y2 ] = this.getBoundingBox()
        return (mx >= x1 && mx <= x2) && (my >= y1 && my <= y2)
    }
}