import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const PersonalInsights = () => {
  const { axios, user } = useContext(AppContext);

  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/order/insights");

      if (data.success) {
        setInsights(data.insights);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching grocery insights:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load grocery insights"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchInsights();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[55vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-2xl">
            🔒
          </div>

          <p className="text-gray-500">
            Please login to view your grocery insights.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[55vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-4 border-green-100 border-t-green-500 rounded-full animate-spin"></div>

          <p className="text-gray-500 text-sm">
            Loading your grocery insights...
          </p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="min-h-[55vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
            📊
          </div>

          <p className="text-gray-500">
            No grocery insights available yet.
          </p>
        </div>
      </div>
    );
  }

  const maxCategoryAmount =
    insights.categorySpending?.length > 0
      ? Math.max(
          ...insights.categorySpending.map(
            (item) => item.amount
          )
        )
      : 1;

  const categoryColors = [
    {
      bar: "bg-green-500",
      bg: "bg-green-50",
      text: "text-green-700",
    },
    {
      bar: "bg-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      bar: "bg-orange-500",
      bg: "bg-orange-50",
      text: "text-orange-700",
    },
    {
      bar: "bg-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-700",
    },
  ];

  return (
    <div className="py-6 md:py-10 max-w-6xl mx-auto px-3 sm:px-4">

      {/* HEADER */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-xl shadow-sm">
            📊
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Personal Grocery Insights
            </h1>

            <p className="text-sm text-gray-500 mt-0.5">
              Understand your shopping habits at a glance.
            </p>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5">

        {/* TOTAL SPENT */}
        <div className="group bg-white border border-green-100 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-lg">
              💰
            </div>

            <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Spending
            </span>
          </div>

          <p className="text-xs md:text-sm text-gray-500 mt-4">
            Total Spent
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mt-1">
            ₹{insights.totalSpent}
          </h2>
        </div>

        {/* TOTAL ORDERS */}
        <div className="group bg-white border border-blue-100 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-lg">
              🛒
            </div>

            <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              Orders
            </span>
          </div>

          <p className="text-xs md:text-sm text-gray-500 mt-4">
            Total Orders
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mt-1">
            {insights.totalOrders}
          </h2>
        </div>

        {/* AVERAGE ORDER */}
        <div className="group bg-white border border-orange-100 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-lg">
              📈
            </div>

            <span className="text-[10px] font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              Average
            </span>
          </div>

          <p className="text-xs md:text-sm text-gray-500 mt-4">
            Avg. Order
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mt-1">
            ₹{insights.averageOrderValue}
          </h2>
        </div>

        {/* ITEMS */}
        <div className="group bg-white border border-purple-100 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-lg">
              📦
            </div>

            <span className="text-[10px] font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              Products
            </span>
          </div>

          <p className="text-xs md:text-sm text-gray-500 mt-4">
            Items Bought
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mt-1">
            {insights.totalItems}
          </h2>
        </div>
      </div>

      {/* HABIT + PERSONALIZED */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* SHOPPING HABIT */}
        <div className="relative overflow-hidden bg-white border border-green-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">

          <div className="absolute -right-8 -top-8 w-24 h-24 bg-green-50 rounded-full"></div>

          <div className="relative flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                🥦
              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                Your Shopping Habit
              </h2>
            </div>

            <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 font-medium">
              Top Category
            </span>
          </div>

          <div className="relative rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-4">
            <p className="text-sm text-gray-500">
              You spend the most on
            </p>

            <p className="text-2xl font-semibold text-green-700 mt-1">
              {insights.mostPurchasedCategory}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Keep an eye on this category while planning your grocery budget.
            </p>
          </div>
        </div>

        {/* PERSONALIZED INSIGHT */}
        <div className="relative overflow-hidden bg-white border border-purple-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">

          <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-50 rounded-full"></div>

          <div className="relative flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
              💡
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              Personalized Insight
            </h2>
          </div>

          <div className="relative rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 p-4">
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {insights.personalizedInsight}
            </p>
          </div>
        </div>
      </div>

      {/* CATEGORY SPENDING */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mt-5">

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
              💳
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              Category Spending
            </h2>
          </div>

          <span className="hidden sm:block text-xs text-gray-400">
            Based on your orders
          </span>
        </div>

        <div className="space-y-4">
          {insights.categorySpending?.map((item, index) => {
            const percentage =
              (item.amount / maxCategoryAmount) * 100;

            const color =
              categoryColors[index % categoryColors.length];

            return (
              <div key={item.category}>

                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${color.bar}`}
                    ></div>

                    <p className="text-sm font-medium text-gray-700">
                      {item.category}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-gray-800">
                    ₹{item.amount}
                  </p>
                </div>

                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color.bar} rounded-full transition-all duration-500`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FREQUENTLY PURCHASED */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mt-5">

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              ⭐
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              Frequently Purchased
            </h2>
          </div>

          <span className="text-xs text-gray-400">
            Top 5
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {insights.frequentlyPurchasedProducts?.map(
            (product, index) => (
              <div
                key={product.productId}
                className="group flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-blue-50 hover:border-blue-100 transition-all duration-200"
              >
                <div className="flex items-center gap-3 min-w-0">

                  <div
                    className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold
                    ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-700"
                        : index === 1
                        ? "bg-gray-200 text-gray-600"
                        : index === 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-white text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-700 transition-colors">
                      {product.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {product.category}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-gray-500 whitespace-nowrap ml-3 bg-white px-2 py-1 rounded-full border border-gray-100">
                  {product.quantity}{" "}
                  {product.quantity === 1
                    ? "purchase"
                    : "purchases"}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* BOTTOM MESSAGE */}
      <div className="mt-5 rounded-2xl bg-gradient-to-r from-green-50 via-emerald-50 to-blue-50 border border-green-100 p-4 text-center">
        <p className="text-sm text-gray-600">
          🛍️ Keep shopping with FreshMart to make your insights smarter!
        </p>
      </div>
    </div>
  );
};

export default PersonalInsights;