import express from "express";
import { passport } from "../auth.js";
import { validateUser } from "../controllers/helpers/userValidation.js";
import { createUser } from "../controllers/createUser.js";

const router = express.Router();

router.get("/", (req, res) => {
    if (req.user) {
        return res.render("board", { user: req.user });
    }
    const userCreated = req.query.hasOwnProperty("user_created");
    res.render("login", { newUser: userCreated });
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
    .post([validateUser(), createUser]);

export default router;
