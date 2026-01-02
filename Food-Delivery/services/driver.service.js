import { User } from "../models/user.model.js";
import { Order } from "../models/orderManagement.model.js";
import { createError } from "../lib/createError.util.js";

export const driverService = {
  updateDriverProfile: async (userId, profileData) => {
    const user = await User.findById(userId);
    if (!user || user.role !== "driver") {
      throw createError(403, "Only drivers can update driver profile");
    }

    if (profileData.vehicleType) {
      user.driverDetails.vehicleType = profileData.vehicleType;
    }
    if (profileData.licenseNumber) {
      user.driverDetails.licenseNumber = profileData.licenseNumber;
    }

    await user.save();
    return user;
  },

  toggleAvailability: async (userId) => {
    const user = await User.findById(userId);
    if (!user || user.role !== "driver") {
      throw createError(403, "Only drivers can toggle availability");
    }

    if (!user.driverDetails.isApproved) {
      throw createError(403, "Driver must be approved first");
    }

    user.driverDetails.isAvailable = !user.driverDetails.isAvailable;
    await user.save();
    return user;
  },

  updateLocation: async (userId, lat, lng) => {
    const user = await User.findById(userId);
    if (!user || user.role !== "driver") {
      throw createError(403, "Only drivers can update location");
    }

    user.driverDetails.currentLocation = { lat, lng };
    await user.save();
    return user;
  },

  getAssignedOrders: async (userId, filters = {}) => {
    const user = await User.findById(userId);
    if (!user || user.role !== "driver") {
      throw createError(403, "Only drivers can view assigned orders");
    }

    const { status, page = 1, limit = 10 } = filters;

    const query = { driverId: userId };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate("customerId", "name phone")
      .populate("restaurantId", "name address")
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

  acceptOrder: async (userId, orderId) => {
    const order = await Order.findById(orderId);
    if (!order) {
      throw createError(404, "Order not found");
    }

    if (order.driverId?.toString() !== userId) {
      throw createError(403, "This order is not assigned to you");
    }

    if (order.status !== "ready") {
      throw createError(400, "Order must be ready to accept");
    }

    order.status = "picked_up";
    await order.save();
    return order;
  },

  rejectOrder: async (userId, orderId) => {
    const order = await Order.findById(orderId);
    if (!order) {
      throw createError(404, "Order not found");
    }

    if (order.driverId?.toString() !== userId) {
      throw createError(403, "This order is not assigned to you");
    }

    if (order.status !== "ready") {
      throw createError(400, "Can only reject orders that are ready");
    }

    order.driverId = null;
    await order.save();
    return order;
  },

  markOrderPickedUp: async (userId, orderId) => {
    const order = await Order.findById(orderId);
    if (!order) {
      throw createError(404, "Order not found");
    }

    if (order.driverId?.toString() !== userId) {
      throw createError(403, "This order is not assigned to you");
    }

    if (order.status !== "ready") {
      throw createError(400, "Order must be ready to pick up");
    }

    order.status = "picked_up";
    await order.save();
    return order;
  },

  markOrderDelivered: async (userId, orderId) => {
    const order = await Order.findById(orderId);
    if (!order) {
      throw createError(404, "Order not found");
    }

    if (order.driverId?.toString() !== userId) {
      throw createError(403, "This order is not assigned to you");
    }

    if (order.status !== "on_the_way") {
      throw createError(400, "Order must be on the way to mark as delivered");
    }

    order.status = "delivered";
    await order.save();

    const driver = await User.findById(userId);
    driver.driverDetails.totalEarnings += order.deliveryFee;
    await driver.save();

    return order;
  },
};
