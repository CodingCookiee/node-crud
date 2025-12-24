import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

//  add to cart
router.post("/", authenticateUser, addToCart);
//  get cart
router.get("/", authenticateUser, getCart);
//  update cart item
router.put("/:productId", authenticateUser, updateCartItem);
//  remove from cart
router.delete("/:productId", authenticateUser, removeFromCart);
//  clear cart
router.delete("/", authenticateUser, clearCart);

export default router;
