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
exports.deleteTrip = exports.updateTrip = exports.createTrip = exports.getTripBySlug = exports.getTrips = void 0;
const db_1 = __importDefault(require("../config/db"));
// Get all trips
const getTrips = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = typeof req.query.category === 'string' ? req.query.category : undefined;
        const destination = typeof req.query.destination === 'string' ? req.query.destination : undefined;
        const featured = typeof req.query.featured === 'string' ? req.query.featured : undefined;
        const filter = {};
        if (category)
            filter.category = { name: category };
        if (destination)
            filter.destination = { name: destination };
        if (featured === 'true')
            filter.isFeatured = true;
        const trips = yield db_1.default.trip.findMany({
            where: filter,
            include: {
                category: true,
                destination: true,
            }
        });
        res.json(trips);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getTrips = getTrips;
// Get single trip by slug
const getTripBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.params.slug;
        const trip = yield db_1.default.trip.findUnique({
            where: { slug },
            include: {
                category: true,
                destination: true,
                reviews: {
                    where: { isApproved: true },
                    include: { user: { select: { name: true } } }
                }
            }
        });
        if (!trip)
            return res.status(404).json({ message: 'Trip not found' });
        res.json(trip);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getTripBySlug = getTripBySlug;
// Create a new trip (Admin only)
const createTrip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const trip = yield db_1.default.trip.create({ data });
        res.status(201).json(trip);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create trip', error });
    }
});
exports.createTrip = createTrip;
// Update an existing trip (Admin only)
const updateTrip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = req.body;
        const trip = yield db_1.default.trip.update({
            where: { id },
            data
        });
        res.json(trip);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update trip', error });
    }
});
exports.updateTrip = updateTrip;
// Delete a trip (Admin only)
const deleteTrip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield db_1.default.trip.delete({
            where: { id }
        });
        res.json({ message: 'Trip deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete trip', error });
    }
});
exports.deleteTrip = deleteTrip;
