import handleAsyncError from "./handleAsyncError.js"
import ErrorHandler from "../utils/handleError.js"
import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return next(new ErrorHandler("You are not logged in! Please login to access this resource", 401))
    }

    let decodedData
    try {
        decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY)
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired session, please login again", 401))
    }

    const user = await User.findById(decodedData.id)
    if (!user) {
        return next(new ErrorHandler("User belonging to this token no longer exists", 401))
    }

    req.user = user
    next()
})

// higher-order function
export const roleBasedAuth = (...roles) => {
    return (req, res, next) => {
        if (!req.user){
              return next(new ErrorHandler("You are not logged in! Please login to access this resource", 401))
        }
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403))
        }
        next()
    }
}