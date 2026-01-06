import { favoriteService } from "../services/favorite.service.js";

export const addFavoriteRestaurant = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { restaurantId } = req.body;

    const result = await favoriteService.addFavoriteRestaurant(
      userId,
      restaurantId
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFavoriteRestaurant = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const restaurantId = req.params.id;

    const result = await favoriteService.removeFavoriteRestaurant(
      userId,
      restaurantId
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getFavoriteRestaurants = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await favoriteService.getFavoriteRestaurants(
      userId,
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

export const addFavoriteMenuItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { menuItemId } = req.body;

    const result = await favoriteService.addFavoriteMenuItem(
      userId,
      menuItemId
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFavoriteMenuItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const menuItemId = req.params.id;

    const result = await favoriteService.removeFavoriteMenuItem(
      userId,
      menuItemId
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getFavoriteMenuItems = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await favoriteService.getFavoriteMenuItems(
      userId,
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

export const reorderFromHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const result = await favoriteService.reorderFromHistory(userId, orderId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
