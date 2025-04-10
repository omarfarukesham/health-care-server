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
    getAllAdminFromDB
}
