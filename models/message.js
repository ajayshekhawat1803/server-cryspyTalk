import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    readBy: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },
            readAt: {
                type: Date,
            },
        },
    ],
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });