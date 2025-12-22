import express from "express";
import {
  signin,
  logout,
  signup,
  forgotPassword,
  resetPassword,
  refreshToken,
} from "../controllers/auth.controller.js";
import {
  validateSignup,
  validatePasswordReset,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", validatePasswordReset, resetPassword);
router.post("/refresh-token", refreshToken);

export default router;
