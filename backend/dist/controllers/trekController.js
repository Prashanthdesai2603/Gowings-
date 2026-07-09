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
exports.deleteTrek = exports.updateTrek = exports.createTrek = exports.getTrekBySlug = exports.getTreks = void 0;
const db_1 = __importDefault(require("../config/db"));
const getTrekkingCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    let cat = yield db_1.default.category.findUnique({ where: { slug: 'trekking' } });
    if (!cat) {
        cat = yield db_1.default.category.create({
            data: { name: 'Trekking', slug: 'trekking', description: 'Trekking Packages' }
        });
    }
    return cat;
});
// Get all treks
const getTreks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield getTrekkingCategory();
        const destination = typeof req.query.destination === 'string' ? req.query.destination : undefined;
        const featured = typeof req.query.featured === 'string' ? req.query.featured : undefined;
        const search = typeof req.query.search === 'string' ? req.query.search : undefined;
        const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 20;
        const filter = { categoryId: category.id };
        if (destination)
            filter.destination = { name: destination };
        if (featured === 'true')
            filter.isFeatured = true;
        if (search) {
            filter.OR = [
                { title: { contains: search } },
                { overview: { contains: search } }
            ];
        }
        const skip = (page - 1) * limit;
        const treks = yield db_1.default.trip.findMany({
            where: filter,
            include: {
                category: true,
                destination: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        });
        const total = yield db_1.default.trip.count({ where: filter });
        res.json({
            data: treks,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getTreks = getTreks;
// Get single trek by slug
const getTrekBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield getTrekkingCategory();
        const slug = req.params.slug;
        const trek = yield db_1.default.trip.findFirst({
            where: { slug, categoryId: category.id },
            include: {
                category: true,
                destination: true,
                reviews: {
                    where: { isApproved: true },
                    include: { user: { select: { name: true } } }
                }
            }
        });
        if (!trek)
            return res.status(404).json({ message: 'Trek not found' });
        res.json(trek);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getTrekBySlug = getTrekBySlug;
// Create a new trek (Admin only)
const createTrek = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield getTrekkingCategory();
        const data = Object.assign(Object.assign({}, req.body), { categoryId: category.id });
        const trek = yield db_1.default.trip.create({ data });
        res.status(201).json(trek);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create trek', error });
    }
});
exports.createTrek = createTrek;
// Update an existing trek (Admin only)
const updateTrek = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield getTrekkingCategory();
        const id = req.params.id;
        // Ensure it's a trek
        const existing = yield db_1.default.trip.findUnique({ where: { id } });
        if (!existing || existing.categoryId !== category.id) {
            return res.status(404).json({ message: 'Trek not found' });
        }
        const data = req.body;
        const trek = yield db_1.default.trip.update({
            where: { id },
            data
        });
        res.json(trek);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update trek', error });
    }
});
exports.updateTrek = updateTrek;
// Delete a trek (Admin only)
const deleteTrek = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield getTrekkingCategory();
        const id = req.params.id;
        // Ensure it's a trek
        const existing = yield db_1.default.trip.findUnique({ where: { id } });
        if (!existing || existing.categoryId !== category.id) {
            return res.status(404).json({ message: 'Trek not found' });
        }
        yield db_1.default.trip.delete({
            where: { id }
        });
        res.json({ message: 'Trek deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete trek', error });
    }
});
exports.deleteTrek = deleteTrek;
