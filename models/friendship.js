import mongoose from 'mongoose';


const friendshipSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected','revoked', 'blocked'],
        default: 'pending'
    }
}, { timestamps: true });

const friendshipModel = mongoose.model('friendship_status', friendshipSchema);

export const friendshipStatusEnums = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    REVOKED: 'revoked',
    BLOCKED: 'blocked',
};

export default friendshipModel;