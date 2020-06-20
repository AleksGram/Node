const UsersModel = require("../models/users.model");

exports.registerUser = async (req, res, next) => {
  try {
    const { email, password, nik } = req.body;
    const user = new UsersModel({ email, password, nik });
    await user.save();

    req.session.user = user;

    res.send({ message: "create successfull", id: user._id, nik });
  } catch (e) {
    next(e);
  }
};
