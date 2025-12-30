import express from "express";
import {
  createCoupon,
  applyCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} from "../controllers/coupon.controller.js";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, authenticateAdmin, createCoupon);
router.get("/", authenticateUser, authenticateAdmin, getAllCoupons);
router.post("/apply", authenticateUser, applyCoupon);
router.put("/:id", authenticateUser, authenticateAdmin, updateCoupon);
router.delete("/:id", authenticateUser, authenticateAdmin, deleteCoupon);

export default router;
