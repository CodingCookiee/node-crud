import { discountService } from "../services/discount.service.js";

export const createDiscount = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const discountData = req.body;

    const result = await discountService.createDiscount(adminId, discountData);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const validateAndApplyDiscount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { code, restaurantId, subtotal } = req.body;

    const result = await discountService.validateAndApplyDiscount(
      code,
      userId,
      restaurantId,
      subtotal
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const incrementUsage = async (req, res, next) => {
  try {
    const discountId = req.params.id;
    const result = await discountService.incrementUsage(discountId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDiscounts = async (req, res, next) => {
  try {
    const result = await discountService.getAllDiscounts(req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getDiscountById = async (req, res, next) => {
  try {
    const discountId = req.params.id;

    const result = await discountService.getDiscountById(discountId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDiscount = async (req, res, next) => {
  try {
    const discountId = req.params.id;
    const updateData = req.body;

    const result = await discountService.updateDiscount(discountId, updateData);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDiscount = async (req, res, next) => {
  try {
    await discountService.deleteDiscount(req.params.id);
    res.status(200).json({
      success: true,
      message: "Promo code deleted",
    });
  } catch (error) {
    next(error);
  }
};
