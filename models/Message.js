import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            minLength: 1,
            maxLength: 100,
            required: true,
        },
        text: {
            type: String,
            minLength: 1,
            maxLength: 1000,
            required: true,
        },
        author: {
            type: mongoose.ObjectId,
            ref: "users",
            required: true,
        },
    },
    { timestamps: true }
);

const model = mongoose.model("messages", MessageSchema);
export default model;
