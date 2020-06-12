const UserModel = require("../models/users.model");

exports.getAllAccounts = async (req, res, next) => {
    const dbData = await UserModel.find();

    res.send(dbData || {code:404, error: "Currently no accounts found"});
}

exports.changeUserRole = async (req, res, next) => {
    const { email, role } = req.body;

    const { user } = req.session;

    if (role === "user" && !user.rootAdmin) {
        return next({code: 403, error: "You have no root permissions!" })
    }

    const doc = await UserModel.findOneAndUpdate({email}, {role}, {
        returnOriginal: false
    });

    if(!doc) return next({code: 404, error: "User not found" });

    res.send(doc);
}

exports.blockAccount = async (req, res, next) => {
    const { email, role, isBlocked } = req.body;

    if(role === "admin") return next({code: 403, error: "You have no permissions" })

    const doc = await UserModel.findOneAndUpdate({email}, {isBlocked}, {
        lean: true,
        returnOriginal: false
    })

    if(!doc) return next({code: 404, error: "User not found" });

    const dbData = await UserModel.find();


    res.send(dbData || {code:404, error: "Currently no accounts found"});
}