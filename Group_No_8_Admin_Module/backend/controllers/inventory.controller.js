const Inventory = require("../models/Inventory");

exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate("farmerId", "name");

    const formatted = inventory.map(item => ({
      productName: item.productName,
      category: item.category,
      quantity: item.quantity,
      farmerName: item.farmerId?.name,
      availabilityStatus: item.quantity > 0 ? "Available" : "Out of Stock"
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Inventory fetch error:", err);
    res.status(500).json({ message: "Failed to load inventory" });
  }
};
