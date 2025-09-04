import deckModel from "../models/deckModel.js"

export const addNewDeckHandler = async (req, res, next) => {
    const student = req.user._id
    try {
        // get all decks
        const decks = await deckModel.find({ student })
        // map all the names out
        const deckNames = decks.map((deck) => deck.name)
        const deckNameExist = deckNames.includes(req.body.name)
        if (deckNameExist) {
            return res.json({
                status: "error",
                message: `You have a deck called ${req.body.name} already.`
            })
        }

        // check if re.body.name is not one of them
        const deck = await deckModel.create({ ...req.body, student })
        if (!deck) {
            return res.status(400).json({
                status: "error",
                message: "Unable to add deck"
            })
        }

        res.status(201).json({
            status: "success",
            message: "Deck add successfully",
            deck
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const getMyDecksHandler = async (req, res, next) => {
    const student = req.user._id
    try {
        const decks = await deckModel.find({ student })
        if (!decks) {
            return res.status(404).json({
                status: "error",
                message: "Unable to fetch decks"
            })
        }

        res.status(200).json({
            status: "success",
            decks
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const getSingleDeck = async (req, res, next) => {
    const { deckId } = req.params
    try {
        const deck = await deckModel.findById(deckId)
        if (!deck) {
            return res.status(400).json({
                status: "error",
                message: "Deck not found"
            })
        }

        res.status(201).json({
            status: "success",
            message: "Deck fetched successfully",
            deck
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}