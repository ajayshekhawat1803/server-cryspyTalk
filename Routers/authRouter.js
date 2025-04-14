import express from "express";
import { signupValidationRules } from "../middlewares/validators/authValidators.js";
import authController from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signupValidationRules, authController.SignUp);

export default authRouter;