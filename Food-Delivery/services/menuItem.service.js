import { MenuItem } from "../models/menuItem.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { Category } from "../models/category.model.js";
import { createError } from "../lib/createError.util.js";

export const menuItemService = {
  createMenuItem: async (ownerId, itemData) => {
    const restaurant = await Restaurant.findById(itemData.restaurantId);
    if (!restaurant) {
      throw createError(404, "Restaurant not found");
    }
    if (restaurant.ownerId.toString() !== ownerId) {
      throw createError(
        403,
        "You can only create items for your own restaurant"
      );
    }

    const category = await Category.findById(itemData.categoryId);
    if (
      !category ||
      category.restaurantId.toString() !== itemData.restaurantId
    ) {
      throw createError(
        404,
        "Category not found or doesn't belong to this restaurant"
      );
    }

    const menuItem = new MenuItem(itemData);
    await menuItem.save();
    return menuItem;
  },
  getMenuItemsByRestaurant: async (restaurantId, filters = {}) => {
    const { categoryId, dietaryTags, isAvailable, search } = filters;

    const query = {
      restaurantId,
      isActive: true,
    };

    if (categoryId) query.categoryId = categoryId;
    if (isAvailable !== undefined) query.isAvailable = isAvailable;
    if (dietaryTags) {
      query.dietaryTags = {
        $in: Array.isArray(dietaryTags) ? dietaryTags : [dietaryTags],
      };
    }
    if (search) {
      query.$text = { $search: search };
    }

    const items = await MenuItem.find(query)
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    return items;
  },

  getMenuItemById: async (itemId) => {
    const item = await MenuItem.findById(itemId)
      .populate("categoryId", "name")
      .populate("restaurantId", "name");
    if (!item) throw createError(404, "Menu item not found");
    return item;
  },

  updateMenuItem: async (itemId, ownerId, updateData) => {
    const item = await MenuItem.findById(itemId).populate("restaurantId");
    if (!item) throw createError(404, "Menu item not found");
    if (item.restaurantId.ownerId.toString() !== ownerId) {
      throw createError(403, "You can only update your own menu items");
    }
    Object.assign(item, updateData);
    await item.save();
    return item;
  },
  toggleAvailability: async (itemId, ownerId) => {
    const item = await MenuItem.findById(itemId).populate("restaurantId");
    if (!item) throw createError(404, "Menu item not found");
    if (item.restaurantId.ownerId.toString() !== ownerId) {
      throw createError(403, "You can only update your own menu items");
    }
    item.isAvailable = !item.isAvailable;
    await item.save();
    return item;
  },
  deleteMenuItem: async (itemId, ownerId) => {
    const item = await MenuItem.findById(itemId).populate("restaurantId");
    if (!item) {
      throw createError(404, "Menu item not found");
    }
    if (item.restaurantId.ownerId.toString() !== ownerId) {
      throw createError(403, "You are not authorized to delete this menu item");
    }

    item.isActive = false;

    await item.save();
    return { message: "Menu item deleted" };
  },
};
