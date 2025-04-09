import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin =  async (req: Request, res: Response) => {
    console.log(req.body);
   const result = await userService.createAdmin(req.body);
    res.status(200).json({
          status: "success",
          message: "Admin created successfully",
          data: result,
     });
   
}


export const UserController = {
    createAdmin
}
