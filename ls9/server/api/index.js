const { Router } = require("express");
// const { errors } = require("celebrate");
const router = Router();

router.use("/auth", require("./auth/index"));

router.use("/users", require("./users/index"));

router.use("/messages", require("./messages/index"));

router.use("/accounts", require("./accounts/index"));

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

router.get("/logout", (req, res) => {
  req.logOut();
  req.session.destroy();
  res.clearCookie("connect.sid");
  debugger
  res.send({code: 200, message: "Session destroyed"});
});


module.exports = router;
