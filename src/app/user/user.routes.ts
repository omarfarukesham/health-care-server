import express, { Request, Response, NextFunction } from "express";
import { UserController } from "./user.controller";
import auth from "../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUloader } from "../../helpers/imageUploader";
import { userValidation } from "./user.validation";


const router = express.Router();


router.get("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),   UserController.getAllFromDB);

router.post(
    "/", 
    // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    fileUloader.upload.single("file"),
    (req:Request, res:Response, next:NextFunction) => {
       req.body =  userValidation.createAdmin.parse(JSON.parse(req.body.data));
       return  UserController.createAdmin(req, res, next);
     }
);

router.post(
    "/create-doctor", 
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    fileUloader.upload.single("file"),
    (req:Request, res:Response, next:NextFunction) => {
       req.body =  userValidation.createDoctor.parse(JSON.parse(req.body.data));
       return  UserController.createDoctor(req, res, next);
     }
);
 
router.post(
  "/create-patient",
  fileUloader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
      req.body = userValidation.createPatient.parse(JSON.parse(req.body.data))
      return UserController.createPatient(req, res, next)
  }
);

export const UserRoutes = router;