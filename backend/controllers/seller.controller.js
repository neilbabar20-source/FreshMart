import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// seller register: /api/seller/register
// New seller application create karna
export const sellerRegister = async (req, res) => {
  try {
    const { name, email, password, storeName, phone } = req.body;

    if (!name || !email || !password || !storeName || !phone) {
      return res.status(400).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = new User({
      name,
      email,
      password: hashedPassword,
      role: "seller",
      sellerStatus: "pending",
      storeName,
      phone,
    });

    await seller.save();

    return res.status(201).json({
      message: "Seller application submitted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in sellerRegister:", error);

    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// check seller application status: /api/seller/status
export const getSellerApplicationStatus = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: "Please enter your registered email",
        success: false,
      });
    }

    const seller = await User.findOne({
      email: email.trim().toLowerCase(),
      role: "seller",
    }).select("name email storeName sellerStatus");

    if (!seller) {
      return res.status(404).json({
        message: "No seller application found with this email",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      status: seller.sellerStatus,
      seller: {
        name: seller.name,
        email: seller.email,
        storeName: seller.storeName,
      },
    });
  } catch (error) {
    console.error("Error in getSellerApplicationStatus:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// seller login: /api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    const seller = await User.findOne({ email });

    if (!seller || seller.role !== "seller") {
      return res.status(400).json({
        message: "Invalid seller credentials",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, seller.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid seller credentials",
        success: false,
      });
    }

    // Seller application is still waiting for admin approval
    if (seller.sellerStatus === "pending") {
      return res.status(403).json({
        message: "Your seller application is still under review",
        success: false,
        status: "pending",
      });
    }

    // Seller application was rejected
    if (seller.sellerStatus === "rejected") {
      return res.status(403).json({
        message: "Your seller application has been rejected",
        success: false,
        status: "rejected",
      });
    }

    // Only active sellers can login
    if (seller.sellerStatus !== "active") {
      return res.status(403).json({
        message: "Seller account is not active",
        success: false,
      });
    }

    const token = jwt.sign(
      {
        id: seller._id,
        role: seller.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("sellerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        storeName: seller.storeName,
        phone: seller.phone,
        role: seller.role,
      },
    });
  } catch (error) {
    console.error("Error in sellerLogin:", error);

    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// logout seller: /api/seller/logout
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "none" : "Strict",
    });

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in sellerLogout:", error);

    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// check seller auth: /api/seller/is-auth
export const isAuthSeller = async (req, res) => {
  try {
    const seller = await User.findById(req.seller).select("-password");

    if (!seller || seller.role !== "seller") {
      return res.status(401).json({
        message: "Seller not authenticated",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    console.error("Error in isAuthSeller:", error);

    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// seller dashboard: /api/seller/dashboard
export const getSellerDashboardData = async (req, res) => {
  try {
    const sellerId = req.seller;

    // Total products owned by this seller
    const totalProducts = await Product.countDocuments({
      sellerId,
    });

    // Orders containing this seller's products
    const sellerOrders = await Order.find({
      "items.sellerId": sellerId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    const totalOrders = sellerOrders.length;

    // Calculate seller's total sales
    let totalSales = 0;

    sellerOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (
          item.sellerId &&
          item.sellerId.toString() === sellerId.toString() &&
          item.product
        ) {
          totalSales += item.product.offerPrice * item.quantity;
        }
      });
    });

    // Seller-specific pending orders
    let pendingOrders = 0;

    sellerOrders.forEach((order) => {
      const sellerItems = order.items.filter(
        (item) =>
          item.sellerId &&
          item.sellerId.toString() === sellerId.toString()
      );

      const hasPendingItem = sellerItems.some(
        (item) =>
          !item.status ||
          item.status === "Order Placed"
      );

      if (hasPendingItem) {
        pendingOrders++;
      }
    });

    // Low stock products
    // Only products with stock between 1 and 5
    const lowStockProducts = await Product.countDocuments({
      sellerId,
      stock: {
        $gt: 0,
        $lte: 5,
      },
    });

    // Out of stock products
    const outOfStockProducts = await Product.countDocuments({
      sellerId,
      stock: 0,
    });

    // Recent 5 orders
    const recentOrders = sellerOrders
      .slice(0, 5)
      .map((order) => {
        const sellerItems = order.items.filter(
          (item) =>
            item.sellerId &&
            item.sellerId.toString() === sellerId.toString()
        );

        return {
          ...order.toObject(),
          items: sellerItems,
        };
      });

    return res.status(200).json({
      success: true,
      dashboard: {
        totalProducts,
        totalOrders,
        totalSales,
        pendingOrders,
        lowStockProducts,
        outOfStockProducts,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Error in getSellerDashboardData:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};