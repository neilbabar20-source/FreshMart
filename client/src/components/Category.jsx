import React, { useContext } from 'react';
import { categories } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Category = () => {
  const { navigate } = useContext(AppContext);

  return (
   <div className="mt-16 scroll-reveal">

      {/* Heading */}
      <p className="text-2xl md:text-3xl font-semibold text-gray-800">
        Categories
      </p>

      <div className="mt-2 h-1 w-16 rounded-full bg-green-500"></div>

      {/* Categories Carousel */}
      <div className="my-6 flex gap-5 pb-2 overflow-x-auto scroll-smooth category-scrollbar ">

        {categories.map((category, index) => (
          <div
            key={index}
            className="group min-w-[160px] flex-shrink-0 cursor-pointer rounded-lg px-3 py-5 flex flex-col items-center justify-center gap-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            <img
              src={category.image}
              alt={category.text}
              className="max-w-28 transition-transform duration-300 group-hover:scale-105"
            />

            <p className="text-sm font-medium">
              {category.text}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Category;