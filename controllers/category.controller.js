import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { createError } from "../lib/createError.util.js";

export const createCategory = async (req, res, next) => {
  try {
    const { name, subcategories } = req.body;

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      throw createError(400, "Category already exists");
    }

    const category = await Category.create({
      name,
      subcategories,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

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
    const { id } = req.params;
    const { name, subcategories } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, subcategories },
      { new: true, runValidators: true }
    );

    if (!category) {
      throw createError(404, "Category not found");
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const productCount = await Product.countDocuments({ category: id });

    if (productCount > 0) {
      throw createError(400, "Cannot delete category with existing products");
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw createError(404, "Category not found");
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
