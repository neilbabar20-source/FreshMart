import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useParams, Link } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  FaArrowRight,
  FaCartShopping,
  FaCheck,
  FaStore,
  FaBolt,
  FaBan,
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

  const isOutOfStock =
    !product.inStock || product.stock <= 0;

  const discount =
    product.price > product.offerPrice
      ? Math.round(
          ((product.price - product.offerPrice) /
            product.price) *
            100
        )
      : 0;

  // Find similar available products for substitution
  const getProductKeywords = (name) => {
    const ignoredWords = [
      "fresh",
      "organic",
      "amul",
      "mother",
      "dairy",
      "taaza",
      "daily",
      "harvest",
      "green",
      "basket",
    ];

    return name
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .filter(
        (word) =>
          word.length > 2 &&
          !ignoredWords.includes(word)
      );
  };

  const productKeywords = getProductKeywords(product.name);

  const alternativeProducts = isOutOfStock
    ? products
        .filter(
          (item) =>
            item._id !== product._id &&
            item.inStock &&
            item.stock > 0 &&
            item.category === product.category
        )
        .map((item) => {
          const itemKeywords = getProductKeywords(item.name);

          const matchingKeywords = itemKeywords.filter(
            (keyword) =>
              productKeywords.includes(keyword)
          ).length;

          return {
            product: item,
            score: matchingKeywords,
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((item) => item.product)
    : [];

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
      <div className="mt-5 flex flex-col gap-6 md:mt-7 md:flex-row md:gap-8 lg:gap-10">

        {/* ================= PRODUCT IMAGES ================= */}
        <div className="flex w-full gap-2.5 md:w-1/2">

          {/* Thumbnails */}
          <div className="flex w-14 flex-col gap-2.5 sm:w-16">

            {product.image.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  setThumbnail(getImageUrl(image))
                }
                className={`group aspect-square overflow-hidden rounded-lg border bg-white p-1 transition-all duration-200 ${
                  thumbnail === getImageUrl(image)
                    ? "border-green-500 shadow-sm ring-1 ring-green-100"
                    : "border-gray-100 hover:border-green-300"
                }`}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}

          </div>

          {/* Main Image */}
          <div className="relative flex h-[260px] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 via-white to-green-50 p-3 shadow-sm sm:h-[290px] md:h-[320px] lg:h-[330px]">

            {/* Discount Badge */}
            {!isOutOfStock && discount > 0 && (
              <span className="absolute left-3 top-3 z-10 rounded-full bg-green-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">
                {discount}% OFF
              </span>
            )}

            {/* Out Of Stock Badge */}
            {isOutOfStock && (
              <span className="absolute right-3 top-3 z-10 rounded-full border border-red-200 bg-red-600 px-3 py-1.5 text-[10px] font-bold tracking-wide text-white shadow-md sm:text-xs">
                OUT OF STOCK
              </span>
            )}

            <img
              src={thumbnail}
              alt={product.name}
              className={`max-h-[235px] max-w-[90%] object-contain transition-transform duration-300 sm:max-h-[260px] md:max-h-[290px] lg:max-h-[300px] ${
                isOutOfStock
                  ? "opacity-60 grayscale-[15%]"
                  : ""
              }`}
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
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <FaStore />
              </div>

              <div>
                <p className="text-[11px] text-gray-400">
                  Sold by
                </p>

                <p className="text-sm font-semibold text-gray-800">
                  {product.sellerId.storeName ||
                    product.sellerId.name}
                </p>

                {product.sellerId.storeName &&
                  product.sellerId.name && (
                    <p className="mt-0.5 text-[11px] text-gray-400">
                      Seller: {product.sellerId.name}
                    </p>
                  )}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="mt-3 flex items-center gap-1">
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
          <div
            className={`mt-4 rounded-xl border p-3.5 ${
              isOutOfStock
                ? "border-gray-200 bg-gray-50"
                : "border-green-100 bg-green-50/60"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2.5">

              <span
                className={`text-2xl font-semibold ${
                  isOutOfStock
                    ? "text-gray-600"
                    : "text-green-700"
                }`}
              >
                ₹{product.offerPrice}
              </span>

              {product.price > product.offerPrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.price}
                  </span>

                  {!isOutOfStock && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                      {discount}% OFF
                    </span>
                  )}
                </>
              )}

            </div>

            <p className="mt-1 text-[11px] text-gray-500">
              Inclusive of all taxes
            </p>
          </div>

          {/* Stock Status */}
          <div className="mt-3 flex items-center gap-2 text-sm">

            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full ${
                isOutOfStock
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {isOutOfStock ? (
                <FaBan className="text-[10px]" />
              ) : (
                <FaCheck className="text-[10px]" />
              )}
            </span>

            <span
              className={`font-semibold ${
                isOutOfStock
                  ? "text-red-600"
                  : "text-green-700"
              }`}
            >
              {isOutOfStock
                ? "Currently unavailable"
                : "In stock & available"}
            </span>

          </div>

          {/* Description */}
          <div className="mt-5">

            <h2 className="text-base font-semibold text-gray-900">
              About Product
            </h2>

            <ul className="mt-2.5 space-y-1.5">

              {product.description.map((desc, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm leading-5 text-gray-500"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />

                  <span>{desc}</span>
                </li>
              ))}

            </ul>

          </div>

          {/* ================= PURCHASE BUTTONS ================= */}
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">

            <button
              disabled={isOutOfStock}
              onClick={() => {
                if (!isOutOfStock) {
                  addToCart(product._id);
                }
              }}
              className={`group flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold shadow-sm transition-all duration-200 ${
                isOutOfStock
                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                  : "cursor-pointer border-green-200 bg-white text-green-700 hover:border-green-500 hover:bg-green-50"
              }`}
            >
              {isOutOfStock ? (
                <>
                  <FaBan className="text-sm" />
                  Out of Stock
                </>
              ) : (
                <>
                  <FaCartShopping className="text-sm" />
                  Add to Cart
                </>
              )}
            </button>

            <button
              disabled={isOutOfStock}
              onClick={() => {
                if (!isOutOfStock) {
                  addToCart(product._id);
                  navigate("/cart");
                  scrollTo(0, 0);
                }
              }}
              className={`group flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold shadow-sm transition-all duration-200 ${
                isOutOfStock
                  ? "cursor-not-allowed bg-gray-200 text-gray-400"
                  : "cursor-pointer bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isOutOfStock ? (
                <>
                  <FaBan className="text-sm" />
                  Currently Unavailable
                </>
              ) : (
                <>
                  <FaBolt className="text-xs" />
                  Buy Now
                  <FaArrowRight className="text-[10px]" />
                </>
              )}
            </button>

          </div>

          {/* ================= AVAILABLE ALTERNATIVES ================= */}
          {isOutOfStock &&
            alternativeProducts.length > 0 && (
              <div className="mt-6 rounded-xl border border-orange-100 bg-orange-50/60 p-3.5">

                <div className="flex items-start gap-3">

                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <FaArrowRight className="text-xs" />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      Looking for an alternative?
                    </h2>

                    <p className="mt-1 text-[11px] leading-4.5 text-gray-500">
                      This product is currently unavailable.
                      Try these available options instead.
                    </p>
                  </div>

                </div>

                <div className="mt-3 space-y-2">

                  {alternativeProducts.map(
                    (alternative) => (
                      <div
                        key={alternative._id}
                        onClick={() => {
                          navigate(
                            `/product/${alternative.category.toLowerCase()}/${alternative._id}`
                          );
                          scrollTo(0, 0);
                        }}
                        className="group flex cursor-pointer items-center gap-3 rounded-lg border border-white bg-white p-2.5 shadow-sm transition hover:border-green-200 hover:shadow-md"
                      >

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-50 p-1">
                          <img
                            src={getImageUrl(
                              alternative.image?.[0]
                            )}
                            alt={alternative.name}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-xs font-semibold text-gray-800">
                            {alternative.name}
                          </p>

                          <p className="mt-0.5 truncate text-[10px] text-gray-400">
                            Sold by{" "}
                            {alternative.sellerId
                              ?.storeName ||
                              alternative.sellerId
                                ?.name ||
                              "Seller"}
                          </p>

                          <p className="mt-1 text-sm font-bold text-green-600">
                            ₹{alternative.offerPrice}
                          </p>

                        </div>

                        <FaArrowRight className="shrink-0 text-[10px] text-gray-300 group-hover:text-green-500" />

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          {/* Bottom Benefits */}
          <div className="mt-4 grid grid-cols-2 gap-2">

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2.5">
              <p className="text-xs font-semibold text-gray-700">
                Fresh Products
              </p>

              <p className="mt-0.5 text-[10px] text-gray-400">
                Quality guaranteed
              </p>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2.5">
              <p className="text-xs font-semibold text-gray-700">
                Fast Delivery
              </p>

              <p className="mt-0.5 text-[10px] text-gray-400">
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