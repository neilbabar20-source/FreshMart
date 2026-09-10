import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/seller/dashboard");

      if (data.success) {
        setDashboard(data.dashboard);
      } else {
        toast.error(data.message || "Failed to load dashboard");
      }
    } catch (error) {
      console.error("Error fetching seller dashboard:", error);

      toast.error(
        error.response?.data?.message || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-56 bg-gray-200 rounded mt-3 animate-pulse"></div>
            <div className="h-4 w-72 bg-gray-200 rounded mt-3 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-9 w-20 bg-gray-200 rounded mt-4 animate-pulse"></div>
                <div className="h-3 w-32 bg-gray-100 rounded mt-4 animate-pulse"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
            <div className="h-64 bg-white border border-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-64 bg-white border border-gray-200 rounded-xl animate-pulse"></div>
          </div>

        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">

          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center">
              <span className="text-red-500 font-semibold">
                !
              </span>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mt-4">
              Unable to load dashboard
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Please refresh the page and try again.
            </p>

            <button
              onClick={fetchDashboard}
              className="mt-5 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition cursor-pointer"
            >
              Try Again
            </button>
          </div>

        </div>
      </div>
    );
  }

  const lowStock = dashboard.lowStockProducts || 0;
  const outOfStock = dashboard.outOfStockProducts || 0;

  const hasInventoryAlert = lowStock > 0 || outOfStock > 0;

  const totalProducts = dashboard.totalProducts || 0;
  const totalOrders = dashboard.totalOrders || 0;
  const totalSales = dashboard.totalSales || 0;
  const pendingOrders = dashboard.pendingOrders || 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">

          <div>
            <p className="text-sm font-medium text-green-600">
              Store Overview
            </p>

            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1">
              Seller Dashboard
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Manage your store performance, products and orders.
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full sm:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition cursor-pointer"
          >
            Go to Store
          </button>

        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Products */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Products
                </p>

                <h2 className="text-3xl font-semibold text-gray-900 mt-3">
                  {totalProducts}
                </h2>
              </div>

              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <span className="text-sm font-semibold text-green-600">
                  P
                </span>
              </div>

            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Products listed in your store
              </p>
            </div>

          </div>

          {/* Orders */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Orders
                </p>

                <h2 className="text-3xl font-semibold text-gray-900 mt-3">
                  {totalOrders}
                </h2>
              </div>

              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">
                  O
                </span>
              </div>

            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Orders containing your products
              </p>
            </div>

          </div>

          {/* Sales */}
          <div className="bg-gray-900 rounded-xl p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-400">
                  Total Sales
                </p>

                <h2 className="text-3xl font-semibold text-white mt-3">
                  ₹{totalSales}
                </h2>
              </div>

              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  ₹
                </span>
              </div>

            </div>

            <div className="mt-5 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-400">
                Revenue generated from your products
              </p>
            </div>

          </div>

          {/* Pending Orders */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Pending Orders
                </p>

                <h2 className="text-3xl font-semibold text-gray-900 mt-3">
                  {pendingOrders}
                </h2>
              </div>

              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <span className="text-sm font-semibold text-orange-600">
                  !
                </span>
              </div>

            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Orders waiting for processing
              </p>
            </div>

          </div>

        </div>

        {/* Overview Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">

          {/* Store Summary */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Store Summary
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Current store activity
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-md bg-green-50 text-green-600 text-xs font-medium">
                Active
              </span>

            </div>

            <div className="mt-6 space-y-4">

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Products
                </span>

                <span className="text-sm font-semibold text-gray-800">
                  {totalProducts}
                </span>
              </div>

              <div className="h-px bg-gray-100"></div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Orders
                </span>

                <span className="text-sm font-semibold text-gray-800">
                  {totalOrders}
                </span>
              </div>

              <div className="h-px bg-gray-100"></div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Pending
                </span>

                <span className="text-sm font-semibold text-orange-600">
                  {pendingOrders}
                </span>
              </div>

              <div className="h-px bg-gray-100"></div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Sales
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  ₹{totalSales}
                </span>
              </div>

            </div>

          </div>

          {/* Inventory Alert */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Inventory Overview
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Monitor products that need your attention
                </p>
              </div>

              <div
                className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                  hasInventoryAlert
                    ? "bg-orange-50 text-orange-600"
                    : "bg-green-50 text-green-600"
                }`}
              >
                {hasInventoryAlert ? "Attention Needed" : "Healthy"}
              </div>

            </div>

            {!hasInventoryAlert ? (
              <div className="mt-7 flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <span className="text-green-600 font-semibold">
                    ✓
                  </span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Inventory looks good
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    All your products currently have sufficient stock.
                  </p>
                </div>

              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                {/* Low Stock */}
                <div className="border border-orange-200 bg-orange-50 rounded-xl p-5">

                  <div className="flex items-start justify-between">

                    <div>
                      <p className="text-sm font-semibold text-orange-700">
                        Low Stock
                      </p>

                      <p className="text-xs text-orange-600/80 mt-2 leading-5">
                        Products with stock between 1 and 5 units.
                      </p>
                    </div>

                    <span className="text-2xl font-semibold text-orange-600">
                      {lowStock}
                    </span>

                  </div>

                  <div className="mt-5 h-1.5 rounded-full bg-orange-100 overflow-hidden">
                    <div className="h-full w-1/2 bg-orange-400 rounded-full"></div>
                  </div>

                </div>

                {/* Out of Stock */}
                <div className="border border-red-200 bg-red-50 rounded-xl p-5">

                  <div className="flex items-start justify-between">

                    <div>
                      <p className="text-sm font-semibold text-red-700">
                        Out of Stock
                      </p>

                      <p className="text-xs text-red-600/80 mt-2 leading-5">
                        Products that currently have zero stock.
                      </p>
                    </div>

                    <span className="text-2xl font-semibold text-red-600">
                      {outOfStock}
                    </span>

                  </div>

                  <div className="mt-5 h-1.5 rounded-full bg-red-100 overflow-hidden">
                    <div className="h-full w-1/2 bg-red-400 rounded-full"></div>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mt-5">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Latest orders containing your products
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/seller/orders")}
              className="text-xs font-medium text-green-600 hover:text-green-700 cursor-pointer"
            >
              View Orders
            </button>

          </div>

          {dashboard.recentOrders?.length === 0 ? (
            <div className="py-12 text-center">

              <div className="w-12 h-12 mx-auto rounded-xl bg-gray-50 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-400">
                  O
                </span>
              </div>

              <p className="text-sm font-medium text-gray-700 mt-4">
                No orders yet
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Your recent orders will appear here.
              </p>

            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">

              <div className="min-w-[600px]">

                {/* Table Header */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 px-4 py-3 bg-gray-50 rounded-lg text-xs font-medium text-gray-400">
                  <span>Order</span>
                  <span>Amount</span>
                  <span>Status</span>
                </div>

                {/* Orders */}
                <div className="divide-y divide-gray-100">

                  {dashboard.recentOrders.map((order) => {

                    const sellerItem = order.items?.[0];

                    const sellerStatus =
                      sellerItem?.status || "Order Placed";

                    return (
                      <div
                        key={order._id}
                        className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 items-center px-4 py-4"
                      >

                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            Order #{order._id.slice(-6)}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            Recent order
                          </p>
                        </div>

                        <p className="text-sm font-medium text-gray-800">
                          ₹{order.amount}
                        </p>

                        <div>
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${
                              sellerStatus === "Delivered"
                                ? "bg-green-50 text-green-600"
                                : sellerStatus === "Cancelled"
                                ? "bg-red-50 text-red-600"
                                : sellerStatus === "Shipped"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-orange-50 text-orange-600"
                            }`}
                          >
                            {sellerStatus}
                          </span>
                        </div>

                      </div>
                    );
                  })}

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;