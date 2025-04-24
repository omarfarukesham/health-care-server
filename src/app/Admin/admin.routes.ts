import  express  from "express";
const router = express.Router();
import { AdminController } from "./admin.controller";
import { AnyZodObject, z } from "zod";
import validateRequest from "../middlewares/validateRequest";
import { AdminValidation } from "./admin.validations";
import auth from "../middlewares/auth";
import { UserRole } from "@prisma/client";


router.get(
    "/", 
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
     AdminController.getAllAdminFromDB
    );
router.get(
    "/:id", 
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    AdminController.getSingleAdminFromDB
);
router.patch("/:id",  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), validateRequest(AdminValidation.update), AdminController.updateAdminFromDB);
router.delete("/:id",  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), AdminController.deleteAdminFromDB);
router.delete("/soft/:id",  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), AdminController.softDeleteAdminFromDB);


export const AdminRoutes = router;