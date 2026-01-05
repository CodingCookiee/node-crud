import { paymentService } from "../services/stripePayment.service.js";

export const createPaymentIntent = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.userId;

    const result = await paymentService.createPaymentIntent(orderId, userId);

    res.status(201).json({
      success: true,
      message: "Payment intent created",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const confirmPayment = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const orderId = req.params.id;
    const result = await paymentService.confirmPayment(orderId, userId);

    res.status(200).json({
      success: true,
      message: "Payment confirmed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const processRefund = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const adminId = req.user.userId;

    const result = await paymentService.processRefund(orderId, adminId);

    res.status(200).json({
      success: true,
      message: "Refund processed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const processDriverPayout = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const { driverId, amount } = req.body;

    const result = await paymentService.processDriverPayout(
      driverId,
      amount,
      adminId
    );

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.driver,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await paymentService.getPaymentHistory(
      userId,
      userRole,
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
