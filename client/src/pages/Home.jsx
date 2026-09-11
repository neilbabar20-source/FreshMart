import React, { useContext, useEffect, useState } from "react";
import Hero from "../components/Hero";
import Category from "../components/Category";
import BestSeller from "../components/BestSeller";
import BottomBanner from "../components/BottomBanner";
import Announcement from "../components/Announcement";
import ProductCard from "../components/ProductCard";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import {
  FaTruckFast,
  FaArrowRight,
  FaWandMagicSparkles,
  FaCartShopping,
} from "react-icons/fa6";

const Home = () => {
  const { axios, user } = useContext(AppContext);

  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setRecommendations([]);
        return;
      }

      try {
        setRecommendationsLoading(true);

        const { data } = await axios.get("/api/product/recommendations");

        if (data.success) {
          setRecommendations(data.recommendations || []);
        } else {
          setRecommendations([]);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendations([]);
      } finally {
        setRecommendationsLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, axios]);

  return (
    <main className="w-full overflow-x-hidden pb-8">

      {/* Announcement - Full Width */}
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <Announcement />
      </div>

      {/* Hero - Full Width */}
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <Hero />
      </div>

      {/* Explore All Products */}
      <section className="flex justify-center px-4 py-5 md:py-6">
        <Link
          to="/products"
          className="group inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-green-600 hover:shadow-md"
        >
          <FaTruckFast className="text-base" />

          <span>Explore All Products</span>

          <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </section>

      {/* Categories */}
      <Category />

      {/* Best Sellers */}
      <div id="best-sellers">
        <BestSeller />
     </div>

      {/* Recommended For You */}
      {user && (
        <section className="mt-10 px-4 md:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <FaWandMagicSparkles className="text-green-600" />

                <span className="text-sm font-medium text-green-600">
                  Personalized for you
                </span>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 md:text-3xl">
                Recommended For You
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Products picked based on your shopping activity
              </p>
            </div>

            <Link
              to="/products"
              className="hidden items-center gap-1 text-sm font-medium text-green-600 transition-colors hover:text-green-700 sm:flex"
            >
              View All
              <FaArrowRight className="text-xs" />
            </Link>
          </div>

          {recommendationsLoading ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-72 min-w-[180px] animate-pulse rounded-xl bg-gray-100 sm:min-w-[210px] lg:min-w-[220px]"
                ></div>
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <>
              <div className="category-scrollbar flex gap-4 overflow-x-auto pb-3">
                {recommendations.slice(0, 6).map((product) => (
                  <div
                    key={product._id}
                    className="min-w-[180px] flex-shrink-0 sm:min-w-[210px] lg:min-w-[220px]"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-center sm:hidden">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-5 py-2 text-sm font-medium text-green-700 transition-all duration-300 hover:bg-green-100"
                >
                  View All Products
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </>
          ) : (
            /* New User / No Purchase State */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6 py-10 text-center shadow-sm">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                <FaCartShopping className="text-xl" />
              </div>

              <h3 className="text-lg font-semibold text-gray-800 md:text-xl">
                Start Shopping to Get Personalized Picks
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                Buy something first, and we'll show your personalized
                recommendations and most purchased products here.
              </p>

              <Link
                to="/products"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-green-700"
              >
                Start Shopping
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Why Choose FreshMart */}
      <BottomBanner />

    </main>
  );
};

export default Home;