import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { NavLink, Outlet } from 'react-router-dom'

const SellerLayout = () => {
  const {
    isSeller,
    setIsSeller,
    navigate,
    darkMode,
    toggleTheme,
  } = useContext(AppContext)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const sidebarLinks = [
    {
      name: "Dashboard",
      path: "/seller/dashboard",
      icon: assets.dashboard_icon,
    },
    {
      name: "Add Product",
      path: "/seller",
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
    {
      name: "Setting",
      path: "/seller/setting",
      icon: assets.setting_icon,
    },
  ]

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-3 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">

        {/* Left side */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-2xl cursor-pointer"
          >
            ☰
          </button>

          <h1 className="text-xl md:text-2xl font-semibold whitespace-nowrap">
            FreshMart
          </h1>

        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 md:gap-5 text-gray-500 flex-shrink-0 ml-3">

          {/* Admin text */}
          <p className="text-xs md:text-base whitespace-nowrap">
            Hi! Admin
          </p>

          <button
            onClick={toggleTheme}
            className="border rounded-full text-xs md:text-sm px-2 md:px-4 py-1 cursor-pointer whitespace-nowrap"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <button
            onClick={() => {
              setIsSeller(false)
              navigate("/")
            }}
            className="border rounded-full text-xs md:text-sm px-2 md:px-4 py-1 cursor-pointer whitespace-nowrap"
          >
            Logout
          </button>

        </div>
      </div>

      <div className="flex">

        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-64 border-r h-[95vh] text-base border-gray-300 pt-4 flex-col">

          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/seller"}
              className={({ isActive }) => `flex items-center py-3 px-4 gap-3
                ${
                  isActive
                    ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-indigo-500 text-indigo-500"
                    : "hover:bg-gray-100/90 border-white "
                }`}
            >
              <img
                src={item.icon}
                alt=""
                className="w-7 h-7"
              />

              <p className="text-center">
                {item.name}
              </p>
            </NavLink>
          ))}

        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          >

            <div
              className="w-64 h-full bg-white border-r border-gray-300 pt-4"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Close Button */}
              <div className="flex justify-end px-4 pb-3">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {sidebarLinks.map((item) => (
                <NavLink
                  to={item.path}
                  key={item.name}
                  end={item.path === "/seller"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `flex items-center py-3 px-4 gap-3
                    ${
                      isActive
                        ? "border-r-4 bg-indigo-500/10 border-indigo-500 text-indigo-500"
                        : "hover:bg-gray-100/90 border-white"
                    }`}
                >
                  <img
                    src={item.icon}
                    alt=""
                    className="w-7 h-7"
                  />

                  <p className="text-center">
                    {item.name}
                  </p>
                </NavLink>
              ))}

            </div>

          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>

      </div>
    </>
  )
}

export default SellerLayout