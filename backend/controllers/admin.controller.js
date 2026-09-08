import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

// =====================================================
// ADMIN LOGIN
// =====================================================

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
        email: process.env.ADMIN_EMAIL,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Admin login successful",
      admin: {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// CHECK ADMIN AUTHENTICATION
// =====================================================

export const isAuthAdmin = async (req, res) => {
  try {
    res.json({
      success: true,
      admin: {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ADMIN LOGOUT
// =====================================================

export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminToken");

    res.json({
      success: true,
      message: "Admin logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ADMIN DASHBOARD DATA
// =====================================================

export const getDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    const totalSellers = await User.countDocuments({
      role: "seller",
    });

    const pendingSellers = await User.countDocuments({
      role: "seller",
      sellerStatus: "pending",
    });

    const activeSellers = await User.countDocuments({
      role: "seller",
      sellerStatus: "active",
    });

    const rejectedSellers = await User.countDocuments({
      role: "seller",
      sellerStatus: "rejected",
    });

    const inactiveSellers = await User.countDocuments({
      role: "seller",
      sellerStatus: "inactive",
    });

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalSales =
      salesData.length > 0 ? salesData[0].totalSales : 0;

    res.json({
      success: true,
      dashboard: {
        totalUsers,
        totalSellers,
        activeSellers,
        inactiveSellers,
        pendingSellers,
        rejectedSellers,
        totalProducts,
        totalOrders,
        totalSales,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL SELLERS
// =====================================================

export const getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({
      role: "seller",
    })
      .select("-password")
      .sort({ _id: -1 });

    res.json({
      success: true,
      sellers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// APPROVE SELLER
// =====================================================

export const approveSeller = async (req, res) => {
  try {
    const { sellerId } = req.body;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required",
      });
    }

    const seller = await User.findOne({
      _id: sellerId,
      role: "seller",
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    seller.sellerStatus = "active";

    await seller.save();

    res.json({
      success: true,
      message: "Seller approved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// REJECT SELLER
// =====================================================

export const rejectSeller = async (req, res) => {
  try {
    const { sellerId } = req.body;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required",
      });
    }

    const seller = await User.findOne({
      _id: sellerId,
      role: "seller",
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    seller.sellerStatus = "rejected";

    await seller.save();

    res.json({
      success: true,
      message: "Seller rejected successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ACTIVATE / DEACTIVATE SELLER
// =====================================================

export const activateSeller = async (req, res) => {
  try {
    const { sellerId } = req.body;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required",
      });
    }

    const seller = await User.findOne({
      _id: sellerId,
      role: "seller",
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // Rejected -> Active
    if (seller.sellerStatus === "rejected") {
      seller.sellerStatus = "active";

      await seller.save();

      return res.json({
        success: true,
        message: "Seller activated successfully",
      });
    }

    // Active -> Inactive
    if (seller.sellerStatus === "active") {
      seller.sellerStatus = "inactive";

      await seller.save();

      return res.json({
        success: true,
        message: "Seller deactivated successfully",
      });
    }

    // Inactive -> Active
    if (seller.sellerStatus === "inactive") {
      seller.sellerStatus = "active";

      await seller.save();

      return res.json({
        success: true,
        message: "Seller activated successfully",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Seller cannot be activated or deactivated",
    });
  } catch (error) {
    console.error("Error in activateSeller:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =====================================================
// ADMIN PRODUCT MANAGEMENT
// =====================================================

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("sellerId", "name email storeName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};

// =====================================================
// DELETE ANY PRODUCT
// =====================================================

export const adminDeleteProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully by admin",
    });
  } catch (error) {
    console.error("Error in adminDeleteProduct:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};

// =====================================================
// ADMIN ORDER MANAGEMENT
// =====================================================

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("items.product")
      .populate("items.sellerId", "name email storeName")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error in getAllOrders:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    });
  }
};