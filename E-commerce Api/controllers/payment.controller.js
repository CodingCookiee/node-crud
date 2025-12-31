import { createError } from "../lib/createError.util.js";
import { stripeClient } from "../config/stripe.config.js";
import {
  createPaymentIntent,
  handlePaymentSuccess,
  handlePaymentFailure,
} from "../services/payment.service.js";

export const createPaymentIntentController = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.userId;

    const result = await createPaymentIntent(orderId, userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const stripeWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // handle the event
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent.id);
        console.log("Payment succeeded:", paymentIntent.id);
        break;
      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        await handlePaymentFailure(failedPayment.id);
        console.log("Payment failed:", failedPayment.id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};
