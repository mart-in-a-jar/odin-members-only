import express from "express";
import dotenv from "dotenv/config";
import mongoose, { mongo } from "mongoose";
import { passport } from "./auth.js";
import session from "express-session";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import indexRouter from "./routes/indexRouter.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB });

app.set("views", path.join(__dirname, "./client/views"));
app.set("view engine", "ejs");

app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// make user object available (so we don't have to pass it into every view)
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use("/", indexRouter);

app.use(express.static(path.join(__dirname, "./client/public")));

// 404-catcher, forward error to error handler
app.use((req, res, next) => {
    const err = new Error(`Not found: ${req.originalUrl}`);
    err.status = 404;
    next(err);
});

// Error handler
app.use((err, req, res, next) => {
    const errorCode = err.status || 500;
    /* res.status(err.status || errorCode).json({
        error: { message: err.message, code: err.status || errorCode },
    }); */
    console.error(err);
    res.status(errorCode)
    res.render("error", { errorCode });
});

app.listen(process.env.PORT);