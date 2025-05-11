import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    isGroupChat: { type: Boolean, default: false },
    name: { type: String }, // optional for group
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    lastMessage: {
        text: { type: String },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        sentAt: { type: Date }
    },
    unreadMessageCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const chatModel = mongoose.model('chats', chatSchema);
export default chatModel;

chatSchema.methods.resetUnreadCount = async function () {
    this.unreadMessageCount = 0;
    await this.save();
};

chatSchema.methods.addMember = async function (userId) {
    if (!this.members.includes(userId)) {
        this.members.push(userId);
        await this.save();
    }
};

chatSchema.methods.removeMember = async function (userId) {
    this.members = this.members.filter(memberId => memberId.toString() !== userId.toString());
    await this.save();
};

chatSchema.methods.updateLastMessage = async function ({ text, senderId, sentAt }) {
    this.lastMessage = { text, senderId, sentAt };
    await this.save();
  };

chatSchema.methods.incrementUnreadCount = async function () {
    this.unreadMessageCount += 1;
    await this.save();
};

