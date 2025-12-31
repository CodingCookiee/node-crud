import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { createError } from "../lib/createError.util.js";

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.userId;

    const product = await Product.findById(productId);

    if (!product) {
      throw createError(404, "Product not found");
    }

    // check stock availability
    if (product.stock < quantity) {
      throw createError(400, "Insufficient stock");
    }

    // create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // check if item already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      // check if new quantity exceeds stock
      if (existingItem.quantity > product.stock) {
        throw createError(400, "Insufficient stock");
      }
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    // calculate totals and save
    cart.calculateTotals();
    await cart.save();
    await cart.populate("items.product", "name price images");
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price images"
    );

    // check if cart exists
    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [], subtotal: 0, tax: 0, total: 0 },
      });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    //  extract data
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.userId;

    //  validate quantity
    if (quantity < 1) {
      throw createError(400, "Quantity must be at least 1.");
    }

    // find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw createError(404, "Cart not found.");
    }

    // find items in Cart
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) {
      throw createError(404, "Item not found in cart.");
    }

    //  validate stock
    const product = await Product.findById(productId);
    if (!product) {
      throw createError(404, "Product not found.");
    }
    if (product.stock < quantity) {
      throw createError(400, "Insufficient stock.");
    }

    // update quantity
    item.quantity = quantity;

    //  calculate totals and save
    cart.calculateTotals();
    await cart.populate("items.product", "name price images");
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    //  find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw createError(404, "Cart not found.");
    }

    //  find item index
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      throw createError(404, "Item not found in cart.");
    }

    // remove item
    cart.items.splice(itemIndex, 1);

    //  calculate total and save
    cart.calculateTotals();
    await cart.save();
    await cart.populate("items.product", "name price images");

    //  return cart
    res.status(200).json({
      success: true,
      data: cart,
      message: "Item removed from cart",
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw createError(404, "Cart not found.");
    }

    cart.items = [];

    //  reset totals and save
    cart.subtotal = 0;
    cart.tax = 0;
    cart.total = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
      message: "Cart cleared",
    });
  } catch (error) {
    next(error);
  }
};
