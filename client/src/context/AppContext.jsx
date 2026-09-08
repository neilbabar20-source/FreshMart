import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Seller authentication
  const [seller, setSeller] = useState(null);
  const [isSeller, setIsSeller] = useState(null);

  // Admin authentication
  const [admin, setAdmin] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);

  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Check seller authentication
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");

      if (data.success) {
        setSeller(data.seller);
        setIsSeller(true);
      } else {
        setSeller(null);
        setIsSeller(false);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setSeller(null);
        setIsSeller(false);
      } else {
        toast.error(error.message);
      }
    }
  };

  // Check admin authentication
  const fetchAdmin = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-auth");

      if (data.success) {
        setAdmin(data.admin);
        setIsAdmin(true);
      } else {
        setAdmin(null);
        setIsAdmin(false);
      }
    } catch (error) {
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        setAdmin(null);
        setIsAdmin(false);
      } else {
        toast.error(error.message);
      }
    }
  };

  // Check user authentication
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");

      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
      } else {
        toast.error(error.message);
      }
    }
  };

  // Fetch all product data
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);

      const { data } = await axios.get("/api/product/list");

      console.log("PRODUCT API RESPONSE:", data);

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("PRODUCT API ERROR:", error);
      toast.error(error.message);
    } finally {
      setProductsLoading(false);
    }
  };

  // Add product to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    toast.success("added to cart");
  };

  // Update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId] = quantity;

    setCartItems(cartData);
    toast.success("cart updated");
  };

  // Total cart items
  const cartCount = () => {
    let totalCount = 0;

    for (const item in cartItems) {
      totalCount += cartItems[item];
    }

    return totalCount;
  };

  // Total cart amount
  const totalCartAmount = () => {
    let totalAmount = 0;

    for (const items in cartItems) {
      let itemInfo = products.find(
        (product) => product._id === items
      );

      if (itemInfo && cartItems[items] > 0) {
        totalAmount += cartItems[items] * itemInfo.offerPrice;
      }
    }

    return Math.floor(totalAmount * 100) / 100;
  };

  // Remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] -= 1;

      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }

      toast.success("remove from cart");
      setCartItems(cartData);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
    fetchSeller();
    fetchAdmin();
    fetchUser();
  }, []);

  // Update database cart items
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post(
          "/api/cart/update",
          { cartItems }
        );

        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems]);

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !darkMode;

    setDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const value = {
    navigate,

    // Customer
    user,
    setUser,

    // Seller
    seller,
    setSeller,
    isSeller,
    setIsSeller,

    // Admin
    admin,
    setAdmin,
    isAdmin,
    setIsAdmin,

    // Authentication UI
    showUserLogin,
    setShowUserLogin,

    // Products
    products,
    productsLoading,

    // Cart
    addToCart,
    updateCartItem,
    cartCount,
    totalCartAmount,
    removeFromCart,
    cartItems,
    setCartItems,

    // Search
    searchQuery,
    setSearchQuery,

    // Theme
    darkMode,
    toggleTheme,

    // Axios
    axios,

    // Fetch functions
    fetchProducts,
    fetchSeller,
    fetchAdmin,
    fetchUser,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};