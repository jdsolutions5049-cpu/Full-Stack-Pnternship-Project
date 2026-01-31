const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventory.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/",
  authMiddleware,
  inventoryController.getAllInventory
);

module.exports = router;
