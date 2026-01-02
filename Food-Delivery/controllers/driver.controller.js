import { driverService } from "../services/driver.service.js";

export const updateDriverProfile = async (req, res, next) => {
  try {
    const user = await driverService.updateDriverProfile(
      req.user.userId,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleAvailability = async (req, res, next) => {
  try {
    const result = await driverService.toggleAvailability(req.user.userId);
    res.status(200).json({
      success: true,
      message: "Availability toggled",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLocation = async (req, res, next) => {
  try {
    const result = await driverService.updateLocation(
      req.user.userId,
      req.body.lat,
      req.body.lng
    );
    res.status(200).json({
      success: true,
      message: "Location updated",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignedOrders = async (req, res, next) => {
  try {
    const result = await driverService.getAssignedOrders(
      req.user.userId,
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

export const acceptOrder = async (req, res, next) => {
  try {
    const result = await driverService.acceptOrder(
      req.user.userId,
      req.params.id
    );
    res.status(200).json({
      success: true,
      message: "Order accepted",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectOrder = async (req, res, next) => {
  try {
    const result = await driverService.rejectOrder(
      req.user.userId,
      req.params.id
    );
    res.status(200).json({
      success: true,
      message: "Order rejected",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const markOrderPickedUp = async (req, res, next) => {
  try {
    const result = await driverService.markOrderPickedUp(
      req.user.userId,
      req.params.id
    );
    res.status(200).json({
      success: true,
      message: "Order marked as picked up",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const markOrderDelivered = async (req, res, next) => {
  try {
    const result = await driverService.markOrderDelivered(
      req.user.userId,
      req.params.id
    );
    res.status(200).json({
      success: true,
      message: "Order delivered",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
