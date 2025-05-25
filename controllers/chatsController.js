import chatModel from "../models/chat.js";
import friendshipModel, { friendshipStatusEnums } from "../models/friendship.js";

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
            // Add chat name if only two members
            chats.forEach(chat => {
                if (chat.members && chat.members.length === 2) {
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
}

const chatsController = new chatsCont
export default chatsController;