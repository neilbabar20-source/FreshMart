import express from "express";

import {
  isAuthSeller,
  sellerLogin,
  sellerLogout,
  sellerRegister,
  getSellerDashboardData,
  getSellerApplicationStatus,
} from "../controllers/seller.controller.js";

import { authSeller } from "../middlewares/authSeller.js";

const router = express.Router();

// Seller registration/application
router.post("/register", sellerRegister);

// Check seller application status
router.get("/status", getSellerApplicationStatus);

// Seller login
router.post("/login", sellerLogin);

// Check seller authentication
router.get("/is-auth", authSeller, isAuthSeller);

// Seller logout
router.get("/logout", authSeller, sellerLogout);

// Seller dashboard
router.get("/dashboard", authSeller, getSellerDashboardData);

export default router;