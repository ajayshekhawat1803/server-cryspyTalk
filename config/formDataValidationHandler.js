import { validationResult } from "express-validator";

const handleFormValidation = (req, res, message) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = {};
        errors.array().forEach(err => {
            if (!formattedErrors[err.path]) {
                formattedErrors[err.path] = err.msg;
            }
        });

        return {
            message,
            success: false,
            data: formattedErrors,
        };
    }
    return null; // validation passed
};

export default handleFormValidation;
