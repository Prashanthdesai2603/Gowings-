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
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
// 7. Improve startup validation
const databaseUrl = process.env.DATABASE_URL || '';
// STEP 5: Print safely without password
let dbHost = 'Unknown';
let dbPort = 'Unknown';
let dbName = 'Unknown';
let dbProvider = 'MySQL'; // Assuming MySQL for now based on context
try {
    const url = new URL(databaseUrl);
    dbHost = url.hostname;
    dbPort = url.port || '3306';
    dbName = url.pathname.replace('/', '');
    // STEP 6: If hostname is localhost
    if ((dbHost === 'localhost' || dbHost === '127.0.0.1') && process.env.NODE_ENV === 'production') {
        throw new Error('Production cannot use localhost database.');
    }
}
catch (e) {
    if (e.message === 'Production cannot use localhost database.') {
        console.error(e.message);
        process.exit(1);
    }
    // Ignore purely URL parse errors but continue execution
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
        yield prisma.$connect();
        console.log(`✅ Prisma connected successfully`);
        console.log(`🔌 Database Provider: ${dbProvider}`);
        console.log(`🌐 Database Host: ${dbHost}`);
        console.log(`🚪 Database Port: ${dbPort}`);
        console.log(`📂 Database Name: ${dbName}`);
    }
    catch (error) {
        console.error(`❌ Database connection failed.`);
        console.error(`Reason: ${error.message || error}`);
        console.error('Continuing without database connection...');
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
