import express from "express";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";
import * as paymentController from "../controllers/stripePayment.controller.js";

const router = express.Router();

router.post(
  "/orders/:id/payment_intent",
  authenticateUser,
  paymentController.createPaymentIntent
);
router.post(
  "/orders/:id/confirm-payment",
  authenticateUser,
  paymentController.confirmPayment
);
router.post(
  "/orders/:id/refund",
  authenticateUser,
  authenticateAdmin,
  paymentController.processRefund
);
router.post(
  "/driver-payout",
  authenticateUser,
  authenticateAdmin,
  paymentController.processDriverPayout
);
router.get("/history", authenticateUser, paymentController.getPaymentHistory);

export default router;