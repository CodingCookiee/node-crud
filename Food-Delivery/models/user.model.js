import mongoose from "mongoose";
import bcrypt from "bcrypt";

const addressSchema = new mongoose.Schema({
  label: { type: String, required: true }, // Home, Work, Other
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["customer", "restaurant", "driver", "admin"],
      default: "customer",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    profilePicture: {
      type: String,
      default: null,
    },
    // Customer-specific: multiple delivery addresses
    addresses: [addressSchema],
    // Driver-specific fields
    driverDetails: {
      vehicleType: {
        type: String,
        enum: ["bike", "scooter", "car"],
      },
      licenseNumber: String,
      isApproved: {
        type: Boolean,
        default: false,
      },
      isAvailable: {
        type: Boolean,
        default: false,
      },
      currentLocation: {
        lat: { type: Number },
        lng: { type: Number },
      },
      rating: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 },
      },
      totalEarnings: {
        type: Number,
        default: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export const User = mongoose.model("User", userSchema);
