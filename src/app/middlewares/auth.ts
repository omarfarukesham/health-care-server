import { NextFunction, Request, Response } from "express";
import ApiError from "../apiError/ApiError";
import httpStatus from "http-status";
import { jwtHelper } from "../../helpers/jwtHelper";


const auth =(...roles: string[]) => {
    return async(req: Request, res: Response, next: NextFunction) => {
       try {
           const token = req.headers.authorization;
            if(!token) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
            }

            const verifedUser =  jwtHelper.verfiyToken(token );
            if(!verifedUser) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
            }
            req.user = verifedUser; 
           
            if(roles.length && !roles.includes(verifedUser.role)){
                throw new ApiError(httpStatus.NOT_FOUND, 'Your token is not verified!!')
            }

           next();
       }
       catch (error) {
           return res.status(500).json({ message: "Internal Server Error" });
       }
    };
}

export default auth;