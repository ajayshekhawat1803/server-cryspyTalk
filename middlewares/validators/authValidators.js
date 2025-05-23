import { body } from 'express-validator'
import { emailExists, emailNotExists } from './commonValidators.js';
// Auth validators

export const signupValidationRules = [
  body("firstName").trim().notEmpty().withMessage("First name cannot be empty"),
  body("lastName").trim(),
  body("password").trim().notEmpty().withMessage("Password is required"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .bail().custom(emailNotExists),
  body("cPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

export const loginValidationRules = [
  body("password").trim().notEmpty().withMessage("Password is required"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .bail().custom(emailExists),
];