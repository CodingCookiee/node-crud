import { menuItemService } from "../services/menuItem.service.js";

export const createMenuItem = async (req, res, next) => {
  try {
    const item = await menuItemService.createMenuItem(
      req.user.userId,
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const getMenuItemsByRestaurant = async (req, res, next) => {
  try {
    const items = await menuItemService.getMenuItemsByRestaurant(
      req.params.restaurantId,
      req.query
    );
    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const getMenuItem = async (req, res, next) => {
  try {
    const item = await menuItemService.getMenuItemById(req.params.id);
    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const item = await menuItemService.updateMenuItem(
      req.params.id,
      req.user.userId,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleAvailability = async (req, res, next) => {
  try {
    const item = await menuItemService.toggleAvailability(
      req.params.id,
      req.user.userId
    );
    res.status(200).json({
      success: true,
      message: "Availability toggled successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    await menuItemService.deleteMenuItem(req.params.id, req.user.userId);
    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
