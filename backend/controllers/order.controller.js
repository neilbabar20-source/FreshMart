import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// =====================================================
// PLACE ORDER COD
// /api/order/cod
// =====================================================

export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body;

    if (!address || !items || !items.length) {
      return res.status(400).json({
        message: "Items and address are required",
        success: false,
      });
    }

    const orderItems = [];

    let amount = 0;

    // Keep track of deducted stock
    // so stock can be restored if order creation fails.
    const deductedStock = [];

    for (const item of items) {
      const requestedQuantity = Number(item.quantity);

      // =========================
      // QUANTITY VALIDATION
      // =========================

      if (!requestedQuantity || requestedQuantity < 1) {
        return res.status(400).json({
          message: "Invalid product quantity",
          success: false,
        });
      }

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
          success: false,
        });
      }

      if (!product.sellerId) {
        return res.status(400).json({
          message: `Seller information missing for product: ${product.name}`,
          success: false,
        });
      }

      // =========================
      // STOCK VALIDATION
      // =========================

      if (!product.inStock || product.stock <= 0) {
        return res.status(400).json({
          message: `${product.name} is currently out of stock`,
          success: false,
        });
      }

      if (requestedQuantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} unit${
            product.stock === 1 ? "" : "s"
          } of ${product.name} are available`,
          success: false,
        });
      }

      // =========================
      // ATOMIC STOCK DEDUCTION
      // =========================
      //
      // Stock is reduced directly in MongoDB.
      // $gte ensures stock can never become negative.
      //
      // Example:
      // Stock = 10
      // Ordered = 7
      // New stock = 3

      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: product._id,
          inStock: true,
          stock: { $gte: requestedQuantity },
        },
        {
          $inc: {
            stock: -requestedQuantity,
          },
        },
        {
          new: true,
        }
      );

      // Another order may have consumed the stock
      // between validation and update.
      if (!updatedProduct) {
        const latestProduct = await Product.findById(product._id);

        if (!latestProduct || latestProduct.stock <= 0) {
          return res.status(400).json({
            message: `${product.name} is currently out of stock`,
            success: false,
          });
        }

        return res.status(400).json({
          message: `Only ${latestProduct.stock} unit${
            latestProduct.stock === 1 ? "" : "s"
          } of ${product.name} are available`,
          success: false,
        });
      }

      // =========================
      // UPDATE IN-STOCK STATUS
      // =========================

      if (updatedProduct.stock === 0) {
        await Product.findByIdAndUpdate(product._id, {
          inStock: false,
        });
      }

      // Remember deduction in case order creation fails.
      deductedStock.push({
        productId: product._id,
        quantity: requestedQuantity,
      });

      // =========================
      // ADD ORDER ITEM
      // =========================

      orderItems.push({
        product: product._id,
        sellerId: product.sellerId,
        quantity: requestedQuantity,
        status: "Order Placed",
      });

      amount += product.offerPrice * requestedQuantity;
    }

    // =========================
    // ADD TAX / CHARGE
    // =========================

    amount += Math.floor((amount * 2) / 100);

    // =========================
    // CREATE ORDER
    // =========================

    try {
      await Order.create({
        userId,
        items: orderItems,
        address,
        amount,
        paymentType: "COD",
        isPaid: false,
        status: "Order Placed",
      });
    } catch (orderError) {
      // =========================
      // RESTORE STOCK
      // =========================
      //
      // If order creation fails after stock deduction,
      // restore the deducted quantities.

      for (const deduction of deductedStock) {
        const restoredProduct = await Product.findByIdAndUpdate(
          deduction.productId,
          {
            $inc: {
              stock: deduction.quantity,
            },
          },
          {
            new: true,
          }
        );

        if (restoredProduct) {
          await Product.findByIdAndUpdate(deduction.productId, {
            inStock: restoredProduct.stock > 0,
          });
        }
      }

      throw orderError;
    }

    res.status(201).json({
      message: "Order placed successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in placeOrderCOD:", error);

    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// =====================================================
// ORDER DETAILS FOR INDIVIDUAL USER
// /api/order/user
// =====================================================

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .populate("items.sellerId", "name storeName")
      .populate("address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error in getUserOrders:", error);

    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// =====================================================
// PERSONAL GROCERY INSIGHTS
// /api/order/insights
// =====================================================

export const getUserInsights = async (req, res) => {
  try {
    const userId = req.user;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    }).populate("items.product");

    let totalSpent = 0;
    let totalItems = 0;

    const categorySpending = {};
    const productFrequency = {};

    for (const order of orders) {
      totalSpent += order.amount;

      for (const item of order.items) {
        const product = item.product;

        if (!product) continue;

        const quantity = item.quantity || 0;
        const spending = product.offerPrice * quantity;

        totalItems += quantity;

        // Category-wise spending
        if (!categorySpending[product.category]) {
          categorySpending[product.category] = 0;
        }

        categorySpending[product.category] += spending;

        // Frequently purchased products
        if (!productFrequency[product._id]) {
          productFrequency[product._id] = {
            productId: product._id,
            name: product.name,
            category: product.category,
            quantity: 0,
          };
        }

        productFrequency[product._id].quantity += quantity;
      }
    }

    const totalOrders = orders.length;

    const averageOrderValue =
      totalOrders > 0
        ? Math.round(totalSpent / totalOrders)
        : 0;

    // Convert category object into array
    const categorySpendingArray = Object.entries(
      categorySpending
    )
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Convert product object into array
    const frequentlyPurchasedProducts = Object.values(
      productFrequency
    )
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const mostPurchasedCategory =
      categorySpendingArray.length > 0
        ? categorySpendingArray[0].category
        : null;

    let personalizedInsight =
      "Start shopping to get personalized grocery insights.";

    if (mostPurchasedCategory) {
      personalizedInsight = `Your most purchased category is ${mostPurchasedCategory}.`;
    }

    res.status(200).json({
      success: true,
      insights: {
        totalSpent,
        totalOrders,
        averageOrderValue,
        totalItems,
        categorySpending: categorySpendingArray,
        mostPurchasedCategory,
        frequentlyPurchasedProducts,
        personalizedInsight,
      },
    });
  } catch (error) {
    console.error("Error in getUserInsights:", error);

    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// =====================================================
// GET ALL ORDERS FOR ADMIN
// =====================================================

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .populate("items.sellerId", "name storeName")
      .populate("address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error in getAllOrders:", error);

    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// =====================================================
// GET ORDERS FOR LOGGED-IN SELLER
// =====================================================

export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.seller;

    const orders = await Order.find({
      "items.sellerId": sellerId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .populate("items.sellerId", "name storeName")
      .populate("address")
      .sort({ createdAt: -1 });

    const sellerOrders = orders.map((order) => {
      const sellerItems = order.items.filter(
        (item) =>
          item.sellerId?._id?.toString() === sellerId.toString()
      );

      return {
        ...order.toObject(),
        items: sellerItems,
      };
    });

    res.status(200).json({
      success: true,
      orders: sellerOrders,
    });
  } catch (error) {
    console.error("Error in getSellerOrders:", error);

    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// =====================================================
// UPDATE ORDER STATUS FOR LOGGED-IN SELLER
// =====================================================

export const updateSellerOrderStatus = async (req, res) => {
  try {
    const sellerId = req.seller;
    const { orderId, status } = req.body;

    const allowedStatuses = [
      "Order Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!orderId || !status) {
      return res.status(400).json({
        message: "Order ID and status are required",
        success: false,
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
        success: false,
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      "items.sellerId": sellerId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found or access denied",
        success: false,
      });
    }

    // Update status only for this seller's items
    let sellerItemFound = false;

    order.items.forEach((item) => {
      if (item.sellerId.toString() === sellerId.toString()) {
        item.status = status;
        sellerItemFound = true;
      }
    });

    if (!sellerItemFound) {
      return res.status(403).json({
        message: "You do not have access to this order item",
        success: false,
      });
    }

    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      success: true,
      status,
    });
  } catch (error) {
    console.error("Error in updateSellerOrderStatus:", error);

    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};