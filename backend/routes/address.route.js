import express from "express";

import authUser from "../middlewares/authUsers.js";

import {
  addAddress,
  getAddress,
  updateAddress,
} from "../controllers/address.controller.js";

const router = express.Router();

router.post("/add", authUser, addAddress);

router.get("/get", authUser, getAddress);

router.put("/update", authUser, updateAddress);

export default router;