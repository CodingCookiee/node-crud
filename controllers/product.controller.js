import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { createError } from "../lib/createError.util.js";

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, images, stock, category, subcategory } =
      req.body;

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      throw createError(404, "Category not found.");
    }

    const product = await Product.create({
      name,
      description,
      price,
      images,
      stock,
      category,
      subcategory,
    });

    const populatedProduct = await Product.findById(product._id).populate(
      "category",
      "name slug"
    );

    res.status(201).json({
      success: true,
      data: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;
    //  build filter object
    const filter = {};

    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (inStock === "true") filter.stock = { $gt: 0 };

    //  build sort object
    const sort = {};
    sort[sortBy] = order === "asc" ? 1 : -1;
    // calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    //  query products
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    // return response
    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        limit: Number(limit),
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate(
      "category",
      "name slug"
    );

    if (!product) {
      throw createError(404, "Product not found");
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, images, stock, category, subcategory } =
      req.body;

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        throw createError(404, "Category not found.");
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, price, images, stock, category, subcategory },
      { new: true, runValidators: true }
    ).populate("category", "name slug");

    if (!product) {
      throw createError(404, "Product not found");
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw createError(404, "Product not found");
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, operation } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      throw createError(404, "Product not found");
    }

    if (operation === "add") {
      product.stock += Number(quantity);
    } else if (operation === "subtract") {
      product.stock -= Number(quantity);
    } else {
      throw createError(400, 'Invalid operation, use "add" or "subtract"');
    }

    if (product.stock < 0) {
      throw createError(400, "Insufficient stock");
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
