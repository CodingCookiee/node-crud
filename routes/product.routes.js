import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
} from "../controllers/product.controller.js";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin only routes
router.post("/", authenticateUser, authenticateAdmin, createProduct);
router.put("/:id", authenticateUser, authenticateAdmin, updateProduct);
router.delete("/:id", authenticateUser, authenticateAdmin, deleteProduct);
router.patch("/:id/stock", authenticateUser, authenticateAdmin, updateStock);

export default router;
