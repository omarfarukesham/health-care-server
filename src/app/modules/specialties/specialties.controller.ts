import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SpecialtyService } from "./specialties.service";

const createSpecialty = catchAsync(async (req, res) => {
  const result = await SpecialtyService.insertIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Specialty created successfully",
    success: true,
    data: result,
  });
}
);

const getAllSpecialty = catchAsync(async (req, res) => {

    const result = await SpecialtyService.getAllSpecialty();
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Specialty fetched successfully",
        success: true,
        data: result
    });
    }   
);
const deleteSpecialty = catchAsync(async (req, res) => {
    const { id } = req.params;  
    const result = await SpecialtyService.deleteSpecialty(id);
    sendResponse(res, { 
        statusCode: httpStatus.OK,
        message: "Specialty deleted successfully",
        success: true,
        data: result
    });
}
);

export const SpecialtyController = {
    createSpecialty,
    getAllSpecialty,
    deleteSpecialty
    };