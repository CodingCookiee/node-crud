import express from "express";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";
import * as assignmentController from "../controllers/orderAssignment.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/order-assignment/{id}/auto-assign:
 *   post:
 *     summary: Auto-assign nearest available driver to order
 *     tags: [Order Assignment]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Driver assigned automatically
 *       404:
 *         description: No available drivers nearby
 */
router.post(
  "/:id/auto-assign",
  authenticateUser,
  authenticateAdmin,
  assignmentController.autoAssignDriver
);

/**
 * @swagger
 * /api/order-assignment/{id}/manual-assign:
 *   post:
 *     summary: Manually assign specific driver to order (Admin only)
 *     tags: [Order Assignment]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - driverId
 *             properties:
 *               driverId:
 *                 type: string
 *                 description: Driver user ID
 *     responses:
 *       200:
 *         description: Driver assigned manually
 *       400:
 *         description: Invalid or unapproved driver
 */
router.post(
  "/:id/manual-assign",
  authenticateUser,
  authenticateAdmin,
  assignmentController.manualAssignDriver
);

/**
 * @swagger
 * /api/order-assignment/{id}/reassign:
 *   post:
 *     summary: Reassign order after driver rejection (Admin only)
 *     tags: [Order Assignment]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order reassigned
 *       400:
 *         description: Order still has a driver assigned
 *       404:
 *         description: No available drivers nearby
 */
router.post(
  "/:id/reassign",
  authenticateUser,
  authenticateAdmin,
  assignmentController.reassignOrder
);

export default router;
