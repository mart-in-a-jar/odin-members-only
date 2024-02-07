import express from "express";
import { passport } from "../auth.js";
import bcrypt from "bcryptjs";
import { validateUser } from "../controllers/helpers/userValidation.js";
import { createUser } from "../controllers/createUser.js";
import User from "../models/User.js";
import Password from "../models/Password.js";
import Message from "../models/Message.js";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 1000 * 60 * 1,
    limit: 4,
});

const router = express.Router();

router.get("/", async (req, res, next) => {
    let messages = null;
    try {
        messages = await Message.find()
            .sort({ createdAt: -1 })
            .limit(20)
            .populate("author")
            .exec();
    } catch (error) {}
    res.render("board", { messages: messages });
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

router
    .route("/message")
    .post(limiter, async (req, res, next) => {
        if (!req.user) {
            // set 401
            next(new Error("not logged in"));
        }
        try {
            const message = await Message.create({
                title: req.body.title,
                text: req.body.message,
                author: req.user._id,
            });
            res.redirect("/");
        } catch (error) {
            next(error);
        }
    })
    .delete(async (req, res, next) => {
        // this endpoint is consumed in front end code, so it returns json
        if (!req.user) {
            return res.sendStatus(401);
        }
        if (!req.user?.admin) {
            return res.sendStatus(403);
        }
        try {
            await Message.findByIdAndDelete(req.body.id);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    });

export default router;
