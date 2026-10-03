import Product from "../models/Product.js";
import Order from "../models/Order.js";

import ApiError from "../utils/apiError.js";


// ==========================================
// Calculate order total
// ==========================================
export const calculateOrderTotal = (price,quantity) => {
  return price * quantity;
};


// ==========================================
// Check product stock
// ==========================================
export const checkProductStock = async (productId,quantity) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!product.isAvailable) {
    throw new ApiError(400, "Product is not available");
  }

  if (product.stock < quantity) {
    throw new ApiError(400, `Only ${product.stock} item(s) are available`);
  }

  return product;
};


// ==========================================
// Reduce product stock
// ==========================================
export const reduceProductStock = async (productId,quantity) => {
  const product = await Product.findOneAndUpdate(
    {
      _id: productId,
      isAvailable: true,
      stock: {
        $gte: quantity,
      },
    },
    {
      $inc: {
        stock: -quantity,
      },
    },
    {
      new: true,
    }
  );

  if (!product) {
    throw new ApiError(400, "Product is out of stock or insufficient stock");
  }

  if (product.stock === 0) {
    product.isAvailable = false;
    await product.save();
  }

  return product;
};


// ==========================================
// Restore product stock
// ==========================================
export const restoreProductStock = async (productId, quantity) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    {
      $inc: { stock: quantity }
    },
    {
      new: true,
    }
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.isAvailable = product.stock > 0;

  await product.save();

  return product;
};


// ==========================================
// Create order
// ==========================================
export const createOrderService = async ({
  userId,
  productId,
  quantity,
  shippingAddress,
}) => {
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  if (!quantity || quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  if (!shippingAddress) {
    throw new ApiError(400, "Shipping address is required");
  }

  // Check product
  const product = await checkProductStock(productId, quantity);

  // Reduce stock
  await reduceProductStock(productId, quantity);

  // Calculate total
  const totalAmount = calculateOrderTotal(product.price, quantity);

  try {
    const order = await Order.create({
      user: userId,
      seller: product.seller,
      product: product._id,
      quantity,
      price: product.price,
      totalAmount,
      shippingAddress,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    return await order.populate([
      {
        path: "product",
        select: "name price images",
      },
      {
        path: "seller",
        select: "name storeName avatar",
      },
    ]);
  } catch (error) {
    // Restore stock if order creation fails
    await restoreProductStock(
      productId,
      quantity
    );

    throw error;
  }
};


// ==========================================
// Cancel order
// ==========================================
export const cancelOrderService = async (orderId, userId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404 ,"Order not found");
  }

  // Only the buyer can cancel the order
  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(403 ,"You are not allowed to cancel this order");
  }

  // Cannot cancel shipped/delivered/cancelled orders
  if (
    [
      "Shipped",
      "Delivered",
      "Cancelled",
    ].includes(order.orderStatus)
  ) {
    throw new ApiError(400 ,`Order cannot be cancelled because it is already ${order.orderStatus}`);
  }

  order.orderStatus = "Cancelled";

  await order.save();

  // Restore stock
  await restoreProductStock(order.product, order.quantity);

  return order;
};