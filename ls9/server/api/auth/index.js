const passport = require("passport");

const { Router } = require("express");
const router = Router();

const { validate, isAdmin } = require("../middlewares");

const { authUser } = require("./auth.controller");
const { authUserValidation } = require("./auth.validations");

router.post(
    "/login",
     validate(authUserValidation),
     passport.authenticate("local"),
      authUser);

router.get("/admin", isAdmin, (req, res) => {
    res.send("hello admin")
} )

module.exports = router;
