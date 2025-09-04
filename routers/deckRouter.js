import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { addNewDeckHandler, getMyDecksHandler, getSingleDeck } from "../controllers/deckController.js";
const deckRouter = Router()

deckRouter.post("/", isLoggedIn, addNewDeckHandler)
deckRouter.get("/", isLoggedIn, getMyDecksHandler)
deckRouter.get("/:deckId", isLoggedIn, getSingleDeck)

export default deckRouter