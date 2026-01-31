const Farmer = require("../models/Farmer");

exports.createFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.create(req.body);
    res.status(201).json(farmer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getFarmers = async (req, res) => {
  res.json(await Farmer.find());
};

