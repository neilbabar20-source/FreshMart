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
      <div className="p-6">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>

        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>

          <p className="ml-3 text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">
          Seller Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Unable to load dashboard data.
        </p>
      </div>
    );
  }

  const lowStock = dashboard.lowStockProducts || 0;
  const outOfStock = dashboard.outOfStockProducts || 0;

  const hasInventoryAlert = lowStock > 0 || outOfStock > 0;

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold">
            Seller Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome to your FreshMart seller dashboard 👋
          </p>
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition cursor-pointer whitespace-nowrap"
        >
          Go to Store
        </button>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Products */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">
            Total Products
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {dashboard.totalProducts}
          </h2>

          <p className="text-green-600 text-sm mt-2">
            Products listed by you
          </p>
        </div>

        {/* Orders */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">
            Total Orders
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {dashboard.totalOrders}
          </h2>

          <p className="text-blue-600 text-sm mt-2">
            Orders containing your products
          </p>
        </div>

        {/* Sales */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">
            Total Sales
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{dashboard.totalSales}
          </h2>

          <p className="text-purple-600 text-sm mt-2">
            Revenue from your products
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">
            Pending Orders
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {dashboard.pendingOrders}
          </h2>

          <p className="text-orange-600 text-sm mt-2">
            Orders waiting for processing
          </p>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">

        {/* Inventory Alert */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">

          <h2 className="text-xl font-semibold">
            Inventory Alert
          </h2>

          {!hasInventoryAlert ? (
            <div className="mt-5">

              <p className="text-green-600 font-medium text-lg">
                ✓ Inventory looks good
              </p>

              <p className="text-gray-500 text-sm mt-2">
                All your products have sufficient stock.
              </p>

            </div>
          ) : (
            <div className="mt-5 space-y-5">

              {/* Low Stock */}
              {lowStock > 0 && (
                <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-orange-700 font-medium">
                        Low Stock
                      </p>

                      <p className="text-gray-500 text-sm mt-1">
                        Products with stock between 1 and 5
                      </p>
                    </div>

                    <span className="text-2xl font-bold text-orange-600">
                      {lowStock}
                    </span>

                  </div>

                </div>
              )}

              {/* Out of Stock */}
              {outOfStock > 0 && (
                <div className="border border-red-200 bg-red-50 rounded-lg p-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-red-700 font-medium">
                        Out of Stock
                      </p>

                      <p className="text-gray-500 text-sm mt-1">
                        Products with stock quantity 0
                      </p>
                    </div>

                    <span className="text-2xl font-bold text-red-600">
                      {outOfStock}
                    </span>

                  </div>

                </div>
              )}

            </div>
          )}

        </div>

        {/* Recent Orders */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">

          <h2 className="text-xl font-semibold">
            Recent Orders
          </h2>

          {dashboard.recentOrders?.length === 0 ? (
            <p className="text-gray-500 mt-5">
              No orders yet.
            </p>
          ) : (
            <div className="mt-4 space-y-3">

              {dashboard.recentOrders.map((order) => {

                // Seller dashboard returns only this seller's items
                const sellerItem = order.items?.[0];

                const sellerStatus =
                  sellerItem?.status || "Order Placed";

                return (
                  <div
                    key={order._id}
                    className="flex items-center justify-between border-b pb-3"
                  >

                    <div>
                      <p className="font-medium">
                        Order #{order._id.slice(-6)}
                      </p>

                      <p className="text-sm text-gray-500">
                        ₹{order.amount}
                      </p>
                    </div>

                    <span className="text-sm font-medium">
                      {sellerStatus}
                    </span>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;