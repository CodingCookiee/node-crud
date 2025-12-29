import { Wishlist } from "../models/wishlist.model.js";
import { Product } from "../models/product.model.js";
import { createError } from "../lib/createError.util.js";

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    const product = await Product.findById(productId);
    if (!product) {
      throw createError(404, "Product not found");
    }

    //  find or create wishlist
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    //  check if the product already in wishlist
    if (wishlist.products.includes(productId)) {
      throw createError(400, "Product already in wishlist.");
    }

    // add product to wishlist
    wishlist.products.push(productId);
    await wishlist.save();

    //  populate and return
    await wishlist.populate("products", "name price images averageRating");
    res.status(200).json({
      success: true,
      message: "Product added to wishlist.",
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserWishlist = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    //  find wishlist
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products",
      "name price images averageRating"
    );

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: { user: userId, products: [] },
      });
    }

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    // find wishlist
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      throw createError(404, "Wishlist not found");
    }

    //  check if product in wishlist
    if (!wishlist.products.includes(productId)) {
      throw createError(404, "Product not in wishlist");
    }

    //  remove product
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    await wishlist.save();

    // populate and return
    await wishlist.populate("products", "name price images averageRating");
    res.status(200).json({
      success: true,
      message: "Product removed from wishlist.",
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export const clearWishlist = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      throw createError(404, "Wishlist not found");
    }

    //  clear products
    wishlist.products = [];
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};
