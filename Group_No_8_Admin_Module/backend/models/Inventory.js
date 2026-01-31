const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
