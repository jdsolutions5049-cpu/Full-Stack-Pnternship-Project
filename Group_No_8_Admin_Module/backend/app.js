const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const adminRoutes = require("./routes/admin.routes");
const farmerRoutes = require("./routes/farmer.routes");
const buyerRoutes = require("./routes/buyer.routes");
const pricingRoutes = require("./routes/pricing.routes");
const weatherAlertRoutes = require("./routes/weatherAlert.routes");


const inventoryRoutes = require("./routes/inventory.routes");
const app = express();
app.use("/admin/inventory", inventoryRoutes);

/* ===== GLOBAL MIDDLEWARE (ORDER MATTERS) ===== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===== ROUTES ===== */
app.use("/admin", adminRoutes);
app.use("/admin/pricing", pricingRoutes);
app.use("/farmers", farmerRoutes);
app.use("/buyers", buyerRoutes);
app.use("/api/weather-alerts", weatherAlertRoutes);

/* ===== DB ===== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

module.exports = app;
