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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const client_1 = require("@prisma/client");
const user_constant_1 = require("./user.constant");
const bycript = __importStar(require("bcrypt"));
const paginationsHelper_1 = require("../../helpers/paginationsHelper");
const imageUploader_1 = require("../../helpers/imageUploader");
const prisma = new client_1.PrismaClient();
const createAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        let uploadeToCloudinary = yield imageUploader_1.fileUploader.uploadToCloudinary(file.path);
        req.body.admin.profilePhoto = uploadeToCloudinary;
    }
    const hashedPassword = yield bycript.hash(req.body.password, 10);
    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: client_1.UserRole.ADMIN,
    };
    const result = yield prisma.$transaction((transctionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transctionClient.user.create({
            data: userData,
        });
        const createAdmin = yield transctionClient.admin.create({
            data: req.body.admin,
        });
        return createAdmin;
    }));
    return result;
});
const createDoctor = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        let uploadeToCloudinary = yield imageUploader_1.fileUploader.uploadToCloudinary(file.path);
        req.body.doctor.profilePhoto = uploadeToCloudinary;
    }
    const hashedPassword = yield bycript.hash(req.body.password, 10);
    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: client_1.UserRole.DOCTOR,
    };
    const result = yield prisma.$transaction((transctionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transctionClient.user.create({
            data: userData,
        });
        const creatDoctor = yield transctionClient.doctor.create({
            data: req.body.doctor,
        });
        return creatDoctor;
    }));
    return result;
});
const createPatient = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadedProfileImage = yield imageUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.patient.profilePhoto = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.secure_url;
        console.log(uploadedProfileImage);
    }
    const hashedPassword = yield bycript.hash(req.body.password, 10);
    const userData = {
        email: req.body.patient.email,
        password: hashedPassword,
        role: client_1.UserRole.PATIENT
    };
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.user.create({
            data: userData
        });
        const createdPatientData = yield transactionClient.patient.create({
            data: req.body.patient
        });
        return createdPatientData;
    }));
    return result;
});
const getAllUserFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationsHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    //console.log(filterData);
    if (params.searchTerm) {
        andCondions.push({
            OR: user_constant_1.userSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    ;
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    ;
    const whereConditons = andCondions.length > 0 ? { AND: andCondions } : {};
    const result = yield prisma.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            patient: true,
            doctor: true
        }
    });
    const total = yield prisma.user.count({
        where: whereConditons
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
});
const changeProfileStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.user.findFirstOrThrow({
        where: {
            id
        }
    });
    const updateUser = yield prisma.user.update({
        where: {
            id: result.id
        },
        data: status
    });
    return updateUser;
});
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma.user.findUniqueOrThrow({
        where: {
            email: user.email
        },
        select: {
            id: true,
            email: true,
            needPasswordChange: true,
            role: true,
            status: true
        }
    });
    if (userData.role === client_1.UserRole.ADMIN) {
        const admin = yield prisma.admin.findUniqueOrThrow({
            where: {
                email: userData.email
            }
        });
        return Object.assign(Object.assign({}, userData), { admin });
    }
    if (userData.role === client_1.UserRole.SUPER_ADMIN) {
        const superAdmin = yield prisma.user.findUniqueOrThrow({
            where: {
                email: userData.email
            }
        });
        return Object.assign(Object.assign({}, userData), { superAdmin });
    }
    if (userData.role === client_1.UserRole.PATIENT) {
        const patient = yield prisma.patient.findUniqueOrThrow({
            where: {
                email: userData.email
            }
        });
        return Object.assign(Object.assign({}, userData), { patient });
    }
    if (userData.role === client_1.UserRole.DOCTOR) {
        const doctor = yield prisma.doctor.findUniqueOrThrow({
            where: {
                email: userData.email
            }
        });
        return Object.assign(Object.assign({}, userData), { doctor });
    }
});
const updateMyProfile = (user, req) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield imageUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    let profileInfo;
    if (userInfo.role === client_1.UserRole.SUPER_ADMIN) {
        profileInfo = yield prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        });
    }
    else if (userInfo.role === client_1.UserRole.ADMIN) {
        profileInfo = yield prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        });
    }
    else if (userInfo.role === client_1.UserRole.DOCTOR) {
        profileInfo = yield prisma.doctor.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        });
    }
    else if (userInfo.role === client_1.UserRole.PATIENT) {
        profileInfo = yield prisma.patient.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        });
    }
    return Object.assign({}, profileInfo);
});
exports.userService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUserFromDB,
    getMyProfile,
    changeProfileStatus,
    updateMyProfile
};
