const { join } = require("path");
const { env, argv, platform } = process;

const express = require("express");
const passport = require("passport");
const { Strategy } = require("passport-local");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const { log_module } = require("./api/log_module/index")

require('dotenv').config()

const UsersModel = require("./api/models/users.model");

const router = express.Router();

passport.use(
    "local",
    new Strategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        UsersModel.localStrategyAuth.bind(UsersModel)
    )
);

passport.serializeUser(UsersModel.serializeUser.bind(UsersModel));

passport.deserializeUser(UsersModel.deserializeUser.bind(UsersModel));

router.use(
    session({
        secret: "secret string",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            stringify: false,
        }),
    })
);

router.use(passport.initialize());
router.use(passport.session());

router.use(express.json());

if (!!Number(env.NODE_ENV)) {
    router.use(log_module)
}

router.use("/api", require("./api/index"));

router.use((err, req, res, next) => {
    let e = { error: "" };
    if (err.joi) {
        e.error = err.joi.details[0];
    } else if (err.name === "MongoError") {
        e.error = err.errmsg;
    } else {
        e = err;
    }
    res.status(e.status || 400).send(e);
});

module.exports = router;

