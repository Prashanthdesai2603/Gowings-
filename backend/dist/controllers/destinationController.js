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
exports.deleteDestination = exports.updateDestination = exports.createDestination = exports.getDestinations = void 0;
const db_1 = __importDefault(require("../config/db"));
const getDestinations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const destinations = yield db_1.default.destination.findMany({
            include: {
                _count: {
                    select: { trips: true }
                }
            }
        });
        res.json(destinations);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getDestinations = getDestinations;
const createDestination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const dest = yield db_1.default.destination.create({ data });
        res.status(201).json(dest);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create destination', error });
    }
});
exports.createDestination = createDestination;
const updateDestination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = req.body;
        const dest = yield db_1.default.destination.update({
            where: { id },
            data
        });
        res.json(dest);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update destination', error });
    }
});
exports.updateDestination = updateDestination;
const deleteDestination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield db_1.default.destination.delete({
            where: { id }
        });
        res.json({ message: 'Destination deleted successfully' });
    }
    catch (error) {
        if (error.code === 'P2003') {
            return res.status(400).json({ message: 'Cannot delete destination because it has attached trips. Delete the trips first.' });
        }
        res.status(500).json({ message: 'Failed to delete destination', error });
    }
});
exports.deleteDestination = deleteDestination;
