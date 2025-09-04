import mongoose, { model, Schema } from "mongoose";

const flashCardSchema = new Schema({
    question: {
        type: String,
        required: [true, "Question is required"],
    },
    answer: {
        type: String,
        required: [true, "Answer is required!"]
    }
}, { _id: false })

const deckSchema = new Schema({
    flashCards: {
        type: [flashCardSchema],
        required: [true, "Flash card is required!"],
        validate: {
            validator: function (arr) {

                return arr.length > 0;
            },
            message: "At least one flash card is required",
        },
    },
    name: {
        type: String,
        required: [true, "Deck name is required"],
    },
    description: {
        type: String,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
}, { timestamps: true })

const deckModel = model("decks", deckSchema)
export default deckModel

