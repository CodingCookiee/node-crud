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

/**
 * @swagger
 * /api/users/profile/{userId}:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       404:
 *         description: User not found
 */
router.get("/profile/:userId", authenticateUser, getProfile);

/**
 * @swagger
 * /api/users/profile/{userId}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       403:
 *         description: Not authorized to update this profile
 */
router.put(
  "/profile/:userId",
  authenticateUser,
  validateProfileUpdate,
  updateProfile
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Admin access required
 */
router.get("/", authenticateUser, authenticateAdmin, getAllUsers);

/**
 * @swagger
 * /api/users/force-logout/{userId}:
 *   post:
 *     summary: Force logout user (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       403:
 *         description: Admin access required
 */
router.post(
  "/force-logout/:userId",
  authenticateUser,
  authenticateAdmin,
  forceLogoutUser
);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Admin access required
 */
router.delete("/:userId", authenticateUser, authenticateAdmin, deleteUser);

export default router;
