import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import pick from "../../../shared/pick";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { userFilterableFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";

const createAdmin =  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.createAdmin(req);
        res.status(200).json({
            status: "success",
            message: "Admin created successfully",
            data: result,
        });
    }
    catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error?.name || "Internal server error",
            error: error.message,
        });
    }
   
}

const createDoctor =  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.createDoctor(req);
        res.status(200).json({
            status: "success",
            message: "Doctor created successfully",
            data: result,
        });
    }

    catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error?.name || "Internal server error",
            error: error.message,
        });
    }
   
}

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.createPatient(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient Created successfuly!",
        data: result
    })
});
 
const getAllUserFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])

    const result = await userService.getAllUserFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users data fetched!",
        meta: result.meta,
        data: result.data || []
    })
});

const getProfile =catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await userService.getMyProfile(user as IAuthUser);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile fetched successfully!",
        data: result
    })
})

const updateMyProfile =  catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {

    const user = req.user;

    const result = await userService.updateMyProfile(user as IAuthUser, req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile updated!",
        data: result
    })
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await userService.changeProfileStatus(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile status changed successfully!",
        data: result
    })

})

export const UserController = {
    createAdmin,
    createDoctor,
    createPatient,
    changeProfileStatus,
    getAllUserFromDB,
    getProfile,
    updateMyProfile
}
