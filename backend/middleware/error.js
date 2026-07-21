import errorHandler from "../utils/handleError.js"

export default (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Internal Server Error";

    // CastError
    if(error.name === "CastError"){
        const message = `Resource not found. Invalid: ${error.path}`;
        error = new errorHandler(message, 404);
    }

    // Duplicate Key Error
    if (error.code === 11000){
        const message = `This ${Object.keys(error.keyValue)} already registered. Please Login to continue.`;
        error = new errorHandler(message, 400);
    }
    res.status(error.statusCode).json({
        success: false,
        message: error.message
    });
}