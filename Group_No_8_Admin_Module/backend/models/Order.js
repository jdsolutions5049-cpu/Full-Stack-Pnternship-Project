const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
      required: true
    },

    crop: {
      type: String,
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    priceAtOrderTime: {
      type: Number,
      required: true
    },

    totalAmount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED"],
      default: "ACTIVE"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
