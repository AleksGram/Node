const { Router } = require("express");
const router = Router();
const { isAdmin } = require("../middlewares");
const { getAllAccounts, changeUserRole, blockAccount } = require("./accounts.controller");

router.get("/all", isAdmin, getAllAccounts);
router.put("/update", isAdmin, changeUserRole);
router.put("/block-account", isAdmin, blockAccount);

module.exports = router;
