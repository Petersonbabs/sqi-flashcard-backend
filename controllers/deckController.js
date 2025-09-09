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

export const deleteDeck = async (req, res, next) => {
    const { deckId } = req.params
    if (!deckId) {
        return res.status(400).json({
            status: "error",
            message: "Deck Id is missing"
        })
    }
    try {
        await deckModel.findByIdAndDelete(deckId)
        res.status(200).json({
            status: "success",
            message: "Deck has been deleted!"
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}



export const generateQuiz = async (req, res, next) => {
    const { questions } = req.body
    if (!questions) {
        return res.status(400).json({
            status: "error",
            message: "Questions is missing"
        })
    }

    try {
        const prompt = `You are a professional exam question setter. You are given an array of questions, each question has its own correct answer.
         Add 3 more incorrect options to the answer in each question in this data: 

        ${JSON.stringify(questions)}.

        Put the correct answer in a random position 

        Do not return any comment or additional text please. just the updated array of question. do not add any special character like *></&^%$#@!;:. The response will be directly render on the frontend and it might break the code.

        Return your response in this format: ${questions.map(ele => {
            return { question: ele.question, options: [ele.answer, "option2", "option3", "option4"] }
        })}

        make sure the question are derived from this data: ${JSON.stringify(questions)}

        > Thank you
        `

        // const prompt = `Return the question back ${JSON.stringify(questions)}`

        const response = await fetch(`${process.env.GEMINI_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": process.env.GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        })
        const data = await response.json()
        res.json({ quiz: data.candidates[0].content.parts[0].text.replaceAll("\n", " ") })

    } catch (error) {
        console.log(error)
        next(error)
    }
}