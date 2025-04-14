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
}

const userController = new userCont();
export default userController;