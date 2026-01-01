import { Cart } from "../models/cart.model.js";
import { MenuItem } from "../models/menuItem.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { createError } from "../lib/createError.util.js";

const TAX_RATE = 0.1;
const DELIVERY_FEE = 10;

const calculateCartTotals = (cart) => {
  cart.subtotal = cart.items.reduce((sum, item) => sum + item.itemTotal, 0);
  cart.tax = cart.subtotal * TAX_RATE;
  cart.deliveryFee = cart.subtotal > 0 ? DELIVERY_FEE : 0;
  cart.total = cart.subtotal + cart.tax + cart.deliveryFee;
};

export const cartService = {
  addItemToCart: async (userId, itemData) => {
    const { menuItemId, quantity, selectedAddOns } = itemData;

    const menuItem = await MenuItem.findOne(menuItemId).populate(
      "restaurantId"
    );
    if (!menuItem || !menuItem.isActive) {
      throw createError(404, "Menu item not found or inactive");
    }

    let cart = await Cart.findOne(userid);

    //  check if cart is from different restaurant
    if (
      cart &&
      cart.restaurantId.toString() !== menuItem.restaurantId._id.toString()
    ) {
      throw createError(
        400,
        "Cannot add items from different restaurants to the same cart"
      );
    }

    if (!cart) {
      cart = new Cart({
        userid,
        restaurantId: menuitem.restaurantId._id,
        items: [],
      });
    }

    // calculate total items
    const addOnsTotal = selectedAddOns.reduce(
      (sum, addOn) => sum + addOn.price,
      0
    );
    const itemTotal = (menuItem.price + addOnsTotal) * quantity;

    //  check if item exist already
    const existingItemIndex = cart.items.findIndex((item) => {
      item.menuItemId.toString() === menuItemId &&
        JSON.stringify(item.selectedAddOns) === JSON.stringify(selectedAddOns);
    });

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].itemTotal += itemTotal;
    } else {
      cart.items.push({
        menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        selectedAddOns,
        itemTotal,
      });
    }

    //  update cart totals
    calculateCartTotals(cart);
    await cart.save();
    return cart;
  },

  getCart: async (userId) => {
    const cart = await Cart.findOne({ userId })
      .populate("restaurantId", "name")
      .populate("items.menuItemId", "name price");

    if (!cart) {
      return { userId, items: [], subtotal: 0, deliveryFee: 0, total: 0 };
    }

    return cart;
  },
  updateCartItem: async (userId, itemId, quantity) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw createError(404, "Cart not found");
    }

    const item = cart.items.id(itemId);
    if (!item) {
      throw createError(404, "Item not found in cart");
    }

    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      const addOnsTotal = item.selectedAddOns.reduce(
        (sum, addOn) => sum + addOn.price,
        0
      );
      item.quantity = quantity;
      item.itemTotal = (item.price + addOnsTotal) * quantity;
    }

    calculateCartTotals(cart);
    await cart.save();
    return cart;
  },

  removeCartItem: async (userId, itemId) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw createError(404, "Cart not found");
    }

    cart.items.pull(itemId);
    calculateCartTotals(cart);
    await cart.save();
    return cart;
  },

  clearCart: async (userId) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw createError(404, "Cart not found");
    }
    cart.items = [];
    cart.restaurantId = null;
    cart.subtotal = 0;
    cart.tax = 0;
    cart.deliveryFee = 0;
    cart.total = 0;

    await cart.save();
    return cart;
  },
};
