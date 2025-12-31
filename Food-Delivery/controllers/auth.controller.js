import { authService } from "../services/auth.service.js";

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const user = await authService.signup({
      name,
      email,
      password,
      role,
      phone,
    });

    await authService.handleTokens(user, res);

    res.status(201).json({
      success: true,
      message: "User signed up successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.signin(email, password);

    await authService.handleTokens(user, res);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await authService.logout(refreshToken);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const resetToken = await authService.initiatePasswordReset(req.body.email);
    res.status(200).json({
      success: true,
      message: "Reset Token generated",
      data: resetToken,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    await authService.resetPassword(resetToken, newPassword);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Token refreshed",
    });
  } catch (error) {
    next(error);
  }
};
