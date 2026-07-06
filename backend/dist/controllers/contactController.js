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
exports.getMyContactRequests = exports.respondToContactRequest = exports.getContacts = exports.submitContact = void 0;
const db_1 = __importDefault(require("../config/db"));
const submitContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, message } = req.body;
        // Using message field to store "Subject: [subject]\nMessage: [message]" 
        // since schema only has name, email, phone, message
        const contact = yield db_1.default.contactRequest.create({
            data: {
                name,
                email,
                phone,
                message
            }
        });
        res.status(201).json({ success: true, contact });
    }
    catch (error) {
        console.error("Failed to submit contact request:", error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});
exports.submitContact = submitContact;
const getContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield db_1.default.contactRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, contacts });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});
exports.getContacts = getContacts;
const respondToContactRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ success: false, error: 'Response message is required' });
        }
        const updatedRequest = yield db_1.default.contactRequest.update({
            where: { id },
            data: {
                status: 'RESPONDED',
                responseMessage: message
            }
        });
        // Send the email
        const emailSubject = `Response to your inquiry at Gowings Travel`;
        const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2>Hello ${updatedRequest.name},</h2>
        <p>Thank you for reaching out to us. We have an update regarding your inquiry:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
          <p style="white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
        <p>You can also view this response by logging into your dashboard on our website.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Gowings Travel Team</strong></p>
      </div>
    `;
        try {
            const { sendEmail } = yield import('../utils/sendEmail.js');
            yield sendEmail(updatedRequest.email, emailSubject, emailHtml);
            console.log(`Email sent successfully to ${updatedRequest.email}`);
        }
        catch (emailErr) {
            console.error('Failed to send email (credentials might not be set):', emailErr);
        }
        res.status(200).json({ success: true, message: 'Response sent successfully', request: updatedRequest });
    }
    catch (error) {
        console.error('Respond to inquiry error:', error);
        res.status(500).json({ success: false, error: 'Failed to send response' });
    }
});
exports.respondToContactRequest = respondToContactRequest;
const getMyContactRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized: User ID not found' });
        }
        const user = yield db_1.default.user.findUnique({ where: { id: userId } });
        if (!user || !user.email) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        const requests = yield db_1.default.contactRequest.findMany({
            where: { email: user.email },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, requests });
    }
    catch (error) {
        console.error('Get my inquiries error:', error);
        res.status(500).json({ success: false, error: 'Failed to get your inquiries' });
    }
});
exports.getMyContactRequests = getMyContactRequests;
