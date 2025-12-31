import { User } from "../models/user.model.js";
import { createError } from "../lib/createError.util.js";

export const userService = {
  // Get user profile
  getProfile: async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw createError(404, "User not found");
    }
    return user;
  },

  // Update user profile
  updateProfile: async (userId, updateData) => {
    const { name, email, phone, profilePicture } = updateData;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        throw createError(400, "Email already in use");
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, profilePicture },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      throw createError(404, "User not found");
    }

    return user;
  },

  // Add delivery address (for customers)
  addAddress: async (userId, addressData) => {
    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    if (user.role !== "customer") {
      throw createError(403, "Only customers can add delivery addresses");
    }

    // If this is the first address or marked as default, set it as default
    if (addressData.isDefault || user.addresses.length === 0) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
      addressData.isDefault = true;
    }

    user.addresses.push(addressData);
    await user.save();

    return user.addresses[user.addresses.length - 1];
  },

  // Update delivery address
  updateAddress: async (userId, addressId, addressData) => {
    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      throw createError(404, "Address not found");
    }

    // If setting as default, unset other defaults
    if (addressData.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    Object.assign(address, addressData);
    await user.save();

    return address;
  },

  // Delete delivery address
  deleteAddress: async (userId, addressId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      throw createError(404, "Address not found");
    }

    const wasDefault = address.isDefault;
    address.remove();

    // If deleted address was default, set first remaining as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    return { message: "Address deleted successfully" };
  },

  // Delete user account
  deleteAccount: async (userId) => {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      throw createError(404, "User not found");
    }

    return { message: "Account deactivated successfully" };
  },

  // Admin: Get all users
  getAllUsers: async (filters) => {
    const { role, isActive, page = 1, limit = 10 } = filters;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive;

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

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
};
