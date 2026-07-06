"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controllers/bookingController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Customer routes
router.post('/', auth_1.authenticate, bookingController_1.createBooking);
router.get('/my-bookings', auth_1.authenticate, bookingController_1.getMyBookings);
// Admin routes
router.get('/', auth_1.authenticate, auth_1.authorizeAdmin, bookingController_1.getAllBookings);
router.patch('/:id/status', auth_1.authenticate, auth_1.authorizeAdmin, bookingController_1.updateBookingStatus);
exports.default = router;
