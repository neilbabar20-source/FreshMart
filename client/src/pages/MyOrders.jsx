import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import {
  FaBoxOpen,
  FaCalendarDays,
  FaCartShopping,
  FaCreditCard,
  FaIndianRupeeSign,
  FaLocationDot,
  FaCircleCheck,
  FaClock,
  FaTruck,
  FaBan,
} from "react-icons/fa6";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);

  const {
    axios,
    user,
    cartItems,
    setCartItems,
  } = useContext(AppContext);

  // Support both old backend images and new Cloudinary images
  const getImageUrl = (image) => {
    if (!image) return "";

    return image.startsWith("http")
      ? image
      : `${import.meta.env.VITE_BACKEND_URL}/images/${image}`;
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");

      if (data.success) {
        setMyOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Buy Again / Reorder
  const handleBuyAgain = (order) => {
    const newCartItems = structuredClone(cartItems);
    let addedItems = 0;

    order.items?.forEach((item) => {
      // Skip products that were deleted
      if (!item.product) return;

      const productId = item.product._id;
      const quantity = item.quantity || 1;

      // Add old order quantity to existing cart quantity
      if (newCartItems[productId]) {
        newCartItems[productId] += quantity;
      } else {
        newCartItems[productId] = quantity;
      }

      addedItems += quantity;
    });

    if (addedItems === 0) {
      return toast.error("No available products to reorder");
    }

    setCartItems(newCartItems);

    toast.success("Items added to cart");
    // Navigate to cart after reorder
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-100",
          icon: <FaCircleCheck />,
        };

      case "Shipped":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-100",
          icon: <FaTruck />,
        };

      case "Processing":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          border: "border-orange-100",
          icon: <FaClock />,
        };

      case "Cancelled":
        return {
          bg: "bg-red-50",
          text: "text-red-600",
          border: "border-red-100",
          icon: <FaBan />,
        };

      default:
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-100",
          icon: <FaClock />,
        };
    }
  };

  return (
    <div className="mt-7 md:mt-10 pb-16 max-w-5xl mx-auto px-3 sm:px-4">

      {/* =========================
          PAGE HEADER
      ========================== */}
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-lg shadow-sm">
            <FaBoxOpen />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              My Orders
            </h1>

            <p className="text-sm text-gray-500 mt-0.5">
              Track your orders and shop your favorites again.
            </p>
          </div>
        </div>

        {/* Order count */}
        {myOrders.length > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-medium">
            <FaCartShopping />
            {myOrders.length}{" "}
            {myOrders.length === 1 ? "Order" : "Orders"}
          </div>
        )}
      </div>

      {/* =========================
          NO ORDERS
      ========================== */}
      {myOrders.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 md:p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center text-2xl text-green-600">
            <FaBoxOpen />
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mt-4">
            No orders yet
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Your completed orders will appear here.
          </p>
        </div>
      )}

      {/* =========================
          ORDERS
      ========================== */}
      {myOrders.map((order, index) => {
        const firstStatus =
          order.items?.[0]?.status || "Order Placed";

        const statusStyle = getStatusStyle(firstStatus);

        return (
          <div
            key={order._id || index}
            className="bg-white border border-gray-100 rounded-2xl mb-6 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
          >

            {/* =========================
                ORDER HEADER
            ========================== */}
            <div className="bg-gradient-to-r from-gray-50 to-emerald-50/40 border-b border-gray-100 px-4 md:px-5 py-4">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                {/* Order ID */}
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-emerald-600">
                      <FaBoxOpen className="text-sm" />
                    </div>

                    <div>
                      <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                        Order ID
                      </p>

                      <p className="text-sm font-semibold text-gray-700 break-all">
                        {order._id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Info */}
                <div className="flex flex-wrap items-center gap-2">

                  {/* Payment */}
                  <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600">
                    <FaCreditCard className="text-gray-400" />
                    {order.paymentType}
                  </span>

                  {/* Amount */}
                  <span className="inline-flex items-center gap-1 bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-700">
                    <FaIndianRupeeSign />
                    {order.amount}
                  </span>
                </div>
              </div>
            </div>

            {/* =========================
                ORDER ITEMS
            ========================== */}
            <div className="px-3 md:px-4">

              {order.items?.map((item, itemIndex) => {

                /* Product was deleted */
                if (!item.product) {
                  return (
                    <div
                      key={itemIndex}
                      className={`py-5 ${
                        order.items.length !== itemIndex + 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400">
                            <FaBoxOpen />
                          </div>

                          <div>
                            <p className="font-medium text-gray-600 text-sm">
                              Product no longer available
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              Quantity: {item.quantity || 1}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                          <span className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-500">
                            Status: {item.status || "Order Placed"}
                          </span>

                          <span className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-500">
                            <FaCalendarDays className="inline mr-1" />
                            {new Date(
                              order.createdAt
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                const itemStatus =
                  item.status || "Order Placed";

                const itemStatusStyle =
                  getStatusStyle(itemStatus);

                return (
                  <div
                    key={itemIndex}
                    className={`py-5 ${
                      order.items.length !== itemIndex + 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >

                    <div className="flex flex-col md:flex-row md:items-center gap-4">

                      {/* =========================
                          PRODUCT
                      ========================== */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">

                        {/* Product Image */}
                        <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-2xl bg-gradient-to-br from-gray-50 to-green-50 border border-gray-100 flex items-center justify-center p-2">
                          <img
                            src={getImageUrl(
                              item.product.image?.[0]
                            )}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="min-w-0">

                          <h2 className="text-base md:text-lg font-semibold text-gray-800 truncate">
                            {item.product.name}
                          </h2>

                          <span className="inline-block mt-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                            {item.product.category}
                          </span>

                          <div className="flex flex-wrap items-center gap-2 mt-2">

                            <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                              Qty: {item.quantity || 1}
                            </span>

                            <span className="text-sm font-semibold text-gray-800">
                              ₹
                              {item.product.offerPrice *
                                (item.quantity || 1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* =========================
                          ORDER DETAILS
                      ========================== */}
                      <div className="md:w-52 flex flex-col gap-2">

                        {/* Status */}
                        <div
                          className={`inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full border text-xs font-semibold ${itemStatusStyle.bg} ${itemStatusStyle.text} ${itemStatusStyle.border}`}
                        >
                          {itemStatusStyle.icon}
                          {itemStatus}
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FaCalendarDays className="text-gray-400" />

                          <span>
                            {new Date(
                              order.createdAt
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* =========================
                ORDER FOOTER
            ========================== */}
            <div className="border-t border-gray-100 bg-gray-50/70 px-4 md:px-5 py-4">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                {/* Delivery info */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-emerald-600">
                    <FaLocationDot />
                  </div>

                  <div>
                    <p className="font-medium text-gray-600">
                      Delivery Order
                    </p>

                    <p className="text-gray-400">
                      Payment: {order.paymentType}
                    </p>
                  </div>
                </div>

                {/* Buy Again */}
                <button
                  onClick={() => handleBuyAgain(order)}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl cursor-pointer font-medium text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <FaCartShopping />
                  Buy Again
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;