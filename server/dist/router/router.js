"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controller/userController"));
const express_validator_1 = require("express-validator");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = new express_1.Router();
router.post('/registration', (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password').isLength({ min: 2, max: 32 }), userController_1.default.registration);
router.post('/login', userController_1.default.login);
router.post('/logout', userController_1.default.logout);
router.get('/activate/:link', userController_1.default.activate);
router.get('/refresh', userController_1.default.refresh);
router.get('/users', authMiddleware_1.default, userController_1.default.getUsers);
exports.default = router;
