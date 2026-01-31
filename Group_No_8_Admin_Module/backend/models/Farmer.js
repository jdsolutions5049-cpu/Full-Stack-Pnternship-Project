const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  phone: {
    type: String,
    required: true
  },

  address: {
    type: String
  },

  crops: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: "Farmer must have at least one crop"
    }
  },

  active: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});
alerts: [
  {
    alertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WeatherAlert"
    },
    acknowledgedAt: {
      type: Date,
      default: Date.now
    }
  }
]

module.exports = mongoose.model("Farmer", farmerSchema);
