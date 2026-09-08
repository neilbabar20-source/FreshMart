import express from "express";

import {
  adminLogin,
  isAuthAdmin,
  adminLogout,
  getDashboardData,
  getAllSellers,
  approveSeller,
  rejectSeller,
  activateSeller,
  getAllProducts,
  adminDeleteProduct,
  getAllOrders,
} from "../controllers/admin.controller.js";

import {
  getAllUsers,
  toggleUserBlock,
} from "../controllers/user.controller.js";

import { authAdmin } from "../middlewares/authAdmin.js";

const router = express.Router();

// =====================================================
// ADMIN AUTH
// =====================================================

router.post("/login", adminLogin);

router.get("/is-auth", authAdmin, isAuthAdmin);

router.get("/logout", authAdmin, adminLogout);


// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get("/dashboard", authAdmin, getDashboardData);


// =====================================================
// SELLER MANAGEMENT
// =====================================================

router.get("/sellers", authAdmin, getAllSellers);

router.post("/sellers/approve", authAdmin, approveSeller);

router.post("/sellers/reject", authAdmin, rejectSeller);

router.post("/sellers/activate", authAdmin, activateSeller);


// =====================================================
// PRODUCT MANAGEMENT
// =====================================================

// Get all products
router.get("/products", authAdmin, getAllProducts);

// Delete any product
router.post("/products/delete", authAdmin, adminDeleteProduct);


// =====================================================
// ORDER MANAGEMENT
// =====================================================

// Get all orders
router.get("/orders", authAdmin, getAllOrders);


// =====================================================
// USER MANAGEMENT
// =====================================================

// Get all customer users
router.get("/users", authAdmin, getAllUsers);

// Block / Unblock customer
router.post("/users/toggle-block", authAdmin, toggleUserBlock);


export default router;