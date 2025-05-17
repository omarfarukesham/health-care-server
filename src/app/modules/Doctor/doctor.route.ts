import  express  from "express";
import { doctorController } from "./doctor.controller";

const router = express.Router();

router.get(
    "/",
    doctorController.getAllDoctorFromDB
);

router.patch(
    "/:id",
    doctorController.updateDoctorFromDB
)


export const DoctorRoutes = router;
