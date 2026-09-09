import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";
import { FaArrowRight } from "react-icons/fa6";

const BestSeller = () => {
  const { products } = useContext(AppContext);

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
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <div
              key={index}
              className="
                shrink-0
                w-[calc(50%-6px)]
                sm:w-auto
              "
            >
              <ProductCard product={product} />
            </div>
          ))}
      </div>

      {/* Mobile Swipe Hint */}
      <div className="mt-1 flex items-center justify-center gap-2 sm:hidden">
        <span className="text-[11px] text-gray-400">
          Swipe to explore
        </span>

        <FaArrowRight className="text-[9px] text-gray-400" />
      </div>

    </section>
  );
};

export default BestSeller;