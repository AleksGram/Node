const { Router } = require("express");
const router = Router();
const { isAdmin } = require("../middlewares");
const { getAllAccounts, changeUserRole } = require("./accounts.controller");

router.get("/all", isAdmin, getAllAccounts);
router.put("/update", isAdmin, changeUserRole);

module.exports = router;
