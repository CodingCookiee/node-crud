import express from "express";
import { createPaymentIntentController } from "../controllers/payment.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/create-payment-intent",
  authenticateUser,
  createPaymentIntentController
);


export default router;
