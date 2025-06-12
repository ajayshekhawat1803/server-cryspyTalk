import { body } from 'express-validator'
import { emailExists, emailNotExists } from './commonValidators.js';
import { genderOptions } from '../../models/user.js';
// Auth validators

export const signupValidationRules = [
  body("firstName").trim().notEmpty().withMessage("First name cannot be empty"),
  body("lastName").trim(),
  body("password").trim().notEmpty().withMessage("Password is required"),
  body("gender").trim()
    .notEmpty().withMessage("Please specify your gender"),
  // .isIn(genderOptions).withMessage(`Gender must be one of the following: ${Object.values(genderOptions).join(', ')}`),
  body("email")
    .trim()
    .toLowerCase()
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

export const updateProfileValidationRules = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name cannot be empty"),

  body("lastName")
    .trim()
    .optional({ nullable: true }),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 5, max: 20 })
    .withMessage("Username must be between 5 and 20 characters")
    .matches(/^[a-zA-Z0-9_.]+$/)
    .withMessage("Username can only contain letters, numbers, underscores, and periods"),

  body("dateOfBirth")
    .customSanitizer(value => value === "" ? null : value)
    .optional({ nullable: true })
    .isISO8601()
    .toDate()
    .withMessage("Date of Birth must be a valid date")
];