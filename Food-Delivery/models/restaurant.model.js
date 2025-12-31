import mongoose from "mongoose";

const operatingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    required: true,
  },
  open: {
    type: String,
    required: true,
  },
  close: {
    type: String,
    required: true,
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
});

const restaurantSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    cuisineType: {
      type: [String],
      required: [true, "Cuisine type is required"],
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    images: [{ type: String }],
    operatingHours: [operatingHoursSchema],
    deliveryZone: {
      type: {
        type: String,
        enum: ["radius", "areas"],
        default: "radius",
      },
      radius: { type: Number, default: 5 }, // in km
      areas: [{ type: String }],
    },
    status: {
      type: String,
      enum: ["open", "closed", "busy"],
      default: "closed",
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    deliveryTime: { type: Number, default: 30 }, // in minutes
    minimumOrder: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },

  {
    timestamps: true,
  }
);

restaurantSchema.index({
  "address.coordinates.lat": 1,
  "address.coordinates.lng": 1,
});
restaurantSchema.index({ name: "text", cuisineType: "text" });

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
