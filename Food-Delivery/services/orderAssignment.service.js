import { Order } from "../models/orderManagement.model.js";
import { User } from "../models/user.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { createError } from "../lib/createError.util.js";

export const orderAssignmentService = {
  findNearbyDrivers: async (restaurantLocation, radius = 10) => {
    const { lat, lng } = restaurantLocation;

    const latDelta = radius / 111;
    const lngDelta = radius / (111 * Math.cos((lat * Math.PI) / 180));

    const drivers = await User.find({
      role: "driver",
      "driverDetails.isApproved": true,
      "driverDetails.isAvailable": true,
      "driverDetails.currentLocation.lat": {
        $gte: lat - latDelta,
        $lte: lat + latDelta,
      },
      "driverDetails.currentLocation.lng": {
        $gte: lng - lngDelta,
        $lte: lng + lngDelta,
      },
    });

    // Calculate actual distance and sort
    const driversWithDistance = drivers.map((driver) => {
      const driverLat = driver.driverDetails.currentLocation.lat;
      const driverLng = driver.driverDetails.currentLocation.lng;
      const distance = Math.sqrt(
        Math.pow((lat - driverLat) * 111, 2) +
          Math.pow((lng - driverLng) * 111 * Math.cos((lat * Math.PI) / 180), 2)
      );
      return { driver, distance };
    });

    driversWithDistance.sort((a, b) => a.distance - b.distance);

    return driversWithDistance.map((d) => d.driver);
  },

  autoAssignDriver: async (orderId) => {
    const order = await Order.findById(orderId).populate("restaurantId");

    if (!order) {
      throw createError(404, "Order not found");
    }

    if (order.status !== "ready") {
      throw createError(400, "Order must be ready for driver assignment");
    }

    if (order.driverId) {
      throw createError(400, "Order already has a driver assigned");
    }

    const restaurantLocation = order.restaurantId.address.coordinates;
    const drivers = await orderAssignmentService.findNearbyDrivers(
      restaurantLocation,
      10
    );

    if (drivers.length === 0) {
      throw createError(404, "No available drivers nearby");
    }

    order.driverId = drivers[0]._id;
    await order.save();
    return order;
  },

  manualAssignDriver: async (orderId, driverId, adminId) => {
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      throw createError(403, "Only admins can manually assign drivers");
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw createError(404, "Order not found");
    }

    if (order.status !== "ready") {
      throw createError(400, "Order must be ready for driver assignment");
    }

    const driver = await User.findById(driverId);
    if (
      !driver ||
      driver.role !== "driver" ||
      !driver.driverDetails.isApproved
    ) {
      throw createError(400, "Invalid or unapproved driver");
    }

    order.driverId = driverId;
    await order.save();
    return order;
  },

  reassignOrder: async (orderId) => {
    const order = await Order.findById(orderId);
    if (!order) {
      throw createError(404, "Order not found");
    }

    if (order.driverId) {
      throw createError(400, "Order still has a driver assigned");
    }

    const result = await orderAssignmentService.autoAssignDriver(orderId);
    return result;
  },
};
