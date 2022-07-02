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
const userService_1 = __importDefault(require("../service/userService"));
const express_validator_1 = require("express-validator");
const apiError_1 = __importDefault(require("../exception/apiError"));
class UserController {
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return next(apiError_1.default.BadRequest('Validation error !', errors.array()));
                }
                const { email, password } = req.body;
                const userData = yield userService_1.default.registration(email, password);
                res.cookie('refreshToken', userData.refreshToken, { maxAge: 10 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(userData);
            }
            catch (e) {
                next(e);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const userData = yield userService_1.default.login(email, password);
                res.cookie('refreshToken', userData.refreshToken, { maxAge: 10 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(userData);
            }
            catch (e) {
                next(e);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const token = yield userService_1.default.logout(refreshToken);
                res.clearCookie('refreshToken');
                return res.json(token);
            }
            catch (e) {
                next(e);
            }
        });
    }
    activate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activation_link = req.params.link;
                yield userService_1.default.activate(activation_link);
                res.redirect(process.env.CLIENT_URL);
            }
            catch (e) {
                next(e);
            }
        });
    }
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const userData = yield userService_1.default.refresh(refreshToken);
                res.cookie('refreshToken', userData.refreshToken, { maxAge: 10 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(userData);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userService_1.default.getUsers();
                res.json(users);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
;
exports.default = new UserController();
