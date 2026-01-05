import { Order } from "../models/orderManagement.model.js";
import { Cart } from "../models/foodCart.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { User } from "../models/user.model.js";
import { createError } from "../lib/createError.util.js";
import { emitOrderStatusUpdate, emitNewOrder } from "../utils/socketEvents.js";

export const orderService = {
  createOrder: async (userId, orderData) => {
    const { deliveryAddressId, paymentMethod } = orderData;

    const cart = await Cart.findOne({ userId }).populate("restaurantId");
    if (!cart || cart.items.length === 0) {
      throw createError(400, "Cart is empty");
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "customer") {
      throw createError(403, "Only customers can create orders");
    }

    const deliveryAddress = user.addresses.id(deliveryAddressId);
    if (!deliveryAddress) {
      throw createError(404, "Delivery address not found");
    }

    const restaurant = await Restaurant.findById(cart.restaurantId);
    if (!restaurant || !restaurant.isActive || !restaurant.isApproved) {
      throw createError(400, "Restaurant is not available");
    }

    const order = new Order({
      customerId: userId,
      restaurantId: cart.restaurantId,
      items: cart.items,
      deliveryAddress: {
        street: deliveryAddress.street,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        zipCode: deliveryAddress.zipCode,
        coordinates: deliveryAddress.coordinates,
      },
      subtotal: cart.subtotal,
      tax: cart.tax,
      deliveryFee: cart.deliveryFee,
      total: cart.total,
      estimatedDeliveryTime: restaurant.deliveryTime || 30,
      paymentMethod: paymentMethod || "cash",
    });

    await order.save();

    // Emit new order to restaurant
    const restaurant = await Restaurant.findById(order.restaurantId);
    emitNewOrder(restaurant.ownerId.toString(), order);

    // Clear cart after order
    cart.items = [];
    cart.restaurantId = null;
    cart.subtotal = 0;
    cart.tax = 0;
    cart.deliveryFee = 0;
    cart.total = 0;
    await cart.save();

    return order;
  },

  getOrderById: async (orderId, userId, userRole) => {
    const order = await Order.findById(orderId)
      .populate("customerId", "name email phone")
      .populate("restaurantId", "name address")
      .populate("driverId", "name phone");

    if (!order) {
      throw createError(404, "Order not found");
    }

    // Authorization check
    if (
      userRole !== "admin" &&
      order.customerId._id.toString() !== userId &&
      order.restaurantId.ownerId?.toString() !== userId &&
      order.driverId?._id.toString() !== userId
    ) {
      throw createError(403, "Access denied");
    }

    return order;
  },

  getOrderHistory: async (userId, userRole, filters = {}) => {
    const { status, page = 1, limit = 10 } = filters;

    let query = {};

    if (userRole === "customer") {
      query.customerId = userId;
    } else if (userRole === "restaurant") {
      const restaurant = await Restaurant.findOne({ ownerId: userId });
      if (!restaurant) {
        throw createError(404, "Restaurant not found");
      }
      query.restaurantId = restaurant._id;
    } else if (userRole === "driver") {
      query.driverId = userId;
    } else if (userRole !== "admin") {
      throw createError(403, "Access denied");
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate("customerId", "name phone")
      .populate("restaurantId", "name")
      .populate("driverId", "name phone")
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

  updateOrderStatus: async (orderId, userId, userRole, newStatus) => {
    const order = await Order.findById(orderId).populate("restaurantId");
    if (!order) {
      throw createError(404, "Order not found");
    }

    // Authorization and status transition validation
    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["preparing", "cancelled"],
      preparing: ["ready"],
      ready: ["picked_up"],
      picked_up: ["on_the_way"],
      on_the_way: ["delivered"],
    };

    if (!validTransitions[order.status]?.includes(newStatus)) {
      throw createError(
        400,
        `Cannot change status from ${order.status} to ${newStatus}`
      );
    }

    // Role-based authorization
    if (
      newStatus === "confirmed" ||
      newStatus === "preparing" ||
      newStatus === "ready"
    ) {
      if (userRole !== "restaurant" && userRole !== "admin") {
        throw createError(403, "Only restaurant can update to this status");
      }
      if (
        userRole === "restaurant" &&
        order.restaurantId.ownerId.toString() !== userId
      ) {
        throw createError(403, "Access denied");
      }
    }

    if (
      newStatus === "picked_up" ||
      newStatus === "on_the_way" ||
      newStatus === "delivered"
    ) {
      if (userRole !== "driver" && userRole !== "admin") {
        throw createError(403, "Only driver can update to this status");
      }
      if (userRole === "driver" && order.driverId?.toString() !== userId) {
        throw createError(403, "Access denied");
      }
    }

    order.status = newStatus;
    await order.save();

    // Emit status update
    const restaurant = await Restaurant.findById(order.restaurantId);
    emitOrderStatusUpdate(
      orderId,
      order.customerId.toString(),
      restaurant.ownerId.toString(),
      order.driverId?.toString(),
      order
    );

    return order;
  },

  cancelOrder: async (orderId, userId, userRole, cancelReason) => {
    const order = await Order.findById(orderId).populate("restaurantId");
    if (!order) {
      throw createError(404, "Order not found");
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      throw createError(
        400,
        "Order can only be cancelled if pending or confirmed"
      );
    }

    // Authorization
    if (
      userRole !== "admin" &&
      order.customerId.toString() !== userId &&
      !(
        userRole === "restaurant" &&
        order.restaurantId.ownerId.toString() === userId
      )
    ) {
      throw createError(403, "Access denied");
    }

    order.status = "cancelled";
    order.cancelReason = cancelReason;
    await order.save();
    return order;
  },
};
