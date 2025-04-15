import { RequestHandler } from "express";
import catchAsync from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const loginUser: RequestHandler = catchAsync(async (req, res) => {
    const result = await AuthService.loginUser(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: result,
})
}
);


export const AuthController = {
    loginUser
};