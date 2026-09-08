import React, { useContext } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import { AppContext } from "./context/AppContext";
import MyOrders from "./pages/MyOrders";
import Auth from "./models/Auth";
import ProductCategory from "./pages/ProductCategory";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import AddAddress from "./pages/AddAddress";

import SellerLogin from "./components/seller/SellerLogin";
import SellerRegister from "./pages/seller/SellerRegister";
import SellerPortal from "./pages/seller/SellerPortal";
import SellerLayout from "./pages/seller/SellerLayout";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import EditProduct from "./pages/seller/EditProduct";
import Orders from "./pages/seller/Orders";
import Dashboard from "./pages/seller/Dashboard";
import Setting from "./pages/seller/Setting";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSellers from "./pages/admin/Sellers";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";

const App = () => {
  const {
    isSeller,
    isAdmin,
    showUserLogin,
  } = useContext(AppContext);

  const location = useLocation();

  const isSellerPath = location.pathname.includes("/seller");
  const isAdminPath = location.pathname.includes("/admin");

  return (
    <div className="text-default min-h-screen">

      {/* Customer Navbar */}
      {!isSellerPath && !isAdminPath && <Navbar />}

      {/* Customer Login */}
      {showUserLogin && !isSellerPath && !isAdminPath ? <Auth /> : null}

      <Toaster />

      <div className="px-6 md:px-16 lg:px-24 xl:px-15">
        <Routes>

          {/* ================= CUSTOMER ROUTES ================= */}

          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />

          <Route
            path="/product/:category/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/products/:category"
            element={<ProductCategory />}
          />

          <Route path="/cart" element={<Cart />} />

          <Route path="/my-orders" element={<MyOrders />} />

          <Route path="/add-address" element={<AddAddress />} />


          {/* ================= SELLER ROUTES ================= */}

          {/* Seller Portal */}
          <Route
            path="/seller"
            element={
              isSeller ? (
                <Navigate to="/seller/dashboard" replace />
              ) : (
                <SellerPortal />
              )
            }
          />

          {/* Seller Login */}
          <Route
            path="/seller/login"
            element={
              isSeller ? (
                <Navigate to="/seller/dashboard" replace />
              ) : (
                <SellerLogin />
              )
            }
          />

          {/* Seller Register */}
          <Route
            path="/seller/register"
            element={
              isSeller ? (
                <Navigate to="/seller/dashboard" replace />
              ) : (
                <SellerRegister />
              )
            }
          />

          {/* Seller Dashboard */}
          <Route
            path="/seller/dashboard"
            element={
              isSeller ? (
                <SellerLayout />
              ) : (
                <Navigate to="/seller" replace />
              )
            }
          >
            <Route index element={<Dashboard />} />
          </Route>

          {/* Seller Add Product */}
          <Route
            path="/seller/add-product"
            element={
              isSeller ? (
                <SellerLayout />
              ) : (
                <Navigate to="/seller" replace />
              )
            }
          >
            <Route index element={<AddProduct />} />
          </Route>

          {/* Seller Product List */}
          <Route
            path="/seller/product-list"
            element={
              isSeller ? (
                <SellerLayout />
              ) : (
                <Navigate to="/seller" replace />
              )
            }
          >
            <Route index element={<ProductList />} />
          </Route>

          {/* Seller Edit Product */}
          <Route
            path="/seller/edit-product/:id"
            element={
              isSeller ? (
                <SellerLayout />
              ) : (
                <Navigate to="/seller" replace />
              )
            }
          >
            <Route index element={<EditProduct />} />
          </Route>

          {/* Seller Orders */}
          <Route
            path="/seller/orders"
            element={
              isSeller ? (
                <SellerLayout />
              ) : (
                <Navigate to="/seller" replace />
              )
            }
          >
            <Route index element={<Orders />} />
          </Route>

          {/* Seller Settings */}
          <Route
            path="/seller/setting"
            element={
              isSeller ? (
                <SellerLayout />
              ) : (
                <Navigate to="/seller" replace />
              )
            }
          >
            <Route index element={<Setting />} />
          </Route>


          {/* ================= ADMIN ROUTES ================= */}

          {/* Admin Login */}
          <Route
            path="/admin/login"
            element={
              isAdmin === true ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <AdminLogin />
              )
            }
          />

          {/* Admin Panel */}
          <Route
            path="/admin"
            element={
              isAdmin === null ? (
                <div className="min-h-screen flex items-center justify-center">
                  <p className="text-gray-500">
                    Checking admin authentication...
                  </p>
                </div>
              ) : isAdmin ? (
                <AdminLayout />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          >
            {/* Admin Dashboard */}
            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />

            {/* Admin Sellers */}
            <Route
              path="sellers"
              element={<AdminSellers />}
            />

            {/* Admin Products */}
            <Route
              path="products"
              element={<AdminProducts />}
            />

            {/* Admin Orders */}
            <Route
              path="orders"
              element={<AdminOrders />}
            />

            {/* Admin Users */}
            <Route
              path="users"
              element={<AdminUsers />}
            />
          </Route>

        </Routes>
      </div>

      {/* Customer Footer */}
      {!isSellerPath && !isAdminPath && <Footer />}

    </div>
  );
};

export default App;