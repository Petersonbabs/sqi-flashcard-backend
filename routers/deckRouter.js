import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { addNewDeckHandler, deleteDeck, generateQuiz, getMyDecksHandler, getSingleDeck } from "../controllers/deckController.js";
const deckRouter = Router()

deckRouter.post("/", isLoggedIn, addNewDeckHandler)
deckRouter.get("/", isLoggedIn, getMyDecksHandler)
deckRouter.get("/:deckId", isLoggedIn, getSingleDeck)
deckRouter.post("/generate-quiz", isLoggedIn, generateQuiz)
deckRouter.delete("/:deckId", isLoggedIn, deleteDeck)

export default deckRouter