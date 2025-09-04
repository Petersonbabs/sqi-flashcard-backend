import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import connectToDb from "./config/connectToDb.js"
connectToDb()
dotenv.config()


// ROUTERS
import authRouter from "./routers/authRouter.js"
import deckRouter from "./routers/deckRouter.js"
import errorHandler from "./middlewares/errorHandler.js"

const app = express()
const PORT = process.env.PORT || 4005

app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
app.listen(PORT, () => {
    console.log("App is running")
})

app.get("/api/v1", (req, res) => {
    res.send("Welcome to SQI Flash card API version 1")
})

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/decks", deckRouter)

app.use("/{*any}", errorHandler)

// /api/v1/auth