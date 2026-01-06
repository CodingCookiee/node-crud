import { User } from "../models/user.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { MenuItem } from "../models/menuItem.model.js";
import { Order } from "../models/orderManagement.model.js";
import { createError } from "../lib/createError.util.js";

export const favoriteService = {
  addFavoriteRestaurant: async (userId, restaurantId) => {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw createError(404, "Restaurant not found");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    if (user.favoriteRestaurants.includes(restaurantId)) {
      throw createError(400, "Restaurant already in favorites");
    }

    user.favoriteRestaurants.push(restaurantId);
    await user.save();

    return user;
  },

  removeFavoriteRestaurant: async (userId, restaurantId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }
    if (!user.favoriteRestaurants.includes(restaurantId)) {
      throw createError(400, "Restaurant not in favorites");
    }

    user.favoriteRestaurants = user.favoriteRestaurants.filter(
      (id) => id.toString() !== restaurantId
    );
    await user.save();

    return user;
  },

  getFavoriteRestaurants: async (userId, filters = {}) => {
    const { page = 1, limit = 10 } = filters;

    const user = await User.findById(userId).populate(
      "favoriteRestaurants",
      "name cuisineType rating deliveryTime address"
    );

    if (!user) {
      throw createError(404, "User not found");
    }

    const total = user.favoriteRestaurants.length;
    const skip = (page - 1) * limit;
    const restaurants = user.favoriteRestaurants.slice(
      skip,
      skip + Number(limit)
    );

    return {
      restaurants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  addFavoriteMenuItem: async (userId, menuItemId) => {
    const menuItem = await MenuItem.findById(menuItemId);

    if (!menuItem) {
      throw createError(404, "Menu item not found");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    if (user.favoriteMenuItems.includes(menuItemId)) {
      throw createError(400, "Menu item already in favorites");
    }

    user.favoriteMenuItems.push(menuItemId);
    await user.save();

    return user;
  },

  removeFavoriteMenuItem: async (userId, menuItemId) => {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoriteMenuItems: menuItemId } },
      { new: true }
    );

    if (!user) {
      throw createError(404, "User not found");
    }

    return user;
  },

  getFavoriteMenuItems: async (userId, filters = {}) => {
    const { page = 1, limit = 10 } = filters;

    const user = await User.findById(userId).populate({
      path: "favoriteMenuItems",
      select: "name price description image restaurantId",
      populate: { path: "restaurantId", select: "name" },
    });

    if (!user) {
      throw createError(404, "User not found");
    }

    const total = user.favoriteMenuItems.length;
    const skip = (page - 1) * limit;
    const menuItems = user.favoriteMenuItems.slice(skip, skip + Number(limit));

    return {
      menuItems,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  reorderFromHistory: async (userId, orderId) => {
    const order = await Order.findById(orderId).populate(
      "items.menuItemId",
      "name price isAvailable"
    );

    if (!order) {
      throw createError(404, "Order not found");
    }

    if (order.customerId.toString() !== userId) {
      throw createError(403, "Access denied");
    }

    if (order.status !== "delivered") {
      throw createError(400, "Can only reorder from delivered orders");
    }

    return {
      restaurantId: order.restaurantId,
      items: order.items.map((item) => ({
        menuItemId: item.menuItemId._id,
        name: item.menuItemId.name,
        price: item.menuItemId.price,
        quantity: item.quantity,
        selectedAddOns: item.selectedAddOns,
      })),
    };
  },
};
