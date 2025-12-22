import jwt from "jsonwebtoken";
import { createError } from "../lib/createError.util.js";
import { User } from "../models/user.model.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw createError(401, "Access token required - Unauthorized");
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const authenticateAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return next(createError(403, "Access denied - Admins only"));
  }
};
