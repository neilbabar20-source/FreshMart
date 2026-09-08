import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "seller"],
      default: "user",
    },

    sellerStatus: {
      type: String,
      enum: ["pending", "active", "inactive", "rejected"],
      default: "pending",
    },

    storeName: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    cartItems: {
      type: Object,
      default: {},
    },
  },
  {
    minimize: false,
  }
);

const User = mongoose.model("User", userSchema);

export default User;