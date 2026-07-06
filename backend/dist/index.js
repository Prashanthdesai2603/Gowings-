"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const tripRoutes_1 = __importDefault(require("./routes/tripRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const destinationRoutes_1 = __importDefault(require("./routes/destinationRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const customTripRoutes_1 = __importDefault(require("./routes/customTripRoutes"));
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/trips', tripRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/destinations', destinationRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/contact', contactRoutes_1.default);
app.use('/api/custom-trips', customTripRoutes_1.default);
// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Gowings API is running' });
});
// Root API route
app.get(['/api', '/api/'], (req, res) => {
    res.json({ message: 'Welcome to Gowings API. Available routes: /api/auth, /api/trips, /api/bookings' });
});
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Gowings API.' });
});
// Global 404 handler
app.use((req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
