"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const client_1 = require("@prisma/client");
const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.name}: ${err.message}`);
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        // Handle Prisma errors
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'A unique constraint failed', details: err.meta });
        }
        return res.status(400).json({ error: 'Database request error', details: err.message });
    }
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        return res.status(400).json({ error: 'Database validation error', details: err.message });
    }
    if (err.name === 'ValidationError') {
        // Mongoose/Zod/Custom validation errors
        return res.status(400).json({ error: 'Validation Error', details: err.message });
    }
    if (err.name === 'UnauthorizedError') {
        // JWT/Auth errors
        return res.status(401).json({ error: 'Unauthorized', details: err.message });
    }
    // Unknown errors
    res.status(500).json({ error: 'Internal Server Error', details: process.env.NODE_ENV === 'production' ? undefined : err.message });
};
exports.errorHandler = errorHandler;
