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


export const SpecialtyController = {
    createSpecialty,
    };