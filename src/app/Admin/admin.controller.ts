import { Request, Response } from "express";
import pick from "../../shared/pick";
import { adminService } from "./admin.service";
import { adminSearchAbleFields } from "./admin.constant";


const getAllAdminFromDB = async(req: Request, res: Response) => {
   try {
     const filter =  pick(req.query, adminSearchAbleFields);
     const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
     console.log(options);
      const result = await adminService.getAllAdminUsers(filter, options);
      res.status(200).json({
         status: "success",
         message: "Admin fetched successfully",
         meta: result.meta,
         data: result.data,
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

const getSingleAdminFromDB = async(req: Request, res: Response) => {
   try {
      const { id } = req.params;
      console.log(id)
      const result = await adminService.getSingleAdminUser(id);
      res.status(200).json({
         status: "success",
         message: "Single Admin info successfully",
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

const updateAdminFromDB = async(req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const data = req.body;
      const result = await adminService.updateAdminUser(id, data);
      res.status(200).json({
         status: "success",
         message: "Admin updated successfully",
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


const deleteAdminFromDB = async(req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const result = await adminService.deleteAdminUser(id);
      res.status(200).json({
         status: "success",
         message: "Admin deleted successfully",
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

export const AdminController = {
    getAllAdminFromDB,
    getSingleAdminFromDB,
    updateAdminFromDB,
    deleteAdminFromDB
}
