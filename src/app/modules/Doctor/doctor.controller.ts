import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { doctorService } from "./doctor.service";

const getAllDoctorFromDB = catchAsync(
    async (req, res) => {
        const result = await doctorService.getAllDoctors();
        sendResponse(res, {
            statusCode: httpStatus.OK,
            message: "All Doctor info successfully",
            success: true,
            data: result,
        });
    }
);

const updateDoctorFromDB = catchAsync(
    async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const result = await doctorService.updateDoctor(id, data);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            message: "Doctor updated successfully",
            success: true,
            data: result,
        });
    }
);



export const doctorController = {
    getAllDoctorFromDB,
    updateDoctorFromDB
}