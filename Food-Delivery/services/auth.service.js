import { User } from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  setCookies,
  generateResetToken,
  verifyResetToken,
} from "../lib/token.utils.js";
import { createError } from "../lib/createError.util.js";
import jwt from "jsonwebtoken";

export const authService = {
  signup: async (userData) => {
    const { name, email, password, role, phone } = userData;

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw createError(400, "Email already exists, try another one");
    }

    const user = new User({ name, email, password, role, phone });
    await user.save();
    return user;
  },

  signin: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(400, "Email or password is incorrect");
    }

    if (!user.isActive) {
      throw createError(400, "User is not active, please contact admin");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw createError(
        400,
        "Invalid password, try again with correct password"
      );
    }

    return user;
  },
  handleTokens: async (user, res) => {
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    setCookies(res, accessToken, refreshToken);
  },

  logout: async (refreshToken) => {
    if (!refreshToken) {
      throw createError(401, "No refresh token found");
    }
    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      throw createError(401, "Invalid refresh token");
    }
  },
  initiatePasswordReset: async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, "User does not exist");
    }

    const resetToken = generateResetToken(user._id);
    return resetToken;
  },
  resetPassword: async (resetToken, newPassword) => {
    const decoded = verifyResetToken(resetToken);
    const user = await User.findById(decoded.userId);

    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      throw createError(400, "New password cannot be the same as old password");
    }

    user.password = newPassword;
    await user.save();
  },

  refreshAccessToken: async (refreshToken) => {
    if (!refreshToken) {
      throw createError(401, "No refresh token found");
    }
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const user = await User.findById(decoded.userId);
      if (!user) {
        throw createError(404, "User does not exist");
      }
      const accessToken = generateAccessToken(user._id, user.role);
      return { accessToken };
    } catch (error) {
      throw createError(401, "Invalid refresh token");
    }
  },
};
