import { getIO } from "../config/socket.config.js";

export const emitOrderStatusUpdate = (
  orderId,
  customerId,
  restaurantOwnerId,
  driverId,
  orderData
) => {
  const io = getIO();
  // Notify customers

  io.to(`user:${customerId}`).emit("orderStatusUpdated", orderData);
  // Notify restaurant owners

  io.to(`user:${restaurantOwnerId}`).emit("orderStatusUpdated", orderData);
  // Notify drivers

  if (driverId) io.to(`user:${driverId}`).emit("orderStatusUpdated", orderData);

  // Notify Order room

  io.to(`order:${orderId}`).emit("orderStatusUpdated", orderData);
};

export const emitNewOrder = (restaurantOwnerId, orderData) => {
  const io = getIO();
  io.to(`restaurant:${restaurantOwnerId}`).emit("newOrder", orderData);
};

export const emitOrderAssigned = (driverId, orderData) => {
  const io = getIO();
  io.to(`user:${driverId}`).emit("orderAssigned", orderData);
};

export const emitDriverLocationUpdate = (orderId, location) => {
  const io = getIO();
  io.to(`order:${orderId}`).emit("driverLocationUpdated", location);
};
