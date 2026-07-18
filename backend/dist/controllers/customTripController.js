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
exports.getMyCustomTripRequests = exports.respondToCustomTrip = exports.getCustomTripRequests = exports.submitCustomTripRequest = void 0;
const db_1 = __importDefault(require("../config/db"));
const sendEmail_1 = require("../utils/sendEmail");
const submitCustomTripRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, destination, travelers, dates, budget, requirements } = req.body;
        // Validate required fields
        if (!name || !email || !phone || !destination) {
            return res.status(400).json({ error: 'Name, email, phone, and destination are required' });
        }
        const newRequest = yield db_1.default.customizedTripRequest.create({
            data: {
                name,
                email,
                phone,
                destination,
                travelers: travelers ? parseInt(travelers, 10) : 1,
                dates: dates || '',
                budget: budget ? budget.toString() : '',
                requirements: requirements || ''
            }
        });
        res.status(201).json({ message: 'Custom trip request submitted successfully', request: newRequest });
    }
    catch (error) {
        console.error('Submit custom trip request error:', error);
        res.status(500).json({ error: 'Failed to submit request' });
    }
});
exports.submitCustomTripRequest = submitCustomTripRequest;
const getCustomTripRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield db_1.default.customizedTripRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ requests });
    }
    catch (error) {
        console.error('Get custom trip requests error:', error);
        res.status(500).json({ error: 'Failed to get requests' });
    }
});
exports.getCustomTripRequests = getCustomTripRequests;
const respondToCustomTrip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { message } = req.body;
        // Validate
        if (!message) {
            return res.status(400).json({ error: 'Response message is required' });
        }
        // In a real application, you would integrate Nodemailer or SendGrid here
        // to actually email the user using the request.email address.
        console.log(`[SIMULATED EMAIL] Sending response for custom trip request ${id}:`, message);
        const updatedRequest = yield db_1.default.customizedTripRequest.update({
            where: { id },
            data: {
                status: 'PROPOSED',
                responseMessage: message
            }
        });
        // Send the email
        const emailSubject = `Update on your custom trip request to ${updatedRequest.destination}`;
        const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2>Hello ${updatedRequest.name},</h2>
        <p>We have an update regarding your custom trip request to <strong>${updatedRequest.destination}</strong>.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
          <p style="white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
        <p>You can also view this response and all your trip details by logging into your dashboard on our website.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Gowings Travel Team</strong></p>
      </div>
    `;
        // Attempt to send email, but don't fail the request if email fails (e.g. invalid credentials)
        try {
            yield (0, sendEmail_1.sendEmail)(updatedRequest.email, emailSubject, emailHtml);
            console.log(`Email sent successfully to ${updatedRequest.email}`);
        }
        catch (emailErr) {
            console.error('Failed to send email (credentials might not be set):', emailErr);
        }
        res.status(200).json({ message: 'Response sent successfully', request: updatedRequest });
    }
    catch (error) {
        console.error('Respond to custom trip error:', error);
        res.status(500).json({ error: 'Failed to send response' });
    }
});
exports.respondToCustomTrip = respondToCustomTrip;
const getMyCustomTripRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // req.user is set by the authenticate middleware
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: User ID not found' });
        }
        const user = yield db_1.default.user.findUnique({ where: { id: userId } });
        if (!user || !user.email) {
            return res.status(404).json({ error: 'User not found' });
        }
        const requests = yield db_1.default.customizedTripRequest.findMany({
            where: { email: user.email },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ requests });
    }
    catch (error) {
        console.error('Get my custom trip requests error:', error);
        res.status(500).json({ error: 'Failed to get your requests' });
    }
});
exports.getMyCustomTripRequests = getMyCustomTripRequests;
