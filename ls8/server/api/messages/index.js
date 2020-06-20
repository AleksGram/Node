const express = require("express");
const router = express.Router();
const ctrl = require("./messages.controller");
const {
  params_get_by_id,
  body_update_message_validation
} = require("./messages.validations");

router.get("/messages", ctrl.get_messages_handler);
router.get("/messages/:id", params_get_by_id, ctrl.get_message_by_id);
router.post("/messages", ctrl.add_new_message);
router.put(
  "/messages/:id",
  params_get_by_id,
  body_update_message_validation,
  ctrl.update_message_by_id
);
router.delete("/messages/:id", params_get_by_id, ctrl.delete_message_by_id);

module.exports = router;
