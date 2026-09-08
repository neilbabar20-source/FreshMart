import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const AdminLayout = () => {
  const { axios, navigate } = useContext(AppContext);

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
    {
      name: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      name: "Sellers",
      path: "/admin/sellers",
    },
    {
      name: "Products",
      path: "/admin/products",
    },
    {
      name: "Orders",
      path: "/admin/orders",
    },
    {
      name: "Users",
      path: "/admin/users",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-indigo-500">
            FreshMart
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Admin Panel
          </p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 text-left cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Admin Panel
            </h2>
          </div>

          <button
            onClick={handleLogout}
            className="md:hidden text-sm text-red-500 cursor-pointer"
          >
            Logout
          </button>
        </header>

        {/* Mobile Navigation */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 bg-gray-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Page Content */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;