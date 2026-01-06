import express from "express";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";
import * as discountController from "../controllers/discount.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/discounts:
 *   post:
 *     summary: Create promo code (Admin only)
 *     tags: [Discounts]
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
 *               - description
 *               - discountType
 *               - discountValue
 *               - expiryDate
 *             properties:
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               discountValue:
 *                 type: number
 *               minOrderAmount:
 *                 type: number
 *               maxDiscountAmount:
 *                 type: number
 *               restaurantId:
 *                 type: string
 *               isFirstTimeOnly:
 *                 type: boolean
 *               usageLimit:
 *                 type: number
 *               expiryDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Promo code created successfully
 */
router.post(
  "/",
  authenticateUser,
  authenticateAdmin,
  discountController.createDiscount
);

/**
 * @swagger
 * /api/discounts/validate:
 *   post:
 *     summary: Validate promo code
 *     tags: [Discounts]
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
 *               - restaurantId
 *               - subtotal
 *             properties:
 *               code:
 *                 type: string
 *               restaurantId:
 *                 type: string
 *               subtotal:
 *                 type: number
 *     responses:
 *       200:
 *         description: Promo code validated with discount amount
 *       400:
 *         description: Invalid promo code or validation failed
 */
router.post(
  "/validate",
  authenticateUser,
  discountController.validateAndApplyDiscount
);

/**
 * @swagger
 * /api/discounts:
 *   get:
 *     summary: Get all promo codes
 *     tags: [Discounts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: restaurantId
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
 *         description: List of promo codes with pagination
 */
router.get("/", authenticateUser, discountController.getAllDiscounts);

/**
 * @swagger
 * /api/discounts/{id}:
 *   get:
 *     summary: Get promo code by ID
 *     tags: [Discounts]
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
 *         description: Promo code details
 *       404:
 *         description: Promo code not found
 */
router.get("/:id", authenticateUser, discountController.getDiscountById);

/**
 * @swagger
 * /api/discounts/{id}:
 *   put:
 *     summary: Update promo code (Admin only)
 *     tags: [Discounts]
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
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               usageLimit:
 *                 type: number
 *               expiryDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Promo code updated successfully
 *       404:
 *         description: Promo code not found
 */
router.put(
  "/:id",
  authenticateUser,
  authenticateAdmin,
  discountController.updateDiscount
);

/**
 * @swagger
 * /api/discounts/{id}:
 *   delete:
 *     summary: Delete promo code (Admin only)
 *     tags: [Discounts]
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
 *         description: Promo code deleted successfully
 *       404:
 *         description: Promo code not found
 */
router.delete(
  "/:id",
  authenticateUser,
  authenticateAdmin,
  discountController.deleteDiscount
);

export default router;
