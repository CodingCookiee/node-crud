import { Category } from "../models/category.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { createError } from "../lib/createError.util.js";

export const categoryService = {
  createCategory: async (ownerId, categoryData) => {
    const restaurant = await Restaurant.findById(categoryData.restaurantId);
    if (!restaurant) {
      throw createError(404, "Restaurant not found");
    }

    if (restaurant.ownerId.toString() !== ownerId) {
      throw createError(
        403,
        "You can only create categories for your own restaurant"
      );
    }

    const category = new Category(categoryData);
    await category.save();
    return category;
  },
  getCategoriesByRestaurant: async (restaurantId) => {
    const categories = await Category.find({
      restaurantId,
      isActive: true,
    }).sort({ displayOrder: 1 });

    return categories;
  },
  updateCategory: async (categoryId, ownerId, updateData) => {
    const category = await Category.findById(categoryId).populate("restaurantId");
    if(!category){
        throw createError(404, "Category not found");
    }
    if(category.restaurantId.ownerId.toString() !== ownerId){
        throw createError(403, "You can only update your own categories")
    }

    Object.assign(category, updateData);
    await category.save();
    return category
  },
  deleteCategory: async (categoryId, ownerId) => {
    const category = await Category.findById(categoryId).populate("restaurantId");
    if(!category){
        throw createError(404, "Category not found");
    }
    if(category.restaurantId.ownerId.toString() !== ownerId){
        throw createError(403, "You can only delete your own categories")
    }
    category.isActive = false;
    await category.save();
    return category;
  }
};
