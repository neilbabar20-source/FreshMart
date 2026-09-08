import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: Array,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    offerPrice: {
      type: Number,
      required: true,
    },

    image: {
      type: Array,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    // Actual quantity of products available
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // Automatically represents whether product is available
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },

    // Seller who owns this product
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;