import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const loginUser: RequestHandler = catchAsync(async (req, res) => {
    const result = await AuthService.loginUser(req.body);

    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange,  

        },
})
}
);

const refreshToken: RequestHandler = catchAsync(async (req, res) => {
    console.log("refreshToken", req.cookies);
    const { refreshToken } = req.cookies;
    const result = await AuthService.refreshToken(refreshToken);

    // res.cookie("refreshToken", result.refreshToken, {
    //     httpOnly: true,
    //     secure: true,
    // });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: result
    });
}
);

const changePassword = catchAsync(async (req: Request & {user?: any}, res:Response) => {
    const user = req.user
    const result = await AuthService.changePassword(user, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password changed in successfully",
        data: result
    });
}
);


const forgetPassword = catchAsync(async (req: Request, res: Response) => {
    const  email  = req.body;
    console.log(email, "email .................")
    const result = await AuthService.forgetPassword(email);        
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password reset link sent successfully",
        data: result
    });
}
);

const resetPassword = catchAsync(async (req: Request, res: Response) => {
     const token = req.headers.authorization || "";
     const result = await AuthService.resetPassword(token, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Check your email successfully",
        data: result
    });
}
);


export const AuthController = {
    loginUser, 
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword
};