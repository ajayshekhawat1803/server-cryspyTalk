import handleFormValidation from "../config/formDataValidationHandler.js";
import friendshipModel from "../models/friendship.js";
import userModel from "../models/user.js";
import _ from "lodash";
import bcrypt from "bcrypt";

class userCont {
    constructor() { }

    async getLoginUser(req, res) {
        try {
            const userId = req.user.id;
            let user = await userModel.findById(userId);
            user = _.omit(user.toObject(), ["password", "updatedAt", "__v"])
            return res.status(200).json({ message: "User fetched successfully", success: true, data: user });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }
    }


    async getAllUsers(req, res) {
        try {
            let users = await userModel.find({ _id: { $ne: req.user.id } });
            users = users.map((u) => _.pick(u, ["_id", "firstName", "lastName", "email", "profilePic"]));
            return res.status(200).json({ message: "Users fetched successfully", success: true, data: users });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }

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

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }
    }

    async changePassword(req, res) {
        try {
            const userId = req.user.id;
            const { oldPassword, newPassword, confirmNewPassword } = req.body;
            const errors = {};
            if (!oldPassword) errors.oldPassword = "Old password is required";
            if (!newPassword) errors.newPassword = "New password is required";
            if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword)
                errors.confirmNewPassword = "Passwords do not match";
            if (Object.keys(errors).length > 0) {
                return res.status(422).json({
                    success: false,
                    message: "Invalid password input",
                    data: errors
                });
            }
            const user = await userModel.findById(userId).select("+password");
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(422).json({
                    success: false,
                    message: "Old password is incorrect",
                    data: { oldPassword: "Old password is incorrect" }
                });
            }
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            return res.json({ success: true, message: "Password changed successfully", data: null });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Something went wrong",
                success: false,
                data: null
            });
        }
    }

    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const hasErrors = handleFormValidation(req, "Registeration failed!");       // Check for validation errors
            if (hasErrors) {
                return res.status(422).json(hasErrors);
            }
            const { firstName, lastName, username, dateOfBirth } = req.body;
            console.log("Updating profile for user:", userId, "with data:", req.body);

            const existing = await userModel.findOne({ username: username.toLowerCase(), _id: { $ne: userId } });
            if (existing) return res.status(400).json({
                success: false, message: "Username already taken", data: {
                    username: "Username already taken"
                }
            });
            await userModel.findByIdAndUpdate(
                userId,
                { firstName, lastName, username: username.toLowerCase(), dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null },
                { new: true }
            );
            return res.status(200).json({ message: "Profile updated successfully", success: true, data: null });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }
    };

    async checkUsername(req, res) {
        try {
            const userId = req.user._id;
            const { username } = req.query;
            if (!username) return res.status(400).json({ success: false, message: "Username is required" });
            const existing = await userModel.findOne({ username: username.toLowerCase(), _id: { $ne: userId } });
            if (existing) return res.status(200).json({ success: true, message: "Username already taken", data: { available: false } });
            return res.status(200).json({ success: true, message: "Username available", data: { available: true } });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }
    };

}

const userController = new userCont();
export default userController;