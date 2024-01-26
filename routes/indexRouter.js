import express from "express";
import { passport } from "../auth.js";
import { validateUser } from "../controllers/helpers/userValidation.js";
import { createUser } from "../controllers/createUser.js";

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
                failureRedirect: "/",
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

router.route("/join").get((req, res) => {
    if (!req.user) {
        return res.redirect("/login?redirect=join");
    }
    res.render("join");
});

export default router;
