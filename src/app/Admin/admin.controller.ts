import { NextFunction, Request, Response } from "express";
import pick from "../../shared/pick";
import { adminService } from "./admin.service";
import { adminSearchAbleFields } from "./admin.constant";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";


const getAllAdminFromDB = async(req: Request, res: Response, next: NextFunction) => {
   try {
     const filter =  pick(req.query, adminSearchAbleFields);
     const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
     const result = await adminService.getAllAdminUsers(filter, options);

      sendResponse(res, {
         statusCode: httpStatus.OK,
         message: "Admin fetched successfully",
         success: true,
         meta: result.meta,
         data: result.data,
      });
   }
   catch (error: any) {
       next(error);
   }
}

const getSingleAdminFromDB = async(req: Request, res: Response, next: NextFunction) => {
   try {
      const { id } = req.params;
      console.log(id)
      const result = await adminService.getSingleAdminUser(id);
      sendResponse(res, {
         statusCode: httpStatus.OK,
         message: "Single Admin info successfully",
         success: true,
         data: result,
      });
   }
   catch (error: any) {
     next(error);
   }
}

const updateAdminFromDB = async(req: Request, res: Response, next: NextFunction) => {
   try {
      const { id } = req.params;
      const data = req.body;
      const result = await adminService.updateAdminUser(id, data);
     sendResponse(res, {
         statusCode: httpStatus.OK,
         message: "Admin updated successfully",
         success: true,
         data: result,
      });
   }
   catch (error: any) {
     next(error);
   }
}

const deleteAdminFromDB = async(req: Request, res: Response, next: NextFunction) => {
   try {
      const { id } = req.params;
      const result = await adminService.deleteAdminUser(id);
      sendResponse(res, {
         statusCode: httpStatus.OK,
         message: "Admin deleted successfully",
         success: true,
         data: result,
      });
   }
   catch (error: any) {
     next(error);
   }
}

const softDeleteAdminFromDB = async(req: Request, res: Response, next:NextFunction) => {
   try {
      const { id } = req.params;
      const result = await adminService.softDeleteAdminUser(id);
      sendResponse(res, {
         statusCode: httpStatus.OK,
         message: "Admin soft deleted successfully",
         success: true,
         data: result,
      });
   }
   catch (error: any) {
      next(error)
   }
}

export const AdminController = {
    getAllAdminFromDB,
    getSingleAdminFromDB,
    updateAdminFromDB,
    deleteAdminFromDB,
    softDeleteAdminFromDB
}
