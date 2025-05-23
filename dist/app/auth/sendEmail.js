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
const emailSender = (email, html) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 25,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'omar.lu86@gmail.com',
            pass: 'rbpp yjra goui hcxe'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    // async..await is not allowed in global scope, must use a wrapper
    // send mail with defined transport object
    const info = yield transporter.sendMail({
        from: '"Heatlh care", <omar.lu86@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Reste passowr link", // Subject line
        //   text: "Hello world?", // plain text body
        html,
    });
    console.log(info, "emailInfo");
});
exports.default = emailSender;
