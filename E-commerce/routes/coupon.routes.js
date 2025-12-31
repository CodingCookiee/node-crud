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

/**
 * @swagger
 * /api/coupons:
 *   post:
 *     summary: Create new coupon (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountType
 *               - discountValue
 *             properties:
 *               code:
 *                 type: string
 *                 example: SAVE20
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 example: percentage
 *               discountValue:
 *                 type: number
 *                 example: 20
 *               maxDiscountAmount:
 *                 type: number
 *                 example: 50
 *               minOrderAmount:
 *                 type: number
 *                 example: 100
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               usageLimit:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *       403:
 *         description: Admin access required
 */
router.post("/", authenticateUser, authenticateAdmin, createCoupon);

/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Get all coupons (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all coupons
 *       403:
 *         description: Admin access required
 */
router.get("/", authenticateUser, authenticateAdmin, getAllCoupons);

/**
 * @swagger
 * /api/coupons/apply:
 *   post:
 *     summary: Apply coupon to order
 *     tags: [Coupons]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - orderAmount
 *             properties:
 *               code:
 *                 type: string
 *                 example: SAVE20
 *               orderAmount:
 *                 type: number
 *                 example: 150
 *     responses:
 *       200:
 *         description: Coupon applied successfully
 *       400:
 *         description: Invalid or expired coupon
 */
router.post("/apply", authenticateUser, applyCoupon);

/**
 * @swagger
 * /api/coupons/{id}:
 *   put:
 *     summary: Update coupon (Admin only)
 *     tags: [Coupons]
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
 *               discountValue:
 *                 type: number
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               usageLimit:
 *                 type: number
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       404:
 *         description: Coupon not found
 */
router.put("/:id", authenticateUser, authenticateAdmin, updateCoupon);

/**
 * @swagger
 * /api/coupons/{id}:
 *   delete:
 *     summary: Delete coupon (Admin only)
 *     tags: [Coupons]
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
 *         description: Coupon deleted successfully
 *       404:
 *         description: Coupon not found
 */
router.delete("/:id", authenticateUser, authenticateAdmin, deleteCoupon);

export default router;
