import express from "express";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/payment.controller.js";

import authUser from "../middlewares/authUsers.js";

const router = express.Router();

// Create Razorpay order
router.post(
  "/create-order",
  authUser,
  createRazorpayOrder
);

// Verify Razorpay payment + create FreshMart order
router.post(
  "/verify-payment",
  authUser,
  verifyRazorpayPayment
);

export default router;