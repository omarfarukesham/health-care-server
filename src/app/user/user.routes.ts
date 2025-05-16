import express, { Request, Response, NextFunction } from "express";
import { UserController } from "./user.controller";
import auth from "../middlewares/auth";
import { UserRole } from "@prisma/client";
import { userValidation } from "./user.validation";
import { fileUploader } from "../../helpers/imageUploader";

const router = express.Router();

router.get(
  "/", 
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),  
  UserController.getAllUserFromDB
);

router.get(
  "/me",
   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),  
    UserController.getProfile
);

router.post(
    "/", 
    // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    fileUploader.upload.single("file"),
    (req:Request, res:Response, next:NextFunction) => {
       req.body =  userValidation.createAdmin.parse(JSON.parse(req.body.data));
       return  UserController.createAdmin(req, res, next);
     }
);

router.post(
    "/create-doctor", 
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    fileUploader.upload.single("file"),
    (req:Request, res:Response, next:NextFunction) => {
       req.body =  userValidation.createDoctor.parse(JSON.parse(req.body.data));
       return  UserController.createDoctor(req, res, next);
     }
);
 
router.post(
  "/create-patient",
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
      req.body = userValidation.createPatient.parse(JSON.parse(req.body.data))
      return UserController.createPatient(req, res, next)
  }
);

router.patch(
  "/:id/status", 
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), 
  UserController.changeProfileStatus
);

router.patch(
  "/update-profile", 
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),  
      fileUploader.upload.single('file'),
    (req:Request, res:Response, next:NextFunction) => {
       req.body =  JSON.parse(req.body.data);
       return  UserController.updateMyProfile(req, res, next);
     }
);


export const UserRoutes = router;