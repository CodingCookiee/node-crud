export const createError = (status = 500, message = "Internal Server Error") => {
  const error = new Error(message);
  error.status = status;
  return error;
};
