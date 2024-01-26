import express from "express";
import { passport } from "../auth.js";
import bcrypt from "bcryptjs";
import { validateUser } from "../controllers/helpers/userValidation.js";
import { createUser } from "../controllers/createUser.js";
import User from "../models/User.js";
import Password from "../models/Password.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("board", { user: req.user });
});

router
    .route("/login")
    .get((req, res) => {
        const userCreated = req.query.hasOwnProperty("user_created");
        res.render("login", {
            newUser: userCreated,
            redirect: req.query.redirect,
        });
    })
    .post(
        passport.authenticate(
            "local",
            {
                // successRedirect: "/",
                failureRedirect: "/login",
            } /* , (err, user, options) => {
        console.log({err, user, options})
    } */
        ),
        (req, res) => {
            const redirect = req.query.redirect || "";
            res.redirect("/" + redirect);
        }
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
    .post([validateUser(), createUser]);

router
    .route("/join")
    .get((req, res) => {
        if (!req.user) {
            return res.redirect("/login?redirect=join");
        }
        res.render("join");
    })
    .post(async (req, res, next) => {
        // promote user to member if correct password is supplied
        try {
            // check password
            const secretObj = await Password.findOne({
                name: "memberJoin",
            }).exec();
            const secretCode = secretObj.password;
            const match = await bcrypt.compare(req.body.password, secretCode);

            if (!match) {
                return res.render("join", { errors: ["Invalid code"] });
            }
            // if correct code
            const user = await User.findById(req.user.id).exec();
            user.member = true;
            await user.save();
            res.redirect("/");
        } catch (error) {
            next(error);
        }
    });

export default router;
