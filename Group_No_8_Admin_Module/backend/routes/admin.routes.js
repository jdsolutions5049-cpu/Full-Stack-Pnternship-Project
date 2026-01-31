const express = require('express');
const router = express.Router();

const admin = require('../controllers/admin.controller');
const auth = require('../middleware/authMiddleware');


router.post('/users', admin.createAdmin);
router.post('/login', admin.loginAdmin);

router.use(auth);

router.get('/dashboard/stats', admin.dashboardStats);

router.get('/farmers', admin.getFarmers);
router.post('/farmers', admin.createFarmer);
router.get('/farmers/:id', admin.getFarmerById);
router.get('/farmers/:id/history', admin.getFarmerHistory);
router.get('/sell-requests', admin.getSellRequests);
router.post('/sell-requests', admin.createSellRequest);
router.patch('/sell-requests/:id/status', admin.updateSellRequestStatus);

router.get('/buyers', admin.getBuyers);
router.post('/buyers', admin.createBuyer);
router.get('/buyers/:id/orders', admin.getBuyerOrders);
router.get('/orders', admin.getOrders);

router.get('/inventory', admin.getInventory);
router.post('/inventory', admin.createInventory);
router.patch('/inventory/:id', admin.updateInventory);

router.get('/prices', admin.getPrices);
router.patch('/prices/:crop', admin.updatePrice);

router.get('/predictions', admin.getPredictions);

router.get('/weather-alerts', admin.getWeatherAlerts);
router.post('/weather-alerts', admin.createWeatherAlert);
router.post('/system-alerts', admin.createSystemAlert);

router.get('/reports/prices', admin.priceReport);
router.get('/reports/orders', admin.orderReport);
router.get('/reports/location', admin.locationReport);

router.patch('/farmers/:id/status', admin.updateFarmerStatus);
router.patch('/buyers/:id/status', admin.updateBuyerStatus);

router.get('/audit-logs', admin.getAuditLogs);

module.exports = router;
