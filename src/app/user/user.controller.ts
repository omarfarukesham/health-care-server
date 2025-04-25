import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import pick from "../../shared/pick";

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
    getAllUsers
}
