import chatModel from "../models/chat.js";

class chatsCont {
    constructor() {
    }

    async getUserChats(req, res) {
        try {
            const userId = req.user.id;
            const chats = await chatModel.find({ members: userId })
                .populate({
                    path: "members",
                    select: "_id firstName lastName profilePic username"
                })
                .populate({
                    path: "lastMessage",
                    populate: {
                        path: "senderId",
                        select: "_id firstName lastName profilePic username"
                    }
                })
                .sort({ updatedAt: -1 })
                .lean();
            // Add chat name if only two members and is not a group chat
            chats.forEach(chat => {
                if (chat.members && chat.members.length === 2 && chat.isGroupChat === false) {
                    const otherMember = chat.members.find(m => m._id.toString() !== userId.toString());
                    if (otherMember) {
                        chat.name = `${otherMember.firstName} ${otherMember.lastName}`;
                    }
                }
            });
            return res.status(200).json({ message: "Chats fetched successfully", success: true, data: chats });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }
    }

    async getChatbyId(req, res) {
        try {
            const chatId = req.params?.chatId;
            if (!chatId) {
                return res.status(422).json({ message: "Chat ID is required", success: false, data: null });
            }
            // Check if the chat id is valid object id
            if (!chatId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(422).json({ message: "Invalid chat ID", success: false, data: null });
            }
            let chat = await chatModel.findById(chatId)
                .populate({
                    path: "members",
                    select: "_id firstName lastName profilePic username"
                })
                .populate({
                    path: "lastMessage",
                    populate: {
                        path: "senderId",
                        select: "_id firstName lastName profilePic username"
                    }
                })
                .sort({ updatedAt: -1 })
                .lean();
                console.log("chat", chat);                
            if (!chat) {
                return res.status(404).json({ message: "No chats found", success: false, data: null });
            }
            // Unauthorize if the current user is not a member of the chat
            if (!chat.members.some(member => member._id.toString() === req.user.id.toString())) {
                return res.status(403).json({ message: "You are not authorized to view this chat", success: false, data: null });
            }
            return res
                .status(200)
                .json({ message: "Chat fetched successfully", success: true, data: chat });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }
    }

    
}

const chatsController = new chatsCont
export default chatsController;