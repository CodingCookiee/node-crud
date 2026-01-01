import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import * as categoryController from "../controllers/category.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create category (Restaurant owners only)
 *     tags: [Categories]
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
 *               - name
 *             properties:
 *               restaurantId:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               displayOrder:
 *                 type: number
 *     responses:
 *       201:
 *         description: Category created
 */
router.post("/", authenticateUser, categoryController.createCategory);

/**
 * @swagger
 * /api/categories/restaurant/{restaurantId}:
 *   get:
 *     summary: Get categories by restaurant (Public)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/restaurant/:restaurantId", categoryController.getCategoriesByRestaurant);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category (Owner only)
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               displayOrder:
 *                 type: number
 *     responses:
 *       200:
 *         description: Category updated
 */
router.put("/:id", authenticateUser, categoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category (Owner only)
 *     tags: [Categories]
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
 *         description: Category deleted
 */
router.delete("/:id", authenticateUser, categoryController.deleteCategory);

export default router;
