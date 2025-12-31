import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { createError } from "../lib/createError.util.js";

export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.userId;

    //  validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(createError(404, "Product not found"));
    }

    // check if the user has purchased the product
    const hasPurchased = await Order.findOne({
      user: userId,
      "items.product": productId,
      orderStatus: { $in: ["delivered", "shipped"] },
    });
    if (!hasPurchased) {
      return next(
        createError(403, "You must purchase the product to review it")
      );
    }
    //  check if user already reviewed the product
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      throw createError(400, "You have already reviewed this product.");
    }

    // create new review
    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    //  update product ratings
    const reviews = await Review.find({ product: productId });
    const avgRating =
      reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;

    product.averageRating = avgRating;
    product.numReviews = reviews.length;
    await product.save();

    //  populate & return
    await review.populate("user", "name");
    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments({ product: productId });

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    const review = await Review.findById(id);
    if (!review) {
      throw createError(404, "Review not found");
    }

    //  validate ownership
    if (review.user.toString() !== userId) {
      throw createError(403, "You are not authorized to update this review");
    }

    //  update Review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    // recalculate product rating
    const reviews = await Review.find({ product: review.product });
    const avgRating =
      reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(review.product, {
      averageRating: avgRating,
      numReviews: reviews.length,
    });

    //    populate and return
    await review.populate("user", "name");
    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    //  find review
    const review = await Review.findById(id);
    if (!review) {
      throw createError(404, "Review not found");
    }

    //  validate user ownership( user can delete own review, admin can delete any)
    if (review.user.toString() !== userId && userRole !== "admin") {
      throw createError(403, "Access denied");
    }

    //  store product id before deletion
    const productId = review.product;

    //  delete review
    await Review.findByIdAndDelete(id);

    // recalculate product rating
    const reviews = await Review.find({ product: productId });

    if (reviews.length > 0) {
      const avgRating =
        reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;
      await Product.findByIdAndUpdate(productId, {
        averageRating: avgRating,
        numReviews: reviews.length,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        numReviews: 0,
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};
