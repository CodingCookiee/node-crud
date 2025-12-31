import { stripeClient } from "../config/stripe.config.js";
import { Order } from "../models/order.model.js";
import { createError } from "../lib/createError.util.js";

export const createPaymentIntent = async (orderId, userId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw createError(404, "Order not found");
  }

  // check if the order belongs to the user
  if (order.user.toString() !== userId) {
    throw createError(403, "Access denied");
  }

  // check if payment intent already exists
  if (order.paymentIntentId) {
    throw createError(400, "Payment intent already created for this order");
  }

  // create payment intent
  const paymentIntent = await stripeClient.paymentIntents.create({
    amount: Math.round(order.total * 100), // convert to cents
    currency: "usd",
    metadata: {
      orderId: orderId.toString(),
      userId: userId.toString(),
    },
  });

  // update order with payment intent ID
  order.paymentIntentId = paymentIntent.id;
  order.paymentStatus = "pending";
  await order.save();

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
};

export const handlePaymentSuccess = async (paymentIntentId) => {
  const order = await Order.findOne({ paymentIntentId });

  if (!order) {
    throw createError(404, "Order not found");
  }

  order.paymentStatus = "completed";
  order.orderStatus = "processing";
  await order.save();

  return order;
};

export const handlePaymentFailure = async (paymentIntentId) => {
  const order = await Order.findOne({ paymentIntentId });

  if (!order) {
    throw createError(404, "Order not found");
  }

  order.paymentStatus = "failed";
  await order.save();

  return order;
};
