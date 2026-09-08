import express from "express";

import { authSeller } from "../middlewares/authSeller.js";

import { upload } from "../config/multer.js";

import {
  addProduct,
  getProductById,
  getProducts,
  getSellerProducts,
  changeStock,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// Seller: add product
router.post(
  "/add-product",
  authSeller,
  upload.array("image"),
  addProduct
);

// Customer/Admin: get all products
router.get("/list", getProducts);

// Seller: get only own products
router.get("/seller", authSeller, getSellerProducts);

// Get single product
router.get("/id", getProductById);

// Seller: change own product stock
router.post("/stock", authSeller, changeStock);

// Seller: update own product
router.post(
  "/update",
  authSeller,
  upload.array("image"),
  updateProduct
);

// Seller: delete own product
router.post(
  "/delete",
  authSeller,
  deleteProduct
);

export default router;