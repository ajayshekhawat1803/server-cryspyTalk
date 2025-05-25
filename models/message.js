import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'chats', required: true },
    content: {
        type: String,
        required: true,
    },
    mediaUrl: { type: String },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users', default: [] }],
    sentAt: { type: Date, default: Date.now },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    editedAt: { type: Date },
}, { timestamps: true });

const messagesModel = mongoose.model('messages', messageSchema);
export default messagesModel;