"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatus = exports.getAllBookings = exports.getMyBookings = exports.createBooking = void 0;
const db_1 = __importDefault(require("../config/db"));
// Create a new booking
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tripId, travelerDetails, totalAmount, paymentMethod, paymentScreenshot } = req.body;
        const userId = req.user.userId;
        const bookingData = {
            userId,
            tripId,
            travelerDetails,
            totalAmount,
            status: 'PENDING',
        };
        if (paymentScreenshot) {
            bookingData.payment = {
                create: {
                    method: paymentMethod || "UPI",
                    amount: totalAmount,
                    screenshotUrl: paymentScreenshot,
                    status: 'PENDING'
                }
            };
        }
        const booking = yield db_1.default.booking.create({
            data: bookingData,
            include: { payment: true }
        });
        res.status(201).json(booking);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create booking', error });
    }
});
exports.createBooking = createBooking;
// Get my bookings (Customer)
const getMyBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const bookings = yield db_1.default.booking.findMany({
            where: { userId },
            include: { trip: true, payment: true }
        });
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getMyBookings = getMyBookings;
// Get all bookings (Admin)
const getAllBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield db_1.default.booking.findMany({
            include: { user: true, trip: true, payment: true }
        });
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getAllBookings = getAllBookings;
// Update booking status (Admin)
const updateBookingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const booking = yield db_1.default.booking.update({
            where: { id },
            data: { status }
        });
        res.json(booking);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update status', error });
    }
});
exports.updateBookingStatus = updateBookingStatus;
