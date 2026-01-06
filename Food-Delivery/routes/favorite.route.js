import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import * as favoriteController from "../controllers/favorite.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/favorites/restaurants:
 *   post:
 *     summary: Add restaurant to favorites
 *     tags: [Favorites]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantId
 *             properties:
 *               restaurantId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Restaurant added to favorites
 *       400:
 *         description: Restaurant already in favorites
 */
router.post(
  "/restaurants",
  authenticateUser,
  favoriteController.addFavoriteRestaurant
);

/**
 * @swagger
 * /api/favorites/restaurants/{id}:
 *   delete:
 *     summary: Remove restaurant from favorites
 *     tags: [Favorites]
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
 *         description: Restaurant removed from favorites
 */
router.delete(
  "/restaurants/:id",
  authenticateUser,
  favoriteController.removeFavoriteRestaurant
);

/**
 * @swagger
 * /api/favorites/restaurants:
 *   get:
 *     summary: Get favorite restaurants
 *     tags: [Favorites]
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
 *         description: List of favorite restaurants with pagination
 */
router.get(
  "/restaurants",
  authenticateUser,
  favoriteController.getFavoriteRestaurants
);

/**
 * @swagger
 * /api/favorites/menu-items:
 *   post:
 *     summary: Add menu item to favorites
 *     tags: [Favorites]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menuItemId
 *             properties:
 *               menuItemId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Menu item added to favorites
 *       400:
 *         description: Menu item already in favorites
 */
router.post(
  "/menu-items",
  authenticateUser,
  favoriteController.addFavoriteMenuItem
);

/**
 * @swagger
 * /api/favorites/menu-items/{id}:
 *   delete:
 *     summary: Remove menu item from favorites
 *     tags: [Favorites]
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
 *         description: Menu item removed from favorites
 */
router.delete(
  "/menu-items/:id",
  authenticateUser,
  favoriteController.removeFavoriteMenuItem
);

/**
 * @swagger
 * /api/favorites/menu-items:
 *   get:
 *     summary: Get favorite menu items
 *     tags: [Favorites]
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
 *         description: List of favorite menu items with pagination
 */
router.get(
  "/menu-items",
  authenticateUser,
  favoriteController.getFavoriteMenuItems
);

/**
 * @swagger
 * /api/favorites/reorder/{id}:
 *   post:
 *     summary: Reorder from order history
 *     tags: [Favorites]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order items ready to add to cart
 *       400:
 *         description: Can only reorder from delivered orders
 *       403:
 *         description: Access denied
 */
router.post(
  "/reorder/:id",
  authenticateUser,
  favoriteController.reorderFromHistory
);

export default router;
