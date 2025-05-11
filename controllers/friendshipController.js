import handleFormValidation from "../config/formDataValidationHandler.js";
import chatModel from "../models/chat.js";
import friendshipModel, { friendshipStatusEnums } from "../models/friendship.js";
import userModel from "../models/user.js";

class friendshipCont {
    constructor() {
    }

    async sendRequest(req, res) {
        try {
            const receiverId = req.params?.receiverId;
            if (!receiverId) {
                return res.status(422).json({ message: "Receiver ID is required", success: false, data: null });
            }
            // Check if the receiverId is valid object id
            if (!receiverId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(422).json({ message: "Invalid receiver ID", success: false, data: null });
            }
            const request = await friendshipModel.findOne({ senderId: req.user.id, receiverId: receiverId });
            if (!request) {
                await friendshipModel.create({
                    senderId: req.user.id,
                    receiverId: receiverId,
                })
                return res
                    .status(200)
                    .json({ message: "Request sent successfully", success: true, data: null });
            }
            else {
                if (request.status === friendshipStatusEnums.ACCEPTED) return res.status(400).json({ message: "You are already friends", success: false, data: null });
                if (request.status === friendshipStatusEnums.PENDING) return res.status(400).json({ message: "Request already sent", success: false, data: null });
                if (request.status === friendshipStatusEnums.REJECTED || request.status === friendshipStatusEnums.REVOKED) {
                    await friendshipModel.updateOne({ senderId: req.user.id, receiverId: receiverId }, { status: friendshipStatusEnums.PENDING });
                    return res.status(200).json({ message: "Request sent successfully", success: true, data: null });
                }
                if (request.status === friendshipStatusEnums.BLOCKED) {
                    return res.status(400).json({ message: "Cannot send request to this user", success: false, data: null });
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }
    }

    async acceptRequest(req, res) {
        try {
            const requestId = req.params?.requestId;
            if (!requestId) {
                return res.status(422).json({ message: "Request ID is required", success: false, data: null });
            }
            // Check if the request id is valid object id
            if (!requestId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(422).json({ message: "Invalid request ID", success: false, data: null });
            }
            const request = await friendshipModel.findById(requestId);
            if (!request) {
                return res.status(404).json({ message: "Request not found", success: false, data: null });
            }
            if (request.receiverId.toString() !== req.user.id) {
                return res.status(403).json({ message: "You are not authorized to accept this request", success: false, data: null });
            }
            if (request.status !== 'pending') {
                return res.status(400).json({ message: "Request is already accepted or rejected", success: false, data: null });
            }
            await friendshipModel.updateOne({ _id: requestId, receiverId: req.user.id }, { status: 'accepted' });
            await chatModel.create({
                isGroupChat: false,
                members: [request.senderId, request.receiverId],
                lastMessage: {
                    text: "You are now friends!",
                    senderId: request.receiverId,
                    sentAt: new Date(),
                },
                unreadMessageCount: 0,
            });
            return res
                .status(200)
                .json({ message: "Request accepted successfully", success: true, data: null });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }
    }

    async rejectRequest(req, res) {
        try {
            const requestId = req.params?.requestId;
            if (!requestId) {
                return res.status(422).json({ message: "Request ID is required", success: false, data: null });
            }
            // Check if the request id is valid object id
            if (!requestId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(422).json({ message: "Invalid request ID", success: false, data: null });
            }
            const request = await friendshipModel.findById(requestId);
            if (!request) {
                return res.status(404).json({ message: "Request not found", success: false, data: null });
            }
            if (request.receiverId.toString() !== req.user.id) {
                return res.status(403).json({ message: "You are not authorized to accept this request", success: false, data: null });
            }
            if (request.status !== 'pending') {
                return res.status(400).json({ message: "Request is already accepted or rejected", success: false, data: null });
            }
            await friendshipModel.updateOne({ _id: requestId, receiverId: req.user.id }, { status: 'rejected' });
            return res
                .status(200)
                .json({ message: "Request rejected successfully", success: true, data: null });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }
    }

    async cancelRequest(req, res) {
        try {
            const requestId = req.params?.requestId;
            if (!requestId) {
                return res.status(422).json({ message: "Request ID is required", success: false, data: null });
            }
            // Check if the request id is valid object id
            if (!requestId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(422).json({ message: "Invalid request ID", success: false, data: null });
            }
            const request = await friendshipModel.findById(requestId);
            if (!request) {
                return res.status(404).json({ message: "Request not found", success: false, data: null });
            }
            if (request.senderId.toString() !== req.user.id) {
                return res.status(403).json({ message: "You are not authorized to cancel this request", success: false, data: null });
            }
            if (request.status !== 'pending') {
                return res.status(400).json({ message: "Request is already accepted or rejected", success: false, data: null });
            }
            await friendshipModel.deleteOne({ _id: requestId, senderId: req.user.id });
            return res
                .status(200)
                .json({ message: "Request cancelled successfully", success: true, data: null });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }
    }

    async getPendingRequests(req, res) {
        try {
            const requests = await friendshipModel.find({ receiverId: req.user.id, status: 'pending' }).populate('senderId', 'name email profilePic');
            return res.status(200).json({ message: "Pending requests fetched successfully", success: true, data: requests });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }
    }

}

const friendshipController = new friendshipCont
export default friendshipController