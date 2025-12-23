import express from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route
router.get("/", getAllCategories);

// Admin only routes
router.post("/", authenticateUser, authenticateAdmin, createCategory);
router.put("/:id", authenticateUser, authenticateAdmin, updateCategory);
router.delete("/:id", authenticateUser, authenticateAdmin, deleteCategory);

export default router;
