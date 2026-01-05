import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    restaurantRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    restaurantComment: {
      type: String,
      trim: true,
    },
    driverRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    driverComment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


export const Review = mongoose.model("Review", reviewSchema);