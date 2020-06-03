const { Router } = require("express");
const router = Router();
const { isAdmin } = require("../middlewares");
const { getAllAccounts } = require("./accounts.controller");

router.get("/all", isAdmin, getAllAccounts);

module.exports = router;
