import React, { useContext } from 'react'
import { assets } from "../assets/assets";
import { AppContext } from '../context/AppContext';

const ProductCard = ({ product }) => {
  const { navigate, addToCart, removeFromCart, cartItems } = useContext(AppContext);

  return (
    product && (
      <div
        onClick={() => {
          navigate(`/product/${product.category.toLowerCase()}/${product._id}`);
          scrollTo(0, 0);
        }}
        className="border border-gray-200 rounded-xl md:px-4 px-3 py-3 bg-white min-w-56 max-w-56 w-full shadow-sm hover:shadow-md transition-all duration-300"
      >

        {/* Product Image */}
        <div className="group cursor-pointer flex items-center justify-center px-2 py-2">
          <img
            className="max-w-26 md:max-w-36 transition-transform duration-300 group-hover:scale-105"
            src={product.image[0]}
            alt={product.name}
          />
        </div>

        {/* Product Information */}
        <div className="text-gray-500/70 text-sm">

          {/* Category */}
          <p className="text-xs text-gray-500">
            {product.category}
          </p>

          {/* Product Name */}
          <p className="text-gray-700 font-medium text-lg truncate w-full mt-1">
            {product.name}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="rating"
                  className="w-3 md:w-3.5"
                />
              ))}

            <p className="text-xs text-gray-500 ml-1">
              (4)
            </p>
          </div>

          {/* Price + Cart */}
          <div className="flex items-end justify-between mt-4">

            {/* Price */}
            <p className="md:text-xl text-base font-semibold text-indigo-500">
              ${product.offerPrice}

              <span className="ml-1 text-gray-400 md:text-sm text-xs line-through font-normal">
                ${product.price}
              </span>
            </p>

            {/* Cart Button */}
            <div
              className="text-indigo-500"
              onClick={(e) => e.stopPropagation()}
            >
              {!cartItems[product._id] ? (

                <button
                  className="flex items-center justify-center gap-1 bg-indigo-50 border border-indigo-200 md:w-[80px] w-[64px] h-[34px] rounded-md text-indigo-600 font-medium transition-all duration-200 hover:bg-indigo-100"
                  onClick={() => addToCart(product._id)}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 1 1-1.167 0"
                      stroke="#615fff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  Add
                </button>

              ) : (

                <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-100 rounded-md select-none">

                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full hover:text-indigo-700"
                  >
                    -
                  </button>

                  <span className="w-5 text-center">
                    {cartItems[product._id]}
                  </span>

                  <button
                    onClick={() => addToCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full hover:text-indigo-700"
                  >
                    +
                  </button>

                </div>

              )}
            </div>

          </div>
        </div>
      </div>
    )
  );
}

export default ProductCard;