import { RequestHandler } from "express";
import catchAsync from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../shared/sendResponse";
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

const changePassword: RequestHandler = catchAsync(async (req, res) => {

    console.log("change password controller", req.user);
    const result = await AuthService.changePassword();


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password changed in successfully",
        data: result
    });
}
);

export const AuthController = {
    loginUser, 
    refreshToken,
    changePassword
};