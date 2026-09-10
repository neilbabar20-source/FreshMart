import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { axios } = useContext(AppContext);

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard");

      if (data.success) {
        setDashboard(data.dashboard);
      }
    } catch (error) {
      console.log(
        "Admin dashboard error:",
        error.response?.data?.message || error.message
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
      <div className="min-h-full bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-7 w-48 bg-gray-200 rounded"></div>
              <div className="h-4 w-72 bg-gray-200 rounded"></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-32 bg-gray-100 rounded-xl"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-full bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-red-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              Unable to load dashboard
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Please refresh the page and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalUsers = Number(dashboard.totalUsers) || 0;
  const totalSellers = Number(dashboard.totalSellers) || 0;
  const pendingSellers = Number(dashboard.pendingSellers) || 0;
  const activeSellers = Number(dashboard.activeSellers) || 0;
  const totalProducts = Number(dashboard.totalProducts) || 0;
  const totalOrders = Number(dashboard.totalOrders) || 0;
  const totalSales = Number(dashboard.totalSales) || 0;

  const sellerApprovalRate =
    totalSellers > 0
      ? Math.round((activeSellers / totalSellers) * 100)
      : 0;

  const averageOrderValue =
    totalOrders > 0
      ? Math.round(totalSales / totalOrders)
      : 0;

  const cards = [
    {
      title: "Total Users",
      value: totalUsers,
      description: "Registered customers",
      accent: "green",
    },
    {
      title: "Total Sellers",
      value: totalSellers,
      description: "Marketplace sellers",
      accent: "blue",
    },
    {
      title: "Pending Sellers",
      value: pendingSellers,
      description: "Awaiting approval",
      accent: "orange",
    },
    {
      title: "Active Sellers",
      value: activeSellers,
      description: "Currently active",
      accent: "emerald",
    },
    {
      title: "Total Products",
      value: totalProducts,
      description: "Products listed",
      accent: "purple",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      description: "Orders received",
      accent: "indigo",
    },
  ];

  const accentStyles = {
    green: {
      icon: "bg-green-50 text-green-600",
      line: "bg-green-500",
    },
    blue: {
      icon: "bg-blue-50 text-blue-600",
      line: "bg-blue-500",
    },
    orange: {
      icon: "bg-orange-50 text-orange-600",
      line: "bg-orange-500",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      line: "bg-emerald-500",
    },
    purple: {
      icon: "bg-purple-50 text-purple-600",
      line: "bg-purple-500",
    },
    indigo: {
      icon: "bg-indigo-50 text-indigo-600",
      line: "bg-indigo-500",
    },
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-7">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">
                FreshMart Administration
              </p>

              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                Marketplace Overview
              </h1>

              <p className="text-sm text-gray-500 mt-2 max-w-xl">
                Monitor your marketplace, sellers, products, customers and
                overall sales performance from one place.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>

              <span className="text-xs font-medium text-gray-600">
                Marketplace Active
              </span>
            </div>
          </div>
        </div>

        {/* Sales Highlight */}
        <div className="relative overflow-hidden bg-gray-900 rounded-2xl p-5 sm:p-7 mb-6 shadow-sm">
          <div className="absolute -right-16 -top-20 w-56 h-56 rounded-full bg-green-500/10"></div>
          <div className="absolute -right-5 -bottom-24 w-64 h-64 rounded-full bg-blue-500/10"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm text-gray-400 font-medium">
                Total Marketplace Sales
              </p>

              <h2 className="text-3xl sm:text-4xl font-semibold text-white mt-2 tracking-tight">
                ₹{totalSales.toLocaleString("en-IN")}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Revenue generated from {totalOrders} total orders
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 min-w-full md:min-w-[280px] md:max-w-[320px]">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-gray-400">
                  Orders
                </p>

                <p className="text-xl font-semibold text-white mt-1">
                  {totalOrders}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-gray-400">
                  Avg. Order
                </p>

                <p className="text-xl font-semibold text-white mt-1">
                  ₹{averageOrderValue.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Statistics */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Marketplace Statistics
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Current platform activity at a glance
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => {
              const styles = accentStyles[card.accent];

              return (
                <div
                  key={card.title}
                  className="group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {card.title}
                      </p>

                      <h3 className="text-2xl font-semibold text-gray-900 mt-2">
                        {card.value.toLocaleString("en-IN")}
                      </h3>

                      <p className="text-xs text-gray-400 mt-1">
                        {card.description}
                      </p>
                    </div>

                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold ${styles.icon}`}
                    >
                      {card.title === "Total Users" && "U"}
                      {card.title === "Total Sellers" && "S"}
                      {card.title === "Pending Sellers" && "P"}
                      {card.title === "Active Sellers" && "A"}
                      {card.title === "Total Products" && "PR"}
                      {card.title === "Total Orders" && "O"}
                    </div>
                  </div>

                  <div className="mt-5 h-1 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full w-1/3 rounded-full ${styles.line}`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Marketplace Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Seller Overview */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Seller Overview
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Current seller activity and approval status
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
                S
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {sellerApprovalRate}%
                  </p>

                  <p className="text-xs text-gray-500">
                    Active seller rate
                  </p>
                </div>

                <p className="text-xs text-gray-400">
                  {activeSellers} of {totalSellers} active
                </p>
              </div>

              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(sellerApprovalRate, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                <p className="text-xs text-green-600 font-medium">
                  Active
                </p>

                <p className="text-xl font-semibold text-gray-900 mt-1">
                  {activeSellers}
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 border border-orange-100 p-4">
                <p className="text-xs text-orange-600 font-medium">
                  Pending
                </p>

                <p className="text-xl font-semibold text-gray-900 mt-1">
                  {pendingSellers}
                </p>
              </div>
            </div>
          </div>

          {/* Platform Overview */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Platform Overview
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  High-level marketplace numbers
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-semibold">
                FM
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">

              <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Customers
                </p>

                <p className="text-xl font-semibold text-gray-900 mt-1">
                  {totalUsers.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Products
                </p>

                <p className="text-xl font-semibold text-gray-900 mt-1">
                  {totalProducts.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Sellers
                </p>

                <p className="text-xl font-semibold text-gray-900 mt-1">
                  {totalSellers.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Orders
                </p>

                <p className="text-xl font-semibold text-gray-900 mt-1">
                  {totalOrders.toLocaleString("en-IN")}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h3 className="font-semibold text-gray-900">
                Marketplace Status
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Your FreshMart marketplace is currently operational.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>

              <span className="text-sm font-medium text-green-600">
                All systems operational
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;