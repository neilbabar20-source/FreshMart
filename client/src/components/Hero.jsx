import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";

const Hero = () => {
  const slides = [
    {
      desktop: assets.hero1Desktop,
      mobile: assets.hero1Mobile,
    },
    {
      desktop: assets.hero2Desktop,
      mobile: assets.hero2Mobile,
    },
    {
      desktop: assets.hero3Desktop,
      mobile: assets.hero3Mobile,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Mobile swipe states
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Auto Slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  // ==============================
  // Mobile Swipe
  // ==============================

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    }

    if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  return (
    <div
      className="
        relative
        mx-3
        mt-4
        overflow-hidden
        rounded-2xl
        md:mx-6
        lg:mx-7
        md:rounded-3xl
        shadow-md
        hover:shadow-lg
        transition-shadow
        duration-500
      "
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ==============================
          Slider Track
      ============================== */}

      <div
        className="
          flex
          transition-transform
          duration-700
          ease-in-out
        "
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="
              relative
              min-w-full
              overflow-hidden
            "
          >
            {/* Desktop Image */}
            <img
              src={slide.desktop}
              alt="FreshMart banner"
              className={`
                hidden
                w-full
                md:block
                transition-transform
                duration-[3500ms]
                ease-out
                ${
                  index === currentSlide
                    ? "scale-[1.025]"
                    : "scale-100"
                }
              `}
            />

            {/* Mobile Image */}
            <img
              src={slide.mobile}
              alt="FreshMart banner"
              className="
                block
                w-full
                md:hidden
              "
            />

            {/* ==============================
                Mobile CTA - Slide 1
            ============================== */}

            {index === 0 && (
              <div
                className="
                  absolute
                  bottom-11
                  left-1/2
                  -translate-x-1/2
                  md:hidden
                "
              >
                <Link
                  to="/products"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-1.5
                    rounded-full
                    bg-green-600
                    px-6
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    transition-all
                    duration-200
                    hover:bg-green-700
                    active:scale-95
                  "
                >
                  Shop Now
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            )}

            {/* ==============================
                Mobile CTA - Slide 2
            ============================== */}

            {index === 1 && (
              <div
                className="
                  absolute
                  bottom-11
                  left-1/2
                  -translate-x-1/2
                  md:hidden
                "
              >
                <Link
                  to="/products"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-1.5
                    rounded-full
                    bg-green-600
                    px-6
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    transition-all
                    duration-200
                    hover:bg-green-700
                    active:scale-95
                  "
                >
                  Explore Deals
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            )}

            {/* ==============================
                Desktop Slide 1 Content
            ============================== */}

            {index === 0 && (
              <div
                className={`
                  absolute
                  inset-0
                  hidden
                  items-center
                  md:flex
                  ${
                    index === currentSlide
                      ? "hero-content-active"
                      : "opacity-0"
                  }
                `}
              >
                <div className="ml-8 max-w-md lg:ml-20 lg:max-w-lg">
                  <p className="mb-2 text-sm font-semibold tracking-wide text-green-700 lg:text-base">
                    WELCOME TO FRESHMART
                  </p>

                  <h1 className="text-3xl font-bold leading-tight text-gray-800 md:text-4xl lg:text-5xl">
                    Your Everyday
                    <span className="block text-green-600">
                      Online Supermarket
                    </span>
                  </h1>

                  <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-600 md:text-base lg:text-lg">
                    Everything you need, fresh and delivered to your
                    doorstep.
                  </p>

                  <Link
                    to="/products"
                    className="
                      mt-5
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-green-600
                      px-6
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      shadow-md
                      transition-all
                      duration-200
                      hover:bg-green-700
                      hover:shadow-lg
                      active:scale-95
                      md:px-7
                      md:py-3
                    "
                  >
                    Shop Now
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>
            )}

            {/* ==============================
                Desktop Slide 2 Content
            ============================== */}

            {index === 1 && (
              <div
                className={`
                  absolute
                  inset-0
                  hidden
                  items-center
                  md:flex
                  ${
                    index === currentSlide
                      ? "hero-content-active"
                      : "opacity-0"
                  }
                `}
              >
                <div className="ml-8 max-w-md lg:ml-20 lg:max-w-lg">
                  <p className="mb-2 text-sm font-semibold tracking-wide text-green-700 lg:text-base">
                    🔥 SPECIAL OFFER
                  </p>

                  <h1 className="text-4xl font-extrabold leading-tight text-gray-800 md:text-5xl lg:text-6xl">
                    Up to
                    <span className="block text-green-600">
                      20% OFF
                    </span>
                  </h1>

                  <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-600 md:text-base lg:text-lg">
                    Big savings on your everyday grocery favourites.
                  </p>

                  <Link
                    to="/products"
                    className="
                      mt-5
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-green-600
                      px-6
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      shadow-md
                      transition-all
                      duration-200
                      hover:bg-green-700
                      hover:shadow-lg
                      active:scale-95
                      md:px-7
                      md:py-3
                    "
                  >
                    Shop Deals
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ==============================
          Desktop Navigation Arrows
      ============================== */}

      <button
        onClick={prevSlide}
        className="
          absolute
          left-4
          top-1/2
          hidden
          h-10
          w-10
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-white/60
          bg-white/80
          text-gray-700
          shadow-md
          backdrop-blur-md
          transition-all
          duration-200
          hover:scale-105
          hover:bg-white
          active:scale-95
          md:flex
          lg:left-5
          lg:h-11
          lg:w-11
          z-10
        "
        aria-label="Previous slide"
      >
        <FaChevronLeft className="text-xs lg:text-sm" />
      </button>

      <button
        onClick={nextSlide}
        className="
          absolute
          right-4
          top-1/2
          hidden
          h-10
          w-10
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-white/60
          bg-white/80
          text-gray-700
          shadow-md
          backdrop-blur-md
          transition-all
          duration-200
          hover:scale-105
          hover:bg-white
          active:scale-95
          md:flex
          lg:right-5
          lg:h-11
          lg:w-11
          z-10
        "
        aria-label="Next slide"
      >
        <FaChevronRight className="text-xs lg:text-sm" />
      </button>

      {/* ==============================
          Mobile Dots
      ============================== */}

      <div
        className="
          absolute
          bottom-3
          left-1/2
          z-10
          flex
          -translate-x-1/2
          items-center
          gap-1.5
          md:hidden
        "
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`
              h-1.5
              rounded-full
              transition-all
              duration-300
              ${
                currentSlide === index
                  ? "w-6 bg-green-600"
                  : "w-1.5 bg-white/90"
              }
            `}
          />
        ))}
      </div>

      {/* ==============================
          Desktop Indicator
      ============================== */}

      <div
        className="
          absolute
          bottom-3
          left-1/2
          hidden
          -translate-x-1/2
          items-center
          gap-2
          rounded-full
          border
          border-white/40
          bg-black/25
          px-3
          py-1
          text-xs
          font-semibold
          text-white
          shadow-sm
          backdrop-blur-md
          md:flex
          z-10
        "
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white/70"></span>

        <span>
          {currentSlide + 1} / {slides.length}
        </span>

        <span className="h-1.5 w-1.5 rounded-full bg-white/70"></span>
      </div>
    </div>
  );
};

export default Hero;