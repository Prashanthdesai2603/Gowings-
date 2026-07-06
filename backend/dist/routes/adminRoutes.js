"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Apply auth middlewares to all admin routes
router.use(auth_1.authenticate);
router.use(auth_1.authorizeAdmin);
router.get('/dashboard', adminController_1.getDashboardStats);
router.get('/customers', adminController_1.getCustomers);
router.get('/payments', adminController_1.getPayments);
router.patch('/payments/:id/status', adminController_1.updatePaymentStatus);
router.get('/settings', adminController_1.getSettings);
router.put('/settings', adminController_1.updateSettings);
exports.default = router;
