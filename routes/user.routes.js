import express from "express";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
  editAddress,
  deleteUser,
  getAllUsers,
  toggleAdmin,
  requestAdminAccess,
  getAdminRequests,
  rejectAdminRequest,
  forceLogoutUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", authenticateUser, getProfile);
router.put("/profile", authenticateUser, updateProfile);
router.get("/", authenticateUser, authenticateAdmin, getAllUsers);
router.post(
  "/:userId/force-logout",
  authenticateUser,
  authenticateAdmin,
  forceLogoutUser
);
router.delete("/:userId", authenticateUser, authenticateAdmin, deleteUser);

export default router;
