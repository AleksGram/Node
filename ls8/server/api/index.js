const { Router } = require("express");
// const { errors } = require("celebrate");
const router = Router();

router.use("/auth", require("./auth/index"));

router.use("/users", require("./users/index"));

router.use("/messages", require("./messages/index"));

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
