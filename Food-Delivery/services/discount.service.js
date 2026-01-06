import { Discount } from "../models/discount.model.js";
import { Order } from "../models/orderManagement.model.js";
import { createError } from "../lib/createError.util.js";

export const discountService = {
  createDiscount: async (adminId, discountData) => {
    const discount = new Discount(discountData);
    await discount.save();
    return discount;
  },

  validateAndApplyDiscount: async (code, userId, restaurantId, subtotal) => {
    const discount = await Discount.findOne({ code: code.toUpperCase() });

    if (!discount) {
      throw createError(404, "Invalid promo code");
    }

    if (!discount.isActive) {
      throw createError(400, "Promo code is inactive");
    }

    if (new Date() > discount.expiryDate) {
      throw createError(400, "Promo code has expired");
    }

    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      throw createError(400, "Promo code usage limit reached");
    }

    if (discount.restaurantId && discount.restaurantId.toString() !== restaurantId) {
      throw createError(400, "Promo code not valid for this restaurant");
    }

    if (subtotal < discount.minOrderAmount) {
      throw createError(
        400,
        `Minimum order amount of $${discount.minOrderAmount} required`
      );
    }

    if (discount.isFirstTimeOnly) {
      const orderCount = await Order.countDocuments({
        customerId: userId,
        status: "delivered",
      });
      if (orderCount > 0) {
        throw createError(400, "Promo code is for first-time users only");
      }
    }

    let discountAmount = 0;
    if (discount.discountType === "percentage") {
      discountAmount = (subtotal * discount.discountValue) / 100;
      if (discount.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, discount.maxDiscountAmount);
      }
    } else {
      discountAmount = discount.discountValue;
    }

    discountAmount = Math.round(discountAmount * 100) / 100;

    return {
      code: discount.code,
      discountAmount,
      discountId: discount._id,
    };
  },

  incrementUsage: async (discountId) => {
    await Discount.findByIdAndUpdate(discountId, { $inc: { usedCount: 1 } });
  },

  getAllDiscounts: async (filters = {}) => {
    const { isActive, restaurantId, page = 1, limit = 20 } = filters;

    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive;
    }
    if (restaurantId) {
      query.restaurantId = restaurantId;
    }

    const skip = (page - 1) * limit;

    const discounts = await Discount.find(query)
      .populate("restaurantId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Discount.countDocuments(query);

    return {
      discounts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  getDiscountById: async (discountId) => {
    const discount = await Discount.findById(discountId).populate(
      "restaurantId",
      "name"
    );

    if (!discount) {
      throw createError(404, "Promo code not found");
    }

    return discount;
  },

  updateDiscount: async (discountId, updateData) => {
    const discount = await Discount.findByIdAndUpdate(discountId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!discount) {
      throw createError(404, "Promo code not found");
    }

    return discount;
  },
  deleteDiscount: async (discountId) => {
    const discount = await Discount.findByIdAndDelete(discountId);

    if (!discount) {
      throw createError(404, "Promo code not found");
    }

    return discount;
  },
};
