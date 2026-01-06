import { User } from "../models/user.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { Order } from "../models/orderManagement.model.js";
import { createError } from "../lib/createError.util.js";

export const adminService = {
  getAllUsers: async (filters = {}) => {
    const { role, isActive, page = 1, limit = 20 } = filters;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive;

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    return {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  getUserById: async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw createError(404, "User not found");
    }
    return user;
  },

  updateUser: async (userId, updateData) => {
    delete updateData.password;
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) {
      throw createError(404, "User not found");
    }
    return user;
  },

  deleteUser: async (userId) => {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );
    if (!user) {
      throw createError(404, "User not found");
    }
    return user;
  },

  approveRestaurant: async (restaurantId) => {
    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { isApproved: true, isActive: true },
      { new: true }
    );
    if (!restaurant) {
      throw createError(404, "Restaurant not found");
    }
    return restaurant;
  },

  rejectRestaurant: async (restaurantId, reason) => {
    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { isApproved: false, isActive: false },
      { new: true }
    );
    if (!restaurant) {
      throw createError(404, "Restaurant not found");
    }
    return restaurant;
  },

  approveDriver: async (userId) => {
    const user = await User.findById(userId);
    if (!user || user.role !== "driver") {
      throw createError(404, "Driver not found");
    }
    user.driverDetails.isApproved = true;
    await user.save();
    return user;
  },

  rejectDriver: async (userId, reason) => {
    const user = await User.findById(userId);
    if (!user || user.role !== "driver") {
      throw createError(404, "Driver not found");
    }
    user.driverDetails.isApproved = false;
    await user.save();
    return user;
  },

  getAllOrders: async (filters = {}) => {
    const {
      status,
      customerId,
      restaurantId,
      driverId,
      page = 1,
      limit = 20,
    } = filters;

    const query = {};
    if (status) query.status = status;
    if (customerId) query.customerId = customerId;
    if (restaurantId) query.restaurantId = restaurantId;
    if (driverId) query.driverId = driverId;

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate("customerId", "name email")
      .populate("restaurantId", "name")
      .populate("driverId", "name")
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

  getPlatformStats: async () => {
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalRestaurants = await User.countDocuments({ role: "restaurant" });
    const totalDrivers = await User.countDocuments({ role: "driver" });

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const revenueResult = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    const activeDrivers = await User.countDocuments({
      role: "driver",
      "driverDetails.isAvailable": true,
    });

    const pendingRestaurants = await Restaurant.countDocuments({
      isApproved: false,
    });

    const pendingDrivers = await User.countDocuments({
      role: "driver",
      "driverDetails.isApproved": false,
    });

    return {
      totalUsers: {
        customers: totalCustomers,
        restaurants: totalRestaurants,
        drivers: totalDrivers,
      },
      ordersByStatus,
      totalRevenue,
      activeDrivers,
      pendingApprovals: {
        restaurants: pendingRestaurants,
        drivers: pendingDrivers,
      },
    };
  },
};
