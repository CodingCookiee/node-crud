import { adminService } from "../services/admin.service.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const result = await adminService.getAllUsers(req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const result = await adminService.updateUser(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await adminService.deleteUser(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const approveRestaurant = async (req, res, next) => {
  try {
    const result = await adminService.approveRestaurant(req.params.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectRestaurant = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const result = await adminService.rejectRestaurant(req.params.id, reason);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const approveDriver = async (req, res, next) => {
  try {
    const result = await adminService.approveDriver(req.params.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectDriver = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const result = await adminService.rejectDriver(req.params.id, reason);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const result = await adminService.getAllOrders(req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPlatformStats = async (req, res, next) => {
  try {
    const result = await adminService.getPlatformStats();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
