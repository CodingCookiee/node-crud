import express from "express";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  deleteUser,
  getAllUsers,
  forceLogoutUser,
} from "../controllers/user.controller.js";
import { validateProfileUpdate } from "../validators/auth.validator.js";

const router = express.Router();

router.get("/profile/:userId", authenticateUser, getProfile);
router.put(
  "/profile/:userId",
  authenticateUser,
  validateProfileUpdate,
  updateProfile
);
router.get("/", authenticateUser, authenticateAdmin, getAllUsers);
router.post(
  "/force-logout/:userId",
  authenticateUser,
  authenticateAdmin,
  forceLogoutUser
);
router.delete("/:userId", authenticateUser, authenticateAdmin, deleteUser);

export default router;
