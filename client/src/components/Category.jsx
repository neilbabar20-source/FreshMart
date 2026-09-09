import React, { useContext } from "react";
import { categories } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { FaArrowRight } from "react-icons/fa6";

const Category = () => {
  const { navigate } = useContext(AppContext);

  return (
    <section className="mt-14 md:mt-16">

      {/* Section Header */}
      <div className="flex items-end justify-between px-1">
        <div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">
            Shop by Category
          </p>

          <div className="mt-2 h-1 w-14 rounded-full bg-green-500"></div>
        </div>

        {/* Desktop Hint */}
        <p className="hidden sm:block text-xs md:text-sm text-gray-400">
          Explore our fresh collections
        </p>
      </div>

      {/* Category Cards */}
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
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
            className="
              group
              relative
              min-w-[110px]
              sm:min-w-[145px]
              md:min-w-[155px]
              flex-shrink-0
              cursor-pointer
              overflow-hidden
              rounded-2xl
              border
              border-gray-100
              bg-white
              px-3
              py-4
              sm:px-4
              sm:py-5
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-green-100
              hover:shadow-md
              active:scale-[0.98]
            "
          >
            {/* Soft Background */}
            <div
              className="
                absolute
                inset-0
                opacity-50
                transition-opacity
                duration-300
                group-hover:opacity-70
              "
              style={{ backgroundColor: category.bgColor }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center">

              {/* Image */}
              <div
                className="
                  flex
                  h-20
                  w-20
                  sm:h-24
                  sm:w-24
                  items-center
                  justify-center
                  rounded-full
                  bg-white/70
                  p-2
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
              >
                <img
                  src={category.image}
                  alt={category.text}
                  className="
                    h-full
                    w-full
                    object-contain
                    transition-transform
                    duration-500
                    group-hover:scale-110
                  "
                />
              </div>

              {/* Category Name */}
              <p
                className="
                  mt-3
                  text-center
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-gray-700
                  whitespace-nowrap
                "
              >
                {category.text}
              </p>

              {/* Small Arrow */}
              <div
                className="
                  mt-2
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-white/80
                  text-green-600
                  opacity-0
                  translate-y-1
                  transition-all
                  duration-300
                  group-hover:translate-y-0
                  group-hover:opacity-100
                "
              >
                <FaArrowRight className="text-[9px]" />
              </div>

            </div>
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

export default Category;