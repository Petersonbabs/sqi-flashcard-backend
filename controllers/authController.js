import bcrypt, { hash } from "bcryptjs"
import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken"

export const signup = async (req, res, next) => {
    console.log("Got here!")
    const { password, confirmPassword } = req.body
    // check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({
            status: "error",
            message: "Passwords do not match"
        })
    }
    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const user = await userModel.create({ ...req.body, password: hash })
        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "Unable to create user"
            })
        }
        res.status(201).json({
            status: "success",
            message: "User created successfully"
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await userModel.findOne({ email }).select("+password")
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "Email or password is incorrect"
            })
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(404).json({
                status: "error",
                message: "Email or password is incorrect"
            })
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.jwt_secret)

        res.status(200).json({
            status: "success",
            message: "Login successful!",
            token
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}