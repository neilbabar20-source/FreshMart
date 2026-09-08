import React, { useContext, useState, useEffect } from "react";
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
                status: status,
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

  if (loading) {
    return (
      <div className="md:p-10 p-4 flex items-center justify-center py-20">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="md:p-10 p-4 space-y-4">
      <h2 className="text-lg font-medium">Orders List</h2>

      {orders.length === 0 ? (
        <div className="border border-gray-300 rounded-md p-10 text-center">
          <p className="text-gray-500">
            No orders found for your products.
          </p>
        </div>
      ) : (
        orders.map((order, index) => {
          // Seller endpoint already returns only this seller's items
          const sellerItem = order.items?.[0];

          const currentStatus =
            sellerItem?.status || "Order Placed";

          return (
            <div
              key={order._id || index}
              className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800"
            >
              {/* Products */}
              <div className="flex flex-col gap-4">
                {order.items.map((item, itemIndex) => {
                  if (!item.product) {
                    return (
                      <div
                        key={itemIndex}
                        className="flex gap-5 items-center text-gray-500"
                      >
                        <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-xs">
                          N/A
                        </div>

                        <div>
                          <p className="font-medium">
                            Product no longer available
                          </p>

                          <span className="text-sm">
                            x {item.quantity}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={itemIndex}
                      className="flex gap-5"
                    >
                      <img
                        className="w-12 h-12 object-cover opacity-60"
                        src={item.product.image?.[0]}
                        alt={item.product.name}
                      />

                      <div className="flex flex-col justify-center">
                        <p className="font-medium">
                          {item.product.name}{" "}
                          <span
                            className={`text-indigo-500 ${
                              item.quantity < 2 ? "hidden" : ""
                            }`}
                          >
                            x {item.quantity}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Address */}
              <div className="text-sm">
                {order.address ? (
                  <>
                    <p className="font-medium mb-1">
                      {order.address.firstName}{" "}
                      {order.address.lastName}
                    </p>

                    <p>
                      {order.address.street},{" "}
                      {order.address.city},{" "}
                      {order.address.state},{" "}
                      {order.address.zipcode},{" "}
                      {order.address.country}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">
                    Address unavailable
                  </p>
                )}
              </div>

              {/* Amount */}
              <p className="font-medium text-base my-auto text-black/70">
                ₹{order.amount}
              </p>

              {/* Order Info + Seller-specific Status */}
              <div className="flex flex-col text-sm gap-2">
                <p>
                  Method:{" "}
                  <span className="font-medium">
                    {order.paymentType}
                  </span>
                </p>

                <p>
                  Payment:{" "}
                  <span className="font-medium">
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </p>

                <p>
                  Status:{" "}
                  <span className="font-medium">
                    {currentStatus}
                  </span>
                </p>

                <select
                  value={currentStatus}
                  onChange={(e) =>
                    updateOrderStatus(
                      order._id,
                      e.target.value
                    )
                  }
                  disabled={updatingOrder === order._id}
                  className="border border-gray-300 rounded-md px-2 py-1 outline-none focus:border-blue-500"
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
                  <p className="text-xs text-gray-500">
                    Updating status...
                  </p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Orders;