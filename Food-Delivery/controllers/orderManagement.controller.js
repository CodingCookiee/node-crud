import { orderService } from "../services/orderManagement.service.js";

export const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user.userId, req.body);
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
      req.params.id,
      req.user.userId,
      req.user.role
    );
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderHistory = async (req, res, next) => {
  try {
    const result = await orderService.getOrderHistory(
      req.user.userId,
      req.user.role,
      req.query
    );
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.user.userId,
      req.user.role,
      req.body.status
    );
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
    const order = await orderService.cancelOrder(
      req.params.id,
      req.user.userId,
      req.user.role,
      req.body.cancelReason
    );
    res.status(200).json({
      success: true,
      message: "Order cancelled",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
