import { restaurantService } from "../services/restaurant.service.js";

export const createRestaurant = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.createRestaurant(
      req.user.userId,
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.updateRestaurant(
      req.params.id,
      req.user.userId,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRestaurant = async (req, res, next) => {
  try {
    await restaurantService.deleteRestaurant(req.params.id, req.user.userId);
    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.updateRestaurantStatus(
      req.params.id,
      req.user.userId,
      req.body.status
    );
    res.status(200).json({
      success: true,
      message: "Restaurant status updated",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const searchRestaurants = async (req, res, next) => {
  try {
    const result = await restaurantService.searchRestaurants(req.query);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRestaurants = async (req, res, next) => {
  try {
    const result = await restaurantService.getAllRestaurants(req.query);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const approveRestaurant = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.approveRestaurant(req.params.id);
    res.status(200).json({
      success: true,
      message: "Restaurant approved successfully",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};
