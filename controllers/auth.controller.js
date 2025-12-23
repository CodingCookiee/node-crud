import { authService } from "../services/auth.service.js";
import { createError } from "../lib/createError.util.js";

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await authService.signup({ name, email, password, role });
    await authService.handleTokens(user, res);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.signin(email, password);
    await authService.handleTokens(user, res);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await authService.logout(refreshToken);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const resetToken = await authService.initiatePasswordReset(req.body.email);
    res.status(200).json({ message: "Password reset token generated", resetToken });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body.resetToken, req.body.newPassword);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { accessToken } = await authService.refreshAccessToken(
      req.cookies.refreshToken
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "Token Refreshed Successfully" });
  } catch (error) {
    next(error);
  }
};
