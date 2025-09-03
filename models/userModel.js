// email
// name
// department (optional)
// level (optional)

import { model, Schema } from "mongoose";

// password
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "email already exists"]
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must not be less than 6 characters"]
    },
    department: {
        type: String,
        enum: ["Software engineering", "Data science", "Graphic design", "Ui/Ux", "Cyber Security", "Data analysis"]
    },
    isVerified: {
        type: Boolean,
        default: false
    }
})

const userModel = model("users", userSchema)
export default userModel