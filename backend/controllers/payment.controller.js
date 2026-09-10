import crypto from "crypto";
import Razorpay from "razorpay";

import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// =====================================================
// RAZORPAY INSTANCE
// =====================================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================================================
// CREATE RAZORPAY ORDER
// POST /api/payment/create-order
// =====================================================

export const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body;

    // =========================
    // BASIC VALIDATION
    // =========================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    if (!address || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: "Items and address are required",
      });
    }

    // =========================
    // CALCULATE TOTAL FROM DB
    // =========================

    let subtotal = 0;

    for (const item of items) {
      const requestedQuantity = Number(item.quantity);

      if (!requestedQuantity || requestedQuantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid product quantity",
        });
      }

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // =========================
      // STOCK CHECK
      // =========================

      if (!product.inStock || product.stock <= 0) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is currently out of stock`,
        });
      }

      if (requestedQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} unit${
            product.stock === 1 ? "" : "s"
          } of ${product.name} are available`,
        });
      }

      subtotal += product.offerPrice * requestedQuantity;
    }

    // =========================
    // TAX / CHARGE
    // =========================

    const tax = Math.floor((subtotal * 2) / 100);

    const totalAmount = subtotal + tax;

    // Razorpay amount must be in paise
    const amountInPaise = Math.round(totalAmount * 100);

    if (amountInPaise < 100) {
      return res.status(400).json({
        success: false,
        message: "Minimum payment amount is ₹1",
      });
    }

    // =========================
    // CREATE RAZORPAY ORDER
    // =========================

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `freshmart_${Date.now()}`,
    });

    // =========================
    // SEND RESPONSE
    // =========================

    res.status(200).json({
      success: true,
      message: "Razorpay order created successfully",
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      totalAmount,
    });
  } catch (error) {
    console.error("CREATE RAZORPAY ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message:
        error?.error?.description ||
        error.message ||
        "Failed to create Razorpay order",
    });
  }
};

// =====================================================
// VERIFY RAZORPAY PAYMENT
// POST /api/payment/verify-payment
// =====================================================

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const userId = req.user;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      address,
    } = req.body;

    // =========================
    // BASIC VALIDATION
    // =========================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are required",
      });
    }

    if (!items || !items.length || !address) {
      return res.status(400).json({
        success: false,
        message: "Items and address are required",
      });
    }

    // =========================
    // VERIFY RAZORPAY SIGNATURE
    // =========================

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    // =========================
    // FETCH RAZORPAY ORDER
    // =========================

    const razorpayOrder =
      await razorpay.orders.fetch(razorpay_order_id);

    if (!razorpayOrder) {
      return res.status(404).json({
        success: false,
        message: "Razorpay order not found",
      });
    }

    // =========================
    // CALCULATE TOTAL FROM DB
    // =========================

    const orderItems = [];

    const deductedStock = [];

    let subtotal = 0;

    // =================================================
    // IMPORTANT:
    // FIRST VALIDATE EVERYTHING.
    //
    // We do NOT deduct stock during validation.
    // This prevents partial stock deduction if a
    // later product is invalid.
    // =================================================

    for (const item of items) {
      const requestedQuantity = Number(item.quantity);

      if (!requestedQuantity || requestedQuantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid product quantity",
        });
      }

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (!product.sellerId) {
        return res.status(400).json({
          success: false,
          message: `Seller information missing for product: ${product.name}`,
        });
      }

      // Current stock check
      if (!product.inStock || product.stock <= 0) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is currently out of stock`,
        });
      }

      if (requestedQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} unit${
            product.stock === 1 ? "" : "s"
          } of ${product.name} are available`,
        });
      }

      orderItems.push({
        product: product._id,
        sellerId: product.sellerId,
        quantity: requestedQuantity,
        status: "Order Placed",
      });

      subtotal += product.offerPrice * requestedQuantity;
    }

    // =========================
    // TAX / FINAL TOTAL
    // =========================

    const tax = Math.floor((subtotal * 2) / 100);

    const totalAmount = subtotal + tax;

    const expectedAmountInPaise = Math.round(
      totalAmount * 100
    );

    // =========================
    // VERIFY RAZORPAY AMOUNT
    // =========================

    if (
      Number(razorpayOrder.amount) !==
      expectedAmountInPaise
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment amount does not match order amount",
      });
    }

    // =========================
    // VERIFY CURRENCY
    // =========================

    if (razorpayOrder.currency !== "INR") {
      return res.status(400).json({
        success: false,
        message: "Invalid payment currency",
      });
    }

    // =================================================
    // ATOMIC STOCK DEDUCTION
    // =================================================

    for (const item of items) {
      const requestedQuantity = Number(item.quantity);

      const product = await Product.findOneAndUpdate(
        {
          _id: item.product,
          inStock: true,
          stock: {
            $gte: requestedQuantity,
          },
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
      // after our initial validation.
      if (!product) {
        // Restore anything already deducted
        for (const deduction of deductedStock) {
          const restoredProduct =
            await Product.findByIdAndUpdate(
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
            await Product.findByIdAndUpdate(
              deduction.productId,
              {
                inStock: restoredProduct.stock > 0,
              }
            );
          }
        }

        const latestProduct = await Product.findById(
          item.product
        );

        if (!latestProduct || latestProduct.stock <= 0) {
          return res.status(400).json({
            success: false,
            message: "Product is currently out of stock",
          });
        }

        return res.status(400).json({
          success: false,
          message: `Only ${latestProduct.stock} unit${
            latestProduct.stock === 1 ? "" : "s"
          } of ${latestProduct.name} are available`,
          success: false,
        });
      }

      // Update inStock status
      if (product.stock === 0) {
        await Product.findByIdAndUpdate(
          product._id,
          {
            inStock: false,
          }
        );
      }

      deductedStock.push({
        productId: product._id,
        quantity: requestedQuantity,
      });
    }

    // =================================================
    // CREATE FRESHMART ORDER
    // =================================================

    try {
      await Order.create({
        userId,
        items: orderItems,
        address,
        amount: totalAmount,
        paymentType: "Online",
        isPaid: true,
        status: "Order Placed",
      });
    } catch (orderError) {
      // =========================
      // RESTORE STOCK
      // =========================

      for (const deduction of deductedStock) {
        const restoredProduct =
          await Product.findByIdAndUpdate(
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
          await Product.findByIdAndUpdate(
            deduction.productId,
            {
              inStock: restoredProduct.stock > 0,
            }
          );
        }
      }

      throw orderError;
    }

    // =========================
    // SUCCESS
    // =========================

    res.status(200).json({
      success: true,
      message: "Payment verified and order placed successfully",
    });
  } catch (error) {
    console.error(
      "VERIFY RAZORPAY PAYMENT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Payment verification failed",
    });
  }
};