import { userService } from "../services/user.service.js";

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await userService.getProfile(userId);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await userService.updateProfile(userId, req.body);
    res.status(200).json({
      success: true,
      message: "Profile Updated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const address = await userService.addAddress(userId, req.body);
    res.status(200).json({
      success: true,
      message: "Address Added",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;
    const address = await userService.updateAddress(userId, addressId, req.body);
    res.status(200).json({
      success: true,
      message: "Address Updated",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;

    await userService.deleteAddress(userId, addressId);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    await userService.deleteAccount(userId);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(req.query);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
