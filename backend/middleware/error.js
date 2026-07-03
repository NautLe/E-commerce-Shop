import errorHandler from "../utils/errorHandler.js"

export default (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Internal Server Error";

    // CastError
    if(error.name === "CastError"){
        const message = `Resource not found. Invalid: ${error.path}`;
        error = new errorHandler(message, 400);
    }

    res.status(error.statusCode).json({
        success: false,
        message: error.message
    });
}