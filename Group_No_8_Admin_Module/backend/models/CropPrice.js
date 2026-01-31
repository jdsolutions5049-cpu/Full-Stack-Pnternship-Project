const mongoose = require("mongoose");

const cropPriceSchema = new mongoose.Schema(
  {
    crop: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CropPrice", cropPriceSchema);
