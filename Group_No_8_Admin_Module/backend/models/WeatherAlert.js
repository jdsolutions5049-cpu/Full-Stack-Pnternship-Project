const mongoose = require("mongoose");

const weatherAlertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("WeatherAlert", weatherAlertSchema);
