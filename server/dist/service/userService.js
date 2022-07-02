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
const db_1 = __importDefault(require("../database/db"));
const uuid_1 = __importDefault(require("uuid"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mailService_1 = __importDefault(require("./mailService"));
const tokenService_1 = __importDefault(require("./tokenService"));
const apiError_1 = __importDefault(require("../exception/apiError"));
const UserDto_1 = __importDefault(require("../dtos/UserDto"));
const db = db_1.default.pool;
class UserService {
    registration(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = (yield db.query('select * from usr where email = $1', [email])).rows[0];
            if (user) {
                throw apiError_1.default.BadRequest(`User with email ${email} already exists!`);
            }
            password = yield bcrypt_1.default.hash(password, 3);
            const activation_link = uuid_1.default.v4();
            user = (yield db.query('insert into usr(email, password, activation_link) values($1,$2,$3) returning *', [email, password, activation_link])).rows[0];
            const userDto = new UserDto_1.default(user);
            yield mailService_1.default.sendActivationLink(email, `${process.env.API_URL}/api/activate/${activation_link}`);
            const tokens = tokenService_1.default.generateTokens(Object.assign({}, userDto));
            yield tokenService_1.default.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    activate(activation_link) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield db.query('select * from usr where activation_link=$1', [activation_link])).rows[0];
            if (!user) {
                throw apiError_1.default.BadRequest('Incorrect activation link!');
            }
            yield db.query('update usr set isactivated = true where user_id=$1', [user.user_id]);
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield db.query('select * from usr where email = $1', [email])).rows[0];
            if (!user) {
                throw apiError_1.default.BadRequest(`User with email ${email} is not found!`);
            }
            const isPassEquals = yield bcrypt_1.default.compare(password, user.password);
            if (!isPassEquals) {
                throw apiError_1.default.BadRequest(`Incorrect password`);
            }
            const userDto = new UserDto_1.default(user);
            const tokens = tokenService_1.default.generateTokens(Object.assign({}, userDto));
            yield tokenService_1.default.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = tokenService_1.default.removeToken(refreshToken);
            return token;
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw apiError_1.default.UnauthorizedError();
            }
            const userData = tokenService_1.default.validateRefreshToken(refreshToken);
            const tokenFromDb = yield tokenService_1.default.findToken(refreshToken);
            // console.log(userData,tokenFromDb);
            if (!userData || !tokenFromDb) {
                throw apiError_1.default.UnauthorizedError();
            }
            const user = (yield db.query('select * from usr where user_id = $1', [userData.id])).rows[0];
            const userDto = new UserDto_1.default(user);
            const tokens = tokenService_1.default.generateTokens(Object.assign({}, userDto));
            yield tokenService_1.default.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = (yield db.query('select * from usr')).rows;
            return users;
        });
    }
}
exports.default = new UserService();
