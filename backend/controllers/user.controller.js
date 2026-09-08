import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register user: /api/user/register
// New customer ko create karna
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// login user: /api/user/login
// Existing customer ka login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
        success: false,
      });
    }

    // Seller ko customer login se login karne nahi dena
    if (user.role !== "user") {
      return res.status(403).json({
        message: "Please use the seller login",
        success: false,
      });
    }

    // Blocked customer ko login nahi karne dena
    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked by admin",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Logged in successfull",
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// logout user: /api/user/logout
// User ko logout karna
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// check auth user: /api/user/is-auth
// Login/auth status check
export const isAuthUser = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};


// ================= ADMIN USER MANAGEMENT =================

// Get all customer users
// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ _id: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);

    res.status(500).json({
      message: "Server error while fetching users",
      success: false,
    });
  }
};


// Block / Unblock customer
// POST /api/admin/users/toggle-block
export const toggleUserBlock = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "User id is required",
        success: false,
      });
    }

    const user = await User.findOne({
      _id: id,
      role: "user",
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.status(200).json({
      message: user.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      success: true,
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    console.error("Error in toggleUserBlock:", error);

    res.status(500).json({
      message: "Server error while updating user status",
      success: false,
    });
  }
};