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
      toast.error(
        error.response?.data?.message || error.message
      );
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
    const currentStock = Number(
      stockValues[product._id] ?? 0
    );

    setStockValues((prev) => ({
      ...prev,
      [product._id]: currentStock + 1,
    }));
  };

  const decreaseStock = (product) => {
    const currentStock = Number(
      stockValues[product._id] ?? 0
    );

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

      const { data } = await axios.post(
        "/api/product/stock",
        {
          id: product._id,
          stock,
        }
      );

      if (data.success) {
        setProducts((prevProducts) =>
          prevProducts.map((item) =>
            item._id === product._id
              ? {
                  ...item,
                  stock,
                  inStock: stock > 0,
                }
              : item
          )
        );

        setStockValues((prev) => ({
          ...prev,
          [product._id]: stock,
        }));

        toast.success(
          data.message || "Stock updated successfully"
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
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
      const { data } = await axios.post(
        "/api/product/delete",
        { id }
      );

      if (data.success) {
        setProducts((prevProducts) =>
          prevProducts.filter(
            (product) => product._id !== id
          )
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
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-full">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-5">
          <p className="text-xs font-medium text-green-600">
            Store Management
          </p>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mt-1">
                My Products
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage your products, pricing and stock.
              </p>
            </div>

            <span className="text-xs text-gray-400">
              {products.length} product
              {products.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {loading ? (
            <div className="p-5 space-y-4">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 animate-pulse"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>

                  <div className="flex-1">
                    <div className="h-3 w-40 bg-gray-200 rounded"></div>
                    <div className="h-2.5 w-24 bg-gray-200 rounded mt-2"></div>
                  </div>

                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              ))}

            </div>
          ) : products.length === 0 ? (
            <div className="py-12 px-5 text-center">

              <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-400">
                  P
                </span>
              </div>

              <h2 className="text-base font-semibold text-gray-800 mt-4">
                No Products Yet
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                You haven't added any products to your store.
              </p>

              <button
                onClick={() => navigate("/seller/add-product")}
                className="mt-4 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium cursor-pointer"
              >
                Add Product
              </button>

            </div>
          ) : (
            <div className="w-full overflow-x-auto">

              <table className="w-full min-w-[760px]">

                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left">

                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                      Product
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                      Category
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                      Price
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                      Stock
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                      Status
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {products.map((product) => {

                    const savedStock =
                      product.stock ?? 0;

                    const currentStock =
                      stockValues[product._id] ?? 0;

                    const numericStock =
                      Number(currentStock);

                    const isLowStock =
                      numericStock > 0 &&
                      numericStock <= 5;

                    const hasChanges =
                      numericStock !==
                      Number(savedStock);

                    return (
                      <tr
                        key={product._id}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70 transition-colors"
                      >

                        {/* Product */}
                        <td className="px-4 py-3">

                          <div className="flex items-center gap-3 min-w-[190px]">

                            <div className="w-12 h-12 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">

                              <img
                                src={
                                  product.image?.[0]?.startsWith(
                                    "http"
                                  )
                                    ? product.image[0]
                                    : `${import.meta.env.VITE_BACKEND_URL}/images/${product.image?.[0]}`
                                }
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />

                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate max-w-[180px]">
                                {product.name}
                              </p>

                              <p className="text-[11px] text-gray-400 mt-0.5">
                                Product
                              </p>
                            </div>

                          </div>

                        </td>

                        {/* Category */}
                        <td className="px-4 py-3">

                          <span className="text-xs text-gray-600 whitespace-nowrap">
                            {product.category}
                          </span>

                        </td>

                        {/* Price */}
                        <td className="px-4 py-3">

                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              ₹{product.offerPrice}
                            </p>

                            {Number(product.price) >
                              Number(product.offerPrice) && (
                              <p className="text-[10px] text-gray-400 line-through">
                                ₹{product.price}
                              </p>
                            )}
                          </div>

                        </td>

                        {/* Stock */}
                        <td className="px-4 py-3">

                          <div className="flex items-center gap-1.5">

                            <button
                              type="button"
                              onClick={() =>
                                decreaseStock(product)
                              }
                              disabled={
                                numericStock <= 0 ||
                                updatingStock ===
                                  product._id
                              }
                              className="w-7 h-7 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                              −
                            </button>

                            <input
                              type="number"
                              min="0"
                              value={currentStock}
                              disabled={
                                updatingStock ===
                                product._id
                              }
                              onChange={(e) =>
                                handleStockChange(
                                  product._id,
                                  e.target.value
                                )
                              }
                              className="w-12 h-7 text-center text-xs border border-gray-200 rounded-md bg-white outline-none focus:border-green-500 disabled:bg-gray-50"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                increaseStock(product)
                              }
                              disabled={
                                updatingStock ===
                                product._id
                              }
                              className="w-7 h-7 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                              +
                            </button>

                          </div>

                          {isLowStock && (
                            <p className="text-[10px] text-orange-500 mt-1">
                              Low stock
                            </p>
                          )}

                          {hasChanges && (
                            <button
                              type="button"
                              onClick={() =>
                                updateStock(product)
                              }
                              disabled={
                                updatingStock ===
                                product._id
                              }
                              className="mt-1.5 px-2.5 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-[10px] font-medium disabled:opacity-50 cursor-pointer"
                            >
                              {updatingStock ===
                              product._id
                                ? "Saving..."
                                : "Save"}
                            </button>
                          )}

                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">

                          {numericStock > 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-50 border border-green-100 text-[10px] font-medium text-green-700 whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              In Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-50 border border-red-100 text-[10px] font-medium text-red-600 whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                              Out of Stock
                            </span>
                          )}

                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">

                          <div className="flex items-center gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/seller/edit-product/${product._id}`
                                )
                              }
                              className="px-3 py-1.5 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-[11px] font-medium transition cursor-pointer"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteProduct(
                                  product._id
                                )
                              }
                              className="px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 text-[11px] font-medium transition cursor-pointer"
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

        {/* Mobile Note */}
        {!loading && products.length > 0 && (
          <p className="md:hidden text-[10px] text-gray-400 mt-2 px-1">
            Swipe horizontally to view all product details.
          </p>
        )}

      </div>

    </div>
  );
};

export default ProductList;