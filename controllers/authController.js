import handleFormValidation from "../config/formDataValidationHandler.js";
import userModel from "../models/user.js";
import bcrypt from "bcrypt";

class authCont {
    constructor() {
    }

    //  User registeration
    async SignUp(req, res) {
        try {
            const hasErrors = handleFormValidation(req, res, "Registeration failed!");       // Check for validation errors
            if (hasErrors) {
                return res.status(422).json(hasErrors);
            }
            const { firstName, lastName, email, password } = req.body;
            const hashedPass = await bcrypt.hash(password, 10);             // encrypt the password
            await userModel.create({                                        // create the user
                firstName,
                lastName,
                email,
                password: hashedPass,
            });
            return res
                .status(201)
                .json({ message: "Registeration successful", success: true, data: null });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong", success: false, data: null });
        }
    }
}

const authController = new authCont();
export default authController;