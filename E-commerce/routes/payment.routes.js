import express from "express";
import { createPaymentIntentController } from "../controllers/payment.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/payment/create-payment-intent:
 *   post:
 *     summary: Create Stripe payment intent for order
 *     tags: [Payment]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     clientSecret:
 *                       type: string
 *                     paymentIntentId:
 *                       type: string
 *       404:
 *         description: Order not found
 *       400:
 *         description: Payment intent already exists
 */
router.post(
  "/create-payment-intent",
  authenticateUser,
  createPaymentIntentController
);

// Webhook route is handled in server.js (needs raw body)

export default router;
