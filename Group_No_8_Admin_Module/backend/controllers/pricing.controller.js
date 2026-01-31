const Farmer = require("../models/Farmer");
const CropPrice = require("../models/CropPrice");

exports.getCropsWithPrices = async (req, res) => {
  try {
    const farmers = await Farmer.find({}, "crops");

    const crops = [
      ...new Set(
        farmers.flatMap(f =>
          f.crops.map(c => c.toLowerCase().trim())
        )
      )
    ];

    const prices = await CropPrice.find();

    const priceMap = {};
    prices.forEach(p => {
      priceMap[p.crop] = p.price;
    });

    const result = crops.map(crop => ({
      crop,
      price: priceMap[crop] ?? 0
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("GET PRICING ERROR:", err);
    res.status(500).json({ message: "Failed to load pricing data" });
  }
};

exports.setCropPrice = async (req, res) => {
  try {
    const crop = req.params.crop.toLowerCase().trim();
    const price = Number(req.body.price);

    if (!crop || isNaN(price)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const updated = await CropPrice.findOneAndUpdate(
      { crop },
      { price },
      { upsert: true, new: true }
    );
    

    res.status(200).json(updated);
  } catch (err) {
    console.error("UPDATE PRICE ERROR:", err);
    res.status(500).json({ message: "Failed to update price" });
  }
};
