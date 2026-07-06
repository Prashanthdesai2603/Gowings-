"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customTripController_1 = require("../controllers/customTripController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Public route to submit a custom trip request
router.post('/', customTripController_1.submitCustomTripRequest);
// Admin route to get all custom trip requests
router.get('/', auth_1.authenticate, auth_1.authorizeAdmin, customTripController_1.getCustomTripRequests);
// User route to get their own custom trip requests
router.get('/my-requests', auth_1.authenticate, customTripController_1.getMyCustomTripRequests);
// Admin route to respond to a custom trip request
router.post('/:id/respond', auth_1.authenticate, auth_1.authorizeAdmin, customTripController_1.respondToCustomTrip);
exports.default = router;
