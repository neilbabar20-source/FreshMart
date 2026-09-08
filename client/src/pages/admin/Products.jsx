import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/admin/products");

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching admin products:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(productId);

      const { data } = await axios.post("/api/admin/products/delete", {
        id: productId,
      });

      if (data.success) {
        toast.success("Product deleted successfully");

        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Product Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all products listed by sellers.
          </p>
        </div>

        <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
          Total Products: {products.length}
        </div>
      </div>

      {/* No products */}
      {products.length === 0 ? (
        <div className="flex items-center justify-center min-h-[300px] bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500">No products found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto bg-white border border-gray-200 rounded-lg md:block">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-600 bg-gray-50">
                <tr>
                  <th className="px-5 py-4 font-semibold">Product</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Price</th>
                  <th className="px-5 py-4 font-semibold">Stock</th>
                  <th className="px-5 py-4 font-semibold">Seller</th>
                  <th className="px-5 py-4 font-semibold text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image?.[0]}
                          alt={product.name}
                          className="object-cover w-14 h-14 border rounded-md"
                        />

                        <div>
                          <p className="font-medium text-gray-800">
                            {product.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            ID: {product._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 text-gray-600">
                      {product.category}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        ₹{product.offerPrice}
                      </p>

                      {product.price > product.offerPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ₹{product.price}
                        </p>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <span
                        className={`font-medium ${
                          product.stock === 0
                            ? "text-red-600"
                            : product.stock <= 5
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.stock}
                      </span>

                      <p className="text-xs text-gray-400">
                        {product.stock === 0
                          ? "Out of stock"
                          : product.stock <= 5
                          ? "Low stock"
                          : "In stock"}
                      </p>
                    </td>

                    {/* Seller */}
                    <td className="px-5 py-4">
                      {product.sellerId ? (
                        <div>
                          <p className="font-medium text-gray-800">
                            {product.sellerId.storeName ||
                              product.sellerId.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {product.sellerId.name}
                          </p>

                          {product.sellerId.email && (
                            <p className="text-xs text-gray-400">
                              {product.sellerId.email}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-red-500">No seller</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deletingId === product._id}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === product._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {products.map((product) => (
              <div
                key={product._id}
                className="p-4 bg-white border border-gray-200 rounded-lg"
              >
                {/* Product Header */}
                <div className="flex gap-3">
                  <img
                    src={product.image?.[0]}
                    alt={product.name}
                    className="object-cover w-20 h-20 border rounded-md"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-800">
                      {product.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {product.category}
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      ₹{product.offerPrice}
                    </p>
                  </div>
                </div>

                {/* Product Information */}
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  <div className="p-3 rounded-md bg-gray-50">
                    <p className="text-xs text-gray-400">Stock</p>

                    <p
                      className={`mt-1 font-medium ${
                        product.stock === 0
                          ? "text-red-600"
                          : product.stock <= 5
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {product.stock}
                    </p>
                  </div>

                  <div className="p-3 rounded-md bg-gray-50">
                    <p className="text-xs text-gray-400">Seller</p>

                    <p className="mt-1 font-medium text-gray-700">
                      {product.sellerId?.storeName ||
                        product.sellerId?.name ||
                        "No seller"}
                    </p>
                  </div>
                </div>

                {/* Seller Details */}
                {product.sellerId && (
                  <div className="p-3 mt-3 rounded-md bg-gray-50">
                    <p className="text-xs text-gray-400">Seller Details</p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {product.sellerId.name}
                    </p>

                    {product.sellerId.email && (
                      <p className="text-xs text-gray-500">
                        {product.sellerId.email}
                      </p>
                    )}
                  </div>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleDelete(product._id)}
                  disabled={deletingId === product._id}
                  className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === product._id
                    ? "Deleting..."
                    : "Delete Product"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Products;