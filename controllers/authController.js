import handleFormValidation from "../config/formDataValidationHandler.js";
import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class authCont {
    constructor() {
    }

    //  User registeration
    async signUp(req, res) {
        try {
            const hasErrors = handleFormValidation(req, "Registeration failed!");       // Check for validation errors
            if (hasErrors) {
                return res.status(422).json(hasErrors);
            }
            let data = req.body;
            const hashedPass = await bcrypt.hash(data.password, 10);
            data.password = hashedPass             // encrypt the password
            await userModel.create(data);
            return res
                .status(201)
                .json({ message: "Registeration successful", success: true, data: null });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }
    }

    //  User login
    async login(req, res) {
        try {
            const hasErrors = handleFormValidation(req, "Login failed!");       // Check for validation errors
            if (hasErrors) {
                return res.status(422).json(hasErrors);
            }
            const { email, password } = req.body;
            const user = await userModel.findOne({ email }).select(["password", "firstName", "lastname", "_id", "email"]);                        // Find user by email
            const isPasswordValid = await bcrypt.compare(password, user.password);  // Compare passwords
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Login failed!", success: false, data: { password: 'Invalid credentials' } });
            }
            // Generate JWT token
            const token = jwt.sign(
                { id: user._id, email: user.email, name: user.firstName + (user.lastName ? ` ${user.lastName}` : '') },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION }
            );

            return res.status(200).json({
                message: "Login successful",
                success: true,
                data: { token },
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }
    }
}

const authController = new authCont();
export default authController;