const UserModel = require("../models/users.model");

exports.getAllAccounts = async (req, res, next) => {
    const dbData = await UserModel.find({});

    res.send(dbData);
}