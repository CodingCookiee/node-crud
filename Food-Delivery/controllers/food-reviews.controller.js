import { reviewService } from "../services/food-reviews.service.js";

export const createReview = async (req, res, next) => {
  try {
    const result = await reviewService.createReview(req.user.userId, req.body);
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getRestaurantReviews = async (req, res, next) => {
  try {
    const result = await reviewService.getRestaurantReviews(
      req.params.id,
      req.query
    );
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getDriverReviews = async (req, res, next) => {
  try {
    const result = await reviewService.getDriverReviews(
      req.params.id,
      req.query
    );
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyReviews = async (req, res, next) => {
  try {
    const result = await reviewService.getMyReviews(req.user.userId, req.query);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
