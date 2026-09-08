import Product from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";

// =====================================================
// ADD PRODUCT
// /api/product/add-product
// =====================================================

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      offerPrice,
      category,
      stock,
    } = req.body;

    if (
      !name ||
      !price ||
      !offerPrice ||
      !description ||
      !category ||
      stock === undefined ||
      stock === "" ||
      !req.files ||
      req.files.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields including stock and images are required",
      });
    }

    const sellerId = req.seller;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller not authenticated",
      });
    }

    const stockQuantity = Number(stock);

    if (
      !Number.isInteger(stockQuantity) ||
      stockQuantity < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a valid number greater than or equal to 0",
      });
    }

    // Upload images to Cloudinary
    const imageUploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "freshmart/products",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );

        uploadStream.end(file.buffer);
      });
    });

    const image = await Promise.all(imageUploadPromises);

    await Product.create({
      name,
      description,
      price,
      offerPrice,
      category,
      image,
      sellerId,
      stock: stockQuantity,
      inStock: stockQuantity > 0,
    });

    res.status(201).json({
      message: "Product added successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in addProduct:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while adding product",
    });
  }
};


// =====================================================
// GET ALL PRODUCTS
// /api/product/list
// Customer/Admin
// =====================================================

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("sellerId", "name storeName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      products,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// =====================================================
// GET SELLER PRODUCTS
// /api/product/seller
// Seller's own products only
// =====================================================

export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.seller;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller not authenticated",
      });
    }

    const products = await Product.find({ sellerId })
      .populate("sellerId", "name storeName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      products,
      success: true,
    });
  } catch (error) {
    console.error("Error in getSellerProducts:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE PRODUCT
// /api/product/id
// =====================================================

export const getProductById = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(id)
      .populate("sellerId", "name storeName");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error in getProductById:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    });
  }
};


// =====================================================
// CHANGE STOCK
// /api/product/stock
// Seller's own product only
// =====================================================

export const changeStock = async (req, res) => {
  try {
    const { id, stock } = req.body;
    const sellerId = req.seller;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller not authenticated",
      });
    }

    if (!id || stock === undefined || stock === "") {
      return res.status(400).json({
        success: false,
        message: "Product ID and stock are required",
      });
    }

    const stockQuantity = Number(stock);

    if (
      !Number.isInteger(stockQuantity) ||
      stockQuantity < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a valid number greater than or equal to 0",
      });
    }

    const product = await Product.findOneAndUpdate(
      {
        _id: id,
        sellerId,
      },
      {
        stock: stockQuantity,
        inStock: stockQuantity > 0,
      },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you do not own this product",
      });
    }

    res.status(200).json({
      success: true,
      product,
      message: "Stock updated successfully",
    });
  } catch (error) {
    console.error("Error in changeStock:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// =====================================================
// EDIT PRODUCT
// /api/product/update
// Seller's own product only
// =====================================================

export const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      offerPrice,
      category,
    } = req.body;

    const sellerId = req.seller;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller not authenticated",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findOne({
      _id: id,
      sellerId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you do not own this product",
      });
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (offerPrice !== undefined) product.offerPrice = offerPrice;
    if (category !== undefined) product.category = category;

    // If new images are provided, upload them
    if (req.files && req.files.length > 0) {
      const imageUploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "freshmart/products",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          );

          uploadStream.end(file.buffer);
        });
      });

      const newImages = await Promise.all(imageUploadPromises);

      product.image = newImages;
    }

    await product.save();

    res.status(200).json({
      success: true,
      product,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error in updateProduct:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating product",
    });
  }
};


// =====================================================
// DELETE PRODUCT
// /api/product/delete
// Seller's own product only
// =====================================================

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const sellerId = req.seller;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller not authenticated",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findOneAndDelete({
      _id: id,
      sellerId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you do not own this product",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProduct:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};