import express from "express";
import messageController from "../controllers/messageController.js";
import { sendNewMsgValidationRules } from "../middlewares/validators/messageValidators.js";

const msgRouter = express.Router();

msgRouter.post("/send-message", sendNewMsgValidationRules, messageController.sendNewMessage);

export default msgRouter;