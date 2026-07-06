"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Public route to submit a contact form
router.post('/', contactController_1.submitContact);
// Admin route to get all contact requests
router.get('/', auth_1.authenticate, auth_1.authorizeAdmin, contactController_1.getContacts);
// User route to get their own contact requests
router.get('/my-requests', auth_1.authenticate, contactController_1.getMyContactRequests);
// Admin route to respond to a contact request
router.post('/:id/respond', auth_1.authenticate, auth_1.authorizeAdmin, contactController_1.respondToContactRequest);
exports.default = router;
