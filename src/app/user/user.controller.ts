import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import pick from "../../shared/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { userFilterableFields } from "./user.constant";

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

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])

    const result = await userService.getAllUsers({ ...filters, ...options })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users data fetched!",
  
        data: result || []
    })
});

const getAllUsers = async(req: Request, res: Response) => {
   try {
     const filter =  pick(req.query, ['searchTerm','name','email', 'contactNumber']);
      const result = await userService.getAllUsers(filter);
      res.status(200).json({
         status: "success",
         message: "Users fetched successfully",
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



export const UserController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUsers,
    getAllFromDB
}
