import userModel from "../../models/user.js";

export const emailNotExists = async (value) => {
    const user = await userModel.findOne({ email: value });
    if (user) {
        throw new Error("Email already exists!");
    }
    return true;
};