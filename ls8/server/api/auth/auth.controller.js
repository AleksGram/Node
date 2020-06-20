const UsersModel = require("../models/users.model");
const { compareSync } = require("bcryptjs");

exports.authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.findOne({ email }).lean().exec();
    if (!user) {
      throw { status: 404, error: "user not exists" };
    }

    if (!compareSync(password, user.password)) {
      throw { status: 403, error: "user not exists" };
    }

    req.session.user = user;

    res.json({ _id: user._id, role: user.role, nik: user.nik, error: null });
  } catch (e) {
    next(e);
  }
};
