const express = require("express");
const router = express.Router();
const buyerController = require("../controllers/buyer.controller");

router.post("/", buyerController.createBuyer);
router.get("/", buyerController.getBuyers);

module.exports = router;
