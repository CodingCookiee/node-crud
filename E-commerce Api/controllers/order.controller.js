import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { createError } from "../lib/createError.util.js";
import {
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
} from "../services/email.service.js";
import { emitToAdmins, emitToUser } from "../services/socket.service.js";

export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      throw createError(400, "Cart is empty");
    }

    //  validate products & stock
    for (const item of cart.items) {
      if (!item.product) {
        throw createError(404, "Product not found");
      }
      if (item.product.stock < item.quantity) {
        throw createError(400, `Insufficient stock for ${item.product.name}`);
      }
    }
    //  create order
    const order = new Order({
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress,
      paymentMethod,
      subtotal: cart.subtotal,
      tax: cart.tax,
      total: cart.total + 10,
    });

    //  reduce product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    //  clear cart and save order
    await Cart.findByIdAndDelete(cart._id);
    await order.save();
    await order.populate("items.product", "name price images");

    // emit to User: Notification
    emitToUser(userId, "order-created", {
      orderId: order._id,
      total: order.total,
    });

    //  emit to admins: Notification
    emitToAdmins("order-created", {
      orderId: order._id,
      total: order.total,
    });

    // send order confirmation email (non-blocking)
    const user = await User.findById(userId);
    sendOrderConfirmationEmail(user.email, {
      orderId: order._id,
      total: order.total,
    }).catch((err) => console.error("Order confirmation email failed:", err));

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    //  calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    //    find orders
    const orders = await Order.find({ user: userId })
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    //  get total count
    const total = await Order.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      data: orders,
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

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const order = await Order.findById(id).populate(
      "items.product",
      "name price images"
    );

    if (!order) {
      throw createError(404, "Order not found");
    }

    // validate ownership: user can only see their own orders; admin can see all:
    if (order.user.toString() !== userId && userRole !== "admin") {
      throw createError(403, "Access denied");
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // validate status
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      throw createError(400, "Invalid Status");
    }

    // find and update order
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true, runValidators: true }
    ).populate("items.product", "name price images");

    if (!order) {
      throw createError(404, "Order not found");
    }

    // emit to User: Notification
    emitToUser(order.user.toString(), "order-status-updated", {
      orderId: order._id,
      status: order.orderStatus,
    });

    // send status update email (non-blocking)
    const user = await User.findById(order.user);
    sendOrderStatusEmail(user.email, {
      orderId: order._id,
      status: order.orderStatus,
    }).catch((err) => console.error("Status update email failed:", err));

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const order = await Order.findById(id);
    if (!order) {
      throw createError(404, "Order not found");
    }

    //  validate ownership
    if (order.user.toString() !== userId) {
      throw createError(403, "Access denied");
    }

    if (!["pending", "processing"].includes(order.orderStatus)) {
      throw createError(400, "Order cannot be cancelled");
    }

    //  restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    // update order status
    order.orderStatus = "cancelled";
    await order.save();
    await order.populate("items.product", "name price images");

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
