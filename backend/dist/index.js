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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const db_1 = require("./config/db");
const db_2 = __importDefault(require("./config/db"));
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
app.get('/api/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Perform a lightweight query to verify the database connection
        yield db_2.default.$queryRaw `SELECT 1`;
        res.json({
            success: true,
            database: 'connected',
            server: 'running'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            database: 'disconnected',
            server: 'running',
            error: error.message
        });
    }
}));
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
(0, db_1.connectDatabase)().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    // Graceful shutdown
    const gracefulShutdown = () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Received shutdown signal, closing server and database...');
        server.close(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, db_1.disconnectDatabase)();
            process.exit(0);
        }));
    });
    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
});
