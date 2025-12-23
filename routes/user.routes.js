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

const router = express.Router();

router.get("/profile/:userId", authenticateUser, getProfile);
router.put("/profile/:userId", authenticateUser, updateProfile);
router.get("/", authenticateUser, authenticateAdmin, getAllUsers);
router.post(
  "/:userId/force-logout",
  authenticateUser,
  authenticateAdmin,
  forceLogoutUser
);
router.delete("/:userId", authenticateUser, authenticateAdmin, deleteUser);

export default router;
