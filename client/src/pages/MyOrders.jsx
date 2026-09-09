import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

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

  return (
    <div className="mt-12 pb-16">
      <div>
        <p className="text-2xl md:text-3xl font-medium">
          My Orders
        </p>
      </div>

      {myOrders.map((order, index) => (
        <div
          key={order._id || index}
          className="my-8 border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
        >
          <p className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-6">
            <span>
              Order ID: {order._id}
            </span>

            <span>
              Payment: {order.paymentType}
            </span>

            <span>
              Total Amount: ₹{order.amount}
            </span>
          </p>

          {order.items?.map((item, itemIndex) => {
            // Product was deleted from database
            if (!item.product) {
              return (
                <div
                  key={itemIndex}
                  className="border-t border-gray-300 mt-4 p-4 text-gray-500"
                >
                  <p className="font-medium">
                    Product no longer available
                  </p>

                  <p>
                    Quantity: {item.quantity || 1}
                  </p>

                  <p>
                    Status: {item.status || "Order Placed"}
                  </p>

                  <p>
                    Date:{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={itemIndex}
                className={`relative bg-white text-gray-800/70 ${
                  order.items.length !== itemIndex + 1
                    ? "border-b"
                    : ""
                } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 w-full max-w-4xl`}
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="p-4 rounded-lg">
                    <img
                      src={getImageUrl(item.product.image?.[0])}
                      alt={item.product.name}
                      className="w-16 h-16 object-contain"
                    />
                  </div>

                  <div className="ml-4">
                    <h2 className="text-xl font-medium">
                      {item.product.name}
                    </h2>

                    <p>
                      {item.product.category}
                    </p>
                  </div>
                </div>

                <div className="text-lg font-medium">
                  <p>
                    Quantity: {item.quantity || 1}
                  </p>

                  <p>
                    Status: {item.status || "Order Placed"}
                  </p>

                  <p>
                    Date:{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <p className="text-lg">
                  Amount: ₹
                  {item.product.offerPrice *
                    (item.quantity || 1)}
                </p>
              </div>
            );
          })}

          {/* Buy Again */}
          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-end">
            <button
              onClick={() => handleBuyAgain(order)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg cursor-pointer"
            >
              Buy Again
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;