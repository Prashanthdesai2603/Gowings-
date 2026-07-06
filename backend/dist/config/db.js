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
// Determine connection URL from variables or fallback to DATABASE_URL directly
let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl && process.env.DB_USER && process.env.DB_HOST && process.env.DB_NAME) {
    const port = process.env.DB_PORT || '3306';
    // Note: ensure process.env.DB_PASSWORD is URL encoded if it contains special characters
    const password = process.env.DB_PASSWORD ? encodeURIComponent(process.env.DB_PASSWORD) : '';
    databaseUrl = `mysql://${process.env.DB_USER}:${password}@${process.env.DB_HOST}:${port}/${process.env.DB_NAME}`;
}
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: databaseUrl,
        },
    },
});
const connectDatabase = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (retries = 5) {
    while (retries) {
        try {
            yield prisma.$connect();
            console.log('✅ Database connected successfully');
            return;
        }
        catch (error) {
            console.error(`❌ Database connection failed. Retries left: ${retries - 1}`, error);
            retries -= 1;
            if (retries === 0) {
                console.error('❌ Failed to connect to the database after multiple attempts. Exiting...');
                process.exit(1);
            }
            // Wait 5 seconds before retrying
            yield new Promise(res => setTimeout(res, 5000));
        }
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
