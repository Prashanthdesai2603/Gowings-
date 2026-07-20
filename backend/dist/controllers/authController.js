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
exports.updatePassword = exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
const jwt_1 = require("../utils/jwt");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phone } = req.body;
        const existingUser = yield db_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield db_1.default.user.create({
            data: { name, email, password: hashedPassword, phone }
        });
        const token = (0, jwt_1.generateToken)(user.id, user.role);
        res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield db_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = (0, jwt_1.generateToken)(user.id, user.role);
        res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.login = login;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield db_1.default.user.findUnique({
            where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId },
            select: { id: true, name: true, email: true, phone: true, role: true }
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getMe = getMe;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, phone } = req.body;
        const user = yield db_1.default.user.update({
            where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId },
            data: { name, phone },
            select: { id: true, name: true, email: true, phone: true, role: true }
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update profile', error });
    }
});
exports.updateProfile = updateProfile;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { currentPassword, newPassword } = req.body;
        const user = yield db_1.default.user.findUnique({ where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId } });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Incorrect current password' });
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        yield db_1.default.user.update({
            where: { id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId },
            data: { password: hashedPassword }
        });
        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update password', error });
    }
});
exports.updatePassword = updatePassword;
