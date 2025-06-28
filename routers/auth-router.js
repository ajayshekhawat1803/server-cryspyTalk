import express from "express";
import { loginValidationRules, signupValidationRules } from "../middlewares/validators/authValidators.js";
import authController from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signupValidationRules, authController.signUp); // User signup
authRouter.post("/login", loginValidationRules, authController.login); // User login

export default authRouter;