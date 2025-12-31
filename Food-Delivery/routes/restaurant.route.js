import express from "express";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";
import * as restaurantController from "../controllers/restaurant.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/restaurants/search:
 *   get:
 *     summary: Search restaurants (Public)
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: cuisine
 *         schema:
 *           type: string
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxDeliveryTime
 *         schema:
 *           type: number
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [rating, deliveryTime, popularity]
 *     responses:
 *       200:
 *         description: List of restaurants
 */
router.get("/search", restaurantController.searchRestaurants);

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants (Admin only)
 *     tags: [Restaurants]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: isApproved
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of all restaurants
 */
router.get(
  "/",
  authenticateUser,
  authenticateAdmin,
  restaurantController.getAllRestaurants
);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID (Public)
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant details
 *       404:
 *         description: Restaurant not found
 */
router.get("/:id", restaurantController.getRestaurant);

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Create restaurant (Restaurant owners only)
 *     tags: [Restaurants]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - cuisineType
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               cuisineType:
 *                 type: array
 *                 items:
 *                   type: string
 *               address:
 *                 type: object
 *     responses:
 *       201:
 *         description: Restaurant created
 *       403:
 *         description: Only restaurant users can create
 */
router.post("/", authenticateUser, restaurantController.createRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Update restaurant (Owner only)
 *     tags: [Restaurants]
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
 *         description: Restaurant updated
 */
router.put("/:id", authenticateUser, restaurantController.updateRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Delete restaurant (Owner only)
 *     tags: [Restaurants]
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
 *         description: Restaurant deleted
 */
router.delete("/:id", authenticateUser, restaurantController.deleteRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}/status:
 *   patch:
 *     summary: Update restaurant status (Owner only)
 *     tags: [Restaurants]
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
 *               status:
 *                 type: string
 *                 enum: [open, closed, busy]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch(
  "/:id/status",
  authenticateUser,
  restaurantController.updateStatus
);

/**
 * @swagger
 * /api/restaurants/{id}/approve:
 *   patch:
 *     summary: Approve restaurant (Admin only)
 *     tags: [Restaurants]
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
 *         description: Restaurant approved
 */
router.patch(
  "/:id/approve",
  authenticateUser,
  authenticateAdmin,
  restaurantController.approveRestaurant
);

export default router;
