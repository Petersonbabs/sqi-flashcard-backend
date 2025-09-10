import { Router } from "express";
import { login, signup } from "../controllers/authController.js";
const authRouter = Router()
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";


authRouter.post("/signup", signup)
authRouter.post("/login", login)
authRouter.post("/verify-auth", async (req, res) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
        }

        if (!token) {
            return res.status(400).json({
                status: "error",
                message: "No token found"
            })
        }

        const { id } = jwt.verify(token, process.env.jwt_secret)

        //TODO: CHECK IF TOKEN HAS NOT BEEN BLACKLISTED

        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "Invalid token"
            })
        }
        res.status(200).json({ user })

    } catch (error) {
        console.log(error)
    }
})

export default authRouter