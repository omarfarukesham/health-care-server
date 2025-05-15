"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const admin_controller_1 = require("./admin.controller");
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const admin_validations_1 = require("./admin.validations");
const auth_1 = __importDefault(require("../middlewares/auth"));
const client_1 = require("@prisma/client");
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), admin_controller_1.AdminController.getAllAdminFromDB);
router.get("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), admin_controller_1.AdminController.getSingleAdminFromDB);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(admin_validations_1.AdminValidation.update), admin_controller_1.AdminController.updateAdminFromDB);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), admin_controller_1.AdminController.deleteAdminFromDB);
router.delete("/soft/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), admin_controller_1.AdminController.softDeleteAdminFromDB);
exports.AdminRoutes = router;
