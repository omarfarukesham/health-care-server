"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../middlewares/auth"));
const client_1 = require("@prisma/client");
const imageUploader_1 = require("../../helpers/imageUploader");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), user_controller_1.UserController.getAllFromDB);
router.post("/", 
// auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
imageUploader_1.fileUloader.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return user_controller_1.UserController.createAdmin(req, res, next);
});
router.post("/create-doctor", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), imageUploader_1.fileUloader.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.userValidation.createDoctor.parse(JSON.parse(req.body.data));
    return user_controller_1.UserController.createDoctor(req, res, next);
});
router.post("/create-patient", imageUploader_1.fileUloader.upload.single('file'), (req, res, next) => {
    req.body = user_validation_1.userValidation.createPatient.parse(JSON.parse(req.body.data));
    return user_controller_1.UserController.createPatient(req, res, next);
});
exports.UserRoutes = router;
