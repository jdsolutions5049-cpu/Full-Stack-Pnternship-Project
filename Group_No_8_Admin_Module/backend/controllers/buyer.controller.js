const Buyer = require("../models/Buyer");

exports.createBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.create(req.body);
    res.status(201).json(buyer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getBuyers = async (req, res) => {
  res.json(await Buyer.find());
};
