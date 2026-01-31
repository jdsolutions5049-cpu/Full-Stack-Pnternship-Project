const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const weatherAlertController = require("../controllers/weatherAlert.controller");

/* TRIGGER ALERT */
router.post(
  "/trigger",
  authMiddleware,
  weatherAlertController.triggerAlert
);

/* ALERT HISTORY */
router.get(
  "/history",
  authMiddleware,
  weatherAlertController.getAlertHistory
);

module.exports = router;
