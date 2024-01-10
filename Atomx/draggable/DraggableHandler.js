import { DraggableGui } from "./DraggableGui"

/**
 * @class
 */
export class DraggableHandler {
    /**
     * - Creates a new DraggableHandler with the given params
     * - This class handles all of the Edit Guis and makes
     * a Main Edit Gui that when opened it will give you the option
     * to open other Edut Guis with a single click
     * 
     * @param {String} text The string that will appear in the center screen when this gui is opened
     */
    constructor(text = "&a&lClick at any component to open their edit gui") {
        this.text = text
        this.ctGui = new Gui()
        this.editGuis = new Set()
        this.obj = null

        this.registerHandler = new Set()

        this.registerHandler.add(this.ctGui.registerDraw(() => {
            Renderer.drawStringWithShadow(
                this.text,
                Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(this.text.removeFormatting()) / 2,
                Renderer.screen.getHeight() / 2
            )

            this.editGuis.forEach(guis => {
                guis.defaultFunc()

                // Check whether this gui has a bounding box or not
                if (!guis.hasBoundingBox()) return

                guis.drawBoundingBox()
            })
        }))

        this.registerHandler.add(this.ctGui.registerClicked((mx, my) => {
            this.editGuis.forEach(guis => {
                if (!guis.hasBoundingBox()) return

                // If the mouse click isnt near this component's
                // boundries we return
                if (!guis.checkBoundingBox(mx, my)) return

                // Else we open the component's edit gui
                guis.open()
            })
        }))

        this.registerHandler.add(register("gameUnload", this._unload.bind(this)))
    }

    /**
     * - Sets a command to open this gui with
     * @param {String} commandName 
     * @returns this for method chaining
     */
    setCommand(commandName) {
        register("command", () => this.ctGui.open()).setName(commandName)

        return this
    }

    /**
     * - Sets the pogobject for this class
     * @param {Object} obj 
     * @returns this for method chaining
     */
    setObj(obj) {
        this.obj = obj

        return this
    }

    /**
     * 
     * - Creates a new [DraggableGui] with the given params and returns it
     * @param {Object} featureObj The feature object e.g { x: 0, y: 0, scale: 1 }
     * @param {String|null} defaultString The default string to use as boundary for the main edit gui (can be left null/empty)
     * @param {Object|null} obj The {PogObject} class (if left null/empty and you have called #setObj it'll use that set PogObject instead)
     * @returns {DraggableGui}
     */
    addGui(featureObj, defaultString = null, obj = null) {
        const dGui = new DraggableGui(obj ?? this.obj, featureObj, defaultString)
        this.editGuis.add(dGui)

        return dGui
    }

    /**
     * - Unregisters and deletes lists
     * - Internal use
     */
    _unload() {
        this.registerHandler.forEach(event => event.unregister())

        this.registerHandler.clear()
        this.editGuis.clear()
    }
}