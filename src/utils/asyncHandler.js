// A higher-order function that wraps async request handlers to catch errors
// This prevents the need to write try-catch blocks in every controller

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // Wrap the request handler in a promise and catch any error
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export { asyncHandler };


// const asyncHandler = (fn) => async(req,res,next) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success:false,
//             message:err.message
//         })
        
//     }
// }