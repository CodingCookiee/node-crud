import express from "express";
import {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlist.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, addToWishlist);
router.get("/", authenticateUser, getUserWishlist);
router.delete("/:productId", authenticateUser, removeFromWishlist);
router.delete("/", authenticateUser, clearWishlist);

export default router;
