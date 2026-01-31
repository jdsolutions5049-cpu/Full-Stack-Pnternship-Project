const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const SellRequest = require('../models/SellRequest');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const CropPrice = require('../models/CropPrice');
const PricePrediction = require('../models/PricePrediction');
const WeatherAlert = require('../models/WeatherAlert');
const SystemAlert = require('../models/SystemAlert');
const AuditLog = require('../models/AuditLog');
const Admin = require('../models/Admin');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.dashboardStats = async (req, res) => {
  try {
    res.json({
      totalFarmers: await Farmer.countDocuments(),
      totalBuyers: await Buyer.countDocuments(),
      activeSellRequests: await SellRequest.countDocuments({ status: 'ACTIVE' }),
      activeOrders: await Order.countDocuments({ status: 'ACTIVE' })
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFarmers = async (req, res) => {
  res.json(await Farmer.find());
};

exports.createFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.create(req.body);
    res.status(201).json(farmer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFarmerById = async (req, res) => {
  res.json(await Farmer.findById(req.params.id));
};

exports.getFarmerHistory = async (req, res) => {
  res.json(await SellRequest.find({ farmerId: req.params.id }));
};

exports.updateFarmerStatus = async (req, res) => {
  res.json(
    await Farmer.findByIdAndUpdate(
      req.params.id,
      { active: req.body.active },
      { new: true }
    )
  );
};

exports.getSellRequests = async (req, res) => {
  res.json(await SellRequest.find());
};

exports.createSellRequest = async (req, res) => {
  try {
    const request = await SellRequest.create(req.body);
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSellRequestStatus = async (req, res) => {
  res.json(
    await SellRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
  );
};

exports.getBuyers = async (req, res) => {
  res.json(await Buyer.find());
};

exports.createBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.create(req.body);
    res.status(201).json(buyer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBuyerStatus = async (req, res) => {
  res.json(
    await Buyer.findByIdAndUpdate(
      req.params.id,
      { active: req.body.active },
      { new: true }
    )
  );
};

exports.getOrders = async (req, res) => {
  try {
    res.json(await Order.find());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBuyerOrders = async (req, res) => {
  res.json(await Order.find({ buyerId: req.params.id }));
};

exports.getInventory = async (req, res) => {
  res.json(await Inventory.find());
};

exports.createInventory = async (req, res) => {
  res.json(await Inventory.create(req.body));
};

exports.updateInventory = async (req, res) => {
  res.json(
    await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
};

exports.getPrices = async (req, res) => {
  res.json(await CropPrice.find());
};

exports.updatePrice = async (req, res) => {
  res.json(
    await CropPrice.findOneAndUpdate(
      { crop: req.params.crop },
      req.body,
      { upsert: true, new: true }
    )
  );
};

exports.getPredictions = async (req, res) => {
  res.json(await PricePrediction.find());
};

exports.getWeatherAlerts = async (req, res) => {
  res.json(await WeatherAlert.find());
};

exports.createWeatherAlert = async (req, res) => {
  res.json(await WeatherAlert.create(req.body));
};

exports.createSystemAlert = async (req, res) => {
  res.json(await SystemAlert.create(req.body));
};


exports.priceReport = async (req, res) => {
  res.json(await CropPrice.find());
};

exports.orderReport = async (req, res) => {
  res.json(await Order.find());
};

exports.locationReport = async (req, res) => {
  res.json(await Farmer.find({}, 'location'));
};


exports.createAdmin = async (req, res) => {
  try {
    const adminExists = await Admin.countDocuments();
    if (adminExists > 0) {
      return res.status(403).json({ message: "Admin already exists" });
    }

    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({ email, password: hashedPassword });

    res.status(201).json({ message: "Admin created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= AUDIT LOGS ================= */

exports.getAuditLogs = async (req, res) => {
  res.json(await AuditLog.find());
};
