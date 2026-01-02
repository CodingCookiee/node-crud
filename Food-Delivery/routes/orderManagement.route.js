import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import * as orderController from "../controllers/orderManagement.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create order from cart
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryAddressId
 *             properties:
 *               deliveryAddressId:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [card, cash, wallet]
 *                 default: cash
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post("/", authenticateUser, orderController.createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get order history
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, preparing, ready, picked_up, on_the_way, delivered, cancelled]
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *     responses:
 *       200:
 *         description: Order history with pagination
 */
router.get("/", authenticateUser, orderController.getOrderHistory);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
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
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get("/:id", authenticateUser, orderController.getOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmed, preparing, ready, picked_up, on_the_way, delivered]
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.patch(
  "/:id/status",
  authenticateUser,
  orderController.updateOrderStatus
);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel order (only if pending/confirmed)
 *     tags: [Orders]
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
 *               cancelReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order cancelled
 */
router.patch("/:id/cancel", authenticateUser, orderController.cancelOrder);

export default router;