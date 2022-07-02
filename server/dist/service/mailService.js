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
const nodemailer_1 = __importDefault(require("nodemailer"));
const { SMTP_HOST, SMTP_PORT, SMTP_USER, API_URL, SMTP_REFRESH_TOKEN, SMTP_CLIENT_ID, SMTP_CLIENT_SECRET } = process.env;
const googleapis_1 = require("googleapis");
const OAuth2 = googleapis_1.google.auth.OAuth2;
class MailService {
    createTransporter() {
        return __awaiter(this, void 0, void 0, function* () {
            const oauth2Client = new OAuth2(SMTP_CLIENT_ID, SMTP_CLIENT_SECRET, "https://developers.google.com/oauthplayground");
            oauth2Client.setCredentials({
                refresh_token: SMTP_REFRESH_TOKEN
            });
            const accessToken = yield new Promise((resolve, reject) => {
                oauth2Client.getAccessToken((err, token) => {
                    if (err) {
                        reject();
                    }
                    resolve(token);
                });
            });
            const transporter = nodemailer_1.default.createTransport({
                host: SMTP_HOST,
                port: SMTP_PORT,
                secure: true,
                auth: {
                    type: "OAuth2",
                    user: SMTP_USER,
                    accessToken,
                    clientId: SMTP_CLIENT_ID,
                    clientSecret: SMTP_CLIENT_SECRET,
                    refreshToken: SMTP_REFRESH_TOKEN
                }
            });
            return transporter;
        });
    }
    sendActivationLink(to, activation_link) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = yield this.createTransporter();
            yield transporter.sendMail({
                from: SMTP_USER,
                to,
                subject: `Активация аккаунта на ${API_URL}`,
                text: '',
                html: `
                    <div>
                        <h1>Для активации аккаунта перейдите по ссылке</h1>
                        <a href="${activation_link}">${activation_link}</a>
                    </div>
                `
            });
        });
    }
}
exports.default = new MailService();
