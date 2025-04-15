import mongoose from 'mongoose';

const chat = new Mongoose.Schema({
    member: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messages',
    },
    unreadMessageCount: {
        type: Number,
        default: 0,
    },

}, { timestamps: true });

const chatModel = mongoose.model('chats', chat);
export default chatModel;


// Adding a method to reset unread message count
chat.methods.resetUnreadCount = async function () {
    this.unreadMessageCount = 0;
    await this.save();
};

// Adding a method to add a new member to the chat
chat.methods.addMember = async function (userId) {
    if (!this.member.includes(userId)) {
        this.member.push(userId);
        await this.save();
    }
};

// Adding a method to remove a member from the chat
chat.methods.removeMember = async function (userId) {
    this.member = this.member.filter(memberId => memberId.toString() !== userId.toString());
    await this.save();
};

// Adding a method to update the last message
chat.methods.updateLastMessage = async function (messageId) {
    this.lastMessage = messageId;
    await this.save();
};

// Adding a method to increment unread message count
chat.methods.incrementUnreadCount = async function () {
    this.unreadMessageCount += 1;
    await this.save();
};