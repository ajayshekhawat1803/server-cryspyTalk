import handleFormValidation from "../config/formDataValidationHandler.js";
import chatModel from "../models/chat.js";
import messagesModel from "../models/message.js";

class messageCont {
    constructor() {
    }

    async sendNewMessage(req, res) {
        try {            
            const hasErrors = handleFormValidation(req, "Message not sent");
            if (hasErrors) {
                return res.status(422).json(hasErrors);
            }
            let data = req.body;
            data.senderId = req.user.id;
            data.mediaUrl = req.file ? `uploads/messages/${req.file.filename}` : null;

            const isChatMember = await chatModel.findOne({
                _id: data.chatId,
                members: data.senderId
            });
            if (!isChatMember) {
                return res.status(403).json({ message: "You are not a member of this chat", success: false, data: null });
            }
            let newMessage = await messagesModel.create(data);
            // update the chat's lastMessage and updatedAt
            await chatModel.findByIdAndUpdate(data.chatId, {
                lastMessage: {
                    text: newMessage.content,
                    senderId: newMessage.senderId,
                    sentAt: newMessage.sentAt || Date.now()
                },
                $inc: { unreadMessageCount: 1 }
                ,
            });

            await newMessage.populate({
                path: "senderId",
                select: "_id firstName lastName profilePic username"
            });
console.log(res);

            return res.status(201).json({ message: "Message sent successfully", success: true, data: newMessage });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }
    }

    async getMessagesByChatId(req, res) {
        try {
            const { chatId } = req.params;
            const userId = req.user.id;

            const isChatMember = await chatModel.findOne({
                _id: chatId,
                members: userId
            });
            if (!isChatMember) {
                return res.status(403).json({ message: "You are not a member of this chat", success: false, data: null });
            }
            await messagesModel.updateMany({ chatId, seenBy: { $ne: userId } }, { $addToSet: { seenBy: userId } });
            let messages = await messagesModel.find({ chatId })
                .populate({
                    path: "senderId",
                    select: "_id firstName lastName profilePic username"
                })
                .populate({
                    path: "seenBy",
                    select: "_id firstName profilePic"
                })
                .sort({ sentAt: 1 });
            let chat = await chatModel.findById(chatId)
                .populate({
                    path: "members",
                    select: "_id firstName lastName profilePic username"
                })
            chat = chat.toObject();
            if (chat.members && chat.members.length === 2 && chat.isGroupChat === false) {
                const otherMember = chat.members.find(m => m._id.toString() !== userId.toString());
                if (otherMember) {
                    chat.name = `${otherMember.firstName} ${otherMember.lastName}`;
                    chat['profilePic'] = otherMember.profilePic;
                    chat['username'] = otherMember.username;
                }
            }
            messages = messages.map((msg) => {
                msg.seenBy = msg.seenBy.filter((user) => user._id.toString() !== userId && user._id.toString() !== msg.senderId._id.toString());
                return msg
            })
            return res.status(200).json({ message: "Messages fetched successfully", success: true, data: { messages, chatUser: chat } });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }
    }

}

const messageController = new messageCont
export default messageController;