import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";
import { FaArrowRight } from "react-icons/fa6";

const BestSeller = () => {
  const { axios } = useContext(AppContext);

  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBestSellers = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/product/best-sellers");

      if (data.success) {
        setBestSellers(data.bestSellers || []);
      }
    } catch (error) {
      console.error("Error fetching best sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSellers();
  }, []);

  return (
    <section className="mt-14 md:mt-16">

      {/* Section Header */}
      <div className="flex items-end justify-between px-1">
        <div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">
            Best Sellers
          </p>

          <div className="mt-2 h-1 w-14 rounded-full bg-green-500"></div>
        </div>

        {/* Desktop Hint */}
        <p className="hidden sm:block text-xs md:text-sm text-gray-400">
          Customer favourites
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-5 flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin"></span>

          <span className="text-sm font-medium text-gray-500">
            Best Sellers Loading...
          </span>
        </div>
      )}

      {/* Products */}
      <div
        className="
          mt-6
          flex
          gap-3
          sm:gap-4
          overflow-x-auto
          scroll-smooth
          category-scrollbar
          pb-3
        "
      >
        {loading ? (
          <>
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="
                  shrink-0
                  w-[calc(50%-6px)]
                  sm:w-auto
                  animate-pulse
                "
              >
                <div className="h-[280px] w-full min-w-[170px] rounded-xl bg-gray-100"></div>
              </div>
            ))}
          </>
        ) : (
          bestSellers.slice(0, 5).map((product) => (
            <div
              key={product._id}
              className="
                shrink-0
                w-[calc(50%-6px)]
                sm:w-auto
              "
            >
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>

      {/* Mobile Swipe Hint */}
      {!loading && bestSellers.length > 0 && (
        <div className="mt-1 flex items-center justify-center gap-2 sm:hidden">
          <span className="text-[11px] text-gray-400">
            Swipe to explore
          </span>

          <FaArrowRight className="text-[9px] text-gray-400" />
        </div>
      )}

    </section>
  );
};

export default BestSeller;