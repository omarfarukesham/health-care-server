import  express  from "express";
import { UserController } from "./user.controller";
import auth from "../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/",  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),  UserController.getAllUsers);
router.post("/",  UserController.createAdmin);


export const UserRoutes = router;