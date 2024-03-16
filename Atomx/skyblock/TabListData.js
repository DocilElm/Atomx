import AtomxApi from "../AtomxApi"
import { TextHelper } from "../helper/Text"
import { onTabAddPacket, onTabUpdatePacket } from "./Register"

/**
 * - Class that handles certain data that the user recieves from TabList
 * @class
 */
export default new class TabListData {
    /**
     * - Creates a new [TabListData] class
     */
    constructor() {
        // Init methods
        this._reset()
        this._reloadRegex()

        // Reload regex if the api was changed
        AtomxApi.onApiUpdate(this._reloadRegex.bind(this))

        onTabUpdatePacket(this._checkTab.bind(this))
        onTabAddPacket(this._checkTab.bind(this))

        // Bind this to ensure it can still access internal class properties
        register("worldUnload", this._reset.bind(this))
    }

    _checkTab(tabName, _, formatted) {
        this.profileName = TextHelper.getRegexMatch(this.profileNameRegex, tabName)?.[1] ?? this.profileName
        this.bank = TextHelper.getRegexMatch(this.bankRegex, tabName)?.[1] ?? this.bank
        this.skills = TextHelper.getRegexMatch(this.skillsRegex, tabName)?.[1] ?? this.skills
        this.skillsPercent = TextHelper.getRegexMatch(this.skillsRegex, tabName)?.[2] ?? this.skillsPercent
        this.interest = TextHelper.getRegexMatch(this.interestRegex, tabName)?.[1] ?? this.interest

        // If it's part of a player stat we assign it's values in an object
        if (this.statsRegex.test(tabName)) {
            const statMatch = TextHelper.getRegexMatch(this.statsRegex, tabName)
            const statAmount = statMatch[3]
            // Saving the formatted text in case we need to make a feature that displays this
            // to make it easier to just call it from here instead of formatting manually
            this.stats[statMatch[1]] = {
                formattedText: formatted,
                statAmount: statAmount
            }
        }

        // Garden
        this.cropMilestone = TextHelper.getRegexMatch(this.cropMilestoneRegex, tabName)?.[1] ?? this.cropMilestone
        this.cropMilestonePercent = TextHelper.getRegexMatch(this.cropMilestoneRegex, tabName)?.[2] ?? this.cropMilestonePercent
        this.jacobContest = TextHelper.getRegexMatch(this.jacobContestRegex, tabName)?.[1] ?? this.jacobContest
        this.nextVisitor = TextHelper.getRegexMatch(this.nextVisitorRegex, tabName)?.[1] ?? this.nextVisitor
        this.organicMatter = TextHelper.getRegexMatch(this.organicMatterRegex, tabName)?.[1] ?? this.organicMatter
        this.fuel = TextHelper.getRegexMatch(this.fuelRegex, tabName)?.[1] ?? this.fuel
        this.timeLeft = TextHelper.getRegexMatch(this.timeLeftRegex, tabName)?.[1] ?? this.timeLeft
        this.storedCompost = TextHelper.getRegexMatch(this.storedCompostRegex, tabName)?.[1] ?? this.storedCompost
        this.totalVisitors = TextHelper.getRegexMatch(this.totalVisitorsRegex, tabName)?.[1] ?? this.totalVisitors
        // Pests
        this.pestsAlive = TextHelper.getRegexMatch(this.pestsAliveRegex, tabName)?.[1] ?? this.pestsAlive
        this.currentSpray = TextHelper.getRegexMatch(this.currentSprayRegex, tabName)?.[1] ?? this.currentSpray
        this.bonusFortune = TextHelper.getRegexMatch(this.bonusFortuneRegex, tabName)?.[1] ?? this.bonusFortune
        this.infesetedPlots = TextHelper.getRegexMatch(this.infestedPlotsRegex, tabName)?.[1] ?? this.infesetedPlots

        // Crimson
        this.matriarchDaily = TextHelper.getRegexMatch(this.matriarchRegex, tabName)?.[1] ?? this.matriarchDaily
        this.aranyaDaily = TextHelper.getRegexMatch(this.aranyaRegex, tabName)?.[1] ?? this.aranyaDaily

        // End
        this.eyesPlaced = TextHelper.getRegexMatch(this.eyesPlacedRegex, tabName)?.[1] ?? this.eyesPlaced
        this.protectorStage = TextHelper.getRegexMatch(this.protectorStageRegex, tabName)?.[1] ?? this.protectorStage

        // Mines
        this.fetchurDaily = TextHelper.getRegexMatch(this.fetchurRegex, tabName)?.[1] ?? this.fetchurDaily
        this.puzzlerDaily = TextHelper.getRegexMatch(this.puzzlerRegex, tabName)?.[1] ?? this.puzzlerDaily

        // Spider's Den
        this.rain = TextHelper.getRegexMatch(this.rainRegex, tabName)?.[1] ?? this.rain
        this.broodmother = TextHelper.getRegexMatch(this.broodMotherRegex, tabName)?.[1] ?? this.broodmother

        // The Farming Islands
        this.trevor = TextHelper.getRegexMatch(this.trevorRegex, tabName)?.[1] ?? this.trevor
        this.pelts = TextHelper.getRegexMatch(this.peltsRegex, tabName)?.[1] ?? this.pelts

        // ThePlayer
        this.currentPet = TextHelper.getRegexMatch(this.currentPetRegex, tabName)?.[2] ?? this.currentPet
        this.currentSbLevel = TextHelper.getRegexMatch(this.currentSbLevelRegex, tabName)?.[1] ?? this.currentSbLevel

        // Thank you hypixel
        if (/^ (MAX LEVEL)$/.test(tabName)) return this.currentPetXP = TextHelper.getRegexMatch(/^ (MAX LEVEL)$/, tabName)?.[1] ?? this.currentPetXP        
        this.currentPetXP = TextHelper.getRegexMatch(this.currentPetXpRegex, tabName)?.[1] ?? this.currentPetXP
    }

    /**
     * - Re-loads the required regex data from the api
     * - Internal Use
     */
    _reloadRegex() {
        const regexData = AtomxApi.getRegexData()
        const AccountRegex = regexData?.AccountStats
        const GardenRegex = regexData?.Garden
        const CrimsonRegex = regexData?.Crimson
        const EndRegex = regexData?.End
        const MinesRegex = regexData?.Mines
        const SpiderDenRegex = regexData?.SpiderDen
        const TheFarmingIslandsRegex = regexData?.TheFarmingIslands
        const ThePlayerR = regexData.ThePlayer

        if (
            !AccountRegex ||
            !GardenRegex ||
            !CrimsonRegex ||
            !EndRegex ||
            !MinesRegex ||
            !SpiderDenRegex ||
            !TheFarmingIslandsRegex ||
            !ThePlayerR
            ) return

        // Account stats regex
        this.profileNameRegex = AccountRegex.ProfileName
        this.bankRegex = AccountRegex.PlayerBank
        this.skillsRegex = AccountRegex.Skills
        this.statsRegex = AccountRegex.Stats
        this.interestRegex = AccountRegex.Interest

        // ThePlayer regex
        this.currentPetRegex = ThePlayerR.CurrentPet
        this.currentPetXpRegex = ThePlayerR.CurrentPetXp
        this.currentSbLevelRegex = ThePlayerR.CurrentSbLevel

        // Garden stats regex
        this.cropMilestoneRegex = GardenRegex.CropMilestone
        this.jacobContestRegex = GardenRegex.JacobContest
        this.nextVisitorRegex = GardenRegex.NextVisitor
        this.organicMatterRegex = GardenRegex.OrganicMatter
        this.fuelRegex = GardenRegex.Fuel
        this.timeLeftRegex = GardenRegex.TimeLeft
        this.storedCompostRegex = GardenRegex.StoredCompost
        this.totalVisitorsRegex = GardenRegex.TotalVisitors
        // Garden pests
        this.pestsAliveRegex = GardenRegex.PestsAlive
        this.currentSprayRegex = GardenRegex.CurrentSpray
        this.bonusFortuneRegex = GardenRegex.BonusFortune
        this.infestedPlotsRegex = GardenRegex.InfesetedPlots

        // Crimson Regex
        this.matriarchRegex = CrimsonRegex.Matriarch
        this.aranyaRegex = CrimsonRegex.Aranya

        // End
        this.eyesPlacedRegex = EndRegex.EyesPlaced
        this.protectorStageRegex = EndRegex.ProtectorStage

        // Mines
        this.fetchurRegex = MinesRegex.Fetchur
        this.puzzlerRegex = MinesRegex.Puzzler

        // Spider's Den
        this.rainRegex = SpiderDenRegex.Rain
        this.broodMotherRegex = SpiderDenRegex.BroodMother

        // The Farming Islands
        this.trevorRegex = TheFarmingIslandsRegex.Trevor
        this.peltsRegex = TheFarmingIslandsRegex.Pelts
    }

    /**
     * - Resets all of the variables to a default state
     * - Internal Use
     */
    _reset() {
        // Account info
        this.profileName = null
        this.bank = null
        this.skills = null
        this.skillsPercent = null
        this.stats = {}
        this.interest = null

        // ThePlayer
        this.currentPet = null
        this.currentPetXP = null
        this.currentSbLevel = null
        
        // Account info - Garden
        this.cropMilestone = null
        this.cropMilestonePercent = null
        this.jacobContest = null
        this.nextVisitor = null
        this.organicMatter = null
        this.fuel = null
        this.timeLeft = null
        this.storedCompost = null
        this.totalVisitors = 0
        // Garden Pests
        this.pestsAlive = 0
        this.currentSpray = null
        this.bonusFortune = null
        this.infesetedPlots = null

        // Crimson
        this.matriarchDaily = null
        this.aranyaDaily = null

        // End
        this.eyesPlaced = null
        this.protectorStage = null

        // Mines
        this.fetchurDaily = null
        this.puzzlerDaily = null

        // Spider's Den
        this.rain = null
        this.broodmother = null

        // The Farming Islands
        this.trevor = null
        this.pelts = null
    }

    /**
     * - Gets the current profile's name (e.g "Cucumber")
     * @returns {String}
     */
    getProfileName() {
        return this.profileName
    }

    /**
     * - Gets the current player's bank stats (e.g "1.5B/100" coop/personal)
     * @returns {String}
     */
    getBank() {
        return this.bank
    }

    /**
     * - Gets the current skill in account info (e.g "Foraging")
     * @returns {String}
     */
    getSkill() {
        return this.skills
    }

    /**
     * - Gets the current skill percent in account info (e.g 78.8)
     * @returns {Number}
     */
    getSkillPercent() {
        return parseFloat(this.skillsPercent)
    }

    /**
     * - Gets the current player's stats (e.g Strength: { formattedText: "The formatted text", statAmount: 2000 })
     * @returns {Object}
     */
    getStats() {
        return this.stats
    }

    // Garden

    /**
     * - Gets the current crop milestone (e.g "Wheat 27")
     * @returns {String}
     */
    getCropMilestone() {
        return this.cropMilestone
    }

    /**
     * - Gets the current crop milestone percent (e.g 89.2)
     * @returns {Number}
     */
    getCropMilestonePercent() {
        return parseFloat(this.cropMilestonePercent)
    }

    /**
     * - Gets the current jacob contest time (e.g "20m")
     * @returns {String}
     */
    getJacobContest() {
        return this.jacobContest
    }

    /**
     * - Gets the next visitor (e.g "8m 59s")
     * @returns {String}
     */
    getNextVisitor() {
        return this.nextVisitor
    }

    /**
     * - Gets the current organic matter in the composter (e.g "348k")
     * @returns {String}
     */
    getOrganicMatter() {
        return this.organicMatter
    }

    /**
     * - Gets the current fuel in the composter (e.g "578k")
     * @returns {String}
     */
    getFuel() {
        return this.fuel
    }

    /**
     * - Gets the current time left for the composter to create a new compost (e.g "1m 10s")
     * @returns {String}
     */
    getTimeLeft() {
        return this.timeLeft
    }

    /**
     * - Gets the current amount of stored compost (e.g "3.3k")
     * @returns {String}
     */
    getStoredCompost() {
        return this.storedCompost
    }

    /**
     * - Gets the current total visitors
     * @returns {Number}
     */
    getTotalVisitors() {
        return this.totalVisitors
    }

    /**
     * - Gets the pests alive from tab
     * @returns {Number}
     */
    getPestsAlive() {
        return this.pestsAlive
    }

    /**
     * - Gets the current spray name
     * @returns {String|null}
     */
    getCurrentSpray() {
        return this.currentSpray
    }

    /**
     * - Gets the current bonus fortune from tab
     * @returns {String|null}
     */
    getBonusFortune() {
        return this.bonusFortune
    }

    /**
     * - Gets the currently infested plots
     * @returns {String} (e.g "10, 5, 15")
     */
    getInfestedPlots() {
        return this.infesetedPlots
    }

    // Crimson

    /**
     * - Gets the current matriarch daily state
     * @returns {String|null}
     */
    getMatriarchDaily() {
        return this.matriarchDaily
    }

    /**
     * - Gets the current aranya daily state
     * @returns {String|null}
     */
    getAranyaDaily() {
        return this.aranyaDaily
    }

    // End

    /**
     * - Gets the current eyes placed in the end
     * @returns {String|null}
     */
    getEyesPlaced() {
        return this.eyesPlaced
    }

    /**
     * - Gets the current stage of the protector
     * @returns {String|null}
     */
    getProtectorStage() {
        return this.protectorStage
    }

    // Mines

    /**
     * - Gets the current state of fetchur daily
     * @returns {String|null}
     */
    getFetchurDaily() {
        return this.fetchurDaily
    }

    /**
     * - Gets the current state of puzzler daily
     * @returns {String|null}
     */
    getPuzzlerDaily() {
        return this.puzzlerDaily
    }

    // Spider's Den

    /**
     * - Gets the current rain state
     * @returns {String|null}
     */
    getRain() {
        return this.rain
    }

    /**
     * - Gets the current BroodMother stage
     * @returns {String|null}
     */
    getBroodMotherStage() {
        return this.broodmother
    }

    // The Farming Islands

    /**
     * - Gets trevor's state
     * @returns {String|null}
     */
    getTrevor() {
        return this.trevor
    }

    /**
     * - Gets the user's pelts
     * @returns {Number}
     */
    getPelts() {
        return parseInt(this.pelts)
    }

    // The Player
    
    /**
     * - Gets the current equipped pet (from tab)
     * @returns {String|null}
     */
    getCurrentPet() {
        return this.currentPet
    }

    /**
     * - Gets the current equipped pet's xp (from tab)
     * @returns {String|null}
     */
    getCurrentPetXP() {
        return this.currentPetXP
    }

    /**
     * - Gets the current sb level
     * @returns {String|null}
     */
    getSkyblockLevel() {
        return this.currentSbLevel
    }
}