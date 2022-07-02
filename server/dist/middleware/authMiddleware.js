"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiError_1 = __importDefault(require("../exception/apiError"));
const tokenService_1 = __importDefault(require("../service/tokenService"));
function default_1(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(apiError_1.default.UnauthorizedError());
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(apiError_1.default.UnauthorizedError());
        }
        const userData = tokenService_1.default.validateAccessToken(accessToken);
        if (!userData) {
            return next(apiError_1.default.UnauthorizedError());
        }
        req.user = userData;
        next();
    }
    catch (e) {
        return next(apiError_1.default.UnauthorizedError());
    }
}
exports.default = default_1;
