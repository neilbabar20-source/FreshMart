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
      <div className="p-6">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          Failed to load dashboard data.
        </p>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: dashboard.totalUsers,
    },
    {
      title: "Total Sellers",
      value: dashboard.totalSellers,
    },
    {
      title: "Pending Sellers",
      value: dashboard.pendingSellers,
    },
    {
      title: "Active Sellers",
      value: dashboard.activeSellers,
    },
    {
      title: "Total Products",
      value: dashboard.totalProducts,
    },
    {
      title: "Total Orders",
      value: dashboard.totalOrders,
    },
    {
      title: "Total Sales",
      value: `₹${dashboard.totalSales}`,
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Overview of your FreshMart marketplace
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">
              {card.title}
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-2">
              {card.value}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;