const { Router } = require("express");
const router = Router();
const { validate } = require("../middlewares");

const { registerUser } = require("./users.controller");
const { registerUserValidation } = require("./users.validations");

router.post("/register", validate(registerUserValidation), registerUser);

module.exports = router;
