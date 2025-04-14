import  express  from "express";
const router = express.Router();
import { AdminController } from "./admin.controller";
import { AnyZodObject, z } from "zod";
import validateRequest from "../middlewares/validateRequest";
import { AdminValidation } from "./admin.validations";


router.get("/", AdminController.getAllAdminFromDB);
router.get("/:id", AdminController.getSingleAdminFromDB);
router.patch("/:id", validateRequest(AdminValidation.update), AdminController.updateAdminFromDB);
router.delete("/:id", AdminController.deleteAdminFromDB);
router.delete("/soft/:id", AdminController.softDeleteAdminFromDB);


export const AdminRoutes = router;