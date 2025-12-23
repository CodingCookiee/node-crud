import jwt from "jsonwebtoken";

export const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const generateResetToken = (userId) => {
  return jwt.sign({ userId }, process.env.RESET_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

export const setCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 24 * 24 * 60 * 60 * 1000, // 24 hours
  };

  const refreshCookieOptions = {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

export const verifyResetToken = (token) => {
  return jwt.verify(token, process.env.RESET_TOKEN_SECRET);
};
