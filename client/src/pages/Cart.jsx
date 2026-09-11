import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import {
  FaCartShopping,
  FaArrowLeft,
  FaTrashCan,
  FaLocationDot,
  FaCreditCard,
  FaTruckFast,
  FaPlus,
  FaChevronDown,
  FaBoxOpen,
} from "react-icons/fa6";

const Cart = () => {
  const {
    products,
    navigate,
    cartCount,
    totalCartAmount,
    cartItems,
    setCartItems,
    updateCartItem,
    axios,
    user,
    fetchProducts,
    setSearchQuery,
    setShowUserLogin,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [isOnlinePaymentLoading, setIsOnlinePaymentLoading] = useState(false);

  const [customQuantities, setCustomQuantities] = useState({});

  // =========================
  // SUPPORT OLD + CLOUDINARY IMAGES
  // =========================

  const getImageUrl = (image) => {
    if (!image) return "";

    return image.startsWith("http")
      ? image
      : `${import.meta.env.VITE_BACKEND_URL}/images/${image}`;
  };

  // =========================
  // GET CART
  // =========================

  const getCart = () => {
    let tempArray = [];

    for (const key in cartItems) {
      const product = products.find(
        (product) => product._id === key
      );

      // Product may have been deleted
      if (!product) {
        continue;
      }

      tempArray.push({
        ...product,
        quantity: cartItems[key],
      });
    }

    setCartArray(tempArray);
  };

  // =========================
  // GET ADDRESS
  // =========================

  const getAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");

      if (data.success) {
        setAddress(data.addresses);

        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("GET ADDRESS ERROR:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getAddress();
    }
  }, [user]);

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  // =========================
  // HANDLE QUANTITY DROPDOWN
  // =========================

  const handleQuantityChange = (product, value) => {
    const productId = product._id;
    const stock = Number(product.stock) || 0;

    if (value === "custom") {
      setCustomQuantities((prev) => ({
        ...prev,
        [productId]: cartItems[productId] || "",
      }));

      return;
    }

    const quantity = Number(value);

    if (quantity > stock) {
      toast.error(
        `Only ${stock} unit${stock === 1 ? "" : "s"} of ${
          product.name
        } ${stock === 1 ? "is" : "are"} available.`
      );
      return;
    }

    if (quantity < 1) {
      return;
    }

    updateCartItem(productId, quantity);

    setCustomQuantities((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  // =========================
  // HANDLE CUSTOM INPUT
  // =========================

  const handleCustomQuantity = (productId, value) => {
    setCustomQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  // =========================
  // APPLY CUSTOM QUANTITY
  // =========================

  const applyCustomQuantity = (product) => {
    const productId = product._id;
    const stock = Number(product.stock) || 0;
    const value = Number(customQuantities[productId]);

    if (!value || value < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }

    if (value > stock) {
      toast.error(
        `Only ${stock} unit${stock === 1 ? "" : "s"} of ${
          product.name
        } ${stock === 1 ? "is" : "are"} available.`
      );
      return;
    }

    updateCartItem(productId, value);

    setCustomQuantities((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  // =========================
  // REMOVE ENTIRE ITEM
  // =========================

  const deleteCartItem = (productId) => {
    const updatedCart = structuredClone(cartItems);

    delete updatedCart[productId];

    setCartItems(updatedCart);

    setCustomQuantities((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });

    toast.success("Item removed from cart");
  };

  // =========================
  // LOAD RAZORPAY CHECKOUT
  // =========================

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Razorpay already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // =========================
  // ONLINE PAYMENT
  // =========================

  const handleOnlinePayment = async () => {
    try {
      setIsOnlinePaymentLoading(true);
      console.log("ONLINE PAYMENT STARTED");

      // =========================
      // LOAD RAZORPAY
      // =========================

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        toast.error(
          "Unable to load Razorpay checkout. Please try again."
        );
        setIsOnlinePaymentLoading(false);
        return;
      }

      // =========================
      // CREATE RAZORPAY ORDER
      // =========================

      const orderData = {
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        address: selectedAddress._id,
      };

      console.log(
        "RAZORPAY CREATE ORDER DATA:",
        orderData
      );

      const { data } = await axios.post(
        "/api/payment/create-order",
        orderData
      );

      console.log(
        "RAZORPAY CREATE ORDER RESPONSE:",
        data
      );

      if (!data.success) {
        toast.error(data.message);
        setIsOnlinePaymentLoading(false);
        return;
      }

      // =========================
      // RAZORPAY OPTIONS
      // =========================

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: data.order.amount,

        currency: data.order.currency,

        name: "FreshMart",

        description: "Fresh groceries order",

        order_id: data.order.id,

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: {
          color: "#10b981",
        },

        // =================================================
        // PAYMENT SUCCESS
        // =================================================

        handler: async function (response) {
          console.log(
            "RAZORPAY PAYMENT SUCCESS RESPONSE:",
            response
          );

          try {
            // =========================
            // VERIFY PAYMENT
            // =========================

            const verificationData = {
              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,

              items: cartArray.map((item) => ({
                product: item._id,
                quantity: item.quantity,
              })),

              address: selectedAddress._id,
            };

            console.log(
              "PAYMENT VERIFICATION DATA:",
              verificationData
            );

            const { data } = await axios.post(
              "/api/payment/verify-payment",
              verificationData
            );

            console.log(
              "PAYMENT VERIFICATION RESPONSE:",
              data
            );

            // =========================
            // PAYMENT + ORDER SUCCESS
            // =========================

            if (data.success) {
              setIsOnlinePaymentLoading(false);
              toast.success(
                "Payment successful! Order placed."
              );

              // Refresh latest product stock
              await fetchProducts();

              // Clear cart
              setCartItems({});

              // Go to My Orders
              navigate("/my-orders");
            } else {
              setIsOnlinePaymentLoading(false);
              toast.error(
                data.message ||
                  "Payment verification failed"
              );
            }
          } catch (error) {
            setIsOnlinePaymentLoading(false);
            console.error(
              "PAYMENT VERIFICATION ERROR:",
              error
            );

            console.error(
              "PAYMENT VERIFICATION RESPONSE:",
              error.response?.data
            );

            toast.error(
              error.response?.data?.message ||
                error.message ||
                "Payment verification failed"
            );
          }
        },

        // =========================
        // PAYMENT MODAL CLOSED
        // =========================

        modal: {
          ondismiss: function () {
            setIsOnlinePaymentLoading(false);
            console.log(
              "RAZORPAY CHECKOUT CLOSED"
            );
          },
        },
      };

      // =========================
      // OPEN RAZORPAY
      // =========================

      const razorpay =
        new window.Razorpay(options);

      // =========================
      // PAYMENT FAILED
      // =========================

      razorpay.on(
        "payment.failed",
        function (response) {
          setIsOnlinePaymentLoading(false);
          console.error(
            "RAZORPAY PAYMENT FAILED:",
            response
          );

          toast.error(
            response.error?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      razorpay.open();
      setIsOnlinePaymentLoading(false);
    } catch (error) {
      setIsOnlinePaymentLoading(false);
      console.error(
        "ONLINE PAYMENT ERROR:",
        error
      );

      console.error(
        "ONLINE PAYMENT RESPONSE:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong with online payment"
      );
    }
  };

  // =========================
  // PLACE ORDER
  // =========================

  const placeOrder = async () => {
    // Guest user → login popup
    if (!user) {
      sessionStorage.setItem(
        "loginRedirect",
        "/cart"
      );

      setShowUserLogin(true);

      return;
    }

    console.log(
      "1. PLACE ORDER BUTTON CLICKED"
    );

    try {
      console.log(
        "2. Selected Address:",
        selectedAddress
      );

      console.log(
        "3. Payment Option:",
        paymentOption
      );

      console.log(
        "4. Cart Array:",
        cartArray
      );

      if (!selectedAddress) {
        console.log(
          "5. NO ADDRESS SELECTED"
        );

        return toast.error(
          "Please select an address"
        );
      }

      if (cartArray.length === 0) {
        console.log(
          "5. CART IS EMPTY"
        );

        return toast.error(
          "Your cart is empty"
        );
      }

      // =========================
      // COD
      // =========================

      if (paymentOption === "COD") {
        console.log(
          "5. SENDING COD ORDER REQUEST"
        );

        const orderData = {
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),

          address: selectedAddress._id,
        };

        console.log(
          "6. ORDER DATA:",
          orderData
        );

        const { data } = await axios.post(
          "/api/order/cod",
          orderData
        );

        console.log(
          "7. COD API RESPONSE:",
          data
        );

        if (data.success) {
          toast.success(data.message);

          // Refresh latest stock
          await fetchProducts();

          setCartItems({});

          console.log(
            "8. ORDER PLACED SUCCESSFULLY"
          );

          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }

        return;
      }

      // =========================
      // ONLINE PAYMENT
      // =========================

      if (paymentOption === "Online") {
        await handleOnlinePayment();
      }
    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      console.error(
        "PLACE ORDER RESPONSE:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong while placing the order"
      );
    }
  };

  const subtotal = totalCartAmount();

  const tax = (subtotal * 2) / 100;

  const totalAmount = subtotal + tax;

  return products.length > 0 && cartItems ? (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 pb-16">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div className="flex items-center gap-3">

          <div
            className="w-11 h-11 rounded-2xl
              bg-gradient-to-br from-emerald-500 to-green-600
              text-white flex items-center justify-center
              shadow-sm"
          >
            <FaCartShopping />
          </div>

          <div>

            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Shopping Cart
            </h1>

            <p className="text-sm text-gray-500 mt-0.5">
              Review your fresh groceries before checkout.
            </p>

          </div>
        </div>

        <div
          className="w-fit bg-emerald-50 border border-emerald-100
            text-emerald-700 px-3.5 py-1.5 rounded-full
            text-sm font-semibold"
        >
          {cartCount()}{" "}
          {cartCount() === 1 ? "Item" : "Items"}
        </div>

      </div>

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <div className="flex flex-col lg:flex-row gap-7">

        {/* =========================
            CART ITEMS
        ========================== */}

        <div className="flex-1">

          <div
            className="bg-white border border-gray-100
              rounded-2xl shadow-sm overflow-hidden"
          >

            {/* Table Header */}

            <div
              className="hidden md:grid
                grid-cols-[2fr_1fr_80px]
                bg-gray-50 border-b border-gray-100
                px-5 py-3 text-xs font-semibold
                text-gray-500 uppercase tracking-wide"
            >
              <p>Product Details</p>

              <p className="text-center">
                Subtotal
              </p>

              <p className="text-center">
                Action
              </p>
            </div>

            {/* Products */}

            <div className="px-3 md:px-5">

              {cartArray.length > 0 ? (
                cartArray.map((product, index) => {

                  const isCustomQuantity =
                    customQuantities[product._id] !==
                    undefined;

                  const stock =
                    Number(product.stock) || 0;

                  const currentQuantity =
                    Number(
                      cartItems[product._id]
                    ) || 1;

                  return (
                    <div
                      key={
                        product._id || index
                      }
                      className={`py-4 md:py-5 ${
                        cartArray.length !==
                        index + 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >

                      {/* =========================
                          DESKTOP
                      ========================== */}

                      <div
                        className="hidden md:grid
                          grid-cols-[2fr_1fr_80px]
                          items-center gap-4"
                      >

                        {/* Product */}

                        <div className="flex items-center gap-4">

                          <div
                            onClick={() => {
                              navigate(
                                `/product/${product.category}/${product._id}`
                              );

                              scrollTo(0, 0);
                            }}
                            className="cursor-pointer w-24 h-24
                              rounded-2xl bg-gradient-to-br
                              from-gray-50 to-emerald-50
                              border border-gray-100
                              flex items-center justify-center
                              p-2 hover:border-emerald-200
                              transition-all duration-200"
                          >
                            <img
                              className="max-w-full h-full object-contain"
                              src={getImageUrl(
                                product.image?.[0]
                              )}
                              alt={product.name}
                            />
                          </div>

                          <div className="min-w-0">

                            <p
                              onClick={() => {
                                navigate(
                                  `/product/${product.category}/${product._id}`
                                );

                                scrollTo(0, 0);
                              }}
                              className="font-semibold text-gray-800
                                cursor-pointer hover:text-emerald-600
                                transition-colors"
                            >
                              {product.name}
                            </p>

                            <span
                              className="inline-block mt-1.5
                                text-xs font-medium
                                text-emerald-600 bg-emerald-50
                                px-2.5 py-1 rounded-full"
                            >
                              {product.category}
                            </span>

                            <p className="text-sm text-gray-500 mt-2">
                              Weight:{" "}
                              <span className="text-gray-700">
                                {product.weight ||
                                  "N/A"}
                              </span>
                            </p>

                            {/* Quantity */}

                            <div className="flex items-center gap-2 mt-2">

                              <span className="text-xs text-gray-500">
                                Quantity
                              </span>

                              {!isCustomQuantity ? (
                                <div
                                  className="relative flex items-center
                                    border border-gray-200
                                    rounded-lg overflow-hidden
                                    bg-gray-50"
                                >

                                  <select
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        product,
                                        e.target.value
                                      )
                                    }
                                    value={String(
                                      currentQuantity
                                    )}
                                    className="appearance-none
                                      outline-none bg-transparent
                                      px-2 pr-7 py-1
                                      text-sm text-gray-700
                                      cursor-pointer"
                                  >

                                    {Array.from(
                                      {
                                        length:
                                          Math.min(
                                            9,
                                            stock
                                          ),
                                      },
                                      (
                                        _,
                                        index
                                      ) =>
                                        index + 1
                                    ).map(
                                      (
                                        quantity
                                      ) => (
                                        <option
                                          key={
                                            quantity
                                          }
                                          value={
                                            quantity
                                          }
                                        >
                                          {
                                            quantity
                                          }
                                        </option>
                                      )
                                    )}

                                    {currentQuantity >
                                      9 &&
                                      currentQuantity <=
                                        stock && (
                                      <option
                                        value={
                                          currentQuantity
                                        }
                                      >
                                        {
                                          currentQuantity
                                        }
                                      </option>
                                    )}

                                    <option value="custom">
                                      Custom
                                    </option>

                                  </select>

                                  <FaChevronDown
                                    className="absolute right-2
                                      top-1/2 -translate-y-1/2
                                      text-[9px] text-gray-400
                                      pointer-events-none"
                                  />

                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">

                                  <input
                                    type="number"
                                    min="1"
                                    max={stock}
                                    value={
                                      customQuantities[
                                        product._id
                                      ]
                                    }
                                    autoFocus
                                    onChange={(e) =>
                                      handleCustomQuantity(
                                        product._id,
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key ===
                                        "Enter"
                                      ) {
                                        applyCustomQuantity(
                                          product
                                        );
                                      }
                                    }}
                                    className="w-16 border
                                      border-emerald-300
                                      rounded-lg bg-white
                                      px-2 py-1 text-sm
                                      text-gray-700 outline-none
                                      focus:ring-2
                                      focus:ring-emerald-100"
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      applyCustomQuantity(
                                        product
                                      )
                                    }
                                    className="px-2.5 py-1
                                      rounded-lg bg-emerald-500
                                      text-white text-xs
                                      font-semibold
                                      hover:bg-emerald-600
                                      cursor-pointer"
                                  >
                                    ✓
                                  </button>

                                </div>
                              )}

                            </div>

                            {/* Stock */}

                            {stock > 0 && (
                              <p className="text-[10px] text-gray-400 mt-1">
                                {stock} available
                              </p>
                            )}

                          </div>
                        </div>

                        {/* Price */}

                        <div className="text-center">

                          <p className="text-lg font-semibold text-gray-800">
                            ₹
                            {product.offerPrice *
                              product.quantity}
                          </p>

                          <p className="text-xs text-gray-400 mt-0.5">
                            ₹
                            {product.offerPrice} each
                          </p>

                        </div>

                        {/* Remove */}

                        <button
                          onClick={() =>
                            deleteCartItem(
                              product._id
                            )
                          }
                          className="mx-auto w-9 h-9 rounded-full
                            bg-red-50 text-red-500
                            flex items-center justify-center
                            hover:bg-red-100 hover:scale-105
                            transition-all duration-200 cursor-pointer"
                          title="Remove item"
                        >
                          <FaTrashCan className="text-sm" />
                        </button>

                      </div>

                      {/* =========================
                          MOBILE
                      ========================== */}

                      <div className="md:hidden">

                        <div className="flex gap-3">

                          <div
                            onClick={() => {
                              navigate(
                                `/product/${product.category}/${product._id}`
                              );

                              scrollTo(0, 0);
                            }}
                            className="cursor-pointer w-20 h-20
                              shrink-0 rounded-xl
                              bg-gradient-to-br
                              from-gray-50 to-emerald-50
                              border border-gray-100
                              flex items-center justify-center p-1.5"
                          >
                            <img
                              className="max-w-full h-full object-contain"
                              src={getImageUrl(
                                product.image?.[0]
                              )}
                              alt={product.name}
                            />
                          </div>

                          <div className="flex-1 min-w-0">

                            <div className="flex items-start justify-between gap-2">

                              <div className="min-w-0">

                                <p
                                  onClick={() => {
                                    navigate(
                                      `/product/${product.category}/${product._id}`
                                    );

                                    scrollTo(0, 0);
                                  }}
                                  className="font-semibold text-gray-800
                                    truncate cursor-pointer"
                                >
                                  {product.name}
                                </p>

                                <span
                                  className="inline-block mt-1
                                    text-[10px] font-medium
                                    text-emerald-600 bg-emerald-50
                                    px-2 py-0.5 rounded-full"
                                >
                                  {product.category}
                                </span>

                              </div>

                              <button
                                onClick={() =>
                                  deleteCartItem(
                                    product._id
                                  )
                                }
                                className="w-8 h-8 shrink-0 rounded-full
                                  bg-red-50 text-red-500
                                  flex items-center justify-center
                                  cursor-pointer"
                              >
                                <FaTrashCan className="text-xs" />
                              </button>

                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                              Weight:{" "}
                              <span className="text-gray-700">
                                {product.weight ||
                                  "N/A"}
                              </span>
                            </p>

                            <div className="flex items-center justify-between mt-2">

                              <div className="flex items-center gap-2">

                                <span className="text-xs text-gray-500">
                                  Qty:
                                </span>

                                {!isCustomQuantity ? (
                                  <div className="relative">

                                    <select
                                      onChange={(e) =>
                                        handleQuantityChange(
                                          product,
                                          e.target.value
                                        )
                                      }
                                      value={String(
                                        currentQuantity
                                      )}
                                      className="appearance-none
                                        border border-gray-200
                                        rounded-md bg-gray-50
                                        pl-2 pr-7 py-1
                                        text-xs outline-none
                                        cursor-pointer"
                                    >

                                      {Array.from(
                                        {
                                          length:
                                            Math.min(
                                              9,
                                              stock
                                            ),
                                        },
                                        (
                                          _,
                                          index
                                        ) =>
                                          index + 1
                                      ).map(
                                        (
                                          quantity
                                        ) => (
                                          <option
                                            key={
                                              quantity
                                            }
                                            value={
                                              quantity
                                            }
                                          >
                                            {
                                              quantity
                                            }
                                          </option>
                                        )
                                      )}

                                      {currentQuantity >
                                        9 &&
                                        currentQuantity <=
                                          stock && (
                                        <option
                                          value={
                                            currentQuantity
                                          }
                                        >
                                          {
                                            currentQuantity
                                          }
                                        </option>
                                      )}

                                      <option value="custom">
                                        Custom
                                      </option>

                                    </select>

                                    <FaChevronDown
                                      className="absolute right-2
                                        top-1/2
                                        -translate-y-1/2
                                        text-[8px] text-gray-400
                                        pointer-events-none"
                                    />

                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1">

                                    <input
                                      type="number"
                                      min="1"
                                      max={stock}
                                      value={
                                        customQuantities[
                                          product._id
                                        ]
                                      }
                                      autoFocus
                                      onChange={(e) =>
                                        handleCustomQuantity(
                                          product._id,
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={(e) => {
                                        if (
                                          e.key ===
                                          "Enter"
                                        ) {
                                          applyCustomQuantity(
                                            product
                                          );
                                        }
                                      }}
                                      className="w-14 border
                                        border-emerald-300
                                        rounded-md bg-white
                                        px-1.5 py-1 text-xs
                                        outline-none"
                                    />

                                    <button
                                      type="button"
                                      onClick={() =>
                                        applyCustomQuantity(
                                          product
                                        )
                                      }
                                      className="w-6 h-6
                                        rounded-md
                                        bg-emerald-500
                                        text-white text-xs
                                        font-semibold
                                        cursor-pointer"
                                    >
                                      ✓
                                    </button>

                                  </div>
                                )}

                              </div>

                              <p className="font-semibold text-gray-800">
                                ₹
                                {product.offerPrice *
                                  product.quantity}
                              </p>

                            </div>

                            {stock > 0 && (
                              <p className="text-[9px] text-gray-400 mt-1">
                                {stock} available
                              </p>
                            )}

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="py-14 text-center">

                  <div
                    className="w-14 h-14 mx-auto rounded-full
                      bg-gray-50 text-gray-400
                      flex items-center justify-center text-xl"
                  >
                    <FaBoxOpen />
                  </div>

                  <p className="text-gray-600 font-medium mt-3">
                    Your cart is empty
                  </p>

                </div>
              )}

            </div>

          </div>

          {/* Continue Shopping */}

          <button
            onClick={() => {
              setSearchQuery("");
              navigate("/products");
            }}
            className="group cursor-pointer flex items-center
              gap-2 mt-5 text-emerald-600
              font-medium text-sm hover:text-emerald-700
              transition-colors"
          >
            <FaArrowLeft
              className="text-xs transition-transform
                duration-200 group-hover:-translate-x-1"
            />

            Continue Shopping
          </button>

        </div>

        {/* =========================
            ORDER SUMMARY
        ========================== */}

        <div className="lg:w-[350px] w-full">

          <div
            className="bg-white border border-gray-100
              rounded-2xl shadow-sm overflow-hidden
              lg:sticky lg:top-24"
          >

            {/* Summary Header */}

            <div
              className="px-5 py-4
                bg-gradient-to-r from-emerald-50
                to-green-50 border-b border-emerald-100"
            >

              <div className="flex items-center gap-2.5">

                <div
                  className="w-9 h-9 rounded-xl
                    bg-white text-emerald-600
                    flex items-center justify-center
                    shadow-sm"
                >
                  <FaCartShopping className="text-sm" />
                </div>

                <div>

                  <h2 className="text-lg font-semibold text-gray-800">
                    Order Summary
                  </h2>

                  <p className="text-xs text-gray-500">
                    Complete your order
                  </p>

                </div>

              </div>

            </div>

            <div className="p-5">

              {/* =========================
                  DELIVERY ADDRESS
              ========================== */}

              <div>

                <div className="flex items-center gap-2 mb-2.5">

                  <FaLocationDot className="text-emerald-600 text-sm" />

                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Delivery Address
                  </p>

                </div>

                <div className="relative">

                  <div
                    className="flex items-start justify-between
                      gap-3 p-3 rounded-xl
                      bg-gray-50 border border-gray-100"
                  >

                    <p className="text-sm text-gray-600 leading-5">
                      {selectedAddress
                        ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                        : "No Address Found"}
                    </p>

                    <button
                      onClick={() =>
                        setShowAddress(
                          !showAddress
                        )
                      }
                      className="text-xs font-semibold
                        text-indigo-500 hover:text-indigo-600
                        cursor-pointer shrink-0"
                    >
                      Change
                    </button>

                  </div>

                  {/* Address Dropdown */}

                  {showAddress && (
                    <div
                      className="absolute top-full left-0
                        mt-2 py-1 bg-white
                        border border-gray-200
                        shadow-xl rounded-xl
                        text-sm w-full z-30 overflow-hidden"
                    >

                      {address.map(
                        (address, index) => (
                          <p
                            key={index}
                            onClick={() => {
                              setSelectedAddress(
                                address
                              );

                              setShowAddress(
                                false
                              );
                            }}
                            className="text-gray-600 px-3 py-2.5
                              hover:bg-emerald-50
                              hover:text-emerald-700
                              cursor-pointer transition-colors"
                          >
                            {address.street},{" "}
                            {address.city},{" "}
                            {address.state},{" "}
                            {address.country}
                          </p>
                        )
                      )}

                      <p
                        onClick={() =>
                          navigate(
                            "/add-address"
                          )
                        }
                        className="flex items-center
                          justify-center gap-2
                          text-indigo-500 font-medium
                          cursor-pointer px-3 py-2.5
                          border-t border-gray-100
                          hover:bg-indigo-50"
                      >
                        <FaPlus className="text-[10px]" />
                        Add address
                      </p>

                    </div>
                  )}

                </div>

              </div>

              {/* =========================
                  PAYMENT METHOD
              ========================== */}

              <div className="mt-5">

                <div className="flex items-center gap-2 mb-2.5">

                  <FaCreditCard className="text-indigo-500 text-sm" />

                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Payment Method
                  </p>

                </div>

                <div className="relative">

                  <select
                    onChange={(e) =>
                      setPaymentOption(
                        e.target.value
                      )
                    }
                    value={paymentOption}
                    className="w-full appearance-none
                      border border-gray-200
                      bg-gray-50 px-3.5 py-2.5
                      pr-9 rounded-xl outline-none
                      text-sm text-gray-700
                      focus:border-emerald-400
                      focus:ring-4 focus:ring-emerald-50
                      cursor-pointer transition-all"
                  >

                    <option value="COD">
                      Cash On Delivery
                    </option>

                    <option value="Online">
                      Online Payment
                    </option>

                  </select>

                  <FaChevronDown
                    className="absolute right-3 top-1/2
                      -translate-y-1/2
                      text-gray-400 text-xs
                      pointer-events-none"
                  />

                </div>

              </div>

              {/* Divider */}

              <div className="border-t border-gray-100 my-5" />

              {/* =========================
                  PRICE DETAILS
              ========================== */}

              <div className="space-y-3">

                <p className="flex justify-between text-sm text-gray-500">

                  <span>Price</span>

                  <span className="font-medium text-gray-700">
                    ₹{subtotal}
                  </span>

                </p>

                <p className="flex justify-between text-sm text-gray-500">

                  <span>Shipping Fee</span>

                  <span className="text-green-600 font-medium">
                    Free
                  </span>

                </p>

                <p className="flex justify-between text-sm text-gray-500">

                  <span>Tax (2%)</span>

                  <span className="font-medium text-gray-700">
                    ₹{tax}
                  </span>

                </p>

                <div
                  className="border-t border-dashed
                    border-gray-200 pt-3 mt-2"
                />

                <p className="flex justify-between items-center">

                  <span className="text-base font-semibold text-gray-700">
                    Total Amount
                  </span>

                  <span className="text-xl font-bold text-emerald-600">
                    ₹{totalAmount}
                  </span>

                </p>

              </div>

              {/* =========================
                  DELIVERY INFO
              ========================== */}

              <div
                className="flex items-center gap-2.5
                  bg-emerald-50 border border-emerald-100
                  rounded-xl p-3 mt-5"
              >

                <div
                  className="w-8 h-8 rounded-lg bg-white
                    flex items-center justify-center
                    text-emerald-600 shadow-sm"
                >
                  <FaTruckFast className="text-sm" />
                </div>

                <div>

                  <p className="text-xs font-semibold text-gray-700">
                    Free Delivery
                  </p>

                  <p className="text-[10px] text-gray-500">
                    Fresh groceries delivered to your door
                  </p>

                </div>

              </div>

              {/* =========================
                  CHECKOUT BUTTON
              ========================== */}

              <button
                type="button"
                onClick={placeOrder}
                disabled={isOnlinePaymentLoading}
                className={`w-full py-3.5 mt-5
                  bg-gradient-to-r from-emerald-500
                  to-green-600
                  hover:from-emerald-600
                  hover:to-green-700
                  text-white font-semibold
                  rounded-xl shadow-md
                  transition-all duration-200
                  ${
                    isOnlinePaymentLoading
                      ? "opacity-80 cursor-not-allowed"
                      : "cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
                  }`}
              >
                {isOnlinePaymentLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Opening payment...
                  </span>
                ) : paymentOption === "COD" ? (
                  "Place Order"
                ) : (
                  "Proceed to Checkout"
                )}
              </button>

              <p className="text-center text-[10px] text-gray-400 mt-2.5">
                Secure checkout • FreshMart
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  ) : null;
};

export default Cart;