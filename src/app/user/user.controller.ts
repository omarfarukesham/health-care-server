import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin =  async (req: Request, res: Response) => {
   const result = await userService.createAdmin(req, res);
   res.status(200).json({
       status: "success",
       message: result.message,
   });
   res.send(result);
   
}


export const UserController = {
    createAdmin
}
