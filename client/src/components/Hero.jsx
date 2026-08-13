import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

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
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev === slides.length - 1) {
          setDirection(-1);
          return prev - 1;
        }

        if (prev === 0) {
          setDirection(1);
          return prev + 1;
        }

        return prev + direction;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [direction, slides.length]);

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

  return (
    <div className="relative overflow-hidden rounded-3xl mx-4 md:mx-8 lg:mx-12 mt-6 shadow-lg">

      {/* Slider Track */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >

        {slides.map((slide, index) => (

          <div
            key={index}
            className="min-w-full relative overflow-hidden"
          >

            {/* Desktop Image */}
            <img
              src={slide.desktop}
              alt="Freshmart banner"
              className={`w-full hidden md:block transition-transform duration-[3500ms] ease-out ${
                index === currentSlide
                  ? "scale-[1.03]"
                  : "scale-100"
              }`}
            />

            {/* Mobile Image */}
            <img
              src={slide.mobile}
              alt="Freshmart banner"
              className={`w-full md:hidden transition-transform duration-[3500ms] ease-out ${
                index === currentSlide
                  ? "scale-[1.03]"
                  : "scale-100"
              }`}
            />

            {/* Slide 1 Content */}
            {index === 0 && (
              <div
                key={`slide-1-${currentSlide}`}
                className={`absolute inset-0 flex items-center ${
                  index === currentSlide
                    ? "hero-content-active"
                    : "opacity-0"
                }`}
              >
                <div className="ml-8 md:ml-14 lg:ml-20 max-w-md">

                  <p className="text-sm md:text-base font-semibold text-green-700 mb-2">
                    WELCOME TO FRESHMART
                  </p>

                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                    Your Everyday
                    <span className="block text-green-600">
                      Online Supermarket
                    </span>
                  </h1>

                  <p className="mt-3 text-sm md:text-base lg:text-lg text-gray-600">
                    Everything you need, fresh and delivered to your doorstep.
                  </p>

                  <Link
                    to="/products"
                    className="inline-block mt-5 px-5 py-2.5 md:px-7 md:py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
                  >
                    Shop Now →
                  </Link>

                </div>
              </div>
            )}

            {/* Slide 2 Content */}
            {index === 1 && (
              <div
                key={`slide-2-${currentSlide}`}
                className={`absolute inset-0 flex items-center ${
                  index === currentSlide
                    ? "hero-content-active"
                    : "opacity-0"
                }`}
              >
                <div className="ml-8 md:ml-14 lg:ml-20 max-w-md">

                  <p className="text-sm md:text-base font-semibold text-green-700 mb-2">
                    🔥 SPECIAL OFFER
                  </p>

                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight">
                    Up to
                    <span className="block text-green-600">
                      20% OFF
                    </span>
                  </h1>

                  <p className="mt-3 text-sm md:text-base lg:text-lg text-gray-600">
                    Big savings on your everyday grocery favourites.
                  </p>

                  <Link
                    to="/products"
                    className="inline-block mt-5 px-5 py-2.5 md:px-7 md:py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
                  >
                    Shop Deals →
                  </Link>

                </div>
              </div>
            )}

          </div>

        ))}

      </div>

      {/* Navigation Arrows */}

      <button
        onClick={prevSlide}
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2
                   w-9 h-9 md:w-11 md:h-11
                   flex items-center justify-center
                   rounded-full
                   bg-white/80 backdrop-blur-sm
                   text-gray-700
                   shadow-md
                   hover:bg-white hover:scale-105
                   transition-all duration-200
                   z-10"
        aria-label="Previous slide"
      >
        ←
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2
                   w-9 h-9 md:w-11 md:h-11
                   flex items-center justify-center
                   rounded-full
                   bg-white/80 backdrop-blur-sm
                   text-gray-700
                   shadow-md
                   hover:bg-white hover:scale-105
                   transition-all duration-200
                   z-10"
        aria-label="Next slide"
      >
        →
      </button>

      {/* Slider Indicators */}

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">

        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>

        <div className="px-3 py-1 rounded-full bg-gray-700 text-white text-xs font-semibold shadow-sm">
          {currentSlide + 1}/{slides.length}
        </div>

        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>

      </div>

    </div>
  );
};

export default Hero;
