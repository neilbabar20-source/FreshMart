import React, { useContext } from "react";
import { categories } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Category = () => {
  const { navigate } = useContext(AppContext);

  return (
    <div className="mt-16 rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-7 md:px-7">

      {/* Heading */}
      <p className="text-2xl md:text-3xl font-semibold text-gray-800">
        Categories
      </p>

      <div className="mt-2 h-1 w-16 rounded-full bg-green-500"></div>

      {/* Categories Carousel */}
      <div className="my-6 flex gap-3 sm:gap-5 pb-2 overflow-x-auto scroll-smooth category-scrollbar">

        {categories.map((category, index) => (
          <div
            key={index}
            className="
              group
              min-w-[105px]
              sm:min-w-[160px]
              flex-shrink-0
              cursor-pointer
              rounded-lg
              px-2
              sm:px-3
              py-3
              sm:py-5
              flex
              flex-col
              items-center
              justify-center
              gap-2
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-md
            "
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            <img
              src={category.image}
              alt={category.text}
              className="
                w-20
                h-20
                object-contain
                sm:w-auto
                sm:h-auto
                sm:max-w-28
                transition-transform
                duration-300
                group-hover:scale-105
              "
            />

            <p className="text-xs sm:text-sm font-medium text-center whitespace-nowrap">
              {category.text}
            </p>
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

export default Category;