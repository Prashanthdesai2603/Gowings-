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
        'PORT',
        'NODE_ENV',
        'JWT_SECRET',
        'FRONTEND_URL',
        'EMAIL_USER',
        'EMAIL_PASS',
    ];
    let hasError = false;
    requiredVariables.forEach((variable) => {
        if (!process.env[variable]) {
            console.error(`${variable} environment variable is not configured.`);
            hasError = true;
        }
    });
    if (hasError) {
        process.exit(1);
    }
    console.log('✅ Environment variables validated successfully.');
};
exports.validateEnvVariables = validateEnvVariables;
