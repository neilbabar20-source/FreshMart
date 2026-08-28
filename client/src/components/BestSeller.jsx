import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";

const BestSeller = () => {
  const { products } = useContext(AppContext);

  return (
    <div className="mt-16 rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-7 md:px-7">

      {/* Section Heading */}
      <p className="text-2xl md:text-3xl font-semibold text-gray-800">
        Best Sellers
      </p>

      {/* Heading Accent */}
      <div className="mt-2 h-1 w-16 rounded-full bg-green-500"></div>

      {/* Products */}
      <div
        className="
          my-6
          flex
          gap-3
          sm:gap-5
          overflow-x-auto
          scroll-smooth
          category-scrollbar
          pb-2
          scroll-stagger
        "
      >
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <div
              key={index}
              className="shrink-0 w-[calc(50%-6px)] sm:w-auto"
            >
              <ProductCard product={product} />
            </div>
          ))}
      </div>

      {/* Mobile Swipe Hint */}
      <p className="sm:hidden text-center text-xs text-gray-400 -mt-1">
        ← Swipe for more →
      </p>

    </div>
  );
};

export default BestSeller;