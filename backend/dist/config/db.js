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
exports.disconnectDatabase = exports.connectDatabase = void 0;
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 7. Improve startup validation
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    console.error('❌ DATABASE_URL is missing. Please configure it in your environment variables.');
    process.exit(1); // Exit gracefully, never default to localhost
}
// Optional: Extract db host for logging without exposing passwords
let dbHost = 'Unknown';
try {
    const url = new URL(databaseUrl);
    dbHost = url.hostname;
}
catch (e) {
    // Ignore URL parse error
}
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: databaseUrl,
        },
    },
    // error and warn logs, but avoid exposing sensitive connection string info in stack traces
});
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 6. Startup order: Generate Prisma Client -> Connect using DATABASE_URL -> Run migration or db push -> Start Express server
        // We will do validation here first
        yield prisma.$connect();
        // 8. Improve server startup logging
        console.log(`✅ Prisma connected successfully`);
        console.log(`🔌 Database Provider: MySQL`);
        console.log(`🌐 Database Host: ${dbHost}`);
    }
    catch (error) {
        // 12. Improve production error handling
        console.error(`❌ Database connection failed.`);
        console.error(`Reason: ${error.message || error}`);
        console.error('Exiting gracefully.');
        process.exit(1); // Do not crash with unhandled stack traces
    }
});
exports.connectDatabase = connectDatabase;
const disconnectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$disconnect();
        console.log('🛑 Database disconnected gracefully');
    }
    catch (error) {
        console.error('Error during database disconnection', error);
    }
});
exports.disconnectDatabase = disconnectDatabase;
exports.default = prisma;
