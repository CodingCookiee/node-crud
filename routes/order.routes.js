import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/order.controller.js";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, createOrder);
router.get("/", authenticateUser, getUserOrders);
router.get("/:id", authenticateUser, getOrderById);
router.patch(
  "/:id/status",
  authenticateUser,
  authenticateAdmin,
  updateOrderStatus
);
router.patch("/:id/cancel", authenticateUser, cancelOrder);

export default router;
