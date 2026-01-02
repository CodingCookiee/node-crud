import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import * as driverController from "../controllers/driver.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/drivers:
 *   put:
 *     summary: Update driver profile
 *     tags: [Drivers]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicleType:
 *                 type: string
 *                 enum: [bike, scooter, car]
 *               licenseNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put("/", authenticateUser, driverController.updateDriverProfile);

/**
 * @swagger
 * /api/drivers/availability:
 *   patch:
 *     summary: Toggle driver availability
 *     tags: [Drivers]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Availability toggled
 */
router.patch(
  "/availability",
  authenticateUser,
  driverController.toggleAvailability
);

/**
 * @swagger
 * /api/drivers/location:
 *   patch:
 *     summary: Update driver location
 *     tags: [Drivers]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lat
 *               - lng
 *             properties:
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *     responses:
 *       200:
 *         description: Location updated
 */
router.patch(
  "/location",
  authenticateUser,
  driverController.updateLocation
);

/**
 * @swagger
 * /api/drivers/orders:
 *   get:
 *     summary: Get assigned orders
 *     tags: [Drivers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
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
 *         description: List of assigned orders
 */
router.get("/orders", authenticateUser, driverController.getAssignedOrders);

/**
 * @swagger
 * /api/drivers/orders/{id}/accept:
 *   patch:
 *     summary: Accept order assignment
 *     tags: [Drivers]
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
 *         description: Order accepted
 */
router.patch(
  "/orders/:id/accept",
  authenticateUser,
  driverController.acceptOrder
);

/**
 * @swagger
 * /api/drivers/orders/{id}/reject:
 *   patch:
 *     summary: Reject order assignment
 *     tags: [Drivers]
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
 *         description: Order rejected
 */
router.patch(
  "/orders/:id/reject",
  authenticateUser,
  driverController.rejectOrder
);

/**
 * @swagger
 * /api/drivers/orders/{id}/picked-up:
 *   patch:
 *     summary: Mark order as picked up
 *     tags: [Drivers]
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
 *         description: Order marked as picked up
 */
router.patch(
  "/orders/:id/picked-up",
  authenticateUser,
  driverController.markOrderPickedUp
);

/**
 * @swagger
 * /api/drivers/orders/{id}/delivered:
 *   patch:
 *     summary: Mark order as delivered
 *     tags: [Drivers]
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
 *         description: Order delivered
 */
router.patch(
  "/orders/:id/delivered",
  authenticateUser,
  driverController.markOrderDelivered
);

export default router;
