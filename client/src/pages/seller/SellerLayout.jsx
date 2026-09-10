import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { NavLink, Outlet } from "react-router-dom";

const SellerLayout = () => {
  const {
    setIsSeller,
    seller,
    setSeller,
    navigate,
  } = useContext(AppContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarLinks = [
    {
      name: "Dashboard",
      path: "/seller/dashboard",
      icon: assets.dashboard_icon,
    },
    {
      name: "Add Product",
      path: "/seller/add-product",
      icon: assets.add_icon,
    },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    {
      name: "Orders",
      path: "/seller/orders",
      icon: assets.order_icon,
    },
  ];

  const handleLogout = async () => {
    try {
      await axios.get("/api/seller/logout");
    } catch (error) {
      console.log("Seller logout error:", error);
    } finally {
      setIsSeller(false);
      setSeller(null);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 z-40 w-60 lg:w-64 bg-white border-r border-gray-200 flex-col">

        {/* Branding */}
        <div className="h-20 px-6 flex items-center border-b border-gray-100">
          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center">
              <span className="text-white font-bold">
                F
              </span>
            </div>

            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                FreshMart
              </h1>

              <p className="text-xs text-gray-400">
                Seller Panel
              </p>
            </div>

          </div>
        </div>

        {/* Seller Info */}
        <div className="px-5 pt-5">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-gray-50 border border-gray-100">

            <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-white">
                {seller?.name?.charAt(0)?.toUpperCase() || "S"}
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {seller?.storeName || seller?.name || "Seller"}
              </p>

              <p className="text-xs text-gray-400 truncate">
                {seller?.email || "Seller Account"}
              </p>
            </div>

          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pt-7">

          <p className="px-2 mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Store Management
          </p>

          <div className="space-y-1">

            {sidebarLinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.name}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green-50 text-green-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`w-8 h-8 rounded-md flex items-center justify-center ${
                        isActive
                          ? "bg-green-500"
                          : "bg-gray-100"
                      }`}
                    >
                      <img
                        src={item.icon}
                        alt=""
                        className={`w-5 h-5 ${
                          isActive
                            ? "brightness-0 invert"
                            : ""
                        }`}
                      />
                    </span>

                    <span>
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            ))}

          </div>
        </nav>

        {/* Logout */}
        <div className="mt-auto px-4 pb-4">

          <div className="border-t border-gray-100 pt-4">

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
            >
              <span className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-sm">
                ↪
              </span>

              <span>
                Logout
              </span>
            </button>

          </div>

          <p className="text-[10px] text-gray-400 text-center mt-3">
            FreshMart Seller Administration
          </p>

        </div>

      </aside>

      {/* Main Area */}
      <div className="md:ml-60 lg:ml-64 min-h-screen flex flex-col">

        {/* Top Header */}
        <header className="h-16 sm:h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">

          {/* Left */}
          <div className="flex items-center gap-3">

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
            >
              <span className="text-lg">
                ☰
              </span>
            </button>

            <div>
              <p className="hidden sm:block text-xs text-gray-400 mb-0.5">
                FreshMart Marketplace
              </p>

              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Seller Control Panel
              </h2>
            </div>

          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Store Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>

              <span className="text-xs font-medium text-green-700">
                Store Active
              </span>
            </div>

            {/* Seller */}
            <div className="hidden sm:flex items-center gap-2">

              <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {seller?.name?.charAt(0)?.toUpperCase() || "S"}
                </span>
              </div>

              <div className="hidden lg:block max-w-[150px]">
                <p className="text-xs font-medium text-gray-800 truncate">
                  {seller?.storeName || seller?.name || "Seller"}
                </p>

                <p className="text-[10px] text-gray-400">
                  Seller Account
                </p>
              </div>

            </div>

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="md:hidden px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-red-500 text-xs font-medium cursor-pointer"
            >
              Logout
            </button>

          </div>

        </header>

        {/* Mobile Navigation */}
        <div className="md:hidden bg-white border-b border-gray-200 px-3 py-3 overflow-x-auto">

          <nav className="flex gap-2 min-w-max">

            {sidebarLinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.name}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${
                    isActive
                      ? "bg-green-50 text-green-600 border border-green-100"
                      : "bg-gray-50 text-gray-600 border border-gray-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center ${
                        isActive
                          ? "bg-green-500"
                          : "bg-white"
                      }`}
                    >
                      <img
                        src={item.icon}
                        alt=""
                        className={`w-3.5 h-3.5 ${
                          isActive
                            ? "brightness-0 invert"
                            : ""
                        }`}
                      />
                    </span>

                    {item.name}
                  </>
                )}
              </NavLink>
            ))}

          </nav>

        </div>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          >

            <div
              className="w-72 max-w-[85vw] h-full bg-white border-r border-gray-200 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Mobile Sidebar Header */}
              <div className="h-20 px-5 flex items-center justify-between border-b border-gray-100">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center">
                    <span className="text-white font-bold">
                      F
                    </span>
                  </div>

                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">
                      FreshMart
                    </h1>

                    <p className="text-xs text-gray-400">
                      Seller Panel
                    </p>
                  </div>

                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
                >
                  ✕
                </button>

              </div>

              {/* Seller Info */}
              <div className="px-4 pt-5">

                <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-gray-50 border border-gray-100">

                  <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-white">
                      {seller?.name?.charAt(0)?.toUpperCase() || "S"}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {seller?.storeName || seller?.name || "Seller"}
                    </p>

                    <p className="text-xs text-gray-400 truncate">
                      {seller?.email || "Seller Account"}
                    </p>
                  </div>

                </div>

              </div>

              {/* Mobile Menu */}
              <nav className="flex-1 px-4 pt-7">

                <p className="px-2 mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Store Management
                </p>

                <div className="space-y-1">

                  {sidebarLinks.map((item) => (
                    <NavLink
                      to={item.path}
                      key={item.name}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                          isActive
                            ? "bg-green-50 text-green-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`w-8 h-8 rounded-md flex items-center justify-center ${
                              isActive
                                ? "bg-green-500"
                                : "bg-gray-100"
                            }`}
                          >
                            <img
                              src={item.icon}
                              alt=""
                              className={`w-5 h-5 ${
                                isActive
                                  ? "brightness-0 invert"
                                  : ""
                              }`}
                            />
                          </span>

                          <span>
                            {item.name}
                          </span>
                        </>
                      )}
                    </NavLink>
                  ))}

                </div>

              </nav>

              {/* Mobile Logout */}
              <div className="px-4 pb-5">

                <div className="border-t border-gray-100 pt-4">

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-sm">
                      ↪
                    </span>

                    <span>
                      Logout
                    </span>
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default SellerLayout;