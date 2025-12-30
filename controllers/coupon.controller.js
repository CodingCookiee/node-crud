import { Coupon } from "../models/coupon.model.js";
import { createError } from "../lib/createError.util.js";

export const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      expiryDate,
    } = req.body;

    //  check if coupon already exist
    const existingCoupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });
    if (existingCoupon) {
      throw createError(400, "Coupon code already exists");
    }

    //   create coupon
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      expiryDate,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

export const applyCoupon = async (req, res, next) => {
  try {
    //  extract data
    const { code, cartTotal } = req.body;

    //  find coupon
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (!coupon) {
      throw createError(404, "Invalid coupon code");
    }

    //  validate coupon
    if (!coupon.isActive) {
      throw createError(400, "Coupon is inactive");
    }
    if (new Date() > coupon.expiryDate) {
      throw createError(400, "Coupon has expired");
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      throw createError(400, "Coupon usage limit has reached");
    }
    if (cartTotal < coupon.minOrderAmount) {
      throw createError(
        400,
        `Minimum order amount is ${coupon.minOrderAmount}`
      );
    }

    //  calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100;

      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
    }

    // Increment usage count
    coupon.usedCount += 1;
    await coupon.save();

    //  return discount details
    res.status(200).json({
      success: true,
      data: {
        couponId: coupon._id,
        code: coupon.code,
        discountAmount: discount,
        finalTotal: cartTotal - discount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCoupons = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    //  find coupons
    const coupons = await Coupon.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Coupon.countDocuments();

    res.status(200).json({
      success: true,
      data: coupons,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const coupon = await Coupon.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      throw createError(404, " Coupon not found");
    }

    res.status(200).json({
      success: true,
      message: "Coupon updated",
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      throw createError(404, " Coupon not found");
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted",
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};
