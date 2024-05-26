import { RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const loginUser:RequestHandler = catchAsync(async(req, res) => {
    const result = await authServices.loginUser(req.body);

    const {refreshToken} = result;

    res.cookie('refreshToken', refreshToken,{
        secure: false,
        httpOnly: true,
    })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message:"Logged in successfully!",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange
        }
    })
})

const refreshToken:RequestHandler = catchAsync(async(req, res) => {

    const {refreshToken} = req.cookies;

    const result = await authServices.refreshToken(refreshToken);


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message:"Logged in successfully!",
        data: result
        // data: {
        //     accessToken: result.accessToken,
        // }
    })
})

export const AuthController = {
    loginUser,
    refreshToken
}