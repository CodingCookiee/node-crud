import { User } from "../models/user.model.js";
import { createError } from "../lib/createError.util.js";


export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return next(createError(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (name && name === user.name) {
      throw createError(400, 'Please use a different name than your current one.');
    }

    if (email && email === user.email) {
      throw createError(400, 'Please use a different email than your current one.');
    }

    if (password && (await user.comparePassword(password))) {
      throw createError(400, 'New password must be different from your current one.');
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password && password.trim()) user.password = password;

    const updatedUser = await user.save();
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (error) {
    next(error);
  }
};

export const forceLogoutUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw createError(404, "User not found");
    }

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    next(error);
  }
};