import { body } from 'express-validator'
import { emailNotExists } from './commonValidators.js';

export const sendNewMsgValidationRules = [
  body("chatId").trim().notEmpty().withMessage("Chat ID is required"),
  body("content").trim().notEmpty().withMessage("Message content cannot be empty"),
];