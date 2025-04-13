import { Request, Response } from "express";
import pick from "../../shared/pick";
import { adminService } from "./admin.service";
import { adminSearchAbleFields } from "./admin.constant";
import sendResponse from "../../shared/sendResponse";


const getAllAdminFromDB = async(req: Request, res: Response) => {
   try {
     const filter =  pick(req.query, adminSearchAbleFields);
     const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
      const result = await adminService.getAllAdminUsers(filter, options);

      sendResponse(res, {
         statusCode: 200,
         message: "Admin fetched successfully",
         success: true,
         meta: result.meta,
         data: result.data,
      });
   }
   catch (error: any) {
      sendResponse(res, {
         statusCode: 500,
         message: error?.name || "Internal server error",
         success: false,
         error: error.message,
      });
   }
}

const getSingleAdminFromDB = async(req: Request, res: Response) => {
   try {
      const { id } = req.params;
      console.log(id)
      const result = await adminService.getSingleAdminUser(id);
      sendResponse(res, {
         statusCode: 200,
         message: "Single Admin info successfully",
         success: true,
         data: result,
      });
   }
   catch (error: any) {
      sendResponse(res, {
         statusCode: 500,
         message: error?.name || "Internal server error",
         success: false,
         error: error.message,
      });
   }
}

const updateAdminFromDB = async(req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const data = req.body;
      const result = await adminService.updateAdminUser(id, data);
     sendResponse(res, {
         statusCode: 200,
         message: "Admin updated successfully",
         success: true,
         data: result,
      });
   }
   catch (error: any) {
      sendResponse(res, {
         statusCode: 500,
         message: error?.name || "Internal server error",
         success: false,
         error: error.message,
      });
   }
}

const deleteAdminFromDB = async(req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const result = await adminService.deleteAdminUser(id);
      sendResponse(res, {
         statusCode: 200,
         message: "Admin deleted successfully",
         success: true,
         data: result,
      });
   }
   catch (error: any) {
     sendResponse(res, {
         statusCode: 500,
         message: error?.name || "Internal server error",
         success: false,
         error: error.message,
      });
   }
}

const softDeleteAdminFromDB = async(req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const result = await adminService.softDeleteAdminUser(id);
      sendResponse(res, {
         statusCode: 200,
         message: "Admin soft deleted successfully",
         success: true,
         data: result,
      });
   }
   catch (error: any) {
      sendResponse(res, {
         statusCode: 500,
         message: error?.name || "Internal server error",
         success: false,
         error: error.message,
      });
   }
}

export const AdminController = {
    getAllAdminFromDB,
    getSingleAdminFromDB,
    updateAdminFromDB,
    deleteAdminFromDB,
    softDeleteAdminFromDB
}
