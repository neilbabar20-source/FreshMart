import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const { axios } = useContext(AppContext);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/order/seller");

      if (data.success) {
        setOrders(data.orders);
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      setUpdatingOrder(orderId);

      const { data } = await axios.post(
        "/api/order/seller/status",
        {
          orderId,
          status,
        }
      );

      if (data.success) {
        toast.success(data.message);

        setOrders((prevOrders) =>
          prevOrders.map((order) => {
            if (order._id !== orderId) {
              return order;
            }

            return {
              ...order,
              items: order.items.map((item) => ({
                ...item,
                status,
              })),
            };
          })
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-100";

      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-100";

      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "Processing":
        return "bg-orange-50 text-orange-700 border-orange-100";

      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-full">
        <div className="max-w-5xl mx-auto">

          <div className="mb-5">
            <div className="h-3 w-28 bg-gray-200 rounded animate-pulse"></div>

            <div className="h-7 w-36 bg-gray-200 rounded mt-2 animate-pulse"></div>

            <div className="h-3 w-64 bg-gray-200 rounded mt-2 animate-pulse"></div>
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>

                  <div className="flex-1">
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded mt-2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-full">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-5">
          <p className="text-xs font-medium text-green-600">
            Store Management
          </p>

          <h1 className="text-2xl font-semibold text-gray-900 mt-1">
            Orders
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage orders containing your products.
          </p>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

            <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-400">
                O
              </span>
            </div>

            <h2 className="text-base font-semibold text-gray-800 mt-4">
              No Orders Yet
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Orders for your products will appear here.
            </p>

          </div>
        ) : (
          <div className="space-y-3">

            {orders.map((order, index) => {

              // Seller endpoint already returns only this seller's items
              const sellerItem = order.items?.[0];

              const currentStatus =
                sellerItem?.status || "Order Placed";

              return (
                <div
                  key={order._id || index}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >

                  {/* Order Top */}
                  <div className="px-4 sm:px-5 py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Order #{order._id?.slice(-6)}
                      </p>

                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {order.items?.length || 0} product
                        {order.items?.length === 1 ? "" : "s"}
                      </p>
                    </div>

                    <span
                      className={`w-fit px-2.5 py-1 rounded-md border text-[11px] font-medium ${getStatusStyle(
                        currentStatus
                      )}`}
                    >
                      {currentStatus}
                    </span>

                  </div>

                  {/* Order Body */}
                  <div className="p-4 sm:p-5">

                    <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr_0.8fr] gap-5">

                      {/* Products */}
                      <div>

                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Products
                        </p>

                        <div className="space-y-3">

                          {order.items?.map(
                            (item, itemIndex) => {

                              if (!item.product) {
                                return (
                                  <div
                                    key={itemIndex}
                                    className="flex items-center gap-3"
                                  >
                                    <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                      <span className="text-[10px] text-gray-400">
                                        N/A
                                      </span>
                                    </div>

                                    <div>
                                      <p className="text-sm font-medium text-gray-500">
                                        Product unavailable
                                      </p>

                                      <p className="text-xs text-gray-400 mt-0.5">
                                        Quantity: {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={itemIndex}
                                  className="flex items-center gap-3"
                                >
                                  <img
                                    src={item.product.image?.[0]}
                                    alt={item.product.name}
                                    className="w-11 h-11 rounded-lg object-cover border border-gray-100 shrink-0"
                                  />

                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                      {item.product.name}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-0.5">
                                      Quantity: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                          )}

                        </div>

                      </div>

                      {/* Customer Address */}
                      <div>

                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Delivery Address
                        </p>

                        {order.address ? (
                          <div className="text-sm text-gray-600 leading-5">

                            <p className="font-medium text-gray-800">
                              {order.address.firstName}{" "}
                              {order.address.lastName}
                            </p>

                            <p className="mt-1">
                              {order.address.street}
                            </p>

                            <p>
                              {order.address.city},{" "}
                              {order.address.state}
                            </p>

                            <p>
                              {order.address.zipcode},{" "}
                              {order.address.country}
                            </p>

                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">
                            Address unavailable
                          </p>
                        )}

                      </div>

                      {/* Order Details */}
                      <div>

                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Order Details
                        </p>

                        <div className="space-y-2 text-sm">

                          <div className="flex justify-between gap-3">
                            <span className="text-gray-400">
                              Amount
                            </span>

                            <span className="font-semibold text-gray-800">
                              ₹{order.amount}
                            </span>
                          </div>

                          <div className="flex justify-between gap-3">
                            <span className="text-gray-400">
                              Method
                            </span>

                            <span className="font-medium text-gray-700">
                              {order.paymentType}
                            </span>
                          </div>

                          <div className="flex justify-between gap-3">
                            <span className="text-gray-400">
                              Payment
                            </span>

                            <span
                              className={
                                order.isPaid
                                  ? "text-green-600 font-medium"
                                  : "text-orange-600 font-medium"
                              }
                            >
                              {order.isPaid
                                ? "Paid"
                                : "Pending"}
                            </span>
                          </div>

                        </div>

                      </div>

                    </div>

                    {/* Status Control */}
                    <div className="border-t border-gray-100 mt-5 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                      <div>
                        <p className="text-xs font-medium text-gray-700">
                          Update Order Status
                        </p>

                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Change the status for your products in this order.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">

                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            updateOrderStatus(
                              order._id,
                              e.target.value
                            )
                          }
                          disabled={
                            updatingOrder === order._id
                          }
                          className="h-9 min-w-[150px] px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-700 outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:opacity-60 cursor-pointer"
                        >
                          <option value="Order Placed">
                            Order Placed
                          </option>

                          <option value="Processing">
                            Processing
                          </option>

                          <option value="Shipped">
                            Shipped
                          </option>

                          <option value="Delivered">
                            Delivered
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>
                        </select>

                        {updatingOrder === order._id && (
                          <span className="text-[11px] text-gray-400">
                            Updating...
                          </span>
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
};

export default Orders;