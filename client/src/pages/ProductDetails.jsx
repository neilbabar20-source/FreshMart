import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useParams, Link } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCartShopping,
  FaCheck,
  FaStore,
  FaBolt,
} from "react-icons/fa6";

const ProductDetails = () => {
  const { products, navigate, addToCart } = useContext(AppContext);
  const { id } = useParams();

  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((product) => product._id === id);

  // Support both old backend images and new Cloudinary images
  const getImageUrl = (image) => {
    if (!image) return "";

    return image.startsWith("http")
      ? image
      : `${import.meta.env.VITE_BACKEND_URL}/images/${image}`;
  };

  useEffect(() => {
    if (product?.image?.[0]) {
      setThumbnail(getImageUrl(product.image[0]));
    } else {
      setThumbnail(null);
    }
  }, [product]);

  if (!product) return null;

  const discount =
    product.price > product.offerPrice
      ? Math.round(
          ((product.price - product.offerPrice) / product.price) * 100
        )
      : 0;

  return (
    <div className="mt-5 pb-10 md:mt-7">

      {/* ================= BREADCRUMB ================= */}
      <div className="flex flex-wrap items-center gap-1 text-xs text-gray-400 md:text-sm">
        <Link
          to="/"
          className="transition-colors hover:text-green-600"
        >
          Home
        </Link>

        <FaArrowRight className="text-[9px]" />

        <Link
          to="/products"
          className="transition-colors hover:text-green-600"
        >
          Products
        </Link>

        <FaArrowRight className="text-[9px]" />

        <Link
          to={`/products/${product.category.toLowerCase()}`}
          className="transition-colors hover:text-green-600"
        >
          {product.category}
        </Link>

        <FaArrowRight className="text-[9px]" />

        <span className="font-medium text-green-600">
          {product.name}
        </span>
      </div>

      {/* ================= MAIN PRODUCT SECTION ================= */}
      <div className="mt-5 flex flex-col gap-8 md:mt-8 md:flex-row md:gap-12 lg:gap-16">

        {/* ================= PRODUCT IMAGES ================= */}
        <div className="flex w-full gap-3 md:w-1/2">

          {/* Thumbnails */}
          <div className="flex w-16 flex-col gap-3 sm:w-20">
            {product.image.map((image, index) => (
              <button
                key={index}
                onClick={() => setThumbnail(getImageUrl(image))}
                className={`group aspect-square overflow-hidden rounded-xl border bg-white p-1.5 transition-all duration-300 ${
                  thumbnail === getImageUrl(image)
                    ? "border-green-500 shadow-sm ring-1 ring-green-100"
                    : "border-gray-100 hover:border-green-300"
                }`}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="group relative flex min-h-[300px] flex-1 items-center justify-center overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-gray-50 via-white to-green-50 p-5 shadow-sm sm:min-h-[400px] md:min-h-[430px]">

            {/* Discount Badge */}
            {discount > 0 && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                {discount}% OFF
              </span>
            )}

            <img
              src={thumbnail}
              alt={product.name}
              className="h-full max-h-[420px] w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* ================= PRODUCT INFORMATION ================= */}
        <div className="w-full md:w-1/2">

          {/* Category */}
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
            {product.category}
          </p>

          {/* Product Name */}
          <h1 className="mt-2 text-2xl font-semibold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
            {product.name}
          </h1>

          {/* Seller Information */}
          {product.sellerId && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <FaStore />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Sold by
                </p>

                <p className="text-sm font-semibold text-gray-800">
                  {product.sellerId.storeName ||
                    product.sellerId.name}
                </p>

                {product.sellerId.storeName &&
                  product.sellerId.name && (
                    <p className="mt-0.5 text-xs text-gray-400">
                      Seller: {product.sellerId.name}
                    </p>
                  )}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="mt-4 flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    src={
                      i < 4
                        ? assets.star_icon
                        : assets.star_dull_icon
                    }
                    alt="star"
                    key={i}
                    className="h-4 w-4"
                  />
                ))}
            </div>

            <span className="ml-1 text-sm font-medium text-gray-700">
              4.0
            </span>

            <span className="text-sm text-gray-400">
              (4 reviews)
            </span>
          </div>

          {/* Price Section */}
          <div className="mt-6 rounded-2xl border border-green-100 bg-green-50/60 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-semibold text-green-700">
                ₹{product.offerPrice}
              </span>

              {product.price > product.offerPrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.price}
                  </span>

                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Inclusive of all taxes
            </p>
          </div>

          {/* Stock */}
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
              <FaCheck className="text-[10px]" />
            </span>

            <span className="font-medium text-green-700">
              {product.inStock
                ? "In stock & available"
                : "Currently unavailable"}
            </span>
          </div>

          {/* Description */}
          <div className="mt-7">
            <h2 className="text-base font-semibold text-gray-900">
              About Product
            </h2>

            <ul className="mt-3 space-y-2">
              {product.description.map((desc, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm leading-6 text-gray-500"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <button
              onClick={() => addToCart(product._id)}
              className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-green-200 bg-white py-3.5 font-semibold text-green-700 shadow-sm transition-all duration-300 hover:border-green-500 hover:bg-green-50 hover:shadow-md"
            >
              <FaCartShopping className="transition-transform duration-300 group-hover:scale-110" />
              Add to Cart
            </button>

            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
                scrollTo(0, 0);
              }}
              className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-green-700 hover:shadow-md"
            >
              <FaBolt className="text-sm" />
              Buy Now
              <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </button>

          </div>

          {/* Bottom Benefits */}
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-700">
                Fresh Products
              </p>
              <p className="mt-0.5 text-[11px] text-gray-400">
                Quality guaranteed
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-700">
                Fast Delivery
              </p>
              <p className="mt-0.5 text-[11px] text-gray-400">
                Delivered to your door
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;