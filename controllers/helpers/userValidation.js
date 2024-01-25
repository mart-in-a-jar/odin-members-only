import { body } from "express-validator";
import User from "../../models/User.js";

const validateUser = () => {
    return [
        body("username")
            .isEmail()
            .withMessage("Invalid email")
            .isLength({ max: 50 })
            .withMessage("Email address must be max 50 characters long")
            .custom(async (value) => {
                const user = await User.findOne({ username: value }).exec();
                if (user) {
                    throw new Error("User already exists");
                }
                return true;
            }),
        body("firstname")
            .trim()
            .notEmpty()
            .withMessage("First name is required")
            .isLength({ min: 2, max: 50 })
            .withMessage("First name must be between 2 and 50 characters long"),
        body("lastname")
            .trim()
            .notEmpty()
            .withMessage("Last name is required")
            .isLength({ min: 2, max: 50 })
            .withMessage("Last name must be between 2 and 50 characters long"),
        body(
            "password",
            "Password must be between 8 and 100 characters and include at least one of the following: uppercase character, lowercase character, number and symbol"
        )
            .isStrongPassword()
            .isLength({ max: 100 }),
        body("confirmPassword").custom((value, { req }) => {
            if (req.body.password !== value) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
    ];
};

export { validateUser };
