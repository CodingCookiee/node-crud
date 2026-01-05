import express from "express";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";
import * as paymentController from "../controllers/stripePayment.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/payments/orders/{id}/payment-intent:
 *   post:
 *     summary: Create Stripe payment intent for order
 *     tags: [Payments]
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
 *       201:
 *         description: Payment intent created
 *       400:
 *         description: Payment method must be card or payment already processed
 */
router.post(
  "/orders/:id/payment-intent",
  authenticateUser,
  paymentController.createPaymentIntent
);

/**
 * @swagger
 * /api/payments/orders/{id}/confirm-payment:
 *   post:
 *     summary: Confirm payment for order
 *     tags: [Payments]
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
 *         description: Payment confirmed
 */
router.post(
  "/orders/:id/confirm-payment",
  authenticateUser,
  paymentController.confirmPayment
);

/**
 * @swagger
 * /api/payments/orders/{id}/refund:
 *   post:
 *     summary: Process refund for cancelled order (Admin only)
 *     tags: [Payments]
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
 *         description: Refund processed
 *       400:
 *         description: Order not cancelled or already refunded
 */
router.post(
  "/orders/:id/refund",
  authenticateUser,
  authenticateAdmin,
  paymentController.processRefund
);

/**
 * @swagger
 * /api/payments/driver-payout:
 *   post:
 *     summary: Process driver payout (Admin only)
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - driverId
 *               - amount
 *             properties:
 *               driverId:
 *                 type: string
 *                 description: Driver user ID
 *               amount:
 *                 type: number
 *                 description: Payout amount
 *     responses:
 *       200:
 *         description: Payout processed
 */
router.post(
  "/driver-payout",
  authenticateUser,
  authenticateAdmin,
  paymentController.processDriverPayout
);

/**
 * @swagger
 * /api/payments/history:
 *   get:
 *     summary: Get payment history
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [pending, paid, failed, refunded]
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
 *         description: Payment history with pagination
 */
router.get("/history", authenticateUser, paymentController.getPaymentHistory);

export default router;