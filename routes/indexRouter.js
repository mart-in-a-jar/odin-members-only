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
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/",
    })
);

export default router;
