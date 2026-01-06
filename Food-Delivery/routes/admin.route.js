import express from "express";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";
import * as adminController from "../controllers/admin.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [customer, restaurant, driver, admin]
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of users with pagination
 */
router.get(
  "/users",
  authenticateUser,
  authenticateAdmin,
  adminController.getAllUsers
);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get(
  "/users/:id",
  authenticateUser,
  authenticateAdmin,
  adminController.getUserById
);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               phone:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put(
  "/users/:id",
  authenticateUser,
  authenticateAdmin,
  adminController.updateUser
);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Deactivate user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deactivated successfully
 */
router.delete(
  "/users/:id",
  authenticateUser,
  authenticateAdmin,
  adminController.deleteUser
);

/**
 * @swagger
 * /api/admin/restaurants/{id}/approve:
 *   put:
 *     summary: Approve restaurant registration (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant approved successfully
 */
router.put(
  "/restaurants/:id/approve",
  authenticateUser,
  authenticateAdmin,
  adminController.approveRestaurant
);

/**
 * @swagger
 * /api/admin/restaurants/{id}/reject:
 *   put:
 *     summary: Reject restaurant registration (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant rejected successfully
 */
router.put(
  "/restaurants/:id/reject",
  authenticateUser,
  authenticateAdmin,
  adminController.rejectRestaurant
);

/**
 * @swagger
 * /api/admin/drivers/{id}/approve:
 *   put:
 *     summary: Approve driver application (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Driver approved successfully
 */
router.put(
  "/drivers/:id/approve",
  authenticateUser,
  authenticateAdmin,
  adminController.approveDriver
);

/**
 * @swagger
 * /api/admin/drivers/{id}/reject:
 *   put:
 *     summary: Reject driver application (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Driver rejected successfully
 */
router.put(
  "/drivers/:id/reject",
  authenticateUser,
  authenticateAdmin,
  adminController.rejectDriver
);

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *       - in: query
 *         name: restaurantId
 *         schema:
 *           type: string
 *       - in: query
 *         name: driverId
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of orders with pagination
 */
router.get(
  "/orders",
  authenticateUser,
  authenticateAdmin,
  adminController.getAllOrders
);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get platform statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Platform statistics including users, orders, revenue, and pending approvals
 */
router.get(
  "/stats",
  authenticateUser,
  authenticateAdmin,
  adminController.getPlatformStats
);

export default router;
