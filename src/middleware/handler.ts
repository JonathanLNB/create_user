export function  NotFound(req,res, next) {
    res.status(404);
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
}
export function ErrorHandler(error, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? {} : error.stack,
    });
}
module.exports = {NotFound, ErrorHandler}
