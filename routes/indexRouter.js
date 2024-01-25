import express from "express";
import { passport } from "../auth.js";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const router = express.Router();

router.get("/", (req, res) => {
    if (req.user) {
        return res.render("board", { user: req.user });
    }
    res.render("login");
});

router.post(
    "/login",
    passport.authenticate(
        "local",
        {
            successRedirect: "/",
            failureRedirect: "/",
        } /* , (err, user, options) => {
        console.log({err, user, options})
    } */
    )
);

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

router
    .route("/signup")
    .get((req, res) => {
        res.render("signup");
    })
    .post([
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
        async (req, res, next) => {
            const result = validationResult(req);
            const data = req.body;

            if (!result.isEmpty()) {
                const errors = result.array();
                // console.log(errors);
                return res.render("signup", { errors, data });
            }

            try {
                const { username, firstname, lastname, password } = req.body;
                await User.create({
                    username,
                    firstname,
                    lastname,
                    password,
                });
                res.redirect("/?hei=ho");
            } catch (error) {
                return next(error);
            }
        },
    ]);

export default router;
