import  express  from "express";
import { AdminController } from "./admin.controller";
// import { UserController } from "./user.controller";

const router = express.Router();

router.get("/", AdminController.getAllAdminFromDB);
router.get("/:id", AdminController.getSingleAdminFromDB);
router.patch("/:id", AdminController.updateAdminFromDB);
router.delete("/:id", AdminController.deleteAdminFromDB);


export const AdminRoutes = router;