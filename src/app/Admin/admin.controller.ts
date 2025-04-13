import {RequestHandler } from "express";
import pick from "../../shared/pick";
import { adminService } from "./admin.service";
import { adminSearchAbleFields } from "./admin.constant";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";


const getAllAdminFromDB:RequestHandler = catchAsync(
   async(req, res) => {
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
)

const getSingleAdminFromDB = catchAsync(
      async(req, res, ) => {
         const { id } = req.params;
         console.log(id)
         const result = await adminService.getSingleAdminUser(id);
         sendResponse(res, {
            statusCode: httpStatus.OK,
            message: "Single Admin info successfully",
            success: true,
            data: result,
         })
   }
)

const updateAdminFromDB = catchAsync(
   async(req, res) => {
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
)

const deleteAdminFromDB = catchAsync(
   async(req, res) => { 
         const { id } = req.params;
         const result = await adminService.deleteAdminUser(id);
         sendResponse(res, {
            statusCode: httpStatus.OK,
            message: "Admin deleted successfully",
            success: true,
            data: result,
         }); 
   }
)

const softDeleteAdminFromDB = catchAsync(
   async(req, res) => {
         const { id } = req.params;
         const result = await adminService.softDeleteAdminUser(id);
         sendResponse(res, {
            statusCode: httpStatus.OK,
            message: "Admin soft deleted successfully",
            success: true,
            data: result,
         });
   }
)

export const AdminController = {
    getAllAdminFromDB,
    getSingleAdminFromDB,
    updateAdminFromDB,
    deleteAdminFromDB,
    softDeleteAdminFromDB
}
