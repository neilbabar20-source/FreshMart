import express from "express";

import {
  getAllOrders,
  getSellerOrders,
  getUserOrders,
  getUserInsights,
  placeOrderCOD,
  updateSellerOrderStatus,
} from "../controllers/order.controller.js";

import { authSeller } from "../middlewares/authSeller.js";
import authUser from "../middlewares/authUsers.js";

const router = express.Router();

router.post("/cod", authUser, placeOrderCOD);

router.get("/user", authUser, getUserOrders);

router.get("/insights", authUser, getUserInsights);

router.get("/seller", authSeller, getSellerOrders);

router.post(
  "/seller/status",
  authSeller,
  updateSellerOrderStatus
);

export default router;