const express = require("express");
const router = express.Router();

const pricingController = require("../controllers/pricing.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/crops",
  authMiddleware,
  pricingController.getCropsWithPrices
);


router.patch(
  "/crops/:crop",
  authMiddleware,
  pricingController.setCropPrice
);

module.exports = router;
