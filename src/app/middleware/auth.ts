import { NextFunction, Request, Response } from "express"
import { jwtHelpers } from "../../helpers/jwtHelpers"
import config from "../../config/config"
import { Secret } from "jsonwebtoken"
import ApiError from "../errors/ApiError"
import httpStatus from "http-status"

const auth = (...roles: string[]) => {
    return (req: Request, res:Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization
            console.log(token)

            if (!token) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!")
            }

            const verifiedUser = jwtHelpers.verifyToken(token, config.jwt.jwt_secret as Secret)

            

            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "Forbidden!")
            }

            next()
        } catch (err) {
            next(err)
        }
    }
}

export default auth;