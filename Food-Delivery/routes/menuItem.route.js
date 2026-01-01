import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import * as menuItemController from "../controllers/menuitem.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/menu-items:
 *   post:
 *     summary: Create menu item (Restaurant owners only)
 *     tags: [Menu Items]
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
 *               - categoryId
 *               - name
 *               - description
 *               - price
 *             properties:
 *               restaurantId:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               dietaryTags:
 *                 type: array
 *                 items:
 *                   type: string
 *               addOns:
 *                 type: array
 *                 items:
 *                   type: object
 *               preparationTime:
 *                 type: number
 *     responses:
 *       201:
 *         description: Menu item created
 */
router.post("/", authenticateUser, menuItemController.createMenuItem);

/**
 * @swagger
 * /api/menu-items/restaurant/{restaurantId}:
 *   get:
 *     summary: Get menu items by restaurant (Public)
 *     tags: [Menu Items]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: dietaryTags
 *         schema:
 *           type: string
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of menu items
 */
router.get("/restaurant/:restaurantId", menuItemController.getMenuItemsByRestaurant);

/**
 * @swagger
 * /api/menu-items/{id}:
 *   get:
 *     summary: Get menu item by ID (Public)
 *     tags: [Menu Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item details
 */
router.get("/:id", menuItemController.getMenuItem);

/**
 * @swagger
 * /api/menu-items/{id}:
 *   put:
 *     summary: Update menu item (Owner only)
 *     tags: [Menu Items]
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
 *         description: Menu item updated
 */
router.put("/:id", authenticateUser, menuItemController.updateMenuItem);

/**
 * @swagger
 * /api/menu-items/{id}/availability:
 *   patch:
 *     summary: Toggle item availability (Owner only)
 *     tags: [Menu Items]
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
 *         description: Availability toggled
 */
router.patch("/:id/availability", authenticateUser, menuItemController.toggleAvailability);

/**
 * @swagger
 * /api/menu-items/{id}:
 *   delete:
 *     summary: Delete menu item (Owner only)
 *     tags: [Menu Items]
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
 *         description: Menu item deleted
 */
router.delete("/:id", authenticateUser, menuItemController.deleteMenuItem);

export default router;
