import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import {
  FaCartShopping,
  FaMinus,
  FaPlus,
  FaBan,
} from "react-icons/fa6";

const ProductCard = ({ product }) => {
  const context = useContext(AppContext);

  const {
    navigate,
    addToCart,
    removeFromCart,
    cartItems,
  } = context;

  const isOutOfStock =
    product && (!product.inStock || product.stock <= 0);

  return (
    product && (
      <div
        onClick={() => {
          sessionStorage.setItem("productClick", "true");

          navigate(
            `/product/${product.category.toLowerCase()}/${product._id}`
          );

          scrollTo(0, 0);
        }}
        className="
          group
          relative
          w-full
          min-w-0
          md:min-w-56
          md:max-w-56
          overflow-hidden
          rounded-2xl
          border
          border-gray-100
          bg-white
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-lg
          hover:border-green-100
          cursor-pointer
        "
      >
        {/* Product Image Area */}
        <div
          className="
            relative
            flex
            h-32
            md:h-40
            items-center
            justify-center
            overflow-hidden
            bg-gradient-to-br
            from-gray-50
            to-green-50/40
            px-3
            py-3
          "
        >
          {/* Discount Badge */}
          {!isOutOfStock && product.price > product.offerPrice && (
            <span
              className="
                absolute
                left-2
                top-2
                z-10
                rounded-full
                bg-green-600
                px-2
                py-1
                text-[9px]
                md:text-[10px]
                font-semibold
                text-white
                shadow-sm
              "
            >
              {Math.round(
                ((product.price - product.offerPrice) / product.price) * 100
              )}
              % OFF
            </span>
          )}

          {/* Out Of Stock Badge */}
          {isOutOfStock && (
            <span
              className="
                absolute
                right-2
                top-2
                z-10
                rounded-full
                border
                border-red-200
                bg-red-600
                px-2
                py-1
                text-[9px]
                md:text-[10px]
                font-bold
                tracking-wide
                text-white
                shadow-md
              "
            >
              OUT OF STOCK
            </span>
          )}

          <img
            src={
              product.image?.[0]?.startsWith("http")
                ? product.image[0]
                : `${import.meta.env.VITE_BACKEND_URL}/images/${product.image?.[0]}`
            }
            alt={product.name}
            className={`
              h-[88%]
              w-[88%]
              object-contain
              transition-transform
              duration-500
              group-hover:scale-110
              ${isOutOfStock ? "opacity-60 grayscale-[20%]" : ""}
            `}
          />
        </div>

        {/* Product Information */}
        <div className="px-3 pb-3 pt-3 md:px-4 md:pb-4">

          {/* Category */}
          <p className="text-[10px] md:text-xs font-medium uppercase tracking-wide text-gray-400">
            {product.category}
          </p>

          {/* Product Name */}
          <p
            className="
              mt-1
              truncate
              text-sm
              md:text-base
              font-semibold
              text-gray-800
            "
          >
            {product.name}
          </p>

          {/* Rating */}
          <div className="mt-1.5 flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    key={i}
                    src={
                      i < 4
                        ? assets.star_icon
                        : assets.star_dull_icon
                    }
                    alt="rating"
                    className="h-2.5 w-2.5 md:h-3 md:w-3"
                  />
                ))}
            </div>

            <span className="text-[10px] md:text-xs text-gray-400">
              (4)
            </span>
          </div>

          {/* Price + Cart */}
          <div className="mt-3 flex items-center justify-between gap-2">

            {/* Price */}
            <div className="min-w-0">
              <p
                className={`whitespace-nowrap text-sm md:text-lg font-bold ${
                  isOutOfStock
                    ? "text-gray-500"
                    : "text-green-600"
                }`}
              >
                ₹{product.offerPrice}

                <span className="ml-1 text-[9px] md:text-xs font-normal text-gray-400 line-through">
                  ₹{product.price}
                </span>
              </p>
            </div>

            {/* Cart Controls */}
            <div
              className="flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {isOutOfStock ? (
                /* Out Of Stock Button */
                <button
                  disabled
                  className="
                    flex
                    h-8
                    w-[82px]
                    md:h-9
                    md:w-[92px]
                    cursor-not-allowed
                    items-center
                    justify-center
                    gap-1.5
                    rounded-lg
                    border
                    border-red-200
                    bg-red-50
                    text-[9px]
                    md:text-xs
                    font-bold
                    text-red-500
                  "
                >
                  <FaBan className="text-[10px] md:text-xs" />
                  Out of Stock
                </button>
              ) : !cartItems?.[product._id] ? (
                <button
                  onClick={() => addToCart(product._id)}
                  className="
                    flex
                    h-8
                    w-[58px]
                    md:h-9
                    md:w-[78px]
                    items-center
                    justify-center
                    gap-1.5
                    rounded-lg
                    border
                    border-green-200
                    bg-green-50
                    text-[10px]
                    md:text-sm
                    font-semibold
                    text-green-700
                    transition-all
                    duration-200
                    hover:border-green-300
                    hover:bg-green-100
                    active:scale-95
                  "
                >
                  <FaCartShopping className="text-[11px] md:text-sm" />
                  Add
                </button>
              ) : (
                <div
                  className="
                    flex
                    h-8
                    w-[68px]
                    md:h-9
                    md:w-[82px]
                    items-center
                    justify-between
                    rounded-lg
                    bg-green-50
                    border
                    border-green-200
                    px-1
                    text-green-700
                  "
                >
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-md
                      transition
                      hover:bg-green-100
                      active:scale-90
                    "
                  >
                    <FaMinus className="text-[9px] md:text-[10px]" />
                  </button>

                  <span className="w-4 text-center text-xs md:text-sm font-semibold">
                    {cartItems[product._id]}
                  </span>

                  <button
                    onClick={() => addToCart(product._id)}
                    className="
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-md
                      transition
                      hover:bg-green-100
                      active:scale-90
                    "
                  >
                    <FaPlus className="text-[9px] md:text-[10px]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;