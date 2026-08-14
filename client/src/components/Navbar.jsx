import { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  FaBasketShopping,
  FaMagnifyingGlass,
  FaXmark,
} from "react-icons/fa6";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const {
    user,
    setUser,
    navigate,
    setShowUserLogin,
    cartCount,
    searchQuery,
    setSearchQuery,
  } = useContext(AppContext);

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

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

  return (
    <nav
      className="
        sticky
        top-0
        z-50
        flex
        items-center
        justify-between
        px-6
        md:px-16
        lg:px-24
        xl:px-32
        py-2.5
        backdrop-blur-md
        border-b
        border-gray-200
        shadow-sm
        transition-all
        duration-300
      "
      style={{
        background:
          "linear-gradient(to right, #ecfccb 0%, #ffffff 15%, #ffffff 85%, #ecfccb 100%)",
      }}
    >

      {/* =========================
          LOGO
      ========================== */}
      <Link
        to="/"
        onClick={closeMenu}
        className="flex items-center gap-2 group"
      >
        <FaBasketShopping
          className="
            text-emerald-600
            text-3xl
            transition-transform
            duration-300
            group-hover:rotate-12
          "
        />

        <h2
          className="
            text-3xl
            font-extrabold
            tracking-tight
            text-emerald-600
            transition-all
            duration-300
            group-hover:scale-105
          "
        >
          FreshMart
        </h2>
      </Link>


      {/* =====================================================
          DESKTOP MENU
          SAME AS BEFORE
      ====================================================== */}
      <div className="hidden sm:flex items-center gap-8">

        <Link
          to="/"
          className="
            relative
            text-[17px]
            font-semibold
            text-gray-800
            transition-all
            duration-300
            hover:text-emerald-600
            hover:-translate-y-0.5
            after:absolute
            after:left-0
            after:-bottom-1
            after:w-0
            after:h-0.5
            after:bg-emerald-600
            after:transition-all
            after:duration-300
            hover:after:w-full
          "
        >
          Home
        </Link>

        <Link
          to="/products"
          className="
            relative
            text-[17px]
            font-semibold
            text-gray-800
            transition-all
            duration-300
            hover:text-emerald-600
            hover:-translate-y-0.5
            after:absolute
            after:left-0
            after:-bottom-1
            after:w-0
            after:h-0.5
            after:bg-emerald-600
            after:transition-all
            after:duration-300
            hover:after:w-full
          "
        >
          All Products
        </Link>


        {/* Desktop Search */}
        <div
          className="
            hidden
            lg:flex
            items-center
            gap-3
            bg-gray-50
            border
            border-gray-200
            rounded-full
            px-4
            py-2
            w-80
            transition-all
            duration-300
            hover:border-emerald-300
            focus-within:border-emerald-500
            focus-within:ring-2
            focus-within:ring-emerald-100
          "
        >
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full
              bg-transparent
              outline-none
              text-gray-700
              placeholder:text-gray-400
            "
            type="text"
            placeholder="Search fresh groceries.."
          />

          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.836 10.615 15 14.695"
              stroke="#7A7B7D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              clipRule="evenodd"
              d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
              stroke="#7A7B7D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>


        {/* Desktop Cart */}
        <div
          onClick={() => navigate("/cart")}
          className="
            relative
            cursor-pointer
            group
            transition-transform
            duration-300
            hover:scale-110
          "
        >
          <img
            src={assets.cart_icon}
            alt="cart"
            className="
              w-7
              h-7
              transition-transform
              duration-300
              group-hover:scale-110
            "
          />

          <button
            className="
              absolute
              -top-2
              -right-3
              text-[11px]
              text-white
              bg-emerald-600
              w-5
              h-5
              font-semibold
              rounded-full
            "
          >
            {cartCount()}
          </button>
        </div>


        {/* Desktop Login / Profile */}
        {user ? (
          <div className="relative group">
            <img
              src={assets.profile_icon}
              alt="profile"
              className="w-10"
            />

            <ul
              className="
                hidden
                group-hover:block
                absolute
                top-10
                right-0
                bg-white
                shadow-md
                rounded-b-md
                border
                border-gray-200
                py-2.5
                w-25
                px-3
                z-40
                text-sm
              "
            >
              <li
                onClick={() => navigate("/my-orders")}
                className="p-1.5 cursor-pointer"
              >
                My order
              </li>

              <li
                onClick={() => setUser(null)}
                className="p-1.5 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        ) : (
          <button
            onClick={() => setShowUserLogin(true)}
            className="
              cursor-pointer
              px-7
              py-2.5
              bg-emerald-600
              hover:bg-emerald-700
              text-white
              font-semibold
              rounded-full
              shadow-md
              hover:shadow-lg
              hover:scale-105
              transition-all
              duration-300
            "
          >
            Login →
          </button>
        )}
      </div>


      {/* =====================================================
          MOBILE ACTIONS
      ====================================================== */}
      <div className="flex sm:hidden items-center gap-4">

        {/* Search */}
        <button
          onClick={handleMobileSearch}
          aria-label="Search products"
          className="text-gray-700 hover:text-emerald-600 transition-colors"
        >
          {mobileSearchOpen ? (
            <FaXmark className="text-[22px]" />
          ) : (
            <FaMagnifyingGlass className="text-[20px]" />
          )}
        </button>


        {/* Cart */}
        <button
          onClick={handleMobileCart}
          aria-label="Shopping cart"
          className="
            relative
            text-gray-700
            hover:text-emerald-600
            transition-colors
          "
        >
          <img
            src={assets.cart_icon}
            alt="cart"
            className="w-6 h-6"
          />

          <span
            className="
              absolute
              -top-2
              -right-2
              flex
              items-center
              justify-center
              w-4
              h-4
              rounded-full
              bg-emerald-600
              text-white
              text-[9px]
              font-bold
            "
          >
            {cartCount()}
          </span>
        </button>


        {/* Hamburger */}
        <button
          onClick={() => {
            setOpen(!open);
            setMobileSearchOpen(false);
          }}
          aria-label="Menu"
          className="text-gray-700 hover:text-emerald-600"
        >
          <svg
            width="28"
            height="22"
            viewBox="0 0 28 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="28" height="2" rx="1" fill="#426287" />
            <rect x="9" y="10" width="19" height="2" rx="1" fill="#426287" />
            <rect x="7" y="20" width="21" height="2" rx="1" fill="#426287" />
          </svg>
        </button>

      </div>


      {/* =====================================================
          MOBILE SEARCH BOX
      ====================================================== */}
      {mobileSearchOpen && (
        <div
          className="
            absolute
            top-full
            left-0
            w-full
            bg-white
            border-t
            border-gray-100
            shadow-md
            sm:hidden
            px-5
            py-3
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              bg-gray-50
              border
              border-gray-200
              rounded-full
              px-4
              py-2.5
              focus-within:border-emerald-500
            "
          >
            <FaMagnifyingGlass className="text-gray-400 text-sm" />

            <input
              autoFocus
              value={searchQuery}
              onChange={handleMobileSearchChange}
              type="text"
              placeholder="Search fresh groceries..."
              className="
                w-full
                bg-transparent
                outline-none
                text-sm
                text-gray-700
                placeholder:text-gray-400
              "
            />
          </div>
        </div>
      )}


      {/* =====================================================
          MOBILE MENU
      ====================================================== */}
      {open && (
        <div
          className="
            absolute
            top-full
            left-0
            w-full
            bg-white
            border-t
            border-gray-100
            shadow-lg
            sm:hidden
            px-6
            py-4
          "
        >

          {/* Home */}
          <Link
            to="/"
            onClick={closeMenu}
            className="
              block
              py-3
              text-base
              font-medium
              text-gray-800
              border-b
              border-gray-100
              hover:text-emerald-600
            "
          >
            Home
          </Link>


          {/* All Products */}
          <Link
            to="/products"
            onClick={closeMenu}
            className="
              block
              py-3
              text-base
              font-medium
              text-gray-800
              border-b
              border-gray-100
              hover:text-emerald-600
            "
          >
            All Products
          </Link>


          {/* Logged-in user */}
          {user ? (
            <>
              <button
                onClick={() => {
                  closeMenu();
                  navigate("/my-orders");
                }}
                className="
                  w-full
                  text-left
                  py-3
                  text-base
                  font-medium
                  text-gray-800
                  border-b
                  border-gray-100
                "
              >
                My Orders
              </button>

              <button
                onClick={() => {
                  closeMenu();
                  setUser(null);
                }}
                className="
                  w-full
                  text-left
                  py-3
                  text-base
                  font-medium
                  text-red-500
                "
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleMobileLogin}
              className="
                w-full
                mt-4
                py-3
                bg-emerald-600
                hover:bg-emerald-700
                text-white
                font-semibold
                rounded-full
                transition-colors
                duration-200
              "
            >
              Login
            </button>
          )}

        </div>
      )}

    </nav>
  );
};

export default Navbar;