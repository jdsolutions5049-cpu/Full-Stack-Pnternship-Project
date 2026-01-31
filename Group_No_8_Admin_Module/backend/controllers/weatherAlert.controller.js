const WeatherAlert = require("../models/WeatherAlert");

/* TRIGGER ALERT */
exports.triggerAlert = async (req, res) => {
  try {
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Alert type is required" });
    }

    const alert = await WeatherAlert.create({
      type,
      message: `${type} alert sent to farmers`,
      triggeredBy: req.adminId
    });

    res.status(201).json(alert);
  } catch (err) {
    console.error("Trigger alert error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* GET ALERT HISTORY */
exports.getAlertHistory = async (req, res) => {
  try {
    const alerts = await WeatherAlert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    console.error("Fetch alert history error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
