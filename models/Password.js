import mongoose from "mongoose";

const PasswordSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["memberJoin"],
        unique: true,
        required: true,
    },
    password: {
        type: String,
    },
});

const model = mongoose.model("passwords", PasswordSchema);
export default model;
