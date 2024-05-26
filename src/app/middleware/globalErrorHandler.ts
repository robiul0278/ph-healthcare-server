import { NextFunction, Request, Response } from "express";
import app from "../../app";
import httpStatus from "http-status";




const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction)=> {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err?.message || "Something went wrong!",
      data: err,
    });
  }

  export default globalErrorHandler;