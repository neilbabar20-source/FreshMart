import express from "express";

import { authSeller } from "../middlewares/authSeller.js";

import authUser from "../middlewares/authUsers.js";

import { upload } from "../config/multer.js";

import {
  addProduct,
  getProductById,
  getProducts,
  getSellerProducts,
  changeStock,
  updateProduct,
  deleteProduct,
  getRecommendations,
  getBestSellers,
} from "../controllers/product.controller.js";

const router = express.Router();

// =====================================================
// SELLER: ADD PRODUCT
// =====================================================

router.post(
  "/add-product",
  authSeller,
  upload.array("image"),
  addProduct
);

// =====================================================
// CUSTOMER / ADMIN: GET ALL PRODUCTS
// =====================================================

router.get("/list", getProducts);

// =====================================================
// CUSTOMER: PERSONALIZED RECOMMENDATIONS
// =====================================================

router.get(
  "/recommendations",
  authUser,
  getRecommendations
);

// =====================================================
// CUSTOMER: GLOBAL BEST SELLERS
// All users combined purchase history
// =====================================================

router.get(
  "/best-sellers",
  getBestSellers
);

// =====================================================
// SELLER: GET OWN PRODUCTS
// =====================================================

router.get(
  "/seller",
  authSeller,
  getSellerProducts
);

// =====================================================
// GET SINGLE PRODUCT
// =====================================================

router.get("/id", getProductById);

// =====================================================
// SELLER: CHANGE STOCK
// =====================================================

router.post(
  "/stock",
  authSeller,
  changeStock
);

// =====================================================
// SELLER: UPDATE OWN PRODUCT
// =====================================================

router.post(
  "/update",
  authSeller,
  upload.array("image"),
  updateProduct
);

// =====================================================
// SELLER: DELETE OWN PRODUCT
// =====================================================

router.post(
  "/delete",
  authSeller,
  deleteProduct
);

export default router;