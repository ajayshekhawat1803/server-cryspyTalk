import friendshipModel from "../models/friendship.js";
import userModel from "../models/user.js";
import _ from "lodash";

class userCont {
    constructor() { }

    async getLoginUser(req, res) {
        const userId = req.user.id;
        let user = await userModel.findById(userId);
        user = _.omit(user.toObject(), ["password", "updatedAt", "__v"])
        return res.status(200).json({ message: "User fetched successfully", success: true, data: user });
    }

    async getAllUsers(req, res) {
        let users = await userModel.find({ _id: { $ne: req.user.id } });
        users = users.map((u) => _.pick(u, ["_id", "firstName", "lastName", "email", "profilePic"]));
        return res.status(200).json({ message: "Users fetched successfully", success: true, data: users });
    }

    async userSearch(req, res) {
        const query = req.query.q?.trim();
        const userId = req.user.id;

        try {
            const regex = new RegExp(query || '', 'i');
            let users = await userModel.find({
                _id: { $ne: userId },
                $or: [
                    { firstName: { $regex: regex } },
                    { lastName: { $regex: regex } },
                    { username: { $regex: regex } },
                    { email: { $regex: regex } }
                ]
            })
                .select('_id firstName lastName username profilePic')
                .limit(20)
                .lean();

            const friendships = await friendshipModel.find({
                $or: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            }).lean();

            const friendshipMap = {};
            friendships.forEach(f => {
                const otherId = f.senderId.toString() === userId ? f.receiverId.toString() : f.senderId.toString();
                friendshipMap[otherId] = {
                    status: f.status,
                    isSender: f.senderId.toString() === userId
                };
            });

            users = users.map(user => {
                const f = friendshipMap[user._id.toString()];
                const isFriend = f?.status === 'accepted';
                const requestSent = f?.status === 'pending' && f.isSender;
                return {
                    ...user,
                    isFriend,
                    requestSent
                };
            });

            return res.status(200).json({
                message: "Users fetched successfully",
                success: true,
                data: users
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

}

const userController = new userCont();
export default userController;