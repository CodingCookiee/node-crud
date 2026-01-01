import { categoryService } from "../services/category.service.js";

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(
      req.user.userId,
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoriesByRestaurant = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategoriesByRestaurant(
      req.params.restaurantId
    );
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.user.userId,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id, req.user.userId);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
