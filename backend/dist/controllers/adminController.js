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
exports.updateSettings = exports.getSettings = exports.updatePaymentStatus = exports.getPayments = exports.getCustomers = exports.getDashboardStats = void 0;
const db_1 = __importDefault(require("../config/db"));
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Total Bookings
        const totalBookings = yield db_1.default.booking.count();
        // Total Revenue (only from confirmed/completed? Let's just sum all for now, or just COMPLETED/CONFIRMED)
        // To be safe, we'll sum all totalAmount for bookings.
        const revenueAgg = yield db_1.default.booking.aggregate({
            _sum: { totalAmount: true },
            where: { status: { in: ['CONFIRMED', 'COMPLETED'] } }
        });
        const totalRevenue = revenueAgg._sum.totalAmount || 0;
        // Total Customers
        const totalCustomers = yield db_1.default.user.count({
            where: { role: 'CUSTOMER' }
        });
        // Pending Payments Count
        const pendingPaymentsCount = yield db_1.default.payment.count({
            where: { status: 'PENDING' }
        });
        // Recent Bookings (last 5)
        const recentBookings = yield db_1.default.booking.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                trip: { select: { title: true } }
            }
        });
        // Recent Pending Payments (last 5)
        const recentPayments = yield db_1.default.payment.findMany({
            where: { status: 'PENDING' },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                booking: { select: { id: true } }
            }
        });
        res.json({
            totalBookings,
            totalRevenue,
            totalCustomers,
            pendingPaymentsCount,
            recentBookings,
            recentPayments
        });
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getDashboardStats = getDashboardStats;
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield db_1.default.user.findMany({
            where: { role: 'CUSTOMER' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
                _count: {
                    select: { bookings: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(customers);
    }
    catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getCustomers = getCustomers;
const getPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield db_1.default.payment.findMany({
            include: {
                booking: {
                    include: {
                        user: { select: { name: true, email: true, phone: true } },
                        trip: { select: { title: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(payments);
    }
    catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getPayments = getPayments;
const updatePaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { status } = req.body;
        if (!['PENDING', 'VERIFIED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const payment = yield db_1.default.payment.update({
            where: { id },
            data: { status }
        });
        res.json(payment);
    }
    catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.updatePaymentStatus = updatePaymentStatus;
const getSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let settings = yield db_1.default.companyDetails.findFirst();
        if (!settings) {
            settings = yield db_1.default.companyDetails.create({
                data: {
                    name: "Gowings",
                    tagline: "Your Trusted Travel Partner for Memorable Journeys",
                    about: "Welcome to Gowings. We provide the best travel experiences.",
                    address: "123 Main Street",
                    city: "Metropolis",
                    state: "NY",
                    country: "USA",
                    postalCode: "10001",
                    phone1: "+1 234 567 8900",
                    email: "info@gowings.com"
                }
            });
        }
        res.json(settings);
    }
    catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getSettings = getSettings;
const updateSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        let settings = yield db_1.default.companyDetails.findFirst();
        if (settings) {
            settings = yield db_1.default.companyDetails.update({
                where: { id: settings.id },
                data
            });
        }
        else {
            settings = yield db_1.default.companyDetails.create({
                data
            });
        }
        res.json(settings);
    }
    catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.updateSettings = updateSettings;
