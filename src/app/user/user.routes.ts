import  express  from "express";
import { UserController } from "./user.controller";
import auth from "../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUloader } from "../../helpers/imageUploader";


const router = express.Router();


router.get("/",  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),  UserController.getAllUsers);
router.post(
    "/", 
  
    fileUloader.upload.single("file"),
    UserController.createAdmin);


export const UserRoutes = router;