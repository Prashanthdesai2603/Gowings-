"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const galleryController_1 = require("../controllers/galleryController");
const router = (0, express_1.Router)();
router.get('/', galleryController_1.getGallery);
exports.default = router;
