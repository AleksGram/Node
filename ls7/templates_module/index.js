const express = require("express");
const router = express.Router();
const ctrl = require("./templates_ctrl");


router.get("/nunjucks", ctrl.get_nunjucks_tmpl);
router.get("/ejs", ctrl.get_ejs_tmpl);
router.get("/pug", ctrl.get_pug_tmpl);
// router.put(
//   "/messages/:id",
//   params_get_by_id,
//   body_update_message_validation,
//   ctrl.update_message_by_id
// );
// router.delete("/messages/:id", params_get_by_id, ctrl.delete_message_by_id);

module.exports = router;
