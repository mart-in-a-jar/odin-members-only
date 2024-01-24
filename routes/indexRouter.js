import express from "express";
import { passport } from "../auth.js";

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

export default router;
