import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },

    items: [
      {
        product: {
          type: String,
          required: true,
          ref: "Product",
        },

        sellerId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },

        quantity: {
          type: Number,
          required: true,
        },

        // Seller-specific order status
        status: {
          type: String,
          enum: [
            "Order Placed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
          ],
          default: "Order Placed",
        },
      },
    ],

    amount: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      required: true,
      ref: "Address",
    },

    // Overall order status
    // Kept for customer/admin compatibility for now
    status: {
      type: String,
      default: "Order Placed",
    },

    paymentType: {
      type: String,
      required: true,
    },

    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;