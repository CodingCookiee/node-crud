import { orderAssignmentService } from "../services/orderAssignment.service.js";

export const autoAssignDriver = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const result = await orderAssignmentService.autoAssignDriver(orderId);
    res.status(200).json({
      success: true,
      message: "Driver assigned automatically",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const manualAssignDriver = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const driverId = req.body.driverId;
    const adminId = req.user.userId;

    const result = await orderAssignmentService.manualAssignDriver(
      orderId,
      driverId,
      adminId
    );
    res.status(200).json({
      success: true,
      message: "Driver assigned",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const reassignOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const result = await orderAssignmentService.reassignOrder(orderId);
    res.status(200).json({
      success: true,
      message: "Order reassigned",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
