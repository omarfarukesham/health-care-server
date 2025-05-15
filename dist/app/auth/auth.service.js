"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AuthService = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const bycript = __importStar(require("bcrypt"));
const jwtHelper_1 = require("../../helpers/jwtHelper");
const client_1 = require("@prisma/client");
const sendEmail_1 = __importDefault(require("./sendEmail"));
const ApiError_1 = __importDefault(require("../apiError/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: email,
            status: client_1.UserStatus.ACTIVE
        },
    });
    const isCorrectPassword = yield bycript.compare(password, userData.password);
    if (!isCorrectPassword) {
        throw new Error('Incorrect password');
    }
    const accessToken = jwtHelper_1.jwtHelper.generateToken({
        email: userData.email,
        role: userData.role,
    }, process.env.JWT_SECRET, '1h');
    const refreshToken = jwtHelper_1.jwtHelper.generateToken({
        email: userData.email,
        role: userData.role,
    }, process.env.REFRESH_TOKEN_SECRET, '30d');
    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelper_1.jwtHelper.verfiyToken(token);
    }
    catch (error) {
        throw new Error('You are not authorized');
    }
    const isUserExist = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData === null || decodedData === void 0 ? void 0 : decodedData.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    return isUserExist;
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE
        },
    });
    const isCorrectPassword = yield bycript.compare(payload.oldPassword, existingUser.password);
    console.log(isCorrectPassword, "passwordChecking");
    if (!isCorrectPassword) {
        throw new Error('Incorrect password');
    }
    const hashedPassword = yield bycript.hash(payload.newPassword, 10);
    yield prisma_1.default.user.update({
        where: {
            email: user.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    });
    return {
        message: 'Password changed successfully'
    };
});
const forgetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE
        },
    });
    const token = jwtHelper_1.jwtHelper.generateToken({
        email: userData.email,
        role: userData.role,
    }, process.env.JWT_SECRET, '5m');
    const resetLink = `https://localhost:5000/auth/v1/reset-passowrd?userId=${userData.id}&token=${token}`;
    yield (0, sendEmail_1.default)(userData.email, `
      <div style="text-align: center; padding: 20px;">
            <h1>Reset Password</h1>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none;">Reset Password</a>
        </div>
        `);
    return resetLink;
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: client_1.UserStatus.ACTIVE
        }
    });
    if (!userData) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const isValidToken = jwtHelper_1.jwtHelper.verfiyToken(token);
    console.log(isValidToken, "isValidToken ...............");
    if (!isValidToken) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Forbidden!");
    }
    // hash password
    const password = yield bycript.hash(payload.password, 10);
    console.log(password, "hashedPassword");
    // update into database
    yield prisma_1.default.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    });
    return {
        message: 'Password changed successfully'
    };
});
exports.AuthService = {
    loginUser,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword
};
