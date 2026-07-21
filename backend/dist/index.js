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
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
const db_1 = require("./config/db");
const envValidator_1 = require("./utils/envValidator");
const errorHandler_1 = require("./middlewares/errorHandler");
// Validate environment variables on startup
(0, envValidator_1.validateEnvVariables)();
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
const trekRoutes_1 = __importDefault(require("./routes/trekRoutes"));
const galleryRoutes_1 = __importDefault(require("./routes/galleryRoutes"));
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://gowings-cfykm8h5w-gowings.vercel.app'
];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'Credentials'],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.options('/{*any}', (0, cors_1.default)(corsOptions)); // Handle preflight OPTIONS requests
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: false })); // allow cross-origin images
app.use((0, compression_1.default)());
// Trust the first proxy (e.g., Render, Nginx, Heroku). 
// This is required to accurately detect client IPs and prevent express-rate-limit warnings.
app.set('trust proxy', 1);
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, // limit each IP to 5000 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/trips', tripRoutes_1.default);
app.use('/api/packages', tripRoutes_1.default); // Alias for trips to match frontend/UI expectations
app.use('/api/gallery', galleryRoutes_1.default);
app.use('/api/treks', trekRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/destinations', destinationRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/contact', contactRoutes_1.default);
app.use('/api/custom-trips', customTripRoutes_1.default);
// Basic health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
// API health route for backward compatibility
app.get('/api/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect('/health');
}));
// Root API route
app.get(['/api', '/api/'], (req, res) => {
    res.json({
        status: 'running',
        routes: [
            '/api/packages',
            '/api/destinations',
            '/api/categories',
            '/api/gallery',
            '/api/contact'
        ]
    });
});
app.get('/', (req, res) => {
    res.json({ status: 'OK' });
});
// Global 404 handler
app.use((req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});
// Centralized error handler (must be registered last)
app.use(errorHandler_1.errorHandler);
// Start the server only after connecting to the DB
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    // 9. Improve startup validation. Print before connecting.
    console.log(`\n--- Server Startup ---`);
    console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV || 'Production'}`);
    console.log(`🚀 PORT: ${PORT}`);
    // 6. Startup order: connect database first
    yield (0, db_1.connectDatabase)();
    const server = app.listen(PORT, () => {
        // 8. Improve server startup logging
        console.log(`✅ Application started successfully`);
        console.log(`🟢 Node Version: ${process.version}`);
        console.log(`----------------------\n`);
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
startServer();
