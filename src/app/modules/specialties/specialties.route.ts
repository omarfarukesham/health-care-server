
 import express, { NextFunction, Request, Response } from 'express';
import { SpecialtyController } from './specialties.controller';
import { fileUploader } from '../../../helpers/imageUploader';
import { SpecialtyValidation } from './specialties.validation';

const router = express.Router();
router.post(
    '/', 
    // SpecialtyController.createSpecialty
// auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    fileUploader.upload.single("file"),
    (req:Request, res:Response, next:NextFunction) => {
       req.body = SpecialtyValidation.create.parse( JSON.parse(req.body.data));
       return SpecialtyController.createSpecialty(req, res, next);
     }
);



export const SpecialtyRoutes = router;