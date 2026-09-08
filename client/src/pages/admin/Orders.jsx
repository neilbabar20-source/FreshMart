import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH ALL ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/admin/orders");

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching admin orders:", error);

      toast.error(
        error.response?.data?.message || "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // HELPERS
  // =====================================================

  const getOrderStatus = (order) => {
    if (!order.items || order.items.length === 0) {
      return order.status || "Order Placed";
    }

    const statuses = order.items.map(
      (item) => item.status || "Order Placed"
    );

    if (statuses.every((status) => status === "Delivered")) {
      return "Delivered";
    }

    if (statuses.every((status) => status === "Cancelled")) {
      return "Cancelled";
    }

    if (statuses.some((status) => status === "Shipped")) {
      return "Shipped";
    }

    if (statuses.some((status) => status === "Processing")) {
      return "Processing";
    }

    return "Order Placed";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-600 bg-green-50";

      case "Shipped":
        return "text-blue-600 bg-blue-50";

      case "Processing":
        return "text-orange-600 bg-orange-50";

      case "Cancelled":
        return "text-red-600 bg-red-50";

      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>

          <p className="mt-3 text-gray-500">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Order Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor all customer orders across the marketplace.
          </p>
        </div>

        <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
          Total Orders: {orders.length}
        </div>
      </div>

      {/* NO ORDERS */}
      {orders.length === 0 ? (
        <div className="flex items-center justify-center min-h-[300px] bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500">
            No orders found.
          </p>
        </div>
      ) : (
        <>

          {/* =====================================================
              DESKTOP VIEW
          ===================================================== */}

          <div className="hidden overflow-x-auto bg-white border border-gray-200 rounded-lg md:block">
            <table className="w-full text-sm text-left">

              <thead className="text-gray-600 bg-gray-50">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Order
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Customer
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Products
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Amount
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Payment
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {orders.map((order) => {

                  const orderStatus = getOrderStatus(order);

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50"
                    >

                      {/* ORDER */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          #{order._id.slice(-8)}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {order.items?.length || 0} item(s)
                        </p>
                      </td>


                      {/* CUSTOMER */}
                      <td className="px-5 py-4">
                        {order.userId ? (
                          <div>
                            <p className="font-medium text-gray-800">
                              {order.userId.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {order.userId.email}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            Customer unavailable
                          </span>
                        )}
                      </td>


                      {/* PRODUCTS */}
                      <td className="px-5 py-4">

                        <div className="space-y-3">

                          {order.items?.map((item, index) => (

                            <div
                              key={`${order._id}-${index}`}
                              className="flex items-center gap-3"
                            >

                              {item.product?.image?.[0] ? (
                                <img
                                  src={item.product.image[0]}
                                  alt={item.product.name}
                                  className="object-cover w-10 h-10 border rounded-md"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-10 h-10 text-xs text-gray-400 bg-gray-100 rounded-md">
                                  N/A
                                </div>
                              )}

                              <div className="min-w-[180px]">
                                <p className="font-medium text-gray-700">
                                  {item.product?.name ||
                                    "Product deleted"}
                                </p>

                                <p className="text-xs text-gray-500">
                                  Qty: {item.quantity}
                                </p>

                                <p className="text-xs text-gray-400">
                                  Seller:{" "}
                                  {item.sellerId?.storeName ||
                                    item.sellerId?.name ||
                                    "Seller unavailable"}
                                </p>

                                <span
                                  className={`inline-block px-2 py-1 mt-1 text-xs rounded ${getStatusClass(
                                    item.status ||
                                      "Order Placed"
                                  )}`}
                                >
                                  {item.status ||
                                    "Order Placed"}
                                </span>
                              </div>

                            </div>

                          ))}

                        </div>

                      </td>


                      {/* AMOUNT */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          ₹{order.amount}
                        </p>
                      </td>


                      {/* PAYMENT */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-700">
                          {order.paymentType}
                        </p>

                        <p
                          className={`text-xs ${
                            order.isPaid
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        >
                          {order.isPaid
                            ? "Paid"
                            : "Payment Pending"}
                        </p>
                      </td>


                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusClass(
                            orderStatus
                          )}`}
                        >
                          {orderStatus}
                        </span>
                      </td>


                      {/* DATE */}
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString("en-IN")}
                      </td>

                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>


          {/* =====================================================
              MOBILE VIEW
          ===================================================== */}

          <div className="space-y-4 md:hidden">

            {orders.map((order) => {

              const orderStatus = getOrderStatus(order);

              return (
                <div
                  key={order._id}
                  className="p-4 bg-white border border-gray-200 rounded-lg"
                >

                  {/* ORDER HEADER */}
                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <p className="font-semibold text-gray-800">
                        Order #{order._id.slice(-8)}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClass(
                        orderStatus
                      )}`}
                    >
                      {orderStatus}
                    </span>

                  </div>


                  {/* CUSTOMER */}
                  <div className="p-3 mt-4 rounded-md bg-gray-50">

                    <p className="text-xs text-gray-400">
                      Customer
                    </p>

                    {order.userId ? (
                      <>
                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {order.userId.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {order.userId.email}
                        </p>
                      </>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">
                        Customer unavailable
                      </p>
                    )}

                  </div>


                  {/* PRODUCTS */}
                  <div className="mt-4">

                    <p className="mb-2 text-sm font-semibold text-gray-700">
                      Products
                    </p>

                    <div className="space-y-3">

                      {order.items?.map((item, index) => (

                        <div
                          key={`${order._id}-${index}`}
                          className="p-3 border border-gray-100 rounded-md"
                        >

                          <div className="flex gap-3">

                            {item.product?.image?.[0] ? (
                              <img
                                src={item.product.image[0]}
                                alt={item.product.name}
                                className="object-cover w-16 h-16 border rounded-md"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-16 h-16 text-xs text-gray-400 bg-gray-100 rounded-md">
                                N/A
                              </div>
                            )}

                            <div className="flex-1 min-w-0">

                              <p className="text-sm font-medium text-gray-800">
                                {item.product?.name ||
                                  "Product deleted"}
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                Quantity: {item.quantity}
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                Seller:{" "}
                                <span className="font-medium text-gray-700">
                                  {item.sellerId?.storeName ||
                                    item.sellerId?.name ||
                                    "Seller unavailable"}
                                </span>
                              </p>

                              <span
                                className={`inline-block px-2 py-1 mt-2 text-xs rounded ${getStatusClass(
                                  item.status ||
                                    "Order Placed"
                                )}`}
                              >
                                {item.status ||
                                  "Order Placed"}
                              </span>

                            </div>

                          </div>

                        </div>

                      ))}

                    </div>

                  </div>


                  {/* ORDER DETAILS */}
                  <div className="grid grid-cols-2 gap-3 mt-4">

                    <div className="p-3 rounded-md bg-gray-50">
                      <p className="text-xs text-gray-400">
                        Amount
                      </p>

                      <p className="mt-1 font-semibold text-gray-800">
                        ₹{order.amount}
                      </p>
                    </div>

                    <div className="p-3 rounded-md bg-gray-50">
                      <p className="text-xs text-gray-400">
                        Payment
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {order.paymentType}
                      </p>

                      <p
                        className={`text-xs ${
                          order.isPaid
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {order.isPaid
                          ? "Paid"
                          : "Payment Pending"}
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </>
      )}
    </div>
  );
};

export default Orders;