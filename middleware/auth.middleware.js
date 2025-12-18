import jwt from 'jsonwebtoken';
import { createError } from "../lib/createError.util.js";


export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    throw createError(401, "Access token required");
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw createError(403, "Invalid or expired token");
  }
};