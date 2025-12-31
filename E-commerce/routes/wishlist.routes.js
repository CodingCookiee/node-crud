import express from "express";
import {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlist.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Product added to wishlist
 *       400:
 *         description: Product already in wishlist
 */
router.post("/", authenticateUser, addToWishlist);

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get user wishlist
 *     tags: [Wishlist]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User wishlist retrieved
 */
router.get("/", authenticateUser, getUserWishlist);

/**
 * @swagger
 * /api/wishlist/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 */
router.delete("/:productId", authenticateUser, removeFromWishlist);

/**
 * @swagger
 * /api/wishlist:
 *   delete:
 *     summary: Clear entire wishlist
 *     tags: [Wishlist]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Wishlist cleared successfully
 */
router.delete("/", authenticateUser, clearWishlist);

export default router;
