import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const ProductList = () => {
  const { axios } = useContext(AppContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [stockValues, setStockValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingStock, setUpdatingStock] = useState(null);

  const fetchSellerProducts = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/product/seller");

      if (data.success) {
        setProducts(data.products);

        const initialStockValues = {};

        data.products.forEach((product) => {
          initialStockValues[product._id] = product.stock ?? 0;
        });

        setStockValues(initialStockValues);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (id, value) => {
    if (value === "") {
      setStockValues((prev) => ({
        ...prev,
        [id]: "",
      }));
      return;
    }

    const stock = Number(value);

    if (!Number.isInteger(stock) || stock < 0) {
      return;
    }

    setStockValues((prev) => ({
      ...prev,
      [id]: stock,
    }));
  };

  const increaseStock = (product) => {
    const currentStock = Number(stockValues[product._id] ?? 0);

    setStockValues((prev) => ({
      ...prev,
      [product._id]: currentStock + 1,
    }));
  };

  const decreaseStock = (product) => {
    const currentStock = Number(stockValues[product._id] ?? 0);

    if (currentStock <= 0) return;

    setStockValues((prev) => ({
      ...prev,
      [product._id]: currentStock - 1,
    }));
  };

  const updateStock = async (product) => {
    const stock = Number(stockValues[product._id]);

    if (!Number.isInteger(stock) || stock < 0) {
      toast.error("Stock must be 0 or a positive number");
      return;
    }

    try {
      setUpdatingStock(product._id);

      const { data } = await axios.post("/api/product/stock", {
        id: product._id,
        stock,
      });

      if (data.success) {
        setProducts((prevProducts) =>
          prevProducts.map((item) =>
            item._id === product._id
              ? {
                  ...item,
                  stock: stock,
                  inStock: stock > 0,
                }
              : item
          )
        );

        setStockValues((prev) => ({
          ...prev,
          [product._id]: stock,
        }));

        toast.success(data.message || "Stock updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUpdatingStock(null);
    }
  };

  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const { data } = await axios.post("/api/product/delete", {
        id,
      });

      if (data.success) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );

        setStockValues((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  return (
    <div className="flex-1 py-10 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">My Products</h2>

        <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          {loading ? (
            <div className="py-10 text-gray-500">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="py-10 text-gray-500">
              You haven't added any products yet.
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="md:table-auto table-fixed w-full overflow-hidden">
                <thead className="text-gray-900 text-sm text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold truncate">
                      Product
                    </th>

                    <th className="px-4 py-3 font-semibold truncate">
                      Category
                    </th>

                    <th className="px-4 py-3 font-semibold truncate hidden md:table-cell">
                      Selling Price
                    </th>

                    <th className="px-4 py-3 font-semibold truncate">
                      Stock
                    </th>

                    <th className="px-4 py-3 font-semibold truncate">
                      Status
                    </th>

                    <th className="px-4 py-3 font-semibold truncate">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="text-sm text-gray-500">
                  {products.map((product) => {
                    const savedStock = product.stock ?? 0;
                    const currentStock = stockValues[product._id] ?? 0;

                    const isLowStock =
                      Number(currentStock) > 0 &&
                      Number(currentStock) <= 5;

                    const hasChanges =
                      Number(currentStock) !== Number(savedStock);

                    return (
                      <tr
                        key={product._id}
                        className="border-t border-gray-500/20"
                      >
                        {/* Product */}
                        <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                          <div className="border border-gray-300 rounded p-2">
                            <img
                              src={
                                product.image?.[0]?.startsWith("http")
                                  ? product.image[0]
                                  : `${import.meta.env.VITE_BACKEND_URL}/images/${product.image?.[0]}`
                              }
                              alt={product.name}
                              className="w-16"
                            />
                          </div>

                          <span className="truncate max-sm:hidden w-full">
                            {product.name}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3">
                          {product.category}
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3 max-sm:hidden">
                          ₹{product.offerPrice}
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decreaseStock(product)}
                              disabled={
                                Number(currentStock) <= 0 ||
                                updatingStock === product._id
                              }
                              className="w-7 h-7 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              -
                            </button>

                            <input
                              type="number"
                              min="0"
                              value={currentStock}
                              disabled={updatingStock === product._id}
                              onChange={(e) =>
                                handleStockChange(
                                  product._id,
                                  e.target.value
                                )
                              }
                              className="w-14 text-center border border-gray-300 rounded px-1 py-1 outline-none"
                            />

                            <button
                              onClick={() => increaseStock(product)}
                              disabled={updatingStock === product._id}
                              className="w-7 h-7 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>

                          {isLowStock && (
                            <p className="text-xs text-orange-500 mt-1">
                              Low stock
                            </p>
                          )}

                          {hasChanges && (
                            <button
                              onClick={() => updateStock(product)}
                              disabled={updatingStock === product._id}
                              className="mt-2 px-3 py-1 rounded bg-green-500 text-white text-xs hover:bg-green-600 disabled:opacity-50"
                            >
                              {updatingStock === product._id
                                ? "Saving..."
                                : "Save"}
                            </button>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          {Number(currentStock) > 0 ? (
                            <span className="text-green-600 font-medium">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-red-500 font-medium">
                              Out of Stock
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/seller/edit-product/${product._id}`
                                )
                              }
                              className="px-3 py-1.5 rounded-md bg-blue-500 text-white text-xs hover:bg-blue-600 transition"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                deleteProduct(product._id)
                              }
                              className="px-3 py-1.5 rounded-md bg-red-500 text-white text-xs hover:bg-red-600 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;