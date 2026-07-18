"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnvVariables = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
const validateEnvVariables = () => {
    const requiredVariables = [
        'DATABASE_URL',
        'JWT_SECRET',
        'PORT',
    ];
    const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);
    if (missingVariables.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVariables.forEach((variable) => console.error(`  - ${variable}`));
        console.error('Please configure them in your .env file or deployment environment.');
        process.exit(1);
    }
    console.log('✅ Environment variables validated successfully.');
};
exports.validateEnvVariables = validateEnvVariables;
