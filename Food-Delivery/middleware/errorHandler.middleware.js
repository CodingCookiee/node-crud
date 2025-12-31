export const errorHandler = (error, req, res, next) => {
  const statusCode = error.status || 500;
  const message = error.message || "Something went wrong.";
  
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};
