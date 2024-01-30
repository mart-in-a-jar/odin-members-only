import { validationResult } from "express-validator";
import User from "../models/User.js";

const createUser = async (req, res, next) => {
    const result = validationResult(req);
    const data = req.body;

    if (!result.isEmpty()) {
        const errors = result.array();
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
        res.redirect("/login?user_created");
    } catch (error) {
        return next(error);
    }
};

export { createUser };
