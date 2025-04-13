import  express  from "express";
const router = express.Router();
import { AdminController } from "./admin.controller";

router.get("/", AdminController.getAllAdminFromDB);
router.get("/:id", AdminController.getSingleAdminFromDB);
router.patch("/:id", AdminController.updateAdminFromDB);
router.delete("/:id", AdminController.deleteAdminFromDB);
router.delete("/soft/:id", AdminController.softDeleteAdminFromDB);


export const AdminRoutes = router;