import { stripe } from "../config/food-stripe.config.js";
import { Order } from "../models/orderManagement.model.js";
import { User } from "../models/user.model.js";
import { createError } from "../lib/createError.util.js";

export const paymentService = {
  createPaymentIntent: async (orderId, userId) => {
    const order = await Order.findById(orderId);

    if (!order) {
      throw createError(404, "Order not found");
    }

    if (order.customerId.toString() !== userId) {
      throw createError(403, "Access denied");
    }

    if (order.paymentMethod !== "card") {
      throw createError(400, "Payment method must be card for Stripe payment");
    }

    if (order.paymentStatus !== "pending") {
      throw createError(400, "Payment already processed");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: "usd",
      metadata: {
        orderId: orderId.toString(),
        userId: userId.toString(),
      },
    });

    order.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    return {
      clientSecret: paymentIntent.client_secret,
      order,
    };
  },

  confirmPayment: async (orderId, userId) => {
    const order = await Order.findById(orderId);

    if (!order) {
      throw createError(404, "Order not found");
    }

    if (order.customerId.toString() !== userId) {
      throw createError(403, "Access denied");
    }

    order.paymentStatus = "paid";
    await order.save();

    return order;
  },

  processRefund: async (orderId, adminId) => {
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      throw createError(403, "Only admins can process refunds");
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw createError(404, "Order not found");
    }

    if (order.status !== "cancelled") {
      throw createError(400, "Only cancelled orders can be refunded");
    }

    if (order.paymentStatus === "refunded") {
      throw createError(400, "Order already refunded");
    }

    if (order.paymentStatus !== "paid") {
      throw createError(400, "Order payment not completed");
    }

    if (order.paymentMethod === "card" && order.stripePaymentIntentId) {
      await stripe.refunds.create({
        payment_intent: order.stripePaymentIntentId,
      });
    }

    order.paymentStatus = "refunded";
    await order.save();

    return order;
  },

  processDriverPayout: async (driverId, amount, adminId) => {
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      throw createError(403, "Only admins can process payouts");
    }

    const driver = await User.findById(driverId);
    if (!driver || driver.role !== "driver") {
      throw createError(404, "Driver not found");
    }

    driver.driverDetails.totalEarnings += amount;
    await driver.save();

    return {
      message: "Payout processed successfully",
      driver: {
        id: driver._id,
        name: driver.name,
        totalEarnings: driver.driverDetails.totalEarnings,
      },
    };
  },

  getPaymentHistory: async (userId, userRole, filters = {}) => {
    const { paymentStatus, page = 1, limit = 10 } = filters;

    let query = {};

    if (userRole === "customer") {
      query.customerId = userId;
    } else if (userRole !== "admin") {
      throw createError(403, "Access denied");
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate("customerId", "name email")
      .populate("restaurantId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    return {
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },
};
