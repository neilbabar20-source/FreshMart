import express from "express";

import {
  getAllOrders,
  getUserOrders,
  placeOrderCOD,
} from "../controllers/order.controller.js";
import { authSeller } from "../middlewares/authSeller.js";
import authUser from "../middlewares/authUsers.js";

const router = express.Router();
router.post("/cod", authUser, placeOrderCOD);
router.get("/user", authUser, getUserOrders);
router.get("/seller", authSeller, getAllOrders);

export default router;