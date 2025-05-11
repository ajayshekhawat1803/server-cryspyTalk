import mongoose from 'mongoose';


const friendSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const friendsModel = mongoose.model('friendship_status', friendSchema);
export default friendsModel;