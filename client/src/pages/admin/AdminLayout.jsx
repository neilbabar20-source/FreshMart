import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const AdminLayout = () => {
  const { axios, navigate, admin } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      await axios.get("/api/admin/logout");
    } catch (error) {
      console.log("Admin logout error:", error);
    } finally {
      navigate("/admin/login");
    }
  };

  const menuItems = [
    { name: "Dashboard", short: "D", path: "/admin/dashboard" },
    { name: "Sellers", short: "S", path: "/admin/sellers" },
    { name: "Products", short: "P", path: "/admin/products" },
    { name: "Orders", short: "O", path: "/admin/orders" },
    { name: "Users", short: "U", path: "/admin/users" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 z-40 w-60 lg:w-64 bg-white border-r border-gray-200 flex-col">
        
        {/* Logo */}
        <div className="h-20 px-6 flex items-center border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>

            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                FreshMart
              </h1>
              <p className="text-xs text-gray-400">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Admin Account */}
        <div className="px-5 pt-5">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-gray-50 border border-gray-100">
            <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-white">
                A
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {admin?.name || "Administrator"}
              </p>

              <p className="text-xs text-gray-400 truncate">
                {admin?.email || "Owner Account"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pt-7">
          <p className="px-2 mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
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
                      className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-semibold ${
                        isActive
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.short}
                    </span>

                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* FIXED BOTTOM LOGOUT AREA */}
        <div className="mt-auto px-4 pb-4">
          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
            >
              <span className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-sm">
                ↪
              </span>

              <span>Logout</span>
            </button>
          </div>

          <p className="text-[10px] text-gray-400 text-center mt-3">
            FreshMart Administration
          </p>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="md:ml-60 lg:ml-64 min-h-screen flex flex-col">

        {/* Header */}
        <header className="h-16 sm:h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          
          <div>
            <p className="hidden sm:block text-xs text-gray-400 mb-0.5">
              FreshMart Marketplace
            </p>

            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Admin Control Panel
            </h2>
          </div>

          <div className="flex items-center gap-3">
            
            {/* System Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>

              <span className="text-xs font-medium text-green-700">
                System Active
              </span>
            </div>

            {/* Admin */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  A
                </span>
              </div>

              <div className="hidden lg:block">
                <p className="text-xs font-medium text-gray-800">
                  Administrator
                </p>

                <p className="text-[10px] text-gray-400">
                  Owner
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
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
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
                      className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-semibold ${
                        isActive
                          ? "bg-green-500 text-white"
                          : "bg-white text-gray-500"
                      }`}
                    >
                      {item.short}
                    </span>

                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Page Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;