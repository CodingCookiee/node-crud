import express from "express";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, createReview);
router.get("/product/:productId", getProductReviews);
router.put("/:id", authenticateUser, updateReview);
router.delete("/:id", authenticateUser, deleteReview);

export default router;
