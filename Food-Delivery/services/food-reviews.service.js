import { Review } from "../models/food-reviews.model.js";
import { Order } from "../models/orderManagement.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { User } from "../models/user.model.js";
import { createError } from "../lib/createError.util.js";

const updateRestaurantRating = async (restaurantId, newRating) => {
  const restaurant = await Restaurant.findById(restaurantId);
  const currentAvg = restaurant.rating.average;
  const currentCount = restaurant.rating.count;

  const newAvg = (currentAvg * currentCount + newRating) / (currentCount + 1);

  restaurant.rating.average = newAvg;
  restaurant.rating.count = currentCount + 1;
  await restaurant.save();
};

const updateDriverRating = async (driverId, newRating) => {
  const driver = await User.findById(driverId);
  const currentAvg = driver.driverDetails.rating.average;
  const currentCount = driver.driverDetails.rating.count;

  const newAvg = (currentAvg * currentCount + newRating) / (currentCount + 1);

  driver.driverDetails.rating.average = newAvg;
  driver.driverDetails.rating.count = currentCount + 1;
  await driver.save();
};

export const reviewService = {
  createReview: async (userId, reviewData) => {
    const {
      orderId,
      restaurantRating,
      restaurantComment,
      driverRating,
      driverComment,
    } = reviewData;

    const order = await Order.findById(orderId);
    if (!order) {
      throw createError(404, "Order not found");
    }

    if (order.customerId.toString() !== userId) {
      throw createError(403, "You are not authorized to review this order");
    }

    if (order.status !== "delivered") {
      throw createError(400, "Can only review delivered orders");
    }

    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      throw createError(400, "Review already exists for this order");
    }

    const review = new Review({
      orderId,
      customerId: userId,
      restaurantId: order.restaurantId,
      driverId: order.driverId,
      restaurantRating,
      restaurantComment,
      driverRating,
      driverComment,
    });

    await updateRestaurantRating(order.restaurantId, restaurantRating);

    if (driverRating && order.driverId) {
      await updateDriverRating(order.driverId, driverRating);
    }

    await review.save();
    return review;
  },
  getRestaurantReviews: async (restaurantId, filters = {}) => {
    const { page = 1, limit = 10 } = filters;

    const query = { restaurantId };
    const skip = (page - 1) * limit;

    const reviews = await Review.find(query)
      .populate("customerId", "name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments(query);

    return {
      reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  getDriverReviews: async (driverId, filters = {}) => {
    const { page = 1, limit = 10 } = filters;

    const query = { driverId, driverRating: { $exists: true } };
    const skip = (page - 1) * limit;

    const reviews = await Review.find(query)
      .populate("customerId", "name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments(query);

    return {
      reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  getMyReviews: async (userId, filters = {}) => {
    const { page = 1, limit = 10 } = filters;

    const query = { customerId: userId };
    const skip = (page - 1) * limit;

    const reviews = await Review.find(query)
      .populate("restaurantId", "name")
      .populate("driverId", "name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments(query);

    return {
      reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },
};
