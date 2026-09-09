import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  FaBasketShopping,
  FaMagnifyingGlass,
  FaXmark,
  FaCartShopping,
  FaChartColumn,
  FaArrowRightFromBracket,
} from "react-icons/fa6";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Animated search placeholder
  const searchPlaceholders = [
  "Search for Organic veggies...",
  "Search for Fresh Fruits...",
  "Search for Cold Drinks...",
  "Search for Instant Foods...",
  "Search for Dairy Products...",
  "Search for Bakery & Breads...",
  "Search for Grains & Cereals...",
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const {
    user,
    setUser,
    navigate,
    setShowUserLogin,
    cartCount,
    searchQuery,
    setSearchQuery,
    axios,
    setCartItems,
  } = useContext(AppContext);

  // Dynamic User Initials
  const getUserInitials = (name) => {
    if (!name) return "U";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Search placeholder animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(
        (prev) => (prev + 1) % searchPlaceholders.length
      );
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  // Search behavior
  useEffect(() => {
    if (searchQuery.length > 0) {
      if (sessionStorage.getItem("productClick") === "true") {
        sessionStorage.removeItem("productClick");
        return;
      }

      navigate("/products");
    }
  }, [searchQuery]);

  // Clear search and go to Home
  const handleHomeNavigation = () => {
    setSearchQuery("");
    setMobileSearchOpen(false);
    setOpen(false);
    navigate("/");
  };

  // Clear search and go to All Products
  const handleAllProductsNavigation = () => {
    setSearchQuery("");
    setMobileSearchOpen(false);
    setOpen(false);
    navigate("/products");
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const handleMobileSearch = () => {
    setMobileSearchOpen((prev) => !prev);
    setOpen(false);
  };

  const handleMobileCart = () => {
    setMobileSearchOpen(false);
    setOpen(false);
    navigate("/cart");
  };

  const handleMobileLogin = () => {
    setMobileSearchOpen(false);
    setOpen(false);
    setShowUserLogin(true);
  };

  const handleMobileSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Logout user
  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");

      if (data.success) {
        setUser(null);
        setCartItems({});
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between
        px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-2.5
        backdrop-blur-xl border-b border-emerald-100/70
        shadow-sm"
      style={{
        background:
          "linear-gradient(to right, #ecfccb 0%, #ffffff 15%, #ffffff 85%, #ecfccb 100%)",
      }}
    >
      {/* =========================
          LOGO
      ========================== */}
      <button
        onClick={handleHomeNavigation}
        className="flex items-center gap-2 group shrink-0 cursor-pointer"
      >
        <div
          className="w-10 h-10 rounded-xl bg-emerald-50
            border border-emerald-100 flex items-center
            justify-center transition-all duration-300
            group-hover:bg-emerald-100 group-hover:scale-105"
        >
          <FaBasketShopping
            className="text-emerald-600 text-xl
              transition-transform duration-300
              group-hover:rotate-12"
          />
        </div>

        <h2
          className="text-2xl sm:text-3xl font-extrabold
            tracking-tight text-emerald-600
            transition-all duration-300
            group-hover:scale-105"
        >
          FreshMart
        </h2>
      </button>

      {/* =========================
          DESKTOP MENU
      ========================== */}
      <div className="hidden sm:flex items-center gap-5 md:gap-7 lg:gap-8">

        {/* Home */}
        <button
          onClick={handleHomeNavigation}
          className="relative text-[16px] font-semibold text-gray-700
            transition-all duration-300 hover:text-emerald-600
            hover:-translate-y-0.5
            after:absolute after:left-0 after:-bottom-1
            after:w-0 after:h-0.5 after:bg-emerald-600
            after:rounded-full after:transition-all
            after:duration-300 hover:after:w-full"
        >
          Home
        </button>

        {/* All Products */}
        <button
          onClick={handleAllProductsNavigation}
          className="relative text-[16px] font-semibold text-gray-700
            transition-all duration-300 hover:text-emerald-600
            hover:-translate-y-0.5
            after:absolute after:left-0 after:-bottom-1
            after:w-0 after:h-0.5 after:bg-emerald-600
            after:rounded-full after:transition-all
            after:duration-300 hover:after:w-full"
        >
          All Products
        </button>

        {/* Desktop Search */}
        <div
          className="hidden lg:flex items-center gap-3
            bg-white/80 border border-gray-200
            rounded-full px-4 py-2 w-72 xl:w-80
            shadow-sm transition-all duration-300
            hover:border-emerald-300 hover:shadow
            focus-within:border-emerald-500
            focus-within:ring-4 focus-within:ring-emerald-50"
        >
          <FaMagnifyingGlass className="text-gray-400 text-sm shrink-0" />

          <div className="relative w-full h-5 overflow-hidden">
            {!searchQuery && (
              <div
                key={placeholderIndex}
                className="absolute inset-0 flex items-center
                  text-gray-400 text-sm pointer-events-none
                  animate-search-placeholder"
              >
                {searchPlaceholders[placeholderIndex]}
              </div>
            )}

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="relative z-10 w-full h-full
                bg-transparent outline-none text-gray-700 text-sm
                placeholder-transparent"
              type="text"
              placeholder=""
            />
          </div>
        </div>

        {/* Desktop Cart */}
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer group
            transition-transform duration-300 hover:scale-110"
        >
          <div
            className="w-10 h-10 rounded-full
              flex items-center justify-center
              bg-white/80 border border-gray-200
              group-hover:border-emerald-200
              group-hover:bg-emerald-50 transition-all duration-300"
          >
            <img
              src={assets.cart_icon}
              alt="cart"
              className="w-6 h-6 transition-transform
                duration-300 group-hover:scale-110"
            />
          </div>

          <span
            className="absolute -top-1.5 -right-1.5
              flex items-center justify-center
              text-[10px] text-white bg-emerald-600
              w-5 h-5 font-bold rounded-full
              border-2 border-white shadow-sm"
          >
            {cartCount()}
          </span>
        </div>

        {/* =========================
            DESKTOP PROFILE
        ========================== */}
        {user ? (
          <div className="relative group">

            {/* Dynamic Avatar */}
            <button
              className="w-10 h-10 rounded-full
                bg-gradient-to-br from-emerald-500 to-green-700
                text-white font-bold text-sm
                flex items-center justify-center
                border-2 border-white shadow-md
                ring-1 ring-emerald-100
                transition-all duration-300
                group-hover:scale-105 group-hover:shadow-lg
                cursor-pointer"
              title={user.name}
            >
              {getUserInitials(user.name)}
            </button>

            {/* Hover bridge + Dropdown */}
            <div
              className="hidden group-hover:block
                absolute top-full right-0 pt-2 z-40"
            >
              <div
                className="bg-white/95 backdrop-blur-xl
                  shadow-xl rounded-xl
                  border border-gray-100
                  py-1.5 w-44 px-1.5"
              >

                {/* User Header */}
                <div
                  className="flex items-center gap-2.5
                    px-2.5 py-2 mb-1
                    border-b border-gray-100"
                >
                  <div
                    className="w-8 h-8 rounded-full
                      bg-gradient-to-br from-emerald-500
                      to-green-700 text-white
                      flex items-center justify-center
                      text-[11px] font-bold shrink-0"
                  >
                    {getUserInitials(user.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400">
                      Welcome
                    </p>

                    <p
                      className="text-xs font-semibold
                        text-gray-700 truncate"
                    >
                      {user.name}
                    </p>
                  </div>
                </div>

                {/* My Orders */}
                <div
                  onClick={() => navigate("/my-orders")}
                  className="flex items-center gap-2.5
                    px-2.5 py-2 cursor-pointer
                    text-gray-700
                    hover:text-emerald-600
                    hover:bg-emerald-50
                    rounded-lg transition-all duration-200"
                >
                  <div
                    className="w-7 h-7 rounded-md
                      bg-blue-50 text-blue-600
                      flex items-center justify-center"
                  >
                    <FaCartShopping className="text-xs" />
                  </div>

                  <span className="text-xs font-medium">
                    My Orders
                  </span>
                </div>

                {/* My Insights */}
                <div
                  onClick={() => navigate("/insights")}
                  className="flex items-center gap-2.5
                    px-2.5 py-2 cursor-pointer
                    text-gray-700
                    hover:text-emerald-600
                    hover:bg-emerald-50
                    rounded-lg transition-all duration-200"
                >
                  <div
                    className="w-7 h-7 rounded-md
                      bg-purple-50 text-purple-600
                      flex items-center justify-center"
                  >
                    <FaChartColumn className="text-xs" />
                  </div>

                  <span className="text-xs font-medium">
                    My Insights
                  </span>
                </div>

                {/* Logout */}
                <div
                  onClick={handleLogout}
                  className="flex items-center gap-2.5
                    px-2.5 py-2 cursor-pointer
                    text-gray-700
                    hover:text-red-500
                    hover:bg-red-50
                    rounded-lg transition-all duration-200
                    mt-0.5"
                >
                  <div
                    className="w-7 h-7 rounded-md
                      bg-red-50 text-red-500
                      flex items-center justify-center"
                  >
                    <FaArrowRightFromBracket className="text-xs" />
                  </div>

                  <span className="text-xs font-medium">
                    Logout
                  </span>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-6 py-2.5
              bg-emerald-600 hover:bg-emerald-700
              text-white text-sm font-semibold
              rounded-full shadow-md
              hover:shadow-lg hover:-translate-y-0.5
              transition-all duration-300"
          >
            Login →
          </button>
        )}
      </div>

      {/* =========================
          MOBILE ACTIONS
      ========================== */}
      <div className="flex sm:hidden items-center gap-2">

        {/* Search */}
        <button
          onClick={handleMobileSearch}
          aria-label="Search products"
          className="w-9 h-9 rounded-full
            flex items-center justify-center
            text-gray-700 hover:text-emerald-600
            hover:bg-emerald-50 transition-all duration-200"
        >
          {mobileSearchOpen ? (
            <FaXmark className="text-[20px]" />
          ) : (
            <FaMagnifyingGlass className="text-[18px]" />
          )}
        </button>

        {/* Cart */}
        <button
          onClick={handleMobileCart}
          aria-label="Shopping cart"
          className="relative w-9 h-9 rounded-full
            flex items-center justify-center
            text-gray-700 hover:text-emerald-600
            hover:bg-emerald-50 transition-all duration-200"
        >
          <img
            src={assets.cart_icon}
            alt="cart"
            className="w-5 h-5"
          />

          <span
            className="absolute -top-1 -right-1
              flex items-center justify-center
              w-4 h-4 rounded-full bg-emerald-600
              text-white text-[8px] font-bold
              border border-white"
          >
            {cartCount()}
          </span>
        </button>

        {/* Mobile Profile / Menu */}
        <button
          onClick={() => {
            setOpen(!open);
            setMobileSearchOpen(false);
          }}
          aria-label="Menu"
          className="relative w-9 h-9 rounded-full
            flex items-center justify-center
            transition-all duration-200"
        >
          {user ? (
            <div
              className="w-9 h-9 rounded-full
                bg-gradient-to-br from-emerald-500
                to-green-700 text-white
                font-bold text-xs
                flex items-center justify-center
                shadow-sm"
            >
              {getUserInitials(user.name)}
            </div>
          ) : (
            <svg
              width="24"
              height="20"
              viewBox="0 0 28 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="28"
                height="2"
                rx="1"
                fill="#426287"
              />
              <rect
                x="9"
                y="10"
                width="19"
                height="2"
                rx="1"
                fill="#426287"
              />
              <rect
                x="7"
                y="20"
                width="21"
                height="2"
                rx="1"
                fill="#426287"
              />
            </svg>
          )}
        </button>
      </div>

      {/* =========================
          MOBILE SEARCH
      ========================== */}
      {mobileSearchOpen && (
        <div
          className="absolute top-full left-0 w-full
            bg-white/95 backdrop-blur-xl
            border-t border-emerald-50
            shadow-md sm:hidden px-4 py-3"
        >
          <div
            className="flex items-center gap-2
              bg-gray-50 border border-gray-200
              rounded-full px-4 py-2.5
              focus-within:border-emerald-500
              focus-within:ring-4
              focus-within:ring-emerald-50"
          >
            <FaMagnifyingGlass
              className="text-gray-400 text-sm"
            />

            <div className="relative w-full h-5 overflow-hidden">
              {!searchQuery && (
                <div
                  key={placeholderIndex}
                  className="absolute inset-0 flex items-center
                    text-gray-400 text-sm pointer-events-none
                    animate-search-placeholder"
                >
                  {searchPlaceholders[placeholderIndex]}
                </div>
              )}

              <input
                autoFocus
                value={searchQuery}
                onChange={handleMobileSearchChange}
                type="text"
                placeholder=""
                className="relative z-10 w-full h-full
                  bg-transparent outline-none
                  text-sm text-gray-700
                  placeholder-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================
          MOBILE MENU
      ========================== */}
      {open && (
        <div
          className="absolute top-full left-0 w-full
            bg-white/95 backdrop-blur-xl
            border-t border-emerald-50
            shadow-xl sm:hidden px-4 py-4"
        >

          {/* User mini header */}
          {user && (
            <div
              className="flex items-center gap-3
                p-3 mb-2 rounded-2xl
                bg-gradient-to-r from-emerald-50
                to-green-50 border border-emerald-100"
            >
              <div
                className="w-10 h-10 rounded-full
                  bg-gradient-to-br from-emerald-500
                  to-green-700 text-white
                  flex items-center justify-center
                  text-sm font-bold"
              >
                {getUserInitials(user.name)}
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Welcome back
                </p>

                <p className="text-sm font-semibold text-gray-700">
                  {user.name}
                </p>
              </div>
            </div>
          )}

          {/* Home */}
          <button
            onClick={handleHomeNavigation}
            className="w-full flex items-center py-3 px-2
              text-left text-base font-medium text-gray-800
              border-b border-gray-100
              hover:text-emerald-600 transition-colors"
          >
            Home
          </button>

          {/* All Products */}
          <button
            onClick={handleAllProductsNavigation}
            className="w-full flex items-center py-3 px-2
              text-left text-base font-medium text-gray-800
              border-b border-gray-100
              hover:text-emerald-600 transition-colors"
          >
            All Products
          </button>

          {/* Logged-in user */}
          {user ? (
            <>
              {/* My Orders */}
              <button
                onClick={() => {
                  closeMenu();
                  navigate("/my-orders");
                }}
                className="w-full flex items-center gap-3
                  text-left py-3 px-2
                  text-base font-medium text-gray-800
                  border-b border-gray-100
                  hover:text-emerald-600 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-lg
                    bg-blue-50 text-blue-600
                    flex items-center justify-center"
                >
                  <FaCartShopping className="text-sm" />
                </div>

                <span>My Orders</span>
              </button>

              {/* My Insights */}
              <button
                onClick={() => {
                  closeMenu();
                  navigate("/insights");
                }}
                className="w-full flex items-center gap-3
                  text-left py-3 px-2
                  text-base font-medium text-gray-800
                  border-b border-gray-100
                  hover:text-emerald-600 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-lg
                    bg-purple-50 text-purple-600
                    flex items-center justify-center"
                >
                  <FaChartColumn className="text-sm" />
                </div>

                <span>My Insights</span>
              </button>

              {/* Logout */}
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="w-full flex items-center gap-3
                  text-left py-3 px-2
                  text-base font-medium text-red-500
                  hover:text-red-600 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-lg
                    bg-red-50 text-red-500
                    flex items-center justify-center"
                >
                  <FaArrowRightFromBracket className="text-sm" />
                </div>

                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleMobileLogin}
              className="w-full mt-4 py-3
                bg-emerald-600 hover:bg-emerald-700
                text-white font-semibold
                rounded-full shadow-sm
                transition-all duration-200"
            >
              Login
            </button>
          )}
        </div>
      )}

      {/* =========================
          SEARCH PLACEHOLDER ANIMATION
      ========================== */}
      <style>
        {`
          @keyframes searchPlaceholderSlide {
            0% {
              transform: translateY(100%);
              opacity: 0;
            }

            15% {
              transform: translateY(0);
              opacity: 1;
            }

            75% {
              transform: translateY(0);
              opacity: 1;
            }

            100% {
              transform: translateY(-100%);
              opacity: 0;
            }
          }

          .animate-search-placeholder {
            animation: searchPlaceholderSlide 2.6s ease-in-out forwards;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;