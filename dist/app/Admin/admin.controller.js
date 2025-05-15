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
exports.AdminController = void 0;
const pick_1 = __importDefault(require("../../shared/pick"));
const admin_service_1 = require("./admin.service");
const admin_constant_1 = require("./admin.constant");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const getAllAdminFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, admin_constant_1.adminSearchAbleFields);
    const options = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = yield admin_service_1.adminService.getAllAdminUsers(filter, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Admin fetched successfully",
        success: true,
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleAdminFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    const result = yield admin_service_1.adminService.getSingleAdminUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Single Admin info successfully",
        success: true,
        data: result,
    });
}));
const updateAdminFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    const result = yield admin_service_1.adminService.updateAdminUser(id, data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Admin updated successfully",
        success: true,
        data: result,
    });
}));
const deleteAdminFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.adminService.deleteAdminUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Admin deleted successfully",
        success: true,
        data: result,
    });
}));
const softDeleteAdminFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.adminService.softDeleteAdminUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Admin soft deleted successfully",
        success: true,
        data: result,
    });
}));
exports.AdminController = {
    getAllAdminFromDB,
    getSingleAdminFromDB,
    updateAdminFromDB,
    deleteAdminFromDB,
    softDeleteAdminFromDB
};
