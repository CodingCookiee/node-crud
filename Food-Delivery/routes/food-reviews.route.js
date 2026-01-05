import express from "express";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";
import * as reviewController from "../controllers/food-reviews.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create review for delivered order
 *     tags: [Reviews]
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
 *               - restaurantRating
 *             properties:
 *               orderId:
 *                 type: string
 *               restaurantRating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               restaurantComment:
 *                 type: string
 *               driverRating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               driverComment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Can only review delivered orders or review already exists
 */
router.post("/", authenticateUser, reviewController.createReview);

/**
 * @swagger
 * /api/reviews/restaurant/{id}:
 *   get:
 *     summary: Get restaurant reviews (Public)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *         description: Restaurant reviews with pagination
 */
router.get("/restaurant/:id", reviewController.getRestaurantReviews);

/**
 * @swagger
 * /api/reviews/driver/{id}:
 *   get:
 *     summary: Get driver reviews (Public)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *         description: Driver reviews with pagination
 */
router.get("/driver/:id", reviewController.getDriverReviews);

/**
 * @swagger
 * /api/reviews/my-reviews:
 *   get:
 *     summary: Get my reviews
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     parameters:
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
 *         description: User's reviews with pagination
 */
router.get("/my-reviews", authenticateUser, reviewController.getMyReviews);

export default router;
