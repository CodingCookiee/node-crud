import { Restaurant } from "../models/restaurant.model.js";
import { User } from "../models/user.model.js";
import { createError } from "../lib/createError.util.js";

export const restaurantService = {
  createRestaurant: async (ownerId, restaurantData) => {
    const owner = await User.findById(ownerId);
    if (!owner || owner.role !== "restaurant") {
      throw createError(403, "Only restaurant users can create restaurants");
    }

    const restaurant = new Restaurant({ ...restaurantData, ownerId });
    await restaurant.save();
    return restaurant;
  },

  getRestaurantById: async (restaurantId) => {
    const restaurant = await Restaurant.findById(restaurantId).populate(
      "ownerId",
      "name email phone"
    );
    if (!restaurant) {
      throw createError(404, "Restaurant not found");
    }
    return restaurant;
  },

  updateRestaurant: async (restaurantId, ownerId, updateData) => {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw createError(404, "Restaurant not found");
    }

    if (restaurant.ownerId.toString() !== ownerId) {
      throw createError(403, "You can only update your own restaurant");
    }

    Object.assign(restaurant, updateData);
    await restaurant.save();
    return restaurant;
  },

  deleteRestaurant: async (restaurantId, ownerId) => {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw createError(404, "Restaurant not found");
    }

    if (restaurant.ownerId.toString() !== ownerId) {
      throw createError(403, "You can only delete your own restaurant");
    }

    restaurant.isActive = false;
    await restaurant.save();
    return { message: "Restaurant deactivated successfully" };
  },

  updateRestaurantStatus: async (restaurantId, ownerId, status) => {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw createError(404, "Restaurant not found");
    }

    if (restaurant.ownerId.toString() !== ownerId) {
      throw createError(403, "You can only update your own restaurant status");
    }

    restaurant.status = status;
    await restaurant.save();
    return restaurant;
  },

  searchRestaurants: async (filters) => {
    const {
      search,
      cuisine,
      minRating,
      maxDeliveryTime,
      maxMinimumOrder,
      lat,
      lng,
      radius = 10,
      page = 1,
      limit = 10,
      sortBy = "rating",
    } = filters;

    const query = { isActive: true, isApproved: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (cuisine) {
      query.cuisineType = { $in: Array.isArray(cuisine) ? cuisine : [cuisine] };
    }

    if (minRating) {
      query["rating.average"] = { $gte: Number(minRating) };
    }

    if (maxDeliveryTime) {
      query.deliveryTime = { $lte: Number(maxDeliveryTime) };
    }

    if (maxMinimumOrder) {
      query.minimumOrder = { $lte: Number(maxMinimumOrder) };
    }

    // Location-based search
    if (lat && lng) {
      const latNum = Number(lat);
      const lngNum = Number(lng);
      const radiusNum = Number(radius);
      const latDelta = radiusNum / 111;
      const lngDelta = radiusNum / (111 * Math.cos((latNum * Math.PI) / 180));

      query["address.coordinates.lat"] = {
        $gte: latNum - latDelta,
        $lte: latNum + latDelta,
      };
      query["address.coordinates.lng"] = {
        $gte: lngNum - lngDelta,
        $lte: lngNum + lngDelta,
      };
    }

    const sortOptions = {
      rating: { "rating.average": -1 },
      deliveryTime: { deliveryTime: 1 },
      popularity: { "rating.count": -1 },
    };

    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find(query)
      .sort(sortOptions[sortBy] || sortOptions.rating)
      .skip(skip)
      .limit(Number(limit));

    const total = await Restaurant.countDocuments(query);

    return {
      restaurants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  getAllRestaurants: async (filters) => {
    const { isApproved, isActive, page = 1, limit = 10 } = filters;

    const query = {};
    if (isApproved !== undefined) query.isApproved = isApproved;
    if (isActive !== undefined) query.isActive = isActive;

    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find(query)
      .populate("ownerId", "name email phone")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Restaurant.countDocuments(query);

    return {
      restaurants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  approveRestaurant: async (restaurantId) => {
    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { isApproved: true },
      { new: true }
    );

    if (!restaurant) {
      throw createError(404, "Restaurant not found");
    }

    return restaurant;
  },
};
