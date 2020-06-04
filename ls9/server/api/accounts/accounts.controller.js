const UserModel = require("../models/users.model");

exports.getAllAccounts = async (req, res, next) => {
    const dbData = await UserModel.find();

    res.send(dbData || {code:404, error: "Currently no accounts found"});
}

exports.changeUserRole = async (req, res, next) => {
    const { email, role } = req.body;

    const doc = await UserModel.findOneAndUpdate({email}, {role}, {
        returnOriginal: false
    });
    debugger

    if(!doc) return next({code: 404, error: "User not found" });

    res.send(doc);
}